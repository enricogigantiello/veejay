import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counter from './counter'
import search from './search'
import mixer from './mixer'
import suggestions from './suggestions'

export default combineReducers({
  router: routerReducer,
  counter,
  search,
  mixer,
  suggestions
})
