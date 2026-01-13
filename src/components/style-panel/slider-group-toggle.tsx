import { Slider } from "@/components/ui/slider"
import type { SliderClassGroup } from "@/lib/tailwind-classes"

type Props = {
  group: SliderClassGroup
  currentClass: string
  onClassChange: (newClass: string) => void
}

/**
 * スライダーでクラスを選択するUI
 */
export function SliderGroupToggle(props: Props) {
  const currentIndex = getCurrentIndex(props.currentClass, props.group.options)
  const currentValue = props.group.options[currentIndex]
  const label = extractLabel(currentValue, props.group.prefix)

  const handleChange = (value: number | readonly number[]) => {
    const index = Array.isArray(value) ? value[0] : value
    const newValue = props.group.options[index]
    if (!newValue) return
    const classList = props.currentClass.split(/\s+/).filter(Boolean)
    const filtered = classList.filter((c) => !props.group.options.includes(c))
    // 0の場合はクラスを追加しない（削除のみ）
    if (index === 0) {
      props.onClassChange(filtered.join(" "))
      return
    }
    const newClass = [...filtered, newValue].join(" ")
    props.onClassChange(newClass)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 shrink-0 text-xs text-zinc-500">
        {props.group.name}
      </div>
      <Slider
        value={[currentIndex]}
        onValueChange={handleChange}
        min={0}
        max={props.group.options.length - 1}
        step={1}
        className="flex-1"
      />
      <div className="w-6 text-right font-mono text-xs text-zinc-600">
        {label}
      </div>
    </div>
  )
}

/**
 * 現在のクラスからインデックスを取得
 */
function getCurrentIndex(classes: string, options: string[]): number {
  const classList = classes.split(/\s+/).filter(Boolean)
  for (let i = 0; i < options.length; i++) {
    if (classList.includes(options[i])) {
      return i
    }
  }
  return 0
}

/**
 * クラス名から表示ラベルを抽出
 */
function extractLabel(className: string, prefix: string): string {
  if (prefix && className.startsWith(prefix)) {
    return className.slice(prefix.length)
  }
  return className
}
