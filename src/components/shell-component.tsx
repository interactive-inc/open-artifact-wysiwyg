import { HeadContent } from "@tanstack/react-router"

type Props = { children: React.ReactNode }

export function ShellComponent(props: Props) {
  return (
    <html lang={"ja"} className={"overflow-y-auto overscroll-none"}>
      <head>
        <HeadContent />
      </head>
      <body>{props.children}</body>
    </html>
  )
}
