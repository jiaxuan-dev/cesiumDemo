<template>
  <div class="positionMsg">
    <div class="slidePanel">
        <span class='dixingt'>地形透明度：</span>
      <div class="sliderBox">
        <el-slider id="sliderDiv" v-model="alpha" :min="0" :max="100" @input="alphaChange"></el-slider>
      </div>
    </div>
    <div class="coordinatePanel">
      <div class="lonlatContent">
        <!-- <span class="scaleMsg">
                    100KM
                     <img  src="../images/资源 11scalebar.png">
        </span>-->
        <pre>经度&#12288;{{lng}}° &#12288;|&#12288; 纬度 {{lat}}°&#12288;|&#12288; 视角高 {{alt}}km&#12288;|&#12288; 航向角 {{heading}}°&#12288;|&#12288; 俯仰角 {{pitch}}°&#12288;|&#12288; 滚转角 {{roll}}°&#12288;|&#12288;</pre>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'slideBar',
  data() {
    return {
      alpha: 100,
      lng: 0,
      lat: 0,
      alt: 0,
      pitch: 0,
      heading: 0,
      roll: 0
    }
  },
  mounted() {
    let that = this
    let timer = setInterval(function() {
      if (Viewer != undefined) {
        that.initStatusBar(Viewer)
        window.clearInterval(timer)
      }
    }, 100)
  },
  methods: {
    alphaChange() {
      if (this.alpha === 100) {
        Viewer.scene.globe.translucency.enabled = false
      } else {
        Viewer.scene.globe.translucency.enabled = true
        Viewer.scene.globe.translucency.frontFaceAlphaByDistance = new Cesium.NearFarScalar(0.0, 0.0, 800000.0, 1.0)
        var alpha = Number(this.alpha)
        alpha = !isNaN(alpha) ? alpha : 1.0
        alpha = alpha / 100
        Viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue = alpha
        Viewer.scene.globe.translucency.frontFaceAlphaByDistance.farValue = alpha
      }
      var layers = Viewer.scene.globe.imageryLayers
      if (this.alpha === 0) {
        for (let index = 0; index < layers.length; index++) {
          const layer = Viewer.scene.globe.imageryLayers.get(index)
          layer.alpha = 0
        }
      } else {
        for (let index = 0; index < layers.length; index++) {
          const layer = Viewer.scene.globe.imageryLayers.get(index)
          layer.alpha = 1
        }
      }
    },
    initStatusBar(viewer) {
      let that = this
      var handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
      handler.setInputAction(function(event) {
        let pick1 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y)
        let cartesian = viewer.scene.globe.pick(viewer.camera.getPickRay(pick1), viewer.scene)
        if (Cesium.defined(cartesian)) {
          let Cartographic = Cesium.Cartographic.fromCartesian(cartesian)
          that.lat = Cesium.Math.toDegrees(Cartographic.latitude).toFixed(2)
          that.lng = Cesium.Math.toDegrees(Cartographic.longitude).toFixed(2)
        }
        that.alt = (Viewer.camera.positionCartographic.height / 1000).toFixed(2)
        that.pitch = Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2)
        that.heading = Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2)
        that.roll = Cesium.Math.toDegrees(viewer.camera.roll).toFixed(2)
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
      handler.setInputAction(function(event) {
        that.alt = (Viewer.camera.positionCartographic.height / 1000).toFixed(2)
      }, Cesium.ScreenSpaceEventType.WHEEL)
    }
  }
}
</script>
<style>
.positionMsg {
  width: 100%;
  height: 40px;
  position: absolute;
  bottom: 0px;
  z-index: 999;
}
.slidePanel {
  width: 300px;
  float: left;
  height: 100%;
}
.sliderBox{
  width: 170px;
  float:right;
  margin-right: 20px;
  height: 40px;
  margin-top: 5px;
}
.dixingt{
  display: inline-block;
  height: 40px;
  line-height: 43px;
  margin:0 0 0 30px;
  font-size: 12px;
}
.coordinatePanel {
  width: calc(100% - 300px);
  float: left;
  background: url('../images/资源 17.png') top no-repeat;
  background-size: 100% 100%;
  height: 80%;
  margin-bottom: 20%;
}
#sliderDiv {
  width: 150px;
  margin: 0 auto;
}
.el-slider__button {
  width: 8px !important;
  height: 7px !important;
  border-radius: 0px !important;
  background:url('../images/资源 74updatedUI.png') no-repeat !important;
  border: 0px solid #0555b4 !important;
}
.el-slider__runway {
  border-radius: 0px !important;
  height: 2px !important;
}
.el-slider__bar {
  background-color: #000820 !important;
  border-top-left-radius: 0px !important;
  border-bottom-left-radius: 0px !important;
  height: 2px !important;
}
#sliderDiv::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 6px;
  position: absolute;
  left: 108px;
  top: 18px;
  background: url('../images/leftBorder.png') no-repeat;
}
#sliderDiv::after {
  content: '';
  display: inline-block;
  width: 10px;
  height: 6px;
  position: absolute;
  left: 270px;
  top: 18px;
  background: url('../images/rightBorder.png') no-repeat;
}
.el-slider__button-wrapper{
  top: -17px !important;
}
.lonlatContent {
  color: white;
  font-family: 'FZSongYi-Z13S';
  text-align: right;
  line-height: 32px;
  margin-right: 8%;
}
.scaleMsg {
  width: 10%;
  float: left;
  margin-left: 128px;
  background: url('../images/资源 11scalebar.png') top no-repeat;
  line-height: 43px;
  text-align: center;
}
pre {
  margin: 0 !important;
  font-family: 'FZSongYi-Z13S' !important;
  width: 100%;
  float: right;
}
</style>
