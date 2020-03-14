import * as fs from 'fs'

/**
 * 同期的に JSON ファイルを読み込む。
 * 
 * 読み込んだファイルの内容を JSON としてパースして出力する。
 * ファイルが存在しない場合は `defaultResult` として指定した内容を出力する。
 * 
 * @param filePath 読み込むファイルパス
 * @param defaultResult ファイルが存在しない場合の結果
 * @return 読み込んだ JSON オブジェクト、または `defaultResult`
 */
export function readJsonFileSync <T> (filePath: string, defaultResult: T): T {

  if(fs.existsSync(filePath)) {
    // ファイルが存在する場合、それを JSON として読み込む。

    return JSON.parse(fs.readFileSync(filePath, 'utf8'))

  } else {
    // ファイルが存在しない場合、デフォルトを返す。

    return defaultResult

  }
}

/**
 * 非同期的にファイルを読み込む。
 * 
 * ファイルを読み込めた場合、その内容を持つ Buffer を resolve する。
 * ファイルを読み込めなかった場合、エラーオブジェクト (`NodeJS.ErrnoException`) 
 * または `null` とともに reject する。
 * 
 * @param filePath 読み込むファイルパス
 * @return 読み込んだ JSON オブジェクト、または `defaultResult`
 */
export async function readFile(filePath: string): Promise<Buffer> {

  return new Promise((resolve, reject) => {

    fs.readFile(filePath, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })

  })

}