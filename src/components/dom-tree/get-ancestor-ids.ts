import type { DomNode } from "@/lib/types"

/**
 * 選択されたノードまでの祖先IDを取得
 */
export function getAncestorIds(nodes: DomNode[], targetId: string): string[] {
  for (const node of nodes) {
    if (node.id === targetId) {
      return [node.id]
    }
    const childResult = getAncestorIds(node.children, targetId)
    if (childResult.length > 0) {
      return [node.id, ...childResult]
    }
  }
  return []
}
