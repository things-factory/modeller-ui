/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

// TODO LitElement 로 변경 후 검증하지 않음.
import { LitElement, html, css } from 'lit-element'

export default class ThingsEditorOptions extends LitElement {
  static get is() {
    return 'things-editor-options'
  }

  static get properties() {
    return {
      options: Array
    }
  }

  static get styles() {
    return [
      css`
        div {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);
        }

        input[data-text] {
          grid-column: span 5;
        }

        input[data-value] {
          grid-column: span 4;
        }

        button {
          grid-column: span 1;
        }
      `
    ]
  }

  constructor() {
    super()

    this.options = []
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onChange.bind(this))
  }

  render() {
    return html`
      ${
        (this.options || []).map(
          item => html`
            <div data-record="">
              <input type="text" data-text="" placeholder="text" .value=${item.text} />
              <input type="text" data-value="" placeholder="value" .value=${item.value} />
              <button class="record-action" @click=${e => this._delete(e)} tabindex="-1">-</button>
            </div>
          `
        )
      }

      <div data-record-new="">
        <input type="text" data-text="" placeholder="text" value="" />
        <input type="text" data-value="" placeholder="value" value="" @change=${e => this._add(e)} />
        <button class="record-action" @click=${e => this._add(e)} tabindex="-1">+</button>
      </div>
    `
  }

  _onChange(e) {
    if (this._changingNow) return

    this._changingNow = true

    var input = e.target
    var value = input.value

    var div = input.parentElement

    if (div.hasAttribute('data-record')) {
      var dataList = div.querySelectorAll('[data-value]:not([hidden])')
      for (var i = 0; i < dataList.length; i++) if (dataList[i] !== input) dataList[i].value = value || ''
    }

    if (div.hasAttribute('data-record')) this._build(true)
    else if (div.hasAttribute('data-record-new') && input.hasAttribute('data-value')) this._add()

    e.stopPropagation()

    this._changingNow = false
  }

  _build(includeNewRecord) {
    if (includeNewRecord) var records = this.shadowRoot.querySelectorAll('[data-record],[data-record-new]')
    else var records = this.shadowRoot.querySelectorAll('[data-record]')

    var newoptions = []

    for (var i = 0; i < records.length; i++) {
      var record = records[i]

      var text = record.querySelector('[data-text]').value
      var inputs = record.querySelectorAll('[data-value]:not([style*="display: none"])')
      if (!inputs || inputs.length == 0) continue

      var input = inputs[inputs.length - 1]
      var value = input.value

      if (text) newoptions.push({ text: text, value: value || text })
    }

    this.options = newoptions
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _sort(e) {
    var sorter = function(a, b) {
      return b.text < a.text
    }

    this.options = this._toArray(this.options)
      .sort(sorter)
      .reduce(function(sum, i) {
        sum[i.text] = i.value
        return sum
      }, {})

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _add(e) {
    this._build(true)

    var inputs = this.shadowRoot.querySelectorAll('[data-record-new] input:not([style*="display: none"])')

    for (var i = 0; i < inputs.length; i++) {
      let input = inputs[i]
      input.value = ''
    }

    inputs[0].focus()
  }

  _delete(e) {
    var record = e.target.parentElement
    record.querySelector('[data-text]').value = ''
    this._build()
  }
}

customElements.define(ThingsEditorOptions.is, ThingsEditorOptions)
