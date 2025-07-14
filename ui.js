/**
 * UI Manager
 *
 * This module is responsible for all direct DOM manipulation. It acts as the
 * presentation layer, receiving data from the main application logic and
 * rendering it to the user. It is designed to be stateless and declarative.
 * @module UI
 */
import { formatCurrency, formatNumber } from './utils.js';

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

export function renderInputField(field, value, extra = {}) {
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
          <i data-lucide="help-circle" class="h-5 w-5 text-slate-400"></i>
        </button>
        <div class="tooltip">
          <h4 class="font-bold mb-1">${field.helpTitle}</h4>
          <p>${field.helpText}</p>
        </div>
      </div>
      <div class="form-input-row bg-slate-50 rounded px-3 py-2 flex items-center">
        ${inputHtml}
        ${unitHtml}
      </div>
    </div>
  `;

  // Add event listener for method selection to show/hide relevant inputs
  if (field.key === 'E_METHOD') {
    const selectElement = container.querySelector('select');
    if (selectElement) {
      selectElement.addEventListener('change', (e) => {
        const method = e.target.value;
        const yearsContainer = getElement('input-E-years');
        const date1Container = getElement('input-E1');
        const date2Container = getElement('input-E2');
        const eField = getElement('input-E');
        if (method === 'years') {
          yearsContainer.classList.remove('hidden');
          date1Container.classList.add('hidden');
          date2Container.classList.add('hidden');
          if (eField) eField.classList.add('hidden');
        } else {
          yearsContainer.classList.add('hidden');
          date1Container.classList.remove('hidden');
          date2Container.classList.remove('hidden');
          if (eField) eField.classList.remove('hidden');
        }
      });
    }
  }
}

export function renderHeirSelector(heirs, selectedHeirId) {
  // 現在の要件では相続人選択カードを削除するため、この関数は何もしない
  return;
}

export function renderCalculationProcess(steps) {
  return `
    <ol class="calculation-steps space-y-2">
      ${steps.map((step, i) => `
        <li class="calculation-step p-2 rounded bg-slate-50 border border-slate-200">
          <div class="font-bold mb-1">${i + 1}. ${step.title}</div>
          <div class="text-xs text-slate-600 mb-1">${step.calculation}</div>
          <div class="text-lg font-mono text-primary-700">${step.result}</div>
        </li>
      `).join('')}
    </ol>
  `;
}

export function updateResult({ finalAmount, steps }) {
  console.log('updateResult() called with:', { finalAmount, steps });
  const amount = Math.floor(finalAmount || 0);
  const resultContainer = getElement('result-container');
  const processContainer = getElement('calculation-process-container');
  const resultAmountEl = getElement('result-amount');
  const inputCard = getElement('input-card');
  
  console.log('Elements found:', { resultContainer, processContainer, resultAmountEl, inputCard });
  
  if (!resultContainer || !processContainer || !resultAmountEl || !inputCard) {
    console.error('Required elements not found');
    return;
  }

  resultAmountEl.innerHTML = `${amount.toLocaleString('ja-JP')}<span class="ml-1.5 text-2xl opacity-80">円</span>`;

  // 計算結果を常に表示（0円でも表示）
  resultContainer.classList.remove('opacity-0');
  resultContainer.classList.add('animate-slide-up');
  
  if (steps && steps.length > 0) {
    processContainer.innerHTML = renderCalculationProcess(steps);
    processContainer.classList.remove('hidden');
  } else {
    processContainer.classList.add('hidden');
    processContainer.innerHTML = '';
  }
  
  inputCard.classList.add('!shadow-none');

  console.log('Result updated successfully');
  lucide.createIcons();
}


export function setLoading(isLoading) {
  const button = getElement('calculate-button');
  if (!button) return;
  
  if (isLoading) {
    button.classList.add('is-loading');
    button.disabled = true;
  } else {
    button.classList.remove('is-loading');
    button.disabled = false;
  }
}

export function renderMultiHeirsTable(heirs, isCalculated = false) {
  const tbody = document.getElementById('multi-heirs-tbody');
  if (!tbody) return;
  tbody.innerHTML = heirs.map((h, i) => {
    // 理由の決定
    let reason = '';
    let reasonClass = '';
    if (!isCalculated) {
      reason = '計算前';
    } else if (h.deduction === 0) {
      if (h.category === '法定外') {
        reason = '法定相続人でないため0円';
        reasonClass = 'zero-reason';
      } else if (h.category === '相続放棄') {
        reason = '相続放棄のため0円';
        reasonClass = 'zero-reason';
      } else if (h.category === '相続欠格') {
        reason = '相続欠格のため0円';
        reasonClass = 'zero-reason';
      } else {
        reason = '計算結果0円';
      }
    } else if (h.deduction !== undefined) {
      reason = '控除対象';
    } else {
      reason = '-';
    }

    return `
    <tr>
      <td style="min-width: 70px;">
        <select class="form-input" style="font-size:0.9em;" data-multi-heir-index="${i}" data-multi-heir-field="relationship">
          ${RELATIONSHIP_OPTIONS.map(opt => `<option value="${opt}" ${h.relationship === opt ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      </td>
      <td style="min-width: 70px;">
        <select class="form-input" style="font-size:0.9em;" data-multi-heir-index="${i}" data-multi-heir-field="category">
          ${CATEGORY_OPTIONS.map(opt => `<option value="${opt}" ${h.category === opt ? 'selected' : ''}>${opt}</option>`).join('')}
        </select>
      </td>
      <td class="amount-cell">
        <input type="text" class="form-input text-right" data-multi-heir-index="${i}" data-multi-heir-field="amount" value="${Number(h.amount).toLocaleString('ja-JP')}">
      </td>
      <td class="amount-cell text-right font-mono">${h.deduction !== undefined ? h.deduction.toLocaleString('ja-JP') : '-'}</td>
      <td class="reason-cell ${reasonClass}">${reason}</td>
      <td>
        <button class="btn btn-xs btn-outline remove-btn" style="padding:0.2em 0.7em;min-width:2.5em;" data-multi-heir-index="${i}" data-multi-heir-action="remove" aria-label="相続人を削除">
          <i data-lucide="trash" class="h-5 w-5"></i>
        </button>
      </td>
    </tr>
  `}).join('');
  // 注記を追加
  const table = tbody.closest('table');
  if (table) {
    let note = document.getElementById('multi-heirs-note');
    if (!note) {
      note = document.createElement('div');
      note.id = 'multi-heirs-note';
      note.className = 'text-xs text-slate-500 mt-1 text-left';
      table.parentNode.appendChild(note);
    }
    note.innerHTML = '<span class="font-bold text-slate-700">※計算結果の詳細は表の一番上の相続人のみ表示されます。</span><br>控除額は「法定相続人」のみ計算されます。表の一番上の人の詳細計算過程を下に表示します。';
    // 既存の重複注記を削除
    const notes = table.parentNode.querySelectorAll('#multi-heirs-note');
    if (notes.length > 1) {
      for (let i = 1; i < notes.length; i++) {
        notes[i].remove();
      }
    }
  }
  lucide.createIcons();
}

// グローバルに公開
window.renderMultiHeirsTable = renderMultiHeirsTable;