/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

class ThingsEditorId extends LitElement {
  static get is() {
    return 'things-editor-id'
  }

  static get properties() {
    return {
      value: String,
      property: Object,
      _ids: Array
    }
  }

  static get styles() {
    return [
      css`
        :host {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: flex-end;
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
        id="text"
        type="text"
        .value=${this.value || ''}
        @focusin=${e => this._onInputFocused(e)}
        @change=${e => this._onInputChanged(e)}
        .placeholder=${this.getAttribute('placeholder') || ''}
        list="ids"
      />
      <datalist id="ids">
        ${this._ids.map(
          id => html`
            <option value=${id}></option>
          `
        )}
      </datalist>
    `
  }

  connectedCallback() {
    super.connectedCallback()

    this._ids = []
  }

  _onInputFocused(e) {
    this._ids = []
    var { component } = this.property || {}

    document.dispatchEvent(
      new CustomEvent('get-all-scene-component-ids', {
        bubbles: true,
        composed: true,
        detail: {
          component,
          callback: ids => {
            this._ids = ids
          }
        }
      })
    )
  }

  _onInputChanged(e) {
    e.stopPropagation()
    this.value = e.target.value

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define(ThingsEditorId.is, ThingsEditorId)
