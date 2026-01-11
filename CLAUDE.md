# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

TanStack Start + shadcn/ui テンプレート。React 19、TypeScript、Tailwind CSS v4を使用したフルスタックWebアプリケーション。

## Directory Structure

- `src/components/` - UIコンポーネント
- `src/components/ui/` - shadcn/uiコンポーネント（Biome lint対象外）
- `src/routes/` - TanStack Routerのファイルベースルーティング
- `src/hooks/` - カスタムフック
- `src/lib/` - ユーティリティ関数

## Tech Stack

- TanStack Start（SSR対応フルスタックフレームワーク）
- TanStack Router（ファイルベースルーティング）
- React 19
- Tailwind CSS v4
- shadcn/ui（base-miraスタイル）
- Biome（フォーマット・リント）
- tsgo（型チェック）
- Vitest（テスト）
- Bun（パッケージマネージャー）

## Commands

```bash
bun dev          # 開発サーバー起動
bun build        # プロダクションビルド
bun test         # テスト実行
bun check        # 型チェック（tsgo --noEmit）
bun format       # フォーマット・リント修正
```

## Architecture

- ルートツリーは `src/route-tree.gen.ts` に自動生成される
- パスエイリアス `@/*` は `./src/*` にマッピング
- ShellComponent（`src/components/shell-component.tsx`）がHTMLシェルを提供
- スタイルは `src/styles.css` にCSS変数で定義（oklch色空間）

## Sitemap

- /

## Notes

- UIコンポーネント更新は `make update-packages` を使用
- shadcn/uiのchart.tsxとresizable.tsxは除外される
