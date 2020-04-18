/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

// TODO LitElement 로 변경 후 검증하지 않음.
import { LitElement, html, css } from 'lit-element'

import ace from 'brace'
import 'brace/mode/javascript'
import 'brace/theme/monokai'

import 'ace-builds/src-min-noconflict/ace'
import 'ace-builds/src-min-noconflict/mode-javascript'
import 'ace-builds/src-min-noconflict/theme-monokai'

/**
ace-editor의 polymer element이다.

Example:

  <things-editor-script id="editor"
                        value=${text}
                        theme="ace/theme/monokai"
                        mode="ace/mode/javascript">
  </things-editor-script>
*/

export default class ThingsEditorScript extends LitElement {
  static get is() {
    return 'things-editor-script'
  }

  static get properties() {
    return {
      /**
       * `value`는 에디터에서 작성중인 contents이다.
       */
      value: String,
      theme: String,
      mode: String,
      fontsize: Number,
      softtabs: String,
      tabsize: Number,
      readonly: Boolean,
      wrapmode: Boolean,
      editor: Object,
      gutter: Boolean
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          position: relative;

          width: 100%;
          height: 100%;
        }

        #container {
          width: 100%;
          height: 100%;
        }
      `
    ]
  }
  constructor() {
    super()

    this.value = ''
    this.tabsize = 2
    this.gutter = false
  }

  connectedCallback() {
    super.connectedCallback()

    this._attached = true

    var self = this

    if (!this.editor) {
      this.editor = ace.edit(this.$.container, {
        initialContent: this.value
      })

      if (!this.gutter) this.editor.renderer.setShowGutter(this.gutter)

      // inject base editor styles
      this._injectTheme('#ace_editor\\.css')
      this._injectTheme('#ace-tm')

      this.editor.getSession().on('change', function(event) {
        self._changedOnThis = true
        self.set('value', self.editor.getValue())
        self._changedOnThis = false
      })
    }

    // prevent to warning logs ..
    this.editor.$blockScrolling = Infinity

    // handle theme changes
    this.editor.renderer.addEventListener('themeLoaded', this._onThemeLoaded.bind(this))

    // initial attributes
    this._configEditor()
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    this._attached = false
  }

  updated(change) {
    change.has('value') && this._valueChanged(this.value)
    change.keys().filter(key => key != 'value').length > 1 && this._configEditor()
  }

  render() {
    return html`
      <div id="container"></div>
    `
  }

  _configEditor() {
    if (!this.editor || !this._attached) return

    var { theme, mode, fontsize, softtabs, tabsize, readonly, wrapmode } = this

    this.editor.setTheme(theme)
    this.editor.setFontSize(fontsize)
    this.editor.setReadOnly(readonly)

    this.editor.commands.addCommand({
      name: 'fullscreen',
      exec(editor) {
        function _fullscreen_callback(e) {
          editor.resize()

          if (
            !document.fullscreen &&
            !document.mozFullScreen &&
            !document.webkitIsFullScreen &&
            !document.msFullscreenElement
          ) {
            ;['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(event =>
              document.removeEventListener(event, _fullscreen_callback)
            )
          }
        }

        ;['fullscreenchange', 'webkitfullscreenchange', 'MSFullscreenChange'].forEach(event =>
          document.addEventListener(event, _fullscreen_callback)
        )

        var container = editor.container

        if (container.requestFullScreen) container.requestFullScreen()
        else if (container.webkitRequestFullScreen) container.webkitRequestFullScreen()
        else if (container.mozRequestFullScreen) container.mozRequestFullScreen()
        else if (container.msRequestFullscreen) container.msRequestFullscreen()

        editor.resize()
      },
      bindKey: { mac: 'cmd-enter|f11', win: 'ctrl-enter|f11' }
    })

    var session = this.editor.getSession()

    session.setOption('useWorker', false)
    session.setMode(mode)
    session.setUseSoftTabs(softtabs)
    tabsize && session.setTabSize(tabsize)
    session.setUseWrapMode(wrapmode)
  }

  _valueChanged(value) {
    if (this._changedOnThis) {
      this.fire('change', value)
      return
    }

    if (this.editor) this.editor.setValue(value == undefined ? '' : String(value))
  }

  _onThemeLoaded(e) {
    var themeId = '#' + e.theme.cssClass
    this._injectTheme(themeId)

    // Workaround Chrome stable bug, force repaint
    this.style.display = 'none'
    this.offsetHeight
    this.style.display = ''
  }

  // inject the style tag of a theme to the element
  _injectTheme(themeId) {
    var n = document.querySelector(themeId)
    this.appendChild(this._cloneStyle(n))
  }

  //helper function to clone a style
  _cloneStyle(style) {
    var s = document.createElement('style')
    s.id = style.id
    s.textContent = style.textContent
    return s
  }
}

customElements.define(ThingsEditorScript.is, ThingsEditorScript)
