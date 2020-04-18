/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import '@things-factory/i18n-base'
import { deepClone } from '@things-factory/utils'
import { html, LitElement } from 'lit-element'
import './things-editor-angle-input'
import './things-editor-code'
import './things-editor-color'
import './things-editor-color-stops'
import './things-editor-id'
import './things-editor-multiple-color'
import './things-editor-options'
import './things-editor-table'
import './things-editor-value-map'
import './things-editor-value-range'
import './things-editor-attachment-selector'
import './things-editor-font-selector'

import { ThingsEditorPropertyStyles } from './things-editor-property-styles'

export default class ThingsEditorProperty extends LitElement {
  static get is() {
    return 'things-editor-property'
  }

  static get properties() {
    return {
      value: Object,
      type: String,
      label: String,
      placeholder: String,
      property: Object,
      /* TODO _msgId, _clone 속성이 필요한가 ? */
      _msgId: String,
      _clone: Object
    }
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  connectedCallback() {
    super.connectedCallback()

    this.shadowRoot.addEventListener('change', this._valueChanged.bind(this))
  }

  editorTemplate(props) {
    return html``
  }

  render() {
    return html`
      ${this.editorTemplate(this)}
      ${this.label
        ? html`
            <label for="editor">
              <i18n-msg msgid=${this._computeLabelId(this.label)}>${this.label}</i18n-msg>
            </label>
          `
        : html``}
    `
  }

  shouldUpdate(changedProperties) {
    if (this.__by_me) {
      return false
    }

    if (changedProperties.has('value')) {
      this.__by_me = true
      this.value = deepClone(this.value)
      this.__by_me = false
    }

    return true
  }

  get valueProperty() {
    return 'value'
  }

  _computeLabelId(label) {
    if (label.indexOf('label.') >= 0) return label

    return 'label.' + label
  }

  _valueChanged(e) {
    e.stopPropagation()

    this.value = deepClone(e.target[this.valueProperty])

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))

    if (!this.observe) return
    this.observe.call(this, this.value)
  }
}

class PropertyEditorLegend extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-legend'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <legend>${props.property.label}</legend> `
  }
}

customElements.define(PropertyEditorLegend.is, PropertyEditorLegend)

class PropertyEditorNumber extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-number'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <input
        id="editor"
        type="number"
        placeholder=${props.placeholder || ''}
        .value=${props.value}
        .step=${props.property && props.property.step}
        .min=${props.property && props.property.min}
        .max=${props.property && props.property.max}
        @focus=${e => {
          var el = e.currentTarget
          el.lastValidValue = el.value
        }}
        @input=${e => {
          var el = e.currentTarget
          var validity = el.checkValidity()
          if (validity) el.lastValidValue = el.value
          else el.value = el.lastValidValue || ''
        }}
        @blur=${e => {
          var el = e.currentTarget
          delete el.lastValidValue
        }}
      />
    `
  }
}

customElements.define(PropertyEditorNumber.is, PropertyEditorNumber)

class PropertyEditorAngle extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-angle'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'radian'
  }

  editorTemplate(props) {
    return html`
      <things-editor-angle-input
        id="editor"
        .radian=${props.value}
        placeholder=${props.placeholder || ''}
      ></things-editor-angle-input>
    `
  }
}

customElements.define(PropertyEditorAngle.is, PropertyEditorAngle)

class PropertyEditorString extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-string'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <input type="text" id="editor" .value=${props.value} placeholder=${props.placeholder || ''} /> `
  }
}

customElements.define(PropertyEditorString.is, PropertyEditorString)

class PropertyEditorPassword extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-password'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <input type="password" id="editor" .value=${props.value} placeholder=${props.placeholder || ''} /> `
  }
}

customElements.define(PropertyEditorPassword.is, PropertyEditorPassword)

class PropertyEditorTextArea extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-textarea'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <things-editor-code id="editor" .value=${props.value} fullwidth> </things-editor-code> `
  }
}

customElements.define(PropertyEditorTextArea.is, PropertyEditorTextArea)

class PropertyEditorGraphQL extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-graphql'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <things-editor-code id="editor" mode="graphql" .value=${props.value} fullwidth> </things-editor-code> `
  }
}

customElements.define(PropertyEditorGraphQL.is, PropertyEditorGraphQL)

class PropertyEditorCheckbox extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-checkbox'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'checked'
  }

  editorTemplate(props) {
    return html` <input type="checkbox" id="editor" .checked=${props.value} placeholder=${props.placeholder || ''} /> `
  }
}

customElements.define(PropertyEditorCheckbox.is, PropertyEditorCheckbox)

class PropertyEditorSelect extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-select'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <select id="editor">
        ${props.property.options.map(
          item => html`
            <option value=${props._getOptionValue(item)} ?selected=${props._isSelected(props.value, item)}
              >${this._getOptionDisplay(item)}</option
            >
          `
        )}
      </select>
    `
  }

  _getOptionValue(item) {
    if (typeof item == 'string') return item

    return item.value
  }

  _getOptionDisplay(item) {
    if (typeof item == 'string') return item

    return item.display
  }

  _isSelected(value, item) {
    return value == this._getOptionValue(item)
  }
}

customElements.define(PropertyEditorSelect.is, PropertyEditorSelect)

class PropertyEditorColor extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-color'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color
        id="editor"
        .value=${props.value}
        placeholder=${props.placeholder || ''}
        .properties=${props.property}
      ></things-editor-color>
    `
  }
}

customElements.define(PropertyEditorColor.is, PropertyEditorColor)

class PropertyEditorSolidColorStops extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-solid-colorstops'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color-stops
        id="editor"
        type="solid"
        .value=${props.value}
        .min=${props.property && props.property.min}
        .max=${props.property && props.property.max}
        fullwidth
      >
      </things-editor-color-stops>
    `
  }
}

customElements.define(PropertyEditorSolidColorStops.is, PropertyEditorSolidColorStops)

class PropertyEditorGradientColorStops extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-gradient-colorstops'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-color-stops
        id="editor"
        type="gradient"
        .value=${props.value}
        .min=${props.property && props.property.min}
        .max=${props.property && props.property.max}
        fullwidth
      >
      </things-editor-color-stops>
    `
  }
}

customElements.define(PropertyEditorGradientColorStops.is, PropertyEditorGradientColorStops)

class PropertyEditorMultipleColor extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-multiple-color'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'values'
  }

  editorTemplate(props) {
    return html` <things-editor-multiple-color id="editor" .values=${props.value}></things-editor-multiple-color> `
  }
}

customElements.define(PropertyEditorMultipleColor.is, PropertyEditorMultipleColor)

class PropertyEditorDate extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-date'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <input type="date" id="editor" .value=${props.value} /> `
  }
}

customElements.define(PropertyEditorDate.is, PropertyEditorDate)

class PropertyEditorOptions extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-options'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  get valueProperty() {
    return 'options'
  }

  editorTemplate(props) {
    return html` <things-editor-options id="editor" .options=${props.value} fullwidth></things-editor-options> `
  }
}

customElements.define(PropertyEditorOptions.is, PropertyEditorOptions)

class PropertyEditorTable extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-table'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <things-editor-table id="editor" .property=${props.property} fullwidth></things-editor-table> `
  }
}

customElements.define(PropertyEditorTable.is, PropertyEditorTable)

class PropertyEditorId extends ThingsEditorProperty {
  static get is() {
    return 'property-editor-id'
  }

  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html` <things-editor-id id="editor" .value=${props.value} .property=${props.property}></things-editor-id> `
  }
}

customElements.define(PropertyEditorId.is, PropertyEditorId)

class PropertyEditorValueMap extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-value-map id="editor" valuetype="string" .value=${props.value} fullwidth></things-editor-value-map>
    `
  }
}

customElements.define('property-editor-value-map', PropertyEditorValueMap)

class PropertyEditorValueRange extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-value-range
        id="editor"
        valuetype="string"
        .value=${props.value}
        fullwidth
      ></things-editor-value-range>
    `
  }
}

customElements.define('property-editor-value-range', PropertyEditorValueRange)

class PropertyEditorAttachmentSelector extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-attachment-selector
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-attachment-selector>
    `
  }
}

customElements.define('property-editor-attachment-selector', PropertyEditorAttachmentSelector)

class PropertyEditorImageSelector extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-attachment-selector
        id="editor"
        .value=${props.value}
        .properties=${Object.assign({ category: 'image' }, props)}
      ></things-editor-attachment-selector>
    `
  }
}

customElements.define('property-editor-image-selector', PropertyEditorImageSelector)

class PropertyEditorFontSelector extends ThingsEditorProperty {
  static get styles() {
    return [ThingsEditorPropertyStyles]
  }

  editorTemplate(props) {
    return html`
      <things-editor-font-selector
        id="editor"
        .value=${props.value}
        .properties=${props.property}
      ></things-editor-font-selector>
    `
  }
}

customElements.define('property-editor-font-selector', PropertyEditorFontSelector)
