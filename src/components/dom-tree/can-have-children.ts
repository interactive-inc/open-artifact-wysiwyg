import { voidElements } from "./constants"

/**
 * 要素が子を持てるかどうか判定
 */
export function canHaveChildren(tag: string): boolean {
  return !voidElements.includes(tag.toLowerCase())
}
