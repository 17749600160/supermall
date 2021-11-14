<template>
  <div id="detail">
    <!-- 导航栏 -->
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav" />
    <scroll
      class="content"
      ref="scroll"
      @scroll="contentScroll"
      :probe-type="3"
    >
      <!-- 商品详情页轮播图 -->
      <detail-swiper :top-images="topImages" />
      <!-- 商品页数据 -->
      <detail-base-info :goods="goods" />
      <!-- 店铺信息 -->
      <detail-shop-info :shop="shop" />
      <!-- 商品图片展示 -->
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
      <!-- 商品参数信息 -->
      <detail-param-info :paramInfo="paramInfo" ref="params" />
      <!-- 商品评论 -->
      <detail-comment-info :commentInfo="commentInfo" ref="comment" />
      <!-- 商品推荐 -->
      <goods-list :goods="recommends" ref="recommend" />
    </scroll>
    <detail-botton-bar @addCart="addToCart" />
    <!-- 定位锚点 -->
    <back-top @click.native="backTop" v-show="isShowBackTop" />
    <!-- toast弹窗信息 -->
    <!-- <toast :message="message" :show="show" /> -->
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar.vue";
import DetailSwiper from "./childComps/DetailSwiper.vue";
import DetailBaseInfo from "./childComps/DetailBaseInfo.vue";
import DetailShopInfo from "./childComps/DetailShopInfo.vue";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo.vue";
import DetailParamInfo from "./childComps/DetailParamInfo.vue";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import DetailBottonBar from "./childComps/DetailBottonBar.vue";

import Scroll from "components/common/scroll/Scroll.vue";
import GoodsList from "components/content/goods/GoodsList";
// import Toast from "components/common/toast/Toast";

import { debounce } from "common/utils.js";
import { itemListenerMixin, backTopMixin } from "common/mixin";

import {
  getRecommend,
  getDetail,
  Goods,
  Shop,
  GoodsParam,
} from "network/detail.js";

export default {
  name: "Detail",
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    Scroll,
    GoodsList,
    DetailBottonBar,
    // Toast,
  },
  mixins: [itemListenerMixin, backTopMixin],
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      recommends: [],
      themeTopYs: [],
      currentIndex: 0,
      // message: "",
      // show: false,
    };
  },
  methods: {
    imageLoad() {
      this.themeTopYs = [];
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.params.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
      // 给数组添加一个备用数据，方便后面的循环操作
      this.themeTopYs.push(Number.MAX_VALUE);
      // console.log(this.themeTopYs);
      this.newRefresh();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100);
    },
    contentScroll(position) {
      // 1.获取y值
      const positionY = -position.y;

      // 2.positionY和主体中的值进行对比
      let length = this.themeTopYs.length;
      /* for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i && 
          (positionY >= this.themeTopYs[i] &&
          positionY < this.themeTopYs[i + 1])
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      } */
      for (let i = 0; i < length - 1; i++) {
        if (
          this.currentIndex !== i &&
          ((i < length - 1 &&
            positionY >= this.themeTopYs[i] &&
            positionY < this.themeTopYs[i + 1]) ||
            (i === length - 1 && positionY >= this.themeTopYs[i]))
        ) {
          this.currentIndex = i;
          this.$refs.nav.currentIndex = this.currentIndex;
        }
      }

      // 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000 ? true : false;
    },
    addToCart() {
      // 1.获取购物车需要展示的信息
      const product = {};
      product.image = this.topImages[0];
      product.title = this.goods.title;
      product.desc = this.goods.desc;
      product.price = this.goods.realPrice;
      product.iid = this.iid;
      // console.log(product);

      // 2.将商品添加到购物车里
      // this.$store.cartList.push(product);
      this.$store.dispatch("addCart", product).then((res) => {
        // this.show = true;
        // this.message = res;
        // setTimeout(() => {
        //   this.show = false;
        //   this.message = "";
        // }, 1500);
        this.$toast.show(res, 1500);
      });

      // 3.添加到购物车成功
    },
  },
  async created() {
    // 1.保存传入的iid
    this.iid = this.$route.params.id;
    // 一.根据iid请求详情数据
    const { result } = await getDetail(this.iid);
    // console.log(result);
    // 1.获取顶部的图片轮播数据
    this.topImages = result.itemInfo.topImages;
    // 2.获取商品信息
    this.goods = new Goods(
      result.itemInfo,
      result.columns,
      result.shopInfo.services
    );
    // 3.创建店铺信息对象
    this.shop = new Shop(result.shopInfo);
    // 4.保存商品的详情数据
    this.detailInfo = result.detailInfo;
    // 5.获取参数的信息
    this.paramInfo = new GoodsParam(
      result.itemParams.info,
      result.itemParams.rule
    );
    // 6.取出评论的信息
    if (result.rate.cRate !== 0) {
      this.commentInfo = result.rate.list[0];
    }
    // 二.请求推荐数据
    const { data } = await getRecommend();
    this.recommends = data.list;
  },
  destroyed() {
    // 取消监听
    this.$bus.$off("itemImageLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
#detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 49px);
}
</style>
