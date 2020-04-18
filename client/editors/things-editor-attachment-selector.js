/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'
import '@material/mwc-icon'

import { openPopup } from '@things-factory/layout-base'
import { i18next } from '@things-factory/i18n-base'

import '@things-factory/attachment-ui'

export default class ThingsEditorAttachmentSelector extends LitElement {
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
      <input id="text" type="text" .value=${this.value || ''} @change=${e => this._onInputChanged(e)} />

      <mwc-icon @click=${e => this.openSelector(e)}>${this.getIconByCategory()}</mwc-icon>
    `
  }

  getIconByCategory() {
    var { category } = this.properties || {}
    switch (category) {
      case 'audio':
        return 'library_music'
      case 'video':
        return 'video_library'
      case 'image':
        return 'image'
      case 'text':
      case 'application':
      default:
        return 'attachment'
    }
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
     * 기존 설정된 이미지가 선택된 상태가 되게 하기 위해서는 selector에 value를 전달해줄 필요가 있음.
     * 주의. value는 object일 수도 있고, string일 수도 있다.
     * string인 경우에는 해당 보드의 id로 해석한다.
     */
    var value = this.value || {}
    var { category = 'application' } = this.properties || {}

    var template = html`
      <attachment-selector
        .creatable=${true}
        .category="${category}"
        @attachment-selected=${async e => {
          var attachment = e.detail.attachment
          this.value = `/attachment/${attachment.path}`

          this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))

          this.popup && this.popup.close()
        }}
      ></attachment-selector>
    `

    this.popup = openPopup(template, {
      backdrop: true,
      size: 'large',
      title: i18next.t('title.select attachment')
    })
  }
}

customElements.define('things-editor-attachment-selector', ThingsEditorAttachmentSelector)
