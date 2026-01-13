import { ChevronDown, ChevronRight, ChevronsDownUp, Plus } from "lucide-react"
import { useState } from "react"
import { getAncestorIds } from "@/components/dom-tree/get-ancestor-ids"
import { NodeList } from "@/components/dom-tree/node-list"
import type { DragState, DropTarget } from "@/components/dom-tree/types"
import { Button } from "@/components/ui/button"
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item"
import { type PageTreeNode, useEditor } from "@/lib/editor"
import { moveNodeInHtml, parseHtmlWithIds } from "@/lib/html-parser"
import type { MovePosition } from "@/lib/types"
import { cn } from "@/lib/utils"

type FlatPage = {
  id: string
  name: string
  path: string
}

/**
 * ページツリーをフラット化
 */
function flattenPageTree(nodes: PageTreeNode[]): FlatPage[] {
  const result: FlatPage[] = []
  for (const node of nodes) {
    result.push({ id: node.id, name: node.name, path: node.path })
    if (node.children.length > 0) {
      result.push(...flattenPageTree(node.children))
    }
  }
  return result
}

/**
 * ページツリーコンポーネント
 */
export function PageTree() {
  const { state, dispatch, currentPage, pageTree } = useEditor()
  const [dragState, setDragState] = useState<DragState>(null)
  const [dropTarget, setDropTarget] = useState<DropTarget>(null)
  const [expandedPageId, setExpandedPageId] = useState<string | null>(null)

  const flatPages = flattenPageTree(pageTree)

  // 現在のページのHTMLをパース
  const html = currentPage?.html ?? ""
  const parseResult = parseHtmlWithIds(html)
  const domTree = parseResult.nodes
  const htmlWithIds = parseResult.html
  const mainNode = domTree.find((node) => node.tag === "main") ?? null

  const handleDragStart = (sourceId: string) => {
    setDragState({ sourceId })
  }

  const handleDragEnd = () => {
    if (dragState && dropTarget && currentPage) {
      const newHtml = moveNodeInHtml(
        htmlWithIds,
        dragState.sourceId,
        dropTarget.targetId,
        dropTarget.position,
      )
      dispatch({
        type: "UPDATE_PAGE_HTML",
        pageId: currentPage.id,
        html: newHtml,
      })
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

  const ancestorIds =
    state.selectedElementId && mainNode
      ? getAncestorIds([mainNode], state.selectedElementId)
      : []

  // ページのmainNodeを取得
  const getPageMainNode = (pageId: string) => {
    const page = state.pages.find((p) => p.id === pageId)
    if (!page) return null
    const result = parseHtmlWithIds(page.html)
    const nodes = result.nodes
    return nodes.find((node) => node.tag === "main") ?? null
  }

  const handleAddPage = () => {
    const uniqueId = crypto.randomUUID().split("-")[0]
    dispatch({ type: "ADD_PAGE", name: `new-page-${uniqueId}`, parentId: null })
  }

  const handleCollapseAll = () => {
    setExpandedPageId(null)
    dispatch({ type: "SELECT_ELEMENT", elementId: null })
  }

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-muted-foreground text-xs">PAGES</span>
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCollapseAll}
            title="すべて閉じる"
          >
            <ChevronsDownUp />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleAddPage}
            title="ページを追加"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 px-1">
        {flatPages.map((page) => {
          const isSelected = state.selectedPageId === page.id
          const isExpanded = expandedPageId === page.id
          const actualPage = state.pages.find((p) => p.id === page.id)
          const pageMainNode = getPageMainNode(page.id)
          const hasChildren = pageMainNode && pageMainNode.children.length > 0

          return (
            <div
              key={page.id}
              className={cn("rounded border", isSelected && "border-primary!")}
            >
              <Item
                size="xs"
                variant="default"
                className="cursor-pointer"
                onClick={() => {
                  dispatch({ type: "SELECT_PAGE", pageId: page.id })
                  setExpandedPageId(null)
                }}
              >
                <ItemMedia variant="icon">
                  {hasChildren ? (
                    <Button
                      variant="secondary"
                      size="icon-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (isExpanded) {
                          setExpandedPageId(null)
                          dispatch({ type: "SELECT_ELEMENT", elementId: null })
                        } else {
                          dispatch({ type: "SELECT_PAGE", pageId: page.id })
                          setExpandedPageId(page.id)
                          if (pageMainNode) {
                            dispatch({
                              type: "SELECT_ELEMENT",
                              elementId: pageMainNode.id,
                            })
                          }
                        }
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </Button>
                  ) : (
                    <span className="size-5" />
                  )}
                </ItemMedia>
                <ItemContent>
                  <ItemTitle className="font-mono">{page.path}</ItemTitle>
                </ItemContent>
              </Item>
              {isExpanded &&
                pageMainNode &&
                pageMainNode.children.length > 0 && (
                  <div className="border-t px-2 py-0.5">
                    <NodeList
                      nodes={pageMainNode.children}
                      selectedId={state.selectedElementId}
                      ancestorIds={ancestorIds}
                      onSelect={(id) =>
                        dispatch({ type: "SELECT_ELEMENT", elementId: id })
                      }
                      bindings={actualPage?.bindings ?? {}}
                      dataListConfig={actualPage?.dataListConfig ?? null}
                      dragState={dragState}
                      dropTarget={dropTarget}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    />
                  </div>
                )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
