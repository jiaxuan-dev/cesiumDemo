<template>
  <div
    :style="{width:width+'px',height:height+'px',left:left+'px',top:top+'px',bottom:bottom+'px',right:right+'px'}"
    class="dialogBorder"
    v-show="dialogShow"
  >
    <div :style="{width:(width-5)+'px',height:(height-5)+'px'}" class="dialogMsg">
    <img @click="exit" class="exit" src="../images/资源 112.png" alt />
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Vivus from 'vivus'
export default {
  name: 'dialogPage',
  components: { Vivus },
  props: ['top', 'left', 'width', 'height', 'dialogShow', 'svgShow', 'bottom', 'right'],
  mounted() {
    document.oncontextmenu = function() {
      return false
    }
  },
  watch: {
    dialogShow: function(curVal) {
      if (curVal) {
        // this.initVivus()
      }
    }
  },
  methods: {
    exit() {
      this.$emit('close', false)
    },
    initVivus() {
    }
  }
}
</script>
<style scoped>
.exit {
  position: absolute;
  width: 20px;
  top: 10px;
  right: 10px;
  cursor: pointer;
  z-index: 100;
}
.dialogBorder {
  position: fixed;
  z-index: 999;
}
.dialogMsg {
  background: url('../images/资源 89.png') no-repeat;
  background-size: 100% 100%;
}
</style>
