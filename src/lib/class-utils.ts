import type { ClassGroup, ColorHue, ColorShade } from "@/lib/tailwind-classes"
import { colorHues, colorShades } from "@/lib/tailwind-classes"

/**
 * クラス文字列から特定グループに属するクラスを取得
 */
export function getActiveClass(
  classes: string,
  group: ClassGroup,
): string | null {
  const classList = classes.split(/\s+/).filter(Boolean)
  return classList.find((c) => group.options.includes(c)) ?? null
}

/**
 * クラスをトグル（排他グループの場合は置き換え）
 */
export function toggleClass(
  classes: string,
  targetClass: string,
  group: ClassGroup,
): string {
  const classList = classes.split(/\s+/).filter(Boolean)

  // 同グループの既存クラスを削除
  const filtered = classList.filter((c) => !group.options.includes(c))

  // 既に選択されていた場合は削除のみ
  if (classList.includes(targetClass)) {
    return filtered.join(" ")
  }

  // 新しいクラスを追加
  return [...filtered, targetClass].join(" ")
}

type ParsedColor = {
  hue: ColorHue | null
  shade: ColorShade | null
}

/**
 * クラス文字列から色クラスをパース
 * 例: "text-gray-500 p-4" → { hue: "gray", shade: "500" } (prefix="text-"の場合)
 */
export function parseColorClass(classes: string, prefix: string): ParsedColor {
  const classList = classes.split(/\s+/).filter(Boolean)

  for (const cls of classList) {
    if (!cls.startsWith(prefix)) continue

    const rest = cls.slice(prefix.length)

    // black/white は shade なし
    if (rest === "black" || rest === "white") {
      return { hue: rest as ColorHue, shade: null }
    }

    // gray-500 などをパース
    const parts = rest.split("-")
    if (parts.length === 2) {
      const hue = parts[0] as ColorHue
      const shade = parts[1] as ColorShade
      if (colorHues.includes(hue) && colorShades.includes(shade)) {
        return { hue, shade }
      }
    }
  }

  return { hue: null, shade: null }
}

/**
 * 色クラスを生成
 */
export function buildColorClass(
  prefix: string,
  hue: ColorHue | null,
  shade: ColorShade | null,
): string | null {
  if (!hue) return null
  if (hue === "black" || hue === "white") {
    return `${prefix}${hue}`
  }
  if (!shade) return null
  return `${prefix}${hue}-${shade}`
}

/**
 * クラス文字列の色クラスを置換
 */
export function replaceColorClass(
  classes: string,
  prefix: string,
  newHue: ColorHue | null,
  newShade: ColorShade | null,
): string {
  const classList = classes.split(/\s+/).filter(Boolean)

  // 既存の色クラスを削除
  const filtered = classList.filter((cls) => {
    if (!cls.startsWith(prefix)) return true
    const rest = cls.slice(prefix.length)
    if (rest === "black" || rest === "white") return false
    const parts = rest.split("-")
    if (parts.length === 2) {
      const hue = parts[0] as ColorHue
      const shade = parts[1] as ColorShade
      if (colorHues.includes(hue) && colorShades.includes(shade)) {
        return false
      }
    }
    return true
  })

  // 新しい色クラスを追加
  const newClass = buildColorClass(prefix, newHue, newShade)
  if (newClass) {
    filtered.push(newClass)
  }

  return filtered.join(" ")
}
