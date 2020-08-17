<!--
 * @Descripttion: 图例
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-06-04 11:16:47
 * @LastEditors: hxl
 * @LastEditTime: 2020-06-05 16:54:35
-->
<template>
  <dialogPage
    width="100,"
    height="300"
    right="10"
    bottom="100"
    :dialogShow="visible"
    @close="closeLegend"
  >
    <el-scrollbar>
      <div v-if="visible" class="result-box">
        <template v-if="model === 'color'">
          <div class="legend-item" style="max-width:300px" v-for="item in datas" :key="item.name">
            <div
              class="legend-item-c"
              :style="{ backgroundColor: item.color, width: colorWidth, borderColor: item.borderColor }"
            ></div>
            <div class="legend-item-c">{{ item.name }}</div>
          </div>
        </template>
        <template v-if="model === 'icon'">
          <div class="legend-item" style="max-width:300px" v-for="item in datas" :key="item.text">
            <div
              class="legend-item-c"
              :style="{ width: colorWidth, borderColor: item.borderColor, backgroundImage: 'url(' + item.texture + ')' }"
            ></div>
            <div class="legend-item-c">{{ item.name }}</div>
          </div>
        </template>
        <template v-if="model === 'image'">
          <div style="padding:4px">
            <img :src="imgUrl" />
          </div>
        </template>
      </div>
    </el-scrollbar>
  </dialogPage>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'legend-form',
  computed: {
    ...mapState({
      legendTitle: state => state.legend.legendTitle,
      model: state => state.legend.legendModel,
      datas: state => state.legend.legendData
    })
  },
  data() {
    return {
      colorWidth: '70px',
      textWidth: '90px',
      visible: false,
      showClose: false
      //   datas: [{ text: 'test', color: 'red', img: require('../../assets/image/legend/gcdz/1.jpg') }]
    }
  },
  methods: {
    closeLegend() {
      this.visible = false
    },
    setVisible(bool) {
      this.visible = bool
    }
  }
}
</script>

<style></style>
