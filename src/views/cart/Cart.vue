<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ cartLength }})</div>
    </nav-bar>
    <!-- 商品列表 -->
    <cart-list />
    <!-- 底部汇总 -->
    <cart-botton-bar />
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList.vue";
import CartBottonBar from "./childComps/CartBottonBar.vue";

import { mapGetters } from "vuex";
export default {
  components: { NavBar, CartList, CartBottonBar },
  name: "Cart",
  computed: {
    ...mapGetters(["cartLength", "cartList"]),
  },
};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
</style>
