<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <div>
    <!--<drag-model
      :title="modelSelect"
      width="850px"
      left="10%"
      top="80%"
      :visible.sync="Selectvisible"
      @close="cancelSelect"
    >-->
    <dialogPage
      :width="850"
      :left="350"
      :bottom="100"
      height="170"
      :dialogShow="Selectvisible"
      @close="cancelSelect"
      :markShow="false"
    >
      <div class="modelSelectPanel">
        <img
          @click="selectModel"
          class="modelImg"
          width="80"
          v-for="item in modelUrlArr"
          :key="item.url"
          :data-modelurl="item.url"
          :src="item.imgUrl"
          alt
        />
        <div>
          <span class="seLable">路径：</span>
          <el-input v-model="modelUrl" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </dialogPage>
    <!--</drag-model>-->
    <!--  <drag-model
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
      <div ref="modelPanel" style="height: 350px;" class="modelPanel">
        <div style="position:relative;top:10px" class="type">
          <span class="seLable">缩放</span>
          <el-input
            @input="zoomTo"
            v-model="zoom"
            style="width:55%;left:30px"
            type="number"
            placeholder="请输入数字"
          ></el-input>
        </div>
        <div style="position:relative;top:20px;left:20px" class="type">
          <el-checkbox @change="fillColorChange" v-model="fillColorShow">是否填充颜色</el-checkbox>
        </div>
        <div v-show="fillColorShow" style="position:relative;top:23px">
          <div class="type">
            <span class="seLable">模式</span>
            <el-radio-group @change="ColorBlendModeChange" v-model="ColorBlendMode">
              <el-radio :label="0">高亮</el-radio>
              <el-radio :label="1">替换</el-radio>
              <el-radio :label="2">混合</el-radio>
            </el-radio-group>
          </div>
          <div class="type color">
            <span style="position:relative;top:-15px" class="seLable">颜色</span>
            <el-color-picker
              @active-change="changeFillColor"
              style="left:30px"
              v-model="FillColor"
              show-alpha
              :predefine="predefineColors"
            ></el-color-picker>
          </div>
          <div v-show="slider" class="type">
            <span class="seLable">混合度</span>
            <el-slider @input="changeMixnum" v-model="mixnum"></el-slider>
          </div>
        </div>
        <div style="position:relative;top:50px;left:20px" class="type">
          <el-checkbox @change="outLineShowChange" v-model="outLineShow">是否有轮廓</el-checkbox>
        </div>
        <div v-show="outLineShow" style="position:relative;top:40px">
          <div class="type color">
            <span style="position:relative;top:-15px" class="seLable">颜色</span>
            <el-color-picker
              @active-change="changeOutLineColor"
              style="left:30px"
              v-model="OutlineColor"
              show-alpha
              :predefine="predefineColors"
            ></el-color-picker>
          </div>
          <div style="position:relative;top:20px" class="type">
            <span class="seLable">线宽</span>
            <el-input
              @input="ChangeOutlineWidth"
              min="1"
              style="width:70%;left:30px"
              type="number"
              v-model="outlineWidth"
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
  </div>
</template>

<script>
export default {
  name: 'model-popover',
  props: {
    modelShow: Boolean,
    modelPanelshow: Boolean,
    modelPrimitive: String,
    pattern: String,
    left: String,
    top: String
  },
  data() {
    return {
      visible: false,
      modelSelect: '模型选择',
      Selectvisible: false,
      modelUrlArr: [
        { url: 'model/Wood_Tower.glb', imgUrl: require('../../assets/image/Wood_Tower.png') },
        { url: 'model/Cesium_Man.glb', imgUrl: require('../../assets/image/Cesium_Man.png') },
        { url: 'model/Cesium_Air.glb', imgUrl: require('../../assets/image/Cesium_Air.png') },
        { url: 'model/CesiumBalloon.glb', imgUrl: require('../../assets/image/CesiumBalloon.png') },
        { url: 'model/CesiumMilkTruck.glb', imgUrl: require('../../assets/image/CesiumMilkTruck.png') },
        { url: 'model/GroundVehicle.glb', imgUrl: require('../../assets/image/GroundVehicle.png') }
      ],
      modelUrl: 'model/Wood_Tower.glb',
      modelIndex: null,
      zoom: 200,
      leftVal: null,
      topVal: null,
      width: 280,
      selectTop: '80%',
      fillColorShow: false,
      outLineShow: false,
      FillColor: 'rgba(255, 0, 0, 1)',
      ColorBlendMode: 0,
      mixnum: 50,
      OutlineColor: 'rgba(255, 0, 0, 1)',
      outlineWidth: 3,
      slider: false,
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
      ]
    }
  },
  watch: {
    modelShow: function(n, o) {
      this.Selectvisible = n
      if (n) {
        this.modelUrl = 'model/Wood_Tower.glb'
      }
    },
    modelPanelshow: function(n, o) {
      this.visible = n
    },
    modelPrimitive: function(n, o) {
      if (n != null) {
        for (const i in Viewer.scene.primitives._primitives) {
          if (Viewer.scene.primitives._primitives[i].id === n) {
            this.modelIndex = Viewer.scene.primitives._primitives.indexOf(Viewer.scene.primitives._primitives[i])
          }
        }
        if (this.pattern === '编辑模型' && this.visible) {
          this.zoom = Viewer.scene.primitives.get(this.modelIndex).scale
          if (
            JSON.stringify(Viewer.scene.primitives.get(this.modelIndex).color) !== JSON.stringify(new Cesium.Color(1, 1, 1, 1)) ||
            Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount !== 0.5 ||
            Viewer.scene.primitives.get(this.modelIndex).colorBlendMode !== 0
          ) {
            this.fillColorShow = true
            this.FillColor =
              'rgba(' +
              Viewer.scene.primitives.get(this.modelIndex).color.red * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).color.green * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).color.blue * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).color.alpha +
              ')'
            this.ColorBlendMode = Viewer.scene.primitives.get(this.modelIndex).colorBlendMode
            if (Viewer.scene.primitives.get(this.modelIndex).colorBlendMode === 2) {
              this.mixnum = Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount * 100
              this.slider = true
            } else {
              this.slider = false
            }
          } else {
            this.fillColorShow = false
          }
          if (Viewer.scene.primitives.get(this.modelIndex).silhouetteSize !== 0) {
            this.outLineShow = true
            this.OutlineColor =
              'rgba(' +
              Viewer.scene.primitives.get(this.modelIndex).silhouetteColor.red * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).silhouetteColor.green * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).silhouetteColor.blue * 255 +
              ', ' +
              Viewer.scene.primitives.get(this.modelIndex).silhouetteColor.alpha +
              ')'
            this.outlineWidth = Viewer.scene.primitives.get(this.modelIndex).silhouetteSize
          } else {
            this.outLineShow = false
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
      const height = 80 + Number(this.$refs.modelPanel.style.height.slice(0, this.$refs.modelPanel.style.height.length - 2))
      if (n.slice(0, n.length - 2) / canHeight > (canHeight - height) / canHeight) {
        this.topVal = canHeight - height
      } else {
        this.topVal = parseInt(n)
      }
    },
    modelUrl: function(n, o) {
      this.$emit('modelUrl', n)
    }
  },
  methods: {
    index() {},
    init() {
      // 绘制完后把所有选择的属性重置
      // Object.assign(this.$data, this.$options.data())
      this.modelIndex = null
      this.zoom = 200
      this.fillColorShow = false
      this.outLineShow = false
      this.FillColor = 'rgba(255, 0, 0, 1)'
      this.ColorBlendMode = 0
      this.mixnum = 50
      this.OutlineColor = 'rgba(255, 0, 0, 1)'
      this.outlineWidth = 3
      this.slider = false
    },
    define() {
      // 确定按钮
      const modelData = {
        id: Viewer.scene.primitives.get(this.modelIndex).id,
        url: Viewer.scene.primitives.get(this.modelIndex).basePath,
        modelMatrix: Viewer.scene.primitives.get(this.modelIndex).modelMatrix.clone(),
        scale: Viewer.scene.primitives.get(this.modelIndex).scale,
        color: Viewer.scene.primitives.get(this.modelIndex).color,
        colorBlendAmount: Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount,
        colorBlendMode: Viewer.scene.primitives.get(this.modelIndex).colorBlendMode,
        silhouetteColor: Viewer.scene.primitives.get(this.modelIndex).silhouetteColor,
        silhouetteSize: Viewer.scene.primitives.get(this.modelIndex).silhouetteSize
      }
      if (this.pattern === '编辑模型') {
        for (const i in window.drawFileData.model) {
          if (window.drawFileData.model[i].id === modelData.id) {
            window.drawFileData.model[i] = modelData
            break
          }
        }
      } else {
        window.drawFileData.model.push(modelData)
      }
      this.modelUrl = null
      // 把数据预存导出文件时用
      this.init()
      this.$emit('close', false)
      this.$emit('modelPrimitive')
    },
    cancel() {
      // 取消按钮
      if (this.pattern === '编辑模型') {
        for (const i in window.drawFileData.model) {
          if (window.drawFileData.model[i].id === this.modelPrimitive) {
            Viewer.scene.primitives.get(this.modelIndex).modelMatrix = window.drawFileData.model[i].modelMatrix.clone()
            Viewer.scene.primitives.get(this.modelIndex).scale = window.drawFileData.model[i].scale
            Viewer.scene.primitives.get(this.modelIndex).color = window.drawFileData.model[i].color
            Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount = window.drawFileData.model[i].colorBlendAmount
            Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = window.drawFileData.model[i].colorBlendMode
            Viewer.scene.primitives.get(this.modelIndex).silhouetteColor = window.drawFileData.model[i].silhouetteColor
            Viewer.scene.primitives.get(this.modelIndex).silhouetteSize = window.drawFileData.model[i].silhouetteSize
          }
        }
      } else {
        Viewer.scene.primitives.remove(Viewer.scene.primitives.get(this.modelIndex))
      }
      this.modelUrl = null
      this.init()
      this.$emit('close', false)
      this.$emit('modelPrimitive')
    },
    cancelSelect() {
      this.$emit('Select', false)
    },
    zoomTo() {
      // 模型放大缩小
      Viewer.scene.primitives.get(this.modelIndex).scale = this.zoom
    },
    selectModel(e) {
      this.modelUrl = e.target.getAttribute('data-modelurl')
    },
    fillColorChange() {
      if (this.fillColorShow) {
        Viewer.scene.primitives.get(this.modelIndex).color = this.colorDataChange(this.FillColor)
        Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount = this.mixnum / 100
        Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = this.ColorBlendMode
      } else {
        Viewer.scene.primitives.get(this.modelIndex).color = new Cesium.Color(1, 1, 1, 1)
        Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount = 0.5
        Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = 0
      }
    },
    ColorBlendModeChange() {
      if (this.ColorBlendMode === 0) {
        Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = Cesium.ColorBlendMode.HIGHLIGHT
        this.slider = false
      } else if (this.ColorBlendMode === 1) {
        Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = Cesium.ColorBlendMode.REPLACE
        this.slider = false
      } else if (this.ColorBlendMode === 2) {
        Viewer.scene.primitives.get(this.modelIndex).colorBlendMode = Cesium.ColorBlendMode.MIX
        this.slider = true
      }
    },
    changeFillColor(color) {
      Viewer.scene.primitives.get(this.modelIndex).color = this.colorDataChange(color)
    },
    changeMixnum() {
      if (Viewer.scene.primitives.get(this.modelIndex) !== undefined) {
        Viewer.scene.primitives.get(this.modelIndex).colorBlendAmount = this.mixnum / 100
      }
    },
    outLineShowChange() {
      if (this.outLineShow) {
        Viewer.scene.primitives.get(this.modelIndex).silhouetteSize = this.outlineWidth
        Viewer.scene.primitives.get(this.modelIndex).silhouetteColor = this.colorDataChange(this.OutlineColor)
      } else {
        Viewer.scene.primitives.get(this.modelIndex).silhouetteSize = 0
        Viewer.scene.primitives.get(this.modelIndex).silhouetteColor = new Cesium.Color(1, 0, 0, 1)
      }
    },
    changeOutLineColor(color) {
      Viewer.scene.primitives.get(this.modelIndex).silhouetteColor = this.colorDataChange(color)
    },
    ChangeOutlineWidth() {
      Viewer.scene.primitives.get(this.modelIndex).silhouetteSize = this.outlineWidth
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
    }
  }
}
</script>

<style lang="scss" scoped>
.btn {
  float: right;
  position: relative;
  right: 10px;
  bottom: 30px;
}
.seLable {
  position: relative;
  left: 20px;
}
.modelImg {
  margin: 5px;
  cursor: pointer;
  border: 1px solid white;
}
.modelImg:hover {
  border: 1px solid gray;
}
.type {
  color: white !important;
}
.color {
  position: relative;
  top: 16px;
}
</style>
<style lang="scss">
.modelSelectPanel {
  height: 150px;
  padding: 15px 20px;
  .el-radio {
    color: white !important;
    margin: 5px 30px !important;
    width: 80px !important;
  }
  .el-input {
    width: 70%;
    position: relative;
    left: 20px;
  }
  .el-input__inner {
    height: 30px;
  }
}
.modelPanel {
  padding: 15px 0 0 0;
  .el-input__inner {
    height: 30px;
  }
  .el-checkbox {
    color: white !important;
  }
  .el-radio {
    color: white !important;
    margin-left: 25px !important;
    margin-right: 0 !important;
  }
  .el-slider {
    display: inline-block;
    position: relative;
    top: 14px;
    left: 42px;
  }
  .el-slider__runway {
    width: 150px !important;
  }
}
</style>
