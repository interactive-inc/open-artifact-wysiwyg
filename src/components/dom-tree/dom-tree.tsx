import { useState } from "react"
import type { MovePosition } from "@/lib/types"
import { getAncestorIds } from "./get-ancestor-ids"
import { TreeNode } from "./tree-node"
import type { DomTreeProps, DragState, DropTarget } from "./types"

/**
 * DOMツリーを表示するコンポーネント
 */
export function DomTree(props: DomTreeProps) {
  const [dragState, setDragState] = useState<DragState>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget>(null)

  const handleDragStart = (sourceId: string) => {
    setDragState({ sourceId })
  }

  const handleDragEnd = () => {
    if (dragState && dropTarget) {
      props.onMoveNode(
        dragState.sourceId,
        dropTarget.targetId,
        dropTarget.position,
      )
    }
    setDragState(null)
    setDropTarget(null)
  }

  const handleDragOver = (targetId: string, position: MovePosition) => {
    if (!dragState) return
    if (dragState.sourceId === targetId) return
    setDropTarget({ targetId, position })
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const mainNode = props.nodes.find((node) => node.tag === "main")
  if (!mainNode) return null

  const ancestorIds = props.selectedId
    ? getAncestorIds(props.nodes, props.selectedId)
    : []

  return (
    <div className="px-2 pt-2 text-sm">
      <TreeNode
        node={mainNode}
        selectedId={props.selectedId}
        ancestorIds={ancestorIds}
        onSelect={props.onSelect}
        bindings={props.bindings}
        dataListConfig={props.dataListConfig}
        dragState={dragState}
        dropTarget={dropTarget}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      />
    </div>
  )
}
