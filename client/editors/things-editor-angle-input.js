/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

class ThingsEditorAngleInput extends LitElement {
  static get is() {
    return 'things-editor-angle-input'
  }

  static get properties() {
    return {
      radian: Number
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        input {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
        }
      `
    ]
  }

  render() {
    return html`
      <input
        type="number"
        .value=${this._toDegree(this.radian)}
        @change="${e => this._onChangeValue(e)}"
        .placeholder=${this.placeholder}
      />
    `
  }

  get placeholder() {
    return this.getAttribute('placeholder') || '0°'
  }

  get input() {
    return this.shadowRoot.querySelector('input')
  }

  _onChangeValue(e) {
    this.radian = this._toRadian(this.input.value)

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _toDegree(radian) {
    return Math.round(((radian || 0) * 180) / Math.PI)
  }

  _toRadian(degree) {
    return isNaN(Number(degree)) ? undefined : Number(degree) * (Math.PI / 180)
  }
}

customElements.define(ThingsEditorAngleInput.is, ThingsEditorAngleInput)
