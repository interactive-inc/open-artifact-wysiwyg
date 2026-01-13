/**
 * エディタで使用する型定義
 */

/**
 * パースされたDOM要素のノード表現
 */
export type DomNode = {
  id: string
  tag: string
  attributes: Record<string, string>
  children: DomNode[]
  textContent: string | null
}

/**
 * フィルタ条件
 * field: データソースのフィールド名
 * paramName: URLパラメータ名
 */
export type Filter = {
  field: string
  paramName: string
}

/**
 * データリスト（繰り返し表示）の設定
 * elementId: template要素の親のID
 * sourceId: データソースのID（posts, works, membersなど）
 * mode: 一覧表示か詳細表示か
 * limit: 表示件数の上限
 * filters: 詳細ページ用のフィルタ条件
 * previewIndex: 詳細モードでプレビューに使用するデータのインデックス
 */
export type DataListConfig = {
  elementId: string
  sourceId: string
  mode?: "list" | "detail"
  limit: number
  filters?: Filter[]
  previewIndex?: number
}

/**
 * 要素IDとフィールドIDのマッピング
 * key: data-editor-id
 * value: フィールドID（title, thumbnailなど）
 */
export type DataBindings = Record<string, string>

/**
 * ノード移動時の位置指定
 * before: ターゲットの前に兄弟として挿入
 * after: ターゲットの後に兄弟として挿入
 * inside: ターゲットの子として末尾に挿入
 */
export type MovePosition = "before" | "after" | "inside"
