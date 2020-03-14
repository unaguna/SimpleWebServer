import { IncomingMessage, ServerResponse } from 'http'
import { parse } from 'url'
import * as path from 'path'

import { getConfig } from './config'
import { readJsonFileSync, readFile } from './file'

// 設定ファイル
const config = getConfig()

// ContentType一覧を読み込み
const contentTypesMap: {[key: string]: string} = readJsonFileSync(config.contentTypeMapPath, {})

/**
 * HTTP responce としてファイルを返す。
 * 
 * @param req 受け取った HTTP request
 * @param res このメソッド終了時に送信する HTTP response
 */
export function respondFile(req: IncomingMessage, res: ServerResponse) {

  const url = parse(req.url ?? "/")

  // リクエストされたパス
  const publishPath = (url.pathname !== '/' && url.pathname !== null) ? url.pathname : '/index.html'
  // リクエストされたファイルのサーバマシン上の絶対パス
  const absolutePath = path.resolve(path.join(config.publishRoot, publishPath.replace(/^\//, '')))

  // リクエストされたファイルが公開領域外にある場合は 403
  if (path.relative(config.publishRoot, absolutePath).startsWith("..")) {
    res.writeHead(403)
    return res.end()
  }

  // リクエストされたファイルを読み込む
  readFile(absolutePath).then((data) => {

    const contentType = getContentType(publishPath)

    if(contentType !== undefined) {
      // content-type マップファイルに記載があるならファイルを返す。

      res.writeHead(200, { 'content-Type': contentType })
      res.write(data)

    } else {
      // content-type マップファイルに記載がないなら、403 エラー

      res.writeHead(403, { 'content-Type': 'text/plain; charset=UTF-8' })
    }

  }).catch((err) => {

    res.writeHead(404, { 'content-Type': 'text/plain; charset=UTF-8' })
    res.write("not found")

  }).finally(() => {
    res.end()
  })
}

/**
 * ファイルに対応する Content-Type を取得する。
 * 
 * Content-Type の判断には拡張子のみが使用され、
 * ファイルの存在やファイルの内容は判断に使用しない。
 * 
 * @param fileName ファイル名
 * @return Content-Type
 */
function getContentType(fileName: string): string | undefined {

  const parts = fileName.split('.')
  const ex = parts[parts.length - 1]

  // console.debug(`"${ex}"'s content type is ${map[ex]}.`)

  return contentTypesMap[ex]
}