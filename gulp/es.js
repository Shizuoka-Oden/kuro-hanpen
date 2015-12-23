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
 */

'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var through = require('through2');
var conf = require('./conf');
var awsConf = {};

// AWS 接続情報の設定
// AWS 接続情報設定ファイル(優先)、または環境変数から読み取る
try {
  awsConf = JSON.parse(fs.readFileSync('./aws.json'));
} catch(e) {
  if(e.code !== 'ENOENT') throw e;
  awsConf.es = {
    endpoint:  process.env.AWS_ES_ENDPOINT,
    index: process.env.AWS_ES_INDEX,
    region: process.env.AWS_ES_REGION
  };
}
var creds = new AWS.EnvironmentCredentials('AWS');
if(awsConf.key && awsConf.secret) {
  creds = new AWS.Credentials();
  creds.accessKeyId = awsConf.key;
  creds.secretAccessKey = awsConf.secret;
}

// gulp task
gulp.task('es:init', () => {
  return deleteIndex()
    .then(createIndex);
});

gulp.task('es:regist', ['es:init'], () => {
  gulp.src([path.join(conf.paths.data, '*.json'), '!' + path.join(conf.paths.data, 'mapping.json')])
    .pipe(uploadDocument());
});

// function
function deleteIndex() {
  return new EsRequest().method('DELETE')
    .path(path.join('/', awsConf.es.index))
    .send();
}

function createIndex() {
  return new EsRequest().method('PUT')
    .path(path.join('/', awsConf.es.index))
    .body(fs.readFileSync('./data/mapping.json'))
    .send();
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
        console.log(err);
        callback(err, file);
      });
  });
}

function bulk(filePath) {
  var type = path.basename(filePath, '.json');
  var data = JSON.parse(fs.readFileSync(filePath));
  var result = '';
  var id = 1;

  for(var i = 0 ; i < data.length ; i++ ) {
    data[i].type = type;
    data[i].preset = true;
    result += '{ "index" : { "_index" : "' + awsConf.es.index + '", "_type" : "location"} }\n';
    result += JSON.stringify(data[i]) + '\n';
  };

  return result;
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
      var endpoint = new AWS.Endpoint(awsConf.es.endpoint);
      var req = new AWS.HttpRequest(endpoint);
      req.region = awsConf.es.region;
      req.headers['Host'] = endpoint.host;
      req.method = this._method;
      req.path = this._path;
      req.body = this._body;

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
