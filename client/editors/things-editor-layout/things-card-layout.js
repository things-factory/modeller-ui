/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

const DEFAULT = {
  activeIndex: 0
}

class ThingsCardLayout extends LitElement {
  static get is() {
    return 'things-card-layout'
  }

  static get properties() {
    return {
      value: { type: Object },
      activeIndex: { type: Number }
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
      let { activeIndex } = this.value || DEFAULT

      this.activeIndex = activeIndex
    }
  }

  render() {
    return html`
      <label>active index</label>
      <input type="number" value-key="activeIndex" .value=${this.activeIndex}></input>
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
      activeIndex: this.activeIndex
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define(ThingsCardLayout.is, ThingsCardLayout)
