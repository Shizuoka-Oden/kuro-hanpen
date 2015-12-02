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

## Gulp Tasks
| task    | description
|---------|---|
| default | ビルドを行い、distに実行モジュールをコピーする |
| serve   | ローカル実行(distにはコピーしない) |
| upload  | dist配下のファイルを全てS3へアップロード |

