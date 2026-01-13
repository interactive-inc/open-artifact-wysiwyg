import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEditor } from "@/lib/editor"

type Props = {
  pageId: string
  pagePath: string
}

/**
 * ページ情報パネル
 */
export function PageInfoPanel(props: Props) {
  const { dispatch } = useEditor()

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "UPDATE_PAGE_PATH",
      pageId: props.pageId,
      path: e.target.value,
    })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="page-path">パス</Label>
        <Input
          id="page-path"
          value={props.pagePath}
          onChange={handlePathChange}
          className="font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="page-title">タイトル</Label>
        <Input id="page-title" placeholder="ページタイトル" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="page-description">説明</Label>
        <Input id="page-description" placeholder="ページの説明" />
      </div>
    </div>
  )
}
