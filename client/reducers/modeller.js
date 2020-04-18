import { ADD_MODELLER_EDITORS } from '../actions/modeller.js'

const INITIAL_STATE = {
  editors: {
    legend: 'property-editor-legend',
    number: 'property-editor-number',
    password: 'property-editor-password',
    angle: 'property-editor-angle',
    string: 'property-editor-string',
    textarea: 'property-editor-textarea',
    javascript: 'property-editor-textarea',
    graphql: 'property-editor-graphql',
    checkbox: 'property-editor-checkbox',
    select: 'property-editor-select',
    color: 'property-editor-color',
    'solid-color-stops': 'property-editor-solid-colorstops',
    'gradient-color-stops': 'property-editor-gradient-colorstops',
    'multiple-color': 'property-editor-multiple-color',
    'editor-table': 'property-editor-table',
    'id-input': 'property-editor-id',
    options: 'property-editor-options',
    date: 'property-editor-date',
    map: 'property-editor-value-map',
    range: 'property-editor-value-range'
  }
}

const modeller = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_MODELLER_EDITORS:
      let editors = {
        ...state.editors,
        ...(action.editors || {})
      }

      return {
        ...state,
        editors
      }

    default:
      return state
  }
}

export default modeller
