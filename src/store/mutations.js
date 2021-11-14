import { ADD_COUNTER,ADD_TO_CART,EDIT_CHECKED } from "./mutation-types"

export default {
  [ADD_COUNTER](state,payload){
    payload.count++
   },
   [ADD_TO_CART](state,payload){
    payload.checked = true
    state.carList.push(payload)
   },
   [EDIT_CHECKED](state,payload){
    state.carList.forEach(item => {
      if(item.iid === payload.iid){
        item.checked = !item.checked
      }
    });
   }
}