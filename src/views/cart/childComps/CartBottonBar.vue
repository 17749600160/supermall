<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button
        class="check-button"
        :is-checked="isSelectAll"
        @click.native="checkClick"
      />
      <span> 全选</span>
    </div>

    <div class="price">合计：{{ totalPrice }}</div>
    <div @click="calcClick" class="calculate">
      去计算：({{ checkedLength }})
    </div>
  </div>
</template>

<script>
import CheckButton from "components/content/checkButton/CheckButton";

export default {
  name: "CartBottonBar",
  components: { CheckButton },
  computed: {
    totalPrice() {
      return (
        "￥" +
        this.$store.getters.cartList
          .filter((item) => {
            return item.checked;
          })
          .reduce((preValue, item) => {
            return preValue + item.price * item.count;
          }, 0)
          .toFixed(2)
      );
    },
    checkedLength() {
      return this.$store.getters.cartList
        .filter((item) => {
          return item.checked;
        })
        .reduce((preValue, item) => {
          return preValue + item.count;
        }, 0);
    },
    isSelectAll() {
      if (this.$store.getters.cartList.length === 0) return false;
      return !this.$store.getters.cartList.find((item) => !item.checked);
      /*  return !this.$store.getters.cartList.filter((item) => !item.checked)
        .length; */
    },
  },
  methods: {
    checkClick() {
      if (this.isSelectAll) {
        // 全部选中
        this.$store.getters.cartList.forEach((item) => (item.checked = false));
      } else {
        // 全部不选中，或者有部分没选中
        this.$store.getters.cartList.forEach((item) => (item.checked = true));
      }
    },
    calcClick() {
      let length = this.$store.getters.cartList.filter(
        (item) => !item.checked
      ).length;
      if (length !== 0) {
        this.$toast.show("请选择购买的商品", 1500);
      }
    },
  },
};
</script>

CheckButton
<style scoped>
.bottom-bar {
  height: 40px;
  position: relative;
  line-height: 40px;
  background-color: #eee;
  display: flex;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 60px;
}
.check-button {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 30px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: red;
  color: #fff;
  text-align: center;
}
</style>
