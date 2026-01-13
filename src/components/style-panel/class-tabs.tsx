import { ClassGroupToggle } from "@/components/style-panel/class-group-toggle"
import { ColorGroupToggle } from "@/components/style-panel/color-group-toggle"
import { SliderGroupToggle } from "@/components/style-panel/slider-group-toggle"
import {
  classCategories,
  getElementPattern,
  isColorGroup,
  isSliderGroup,
} from "@/lib/tailwind-classes"

type Props = {
  currentClass: string
  onClassChange: (newClass: string) => void
  elementTag: string
}

/**
 * クラス編集用セクションUI
 */
export function ClassTabs(props: Props) {
  const pattern = getElementPattern(props.elementTag)
  const filteredCategories = classCategories.filter((cat) =>
    pattern.categories.includes(cat.id),
  )

  return (
    <div className="space-y-4">
      <textarea
        value={props.currentClass}
        onChange={(e) => props.onClassChange(e.target.value)}
        className="w-full resize-none rounded border px-2 py-1.5 font-mono text-xs"
        rows={2}
        placeholder="Tailwind classes..."
      />

      {filteredCategories.map((category) => (
        <div key={category.id} className="space-y-2 border-t pt-4">
          <div className="font-medium text-xs text-zinc-700">
            {category.label}
          </div>
          <div className="space-y-2">
            {category.groups.map((group) =>
              isColorGroup(group) ? (
                <ColorGroupToggle
                  key={group.name}
                  group={group}
                  currentClass={props.currentClass}
                  onClassChange={props.onClassChange}
                />
              ) : isSliderGroup(group) ? (
                <SliderGroupToggle
                  key={group.name}
                  group={group}
                  currentClass={props.currentClass}
                  onClassChange={props.onClassChange}
                />
              ) : (
                <ClassGroupToggle
                  key={group.name}
                  group={group}
                  currentClass={props.currentClass}
                  onClassChange={props.onClassChange}
                />
              ),
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
