<template>
  <div>
    <!--主标题组件引用-->
    <main-menu />
    <control-panel />
    <information-panel />
  </div>
</template>
<script>
import mainMenu from './component/MainMenu.vue'
import controlPanel from './component/ControlPanel.vue'
import informationPanel from './component/InformationPanel.vue'
export default {
  name: 'mainView',
  components: {
    mainMenu,
    controlPanel,
    informationPanel
  }
}
</script>
