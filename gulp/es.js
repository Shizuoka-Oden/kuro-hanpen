/*
 * ES 関連のタスク.
 *   es:init    ES Indexを削除後、空の Index を作成する
 *   es:regist  ES Index 再作成後、data 配下のファイルを登録する
 * data 配下の構造
 *   data/{type名}.json
 * json ファイルの構造
 *   [{
 *     "{key}": "{value}",
 *     "location": {
 *       "lat": {double 型},
 *       "lon": {double 型}
 *      }
 *   }]
 *   ※現状、"location" プロパティ以外はマッピング定義していない.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var through = require('through2');
var conf = require('./conf');

var awsConf = JSON.parse(fs.readFileSync('./aws.json'));
var endpoint =  new AWS.Endpoint(awsConf.es.endpoint);

// 環境変数から AWS 接続情報を読み込む
var creds = new AWS.EnvironmentCredentials('AWS');
if(awsConf.key && awsConf.secret) {
  // aws.json に AWS 接続情報が存在する場合はそちらを優先する
  creds = new AWS.Credentials();
  creds.accessKeyId = awsConf.key;
  creds.secretAccessKey = awsConf.secret;
}

gulp.task('es:init', () => {
  return deleteIndex()
    .then(createIndex);
});

gulp.task('es:regist', ['es:init'], () => {
  gulp.src(path.join(conf.paths.data, '*.json'))
    .pipe(putMapping())
    .pipe(uploadDocument());
});

function deleteIndex() {
  return new EsRequest().method('DELETE')
    .path(path.join('/', awsConf.es.index))
    .send();
}

function createIndex() {
  return new EsRequest().method('PUT')
    .path(path.join('/', awsConf.es.index))
    .send();
}

function putMapping() {
  return through.obj((file, enc, callback) => {
    if(file.isNull()) {
      callback(null, file);
      return;
    }
    if (file.isStream()) {
      callback(new Error('Streaming not supported'));
      return;
    }
    var filePath = file;
    if('object' === typeof filePath) {
      filePath = filePath.path;
    }
    var type = path.basename(filePath, '.json');

    new EsRequest().method('PUT')
      .path(path.join('/', awsConf.es.index, '_mapping', type))
      .body('{properties: {location: {type: "geo_point"}}}')
      .send(file)
      .then((file) => {
        callback(null, file);
      })
      .catch((err) => {
        callback(err, file);
      });
  });
}

function uploadDocument() {
  return through.obj((file, enc, callback) => {
    if(file.isNull()) {
      callback(null, file);
      return;
    }
    if (file.isStream()) {
      callback(new Error('Streaming not supported'));
      return;
    }

    var filePath = file;
    if('object' === typeof filePath) {
      filePath = filePath.path;
    }
    new EsRequest().method('POST')
      .path(path.join('/', awsConf.es.index, '_bulk'))
      .body(bulk(filePath))
      .send(file)
      .then((file) => {
        callback(null, file);
      })
      .catch((err) => {
        callback(err, file);
      });
  });
}

function bulk(filePath) {
  var type = path.basename(filePath, '.json');
  var data = JSON.parse(fs.readFileSync(filePath));
  var body = '';
  var id = 1;
  if(!Array.isArray(data)) {
    body += '{ "index" : { "_index" : "' + awsConf.es.index + '", "_type" : "' + type + '", "_id" : "' + id++ + '" } }\n';
    body += JSON.stringify(data) + '\n';
  } else {
    for(var i = 0 ; i < data.length ; i++ ) {
      body += '{ "index" : { "_index" : "' + awsConf.es.index + '", "_type" : "' + type + '", "_id" : "' + id++ + '" } }\n';
      body += JSON.stringify(data[i]) + '\n';
    };
  }

  return body;
}

// elasticsearch client を require すると他の task 定義と競合して(?)
// TypeError: Cannot redefine property: Symbol(Symbol.iterator)
// となってしまうため、独自にリクエストを作成
class EsRequest {
  method(method) {
    this._method = method;
    return this;
  }
  path(urlPath) {
    this._path = urlPath;
    return this;
  }
  body(body){
    this._body = body;
    return this;
  }
  send(file) {
    return new Promise((onFulfilled, onRejected) => {
      var req = new AWS.HttpRequest(endpoint);
      req.region = awsConf.es.region;
      req.headers['Host'] = endpoint.host;
      req.method = this._method;
      req.path = this._path;
      req.body = this._body;

      // 環境変数の AWS アクセス情報を使用してアクセス
      var signer = new AWS.Signers.V4(req, 'es');
      signer.addAuthorization(creds, new Date());

      var send = new AWS.NodeHttpClient();
      send.handleRequest(req, null, (httpResp) => {
        var body = '';
        httpResp.on('data', (chunk) => {
          body += chunk;
        });
        httpResp.on('end', (chunk) => {
          if(JSON.parse(body).errors || JSON.parse(body).message) {
            onRejected(body);
          }
          onFulfilled(file);
        });
      }, (err) => {
        onRejected(err);
      });
    });
  }
}
