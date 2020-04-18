/**
 * @license Copyright © HatioLab Inc. All rights reserved.
 */

import { LitElement, html, css } from 'lit-element'
import { deepEquals } from '@things-factory/utils'

import './things-editor-color'

/**
범위내에서 여러 컬러셋(포지션과 색깔) 배열을 편집하는 컴포넌트이다.

미리보기 Bar에서는 gradient나, solid 형태의 컬러셋을 보여준다.

새로운 컬러셋을 추가고자 할 때는 미리보기 Bar를 더블클릭한다.
컬러셋을 제거하고자 할 때는 컬러셋 마커를 아래방향으로 드래깅한다.
컬러셋의 위치를 옮기고자 할 때는, 컬러셋 마커를 좌우로 드래깅하여 이동시키거나,
옮기고자하는 컬러셋 마커를 마우스로 선택하고, 포지션 입력 에디터에서 직접 수정한다.
컬러셋의 색상을 바꾸고자 할 때는, 컬러셋 마커를 더블클릭하여 컬러파레트를 팝업시켜서 색상을 선택하거나, 색상 입력 에디터에서 직접 색상을 수정할 수 있다.

Example:

    <things-editor-color-stops type="gradient"
                               .value=${gradient.colorStops}>
    </things-editor-color-stops>
*/

export default class ThingsEditorColorStops extends LitElement {
  // TODO 최초의 colorbar가 화면에 표시될 때의 사이즈에 따른 colorstop들의 위치 배정이 필요함.(IronResizableBehavior 대체.)
  constructor() {
    super()

    this.type = 'solid'
    this.min = 0
    this.max = 1
    this.value = []
    this.focused = null
  }

  static get is() {
    return 'things-editor-color-stops'
  }

  static get properties() {
    return {
      /**
       * `type`은 color-stop bar의 표시 방법을 의미한다.
       * - 'solid' : 컬러스톱위치에서 다음 컬러스톱까지 solid color로 채운다.
       * - 'gradient' : 컬러스톱위치에서 다음 컬러스톱까지 gradient color로 채운다.
       */
      type: String,
      /**
       * `min`은 color-stop bar의 위치값 범위의 최소값을 의미한다.
       */
      min: Number,
      /**
       * `max`은 color-stop bar의 위치값 범위의 최대값을 의미한다.
       */
      max: Number,
      /**
       * `value`은 color-stops에 의해 만들어진 color-stop 배열을 유지한다.
       */
      value: Array,
      focused: Object
    }
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          grid-gap: 0;
          grid-auto-rows: minmax(0, auto);
        }

        #color-stops {
          grid-column: 1 / 11;
          grid-row: 1;

          clear: both;
          margin-bottom: -3px;
        }

        #colorbar {
          width: 95%;
          height: 12px;
          margin: auto;
          margin-bottom: 25px;
          border: 1px solid #ccc;
        }

        #markers {
          position: relative;
          top: 30px;
        }

        #markers div {
          width: 10px;
          height: 10px;
          margin-top: -15px;
          position: absolute;
          border: 2px solid #fff;
          cursor: pointer;
          -webkit-box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.2);
          -moz-box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.2);
          box-shadow: 1px 1px 1px 0px rgba(0, 0, 0, 0.2);
        }

        #markers div::before {
          border-bottom: 6px solid #fff;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          content: '';
          width: 0;
          height: 0;
          left: -2px;
          position: absolute;
          top: -8px;
        }

        #markers div[focused] {
          border-color: var(--things-editor-colorbar-marker-focused-color, #585858);
        }

        #markers div[focused]:before {
          border-bottom: 7px solid var(--things-editor-colorbar-marker-focused-color, #585858);
        }

        .icon-only-label {
          background: url(/assets/images/icon-properties-label.png) no-repeat;
          width: 30px;
          height: 24px;
        }

        .icon-only-label.color {
          grid-column: 1 / 2;
          grid-row: 2;

          background-position: 70% -498px;
          float: left;
          margin-top: 0;
        }

        .icon-only-label.position {
          grid-column: 7 / 8;
          grid-row: 2;

          background-position: 70% -797px;
          float: left;
          margin-top: 0;
        }

        things-editor-color {
          grid-column: 2 / 7;
          grid-row: 2;
        }

        input[type='number'] {
          grid-column: 8 / 11;
          grid-row: 2;
        }
      `
    ]
  }

  connectedCallback() {
    super.connectedCallback()

    this._dragImage = new Image()
    this._dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
  }

  firstUpdated() {
    window.addEventListener('resize', () => {
      this.requestUpdate()
    })
  }

  updated(change) {
    if (change.has('value') && this.value instanceof Array) {
      var oldValue = change.get('value')
      if (
        this.focused &&
        (!oldValue ||
          this.value.findIndex(v => v.position == this.focused.position && v.color == this.focused.color) == -1)
      ) {
        /* 이전 값이 없었던 경우에 focused를 클리어시킨다.
         * 이전 값이 있던 경우에도, focused는 이 에디터 내부에서만 선택될 수 있으며, 수정될 수 있으므로 동일한 포지션을 갖는 value가 없으면, 새로운 에디터가 시작된 것으로 판단하여 focused를 클리어시킨다.
         */
        this.focused = null
      }

      if (!deepEquals(oldValue, this.value)) {
        this._renderColorBar(this.min, this.max, this.type)

        this.requestUpdate()
      }
    }
  }

  render() {
    return html`
      <div id="color-stops">
        <div id="colorbar" @dblclick=${e => this._onDblClickColorbar(e)}>
          <div
            id="markers"
            @dblclick=${e => this._onDblClickMarkers(e)}
            @mousedown=${e => this._onMouseDown(e)}
            @dragstart=${e => this._onDragStart(e)}
            @drag=${this._throttled(100, this._onDrag.bind(this))}
            @dragend=${e => this._onDragEnd(e)}
          >
            ${this._refinedValue(this.value).map(
              (item, index) => html`
                <div
                  .style="background-color:${item.color};margin-left:${this._calculatePosition(
                    item.position,
                    this.min,
                    this.max
                  )}px;"
                  marker-index=${index}
                  draggable="true"
                ></div>
              `
            )}
          </div>
        </div>
      </div>

      <label class="icon-only-label color"></label>
      <things-editor-color
        id="color-editor"
        .value=${this.focused && this.focused.color}
        @change=${e => this._onChangeSubComponent(e)}
      >
      </things-editor-color>

      <label class="icon-only-label position"></label>
      <input
        type="number"
        id="color-position"
        .value=${this.focused && this.focused.position}
        @change=${e => this._onChangeSubComponent(e)}
        step="0.01"
      />
    `
  }

  get colorbar() {
    return this.shadowRoot.querySelector('#colorbar')
  }

  get colorEditor() {
    return this.shadowRoot.querySelector('#color-editor')
  }

  _refinedValue(value) {
    return value instanceof Array ? value : []
  }

  _setFocused(index) {
    if (this.focused && this.focused.index === index) {
      return
    }

    var marker = this.shadowRoot.querySelector(`#markers div[marker-index='${index}']`)
    var olds = this.shadowRoot.querySelectorAll('#markers div[focused]')
    olds.length > 0 && olds.forEach(old => old.removeAttribute('focused'))
    marker && marker.setAttribute('focused', true)

    if (!marker) {
      this.focused = null
      return
    }

    var colorStop = this.value[index]

    this._changeFocused({
      index: index,
      color: colorStop.color,
      position: Math.max(this.min, Math.min(colorStop.position, this.max))
    })
  }

  _changeFocused(focused) {
    if (!focused) {
      this._setFocused(-1) // clear focused marker

      return
    }

    this.focused = focused

    this.value = this.value
      .map((colorStop, index) => {
        if (index != focused.index) return colorStop

        return {
          color: focused.color,
          position: focused.position
        }
      })
      .sort((a, b) => {
        return b.position < a.position
      })

    var colorStop = this.value[focused.index]

    if (focused.position != colorStop.position || focused.color != colorStop.color) {
      var index = -1
      for (var i = 0; i < this.value.length; i++) {
        colorStop = this.value[i]
        if (focused.position == colorStop.position && focused.color == colorStop.color) {
          index = i
          break
        }
      }

      this._setFocused(index)
    }
  }

  _renderColorBar(min, max, type) {
    var value = this._refinedValue(this.value)
    var gradient = ''

    if (value instanceof Array && value.length > 0) {
      if (this.type == 'gradient') {
        var stopsStrings = (value || []).map(function(stop) {
          var position = (stop.position - min) / (max - min)
          return `${stop.color} ${position * 100}%`
        })
      } else {
        var stops = value || []
        var last = null
        var last_position = 0
        var stopsStrings = stops.map(function(stop) {
          var stop_position = (stop.position - min) / (max - min)
          if (last) {
            last_position = (last.position - min) / (max - min)
            var step = `${stop.color} ${last_position * 100}%, ${stop.color} ${stop_position * 100}%`
          } else {
            var step = `${stop.color} ${stop_position * 100}%`
          }
          last = stop
          return step
        })
        if (last) {
          last_position = (last.position - min) / (max - min)
          stopsStrings.push(`${last.color} ${last_position * 100}%, white ${last_position * 100}%, white 100%`)
        }
      }

      gradient = stopsStrings.join(',')
    } else {
      gradient = 'black 0%, black 100%'
    }

    this.colorbar.style.background = `linear-gradient(to right, ${gradient})`
    /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  }

  _onChangeSubComponent(e) {
    var element = e.target
    var id = element.id

    if (!this.focused) {
      return
    }

    switch (id) {
      case 'color-editor':
        this._changeFocused({
          ...this.focused,
          color: element.value
        })
        break
      case 'color-position':
        this._changeFocused({
          ...this.focused,
          position: Math.max(this.min, Math.min(element.value, this.max))
        })
        break
    }

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _onDblClickColorbar(e) {
    /* 마커를 클릭한 경우를 걸러낸다. */
    if (e.target !== this.colorbar) return

    var width = this.colorbar.offsetWidth
    var position = this.min + (this.max - this.min) * (e.offsetX / width)
    var colorStops = this.value ? this.value.slice() : []

    for (var i = 0; i < colorStops.length; i++) {
      if (colorStops[i].position > position) break
    }

    colorStops.splice(i, 0, {
      position: position,
      color: '#fff'
    })

    this.value = colorStops

    this.focused = null
    this._setFocused(i)

    this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
  }

  _onDblClickMarkers(e) {
    this.colorEditor.showPicker()
  }

  _onMouseDown(e) {
    var marker = e.target
    var index = marker.getAttribute('marker-index')

    this._setFocused(index)
  }

  _onDragStart(e) {
    /* drag 시에 ghost image를 보이지 않게 하려고 함 */
    e.dataTransfer.setDragImage(this._dragImage, 0, 0)

    this.dragstart = {
      position: this.focused.position,
      x: e.clientX,
      y: e.clientY
    }
  }

  // TODO onDrag 이벤트가 계속 발생하므로 처리하는 성능 저하됨. 그래서 throttling 하도록 함
  _throttled(delay, fn) {
    let lastCall = 0
    return function(...args) {
      const now = new Date().getTime()
      if (now - lastCall < delay) {
        return
      }
      lastCall = now
      return fn(...args)
    }
  }

  _onDrag(e) {
    if (e.clientX <= 0) {
      return
    }

    var width = this.colorbar.offsetWidth
    var position = this.dragstart.position + ((e.clientX - this.dragstart.x) / width) * (this.max - this.min)

    if (position != this.focused.position) {
      this._changeFocused({
        ...this.focused,
        position: Math.max(this.min, Math.min(position, this.max))
      })

      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
    }
  }

  _onDragEnd(e) {
    if (e.clientY - this.dragstart.y > 40) {
      this.value.splice(this.focused.index, 1)
      this.value = this.value.slice()

      this._setFocused(-1)

      this.dispatchEvent(new CustomEvent('change', { bubbles: true, composed: true }))
    }
  }

  _calculatePosition(position, min, max) {
    /* TODO 7 ==> 마커 폭의 절반으로 계산해야함. */
    var calculated = position

    if (calculated > this.max) calculated = this.max
    else if (calculated < this.min) calculated = this.min

    var width = (this.colorbar && this.colorbar.offsetWidth) || this._colorbar_size || 0

    return ((calculated - this.min) / (this.max - this.min)) * width - 7
  }
}

customElements.define(ThingsEditorColorStops.is, ThingsEditorColorStops)
