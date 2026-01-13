import { describe, expect, test } from "bun:test"
import { dataSources, getDataSourceById } from "./data-sources"

describe("getDataSourceById", () => {
  test("存在するIDでデータソースを取得する", () => {
    const result = getDataSourceById("posts")
    expect(result).toBeDefined()
    expect(result?.name).toBe("お知らせ")
  })

  test("worksを取得する", () => {
    const result = getDataSourceById("works")
    expect(result).toBeDefined()
    expect(result?.name).toBe("実績紹介")
  })

  test("membersを取得する", () => {
    const result = getDataSourceById("members")
    expect(result).toBeDefined()
    expect(result?.name).toBe("チームメンバー")
  })

  test("存在しないIDはundefinedを返す", () => {
    const result = getDataSourceById("nonexistent")
    expect(result).toBeUndefined()
  })

  test("空文字列はundefinedを返す", () => {
    const result = getDataSourceById("")
    expect(result).toBeUndefined()
  })
})

describe("dataSources", () => {
  test("3つのデータソースが存在する", () => {
    expect(dataSources).toHaveLength(3)
  })

  test("各データソースにフィールドが存在する", () => {
    for (const source of dataSources) {
      expect(source.fields.length).toBeGreaterThan(0)
    }
  })

  test("各データソースにサンプルデータが存在する", () => {
    for (const source of dataSources) {
      expect(source.sampleData.length).toBeGreaterThan(0)
    }
  })

  test("postsのフィールドにtitleが含まれる", () => {
    const posts = getDataSourceById("posts")
    const titleField = posts?.fields.find((f) => f.id === "title")
    expect(titleField).toBeDefined()
    expect(titleField?.name).toBe("タイトル")
  })

  test("postsのサンプルデータにtitleフィールドが存在する", () => {
    const posts = getDataSourceById("posts")
    expect(posts?.sampleData[0]).toHaveProperty("title")
  })
})
