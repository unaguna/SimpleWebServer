# Simple Web Server

本アプリケーションは、ファイルを提供する Web サーバーとして機能します。アクセスコントロールを行う仕組みはありません。

## サーバの起動方法

同梱の simpleWebServer.exe を実行してください。

動作に必要なファイルは以下の通りなので、それ以外のファイル（本アプリのソースコード等）は削除してかまいません。
```
+- simpleWebServer.exe
|
+- etc
|   +- config.json
|   +- contentTypes.json
|
+- public
    +- (公開するファイル)
```

## 公開するファイルの設置

初期設定では ```./public``` ディレクトリ内が公開されます。たとえば、```http://localhost:3000/dir/a.html``` へアクセスすると、```./public/dir/a.html``` が HTTP レスポンスとして取得されます。

## 設定ファイル

```./etc/config.json``` は設定ファイルであり、以下のオプションを設定できます。

### 一覧
| オプション名 | 指定できる形式 | default | 意味 |
|----|----|----|----|
| contentTypeMapPath | string | ```"./etc/contentTypes.json"``` | Content-Type の関連を示す JSON ファイルのパス。
| **host** | string | ```"localhost"``` | HTTP サーバのホスト名 |
| publishRoot | string | ```"./public"``` | HTTP サーバの公開ディレクトリ |
| **port** | integer (1 - 65535) | ```3000``` | HTTPリクエストを受け付けるポート番号 |
| workerThreadCount | integer (1- ) \| ```"CORE"``` | ```"CORE"``` | HTTP リクエストを受け付けるスレッド数。```"CORE"```を指定した場合は実行環境のコアの個数だけスレッドが作られる。|

### host, port

HTTP サーバのホストとポート番号です。たとえば初期設定の ```"host": "localhost", "port": 3000``` を指定している場合、HTTP サーバへアクセスする URL は ```http://localhost:3000/``` となります。

### publishRoot

HTTP サーバが公開するディレクトリです。ここで指定したディレクトリ以下のファイルが公開されます。たとえば、```http://localhost:3000/dir/a.html``` へアクセスすると、```./public/dir/a.html``` が HTTP レスポンスとして取得されます。

```http://localhost:3000/``` へアクセスした場合は ```./public/index.html``` が HTTP レスポンスとして取得されます (```./public/index.html``` が存在しない場合は 404 エラーが取得されます)。

基本的にはこのディレクトリ内のすべてのファイルが HTTP サーバから取得できますが [Content-Type の関連を示す JSON ファイル](#contentTypeMapPath)に記載がない拡張子のファイルは取得できません。

### contentTypeMapPath

contentTypeMapPath には拡張子と Content-Type の関連を示す JSON ファイルのパスを指定します。

このファイルでは、下記のように拡張子に対応する content-type を指定します。Web サーバはこのファイルに従って、レスポンスの content-type を決定します。このファイルで指定されていない拡張子のファイルがリクエストされた場合、サーバは **403 エラーを返します**。
```
{
    "html": "text/html",
    "htm": "text/html",
    "js": "text/javascript",
    "css": "text/css"
}
```

## 開発者向け情報

このアプリケーションは [Node.js](https://nodejs.org/) を使用しています。このアプリケーションの開発を行う場合、Node.js をインストールして ```npm``` コマンドと ```node``` コマンドを使用できる状態にしてください。

### Node.js による起動方法

リポジトリの root ディレクトリで下記コマンドを使用するとサーバーが起動します。
```
npm install     # 初回のみ必要な環境構築コマンド
npm start       # サーバを起動するコマンド
```

### exe 出力

この HTTP サーバは Node.js で動作しますが、[nexe](https://www.npmjs.com/package/nexe) を使用することで Node.js が無い環境でも動作する exe ファイルになります。

exe ファイルを作成するためには、下記コードを実行してください。(Node.jsのバージョンによっては nexe が対応していないため exe ファイルが生成されません。)
```
npm install     # 初回のみ必要な nexe インストールコマンド
npm run build   # nexe 実行コマンド
```