import { DropZone } from "./drop-zone"
import { TreeNode } from "./tree-node"
import type { NodeListProps } from "./types"

/**
 * ノードリスト（ドロップゾーン付き）
 */
export function NodeList(props: NodeListProps) {
  return (
    <div className="flex flex-col gap-0.5">
      {props.nodes.flatMap((node, index) => {
        const elements = []
        const isMain = node.tag === "main"

        if (index === 0 && !isMain) {
          elements.push(
            <DropZone
              key={`drop-before-${node.id}`}
              targetId={node.id}
              position="before"
              dragState={props.dragState}
              dropTarget={props.dropTarget}
              onDragOver={props.onDragOver}
              onDragLeave={props.onDragLeave}
              onDragEnd={props.onDragEnd}
            />,
          )
        }

        elements.push(
          <TreeNode
            key={node.id}
            node={node}
            selectedId={props.selectedId}
            ancestorIds={props.ancestorIds}
            onSelect={props.onSelect}
            bindings={props.bindings}
            dataListConfig={props.dataListConfig}
            dragState={props.dragState}
            dropTarget={props.dropTarget}
            onDragStart={props.onDragStart}
            onDragEnd={props.onDragEnd}
            onDragOver={props.onDragOver}
            onDragLeave={props.onDragLeave}
          />,
        )

        if (!isMain) {
          elements.push(
            <DropZone
              key={`drop-after-${node.id}`}
              targetId={node.id}
              position="after"
              dragState={props.dragState}
              dropTarget={props.dropTarget}
              onDragOver={props.onDragOver}
              onDragLeave={props.onDragLeave}
              onDragEnd={props.onDragEnd}
            />,
          )
        }

        return elements
      })}
    </div>
  )
}
