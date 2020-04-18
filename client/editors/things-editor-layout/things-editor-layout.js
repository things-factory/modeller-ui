/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html } from 'lit-element'

import './things-grid-layout'
import './things-card-layout'
// import './things-linear-horizontal-layout'
// import './things-linear-vertical-layout'

const layouts = ['absolute', 'card', 'grid', 'linear-horizontal', 'linear-vertical', 'table']

class ThingsLayout extends LitElement {
  static get is() {
    return 'things-editor-layout'
  }

  static get properties() {
    return {
      value: { type: Object },
      layout: { type: String },
      options: { type: Object }
    }
  }

  constructor() {
    super()

    this.value = {}

    this.layout = ''
    this.options = {}
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  updated(change) {
    if (change.has('value')) {
      this.layout = this.value.layout
      this.options = this.value.options
    }
  }

  render() {
    return html`
      <div>
        <select value-key="layout" .value=${this.layout}>
          <option value="" selected></option>
          ${
            layouts.map(layout => {
              return html`
                <option value="${layout}">${layout}</option>
              `
            })
          }
        </select>

        ${
          this.layout == 'grid'
            ? html`
                <things-grid-layout value-key="options" .value=${this.option}></things-grid-layout>
              `
            : this.layout == 'card'
            ? html`
                <things-card-layout value-key="options" .value=${this.option}></things-card-layout>
              `
            : html``
        }
      </div>
    `
  }

  _onValueChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    this[key] = element.value

    this.value = {
      layout: this.layout,
      options: this.options
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define(ThingsLayout.is, ThingsLayout)
