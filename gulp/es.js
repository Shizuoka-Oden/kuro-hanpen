'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var AWS = require('aws-sdk');
var through = require('through2');

// var es = require('elasticsearch');
// var AwsEsConnector = require('http-aws-es');
// var client = es.Client({
//   hosts: 'xxx.ap-northeast-1.es.amazonaws.com',
//   connectionClass: AwsEsConnector,
//   amazonES: {
//     region: 'ap-northeast-1',
//     accessKey: 'AKID',
//     secretKey: 'secret'
//   }
// });

// TODO 設定の外出し
var esDomain = {
  endpoint: 'xxx.ap-northeast-1.es.amazonaws.com',
  region: 'ap-northeast-1',
  index: 'test',
  doctype: 'testType'
};
var endpoint =  new AWS.Endpoint(esDomain.endpoint);
var creds = new AWS.EnvironmentCredentials('AWS');

function uploadDocumentToES() {

  // elasticsearch client を require すると他の task 定義と競合して(?)
  // TypeError: Cannot redefine property: Symbol(Symbol.iterator)
  // となってしまうため、独自にリクエスト作成
  return through.obj((file, enc, callback) => {

    if(file.isNull()) {
      callback(null, file);
      return;
    }
    if (file.isStream()) {
      callback(new Error('Streaming not supported'));
      return;
    }

    // TODO インデックス存在したら消すとかしたい
    // TODO mapping 定義
    // TODO JSONって配列形式？

    var filePath = file;
    if('object' === typeof filePath) {
      filePath = filePath.path;
    }
    var req = new AWS.HttpRequest(endpoint);
    req.method = 'POST';
    req.path = path.join('/', esDomain.index, esDomain.doctype);
    req.region = esDomain.region;
    req.body = fs.readFileSync(filePath);
    req.headers['presigned-expires'] = false;
    req.headers['Host'] = endpoint.host;

    // TODO AWS のアクセス制御対応
    // Sign the request (Sigv4)
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

  });
}

gulp.task('regist', function () {
  // TODO data ディレクトリの設定外出し
  gulp.src('data/*.json')
    .pipe(uploadDocumentToES());
});

// gulp.task('build', ['html', 'fonts', 'other']);
