import { z } from "zod/v4"

/**
 * コンポーネント定義のスキーマ
 */
export const ComponentSchema = z.object({
  id: z.string(),
  name: z.string(),
  html: z.string(),
})

export type Component = z.infer<typeof ComponentSchema>

/**
 * データバインディングのスキーマ
 */
export const DataBindingsSchema = z.record(z.string(), z.string())

export type DataBindings = z.infer<typeof DataBindingsSchema>

/**
 * フィルタ条件のスキーマ
 */
export const FilterSchema = z.object({
  field: z.string(),
  paramName: z.string(),
})

export type Filter = z.infer<typeof FilterSchema>

/**
 * データリスト設定のスキーマ
 */
export const DataListConfigSchema = z.object({
  elementId: z.string(),
  sourceId: z.string(),
  mode: z.enum(["list", "detail"]).optional(),
  limit: z.number(),
  filters: z.array(FilterSchema).optional(),
  previewIndex: z.number().optional(),
})

export type DataListConfig = z.infer<typeof DataListConfigSchema>

/**
 * ページ定義のスキーマ
 */
export const PageSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  html: z.string(),
  parentId: z.string().nullable(),
  dataListConfig: DataListConfigSchema.nullable().optional(),
  bindings: DataBindingsSchema.optional(),
})

export type Page = z.infer<typeof PageSchema>

/**
 * エディタモード
 */
export const EditorModeSchema = z.enum(["design", "data", "animation"])

export type EditorMode = z.infer<typeof EditorModeSchema>

/**
 * ビューモード
 */
export const ViewModeSchema = z.enum(["fit", "scroll"])

export type ViewMode = z.infer<typeof ViewModeSchema>

/**
 * 左サイドバーのタブ
 */
export const LeftTabSchema = z.enum([
  "home",
  "pages",
  "components",
  "publish",
  "chat",
])

export type LeftTab = z.infer<typeof LeftTabSchema>

/**
 * エディタの状態全体のスキーマ
 */
export const EditorStateSchema = z.object({
  // データ
  pages: z.array(PageSchema),
  components: z.array(ComponentSchema),

  // 選択状態
  selectedPageId: z.string().nullable(),
  selectedElementId: z.string().nullable(),

  // UI状態
  editorMode: EditorModeSchema,
  viewMode: ViewModeSchema,
  deviceWidth: z.number(),
  leftTab: LeftTabSchema,
})

export type EditorState = z.infer<typeof EditorStateSchema>
