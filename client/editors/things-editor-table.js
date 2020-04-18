/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

// TODO LitElement 로 변경 후 검증하지 않음.
import { LitElement, html, css } from 'lit-element'

import '@material/mwc-icon'

import '@polymer/paper-dropdown-menu/paper-dropdown-menu'
import '@polymer/paper-item/paper-item'

import '@things-factory/i18n-base'
import './things-editor-buttons-radio'
import './things-editor-color'

/**
테이블 셀의 좌,우,상,하 경계선의 스타일을 편집하는 컴포넌트이다.

Example:

  <things-editor-table value=${border}>
  </things-editor-table>
*/

class ThingsEditorTable extends LitElement {
  static get is() {
    return 'things-editor-table'
  }

  static get properties() {
    return {
      borderWidth: Number,
      borderColor: String,
      borderStyle: String
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        fieldset {
          border: none;
          border-bottom: 1px solid #cfd8dc;
          color: var(--primary-text-color);
          font-size: 12px;
          padding: 0 0 10px 0;
          margin: 0 0 10px 0;
        }

        fieldset legend {
          padding: 5px 0 0 5px;
          font-size: 11px;
          color: #e46c2e;
          font-weight: bold;
          text-transform: capitalize;
        }

        .icon-only-label {
          background: url(/assets/images/icon-properties-label.png) no-repeat;
          width: 30px;
          height: 24px;
        }

        .property-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-gap: 5px;
          grid-auto-rows: minmax(24px, auto);
          margin: 10px 0 0 0;
        }

        .property-grid > * {
          line-height: 1.5;
        }

        #border-set > mwc-icon {
          grid-column: span 2;
          margin: 0 0 0 8px;
          width: 32px;
          height: 32px;
        }

        .property-grid > label {
          grid-column: span 3;
          text-align: right;
          text-transform: capitalize;
        }

        .property-grid > label.icon-only-label {
          grid-column: span 1;
        }

        .property-grid > things-editor-color,
        .property-grid > input[type='number'] {
          grid-column: span 4;
          padding: 0;
          margin: 0;
        }

        .property-grid > paper-dropdown-menu {
          grid-column: span 7;
          padding: 0;
          margin: 0;
        }

        [table-event] {
          position: relative;
          background: url('/assets/images/icon-properties-table.png') no-repeat;
          grid-column: span 2;
          min-height: 65px;
        }

        [table-event] span {
          position: absolute;
          bottom: 0;
          font-size: 0.9em;
          line-height: 1.2;
          text-transform: capitalize;
          text-align: center;
          vertical-align: bottom;
        }

        #merge-cells {
          background-position: 50% 3px;
        }

        #split-cells {
          background-position: 50% -97px;
        }

        #delete-row {
          background-position: 50% -197px;
        }

        #delete-column {
          background-position: 50% -297px;
        }

        #insert-above {
          background-position: 50% -397px;
        }

        #insert-below {
          background-position: 50% -497px;
        }

        #insert-left {
          background-position: 50% -597px;
        }

        #insert-right {
          background-position: 50% -697px;
        }

        #distribute-horizontal {
          background-position: 50% -797px;
        }

        #distribute-vertical {
          background-position: 50% -897px;
        }

        .line-type paper-item {
          background: no-repeat url(/assets/images/icon-properties-line-type.png);
          width: 80px;
          min-height: 25px;
        }
        .line-type paper-item.solid {
          background-position: 50% 12px;
        }
        .line-type paper-item.round-dot {
          background-position: 50% -38px;
        }
        .line-type paper-item.square-dot {
          background-position: 50% -88px;
        }
        .line-type paper-item.dash {
          background-position: 50% -138px;
        }
        .line-type paper-item.dash-dot {
          background-position: 50% -188px;
        }
        .line-type paper-item.long-dash {
          background-position: 50% -238px;
        }
        .line-type paper-item.long-dash-dot {
          background-position: 50% -288px;
        }
        .line-type paper-item.long-dash-dot-dot {
          background-position: 50% -338px;
        }
      `
    ]
  }

  constructor() {
    super()

    this.borderWidth = 1
    this.borderColor = 'black'
    this.borderStyle = 'solid'
  }

  firstUpdated() {
    this.shadowRoot.querySelector('#border-fieldset').addEventListener('change', this._onClickType.bind(this))
  }

  render() {
    return html`
      <fieldset id="border-fieldset">
        <legend><i18n-msg msgid="label.border-style">border style</i18n-msg></legend>

        <div
          id="border-set"
          class="property-grid
          border-style-btn"
          @click=${e => this._onClickType(e)}
        >
          <mwc-icon data-value="out">border_outer</mwc-icon>
          <mwc-icon data-value="in">border_inner</mwc-icon>
          <mwc-icon data-value="all">border_all</mwc-icon>
          <mwc-icon data-value="left">border_left</mwc-icon>
          <mwc-icon data-value="center">border_vertical</mwc-icon>
          <mwc-icon data-value="right">border_right</mwc-icon>
          <mwc-icon data-value="top">border_top</mwc-icon>
          <mwc-icon data-value="middle">border_horizontal</mwc-icon>
          <mwc-icon data-value="bottom">border_bottom</mwc-icon>
          <mwc-icon data-value="clear">border_clear</mwc-icon>
        </div>

        <div class="property-grid">
          <label class="icon-only-label linewidth"> </label>
          <input
            type="number"
            id="border-width"
            @change=${e => (this.borderWidth = e.target.value)}
            .value=${this.borderWidth}
          />

          <label class="icon-only-label color"> </label>
          <things-editor-color
            id="border-color"
            @change=${e => (this.borderColor = e.target.value)}
            .value=${this.borderColor}
          >
          </things-editor-color>

          <label> <i18n-msg msgid="label.border-type">border type</i18n-msg> </label>
          <paper-dropdown-menu no-label-float="true" class="line-type solid">
            <!-- solid는 선택된 항목 보여주기위한 class로 하위 paper-item의 class와 동일하게 -->
            <paper-listbox
              id="border-style"
              @iron-select=${e => (this.borderStyle = e.target.selected)}
              slot="dropdown-content"
              .selected=${this.borderStyle}
              attr-for-selected="name"
            >
              <paper-item class="solid" name="solid"></paper-item>
              <paper-item class="round-dot" name="round-dot"></paper-item>
              <paper-item class="square-dot" name="square-dot"></paper-item>
              <paper-item class="dash" name="dash"></paper-item>
              <paper-item class="dash-dot" name="dash-dot"></paper-item>
              <paper-item class="long-dash" name="long-dash"></paper-item>
              <paper-item class="long-dash-dot" name="long-dash-dot"></paper-item>
              <paper-item class="long-dash-dot-dot" name="long-dash-dot-dot"></paper-item>
            </paper-listbox>
          </paper-dropdown-menu>
        </div>
      </fieldset>

      <fieldset id="cell-fieldset" @click=${e => this._onClickCell(e)}>
        <div class="property-grid">
          <div id="merge-cells" table-event><span>merge cells</span></div>
          <div id="split-cells" table-event><span>split cells</span></div>
          <div id="delete-row" table-event><span>delete row</span></div>
          <div id="delete-column" table-event><span>delete column</span></div>
          <div id="insert-above" table-event><span>insert above</span></div>
          <div id="insert-below" table-event><span>insert below</span></div>
          <div id="insert-left" table-event><span>insert left</span></div>
          <div id="insert-right" table-event><span>insert right</span></div>
          <div id="distribute-horizontal" table-event><span>distribute horizontal</span></div>
          <div id="distribute-vertical" table-event><span>distribute vertical</span></div>
        </div>
      </fieldset>
    `
  }

  _onClickCell(e) {
    // TODO 여기서 cell 핸들링 관련된 이벤트를 fire 한다.
    // 각 버튼의 fire할 이벤트의 이름을 'table-' + id 로 한다.
    var target = e.target

    while (target && !target.hasAttribute('table-event') && target !== this) target = target.parentElement

    if (target === this || target === null) return

    this.dispatchEvent(
      new CustomEvent('table-' + target.id, {
        bubbles: true,
        composed: true
      })
    )

    e.stopPropagation()
  }

  _onClickType(e) {
    var target = e.target

    while (target && !target.hasAttribute('data-value') && target !== this) target = target.parentElement

    if (target === this || target === null) return

    this.dispatchEvent(
      new CustomEvent('table-cell-border-set', {
        bubbles: true,
        composed: true,
        detail: {
          type: target.getAttribute('data-value'),
          borderWidth: this.borderWidth,
          borderStyle: this.borderStyle,
          borderColor: this.borderColor
        }
      })
    )

    this.dispatchEvent(
      new CustomEvent('i-need-selected', {
        bubbles: true,
        composed: true,
        detail: {
          callback: selected => {
            console.log(selected)
            console.log(this.borderColor)
            console.log(target)
          }
        }
      })
    )

    e.stopPropagation()
  }
}

customElements.define(ThingsEditorTable.is, ThingsEditorTable)
