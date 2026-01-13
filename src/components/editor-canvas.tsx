import { useRef, useState } from "react"
import { expandTemplateWithData } from "@/lib/template-expander"
import type { DataBindings, DataListConfig } from "@/lib/types"

type ViewMode = "fit" | "scroll"

type Props = {
  html: string
  selectedId: string | null
  bindings: DataBindings
  dataListConfig: DataListConfig | null
  deviceWidth: number
  viewMode: ViewMode
}

/**
 * HTMLをプレビュー表示するキャンバス
 * 更新はpostMessageで行い、iframeの再レンダリングを防ぐ
 */
export function EditorCanvas(props: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const prevHtmlRef = useRef<string>("")
  const prevSelectedIdRef = useRef<string | null>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const previewHtml = expandTemplateWithData(
    props.html,
    props.bindings,
    props.dataListConfig,
  )

  // 初期HTMLを固定（srcDocの再設定を防ぐ）
  const [initialSrcDoc] = useState(() => buildPreviewHtml(previewHtml))

  // コンテナ幅を監視
  const handleContainerRef = (node: HTMLDivElement | null) => {
    if (node) {
      containerRef.current = node
      setContainerWidth(node.offsetWidth)
      const observer = new ResizeObserver(() => {
        setContainerWidth(node.offsetWidth)
      })
      observer.observe(node)
    }
  }

  // スケール計算（fitモードでコンテナより大きい場合は縮小）
  const scale =
    props.viewMode === "fit" &&
    containerWidth > 0 &&
    props.deviceWidth > containerWidth
      ? containerWidth / props.deviceWidth
      : 1

  // HTML変更時はpostMessageで更新
  if (prevHtmlRef.current !== previewHtml && initializedRef.current) {
    prevHtmlRef.current = previewHtml
    iframeRef.current?.contentWindow?.postMessage(
      { type: "updateHtml", html: previewHtml },
      "*",
    )
  }

  // 選択変更時はpostMessageで更新（初期化後のみ）
  if (
    prevSelectedIdRef.current !== props.selectedId &&
    initializedRef.current
  ) {
    prevSelectedIdRef.current = props.selectedId
    iframeRef.current?.contentWindow?.postMessage(
      { type: "updateSelection", id: props.selectedId },
      "*",
    )
  }

  const handleLoad = () => {
    initializedRef.current = true
    prevHtmlRef.current = previewHtml
    prevSelectedIdRef.current = props.selectedId
    // 初期選択状態を送信
    if (props.selectedId) {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "updateSelection", id: props.selectedId },
        "*",
      )
    }
  }

  const containerClass =
    props.viewMode === "scroll"
      ? "h-full w-full overflow-auto"
      : "h-full w-full"

  return (
    <div ref={handleContainerRef} className={containerClass}>
      <iframe
        ref={iframeRef}
        srcDoc={initialSrcDoc}
        onLoad={handleLoad}
        className="origin-top-left border-0 bg-white"
        style={{
          width: `${props.deviceWidth}px`,
          height: `${100 / scale}%`,
          transform: `scale(${scale})`,
        }}
        title="Preview"
      />
    </div>
  )
}

function buildPreviewHtml(html: string): string {
  // Note: innerHTML is used intentionally for WYSIWYG editor preview
  return `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    [data-node-id] {
      cursor: pointer;
      transition: outline 0.1s;
    }
    [data-node-id]:hover {
      outline: 1px dashed #3b82f6;
    }
    .editor-selected {
      outline: 2px solid #3b82f6 !important;
    }
    .editor-template-preview {
      display: contents;
    }
  </style>
</head>
<body>
  ${html}
  <script>
    // クリックハンドラ（イベント委譲で常に動作）
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-node-id]');
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        window.parent.postMessage({
          type: 'select',
          id: target.getAttribute('data-node-id')
        }, '*');
      }
    });

    // 選択状態の適用
    let currentSelectedId = null;
    function applySelection() {
      document.querySelectorAll('.editor-selected').forEach(el => {
        el.classList.remove('editor-selected');
      });
      if (currentSelectedId) {
        const el = document.querySelector('[data-node-id="' + currentSelectedId + '"]');
        if (el) el.classList.add('editor-selected');
      }
    }

    // 親からのメッセージを受信
    window.addEventListener('message', (e) => {
      if (e.data?.type === 'updateSelection') {
        currentSelectedId = e.data.id;
        applySelection();
      }

      // WYSIWYG editor: intentionally using innerHTML for preview
      if (e.data?.type === 'updateHtml') {
        document.body.innerHTML = e.data.html;
        applySelection();
      }

      if (e.data?.type === 'updateClass') {
        const el = document.querySelector('[data-node-id="' + e.data.id + '"]');
        if (el) el.className = e.data.className;
      }
    });
  </script>
</body>
</html>
`
}
