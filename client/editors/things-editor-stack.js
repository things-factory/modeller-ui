/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

// TODO LitElement 로 변경 후 검증하지 않음.
import { html, css } from 'lit-element'

export default class ThingsEditorStack extends LitElement {
  static get is() {
    return 'things-editor-stack'
  }

  static get properties() {
    return {
      /**
       * `stack`은 stack에 의해 만들어진 층의 배열을 유지한다.
       */
      stack: Array,
      /**
       * `activeIndex`은 현재 active된 층의 인덱스를 유지한다.
       */
      activeIndex: Number
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        #add-floor {
          width: 100%;
          height: 20px;
          background-color: blue;
          color: white;
        }

        div {
          background-color: blue;
          width: calc(100% - 40px);
          width: -webkit-calc(100% - 40px);
          min-height: 20px;
        }

        div.active {
          background-color: red;
        }

        div button {
          position: absolute;
          right: 10px;
          width: 30px;
          min-height: 20px;
        }
      `
    ]
  }

  constructor() {
    super()

    this.stack = []
    this.activeIndex = 0
  }

  render() {
    return html`
      <button id="add-floor" @click=${e => this._onClickAddFloor(e)}>+</button>

      ${
        this.stack.reverse().map(
          (item, index) => html`
            <div class="${index == this.activeIndex ? 'active' : ''}" @click=${e => this._onClickToActive(e)}>
              ${item.name} <button @click=${e => this._onClickRemoveFloor(e)}>-</button>
            </div>
          `
        )
      }
    `
  }

  _onClickAddFloor(e) {
    this.stack.push({ name: '' })
  }

  _onClickToActive(e) {
    if (e.target.tagName != 'DIV') return

    var model = e.model

    this.activeIndex = this.stack.indexOf(model.item)
  }

  _onClickRemoveFloor(e) {
    var model = e.model
    var idx = this.stack.indexOf(model.item)

    this.active.splice(idx, 1)

    if (this.activeIndex >= this.stack.length && this.activeIndex > 0) this.activeIndex--
    else this.activeIndex = 0
  }
}

customElements.define(ThingsEditorStack.is, ThingsEditorStack)
