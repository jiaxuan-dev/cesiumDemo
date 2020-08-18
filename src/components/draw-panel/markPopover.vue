<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <dialogPage
    :width="width"
    :left="leftVal"
    :top="topVal"
    height="400"
    :dialogShow="visible"
    @close="cancel"
    :markShow="false"
  >
    <div ref="markPanel" style="height: 350px;" class="markPanel">
      <div class="type">
        <span class="seLable">图片</span>
        <input
          @change="selectImage"
          class="file"
          type="file"
          accept="image/jpeg, image/png, image/jpg"
        />
        <div class="predefineImg">
          <img @click="markImage" v-for="item in imgUrl" :key="item" :src="item" alt />
        </div>
      </div>
      <div class="type">
        <span class="seLable">宽度</span>
        <el-input
          v-model="markWidth"
          @input="changeWidth"
          style="width:70%;left:20px"
          type="number"
          placeholder="请输入数字"
        ></el-input>
      </div>
      <div class="type">
        <span class="seLable">高度</span>
        <el-input
          v-model="markHeight"
          @input="changeHeight"
          style="width:70%;left:20px"
          type="number"
          placeholder="请输入数字"
        ></el-input>
      </div>
      <div class="type">
        <span class="seLable">名字</span>
        <el-input @input="changName" v-model="name" style="width:70%;left:20px" placeholder="请输入"></el-input>
      </div>
      <div class="type">
        <span class="seLable">字号</span>
        <el-input
          @input="changeFontsize"
          v-model="fontsize"
          style="width:70%;left:20px"
          placeholder="请输入数字"
          type="number"
        ></el-input>
      </div>
      <div class="type">
        <span class="seLable color">颜色</span>
        <el-color-picker
          style="left:20px"
          @active-change="changColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
        ></el-color-picker>
      </div>
    </div>
    <div class="btn">
      <el-button type="success" @click="define()" size="mini">确定</el-button>
      <el-button type="danger" @click="cancel()" size="mini">取消</el-button>
    </div>
  </dialogPage>
</template>

<script>
export default {
  name: 'mark-popover',
  props: {
    markEntity: String,
    markShow: Boolean,
    left: String,
    top: String,
    pattern: String
  },
  data() {
    return {
      visible: false,
      markWidth: 32,
      markHeight: 32,
      name: '标注',
      fontsize: 20,
      color: 'rgba(255, 255, 255, 1)',
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
      imgUrl: [
        require('../../assets/image/3.png'),
        require('../../assets/image/4.png'),
        require('../../assets/image/5.png'),
        require('../../assets/image/6.png'),
        require('../../assets/image/7.png'),
        require('../../assets/image/9.png')
      ],
      leftVal: null,
      topVal: null,
      width: 280
    }
  },
  watch: {
    markShow: function(n, o) {
      this.visible = n
      if (n && this.pattern === '编辑标注') {
        const marker = Viewer.entities.getById(this.markEntity)
        this.markWidth = marker.billboard.width === undefined ? 32 : marker.billboard.width._value
        this.markHeight = marker.billboard.height === undefined ? 32 : marker.billboard.height._value
        this.name = marker.label.text._value
        this.fontsize = marker.label.font._value.split('px')[0]
        this.color = 'rgba(' + marker.label.fillColor._value.red * 255 + ', ' + marker.label.fillColor._value.green * 255 + ', ' + marker.label.fillColor._value.blue * 255 + ', 1)'
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
      const height = 80 + Number(this.$refs.markPanel.style.height.slice(0, this.$refs.markPanel.style.height.length - 2))
      if (n.slice(0, n.length - 2) / canHeight > (canHeight - height) / canHeight) {
        this.topVal = canHeight - height
      } else {
        this.topVal = parseInt(n)
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
      const markerData = {
        id: this.markEntity,
        position: Viewer.entities.getById(this.markEntity).position._value.clone(),
        image: Viewer.entities.getById(this.markEntity).billboard.image._value,
        markWidth: this.markWidth,
        markHeight: this.markHeight,
        name: this.name,
        color: this.color,
        fontSize: this.fontsize
      }
      if (this.pattern === '编辑标注') {
        for (const i in window.drawFileData.marker) {
          if (window.drawFileData.marker[i].id === markerData.id) {
            window.drawFileData.marker[i] = markerData
            break
          }
        }
      } else {
        window.drawFileData.marker.push(markerData)
      }
      // 数据预存
      this.$emit('define', false)
      this.init()
    },
    cancel() {
      // 取消按钮
      this.$emit('cancel', false)
      if (this.pattern === '编辑标注') {
        for (const i in window.drawFileData.marker) {
          if (window.drawFileData.marker[i].id === this.markEntity) {
            Viewer.entities.getById(this.markEntity).billboard.position = window.drawFileData.marker[i].position.clone()
            Viewer.entities.getById(this.markEntity).billboard.image = window.drawFileData.marker[i].image
            Viewer.entities.getById(this.markEntity).billboard.width = window.drawFileData.marker[i].markWidth
            Viewer.entities.getById(this.markEntity).billboard.height = window.drawFileData.marker[i].markHeight
            Viewer.entities.getById(this.markEntity).label.text = window.drawFileData.marker[i].name
            Viewer.entities.getById(this.markEntity).label.fillColor = this.colorDataChange(window.drawFileData.marker[i].color)
            Viewer.entities.getById(this.markEntity).label.font = window.drawFileData.marker[i].fontSize + 'px sans-serif'
          }
        }
      } else {
        Viewer.entities.remove(Viewer.entities.getById(this.markEntity))
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
    markImage(e) {
      this.markWidth = e.target.width
      this.markHeight = e.target.height
      Viewer.entities.getById(this.markEntity).billboard.width = e.target.width
      Viewer.entities.getById(this.markEntity).billboard.height = e.target.height
      Viewer.entities.getById(this.markEntity).billboard.image = e.target.src
    },
    selectImage(event) {
      const that = this
      const reader = new FileReader()
      const file = event.target.files[0]
      reader.readAsDataURL(file)
      reader.onload = function() {
        Viewer.entities.getById(that.markEntity).billboard.image = reader.result
        const img = new Image()
        img.src = reader.result
        img.onload = function() {
          that.markWidth = img.width
          that.markHeight = img.height
        }
      }
    },
    changeWidth() {
      Viewer.entities.getById(this.markEntity).billboard.width = this.markWidth
    },
    changeHeight() {
      Viewer.entities.getById(this.markEntity).billboard.height = this.markHeight
    },
    changName() {
      Viewer.entities.getById(this.markEntity).label.text = this.name
    },
    changeFontsize() {
      if (this.fontsize <= 0) {
        this.fontsize = 1
      }
      Viewer.entities.getById(this.markEntity).label.font = this.fontsize + 'px sans-serif'
    },
    changColor(color) {
      Viewer.entities.getById(this.markEntity).label.fillColor = this.colorDataChange(color)
    }
  }
}
</script>

<style lang="scss" scoped>
.markPanel {
  height: 350px;
  padding: 23px 0;
}
.btn {
  float: right;
  position: relative;
  right: 10px;
  bottom: 80px;
}
.type {
  padding: 5px 0;
}
.seLable {
  margin: 0 0 0 10px;
}
.file {
  position: relative;
  left: 22px;
  width: 170px;
}
.color {
  position: relative;
  top: -15px;
}
.predefineImg {
  left: 72px;
  position: relative;
  cursor: pointer;
}
</style>
