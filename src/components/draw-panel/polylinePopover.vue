<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <!-- <drag-model
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
    height="410"
    :dialogShow="visible"
    @close="cancel"
    :markShow="false"
  >
    <div ref="polylinePanel" style="height: 300px;" class="polylinePanel">
      <div class="type">
        <el-radio-group @change="linear()" v-model="PolylineAttr.lineType" size="mini">
          <el-radio label="大地线" border>大地线</el-radio>
          <el-radio label="直线" border>直线</el-radio>
        </el-radio-group>
      </div>
      <div class="type">
        <el-checkbox
          @change="Attachment()"
          v-model="PolylineAttr.Ground"
          :disabled="AttachmentShow"
        >是否贴地</el-checkbox>
      </div>
      <div class="type">
        <span class="seLable">线型</span>
        <el-select @change="SetMaterials()" v-model="PolylineAttr.lineMaterial" placeholder="请选择线型">
          <el-option
            v-for="item in lineMaterialArray"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="type">
        <span class="seLable color">颜色</span>
        <el-color-picker
          @active-change="changeLineColor"
          v-model="PolylineAttr.color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
      <div class="type">
        <span class="seLable">线宽</span>
        <el-input
          min="1"
          @input="lineWidth()"
          style="width:70%;left:40px"
          type="number"
          v-model="PolylineAttr.lineWidth"
          placeholder="请输入数字"
        ></el-input>
      </div>
      <div v-show="outline">
        <div class="type">
          <span class="seLable outline">轮廓线宽</span>
          <el-input
            min="1"
            @input="OutLineWidth()"
            style="width:70%;left:8px"
            type="number"
            v-model="PolylineAttr.OutLineWidth"
            placeholder="请输入数字"
          ></el-input>
        </div>
        <div class="type">
          <span class="seLable color outline">轮廓颜色</span>
          <el-color-picker
            style="left:9px"
            @active-change="changeOutLineColor"
            v-model="PolylineAttr.OutLineColor"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </div>
      </div>
      <div v-show="clearance">
        <div class="type">
          <span class="seLable outline">间隙长度</span>
          <el-input
            min="1"
            @input="clearanceLength()"
            style="width:70%;left:8px"
            type="number"
            v-model="PolylineAttr.clearanceLength"
            placeholder="请输入数字"
          ></el-input>
        </div>
        <div class="type">
          <span class="seLable color outline">间隙颜色</span>
          <el-color-picker
            style="left:9px"
            @active-change="clearanceColor"
            v-model="PolylineAttr.clearanceColor"
            show-alpha
            :predefine="predefineColors"
          ></el-color-picker>
        </div>
      </div>
      <div v-show="Luminescence">
        <div class="type">
          <span class="seLable outline">发光强度</span>
          <el-input
            min="1"
            @input="brightness()"
            style="width:70%;left:8px"
            type="number"
            v-model="PolylineAttr.brightness"
            placeholder="请输入数字"
          ></el-input>
        </div>
        <div class="type">
          <span class="seLable outline">渐变强度</span>
          <el-input
            min="1"
            @input="GradientIntensity()"
            style="width:70%;left:8px"
            type="number"
            v-model="PolylineAttr.GradientIntensity"
            placeholder="请输入数字"
          ></el-input>
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
  name: 'polyline-popover',
  props: {
    polylineEntity: String,
    polylineShow: Boolean,
    left: String,
    top: String,
    pattern: String
  },
  data() {
    return {
      visible: false,
      AttachmentShow: false,
      outline: false,
      clearance: false,
      Luminescence: false,
      PolylineAttr: {
        lineWidth: 3,
        color: 'rgba(255, 0, 0, 1)',
        lineMaterial: '纯色',
        lineType: '大地线',
        Ground: false,
        OutLineColor: 'rgba(0, 0, 0, 1)',
        OutLineWidth: 1,
        clearanceLength: 16,
        clearanceColor: 'rgba(1, 1, 1, 0)',
        brightness: 25,
        GradientIntensity: 100
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
      lineMaterialArray: [
        {
          value: '纯色',
          label: '纯色'
        },
        {
          value: '轮廓',
          label: '轮廓'
        },
        {
          value: '虚线',
          label: '虚线'
        },
        {
          value: '箭头',
          label: '箭头'
        },
        {
          value: '发光',
          label: '发光'
        }
      ],
      leftVal: null,
      topVal: null,
      width: 280
    }
  },
  watch: {
    polylineShow: function(n, o) {
      this.visible = n
      if (n && this.pattern === '编辑折线') {
        const polyline = Viewer.entities.getById(this.polylineEntity)
        this.PolylineAttr.lineWidth = polyline.polyline.width._value
        if (polyline.polyline.clampToGround !== undefined) {
          this.PolylineAttr.Ground = polyline.polyline.clampToGround._value
        }
        if (polyline.polyline.arcType === undefined || polyline.polyline.arcType._value === 1) {
          this.PolylineAttr.lineType = '大地线'
        } else {
          this.PolylineAttr.lineType = '直线'
        }
        this.PolylineAttr.color =
          'rgba(' +
          polyline.polyline.material.color._value.red * 255 +
          ', ' +
          polyline.polyline.material.color._value.green * 255 +
          ', ' +
          polyline.polyline.material.color._value.blue * 255 +
          ', ' +
          polyline.polyline.material.color._value.alpha +
          ')'
        if (polyline.polyline.material instanceof Cesium.PolylineOutlineMaterialProperty) {
          this.PolylineAttr.lineMaterial = '轮廓'
          this.outline = true
          this.clearance = false
          this.Luminescence = false
          this.PolylineAttr.OutLineColor =
            'rgba(' +
            polyline.polyline.material.outlineColor._value.red * 255 +
            ', ' +
            polyline.polyline.material.outlineColor._value.green * 255 +
            ', ' +
            polyline.polyline.material.outlineColor._value.blue * 255 +
            ', ' +
            polyline.polyline.material.outlineColor._value.alpha +
            ')'
          this.PolylineAttr.OutLineWidth = polyline.polyline.material.outlineWidth._value
        } else if (polyline.polyline.material instanceof Cesium.PolylineDashMaterialProperty) {
          this.PolylineAttr.lineMaterial = '虚线'
          this.outline = false
          this.clearance = true
          this.Luminescence = false
          this.PolylineAttr.clearanceLength = polyline.polyline.material.dashLength._value
          this.PolylineAttr.clearanceColor =
            'rgba(' +
            polyline.polyline.material.gapColor._value.red * 255 +
            ', ' +
            polyline.polyline.material.gapColor._value.green * 255 +
            ', ' +
            polyline.polyline.material.gapColor._value.blue * 255 +
            ', ' +
            polyline.polyline.material.gapColor._value.alpha +
            ')'
        } else if (polyline.polyline.material instanceof Cesium.PolylineGlowMaterialProperty) {
          this.PolylineAttr.lineMaterial = '发光'
          this.outline = false
          this.clearance = false
          this.Luminescence = true
          this.PolylineAttr.brightness = polyline.polyline.material.glowPower._value
          this.PolylineAttr.GradientIntensity = polyline.polyline.material.taperPower._value
        } else if (polyline.polyline.material instanceof Cesium.ColorMaterialProperty) {
          this.PolylineAttr.lineMaterial = '纯色'
          this.outline = false
          this.clearance = false
          this.Luminescence = true
        } else if (polyline.polyline.material instanceof Cesium.PolylineArrowMaterialProperty) {
          this.PolylineAttr.lineMaterial = '箭头'
          this.outline = false
          this.clearance = false
          this.Luminescence = true
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
      const height = 80 + Number(this.$refs.polylinePanel.style.height.slice(0, this.$refs.polylinePanel.style.height.length - 2))
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
      const polylineData = {
        id: this.polylineEntity,
        lineWidth: this.PolylineAttr.lineWidth,
        color: this.PolylineAttr.color,
        Material: this.PolylineAttr.lineMaterial,
        lineType: this.PolylineAttr.lineType,
        Ground: this.PolylineAttr.Ground,
        position: Viewer.entities.getById(this.polylineEntity).polyline.positions._value
      }
      if (this.PolylineAttr.lineMaterial === '轮廓') {
        polylineData.OutLineColor = this.PolylineAttr.OutLineColor
        polylineData.OutLineWidth = this.PolylineAttr.OutLineWidth
      } else if (this.PolylineAttr.lineMaterial === '虚线') {
        polylineData.clearanceLength = this.PolylineAttr.clearanceLength
        polylineData.clearanceColor = this.PolylineAttr.clearanceColor
      } else if (this.PolylineAttr.lineMaterial === '发光') {
        polylineData.brightness = this.PolylineAttr.brightness
        polylineData.GradientIntensity = this.PolylineAttr.GradientIntensity
      }
      if (this.pattern === '编辑折线') {
        for (const i in window.drawFileData.polyline) {
          if (window.drawFileData.polyline[i].id === polylineData.id) {
            window.drawFileData.polyline[i] = polylineData
            break
          }
        }
      } else {
        window.drawFileData.polyline.push(polylineData)
      }
      // 数据预存
      this.$emit('define', false)
      this.init()
    },
    cancel() {
      // 取消按钮
      this.$emit('cancel', false)
      if (this.pattern === '编辑折线') {
        for (const i in window.drawFileData.polyline) {
          if (window.drawFileData.polyline[i].id === this.polylineEntity) {
            Viewer.entities.getById(this.polylineEntity).polyline.show = true
            Viewer.entities.getById(this.polylineEntity).polyline.positions = window.drawFileData.polyline[i].position
            Viewer.entities.getById(this.polylineEntity).polyline.width = window.drawFileData.polyline[i].lineWidth
            Viewer.entities.getById(this.polylineEntity).polyline.clampToGround = window.drawFileData.polyline[i].Ground
            Viewer.entities.getById(this.polylineEntity).polyline.arcType = window.drawFileData.polyline[i].lineType === '大地线' ? Cesium.ArcType.GEODESIC : Cesium.ArcType.NONE
            Viewer.entities.getById(this.polylineEntity).polyline.material = this.colorDataChange(window.drawFileData.polyline[i].color)
            if (window.drawFileData.polyline[i].Material === '轮廓') {
              Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineOutlineMaterialProperty({
                color: this.colorDataChange(window.drawFileData.polyline[i].color),
                outlineColor: this.colorDataChange(window.drawFileData.polyline[i].OutLineColor),
                outlineWidth: window.drawFileData.polyline[i].OutLineWidth
              })
            } else if (window.drawFileData.polyline[i].Material === '虚线') {
              Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineDashMaterialProperty({
                color: this.colorDataChange(window.drawFileData.polyline[i].color),
                gapColor: this.colorDataChange(window.drawFileData.polyline[i].clearanceColor),
                dashLength: window.drawFileData.polyline[i].clearanceLength,
                dashPattern: 255
              })
            } else if (window.drawFileData.polyline[i].Material === '发光') {
              Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineGlowMaterialProperty({
                color: this.colorDataChange(window.drawFileData.polyline[i].color),
                glowPower: window.drawFileData.polyline[i].brightness / 100,
                taperPower: window.drawFileData.polyline[i].GradientIntensity / 100
              })
            } else if (window.drawFileData.polyline[i].Material === '箭头') {
              Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineArrowMaterialProperty(this.colorDataChange(window.drawFileData.polyline[i].color))
            }
          }
        }
      } else {
        Viewer.entities.remove(Viewer.entities.getById(this.polylineEntity))
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
    linear() {
      // 线型的变换
      if (this.PolylineAttr.lineType === '直线') {
        this.AttachmentShow = true
        Viewer.entities.getById(this.polylineEntity).polyline.clampToGround = false
        this.PolylineAttr.Ground = false
        Viewer.entities.getById(this.polylineEntity).polyline.arcType = Cesium.ArcType.NONE
      } else if (this.PolylineAttr.lineType === '大地线') {
        this.AttachmentShow = false
        Viewer.entities.getById(this.polylineEntity).polyline.arcType = Cesium.ArcType.GEODESIC
      }
    },
    Attachment() {
      // 是否贴地
      if (this.PolylineAttr.Ground) {
        Viewer.entities.getById(this.polylineEntity).polyline.clampToGround = true
      } else {
        Viewer.entities.getById(this.polylineEntity).polyline.clampToGround = false
      }
    },
    SetMaterials() {
      // 设置材质
      switch (this.PolylineAttr.lineMaterial) {
        case '纯色':
          this.outline = false
          this.clearance = false
          this.Luminescence = false
          Viewer.entities.getById(this.polylineEntity).polyline.material = this.colorDataChange(this.PolylineAttr.color)
          break
        case '轮廓':
          this.outline = true
          this.clearance = false
          this.Luminescence = false
          Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineOutlineMaterialProperty({
            color: this.colorDataChange(this.PolylineAttr.color),
            outlineColor: this.colorDataChange(this.PolylineAttr.OutLineColor),
            outlineWidth: this.PolylineAttr.OutLineWidth
          })
          break
        case '虚线':
          this.outline = false
          this.clearance = true
          this.Luminescence = false
          Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineDashMaterialProperty({
            color: this.colorDataChange(this.PolylineAttr.color),
            gapColor: this.colorDataChange(this.PolylineAttr.clearanceColor),
            dashLength: this.PolylineAttr.clearanceLength,
            dashPattern: 255
          })
          break
        case '发光':
          this.outline = false
          this.clearance = false
          this.Luminescence = true
          Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineGlowMaterialProperty({
            color: this.colorDataChange(this.PolylineAttr.color),
            glowPower: this.PolylineAttr.brightness / 100,
            taperPower: this.PolylineAttr.GradientIntensity / 100
          })
          break
        case '箭头':
          this.outline = false
          this.clearance = false
          this.Luminescence = false
          Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineArrowMaterialProperty(this.colorDataChange(this.PolylineAttr.color))
          break
        default:
          break
      }
    },
    changeLineColor(color) {
      // 折线的颜色的变换
      if (this.PolylineAttr.lineMaterial === '纯色') {
        Viewer.entities.getById(this.polylineEntity).polyline.material = this.colorDataChange(color)
      } else if (this.PolylineAttr.lineMaterial === '箭头') {
        Viewer.entities.getById(this.polylineEntity).polyline.material = new Cesium.PolylineArrowMaterialProperty(this.colorDataChange(color))
      } else {
        Viewer.entities.getById(this.polylineEntity).polyline.material.color = this.colorDataChange(color)
      }
    },
    lineWidth() {
      // 折线的宽
      if (this.PolylineAttr.lineWidth < 0) {
        this.PolylineAttr.lineWidth = 1
      } else if (isNaN(Number(this.PolylineAttr.lineWidth))) {
        this.PolylineAttr.lineWidth = 1
      }
      Viewer.entities.getById(this.polylineEntity).polyline.width = this.PolylineAttr.lineWidth
    },
    OutLineWidth() {
      // 带轮廓的折线的轮廓宽的设置
      if (this.PolylineAttr.lineMaterial === '轮廓') {
        if (this.PolylineAttr.OutLineWidth < 0) {
          this.PolylineAttr.OutLineWidth = 1
        } else if (isNaN(Number(this.PolylineAttr.OutLineWidth))) {
          this.PolylineAttr.OutLineWidth = 1
        }
        Viewer.entities.getById(this.polylineEntity).polyline.material.outlineWidth = this.PolylineAttr.OutLineWidth
      }
    },
    changeOutLineColor(color) {
      // 带轮廓的折线的轮廓颜色的设置
      if (this.PolylineAttr.lineMaterial === '轮廓') {
        Viewer.entities.getById(this.polylineEntity).polyline.material.outlineColor = this.colorDataChange(color)
      }
    },
    clearanceLength() {
      // 改变虚线空白的长度
      if (this.PolylineAttr.lineMaterial === '虚线') {
        if (this.PolylineAttr.clearanceLength < 0) {
          this.PolylineAttr.clearanceLength = 1
        } else if (isNaN(Number(this.PolylineAttr.clearanceLength))) {
          this.PolylineAttr.clearanceLength = 1
        }
        Viewer.entities.getById(this.polylineEntity).polyline.material.dashLength = this.PolylineAttr.clearanceLength
      }
    },
    clearanceColor(color) {
      // 改变虚线的空白颜色
      if (this.PolylineAttr.lineMaterial === '虚线') {
        Viewer.entities.getById(this.polylineEntity).polyline.material.gapColor = this.colorDataChange(color)
      }
    },
    brightness() {
      // 发光折线的亮度
      if (this.PolylineAttr.lineMaterial === '发光') {
        if (this.PolylineAttr.brightness < 0) {
          this.PolylineAttr.brightness = 1
        } else if (isNaN(Number(this.PolylineAttr.brightness))) {
          this.PolylineAttr.brightness = 1
        } else if (this.PolylineAttr.brightness > 100) {
          this.PolylineAttr.brightness = 100
        }
        Viewer.entities.getById(this.polylineEntity).polyline.material.glowPower = this.PolylineAttr.brightness / 100
      }
    },
    GradientIntensity() {
      // 渐变的强度
      if (this.PolylineAttr.lineMaterial === '发光') {
        if (this.PolylineAttr.GradientIntensity < 0) {
          this.PolylineAttr.GradientIntensity = 1
        } else if (isNaN(Number(this.PolylineAttr.GradientIntensity))) {
          this.PolylineAttr.GradientIntensity = 1
        } else if (this.PolylineAttr.GradientIntensity > 100) {
          this.PolylineAttr.GradientIntensity = 100
        }
        Viewer.entities.getById(this.polylineEntity).polyline.material.taperPower = this.PolylineAttr.GradientIntensity / 100
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.polylinePanel {
  position: relative;
  top: 35px;
}
.btn {
  float: right;
  position: relative;
  right: 10px;
  bottom: -25px;
}
.labelColor {
  vertical-align: top;
  display: inline-block;
  padding: 10px 10px;
  font-size: 14px;
}
.seLable {
  position: relative;
  left: 20px;
}
.type {
  padding: 5px 0;
}
.color {
  top: -15px;
}
.outline {
  left: 1px !important;
}
</style>
<style lang="scss">
.polylinePanel {
  .el-select > .el-input {
    width: 90% !important;
    left: 40px !important;
  }
  .el-color-picker {
    left: 40px;
  }
  .el-radio,
  .el-checkbox {
    color: white !important;
  }
  .el-radio-group {
    position: relative;
    left: 41px;
  }
  .el-input__inner {
    height: 30px !important;
  }

  .type .el-checkbox {
    position: relative;
    left: 100px;
  }
}
</style>
