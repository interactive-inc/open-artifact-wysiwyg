import { type ReactNode, useEffect, useState } from "react"

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * クライアントサイドでのみ子要素をレンダリングするコンポーネント
 * SSR時はfallbackを表示し、ハイドレーション後に子要素を表示
 */
export function ClientOnly(props: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return props.fallback ?? null
  }

  return props.children
}
