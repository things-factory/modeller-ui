import { html } from 'lit-element'
import { connect } from 'pwa-helpers/connect-mixin.js'
import { store, PageView } from '@things-factory/shell'

import logo from '../../assets/images/hatiolab-logo.png'

class ModellerUiMain extends connect(store)(PageView) {
  static get properties() {
    return {
      modellerUi: String
    }
  }
  render() {
    return html`
      <section>
        <h2>ModellerUi</h2>
        <img src=${logo}></img>
      </section>
    `
  }

  stateChanged(state) {
    this.modellerUi = state.modellerUi.state_main
  }
}

window.customElements.define('modeller-ui-main', ModellerUiMain)
