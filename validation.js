/**
 * Validation Utility
 *
 * Provides static methods for validating input values for the successive
 * inheritance tax deduction calculation.
 * @module Validation
 */

export class Validator {
	constructor(rules) {
		this.rules = rules;
	}

	validate(values) {
		const errors = {};
		for (const fieldName in this.rules) {
			const rule = this.rules[fieldName];
			const value = values[fieldName.toLowerCase().replace('asset', '').replace('tax','')];

			if (rule.required && (value === null || value === '' || value === undefined)) {
				errors[fieldName] = rule.message;
				continue;
			}

			const numericValue = Number(String(value).replace(/,/g, ''));

			if (isNaN(numericValue)) {
				errors[fieldName] = rule.message;
				continue;
			}

			if (rule.min !== undefined && numericValue < rule.min) {
				errors[fieldName] = rule.message;
			}

			if (rule.max !== undefined && numericValue > rule.max) {
				errors[fieldName] = rule.message;
			}
			
			if (rule.integer && !Number.isInteger(numericValue)) {
				errors[fieldName] = rule.message;
			}
		}
		return errors;
	}
}

/**
 * 入力値を検証する
 * @param {object} inputs - 入力値オブジェクト { A, B, C, D, E }
 * @returns {string[]} エラーメッセージの配列
 */
export function validateInputs(inputs) {
	const errors = [];
	const { A, B, C, D, E } = inputs;

	if (A < 0 || B < 0 || C < 0 || D < 0 || E < 0) {
		errors.push('すべての入力値は0以上である必要があります。');
	}

	for (const key in inputs) {
		if (inputs[key] === null || inputs[key] === '' || isNaN(inputs[key])) {
			errors.push(`入力項目「${key}」に有効な数値が入力されていません。`);
		}
	}

	if (B - A <= 0) {
		errors.push(
			'「B: 前回の取得財産額」は「A: 前回の相続税額」より大きい必要があります。'
		);
	}

	return errors;
}