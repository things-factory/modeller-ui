/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

const DEFAULT = {
  direction: 'row'
}

class ThingsGridLayout extends LitElement {
  static get is() {
    return 'things-grid-layout'
  }

  static get properties() {
    return {
      value: { type: Object },
      direction: { type: String }
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }
      `
    ]
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onValueChange.bind(this))
  }

  updated(change) {
    if (change.has('value')) {
      let { direction } = this.value || DEFAULT

      this.direction = direction
    }

    if (change.has('value')) {
    }
  }

  render() {
    return html`
      <label>direction</label>
      <select value-key="direction" .value=${this.direction}>
        <option value="row" selected>row</option>
        <option value="column">column</option>
      </select>
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
      direction: this.direction
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define(ThingsGridLayout.is, ThingsGridLayout)
