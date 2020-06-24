import { css } from 'lit-element'

export const ThingsEditorPropertyStyles = css`
  :host {
    margin: 5px;

    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-gap: 5px;

    align-items: center;

    color: var(--property-sidebar-fieldset-legend-color);
  }

  :host > * {
    box-sizing: border-box;

    grid-column: span 7;
    order: 2;

    align-self: stretch;
  }

  :host > label {
    grid-column: span 3;
    order: 1;

    text-align: right;

    font-size: 0.8em;
    line-height: 2;
    text-transform: capitalize;

    align-self: center;
  }

  :host > input[type='checkbox'] ~ label {
    grid-column: span 6;
    order: 2;

    text-align: left;
  }

  :host > select {
    border-color: lightgray;
  }

  :host > legend {
    grid-column: 1 / -1;

    display: inline-block;

    text-align: left;
    text-transform: capitalize;
  }

  :host > [fullwidth] {
    grid-column: 1 / -1;
  }

  :host > input[type='checkbox'] {
    grid-column: span 4;
    order: 1;

    justify-self: end;
    align-self: center;
  }
`
