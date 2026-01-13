import { describe, expect, test } from "bun:test"
import { type EditorAction, editorReducer } from "./reducer"
import type { EditorState, Page } from "./schema"

/**
 * テスト用の初期ステートを作成
 */
function createInitialState(): EditorState {
  return {
    pages: [
      {
        id: "page-1",
        name: "home",
        path: "/",
        html: "<main>Home</main>",
        parentId: null,
      },
      {
        id: "page-2",
        name: "about",
        path: "/about",
        html: "<main>About</main>",
        parentId: null,
      },
    ],
    components: [],
    selectedPageId: "page-1",
    selectedElementId: "el-1",
    editorMode: "design",
    viewMode: "fit",
    deviceWidth: 1024,
    leftTab: "home",
  }
}

describe("SELECT_PAGE", () => {
  test("ページを選択する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_PAGE", pageId: "page-2" }
    const result = editorReducer(state, action)
    expect(result.selectedPageId).toBe("page-2")
  })

  test("ページ選択時に要素選択をクリアする", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_PAGE", pageId: "page-2" }
    const result = editorReducer(state, action)
    expect(result.selectedElementId).toBeNull()
  })

  test("nullを選択できる", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_PAGE", pageId: null }
    const result = editorReducer(state, action)
    expect(result.selectedPageId).toBeNull()
  })
})

describe("SELECT_ELEMENT", () => {
  test("要素を選択する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_ELEMENT", elementId: "el-2" }
    const result = editorReducer(state, action)
    expect(result.selectedElementId).toBe("el-2")
  })

  test("nullを選択できる", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_ELEMENT", elementId: null }
    const result = editorReducer(state, action)
    expect(result.selectedElementId).toBeNull()
  })

  test("ページ選択は変更されない", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SELECT_ELEMENT", elementId: "el-2" }
    const result = editorReducer(state, action)
    expect(result.selectedPageId).toBe("page-1")
  })
})

describe("SET_EDITOR_MODE", () => {
  test("designモードに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_EDITOR_MODE", mode: "design" }
    const result = editorReducer(state, action)
    expect(result.editorMode).toBe("design")
  })

  test("dataモードに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_EDITOR_MODE", mode: "data" }
    const result = editorReducer(state, action)
    expect(result.editorMode).toBe("data")
  })

  test("animationモードに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_EDITOR_MODE", mode: "animation" }
    const result = editorReducer(state, action)
    expect(result.editorMode).toBe("animation")
  })
})

describe("SET_VIEW_MODE", () => {
  test("fitモードに設定する", () => {
    const state = createInitialState()
    state.viewMode = "scroll"
    const action: EditorAction = { type: "SET_VIEW_MODE", mode: "fit" }
    const result = editorReducer(state, action)
    expect(result.viewMode).toBe("fit")
  })

  test("scrollモードに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_VIEW_MODE", mode: "scroll" }
    const result = editorReducer(state, action)
    expect(result.viewMode).toBe("scroll")
  })
})

describe("SET_DEVICE_WIDTH", () => {
  test("デバイス幅を設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_DEVICE_WIDTH", width: 768 }
    const result = editorReducer(state, action)
    expect(result.deviceWidth).toBe(768)
  })

  test("小さい幅を設定できる", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_DEVICE_WIDTH", width: 320 }
    const result = editorReducer(state, action)
    expect(result.deviceWidth).toBe(320)
  })
})

describe("SET_LEFT_TAB", () => {
  test("pagesタブに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_LEFT_TAB", tab: "pages" }
    const result = editorReducer(state, action)
    expect(result.leftTab).toBe("pages")
  })

  test("componentsタブに設定する", () => {
    const state = createInitialState()
    const action: EditorAction = { type: "SET_LEFT_TAB", tab: "components" }
    const result = editorReducer(state, action)
    expect(result.leftTab).toBe("components")
  })
})

describe("UPDATE_PAGE_HTML", () => {
  test("ページのHTMLを更新する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "UPDATE_PAGE_HTML",
      pageId: "page-1",
      html: "<main>Updated</main>",
    }
    const result = editorReducer(state, action)
    const page = result.pages.find((p) => p.id === "page-1")
    expect(page?.html).toBe("<main>Updated</main>")
  })

  test("他のページは変更されない", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "UPDATE_PAGE_HTML",
      pageId: "page-1",
      html: "<main>Updated</main>",
    }
    const result = editorReducer(state, action)
    const page = result.pages.find((p) => p.id === "page-2")
    expect(page?.html).toBe("<main>About</main>")
  })
})

describe("UPDATE_PAGE_PATH", () => {
  test("ページのパスを更新する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "UPDATE_PAGE_PATH",
      pageId: "page-2",
      path: "/about-us",
    }
    const result = editorReducer(state, action)
    const page = result.pages.find((p) => p.id === "page-2")
    expect(page?.path).toBe("/about-us")
  })
})

describe("BIND_FIELD", () => {
  test("フィールドをバインドする", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "BIND_FIELD",
      pageId: "page-1",
      elementId: "el-1",
      fieldId: "title",
    }
    const result = editorReducer(state, action)
    const page = result.pages.find((p) => p.id === "page-1")
    expect(page?.bindings?.["el-1"]).toBe("title")
  })

  test("既存のバインディングを上書きする", () => {
    const state = createInitialState()
    const page = state.pages.find((p) => p.id === "page-1") as Page
    page.bindings = { "el-1": "old-field" }

    const action: EditorAction = {
      type: "BIND_FIELD",
      pageId: "page-1",
      elementId: "el-1",
      fieldId: "new-field",
    }
    const result = editorReducer(state, action)
    const resultPage = result.pages.find((p) => p.id === "page-1")
    expect(resultPage?.bindings?.["el-1"]).toBe("new-field")
  })
})

describe("UNBIND_FIELD", () => {
  test("フィールドのバインドを解除する", () => {
    const state = createInitialState()
    const page = state.pages.find((p) => p.id === "page-1") as Page
    page.bindings = { "el-1": "title", "el-2": "content" }

    const action: EditorAction = {
      type: "UNBIND_FIELD",
      pageId: "page-1",
      elementId: "el-1",
    }
    const result = editorReducer(state, action)
    const resultPage = result.pages.find((p) => p.id === "page-1")
    expect(resultPage?.bindings?.["el-1"]).toBeUndefined()
    expect(resultPage?.bindings?.["el-2"]).toBe("content")
  })
})

describe("SET_DATA_LIST", () => {
  test("データリスト設定を追加する", () => {
    const state = createInitialState()
    const config = {
      elementId: "template-1",
      sourceId: "posts",
      mode: "list" as const,
      limit: 10,
    }
    const action: EditorAction = {
      type: "SET_DATA_LIST",
      pageId: "page-1",
      config,
    }
    const result = editorReducer(state, action)
    const page = result.pages.find((p) => p.id === "page-1")
    expect(page?.dataListConfig).toEqual(config)
  })
})

describe("REMOVE_DATA_LIST", () => {
  test("データリスト設定を削除する", () => {
    const state = createInitialState()
    const page = state.pages.find((p) => p.id === "page-1") as Page
    page.dataListConfig = {
      elementId: "template-1",
      sourceId: "posts",
      limit: 10,
    }
    page.bindings = { "el-1": "title" }

    const action: EditorAction = {
      type: "REMOVE_DATA_LIST",
      pageId: "page-1",
    }
    const result = editorReducer(state, action)
    const resultPage = result.pages.find((p) => p.id === "page-1")
    expect(resultPage?.dataListConfig).toBeNull()
    expect(resultPage?.bindings).toEqual({})
  })
})

describe("ADD_PAGE", () => {
  test("ルートページを追加する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "ADD_PAGE",
      name: "contact",
      parentId: null,
    }
    const result = editorReducer(state, action)
    expect(result.pages.length).toBe(3)
    const newPage = result.pages[2]
    expect(newPage.name).toBe("contact")
    expect(newPage.path).toBe("/contact")
    expect(newPage.parentId).toBeNull()
  })

  test("子ページを追加する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "ADD_PAGE",
      name: "team",
      parentId: "page-2",
    }
    const result = editorReducer(state, action)
    const newPage = result.pages[2]
    expect(newPage.name).toBe("team")
    expect(newPage.path).toBe("/about/team")
    expect(newPage.parentId).toBe("page-2")
  })

  test("indexページを追加する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "ADD_PAGE",
      name: "index",
      parentId: null,
    }
    const result = editorReducer(state, action)
    const newPage = result.pages[2]
    expect(newPage.name).toBe("index")
    expect(newPage.path).toBe("/")
  })
})

describe("DELETE_PAGE", () => {
  test("ページを削除する", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "DELETE_PAGE",
      pageId: "page-2",
    }
    const result = editorReducer(state, action)
    expect(result.pages.length).toBe(1)
    expect(result.pages[0].id).toBe("page-1")
  })

  test("選択中のページを削除すると選択がクリアされる", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "DELETE_PAGE",
      pageId: "page-1",
    }
    const result = editorReducer(state, action)
    expect(result.selectedPageId).toBeNull()
  })

  test("非選択のページを削除しても選択は変わらない", () => {
    const state = createInitialState()
    const action: EditorAction = {
      type: "DELETE_PAGE",
      pageId: "page-2",
    }
    const result = editorReducer(state, action)
    expect(result.selectedPageId).toBe("page-1")
  })
})

describe("unknown action", () => {
  test("不明なアクションは状態を変更しない", () => {
    const state = createInitialState()
    const action = { type: "UNKNOWN" } as unknown as EditorAction
    const result = editorReducer(state, action)
    expect(result).toEqual(state)
  })
})
