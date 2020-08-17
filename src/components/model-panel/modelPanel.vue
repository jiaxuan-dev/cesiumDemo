<template>
  <div>
    <el-tree
      ref="tree"
      @check-change="addModel"
      :data="modelData"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      :default-expanded-keys="[0, 9]"
    ></el-tree>
  </div>
</template>
<script>
import { treeGlobalVariable } from '../../js/common/layerTree'
export default {
  name: 'model-panel',
  data() {
    return {
      modelData: [
        {
          id: 9,
          label: '城市模型',
          children: [
            { url: 'model/Architecture/bangonglou1.gltf', label: '办公楼1', id: 10, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/bangonglou2.gltf', label: '办公楼2', id: 11, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/bangonglou3.gltf', label: '办公楼3', id: 12, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/bangonglou4.gltf', label: '办公楼4', id: 13, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/bangonglou5.gltf', label: '办公楼5', id: 14, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/bangonglou6.gltf', label: '办公楼6', id: 15, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/changfang1.gltf', label: '厂房1', id: 18, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/changfang2.gltf', label: '厂房2', id: 19, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/cunweihui.gltf', label: '村委会', id: 20, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongye1.gltf', label: '工业1', id: 21, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongye2.gltf', label: '工业2', id: 22, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan1.gltf', label: '公园1', id: 23, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan2.gltf', label: '公园2', id: 24, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan3.gltf', label: '公园3', id: 25, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan4.gltf', label: '公园4', id: 26, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan5.gltf', label: '公园5', id: 27, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gongyuan6.gltf', label: '公园6', id: 28, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/huochezhan.gltf', label: '火车站', id: 29, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/jiaoxuelou.gltf', label: '教学楼', id: 30, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/lanqiuchang1.gltf', label: '篮球场1', id: 31, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/lanqiuchang2.gltf', label: '篮球场2', id: 32, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/lanqiuchang3.gltf', label: '篮球场3', id: 33, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shangyelou1.gltf', label: '商业楼1', id: 34, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shangyelou2.gltf', label: '商业楼2', id: 35, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shangyequgongyuan1.gltf', label: '商业区公园1', id: 36, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shangyequgongyuan2.gltf', label: '商业区公园2', id: 37, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shiyanlou1.gltf', label: '实验楼1', id: 38, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shiyanlou2.gltf', label: '实验楼2', id: 39, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/shiyanlou3.gltf', label: '实验楼3', id: 40, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/tielu.gltf', label: '铁路', id: 41, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/tingchechang.gltf', label: '停车场', id: 42, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu1.gltf', label: '小区1', id: 43, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu2.gltf', label: '小区2', id: 44, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu3.gltf', label: '小区3', id: 45, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu4.gltf', label: '小区4', id: 46, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu5.gltf', label: '小区5', id: 47, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqu6.gltf', label: '小区6', id: 48, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqusheshi1.gltf', label: '小区设施1', id: 49, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqusheshi2.gltf', label: '小区设施2', id: 50, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/xiaoqusheshi3.gltf', label: '小区设施3', id: 51, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/zuqiuchang.gltf', label: '足球场', id: 52, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/dimian.gltf', label: '地面', id: 16, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } },
            { url: 'model/Architecture/gonglu.gltf', label: '公路', id: 17, position: { lng: 104.340817845, lat: 31.1410973406, alt: -129 } }
          ]
        },
        {
          id: 0,
          label: '地质模型',
          children: [
            { url: 'model/Q.gltf', label: 'Q-土层', pro: 'Q', des: '土层，松散砾石、砂层及粘土', id: 1, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/N.gltf', label: 'N-砾岩', pro: 'N', des: '砾岩，灰色砾岩夹透镜体 ', id: 2, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/E.gltf', label: 'E-泥岩', pro: 'E', des: '泥岩，棕红色泥岩夹砂岩、泥灰岩', id: 3, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/K.gltf', label: 'K-砂岩', pro: 'K', des: '砂岩，棕红色砂岩夹少量泥页岩', id: 4, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/J.gltf', label: 'J-泥岩', pro: 'J', des: '泥岩，紫红、暗红色砂岩、泥岩互层', id: 5, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/T.gltf', label: 'T-砂岩', pro: 'T', des: '砂岩，厚层砂岩、砾状砂岩', id: 6, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/P.gltf', label: 'P-灰岩', pro: 'P', des: '灰岩，深灰、灰白的石灰岩', id: 7, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } },
            { url: 'model/JD.gltf', label: '基底-花岗岩', pro: '基底', des: '花岗岩，灰黑色花岗岩', id: 8, position: { lng: 104.340817845, lat: 31.1410973406, alt: -1053.308 } }
          ]
        },
        {
          id: 53,
          label: '地下空间综合体',
          data: [
            { url: 'model/xcj-gltf/dianti1.gltf', label: '电梯1', id: 54, position: { lng: 104.394556413, lat: 31.1644096174, alt: -20 } },
            { url: 'model/xcj-gltf/dianti2.gltf', label: '电梯2', id: 55, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/dimian.gltf', label: '地面', id: 56, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/dire2.gltf', label: '地热2', id: 57, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/dire3.gltf', label: '地热3', id: 58, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ditie1.gltf', label: '地铁1', id: 59, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ditie2.gltf', label: '地铁2', id: 60, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/dixiarukou1.gltf', label: '地下入口1', id: 61, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/dixiarukou2.gltf', label: '地下入口2', id: 62, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/guidao.gltf', label: '轨道', id: 64, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/jingguan.gltf', label: '景观', id: 65, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/lengshuiguan.gltf', label: '冷水管', id: 66, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/lia1.gltf', label: '楼1', id: 67, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/lia2.gltf', label: '楼2', id: 68, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/reshuiguan.gltf', label: '热水管', id: 69, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/shangchang1.gltf', label: '商场1', id: 70, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/shangchang2.gltf', label: '商场2', id: 71, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/shangchang3.gltf', label: '商场3', id: 72, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/shuiguan.gltf', label: '水管', id: 73, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/tingchechang1.gltf', label: '停车场1', id: 74, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/tingchechang2.gltf', label: '停车场2', id: 75, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/xianguan.gltf', label: '线管', id: 76, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/GLTF/zhantai.gltf', label: '站台', id: 77, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/GLTF/Q1.gltf', label: 'Q1', id: 78, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/Q2.gltf', label: 'Q2', id: 79, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/Q3.gltf', label: 'Q3', id: 80, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/Q4.gltf', label: 'Q4', id: 81, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/Q5.gltf', label: 'Q5', id: 82, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/N.gltf', label: 'N', id: 83, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/E.gltf', label: 'E', id: 84, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/K.gltf', label: 'K', id: 85, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/J.gltf', label: 'J', id: 86, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/T.gltf', label: 'T', id: 87, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/P.gltf', label: 'P', id: 88, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/GLTF/JD.gltf', label: '基底', id: 89, position: { lng: 104.394556413, lat: 31.1644096174, alt: -679.969 } },
            { url: 'model/xcj-gltf/ren1.gltf', label: '人', id: 90, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren2.gltf', label: '人', id: 91, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren3.gltf', label: '人', id: 92, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren4.gltf', label: '人', id: 93, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren5.gltf', label: '人', id: 94, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren6.gltf', label: '人', id: 95, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren7.gltf', label: '人', id: 96, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren8.gltf', label: '人', id: 97, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren9.gltf', label: '人', id: 98, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren10.gltf', label: '人', id: 99, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/ren11.gltf', label: '人', id: 100, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/changdeng1.gltf', label: '长凳1', id: 101, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } },
            { url: 'model/xcj-gltf/changdeng2.gltf', label: '长凳2', id: 102, position: { lng: 104.394556413, lat: 31.1644096174, alt: -30 } }
          ]
        }
      ],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.$nextTick(function() {
      // 设置全局模型树引用
      treeGlobalVariable.setTreeRef(this)
    })
  },
  methods: {
    addModel(data, bool, children) {
      if (bool && data.children == undefined) {
        if (data.data != undefined) {
          for (let i in data.data) {
            let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(data.data[i].position.lng, data.data[i].position.lat, data.data[i].position.alt))

            const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90))
            const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
            Cesium.Matrix4.multiply(modelMatrix, rotation, modelMatrix)
            let options = {
              id: data.data[i].id,
              show: true,
              scale: 1,
              minimumPixelSize: 1,
              clampAnimations: true,
              url: data.data[i].url,
              modelMatrix: modelMatrix
            }
            let model = Viewer.scene.primitives.add(Cesium.Model.fromGltf(options))
          }
        } else {
          let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(data.position.lng, data.position.lat, data.position.alt))

          const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(90))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(modelMatrix, rotation, modelMatrix)

          let options = {
            id: data.id,
            show: true,
            scale: 1,
            minimumPixelSize: 1,
            clampAnimations: true,
            url: data.url,
            modelMatrix: modelMatrix
          }

          let model = Viewer.scene.primitives.add(Cesium.Model.fromGltf(options))
          Viewer.flyTo(model)
          if (data.pro != undefined) {
            model.attr = {
              label: data.label,
              des: data.des,
              pro: data.pro,
              pmodelMatrix: JSON.stringify(modelMatrix)
            }
          }
        }
      } else {
        for (let i in Viewer.scene.primitives._primitives) {
          if (data.data != undefined) {
            for (let j in data.data) {
              if (Viewer.scene.primitives._primitives[i].id == data.data[j].id) {
                Viewer.scene.primitives.remove(Viewer.scene.primitives._primitives[i])
              }
            }
          } else {
            if (Viewer.scene.primitives._primitives[i].id == data.id) {
              Viewer.scene.primitives.remove(Viewer.scene.primitives._primitives[i])
            }
          }
        }
      }
    },
    removeUndergroundModel() {
      const idArray = [1, 2, 3, 4, 5, 6, 7, 8]
      for (const i in Viewer.scene.primitives._primitives) {
        for (const j in idArray) {
          if (Viewer.scene.primitives._primitives[i].id === idArray[j]) {
            this.$refs.tree.setChecked(Viewer.scene.primitives._primitives[i].id, false)
            Viewer.scene.primitives.remove(Viewer.scene.primitives._primitives[i])
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
.el-tree {
  background: none !important;
  color: white !important;
}
.el-tree div:hover {
  background: none !important;
}
.el-tree-node__label {
  font-size: 14px !important;
}
</style>
