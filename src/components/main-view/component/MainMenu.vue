<template>
  <div class="mainMenu">
    <div class="projectImg">
      <img src="../images/资源 86updatedUI.png" width="80px" />
      <img class="logo" src="../images/logo.png" />
    </div>
    <div class="userManage">
      <img src="../images/资源 83updatedUI.png" />
    </div>
    <div class="itemNav">
      <div class="repeatTitle">
        <div class="leftNav">
          <span class="projectName">透明城市大数据信息服务平台</span>
        </div>
        <div class="rightNav">
          <div class="buttonList" ref="buttonList">
            <span @mouseover="special" class="itemTitle">专题</span>
            <span @mouseover="plotting" class="itemTitle">标绘</span>
            <!-- <span @mouseover="query" class="itemTitle">查询</span> -->
            <span @mouseover="flyroaming" class="itemTitle">漫游</span>
            <span @mouseover="Statistics" class="itemTitle">统计</span>
            <span @mouseover="mainToolbar" class="itemTitle">分析</span>
          </div>
        </div>
      </div>
      <div class="centerNav">
        <!--<span class="titleCenter">显示</span>
        <img src="../images/earth.gif" />-->
        <div class="homeBtn">
          <img
            :src="queryState?require('../images/search.png'):require('../images/unsearch.png')"
            class="searchBtn"
            title="查询"
            @click="query"
          />
          <img src="../images/home.png" class="homeButton" title="主页" @click="homeBtn" />
          <img src="../images/clear.png" class="clearBtn" title="清除" @click="clearMap" />
        </div>
      </div>
      <div ref="dropDown" class="dropDown" @mouseleave="mouseLeave">
        <!-- <img @click="exit" class="exit" src="../images/资源 112.png" alt />
        <div ref="dropTitle" class="dropTitle"></div>-->
        <div class="dropContent" ref="dropContent">
          <!--列表部分开始-->
          <draw-panel :drawShow="drawShow" ref="drawPanel"></draw-panel>
          <fly-roaming :flyShow="flyShow" ref="flyRoaming"></fly-roaming>
          <main-toolbar ref="mainToolbar" :mainToolbarshow="mainToolbarshow"></main-toolbar>
          <special-subject :specialSubjectShow="specialSubjectShow" ref="specialSubject"></special-subject>
          <statistics-charts :staisticsChartsShow="staisticsChartsShow" ref="statisticsCharts" />
          <!--列表部分结束-->
        </div>
      </div>
      <dialogPage
        :width="200"
        :left="dialogLeft"
        :top="dialogTop"
        :height="dialogHeight"
        :dialogShow="dialogShow"
        @close="closePanel"
        :markShow="dialogPosition"
      >
        <div>
          <div class="cotant">
            <!-- <div>地层编号：{{ pro }}</div>
            <div>岩性：{{ des }}</div>-->
            <div v-if="showResult" class="result-box">
              <table class="table-custom">
                <tbody>
                  <tr>
                    <th colspan="3">基本信息</th>
                  </tr>
                  <tr>
                    <td>地层</td>
                    <td colspan="2">{{ showResult.name }}</td>
                  </tr>
                  <tr v-if="showResult.length">
                    <td>长度(m)</td>
                    <td colspan="2">{{ showResult.length }}</td>
                  </tr>
                  <tr v-show="showResult.depth">
                    <td>深度(m)</td>
                    <td colspan="2">{{ showResult.depth }}</td>
                  </tr>
                  <tr>
                    <th colspan="3">地理位置</th>
                  </tr>
                  <tr>
                    <td colspan="1">行政区</td>
                    <td colspan="2">{{ showResult.region }}</td>
                  </tr>
                </tbody>
              </table>
              <table class="table-custom">
                <tbody>
                  <tr>
                    <th colspan="3">坐标信息</th>
                  </tr>
                  <tr v-for="item in showResult.tableData" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.x }}</td>
                    <td>{{ item.y }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="singleLayer" class="result-box">
              <table class="table-custom">
                <tbody>
                  <tr v-for="item in singleLayer" :key="item.name">
                    <td>{{ item.name }}</td>
                    <td colspan="2">{{ item.value }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </dialogPage>
    </div>
  </div>
</template>
<script>
export default {
  name: 'mainMenu',
  data() {
    return {
      drawShow: false,
      flyShow: false,
      mainToolbarshow: false,
      specialSubjectShow: false,
      staisticsChartsShow: false,
      dialogShow: false,
      dialogHeight: 150,
      dialogPosition: false, // 三角的位置
      seachPoint: null, // query查询点
      dialogLeft: 0,
      dialogTop: 0,
      pro: '',
      des: '',
      queryState: false
    }
  },
  computed: {
    queryShow: {
      get: function () {
        return this.$store.state.query.queryShow
      },
      set: function (value) {
        this.$store.commit('query/setQueryShow', value)
      }
    },
    showResult: {
      get: function () {
        return this.$store.state.query.showResult
      },
      set: function (value) {
        this.$store.commit('query/setShowResult', value)
      }
    },
    singleLayer: {
      get: function () {
        return this.$store.state.query.singleLayer
      },
      set: function (value) {
        this.$store.commit('query/setSingleLayer', value)
      }
    }
  },
  watch: {
    queryShow(val) {
      if (val) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  methods: {
    homeBtn() {
      Viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(104.340817845, 31.1410973406, 100000),
        orientation: {
          heading: Cesium.Math.toRadians(360),
          pitch: Cesium.Math.toRadians(-90),
          roll: Cesium.Math.toRadians(0)
        }
      })
    },
    clearMap() {
      this.$refs.statisticsCharts.parentHandle()
      this.$refs.specialSubject.parentHandle()
      this.$refs.drawPanel.parentHandle()
      this.$refs.flyRoaming.parentHandle()
      this.$refs.mainToolbar.parentHandle()
      this.dialogShow = false
    },
    exit() {
      this.$refs.dropConent.style.display = 'none'
      this.$refs.dropDown.style.height = '0px'
      for (const i in Viewer.scene.primitives._primitives) {
        if (Viewer.scene.primitives._primitives[i].attr !== undefined) {
          Viewer.scene.primitives._primitives[i].color = new Cesium.Color(1, 1, 1, 1)
        }
      }
    },
    move(text, e) {
      this.$refs.dropDown.style.height = '0px'
      // this.$refs.dropDown.style.left = e.x - this.$refs.dropDown.clientWidth / 2 + 'px'
      const that = this
      this.$refs.dropDown.style.top = '52px'
      var positionMenu = (document.body.clientWidth - 170) / 2 + 85 + 75 + 30
      var menuWidth = that.$refs.buttonList.clientWidth * 0.2
      that.$refs.buttonList.children.forEach((element) => {
        element.style.color = 'white'
      })
      setTimeout(function () {
        var height = 0
        var width = 0
        that.init()
        if (text !== '查询' && that.handler !== undefined) {
          that.handler.destroy()
        }
        that.$refs.dropDown.style.width = 'auto'
        if (text === '标绘') {
          that.drawShow = true
          width = positionMenu + menuWidth + menuWidth / 2 - 65 + 'px'
          that.$refs.buttonList.children[1].style.color = '#02182e'
          height = '250px'
        } else if (text === '漫游') {
          width = positionMenu + menuWidth * 2 + menuWidth / 2 - 65 + 'px'
          that.$refs.buttonList.children[2].style.color = '#02182e'
          that.flyShow = true
          height = '195px'
        } else if (text === '分析') {
          that.mainToolbarshow = true
          width = positionMenu + menuWidth * 4 + menuWidth / 2 - 65 + 'px'
          that.$refs.buttonList.children[4].style.color = '#02182e'
          height = '384px'
        } else if (text === '专题') {
          that.specialSubjectShow = true
          width = positionMenu + menuWidth / 2 - 92 + 'px'
          that.$refs.buttonList.children[0].style.color = '#02182e'
          height = '301px'
        } else if (text === '统计') {
          that.staisticsChartsShow = true
          width = positionMenu + menuWidth * 3 + menuWidth / 2 - 65 + 'px'
          that.$refs.buttonList.children[3].style.color = '#02182e'
          that.$refs.dropDown.style.width = '135px'
          height = '180px'
        }
        that.$refs.dropDown.style.height = height
        that.$refs.dropDown.style.left = width
      }, 0)
    },
    init() {
      this.queryShow = false
      Object.assign(this.$data, this.$options.data())
    },
    plotting(e) {
      this.move('标绘', e)
    },
    flyroaming(e) {
      this.move('漫游', e)
    },
    mainToolbar(e) {
      this.move('分析', e)
    },
    query(e) {
      // if (!this.queryActive) // this.move('查询', e)
      this.queryState = !this.queryState
      const that = this
      this.queryActive = !this.queryActive
      if (!this.queryState) {
        this.dialogShow = false
      }
      if (this.queryActive) {
        if (this.handler) this.handler.destroy()
        this.handler = new Cesium.ScreenSpaceEventHandler(Viewer.canvas)

        this.handler.setInputAction(function (movement) {
          const feature = Viewer.scene.pick(movement.position)
          if (!Cesium.defined(feature)) {
            return
          }
          if (that.selectFeature && that.selectFeature.primitive.setSelect) that.selectFeature.primitive.setSelect(false)
          else if (that.selectFeature) {
            that.selectFeature.primitive.color = new Cesium.Color(1, 1, 1, 1)
          }
          if (feature.primitive.setSelect) {
            feature.primitive.setSelect(true)
          } else {
            feature.primitive.color = new Cesium.Color(1, 0, 0, 1)
          }
          that.selectFeature = feature

          const queryObj = feature.id
          that.dialogShow = true
          // 记录弹框位置以及刷新
          var cartesinPoint = new Cesium.Cartesian2(movement.position.x, movement.position.y)
          that.seachPoint = window.Viewer.scene.globe.pick(window.Viewer.camera.getPickRay(cartesinPoint), window.Viewer.scene)
          that.dialogLeft = movement.position.x - 100
          that.dialogTop = movement.position.y - 150
          if (that.showResult) {
            that.dialogHeight = 326
            that.queryDialogPosition(parseInt(movement.position.y), parseInt(movement.position.x), that.dialogHeight)
          }
          // 每一帧渲染结束后，对位置进行更新
          window.Viewer.scene.postRender.addEventListener(function () {
            var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.Viewer.scene, that.seachPoint)
            if (point) {
              that.dialogLeft = parseInt(point.x)
              that.dialogTop = parseInt(point.y)

              that.queryDialogPosition(parseInt(point.y), parseInt(point.x), that.dialogHeight)
            }
          })
          switch (queryObj.type) {
            case 1: // 钻孔
              that.showResult = that.$refs.mainToolbar.drillResults.find((m) => m.uuid === queryObj.parentuuid)
              that.singleLayer = [
                { name: '层名', value: queryObj.name },
                { name: '长度(m)', value: queryObj.length.toFixed(2) }
              ]

              break
            case 2: // 剖面
              that.showResult = that.$refs.mainToolbar.sectionResults.find((m) => m.uuid === queryObj.parentuuid)
              that.singleLayer = [
                { name: '层名', value: queryObj.name },
                { name: '深度(m)', value: queryObj.depth.toFixed(2) }
              ]
              break
            default:
              that.singleLayer = [
                { name: '层名', value: feature.primitive.attr.pro },
                { name: '描述', value: feature.primitive.attr.des }
              ]
              break
          }
          console.log('ID: ' + feature.id)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.handler.setInputAction(function (movement) {
          if (that.queryActive) {
            that.queryActive = false
            that.queryState = false
            that.dialogShow = false
            if (that.selectFeature && that.selectFeature.primitive.setSelect) that.selectFeature.primitive.setSelect(false)
            else if (that.selectFeature) {
              that.selectFeature.primitive.color = new Cesium.Color(1, 1, 1, 1)
            }
            that.singleLayer = null
            that.dialogShow = false
            that.handler.destroy()
          }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
      } else {
        if (that.selectFeature && that.selectFeature.primitive.setSelect) that.selectFeature.primitive.setSelect(false)
        else if (that.selectFeature) {
          that.selectFeature.primitive.color = new Cesium.Color(1, 1, 1, 1)
        }
        that.singleLayer = null
        this.handler.destroy()
      }
    },
    // 弹框位置计算
    queryDialogPosition(top, left, height) {
      this.dialogPosition = 'bottom'
      const bodyWidth = document.body.clientWidth - 200
      if (height === 150) {
        top = Number(top) - 150
        left = Number(left) - 100
        if (top < 80) {
          // 80为主标题高度
          this.dialogPosition = 'top'
          this.dialogTop = top + 145
        } else if (left < 100) {
          // 100的一半的弹出框
          this.dialogPosition = 'left'
          this.dialogTop = top + 72.5
          this.dialogLeft = left + 100
        } else if (left > bodyWidth) {
          this.dialogPosition = 'right'
          this.dialogTop = top + 73
          this.dialogLeft = left - 110
        } else {
          this.dialogTop = top
          this.dialogLeft = left
        }
      } else {
        top = Number(top) - 326
        left = Number(left) - 100
        if (top < 80) {
          // 80为主标题高度
          this.dialogPosition = 'top'
          this.dialogTop = top + 326
          this.dialogLeft = left
        } else if (left < 100) {
          // 100的一半的弹出框
          this.dialogPosition = 'left'
          this.dialogTop = top + 163
          this.dialogLeft = left + 100
        } else if (left > bodyWidth) {
          this.dialogPosition = 'right'
          this.dialogTop = top + 163
          this.dialogLeft = left - 110
        } else {
          this.dialogTop = top
          this.dialogLeft = left
          this.dialogPosition = 'bottom'
        }
      }
      console.log(this.dialogTop)
    },
    closePanel: function (value) {
      this.dialogShow = value
    },
    special(e) {
      this.move('专题', e)
    },
    Statistics(e) {
      this.move('统计', e)
    },
    mouseLeave() {
      this.$refs.dropDown.style.height = '0px'
      this.$refs.dropDown.style.top = '-1000px'
      this.$refs.buttonList.children.forEach((element) => {
        element.style.color = 'white'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.cotant {
  padding: 10px;
}
.tip {
  font-size: 12px;
  text-align: center;
}
.exit {
  position: absolute;
  width: 28px;
  top: 0px;
  right: 0px;
  margin: 20px 20px 0px 0px;
  cursor: pointer;
}
.logo {
  position: absolute;
  // top: 24px;
  top: 25px;
  left: 20px;
  width: 42px;
}
.dropTitle {
  font-family: 'FZSongYi-Z13S'; /*'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif*/
  text-align: center;
  margin: 10px auto 0;
  width: calc(100% - 40px);
  height: 44px;
  line-height: 44px;
  border-bottom: 2px solid #020716;
}
.dropDown {
  max-width: 306px;
  max-height: 531px;
  min-width: 114px; // 156px
  // min-height: 267px;
  background: url('../images/资源 73updatedUI.png');
  background-size: 100% 100%;
  position: absolute;
  top: 46px;
  font-size: 14px;
  // transition: 1s;
  height: 0px;
}
.dropContent {
  width: calc(100% - 20px);
  margin: 25px auto;
}
.projectImg {
  position: absolute;
  left: 2px;
  top: 2px;
  display: inline-block;
  z-index: 100;
  background: url('../images/资源 82updatedUI.png') left top no-repeat;
}
.projectImg img {
  cursor: pointer;
  margin-left: 12px;
  margin-top: 18px;
}
.userManage {
  position: absolute;
  right: 2px;
  top: 2px;
  display: inline-block;
  z-index: 100;
  background: url('../images/资源 81updatedUI.png') right top no-repeat;
}
.userManage img {
  cursor: pointer;
  margin: 18px 15px 0 0;
}
.itemNav {
  //@include bg_color($background-images-theme);
  margin: 0px auto;
  height: 75px;
  background-size: 100% 50px;
  width: calc(100% - 170px);
}
.mainMenu {
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 80px;
}
.buttonList {
  width: calc(100% - 75px);
  float: right;
  margin-right: 10px;
  margin-top: 5px;
}
.itemTitle {
  font-family: 'FZSongYi-Z13S'; /*'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif*/
  font-size: 13pt;
  color: white;
  display: inline-block;
  margin-top: 25px;
  font-weight: bold;
  text-align: center;
  width: 20%;
  text-shadow: 0 0 0.1em #51ffff, -0 -0 0.5em #51ffff;
  cursor: pointer;
}
.projectName {
  font-family: 'FZSongYi-Z13S'; /*'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif*/
  color: white;
  display: inline-block;
  margin-top: 24px;
  font-weight: bold;
  width: 100%;
  text-shadow: 0 0 0.1em #51ffff, -0 -0 0.5em #51ffff;
  letter-spacing: 0px;
  margin-left: 14%;
}

.titleCenter {
  font-family: 'FZSongYi-Z13S'; /*'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif*/
  font-size: 20pt;
  color: white;
  display: inline-block;
  margin-top: 21px;
  font-weight: bold;
  text-align: center;
  width: 33%;
  text-shadow: 0 0 0.1em #51ffff, -0 -0 0.5em #51ffff;
}
.repeatTitle {
  height: 100%;
}
.leftNav,
.rightNav {
  display: inline-block;
  height: 100%;
}
.leftNav {
  float: left;
  background: url('../images/资源 90.png') center no-repeat;
  background-size: 100% 125px;
  width: calc(50% - 30px);
}
.rightNav {
  float: right;
  background: url('../images/资源 80updatedUI.png') center no-repeat;
  background-size: 100% 125px;
  width: calc(50% - 30px);
}
.centerNav {
  width: 179px;
  display: inline-block;
  height: 100%;
  text-align: center;
  position: absolute;
  clear: both;
  background: url('../images/homebanner.png') center no-repeat;
  top: 6px;
  left: 50%;
  transform: translate(-50%);
}
.clearBtn {
  position: absolute;
  cursor: pointer;
  top: 28px;
  right: 18px;
}
.searchBtn {
  position: absolute;
  top: 28px;
  left: 14px;
  cursor: pointer;
}
.homeButton {
  cursor: pointer;
  padding-top: 9px;
}
.topTitle {
  position: absolute;
  top: 1%;
  text-align: center;
  left: 50%;
  transform: translate(-50%);
}
.result-box {
  display: inline-block;
  width: 100%;
  font-size: 0.9rem;
  max-height: 580px;
  margin-top: 25px;
}
.table-custom {
  border: 1px solid #ffffff !important;
  width: 100% !important;

  tbody {
    display: block;
    overflow: auto;
    max-height: 250px;
    width: 100%;
  }

  th {
    height: 15px !important;
    text-align: center;
    border: none !important;
    background-color: #e6e6e640 !important;
    color: #409eff;
  }

  tr {
    width: 100%;
    display: inline-table;
  }

  tr > td:nth-child(1) {
    font-weight: bold;
    width: 30%;
  }

  td {
    height: 20px !important;
    text-align: center;
    .el-slider {
      padding: 0px 20px;

      .el-slider__runway {
        margin: 0;
      }
    }
  }
}
</style>
