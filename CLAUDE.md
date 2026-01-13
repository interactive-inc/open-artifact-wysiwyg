# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

オープンソースのWYSIWYG Webサイトエディタ。Tailwind CSSベースのビジュアル編集とデータバインディング機能を提供するコンポーネントライブラリ。

## Directory Structure

- `src/components/` - UIコンポーネント
- `src/components/ui/` - shadcn/uiコンポーネント（Biome lint対象外）
- `src/components/editor/` - エディタのUIパネル
- `src/components/dom-tree/` - DOMツリー表示・操作
- `src/components/page-tree/` - ページツリー管理
- `src/components/style-panel/` - スタイル編集パネル
- `src/lib/editor/` - エディタ状態管理（Context + Reducer）
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

- React Context + useReducer で状態管理（`src/lib/editor/`）
- EditorState: pages, components, 選択状態, UI状態を一元管理
- iframeでプレビュー表示、postMessageで親子間通信
- HTMLは `data-node-id` 属性で要素を識別
- テンプレート展開: `<template data-source>` でデータバインディング
- ルートツリーは `src/route-tree.gen.ts` に自動生成される
- パスエイリアス `@/*` は `./src/*` にマッピング
- ShellComponent（`src/components/shell-component.tsx`）がHTMLシェルを提供
- スタイルは `src/styles.css` にCSS変数で定義（oklch色空間）

## Features

- ビジュアルHTML編集（Tailwind CSS）
- ライブプレビュー（iframe）
- デバイス幅切り替え（sm/md/lg + スライダー）
- DOMツリー表示・ドラッグ&ドロップ
- マルチページ管理
- データバインディング（posts, works, members）
- テンプレート展開（一覧/詳細モード）

## Sitemap

- /
- /workspace/pages/:pageId - ページエディタ

## Issues

- [TanStack Start] ShellComponentで `<Scripts />` を追加しないとクライアントサイドJSが読み込まれない。`@tanstack/react-router` からインポートする必要がある（2026-01-11）
- [TanStack Router] routesディレクトリ内の非ルートファイルは `-` プレフィックスを付けて除外する（例: `-main-view.tsx`）（2026-01-11）

## Notes

- UIコンポーネント更新は `make update-packages` を使用
- shadcn/uiのchart.tsxとresizable.tsxは除外される

## Rules

- Always respond in Japanese.
- Don't downgrade packages.
- use Bun instead of npm or yarn.
- Don't use useEffect, useCallback, or useMemo.
  - 例外: SSR対応のためClientOnlyコンポーネント内でのuseEffectは許可
- パフォーマンスを重視する（大量DOM要素でも軽快に動作すること）
- コンポーネントライブラリとしてのインターフェースを意識する
