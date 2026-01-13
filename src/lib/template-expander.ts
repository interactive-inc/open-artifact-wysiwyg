import { getDataSourceById } from "@/lib/data-sources"
import type { DataBindings, DataListConfig } from "@/lib/types"

/**
 * templateタグをサンプルデータで展開してプレビュー用HTMLを生成する
 *
 * template[data-source]を見つけて、対応するデータソースのサンプルデータ数だけ
 * テンプレート内容を複製し、バインドされたフィールドに値を設定する
 *
 * @param html - 展開するHTML文字列（data-node-id付き）
 * @param bindings - 要素IDとフィールドIDのマッピング
 * @param dataListConfig - データリストの設定（mode: list/detail）
 * @returns 展開後のHTML文字列
 */
export function expandTemplateWithData(
  html: string,
  bindings: DataBindings,
  dataListConfig: DataListConfig | null,
): string {
  if (typeof window === "undefined") return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html")

  const templates = doc.querySelectorAll("template[data-source]")

  for (const template of templates) {
    const sourceId = template.getAttribute("data-source")
    if (!sourceId) continue

    const dataSource = getDataSourceById(sourceId)
    if (!dataSource) continue

    const parent = template.parentElement
    if (!parent) continue

    const templateContent = (template as HTMLTemplateElement).content

    // display: contentsでラップすることでgridなどのレイアウトを維持
    const container = doc.createElement("div")
    container.className = "editor-template-preview"
    container.setAttribute(
      "data-node-id",
      template.getAttribute("data-node-id") || "",
    )
    container.setAttribute("data-source", sourceId)

    // mode 未設定時はテンプレートをそのまま表示（展開しない）
    if (!dataListConfig?.mode) {
      continue
    }

    // mode に応じてデータを取得
    const isDetailMode = dataListConfig.mode === "detail"
    const previewIndex = dataListConfig.previewIndex ?? 0
    const dataItems = isDetailMode
      ? dataSource.sampleData.slice(previewIndex, previewIndex + 1) // 詳細モードは選択された1件のみ
      : dataSource.sampleData

    // データの数だけ複製
    for (const data of dataItems) {
      const clone = templateContent.cloneNode(true) as DocumentFragment

      // バインディングを適用
      const elementsWithId = clone.querySelectorAll("[data-node-id]")
      for (const el of elementsWithId) {
        const editorId = el.getAttribute("data-node-id")
        if (!editorId) continue

        const fieldId = bindings[editorId]
        if (!fieldId) continue

        // data-bind属性を追加（ランタイム用）
        el.setAttribute("data-bind", fieldId)

        const value = data[fieldId]
        if (!value) continue

        // 要素タイプに応じて値を設定
        if (el.tagName === "IMG") {
          el.setAttribute("src", value)
        } else {
          el.textContent = value
        }
      }

      container.appendChild(clone)
    }

    parent.replaceChild(container, template)
  }

  return doc.body.innerHTML
}
