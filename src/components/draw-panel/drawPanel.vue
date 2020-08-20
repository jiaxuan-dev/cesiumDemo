<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <div>
    <!--<drag-model
      :showClose="showClose"
      :title="title"
      width="400px"
      left="50%"
      top="100px"
      :visible.sync="visible"
      @close="closeDrawPanel"
    >-->
    <div v-show="drawShow">
      <div class="btn" @click="drawGraph('mark')">
        <i style="margin-left:7px" class="iconfont iconbiaoji"></i>
        <div>标注</div>
      </div>
      <div class="btn" @click="drawGraph('polyline')">
        <i style="margin-left:7px" class="iconfont iconicon-line-graph"></i>
        <div>折线</div>
      </div>
      <div class="btn" @click="drawGraph('polygon')">
        <i style="margin-left:7px" class="iconfont iconduobianxing"></i>
        <div>多边形</div>
      </div>
      <div class="btn" @click="drawGraph('model')">
        <i style="margin-left:7px" class="iconfont iconmoxing___"></i>
        <div>模型</div>
      </div>
      <div class="btn" @click="saveFlie">
        <i style="margin-left:7px" class="iconfont icondaochu"></i>
        <div>导出</div>
      </div>
      <div class="btn" @click="clickFile">
        <i style="margin-left:7px" class="iconfont icondaoru"></i>
        <div>导入</div>
      </div>
      <div v-show="editAllShow" class="btn" @click="editAll">
        <i style="margin-left:7px" class="iconfont iconbianji"></i>
        <div>编辑</div>
      </div>
      <div v-show="overEditAllShow" class="btn" @click="overEditAll">
        <i style="margin-left:7px" class="iconfont icontingzhibianji"></i>
        <div>结束编辑</div>
      </div>
      <div class="btn" @click="removeAll">
        <i style="margin-left:7px" class="iconfont iconshanchu"></i>
        <div>清除</div>
      </div>
    </div>

    <!--</drag-model>-->
    <div class="popover">
      <polyline-popover
        @cancel="polylineclose"
        @define="polylineclose"
        :polylineEntity="polylineEntity"
        :polylineShow="polylineShow"
        :left="polylineLeft"
        :top="polylineTop"
        :pattern="polylinePattern"
      ></polyline-popover>
      <polygon-popover
        @cancel="polygonclose"
        @define="polygonclose"
        :polygonEntity="polygonEntity"
        :polygonShow="polygonShow"
        :left="polygonLeft"
        :top="polygonTop"
        :pattern="polygonPattern"
      ></polygon-popover>
      <mark-popover
        @cancel="markclose"
        @define="markclose"
        :markEntity="markEntity"
        :markShow="markShow"
        :left="markLeft"
        :top="markTop"
        :pattern="markPattern"
      ></mark-popover>
      <model-popover
        @Select="modelclose"
        @close="modelPanelclose"
        @modelPrimitive="PrimitiveID"
        @modelUrl="getmodelUrl"
        :modelShow="modelShow"
        :modelPanelshow="modelPanelshow"
        :modelPrimitive="modelPrimitive"
        :pattern="modelPattern"
        :left="modelLeft"
        :top="modelTop"
      ></model-popover>
    </div>
    <input ref="file" class="fileIn" type="file" @input="selectFile" />
    <div v-show="editShow" ref="edit" class="editPanel">
      <div :data-type="graphType" @click="defineEdit" class="editBtn">编 辑</div>
      <div :data-type="graphType" @click="attrEdit" class="attrBtn">属 性</div>
      <div :data-type="graphType" @click="deletEdit" class="deletBtn">删 除</div>
    </div>
  </div>
</template>

<script>
import polylinePopover from './polylinePopover.vue'
import polygonPopover from './polygonPopover.vue'
import markPopover from './markPopover.vue'
import modelPopover from './modelPopover.vue'
import { saveAs } from 'file-saver'
import EditGraph from '../../js/cesiumDraw/EditGraph.js'
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
// import DynamicMesh from '../../js/DynamicMesh/DynamicMesh'
export default {
  name: 'draw-panel',
  components: { polylinePopover, polygonPopover, markPopover, modelPopover },
  props: ['drawShow'],
  data() {
    return {
      visible: true,
      title: '绘制面板',
      showClose: true,
      polylineShow: false,
      polygonShow: false,
      markShow: false,
      polylineEntity: null,
      polygonEntity: null,
      markEntity: null,
      modelShow: false,
      modelPanelshow: false,
      graphEneityID: [],
      modelPrimitiveID: [],
      modelPrimitive: null,
      editShow: false,
      editModelPrimitiveID: null,
      editgraphEneityID: null,
      graphType: null,
      markLeft: null,
      markTop: null,
      polygonLeft: null,
      polygonTop: null,
      polylineLeft: null,
      polylineTop: null,
      modelLeft: null,
      modelTop: null,
      markPattern: '',
      modelPattern: '',
      polygonPattern: '',
      polylinePattern: '',
      modelUrl: 'model/Wood_Tower.glb',
      editAllShow: true,
      overEditAllShow: false
      // dropMenuLeft: '',
      // dropMenuTop: ''
    }
  },
  watch: {
    modelUrl: function(n, o) {
      if (n != null) {
        const that = this
        this.draw.addModel(
          data => {
            that.modelPanelshow = true
            that.modelPrimitive = data.id
            that.modelPrimitiveID.push(data.id)
            that.modelPattern = '添加模型'
            that.modelLeft = data.position.x + 'px'
            that.modelTop = data.position.y + 'px'
          },
          { url: this.modelUrl }
        )
      }
    }
  },
  mounted() {
    const drawFileData = {
      marker: [],
      polyline: [],
      polygon: [],
      model: []
    }
    window.drawFileData = drawFileData
    // this.dropMenuLeft = this.$route.query.left - this.$route.query.width / 2 + 'px'
    // this.dropMenuTop = Number(this.$route.query.top) + Number(this.$route.query.height) + 'px'
  },
  methods: {
    // closeDrawPanel() {
    //   this.$router.push({ path: '/' })
    // },
    editAll() {
      if (this.graphEneityID.length !== 0 || this.modelPrimitiveID.length !== 0) {
        if (Viewer.entities.getById('OperationTips') === undefined) {
          this.label = Viewer.entities.add({
            id: 'OperationTips',
            label: {
              font: '10px sans-serif',
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              showBackground: true,
              horizontalOrigin: Cesium.HorizontalOrigin.LEFT
            }
          })
        } else {
          this.label = Viewer.entities.getById('OperationTips')
        }
        this.label.label.text = '右键点击需要进行编辑的图形或模型'
        // 开启编辑
        this.editAllShow = false
        this.overEditAllShow = true
        if (this.edit === undefined) {
          this.edit = new EditGraph(Viewer)
        }
        const that = this
        this.Handler = new Cesium.ScreenSpaceEventHandler(Viewer.scene.canvas)
        this.Handler.setInputAction(function(e) {
          const pickedObject = Viewer.scene.pick(e.position)
          if (Cesium.defined(pickedObject)) {
            that.label.label.text = undefined
            that.label.position = undefined
            if (typeof pickedObject.id === 'string') {
              if (that.modelPrimitiveID.indexOf(pickedObject.id) !== -1) {
                that.$refs.edit.style.left = e.position.x + 'px'
                that.$refs.edit.style.top = e.position.y + 'px'
                that.editShow = true
                that.graphType = 'model'
                that.editModelPrimitiveID = pickedObject.id
              }
            } else if (typeof pickedObject.id === 'object') {
              if (that.graphEneityID.indexOf(pickedObject.id.id) !== -1) {
                that.$refs.edit.style.left = e.position.x + 'px'
                that.$refs.edit.style.top = e.position.y + 'px'
                that.editShow = true
                if (pickedObject.id.polyline !== undefined) {
                  that.graphType = 'polyline'
                  that.editgraphEneityID = pickedObject.id.id
                } else if (pickedObject.id.polygon !== undefined) {
                  that.graphType = 'polygon'
                  that.editgraphEneityID = pickedObject.id.id
                } else if (pickedObject.id.billboard !== undefined) {
                  that.graphType = 'mark'
                  that.editgraphEneityID = pickedObject.id.id
                }
              }
            }
          }
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        this.Handler.setInputAction(function(e) {
          that.editShow = false
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        this.Handler.setInputAction(function(event) {
          const pick = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y)
          const cartesian = Viewer.scene.globe.pick(Viewer.camera.getPickRay(pick), Viewer.scene)
          // const pickedObject = Viewer.scene.pick(event.endPosition)
          // if (Cesium.defined(pickedObject)) {
          //   cartesian = that._viewer.scene.pickPosition(event.endPosition)
          // } else {
          //   let pick = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y)
          //   cartesian = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick), that._viewer.scene)
          // }
          if (cartesian !== undefined) {
            that.label.position = cartesian
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      } else {
        this.$message({
          message: '没有绘制图案',
          type: 'warning'
        })
      }
    },
    overEditAll() {
      // 结束编辑
      if (this.label !== undefined) {
        this.label.label.text = undefined
        this.label.position = undefined
      }

      this.editAllShow = true
      this.overEditAllShow = false
      this.editShow = false
      if (this.edit !== undefined) {
        this.edit.overEditAll()
      }
      if (this.Handler !== undefined) {
        this.Handler.destroy()
      }
    },
    removeAll() {
      // 清除全部
      for (const i in this.graphEneityID) {
        Viewer.entities.remove(Viewer.entities.getById(this.graphEneityID[i]))
      }
      for (const i in this.modelPrimitiveID) {
        for (const j in Viewer.scene.primitives._primitives) {
          if (Viewer.scene.primitives._primitives[j].id === this.modelPrimitiveID[i]) {
            const index = Viewer.scene.primitives._primitives.indexOf(Viewer.scene.primitives._primitives[j])
            Viewer.scene.primitives.remove(Viewer.scene.primitives.get(index))
          }
        }
      }
      window.drawFileData = {
        marker: [],
        polyline: [],
        polygon: [],
        model: []
      }
      this.graphEneityID = []
      this.modelPrimitiveID = []
    },
    defineEdit(e) {
      // 编辑
      this.editShow = false
      if (e.target.getAttribute('data-type') === 'model') {
        let model = null
        for (const i in Viewer.scene.primitives._primitives) {
          if (Viewer.scene.primitives._primitives[i].id === this.editModelPrimitiveID) {
            const index = Viewer.scene.primitives._primitives.indexOf(Viewer.scene.primitives._primitives[i])
            model = Viewer.scene.primitives.get(index)
          }
        } // 获取模型
        this.edit.editModel(model, data => {
          for (const i in window.drawFileData.model) {
            if (window.drawFileData.model[i].id === this.editModelPrimitiveID) {
              window.drawFileData.model[i].modelMatrix = data.modelMatrix
            }
          }
        })
      } else if (e.target.getAttribute('data-type') === 'mark') {
        this.edit.editMarker(Viewer.entities.getById(this.editgraphEneityID), data => {
          for (const i in window.drawFileData.marker) {
            if (window.drawFileData.marker[i].id === this.editgraphEneityID) {
              window.drawFileData.marker[i].position = data.position
            }
          }
        })
      } else if (e.target.getAttribute('data-type') === 'polyline') {
        this.edit.editPolyline(Viewer.entities.getById(this.editgraphEneityID), data => {
          for (const i in window.drawFileData.polyline) {
            if (window.drawFileData.polyline[i].id === this.editgraphEneityID) {
              window.drawFileData.polyline[i].position = data.position
            }
          }
        })
      } else if (e.target.getAttribute('data-type') === 'polygon') {
        this.edit.editPolygon(Viewer.entities.getById(this.editgraphEneityID), data => {
          for (const i in window.drawFileData.polygon) {
            if (window.drawFileData.polygon[i].id === this.editgraphEneityID) {
              window.drawFileData.polygon[i].position = data.position
            }
          }
        })
      }
    },
    attrEdit(e) {
      // 修改属性
      this.editShow = false
      if (e.target.getAttribute('data-type') === 'model') {
        this.modelPrimitive = this.editModelPrimitiveID
        this.modelPattern = '编辑模型'
        this.modelPanelshow = true
        this.modelLeft = e.pageX + 'px'
        this.modelTop = e.pageY + 'px'
      } else if (e.target.getAttribute('data-type') === 'mark') {
        this.markEntity = this.editgraphEneityID
        this.markShow = true
        this.markLeft = e.pageX + 'px'
        this.markTop = e.pageY + 'px'
        this.markPattern = '编辑标注'
      } else if (e.target.getAttribute('data-type') === 'polyline') {
        this.polylineEntity = this.editgraphEneityID
        this.polylineShow = true
        this.polylineLeft = e.pageX + 'px'
        this.polylineTop = e.pageY + 'px'
        this.polylinePattern = '编辑折线'
      } else if (e.target.getAttribute('data-type') === 'polygon') {
        this.polygonEntity = this.editgraphEneityID
        this.polygonShow = true
        this.polygonLeft = e.pageX + 'px'
        this.polygonTop = e.pageY + 'px'
        this.polygonPattern = '编辑多边形'
      }
    },
    deletEdit(e) {
      // 删除某一个
      this.editShow = false
      if (e.target.getAttribute('data-type') === 'model') {
        for (const j in Viewer.scene.primitives._primitives) {
          if (Viewer.scene.primitives._primitives[j].id === this.editModelPrimitiveID) {
            const index = Viewer.scene.primitives._primitives.indexOf(Viewer.scene.primitives._primitives[j])
            Viewer.scene.primitives.remove(Viewer.scene.primitives.get(index))
          }
        }
        for (const i in window.drawFileData.model) {
          if (window.drawFileData.model[i].id === this.editModelPrimitiveID) {
            window.drawFileData.model.splice(i, 1)
          }
        }
        for (const i in this.modelPrimitiveID) {
          if (this.modelPrimitiveID[i] === this.editModelPrimitiveID) {
            this.modelPrimitiveID.splice(i, 1)
          }
        }
      } else {
        Viewer.entities.remove(Viewer.entities.getById(this.editgraphEneityID))
        for (const i in this.graphEneityID) {
          if (this.graphEneityID[i] === this.editgraphEneityID) {
            this.graphEneityID.splice(i, 1)
          }
        }
        if (e.target.getAttribute('data-type') === 'mark') {
          for (const i in window.drawFileData.marker) {
            if (window.drawFileData.marker[i].id === this.editgraphEneityID) {
              window.drawFileData.marker.splice(i, 1)
            }
          }
        } else if (e.target.getAttribute('data-type') === 'polyline') {
          for (const i in window.drawFileData.polyline) {
            if (window.drawFileData.polyline[i].id === this.editgraphEneityID) {
              window.drawFileData.polyline.splice(i, 1)
            }
          }
        } else if (e.target.getAttribute('data-type') === 'polygon') {
          for (const i in window.drawFileData.polygon) {
            if (window.drawFileData.polygon[i].id === this.editgraphEneityID) {
              window.drawFileData.polygon.splice(i, 1)
            }
          }
        }
      }
    },
    drawGraph(type) {
      // 开始绘制
      const that = this
      if (this.draw === undefined) {
        this.draw = new DrawGraph(Viewer)
      }
      if (type === 'mark') {
        this.draw.drawMark(data => {
          that.markEntity = data.id
          that.markShow = true
          that.graphEneityID.push(data.id)
          that.markLeft = data.position.x + 'px'
          that.markTop = data.position.y + 'px'
          that.markPattern = '添加标注'
        })
      } else if (type === 'polyline') {
        this.draw.drawPolyline(data => {
          that.polylineEntity = data.id
          that.polylineShow = true
          that.graphEneityID.push(data.id)
          that.polylineLeft = data.position.x + 'px'
          that.polylineTop = data.position.y + 'px'
          that.polylinePattern = '添加折线'
          // var roaming = new Roaming(Viewer, {
          //   modeluri: 'model/GroundVehicle.glb',
          //   time: 500,
          //   Lines: data.cartesian,
          //   isPathShow: true
          // })
        })
      } else if (type === 'polygon') {
        this.draw.drawPolygon(
          data => {
            that.polygonEntity = data.id
            that.polygonShow = true
            that.graphEneityID.push(data.id)
            that.polygonLeft = data.position.x + 'px'
            that.polygonTop = data.position.y + 'px'
            that.polygonPattern = '添加多边形'
            // console.log(data.cartesian)
            // this.mesh = new DynamicMesh(Viewer, { polygonPositons: data.cartesian })
          },
          { height: 2 }
        )
      } else if (type === 'model') {
        this.modelShow = true
        this.modelUrl = 'model/Wood_Tower.glb'
        this.draw.addModel(
          data => {
            that.modelPanelshow = true
            that.modelPrimitive = data.id
            that.modelPrimitiveID.push(data.id)
            that.modelPattern = '添加模型'
            that.modelLeft = data.position.x + 'px'
            that.modelTop = data.position.y + 'px'
          },
          { url: this.modelUrl }
        )
      }
    },
    PrimitiveID() {
      this.modelPrimitive = null
    },
    getmodelUrl(data) {
      this.modelUrl = data
    },
    polylineclose(data) {
      this.polylineShow = data
    },
    polygonclose(data) {
      this.polygonShow = data
    },
    markclose(data) {
      this.markShow = data
    },
    modelclose(data) {
      this.modelShow = data
    },
    modelPanelclose(data) {
      this.modelPanelshow = data
    },
    clickFile() {
      this.$refs.file.click()
    },
    selectFile(event) {
      // 导入文件读取文件数据
      const that = this
      const reader = new FileReader()
      const file = event.target.files[0]
      reader.readAsText(file)
      reader.onload = function() {
        that.loadGraph(JSON.parse(this.result))
        window.drawFileData = JSON.parse(this.result)
      }
    },
    saveFlie() {
      // 导出生成json文件
      if (JSON.stringify(window.drawFileData) === '{"marker":[],"polyline":[],"polygon":[],"model":[]}') {
        this.$message({
          message: '请先绘制图案',
          type: 'warning'
        })
      } else {
        var blob = new Blob([JSON.stringify(window.drawFileData)], { type: '' })
        saveAs(blob, '标绘' + new Date().getTime() + '.json')
      }
    },
    loadGraph(data) {
      // 导入文件后加载上标注
      for (const i in data.marker) {
        Viewer.entities.add({
          id: data.marker[i].id,
          position: data.marker[i].position,
          billboard: {
            image: data.marker[i].image,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM
          },
          label: {
            text: data.marker[i].name,
            font: data.marker[i].fontSize + 'px sans-serif',
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            fillColor: this.colorDataChange(data.marker[i].color)
          }
        })
        this.graphEneityID.push(data.marker[i].id)
      }
      // 导入文件后加载上折线
      for (const i in data.polyline) {
        const option = {
          id: data.polyline[i].id,
          polyline: {
            show: true,
            positions: data.polyline[i].position,
            width: data.polyline[i].lineWidth,
            clampToGround: data.polyline[i].Ground,
            arcType: data.polyline[i].lineType === '大地线' ? Cesium.ArcType.GEODESIC : Cesium.ArcType.NONE,
            material: this.colorDataChange(data.polyline[i].color)
          }
        }
        if (data.polyline[i].Material === '轮廓') {
          option.polyline.material = new Cesium.PolylineOutlineMaterialProperty({
            color: this.colorDataChange(data.polyline[i].color),
            outlineColor: this.colorDataChange(data.polyline[i].OutLineColor),
            outlineWidth: data.polyline[i].OutLineWidth
          })
        } else if (data.polyline[i].Material === '虚线') {
          option.polyline.material = new Cesium.PolylineDashMaterialProperty({
            color: this.colorDataChange(data.polyline[i].color),
            gapColor: this.colorDataChange(data.polyline[i].clearanceColor),
            dashLength: data.polyline[i].clearanceLength,
            dashPattern: 255
          })
        } else if (data.polyline[i].Material === '发光') {
          option.polyline.material = new Cesium.PolylineGlowMaterialProperty({
            color: this.colorDataChange(data.polyline[i].color),
            glowPower: data.polyline[i].brightness / 100,
            taperPower: data.polyline[i].GradientIntensity / 100
          })
        } else if (data.polyline[i].Material === '箭头') {
          option.polyline.material = new Cesium.PolylineArrowMaterialProperty(this.colorDataChange(data.polyline[i].color))
        }
        Viewer.entities.add(option)
        this.graphEneityID.push(data.polyline[i].id)
      }
      // 导入文件后加载上多边形
      for (const i in data.polygon) {
        const option = {
          id: data.polygon[i].id,
          polygon: {
            hierarchy: new Cesium.PolygonHierarchy(data.polygon[i].position),
            heightReference: data.polygon[i].ground,
            fill: data.polygon[i].fill,
            outline: data.polygon[i].outline
          }
        }
        if (data.polygon[i].fill) {
          if (data.polygon[i].Material === '纯色') {
            option.polygon.material = this.colorDataChange(data.polygon[i].FillColor)
          } else if (data.polygon[i].Material === '图片') {
            option.polygon.material = new Cesium.ImageMaterialProperty({
              image: data.polygon[i].image,
              repeat: data.polygon[i].imageNum,
              transparent: true
            })
          } else if (data.polygon[i].Material === '网格') {
            option.polygon.material = new Cesium.GridMaterialProperty({
              color: this.colorDataChange(data.polygon[i].FillColor),
              cellAlpha: data.polygon[i].gridAlpha,
              lineCount: data.polygon[i].gridNum,
              lineThickness: data.polygon[i].gridLineWidth
            })
          } else if (data.polygon[i].Material === '条纹') {
            option.polygon.material = new Cesium.StripeMaterialProperty({
              evenColor: this.colorDataChange(data.polygon[i].EvenColor),
              oddColor: this.colorDataChange(data.polygon[i].OddColor),
              repeat: data.polygon[i].stripeNum,
              orientation: data.polygon[i].orientation
            })
          } else if (data.polygon[i].Material === '棋盘') {
            option.polygon.material = new Cesium.CheckerboardMaterialProperty({
              evenColor: this.colorDataChange(data.polygon[i].EvenColor),
              oddColor: this.colorDataChange(data.polygon[i].OddColor),
              repeat: data.polygon[i].checkerboardNum
            })
          }
        }

        if (data.polygon[i].outline) {
          option.polygon.outlineColor = this.colorDataChange(data.polygon[i].OutLineColor)
        }
        if (data.polygon[i].ground !== 1) {
          option.polygon.height = data.polygon[i].height
        }
        Viewer.entities.add(option)
        this.graphEneityID.push(data.polygon[i].id)
      }
      // 导入文件后加载模型
      for (const i in data.model) {
        const option = {
          id: data.model[i].id,
          url: data.model[i].url,
          modelMatrix: data.model[i].modelMatrix,
          scale: data.model[i].scale,
          show: true,
          minimumPixelSize: 1,
          clampAnimations: true,
          color: data.model[i].color,
          colorBlendAmount: data.model[i].colorBlendAmount,
          colorBlendMode: data.model[i].colorBlendMode,
          silhouetteColor: data.model[i].silhouetteColor,
          silhouetteSize: data.model[i].silhouetteSize
        }
        Viewer.scene.primitives.add(Cesium.Model.fromGltf(option))
        this.modelPrimitiveID.push(data.model[i].id)
      }
    },
    colorDataChange(rgb) {
      // 获取到的颜色数据改变格式
      if (rgb != null) {
        this.colorRgbArr = []
        const arr = rgb.substring(5, rgb.length - 1).split(', ')
        for (const i in arr) {
          this.colorRgbArr.push(Number(arr[i]))
        }
        return new Cesium.Color(this.colorRgbArr[0] / 255, this.colorRgbArr[1] / 255, this.colorRgbArr[2] / 255, this.colorRgbArr[3])
      } else {
        return new Cesium.Color(0, 0, 0, 0)
      }
    },
    parentHandle: function() {
      this.removeAll()
      this.overEditAll()
      this.markclose(false)
      this.polylineclose(false)
      this.polygonclose(false)
      this.modelclose(false)
      this.modelPanelclose(false)
      this.modelUrl = null
    }
  }
}
</script>

<style lang="scss" scoped>
.drawPanel {
  height: 45px;
}
.btn {
  cursor: pointer;
  padding: 3px 5px;
}
.btn:hover {
  background: rgba(18, 189, 208, 0.5);
}
.btn > div {
  display: inline-block;
}
.fileIn {
  display: none;
}
.editPanel {
  position: fixed;
  color: white;
  z-index: 999;
  border: 1px solid #66e4f2;
  background: rgba(102, 228, 242, 0.1);
  width: 100px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
.editBtn:hover {
  background: rgba(84, 102, 107, 1);
}
.attrBtn:hover {
  background: rgba(84, 102, 107, 1);
}
.deletBtn:hover {
  background: rgba(84, 102, 107, 1);
}
</style>
<style lang="scss">
.popover {
  .el-input__inner {
    background-color: #e6e6e600;
    color: white;
  }
}
</style>
