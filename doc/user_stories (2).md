# 相次相続控除額 計算シミュレーター
# ユーザーストーリー (Gherkin形式)

**文書バージョン:** 1.2  
**作成日:** 2025年6月18日  
**更新日:** 2025年6月26日  
**作成者:** RY

## プロジェクトビジョン

### 使命
**「難しい判断を多くの人が容易に行えるようにする」**

相続という人生で最も重要な判断において、専門知識がなくても正確で信頼できる計算ツールを提供することで、誰もが安心して相続に向き合える世界を実現する。

### 継続的な価値創造
このアプリは、相次相続控除計算の第一歩として位置づけられ、今後以下のような相続関連アプリの開発を継続的に行う：

- 配偶者控除計算アプリ
- 基礎控除計算アプリ
- 未成年者控除計算アプリ
- 相続税総合計算アプリ
- 相続税対策シミュレーター
- 相続税申告書作成支援ツール

### 成功の定義
- ユーザーが「不安から安心への瞬間」を体験する
- 専門家が自信を持ってクライアントを支援できる
- 相続に関する判断がより正確で安心なものになる
- 継続的に新しい価値を創造し続ける

## ペルソナ別ストーリー

### ペルソナ1: 田中 美咲（45歳、会社員）- 相続人

#### ストーリー: 不安から安心への旅
田中さんは父親の相続から5年後、母親の相続を経験しました。相次相続控除について聞いたことはあるものの、計算方法が分からず、税理士に相談する前に概算を知りたいと思っています。

**不安の瞬間:**
- 「国税庁の計算式の文言が難しくて、何を入力すればいいか分からない」
- 「計算結果が合っているかどうか不安」
- 「家族に説明できるか心配」

**安心への道筋:**
- アプリの分かりやすい説明で入力項目を理解
- 正確な計算結果を確認
- 家族に自信を持って説明できる

### ペルソナ2: 佐藤 健一（38歳、税理士）

#### ストーリー: 迷いから確信への転換
佐藤さんは相続税申告の経験が少なく、相次相続控除の計算に不安を抱えています。クライアントに正確な説明をしたいが、自分自身も計算方法に迷いがあります。

**迷いの瞬間:**
- 「計算方法が合っているか不安」
- 「クライアントにどう説明すればいいか分からない」
- 「申告書の記載方法が分からない」

**確信への道筋:**
- アプリで正確な計算を確認
- クライアントへの説明材料として活用
- 迷いなく申告書を作成

### ペルソナ3: 山田 恵子（42歳、相続対策コンサルタント）

#### ストーリー: 専門性の証明
山田さんは相続対策コンサルタントとして、クライアントの信頼を得るために専門性を示したいと思っています。相次相続控除について詳しく説明し、即座に計算できることで信頼を獲得したいと考えています。

**課題の瞬間:**
- 「相次相続控除について詳しく説明できない」
- 「クライアントの目の前で即座に計算できない」
- 「専門性を証明する機会が限定的」

**専門性証明への道筋:**
- アプリの説明で制度を深く理解
- クライアントの目の前で即座に計算
- 専門性を示し、信頼を獲得

## 機能: アプリケーション初期表示

### シナリオ: ユーザーがアプリケーションを初めて開いたとき
```gherkin
シナリオ: ユーザーがアプリケーションを初めて開く
  前提 ユーザーがブラウザでアプリケーションのURLにアクセスする
  ならば 「相次相続控除額 計算シミュレーター」というタイトルが表示されること
  かつ 相次相続控除の説明文が表示されること
  かつ 5つの入力フィールド（A〜E）が表示されること
  かつ 各入力フィールドの横にヘルプアイコンが表示されること
  かつ 計算結果エリアに「0円」と表示されること
```

### シナリオ: 異なるデバイスでアプリケーションを開いたとき
```gherkin
シナリオ: 異なるデバイスでアプリケーションを開く
  前提 ユーザーが<デバイス>でアプリケーションにアクセスする
  ならば レイアウトが<デバイス>の画面サイズに適応していること
  かつ すべての機能が問題なく利用できること

  例:
    | デバイス     |
    | デスクトップ |
    | タブレット   |
    | スマートフォン |
```

## 機能: 入力フォーム操作

### シナリオ: 金額入力フィールドに値を入力する
```gherkin
シナリオ: 金額入力フィールドに値を入力する
  前提 ユーザーがアプリケーションを開いている
  もし 入力フィールド<フィールド>に「<入力値>」と入力する
  ならば 入力フィールドに「<表示値>」と表示されること
  かつ 計算結果が更新されること

  例:
    | フィールド | 入力値    | 表示値    |
    | A         | 1000000  | 1,000,000 |
    | A         | 1000000a | 1,000,000 |
    | A         | 1,000,000 | 1,000,000 |
    | B         | 50000000 | 50,000,000 |
    | C         | 30000000 | 30,000,000 |
    | D         | 15000000 | 15,000,000 |
```

### シナリオ: 年数入力フィールドに値を入力する
```gherkin
シナリオ: 年数入力フィールドに値を入力する
  前提 ユーザーがアプリケーションを開いている
  もし 入力フィールドEに「<入力値>」と入力する
  ならば 入力フィールドに「<表示値>」と表示されること
  かつ 計算結果が更新されること

  例:
    | 入力値 | 表示値 |
    | 5     | 5     |
    | 5.5   | 5     |
    | 5a    | 5     |
    | 0     | 0     |
    | 10    | 10    |
```

### シナリオ: 入力フィールドをクリアする
```gherkin
シナリオ: 入力フィールドをクリアする
  前提 ユーザーがアプリケーションを開いている
  かつ 入力フィールド<フィールド>に値が入力されている
  もし 入力フィールド<フィールド>の値をクリアする
  かつ 入力フィールドからフォーカスを外す
  ならば 入力フィールドに「0」と表示されること
  かつ 計算結果が更新されること

  例:
    | フィールド |
    | A         |
    | B         |
    | C         |
    | D         |
    | E         |
```

## 機能: ヘルプ機能

### シナリオ: ヘルプアイコンにマウスオーバーする
```gherkin
シナリオ: ヘルプアイコンにマウスオーバーする
  前提 ユーザーがアプリケーションを開いている
  もし 入力フィールド<フィールド>のヘルプアイコンにマウスオーバーする
  ならば ツールチップが表示されること
  かつ ツールチップに<フィールド>に関する説明が表示されること
  かつ ツールチップにタイトル、説明文、注意点が含まれていること

  例:
    | フィールド | 
    | A         |
    | B         |
    | C         |
    | D         |
    | E         |
```

### シナリオ: ヘルプアイコンからマウスを外す
```gherkin
シナリオ: ヘルプアイコンからマウスを外す
  前提 ユーザーがアプリケーションを開いている
  かつ 入力フィールド<フィールド>のヘルプアイコンにマウスオーバーしている
  もし ヘルプアイコンからマウスを外す
  ならば ツールチップが非表示になること

  例:
    | フィールド |
    | A         |
    | B         |
    | C         |
    | D         |
    | E         |
```

## 機能: 相次相続控除額の計算

### シナリオ: 有効な値で控除額を計算する
```gherkin
シナリオ: 有効な値で控除額を計算する
  前提 ユーザーがアプリケーションを開いている
  もし 以下の値を入力する:
    | フィールド | 値       |
    | A         | <A値>    |
    | B         | <B値>    |
    | C         | <C値>    |
    | D         | <D値>    |
    | E         | <E値>    |
  ならば 計算結果に「<期待結果>」と表示されること

  例:
    | A値     | B値      | C値      | D値      | E値 | 期待結果 |
    | 1000000 | 50000000 | 30000000 | 15000000 | 5   | 60,000   |
    | 2000000 | 80000000 | 60000000 | 20000000 | 3   | 333,333  |
    | 3000000 | 90000000 | 90000000 | 45000000 | 8   | 750,000  |
```

### シナリオ: 控除額がゼロになるケース
```gherkin
シナリオ: 控除額がゼロになるケース
  前提 ユーザーがアプリケーションを開いている
  もし 以下の値を入力する:
    | フィールド | 値       |
    | A         | <A値>    |
    | B         | <B値>    |
    | C         | <C値>    |
    | D         | <D値>    |
    | E         | <E値>    |
  ならば 計算結果に「0」と表示されること

  例:
    | A値     | B値      | C値      | D値      | E値 | 理由                   |
    | 1000000 | 0        | 30000000 | 15000000 | 5   | B値が0                 |
    | 1000000 | 50000000 | 0        | 15000000 | 5   | C値が0                 |
    | 1000000 | 50000000 | 30000000 | 15000000 | 10  | E値が10以上            |
    | 0       | 50000000 | 30000000 | 15000000 | 5   | A値が0                 |
```

### シナリオ: 入力値を変更して計算結果が更新される
```gherkin
シナリオ: 入力値を変更して計算結果が更新される
  前提 ユーザーがアプリケーションを開いている
  かつ 以下の値が入力されている:
    | フィールド | 値       |
    | A         | 1000000  |
    | B         | 50000000 |
    | C         | 30000000 |
    | D         | 15000000 |
    | E         | 5        |
  もし 入力フィールド<フィールド>の値を「<新しい値>」に変更する
  ならば 計算結果が「<期待結果>」に更新されること

  例:
    | フィールド | 新しい値  | 期待結果 |
    | A         | 2000000   | 120,000  |
    | B         | 100000000 | 30,000   |
    | C         | 60000000  | 120,000  |
    | D         | 30000000  | 120,000  |
    | E         | 8         | 24,000   |
```

## 機能: 入力値の検証

### シナリオ: 無効な入力値を処理する
```gherkin
シナリオ: 無効な入力値を処理する
  前提 ユーザーがアプリケーションを開いている
  もし 入力フィールド<フィールド>に「<入力値>」と入力する
  ならば 入力フィールドに「<表示値>」と表示されること

  例:
    | フィールド | 入力値   | 表示値   |
    | A         | abc      | 0        |
    | B         | -1000    | 0        |
    | C         | 1,2,3,4  | 1,234    |
    | D         | 1.234.56 | 123,456  |
    | E         | -5       | 0        |
```

### シナリオ: 入力フィールドにフォーカスする
```gherkin
シナリオ: 入力フィールドにフォーカスする
  前提 ユーザーがアプリケーションを開いている
  かつ 入力フィールド<フィールド>の値が「0」である
  もし 入力フィールド<フィールド>にフォーカスする
  ならば 入力フィールドの値が空になること

  例:
    | フィールド |
    | A         |
    | B         |
    | C         |
    | D         |
    | E         |
```

## 機能: ブラウザ互換性

### シナリオ: 異なるブラウザでアプリケーションを使用する
```gherkin
シナリオ: 異なるブラウザでアプリケーションを使用する
  前提 ユーザーが<ブラウザ>を使用している
  もし アプリケーションのURLにアクセスする
  ならば アプリケーションが正常に表示されること
  かつ すべての機能が問題なく動作すること

  例:
    | ブラウザ |
    | Chrome   |
    | Firefox  |
    | Safari   |
    | Edge     |
```

## 機能: アクセシビリティ

### シナリオ: キーボードのみでアプリケーションを操作する
```gherkin
シナリオ: キーボードのみでアプリケーションを操作する
  前提 ユーザーがアプリケーションを開いている
  もし キーボードのTabキーを使って入力フィールド間を移動する
  ならば フォーカスが順番に各入力フィールドに移動すること
  かつ フォーカスされた要素が視覚的に強調表示されること
```

### シナリオ: スクリーンリーダーでアプリケーションを使用する
```gherkin
シナリオ: スクリーンリーダーでアプリケーションを使用する
  前提 ユーザーがスクリーンリーダーを有効にしている
  もし アプリケーションにアクセスする
  ならば すべての要素がスクリーンリーダーで適切に読み上げられること
  かつ 入力フィールドのラベルが関連付けられていること
```

## 機能: パフォーマンス

### シナリオ: アプリケーションの初期ロード時間
```gherkin
シナリオ: アプリケーションの初期ロード時間
  前提 ユーザーがブラウザを開いている
  もし アプリケーションのURLにアクセスする
  ならば 2秒以内にアプリケーションが完全に読み込まれること
```

### シナリオ: 計算処理の応答時間
```gherkin
シナリオ: 計算処理の応答時間
  前提 ユーザーがアプリケーションを開いている
  もし 入力フィールドの値を変更する
  ならば 100ミリ秒以内に計算結果が更新されること
```

## 新機能: 計算過程の透明性と信頼性

### シナリオ: 計算過程の詳細表示
```gherkin
シナリオ: ユーザーが計算過程を確認する
  前提 ユーザーがアプリケーションを開いている
  かつ 以下の値を入力している:
    | フィールド | 値       |
    | A         | 1000000  |
    | B         | 50000000 |
    | C         | 30000000 |
    | D         | 15000000 |
    | E         | 5        |
  もし 「計算過程を表示」ボタンをクリックする
  ならば 計算式が具体的に表示されること
  かつ 各計算ステップが段階的に表示されること
  かつ 各ステップに説明文が付いていること

  例:
    | ステップ | 計算内容 | 説明 |
    | 1       | B-A = 49,000,000 | 前回の相続で取得した財産から相続税額を控除 |
    | 2       | C/(B-A) = 0.612 | 今回の相続財産の前回取得財産に対する割合 |
    | 3       | D/C = 0.5 | 今回取得財産の相続財産総額に対する割合 |
    | 4       | (10-E)/10 = 0.5 | 経過年数による控除率 |
    | 5       | A × 0.612 × 0.5 × 0.5 = 153,000 | 最終的な控除額 |
```

### シナリオ: 国税庁資料への参照
```gherkin
シナリオ: ユーザーが国税庁資料を参照する
  前提 ユーザーがアプリケーションを開いている
  もし 「国税庁の資料を参照」リンクをクリックする
  ならば 相次相続控除に関する国税庁のページが新しいタブで開くこと
  かつ 計算式の根拠となる法令条文へのリンクが表示されること
```

### シナリオ: 監修情報の確認
```gherkin
シナリオ: ユーザーが監修情報を確認する
  前提 ユーザーがアプリケーションを開いている
  もし 「監修情報」リンクをクリックする
  ならば 株式会社Profomerによる監修であることが表示されること
  かつ 監修者の専門性や実績が説明されること
  かつ 最終更新日が表示されること
```

## 新機能: 専門性の証明

### シナリオ: 制度の詳細説明
```gherkin
シナリオ: ユーザーが制度の詳細説明を読む
  前提 ユーザーがアプリケーションを開いている
  もし 「制度の詳細」タブをクリックする
  ならば 相次相続控除の詳細な説明が表示されること
  かつ 専門用語の解説が含まれていること
  かつ 図表やイラストが表示されること
  かつ FAQセクションが表示されること
```

### シナリオ: 他の控除計算へのリンク
```gherkin
シナリオ: ユーザーが他の控除計算に移動する
  前提 ユーザーがアプリケーションを開いている
  もし 「他の控除計算」メニューをクリックする
  ならば 配偶者控除、基礎控除などの計算アプリへのリンクが表示されること
  かつ 各控除の概要説明が表示されること
```

## 新機能: 将来の拡張機能

### シナリオ: 相続税の基礎知識を学ぶ
```gherkin
シナリオ: ユーザーが相続税の基礎知識を学ぶ
  前提 ユーザーがアプリケーションを開いている
  もし 「相続税の基礎知識」リンクをクリックする
  ならば 相続税の基本的な仕組みについての学習コンテンツが表示されること
  かつ 相続税申告の流れが説明されること
  かつ 相続税対策の基礎知識が提供されること
```

### シナリオ: 専門家への相談
```gherkin
シナリオ: ユーザーが専門家に相談する
  前提 ユーザーがアプリケーションを開いている
  もし 「専門家に相談」ボタンをクリックする
  ならば 相談窓口の情報が表示されること
  かつ 相談の流れや費用について説明されること
  かつ 地域別の専門家検索機能へのリンクが表示されること
```

## MVP機能: 家系図による視覚化

### シナリオ: 家系図の表示
```gherkin
シナリオ: ユーザーが家系図を確認する
  前提 ユーザーがアプリケーションを開いている
  もし 家系図エリアを表示する
  ならば 1次相続（父親）と2次相続（母親）の関係が視覚的に表示されること
  かつ 各相続の基本情報（相続人、財産額、相続税額）が表示されること
  かつ 相次相続控除の適用関係が明確に示されること
```

### シナリオ: 家系図と計算結果の連携
```gherkin
シナリオ: 家系図と計算結果が連携する
  前提 ユーザーが入力値を変更している
  もし 家系図上の情報を更新する
  ならば 家系図の表示内容が入力値に応じて更新されること
  かつ 計算結果が家系図上で強調表示されること
  かつ 相次相続控除の適用箇所が視覚的に分かること
```

## MVP機能: 計算過程の透明性

### シナリオ: 計算過程の詳細表示
```gherkin
シナリオ: ユーザーが計算過程を確認する
  前提 ユーザーがアプリケーションを開いている
  かつ 以下の値を入力している:
    | フィールド | 値       |
    | A         | 1000000  |
    | B         | 50000000 |
    | C         | 30000000 |
    | D         | 15000000 |
    | E         | 5        |
  もし 「計算過程を表示」ボタンをクリックする
  ならば 計算式が具体的に表示されること
  かつ 各計算ステップが段階的に表示されること
  かつ 各ステップに説明文が付いていること

  例:
    | ステップ | 計算内容 | 説明 |
    | 1       | B-A = 49,000,000 | 前回の相続で取得した財産から相続税額を控除 |
    | 2       | C/(B-A) = 0.612 | 今回の相続財産の前回取得財産に対する割合 |
    | 3       | D/C = 0.5 | 今回取得財産の相続財産総額に対する割合 |
    | 4       | (10-E)/10 = 0.5 | 経過年数による控除率 |
    | 5       | A × 0.612 × 0.5 × 0.5 = 153,000 | 最終的な控除額 |
```

### シナリオ: 計算根拠の説明
```gherkin
シナリオ: ユーザーが計算根拠を理解する
  前提 ユーザーが計算過程を表示している
  もし 各計算ステップの説明を読む
  ならば なぜその計算を行うのかが分かること
  かつ 計算結果の妥当性を確認できること
  かつ 家族に説明できるレベルで理解できること
```

## MVP機能: 分かりやすい説明

### シナリオ: 制度の概要理解
```gherkin
シナリオ: ユーザーが制度の概要を理解する
  前提 ユーザーがアプリケーションを開いている
  もし 「制度の概要」セクションを読む
  ならば 相次相続控除の目的が分かること
  かつ 適用条件が明確に示されること
  かつ 専門用語が分かりやすく解説されること
```

### シナリオ: FAQによる疑問解決
```gherkin
シナリオ: ユーザーがFAQで疑問を解決する
  前提 ユーザーがアプリケーションを開いている
  もし 「よくある質問」セクションを開く
  ならば よくある疑問と回答が表示されること
  かつ ユーザーの状況に応じた質問が含まれていること
  かつ 専門家への相談案内が適切に表示されること
```

## 成功指標の測定

### シナリオ: 不安解消の測定
```gherkin
シナリオ: ユーザーの不安解消を測定する
  前提 ユーザーがアプリケーションを使用している
  もし アプリ使用前後の不安度を測定する
  ならば 不安度スコアが50%以上改善されること
  かつ 家族への説明自信度が80%以上になること
```

### シナリオ: 理解度の測定
```gherkin
シナリオ: ユーザーの理解度を測定する
  前提 ユーザーがアプリケーションを使用している
  もし 相次相続控除の理解度テストを実施する
  ならば 理解度テストスコアが70%以上になること
  かつ 計算過程の説明が理解できること
```
