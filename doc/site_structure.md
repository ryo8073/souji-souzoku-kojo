# 相次相続控除額 計算シミュレーター
# サイト構造設計書

**文書バージョン:** 1.0  
**作成日:** 2025年6月18日  
**作成者:** Manus AI

## 1. サイト構造概要

### 1.1 全体構成
「相次相続控除額 計算シミュレーター」は、単一ページのウェブアプリケーションとして構築します。すべての機能とコンテンツは1つのページに集約し、ユーザーが簡単に操作できるようにします。

### 1.2 主要セクション
1. **ヘッダーセクション**
   - タイトル
   - サブタイトル（必要に応じて）

2. **説明セクション**
   - 相次相続控除の概要説明
   - 適用条件の説明

3. **入力セクション**
   - 5つの入力フィールド（A〜E）
   - 各フィールドのラベルとヘルプアイコン

4. **結果セクション**
   - 計算結果の表示
   - 単位（円）の表示

5. **ツールチップ（動的表示）**
   - 各入力項目の詳細説明
   - 参照すべき書類や欄の案内
   - 注意点や補足情報

## 2. 詳細レイアウト設計

### 2.1 ヘッダーセクション
```html
<header class="text-center mb-10">
    <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800">相次相続控除額 計算シミュレーター</h1>
</header>
```

### 2.2 説明セクション
```html
<section class="mb-12 prose max-w-none prose-slate">
    <h2 class="text-xl font-semibold text-slate-700">相次相続控除とは？</h2>
    <p id="main-description" class="text-slate-600"></p>
</section>
```

### 2.3 入力セクション
```html
<main class="lg:col-span-3">
    <div class="space-y-6">
        <!-- 入力フィールドA -->
        <div class="input-group">
            <label for="input-a" class="flex items-center text-sm font-medium text-slate-700 mb-2">
                <span>A: 前回の相続で納めた相続税額</span>
                <i data-lucide="help-circle" class="w-4 h-4 ml-2 text-slate-400 cursor-pointer help-icon" data-tooltip-id="a"></i>
            </label>
            <div class="relative">
                <input type="text" id="input-a" class="form-input" placeholder="0">
                <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-slate-500">円</span>
            </div>
        </div>
        
        <!-- 入力フィールドB〜E（同様の構造） -->
        <!-- ... -->
    </div>
</main>
```

### 2.4 結果セクション
```html
<aside class="lg:col-span-2 flex items-center justify-center">
    <div class="bg-slate-50 rounded-xl p-8 w-full h-full flex flex-col items-center justify-center text-center border border-slate-200">
        <h3 class="text-base font-medium text-slate-600 mb-2">計算結果</h3>
        <p class="text-lg font-semibold text-blue-600 mb-4">控除額</p>
        <div id="result" class="text-4xl lg:text-5xl font-bold text-blue-600 tracking-tight">
            0<span class="text-2xl ml-2 font-medium">円</span>
        </div>
    </div>
</aside>
```

### 2.5 ツールチップ（動的表示）
```html
<div id="tooltip" class="tooltip"></div>
```

## 3. レスポンシブデザイン設計

### 3.1 デスクトップレイアウト（1025px以上）
- 入力セクションと結果セクションを横並びに配置（グリッドレイアウト）
- 入力セクションが左側3/5、結果セクションが右側2/5の比率
- 十分な余白を確保し、読みやすさを重視

### 3.2 タブレットレイアウト（641px〜1024px）
- 入力セクションと結果セクションを横並びに配置（グリッドレイアウト）
- 余白を適度に調整し、コンテンツの可読性を維持

### 3.3 モバイルレイアウト（〜640px）
- 入力セクションと結果セクションを縦に積み重ねて配置
- 入力セクションを上部に、結果セクションを下部に配置
- タップしやすいサイズの入力フィールドとボタンを確保

## 4. 説明コンテンツ設計

### 4.1 相次相続控除の概要説明
```javascript
export const mainDescription = `10年以内に相続が続けて発生した場合、ご家族の相続税の負担が大きくなりすぎないように調整するための制度です。前回の相続から10年以内に次の相続が発生した場合、前回の相続で納めた相続税の一部を、今回の相続税額から差し引くことができます。`;
```

### 4.2 入力項目の説明（ツールチップ内容）

#### A. 前回の相続で納めた相続税額
```javascript
{
    title: "A. 前回の相続で納めた相続税額",
    description: "今回亡くなられた方が、前回の相続の際に実際に支払った相続税の総額です。前回の相続税申告書の「第1表」にある「⑪ 納付税額」の金額を入力します。",
    noteTitle: "ご注意点",
    note: "利子税や延滞税は含めません。この金額が0円の場合は、相次相続控除は利用できません。"
}
```

#### B. 前回に取得した財産の価額
```javascript
{
    title: "B. 前回に取得した財産の価額",
    description: "今回亡くなられた方が、前回の相続で実際に受け取った財産の価額（プラスの財産からマイナスの財産を引いた後）です。前回の相続税申告書「第11表」の「相続税がかかる財産の価額(a)」の金額を入力します。",
    noteTitle: "ご注意点",
    note: "相続時精算課税制度を適用した財産の価額も含まれます。"
}
```

#### C. 今回の相続財産の総額
```javascript
{
    title: "C. 今回の相続財産の総額",
    description: "今回の相続で、相続人全員が受け取る財産の合計額（プラスの財産から借入金や葬式費用などを引いた後）です。今回の相続税申告書「第1表」の「⑪ 相続税の課税価格の合計額」の金額を入力します。",
    noteTitle: "ポイント",
    note: "あなたご自身だけでなく、相続人『全員』の財産の合計額です。"
}
```

#### D. あなたが今回取得した財産の価額
```javascript
{
    title: "D. あなたが今回取得した財産の価額",
    description: "今回の相続で、あなたご自身が実際に受け取る財産の価額（プラスの財産から引き継ぐ借入金などを引いた後）です。今回の相続税申告書「第1表」にある、ご自身の氏名が記載された欄の「⑪ 課税価格」の金額を入力します。",
    noteTitle: "ポイント",
    note: "Cの金額のうち、あなたが取得した分の金額となります。"
}
```

#### E. 前回の相続からの経過年数
```javascript
{
    title: "E. 前回の相続からの経過年数",
    description: "前回の相続開始日（1回目の方が亡くなられた日）から、今回の相続開始日までの経過年数です。1年未満の端数は切り捨てて、整数で入力してください。",
    noteTitle: "計算例",
    note: "経過期間が「7年11ヶ月」の場合は「7」年と入力します。経過年数が10年以上の場合、控除額は0円になります。"
}
```

### 4.3 相次相続控除の適用条件説明

アプリケーションの説明セクションに追加する内容として、以下の適用条件を明記します：

```html
<div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
    <h3 class="text-sm font-medium text-blue-800 mb-2">ご利用になれる方の条件</h3>
    <ul class="text-sm text-blue-700 space-y-1 list-disc list-inside">
        <li>あなたが、今回亡くなられた方の法律上の相続人であること。</li>
        <li>今回の相続（2回目）が、前回の相続（1回目）から10年以内に発生していること。</li>
        <li>前回の相続の際に、今回亡くなられた方が相続税を実際に納めていること。</li>
    </ul>
    <p class="text-xs text-blue-600 mt-2">※各種控除を適用した結果、納税額が0円だった場合は対象外となります。</p>
</div>
```

### 4.4 計算式の説明

計算式を視覚的に表示するセクションを追加します：

```html
<div class="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
    <h3 class="text-sm font-medium text-slate-700 mb-2">計算式</h3>
    <p class="text-sm text-slate-600 font-mono bg-white p-2 rounded border border-slate-200">
        控除額 = A × (C / B) × (D / C) × (10 - E) / 10
    </p>
    <p class="text-xs text-slate-500 mt-2">※計算結果は小数点以下を切り捨てます。</p>
</div>
```

## 5. インタラクション設計

### 5.1 入力フィールドの動作
- フォーカス時：値が「0」の場合は空欄にする
- 入力時：数値以外の文字を自動的に除去し、3桁ごとにカンマ区切りを適用
- フォーカスを外した時：空欄の場合は「0」を表示
- 入力値の変更時：即時に計算結果を更新

### 5.2 ヘルプアイコンの動作
- マウスオーバー時：ツールチップを表示
- マウスアウト時：ツールチップを非表示

### 5.3 計算結果の更新
- 入力値が変更されるたびに即時計算
- 計算結果は3桁ごとにカンマ区切りで表示
- 小数点以下は切り捨て

## 6. アクセシビリティ設計

### 6.1 キーボードアクセシビリティ
- すべての入力フィールドにTabキーでアクセス可能
- フォーカス状態を視覚的に明示（ボーダーカラー変更など）

### 6.2 スクリーンリーダー対応
- 適切なaria属性を使用
- 入力フィールドとラベルの関連付け
- ツールチップの適切なaria-labelledby属性設定

### 6.3 コントラスト比
- テキストと背景のコントラスト比は4.5:1以上を確保
- フォーカス状態の視覚的表示は3:1以上のコントラスト比を確保

## 7. 拡張性を考慮した設計

### 7.1 将来的な機能拡張の考慮
- データ保存機能の追加を想定したコード構造
- 複数のケース管理機能の追加を想定したデータ構造
- PDF出力機能の追加を想定したレイアウト設計

### 7.2 多言語対応の考慮
- テキストコンテンツの外部化
- 言語切り替え機能の追加を想定した構造

### 7.3 テーマ切り替えの考慮
- ダークモード対応を想定したCSS変数の使用
- テーマ切り替え機能の追加を想定した構造
