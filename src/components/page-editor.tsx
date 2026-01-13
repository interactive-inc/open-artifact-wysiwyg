import { EditorLeftSidebar } from "@/components/editor/editor-left-sidebar"
import { EditorPreview } from "@/components/editor/editor-preview"
import { EditorRightPanel } from "@/components/editor/editor-right-panel"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useMessageListener } from "@/hooks/use-message-listener"
import { EditorProvider, useEditor } from "@/lib/editor"

type Props = {
  pageId: string
}

/**
 * メッセージリスナーでiframe内の選択を同期
 */
function EditorMessageSync() {
  const { dispatch } = useEditor()

  useMessageListener((data) => {
    if (data.type === "select") {
      dispatch({ type: "SELECT_ELEMENT", elementId: data.id as string })
    }
  })

  return null
}

/**
 * エディタの内部レイアウト
 */
function EditorLayout() {
  return (
    <SidebarProvider className="h-screen">
      <EditorMessageSync />
      <EditorLeftSidebar />
      <SidebarInset className="flex flex-row gap-2 overflow-hidden p-2">
        <EditorPreview />
        <EditorRightPanel />
      </SidebarInset>
    </SidebarProvider>
  )
}

/**
 * ページエディタのメインコンポーネント
 */
export function PageEditor(_props: Props) {
  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  )
}
