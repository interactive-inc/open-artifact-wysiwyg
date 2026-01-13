import {
  Check,
  ChevronDown,
  ChevronUp,
  Database,
  Link2,
  Trash2,
  Unlink,
} from "lucide-react"
import { useState } from "react"
import { ClassTabs } from "@/components/style-panel/class-tabs"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { dataSources, getDataSourceById } from "@/lib/data-sources"
import type { DataBindings, DataListConfig, DomNode } from "@/lib/types"

type Props = {
  html: string
  pagePath: string
  selectedId: string | null
  node: DomNode | null
  onChange: (html: string) => void
  onSelectChange: (id: string | null) => void
  mode: "design" | "data" | "animation"
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  isInDataListScope: boolean
  onBindField: (elementId: string, fieldId: string) => void
  onUnbindField: (elementId: string) => void
  onSetDataList: (config: DataListConfig) => void
  onRemoveDataList: () => void
}

/**
 * スタイル編集パネル
 */
export function StylePanel(props: Props) {
  if (!props.node || !props.selectedId) {
    return <div className="text-sm text-zinc-400">要素を選択してください</div>
  }

  if (props.mode === "design") {
    return (
      <DesignPanel
        html={props.html}
        selectedId={props.selectedId}
        node={props.node}
        onChange={props.onChange}
        onSelectChange={props.onSelectChange}
        bindings={props.bindings}
      />
    )
  }

  if (props.mode === "data") {
    return (
      <DataPanel
        node={props.node}
        pagePath={props.pagePath}
        bindings={props.bindings}
        dataListConfig={props.dataListConfig}
        isInDataListScope={props.isInDataListScope}
        onBindField={props.onBindField}
        onUnbindField={props.onUnbindField}
        onSetDataList={props.onSetDataList}
        onRemoveDataList={props.onRemoveDataList}
      />
    )
  }

  if (props.mode === "animation") {
    return (
      <div className="text-sm text-zinc-500">
        アニメーションモード（実装予定）
      </div>
    )
  }

  return null
}

type DesignPanelProps = {
  html: string
  selectedId: string
  node: DomNode
  onChange: (html: string) => void
  onSelectChange: (id: string | null) => void
  bindings: DataBindings
}

/**
 * テキスト編集可能な要素
 */
const textEditableTags = ["p", "span", "a", "h1", "h2", "h3", "button", "li"]

const elementTags = [
  "div",
  "section",
  "article",
  "header",
  "footer",
  "nav",
  "main",
  "aside",
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "img",
  "a",
  "button",
] as const

type AddPosition = "child" | "sibling"

/**
 * HTMLを操作するヘルパー
 */
function updateHtml(
  html: string,
  selectedId: string,
  updater: (element: Element, doc: Document) => void,
): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<body>${html}</body>`, "text/html")
  const element = doc.querySelector(`[data-node-id="${selectedId}"]`)
  if (element) {
    updater(element, doc)
  }
  return doc.body.innerHTML
}

function DesignPanel(props: DesignPanelProps) {
  const currentClass = props.node.attributes.class || ""
  const currentText = props.node.textContent || ""
  const currentHref = props.node.attributes.href || ""
  const currentSrc = props.node.attributes.src || ""
  const currentAlt = props.node.attributes.alt || ""
  const [addPosition, setAddPosition] = useState<AddPosition>("child")
  const [showTagOptions, setShowTagOptions] = useState(false)
  const [showAddOptions, setShowAddOptions] = useState(false)

  const canEditText = textEditableTags.includes(props.node.tag)
  const canEditHref = props.node.tag === "a"
  const canEditImage = props.node.tag === "img"

  // バインドされた要素は子要素を追加できない
  const isBound = props.bindings[props.node.id] !== undefined
  const canAddChild = !isBound

  const handleClassChange = (value: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.className = value
    })
    props.onChange(newHtml)
  }

  const handleTextChange = (value: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.textContent = value
    })
    props.onChange(newHtml)
  }

  const handleHrefChange = (value: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.setAttribute("href", value)
    })
    props.onChange(newHtml)
  }

  const handleSrcChange = (value: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.setAttribute("src", value)
    })
    props.onChange(newHtml)
  }

  const handleAltChange = (value: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.setAttribute("alt", value)
    })
    props.onChange(newHtml)
  }

  const handleChangeElement = (newTagName: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el, doc) => {
      const newElement = doc.createElement(newTagName)
      for (const attr of el.attributes) {
        newElement.setAttribute(attr.name, attr.value)
      }
      while (el.firstChild) {
        newElement.appendChild(el.firstChild)
      }
      el.parentElement?.replaceChild(newElement, el)
    })
    props.onChange(newHtml)
  }

  const handleAddElement = (position: AddPosition, tagName: string) => {
    const newHtml = updateHtml(props.html, props.selectedId, (el, doc) => {
      const newElement = doc.createElement(tagName)
      const newId = `node-${Date.now()}`
      newElement.setAttribute("data-node-id", newId)
      if (tagName === "img") {
        newElement.setAttribute("src", "https://picsum.photos/200/100")
        newElement.setAttribute("alt", "画像")
      }
      if (position === "child") {
        el.appendChild(newElement)
      } else {
        el.parentElement?.insertBefore(newElement, el.nextSibling)
      }
    })
    props.onChange(newHtml)
  }

  const handleDeleteElement = () => {
    const newHtml = updateHtml(props.html, props.selectedId, (el) => {
      el.parentElement?.removeChild(el)
    })
    props.onChange(newHtml)
    props.onSelectChange(null)
  }

  const isTemplate = props.node.tag === "template"

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-zinc-500">ELEMENT</div>
        <Button
          variant="outline"
          onClick={() => !isTemplate && setShowTagOptions(!showTagOptions)}
          className="w-full justify-between font-mono"
          disabled={isTemplate}
        >
          <span>{props.node.tag}</span>
          {!isTemplate &&
            (showTagOptions ? (
              <ChevronUp size={14} />
            ) : (
              <ChevronDown size={14} />
            ))}
        </Button>
        {showTagOptions && !isTemplate && (
          <div className="mt-2 flex flex-wrap gap-1">
            {elementTags.map((tag) => (
              <Button
                key={tag}
                variant={tag === props.node.tag ? "default" : "secondary"}
                size="xs"
                onClick={() => {
                  if (tag !== props.node.tag) {
                    handleChangeElement(tag)
                  }
                  setShowTagOptions(false)
                }}
                className="font-mono"
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
        <div className="mt-2 flex gap-1">
          <Button
            variant="outline"
            onClick={() => {
              setAddPosition("child")
              setShowAddOptions(!showAddOptions)
            }}
            className="flex-1"
            disabled={!canAddChild}
            title={!canAddChild ? "バインドされた要素には追加不可" : undefined}
          >
            内部要素
          </Button>
          {props.node.tag !== "template" && props.node.tag !== "main" && (
            <Button
              variant="outline"
              onClick={() => {
                setAddPosition("sibling")
                setShowAddOptions(!showAddOptions)
              }}
              className="flex-1"
            >
              隣接要素
            </Button>
          )}
          {props.node.tag !== "template" && props.node.tag !== "main" && (
            <Button
              variant="outline"
              onClick={handleDeleteElement}
              className="text-destructive"
            >
              <Trash2 size={12} />
            </Button>
          )}
        </div>
        {showAddOptions && (
          <div className="mt-2 flex flex-wrap gap-1">
            {elementTags.map((tag) => (
              <Button
                key={tag}
                variant="secondary"
                size="xs"
                onClick={() => {
                  handleAddElement(addPosition, tag)
                  setShowAddOptions(false)
                }}
                className="font-mono"
              >
                {tag}
              </Button>
            ))}
          </div>
        )}
      </div>

      {canEditImage && (
        <div className="space-y-3 border-t pt-4">
          <div>
            <div className="mb-1 text-xs text-zinc-500">SRC</div>
            <input
              type="text"
              value={currentSrc}
              onChange={(e) => handleSrcChange(e.target.value)}
              className="w-full rounded border px-2 py-1.5 font-mono text-xs"
              placeholder="https://..."
            />
          </div>
          <div>
            <div className="mb-1 text-xs text-zinc-500">ALT</div>
            <input
              type="text"
              value={currentAlt}
              onChange={(e) => handleAltChange(e.target.value)}
              className="w-full rounded border px-2 py-1.5 text-sm"
              placeholder="画像の説明..."
            />
          </div>
        </div>
      )}

      {canEditText && (
        <div className="border-t pt-4">
          <div className="mb-1 text-xs text-zinc-500">TEXT</div>
          <input
            type="text"
            value={currentText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full rounded border px-2 py-1.5 text-sm"
            placeholder="テキストを入力..."
          />
        </div>
      )}

      {canEditHref && (
        <div className="border-t pt-4">
          <div className="mb-1 text-xs text-zinc-500">LINK</div>
          <input
            type="text"
            value={currentHref}
            onChange={(e) => handleHrefChange(e.target.value)}
            className="w-full rounded border px-2 py-1.5 font-mono text-xs"
            placeholder="https://..."
          />
        </div>
      )}

      {props.node.tag !== "template" && (
        <div className="border-t pt-4">
          <div className="mb-2 text-xs text-zinc-500">CLASS</div>
          <ClassTabs
            currentClass={currentClass}
            onClassChange={handleClassChange}
            elementTag={props.node.tag}
          />
        </div>
      )}
    </div>
  )
}

type DataPanelProps = {
  node: DomNode
  pagePath: string
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  isInDataListScope: boolean
  onBindField: (elementId: string, fieldId: string) => void
  onUnbindField: (elementId: string) => void
  onSetDataList: (config: DataListConfig) => void
  onRemoveDataList: () => void
}

/**
 * ページパスからURLパラメータを抽出
 * 例: /products/[slug]/posts/[id] -> ["slug", "id"]
 */
function extractUrlParams(path: string): string[] {
  const matches = path.match(/\[([^\]]+)\]/g)
  if (!matches) return []
  return matches.map((m) => m.slice(1, -1))
}

/**
 * バインディング可能なタグ（テキスト要素と画像）
 */
const BINDABLE_TAGS = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "span",
  "a",
  "img",
  "strong",
  "em",
  "b",
  "i",
  "small",
  "label",
])

/**
 * 要素がバインディング可能かチェック
 * - バインディング可能なタグである
 * - 子要素がない（テキストノードのみ）
 */
function canBindField(node: DomNode): boolean {
  if (!BINDABLE_TAGS.has(node.tag)) return false
  if (node.children.length > 0) return false
  return true
}

function DataPanel(props: DataPanelProps) {
  const boundFieldId = props.bindings[props.node.id]
  const isDataListRoot = props.dataListConfig?.elementId === props.node.id
  const dataSource = props.dataListConfig
    ? getDataSourceById(props.dataListConfig.sourceId)
    : null

  const urlParams = extractUrlParams(props.pagePath)
  const currentMode = props.dataListConfig?.mode
  const currentFilter = props.dataListConfig?.filters?.[0]

  const handleDataSourceChange = (sourceId: string) => {
    props.onSetDataList({
      elementId: props.node.id,
      sourceId,
      limit: 10,
    })
  }

  const handleModeChange = (mode: "list" | "detail") => {
    if (!props.dataListConfig) return
    props.onSetDataList({
      ...props.dataListConfig,
      mode,
      filters:
        mode === "detail" && urlParams.length > 0
          ? [{ field: "id", paramName: urlParams[0] }]
          : undefined,
    })
  }

  const handleFilterChange = (field: string, paramName: string) => {
    if (!props.dataListConfig) return
    props.onSetDataList({
      ...props.dataListConfig,
      filters: [{ field, paramName }],
    })
  }

  const handleFieldChange = (value: unknown) => {
    if (typeof value !== "string") return
    if (value === boundFieldId) {
      props.onUnbindField(props.node.id)
    } else {
      props.onBindField(props.node.id, value)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-xs text-zinc-500">ELEMENT</div>
        <Button
          variant="outline"
          disabled
          className="w-full justify-between font-mono"
        >
          <span>{props.node.tag}</span>
        </Button>
      </div>

      {(!props.isInDataListScope || isDataListRoot) &&
        props.node.tag !== "main" && (
          <div className="border-t pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              <Database size={12} />
              データソース
            </div>

            <div className="space-y-1">
              {dataSources.map((source) => {
                const isSelected = props.dataListConfig?.sourceId === source.id
                return (
                  <Button
                    key={source.id}
                    variant={isSelected ? "default" : "outline"}
                    onClick={() =>
                      isSelected
                        ? props.onRemoveDataList()
                        : handleDataSourceChange(source.id)
                    }
                    className="w-full justify-start"
                  >
                    <span className="flex-1 text-left">{source.name}</span>
                    {isSelected && <Check size={14} />}
                  </Button>
                )
              })}
            </div>

            {props.dataListConfig && isDataListRoot && (
              <div className="mt-4 space-y-3">
                <div className="text-xs text-zinc-500">モード</div>
                <div className="flex gap-2">
                  <Button
                    variant={currentMode === "list" ? "default" : "outline"}
                    onClick={() => handleModeChange("list")}
                    className="flex-1"
                  >
                    一覧
                  </Button>
                  <Button
                    variant={currentMode === "detail" ? "default" : "outline"}
                    onClick={() => handleModeChange("detail")}
                    className="flex-1"
                  >
                    詳細
                  </Button>
                </div>

                {currentMode === "detail" &&
                  urlParams.length > 0 &&
                  dataSource && (
                    <div className="space-y-2 border-t pt-3">
                      <div className="text-xs text-zinc-500">フィルタ条件</div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-zinc-500">
                          フィールド:
                        </span>
                        <select
                          value={currentFilter?.field ?? "id"}
                          onChange={(e) =>
                            handleFilterChange(
                              e.target.value,
                              currentFilter?.paramName ?? urlParams[0],
                            )
                          }
                          className="flex-1 rounded border bg-transparent px-2 py-1"
                        >
                          {dataSource.fields.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="shrink-0 text-zinc-500">
                          パラメータ:
                        </span>
                        <select
                          value={currentFilter?.paramName ?? urlParams[0]}
                          onChange={(e) =>
                            handleFilterChange(
                              currentFilter?.field ?? "id",
                              e.target.value,
                            )
                          }
                          className="flex-1 rounded border bg-transparent px-2 py-1"
                        >
                          {urlParams.map((p) => (
                            <option key={p} value={p}>
                              [{p}]
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                {currentMode === "detail" && dataSource && (
                  <div className="space-y-2 border-t pt-3">
                    <div className="text-xs text-zinc-500">
                      プレビュー用データ
                    </div>
                    <select
                      value={props.dataListConfig?.previewIndex ?? 0}
                      onChange={(e) => {
                        if (!props.dataListConfig) return
                        props.onSetDataList({
                          ...props.dataListConfig,
                          previewIndex: Number(e.target.value),
                        })
                      }}
                      className="w-full rounded border bg-transparent px-2 py-1.5 text-sm"
                    >
                      {dataSource.sampleData.map((item, index) => (
                        <option
                          key={item.title || item.name || `data-${index}`}
                          value={index}
                        >
                          {item.title || item.name || `データ ${index + 1}`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {props.isInDataListScope &&
        dataSource &&
        props.node.tag !== "template" &&
        !isDataListRoot &&
        canBindField(props.node) && (
          <div className="border-t pt-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-zinc-500">
              <Link2 size={12} />
              フィールド
            </div>

            <RadioGroup
              value={boundFieldId ?? ""}
              onValueChange={handleFieldChange}
            >
              {dataSource.fields.map((field) => {
                const Icon = field.icon
                return (
                  <div key={field.id} className="flex items-center gap-2">
                    <RadioGroupItem value={field.id} id={field.id} />
                    <Label
                      htmlFor={field.id}
                      className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
                    >
                      <Icon size={14} className="text-zinc-400" />
                      {field.name}
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>

            {boundFieldId && (
              <Button
                variant="outline"
                onClick={() => props.onUnbindField(props.node.id)}
                className="mt-2 w-full"
              >
                <Unlink size={14} />
                解除
              </Button>
            )}
          </div>
        )}

      {props.isInDataListScope &&
        dataSource &&
        props.node.tag !== "template" &&
        !isDataListRoot &&
        !canBindField(props.node) && (
          <div className="border-t pt-4">
            <div className="text-xs text-zinc-500">
              {props.node.children.length > 0
                ? "子要素があるためバインド不可"
                : `${props.node.tag} はバインド不可`}
            </div>
          </div>
        )}
    </div>
  )
}
