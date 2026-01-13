import { createContext, type ReactNode, useContext, useReducer } from "react"
import { parseHtmlWithIds } from "@/lib/html-parser"
import { initialEditorState } from "./initial-data"
import { type EditorAction, editorReducer } from "./reducer"
import type { EditorState, Page } from "./schema"

type EditorContextValue = {
  state: EditorState
  dispatch: React.Dispatch<EditorAction>
  // 便利なゲッター
  currentPage: Page | null
  pageTree: PageTreeNode[]
}

export type PageTreeNode = {
  id: string
  name: string
  path: string
  children: PageTreeNode[]
}

const EditorContext = createContext<EditorContextValue | null>(null)

/**
 * ページをツリー構造に変換
 */
function buildPageTree(pages: Page[]): PageTreeNode[] {
  const rootPages = pages.filter((p) => p.parentId === null)

  const buildNode = (page: Page): PageTreeNode => {
    const children = pages.filter((p) => p.parentId === page.id)
    return {
      id: page.id,
      name: page.name,
      path: page.path,
      children: children.map(buildNode),
    }
  }

  return rootPages.map(buildNode)
}

type Props = {
  children: ReactNode
}

/**
 * 初期状態のHTMLにIDを付与する
 */
function initializeState(state: EditorState): EditorState {
  const pagesWithIds = state.pages.map((page) => {
    const parseResult = parseHtmlWithIds(page.html)
    return {
      ...page,
      html: parseResult.html,
    }
  })
  return {
    ...state,
    pages: pagesWithIds,
  }
}

/**
 * エディタコンテキストプロバイダー
 */
export function EditorProvider(props: Props) {
  const [state, dispatch] = useReducer(
    editorReducer,
    initialEditorState,
    initializeState,
  )

  const currentPage = state.selectedPageId
    ? (state.pages.find((p) => p.id === state.selectedPageId) ?? null)
    : null

  const pageTree = buildPageTree(state.pages)

  const value: EditorContextValue = {
    state,
    dispatch,
    currentPage,
    pageTree,
  }

  return (
    <EditorContext.Provider value={value}>
      {props.children}
    </EditorContext.Provider>
  )
}

/**
 * エディタコンテキストを使用するフック
 */
export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}
