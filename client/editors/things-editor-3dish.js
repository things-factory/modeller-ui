/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@things-factory/i18n-base'
import './things-editor-angle-input'

class ThingsEditor3Dish extends LitElement {
  static get is() {
    return 'things-editor-3dish'
  }

  static get properties() {
    return {
      dimension: Object,
      /*
       * translate는 고유한 html element의 attribute이므로, property는 translatex로 한다.
       */
      translatex: Object,
      rotate: Object,
      scale: Object
    }
  }

  static get styles() {
    // FIXME grid-template-columns: repeat(4, 1fr); 이 왜 작동하지 않는지..
    return [
      css`
        :host {
          display: grid;
          /* grid-template-columns: repeat(4, 1fr); */
          grid-template-columns: 60px 60px 60px 60px;
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);
        }

        :host > * {
          grid-column: span 1;
        }

        label {
          text-align: right;
        }

        span {
          text-align: center;
        }
      `
    ]
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onChange.bind(this))
  }

  _onChange(e) {
    var element = e.target
    var id = element.id
    var prop = id.substr(1)
    var value = Number(element.value)

    switch (element.tagName) {
      case 'THINGS-EDITOR-ANGLE-INPUT':
        value = element.radian || 0
        break
    }

    switch (id) {
      case 'tx':
      case 'ty':
      case 'tz':
        this.dispatchEvent(
          new CustomEvent('translate-changed', {
            bubbles: true,
            composed: true,
            detail: {
              value: {
                ...this.translatex,
                [prop]: value
              }
            }
          })
        )

        break
      case 'rx':
      case 'ry':
      case 'rz':
        this.dispatchEvent(
          new CustomEvent('rotate-changed', {
            bubbles: true,
            composed: true,
            detail: {
              value: {
                ...this.rotate,
                [prop]: value
              }
            }
          })
        )

        break
      case 'sx':
      case 'sy':
      case 'sz':
        this.dispatchEvent(
          new CustomEvent('scale-changed', {
            bubbles: true,
            composed: true,
            detail: {
              value: {
                ...this.scale,
                [prop]: value
              }
            }
          })
        )

        break

      default:
        // dimension
        this.dispatchEvent(
          new CustomEvent('dimension-changed', {
            bubbles: true,
            composed: true,
            detail: {
              value: {
                ...this.dimension,
                [prop]: value
              }
            }
          })
        )
    }
  }

  render() {
    return html`
      <span></span> <span><i18n-msg msgid="label.x-axes"></i18n-msg></span>
      <span><i18n-msg msgid="label.y-axes"></i18n-msg></span>
      <span><i18n-msg msgid="label.z-axes"></i18n-msg></span>

      <label><i18n-msg msgid="label.dimension"></i18n-msg></label>
      <input type="number" id="dwidth" .value=${this.dimension && this.dimension.width} />
      <input type="number" id="dheight" .value=${this.dimension && this.dimension.height} />
      <input type="number" id="ddepth" .value=${this.dimension && this.dimension.depth} />

      <label><i18n-msg msgid="label.translate"></i18n-msg></label>
      <input type="number" id="tx" .value=${this.translatex && this.translatex.x} />
      <input type="number" id="ty" .value=${this.translatex && this.translatex.y} />
      <input type="number" id="tz" .value=${this.translatex && this.translatex.z} />

      <label><i18n-msg msgid="label.rotate"></i18n-msg></label>
      <things-editor-angle-input id="rx" .radian=${this.rotate && this.rotate.x}></things-editor-angle-input>
      <things-editor-angle-input id="ry" .radian=${this.rotate && this.rotate.y}></things-editor-angle-input>
      <things-editor-angle-input id="rz" .radian=${this.rotate && this.rotate.z}></things-editor-angle-input>
    `
  }
}

customElements.define(ThingsEditor3Dish.is, ThingsEditor3Dish)
