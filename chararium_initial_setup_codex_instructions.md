# 共通前提（必ず遵守）

- AGENT.md が存在する場合、その内容を最優先で遵守させること
- ユーザーはコードを直接編集しない前提である
- 実装・修正はすべて CODEX が行う
- 既存設計を破壊しない
- 既存テーマ・ライブラリ構成を維持する
- ハードコード文字列は禁止
- ICommand構造を崩さない

# タスク名

Chararium 初期開発環境構築

# 目的

`e:\dev\chararium` に、AI連動デスクトップマスコットアプリ「Chararium」の初期開発環境を構築する。

ユーザーは React / TypeScript / Electron の環境構築経験がないため、PCに必要ツールが入っていない前提で、確認コマンド・導入手順・プロジェクト作成・起動確認までを CODEX が主導して実施する。

初期段階では Live2D SDK / OpenAI API / 天気・防災API の本格実装は行わず、後から追加できる土台だけを整える。

# 対象ファイル（推定可）

- `e:\dev\chararium\package.json`
- `e:\dev\chararium\electron.vite.config.ts`
- `e:\dev\chararium\tsconfig.json`
- `e:\dev\chararium\tsconfig.node.json`
- `e:\dev\chararium\src\main\index.ts`
- `e:\dev\chararium\src\preload\index.ts`
- `e:\dev\chararium\src\renderer\src\App.tsx`
- `e:\dev\chararium\src\renderer\src\main.tsx`
- `e:\dev\chararium\src\renderer\src\styles\global.css`
- `e:\dev\chararium\src\renderer\src\features\mascot\*`
- `e:\dev\chararium\src\renderer\src\features\settings\*`
- `e:\dev\chararium\src\shared\*`
- `e:\dev\chararium\assets\live2d\README.md`
- `e:\dev\chararium\assets\responses\local-responses.ja.json`
- `e:\dev\chararium\AGENT.md`
- `e:\dev\chararium\README.md`

# 実装内容（具体的変更指示）

## 1. 事前環境確認

PowerShell 7 または Windows PowerShell で、以下を確認すること。

```powershell
node -v
npm -v
git --version
```

未導入の場合は、以下を前提としてユーザーに導入を促す手順を README に明記すること。

- Node.js は LTS 版を使用する
- npm は Node.js 同梱版を使用する
- Git for Windows を使用する
- エディタは Visual Studio Code を想定する

CODEX が実行可能な環境であれば、インストール済みツールのバージョンを確認し、README に「確認済み環境」として記録すること。

## 2. プロジェクト作成

`e:\dev\chararium` をプロジェクトルートとして使用すること。

既にフォルダが存在する場合は、中身を確認し、既存ファイルを不用意に削除しないこと。

Electron + React + TypeScript + Vite の構成で初期化すること。

推奨は `electron-vite` ベースの React + TypeScript テンプレートとする。

例：

```powershell
cd e:\dev
npm create @quick-start/electron chararium -- --template react-ts
```

ただし、既に `e:\dev\chararium` が存在していてテンプレート生成が衝突する場合は、一時フォルダに生成してから必要ファイルを移植すること。

## 3. package.json の整備

以下の npm scripts を用意すること。

```json
{
  "dev": "electron-vite dev",
  "build": "electron-vite build",
  "preview": "electron-vite preview",
  "typecheck": "tsc --noEmit",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

不足パッケージがある場合は、既存テンプレート構成に合わせて最小限で追加すること。

初期段階では Live2D SDK、OpenAI SDK、天気API用ライブラリは追加しないこと。

## 4. Electron メインプロセスの初期設計

`src/main/index.ts` または同等ファイルで、以下を実装すること。

- 通常のメインウィンドウを作成する
- 将来の透明マスコットウィンドウを作成できるように関数を分離する
- `contextIsolation: true` を維持する
- `nodeIntegration: false` を維持する
- preload 経由で IPC を使う前提にする
- 開発時とビルド時の読み込み分岐をテンプレート標準に合わせる

初期表示は通常ウィンドウのみでもよいが、可能であれば以下の2ウィンドウを作成すること。

1. 設定・チャット用の通常ウィンドウ
2. マスコット用の透明・フレームなしウィンドウ

マスコット用ウィンドウは以下を前提にすること。

- `transparent: true`
- `frame: false`
- `alwaysOnTop: false` を初期値にする
- `resizable: true` を初期値にする
- 背景色は透明
- 将来的にドラッグ移動できる構造にする

## 5. React 側の初期画面

React 側に以下の初期UIを作成すること。

- アプリ名：Chararium
- 簡単な説明文
- 現在のモード表示
- ローカル返答モードのテスト領域
- 「クリック反応テスト」ボタン
- 吹き出しプレビュー
- 設定画面の仮セクション

初期モードは以下の3つを表示だけ用意すること。

- ローカル返答モード
- AI会話モード（未実装）
- 天気・防災情報モード（未実装）

未実装のものは、UI上で「準備中」と表示すること。

## 6. ローカル返答モードの土台

`assets/responses/local-responses.ja.json` を作成し、クリック時の定型文をJSONで定義すること。

例：

```json
{
  "click": [
    "呼んだ？",
    "今日もここにいるよ。",
    "少し休憩する？"
  ],
  "morning": [
    "おはよう。今日も無理せずいこう。"
  ],
  "night": [
    "夜更かししてるね。そろそろ休憩も大事だよ。"
  ]
}
```

React側では、現時点ではこのJSONと同等の内容を読み込むか、将来差し替え可能な `LocalResponseProvider` として実装すること。

ハードコード文字列は禁止のため、表示文言は可能な範囲で `resources` または `constants` に分離すること。

## 7. 将来拡張用の型定義

`src/shared` 配下に、将来の返答エンジン差し替えを想定した型を作成すること。

例：

```ts
export type ResponseMode = 'local' | 'openai' | 'weather';

export interface MascotResponse {
  text: string;
  emotion?: 'normal' | 'happy' | 'surprised' | 'worried';
  motionKey?: string;
}
```

`IResponseProvider` 相当の interface を作成すること。

例：

```ts
export interface ResponseProvider {
  readonly mode: ResponseMode;
  getResponse(input: string): Promise<MascotResponse>;
}
```

## 8. Live2D配置フォルダの準備

`assets/live2d` を作成し、README.md を置くこと。

README には以下を記載すること。

- Live2Dモデルは後続タスクで追加する
- `.model3.json` を中心に読み込む想定
- 初期タスクではSDK連携を行わない
- サンプルモデルを入れる場合はライセンス確認を必須にする

## 9. AGENT.md の作成

プロジェクトルートに `AGENT.md` を作成すること。

内容には以下を含めること。

- このプロジェクトは Chararium である
- Electron + TypeScript + React + Live2D Cubism SDK for Web を前提にする
- 実装は既存構成を壊さず小さな単位で進める
- UI文言は日本語/英語切替を想定して分離する
- APIキーを renderer に直置きしない
- OpenAI API は後続タスクで main 側または安全なIPC経由にする
- 天気・地震・防災情報は補助通知であり、公式情報確認を促す設計にする
- Live2D SDK は後続タスクで追加する
- ハードコード文字列を避ける
- テーマ切替を想定したCSS変数を使う

## 10. README.md の作成

README.md に以下を記載すること。

- Chararium の概要
- 開発環境の前提
- 初回セットアップ手順
- 起動方法
- ビルド方法
- フォルダ構成
- 現時点の実装範囲
- 未実装機能
- 今後の予定

初回セットアップ手順には以下を含めること。

```powershell
cd e:\dev\chararium
npm install
npm run dev
```

## 11. テーマの土台

CSS変数でライト/ダークテーマの土台を作ること。

最低限以下を用意すること。

- 背景色
- 文字色
- カード背景
- 境界線色
- アクセント色
- 吹き出し背景
- 吹き出し文字色

初期UIにテーマ切替ボタンを置くこと。

## 12. 多言語化の土台

初期UIは日本語表示でよい。

ただし将来の英語表示に備えて、UI文言を `strings.ja.ts` のようなファイルに分離すること。

## 13. 動作確認

以下を実行して成功することを確認すること。

```powershell
npm install
npm run dev
npm run typecheck
npm run build
```

`npm run build` がテンプレート都合で失敗する場合は、原因を README に記録し、可能な範囲で修正すること。

# 受け入れ条件（目視確認基準）

- `e:\dev\chararium` に Electron + React + TypeScript のプロジェクトが存在する
- `npm install` が完了する
- `npm run dev` でアプリが起動する
- メイン画面に `Chararium` と表示される
- ローカル返答モードが表示される
- 「クリック反応テスト」ボタンを押すと、吹き出し風の表示に定型文が出る
- ライト/ダークテーマ切替の土台がある
- AI会話モードと天気・防災情報モードは「準備中」と表示される
- `assets/live2d` フォルダが存在する
- `assets/responses/local-responses.ja.json` が存在する
- `src/shared` に返答モード用の型定義が存在する
- `AGENT.md` が存在する
- `README.md` に初回セットアップ手順が書かれている
- `npm run typecheck` が成功する
- `npm run build` が成功する、または失敗理由と修正方針が README に明記されている
- Live2D SDK、OpenAI API、天気・防災APIの本格実装はまだ行われていない
- renderer側にAPIキーや秘密情報を保存・直書きしていない
- 既存設計を壊す変更をしていない

