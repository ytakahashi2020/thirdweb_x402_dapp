# Thirdweb x402 Demo Project

このプロジェクトは、Thirdwebのx402プロトコルを使用して、支払いゲートされたAPIを実装するデモアプリケーションです。

## プロジェクト構造

```
thirdweb2/
├── backend/          # Express APIサーバー (x402支払い処理)
└── frontend/         # Next.jsフロントエンド (x402クライアント)
```

## 必要な環境

- Node.js v24
- MetaMask ウォレット (ブラウザ拡張機能)
- Thirdweb API Keys (https://thirdweb.com/dashboard/settings/api-keys)

## セットアップ手順

### 1. Node.jsバージョンの設定

```bash
nvm use 24
```

### 2. バックエンドのセットアップ

```bash
cd backend

# 環境変数ファイルの作成
cp .env.example .env

# .envファイルを編集して以下の値を設定:
# - THIRDWEB_SECRET_KEY: ThirdwebダッシュボードからSecret Keyを取得
# - SERVER_WALLET_ADDRESS: 支払いを受け取るウォレットアドレス
# - PORT: 3001 (デフォルト)

# 依存関係は既にインストール済み
```

### 3. フロントエンドのセットアップ

```bash
cd ../frontend

# 環境変数ファイルの作成
cp .env.local.example .env.local

# .env.localファイルを編集して以下の値を設定:
# - NEXT_PUBLIC_THIRDWEB_CLIENT_ID: ThirdwebダッシュボードからClient IDを取得

# 依存関係は既にインストール済み
```

## 実行方法

### バックエンド (Express) の起動

```bash
cd backend
npm run dev
```

サーバーは `http://localhost:3001` で起動します。

**利用可能なエンドポイント:**
- `GET /api/free` - 無料エンドポイント (支払い不要)
- `GET /api/paid-data` - 有料エンドポイント (0.10 USDC必要)

### フロントエンド (Next.js) の起動

```bash
cd frontend
npm run dev
```

アプリケーションは `http://localhost:3000` で起動します。

## 使用方法

1. ブラウザで `http://localhost:3000` にアクセス
2. "Connect MetaMask" ボタンをクリックしてウォレットを接続
3. "Fetch Free Data" ボタンで無料エンドポイントをテスト
4. "Fetch Paid Data" ボタンで有料エンドポイントをテスト (0.10 USDC の支払いが必要)

## 技術スタック

### バックエンド
- **Express**: Node.js Webフレームワーク
- **Thirdweb SDK**: x402支払い処理
- **TypeScript**: 型安全性のため

### フロントエンド
- **Next.js 16**: Reactフレームワーク
- **Thirdweb SDK**: x402クライアント、ウォレット接続
- **TailwindCSS**: スタイリング
- **TypeScript**: 型安全性のため

## x402プロトコルについて

x402は、HTTPの402 Payment Requiredステータスコードを活用した支払いプロトコルです:

1. クライアントがAPIエンドポイントにリクエスト
2. サーバーが402レスポンスで支払い情報を返却
3. クライアントが自動的に支払いを処理
4. サーバーが支払いを検証してリクエストを処理

## 公式ドキュメント

- [x402 Client Documentation](https://portal.thirdweb.com/x402/client)
- [x402 Server Documentation](https://portal.thirdweb.com/x402/server)
- [Thirdweb Dashboard](https://thirdweb.com/dashboard)

## 注意事項

- このプロジェクトは公式ドキュメントのコードをベースにしています
- 本番環境で使用する前に、セキュリティ監査を実施してください
- 秘密鍵や環境変数は絶対にGitにコミットしないでください
