<!--
 * @author jiaxuan <jiax@creatar.com>
-->
<template>
  <div>
    <div v-show="flyShow">
      <div @click="plan" class="flyBtn1">规划路线</div>
      <div @click="suspend" class="flyBtn1">{{suspendName}}</div>
      <div @click="stop" class="flyBtn1">退出漫游</div>
    </div>
    <dialogPage
      :width="300"
      :left="left"
      :top="top"
      height="600"
      :dialogShow="visible1"
      @close="closeRoamingAttr"
      :markShow="false"
    >
      <div class="roamingPanel">
        <div class="tip">提示：q、e控制视角高度，w、s控制俯仰角，a、d控制滚转角。</div>
        <div @click="start" class="flyBtn">开始漫游</div>
        <div class="roamStyle">
          <div class="time">
            <span>时间</span>
            <el-input
              style="width:70%;left:30px"
              type="number"
              v-model="roamingAttr.time"
              placeholder="请输入时间"
            ></el-input>
          </div>
        </div>
        <div class="positionAll">
          <el-checkbox v-model="roamingAttr.isSpline">是否插值</el-checkbox>
          <el-checkbox @change="changeShowline" v-model="isShowLine">是否显示轨迹线</el-checkbox>
          <el-checkbox v-model="isLoop">是否循环</el-checkbox>
          <div class="height">
            <span>高度</span>
            <el-input
              style="width:70%;left:30px"
              type="number"
              @input="changeHeight"
              v-model="height"
              placeholder="请输入高度"
            ></el-input>
          </div>
          <div>
            第
            <input
              @input="maxMin"
              type="number"
              v-model="positionIndex"
              :max="position.length"
              :min="1"
            />
            个点
          </div>

          <div v-if="position.length==0?false:true" class="position">
            <div>
              <span>经度</span>
              <el-input
                style="width:70%;left:30px"
                type="number"
                @input="changeLngLatAlt"
                v-model="position[positionIndex-1].longitude"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div>
              <span>纬度</span>
              <el-input
                style="width:70%;left:30px"
                type="number"
                @input="changeLngLatAlt"
                v-model="position[positionIndex-1].latitude"
                placeholder="请输入内容"
              ></el-input>
            </div>
            <div>
              <span>高度</span>
              <el-input
                style="width:70%;left:30px"
                type="number"
                @input="changeLngLatAlt"
                v-model="position[positionIndex-1].height"
                placeholder="请输入内容"
              ></el-input>
            </div>
          </div>
        </div>
        <!-- <div class="operation">
          <div class="pitchrollH">
            <span class="demonstration">俯仰角</span>
            <el-slider v-model="pitch" @input="changPitch" :min="-360" :max="360"></el-slider>
          </div>
          <div class="pitchrollH">
            <span class="demonstration">滚转角</span>
            <el-slider v-model="roll" @input="changRoll" :min="-360" :max="360"></el-slider>
          </div>
          <div class="pitchrollH">
            <span class="demonstration">视角高</span>
            <el-input
              style="width:52%;left:10px"
              type="number"
              @input="changeCameraHeight"
              v-model="CameraHeight"
            ></el-input>
          </div>
        </div>-->
      </div>
    </dialogPage>
  </div>
</template>
<script>
import DrawGraph from '../../js/cesiumDraw/DrawGraph.js'
import Roaming from '../../js/FlyingRoaming/Roaming'
export default {
  name: 'fly-roaming',
  props: ['flyShow'],
  data() {
    return {
      visible: true,
      visible1: false,
      title: '漫游',
      suspendName: '暂停漫游',
      suspendFlag: true,
      RouteID: '',
      left: '',
      top: '',
      height: 300,
      roamingAttr: {
        time: 50,
        Lines: [],
        isSpline: false
      },
      position: [],
      positionIndex: 1,
      isShowLine: true,
      isLoop: false,
      pitch: 0,
      roll: 0,
      CameraHeight: 300
    }
  },
  methods: {
    // changPitch() {
    //   if (this.roaming !== undefined) {
    //     this.roaming.setPitch(this.pitch)
    //   }
    // },
    // changRoll() {
    //   if (this.roaming !== undefined) {
    //     this.roaming.setRoll(this.roll)
    //   }
    // },
    // changeCameraHeight() {
    //   if (this.roaming !== undefined) {
    //     this.roaming.setHeight(this.CameraHeight)
    //   }
    // },
    changeShowline() {
      Viewer.entities.getById(this.RouteID).polyline.show = this.isShowLine
    },
    closeRoamingAttr() {
      this.visible1 = false
      Viewer.entities.remove(Viewer.entities.getById(this.RouteID))
    },
    maxMin() {
      if (this.positionIndex < 1) {
        this.positionIndex = 1
      } else if (this.positionIndex > this.position.length) {
        this.positionIndex = this.position.length
      }
    },
    changeLngLatAlt() {
      const arr = []
      for (const i in this.position) {
        arr.push(this.position[i].longitude)
        arr.push(this.position[i].latitude)
        arr.push(this.position[i].height)
      }
      const Cartesian3 = Cesium.Cartesian3.fromDegreesArrayHeights(arr)
      Viewer.entities.getById(this.RouteID).polyline.positions = Cartesian3
    },
    changeHeight() {
      const arr = []
      for (const i in this.position) {
        this.position[i].height = this.height
        arr.push(this.position[i].longitude)
        arr.push(this.position[i].latitude)
        arr.push(this.position[i].height)
      }
      const Cartesian3 = Cesium.Cartesian3.fromDegreesArrayHeights(arr)
      Viewer.entities.getById(this.RouteID).polyline.positions = Cartesian3
    },
    plan() {
      this.suspendName = '暂停漫游'
      this.suspendFlag = true
      this.height = 300
      this.roamingAttr.time = 50
      this.roamingAttr.Lines = []
      this.roamingAttr.isSpline = false
      this.position = []
      this.positionIndex = 1
      const that = this
      if (this.draw === undefined) {
        this.draw = new DrawGraph(Viewer)
      }
      if (this.RouteID !== '' && Viewer.entities.getById(this.RouteID) !== undefined) {
        Viewer.entities.remove(Viewer.entities.getById(this.RouteID))
      }

      this.draw.drawPolyline(
        data => {
          that.RouteID = data.id
          const canHeight = Viewer.scene.canvas.height
          if (data.position.y + 5 / canHeight > (canHeight - 600) / canHeight) {
            this.top = canHeight - 650
          } else {
            this.top = data.position.y + 5
          }

          const canWidth = Viewer.scene.canvas.width
          if (data.position.x / canWidth > (canWidth - 300) / canWidth) {
            this.left = canWidth - 300
          } else {
            this.left = data.position.x
          }
          that.visible1 = true
          const lnglatalt = []
          for (const i in data.cartesian) {
            const Cartographic = Cesium.Cartographic.fromCartesian(data.cartesian[i])
            const latitude = Cesium.Math.toDegrees(Cartographic.latitude)
            const longitude = Cesium.Math.toDegrees(Cartographic.longitude)
            const height = this.height
            that.position.push({ longitude, latitude, height })
            lnglatalt.push(longitude)
            lnglatalt.push(latitude)
            lnglatalt.push(this.height)
          }
          that.roamingAttr.Lines = that.position

          Viewer.entities.getById(data.id).polyline.positions = Cesium.Cartesian3.fromDegreesArrayHeights(lnglatalt)
        },
        { arcType: Cesium.ArcType.RHUMB }
      )
    },
    start() {
      this.visible1 = false
      const positions = []
      for (const i in this.roamingAttr.Lines) {
        positions.push(Number(this.roamingAttr.Lines[i].longitude))
        positions.push(Number(this.roamingAttr.Lines[i].latitude))
        positions.push(Number(this.roamingAttr.Lines[i].height))
      }
      this.roaming = new Roaming(
        Viewer,
        {
          time: this.roamingAttr.time,
          Lines: positions,
          isSpline: this.roamingAttr.isSpline,
          isLoop: this.isLoop
        },
        () => {
          this.visible1 = true
        }
      )

      Viewer.entities.getById(this.RouteID).polyline.positions = this.roaming.getCartesian3()

      document.onkeydown = e => {
        console.log(e.keyCode)
        // qweasd
        if (e.keyCode === 81) {
          this.CameraHeight = this.CameraHeight + 10
          this.roaming.setHeight(this.CameraHeight)
        } else if (e.keyCode === 87) {
          this.pitch = this.pitch + 1
          this.roaming.setPitch(this.pitch)
        } else if (e.keyCode === 69) {
          this.CameraHeight = this.CameraHeight - 10
          this.roaming.setHeight(this.CameraHeight)
        } else if (e.keyCode === 65) {
          this.roll = this.roll + 1
          this.roaming.setRoll(this.roll)
        } else if (e.keyCode === 83) {
          this.pitch = this.pitch - 1
          this.roaming.setPitch(this.pitch)
        } else if (e.keyCode === 68) {
          this.roll = this.roll - 1
          this.roaming.setRoll(this.roll)
        }
      }
    },
    suspend() {
      if (this.roaming !== undefined) {
        if (this.suspendFlag) {
          this.roaming.PauseOrContinue(false)
          this.suspendName = '继续漫游'
          this.suspendFlag = false
        } else {
          this.suspendName = '暂停漫游'
          this.suspendFlag = true
          this.roaming.PauseOrContinue(true)
        }
      }
    },
    stop() {
      this.position = []
      if (this.roaming !== undefined) {
        this.roaming.EndRoaming()
        this.suspendName = '暂停漫游'
        this.suspendFlag = true
        this.roaming = undefined
      }
      if (this.RouteID !== '' && Viewer.entities.getById(this.RouteID) !== undefined) {
        Viewer.entities.remove(Viewer.entities.getById(this.RouteID))
      }
    },
    parentHandle: function() {
      this.stop()
      this.visible1 = false
    }
  }
}
</script>
<style lang="scss" scoped>
.roamingPanel {
  height: 530px;
  padding: 40px 0 0 0;
}
.flyBtn1 {
  padding: 5px;
  cursor: pointer;
}
.flyBtn1:hover {
  background: rgba(18, 189, 208, 0.5);
}
.flyBtn {
  width: 120px;
  height: 20px;
  background: rgba(18, 189, 208, 0.5);
  border: 1px solid rgba(18, 189, 208, 1);
  border-radius: 5px;
  padding: 5px;
  margin: 5px 0 0 20px;
  cursor: pointer;
  font-size: 16px;
  text-align: center;
}
.flyBtn:hover {
  background: rgba(18, 189, 208, 1);
  border: 1px solid #fff;
}
.position {
  margin: 10px 0;
}
.roamStyle,
.positionAll {
  position: relative;
  left: 13px;
}
.tip {
  padding: 10px;
  color: yellow;
}
</style>
<style lang="scss">
.roamingPanel {
  .el-checkbox {
    color: white !important;
  }
  .el-input__inner {
    margin: 3px 0;
    height: 30px !important;
    background-color: #e6e6e600;
    color: white;
  }
  .el-pagination__jump {
    display: block !important;
    color: white !important;
  }
}
</style>
