import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { parseColorClass, replaceColorClass } from "@/lib/class-utils"
import type {
  ColorClassGroup,
  ColorHue,
  ColorShade,
} from "@/lib/tailwind-classes"
import { colorHues, colorShades } from "@/lib/tailwind-classes"

type Props = {
  group: ColorClassGroup
  currentClass: string
  onClassChange: (newClass: string) => void
}

/**
 * 色グループのセレクトUI（色相 + 濃度）
 */
export function ColorGroupToggle(props: Props) {
  const parsed = parseColorClass(props.currentClass, props.group.prefix)
  const needsShade =
    parsed.hue !== null && parsed.hue !== "black" && parsed.hue !== "white"

  const handleHueChange = (value: string | null) => {
    if (!value) return
    const hue = value as ColorHue
    // black/white は shade 不要、それ以外はデフォルト 500
    const shade =
      hue === "black" || hue === "white" ? null : (parsed.shade ?? "500")
    const newClass = replaceColorClass(
      props.currentClass,
      props.group.prefix,
      hue,
      shade,
    )
    props.onClassChange(newClass)
  }

  const handleShadeChange = (value: string | null) => {
    if (!value) return
    const shade = value as ColorShade
    const newClass = replaceColorClass(
      props.currentClass,
      props.group.prefix,
      parsed.hue,
      shade,
    )
    props.onClassChange(newClass)
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-20 shrink-0 text-xs text-zinc-500">
        {props.group.name}
      </div>
      <Select value={parsed.hue ?? ""} onValueChange={handleHueChange}>
        <SelectTrigger className="flex-1">
          <SelectValue>{parsed.hue ?? "—"}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {colorHues.map((hue) => (
            <SelectItem key={hue} value={hue}>
              {hue}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {needsShade && (
        <Select value={parsed.shade ?? ""} onValueChange={handleShadeChange}>
          <SelectTrigger className="w-20">
            <SelectValue>{parsed.shade ?? "—"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {colorShades.map((shade) => (
              <SelectItem key={shade} value={shade}>
                {shade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
