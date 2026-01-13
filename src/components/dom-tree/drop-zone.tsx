import type { DropZoneProps } from "./types"

/**
 * ドロップゾーン（要素間の線）
 */
export function DropZone(props: DropZoneProps) {
  const isActive =
    props.dropTarget?.targetId === props.targetId &&
    props.dropTarget?.position === props.position

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!props.dragState) return
    props.onDragOver(props.targetId, props.position)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    props.onDragEnd()
  }

  return (
    <div
      className={`h-1 rounded-full bg-primary transition-all ${isActive ? "scale-y-100 opacity-100" : "scale-y-75 opacity-0"}`}
      onDragOver={handleDragOver}
      onDragLeave={(e) => {
        e.preventDefault()
        props.onDragLeave()
      }}
      onDrop={handleDrop}
    />
  )
}
