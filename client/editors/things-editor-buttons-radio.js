/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

/**
여러 버튼 중에서 하나만 눌리거나, 모두 눌리지 않은 상태만을 갖는 라디오 형태의 버튼이다.

Example:

  <things-editor-buttons-radio @change=${e => this._onChange(e)} value=${value}>
    <paper-button data-value="top"></paper-button>
    <paper-button data-value="middle"></paper-button>
    <paper-button data-value="bottom"></paper-button>
  </things-editor-buttons-radio>
*/
class ThingsEditorButtonsRadio extends LitElement {
  static get is() {
    return 'things-editor-buttons-radio'
  }

  static get properties() {
    return {
      /**
       * `value`는 버튼의 눌린 상태를 값으로 갖는 속성이다.
       */
      value: Object,
      mandatory: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }

        ::slotted(paper-button) {
          width: 30px;
          height: 25px;
          min-width: initial;
          margin: 0 4px 0 0;
          padding: 0;
          border-radius: 0;
          display: inline-block;
          border-bottom: 2px solid #fff;
        }
      `
    ]
  }

  firstUpdated() {
    if (!this.mandatory) {
      Array.from(this.querySelectorAll('paper-button')).forEach(button => {
        if (button.hasAttribute('toggles')) {
          button.removeAttribute('toggles')
        } else {
          button.setAttribute('toggles', '')
        }
      })
    }
  }

  updated(change) {
    change.has('value') && this._onValueChanged(this.value)
  }

  render() {
    return html`
      <slot select="paper-button" @click=${e => this._onTapButton(e)}></slot>
    `
  }

  get buttons() {
    return Array.from(this.querySelectorAll('paper-button'))
  }

  _onValueChanged(value) {
    this.buttons.forEach(button => {
      if (value === button.getAttribute('data-value')) button.active = true
      else button.active = false
    })
  }

  _onTapButton(e) {
    var target = e.target

    while (!target.hasAttribute('data-value') && target !== this) target = target.parentElement

    if (target === this) return

    var old = this.value

    if (!this.mandatory) {
      if (target.active) this.value = target.getAttribute('data-value')
      else this.value = null
    } else {
      this.value = target.getAttribute('data-value')
      target.active = true
    }

    if (old !== this.value) {
      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
    }
  }
}

customElements.define(ThingsEditorButtonsRadio.is, ThingsEditorButtonsRadio)
