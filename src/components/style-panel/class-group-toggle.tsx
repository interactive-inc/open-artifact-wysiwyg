import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getActiveClass, toggleClass } from "@/lib/class-utils"
import type { ClassGroup } from "@/lib/tailwind-classes"

type Props = {
  group: ClassGroup
  currentClass: string
  onClassChange: (newClass: string) => void
}

/**
 * クラスグループのセレクトUI
 */
export function ClassGroupToggle(props: Props) {
  const activeClass = getActiveClass(props.currentClass, props.group)

  const handleChange = (value: string | null) => {
    if (!value) return
    const newClass = toggleClass(props.currentClass, value, props.group)
    props.onClassChange(newClass)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 shrink-0 text-xs text-zinc-500">
        {props.group.name}
      </div>
      <Select value={activeClass ?? ""} onValueChange={handleChange}>
        <SelectTrigger className="flex-1">
          <SelectValue>
            {activeClass ? extractLabel(activeClass, props.group.prefix) : "—"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {props.group.options.map((option) => {
            const label = extractLabel(option, props.group.prefix)
            return (
              <SelectItem key={option} value={option}>
                {label}
              </SelectItem>
            )
          })}
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * クラス名から表示ラベルを抽出
 */
function extractLabel(className: string, prefix: string): string {
  if (prefix && className.startsWith(prefix)) {
    let label = className.slice(prefix.length)
    // 先頭のハイフンを除去
    if (label.startsWith("-")) {
      label = label.slice(1)
    }
    return label || className
  }
  return className
}
