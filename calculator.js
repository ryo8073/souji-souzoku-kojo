/**
 * 相次相続控除計算エンジン (Successive Inheritance Tax Deduction Engine)
 *
 * このモジュールは、相次相続控除額の計算ロジックを提供します。
 * 計算は国税庁の定める計算式に基づいており、主要なエッジケースを考慮しています。
 * https://www.nta.go.jp/taxes/shiraberu/taxanswer/sozoku/4168.htm
 *
 * @module Calculator
 */

/**
 * 相次相続控除の計算を行う静的ユーティリティクラス。
 * A static utility class for calculating the successive inheritance tax deduction.
 * このクラスは状態を持たず、計算機能のみを提供します。
 */
window.Calculator = {
	/**
	 * 小数点以下を指定桁数で切り捨てるヘルパー関数
	 * @param {number} num - 対象の数値
	 * @param {number} places - 残す小数点以下の桁数
	 * @returns {number} - 切り捨て後の数値
	 */
	_truncate(num, places) {
		const power = Math.pow(10, places);
		return Math.floor(num * power) / power;
	},

	/**
	 * 相次相続控除額を計算する
	 * @param {object} values - 入力値オブジェクト { A, B, C, D, E }
	 * @returns {object} - { finalAmount, steps, formula }
	 */
	calculateDeduction(values) {
		const { A, B, C, D, E } = values;

		if (B - A <= 0) {
			return {
				finalAmount: 0,
				steps: [{ title: "エラー", calculation: "B-Aが0以下のため計算不能", result: "-" }],
				formula: "B-A <= 0",
			};
		}

		// ① 前回の相続税額
		const stepA = A;

		// ② C / (B - A)
		const rawRatioB = C / (B - A);
		const truncatedRatioB = this._truncate(rawRatioB, 4);
		const cappedRatioB = Math.min(truncatedRatioB, 1.0);

		// ③ D / C
		let rawRatioC = 0;
		if (C > 0) {
			rawRatioC = D / C;
		}
		const truncatedRatioC = this._truncate(rawRatioC, 4);

		// ④ (10 - E) / 10
		let ratioE = (10 - E) / 10;
		if (E < 0 || E >= 10) {
			ratioE = 0;
		}

		// 計算
		const step2 = truncatedRatioB;
		const step2Capped = cappedRatioB;
		const step3 = truncatedRatioC;
		const step4 = ratioE;

		// 掛け算はそのまま
		const step5 = stepA * step2Capped * step3 * step4;
		const finalAmount = Math.floor(step5 + 1e-6); // 浮動小数点誤差対策

		const steps = [
			{
				title: "① 前回の相続税額",
				calculation: "A",
				result: stepA,
			},
			{
				title: "② C / (B - A)",
				calculation: `${C.toLocaleString()} / (${B.toLocaleString()} - ${A.toLocaleString()})`,
				result: rawRatioB.toFixed(5),
			},
			{
				title: "端数整理後",
				calculation: `小数点以下4位未満を切り捨て`,
				result: truncatedRatioB.toFixed(4),
			},
			{
				title: "上限適用後",
				calculation: `min(${truncatedRatioB.toFixed(4)}, 1.0)` ,
				result: cappedRatioB.toFixed(4),
			},
			{
				title: "③ D / C (端数整理後)",
				calculation: `${D.toLocaleString()} / ${C.toLocaleString()}`,
				result: truncatedRatioC.toFixed(4),
			},
			{
				title: "④ (10 - E) / 10",
				calculation: `(10 - ${E}) / 10`,
				result: step4.toFixed(2),
			},
			{
				title: "控除額合計",
				calculation: "① × ②(上限適用) × ③ × ④",
				result: finalAmount,
			}
		];

		const formula = `
			${A.toLocaleString()} × 
			min(1, ${truncatedRatioB.toFixed(4)}) × 
			${truncatedRatioC.toFixed(4)} × 
			(10 - ${E}) / 10
		`;

		return {
			finalAmount,
			steps,
			formula,
		};
	}
};
