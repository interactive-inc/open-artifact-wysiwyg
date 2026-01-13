import type { Component, EditorState, Page } from "./schema"

/**
 * 初期ページデータ
 */
export const initialPages: Page[] = [
  {
    id: "index",
    name: "index",
    path: "/",
    html: `<main class="p-8 bg-white">
  <h2 class="text-2xl font-bold mb-4">最新のお知らせ</h2>
  <div class="grid grid-cols-3 gap-4">
    <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <img class="w-full h-32 object-cover rounded mb-2" src="https://picsum.photos/seed/placeholder/400/200" alt="サムネイル" />
      <h3 class="font-bold">タイトルが入ります</h3>
      <p class="text-sm text-gray-500">抜粋テキストが入ります...</p>
    </div>
  </div>
  <a class="text-blue-500 mt-4 inline-block hover:underline" href="#">一覧を見る →</a>
</main>`,
    parentId: null,
  },
  {
    id: "about",
    name: "about",
    path: "/about",
    html: `<main class="p-8 bg-white">
  <h1 class="text-3xl font-bold mb-6">About Us</h1>
  <p class="text-gray-600 mb-4">私たちについての説明文がここに入ります。</p>
  <div class="bg-gray-50 p-6 rounded-lg">
    <h2 class="text-xl font-semibold mb-2">ミッション</h2>
    <p class="text-gray-600">ミッションの説明文</p>
  </div>
</main>`,
    parentId: null,
  },
  {
    id: "products",
    name: "products",
    path: "/products",
    html: `<main class="p-8 bg-white">
  <h1 class="text-3xl font-bold mb-6">Products</h1>
  <div class="grid grid-cols-2 gap-6">
    <div class="border rounded-lg p-4">
      <h3 class="font-bold">製品A</h3>
      <p class="text-sm text-gray-500">製品Aの説明</p>
    </div>
    <div class="border rounded-lg p-4">
      <h3 class="font-bold">製品B</h3>
      <p class="text-sm text-gray-500">製品Bの説明</p>
    </div>
  </div>
</main>`,
    parentId: null,
  },
  {
    id: "products-slug",
    name: "[slug]",
    path: "/products/[slug]",
    html: `<main class="p-8 bg-white">
  <h1 class="text-3xl font-bold mb-6">製品詳細</h1>
  <div class="flex gap-8">
    <img class="w-64 h-64 object-cover rounded" src="https://picsum.photos/seed/product/400/400" alt="製品画像" />
    <div>
      <p class="text-gray-600 mb-4">製品の詳細説明がここに入ります。</p>
      <button class="bg-blue-500 text-white px-4 py-2 rounded">購入する</button>
    </div>
  </div>
</main>`,
    parentId: "products",
  },
  {
    id: "blog",
    name: "blog",
    path: "/blog",
    html: `<main class="p-8 bg-white">
  <h1 class="text-3xl font-bold mb-6">Blog</h1>
  <div class="space-y-4">
    <article class="border-b pb-4">
      <h2 class="text-xl font-bold">記事タイトル1</h2>
      <p class="text-gray-500 text-sm">2024年1月1日</p>
    </article>
    <article class="border-b pb-4">
      <h2 class="text-xl font-bold">記事タイトル2</h2>
      <p class="text-gray-500 text-sm">2024年1月2日</p>
    </article>
  </div>
</main>`,
    parentId: null,
  },
  {
    id: "blog-slug",
    name: "[slug]",
    path: "/blog/[slug]",
    html: `<main class="p-8 bg-white max-w-2xl mx-auto">
  <h1 class="text-3xl font-bold mb-4">記事タイトル</h1>
  <p class="text-gray-500 mb-8">2024年1月1日</p>
  <div class="prose">
    <p>記事の本文がここに入ります。</p>
  </div>
</main>`,
    parentId: "blog",
  },
  {
    id: "contact",
    name: "contact",
    path: "/contact",
    html: `<main class="p-8 bg-white max-w-xl mx-auto">
  <h1 class="text-3xl font-bold mb-6">Contact</h1>
  <form class="space-y-4">
    <div>
      <label class="block text-sm font-medium mb-1">お名前</label>
      <input type="text" class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">メールアドレス</label>
      <input type="email" class="w-full border rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">メッセージ</label>
      <textarea class="w-full border rounded px-3 py-2" rows="4"></textarea>
    </div>
    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">送信</button>
  </form>
</main>`,
    parentId: null,
  },
]

/**
 * 初期コンポーネントデータ
 */
export const initialComponents: Component[] = [
  {
    id: "header",
    name: "Header",
    html: `<header class="bg-white border-b px-8 py-4">
  <nav class="flex items-center justify-between">
    <a href="/" class="text-xl font-bold">Logo</a>
    <div class="flex gap-4">
      <a href="/" class="hover:text-blue-500">Home</a>
      <a href="/about" class="hover:text-blue-500">About</a>
      <a href="/products" class="hover:text-blue-500">Products</a>
      <a href="/blog" class="hover:text-blue-500">Blog</a>
      <a href="/contact" class="hover:text-blue-500">Contact</a>
    </div>
  </nav>
</header>`,
  },
  {
    id: "footer",
    name: "Footer",
    html: `<footer class="bg-gray-100 px-8 py-6 mt-auto">
  <div class="flex justify-between items-center">
    <p class="text-gray-500 text-sm">&copy; 2024 Company Name</p>
    <div class="flex gap-4 text-sm">
      <a href="/privacy" class="text-gray-500 hover:text-gray-700">Privacy</a>
      <a href="/terms" class="text-gray-500 hover:text-gray-700">Terms</a>
    </div>
  </div>
</footer>`,
  },
]

/**
 * デフォルトのデバイス幅
 */
export const DEFAULT_DEVICE_WIDTH = 1024

/**
 * 初期エディタ状態
 */
export const initialEditorState: EditorState = {
  pages: initialPages,
  components: initialComponents,
  selectedPageId: "index",
  selectedElementId: null,
  editorMode: "design",
  viewMode: "fit",
  deviceWidth: DEFAULT_DEVICE_WIDTH,
  leftTab: "pages",
}
