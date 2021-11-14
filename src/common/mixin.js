import { debounce } from "./utils";
import BackTop from "components/content/backTop/BackTop.vue";

export const itemListenerMixin = {
  data() {
    return {
      itemImgListener: null,
      newRefresh:null
    }
  },
  mounted() {
     // 1.监听item中图片加载完成
    this.newRefresh = debounce(this.$refs.scroll.refresh, 500);

     // 2.对监听的事件进行保存
     this.itemImgListener = () => {
      this.newRefresh();
     };
     this.$bus.$on("itemImageLoad", this.itemImgListener);
  },
}

export const backTopMixin = {
  components:{BackTop},
  data() {
    return {
      isShowBackTop:false
    }
  },
  methods: {
    backTop() {
      this.$refs.scroll.scrollTo(0, 0);
    },
  },
}