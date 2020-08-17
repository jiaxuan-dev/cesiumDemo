<template>
  <div>
    <div class="list" v-show="specialSubjectShow">
      <div @click="lookSpecialSubject('dmygyy')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>地貌遥感解译影像
      </div>
      <div @click="lookSpecialSubject('ygpdt')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>地下空间遥感评定
      </div>
      <div @click="lookSpecialSubject('zylysyt')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>地下空间资源利用适宜性
      </div>
      <div @click="lookSpecialSubject('sypjt')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>孔隙潜水水源地评价
      </div>
      <div @click="lookSpecialSubject('trbyxl')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>土壤B有效量分级
      </div>
      <div @click="lookSpecialSubject('pdysdqhx')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>土壤Pb地球化学图
      </div>
      <div @click="lookSpecialSubject('hgysdqhx')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>土壤Hg地球化学图
      </div>
      <div @click="lookSpecialSubject('yrtxwdxfq')" class="specialStyle">
        <span class="el-icon-picture-outline-round"></span>岩溶塌陷稳定性分区
      </div>
    </div>
    <dialogPage
      :width="200"
      :left="dialogLeft"
      :top="dialogTop"
      height="150"
      :dialogShow="dialogShow"
      @close="closePanel"
      :markShow="dialogPosition"
    >
      <div class="msgList">
        <div v-bind:key="index" v-for="(li,index) in tableData" class="contentDiv">
          <div class="liStyle nameStyle">{{li.name}}：</div>
          <div class="liStyle valueStyle" :title="li.value">{{li.value}}</div>
        </div>
      </div>
    </dialogPage>
  </div>
</template>
<style scoped>
.msgList {
  width: 100%;
  height: calc(100% - 30px);
  padding-top: 30px;
  color: white;
}
.contentDiv {
  clear: both;
}
.liStyle {
  height: 30px;
  float: left;
  font-size: 14px;
  line-height: 30px;
}
.valueStyle {
  width: calc(100% - 105px);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0 5px;
  text-align: left;
}
.nameStyle {
  width: 75px;
  margin: 0 5px 0 15px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: left;
}
.specialStyle {
  padding: 5px;
  cursor: pointer;
  font-size: 14px;
}
.specialStyle span {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 5px;
}
.specialStyle:hover {
  background: rgba(18, 189, 208, 0.5);
}
</style>
<script>
export default {
  name: 'specialSubject',
  props: ['specialSubjectShow'],
  data() {
    return {
      dialogShow: false,
      dialogLeft: 0,
      dialogTop: 0,
      tableData: [],
      dataSourceCache: [],
      dialogPosition: false,
      loading: null,
      seachPoint: null
    }
  },
  methods: {
    lookSpecialSubject: function (name) {
      this.closePanel(false)
      var exist = false
      for (var i = 0; i < this.dataSourceCache.length; i++) {
        if (this.dataSourceCache[i].name === name) {
          if (window.Viewer.dataSources.length > 0) {
            const dataSource = window.Viewer.dataSources.get(0)
            if (dataSource.name !== name) {
              this.addLoading()
              // 由于电脑问题，加载缓存的dataSource慢，加2s的加载页面
              this.closeLoading()
              this.removeOtherViewer(name)
              window.Viewer.dataSources.add(this.dataSourceCache[i])
            } else {
              window.Viewer.dataSources.remove(dataSource)
            }
          } else {
            this.addLoading()
            // 由于电脑问题，加载缓存的dataSource慢，加2s的加载页面
            this.closeLoading()
            this.removeOtherViewer(name)
            window.Viewer.dataSources.add(this.dataSourceCache[i])
          }
          exist = true
        }
      }
      if (exist === false) {
        this.addLoading()
        this.removeOtherViewer(name)
        this.addToMap(name)
      }
    },
    addLoading: function () {
      this.loading = this.$loading({
        lock: true,
        text: '专题加载中......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    closeLoading: function () {
      const _this = this
      setTimeout(() => {
        _this.loading.close()
      }, 2000)
    },
    addToMap: function (url) {
      var _this = this
      var attributeHash = {}
      Cesium.Math.setRandomNumberSeed(0) // 设置随机数种子
      var promise = Cesium.GeoJsonDataSource.load('geoJson/' + url + '.json') // geojson面数据
      promise.then(function (dataSource) {
        window.Viewer.dataSources.add(dataSource)
        _this.dataSourceCache.push(dataSource)
        dataSource.name = url
        var entities = dataSource.entities.values
        for (var i = 0; i < entities.length; i++) {
          var entity = entities[i]
          attributeHash[entity._id] = entity
          var value = entity.properties.Color._value // geojson里面必须得有一个name属性，entity.name对应
          const value1 = value.split(',')
          var color = new Cesium.Color(value1[0] / 255, value1[1] / 255, value1[2] / 255, 0.8)
          entity.polygon.material = color
          entity.polygon.outline = true
          entity.polygon.outlineColor = new Cesium.Color(127 / 255, 127 / 255, 127 / 255, 1)
          if (entity.properties.Pb !== undefined) {
            entity.polygon.extrudedHeight = entity.properties.Pb._value * 100 // Math.floor(Math.random() * 10000 + 20000) // 20000~60000的随机数，单位是米
          }
          if (entity.properties.Hg !== undefined) {
            entity.polygon.extrudedHeight = entity.properties.Hg._value * 100 // Math.floor(Math.random() * 10000 + 20000) // 20000~60000的随机数，单位是米
          }
          entity.polygon.height = 1000
          // window.Viewer.zoomTo(promise)
        }
        window.Viewer.flyTo(promise)
        _this.loading.close()
      })
      var handler = new Cesium.ScreenSpaceEventHandler(window.Viewer.scene.canvas)
      handler.setInputAction(function (movement) {
        var pick = window.Viewer.scene.pick(movement.position)
        if (pick) {
          for (var key in attributeHash) {
            if (Cesium.defined(pick) && pick.id.id === key) {
              _this.tableData = []
              var nameArr = []
              for (var i = 0; i < attributeHash[key].properties.propertyNames.length; i++) {
                if (
                  attributeHash[key].properties.propertyNames[i] !== 'clr' &&
                  attributeHash[key].properties.propertyNames[i] !== 'Color' &&
                  attributeHash[key].properties.propertyNames[i] !== 'fmode'
                ) {
                  nameArr.push(attributeHash[key].properties.propertyNames[i])
                  if (nameArr.length >= 3) {
                    break
                  }
                }
              }
              for (var j = 0; j < nameArr.length; j++) {
                var obj = {}
                obj.name = nameArr[j]
                obj.value = attributeHash[key].properties[nameArr[j]]._value
                _this.tableData.push(obj)
              }

              var cartesinPoint = new Cesium.Cartesian2(movement.position.x, movement.position.y)
              _this.seachPoint = window.Viewer.scene.globe.pick(window.Viewer.camera.getPickRay(cartesinPoint), window.Viewer.scene)
              // 每一帧渲染结束后，对位置进行更新
              window.Viewer.scene.postRender.addEventListener(function () {
                var point = Cesium.SceneTransforms.wgs84ToWindowCoordinates(window.Viewer.scene, _this.seachPoint)
                if (point) {
                  _this.dialogLeft = parseInt(point.x) - 100
                  _this.dialogTop = parseInt(point.y) - 150
                  _this.queryDialogPosition(_this.dialogTop, _this.dialogLeft)
                }
              })
              _this.dialogShow = true
              _this.dialogLeft = movement.position.x - 100
              _this.dialogTop = movement.position.y - 150
            }
          }
        } else {
          _this.dialogShow = false
        }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    // 弹框位置计算
    queryDialogPosition(top, left) {
      this.dialogPosition = 'bottom'
      let bodyWidth = document.body.clientWidth - 200
      if (top < 80) {
        // 80为主标题高度
        this.dialogPosition = 'top'
        this.dialogTop = top + 145
      } else if (left < 100) {
        //100的一半的弹出框
        this.dialogPosition = 'left'
        this.dialogTop = top + 72.5
        this.dialogLeft = left + 100
      } else if (left > bodyWidth) {
        this.dialogPosition = 'right'
        this.dialogTop = top + 73
        this.dialogLeft = left - 110
      }
    },
    removeOtherViewer: function (name) {
      for (var i = 0; i < window.Viewer.dataSources.length; i++) {
        var dataSource = window.Viewer.dataSources.get(i)
        if (dataSource.name !== name) {
          window.Viewer.dataSources.remove(dataSource)
        }
      }
    },
    closePanel: function (value) {
      this.tableData = []
      this.dialogShow = value
    },
    parentHandle: function () {
      this.dialogShow = false
      this.tableData = []
      for (var i = 0; i < window.Viewer.dataSources.length; i++) {
        var dataSource = window.Viewer.dataSources.get(i)
        window.Viewer.dataSources.remove(dataSource)
      }
    }
  }
}
</script>
