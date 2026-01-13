import { createFileRoute } from "@tanstack/react-router"
import { MainView } from "@/components/main-view"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return <MainView />
}
