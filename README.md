# kuro-hanpen

## install

```sh
$ npm install
```

AWS 関連のアクセス情報設定ファイル作成
アクセスキーは[IAM](https://console.aws.amazon.com/iam/home)で
```sh
$ cp aws.json.sample aws.json && vi $_
```
## Gulp Tasks
| task    | description
|---------|---|
| default | ビルドを行い、distに実行モジュールをコピーする |
| serve   | ローカル実行(distにはコピーしない) |
| upload  | dist配下のファイルを全てS3へアップロード |
| es:regist | data配下のファイルを全てESへアップロード |

