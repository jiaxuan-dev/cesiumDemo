<!--
 * @Descripttion: 功能菜单
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-19 09:26:19
 * @LastEditors: hxl
 * @LastEditTime: 2020-08-12 14:12:41
 -->
<template>
  <div class="main-analysis">
    <div v-show="mainToolbarshow" ref="toolbar" class="main-toolbar">
      <!--  <el-button-group class="btn-group">-->
      <div class="btn" v-for="menu in menus" :key="menu.title" @click="event(menu.event)">
        <img style="vertical-align: middle;width:16px" :src="menu.img" />
        {{ menu.title }}
      </div>
    </div>
    <fence-form ref="fenceForm"></fence-form>
    <digHole-form ref="digHoleForm"></digHole-form>
    <legend-form ref="legendForm"></legend-form>
    <tunnel-form ref="tunnelForm"></tunnel-form>
    <mesh-panel ref="meshPanel"></mesh-panel>
    <img v-show="tlShow" class="tl" width="100" src="../../assets/image/tl.png" />
  </div>
</template>

<script>
import fenceForm from './fenceForm'
import digHoleForm from './digHoleForm'
import legendForm from './legendForm'
import tunnelForm from './digTunnelForm'
import meshPanel from './../mesh-panel/meshPanel'
import '../../assets/style/components/mainToolbar.scss'
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
import { getTownInfo, calulationLineLength, calulationLineRectCenter } from '../../js/common/common.js'
import { defaultCamera, loadDrillData, loadSectionData, treeStateInfos, modelExplode, resetModelExplode, layerStrip, treeGlobalVariable } from '../../js/common/layerTree'
export default {
  name: 'main-toolbar',
  props: ['mainToolbarshow'],
  components: { fenceForm, digHoleForm, legendForm, tunnelForm, meshPanel },
  data() {
    return {
      menus: [
        {
          active: false,
          show: true,
          title: '禁止地下模式',
          event: 'undergroundMode',
          img: require('../../assets/image/icon/photography.png')
        },
        {
          active: false,
          show: true,
          title: '正射',
          event: 'ortho',
          img: require('../../assets/image/icon/topview.png')
        },
        // {
        //   active: false,
        //   show: true,
        //   title: '查询',
        //   event: 'query',
        //   img: require('../../assets/image/icon/inquire.png')
        // // },
        {
          active: false,
          show: true,
          title: '钻井',
          event: 'drill',
          img: require('../../assets/image/icon/drilling.png')
        },
        {
          active: false,
          show: true,
          title: '剖面分析',
          event: 'section',
          img: require('../../assets/image/icon/section.png')
        },
        {
          active: false,
          show: true,
          title: '栅栏图',
          event: 'fence',
          img: require('../../assets/image/icon/fence.png')
        },
        // {
        //   active: false,
        //   show: true,
        //   title: '沿线开挖',
        //   event: 'lineSearch',
        //   img: require('../../assets/image/icon/linesearch.png')
        // },
        {
          active: false,
          show: true,
          title: '区域开挖',
          event: 'regionsearch',
          img: require('../../assets/image/icon/regionsearch.png')
        },
        {
          active: false,
          show: true,
          title: '真实开挖',
          event: 'realDighole',
          img: require('../../assets/image/icon/realDighole.png')
        },
        {
          active: false,
          show: true,
          title: '挖隧道',
          event: 'digTunnel',
          img: require('../../assets/image/icon/suidao.png')
        },
        {
          active: false,
          show: true,
          title: '模型爆炸',
          event: 'bigBang',
          img: require('../../assets/image/icon/BigBang.png')
        },
        {
          active: false,
          show: true,
          title: '地层剥离',
          event: 'layerStrip',
          img: require('../../assets/image/icon/wakeng.png')
        },
        {
          active: false,
          show: true,
          title: '动态网格',
          event: 'mesh',
          img: require('../../assets/image/icon/regionsearch.png')
        },
        {
          active: false,
          show: true,
          title: '图例开关',
          event: 'legend',
          img: require('../../assets/image/icon/legend.png')
        },
        {
          active: false,
          show: true,
          title: '清除',
          event: 'clearAll',
          img: require('../../assets/image/icon/reset.png')
        }
      ],
      sectionResults: [],
      drillResults: [],
      tlShow: false,
      num: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.undergroundMode()
    })
  },
  computed: {
    queryShow: {
      get: function() {
        return this.$store.state.query.queryShow
      },
      set: function(value) {
        this.$store.commit('query/setQueryShow', value)
      }
    },
    showResult: {
      get: function() {
        return this.$store.state.query.showResult
      },
      set: function(value) {
        this.$store.commit('query/setShowResult', value)
      }
    },
    singleLayer: {
      get: function() {
        return this.$store.state.query.singleLayer
      },
      set: function(value) {
        this.$store.commit('query/setSingleLayer', value)
      }
    }
  },
  methods: {
    closeTl(data) {
      this.tlShow = data
    },
    event(event) {
      this[event]()
    },
    undergroundMode() {
      this.menus[0].active = !this.menus[0].active
      if (this.menus[0].active) {
        this.menus[0].title = '禁止地下模式'
        Viewer.scene.screenSpaceCameraController.enableCollisionDetection = false
      } else {
        this.menus[0].title = '开启地下模式'
        Viewer.scene.screenSpaceCameraController.enableCollisionDetection = true
      }
    },
    // 正射
    ortho() {
      Viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(104.340817845, 31.1410973406, 100000),
        orientation: {
          heading: Cesium.Math.toRadians(defaultCamera.heading),
          pitch: Cesium.Math.toRadians(defaultCamera.pitch),
          roll: Cesium.Math.toRadians(defaultCamera.roll)
        }
      })
    },
    // 钻孔
    drill() {
      if (window.draw === undefined) {
        // 实例化一次
        window.draw = new DrawGraph(window.Viewer)
      }
      window.draw.drawMark(data => {
        const position = Viewer.entities.getById(data.id).position.getValue(new Cesium.JulianDate())
        var ellipsoid = Viewer.scene.globe.ellipsoid
        const cartographic = ellipsoid.cartesianToCartographic(position)
        const para = {
          x: Cesium.Math.toDegrees(cartographic.longitude),
          y: Cesium.Math.toDegrees(cartographic.latitude),
          // z: 50, // cartographic.height
          depth: 10000
        }
        const tableData = []
        const turfPoints = [[para.x, para.y]]
        tableData.push({
          id: 1,
          x: para.x.toFixed(2),
          y: para.y.toFixed(2)
        })
        const region = getTownInfo(turfPoints).join(',')
        loadDrillData(para).then(
          drill => {
            this.drillResults.push({
              // label: `剖面${this.sectionIndex}`,
              // value: this.sectionIndex,
              uuid: drill._uuid,
              name: drill._layerName,
              depth: drill.depth,
              region: region,
              textureMode: drill.textureMode,
              zStretch: drill.zStretch,
              zOffset: drill.zOffset,
              tableData: tableData,
              type: 1
            })
            this.showResult = this.drillResults[this.drillResults.length - 1]
            this.queryShow = true
            if (!this.drills) this.drills = []
            this.drills.push(drill)
            Viewer.entities.remove(Viewer.entities.getById(data.id))
            // 移除地质体
            treeGlobalVariable.treeRef.removeUndergroundModel()
            Viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(para.x, para.y, (Number(drill.depth) / 2) * -1), Number(drill.depth) / 3), {
              offset: new Cesium.HeadingPitchRange(0, 0, 0)
            })
          },
          err => {
            this.$message.error('钻孔请求数据错误:' + err)
            Viewer.entities.remove(Viewer.entities.getById(data.id))
          }
        )
      })
    },
    // 剖面
    section() {
      // 绘制
      if (window.draw === undefined) {
        // 实例化一次
        window.draw = new DrawGraph(window.Viewer)
      }
      window.draw.drawPolyline(
        data => {
          const positions = Viewer.entities.getById(data.id).polyline.positions.getValue(new Cesium.JulianDate())
          var ellipsoid = Viewer.scene.globe.ellipsoid
          const cartographicArray = ellipsoid.cartesianArrayToCartographicArray(positions)
          const points = []
          const pointsgrid = []
          cartographicArray.forEach(c => {
            const lat = Cesium.Math.toDegrees(c.latitude)
            const lng = Cesium.Math.toDegrees(c.longitude)
            //   var alt = c.height
            points.push(lng, lat)
            pointsgrid.push({ x: lng, y: lat, z: c.height })
          })
          const para = {
            points: points
          }
          const sCenter = calulationLineRectCenter(points)
          this.makeSectionData(1, para).then(
            kjsec => {
              // 删除绘制线
              Viewer.entities.remove(Viewer.entities.getById(data.id))
              // 移除地质体
              treeGlobalVariable.treeRef.removeUndergroundModel()
              // 飞向剖面视角
              Viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(sCenter.x, sCenter.y, (Number(kjsec.depth) / 2) * -1), Number(kjsec.depth)), {
                offset: new Cesium.HeadingPitchRange(0, 0, 0)
              })
            },
            e => {
              Viewer.entities.remove(Viewer.entities.getById(data.id))
            }
          )
        },
        { clampToGround: false }
      )
    },
    // 栅栏
    fence() {
      this.$refs.fenceForm.setVisible(true)
    },
    lineSearch() {
      this.$refs.digHoleForm.title = '沿线探索参数设置'
      this.$refs.digHoleForm.isLineSearch = true
      this.$refs.digHoleForm.type = 1
      this.$refs.digHoleForm.setVisible(true)
    },
    regionsearch() {
      this.$refs.digHoleForm.title = '区域探索参数设置'
      this.$refs.digHoleForm.isLineSearch = false
      this.$refs.digHoleForm.type = 1
      this.$refs.digHoleForm.setVisible(true)
    },
    realDighole() {
      this.$refs.digHoleForm.title = '真实开挖'
      this.$refs.digHoleForm.type = 2
      this.$refs.digHoleForm.isLineSearch = false
      this.$refs.digHoleForm.setVisible(true)
    },
    digTunnel() {
      this.$refs.tunnelForm.setVisible(true)
    },
    mesh() {
      this.$refs.meshPanel.setVisible(true)
    },
    bigBang() {
      // let idArray = [1, 2, 3, 4, 5, 6, 7, 8]
      this.num = 0
      for (let i in Viewer.scene.primitives._primitives) {
        if (Viewer.scene.primitives._primitives[i].attr !== undefined) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, -100 * this.num))
          Cesium.Matrix4.multiply(Viewer.scene.primitives._primitives[i].modelMatrix, translation, Viewer.scene.primitives._primitives[i].modelMatrix)
          this.num = this.num + 1
        }
      }
      // const model = treeStateInfos.find(m => m.show)
      // if (!model) {
      //   this.$message({
      //     message: '请先选择模型！',
      //     type: 'info',
      //     offset: 200,
      //     center: true
      //   })
      //   return
      // }
      // modelExplode(model)
    },
    layerStrip() {
      const idArray = [1, 2, 3, 4, 5, 6, 7, 8]
      for (const i in Viewer.scene.primitives._primitives) {
        for (const j in idArray) {
          if (Viewer.scene.primitives._primitives[i].attr !== undefined && Viewer.scene.primitives._primitives[i].id === idArray[j] && Viewer.scene.primitives._primitives[i].show !== false) {
            Viewer.scene.primitives._primitives[i].show = false
            return
          }
        }
      }
      // layerStrip(model)
    },
    legend() {
      if (this.tlShow) {
        this.tlShow = false
      } else {
        this.tlShow = true
      }

      // const i = this.menus.findIndex(m => m.title === '图例开关')
      // if (this.menus[i].active) {
      //   this.$refs.legendForm.setVisible(false)
      //   this.menus[i].active = !this.menus[i].active
      //   return
      // }
      // {
      //   const model = treeStateInfos.find(m => m.show)
      //   if (!model) {
      //     this.$message({
      //       message: '请先选择模型！',
      //       type: 'info',
      //       offset: 200,
      //       center: true
      //     })
      //     return
      //   }
      //   this.$refs.legendForm.setVisible(true)
      //   this.menus[i].active = !this.menus[i].active
      // }
    },
    makeSectionData(type, para) {
      return new Promise((resolve, reject) => {
        loadSectionData(type, para).then(
          section => {
            const points = para.points
            const tableData = []
            const turfPoints = []
            for (let index = 0; index < points.length; index += 2) {
              tableData.push({
                id: index / 2 + 1,
                x: points[index].toFixed(4),
                y: points[index + 1].toFixed(4)
              })
              turfPoints.push([points[index], points[index + 1]])
            }

            const length = calulationLineLength(points)
            this.sectionResults.push({
              uuid: section._uuid,
              name: section._layerName,
              depth: section.depth.toFixed(2),
              length: length.toFixed(2),
              region: getTownInfo(turfPoints).join(','),
              textureMode: section.textureMode,
              zStretch: section.zStretch,
              zOffset: section.zOffset,
              tableData: tableData,
              type: 2
            })
            this.showResult = this.sectionResults[this.sectionResults.length - 1]
            this.queryShow = true
            if (!this.sections) this.sections = []
            this.sections.push(section)
            resolve(section)
          },
          err => {
            reject(err)
          }
        )
      })
    },
    resetDrillInfo() {
      this.drillResults = []
      if (this.drills) {
        this.drills.map(m => {
          m.destroy()
        })
        this.drills = []
      }
    },
    resetSectionInfo() {
      this.sectionResults = []
      if (this.sections) {
        this.sections.map(m => {
          m.destroy()
        })
        this.sections = []
      }

      this.sectionIndex = 0
    },
    clearAll() {
      this.num = 0
      for (const i in Viewer.scene.primitives._primitives) {
        if (Viewer.scene.primitives._primitives[i].attr !== undefined) {
          Viewer.scene.primitives._primitives[i].modelMatrix = JSON.parse(Viewer.scene.primitives._primitives[i].attr.pmodelMatrix)
          Viewer.scene.primitives._primitives[i].show = true
        }
      }
      this.resetSectionInfo()
      this.resetDrillInfo()
      if (Viewer.scene.globe.clippingPlanes) Viewer.scene.globe.clippingPlanes.enabled = false
      // resetModelExplode()
      this.showResult = null
      this.singleLayer = null
      // 虚拟tin
      if (this.vTins) {
        this.vTins.map(m => {
          m.destroy()
        })
      }
    },
    parentHandle: function() {
      this.clearAll()
    }
  },
  destroyed() {
    if (this.handler) this.handler.destroy()
    this.clearAll()
  }
}
</script>
<style lang="scss" scoped>
.btn {
  cursor: pointer;
  padding: 3px 5px;
}
.btn:hover {
  background: rgba(18, 189, 208, 0.5);
}
.tl {
  position: fixed;
  bottom: 55px;
  right: 100px;
}
</style>
