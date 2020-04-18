import { store } from '@things-factory/shell'
import modeller from './reducers/modeller'

export default function bootstrap() {
  store.addReducers({ modeller })
}
