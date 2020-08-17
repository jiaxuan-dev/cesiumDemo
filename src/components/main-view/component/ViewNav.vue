<template>
  <div>
    <div ref="viewPanel" class="viewPanel">
      <div class="panelContent">
        <!--<scene-panel ref="scenePanel"></scene-panel>-->
        <model-panel></model-panel>
        <!-- <div class="gnTitle">支撑服务成果</div>
        <ul>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
        </ul>
        <div class="gnTitle">支撑服务成果</div>
        <ul>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>地下空间</li>
          <li>
          </li>
        </ul>-->
      </div>
    </div>

    <!-- <div ref="switchBtn" class="switchBtn"> -->
    <span @click="move" class="sub_Menu">
      <b>三维视图</b>
    </span>
    <!--<span class="main_Menu"><b>二维视图</b></span>-->
  </div>
  <!-- </div> -->
</template>
<script>
import modelPanel from './../../model-panel/modelPanel'
export default {
  name: 'viewNav',
  components: {
    modelPanel
  },
  data() {
    return {
      viewPanelFlag: false
    }
  },
  methods: {
    move(e) {
      let that = this
      if (!this.viewPanelFlag) {
        this.$refs.viewPanel.style.left = '15px'
        // this.$refs.panel.style.height = '375px'
        // this.$refs.switchBtn.style.height = '220px'
        this.viewPanelFlag = true
      } else {
        this.$refs.viewPanel.style.left = '-500px'
        // setTimeout(function() {
        //   that.$refs.panel.style.height = 0
        //   that.$refs.switchBtn.style.height = 0
        // }, 1001)
        this.viewPanelFlag = false
      }
    }
  }
}
</script>
<style>
/** ::-webkit-scrollbar {
  width: 5px;
  height: 0;
}
::-webkit-scrollbar-track {
  background: rgba(72, 206, 206, 0.3);
}
::-webkit-scrollbar-thumb {
  background-color: rgba(49, 117, 108, 1);
}*/
.el-tree-node:focus > .el-tree-node__content {
  background: rgba(72, 206, 206, 0) !important;
}
/* .panel {
  width: 300px;
  height: 0;
  position: absolute;
  z-index: 99;
  bottom: 50px;
  left: 0;
} */
.viewPanel {
  width: 288px;
  height: 528px;
  background: url('../images/资源 91.png');
  position: absolute;
  z-index: 100;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  padding: 3px;
  transition: 1s;
  left: -500px;
  bottom: 64px;
  overflow: hidden;
}
.switchBtn {
  display: inline-block;
  position: fixed;
  left: 0px;
  bottom: 0px;
  width: 200px;
  height: 200px;
  z-index: 999;
}
.main_Menu {
  background: url('../images/资源 77updatedUI.png') bottom right no-repeat;
  width: 54px;
  height: 154px;
  display: inline-block;
  position: absolute;
  right: -8px;
  bottom: -2px;
  background-size: 54px 154px;
  cursor: pointer;
}
.sub_Menu {
  background: url('../images/资源 77updatedUI.png') no-repeat;
  display: inline-block;
  position: absolute;
  left: -4px;
  bottom: 55px;
  background-size: 100% 100%;
  cursor: pointer;
  z-index: 999;
}
.sub_Menu b {
  color: white;
  font-size: 16px;
  writing-mode: vertical-lr;
  position: absolute;
}
.main_Menu b {
  color: white;
  font-size: 18px;
  writing-mode: vertical-lr;
  position: absolute;
  top: 55px;
  right: 15px;
}
.gnTitle {
  width: 100%;
  background-color: #2a6aab;
  margin: 0 auto;
  color: white;
  height: 20px;
}
.panelContent {
  width: calc(100% - 57px);
  height: calc(100% - 42px);
  padding: 0px 21px 0px 30px;
  font-family: 'FZSongYi-Z13S';
  text-align: center;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 25px;
}
.panelContent ul {
  padding: 0px;
  margin: 0px;
}
.panelContent ul li {
  display: inline-block;
  list-style: none;
  width: 40px;
  height: 60px;
  background-color: #00b4eb;
  margin: 5px;
  clip-path: polygon(15px 0, 100% 0, 100% 100%, 0 100%, 0 15px);
  color: white;
  line-height: 30px;
}
</style>
