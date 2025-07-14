# 相次相続控除額計算シミュレーター
# アーキテクチャ設計書

**文書バージョン:** 1.0  
**作成日:** 2025年6月26日  
**作成者:** システムアーキテクト

## 1. 非機能要件

### 1.1 パフォーマンス要件
- **計算応答時間:** 600ms以内
- **初期ロード時間:** 2秒以内
- **家系図描画時間:** 1秒以内

### 1.2 レスポンシブ要件
- **優先デバイス:** PC（デスクトップ・ラップトップ）
- **将来的対応:** スマートフォン（縦スクロール表示）
- **最小画面幅:** 1024px
- **推奨画面幅:** 1280px以上

### 1.3 ブラウザ互換性
- **主要ターゲット:** Chromium系ブラウザ（Chrome, Edge, Brave）
- **最小バージョン:** Chrome 90以上
- **フォールバック:** 基本的な機能は他のモダンブラウザでも動作

### 1.4 アクセシビリティ要件
- **WCAG準拠:** レベルAAを目標
- **キーボード操作:** 全機能をキーボードで操作可能
- **スクリーンリーダー:** 基本的な読み上げ対応
- **コントラスト比:** 4.5:1以上

## 2. 技術的制約

### 2.1 開発環境
- **開発期間:** 1週間以内（MVP）
- **開発ツール:** Cursor + AI、AIエージェント
- **チーム規模:** 1名（AI支援開発）

### 2.2 技術スタック制約
- **フロントエンド:** React + TypeScript（既存）
- **スタイリング:** Tailwind CSS（既存）
- **状態管理:** Zustand（軽量、シンプル）
- **外部ライブラリ:** 必要に応じて使用可能

### 2.3 データ制約
- **データ永続化:** なし（セッション内のみ）
- **外部API:** なし（完全クライアントサイド）
- **データベース:** 使用しない

## 3. アーキテクチャ設計

### 3.1 全体アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
├─────────────────────────────────────────────────────────────┤
│  React Components                                           │
│  ├── FamilyTreeComponent (SVG + React / D3.js)             │
│  ├── CalculationProcessComponent                            │
│  ├── InputFormComponent                                     │
│  └── ResultDisplayComponent                                 │
├─────────────────────────────────────────────────────────────┤
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  Zustand Store                                              │
│  ├── CalculationStore                                       │
│  ├── UIStateStore                                           │
│  └── FamilyTreeStore                                        │
├─────────────────────────────────────────────────────────────┤
│                    Utility Layer                            │
├─────────────────────────────────────────────────────────────┤
│  ├── calculationUtils.ts                                    │
│  ├── dateUtils.ts                                           │
│  ├── validationUtils.ts                                     │
│  └── accessibilityUtils.ts                                  │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 コンポーネント設計

#### 3.2.1 FamilyTreeComponent
**責任:** 家系図の視覚化と相続関係の表示

```typescript
interface FamilyTreeProps {
  firstInheritance: InheritanceData;
  secondInheritance: InheritanceData;
  calculationResult: CalculationResult;
  onNodeClick?: (nodeId: string) => void;
}

interface InheritanceData {
  decedent: Person;
  heirs: Person[];
  totalAssets: number;
  inheritanceTax: number;
  date: Date;
}

interface Person {
  id: string;
  name: string;
  relationship: string;
  inheritedAmount?: number;
}
```

**実装選択肢:**
1. **SVG + React:** 完全にカスタマイズ可能、軽量
2. **D3.js:** 豊富な機能、学習コストあり

**推奨:** SVG + React（カスタマイズ性と軽量性を重視）

#### 3.2.2 CalculationProcessComponent
**責任:** 計算過程の段階的表示と説明

```typescript
interface CalculationStep {
  step: number;
  formula: string;
  calculation: string;
  result: number;
  explanation: string;
}

interface CalculationProcessProps {
  inputValues: InputValues;
  calculationSteps: CalculationStep[];
  isExpanded: boolean;
  onToggle: () => void;
}
```

#### 3.2.3 InputFormComponent
**責任:** 5つの入力項目の管理とバリデーション

```typescript
interface InputValues {
  A: number; // 前回の相続で納めた相続税額
  B: number; // 前回に取得した財産の価額
  C: number; // 今回の相続財産の総額
  D: number; // 今回取得した財産の価額
  E: number | DateCalculation; // 経過年数または日付計算
}

interface DateCalculation {
  firstInheritanceDate: Date;
  secondInheritanceDate: Date;
}
```

### 3.3 状態管理設計

#### 3.3.1 CalculationStore
```typescript
interface CalculationState {
  inputValues: InputValues;
  calculationResult: number;
  calculationSteps: CalculationStep[];
  isValid: boolean;
  errors: ValidationError[];
  
  // Actions
  updateInputValue: (field: keyof InputValues, value: number | DateCalculation) => void;
  calculate: () => void;
  reset: () => void;
  validate: () => ValidationError[];
}
```

#### 3.3.2 UIStateStore
```typescript
interface UIState {
  isCalculationExpanded: boolean;
  activeHelpField: string | null;
  selectedFamilyTreeNode: string | null;
  isMobile: boolean;
  
  // Actions
  toggleCalculationExpanded: () => void;
  setActiveHelpField: (field: string | null) => void;
  setSelectedFamilyTreeNode: (nodeId: string | null) => void;
  updateResponsiveState: () => void;
}
```

### 3.4 データフロー設計

```
Input Form → Validation → Calculation Store → 
Calculation Utils → Result → UI Update → 
Family Tree Update → Calculation Process Display
```

#### 3.4.1 計算フロー
1. **入力値変更** → バリデーション実行
2. **全項目入力完了** → 計算実行
3. **計算結果更新** → 家系図更新
4. **計算過程生成** → 表示更新

#### 3.4.2 日付計算フロー
1. **日付入力** → 経過年数計算
2. **年数更新** → 計算再実行

## 4. 技術的決定記録（ADR）

### ADR-001: 家系図実装技術の選択

**背景:** MVPで家系図による視覚化が必要。既存でSVG+ReactとD3.jsの両方を実験的に実装済み。

**決定事項:** SVG + Reactを採用

**検討された選択肢:**
1. **SVG + React:** 完全カスタマイズ、軽量、学習コスト低
2. **D3.js:** 豊富な機能、学習コスト高、バンドルサイズ大

**理由:**
- 開発期間が1週間と短い
- カスタマイズ性が高い
- バンドルサイズが小さい
- 既存のReact知識を活用可能

### ADR-002: 状態管理ライブラリの選択

**背景:** 計算状態とUI状態の管理が必要。データベースは使用しない。

**決定事項:** Zustandを採用

**検討された選択肢:**
1. **Zustand:** 軽量、シンプル、TypeScript対応
2. **Redux Toolkit:** 機能豊富、学習コスト高
3. **Context API:** 標準、複雑な状態管理には不向き

**理由:**
- 軽量でシンプル
- TypeScript対応が優れている
- 学習コストが低い
- セッション内の状態管理に適している

### ADR-003: 日付計算方式の選択

**背景:** E項目（経過年数）を直接入力または日付から計算する選択肢がある。

**決定事項:** 両方の方式をサポート

**実装方式:**
- デフォルト: 年数直接入力
- オプション: 日付入力による自動計算
- 切り替え可能なUI

**理由:**
- ユーザビリティの向上
- 入力ミスの防止
- 柔軟性の確保

## 5. 非機能要件の詳細化

### 5.1 パフォーマンス最適化

#### 5.1.1 計算最適化
- **メモ化:** React.memo、useMemo、useCallbackの活用
- **計算キャッシュ:** 同じ入力値での再計算を回避
- **遅延計算:** 全項目入力完了まで計算を遅延

#### 5.1.2 レンダリング最適化
- **仮想化:** 大量データ表示時の仮想化（将来的）
- **レンダリング分割:** 重いコンポーネントの分割
- **CSS最適化:** Tailwind CSSの最適化

### 5.2 アクセシビリティ実装

#### 5.2.1 キーボード操作
- **フォーカス管理:** 論理的なフォーカス順序
- **ショートカット:** 主要機能のキーボードショートカット
- **スキップリンク:** メインコンテンツへのスキップ

#### 5.2.2 スクリーンリーダー対応
- **ARIA属性:** 適切なARIA属性の設定
- **セマンティックHTML:** 意味のあるHTML構造
- **代替テキスト:** 画像・図表の代替テキスト

### 5.3 レスポンシブ設計

#### 5.3.1 ブレークポイント設計
```css
/* PC優先設計 */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* 将来的なモバイル対応 */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}
```

#### 5.3.2 コンポーネントレスポンシブ
- **家系図:** PCでは横並び、モバイルでは縦スクロール
- **計算過程:** PCでは展開表示、モバイルでは折りたたみ
- **入力フォーム:** モバイルでは1列表示

## 6. 開発計画

### 6.1 Week 1: 基本機能開発

**Day 1-2: 基盤構築**
- プロジェクト構造の整理
- Zustandストアの実装
- 基本計算ロジックの実装

**Day 3-4: 入力フォーム**
- InputFormComponentの実装
- バリデーション機能
- 日付計算機能

**Day 5: 計算過程表示**
- CalculationProcessComponentの実装
- 段階的計算表示

### 6.2 Week 2: 家系図と統合

**Day 1-3: 家系図実装**
- FamilyTreeComponentの実装（SVG + React）
- 相続関係の視覚化
- 計算結果との連携

**Day 4-5: 統合とテスト**
- 全コンポーネントの統合
- ユーザビリティテスト
- バグ修正と最適化

## 7. リスクと対策

### 7.1 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 家系図の複雑な実装 | 高 | 段階的実装、プロトタイプ先行 |
| 計算精度の確保 | 高 | 国税庁事例との徹底検証 |
| レスポンシブ対応 | 中 | モバイルファースト設計 |

### 7.2 開発リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 開発期間の超過 | 高 | MVP機能の厳格な絞り込み |
| 技術的負債の蓄積 | 中 | コードレビュー、リファクタリング |

## 8. 成功指標

### 8.1 技術指標
- **計算応答時間:** 600ms以内
- **初期ロード時間:** 2秒以内
- **バンドルサイズ:** 500KB以下
- **Lighthouse スコア:** 90以上

### 8.2 品質指標
- **テストカバレッジ:** 80%以上
- **アクセシビリティスコア:** WCAG AA準拠
- **ブラウザ互換性:** Chrome 90以上で動作

このアーキテクチャ設計に基づいて、具体的な実装に進むことができます。 