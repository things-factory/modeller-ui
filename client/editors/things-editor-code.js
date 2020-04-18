/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css, unsafeCSS } from 'lit-element'

import CodeMirrorStyle from '!!text-loader!codemirror/lib/codemirror.css'
import FullScreenStyle from '!!text-loader!codemirror/addon/display/fullscreen.css'
import NightThemeStyle from '!!text-loader!codemirror/theme/night.css'

import CodeMirror from 'codemirror'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/display/autorefresh'

/**
WEB Component for code-mirror code editor.

Example:

  <things-editor-code value=${text}>
  </things-editor-code>
*/
export default class ThingsEditorCode extends LitElement {
  static get is() {
    return 'things-editor-code'
  }

  static get properties() {
    return {
      /**
       * `value`는 에디터에서 작성중인 contents이다.
       */
      value: String,
      mode: String
    }
  }

  static get styles() {
    return [
      css`
        ${unsafeCSS(CodeMirrorStyle)}
        ${unsafeCSS(FullScreenStyle)}
        ${unsafeCSS(NightThemeStyle)}
      `,
      css`
        :host {
          display: block;
          position: relative;
        }

        textarea {
          display: block;
          height: 100%;
          width: 100%;
          resize: none;
          font-size: 16px;
          line-height: 20px;
          border: 0px;
          padding: 0px;
        }
      `
    ]
  }
  updated(change) {
    this._outside_changing = true
    if (change.has('value') && this.editor && !this._self_changing) {
      this.editor.setValue(this.value === undefined ? '' : String(this.value))
      this.editor.refresh()
    }
    this._outside_changing = false
  }

  render() {
    return html`
      <textarea></textarea>
    `
  }

  get editor() {
    if (!this._editor) {
      let textarea = this.shadowRoot.querySelector('textarea')
      let mode = this.mode || 'javascript'
      let lint = this.lint
      let hintOptions = this.hintOptions
      if (textarea) {
        this._editor = CodeMirror.fromTextArea(textarea, {
          value: this.value,
          mode,
          lint,
          hintOptions,
          tabSize: 2,
          lineNumbers: false,
          showCursorWhenSelecting: true,
          theme: 'night',
          extraKeys: {
            F11: function(cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'))
            },
            Esc: function(cm) {
              cm.setOption('fullScreen', !cm.getOption('fullScreen'))
            }
          },
          autoRefresh: {
            delay: 500
          }
        })

        this._editor.on('blur', e => {
          if (!this._changed) return

          this.value = e.getValue()
          this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
        })

        this._editor.on('change', async e => {
          this._self_changing = true

          this._changed = true

          await this.renderComplete
          this._self_changing = false
        })
      }
    }

    return this._editor
  }
}

customElements.define(ThingsEditorCode.is, ThingsEditorCode)
