import { displayClasses } from "./constants"

/**
 * クラス文字列からディスプレイ系のクラスを抽出
 */
export function extractDisplayClass(classString: string): string | null {
  const classes = classString.split(" ").filter(Boolean)
  const found = classes.find((cls) => displayClasses.includes(cls))
  return found || null
}
