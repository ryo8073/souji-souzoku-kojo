// 依存はwindow.XXXで参照
// 例: window.INPUT_DEFINITIONS, window.HEIRS, window.UI, window.Calculator など

window.App = class {
  constructor() {
    this.inputValues = {};
    this.selectedHeirId = 'heir-spouse';
    this.hasCalculated = false;
    this.multiHeirs = [];
    this.init();
  }

  // 和暦計算関数
  getJapaneseEra(year) {
    const yearNum = parseInt(year, 10);
    if (yearNum >= 2019) {
      return `令和${yearNum - 2018}年`;
    } else if (yearNum >= 1989) {
      return `平成${yearNum - 1988}年`;
    } else if (yearNum >= 1926) {
      return `昭和${yearNum - 1925}年`;
    } else if (yearNum >= 1912) {
      return `大正${yearNum - 1911}年`;
    } else if (yearNum >= 1868) {
      return `明治${yearNum - 1867}年`;
    }
    return '';
  }

  // 日付バリデーション
  validateDate(year, month, day) {
    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);
    const dayNum = parseInt(day, 10);
    
    if (yearNum < 1900 || yearNum > 2100) return false;
    if (monthNum < 1 || monthNum > 12) return false;
    
    const date = new Date(yearNum, monthNum - 1, dayNum);
    return date.getFullYear() === yearNum && 
           date.getMonth() === monthNum - 1 && 
           date.getDate() === dayNum;
  }

  // 自動フォーカス移動
  setupAutoFocus() {
    document.addEventListener('input', (e) => {
      const input = e.target;
      if (input.dataset.parent && input.dataset.key) {
        const maxLength = parseInt(input.maxLength, 10);
        if (input.value.length === maxLength) {
          const parent = input.dataset.parent;
          const currentKey = input.dataset.key;
          const fields = ['YEAR', 'MONTH', 'DAY'];
          const currentIndex = fields.findIndex(field => currentKey.includes(field));
          if (currentIndex < fields.length - 1) {
            const nextKey = currentKey.replace(fields[currentIndex], fields[currentIndex + 1]);
            const nextInput = document.getElementById(`${parent}-${nextKey}`);
            if (nextInput) nextInput.focus();
          }
        }
      }
    });
  }

  init() {
    this.populateSingleHeirSelect();
    this.setupEventListeners();
    this.setupAutoFocus();
    this.render();
    this.setupCalcModeToggle();
  }

  populateSingleHeirSelect() {
    const select = document.getElementById('single-heir-select');
    if (!select) return;
    select.innerHTML = '';
    window.HEIRS.forEach(heir => {
      const option = document.createElement('option');
      option.value = heir.id;
      option.textContent = heir.name;
      select.appendChild(option);
    });
  }

  setupEventListeners() {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;
    appContainer.addEventListener('click', this.handleAppClick.bind(this));
    appContainer.addEventListener('input', this.handleFormInput.bind(this));
  }

  handleAppClick(event) {
    const target = event.target;
    const themeToggle = target.closest('#theme-toggle');
    if (themeToggle) {
      this.toggleTheme();
      return;
    }
    const heirButton = target.closest('[data-heir-id]');
    if (heirButton) {
      const heirId = heirButton.dataset.heirId;
      if (window.heirIsSelectable(heirId) && this.selectedHeirId !== heirId) {
        this.selectedHeirId = heirId;
        this.hasCalculated = false;
        this.inputValues = {}; // 切り替え時はリセット
        this.render();
      }
      return;
    }
    const calculateButton = target.closest('#calculate-button');
    if (calculateButton && !calculateButton.disabled) {
      this.hasCalculated = true;
      this.calculate();
    }
  }

  handleFormInput(event) {
    const input = event.target;
    if ((input.tagName !== 'INPUT' && input.tagName !== 'SELECT') || !input.dataset.key) return;
    const key = input.dataset.key;
    // ドロップダウンinputの処理
    if (input.dataset.parent && (key.includes('YEAR') || key.includes('MONTH') || key.includes('DAY'))) {
      this.inputValues[key] = input.value;
      // Eの再計算
      if (this.hasCalculated) {
        this.calculate();
      }
      this.render();
      return;
    }
    
    // 通常のinput処理
    this.inputValues[key] = input.value;
    if (key === 'E_METHOD') {
      this.handleMethodChange(input.value);
      this.render();
      return;
    }
    // E_YEARSバリデーション
    if (key === 'E_YEARS') {
      const val = input.value.trim();
      if (!/^\d{1,2}$/.test(val)) {
        input.setCustomValidity('1～2桁の整数年で入力してください');
        input.reportValidity();
        return;
      } else {
        input.setCustomValidity('');
      }
    }
    const value = input.value.replace(/,/g, '');
    if (window.INPUT_DEFINITIONS[key]?.unit === '円' && value !== '') {
      if (!isNaN(value)) {
        input.value = parseInt(value, 10).toLocaleString('ja-JP');
      }
    }
    if (key === 'E1' || key === 'E2') {
      this.render();
    }
    if (this.hasCalculated) {
      this.calculate();
    }
  }

  handleMethodChange(method) {
    const yearsContainer = document.getElementById('input-E-years');
    const date1Container = document.getElementById('input-E1');
    const date2Container = document.getElementById('input-E2');
    const eField = document.getElementById('input-E');
    if (method === 'years') {
      if (yearsContainer) yearsContainer.classList.remove('hidden');
      if (date1Container) date1Container.classList.add('hidden');
      if (date2Container) date2Container.classList.add('hidden');
      if (eField) eField.classList.add('hidden');
    } else {
      // 日付入力時、デフォルト値をセット
      if (!this.inputValues.E1_YEAR) this.inputValues.E1_YEAR = '2019';
      if (!this.inputValues.E1_MONTH) this.inputValues.E1_MONTH = '04';
      if (!this.inputValues.E1_DAY) this.inputValues.E1_DAY = '01';
      if (!this.inputValues.E2_YEAR) this.inputValues.E2_YEAR = '2025';
      if (!this.inputValues.E2_MONTH) this.inputValues.E2_MONTH = '11';
      if (!this.inputValues.E2_DAY) this.inputValues.E2_DAY = '01';
      if (yearsContainer) yearsContainer.classList.add('hidden');
      if (date1Container) date1Container.classList.remove('hidden');
      if (date2Container) date2Container.classList.remove('hidden');
      if (eField) eField.classList.remove('hidden');
    }
  }

  render() {
    const selectedHeir = window.HEIRS.find(h => h.id === this.selectedHeirId);
    Object.values(window.INPUT_DEFINITIONS).forEach(field => {
      let value = (this.inputValues[field.key] !== undefined)
        ? this.inputValues[field.key]
        : (selectedHeir ? selectedHeir.values[field.key] : 0);
      let extra = {};
      if (field.type === 'date-dropdown') {
        extra = { inputValues: this.inputValues };
      }
      window.UI.renderInputField(field, value, extra);
    });
    if (selectedHeir) {
      const method = (this.inputValues.E_METHOD !== undefined)
        ? this.inputValues.E_METHOD
        : (selectedHeir.values.E_METHOD || 'years');
      this.handleMethodChange(method);
    }
    // Eの再計算
    const method = (this.inputValues.E_METHOD !== undefined)
      ? this.inputValues.E_METHOD
      : (selectedHeir?.values.E_METHOD || 'years');
    let eValue = '';
    if (method === 'dates') {
      // ドロップダウンから日付を組み立て
      const e1Year = this.inputValues.E1_YEAR || selectedHeir?.values.E1_YEAR;
      const e1Month = this.inputValues.E1_MONTH || selectedHeir?.values.E1_MONTH;
      const e1Day = this.inputValues.E1_DAY || selectedHeir?.values.E1_DAY;
      const e2Year = this.inputValues.E2_YEAR || selectedHeir?.values.E2_YEAR;
      const e2Month = this.inputValues.E2_MONTH || selectedHeir?.values.E2_MONTH;
      const e2Day = this.inputValues.E2_DAY || selectedHeir?.values.E2_DAY;
      if (e1Year && e1Month && e1Day && e2Year && e2Month && e2Day) {
        const date1 = new Date(parseInt(e1Year,10), parseInt(e1Month,10)-1, parseInt(e1Day,10));
        const date2 = new Date(parseInt(e2Year,10), parseInt(e2Month,10)-1, parseInt(e2Day,10));
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          let years = date2.getFullYear() - date1.getFullYear();
          if (
            date2.getMonth() < date1.getMonth() ||
            (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())
          ) {
            years--;
          }
          eValue = years;
          this.inputValues.E = years;
        }
      }
    } else if (method === 'years') {
      eValue = (this.inputValues.E_YEARS !== undefined) ? parseInt(this.inputValues.E_YEARS, 10) || '' : '';
      this.inputValues.E = eValue;
    }
    const eField = document.getElementById('input-E');
    if (eField) {
      window.UI.renderInputField({
        key: 'E',
        id: 'input-E',
        label: '経過年数',
        unit: '年',
        helpTitle: 'E: 経過年数',
        helpText: '前回の相続開始日と今回の相続開始日から自動計算されます。',
      }, eValue);
      if (method === 'dates') {
        eField.classList.remove('hidden');
      } else {
        eField.classList.add('hidden');
        const eInput = document.getElementById('input-E-input');
        if (eInput) eInput.value = '';
      }
    }
    lucide.createIcons();
  }

  calculate() {
    // 複数人計算モードなら何もしない
    const multiBtn = document.getElementById('calc-mode-multi');
    if (multiBtn && multiBtn.getAttribute('aria-pressed') === 'true') {
      return;
    }
    console.log('calculate() called');
    window.UI.setLoading(true);
    const values = {};
    Object.keys(window.INPUT_DEFINITIONS).forEach(key => {
      const definition = window.INPUT_DEFINITIONS[key];
      let v = (this.inputValues[key] !== undefined) ? this.inputValues[key] : undefined;
      if (v === undefined) {
        const selectedHeir = window.HEIRS.find(h => h.id === this.selectedHeirId);
        v = selectedHeir ? selectedHeir.values[key] : (definition.type === 'date' ? '' : 0);
      }
      if (definition.type === 'date') {
        values[key] = v;
      } else if (definition.type === 'select') {
        values[key] = v;
      } else {
        const rawValue = (typeof v === 'string') ? v.replace(/,/g, '') : v;
        values[key] = parseFloat(rawValue) || 0;
      }
    });
    console.log('Input values:', values);

    // 選択相続人の区分を判定
    const selectedHeir = window.HEIRS.find(h => h.id === this.selectedHeirId);
    let category = '法定相続人';
    if (selectedHeir && selectedHeir.values && selectedHeir.values.category) {
      category = selectedHeir.values.category;
    } else if (selectedHeir && selectedHeir.name && selectedHeir.name.includes('相続放棄')) {
      category = '相続放棄';
    } else if (selectedHeir && selectedHeir.name && selectedHeir.name.includes('法定外')) {
      category = '法定外';
    }
    let reason = '';
    if (category === '相続放棄') {
      reason = '相続放棄のため0円';
    } else if (category === '相続欠格') {
      reason = '相続欠格のため0円';
    } else if (category !== '法定相続人') {
      reason = '法定相続人でないため0円';
    }
    if (reason) {
      setTimeout(() => {
        window.UI.updateResult({ finalAmount: 0, steps: [{ title: category, calculation: '', result: reason }] });
        window.UI.setLoading(false);
      }, 400);
      return;
    }

    // Calculate years based on selected method
    if (values.E_METHOD === 'years') {
      if (values.E_YEARS === '10+') {
        values.E = 10;
      } else {
        values.E = Math.floor(values.E_YEARS || 0);
      }
    } else if (values.E_METHOD === 'dates') {
      const e1Year = this.inputValues.E1_YEAR;
      const e1Month = this.inputValues.E1_MONTH;
      const e1Day = this.inputValues.E1_DAY;
      const e2Year = this.inputValues.E2_YEAR;
      const e2Month = this.inputValues.E2_MONTH;
      const e2Day = this.inputValues.E2_DAY;
      if (e1Year && e1Month && e1Day && e2Year && e2Month && e2Day) {
        const date1 = new Date(e1Year, e1Month - 1, e1Day);
        const date2 = new Date(e2Year, e2Month - 1, e2Day);
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          const daysDiff = (date2 - date1) / (1000 * 60 * 60 * 24);
          values.E = Math.floor(daysDiff / 365.25);
        } else {
          values.E = 0;
        }
      } else {
        values.E = 0;
      }
    } else {
      values.E = 0;
    }
    console.log('Final values for calculation:', values);
    const result = window.Calculator.calculateDeduction(values);
    console.log('Calculation result:', result);
    setTimeout(() => {
      window.UI.updateResult(result);
      window.UI.setLoading(false);
    }, 400);
  }

  setupCalcModeToggle() {
    const singleBtn = document.getElementById('calc-mode-single');
    const multiBtn = document.getElementById('calc-mode-multi');
    const multiTable = document.getElementById('multi-heirs-table');
    const singleHeirSelectRow = document.getElementById('single-heir-select-row');
    const singleHeirSelect = document.getElementById('single-heir-select');
    if (!singleBtn || !multiBtn || !multiTable || !singleHeirSelectRow || !singleHeirSelect) return;

    // 1人ずつ計算時の相続人選択ドロップダウンイベント
    singleHeirSelect.addEventListener('change', (e) => {
      this.selectedHeirId = e.target.value;
      this.hasCalculated = false;
      this.inputValues = {}; // 切り替え時はリセット
      this.render();
    });

    // ボタンUIの切り替え
    singleBtn.addEventListener('click', () => {
      singleBtn.setAttribute('aria-pressed', 'true');
      multiBtn.setAttribute('aria-pressed', 'false');
      multiTable.classList.add('hidden');
      singleHeirSelectRow.classList.remove('hidden');
      // D欄を表示
      const dField = document.getElementById('input-D');
      if (dField) dField.classList.remove('hidden');
      // D説明を非表示
      const dDesc = document.getElementById('desc-D');
      if (dDesc) dDesc.classList.add('hidden');
      // 初期値に配偶者を設定
      this.selectedHeirId = 'heir-spouse';
      this.hasCalculated = false;
      this.inputValues = {};
      this.render();
    });
    multiBtn.addEventListener('click', () => {
      singleBtn.setAttribute('aria-pressed', 'false');
      multiBtn.setAttribute('aria-pressed', 'true');
      this.multiHeirs = JSON.parse(JSON.stringify(window.DEFAULT_MULTI_HEIRS));
      window.renderMultiHeirsTable(this.multiHeirs);
      multiTable.classList.remove('hidden');
      singleHeirSelectRow.classList.add('hidden');
      // D欄を非表示
      const dField = document.getElementById('input-D');
      if (dField) dField.classList.add('hidden');
      // D説明を表示
      const dDesc = document.getElementById('desc-D');
      if (dDesc) dDesc.classList.remove('hidden');
    });

    // 初期化
    if (multiBtn.getAttribute('aria-pressed') === 'true') {
      this.multiHeirs = JSON.parse(JSON.stringify(window.DEFAULT_MULTI_HEIRS));
      window.renderMultiHeirsTable(this.multiHeirs);
      multiTable.classList.remove('hidden');
      singleHeirSelectRow.classList.add('hidden');
      // D欄を非表示
      const dField = document.getElementById('input-D');
      if (dField) dField.classList.add('hidden');
      // D説明を表示
      const dDesc = document.getElementById('desc-D');
      if (dDesc) dDesc.classList.remove('hidden');
    } else {
      multiTable.classList.add('hidden');
      singleHeirSelectRow.classList.remove('hidden');
      // D欄を表示
      const dField = document.getElementById('input-D');
      if (dField) dField.classList.remove('hidden');
      // D説明を非表示
      const dDesc = document.getElementById('desc-D');
      if (dDesc) dDesc.classList.add('hidden');
      // 初期値に配偶者を設定
      this.selectedHeirId = 'heir-spouse';
      this.hasCalculated = false;
      this.inputValues = {};
      this.render();
    }
    // 追加・削除・編集イベント
    document.getElementById('add-heir-btn').onclick = () => {
      this.multiHeirs.push({ relationship: '', category: '法定相続人', amount: 0, deduction: 0 });
      window.renderMultiHeirsTable(this.multiHeirs);
    };
    document.getElementById('multi-heirs-tbody').onclick = (e) => {
      const btn = e.target.closest('button[data-multi-heir-action="remove"]');
      if (btn) {
        const idx = parseInt(btn.dataset.multiHeirIndex, 10);
        this.multiHeirs.splice(idx, 1);
        window.renderMultiHeirsTable(this.multiHeirs);
      }
    };
    document.getElementById('multi-heirs-tbody').onchange = (e) => {
      const sel = e.target;
      const idx = parseInt(sel.dataset.multiHeirIndex, 10);
      const field = sel.dataset.multiHeirField;
      if (field && this.multiHeirs[idx]) {
        if (field === 'amount') {
          // カンマ除去して数値化
          const raw = sel.value.replace(/,/g, '');
          this.multiHeirs[idx][field] = parseInt(raw, 10) || 0;
        } else {
          this.multiHeirs[idx][field] = sel.value;
        }
        // 入力変更時は再描画のみ、計算はボタン押下時のみ
        console.log('[DEBUG] multiHeirs after edit:', JSON.stringify(this.multiHeirs));
        window.renderMultiHeirsTable(this.multiHeirs);
      }
    };
    // 計算ボタン
    document.getElementById('calculate-button').onclick = () => {
      if (multiBtn.getAttribute('aria-pressed') === 'true') {
        // フォームから最新の値を取得
        this.inputValues = this.getInputValuesFromForm();
        console.log('[DEBUG] getInputValuesFromForm:', this.inputValues);
        const baseValues = this.getBaseInputValues();
        console.log('[DEBUG] getBaseInputValues:', baseValues);
        // multiHeirsの内容を出力
        console.log('[DEBUG] multiHeirs before calculation:', JSON.stringify(this.multiHeirs));
        // ボタン押下時のみ控除額を再計算
        this.calculateMultiHeirs();
      } else {
        this.hasCalculated = true;
        this.calculate();
        // 結果へスクロール（1人ずつ計算時のみ）
        setTimeout(() => {
          const result = document.getElementById('result-container');
          if (result) {
            result.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    };
  }

  calculateMultiHeirs() {
    // Eの再計算（1人ずつ計算と同じロジック）
    let eValue = 0;
    const method = this.inputValues.E_METHOD;
    // ここでE1/E2の値を出力
    console.log('[DEBUG] E1/E2 values:', this.inputValues.E1_YEAR, this.inputValues.E1_MONTH, this.inputValues.E1_DAY, this.inputValues.E2_YEAR, this.inputValues.E2_MONTH, this.inputValues.E2_DAY);
    if (method === 'years') {
      if (this.inputValues.E_YEARS === '10+') {
        eValue = 10;
      } else {
        eValue = Math.floor(this.inputValues.E_YEARS || 0);
      }
    } else if (method === 'dates') {
      const e1Year = this.inputValues.E1_YEAR;
      const e1Month = this.inputValues.E1_MONTH;
      const e1Day = this.inputValues.E1_DAY;
      const e2Year = this.inputValues.E2_YEAR;
      const e2Month = this.inputValues.E2_MONTH;
      const e2Day = this.inputValues.E2_DAY;
      if (e1Year && e1Month && e1Day && e2Year && e2Month && e2Day) {
        const date1 = new Date(parseInt(e1Year,10), parseInt(e1Month,10)-1, parseInt(e1Day,10));
        const date2 = new Date(parseInt(e2Year,10), parseInt(e2Month,10)-1, parseInt(e2Day,10));
        if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
          const daysDiff = (date2 - date1) / (1000 * 60 * 60 * 24);
          eValue = Math.floor(daysDiff / 365.25);
        }
      }
    }
    this.inputValues.E = eValue;
    console.log('[DEBUG] E after date diff:', eValue, this.inputValues.E);

    // A,B,C,EはinputValuesから、Dは各相続人の表の値を使う
    const baseValues = this.getBaseInputValues();
    // getBaseInputValuesのE出力
    console.log('[DEBUG] getBaseInputValues E:', baseValues.E);
    this.multiHeirs.forEach((h, i) => {
      let amount = h.amount;
      if (typeof amount === 'string') {
        amount = amount.replace(/,/g, '');
      }
      amount = parseInt(amount, 10) || 0;
      let reason = '';
      if (h.category === '相続放棄') {
        reason = '相続放棄のため0円';
      } else if (h.category === '相続欠格') {
        reason = '相続欠格のため0円';
      } else if (h.category !== '法定相続人') {
        reason = '法定相続人でないため0円';
      }
      if (h.category === '法定相続人') {
        const values = { ...baseValues, D: amount };
        // 強制的にEをthis.inputValues.Eで上書き
        values.E = this.inputValues.E;
        const result = window.Calculator.calculateDeduction(values);
        h.deduction = isNaN(result.finalAmount) ? 0 : Math.floor(result.finalAmount);
        h.deductionReason = undefined;
        // 一番上の人だけ詳細計算過程を表示
        if (i === 0) {
          window.UI.updateResult(result);
        }
      } else {
        h.deduction = 0;
        h.deductionReason = reason;
        // 一番上の人が法定相続人以外なら理由を計算根拠に表示
        if (i === 0) {
          window.UI.updateResult({ finalAmount: 0, steps: [{ title: h.category, calculation: '', result: reason }] });
        }
      }
    });
    // 修正: 計算後はisCalculated=trueで呼び出す
    window.renderMultiHeirsTable(this.multiHeirs, true);
  }

  getBaseInputValues() {
    // 入力欄からA,B,C,Eなどを取得
    const values = {};
    Object.keys(window.INPUT_DEFINITIONS).forEach(key => {
      if (key === 'D') return;
      if (key === 'E') {
        values.E = (this.inputValues.E !== undefined) ? this.inputValues.E : 0;
        return;
      }
      // 複数人計算時はselectedHeirId/selectedHeirを参照しない
      let v = (this.inputValues[key] !== undefined) ? this.inputValues[key] : (window.INPUT_DEFINITIONS[key].type === 'date' ? '' : 0);
      if (window.INPUT_DEFINITIONS[key].type === 'date') {
        values[key] = v;
      } else if (window.INPUT_DEFINITIONS[key].type === 'select') {
        values[key] = v;
      } else {
        const rawValue = (typeof v === 'string') ? v.replace(/,/g, '') : v;
        values[key] = parseFloat(rawValue) || 0;
      }
    });
    return values;
  }

  toggleTheme() {
    document.documentElement.classList.toggle('dark');
  }

  getInputValuesFromForm() {
    // input, select要素から値を取得しinputValuesを返す
    const values = {};
    Object.keys(window.INPUT_DEFINITIONS).forEach(key => {
      if (key === 'D') return;
      const el = document.getElementById(`${window.INPUT_DEFINITIONS[key].id}-input`);
      if (el) {
        if (el.type === 'checkbox') {
          values[key] = el.checked;
        } else if (el.tagName === 'SELECT') {
          values[key] = el.value;
        } else {
          const rawValue = (typeof el.value === 'string') ? el.value.replace(/,/g, '') : el.value;
          values[key] = rawValue;
        }
      } else {
        values[key] = this.inputValues[key] !== undefined ? this.inputValues[key] : '';
      }
      if (["A","B","C","E_METHOD","E_YEARS"].includes(key)) {
        console.log(`[DEBUG getInputValuesFromForm] key=${key}, id=${window.INPUT_DEFINITIONS[key].id}-input, value=`, values[key]);
      }
    });
    // E1/E2系も必ず取得
    ["E1_YEAR","E1_MONTH","E1_DAY","E2_YEAR","E2_MONTH","E2_DAY"].forEach(key => {
      const el = document.getElementById(`input-${key.toLowerCase()}-input`);
      if (el) {
        values[key] = el.value;
      } else {
        values[key] = this.inputValues[key] !== undefined ? this.inputValues[key] : '';
      }
    });
    return values;
  }
};

// Initial theme setup
if (localStorage.getItem('theme') === 'dark' || 
   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new window.App();
}); 