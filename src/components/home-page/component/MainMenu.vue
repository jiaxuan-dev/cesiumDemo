<template>
  <div class="mainMenu">
    <div class="leftBorder"></div>
    <div class="MenuNav">
      <div class="titilePart">
        <div class="titleStyle">三维城市地质信息系统</div>
      </div>
      <div class="functionPart">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-function"
          mode="horizontal"
          @select="handleSelect"
          text-color="#01b4ed"
          active-text-color="#fff"
        >
          <el-menu-item index="1"><span class="el-icon-s-home" /></el-menu-item>
          <el-submenu index="2">
            <template slot="title"><span class="el-icon-picture" /></template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <el-menu-item index="3" ><span class="el-icon-edit" /></el-menu-item>
          <el-menu-item index="4">
              <span class="el-icon-search"></span>
          </el-menu-item>
          <el-menu-item index="5">
              <span class="el-icon-data-line"></span>
          </el-menu-item>
          <el-menu-item index="6">
              <span class="el-icon-s-data"></span>
          </el-menu-item>
          <el-menu-item index="7">
              <span class="el-icon-s-marketing"></span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="roundAxis">
        <img src="../images/资源 106.png" />
      </div>
      <div class="rightPart"></div>
    </div>
    <div class="rightBorder"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: '1'
    }
  }
}
</script>
<style lang="scss">
.mainMenu {
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 80px;
}
.leftBorder {
  background: url('../images/资源 109.png') top left no-repeat;
  width: 203px;
  height: 182px;
  position: absolute;
  left: 0px;
  top: 0px;
}
.rightBorder {
  background: url('../images/资源 104.png') top right no-repeat;
  width: 203px;
  height: 190px;
  position: absolute;
  right: 0px;
  top: 0px;
}
.titilePart {
  background: url('../images/资源 105.png') left bottom no-repeat;
  width: 541px;
  height: 96px;
  position: absolute;
  top: 7px;
  left: 30px;
}
.titilePart .titleStyle {
  color: white;
  font-family: 'FZSongYi-Z13S';
  font-size: 25px;
  display: inline;
  position: absolute;
  left: 163px;
  top: 21px;
  font-weight: bold;
}
.functionPart {
  background: url('../images/资源 108.png') left center no-repeat;
  background-size: 100% 100%;
  height: 131px;
  width: calc(100% - 985px);
  position: absolute;
  left: 562px;
  top: -22px;
}
.rightPart {
  background: url('../images/资源 100.png') right bottom no-repeat;
  width: 367px;
  height: 62px;
  position: absolute;
  top: 16px;
  right: 30px;
}
.roundAxis {
  position: absolute;
  top: 48px;
  right: 380px;
}
.el-menu-function{
    margin-top: 34px !important;
    background-color:transparent !important;
}
.el-menu.el-menu--horizontal{
    border:none !important;
}
.menuitem{
    background: transparent;
}
.el-menu-item{
 padding:0 15px !important;
}
.el-menu{
    background-color: transparent !important;
}
.el-menu-item:hover,.el-submenu:hover,.is-opened,.el-submenu__title:hover{
     background-color: transparent !important;
}
.is-active,.el-menu--horizontal .el-menu .el-menu-item{
  background:transparent !important;
}
</style>