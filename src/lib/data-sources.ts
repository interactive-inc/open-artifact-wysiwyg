/**
 * データソース定義
 *
 * WYSIWYGエディタで使用可能なデータソースを定義する。
 * 各データソースはフィールドとサンプルデータを持ち、
 * テンプレート要素にバインドしてプレビュー表示に使用される。
 */

import type { LucideIcon } from "lucide-react"
import { Calendar, Image, Link, Type } from "lucide-react"

/**
 * データフィールドの定義
 * id: フィールドの識別子（title, thumbnailなど）
 * name: UIに表示する日本語名
 * icon: フィールドタイプを示すアイコン
 */
export type DataField = {
  id: string
  name: string
  icon: LucideIcon
}

/**
 * サンプルデータの型（フィールドID→値のマッピング）
 */
export type SampleData = Record<string, string>

/**
 * データソースの定義
 * id: データソースの識別子（posts, works, membersなど）
 * name: UIに表示する日本語名
 * fields: バインド可能なフィールドの配列
 * sampleData: プレビュー表示用のサンプルデータ
 */
export type DataSource = {
  id: string
  name: string
  fields: DataField[]
  sampleData: SampleData[]
}

/**
 * 利用可能なデータソース一覧
 */
export const dataSources: DataSource[] = [
  {
    id: "posts",
    name: "お知らせ",
    fields: [
      { id: "title", name: "タイトル", icon: Type },
      { id: "excerpt", name: "抜粋", icon: Type },
      { id: "thumbnail", name: "サムネイル", icon: Image },
      { id: "publishedAt", name: "公開日", icon: Calendar },
      { id: "slug", name: "スラッグ", icon: Link },
    ],
    sampleData: [
      {
        title: "新機能リリースのお知らせ",
        excerpt: "待望の新機能がついにリリースされました。詳細はこちら...",
        thumbnail: "https://picsum.photos/seed/post1/400/200",
        publishedAt: "2024-01-15",
        slug: "new-feature-release",
      },
      {
        title: "イベント開催決定",
        excerpt: "来月のカンファレンスに参加します。ぜひお越しください...",
        thumbnail: "https://picsum.photos/seed/post2/400/200",
        publishedAt: "2024-01-10",
        slug: "event-announcement",
      },
      {
        title: "メンテナンス予定",
        excerpt: "システムメンテナンスを実施します。ご不便をおかけします...",
        thumbnail: "https://picsum.photos/seed/post3/400/200",
        publishedAt: "2024-01-05",
        slug: "maintenance-notice",
      },
    ],
  },
  {
    id: "works",
    name: "実績紹介",
    fields: [
      { id: "title", name: "タイトル", icon: Type },
      { id: "image", name: "画像", icon: Image },
      { id: "client", name: "クライアント", icon: Type },
    ],
    sampleData: [
      {
        title: "コーポレートサイトリニューアル",
        image: "https://picsum.photos/seed/work1/400/300",
        client: "株式会社ABC",
      },
      {
        title: "ECサイト構築",
        image: "https://picsum.photos/seed/work2/400/300",
        client: "DEF合同会社",
      },
    ],
  },
  {
    id: "members",
    name: "チームメンバー",
    fields: [
      { id: "name", name: "名前", icon: Type },
      { id: "role", name: "役職", icon: Type },
      { id: "avatar", name: "アバター", icon: Image },
    ],
    sampleData: [
      {
        name: "田中 太郎",
        role: "CEO",
        avatar: "https://picsum.photos/seed/member1/100/100",
      },
      {
        name: "鈴木 花子",
        role: "CTO",
        avatar: "https://picsum.photos/seed/member2/100/100",
      },
      {
        name: "佐藤 次郎",
        role: "Designer",
        avatar: "https://picsum.photos/seed/member3/100/100",
      },
    ],
  },
]

/**
 * IDからデータソースを取得
 */
export function getDataSourceById(id: string): DataSource | undefined {
  return dataSources.find((source) => source.id === id)
}
