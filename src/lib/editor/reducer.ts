import type {
  DataListConfig,
  EditorMode,
  EditorState,
  LeftTab,
  ViewMode,
} from "./schema"

/**
 * エディタのアクション型定義
 */
export type EditorAction =
  | { type: "SELECT_PAGE"; pageId: string | null }
  | { type: "SELECT_ELEMENT"; elementId: string | null }
  | { type: "SET_EDITOR_MODE"; mode: EditorMode }
  | { type: "SET_VIEW_MODE"; mode: ViewMode }
  | { type: "SET_DEVICE_WIDTH"; width: number }
  | { type: "SET_LEFT_TAB"; tab: LeftTab }
  | { type: "UPDATE_PAGE_HTML"; pageId: string; html: string }
  | { type: "UPDATE_PAGE_PATH"; pageId: string; path: string }
  | { type: "BIND_FIELD"; pageId: string; elementId: string; fieldId: string }
  | { type: "UNBIND_FIELD"; pageId: string; elementId: string }
  | { type: "SET_DATA_LIST"; pageId: string; config: DataListConfig }
  | { type: "REMOVE_DATA_LIST"; pageId: string }
  | { type: "ADD_PAGE"; name: string; parentId: string | null }
  | { type: "DELETE_PAGE"; pageId: string }

/**
 * エディタのReducer
 */
export function editorReducer(
  state: EditorState,
  action: EditorAction,
): EditorState {
  if (action.type === "SELECT_PAGE") {
    return {
      ...state,
      selectedPageId: action.pageId,
      selectedElementId: null,
    }
  }

  if (action.type === "SELECT_ELEMENT") {
    return {
      ...state,
      selectedElementId: action.elementId,
    }
  }

  if (action.type === "SET_EDITOR_MODE") {
    return {
      ...state,
      editorMode: action.mode,
    }
  }

  if (action.type === "SET_VIEW_MODE") {
    return {
      ...state,
      viewMode: action.mode,
    }
  }

  if (action.type === "SET_DEVICE_WIDTH") {
    return {
      ...state,
      deviceWidth: action.width,
    }
  }

  if (action.type === "SET_LEFT_TAB") {
    return {
      ...state,
      leftTab: action.tab,
    }
  }

  if (action.type === "UPDATE_PAGE_HTML") {
    return {
      ...state,
      pages: state.pages.map((page) =>
        page.id === action.pageId ? { ...page, html: action.html } : page,
      ),
    }
  }

  if (action.type === "UPDATE_PAGE_PATH") {
    return {
      ...state,
      pages: state.pages.map((page) =>
        page.id === action.pageId ? { ...page, path: action.path } : page,
      ),
    }
  }

  if (action.type === "BIND_FIELD") {
    return {
      ...state,
      pages: state.pages.map((page) =>
        page.id === action.pageId
          ? {
              ...page,
              bindings: {
                ...page.bindings,
                [action.elementId]: action.fieldId,
              },
            }
          : page,
      ),
    }
  }

  if (action.type === "UNBIND_FIELD") {
    return {
      ...state,
      pages: state.pages.map((page) => {
        if (page.id !== action.pageId) return page
        const newBindings = { ...page.bindings }
        delete newBindings[action.elementId]
        return { ...page, bindings: newBindings }
      }),
    }
  }

  if (action.type === "SET_DATA_LIST") {
    return {
      ...state,
      pages: state.pages.map((page) =>
        page.id === action.pageId
          ? { ...page, dataListConfig: action.config }
          : page,
      ),
    }
  }

  if (action.type === "REMOVE_DATA_LIST") {
    return {
      ...state,
      pages: state.pages.map((page) =>
        page.id === action.pageId
          ? { ...page, dataListConfig: null, bindings: {} }
          : page,
      ),
    }
  }

  if (action.type === "ADD_PAGE") {
    const timestamp = Date.now()
    const newId = `page-${timestamp}`
    const parentPage = action.parentId
      ? state.pages.find((p) => p.id === action.parentId)
      : null
    const basePath = parentPage ? parentPage.path : ""
    const newPath =
      action.name === "index" ? basePath || "/" : `${basePath}/${action.name}`

    return {
      ...state,
      pages: [
        ...state.pages,
        {
          id: newId,
          name: action.name,
          path: newPath,
          html: `<main data-node-id="main-${timestamp}" class="p-8"><section data-node-id="section-${timestamp}" class="space-y-4"></section></main>`,
          parentId: action.parentId,
        },
      ],
    }
  }

  if (action.type === "DELETE_PAGE") {
    return {
      ...state,
      pages: state.pages.filter((page) => page.id !== action.pageId),
      selectedPageId:
        state.selectedPageId === action.pageId ? null : state.selectedPageId,
    }
  }

  return state
}
