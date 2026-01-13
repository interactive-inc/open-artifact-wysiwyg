import { describe, expect, test } from "bun:test"
import {
  type ClassGroup,
  type ColorClassGroup,
  getElementPattern,
  isColorGroup,
  isSliderGroup,
  type SliderClassGroup,
} from "./tailwind-classes"

const normalGroup: ClassGroup = {
  name: "Display",
  prefix: "",
  options: ["block", "flex"],
  multiple: false,
}

const colorGroup: ColorClassGroup = {
  name: "Text",
  prefix: "text-",
  type: "color",
}

const sliderGroup: SliderClassGroup = {
  name: "Padding",
  prefix: "p-",
  type: "slider",
  options: ["p-0", "p-1", "p-2", "p-4"],
}

describe("isColorGroup", () => {
  test("ColorClassGroupの場合はtrueを返す", () => {
    expect(isColorGroup(colorGroup)).toBe(true)
  })

  test("SliderClassGroupの場合はfalseを返す", () => {
    expect(isSliderGroup(colorGroup)).toBe(false)
  })

  test("ClassGroupの場合はfalseを返す", () => {
    expect(isColorGroup(normalGroup)).toBe(false)
  })
})

describe("isSliderGroup", () => {
  test("SliderClassGroupの場合はtrueを返す", () => {
    expect(isSliderGroup(sliderGroup)).toBe(true)
  })

  test("ColorClassGroupの場合はfalseを返す", () => {
    expect(isSliderGroup(colorGroup)).toBe(false)
  })

  test("ClassGroupの場合はfalseを返す", () => {
    expect(isSliderGroup(normalGroup)).toBe(false)
  })
})

describe("getElementPattern", () => {
  test("template要素は空のカテゴリを返す", () => {
    const result = getElementPattern("template")
    expect(result.categories).toEqual([])
  })

  test("p要素はテキストパターンを返す", () => {
    const result = getElementPattern("p")
    expect(result.categories).toContain("typography")
    expect(result.categories).toContain("color")
  })

  test("span要素はテキストパターンを返す", () => {
    const result = getElementPattern("span")
    expect(result.categories).toContain("typography")
  })

  test("h1要素はテキストパターンを返す", () => {
    const result = getElementPattern("h1")
    expect(result.categories).toContain("typography")
  })

  test("a要素はテキストパターンを返す", () => {
    const result = getElementPattern("a")
    expect(result.categories).toContain("typography")
  })

  test("button要素はテキストパターンを返す", () => {
    const result = getElementPattern("button")
    expect(result.categories).toContain("typography")
  })

  test("img要素は画像パターンを返す", () => {
    const result = getElementPattern("img")
    expect(result.categories).toContain("image")
    expect(result.categories).toContain("effects")
  })

  test("div要素はコンテナパターンを返す", () => {
    const result = getElementPattern("div")
    expect(result.categories).toContain("spacing")
    expect(result.categories).toContain("layout")
  })

  test("section要素はコンテナパターンを返す", () => {
    const result = getElementPattern("section")
    expect(result.categories).toContain("spacing")
    expect(result.categories).toContain("layout")
  })

  test("不明な要素はコンテナパターンを返す", () => {
    const result = getElementPattern("custom-element")
    expect(result.categories).toContain("spacing")
  })
})
