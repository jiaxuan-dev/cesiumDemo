<template>
  <div id="cesiumContainer">
    <main-view></main-view>
    <map-switch></map-switch>
    <!-- <theme-change></theme-change> -->
    <!--<main-toolbar></main-toolbar>
    <scene-panel ref="scenePanel"></scene-panel>
    <draw-panel></draw-panel>
    <fly-roaming></fly-roaming>-->
  </div>
</template>

<script>
import 'cesium/Build/Cesium/Widgets/widgets.css'
import * as Cesium from 'cesium/Build/Cesium/Cesium'
// import '../../static/cesium/Widgets/widgets.css'
// import * as Cesium from '../../static/cesium/Cesium.js'

import CesiumNavigation from 'cesium-navigation-es6'
import TiandituImageryProvider from '../js/cesiumEx/tinditu/TiandituImageryProvider'
// import borderJson1 from '../assets/data/海口江东新区84.json'
import borderJson1 from '../assets/data/边界.json'
import sichuanJson from '../assets/data/四川边界.json'
import deyangJson from '../assets/data/德阳市边界.json'
/* eslint-disable */
export default {
  name: 'CesiumContainer',
  props: {
    cesiumPath: {
      type: String,
      default: '../../static/cesium/Cesium.js'
    }
  },
  data() {
    return {
      defaultResetView: {
        lng: 104.340817845,
        lat: 31.1410973406,
        height: 150000.497290563
      },
      // camera: {
      //   position: {
      //     lng: 104.481597724,
      //     lat: 31.2842433074,
      //     height: 150000.497290563
      //   },
      //   heading: 360,
      //   pitch: -90,
      //   roll: 0
      // },
      showStatus: true
    }
  },
  mounted() {
    this.init()
    this._mounted = true
  },
  computed: {},
  methods: {
    init() {
      window.Cesium = Cesium
      Cesium.Ion.defaultAccessToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwMWEyMzI3MC1hZTY5LTQ0MGQtYmI5Yy03NGM5MmRlOWNmOWMiLCJpZCI6MTUwMDMsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NzAwMDYxMTV9.BqLRq1M9Ip9dkwiqnfz7kVacTgTnNwmj0qAwjGnTGDc'
      const viewer = new Cesium.Viewer('cesiumContainer', {
        infoBox: false,
        selectionIndicator: false,
        animation: false, //动画控制不显示
        timeline: false, //时间线不显示
        fullscreenButton: true, //全屏按钮不显示
        vrButton: true,
        navigationHelpButton: true, //帮助不显示
        shouldAnimate: true,
        homeButton: false, //是否显示Home按钮
        baseLayerPicker: false, //是否显示图层选择控件
        geocoder: false, // 是否显示地名查找控件
        sceneModePicker: true, // 是否显示投影方式控件
        infoBox: false, // 是否显示点击要素之后显示的信息
        requestRenderMode: true, // 启用请求渲染模式
        scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
        sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
        fullscreenElement: document.body, //全屏时渲染的HTML元素 暂时没发现用处
        // terrainProvider: Cesium.createWorldTerrain(),
        // terrainProvider: new Cesium.CesiumTerrainProvider({ url: Cesium.IonResource.fromAssetId(1) }),
        imageryProvider: new TiandituImageryProvider({ token: '778339e01a1fa2ed1716ed16019be012', mapStyle: 'img_w' }).initImagery()
        // imageryProvider: new Cesium.UrlTemplateImageryProvider({
        //   url: 'http://222.223.214.100:8439/TianDiTu/img_w/ChinaStatllite/G{z}/Y{y}/_{x}_{y}_{z}'
        // })
      })

      window.Viewer = viewer
      this.initNavigation(viewer)
      // this.initCamera()
      this.initImageryProviders()

      // this.initStatusBar(viewer)
      // CesiumInspector控件
      //viewer.extend(Cesium.viewerCesiumInspectorMixin)
      viewer.scene.debugShowFramesPerSecond = true /*显示帧速FPS*/
      //去除版权信息
      viewer._cesiumWidget._creditContainer.style.display = 'none'
      //更改Home的位置
      viewer.camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(100.0, 10.0, 140.0, 35.0) // Cesium.Math.toRadians
      Viewer.scene.globe.depthTestAgainstTerrain = true
      viewer.scene.globe.baseColor = new Cesium.Color(0, 0, 0, 0)
      // viewer.scene.globe.baseColor = new Cesium.Color(1, 1, 1, 0)
      // 默认开启双击拉近
      viewer.scene.camera.flyToDoubleClick()
      // 边界
      this.addbianjie(deyangJson, Cesium.Color.WHITE)
      this.addbianjie(sichuanJson, Cesium.Color.YELLOW)
      this.addbianjie(borderJson1, Cesium.Color.BLUE)
      // this.addbianjie(borderJson1, Cesium.Color.BLUE)
      // viewer.scene._screenSpaceCameraController.camreaUnderGroundDepth(10000)
      // viewer.extend(Cesium.viewerCesiumInspectorMixin);//调试用
    },
    initNavigation(viewer) {
      Cesium.defineProperties = Object.defineProperty
      const options = {}
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和Cesium.Rectangle.
      options.defaultResetView = Cesium.Cartographic.fromDegrees(this.defaultResetView.lng, this.defaultResetView.lat, this.defaultResetView.height)
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
      options.enableZoomControls = true
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true
      CesiumNavigation(viewer, options)

      var a = document.getElementsByClassName('cesium-vrButton')[0].children[0].innerHTML
    },
    // initCamera() {
    //   // 初始相机位置
    //   if (Cesium.defined(this.camera)) {
    //     Viewer.camera.setView({
    //       destination: Cesium.Cartesian3.fromDegrees(this.camera.position.lng, this.camera.position.lat, this.camera.position.height),
    //       orientation: {
    //         heading: Cesium.Math.toRadians(this.camera.heading || 360),
    //         pitch: Cesium.Math.toRadians(this.camera.pitch || -90),
    //         roll: Cesium.Math.toRadians(this.camera.roll || 0)
    //       }
    //     })
    //   }
    // },
    initImageryProviders() {
      var terrainMap = new Cesium.UrlTemplateImageryProvider({
        credit: 'google',
        url: './world_TMS/{z}/{x}/{reverseY}.jpg',
        fileExtension: 'jpg'
      })

      var layer = Viewer.imageryLayers.addImageryProvider(terrainMap)
      layer.show = false
      Viewer.imageryLayers.addImageryProvider(new TiandituImageryProvider({ token: '778339e01a1fa2ed1716ed16019be012', mapStyle: 'cia_w' }).initImagery())
      //   var layers = Viewer.imageryLayers;
      //   layers.removeAll();
      //   var terrainMap = new Cesium.UrlTemplateImageryProvider({
      //       url:'http://localhost:8081/谷歌混合地图TMS/{z}/{x}/{reverseY}.jpg',
      //       fileExtension:'jpg'
      //     });
      //   layers.addImageryProvider(terrainMap);
    },
    addbianjie(borderJson, color) {
      const positions = []
      borderJson.features[0].geometry.coordinates.forEach(c => {
        // positions.push(Cesium.Cartesian3.fromDegrees(c[0], c[1], 0))
        positions.push(c[0])
        positions.push(c[1])
      })
      const borderLine = new Cesium.Entity({
        name: 'Border line',
        polyline: {
          positions: Cesium.Cartesian3.fromDegreesArray(positions),
          width: 15,
          clampToGround: false,
          arcType: Cesium.ArcType.GEODESIC,
          distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(0.0, 700000.0),
          material: new Cesium.PolylineGlowMaterialProperty({
            glowPower: 0.2,
            taperPower: 1,
            color: color
          })
        }
      })
      Viewer.entities.add(borderLine)
      Viewer.flyTo(borderLine)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
<style>
.cesium-viewer-toolbar {
  top: 200px !important;
}
.compass {
  top: 250px !important;
}
.navigation-controls {
  top: 400px !important;
}
.cesium-performanceDisplay-defaultContainer {
  top: 100px !important;
}
.cesium-viewer-fullscreenContainer {
  /* bottom: 760px !important; */
  top: 100px !important;
  right: 10px !important;
}
.cesium-viewer-vrContainer {
  top: 100px !important;
  right: 48px !important;
  /* bottom: 760px !important; */
}
.cesium-button{
  background-color: #0042a6 !important;
  border: 1px solid #01c2ff !important;
  fill: #fff !important;
}
.navigation-controls{
  background-color: #0042a6 !important;
  border: 1px solid #01c2ff !important;
  fill: #fff !important;
}
.navigation-control{
  border-bottom:1px solid #01c2ff !important;
}
.compass-outer-ring-background{
  border: 12px solid #0042a6 !important;
}
.compass-outer-ring{
  fill:#01c2ff !important;
}
.compass-gyro-background{
  background-color:rgb(0, 66, 166);
  border:1px solid rgb(1, 194, 255, 1);
}
.compass-gyro{
  fill:#fff !important;
}
</style>
