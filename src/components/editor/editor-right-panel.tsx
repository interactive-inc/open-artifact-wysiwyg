import { RightSidebar } from "@/components/right-sidebar"
import { useEditor } from "@/lib/editor"
import {
  findNodeById,
  isDescendantOf,
  parseHtmlWithIds,
} from "@/lib/html-parser"
import type { DataListConfig } from "@/lib/types"

/**
 * エディタの右パネル
 */
export function EditorRightPanel() {
  const { state, dispatch, currentPage } = useEditor()

  const html = currentPage?.html ?? ""
  const parseResult = parseHtmlWithIds(html)
  const domTree = parseResult.nodes
  const htmlWithIds = parseResult.html

  const selectedNode = state.selectedElementId
    ? findNodeById(domTree, state.selectedElementId)
    : null

  const pageBindings = currentPage?.bindings ?? {}
  const pageDataListConfig = currentPage?.dataListConfig ?? null

  const isDescendantOfDataList = (nodeId: string): boolean => {
    if (!pageDataListConfig) return false
    const dataListNode = findNodeById(domTree, pageDataListConfig.elementId)
    if (!dataListNode) return false
    return isDescendantOf(dataListNode, nodeId)
  }

  const isInDataListScope = state.selectedElementId
    ? isDescendantOfDataList(state.selectedElementId)
    : false

  const handleHtmlChange = (newHtml: string) => {
    if (currentPage) {
      dispatch({
        type: "UPDATE_PAGE_HTML",
        pageId: currentPage.id,
        html: newHtml,
      })
    }
  }

  const handleBindField = (elementId: string, fieldId: string) => {
    if (!currentPage) return
    dispatch({ type: "BIND_FIELD", pageId: currentPage.id, elementId, fieldId })
  }

  const handleUnbindField = (elementId: string) => {
    if (!currentPage) return
    dispatch({ type: "UNBIND_FIELD", pageId: currentPage.id, elementId })
  }

  const handleSetDataList = (config: DataListConfig) => {
    if (!currentPage) return

    // HTMLの更新処理
    const parser = new DOMParser()
    const doc = parser.parseFromString(
      `<body>${htmlWithIds}</body>`,
      "text/html",
    )
    const element = doc.querySelector(`[data-node-id="${config.elementId}"]`)

    if (element) {
      // 既にtemplateがある場合はsourceIdを更新するだけ
      const existingTemplate = element.querySelector(":scope > template")
      if (existingTemplate) {
        existingTemplate.setAttribute("data-source", config.sourceId)
      } else {
        // 全ての子要素をtemplateで囲む
        const template = doc.createElement("template")
        template.setAttribute("data-source", config.sourceId)
        template.setAttribute("data-node-id", `template-${Date.now()}`)

        // 全ての子要素をtemplateに移動
        while (element.firstChild) {
          template.content.appendChild(element.firstChild)
        }
        element.appendChild(template)
      }

      dispatch({
        type: "UPDATE_PAGE_HTML",
        pageId: currentPage.id,
        html: doc.body.innerHTML,
      })
    }

    dispatch({ type: "SET_DATA_LIST", pageId: currentPage.id, config })
  }

  const handleRemoveDataList = () => {
    if (!currentPage) return

    if (pageDataListConfig) {
      const parser = new DOMParser()
      const doc = parser.parseFromString(
        `<body>${htmlWithIds}</body>`,
        "text/html",
      )
      const element = doc.querySelector(
        `[data-node-id="${pageDataListConfig.elementId}"]`,
      )

      if (element) {
        const template = element.querySelector("template")
        if (template?.content.firstElementChild) {
          const content = template.content.firstElementChild.cloneNode(true)
          element.replaceChild(content, template)
          dispatch({
            type: "UPDATE_PAGE_HTML",
            pageId: currentPage.id,
            html: doc.body.innerHTML,
          })
        }
      }
    }

    dispatch({ type: "REMOVE_DATA_LIST", pageId: currentPage.id })
  }

  return (
    <aside className="flex w-xs flex-col">
      <RightSidebar
        selectedPageId={state.selectedPageId}
        pagePath={currentPage?.path ?? "/"}
        selectedElementId={state.selectedElementId}
        selectedNode={selectedNode}
        html={htmlWithIds}
        onHtmlChange={handleHtmlChange}
        onSelectChange={(id) =>
          dispatch({ type: "SELECT_ELEMENT", elementId: id })
        }
        mode={state.editorMode}
        onModeChange={(mode) => dispatch({ type: "SET_EDITOR_MODE", mode })}
        bindings={pageBindings}
        dataListConfig={pageDataListConfig}
        isInDataListScope={isInDataListScope}
        onBindField={handleBindField}
        onUnbindField={handleUnbindField}
        onSetDataList={handleSetDataList}
        onRemoveDataList={handleRemoveDataList}
      />
    </aside>
  )
}
