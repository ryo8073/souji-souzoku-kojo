// グローバル変数として定義
window.INPUT_DEFINITIONS = {
  A: {
    key: 'A',
    id: 'input-A',
    label: '前回の相続税額',
    unit: '円',
    helpTitle: 'A: 前回の相続で納めた相続税額',
    helpText: '「第一次相続」の際に、今回亡くなった方（第二次相続の被相続人）が支払った相続税の総額です。相続税申告書の第1表「16 納税額」や「18 納付税額」に記載されている金額を指します。'
  },
  B: {
    key: 'B',
    id: 'input-B',
    label: '前回の取得財産価額',
    unit: '円',
    helpTitle: 'B: 前回に取得した財産の価額',
    helpText: '「第一次相続」の際に、今回亡くなった方（第二次相続の被相続人）が取得した財産の価額です。これには、債務や葬式費用を差し引いた後の純粋な資産額が含まれます。'
  },
  C: {
    key: 'C',
    id: 'input-C',
    label: '今回の相続財産の総額',
    unit: '円',
    helpTitle: 'C: 今回の相続財産の総額',
    helpText: '「第二次相続」における、すべての相続人が取得した財産の合計額です。これも、債務や葬式費用を差し引いた後の純粋な資産額の合計を指します。'
  },
  D: {
    key: 'D',
    id: 'input-D',
    label: 'あなたの取得財産価額',
    unit: '円',
    helpTitle: 'D: あなたが今回取得した財産の価額',
    helpText: '「第二次相続」において、この控除を計算するあなた自身が取得した財産の価額です。'
  },
  E_METHOD: {
    key: 'E_METHOD',
    id: 'input-E-method',
    label: '期間の入力方法',
    unit: '',
    type: 'select',
    options: [
      { value: 'years', label: '年数で直接入力' },
      { value: 'dates', label: '日付で入力' }
    ],
    helpTitle: '期間の入力方法を選択',
    helpText: '相続の間隔を年数で直接入力するか、具体的な日付を入力するかを選択してください。',
    default: 'years'
  },
  E_YEARS: {
    key: 'E_YEARS',
    id: 'input-E-years',
    label: '相続の間隔（年数）',
    unit: '年',
    type: 'text',
    helpTitle: 'E: 相続の間隔（年数）',
    helpText: '前回の相続から今回の相続までの経過年数を整数で入力してください（例：7）。1年未満は切り捨ててください。',
    placeholder: '例：7'
  },
  E1: {
    key: 'E1',
    id: 'input-E1',
    label: '前回の相続開始日',
    unit: '',
    type: 'date-dropdown',
    helpTitle: 'E1: 前回の相続開始日',
    helpText: '第一次相続の開始日（亡くなった日）を選択してください。',
    fields: [
      { key: 'E1_YEAR', label: '年', type: 'select', options: 'yearsWithWareki' },
      { key: 'E1_MONTH', label: '月', type: 'select', options: 'months' },
      { key: 'E1_DAY', label: '日', type: 'select', options: 'days' }
    ]
  },
  E2: {
    key: 'E2',
    id: 'input-E2',
    label: '今回の相続開始日',
    unit: '',
    type: 'date-dropdown',
    helpTitle: 'E2: 今回の相続開始日',
    helpText: '第二次相続の開始日（亡くなった日）を選択してください。',
    fields: [
      { key: 'E2_YEAR', label: '年', type: 'select', options: 'yearsWithWareki' },
      { key: 'E2_MONTH', label: '月', type: 'select', options: 'months' },
      { key: 'E2_DAY', label: '日', type: 'select', options: 'days' }
    ]
  }
};

window.HEIRS = [
  { 
    id: 'heir-spouse', 
    name: '配偶者', 
    values: { 
      A: 20000000, 
      B: 85000000, 
      C: 444000000, 
      D: 250000000, 
      E_METHOD: 'years', 
      E_YEARS: 6,
      E1_YEAR: '2018', E1_MONTH: '01', E1_DAY: '15',
      E2_YEAR: '2024', E2_MONTH: '07', E2_DAY: '08'
    },
    isPrimary: true 
  },
  { 
    id: 'heir-son1', 
    name: '長男', 
    values: { 
      A: 20000000, 
      B: 85000000, 
      C: 444000000, 
      D: 100000000, 
      E_METHOD: 'years', 
      E_YEARS: 6,
      E1_YEAR: '2018', E1_MONTH: '01', E1_DAY: '15',
      E2_YEAR: '2024', E2_MONTH: '07', E2_DAY: '08'
    }
  },
  { 
    id: 'heir-son2', 
    name: '次男', 
    values: { 
      A: 20000000, 
      B: 85000000, 
      C: 444000000, 
      D: 65000000, 
      E_METHOD: 'years', 
      E_YEARS: 6,
      E1_YEAR: '2018', E1_MONTH: '01', E1_DAY: '15',
      E2_YEAR: '2024', E2_MONTH: '07', E2_DAY: '08'
    }
  },
  { 
    id: 'heir-son3', 
    name: '三男 (相続放棄)', 
    values: { 
      A: 20000000, 
      B: 85000000, 
      C: 444000000, 
      D: 9000000, 
      E_METHOD: 'years', 
      E_YEARS: 6,
      E1_YEAR: '', E1_MONTH: '', E1_DAY: '',
      E2_YEAR: '', E2_MONTH: '', E2_DAY: ''
    },
    isSelectable: false 
  },
  {
    id: 'heir-grandmother',
    name: '祖母（法定外）',
    values: {
      A: 20000000,
      B: 85000000,
      C: 444000000,
      D: 20000000,
      E_METHOD: 'years',
      E_YEARS: 6,
      E1_YEAR: '', E1_MONTH: '', E1_DAY: '',
      E2_YEAR: '', E2_MONTH: '', E2_DAY: ''
    }
  },
];

window.heirIsSelectable = function(heirId) {
  const heir = window.HEIRS.find(h => h.id === heirId);
  return heir ? heir.isSelectable !== false : false;
};

// 初期事例データ
window.DEFAULT_MULTI_HEIRS = [
  { relationship: '配偶者', category: '法定相続人', amount: 250000000, deduction: 0 },
  { relationship: '長男', category: '法定相続人', amount: 100000000, deduction: 0 },
  { relationship: '次男', category: '法定相続人', amount: 65000000, deduction: 0 },
  { relationship: '三男', category: '相続放棄', amount: 9000000, deduction: 0 },
  { relationship: '祖母', category: '法定外', amount: 20000000, deduction: 0 },
]; 