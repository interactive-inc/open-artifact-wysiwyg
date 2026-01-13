/**
 * Tailwindクラスのカテゴリ定義
 */

export type ClassGroup = {
  name: string
  prefix: string
  options: string[]
  multiple: boolean
}

export type SliderClassGroup = {
  name: string
  prefix: string
  type: "slider"
  options: string[]
}

export type ColorClassGroup = {
  name: string
  prefix: string
  type: "color"
}

export type ClassCategory = {
  id: string
  label: string
  groups: (ClassGroup | ColorClassGroup | SliderClassGroup)[]
}

export const colorHues = [
  "black",
  "white",
  "gray",
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "pink",
] as const

export const colorShades = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
] as const

export type ColorHue = (typeof colorHues)[number]
export type ColorShade = (typeof colorShades)[number]

/**
 * グループがカラー型かどうか判定
 */
export function isColorGroup(
  group: ClassGroup | ColorClassGroup | SliderClassGroup,
): group is ColorClassGroup {
  return "type" in group && group.type === "color"
}

/**
 * グループがスライダー型かどうか判定
 */
export function isSliderGroup(
  group: ClassGroup | ColorClassGroup | SliderClassGroup,
): group is SliderClassGroup {
  return "type" in group && group.type === "slider"
}

/**
 * 要素タイプごとに表示するカテゴリを定義
 */
export type ElementPattern = {
  categories: string[]
}

const textElementPattern: ElementPattern = {
  categories: ["typography", "color"],
}

const containerElementPattern: ElementPattern = {
  categories: ["spacing", "layout", "effects", "border", "color"],
}

const imageElementPattern: ElementPattern = {
  categories: ["image", "effects"],
}

const templateElementPattern: ElementPattern = {
  categories: [],
}

/**
 * 要素タイプからパターンを取得
 */
export function getElementPattern(tag: string): ElementPattern {
  if (tag === "template") {
    return templateElementPattern
  }
  if (
    [
      "p",
      "span",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "a",
      "button",
      "label",
      "li",
    ].includes(tag)
  ) {
    return textElementPattern
  }
  if (tag === "img") {
    return imageElementPattern
  }
  return containerElementPattern
}

export const classCategories: ClassCategory[] = [
  {
    id: "typography",
    label: "文字",
    groups: [
      {
        name: "Weight",
        prefix: "font-",
        options: ["font-normal", "font-medium", "font-semibold", "font-bold"],
        multiple: false,
      },
      {
        name: "Size",
        prefix: "text-",
        options: [
          "text-xs",
          "text-sm",
          "text-base",
          "text-lg",
          "text-xl",
          "text-2xl",
        ],
        multiple: false,
      },
      {
        name: "Align",
        prefix: "text-",
        options: ["text-left", "text-center", "text-right"],
        multiple: false,
      },
    ],
  },
  {
    id: "color",
    label: "色",
    groups: [
      {
        name: "Text",
        prefix: "text-",
        type: "color",
      },
      {
        name: "Background",
        prefix: "bg-",
        type: "color",
      },
    ],
  },
  {
    id: "image",
    label: "画像",
    groups: [
      {
        name: "Width",
        prefix: "w-",
        options: [
          "w-auto",
          "w-full",
          "w-1/2",
          "w-1/3",
          "w-24",
          "w-32",
          "w-48",
          "w-64",
        ],
        multiple: false,
      },
      {
        name: "Height",
        prefix: "h-",
        options: ["h-auto", "h-full", "h-24", "h-32", "h-48", "h-64", "h-96"],
        multiple: false,
      },
      {
        name: "Fit",
        prefix: "object-",
        options: [
          "object-contain",
          "object-cover",
          "object-fill",
          "object-none",
        ],
        multiple: false,
      },
      {
        name: "Aspect",
        prefix: "aspect-",
        options: ["aspect-auto", "aspect-square", "aspect-video"],
        multiple: false,
      },
    ],
  },
  {
    id: "spacing",
    label: "余白",
    groups: [
      {
        name: "Padding",
        prefix: "p-",
        type: "slider",
        options: [
          "p-0",
          "p-1",
          "p-2",
          "p-3",
          "p-4",
          "p-5",
          "p-6",
          "p-8",
          "p-10",
          "p-12",
          "p-16",
          "p-20",
          "p-24",
        ],
      },
      {
        name: "Margin",
        prefix: "m-",
        type: "slider",
        options: [
          "m-0",
          "m-1",
          "m-2",
          "m-3",
          "m-4",
          "m-5",
          "m-6",
          "m-8",
          "m-10",
          "m-12",
          "m-16",
          "m-20",
          "m-24",
        ],
      },
      {
        name: "Gap",
        prefix: "gap-",
        type: "slider",
        options: [
          "gap-0",
          "gap-1",
          "gap-2",
          "gap-3",
          "gap-4",
          "gap-5",
          "gap-6",
          "gap-8",
          "gap-10",
          "gap-12",
          "gap-16",
          "gap-20",
          "gap-24",
        ],
      },
    ],
  },
  {
    id: "layout",
    label: "配置",
    groups: [
      {
        name: "Display",
        prefix: "",
        options: ["block", "inline-block", "flex", "grid", "hidden"],
        multiple: false,
      },
      {
        name: "Flex方向",
        prefix: "flex-",
        options: ["flex-row", "flex-col"],
        multiple: false,
      },
      {
        name: "横配置",
        prefix: "justify-",
        options: [
          "justify-start",
          "justify-center",
          "justify-end",
          "justify-between",
        ],
        multiple: false,
      },
      {
        name: "縦配置",
        prefix: "items-",
        options: ["items-start", "items-center", "items-end"],
        multiple: false,
      },
    ],
  },
  {
    id: "effects",
    label: "効果",
    groups: [
      {
        name: "Shadow",
        prefix: "shadow",
        options: [
          "shadow-none",
          "shadow-sm",
          "shadow",
          "shadow-md",
          "shadow-lg",
        ],
        multiple: false,
      },
      {
        name: "Rounded",
        prefix: "rounded",
        options: [
          "rounded-none",
          "rounded",
          "rounded-md",
          "rounded-lg",
          "rounded-full",
        ],
        multiple: false,
      },
      {
        name: "Opacity",
        prefix: "opacity-",
        options: ["opacity-50", "opacity-75", "opacity-100"],
        multiple: false,
      },
    ],
  },
  {
    id: "border",
    label: "枠線",
    groups: [
      {
        name: "Width",
        prefix: "border",
        options: ["border-0", "border", "border-2"],
        multiple: false,
      },
      {
        name: "Color",
        prefix: "border-",
        type: "color",
      },
    ],
  },
]
