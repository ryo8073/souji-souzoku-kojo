// グローバル変数としてtemplatesを定義
window.templates = [
  {
    id: 'default',
    name: 'デフォルト事例',
    default: true,
    heirs: window.HEIRS ? window.HEIRS.map(heir => ({
      id: heir.id,
      name: heir.name,
      A: heir.values.A,
      B: heir.values.B,
      C: heir.values.C,
      D: heir.values.D,
      E: heir.values.E_YEARS,
      E_METHOD: heir.values.E_METHOD,
      E1_YEAR: heir.values.E1_YEAR,
      E1_MONTH: heir.values.E1_MONTH,
      E1_DAY: heir.values.E1_DAY,
      E2_YEAR: heir.values.E2_YEAR,
      E2_MONTH: heir.values.E2_MONTH,
      E2_DAY: heir.values.E2_DAY,
      isSelectable: heir.isSelectable !== false
    })) : [],
    nodes: [
      { id: 'grandfather', label: '祖父（第一次相続の被相続人）', x: 100, y: 50 },
      { id: 'father', label: '父（第二次相続の被相続人）', x: 100, y: 150 },
      { id: 'mother', label: '母（配偶者）', x: 200, y: 150 },
      { id: 'son1', label: '長男', x: 50, y: 250 },
      { id: 'son2', label: '次男', x: 150, y: 250 },
      { id: 'son3', label: '三男（相続放棄）', x: 250, y: 250 },
      { id: 'grandmother', label: '祖母（法定外）', x: 350, y: 150 }
    ],
    edges: [
      { from: 'grandfather', to: 'father' },
      { from: 'father', to: 'mother' },
      { from: 'father', to: 'son1' },
      { from: 'father', to: 'son2' },
      { from: 'father', to: 'son3' },
      { from: 'father', to: 'grandmother' }
    ]
  }
]; 