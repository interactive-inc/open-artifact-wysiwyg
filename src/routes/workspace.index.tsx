import { createFileRoute } from "@tanstack/react-router"
import { PageEditor } from "@/components/page-editor"

export const Route = createFileRoute("/workspace/")({
  component: PageEditorRoute,
})

function PageEditorRoute() {
  return <PageEditor pageId={"-"} />
}
