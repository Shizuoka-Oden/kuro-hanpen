'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var through = require('through2');

// elasticsearch client を require すると他の task 定義と競合して(?)
// TypeError: Cannot redefine property: Symbol(Symbol.iterator)
// となってしまうため、独自にリクエストを作成

// TODO 設定の外出し
var esDomain = {
  endpoint: 'xxx.ap-northeast-1.es.amazonaws.com',
  region: 'ap-northeast-1',
  index: 'test'
};
var endpoint =  new AWS.Endpoint(esDomain.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');

function handleRequest(req, file, callback) {

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
      console.log(body);
      callback(null, file);
    });
  }, (err) => {
    console.log('Error: ' + err);
    callback(err, file);
  });
}

function deleteIndex() {
  return through.obj((file, enc, callback) => {
    var req = new AWS.HttpRequest(endpoint);
    req.method = 'DELETE';
    req.path = path.join('/', esDomain.index);
    req.region = esDomain.region;
    req.headers['Host'] = endpoint.host;

    handleRequest(req, file, callback);
  });
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

    var req = new AWS.HttpRequest(endpoint);
    req.method = 'PUT';
    req.path = path.join('/', esDomain.index);
    req.region = esDomain.region;
    req.headers['Host'] = endpoint.host;
    req.body = '{mappings: {' + type + ': {properties: {location: {type: "geo_point"}}}}}';

    handleRequest(req, file, callback);
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

    // TODO JSONって配列形式？
    var filePath = file;
    if('object' === typeof filePath) {
      filePath = filePath.path;
    }
    var type = path.basename(filePath, '.json');
    var req = new AWS.HttpRequest(endpoint);
    req.method = 'POST';
    req.path = path.join('/', esDomain.index, type);
    req.region = esDomain.region;
    req.body = fs.readFileSync(filePath);
    req.headers['Host'] = endpoint.host;

    handleRequest(req, file, callback);
  });
}

gulp.task('regist', function () {
  // TODO data ディレクトリの設定外出し
  gulp.src('data/*.json')
    .pipe(deleteIndex())
    .pipe(putMapping())
    .pipe(uploadDocument());
});
