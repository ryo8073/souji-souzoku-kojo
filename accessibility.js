/**
 * Accessibility Utility
 *
 * Provides static methods for accessibility enhancements, primarily for
 * screen reader announcements.
 * @module Accessibility
 */
export class AccessibilityManager {
	constructor() {
		this.announcer = document.createElement('div');
		this.announcer.id = 'announcer';
		this.announcer.setAttribute('aria-live', 'polite');
		this.announcer.setAttribute('aria-atomic', 'true');
		this.announcer.classList.add('sr-only');
		document.body.appendChild(this.announcer);
	}

	/**
	 * スクリーンリーダーにメッセージをアナウンスします。
	 * @param {string} message アナウンスするメッセージ。
	 */
	announce(message) {
		if (this.announcer) {
			this.announcer.textContent = message;
		}
	}
}