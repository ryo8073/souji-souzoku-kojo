# 相次相続控除額計算シミュレーター
# 実装詳細設計書

**文書バージョン:** 1.0  
**作成日:** 2025年6月26日  
**作成者:** システムアーキテクト

## 1. 家系図コンポーネントの技術設計

### 1.1 FamilyTreeComponent 実装詳細

#### 1.1.1 コンポーネント構造
```typescript
// src/components/FamilyTree/FamilyTreeComponent.tsx
interface FamilyTreeProps {
  firstInheritance: InheritanceData;
  secondInheritance: InheritanceData;
  calculationResult: number;
  onNodeClick?: (nodeId: string) => void;
}

const FamilyTreeComponent: React.FC<FamilyTreeProps> = ({
  firstInheritance,
  secondInheritance,
  calculationResult,
  onNodeClick
}) => {
  return (
    <div className="family-tree-container">
      <svg width="100%" height="400" viewBox="0 0 1200 400">
        {/* 1次相続（父親）の表示 */}
        <FirstInheritanceGroup 
          data={firstInheritance}
          x={100}
          y={50}
          onNodeClick={onNodeClick}
        />
        
        {/* 2次相続（母親）の表示 */}
        <SecondInheritanceGroup 
          data={secondInheritance}
          x={600}
          y={50}
          onNodeClick={onNodeClick}
        />
        
        {/* 相次相続控除の表示 */}
        <DeductionDisplay 
          amount={calculationResult}
          x={350}
          y={300}
        />
        
        {/* 接続線 */}
        <ConnectionLines 
          firstInheritance={firstInheritance}
          secondInheritance={secondInheritance}
        />
      </svg>
    </div>
  );
};
```

#### 1.1.2 SVG要素の設計
```typescript
// src/components/FamilyTree/SVGComponents.tsx

// 人物ノードの表示
const PersonNode: React.FC<PersonNodeProps> = ({ person, x, y, onClick }) => {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={() => onClick?.(person.id)}>
      <rect 
        width="120" 
        height="60" 
        rx="8" 
        className="person-node"
        role="button"
        tabIndex={0}
        aria-label={`${person.name} (${person.relationship})`}
      />
      <text x="60" y="25" textAnchor="middle" className="person-name">
        {person.name}
      </text>
      <text x="60" y="45" textAnchor="middle" className="person-relationship">
        {person.relationship}
      </text>
      {person.inheritedAmount && (
        <text x="60" y="55" textAnchor="middle" className="inherited-amount">
          {formatCurrency(person.inheritedAmount)}
        </text>
      )}
    </g>
  );
};

// 相続グループの表示
const InheritanceGroup: React.FC<InheritanceGroupProps> = ({ 
  inheritance, 
  x, 
  y, 
  title,
  onNodeClick 
}) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <text x="0" y="-10" className="inheritance-title">{title}</text>
      
      {/* 被相続人 */}
      <PersonNode 
        person={inheritance.decedent}
        x={0}
        y={0}
        onClick={onNodeClick}
      />
      
      {/* 相続人たち */}
      {inheritance.heirs.map((heir, index) => (
        <PersonNode 
          key={heir.id}
          person={heir}
          x={index * 140}
          y={100}
          onClick={onNodeClick}
        />
      ))}
      
      {/* 相続情報 */}
      <InheritanceInfo 
        totalAssets={inheritance.totalAssets}
        inheritanceTax={inheritance.inheritanceTax}
        date={inheritance.date}
        x={0}
        y={180}
      />
    </g>
  );
};
```

#### 1.1.3 レスポンシブ対応
```typescript
// src/hooks/useResponsive.ts
export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return { isMobile, isTablet };
};

// 家系図のレスポンシブ対応
const FamilyTreeComponent: React.FC<FamilyTreeProps> = (props) => {
  const { isMobile } = useResponsive();

  if (isMobile) {
    return <MobileFamilyTree {...props} />;
  }

  return <DesktopFamilyTree {...props} />;
};
```

### 1.2 計算過程表示のアーキテクチャ

#### 1.2.1 CalculationProcessComponent 実装
```typescript
// src/components/CalculationProcess/CalculationProcessComponent.tsx
interface CalculationProcessProps {
  inputValues: InputValues;
  calculationSteps: CalculationStep[];
  isExpanded: boolean;
  onToggle: () => void;
}

const CalculationProcessComponent: React.FC<CalculationProcessProps> = ({
  inputValues,
  calculationSteps,
  isExpanded,
  onToggle
}) => {
  return (
    <div className="calculation-process">
      <button 
        onClick={onToggle}
        className="toggle-button"
        aria-expanded={isExpanded}
        aria-controls="calculation-steps"
      >
        <span>計算過程を{isExpanded ? '隠す' : '表示'}</span>
        <ChevronIcon className={`chevron ${isExpanded ? 'expanded' : ''}`} />
      </button>
      
      {isExpanded && (
        <div id="calculation-steps" className="calculation-steps">
          <div className="input-summary">
            <h3>入力値</h3>
            <InputSummary values={inputValues} />
          </div>
          
          <div className="calculation-formula">
            <h3>計算式</h3>
            <FormulaDisplay inputValues={inputValues} />
          </div>
          
          <div className="calculation-steps">
            <h3>計算過程</h3>
            {calculationSteps.map((step, index) => (
              <CalculationStep 
                key={index}
                step={step}
                stepNumber={index + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

#### 1.2.2 計算ステップの表示
```typescript
// src/components/CalculationProcess/CalculationStep.tsx
const CalculationStep: React.FC<{ step: CalculationStep; stepNumber: number }> = ({
  step,
  stepNumber
}) => {
  return (
    <div className="calculation-step" role="region" aria-label={`計算ステップ ${stepNumber}`}>
      <div className="step-header">
        <span className="step-number">{stepNumber}</span>
        <span className="step-explanation">{step.explanation}</span>
      </div>
      
      <div className="step-content">
        <div className="formula">
          <code>{step.formula}</code>
        </div>
        
        <div className="calculation">
          <span className="calculation-text">{step.calculation}</span>
          <span className="calculation-result">= {formatNumber(step.result)}</span>
        </div>
      </div>
    </div>
  );
};
```

#### 1.2.3 計算ロジックの実装
```typescript
// src/utils/calculationUtils.ts
export const calculateSuccessiveInheritanceDeduction = (
  inputValues: InputValues
): { result: number; steps: CalculationStep[] } => {
  const { A, B, C, D, E } = inputValues;
  
  // 経過年数の取得
  const years = typeof E === 'number' ? E : calculateYearsFromDates(E);
  
  // 計算ステップの生成
  const steps: CalculationStep[] = [];
  
  // ステップ1: B - A (前回取得財産から相続税額を控除)
  const step1Result = B - A;
  steps.push({
    step: 1,
    formula: 'B - A',
    calculation: `${formatNumber(B)} - ${formatNumber(A)}`,
    result: step1Result,
    explanation: '前回の相続で取得した財産から相続税額を控除'
  });
  
  // ステップ2: C / (B - A) (今回相続財産の前回取得財産に対する割合)
  const step2Result = C / step1Result;
  steps.push({
    step: 2,
    formula: 'C / (B - A)',
    calculation: `${formatNumber(C)} / ${formatNumber(step1Result)}`,
    result: step2Result,
    explanation: '今回の相続財産の前回取得財産に対する割合'
  });
  
  // ステップ3: D / C (今回取得財産の相続財産総額に対する割合)
  const step3Result = D / C;
  steps.push({
    step: 3,
    formula: 'D / C',
    calculation: `${formatNumber(D)} / ${formatNumber(C)}`,
    result: step3Result,
    explanation: '今回取得財産の相続財産総額に対する割合'
  });
  
  // ステップ4: (10 - E) / 10 (経過年数による控除率)
  const step4Result = (10 - years) / 10;
  steps.push({
    step: 4,
    formula: '(10 - E) / 10',
    calculation: `(10 - ${years}) / 10`,
    result: step4Result,
    explanation: '経過年数による控除率'
  });
  
  // ステップ5: 最終計算
  const finalResult = A * step2Result * step3Result * step4Result;
  steps.push({
    step: 5,
    formula: 'A × (C/(B-A)) × (D/C) × ((10-E)/10)',
    calculation: `${formatNumber(A)} × ${step2Result.toFixed(3)} × ${step3Result.toFixed(3)} × ${step4Result.toFixed(3)}`,
    result: Math.floor(finalResult),
    explanation: '最終的な相次相続控除額'
  });
  
  return {
    result: Math.floor(finalResult),
    steps
  };
};
```

## 2. 状態管理の詳細実装

### 2.1 Zustandストアの実装

#### 2.1.1 CalculationStore
```typescript
// src/stores/calculationStore.ts
import { create } from 'zustand';
import { calculateSuccessiveInheritanceDeduction } from '../utils/calculationUtils';

interface CalculationState {
  // State
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

export const useCalculationStore = create<CalculationState>((set, get) => ({
  // Initial state
  inputValues: {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0
  },
  calculationResult: 0,
  calculationSteps: [],
  isValid: false,
  errors: [],
  
  // Actions
  updateInputValue: (field, value) => {
    set((state) => {
      const newInputValues = { ...state.inputValues, [field]: value };
      const errors = get().validate();
      const isValid = errors.length === 0;
      
      return {
        inputValues: newInputValues,
        errors,
        isValid
      };
    });
    
    // 全項目が入力されていれば計算実行
    const { inputValues, isValid } = get();
    if (isValid && Object.values(inputValues).every(v => v !== 0)) {
      get().calculate();
    }
  },
  
  calculate: () => {
    const { inputValues } = get();
    const { result, steps } = calculateSuccessiveInheritanceDeduction(inputValues);
    
    set({
      calculationResult: result,
      calculationSteps: steps
    });
  },
  
  reset: () => {
    set({
      inputValues: { A: 0, B: 0, C: 0, D: 0, E: 0 },
      calculationResult: 0,
      calculationSteps: [],
      isValid: false,
      errors: []
    });
  },
  
  validate: () => {
    const { inputValues } = get();
    const errors: ValidationError[] = [];
    
    // 各項目のバリデーション
    if (inputValues.A < 0) errors.push({ field: 'A', message: '相続税額は0以上で入力してください' });
    if (inputValues.B < 0) errors.push({ field: 'B', message: '財産価額は0以上で入力してください' });
    if (inputValues.C < 0) errors.push({ field: 'C', message: '相続財産総額は0以上で入力してください' });
    if (inputValues.D < 0) errors.push({ field: 'D', message: '取得財産価額は0以上で入力してください' });
    
    // 経過年数のバリデーション
    const years = typeof inputValues.E === 'number' ? inputValues.E : calculateYearsFromDates(inputValues.E);
    if (years < 0 || years > 10) {
      errors.push({ field: 'E', message: '経過年数は0年以上10年未満で入力してください' });
    }
    
    // 論理的整合性のチェック
    if (inputValues.B <= inputValues.A) {
      errors.push({ field: 'B', message: '前回取得財産は前回相続税額より大きい必要があります' });
    }
    
    return errors;
  }
}));
```

#### 2.1.2 UIStateStore
```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  // State
  isCalculationExpanded: boolean;
  activeHelpField: string | null;
  selectedFamilyTreeNode: string | null;
  isMobile: boolean;
  isDateCalculationMode: boolean;
  
  // Actions
  toggleCalculationExpanded: () => void;
  setActiveHelpField: (field: string | null) => void;
  setSelectedFamilyTreeNode: (nodeId: string | null) => void;
  updateResponsiveState: () => void;
  toggleDateCalculationMode: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  isCalculationExpanded: false,
  activeHelpField: null,
  selectedFamilyTreeNode: null,
  isMobile: false,
  isDateCalculationMode: false,
  
  // Actions
  toggleCalculationExpanded: () => set((state) => ({ 
    isCalculationExpanded: !state.isCalculationExpanded 
  })),
  
  setActiveHelpField: (field) => set({ activeHelpField: field }),
  
  setSelectedFamilyTreeNode: (nodeId) => set({ selectedFamilyTreeNode: nodeId }),
  
  updateResponsiveState: () => {
    const isMobile = window.innerWidth < 768;
    set({ isMobile });
  },
  
  toggleDateCalculationMode: () => set((state) => ({ 
    isDateCalculationMode: !state.isDateCalculationMode 
  }))
}));
```

### 2.2 入力フォームの実装

#### 2.2.1 InputFormComponent
```typescript
// src/components/InputForm/InputFormComponent.tsx
const InputFormComponent: React.FC = () => {
  const { inputValues, updateInputValue, errors } = useCalculationStore();
  const { isDateCalculationMode, toggleDateCalculationMode } = useUIStore();
  
  return (
    <div className="input-form">
      <div className="form-header">
        <h2>相次相続控除額の計算</h2>
        <div className="calculation-mode-toggle">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={isDateCalculationMode}
              onChange={toggleDateCalculationMode}
            />
            <span>日付から経過年数を計算</span>
          </label>
        </div>
      </div>
      
      <div className="input-fields">
        <InputField
          label="A: 前回の相続で納めた相続税額"
          value={inputValues.A}
          onChange={(value) => updateInputValue('A', value)}
          error={errors.find(e => e.field === 'A')?.message}
          helpText="前回の相続で実際に納めた相続税額を入力してください"
        />
        
        <InputField
          label="B: 前回に取得した財産の価額"
          value={inputValues.B}
          onChange={(value) => updateInputValue('B', value)}
          error={errors.find(e => e.field === 'B')?.message}
          helpText="前回の相続で取得した財産の価額を入力してください"
        />
        
        <InputField
          label="C: 今回の相続財産の総額"
          value={inputValues.C}
          onChange={(value) => updateInputValue('C', value)}
          error={errors.find(e => e.field === 'C')?.message}
          helpText="今回の相続財産の総額を入力してください"
        />
        
        <InputField
          label="D: 今回取得した財産の価額"
          value={inputValues.D}
          onChange={(value) => updateInputValue('D', value)}
          error={errors.find(e => e.field === 'D')?.message}
          helpText="今回の相続で取得した財産の価額を入力してください"
        />
        
        {isDateCalculationMode ? (
          <DateInputField
            label="E: 経過年数（日付から計算）"
            firstDate={inputValues.E.firstInheritanceDate}
            secondDate={inputValues.E.secondInheritanceDate}
            onChange={(dates) => updateInputValue('E', dates)}
            error={errors.find(e => e.field === 'E')?.message}
            helpText="前回と今回の相続開始日を入力してください"
          />
        ) : (
          <InputField
            label="E: 経過年数"
            value={inputValues.E}
            onChange={(value) => updateInputValue('E', value)}
            error={errors.find(e => e.field === 'E')?.message}
            helpText="前回の相続開始日から今回の相続開始日までの経過年数を入力してください"
            type="number"
            min="0"
            max="9.99"
            step="0.01"
          />
        )}
      </div>
    </div>
  );
};
```

## 3. 非機能要件の実装詳細

### 3.1 パフォーマンス最適化

#### 3.1.1 メモ化の実装
```typescript
// src/components/FamilyTree/FamilyTreeComponent.tsx
const FamilyTreeComponent = React.memo<FamilyTreeProps>(({
  firstInheritance,
  secondInheritance,
  calculationResult,
  onNodeClick
}) => {
  // コンポーネントの実装
});

// src/components/CalculationProcess/CalculationStep.tsx
const CalculationStep = React.memo<{ step: CalculationStep; stepNumber: number }>(({
  step,
  stepNumber
}) => {
  // コンポーネントの実装
});
```

#### 3.1.2 計算キャッシュの実装
```typescript
// src/utils/calculationUtils.ts
const calculationCache = new Map<string, { result: number; steps: CalculationStep[] }>();

export const calculateSuccessiveInheritanceDeduction = (
  inputValues: InputValues
): { result: number; steps: CalculationStep[] } => {
  // キャッシュキーの生成
  const cacheKey = JSON.stringify(inputValues);
  
  // キャッシュから取得
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey)!;
  }
  
  // 計算実行
  const result = performCalculation(inputValues);
  
  // キャッシュに保存
  calculationCache.set(cacheKey, result);
  
  // キャッシュサイズの制限（最大100件）
  if (calculationCache.size > 100) {
    const firstKey = calculationCache.keys().next().value;
    calculationCache.delete(firstKey);
  }
  
  return result;
};
```

### 3.2 アクセシビリティ実装

#### 3.2.1 キーボード操作の実装
```typescript
// src/components/InputForm/InputField.tsx
const InputField: React.FC<InputFieldProps> = ({ label, value, onChange, error, helpText }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 次のフィールドにフォーカス
      const nextField = e.currentTarget.parentElement?.nextElementSibling?.querySelector('input');
      nextField?.focus();
    }
  };
  
  return (
    <div className="input-field">
      <label htmlFor={label} className="input-label">
        {label}
        <HelpIcon 
          helpText={helpText}
          aria-label={`${label}の詳細説明`}
        />
      </label>
      <input
        id={label}
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onKeyDown={handleKeyDown}
        aria-describedby={error ? `${label}-error` : undefined}
        aria-invalid={!!error}
      />
      {error && (
        <div id={`${label}-error`} className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};
```

#### 3.2.2 スクリーンリーダー対応
```typescript
// src/components/FamilyTree/PersonNode.tsx
const PersonNode: React.FC<PersonNodeProps> = ({ person, x, y, onClick }) => {
  return (
    <g 
      transform={`translate(${x}, ${y})`} 
      onClick={() => onClick?.(person.id)}
      role="button"
      tabIndex={0}
      aria-label={`${person.name} (${person.relationship})`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(person.id);
        }
      }}
    >
      {/* SVG要素 */}
    </g>
  );
};
```

### 3.3 レスポンシブ設計の実装

#### 3.3.1 モバイル対応の家系図
```typescript
// src/components/FamilyTree/MobileFamilyTree.tsx
const MobileFamilyTree: React.FC<FamilyTreeProps> = (props) => {
  return (
    <div className="mobile-family-tree">
      <div className="inheritance-section">
        <h3>1次相続（父親）</h3>
        <InheritanceSummary data={props.firstInheritance} />
      </div>
      
      <div className="inheritance-section">
        <h3>2次相続（母親）</h3>
        <InheritanceSummary data={props.secondInheritance} />
      </div>
      
      <div className="deduction-section">
        <h3>相次相続控除額</h3>
        <div className="deduction-amount">
          {formatCurrency(props.calculationResult)}
        </div>
      </div>
    </div>
  );
};
```

## 4. 開発計画の詳細

### 4.1 Day 1-2: 基盤構築
- [ ] プロジェクト構造の整理
- [ ] Zustandストアの実装
- [ ] 基本計算ロジックの実装
- [ ] 型定義の作成

### 4.2 Day 3-4: 入力フォーム
- [ ] InputFormComponentの実装
- [ ] バリデーション機能
- [ ] 日付計算機能
- [ ] ヘルプ機能

### 4.3 Day 5: 計算過程表示
- [ ] CalculationProcessComponentの実装
- [ ] 段階的計算表示
- [ ] レスポンシブ対応

### 4.4 Day 6-7: 家系図と統合
- [ ] FamilyTreeComponentの実装
- [ ] SVG要素の作成
- [ ] 計算結果との連携
- [ ] 統合テスト

この実装詳細設計に基づいて、具体的なコーディングに進むことができます。 