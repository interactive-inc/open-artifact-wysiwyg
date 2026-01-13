import { PageInfoPanel } from "@/components/page-info-panel"
import { StylePanel } from "@/components/style-panel"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DataBindings, DataListConfig, DomNode } from "@/lib/types"

type EditorMode = "design" | "data" | "animation"

type Props = {
  selectedPageId: string | null
  pagePath: string
  selectedElementId: string | null
  selectedNode: DomNode | null
  html: string
  onHtmlChange: (html: string) => void
  onSelectChange: (id: string | null) => void
  mode: EditorMode
  onModeChange: (mode: EditorMode) => void
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  isInDataListScope: boolean
  onBindField: (elementId: string, fieldId: string) => void
  onUnbindField: (elementId: string) => void
  onSetDataList: (config: DataListConfig) => void
  onRemoveDataList: () => void
}

/**
 * 右サイドバー
 */
export function RightSidebar(props: Props) {
  if (props.selectedElementId && props.selectedNode) {
    return (
      <Tabs
        value={props.mode}
        onValueChange={(v) => props.onModeChange(v as EditorMode)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
          <TabsList className="mx-2 mt-2 w-auto shrink-0">
            <TabsTrigger value="design">STYLE</TabsTrigger>
            <TabsTrigger value="data">DATA</TabsTrigger>
            <TabsTrigger value="animation">MOTION</TabsTrigger>
          </TabsList>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            <StylePanel
              html={props.html}
              pagePath={props.pagePath}
              selectedId={props.selectedElementId}
              node={props.selectedNode}
              onChange={props.onHtmlChange}
              onSelectChange={props.onSelectChange}
              mode={props.mode}
              bindings={props.bindings}
              dataListConfig={props.dataListConfig}
              isInDataListScope={props.isInDataListScope}
              onBindField={props.onBindField}
              onUnbindField={props.onUnbindField}
              onSetDataList={props.onSetDataList}
              onRemoveDataList={props.onRemoveDataList}
            />
          </div>
        </Card>
      </Tabs>
    )
  }

  if (props.selectedPageId) {
    return (
      <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          <PageInfoPanel
            pageId={props.selectedPageId}
            pagePath={props.pagePath}
          />
        </div>
      </Card>
    )
  }

  return (
    <Card className="flex min-h-0 flex-1 flex-col gap-0 overflow-hidden p-0">
      <div className="flex flex-1 items-center justify-center p-2 text-muted-foreground text-sm">
        ページを選択してください
      </div>
    </Card>
  )
}
