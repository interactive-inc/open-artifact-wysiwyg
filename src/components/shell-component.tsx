import { HeadContent, Scripts } from "@tanstack/react-router"

type Props = { children: React.ReactNode }

/**
 * アプリケーションのHTMLシェル
 */
export function ShellComponent(props: Props) {
  return (
    <html lang={"ja"} className={"dark overflow-y-auto overscroll-none"}>
      <head>
        <HeadContent />
      </head>
      <body>
        {props.children}
        <Scripts />
      </body>
    </html>
  )
}
