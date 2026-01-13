import {
  ChevronDown,
  ChevronRight,
  Database,
  Image,
  Link2,
  Minus,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import { cn } from "@/lib/utils"
import { canHaveChildren } from "./can-have-children"
import { extractDisplayClass } from "./extract-display-class"
import { NodeList } from "./node-list"
import type { TreeNodeProps } from "./types"

/**
 * ツリーノード
 */
export function TreeNode(props: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = props.node.children.length > 0
  const canExpand = canHaveChildren(props.node.tag)
  const isInAncestorPath = props.ancestorIds.includes(props.node.id)
  const isDataListRoot = props.dataListConfig?.elementId === props.node.id
  const hasBoundField = props.bindings[props.node.id] !== undefined
  const isDragging = props.dragState?.sourceId === props.node.id
  const isDropInside =
    props.dropTarget?.targetId === props.node.id &&
    props.dropTarget?.position === "inside"

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(!expanded)
  }

  const handleSelect = () => {
    props.onSelect(props.node.id)
  }

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation()
    e.dataTransfer.effectAllowed = "move"
    props.onDragStart(props.node.id)
  }

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault()
    props.onDragEnd()
  }

  const isSelected = props.selectedId === props.node.id
  const isMain = props.node.tag === "main"
  const isDraggable = !isMain && !props.node.tag.startsWith("template")

  const displayClass = props.node.attributes.class
    ? extractDisplayClass(props.node.attributes.class)
    : null

  return (
    <div
      className={cn(
        "rounded border",
        isDragging && "border-dashed",
        isSelected && "border-primary!",
        isInAncestorPath && !isSelected && "border-primary/40!",
        isDropInside && "border-primary!",
      )}
    >
      <Item
        size="xs"
        variant="default"
        className="cursor-pointer"
        draggable={isDraggable}
        onDragStart={isDraggable ? handleDragStart : undefined}
        onDragEnd={isDraggable ? handleDragEnd : undefined}
        onClick={handleSelect}
      >
        <ItemMedia variant="icon">
          {canExpand ? (
            <Button
              variant="secondary"
              size="icon-xs"
              className={cn(!hasChildren && "text-muted-foreground")}
              onClick={handleToggle}
            >
              {expanded ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </Button>
          ) : (
            <span className="flex size-5 items-center justify-center text-muted-foreground">
              {props.node.tag === "img" ? (
                <Image size={14} />
              ) : (
                <Minus size={14} />
              )}
            </span>
          )}
        </ItemMedia>

        <ItemContent>
          <ItemTitle className="font-mono">
            {props.node.tag}
            {displayClass && (
              <span className="text-muted-foreground">.{displayClass}</span>
            )}
          </ItemTitle>
        </ItemContent>

        {(isDataListRoot || hasBoundField) && (
          <ItemActions>
            {isDataListRoot && (
              <Database size={14} className="text-green-500" />
            )}
            {hasBoundField && !isDataListRoot && (
              <Link2 size={14} className="text-primary" />
            )}
          </ItemActions>
        )}
      </Item>

      {expanded && canExpand && (
        <div
          className="border-t px-2 py-0.5"
          onDragOver={(e) => {
            if (!hasChildren && props.dragState) {
              e.preventDefault()
              e.stopPropagation()
              props.onDragOver(props.node.id, "inside")
            }
          }}
          onDragLeave={(e) => {
            if (!hasChildren) {
              e.preventDefault()
              props.onDragLeave()
            }
          }}
          onDrop={(e) => {
            if (!hasChildren) {
              e.preventDefault()
              e.stopPropagation()
              props.onDragEnd()
            }
          }}
        >
          {hasChildren ? (
            <NodeList
              nodes={props.node.children}
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
            />
          ) : (
            <div className="p-2 text-muted-foreground text-xs">EMPTY</div>
          )}
        </div>
      )}
    </div>
  )
}
