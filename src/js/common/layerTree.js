/*
 * @Descripttion: 图层树 数据管理
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-08 16:36:56
 * @LastEditors: hxl
 * @LastEditTime: 2020-08-10 18:03:27
 */
import * as api from '../../api'
import store from '../../store'
import Tin from '../cesiumEx/Tin'
import { Section } from '../cesiumEx/Section'
import VirtualTin from '../cesiumEx/VirtualTin'
import Drill from '../cesiumEx/Drill'
import { colorDecimalToRGBA, calulationLineRectCenter } from './common'

export const defaultCamera = {
  position: {
    lng: 104.340817845,
    lat: 31.1410973406,
    height: 100000
  },
  heading: 360,
  pitch: -90,
  roll: 0
}

export const treeGlobalVariable = {
  treeRef: '',
  setTreeRef(ref) {
    this.treeRef = ref
  }
}
export const treeStateInfos = [
  {
    id: 0,
    name: '德阳',
    alias: '德阳',
    show: true,
    zStretch: 1,
    alpha: 1,
    textureMode: true,
    extent: { minx: 104.28270338019837, miny: 31.095821976099817, minz: -2000, maxx: 104.39898785532955, maxy: 31.186349218457128, maxz: 113.31 }
  }
  // {
  //   id: 0,
  //   name: '海口大层',
  //   alias: '海口大层',
  //   show: true,
  //   zStretch: 1,
  //   alpha: 1,
  //   textureMode: true,
  //   extent: { minx: 110.37267949965427, miny: 19.889363651686004, minz: -2000.0, maxx: 110.60340800011609, maxy: 20.081025355134351, maxz: 32.88660049 }
  // }
]
const texturePath = 'image/' + treeStateInfos[0].name + '/'
/** 关闭所有图层
 */
export function closeAllLayer() {
  treeGlobalVariable.treeRef.removeUndergroundModel()
}
export function loadLayerData(para) {
  const multistageTree = para.multistageTree
  const dsName = para.dsName
  // const layerName = para.layerName
  const obj = para.obj
  const extent = para.extent
  // console.log(extent)
  const near = para.near
  const far = para.far
  return new Promise((resolve, reject) => {
    api.default
      .getLayerJson({
        dsName: dsName,
        id: obj.id
      })
      .then(response => {
        if (response.data.isok === 'FAIL') {
          reject(response.data.message)
          return
        }
        var layer = response.data
        layer.id = obj.id
        layer.name = obj.name
        layer.parentName = dsName
        layer.parentId = obj.parentId
        // layer.height = (layer.extent.maxz + layer.extent.minz) / 2
        if (obj.nodeId) {
          layer.nodeId = obj.nodeId
          layer.parentNodeId = obj.nodeId.substring(0, obj.nodeId.length - 3)
        }
        if (near) {
          layer.near = near
        }
        if (far) {
          layer.far = far
        }
        layer.color = colorDecimalToRGBA(layer.color)
        if (extent) {
          layer.modelExtent = extent
        }
        layer.textureInfo = obj.modelInfo
        layer.isSmoot = true // 数据组织方式 共顶点

        if (multistageTree) {
          layer.textureMode = treeStateInfos[0].textureMode
          layer.color.alpha = treeStateInfos[0].alpha
        } else {
          layer.textureMode = treeStateInfos.find(m => m.id === obj.parentId).textureMode
          layer.color.alpha = treeStateInfos.find(m => m.id === obj.parentId).alpha
        }

        // 组织cesium几何，绑定至树
        var tin = new Tin(layer)
        resolve(tin)
      })
  })
}
/**
 * @description: 加载剖面数据
 * @param {number} type 1：纵剖面 2：横剖面
 * @param {Object} para 请求参数
 * @return: 异步构建好的对象
 */
export function loadSectionData(type, para) {
  if (type === 1) return loadVerticalSectionData(para)
  else if (type === 2) return loadHorizontalSectionData(para)
}

function loadVerticalSectionData(para) {
  const near = para.near
  const far = para.far
  const model = getTopLayer()
  const postPara = {
    name: model.alias,
    sectionP: para.points,
    isTriangulation: para.isTriangulation || true,
    startDepth: para.startDepth ? para.startDepth : model.extent.maxz,
    depth: para.depth ? para.depth * -1 : (model.extent.maxz - model.extent.minz) * -1
  }
  return new Promise((resolve, reject) => {
    api.default.verticalSection(postPara).then(response => {
      if (response.data.success === false) {
        reject(response.data.message)
        return
      }
      var layer = response.data
      layer.layerId = model.id
      layer.layerName = model.name
      // layer.height = (layer.extent.maxz + layer.extent.minz) / 2
      layer.depth = postPara.depth * -1 > model.extent.maxz - model.extent.minz ? model.extent.maxz - model.extent.minz : postPara.depth * -1
      layer.center = calulationLineRectCenter(para.points)
      layer.center.z = model.extent.maxz
      if (near) {
        layer.near = near
      }
      if (far) {
        layer.far = far
      }
      if (layer.data) {
        layer.data.forEach(m => {
          m.color = colorDecimalToRGBA(m.color)
          m.renderPath = texturePath + m.renderPath
        })
      }
      layer.points = para.points
      layer.type = 1
      // 组织cesium几何，绑定至树
      const section = new Section(layer)
      section.instantiationPrimitives()
      anaObjectInitState(section)
      resolve(section)
    })
  })
}

function loadHorizontalSectionData(para) {
  const near = para.near
  const far = para.far
  const model = getTopLayer()
  const postPara = {
    name: model.alias,
    sectionP: para.points,
    isTriangulation: para.isTriangulation || true,
    depth: para.depth * -1
  }
  return new Promise((resolve, reject) => {
    api.default.horizontalSection(postPara).then(response => {
      if (response.data.success === false) {
        reject(response.data.message)
        return
      }
      var layer = response.data
      layer.layerId = model.id
      layer.layerName = model.name
      // layer.height = (layer.extent.maxz + layer.extent.minz) / 2
      layer.depth = postPara.depth * -1 > model.extent.maxz - model.extent.minz ? model.extent.maxz - model.extent.minz : postPara.depth * -1
      layer.center = calulationLineRectCenter(postPara.sectionP)
      layer.center.z = model.extent.maxz
      if (near) {
        layer.near = near
      }
      if (far) {
        layer.far = far
      }
      if (layer.data) {
        layer.data.forEach(m => {
          m.color = colorDecimalToRGBA(m.color)
          m.renderPath = texturePath + m.renderPath
        })
      }
      layer.type = 2
      // 组织cesium几何，绑定至树
      const section = new Section(layer)
      section.instantiationPrimitives()
      anaObjectInitState(section)
      resolve(section)
    })
  })
}
/** 真实挖洞
 * @param {Array} params.points 洞坐标点
 * @param {Number} params.depth 深度
 * @param {Boolean} params.isOut 是否外体
 * @return {Promise<VirtualTin>[]}: 虚拟tin
 */
export function digTin(params) {
  const layer = getTopLayer()
  const datas = []
  layer.children.forEach(c => {
    datas.push(
      loadVirtualTin({
        name: layer.alias,
        layerName: c.alias ? c.alias : c.name,
        points: params.points,
        depth: params.depth,
        isOut: params.isOut,
        extent: layer.extent,
        isTunnel: params.isTunnel,
        width: params.width
      })
    )
  })
  return new Promise((resolve, reject) => {
    Promise.all(datas).then(result => {
      for (let index = result.length - 1; index > -1; index--) {
        if (result[index] === 'err') result.splice(index, 1)
      }
      resolve(result)
    })
  })
}
/** 加载虚拟tin
 * @description: 用于挖洞挖隧道数据请求
 * @param {Object} param
 * @return {Promise<VirtualTin>}: tin
 */
function loadVirtualTin(param) {
  const digclip = param.isTunnel ? api.default.digRoamClip : api.default.digHoleClip
  const postP = { name: param.name, layerName: param.layerName, points: param.points, depth: param.depth, isOut: param.isOut }
  if (param.isTunnel) postP.width = param.width

  return new Promise((resolve, reject) => {
    digclip(postP).then(response => {
      if (!response.data.success) {
        resolve('err')
        return
      }
      if (response.data.data) {
        const data = response.data.data.find(d => d.name !== 'Fault_result_line')
        data.modelExtent = param.extent
        if (data.color) {
          data.color = colorDecimalToRGBA(data.color)
        }
        const tin = new VirtualTin(data)
        tin.instantiation()
        resolve(tin)
      } else {
        resolve('err')
      }
    })
  })
}
export function loadDrillData(para) {
  const near = para.near
  const far = para.far
  const model = getTopLayer()
  const postPara = {
    name: model.alias,
    x: para.x,
    y: para.y,
    z: para.z ? para.z : model.extent.maxz,
    depth: para.depth * -1
  }
  return new Promise((resolve, reject) => {
    api.default.drill(postPara).then(response => {
      if (response.data.isok === 'FAIL') {
        reject(response.data.message)
        return
      }
      var layer = response.data
      layer.layerId = model.id
      layer.layerName = model.name
      // layer.height = (layer.extent.maxz + layer.extent.minz) / 2
      layer.depth = (model.extent.maxz - model.extent.minz).toFixed(2)
      layer.center = {
        x: postPara.x,
        y: postPara.y,
        z: model.extent.maxz
      }
      if (near) {
        layer.near = near
      }
      if (far) {
        layer.far = far
      }
      if (layer.data) {
        layer.data.forEach(m => {
          m.color = colorDecimalToRGBA(m.color)
          m.renderPath = texturePath + m.renderPath
        })
      }
      console.log(layer)
      // 组织cesium几何，绑定至树
      const drill = new Drill(layer)
      drill.instantiationPrimitives()
      console.log(drill)
      anaObjectInitState(drill)
      resolve(drill)
    })
  })
}
/** 隧道——多剖面组合隧道
 * @param {type}  params
 * @return {Promise<Section>}: 剖面
 */
export function loadSectionTunnel(params) {
  const layer = getTopLayer()
  const postP = { name: layer.alias, points: params.points, depth: params.depth, isOut: params.isOut, width: params.width }
  return new Promise((resolve, reject) => {
    api.default.digRoamClipFace(postP).then(response => {
      if (!response.data.success) {
        reject(response.data.message)
        return
      }
      if (response.data) {
        var layer = response.data
        layer.layerId = layer.id
        layer.layerName = layer.name
        // layer.height = (layer.extent.maxz + layer.extent.minz) / 2
        layer.depth = params.depth
        layer.center = calulationLineRectCenter(params.points)
        if (layer.data) {
          layer.data.forEach(m => {
            m.color = colorDecimalToRGBA(m.color)
            m.renderPath = texturePath + m.renderPath
          })
        }
        const section = new Section(layer)
        section.instantiationPrimitives()
        resolve(section)
      } else {
        resolve('err')
      }
    })
  })
}
export function getTopLayer() {
  if (!treeStateInfos[0].children) {
    api.default.getLayerInfoByName({ dsName: treeStateInfos[0].name }).then(res => {
      var data = res.data
      const children = []
      data.data.layer.forEach(l => {
        children.push({ name: l })
      })
      treeStateInfos[0].children = children
    })
  }
  return treeStateInfos[0]
}

export function anaObjectInitState(obj) {
  const model = getTopLayer()
  obj.zStretch = model.zStretch
  if (obj._center.z < 0) {
    obj.zOffset = -110
  } else {
    obj.zOffset = (obj.zStretch - 1) * obj._center.z * -1 - 110 // 默认偏移10米
  }
}

export function modelExplode(model) {
  // 多级模型
  if (model.id === 0) {
    treeGlobalVariable.multistageTreePanelRef.stopChangeLevel() // 停止多级切换
    const layers = treeGlobalVariable.multistageTins.filter(m => {
      if (m.show) return m
    })
    const time = model.explodeTime ? ++model.explodeTime : 1
    model.explodeTime = time
    const modelMaxz = layers[0]._extent.maxz
    layers.sort(function(a, b) {
      return b._tinExtent.maxz - a._tinExtent.maxz
    })
    for (let index = 0; index < layers.length; index++) {
      const layerMaxz = layers[index]._tinExtent.maxz
      const offset = index === 0 ? (modelMaxz - layerMaxz) * time : (layers[index - 1]._tinExtent.maxz - layerMaxz) * time
      layers[index].zOffset = index === 0 ? offset * -1 : offset * -1 + layers[index - 1].zOffset
    }
  } else {
    // 普通模型
    const layers = treeGlobalVariable.ordinaryTins.filter(m => {
      if (m._parentId === model.id) return m
    })
    const time = model.explodeTime ? ++model.explodeTime : 1
    model.explodeTime = time
    const modelMaxz = layers[0]._extent.maxz
    layers.sort(function(a, b) {
      return b._tinExtent.maxz - a._tinExtent.maxz
    })
    for (let index = 0; index < layers.length; index++) {
      const layerMaxz = layers[index]._tinExtent.maxz
      const offset = index === 0 ? (modelMaxz - layerMaxz) * time : (layers[index - 1]._tinExtent.maxz - layerMaxz) * time
      layers[index].zOffset = index === 0 ? offset * -1 : offset * -1 + layers[index - 1].zOffset
    }
  }
}
export function resetModelExplode() {
  treeStateInfos.forEach(t => {
    t.explodeTime = 1
  })
  treeGlobalVariable.ordinaryTins.forEach(tin => {
    if (tin.zOffset < 0) {
      tin.zOffset = -150
    }
  })
  treeGlobalVariable.multistageTins.forEach(tin => {
    if (tin.zOffset < 0) {
      tin.zOffset = -150
    }
  })
  if (treeGlobalVariable.multistageTreePanelRef.startChangeLevel !== undefined) {
    treeGlobalVariable.multistageTreePanelRef.startChangeLevel()
  }
}

export function layerStrip(model) {
  if (model.id === 0) {
    treeGlobalVariable.multistageTreePanelRef.stopChangeLevel() // 停止多级切换
    treeGlobalVariable.multistageTreePanelRef.layerStrip()
  } else {
    treeGlobalVariable.treeRef.layerStrip(model.id)
  }
}
export function changeLegendInfo(currentModel) {
  if (currentModel.show) {
    store.commit('legend/setlegendTitle', currentModel.name)
    store.commit('legend/setLegendModel', currentModel.textureMode ? 'icon' : 'color')
    if (currentModel.id === 0) {
      switch (currentModel.level) {
        case 1:
          store.commit('legend/setLegendData', currentModel.legend.j)
          break
        case 2:
          store.commit('legend/setLegendData', currentModel.legend.x)
          break
        case 3:
          store.commit('legend/setLegendData', currentModel.legend.z)
          break
      }
    } else {
      store.commit('legend/setLegendData', currentModel.legend)
    }
  } else {
    const model = treeStateInfos.find(m => m.show)
    if (model) {
      store.commit('legend/setlegendTitle', model.name)
      store.commit('legend/setLegendModel', model.textureMode ? 'icon' : 'color')
      if (model.id === 0) {
        switch (model.level) {
          case 1:
            store.commit('legend/setLegendData', model.legend.j)
            break
          case 2:
            store.commit('legend/setLegendData', model.legend.x)
            break
          case 3:
            store.commit('legend/setLegendData', model.legend.z)
            break
        }
      } else {
        store.commit('legend/setLegendData', model.legend)
      }
    } else {
      store.commit('legend/setlegendTitle', '')
      store.commit('legend/setLegendData', [])
    }
  }
}
