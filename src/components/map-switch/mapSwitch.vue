<template>
  <div class="switch">
    <div class="swith-control" title="切换地图" @click="showSwitchFrom">
      <i class="el-icon-copy-document"></i>
    </div>
    <transition name="fade">
      <div class="switch-left" v-show="show">
        <div class="switch-triangle-right"></div>
        <div class="switch-main">
          <div
            ref="map"
            class="switch-map"
            :class="{switchActive: states.map }"
            @click="switchMap ('map')"
          >
            <span>地图</span>
          </div>
          <div
            ref="image"
            class="switch-image"
            :class="{ switchActive: states.image }"
            @click="switchMap ('image')"
          >
            <span>影像</span>
          </div>
          <div
            ref="offlineMap"
            class="switch-offlineMap"
            :class="{ switchActive: states.google }"
            @click="switchMap('offlineMap')"
          >
            <span>离线地图</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import '../../assets/style/components/mapSwitch.scss'
import TiandituImageryProvider from '../../js/cesiumEx/tinditu/TiandituImageryProvider'
export default {
  name: 'map-switch',
  data() {
    return {
      show: false,
      mapChecked: false,
      defaultActive: 'image',
      currentActive: '',
      states: {
        image: false,
        map: false,
        google: false
      }
    }
  },
  mounted() {
    this.currentActive = this.defaultActive
    this.states[this.defaultActive] = true
  },
  methods: {
    showSwitchFrom() {
      this.show = !this.show
    },
    switchMap(data) {
      const lastLayer = this.currentActive
      this.states[lastLayer] = !this.states[lastLayer]
      this.states[data] = !this.states[data]
      this.currentActive = data
      this.changeImageryProvider(lastLayer, false)
      this.changeImageryProvider(data, true)
      this.showSwitchFrom()
    },
    changeImageryProvider(layer, show) {
      switch (layer) {
        case 'image':
          this.changeLayerShow('Tianditu-img_w', 'Tianditu-cia_w', show)
          break
        case 'map':
          if (this.hasImageryLayer('Tianditu-vec_w')) {
            this.changeLayerShow('Tianditu-vec_w', 'Tianditu-cva_w', show)
          } else {
            Viewer.imageryLayers.addImageryProvider(new TiandituImageryProvider({ token: '778339e01a1fa2ed1716ed16019be012', mapStyle: 'vec_w' }).initImagery())
            Viewer.imageryLayers.addImageryProvider(new TiandituImageryProvider({ token: '778339e01a1fa2ed1716ed16019be012', mapStyle: 'cva_w' }).initImagery())
          }
          break
        case 'offlineMap':
          this.changeOfflineMapShow('google', show);
          break
        default:
          break
      }
    },
    changeLayerShow(img, annotation, show) {
      for (let index = 0; index < Viewer.imageryLayers.length; index++) {
        const element = Viewer.imageryLayers.get(index)
        if (element.imageryProvider.credit.html === img || element.imageryProvider.credit.html === annotation) {
          element.show = show
        }
      }
    },
    hasImageryLayer(layerCredit) {
      let bool = false
      for (let index = 0; index < Viewer.imageryLayers.length; index++) {
        const element = Viewer.imageryLayers.get(index)
        if (element.imageryProvider.credit.html === layerCredit) {
          bool = true
          break
        }
      }
      return bool
    },
    changeOfflineMapShow(img, show) {
      for (let index = 0; index < Viewer.imageryLayers.length; index++) {
        const element = Viewer.imageryLayers.get(index)
        if (element.imageryProvider.credit.html === img) {
          element.show = show
        }
      }
    }
  }
}
</script>
