import type { DomNode, MovePosition } from "@/lib/types"

/**
 * HTMLパース結果
 */
export type ParseResult = {
  nodes: DomNode[]
  html: string
}

/**
 * HTMLをパースしてDomNodeツリーを生成し、各要素にdata-node-idを付与する
 * 既存のdata-node-idがある場合は再利用する
 */
export function parseHtmlWithIds(html: string): ParseResult {
  if (typeof window === "undefined") {
    return { nodes: [], html }
  }

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html")

  const processNode = (element: Element): DomNode => {
    const existingId = element.getAttribute("data-node-id")
    const id = existingId || crypto.randomUUID()
    if (!existingId) {
      element.setAttribute("data-node-id", id)
    }

    const attributes: Record<string, string> = {}
    for (const attr of element.attributes) {
      attributes[attr.name] = attr.value
    }

    const children: DomNode[] = []

    // template要素の場合はcontentを処理（DocumentFragmentに中身が入る）
    if (element.tagName.toLowerCase() === "template") {
      const templateEl = element as HTMLTemplateElement
      for (const child of templateEl.content.children) {
        children.push(processNode(child))
      }
    } else {
      for (const child of element.children) {
        children.push(processNode(child))
      }
    }

    // テキストのみの要素の場合はtextContentを保存
    const textContent =
      element.childNodes.length === 1 &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
        ? element.childNodes[0].textContent
        : null

    return {
      id,
      tag: element.tagName.toLowerCase(),
      attributes,
      children,
      textContent,
    }
  }

  const nodes: DomNode[] = []
  for (const child of doc.body.children) {
    nodes.push(processNode(child))
  }

  return {
    nodes,
    html: doc.body.innerHTML,
  }
}

/**
 * DomNodeツリーからIDでノードを検索する
 */
export function findNodeById(nodes: DomNode[], id: string): DomNode | null {
  for (const node of nodes) {
    if (node.id === id) return node
    const found = findNodeById(node.children, id)
    if (found) return found
  }
  return null
}

/**
 * 指定したノードが親ノードの子孫かどうかを判定する
 */
export function isDescendantOf(parent: DomNode, targetId: string): boolean {
  if (parent.id === targetId) return true
  for (const child of parent.children) {
    if (isDescendantOf(child, targetId)) return true
  }
  return false
}

/**
 * HTML内のノードを移動する
 *
 * @param html - 元のHTML（data-node-id付き）
 * @param sourceId - 移動する要素のdata-node-id
 * @param targetId - 移動先の要素のdata-node-id
 * @param position - 移動位置
 * @returns 移動後のHTML
 */
export function moveNodeInHtml(
  html: string,
  sourceId: string,
  targetId: string,
  position: MovePosition,
): string {
  if (typeof window === "undefined") return html

  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html")

  const source = doc.querySelector(`[data-node-id="${sourceId}"]`)
  const target = doc.querySelector(`[data-node-id="${targetId}"]`)

  if (!source || !target) return html

  // 自分自身への移動は無効
  if (sourceId === targetId) return html

  // 子孫への移動は無効（循環参照防止）
  if (source.contains(target)) return html

  // 元の位置から削除
  source.remove()

  // 新しい位置に挿入
  if (position === "before") {
    target.parentElement?.insertBefore(source, target)
  } else if (position === "after") {
    target.parentElement?.insertBefore(source, target.nextSibling)
  } else {
    target.appendChild(source)
  }

  return doc.body.innerHTML
}
