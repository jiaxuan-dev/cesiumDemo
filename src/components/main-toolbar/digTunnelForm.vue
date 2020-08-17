<!--
 * @Descripttion: 隧道分析
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-07-21 10:49:24
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-24 15:09:01
-->
<template>
  <dialogPage :title="title" width="400" left="500" top="120" :dialogShow="visible" @close="setVisible">
    <div class="result-box">
      <el-form ref="form" label-width="90px" label-position="left">
        <el-form-item label="隧道宽度(m)">
          <el-input v-model="width" placeholder="请输入隧道宽度" type="number"></el-input>
        </el-form-item>
        <el-form-item label="隧道深度(m)">
          <el-input v-model="depth" placeholder="请输入隧道深度" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="justWall">是否保留隧道外部地质体</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="drawLine">绘制线</el-button>
          <el-button @click="digHole">开挖分析</el-button>
          <el-button v-if="!isRoaming" title="继续漫游" @click="pauseOrContinue(true)"><i class="el-icon-video-play"></i></el-button>
          <el-button v-if="isRoaming" title="暂停漫游" @click="pauseOrContinue(false)"><i class="el-icon-video-pause"></i></el-button>
        </el-form-item>
      </el-form>
    </div>
  </dialogPage>
</template>

<script>
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
import Roaming from '../../js/FlyingRoaming/Roaming.js'
import { closeAllLayer, loadSectionTunnel, digTin } from '../../js/common/layerTree'
export default {
  name: 'tunnel-form',
  data() {
    return {
      width: 500,
      depth: 500,
      title: '隧道分析',
      visible: false,
      isOut: '1',
      justWall: false,
      roamingAttr: {
        time: 20,
        Lines: []
      },
      isRoaming: true,
      roamBtn: '结束漫游'
    }
  },
  methods: {
    setVisible(bool) {
      this.visible = bool
    },
    drawLine() {
      this.isRoaming = false
      // 绘制
      if (window.draw === undefined) {
        // 实例化一次
        window.draw = new DrawGraph(window.Viewer)
      }
      if (this.polygonEntity) {
        Viewer.entities.remove(this.polygonEntity)
      }
      window.draw.drawPolyline(
        data => {
          const positions = Viewer.entities.getById(data.id).polyline.positions.getValue(new Cesium.JulianDate())

          const ellipsoid = Viewer.scene.globe.ellipsoid
          const cartographicArray = ellipsoid.cartesianArrayToCartographicArray(positions)
          this.points = []
          cartographicArray.forEach(c => {
            const lat = Cesium.Math.toDegrees(c.latitude)
            const lng = Cesium.Math.toDegrees(c.longitude)
            //   var alt = c.height
            this.points.push(lng, lat)
          })

          this.polygonEntity = Viewer.entities.getById(data.id)
        },
        { clampToGround: false }
      )
    },
    digHole() {
      if (!this.polygonEntity) {
        this.$message({
          message: '请先绘制分析范围！',
          type: 'info',
          offset: 200,
          center: true
        })
        return
      }
      !this.justWall ? this.digTunnelWall() : this.realDigHole()
    },
    digTunnelWall() {
      loadSectionTunnel({
        points: this.points,
        depth: this.depth * -1,
        width: this.width,
        isOut: this.isOut === '1'
      })
        .then(vSection => {
          if (!this.$parent.sections) this.$parent.sections = []
          this.$parent.sections.push(vSection)
          closeAllLayer()
          this.startRoam()
        })
        .catch(error => {
          this.$message.error('隧道开挖err:' + error)
        })
        .finally(r => {
          Viewer.entities.remove(this.polygonEntity)
          this.polygonEntity = null
        })
    },
    realDigHole() {
      const loading = this.$loading({
        lock: false,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
        text: '数据请求中...'
      })
      digTin({
        points: this.points,
        depth: this.depth * -1,
        width: this.width,
        isOut: this.isOut === '1',
        isTunnel: true
      })
        .then(vTins => {
          if (!this.$parent.vTins) this.$parent.vTins = []
          this.$parent.vTins.push(...vTins)
          closeAllLayer()
          this.startRoam()
        })
        .catch(error => {
          this.$message.error('隧道开挖err:' + error)
        })
        .finally(r => {
          loading.close()
          Viewer.entities.remove(this.polygonEntity)
          this.polygonEntity = null
        })
    },
    startRoam() {
      // 漫游
      const arr = []
      const height = this.depth * -1
      for (let i = 0; i < this.points.length; i += 2) {
        arr.push(this.points[i])
        arr.push(this.points[i + 1])
        arr.push(height)
      }
      this.roamingAttr.Lines = arr
      this.roaming = new Roaming(Viewer, this.roamingAttr)
      this.isRoaming = true
      const that = this
      that.timer = setInterval(() => {
        // 判断漫游结束
        if (that.roaming.endflag) {
          clearInterval(that.timer)
          that.timer = null
          that.isRoaming = false
        }
      }, 500)
    },
    pauseOrContinue(bool) {
      if (!this.roaming) return
      this.isRoaming = bool

      if (this.roaming.endflag && bool) {
        this.roaming.again()
      } else {
        this.roaming.PauseOrContinue(bool)
      }
    },
    endRoaming() {
      if (!this.roaming) return
      if (this.roamBtn === '结束漫游') {
        this.roaming.EndRoaming()
        this.roamBtn = '重新漫游'
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      } else {
        this.roaming.again()
        this.roamBtn = '结束漫游'
      }
    }
  },
  destroyed() {
    if (this.polygonEntity) Viewer.entities.remove(this.polygonEntity)
    this.polygonEntity = null
    this.visible = false
  }
}
</script>
