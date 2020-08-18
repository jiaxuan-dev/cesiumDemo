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
    <div class="zhishibiao">
      <span class="topsanjiao" v-show="markShow === 'top'">
        <img src="../images/topsanjiao.png" alt />
      </span>
      <span class="rightsanjiao" v-show="markShow === 'right'">
        <img src="../images/rightsanjiao.png" alt />
      </span>
      <span class="bottomsanjiao" v-show="markShow === 'bottom'">
        <img src="../images/bottomsanjiao.png" alt />
      </span>
      <span class="leftsanjiao" v-show="markShow === 'left'">
        <img src="../images/leftsanjiao.png" alt />
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'dialogPage',
  props: ['top', 'left', 'width', 'height', 'dialogShow', 'markShow', 'bottom', 'right'],
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
      // let obt1 = new Vivus('mysvg', {
      //   type: 'oneByOne',
      //   duration: 50
      // })
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
/**.dialogBorder {
  width: 455px;
  height: 255px;
  position: absolute;
  top: 150px;
  right: 280px;
  z-index: 999;
}
.dialogMsg {
  width: 450px;
  height: 250px;
  border: 1px solid #66e4f2;
  background: rgba(102, 228, 242, 0.1);
}*/
.dialogBorder {
  position: fixed;
  z-index: 999;
}
.dialogMsg {
  /* border: 1px solid #66e4f2;
  background-color: rgba(11, 126, 146, 0.795); */
  background: url('../images/dialogBg.png') no-repeat;
  background-size: 100% 100%;
}
.topsanjiao {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate(-50%);
}
.bottomsanjiao {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%);
}
.leftsanjiao {
  position: absolute;
  left: -5px;
  top: 50%;
  transform: translate(-50%, -50%);
}
.rightsanjiao {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translate(50%, -50%);
}
</style>
