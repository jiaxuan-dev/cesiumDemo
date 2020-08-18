<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <!--<drag-model
    :title="pattern"
    :width="width+'px'"
    :left="leftVal"
    :top="topVal"
    :visible.sync="visible"
    @close="cancel"
  >-->
  <dialogPage
    :width="width"
    :left="leftVal"
    :top="topVal"
    height="535"
    :dialogShow="visible"
    @close="cancel"
    :markShow="false"
  >
    <div ref="polygonPanel" style="height: 450px;" class="polygonPanel">
      <div class="type">
        <el-radio-group @change="ground()" v-model="PolygonAttr.ground" size="mini">
          <el-radio :label="1" border>贴地</el-radio>
          <el-radio :label="0" border>绝对高度</el-radio>
          <el-radio :label="2" border>相对地形</el-radio>
        </el-radio-group>
      </div>
      <div v-show="heightShow" class="type">
        <span class="seLable">高度</span>
        <el-input
          @input="polygonHeight()"
          style="width:70%;left:40px"
          type="number"
          v-model="PolygonAttr.polygonHeight"
          placeholder="请输入数字"
        ></el-input>
      </div>
      <div class="type">
        <el-checkbox @change="outline()" v-model="PolygonAttr.outline" :disabled="outlineBe">是否有轮廓</el-checkbox>
      </div>
      <div v-show="outlineAttr">
        <div class="type">
          <span class="seLable color">轮廓颜色</span>
          <el-color-picker
            style="left:9px"
            @active-change="changeOutLineColor"
            v-model="PolygonAttr.OutLineColor"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </div>
      </div>
      <div class="type">
        <el-checkbox @change="fill()" v-model="PolygonAttr.fill" :disabled="fillBe">是否有填充</el-checkbox>
      </div>
      <div v-show="PolygonAttr.fill">
        <div class="type">
          <span class="seLable fillType">填充类型</span>
          <el-select @change="SetMaterials()" v-model="PolygonAttr.Material" placeholder="请选择填充类型">
            <el-option
              v-for="item in MaterialArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div v-show="colorShow" class="type">
          <span class="seLable color">颜色</span>
          <el-color-picker
            style="left:9px"
            @active-change="changeFillColor"
            v-model="PolygonAttr.FillColor"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </div>
        <div v-show="imageShow">
          <div class="type">
            <span class="seLable">网络路径</span>
            <el-input
              @input="polygonImage"
              style="width:50%;left:20px"
              v-model="PolygonAttr.img"
              placeholder="请输入"
            ></el-input>
          </div>
          <el-button @click="selectThisimage" type="primary" plain>选择本地文件</el-button>
          <div class="type">
            <input
              v-show="false"
              ref="polygonImage"
              class="file"
              type="file"
              @change="selectImage"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
          <div class="type">
            <div class="demo-input-size">
              <span class="seLable">图片排列</span>
              <el-input
                @input="imageRepeat()"
                placeholder="请输入数字"
                v-model="PolygonAttr.imageRepeatH"
              ></el-input>
              <el-input
                @input="imageRepeat()"
                placeholder="请输入数字"
                v-model="PolygonAttr.imageRepeatV"
              ></el-input>
            </div>
          </div>
        </div>
        <div v-show="gridShow">
          <div class="type">
            <div class="demo-input-size">
              <span class="seLable">网格排列</span>
              <el-input
                v-model="PolygonAttr.gridLineNumN"
                @input="gridLineNum()"
                placeholder="请输入数字"
              ></el-input>
              <el-input
                v-model="PolygonAttr.gridLineNumV"
                @input="gridLineNum()"
                placeholder="请输入数字"
              ></el-input>
            </div>
          </div>
          <div class="type">
            <div class="demo-input-size">
              <span class="seLable">网格线宽</span>
              <el-input
                v-model="PolygonAttr.gridLineWidthN"
                @input="gridLineWidth()"
                placeholder="请输入数字"
              ></el-input>
              <el-input
                v-model="PolygonAttr.gridLineWidthV"
                @input="gridLineWidth()"
                placeholder="请输入数字"
              ></el-input>
            </div>
          </div>
          <div class="type">
            <span class="seLable">单元格透明度</span>
            <el-input
              @input="gridAlpha()"
              style="width:50%;left:20px"
              v-model="PolygonAttr.gridAlpha"
              placeholder="请输入数字"
            ></el-input>
          </div>
        </div>
        <div v-show="oddEven">
          <div class="type">
            <span class="seLable color">颜色一</span>
            <el-color-picker
              style="left:9px"
              @active-change="changeEvenColor"
              v-model="PolygonAttr.EvenColor"
              show-alpha
              :predefine="predefineColors"
            ></el-color-picker>
            <span class="seLable color">颜色二</span>
            <el-color-picker
              style="left:9px"
              @active-change="changeOddColor"
              v-model="PolygonAttr.OddColor"
              show-alpha
              :predefine="predefineColors"
            ></el-color-picker>
          </div>
        </div>
        <div v-show="stripeShow">
          <div class="type">
            <el-radio-group
              @change="stripeOrientation()"
              v-model="PolygonAttr.stripeOrientation"
              size="mini"
            >
              <el-radio label="横向" border>横向</el-radio>
              <el-radio label="纵向" border>纵向</el-radio>
            </el-radio-group>
          </div>
          <div class="type">
            <span class="seLable">条纹数</span>
            <el-input
              v-model="PolygonAttr.stripeNum"
              @input="stripeNum()"
              style="width:60%;left:20px"
              type="number"
              placeholder="请输入数字"
            ></el-input>
          </div>
        </div>
        <div v-show="checkerboardShow">
          <div class="type">
            <div class="demo-input-size">
              <span class="seLable">棋盘排列</span>
              <el-input
                @input="checkerboardNum()"
                v-model="PolygonAttr.checkerboardNumN"
                placeholder="请输入数字"
              ></el-input>
              <el-input
                @input="checkerboardNum()"
                v-model="PolygonAttr.checkerboardNumV"
                placeholder="请输入数字"
              ></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn">
      <el-button type="success" @click="define()" size="mini">确定</el-button>
      <el-button type="danger" @click="cancel()" size="mini">取消</el-button>
    </div>
    <!--</drag-model>-->
  </dialogPage>
</template>

<script>
export default {
  name: 'polygon-popover',
  props: {
    polygonEntity: String,
    polygonShow: Boolean,
    left: String,
    top: String,
    pattern: String
  },
  data() {
    return {
      visible: false,
      heightShow: true,
      outlineBe: false,
      fillBe: false,
      outlineAttr: false,
      colorShow: true,
      imageShow: false,
      gridShow: false,
      oddEven: false,
      stripeShow: false,
      checkerboardShow: false,
      PolygonAttr: {
        polygonHeight: 2,
        ground: 0,
        outline: false,
        fill: true,
        OutLineColor: 'rgba(0, 0, 0, 1)',
        Material: '纯色',
        FillColor: 'rgba(0, 0, 255, 0.5)',
        imageRepeatH: 1,
        imageRepeatV: 1,
        gridLineNumN: 8,
        gridLineNumV: 8,
        gridLineWidthN: 1,
        gridLineWidthV: 1,
        gridAlpha: 0.1,
        EvenColor: 'rgba(255, 255, 255, 1)',
        OddColor: 'rgba(0, 0, 0, 1)',
        stripeOrientation: '横向',
        stripeNum: 32,
        checkerboardNumN: 2,
        checkerboardNumV: 2,
        imgUrl: require('../../assets/image/a.png'),
        img: ''
      },
      predefineColors: [
        '#ff4500',
        '#ff8c00',
        '#ffd700',
        '#90ee90',
        '#00ced1',
        '#1e90ff',
        '#c71585',
        'rgba(255, 69, 0, 0.68)',
        'rgb(255, 120, 0)',
        'hsv(51, 100, 98)',
        'hsva(120, 40, 94, 0.5)',
        'hsl(181, 100%, 37%)',
        'hsla(209, 100%, 56%, 0.73)',
        '#c7158577'
      ],
      MaterialArray: [
        {
          value: '纯色',
          label: '纯色'
        },
        {
          value: '图片',
          label: '图片'
        },
        {
          value: '网格',
          label: '网格'
        },
        {
          value: '条纹',
          label: '条纹'
        },
        {
          value: '棋盘',
          label: '棋盘'
        }
      ],
      width: 300,
      leftVal: null,
      topVal: null
    }
  },
  watch: {
    polygonShow: function(n, o) {
      this.visible = n
      if (n && this.pattern === '编辑多边形') {
        const polygon = Viewer.entities.getById(this.polygonEntity)
        if (polygon.polygon.heightReference !== undefined) {
          this.PolygonAttr.ground = polygon.polygon.heightReference._value
          if (polygon.polygon.heightReference._value === 0) {
            this.heightShow = true
            this.PolygonAttr.polygonHeight = polygon.polygon.height._value
          } else if (polygon.polygon.heightReference._value === 1) {
            this.heightShow = false
          } else if (polygon.polygon.heightReference._value === 2) {
            this.heightShow = true
            this.PolygonAttr.polygonHeight = polygon.polygon.height._value
          }
        }
        if (polygon.polygon.fill === undefined || polygon.polygon.fill._value) {
          this.PolygonAttr.fill = true
          if (polygon.polygon.material instanceof Cesium.ColorMaterialProperty) {
            this.PolygonAttr.Material = '纯色'
            this.stripeShow = false
            this.oddEven = false
            this.gridShow = false
            this.colorShow = true
            this.imageShow = false
            this.checkerboardShow = false
            this.PolygonAttr.FillColor =
              'rgba(' +
              polygon.polygon.material.color._value.red * 255 +
              ', ' +
              polygon.polygon.material.color._value.green * 255 +
              ', ' +
              polygon.polygon.material.color._value.blue * 255 +
              ', ' +
              polygon.polygon.material.color._value.alpha +
              ')'
          } else if (polygon.polygon.material instanceof Cesium.ImageMaterialProperty) {
            this.PolygonAttr.Material = '图片'
            this.stripeShow = false
            this.oddEven = false
            this.gridShow = false
            this.colorShow = true
            this.imageShow = false
            this.checkerboardShow = false
            this.PolygonAttr.imgUrl = polygon.polygon.material.image._value
            this.PolygonAttr.imageRepeatH = polygon.polygon.material.repeat._value.x
            this.PolygonAttr.imageRepeatV = polygon.polygon.material.repeat._value.y
          } else if (polygon.polygon.material instanceof Cesium.GridMaterialProperty) {
            this.PolygonAttr.Material = '网格'
            this.stripeShow = false
            this.oddEven = false
            this.gridShow = true
            this.colorShow = true
            this.imageShow = false
            this.checkerboardShow = false
            this.PolygonAttr.FillColor =
              'rgba(' +
              polygon.polygon.material.color._value.red * 255 +
              ', ' +
              polygon.polygon.material.color._value.green * 255 +
              ', ' +
              polygon.polygon.material.color._value.blue * 255 +
              ', ' +
              polygon.polygon.material.color._value.alpha +
              ')'
            this.PolygonAttr.gridLineNumN = polygon.polygon.material.lineThickness._value.x
            this.PolygonAttr.gridLineNumV = polygon.polygon.material.lineThickness._value.y
            this.PolygonAttr.gridLineWidthN = polygon.polygon.material.lineCount._value.x
            this.PolygonAttr.gridLineWidthV = polygon.polygon.material.lineCount._value.y
            this.PolygonAttr.gridAlpha = polygon.polygon.material.cellAlpha._value
          } else if (polygon.polygon.material instanceof Cesium.StripeMaterialProperty) {
            this.PolygonAttr.Material = '条纹'
            this.stripeShow = true
            this.oddEven = true
            this.gridShow = false
            this.colorShow = false
            this.imageShow = false
            this.checkerboardShow = false
            this.PolygonAttr.EvenColor =
              'rgba(' +
              polygon.polygon.material.evenColor._value.red * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.green * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.blue * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.alpha +
              ')'
            this.PolygonAttr.OddColor =
              'rgba(' +
              polygon.polygon.material.oddColor._value.red * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.green * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.blue * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.alpha +
              ')'
            if (polygon.polygon.material.orientation._value === 0) {
              this.PolygonAttr.stripeOrientation = '横向'
            } else {
              this.PolygonAttr.stripeOrientation = '纵向'
            }
            this.PolygonAttr.stripeNum = polygon.polygon.material.repeat._value
          } else if (polygon.polygon.material instanceof Cesium.CheckerboardMaterialProperty) {
            this.PolygonAttr.Material = '棋盘'
            this.stripeShow = false
            this.oddEven = true
            this.gridShow = false
            this.colorShow = false
            this.imageShow = false
            this.checkerboardShow = true
            this.PolygonAttr.EvenColor =
              'rgba(' +
              polygon.polygon.material.evenColor._value.red * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.green * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.blue * 255 +
              ', ' +
              polygon.polygon.material.evenColor._value.alpha +
              ')'
            this.PolygonAttr.OddColor =
              'rgba(' +
              polygon.polygon.material.oddColor._value.red * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.green * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.blue * 255 +
              ', ' +
              polygon.polygon.material.oddColor._value.alpha +
              ')'
            this.PolygonAttr.checkerboardNumN = polygon.polygon.material.repeat._value.x
            this.PolygonAttr.checkerboardNumV = polygon.polygon.material.repeat._value.y
          }
        } else {
          this.PolygonAttr.fill = false
        }
        if (polygon.polygon.outline === undefined || !polygon.polygon.outline._value) {
          this.outlineAttr = false
          this.PolygonAttr.outline = false
        } else {
          this.PolygonAttr.outline = true
          this.outlineAttr = true
          if (polygon.polygon.outlineColor === undefined) {
            this.PolygonAttr.OutLineColor = 'rgba(0, 0, 0, 1)'
          } else {
            this.PolygonAttr.OutLineColor =
              'rgba(' +
              polygon.polygon.outlineColor._value.red * 255 +
              ', ' +
              polygon.polygon.outlineColor._value.green * 255 +
              ', ' +
              polygon.polygon.outlineColor._value.blue * 255 +
              ', ' +
              polygon.polygon.outlineColor._value.alpha +
              ')'
          }
        }
      }
    },
    left: function(n, o) {
      const canWidth = Viewer.scene.canvas.width
      if (n.slice(0, n.length - 2) / canWidth > (canWidth - this.width) / canWidth) {
        this.leftVal = canWidth - this.width
      } else {
        this.leftVal = parseInt(n)
      }
    },
    top: function(n, o) {
      const canHeight = Viewer.scene.canvas.height
      const height = 80 + Number(this.$refs.polygonPanel.style.height.slice(0, this.$refs.polygonPanel.style.height.length - 2))
      if (n.slice(0, n.length - 2) / canHeight > (canHeight - height) / canHeight) {
        this.topVal = canHeight - height
      } else {
        this.topVal = parseInt(n) + 5
      }
    }
  },
  methods: {
    init() {
      // 绘制完后把所有选择的属性重置
      Object.assign(this.$data, this.$options.data())
    },
    define() {
      // 确定按钮
      const polygonAttr = Viewer.entities.getById(this.polygonEntity).polygon
      const polygonData = {
        id: this.polygonEntity,
        ground: this.PolygonAttr.ground,
        outline: this.PolygonAttr.outline,
        fill: this.PolygonAttr.fill,
        position: polygonAttr.hierarchy._value.positions
      }
      if (this.PolygonAttr.ground !== 1) {
        polygonData.height = this.PolygonAttr.polygonHeight
      }
      if (this.PolygonAttr.outline) {
        polygonData.OutLineColor = this.PolygonAttr.OutLineColor
      }
      if (this.PolygonAttr.fill) {
        polygonData.Material = this.PolygonAttr.Material
      }
      if (this.PolygonAttr.Material === '纯色') {
        polygonData.FillColor = this.PolygonAttr.FillColor
      } else if (this.PolygonAttr.Material === '图片') {
        polygonData.image = polygonAttr.material.image._value
        polygonData.imageNum = polygonAttr.material.repeat._value
      } else if (this.PolygonAttr.Material === '网格') {
        polygonData.FillColor = this.PolygonAttr.FillColor
        polygonData.gridNum = polygonAttr.material.lineCount._value
        polygonData.gridLineWidth = polygonAttr.material.lineThickness._value
        polygonData.gridAlpha = polygonAttr.material.cellAlpha._value
      } else if (this.PolygonAttr.Material === '条纹') {
        polygonData.EvenColor = this.PolygonAttr.EvenColor
        polygonData.OddColor = this.PolygonAttr.OddColor
        polygonData.orientation = polygonAttr.material.orientation._value
        polygonData.stripeNum = polygonAttr.material.repeat._value
      } else if (this.PolygonAttr.Material === '棋盘') {
        polygonData.EvenColor = this.PolygonAttr.EvenColor
        polygonData.OddColor = this.PolygonAttr.OddColor
        polygonData.checkerboardNum = polygonAttr.material.repeat._value
      }
      if (this.pattern === '编辑多边形') {
        for (const i in window.drawFileData.polygon) {
          if ((window.drawFileData.polygon[i].id = polygonData.id)) {
            window.drawFileData.polygon[i] = polygonData
            break
          }
        }
      } else {
        window.drawFileData.polygon.push(polygonData)
      }
      // 数据预存
      this.$emit('define', false)
      this.init()
    },
    cancel() {
      // 取消按钮
      this.$emit('cancel', false)
      if (this.pattern === '编辑多边形') {
        for (const i in window.drawFileData.polygon) {
          if ((window.drawFileData.polygon[i].id = this.polygonEntity)) {
            Viewer.entities.getById(this.polygonEntity).polygon.hierarchy = new Cesium.PolygonHierarchy(window.drawFileData.polygon[i].position)
            Viewer.entities.getById(this.polygonEntity).polygon.heightReference = window.drawFileData.polygon[i].ground
            Viewer.entities.getById(this.polygonEntity).polygon.fill = window.drawFileData.polygon[i].fill
            Viewer.entities.getById(this.polygonEntity).polygon.outline = window.drawFileData.polygon[i].outline
            if (window.drawFileData.polygon[i].fill) {
              if (window.drawFileData.polygon[i].Material === '纯色') {
                Viewer.entities.getById(this.polygonEntity).polygon.material = this.colorDataChange(window.drawFileData.polygon[i].FillColor)
              } else if (window.drawFileData.polygon[i].Material === '图片') {
                Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.ImageMaterialProperty({
                  image: window.drawFileData.polygon[i].image,
                  repeat: window.drawFileData.polygon[i].imageNum,
                  transparent: true
                })
              } else if (window.drawFileData.polygon[i].Material === '网格') {
                Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.GridMaterialProperty({
                  color: this.colorDataChange(window.drawFileData.polygon[i].FillColor),
                  cellAlpha: window.drawFileData.polygon[i].gridAlpha,
                  lineCount: window.drawFileData.polygon[i].gridNum,
                  lineThickness: window.drawFileData.polygon[i].gridLineWidth
                })
              } else if (window.drawFileData.polygon[i].Material === '条纹') {
                Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.StripeMaterialProperty({
                  evenColor: this.colorDataChange(window.drawFileData.polygon[i].EvenColor),
                  oddColor: this.colorDataChange(window.drawFileData.polygon[i].OddColor),
                  repeat: window.drawFileData.polygon[i].stripeNum,
                  orientation: window.drawFileData.polygon[i].orientation
                })
              } else if (window.drawFileData.polygon[i].Material === '棋盘') {
                Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.CheckerboardMaterialProperty({
                  evenColor: this.colorDataChange(window.drawFileData.polygon[i].EvenColor),
                  oddColor: this.colorDataChange(window.drawFileData.polygon[i].OddColor),
                  repeat: window.drawFileData.polygon[i].checkerboardNum
                })
              }
            }
            if (window.drawFileData.polygon[i].outline) {
              Viewer.entities.getById(this.polygonEntity).polygon.outlineColor = this.colorDataChange(window.drawFileData.polygon[i].OutLineColor)
            }
            if (window.drawFileData.polygon[i].ground !== 1) {
              Viewer.entities.getById(this.polygonEntity).polygon.height = window.drawFileData.polygon[i].height
            }
          }
        }
      } else {
        Viewer.entities.remove(Viewer.entities.getById(this.polygonEntity))
      }
      this.init()
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
    polygonHeight() {
      // 不贴地情况下的高度
      if (this.PolygonAttr.ground === 0 || this.PolygonAttr.ground === 2) {
        Viewer.entities.getById(this.polygonEntity).polygon.height = Number(this.PolygonAttr.polygonHeight)
      }
    },
    ground() {
      // 多边形的模式
      Viewer.entities.getById(this.polygonEntity).polygon.heightReference = this.PolygonAttr.ground
      if (this.PolygonAttr.ground === 1) {
        this.heightShow = false
        Viewer.entities.getById(this.polygonEntity).polygon.height = undefined
        this.PolygonAttr.outline = false
        this.outlineBe = true
        Viewer.entities.getById(this.polygonEntity).polygon.outline = false
        this.PolygonAttr.fill = true
        this.fillBe = true
        Viewer.entities.getById(this.polygonEntity).polygon.fill = true
        this.outlineAttr = false
      } else if (this.PolygonAttr.ground === 0) {
        this.heightShow = true
        Viewer.entities.getById(this.polygonEntity).polygon.height = this.PolygonAttr.polygonHeight
        this.outlineBe = false
        this.fillBe = false
      } else if (this.PolygonAttr.ground === 2) {
        this.heightShow = true
        Viewer.entities.getById(this.polygonEntity).polygon.height = this.PolygonAttr.polygonHeight
        this.outlineBe = false
        this.fillBe = false
      }
    },
    outline() {
      // 是否有外边线轮廓
      if (!this.PolygonAttr.outline && !this.PolygonAttr.fill) {
        Viewer.entities.getById(this.polygonEntity).polygon.outline = this.PolygonAttr.outline
        Viewer.entities.getById(this.polygonEntity).polygon.fill = true
        this.PolygonAttr.fill = true
      } else {
        Viewer.entities.getById(this.polygonEntity).polygon.outline = this.PolygonAttr.outline
      }
      this.outlineAttr = this.PolygonAttr.outline
    },
    fill() {
      // 是否有填充
      if (!this.PolygonAttr.outline && !this.PolygonAttr.fill) {
        Viewer.entities.getById(this.polygonEntity).polygon.fill = this.PolygonAttr.fill
        Viewer.entities.getById(this.polygonEntity).polygon.outline = true
        this.PolygonAttr.outline = true
      } else {
        Viewer.entities.getById(this.polygonEntity).polygon.fill = this.PolygonAttr.fill
      }
      this.outlineAttr = this.PolygonAttr.outline
    },
    changeOutLineColor(color) {
      // 改变轮廓的颜色
      Viewer.entities.getById(this.polygonEntity).polygon.outlineColor = this.colorDataChange(color)
    },
    SetMaterials() {
      // 使用什么材质
      if (this.PolygonAttr.Material === '纯色') {
        this.stripeShow = false
        this.oddEven = false
        this.gridShow = false
        this.colorShow = true
        this.imageShow = false
        this.checkerboardShow = false
        Viewer.entities.getById(this.polygonEntity).polygon.material = this.colorDataChange(this.PolygonAttr.FillColor)
      } else if (this.PolygonAttr.Material === '图片') {
        this.stripeShow = false
        this.oddEven = false
        this.gridShow = false
        this.colorShow = false
        this.imageShow = true
        this.checkerboardShow = false
        Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.ImageMaterialProperty({
          image: this.PolygonAttr.imgUrl,
          repeat: new Cesium.Cartesian2(this.PolygonAttr.imageRepeatH, this.PolygonAttr.imageRepeatV),
          transparent: true
        })
      } else if (this.PolygonAttr.Material === '网格') {
        this.stripeShow = false
        this.oddEven = false
        this.gridShow = true
        this.colorShow = true
        this.imageShow = false
        this.checkerboardShow = false
        Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.GridMaterialProperty({
          color: this.colorDataChange(this.PolygonAttr.FillColor),
          cellAlpha: this.PolygonAttr.gridAlpha,
          lineCount: new Cesium.Cartesian2(this.PolygonAttr.gridLineNumN, this.PolygonAttr.gridLineNumV),
          lineThickness: new Cesium.Cartesian2(this.PolygonAttr.gridLineWidthN, this.PolygonAttr.gridLineWidthV)
        })
      } else if (this.PolygonAttr.Material === '条纹') {
        this.stripeShow = true
        this.oddEven = true
        this.gridShow = false
        this.colorShow = false
        this.imageShow = false
        this.checkerboardShow = false
        let StripeOrientation = null
        if (this.PolygonAttr.stripeOrientation === '横向') {
          StripeOrientation = Cesium.StripeOrientation.HORIZONTAL
        } else {
          StripeOrientation = Cesium.StripeOrientation.VERTICAL
        }
        Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.StripeMaterialProperty({
          evenColor: this.colorDataChange(this.PolygonAttr.EvenColor),
          oddColor: this.colorDataChange(this.PolygonAttr.OddColor),
          repeat: this.PolygonAttr.stripeNum,
          orientation: StripeOrientation
        })
      } else if (this.PolygonAttr.Material === '棋盘') {
        this.stripeShow = false
        this.oddEven = true
        this.gridShow = false
        this.colorShow = false
        this.imageShow = false
        this.checkerboardShow = true
        Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.CheckerboardMaterialProperty({
          evenColor: this.colorDataChange(this.PolygonAttr.EvenColor),
          oddColor: this.colorDataChange(this.PolygonAttr.OddColor),
          repeat: new Cesium.Cartesian2(this.PolygonAttr.checkerboardNumN, this.PolygonAttr.checkerboardNumV)
        })
      }
    },
    changeFillColor(color) {
      // 网格和纯色材质时改变填充颜色
      if (this.PolygonAttr.Material === '纯色') {
        Viewer.entities.getById(this.polygonEntity).polygon.material = this.colorDataChange(color)
      } else if (this.PolygonAttr.Material === '网格') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.color = this.colorDataChange(color)
      }
    },
    selectThisimage() {
      this.$refs.polygonImage.click()
    },
    selectImage(event) {
      // 图片材质时选择图片
      const that = this
      const reader = new FileReader()
      const file = event.target.files[0]
      reader.readAsDataURL(file)
      reader.onload = function() {
        that.PolygonAttr.imgUrl = reader.result
        if (that.PolygonAttr.Material === '图片') {
          Viewer.entities.getById(that.polygonEntity).polygon.material = new Cesium.ImageMaterialProperty({
            image: reader.result,
            repeat: new Cesium.Cartesian2(that.PolygonAttr.imageRepeatH, that.PolygonAttr.imageRepeatV),
            transparent: true
          })
        }
      }
    },
    imageRepeat() {
      // 图片材质时图片的数量
      if (this.PolygonAttr.Material === '图片') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.repeat = new Cesium.Cartesian2(this.PolygonAttr.imageRepeatH, this.PolygonAttr.imageRepeatV)
      }
    },
    polygonImage() {
      if (this.PolygonAttr.Material === '图片') {
        Viewer.entities.getById(this.polygonEntity).polygon.material = new Cesium.ImageMaterialProperty({
          image: this.PolygonAttr.img,
          repeat: new Cesium.Cartesian2(this.PolygonAttr.imageRepeatH, this.PolygonAttr.imageRepeatV),
          transparent: true
        })
      }
    },
    gridLineNum() {
      // 网格材质时网格线的数量
      if (this.PolygonAttr.Material === '网格') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.lineCount = new Cesium.Cartesian2(this.PolygonAttr.gridLineNumN, this.PolygonAttr.gridLineNumV)
      }
    },
    gridLineWidth() {
      // 网格材质时网格线的宽度
      if (this.PolygonAttr.Material === '网格') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.lineThickness = new Cesium.Cartesian2(this.PolygonAttr.gridLineWidthN, this.PolygonAttr.gridLineWidthV)
      }
    },
    gridAlpha() {
      // 网格材质时格子的透明度
      if (this.PolygonAttr.Material === '网格') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.cellAlpha = this.PolygonAttr.gridAlpha
      }
    },
    changeEvenColor(color) {
      // 棋盘或者条纹材质时调整第一种颜色
      if (this.PolygonAttr.Material === '棋盘' || this.PolygonAttr.Material === '条纹') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.evenColor = this.colorDataChange(color)
      }
    },
    changeOddColor(color) {
      // 棋盘或者条纹材质时调整第二种颜色
      if (this.PolygonAttr.Material === '棋盘' || this.PolygonAttr.Material === '条纹') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.oddColor = this.colorDataChange(color)
      }
    },
    stripeOrientation() {
      // 条纹材质时调整条纹的方向
      if (this.PolygonAttr.Material === '条纹') {
        if (this.PolygonAttr.stripeOrientation === '横向') {
          Viewer.entities.getById(this.polygonEntity).polygon.material.orientation = Cesium.StripeOrientation.HORIZONTAL
        } else {
          Viewer.entities.getById(this.polygonEntity).polygon.material.orientation = Cesium.StripeOrientation.VERTICAL
        }
      }
    },
    stripeNum() {
      // 条纹材质时调整条纹的数量
      if (this.PolygonAttr.Material === '条纹') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.repeat = this.PolygonAttr.stripeNum
      }
    },
    checkerboardNum() {
      // 棋盘材质时调整棋盘格子的个数
      if (this.PolygonAttr.Material === '棋盘') {
        Viewer.entities.getById(this.polygonEntity).polygon.material.repeat = new Cesium.Cartesian2(this.PolygonAttr.checkerboardNumN, this.PolygonAttr.checkerboardNumV)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.polygonPanel {
  position: relative;
  top: 35px;
}
.btn {
  float: right;
  position: relative;
  right: 10px;
  bottom: 5px;
}
.type {
  padding: 5px 0;
}
.seLable {
  margin: 0 0 0 10px;
}
.color {
  position: relative;
  top: -15px;
}
.fillType {
  position: relative;
  left: -6px;
}
.file {
  position: relative;
  left: 5px;
}
</style>
<style lang="scss">
.polygonPanel {
  .el-radio,
  .el-checkbox {
    color: white !important;
    margin: 0 0 0 5px;
  }

  .el-input__inner {
    height: 30px !important;
  }
  .demo-input-size .el-input {
    width: 35%;
    position: relative;
    left: 5px;
  }
  .el-button--primary.is-plain {
    margin: 0 0 0 10px !important;
  }
  .el-select {
    width: 50% !important;
  }
}
</style>
