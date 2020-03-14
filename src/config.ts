import { readJsonFileSync } from './file'

// 設定ファイルの型
export interface Config {
  // ポート
  port: number,
  // ホスト名
  host: string,
  // 公開ルートディレクトリ
  publishRoot: string,
  // ワーカスレッドの数
  workerThreadCount: number|"CORE",
  // ContentTypeマップファイルのパス,
  contentTypeMapPath: string
}

// デフォルト設定。
const defaultConfig: Config = {
  port: 3000,
  host: "localhost",
  publishRoot: "./public",
  workerThreadCount: "CORE",
  contentTypeMapPath: './etc/contentTypes.json',
}

export function getConfig(): Config
export function getConfig <K extends keyof Config> (key: K): Config[K]
export function getConfig <K extends keyof Config> (key?: K): Config[K]|Config {

  if(key === void 0) return config

  return config[key]
}

// 設定ファイルのパス
const CONFIG_FILE_PATH = "./etc/config.json"

// 設定ファイルを読み込み
const userConfig: Partial<Config> = readJsonFileSync(CONFIG_FILE_PATH, {})

// 使用する設定
const config: Config = Object.assign({}, defaultConfig, userConfig)