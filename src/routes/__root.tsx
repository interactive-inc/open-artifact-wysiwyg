import { createRootRoute, Outlet } from "@tanstack/react-router"
import { ShellComponent } from "@/components/shell-component"

import appCss from "@/styles.css?url"

export const Route = createRootRoute({
  component: RootComponent,
  shellComponent: ShellComponent,
  head() {
    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "TanStack Start Starter",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
      ],
    }
  },
})

function RootComponent() {
  return <Outlet />
}
