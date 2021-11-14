import { ADD_COUNTER,ADD_TO_CART,EDIT_CHECKED } from "./mutation-types"
export default {
  addCart({state,commit},payLoad){
    return new Promise((resolve,reject)=>{
       // payload 新添加的商品
      let oldProduct = null
      for (let item of state.carList) {
        if(item.iid === payLoad.iid){
          oldProduct = item
        }
      }
      // 判断 oldProduct
      if(oldProduct){ // 数量+1
        // oldProduct.count += 1
        commit(ADD_COUNTER,oldProduct)
        resolve('当前的商品数量加+1')
      }else{ // 添加新的商品
        payLoad.count = 1
        commit(ADD_TO_CART,payLoad)
        resolve('添加了新的商品')
      }
    })
    
  },
  editChecked({state,commit},payLoad){
    commit(EDIT_CHECKED,payLoad)
  }
  
}