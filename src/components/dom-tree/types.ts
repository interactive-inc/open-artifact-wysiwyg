import type {
  DataBindings,
  DataListConfig,
  DomNode,
  MovePosition,
} from "@/lib/types"

/**
 * ドラッグ状態
 */
export type DragState = {
  sourceId: string
} | null

/**
 * ドロップターゲット状態
 */
export type DropTarget = {
  targetId: string
  position: MovePosition
} | null

export type DomTreeProps = {
  nodes: DomNode[]
  selectedId: string | null
  onSelect: (id: string) => void
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  onMoveNode: (
    sourceId: string,
    targetId: string,
    position: MovePosition,
  ) => void
}

export type NodeListProps = {
  nodes: DomNode[]
  selectedId: string | null
  ancestorIds: string[]
  onSelect: (id: string) => void
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  dragState: DragState
  dropTarget: DropTarget
  onDragStart: (sourceId: string) => void
  onDragEnd: () => void
  onDragOver: (targetId: string, position: MovePosition) => void
  onDragLeave: () => void
}

export type DropZoneProps = {
  targetId: string
  position: MovePosition
  dragState: DragState
  dropTarget: DropTarget
  onDragOver: (targetId: string, position: MovePosition) => void
  onDragLeave: () => void
  onDragEnd: () => void
}

export type TreeNodeProps = {
  node: DomNode
  selectedId: string | null
  ancestorIds: string[]
  onSelect: (id: string) => void
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  dragState: DragState
  dropTarget: DropTarget
  onDragStart: (sourceId: string) => void
  onDragEnd: () => void
  onDragOver: (targetId: string, position: MovePosition) => void
  onDragLeave: () => void
}
