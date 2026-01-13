import { useState } from "react"

/**
 * クライアントサイドかどうかを判定するフック
 * 初期値をクロージャで遅延評価してハイドレーションミスマッチを回避
 */
export function useIsClient(): boolean {
  const [isClient] = useState(() => typeof window !== "undefined")
  return isClient
}
