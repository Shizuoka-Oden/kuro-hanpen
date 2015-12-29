# kuro-hanpen

[![Circle CI](https://circleci.com/gh/Shizuoka-Oden/kuro-hanpen.svg?style=svg)](https://circleci.com/gh/Shizuoka-Oden/kuro-hanpen)

## Setup

### OS X

(Check OS X 10.10)

1.  Install Xcode

1.  Install Xcode Command Line Tools

1.  Install Node.js (4.2 or later)

### Windows

(Check Windows 10 64bit)

1.  Install [Download Microsoft Visual C++ Build Tools 2015 Technical Preview from Official Microsoft Download Center](https://www.microsoft.com/en-us/download/details.aspx?id=49983)
    -   Install both Windows 8.1 SDK & Windows 10 SDK


1.  Install Python 2.7 (recommend 2.7.11 or later) 

    -   [Download Python | Python.org](https://www.python.org/downloads/)

1.  Install Node.js (4.2 or later, recommend 5.3 or later)

1.  Install Java Runtime

1.  Install & Run [npm-windows-upgrade](https://www.npmjs.com/package/npm-windows-upgrade)

    1.  Launch Command Prompt

        ```cmd
        npm install –g npm-windows-upgrade
        ```

    1.  Launch Command Prompt as **Administrator**

        ```cmd
        powershell
        ```

        ```powershell
        Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
        exit
        ```

        ```cmd
        npm-windows-upgrade
        ```

        (Select latest version)

    1.  Modify node-gyp (Japanese OS only?)

        ```diff
        diff -u "C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSProject.py~" "C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSProject.py"
        --- C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSProject.py~	2015-12-29 12:24:00.794675900 +0900
        +++ C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\MSVSProject.py	2015-12-29 12:24:11.192867300 +0900
        @@ -205,4 +205,4 @@
                 ['Globals']  # empty section
             ]
             easy_xml.WriteXmlIfChanged(content, self.project_path,
        -                               encoding="Windows-1252")
        +                               encoding="shift_jis")
        diff -u "C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\easy_xml.py~" "C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\easy_xml.py"
        --- C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\easy_xml.py~	2015-12-29 12:28:39.797529200 +0900
        +++ C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\gyp\pylib\gyp\easy_xml.py	2015-12-29 12:28:43.738387400 +0900
        @@ -119,7 +119,7 @@
           try:
             xml_string = xml_string.encode(encoding)
           except Exception:
        -    xml_string = unicode(xml_string, 'latin-1').encode(encoding)
        +    xml_string = unicode(xml_string, 'shift_jis').encode(encoding)
         
           # Get the old content
           try:
        ```

1.  Launch Command Prompt (**NOT** as Administrator) and configure npm

    ```cmd
    npm config set msvs_version 2015 --global
    ```


## install

```sh
npm install
```

AWS 関連のアクセス情報設定ファイル作成
アクセスキーは[IAM](https://console.aws.amazon.com/iam/home)で

```sh
cp aws.json.sample aws.json && vi $_
```

## Gulp Tasks

| task              | description                                    |
|-------------------|------------------------------------------------|
| `default`         | ビルドを行い、distに実行モジュールをコピーする |
| `serve`           | ローカル実行(distにはコピーしない)             |
| `upload`          | dist配下のファイルを全てS3へアップロード       |
| `es:regist`       | data配下のファイルを全てESへアップロード       |
| `test`            | Karma でユニットテスト                         |
| `test:auto`       | Karma でユニットテスト in watch mode           |
| `protractor`      | Protractor で E2E テスト                       |
| `protractor:dist` | Protractor で E2E テスト on the dist files     |
