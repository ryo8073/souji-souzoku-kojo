# 相次相続控除額 計算シミュレーター
# 製品要求仕様書 (PRD)

**文書バージョン:** 1.2  
**作成日:** 2025年6月18日  
**更新日:** 2025年6月26日  
**作成者:** RY

## プロジェクトビジョン

### 使命
**「難しい判断を多くの人が容易に行えるようにする」**

相続という人生で最も重要な判断の一つにおいて、専門知識がなくても正確で信頼できる計算ツールを提供することで、誰もが安心して相続に向き合える世界を実現する。

### ビジョン
**「相続に関する複雑な判断を、誰もが簡単に、正確に、安心して行えるプラットフォーム」**

- 相次相続控除を皮切りに、相続税の各種控除計算アプリを継続的に開発
- 専門家と一般ユーザーの両方にとって価値のあるツールを提供
- 相続に関する知識と理解を深めるための学習コンテンツを充実
- 相続という人生の重要な局面で、誰もが迷いなく判断できる環境を創造

### 価値観
1. **透明性:** 計算過程を完全に開示し、ユーザーが理解できることを最優先とする
2. **信頼性:** 国税庁の資料に基づく正確性と、専門家による監修を保証する
3. **使いやすさ:** 専門知識がなくても直感的に操作できるインターフェースを提供する
4. **継続的改善:** ユーザーのフィードバックと税制改正に応じて、常に最新で最適なツールを提供する
5. **社会的価値:** 相続という社会的課題の解決に貢献し、多くの人々の安心を実現する

### 成功指標
- **ユーザー体験:** 「不安から安心への瞬間」を多くのユーザーが体験する
- **専門家支援:** 税理士やコンサルタントが自信を持ってクライアントを支援できる
- **継続的成長:** 相続関連の計算アプリを継続的に開発・提供する
- **社会的インパクト:** 相続に関する判断がより正確で安心なものになる

## 1. 概要

### 1.1 目的
本文書は、「相次相続控除額 計算シミュレーター」の開発に関する要件を定義するものである。このウェブアプリケーションは、**相続を経験した人々の「不安」を「安心」に変える**ことを使命とし、日本の相続税法における「相次相続控除」の計算を、専門知識がなくても簡単に行えるようにすることを目的としている。

**核心的価値:**
- **相続人の不安解消:** 「計算が合っているのか？」「税理士に相談すべきか？」という不安から解放し、家族に説明できる自信を与える
- **税理士の業務支援:** 相続税申告に不安を持つ税理士が、正確な計算とクライアントへの説明を迷いなく行えるよう支援する
- **コンサルタントの専門性向上:** 相続対策コンサルタントが、専門性を示し信頼を得るためのツールとして活用できる

### 1.2 背景
相次相続控除とは、10年以内に相続が続けて発生した場合に、相続税の二重課税を軽減するための制度である。しかし、以下の課題が存在する：

**相続人（一般ユーザー）の課題:**
- 国税庁の計算式の文言が難しく、入力する金額が正しいか不安
- 計算結果が合っているかどうか分からない
- 税理士に相談する前に事前に計算しておきたいが、相続に詳しくない税理士も多い
- 相続税が払えるか、家族に十分な資産を残せるかという漠然とした不安

**税理士の課題:**
- 相続税申告をあまり行わない税理士は計算式や入力方法に不安
- 過大申告や過少申告のリスク
- クライアントへの説明方法に迷いがある
- 申告書の記載方法が分からない

**相続対策コンサルタントの課題:**
- 相次相続控除という機会の少ない計算について、専門性を示す機会が限定的
- クライアントの目の前で正確な計算を即座に行いたい
- 信頼を得るための専門知識の証明が必要

### 1.3 対象ユーザー

#### 1.3.1 プライマリユーザー: 相続人（一般ユーザー）
**ペルソナ:** 田中 美咲（45歳、会社員）
- **状況:** 父親の相続から5年後、母親の相続を経験
- **不安:** 相次相続控除の計算方法が分からない、税理士に相談する前に概算を知りたい
- **ニーズ:** 分かりやすい説明と正確な計算結果、家族への説明材料
- **価値:** 計算結果を見た瞬間の安心感、家族に説明できる自信

#### 1.3.2 セカンダリユーザー: 税理士
**ペルソナ:** 佐藤 健一（38歳、税理士）
- **状況:** 相続税申告の経験が少なく、相次相続控除の計算に不安
- **不安:** 計算方法や申告書の記載方法、クライアントへの説明
- **ニーズ:** 正確な計算ツール、クライアントへの説明材料
- **価値:** 迷いなく申告できる安心感、クライアントの信頼獲得

#### 1.3.3 ターシャリユーザー: 相続対策コンサルタント
**ペルソナ:** 山田 恵子（42歳、相続対策コンサルタント）
- **状況:** クライアントの信頼を得るため、専門性を示したい
- **不安:** 相次相続控除について詳しく説明できない
- **ニーズ:** 即座に正確な計算ができるツール、専門知識の証明
- **価値:** 専門性の証明、コンサルティング契約の促進

### 1.4 スコープ
本プロジェクトは、相次相続控除額を計算するための静的ウェブアプリケーションの開発を対象とする。ユーザー認証やデータ保存機能は含まない。Vercelにデプロイ可能な静的サイトとして実装する。

**将来的な拡張可能性:**
- データ保存機能（複数ケースの管理）
- 詳細な計算過程の表示
- 印刷・PDF出力機能
- 他の相続税控除の計算機能

## 2. 機能要件

### 2.1 基本機能
1. **相次相続控除額の計算**
   - 5つの入力項目（A〜E）に基づいて控除額を計算する
   - 計算式: A × (C /(B-A)) × (D / C) × (10 - E) / 10
   - 計算結果は即時（リアルタイム）に表示する

2. **入力フォーム**
   - 以下の5つの入力項目を提供する:
     - A: 前回の相続で納めた相続税額
     - B: 前回に取得した財産の価額
     - C: 今回の相続財産の総額
     - D: あなたが今回取得した財産の価額
     - E: 前回の相続からの経過年数
   - 金額入力フィールド（A〜D）は自動的に3桁ごとにカンマ区切りを表示する
   - 年数入力フィールド（E）は整数のみ入力可能とする

3. **ヘルプ機能**
   - 各入力項目にヘルプアイコンを表示する
   - アイコンにマウスオーバーすると、詳細な説明をツールチップで表示する
   - ツールチップには以下の情報を含める:
     - 項目のタイトル
     - 詳細な説明文
     - 注意点や補足情報

4. **相次相続控除の説明**
   - アプリケーション上部に相次相続控除の概要説明を表示する
   - 利用条件や適用要件を明記する

### 2.2 計算過程の透明性と信頼性確保

#### 2.2.1 計算過程の詳細表示
1. **計算式の可視化**
   - 入力値に基づいて計算式を具体的に表示する
   - 例: 「1,000,000 × (30,000,000 / (50,000,000 - 1,000,000)) × (15,000,000 / 30,000,000) × (10 - 5) / 10」
   - 各計算ステップを段階的に表示する

2. **計算根拠の説明**
   - 各計算ステップに説明文を付ける
   - なぜその計算を行うのかを分かりやすく説明する
   - 計算結果の妥当性を確認できる情報を提供する

3. **事例による検証**
   - 典型的な事例を複数用意し、計算結果の妥当性を示す
   - 国税庁の計算事例との比較を可能にする
   - ユーザーの入力値に近い事例を自動的に提示する

#### 2.2.2 信頼性の確保
1. **国税庁資料への参照**
   - 相次相続控除に関する国税庁のページへのリンクを提供する
   - 計算式の根拠となる法令条文への参照を明記する
   - 最新の税制改正情報へのリンクを提供する

2. **監修情報の明記**
   - 株式会社Profomerによる監修であることを明記する
   - 監修者の専門性や実績を簡潔に説明する
   - 最終更新日を明記し、情報の鮮度を示す

3. **計算精度の保証**
   - 計算結果の精度について説明する
   - 小数点以下の処理方法を明記する
   - 計算結果の検証方法を提示する

### 2.3 専門性の証明機能

#### 2.3.1 制度の詳細説明
1. **分かりやすい制度説明**
   - 専門用語を避け、一般ユーザーにも理解できる説明を提供する
   - 図表やイラストを用いて視覚的に理解しやすくする
   - よくある質問（FAQ）セクションを設ける

2. **計算過程の明示**
   - 計算の各ステップを誰でも説明できるレベルで詳細化する
   - 計算式の意味を分かりやすく解説する
   - 計算結果の解釈方法を説明する

#### 2.3.2 関連機能への拡張
1. **他の相続税控除へのリンク**
   - 配偶者控除、基礎控除など他の控除計算アプリへのリンクを提供する
   - アプリ内での切り替え機能を将来的に実装する
   - 相続税計算の全体像を示すナビゲーションを提供する

2. **最新税制情報の提供**
   - 税制改正の最新情報を定期的に更新する
   - 改正内容の影響について分かりやすく説明する
   - 改正前後の計算結果の比較機能を提供する

### 2.4 将来の拡張機能

#### 2.4.1 相続税計算の総合化
1. **各種控除の計算機能**
   - 配偶者控除、基礎控除、未成年者控除などの計算アプリを開発する
   - 各控除の説明資料を充実させる
   - 控除の組み合わせによる総合的な計算機能を提供する

2. **相続税の基礎知識**
   - 相続税の基本的な仕組みについて学習コンテンツを提供する
   - 相続税申告の流れを分かりやすく説明する
   - 相続税対策の基礎知識を提供する

#### 2.4.2 専門家との連携
1. **相談窓口の明記**
   - 専門家への相談窓口を明確に表示する
   - 相談の流れや費用について説明する
   - 地域別の専門家検索機能を将来的に実装する

2. **情報の共有機能**
   - 計算結果を専門家と共有できる機能を将来的に実装する
   - 相談時の資料として活用できる出力機能を提供する

### 2.5 入力値の検証と制約
1. **入力値の検証**
   - 数値以外の文字が入力された場合は自動的に除去する
   - 空欄の場合は0として扱う
   - 負の値は入力できないようにする

2. **計算の制約条件**
   - E（経過年数）が10以上の場合、控除額は0円とする
   - B（前回に取得した財産の価額）が0の場合、控除額は0円とする
   - C（今回の相続財産の総額）が0の場合、控除額は0円とする

### 2.6 表示要件
1. **計算結果の表示**
   - 計算結果は3桁ごとにカンマ区切りで表示する
   - 単位（円）を結果の横に表示する
   - 結果は小数点以下を切り捨てて整数で表示する

2. **ツールチップの表示**
   - ヘルプアイコンにマウスオーバーした時のみ表示する
   - マウスが離れると自動的に非表示にする
   - 適切な位置（アイコンの下）に表示する
   - スクロールしても表示位置が適切に調整される

3. **計算過程の表示**
   - 計算過程を段階的に表示する
   - 各ステップの計算結果を明示する
   - 計算式の意味を分かりやすく説明する

## 3. 非機能要件

### 3.1 ユーザビリティ
1. **レスポンシブデザイン**
   - デスクトップ、タブレット、スマートフォンなど、様々な画面サイズに対応する
   - モバイル端末でも操作しやすいUI設計とする

2. **アクセシビリティ**
   - WCAG 2.1のレベルAAに準拠する
   - スクリーンリーダーでの読み上げに対応する
   - キーボード操作のみでも全機能を利用できるようにする

3. **使いやすさ**
   - 直感的に操作できるシンプルなインターフェース
   - 入力フィールドの状態（フォーカス、エラーなど）を視覚的に明確に表示する
   - 入力値の変更に応じてリアルタイムで結果を更新する

### 3.2 パフォーマンス
1. **応答性**
   - 入力値の変更から計算結果の表示までの遅延を100ms以内とする
   - 初期ロード時間を2秒以内とする

2. **互換性**
   - 最新バージョンのChrome、Firefox、Safari、Edgeブラウザで正常に動作する
   - IE11は対象外とする

### 3.3 セキュリティ
1. **クライアントサイドのみの処理**
   - すべての計算処理はクライアントサイドで完結する
   - ユーザーデータをサーバーに送信しない

2. **入力データの保護**
   - 入力されたデータはローカルのみで処理し、外部に送信しない
   - セッション終了後にデータは保持しない

### 3.4 保守性
1. **コード品質**
   - 可読性の高いコードを維持する
   - 適切なコメントを付与する
   - モジュール化された構造を採用する

2. **拡張性**
   - 将来的な機能追加や変更に対応しやすい設計とする
   - コンテンツとロジックを分離する

## 4. 技術要件

### 4.1 開発環境
1. **言語・フレームワーク**
   - HTML5
   - CSS3（Tailwind CSSを使用）
   - JavaScript（ES6以上）

2. **ライブラリ・依存関係**
   - Tailwind CSS（スタイリング）
   - Lucide（アイコン）

3. **開発ツール**
   - モダンなコードエディタ（VS Code推奨）
   - Git（バージョン管理）

### 4.2 デプロイ環境
1. **ホスティング**
   - Vercel（静的サイトホスティング）

2. **ドメイン・URL**
   - Vercelが提供するデフォルトドメインを使用
   - カスタムドメインは将来的な拡張として検討

### 4.3 ファイル構成
1. **必須ファイル**
   - index.html（メインHTML）
   - style.css（スタイル定義）
   - script.js（メインスクリプト）
   - data.js（ヘルプテキストなどのデータ）

## 5. デザイン要件

### 5.1 ビジュアルデザイン
1. **カラースキーム**
   - 基本色: 白（#FFFFFF）、薄いスレート（#F8FAFC）
   - アクセント色: ブルー（#3B82F6）
   - テキスト色: ダークスレート（#0F172A）、ミディアムスレート（#64748B）
   - 背景色: ライトスレート（#F1F5F9）

2. **タイポグラフィ**
   - フォントファミリー: 'Noto Sans JP'（日本語対応）
   - 見出し: 太字、大きめのサイズ
   - 本文: 読みやすいサイズと行間

3. **レイアウト**
   - シンプルで直感的なレイアウト
   - 十分な余白を確保
   - 入力フォームと計算結果を明確に区分

### 5.2 UI要素
1. **入力フォーム**
   - 明確なラベル表示
   - フォーカス時の視覚的フィードバック
   - 適切なサイズと間隔

2. **ヘルプアイコン**
   - 小さく控えめなデザイン
   - ホバー時に視覚的フィードバック

3. **ツールチップ**
   - 読みやすいコントラスト
   - 適切な大きさと余白
   - 階層的な情報構造（タイトル、説明、注意点）

4. **計算結果表示**
   - 目立つ位置と大きさ
   - 結果の重要性を強調するデザイン

## 6. コンテンツ要件

### 6.1 説明テキスト
1. **相次相続控除の概要**
   - 制度の目的と概要
   - 適用条件の説明

2. **入力項目の説明**
   - 各項目（A〜E）の詳細な説明
   - 参照すべき書類や欄の案内
   - 注意点や補足情報

### 6.2 ヘルプコンテンツ
1. **ツールチップ内容**
   - 各入力項目の詳細説明
   - 具体的な記入例や参照先
   - 特記事項や注意点

2. **利用条件の説明**
   - 相次相続控除が適用される条件
   - 控除額がゼロになるケース

## 7. 検証要件

### 7.1 テスト要件
1. **機能テスト**
   - 計算ロジックの正確性
   - 入力値の検証機能
   - ツールチップの表示/非表示

2. **ユーザビリティテスト**
   - 様々なデバイスでの表示確認
   - 異なるブラウザでの動作確認

3. **パフォーマンステスト**
   - ロード時間の測定
   - 計算処理の応答性

### 7.2 受け入れ基準
1. **機能面**
   - すべての入力項目が正常に機能する
   - 計算結果が正確である
   - ヘルプ機能が適切に動作する

2. **非機能面**
   - レスポンシブデザインが正常に機能する
   - 主要ブラウザで問題なく動作する
   - パフォーマンス要件を満たす

## 8. 将来的な拡張可能性

### 8.1 追加機能候補
1. **データ保存機能**
   - 入力データの保存と読み込み
   - 複数のケースの管理

2. **詳細な計算結果表示**
   - 計算過程の表示
   - グラフや図表による視覚化

3. **印刷・PDF出力機能**
   - 計算結果のプリントアウト
   - PDF形式でのエクスポート

4. **相続税計算機能の拡張**
   - 基礎控除や配偶者控除など、他の控除の計算
   - 総合的な相続税額の試算

## 9. 用語集

| 用語 | 説明 |
|------|------|
| 相次相続控除 | 10年以内に相続が続けて発生した場合に、相続税の二重課税を軽減するための制度 |
| 相続税 | 被相続人（亡くなった人）から相続人が財産を相続した際にかかる税金 |
| 課税価格 | 相続税の計算の基礎となる、相続した財産の価額から債務などを控除した金額 |
| 経過年数 | 前回の相続開始日から今回の相続開始日までの期間（年単位、1年未満切り捨て） |

## 10. 参考資料

1. 国税庁「相次相続控除」に関する資料
2. 相続税法第20条（相次相続控除）
3. 相続税申告書の記載例

## 11. MVP定義と開発ロードマップ

### 11.1 MVP（最小実行可能製品）の定義

#### 11.1.1 ターゲットペルソナ
**プライマリターゲット:** 田中 美咲（45歳、会社員）- 相続人
- 父親の相続から5年後、母親の相続を経験
- 相次相続控除の計算方法が分からない
- 税理士に相談する前に概算を知りたい
- 家族に説明できる自信を持ちたい

#### 11.1.2 MVPの核心価値
**「視覚化された流れと計算過程の透明性による不安解消」**

#### 11.1.3 MVP機能要件
1. **家系図による視覚化**
   - 1次相続（父親）から2次相続（母親）への流れを家系図で表示
   - 各相続の基本情報（相続人、財産額、相続税額）を視覚的に表現
   - 相次相続控除の適用関係を明確に示す

2. **計算過程の透明性**
   - 入力値に基づく具体的な計算式の表示
   - 各計算ステップの段階的表示と説明
   - 計算結果の根拠を分かりやすく解説

3. **基本計算機能**
   - 5つの入力項目（A〜E）による相次相続控除額の計算
   - リアルタイム計算結果の表示
   - 入力値のバリデーション

4. **分かりやすい説明**
   - 各入力項目の詳細説明（ツールチップ）
   - 相次相続控除制度の概要説明
   - よくある質問（FAQ）セクション

#### 11.1.4 検証仮説
1. **主要仮説:** 「視覚化された家系図と計算過程の透明性により、相続人の不安が解消され、家族への説明自信が向上する」
2. **副次仮説:** 「分かりやすい説明により、相次相続控除の理解度が向上する」

### 11.2 開発ロードマップ

#### Phase 1: MVP開発（4週間）
**目標:** 相続人ペルソナの「不安から安心への瞬間」を実現

**Week 1-2: 基本機能開発**
- 家系図コンポーネントの開発
- 基本計算機能の実装
- 入力フォームとバリデーション

**Week 3: 視覚化と透明性の実装**
- 計算過程の段階的表示
- 家系図と計算結果の連携
- 説明コンテンツの充実

**Week 4: 統合とテスト**
- 全機能の統合
- ユーザビリティテスト
- バグ修正と最適化

#### Phase 2: 信頼性強化（2週間）
**目標:** 計算結果の信頼性を確保

- 国税庁資料への参照リンク追加
- 監修情報（株式会社Profomer）の明記
- 計算精度の保証機能

#### Phase 3: 税理士向け機能拡張（3週間）
**目標:** セカンダリペルソナ（税理士）の支援

- クライアント向け説明資料の生成機能
- 申告書記載支援機能
- 事例による検証機能

#### Phase 4: コンサルタント向け機能拡張（3週間）
**目標:** ターシャリペルソナ（コンサルタント）の専門性証明

- 制度の詳細説明セクション
- 他の相続税控除へのリンク
- 専門性を示すコンテンツ

#### Phase 5: プラットフォーム化（継続的）
**目標:** 継続的な価値創造

- 他の相続税控除計算アプリの開発
- 相続税の基礎知識コンテンツ
- 専門家相談窓口の整備

### 11.3 優先順位マトリックス

| 機能 | ユーザー価値 | 技術的実現性 | ビジネスインパクト | 優先度 |
|------|-------------|-------------|------------------|--------|
| 家系図による視覚化 | 高 | 中 | 高 | **P0** |
| 計算過程の透明性 | 高 | 中 | 高 | **P0** |
| 基本計算機能 | 高 | 高 | 高 | **P0** |
| 分かりやすい説明 | 高 | 低 | 中 | **P1** |
| 国税庁資料参照 | 中 | 低 | 中 | **P2** |
| 監修情報明記 | 中 | 低 | 中 | **P2** |
| 事例による検証 | 中 | 中 | 中 | **P2** |
| 他の控除へのリンク | 低 | 中 | 高 | **P3** |

**P0:** MVP必須機能  
**P1:** MVP推奨機能  
**P2:** Phase 2-3で実装  
**P3:** 将来の拡張機能

### 11.4 成功指標（KPI）

#### 11.4.1 ユーザー体験指標
- **不安解消率:** アプリ使用後の不安度スコアの改善（目標: 50%以上）
- **理解度向上:** 相次相続控除の理解度テストスコア（目標: 70%以上）
- **説明自信度:** 家族への説明自信度スコア（目標: 80%以上）

#### 11.4.2 技術指標
- **計算精度:** 国税庁事例との計算結果一致率（目標: 100%）
- **応答時間:** 計算結果表示までの時間（目標: 100ms以内）
- **エラー率:** 計算エラーの発生率（目標: 1%以下）

#### 11.4.3 ビジネス指標
- **ユーザー継続率:** 2回目以降の利用率（目標: 30%以上）
- **専門家利用率:** 税理士・コンサルタントの利用率（目標: 20%以上）
- **拡張機能利用率:** 他の控除計算への遷移率（目標: 15%以上）

### 11.5 リスク管理

#### 11.5.1 技術的リスク

| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| 家系図の複雑な実装 | 高 | 中 | 段階的な実装、既存ライブラリの活用 |
| 計算精度の確保 | 高 | 低 | 国税庁事例との徹底的な検証 |
| レスポンシブ対応の困難 | 中 | 中 | モバイルファースト設計、早期テスト |
| ブラウザ互換性問題 | 中 | 低 | 主要ブラウザでの事前テスト |

#### 11.5.2 市場リスク

| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| ユーザーの理解度が低い | 高 | 中 | ユーザビリティテスト、説明の改善 |
| 専門家からの信頼獲得困難 | 高 | 中 | 監修情報の明記、事例による検証 |
| 税制改正への対応遅れ | 中 | 中 | 税制情報の定期チェック体制 |
| 競合サービスの登場 | 中 | 低 | 差別化要因の強化、ユーザー体験の向上 |

#### 11.5.3 ビジネスリスク

| リスク | 影響度 | 発生確率 | 対策 |
|--------|--------|----------|------|
| 開発リソースの不足 | 高 | 中 | MVP機能の厳格な絞り込み |
| 継続的な開発資金 | 中 | 中 | 段階的な収益化戦略 |
| 専門家監修の確保 | 中 | 低 | 株式会社Profomerとの関係強化 |
| 法的責任の発生 | 高 | 低 | 免責事項の明記、専門家への案内 |

#### 11.5.4 リスク対応戦略

**高リスク・高確率への対応:**
- 家系図実装: プロトタイプを早期に作成し、技術的実現性を確認
- ユーザー理解度: 段階的なユーザーテストを実施し、継続的に改善

**高リスク・低確率への対応:**
- 計算精度: 複数の検証方法を用意し、万全の体制を構築
- 法的責任: 専門家監修のもと、適切な免責事項を設定

**中リスクへの対応:**
- 段階的な開発により、リスクを分散
- 早期のユーザーフィードバックにより、方向性を調整

### 11.6 成功の定義と評価方法

#### 11.6.1 MVP成功の定義
1. **技術的成功:** 計算精度100%、応答時間100ms以内、エラー率1%以下
2. **ユーザー成功:** 不安解消率50%以上、理解度向上70%以上
3. **ビジネス成功:** ユーザー継続率30%以上、専門家利用率20%以上

#### 11.6.2 評価方法
- **定量的評価:** 上記KPIの測定と分析
- **定性的評価:** ユーザーインタビュー、専門家フィードバック
- **継続的評価:** 週次での進捗確認、月次での戦略見直し

#### 11.6.3 次のステップ判断基準
- **Phase 2移行:** MVP成功指標の80%以上達成
- **戦略変更:** 主要仮説の検証失敗、または市場環境の大幅変化
- **機能追加:** ユーザーフィードバックによる明確なニーズ確認
