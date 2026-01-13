import { useSyncExternalStore } from "react"

type MessageData = {
  type: string
  id?: string
  [key: string]: unknown
}

type Listener = (data: MessageData) => void

const listeners = new Set<Listener>()
let isSetup = false

function setupGlobalListener() {
  if (isSetup) return
  isSetup = true

  window.addEventListener("message", (event: MessageEvent) => {
    if (event.data && typeof event.data === "object" && event.data.type) {
      for (const listener of listeners) {
        listener(event.data)
      }
    }
  })
}

function subscribe(listener: Listener): () => void {
  setupGlobalListener()
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/**
 * iframeからのpostMessageを受け取るフック
 */
export function useMessageListener(onMessage: Listener): void {
  useSyncExternalStore(
    (onStoreChange) => {
      const wrappedListener = (data: MessageData) => {
        onMessage(data)
        onStoreChange()
      }
      return subscribe(wrappedListener)
    },
    () => null,
    () => null,
  )
}
