<template>
  <div id="bookcaselist">
    <div id="mytitle"  :v-html="title"></div>
    <div id="content">
      <p @click="changeTheme('theme4')"></p>
      <p @click="changeTheme('theme2')"></p>
      <p @click="changeTheme('theme3')"></p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'themeChange',
  data () {
    return {
      title: '我的'
    }
  },
  methods: {
    changeTheme (theme) {
      window.document.documentElement.setAttribute('data-theme', theme)
    }
  },
  components: {
  }
}
</script>
<style scoped="" lang="scss">
  p{
    @include px2rem(width,100px);
    @include px2rem(height,100px);
    @include px2rem(margin,20px);
    float:left;
  }
  #bookcaselist{
      position:absolute;
      top: 200px;
      z-index: 100;
      width: 100%;
      height: 50px;
  }
   #mytitle {
          width: 100%;
          height:50px;
          // @include bg_color($background-images-theme)
     }
  p:first-child{
    background-color:red;
  }
  p:nth-child(2){
    background-color:#652BF5;
  }
  p:last-child{
    background-color:deepskyblue;
  }
</style>
