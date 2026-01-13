import { Blocks, FileText, Home, MessageCircle, Rocket } from "lucide-react"
import { PageTree } from "@/components/page-tree/page-tree"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { type LeftTab, useEditor } from "@/lib/editor"

const tabs: { id: LeftTab; icon: typeof Home }[] = [
  { id: "home", icon: Home },
  { id: "pages", icon: FileText },
  { id: "components", icon: Blocks },
  { id: "publish", icon: Rocket },
  { id: "chat", icon: MessageCircle },
]

/**
 * エディタの左サイドバー
 */
export function EditorLeftSidebar() {
  const { state, dispatch } = useEditor()

  return (
    <Sidebar variant="inset" collapsible="offExamples">
      <SidebarHeader className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row gap-1">
            {tabs.map((tab) => (
              <SidebarMenuButton
                key={tab.id}
                isActive={state.leftTab === tab.id}
                onClick={() => dispatch({ type: "SET_LEFT_TAB", tab: tab.id })}
                className="flex-1 justify-center"
              >
                <tab.icon size={14} />
              </SidebarMenuButton>
            ))}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            {state.leftTab === "home" && (
              <div className="p-2 text-muted-foreground text-sm">
                ホーム（実装予定）
              </div>
            )}
            {state.leftTab === "pages" && <PageTree />}
            {state.leftTab === "components" && (
              <div className="p-2 text-muted-foreground text-sm">
                コンポーネント一覧（実装予定）
              </div>
            )}
            {state.leftTab === "publish" && (
              <div className="p-2 text-muted-foreground text-sm">
                公開設定（実装予定）
              </div>
            )}
            {state.leftTab === "chat" && (
              <div className="p-2 text-muted-foreground text-sm">
                チャット（実装予定）
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
