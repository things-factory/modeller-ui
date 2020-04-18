/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@polymer/paper-radio-button/paper-radio-button'
import '@polymer/paper-radio-group/paper-radio-group'

import '@things-factory/i18n-base'
import './things-editor-color'
import './things-editor-gradient'
import './things-editor-pattern'

export default class ThingsEditorColorStyle extends LitElement {
  static get is() {
    return 'things-editor-color-style'
  }

  static get properties() {
    return {
      value: Object,
      fillType: String,
      solid: String,
      gradient: Object,
      pattern: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        paper-radio-button {
          padding: 2px 1px 10px 7px !important;
        }

        .grid-10 {
          display: grid;

          grid-template-columns: repeat(10, 1fr);
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);
        }

        .grid-10 > things-editor-color {
          grid-column: span 4;
        }

        .grid-10 > .icon-only-label {
          grid-column: span 1;

          background: url(/assets/images/icon-properties-label.png) no-repeat;
          float: left;
          margin: 0;
        }

        .icon-only-label.color {
          background-position: 70% -498px;
        }

        [editors] > :not([active]) {
          display: none;
        }
      `
    ]
  }

  updated(change) {
    change.has('value') && this._onChangedValue(this.value)
  }

  render() {
    return html`
      <paper-radio-group .selected=${this.fillType || 'no'} @change=${e => this._onChangedFillType(e)}>
        <paper-radio-button name="no">
          <i18n-msg msgid="label.no-fill">no fill</i18n-msg>
        </paper-radio-button>
        <paper-radio-button name="solid">
          <i18n-msg msgid="label.solid">solid</i18n-msg>
        </paper-radio-button>
        <paper-radio-button name="gradient">
          <i18n-msg msgid="label.gradient">gradient</i18n-msg>
        </paper-radio-button>
        <paper-radio-button name="pattern">
          <i18n-msg msgid="label.pattern">pattern</i18n-msg>
        </paper-radio-button>
      </paper-radio-group>

      <div editors>
        <div ?active=${this.fillType == 'no'}></div>

        <div class="grid-10" ?active=${this.fillType == 'solid'}>
          <label class="icon-only-label color"></label>
          <things-editor-color @change=${e => this._onChangedSolid(e)} .value=${this.solid}> </things-editor-color>
        </div>

        <div ?active=${this.fillType == 'gradient'}>
          <things-editor-gradient @change=${e => this._onChandedGradient(e)} .value=${this.gradient}>
          </things-editor-gradient>
        </div>

        <div ?active=${this.fillType == 'pattern'}>
          <things-editor-pattern @change=${e => this._onChangedPattern(e)} .value=${this.pattern}>
          </things-editor-pattern>
        </div>
      </div>
    `
  }

  async _onChangedValue(value) {
    /*
     * this._block_reset의 역할은 내부 사용자 인터렉션에 의한 value의 변경시에는 각 type별 이전값을 유지하기 위함이다.
     */
    await this.renderComplete

    /* 설정 값에 따라서, 멤버 속성을 설정한다. */
    if (!value) {
      this.fillType = 'no'

      if (!this._block_reset) {
        this.solid = null
        this.gradient = null
        this.pattern = null
      }

      this._block_reset = false
      return
    }

    switch (typeof value) {
      case 'string':
        this.fillType = 'solid'
        this.solid = value

        if (!this._block_reset) {
          this.gradient = null
          this.pattern = null
        }
        break
      case 'object':
        this.fillType = value.type

        if (value.type === 'gradient') {
          this.gradient = {
            type: value.gradientType || 'linear',
            colorStops: value.colorStops || [
              {
                position: 0,
                color: this.solid || '#000000'
              },
              {
                position: 1,
                color: this.solid || '#FFFFFF'
              }
            ],
            rotation: parseFloat(value.rotation) || 0,
            center: value.center
          }

          if (!this._block_reset) {
            this.pattern = null
            this.solid = null
          }
        } else if (value.type === 'pattern') {
          this.pattern = {
            image: value.image,
            offsetX: parseInt(value.offsetX) || 0,
            offsetY: parseInt(value.offsetY) || 0,
            width: parseInt(value.width),
            height: parseInt(value.height),
            align: value.align,
            fitPattern: value.fitPattern
          }

          if (!this._block_reset) {
            this.gradient = null
            this.solid = null
          }
        }

        break
      default:
    }

    this._block_reset = false
  }

  _onChangedFillType(e) {
    this.fillType = e.target.name

    switch (this.fillType) {
      case 'gradient':
        if (!this.gradient) {
          this.gradient = {
            type: 'linear',
            colorStops: [
              {
                position: 0,
                color: this.solid || '#000000'
              },
              {
                position: 1,
                color: this.solid || '#FFFFFF'
              }
            ],
            rotation: 0,
            center: 'center'
          }
        }

        this.value = {
          type: 'gradient',
          gradientType: this.gradient.type || 'linear',
          colorStops: this.gradient.colorStops || [
            {
              position: 0,
              color: this.solid || '#000000'
            },
            {
              position: 1,
              color: this.solid || '#FFFFFF'
            }
          ],
          rotation: parseFloat(this.gradient.rotation) || 0,
          center: this.gradient.center
        }
        break

      case 'pattern':
        if (!this.pattern) this.pattern = {}

        this.value = {
          type: 'pattern',
          image: this.pattern.image,
          offsetX: parseInt(this.pattern.offsetX) || 0,
          offsetY: parseInt(this.pattern.offsetY) || 0,
          width: parseInt(this.pattern.width),
          height: parseInt(this.pattern.height),
          align: this.pattern.align,
          fitPattern: this.pattern.fitPattern
        }
        break

      case 'solid':
        if (!this.solid) this.solid = '#fff'
        this.value = this.solid
        break

      case 'no':
        this.value = ''
        break
    }

    this._block_reset = true
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _onChangedSolid(e) {
    if (this.fillType !== 'solid') return

    this.solid = e.target.value

    this.value = this.solid

    this._block_reset = true
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _onChandedGradient(e) {
    /*
     * TODO Gradient의 rotation은 symmetry 기능 등으로 외부에서 변경될 수도 있다.
     * 이 점을 감안해서, 외부 변경에 대한 대응을 해야 한다.
     */

    if (this.fillType !== 'gradient') return

    this.gradient = e.target.value

    this.value = {
      type: 'gradient',
      gradientType: this.gradient.type || 'linear',
      colorStops: this.gradient.colorStops || [
        {
          position: 0,
          color: this.solid || '#000000'
        },
        {
          position: 1,
          color: this.solid || '#FFFFFF'
        }
      ],
      rotation: parseFloat(this.gradient.rotation) || 0,
      center: this.gradient.center
    }

    this._block_reset = true
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _onChangedPattern(e) {
    if (this.fillType !== 'pattern') return

    this.pattern = e.target.value

    this.value = {
      type: 'pattern',
      image: this.pattern.image,
      offsetX: parseInt(this.pattern.offsetX) || 0,
      offsetY: parseInt(this.pattern.offsetY) || 0,
      width: parseInt(this.pattern.width),
      height: parseInt(this.pattern.height),
      align: this.pattern.align,
      fitPattern: this.pattern.fitPattern
    }

    this._block_reset = true
    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }
}

customElements.define(ThingsEditorColorStyle.is, ThingsEditorColorStyle)
