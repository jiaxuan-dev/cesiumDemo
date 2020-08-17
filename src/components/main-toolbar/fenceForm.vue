<!--
 * @Descripttion: 栅栏输入框
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-29 14:49:24
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-07 16:20:05
-->
<template>
  <dialogPage width="350" left="500" top="120" :dialogShow="visible" @close="closeFence">
    <div class="result-box">
      <el-form ref="form" :model="fenceData" label-width="60px" label-position="left">
        <el-form-item label="行数">
          <el-input v-model="fenceData.row" placeholder="请输入行数" type="number"></el-input>
        </el-form-item>
        <el-form-item label="列数">
          <el-input v-model="fenceData.column" placeholder="请输入列数" type="number"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="drawRange">绘制范围</el-button>
          <el-button @click="wholeRange">全区分析</el-button>
        </el-form-item>
      </el-form>
    </div>
  </dialogPage>
</template>

<script>
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
import { getTopLayer } from '../../js/common/layerTree'
export default {
  name: 'fence-form',
  data() {
    return {
      fenceData: { row: 3, column: 3 },
      title: '栅栏图分析设置',
      visible: false
    }
  },
  methods: {
    closeFence() {
      this.visible = false
    },
    setVisible(bool) {
      this.visible = bool
    },
    drawRange() {
      // 绘制
      if (window.draw === undefined) {
        // 实例化一次
        window.draw = new DrawGraph(window.Viewer)
      }
      window.draw.drawPolygon(
        data => {
          const positions = Viewer.entities.getById(data.id).polygon.hierarchy.getValue(new Cesium.JulianDate()).positions
          var ellipsoid = Viewer.scene.globe.ellipsoid
          const cartographicArray = ellipsoid.cartesianArrayToCartographicArray(positions)
          // 确认外包坐标
          let minx = 999999999999
          let maxx = -999999999999
          let miny = 999999999999
          let maxy = -999999999999
          cartographicArray.forEach(c => {
            const lat = Cesium.Math.toDegrees(c.latitude)
            const lng = Cesium.Math.toDegrees(c.longitude)
            minx = Math.min(minx, lng)
            miny = Math.min(miny, lat)
            maxx = Math.max(maxx, lng)
            maxy = Math.max(maxy, lat)
          })
          this.fenceAna({ minx: minx, maxx: maxx, miny: miny, maxy: maxy }, data)
        },
        { height: 10 }
      )
    },
    wholeRange() {
      const layer = getTopLayer()
      this.fenceAna(layer.extent)
    },
    fenceAna(bound, data) {
      const minx = bound.minx
      const maxx = bound.maxx
      const miny = bound.miny
      const maxy = bound.maxy
      const row = Number(this.fenceData.row)
      const column = Number(this.fenceData.column)
      // 组织剖面线坐标
      const lines = []
      const ylength = maxy - miny // y长度
      const length = ylength / (row + 1)
      const xLength = maxx - minx // x长度
      const rowlength = xLength / (column + 1)
      let newlength = 0
      let i
      for (i = 0; i < row; i++) {
        newlength = miny + length * (i + 1)
        lines.push([minx, newlength, maxx, newlength])
      }
      newlength = 0
      for (i = 0; i < column; i++) {
        newlength = minx + rowlength * (i + 1)
        lines.push([newlength, miny, newlength, maxy])
      }
      const posts = []
      // 生成剖面
      lines.forEach(points => {
        const para = {
          points: points
          // startDepth: 20,
          // depth: 10000
        }
        posts.push(this.$parent.makeSectionData(1, para))
      })
      Promise.all(posts)
        .then(result => {
          if (data) Viewer.entities.remove(Viewer.entities.getById(data.id))
        })
        .catch(error => {
          if (data) Viewer.entities.remove(Viewer.entities.getById(data.id))
          console.log(error)
        })
    }
  }
}
</script>
