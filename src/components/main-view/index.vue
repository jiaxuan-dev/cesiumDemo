<template>
  <div>
    <!--主标题组件引用-->
    <main-menu />
    <!--<project-switch />-->
    <!--模型组件引用-->
    <view-nav />
    <slide-bar />
  </div>
</template>
<script>
import mainMenu from './component/MainMenu.vue'
import viewNav from './component/ViewNav.vue'
import dialogPage from './component/DialogPage.vue'
import slideBar from './component/SlideBar.vue'
export default {
  name: 'mainView',
  components: {
    mainMenu,
    viewNav,
    dialogPage,
    slideBar
  }
}
</script>
