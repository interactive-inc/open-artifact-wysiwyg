import { describe, expect, test } from "bun:test"
import {
  buildColorClass,
  getActiveClass,
  parseColorClass,
  replaceColorClass,
  toggleClass,
} from "./class-utils"
import type { ClassGroup } from "./tailwind-classes"

const fontWeightGroup: ClassGroup = {
  name: "Weight",
  prefix: "font-",
  options: ["font-normal", "font-medium", "font-semibold", "font-bold"],
  multiple: false,
}

const displayGroup: ClassGroup = {
  name: "Display",
  prefix: "",
  options: ["block", "inline-block", "flex", "grid", "hidden"],
  multiple: false,
}

describe("getActiveClass", () => {
  test("マッチするクラスを返す", () => {
    const result = getActiveClass("p-4 font-bold text-lg", fontWeightGroup)
    expect(result).toBe("font-bold")
  })

  test("マッチしない場合はnullを返す", () => {
    const result = getActiveClass("p-4 text-lg", fontWeightGroup)
    expect(result).toBeNull()
  })

  test("複数マッチする場合は最初のものを返す", () => {
    const result = getActiveClass(
      "font-normal font-bold text-lg",
      fontWeightGroup,
    )
    expect(result).toBe("font-normal")
  })

  test("空文字列の場合はnullを返す", () => {
    const result = getActiveClass("", fontWeightGroup)
    expect(result).toBeNull()
  })

  test("prefixなしのグループでも動作する", () => {
    const result = getActiveClass("p-4 flex items-center", displayGroup)
    expect(result).toBe("flex")
  })
})

describe("toggleClass", () => {
  test("クラスを追加する", () => {
    const result = toggleClass("p-4 text-lg", "font-bold", fontWeightGroup)
    expect(result).toBe("p-4 text-lg font-bold")
  })

  test("同グループの既存クラスを置き換える", () => {
    const result = toggleClass(
      "p-4 font-normal text-lg",
      "font-bold",
      fontWeightGroup,
    )
    expect(result).toBe("p-4 text-lg font-bold")
  })

  test("既に選択されているクラスを削除する", () => {
    const result = toggleClass(
      "p-4 font-bold text-lg",
      "font-bold",
      fontWeightGroup,
    )
    expect(result).toBe("p-4 text-lg")
  })

  test("空文字列にクラスを追加する", () => {
    const result = toggleClass("", "font-bold", fontWeightGroup)
    expect(result).toBe("font-bold")
  })
})

describe("parseColorClass", () => {
  test("色と濃度をパースする", () => {
    const result = parseColorClass("p-4 text-gray-500 bg-white", "text-")
    expect(result).toEqual({ hue: "gray", shade: "500" })
  })

  test("blackをパースする", () => {
    const result = parseColorClass("text-black p-4", "text-")
    expect(result).toEqual({ hue: "black", shade: null })
  })

  test("whiteをパースする", () => {
    const result = parseColorClass("bg-white p-4", "bg-")
    expect(result).toEqual({ hue: "white", shade: null })
  })

  test("マッチしない場合はnullを返す", () => {
    const result = parseColorClass("p-4 flex", "text-")
    expect(result).toEqual({ hue: null, shade: null })
  })

  test("異なるprefixはマッチしない", () => {
    const result = parseColorClass("bg-red-500 p-4", "text-")
    expect(result).toEqual({ hue: null, shade: null })
  })
})

describe("buildColorClass", () => {
  test("色と濃度からクラスを生成する", () => {
    const result = buildColorClass("text-", "gray", "500")
    expect(result).toBe("text-gray-500")
  })

  test("blackの場合は濃度なし", () => {
    const result = buildColorClass("text-", "black", null)
    expect(result).toBe("text-black")
  })

  test("whiteの場合は濃度なし", () => {
    const result = buildColorClass("bg-", "white", null)
    expect(result).toBe("bg-white")
  })

  test("hueがnullの場合はnullを返す", () => {
    const result = buildColorClass("text-", null, "500")
    expect(result).toBeNull()
  })

  test("通常色でshadeがnullの場合はnullを返す", () => {
    const result = buildColorClass("text-", "gray", null)
    expect(result).toBeNull()
  })
})

describe("replaceColorClass", () => {
  test("色クラスを置換する", () => {
    const result = replaceColorClass(
      "p-4 text-gray-500 flex",
      "text-",
      "red",
      "600",
    )
    expect(result).toBe("p-4 flex text-red-600")
  })

  test("blackに置換する", () => {
    const result = replaceColorClass(
      "text-gray-500 p-4",
      "text-",
      "black",
      null,
    )
    expect(result).toBe("p-4 text-black")
  })

  test("既存の色クラスがない場合は追加する", () => {
    const result = replaceColorClass("p-4 flex", "text-", "blue", "400")
    expect(result).toBe("p-4 flex text-blue-400")
  })

  test("hueがnullの場合は色クラスを削除する", () => {
    const result = replaceColorClass(
      "p-4 text-gray-500 flex",
      "text-",
      null,
      null,
    )
    expect(result).toBe("p-4 flex")
  })

  test("blackからgrayに置換する", () => {
    const result = replaceColorClass("text-black p-4", "text-", "gray", "700")
    expect(result).toBe("p-4 text-gray-700")
  })
})
