<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
  font-size: 14px;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffffff;
  width: 100%;
  height: 100%;
}
/*chrome--------------------------------------------start*/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
/* Track */
::-webkit-scrollbar-track {
  background: rgba(72, 206, 206, 0);
  // border-radius: 8px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  background-color: rgba(2, 7, 22, 1);
  // border-radius: 8px;
}
/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgb(162, 162, 163);
}
.el-menu::-webkit-scrollbar,
.el-table__body-wrapper::-webkit-scrollbar {
  display: none;
}
.el-menu:hover::-webkit-scrollbar,
.el-table__body-wrapper:hover::-webkit-scrollbar {
  display: block;
}
/*chrome--------------------------------------------end*/
/*IE--------------------------------------------start*/
* {
  /*三角箭头的颜色*/
  scrollbar-arrow-color: rgba(9, 73, 134, 0.3);
  /*滚动条滑块按钮的颜色*/
  scrollbar-face-color: rgba(2, 7, 22, 1);
  /*滚动条整体颜色*/
  scrollbar-highlight-color: rgba(9, 73, 134, 0.3);
  /*滚动条阴影*/
  scrollbar-shadow-color: rgba(9, 73, 134, 0.3);
  /*滚动条轨道颜色*/
  scrollbar-track-color: rgba(9, 73, 134, 0.3);
  /*滚动条3d亮色阴影边框的外观颜色——左边和上边的阴影色*/
  scrollbar-3dlight-color: rgba(9, 73, 134, 0.3);
  /*滚动条3d暗色阴影边框的外观颜色——右边和下边的阴影色*/
  scrollbar-darkshadow-color: rgba(9, 73, 134, 0.3);
  /*滚动条基准颜色*/
  scrollbar-base-color: rgba(9, 73, 134, 0.3);
}
.el-table__body-wrapper,
.el-menu {
  /*IE下隐藏*/
  -ms-overflow-style: none;
}

.el-table__body-wrapper:hover,
.el-menu:hover {
  /*IE下显示*/
  -ms-overflow-style: auto;
}
/*IE--------------------------------------------end*/
.el-select-dropdown {
  background-color: #1477e9be !important;

  min-width: 195px !important;
}
.el-select-dropdown__item {
  color: white !important;
}
.el-select-dropdown__item.selected {
  color: rgb(11, 3, 49) !important;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: #f5f7fa !important;
  color: rgb(0, 0, 0) !important;
}
</style>
