import { describe, expect, test } from "bun:test"
import { findNodeById, isDescendantOf } from "./html-parser"
import type { DomNode } from "./types"

/**
 * テスト用のDomNodeツリーを作成
 */
function createTestTree(): DomNode[] {
  return [
    {
      id: "root",
      tag: "section",
      attributes: {},
      children: [
        {
          id: "child-1",
          tag: "div",
          attributes: { class: "container" },
          children: [
            {
              id: "grandchild-1",
              tag: "p",
              attributes: {},
              children: [],
              textContent: "Hello",
            },
            {
              id: "grandchild-2",
              tag: "span",
              attributes: {},
              children: [],
              textContent: "World",
            },
          ],
          textContent: null,
        },
        {
          id: "child-2",
          tag: "img",
          attributes: { src: "image.png" },
          children: [],
          textContent: null,
        },
      ],
      textContent: null,
    },
    {
      id: "sibling",
      tag: "footer",
      attributes: {},
      children: [],
      textContent: "Footer",
    },
  ]
}

describe("findNodeById", () => {
  const tree = createTestTree()

  test("ルートノードを検索する", () => {
    const result = findNodeById(tree, "root")
    expect(result).toBeDefined()
    expect(result?.tag).toBe("section")
  })

  test("子ノードを検索する", () => {
    const result = findNodeById(tree, "child-1")
    expect(result).toBeDefined()
    expect(result?.tag).toBe("div")
  })

  test("孫ノードを検索する", () => {
    const result = findNodeById(tree, "grandchild-1")
    expect(result).toBeDefined()
    expect(result?.tag).toBe("p")
    expect(result?.textContent).toBe("Hello")
  })

  test("兄弟ノードを検索する", () => {
    const result = findNodeById(tree, "sibling")
    expect(result).toBeDefined()
    expect(result?.tag).toBe("footer")
  })

  test("存在しないIDはnullを返す", () => {
    const result = findNodeById(tree, "nonexistent")
    expect(result).toBeNull()
  })

  test("空の配列はnullを返す", () => {
    const result = findNodeById([], "any")
    expect(result).toBeNull()
  })
})

describe("isDescendantOf", () => {
  const tree = createTestTree()
  const root = tree[0]

  test("自分自身はtrueを返す", () => {
    expect(isDescendantOf(root, "root")).toBe(true)
  })

  test("直接の子はtrueを返す", () => {
    expect(isDescendantOf(root, "child-1")).toBe(true)
    expect(isDescendantOf(root, "child-2")).toBe(true)
  })

  test("孫はtrueを返す", () => {
    expect(isDescendantOf(root, "grandchild-1")).toBe(true)
    expect(isDescendantOf(root, "grandchild-2")).toBe(true)
  })

  test("別のツリーの要素はfalseを返す", () => {
    expect(isDescendantOf(root, "sibling")).toBe(false)
  })

  test("存在しないIDはfalseを返す", () => {
    expect(isDescendantOf(root, "nonexistent")).toBe(false)
  })

  test("子ノードから検索した場合", () => {
    const child = root.children[0]
    expect(isDescendantOf(child, "grandchild-1")).toBe(true)
    expect(isDescendantOf(child, "child-2")).toBe(false)
  })
})
