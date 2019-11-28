<template>
  <div id="app">
    <input type="text" name="username" style="display:none;">
    <input type="checkbox" style="display:none;">
    <input type="password" name="password" style="display:none;">
    <v-header></v-header>
    <router-view class="main-container"/>
    <v-footer class="footer"></v-footer>
  </div>
</template>

<script>
export default {
  components: {
    vHeader: resolve => require(['./components/header.vue'], resolve),
    vFooter: resolve => require(['./components/footer.vue'], resolve)
  }
}
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/common";
@import "assets/css/color";
@import "assets/css/style";
#app{
  background: #fcfafa;
  min-width: 1200px;
  overflow: auto;
}
.main-container{
  min-height: calc(100vh - 69px);
  padding: 88px 0 20px 0;
}
</style>
