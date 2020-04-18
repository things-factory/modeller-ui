/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'
import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import { i18next } from '@things-factory/i18n-base'

import '@things-factory/font-ui'

export default class ThingsEditorFontSelector extends LitElement {
  static get properties() {
    return {
      value: String,
      properties: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: inline-block;
        }

        input[type='text'] {
          box-sizing: border-box;
          width: 100%;
          height: 100%;
        }

        mwc-icon {
          position: absolute;
          top: 0;
          right: 0;
        }
      `
    ]
  }

  render() {
    return html`
      <input
        id="text"
        type="text"
        .value=${this.value || ''}
        @change=${e => this._onInputChanged(e)}
        .placeholder=${this.getAttribute('placeholder') || ''}
      />

      <mwc-icon @click=${e => this.openSelector(e)}>font_download</mwc-icon>
    `
  }

  _onInputChanged(e) {
    this.value = e.target.value
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  openSelector() {
    if (this.popup) {
      delete this.popup
    }

    /*
     * 기존 설정된 보드가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var value = this.value || {}

    var template = html`
      <font-selector
        .creatable=${true}
        @font-selected=${async e => {
          var font = e.detail.font
          this.value = font.name

          this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))

          this.popup && this.popup.close()
        }}
      ></font-selector>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.select font')
    })
  }
}

customElements.define('things-editor-font-selector', ThingsEditorFontSelector)
