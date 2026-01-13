import { Maximize2, Minimize2 } from "lucide-react"
import { EditorCanvas } from "@/components/editor-canvas"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useEditor } from "@/lib/editor"
import { parseHtmlWithIds } from "@/lib/html-parser"

const BREAKPOINTS = [
  { label: "sm", width: 640 },
  { label: "md", width: 768 },
  { label: "lg", width: 1024 },
] as const

const MIN_WIDTH = 256
const MAX_WIDTH = 1024
const STEP = 64

/**
 * エディタのプレビューエリア
 */
export function EditorPreview() {
  const { state, dispatch, currentPage } = useEditor()

  const html = currentPage?.html ?? ""
  const parseResult = parseHtmlWithIds(html)
  const htmlWithIds = parseResult.html

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-hidden">
      <div className="flex items-center gap-2">
        <ToggleGroup
          variant="outline"
          value={BREAKPOINTS.filter((bp) => bp.width === state.deviceWidth).map(
            (bp) => bp.label,
          )}
          onValueChange={(values) => {
            const label = values[0]
            const bp = BREAKPOINTS.find((b) => b.label === label)
            if (bp) {
              dispatch({ type: "SET_DEVICE_WIDTH", width: bp.width })
            }
          }}
        >
          {BREAKPOINTS.map((bp) => (
            <ToggleGroupItem key={bp.label} value={bp.label}>
              {bp.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <span className="min-w-max font-mono">
          {String(state.deviceWidth).padStart(4, "0")}px
        </span>
        <Slider
          value={[state.deviceWidth]}
          onValueChange={(value) => {
            const v = Array.isArray(value) ? value[0] : value
            dispatch({ type: "SET_DEVICE_WIDTH", width: v })
          }}
          min={MIN_WIDTH}
          max={MAX_WIDTH}
          step={STEP}
          className="flex-1"
        />
        <Button
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "SET_VIEW_MODE",
              mode: state.viewMode === "fit" ? "scroll" : "fit",
            })
          }
        >
          {state.viewMode === "fit" ? (
            <Maximize2 size={14} />
          ) : (
            <Minimize2 size={14} />
          )}
        </Button>
      </div>
      <Card className="flex flex-1 justify-center overflow-y-auto p-0">
        <EditorCanvas
          html={htmlWithIds}
          selectedId={state.selectedElementId}
          bindings={currentPage?.bindings ?? {}}
          dataListConfig={currentPage?.dataListConfig ?? null}
          deviceWidth={state.deviceWidth}
          viewMode={state.viewMode}
        />
      </Card>
    </div>
  )
}
