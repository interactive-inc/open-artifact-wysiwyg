import { describe, expect, test } from "bun:test"
import {
  ComponentSchema,
  DataBindingsSchema,
  DataListConfigSchema,
  EditorModeSchema,
  EditorStateSchema,
  FilterSchema,
  LeftTabSchema,
  PageSchema,
  ViewModeSchema,
} from "./schema"

describe("ComponentSchema", () => {
  test("有効なコンポーネントをパースする", () => {
    const data = {
      id: "comp-1",
      name: "Button",
      html: "<button>Click</button>",
    }
    const result = ComponentSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("idがないとエラー", () => {
    const data = {
      name: "Button",
      html: "<button>Click</button>",
    }
    const result = ComponentSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  test("nameがないとエラー", () => {
    const data = {
      id: "comp-1",
      html: "<button>Click</button>",
    }
    const result = ComponentSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("DataBindingsSchema", () => {
  test("有効なバインディングをパースする", () => {
    const data = {
      "el-1": "title",
      "el-2": "content",
    }
    const result = DataBindingsSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("空オブジェクトは有効", () => {
    const result = DataBindingsSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  test("数値の値はエラー", () => {
    const data = {
      "el-1": 123,
    }
    const result = DataBindingsSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("FilterSchema", () => {
  test("有効なフィルタをパースする", () => {
    const data = {
      field: "slug",
      paramName: "id",
    }
    const result = FilterSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("fieldがないとエラー", () => {
    const data = {
      paramName: "id",
    }
    const result = FilterSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})

describe("DataListConfigSchema", () => {
  test("有効な設定をパースする", () => {
    const data = {
      elementId: "template-1",
      sourceId: "posts",
      mode: "list",
      limit: 10,
    }
    const result = DataListConfigSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("modeはオプショナル", () => {
    const data = {
      elementId: "template-1",
      sourceId: "posts",
      limit: 10,
    }
    const result = DataListConfigSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("modeはlistかdetailのみ", () => {
    const data = {
      elementId: "template-1",
      sourceId: "posts",
      mode: "invalid",
      limit: 10,
    }
    const result = DataListConfigSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  test("filtersを含む設定", () => {
    const data = {
      elementId: "template-1",
      sourceId: "posts",
      limit: 1,
      filters: [{ field: "slug", paramName: "id" }],
    }
    const result = DataListConfigSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("previewIndexを含む設定", () => {
    const data = {
      elementId: "template-1",
      sourceId: "posts",
      limit: 10,
      previewIndex: 2,
    }
    const result = DataListConfigSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})

describe("PageSchema", () => {
  test("有効なページをパースする", () => {
    const data = {
      id: "page-1",
      name: "home",
      path: "/",
      html: "<main>Home</main>",
      parentId: null,
    }
    const result = PageSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("parentIdが文字列の場合", () => {
    const data = {
      id: "page-2",
      name: "about",
      path: "/about",
      html: "<main>About</main>",
      parentId: "page-1",
    }
    const result = PageSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("dataListConfigを含むページ", () => {
    const data = {
      id: "page-1",
      name: "home",
      path: "/",
      html: "<main>Home</main>",
      parentId: null,
      dataListConfig: {
        elementId: "template-1",
        sourceId: "posts",
        limit: 10,
      },
    }
    const result = PageSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("bindingsを含むページ", () => {
    const data = {
      id: "page-1",
      name: "home",
      path: "/",
      html: "<main>Home</main>",
      parentId: null,
      bindings: { "el-1": "title" },
    }
    const result = PageSchema.safeParse(data)
    expect(result.success).toBe(true)
  })
})

describe("EditorModeSchema", () => {
  test("designは有効", () => {
    const result = EditorModeSchema.safeParse("design")
    expect(result.success).toBe(true)
  })

  test("dataは有効", () => {
    const result = EditorModeSchema.safeParse("data")
    expect(result.success).toBe(true)
  })

  test("animationは有効", () => {
    const result = EditorModeSchema.safeParse("animation")
    expect(result.success).toBe(true)
  })

  test("無効な値はエラー", () => {
    const result = EditorModeSchema.safeParse("invalid")
    expect(result.success).toBe(false)
  })
})

describe("ViewModeSchema", () => {
  test("fitは有効", () => {
    const result = ViewModeSchema.safeParse("fit")
    expect(result.success).toBe(true)
  })

  test("scrollは有効", () => {
    const result = ViewModeSchema.safeParse("scroll")
    expect(result.success).toBe(true)
  })

  test("無効な値はエラー", () => {
    const result = ViewModeSchema.safeParse("invalid")
    expect(result.success).toBe(false)
  })
})

describe("LeftTabSchema", () => {
  test("全ての有効なタブ", () => {
    const validTabs = ["home", "pages", "components", "publish", "chat"]
    for (const tab of validTabs) {
      const result = LeftTabSchema.safeParse(tab)
      expect(result.success).toBe(true)
    }
  })

  test("無効なタブはエラー", () => {
    const result = LeftTabSchema.safeParse("settings")
    expect(result.success).toBe(false)
  })
})

describe("EditorStateSchema", () => {
  test("有効なステートをパースする", () => {
    const data = {
      pages: [
        {
          id: "page-1",
          name: "home",
          path: "/",
          html: "<main>Home</main>",
          parentId: null,
        },
      ],
      components: [],
      selectedPageId: "page-1",
      selectedElementId: null,
      editorMode: "design",
      viewMode: "fit",
      deviceWidth: 1024,
      leftTab: "home",
    }
    const result = EditorStateSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("selectedPageIdがnullの場合", () => {
    const data = {
      pages: [],
      components: [],
      selectedPageId: null,
      selectedElementId: null,
      editorMode: "design",
      viewMode: "fit",
      deviceWidth: 1024,
      leftTab: "home",
    }
    const result = EditorStateSchema.safeParse(data)
    expect(result.success).toBe(true)
  })

  test("必須フィールドがないとエラー", () => {
    const data = {
      pages: [],
      components: [],
    }
    const result = EditorStateSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  test("deviceWidthが数値でないとエラー", () => {
    const data = {
      pages: [],
      components: [],
      selectedPageId: null,
      selectedElementId: null,
      editorMode: "design",
      viewMode: "fit",
      deviceWidth: "1024",
      leftTab: "home",
    }
    const result = EditorStateSchema.safeParse(data)
    expect(result.success).toBe(false)
  })
})
