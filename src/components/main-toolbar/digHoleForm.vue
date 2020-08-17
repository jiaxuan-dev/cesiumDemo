<!--
 * @Descripttion: 沿线探索输入框
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-29 14:49:24
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-24 15:25:13
-->
<template>
  <dialogPage width="350" left="500" top="120" :dialogShow="visible" @close="closeDigHole">
    <div class="result-box">
      <el-form ref="form" label-width="95px" label-position="left">
        <el-form-item v-if="isLineSearch" label="开挖宽度(m)">
          <el-input v-model="width" placeholder="请输入分析半径" type="number"></el-input>
        </el-form-item>
        <el-form-item label="开挖深度(m)">
          <el-input v-model="depth" placeholder="请输入分析深度" type="number"></el-input>
        </el-form-item>
        <el-form-item v-if="type === 2" label="挖除内体">
          <el-radio-group v-model="isOut">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button v-if="isLineSearch" @click="drawLine">绘制线</el-button>
          <el-button v-if="!isLineSearch" @click="drawPolgon">绘制范围</el-button>
          <el-button @click="digHole">开挖分析</el-button>
        </el-form-item>
      </el-form>
    </div>
  </dialogPage>
</template>

<script>
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
import * as turf from '@turf/turf'
import { calulationLineLength ,calulationLineRectCenter } from '../../js/common/common'
import { closeAllLayer, digTin } from '../../js/common/layerTree'
export default {
  name: 'digHole-form',
  data() {
    return {
      width: 500,
      depth: 500,
      title: '沿线探索参数设置',
      isLineSearch: true,
      visible: false,
      type: 1, // 开挖类型 1 虚拟 2 真实
      isOut: '1'
    }
  },
  methods: {
    closeDigHole() {
      this.visible = false
    },
    setVisible(bool) {
      this.visible = bool
    },
    drawLine() {
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
          Viewer.entities.remove(Viewer.entities.getById(data.id))
          const ellipsoid = Viewer.scene.globe.ellipsoid
          const cartographicArray = ellipsoid.cartesianArrayToCartographicArray(positions)
          // 线缓冲
          const wgsCorrds = []
          cartographicArray.forEach(c => {
            const lat = Cesium.Math.toDegrees(c.latitude)
            const lon = Cesium.Math.toDegrees(c.longitude)
            wgsCorrds.push([lon, lat])
          })
          const line = turf.lineString(wgsCorrds, { stroke: '#F00' })

          const offsetLine1 = turf.lineOffset(line, this.width / 2, { units: 'meters' })
          const offsetLine2 = turf.lineOffset(line, -this.width / 2, { units: 'meters' })
          const polygonPoints = offsetLine1.geometry.coordinates.concat(offsetLine2.geometry.coordinates.reverse())
          const hierarchy = polygonPoints.reduce((pre, cur) => pre.concat(cur[0], cur[1]))
          hierarchy.push(hierarchy[0], hierarchy[1])
          this.points = hierarchy
          // 绘制面
          const options = {
            polygon: {
              hierarchy: Cesium.Cartesian3.fromDegreesArray(hierarchy),
              material: new Cesium.Color(0, 0, 1, 0.5),
              heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
              height: 10
            }
          }
          this.polygonEntity = Viewer.entities.add(options)
        },
        { clampToGround: false }
      )
    },
    drawPolgon() {
      // 绘制
      if (window.draw === undefined) {
        // 实例化一次
        window.draw = new DrawGraph(window.Viewer)
      }
      if (this.polygonEntity) {
        Viewer.entities.remove(this.polygonEntity)
      }
      window.draw.drawPolygon(
        data => {
          this.polygonEntity = Viewer.entities.getById(data.id)
          const positions = Viewer.entities.getById(data.id).polygon.hierarchy.getValue(new Cesium.JulianDate()).positions
          var ellipsoid = Viewer.scene.globe.ellipsoid
          const cartographicArray = ellipsoid.cartesianArrayToCartographicArray(positions)
          const wgsCorrds = []
          cartographicArray.forEach(c => {
            const lat = Cesium.Math.toDegrees(c.latitude)
            const lon = Cesium.Math.toDegrees(c.longitude)
            wgsCorrds.push([lon, lat])
          })
          wgsCorrds.push(wgsCorrds[0])
          // 判断环的方向 需改为逆时针
          const clockwiseRing = turf.lineString(wgsCorrds)
          if (turf.booleanClockwise(clockwiseRing)) wgsCorrds.reverse()
          this.points = wgsCorrds.reduce((pre, cur) => pre.concat(cur[0], cur[1]))
        },
        { height: 30 }
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
      // 计算最长边长度
      const calLineLen = []
      for (let i = 0; i < this.points.length - 2; i += 2) {
        calLineLen.push([this.points[i], this.points[i + 1], this.points[i + 2], this.points[i + 3]])
      }
      const lineLens = calLineLen
        .map(function(s) {
          return calulationLineLength(s)
        })
        .sort(function compare(val1, val2) {
          return val1 - val2
        })
      this.maxLineLen = lineLens[lineLens.length - 1]
      if (this.type === 1) this.digHoleWall()
      else this.realDigHole()
    },
    digHoleWall() {
      const para = {
        points: this.points,
        startDepth: 150,
        depth: Number(this.depth)
      }
      const para2 = {
        points: this.points,
        depth: Number(this.depth) - 150
      }
      const zpmPost = this.$parent.makeSectionData(1, para)
      const hpmPost = this.$parent.makeSectionData(2, para2)
      Promise.all([zpmPost, hpmPost])
        .then(result => {
          // 设置水平剖面的参考z值和垂直剖面一致，保证拉伸状态一致
          const sections = result
          sections[1].topZ = sections[0].topZ
          if (sections[1].zStretch !== 1) sections[1].zStretch = sections[0].zStretch
        })
        .catch(error => {
          Viewer.entities.remove(this.polygonEntity)
          this.polygonEntity = null
          this.$message.error('剖面请求数据错误:' + error)
        })
        .finally(r => {
          // 挖地形
          this.digTerrain(Cesium.Cartesian3.fromDegreesArray(this.points))
          Viewer.entities.remove(this.polygonEntity)
          this.polygonEntity = null
          closeAllLayer()
          // 飞向视角
          const center = calulationLineRectCenter(this.points)
          Viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(center.x, center.y, 0), Number(this.depth)), {
            offset: new Cesium.HeadingPitchRange(0, Math.PI / -3, this.maxLineLen * 3)
          })
        })
    },
    realDigHole() {
      const loading = this.$loading({
        lock: true,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.3)',
        text: '数据请求中...'
      })
      digTin({
        points: this.points,
        depth: this.depth * -1,
        isOut: this.isOut === '1'
      })
        .then(vTins => {
          if (!this.$parent.vTins) this.$parent.vTins = []
          this.$parent.vTins.push(...vTins)
        })
        .catch(error => {
          this.$message.error('真实挖洞err:' + error)
        })
        .finally(r => {
          loading.close()
          // 挖地形
          this.digTerrain(Cesium.Cartesian3.fromDegreesArray(this.points))
          Viewer.entities.remove(this.polygonEntity)
          this.polygonEntity = null
          closeAllLayer()
          // 飞向视角
          const center = calulationLineRectCenter(this.points)
          Viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(center.x, center.y, 0), Number(this.depth)), {
            offset: new Cesium.HeadingPitchRange(0, Math.PI / -3, this.maxLineLen * 3)
          })
        })
    },
    digTerrain(points) {
      var pointsLength = points.length
      // Create center points for each clipping plane
      var clippingPlanes = []
      for (var i = 0; i < pointsLength - 1; ++i) {
        var nextIndex = (i + 1) % pointsLength
        var midpoint = Cesium.Cartesian3.add(points[i], points[nextIndex], new Cesium.Cartesian3())
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint)

        var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3())
        var right = Cesium.Cartesian3.subtract(points[nextIndex], midpoint, new Cesium.Cartesian3())
        right = Cesium.Cartesian3.normalize(right, right)

        var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3())
        normal = Cesium.Cartesian3.normalize(normal, normal)

        // Compute distance by pretending the plane is at the origin
        var originCenteredPlane = new Cesium.Plane(normal, 0.0)
        var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint)

        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance))
      }
      Viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: clippingPlanes,
        edgeWidth: 0.1,
        // edgeColor: Cesium.Color.WHITE,
        enabled: true
      })

      Viewer.scene.globe.backFaceCulling = true
      Viewer.scene.globe.showSkirts = true
    }
  },
  destroyed() {
    if (this.polygonEntity) Viewer.entities.remove(this.polygonEntity)
    this.polygonEntity = null
  }
}
</script>
