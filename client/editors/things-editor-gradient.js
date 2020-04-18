/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'

import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-listbox/paper-listbox'
import '@polymer/paper-item/paper-item'

import './things-editor-angle-input'
import './things-editor-color-stops'

export default class ThingsEditorGradient extends LitElement {
  constructor() {
    super()

    this.value = {}
  }

  static get is() {
    return 'things-editor-gradient'
  }

  static get properties() {
    return {
      value: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;

          grid-template-columns: repeat(10, 1fr);
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);

          align-items: center;
        }

        :host > * {
          align-self: stretch;
        }

        :host > label {
          grid-column: span 2;
          text-align: right;
          text-transform: capitalize;
          align-self: center;
        }

        :host > .icon-only-label {
          grid-column: span 1;
        }

        :host > input,
        :host > [editors] {
          grid-column: span 8;
        }

        :host > select {
          grid-column: span 4;
          height: 100%;
        }

        :host > things-editor-angle-input {
          grid-column: span 3;
        }

        things-editor-color-stops {
          grid-column: span 10;
        }

        .host > input[type='checkbox'] {
          grid-column: 3 / 4;
        }

        .host > input[type='checkbox'] ~ label {
          grid-column: span 7;
          text-align: left;
        }

        [editors] > :not([active-selector]) {
          display: none;
        }

        [gradient-direction] {
          overflow: hidden;
          max-width: 210px;
        }

        [gradient-direction] paper-item {
          background: url(/assets/images/icon-editor-gradient-direction.png) 50% 0 no-repeat;
          min-height: 32px;
          padding: 3px 5px;
          width: 30px;
          float: left;
        }

        [gradient-direction] [name='lefttop-to-rightbottom'] {
          background-position: 50% 4px;
        }

        [gradient-direction] [name='left-top'] {
          background-position: 50% 4px;
        }

        [gradient-direction] [name='top-to-bottom'] {
          background-position: 50% -46px;
        }

        [gradient-direction] [name='righttop-to-leftbottom'] {
          background-position: 50% -96px;
        }

        [gradient-direction] [name='right-top'] {
          background-position: 50% -96px;
        }

        [gradient-direction] [name='right-to-left'] {
          background-position: 50% -146px;
        }

        [gradient-direction] [name='rightbottom-to-lefttop'] {
          background-position: 50% -196px;
        }

        [gradient-direction] [name='right-bottom'] {
          background-position: 50% -196px;
        }

        [gradient-direction] [name='bottom-to-top'] {
          background-position: 50% -246px;
        }

        [gradient-direction] [name='leftbottom-to-righttop'] {
          background-position: 50% -296px;
        }

        [gradient-direction] [name='left-bottom'] {
          background-position: 50% -296px;
        }

        [gradient-direction] [name='left-to-right'] {
          background-position: 50% -346px;
        }

        [gradient-direction] [name='center-to-corner'] {
          background-position: 50% -396px;
        }

        [gradient-direction] [name='center'] {
          background-position: 50% -396px;
        }

        [gradient-direction] paper-item[focused] {
          background-color: rgba(255, 246, 143, 0.5);
        }

        .icon-only-label {
          top: 0 !important;
          width: 30px !important;
          height: 24px;
          background: url(/assets/images/icon-properties-label.png) no-repeat;
        }

        .icon-only-label.color {
          background-position: 70% -198px;
        }
      `
    ]
  }

  firstUpdated() {
    this.shadowRoot.addEventListener('change', this._onChange.bind(this))
  }

  _onChange(e) {
    var element = e.target
    var key = element.getAttribute('value-key')

    if (!key) {
      return
    }

    var value

    switch (element.tagName) {
      case 'THINGS-EDITOR-ANGLE-INPUT':
        value = Number(element.radian) || 0
        break

      case 'INPUT':
        switch (element.type) {
          case 'checkbox':
            value = element.checked
            break
          case 'number':
            value = Number(element.value) || 0
            break
          case 'text':
            value = String(element.value)
        }
        break

      case 'PAPER-BUTTON':
        value = element.active
        break

      case 'PAPER-LISTBOX':
        value = element.selected
        break

      default:
        value = element.value
        break
    }

    if (key == 'direction') {
      key = 'rotation'
      value = this._convertDirectionToRotation(value)
    }

    this.value = {
      ...this.value,
      [key]: value
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  render() {
    var selector = (this.value && this.value.type) || 'linear'

    return html`
      <label> <i18n-msg msgid="label.type">type</i18n-msg> </label>
      <select value-key="type" .value=${(this.value && this.value.type) || 'linear'}>
        <option>linear</option>
        <option>radial</option>
      </select>

      <label class="icon-only-label color"></label>
      <things-editor-angle-input value-key="rotation" .radian=${(this.value && this.value.rotation) || 0}>
      </things-editor-angle-input>

      <label> <i18n-msg msgid="label.direction">direction</i18n-msg> </label>
      <div editors>
        <paper-dropdown-menu no-label-float="true" ?active-selector=${selector == 'linear'}>
          <paper-listbox
            @selected-changed="${e => this._onChange(e)}"
            value-key="direction"
            slot="dropdown-content"
            gradient-direction
            .selected=${(this.value && this.value.direction) || 'left-to-right'}
            attr-for-selected="name"
          >
            <paper-item name="lefttop-to-rightbottom"></paper-item>
            <paper-item name="top-to-bottom"></paper-item>
            <paper-item name="righttop-to-leftbottom"></paper-item>
            <paper-item name="right-to-left"></paper-item>
            <paper-item name="rightbottom-to-lefttop"></paper-item>
            <paper-item name="bottom-to-top"></paper-item>
            <paper-item name="leftbottom-to-righttop"></paper-item>
            <paper-item name="left-to-right"></paper-item>
            <paper-item name="center-to-corner"></paper-item>
          </paper-listbox>
        </paper-dropdown-menu>

        <paper-dropdown-menu no-label-float="true" ?active-selector=${selector == 'radial'}>
          <paper-listbox
            @selected-changed="${e => this._onChange(e)}"
            value-key="center"
            slot="dropdown-content"
            gradient-direction
            .selected=${(this.value && this.value.center) || 'center'}
            attr-for-selected="name"
          >
            <paper-item name="center"></paper-item>
            <paper-item name="left-top"></paper-item>
            <paper-item name="right-top"></paper-item>
            <paper-item name="right-bottom"></paper-item>
            <paper-item name="left-bottom"></paper-item>
          </paper-listbox>
        </paper-dropdown-menu>
      </div>

      <things-editor-color-stops
        value-key="colorStops"
        type="gradient"
        .value=${(this.value && this.value.colorStops) || {}}
      >
      </things-editor-color-stops>
    `
  }

  _convertDirectionToRotation(direction) {
    var rotation
    switch (direction) {
      case 'lefttop-to-rightbottom':
        rotation = 45
        break
      case 'top-to-bottom':
        rotation = 90
        break
      case 'righttop-to-leftbottom':
        rotation = 135
        break
      case 'right-to-left':
        rotation = 180
        break
      case 'rightbottom-to-lefttop':
        rotation = 215
        break
      case 'bottom-to-top':
        rotation = 270
        break
      case 'leftbottom-to-righttop':
        rotation = 315
        break
      case 'left-to-right':
        rotation = 0
        break
      default:
        return
    }

    return (rotation / 360) * Math.PI * 2
  }
}

customElements.define(ThingsEditorGradient.is, ThingsEditorGradient)
