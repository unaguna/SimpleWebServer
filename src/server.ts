import * as http from 'http'
import * as cluster from 'cluster'
import * as os from 'os'

import { getConfig } from './config'
import { respondFile } from './respondFile'

// 設定ファイル
const config = getConfig()

/**
 * HTTP サーバを起動する。
 */
export function start() {

  // ワーカースレッドの数
  const numCpus = (typeof config.workerThreadCount === 'number') ? config.workerThreadCount : os.cpus().length

  if (cluster.isMaster) {                           // マスタープロセスの処理
    console.log(`Master ${process.pid} is running. Access to http://${config.host}:${config.port}`)

    // コア数分ワーカープロセスを作る
    for (let i = 0; i < numCpus; i++) {
      cluster.fork()
    }


    // ワーカープロセスが死んだ場合
    // cluster.on('exit', (worker, code, signal) => {
    //   console.log(`worker ${worker.process.pid} died with signal`, signal)
    //   // プロセス再起動
    //   cluster.fork()
    // })
  } else {

    const server = http.createServer()

    server.on('request', respondFile)
    server.listen(config.port, config.host)

    console.log(`[${process.pid}] server listening ...`)

  }

}