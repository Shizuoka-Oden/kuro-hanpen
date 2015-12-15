'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var through = require('through2');

// TODO 設定の外出し
var esDomain = {
  endpoint: 'xxx.ap-northeast-1.es.amazonaws.com',
  region: 'ap-northeast-1',
  index: 'test'
};
var endpoint =  new AWS.Endpoint(esDomain.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');

gulp.task('es:init', () => {
  return deleteIndex()
    .then(createIndex);
});

gulp.task('es:regist', ['es:init'], () => {
  // TODO data ディレクトリの設定外出し
  gulp.src('data/*.json')
    .pipe(putMapping())
    .pipe(uploadDocument());
});

function deleteIndex() {
  return new EsRequest().method('DELETE')
    .path(path.join('/', esDomain.index))
    .send();
}

function createIndex() {
  return new EsRequest().method('PUT')
    .path(path.join('/', esDomain.index))
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
      .path(path.join('/', esDomain.index, '_mapping', type))
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
      .path(path.join('/', esDomain.index, '_bulk'))
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
    body += '{ "index" : { "_index" : "' + esDomain.index + '", "_type" : "' + type + '", "_id" : "' + id++ + '" } }\n';
    body += JSON.stringify(data) + '\n';
  } else {
    for(var i = 0 ; i < data.length ; i++ ) {
      body += '{ "index" : { "_index" : "' + esDomain.index + '", "_type" : "' + type + '", "_id" : "' + id++ + '" } }\n';
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
      req.region = esDomain.region;
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
          if(JSON.parse(body).errors) {
            console.error(body);
            onRejected(body);
          }
          onFulfilled(file);
        });
      }, (err) => {
        console.error(err);
        onRejected(err);
      });
    });
  }
}
