<template>
  <div id="app">
    <keep-alive exclude="Detail">
      <router-view />
    </keep-alive>
    <main-tab-bar />
  </div>
</template>

<script>
import MainTabBar from "components/content/mainTabbar/MainTabBar";
export default {
  components: { MainTabBar },
  name: "App",
  comments: {
    MainTabBar,
  },
};
</script>

<style>
@import "assets/css/base.css";
</style>
