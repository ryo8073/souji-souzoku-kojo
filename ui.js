/**
 * UI Manager
 *
 * This module is responsible for all direct DOM manipulation. It acts as the
 * presentation layer, receiving data from the main application logic and
 * rendering it to the user. It is designed to be stateless and declarative.
 * @module UI
 */

function getElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    console.warn(`Element with ID "${id}" not found.`);
  }
  return element;
}

// 続柄・区分の選択肢
const RELATIONSHIP_OPTIONS = [
  '配偶者', '長男', '次男', '三男', '長女', '次女', '三女', '孫', '養子', '祖母', '祖父', '叔父', '叔母', 'その他'
];
const CATEGORY_OPTIONS = [
  '法定相続人', '相続放棄', '相続欠格', '法定外', 'その他'
];

// 初期事例データ
const DEFAULT_MULTI_HEIRS = [
  { relationship: '配偶者', category: '法定相続人', amount: 250000000, deduction: 0 },
  { relationship: '長男', category: '法定相続人', amount: 100000000, deduction: 0 },
  { relationship: '次男', category: '法定相続人', amount: 65000000, deduction: 0 },
  { relationship: '三男', category: '相続放棄', amount: 9000000, deduction: 0 },
  { relationship: '祖母', category: '法定外', amount: 20000000, deduction: 0 },
];

function renderMultiHeirsTable(heirs, isCalculated = false) {
  const container = getElement('multi-heirs-table');
  if (!container) return;

  const tbody = getElement('multi-heirs-tbody');
  if (!tbody) return;

  const rows = heirs.map((heir, index) => `
    <tr>
      <td>
        <select class="form-input text-sm" data-multi-heir-index="${index}" data-multi-heir-field="relationship">
          ${RELATIONSHIP_OPTIONS.map(option => 
            `<option value="${option}" ${heir.relationship === option ? 'selected' : ''}>${option}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <select class="form-input text-sm" data-multi-heir-index="${index}" data-multi-heir-field="category">
          ${CATEGORY_OPTIONS.map(option => 
            `<option value="${option}" ${heir.category === option ? 'selected' : ''}>${option}</option>`
          ).join('')}
        </select>
      </td>
      <td>
        <input type="text" class="form-input text-sm amount-cell" data-multi-heir-index="${index}" data-multi-heir-field="amount" 
               value="${heir.amount.toLocaleString('ja-JP')}" ${isCalculated ? 'readonly' : ''}>
      </td>
      <td>
        <input type="text" class="form-input text-sm amount-cell" data-multi-heir-index="${index}" data-multi-heir-field="deduction" 
               value="${heir.deduction.toLocaleString('ja-JP')}" readonly>
      </td>
      <td>
        <span class="reason-cell ${heir.deduction === 0 ? 'zero-reason' : ''}">${heir.reason || ''}</span>
      </td>
      <td>
        <button type="button" class="remove-btn btn btn-sm btn-outline" data-multi-heir-action="remove" data-multi-heir-index="${index}">削除</button>
      </td>
    </tr>
  `).join('');

  tbody.innerHTML = rows;
}

window.UI = {
  renderInputField(field, value, extra = {}) {
    const container = getElement(field.id);
    if (!container) return;

    // Field code labels
    const fieldCodes = {
      A: '(A)',
      B: '(B)',
      C: '(C)',
      D: '(D)',
      E: '(E)',
      E1: '(E1)',
      E2: '(E2)',
      E_METHOD: '(E)',
      E_YEARS: '(E)',
    };
    const codeLabel = fieldCodes[field.key] ? `<span class="font-mono text-xs text-primary-600 dark:text-primary-400 mr-1 font-bold">${fieldCodes[field.key]}</span>` : '';

    let inputHtml = '';
    if (field.key === 'E_YEARS') {
      // 0～9と「10以上」のドロップダウン
      inputHtml = `
        <select
          id="${field.id}-input"
          class="form-input"
          data-key="${field.key}"
        >
          ${Array.from({length: 10}, (_, i) => `<option value="${i}" ${value == i ? 'selected' : ''}>${i}</option>`).join('')}
          <option value="10+" ${value == '10+' ? 'selected' : ''}>10以上</option>
        </select>
      `;
    } else if (field.type === 'number') {
      inputHtml = `
        <input
          type="number"
          id="${field.id}-input"
          class="form-input"
          inputmode="numeric"
          pattern="\\d*"
          step="1"
          min="0"
          data-key="${field.key}"
          value="${parseInt(value, 10) || ''}"
        />
      `;
    } else if (field.type === 'select') {
      const optionsHtml = field.options.map(option => 
        `<option value="${option.value}" ${value === option.value ? 'selected' : ''}>${option.label}</option>`
      ).join('');
      inputHtml = `
        <select
          id="${field.id}-input"
          class="form-input"
          data-key="${field.key}"
        >
          ${optionsHtml}
        </select>
      `;
    } else if (field.type === 'date') {
      inputHtml = `
        <input
          type="date"
          id="${field.id}-input"
          class="form-input"
          data-key="${field.key}"
          value="${value || ''}"
        />
      `;
    } else if (field.type === 'date-dropdown') {
      // 年月日ドロップダウン
      const getYearsWithWareki = () => {
        const years = [];
        const now = new Date();
        for (let y = now.getFullYear() + 2; y >= 1900; y--) {
          let wareki = '';
          if (y >= 2019) wareki = `令和${y - 2018}年`;
          else if (y >= 1989) wareki = `平成${y - 1988}年`;
          else if (y >= 1926) wareki = `昭和${y - 1925}年`;
          else if (y >= 1912) wareki = `大正${y - 1911}年`;
          else if (y >= 1868) wareki = `明治${y - 1867}年`;
          years.push({ value: y, label: `${y}（${wareki}）` });
        }
        return years;
      };
      const getMonths = () => Array.from({length: 12}, (_, i) => ({ value: (i+1).toString().padStart(2, '0'), label: (i+1).toString() }));
      const getDays = (year, month) => {
        if (!year || !month) return Array.from({length: 31}, (_, i) => ({ value: (i+1).toString().padStart(2, '0'), label: (i+1).toString() }));
        const last = new Date(parseInt(year,10), parseInt(month,10), 0).getDate();
        return Array.from({length: last}, (_, i) => ({ value: (i+1).toString().padStart(2, '0'), label: (i+1).toString() }));
      };
      const inputValues = extra.inputValues || {};
      const parentKey = field.key;
      const yearKey = `${parentKey}_YEAR`;
      const monthKey = `${parentKey}_MONTH`;
      const dayKey = `${parentKey}_DAY`;
      const yearVal = inputValues[yearKey] || '';
      const monthVal = inputValues[monthKey] || '';
      const dayVal = inputValues[dayKey] || '';
      const years = getYearsWithWareki();
      const months = getMonths();
      const days = getDays(yearVal, monthVal);
      const fields = field.fields || [];
      const selects = fields.map(dateField => {
        let options = [];
        if (dateField.options === 'yearsWithWareki') options = years;
        else if (dateField.options === 'months') options = months;
        else if (dateField.options === 'days') options = getDays(yearVal, monthVal);
        const value = inputValues[dateField.key] || '';
        return `
          <div class="flex flex-col items-center">
            <label class="text-xs text-slate-600 dark:text-slate-400 mb-1">${dateField.label}</label>
            <select
              id="${field.id}-${dateField.key}"
              class="form-input text-center w-20 sm:w-28"
              data-key="${dateField.key}"
              data-parent="${field.key}"
            >
              <option value="">--</option>
              ${options.map(opt => `<option value="${opt.value}" ${value == opt.value ? 'selected' : ''}>${opt.label}</option>`).join('')}
            </select>
          </div>
        `;
      }).join('');
      inputHtml = `<div class="flex justify-center items-end gap-2">${selects}</div>`;
    } else if (field.key === 'E') {
      // Read-only E field（整数のみ）
      inputHtml = `
        <input
          type="text"
          id="${field.id}-input"
          class="form-input bg-slate-100 dark:bg-slate-800 cursor-default"
          value="${value !== undefined && value !== null ? parseInt(value, 10) : ''}"
          readonly
          tabindex="-1"
          aria-label="経過年数"
          inputmode="numeric"
          pattern="\\d*"
        />
      `;
    } else {
      const formattedValue = (field.unit === '円' && value > 0)
        ? value.toLocaleString('ja-JP')
        : value.toString();
      inputHtml = `
        <input
          type="text"
          id="${field.id}-input"
          class="form-input"
          inputmode="numeric"
          pattern="\\d*"
          data-key="${field.key}"
          value="${formattedValue}"
        />
      `;
    }

    // Unit always to the right of the input
    const unitHtml = field.unit ? `<span class="form-unit ml-2">${field.unit}</span>` : '';

    // カード化＋ラベル太字＋ツールチップボタン右横配置
    container.innerHTML = `
      <div class="input-card-field bg-white rounded-xl shadow p-4 mb-4 border border-slate-200">
        <div class="flex items-center mb-2">
          <label for="${field.id}-input" class="form-label font-bold text-base flex-1">${codeLabel}${field.label}</label>
          <button type="button" class="help-btn ml-2" aria-label="ヘルプ">
            <i data-lucide="help-circle" class="h-4 w-4"></i>
            <div class="tooltip">
              <strong>${field.helpTitle}</strong><br>
              ${field.helpText}
            </div>
          </button>
        </div>
        <div class="form-input-row">
          ${inputHtml}
          ${unitHtml}
        </div>
      </div>
    `;
  },

  renderHeirSelector(heirs, selectedHeirId) {
    const container = getElement('single-heir-select');
    if (!container) return;

    const options = heirs
      .filter(heir => heir.isSelectable !== false)
      .map(heir => `<option value="${heir.id}" ${heir.id === selectedHeirId ? 'selected' : ''}>${heir.name}</option>`)
      .join('');
    container.innerHTML = options;
  },

  renderCalculationProcess(steps) {
    const container = getElement('calculation-process-container');
    if (!container) return;

    const stepsHtml = steps.map(step => `
      <div class="calculation-step">
        <h4 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">${step.title}</h4>
        <p class="text-sm text-slate-600 dark:text-slate-400 mb-1">${step.calculation}</p>
        <p class="text-lg font-bold text-primary-600 dark:text-primary-400">${step.result}</p>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="card-header">
        <h3 class="card-title">
          <i data-lucide="calculator" class="card-title-icon"></i>
          計算過程
        </h3>
      </div>
      <div class="calculation-steps">
        ${stepsHtml}
      </div>
    `;
    container.classList.remove('hidden');
  },

  updateResult({ finalAmount, steps }) {
    const container = getElement('result-container');
    const amountElement = getElement('result-amount');
    
    if (!container || !amountElement) return;

    amountElement.textContent = finalAmount.toLocaleString('ja-JP');
    container.classList.remove('opacity-0');
    container.classList.add('animate-slide-up');

    // Show calculation process if steps are provided
    if (steps && steps.length > 0) {
      this.renderCalculationProcess(steps);
    }
  },

  setLoading(isLoading) {
    const button = getElement('calculate-button');
    if (!button) return;

    if (isLoading) {
      button.classList.add('is-loading');
      button.disabled = true;
    } else {
      button.classList.remove('is-loading');
      button.disabled = false;
    }
  },

  renderMultiHeirsTable(heirs, isCalculated = false) {
    const container = getElement('multi-heirs-table');
    if (!container) return;

    const tbody = getElement('multi-heirs-tbody');
    if (!tbody) return;

    const rows = heirs.map((heir, index) => `
      <tr>
        <td>
          <select class="form-input text-sm" data-multi-heir-index="${index}" data-multi-heir-field="relationship">
            ${RELATIONSHIP_OPTIONS.map(option => 
              `<option value="${option}" ${heir.relationship === option ? 'selected' : ''}>${option}</option>`
            ).join('')}
          </select>
        </td>
        <td>
          <select class="form-input text-sm" data-multi-heir-index="${index}" data-multi-heir-field="category">
            ${CATEGORY_OPTIONS.map(option => 
              `<option value="${option}" ${heir.category === option ? 'selected' : ''}>${option}</option>`
            ).join('')}
          </select>
        </td>
        <td>
          <input type="text" class="form-input text-sm amount-cell" data-multi-heir-index="${index}" data-multi-heir-field="amount" 
                 value="${heir.amount.toLocaleString('ja-JP')}" ${isCalculated ? 'readonly' : ''}>
        </td>
        <td>
          <input type="text" class="form-input text-sm amount-cell" data-multi-heir-index="${index}" data-multi-heir-field="deduction" 
                 value="${heir.deduction.toLocaleString('ja-JP')}" readonly>
        </td>
        <td>
          <span class="reason-cell ${heir.deduction === 0 ? 'zero-reason' : ''}">${heir.reason || ''}</span>
        </td>
        <td>
          <button type="button" class="remove-btn btn btn-sm btn-outline" data-multi-heir-action="remove" data-multi-heir-index="${index}">削除</button>
        </td>
      </tr>
    `).join('');

    tbody.innerHTML = rows;
  }
};
window.renderMultiHeirsTable = renderMultiHeirsTable;