# kuro-hanpen

## install

```sh
$ npm install
```

S3バケットとアクセスキーで設定ファイル作成
アクセスキーは[IAM](https://console.aws.amazon.com/iam/home)で
```sh
$ vi aws.json
```
```javascript
{
  "key": "Access Key Id",
  "secret": "Secret Access Key",
  "bucket": "bucket.name",
  "region": "ap-northeast-1"
}
```

## S3 publish

dist 配下のファイルを全てS3にアップロード
```sh
$ gulp upload
```
or
```sh
$ npm run upload
```
