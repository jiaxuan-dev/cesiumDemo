/*
 * @Descripttion: 钻孔
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-25 16:53:42
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-05 21:03:13
 */
import { Section, SectionChildren } from './Section'

class Drill extends Section {
  constructor(options) {
    super(options)
    this._textureMode = options.textureMode || true // 纹理模式
    this._radius = options.radius || 25
  }

  instantiationPrimitives() {
    if (!this._datas) return
    this._datas.forEach(data => {
      const drillChildren = new DrillChildren({
        data: data,
        parent: this
      })
      drillChildren.instantiationPrimitive()
      this._models.push(drillChildren)
    })
    this._center.z = this._models
      .map(m => {
        return m._zMax
      })
      .sort(function(a, b) {
        return b - a
      })[0]
  }
}

class DrillChildren extends SectionChildren {
  constructor(options) {
    super(options)
    this._zMax = this._data.plgData[5]
    this._zMin = this._data.plgData[2]
    this._length = this._data.plgData[5] - this._data.plgData[2] // 钻孔长度
    this._radialSegments = 128
  }

  instantiationPrimitive() {
    const { GeometryInstance, ColorGeometryInstanceAttribute, Primitive } = Cesium
    let id = null
    let color = null
    const gInstances = []
    const geometry = this.createGeometry()
    color = new Cesium.Color(this._data.color.red / 255, this._data.color.green / 255, this._data.color.blue / 255, this._parent._alpha) || Cesium.Color.RED
    id = {
      id: this._data.id,
      parentId: this._parent._layerId,
      name: this._data.name,
      parentuuid: this._parent._uuid,
      length: this._length,
      type: 1
    }
    gInstances.push(
      new GeometryInstance({
        geometry: geometry,
        id: id,
        attributes: {
          color: ColorGeometryInstanceAttribute.fromColor(color),
          distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(this._near, this._far)
        }
      })
    )
    const model = new Primitive({
      cull: false,
      show: this._parent._show,
      modelMatrix: Cesium.Matrix4.multiplyByTranslation(
        Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this._parent._center.x, this._parent._center.y, 0)),
        new Cesium.Cartesian3(0.0, 0.0, 0),
        new Cesium.Matrix4()
      ),
      geometryInstances: gInstances,
      appearance: this.createAppearence(this._data.renderPath)
    })
    // 绑定选中事件到对象原型上
    model._color = color
    model._id = gInstances[0].id
    model._renderPath = this._data.renderPath || ''
    model.setSelect = this.setSelect
    if (this._model !== null) {
      Viewer.scene.primitives.remove(this._model)
      this._model.destroy()
    }
    Viewer.scene.primitives.add(model)
    this._model = model
  }

  calculateGeometryInfo() {
    this.calculatePosition()
    this._sts = this.calculateSts()
  }

  calculatePosition() {
    const positions = []
    const indexs = []
    const angel = (2 * Math.PI) / this._radialSegments
    const topz = this._zMax
    const bottomz = this._zMin
    for (var i = 1, j = 0; j < this._radialSegments; j++, i = j + 1) {
      var x1 = Math.cos(angel * j) * this._parent._radius
      var y1 = Math.sin(angel * j) * this._parent._radius
      var x2 = Math.cos(angel * i) * this._parent._radius
      var y2 = Math.sin(angel * i) * this._parent._radius

      positions.push(x1, y1, bottomz)
      positions.push(x2, y2, bottomz)
      positions.push(x2, y2, topz)

      positions.push(x1, y1, bottomz)
      positions.push(x2, y2, topz)
      positions.push(x1, y1, topz)

      positions.push(x1, y1, topz)
      positions.push(x2, y2, topz)
      positions.push(0, 0, topz)

      positions.push(x1, y1, bottomz)
      positions.push(x2, y2, bottomz)
      positions.push(0, 0, bottomz)
      indexs.push(12 * j, 1 + 12 * j, 2 + 12 * j, 3 + 12 * j, 4 + 12 * j, 5 + 12 * j)
      indexs.push(6 + 12 * j, 7 + 12 * j, 8 + 12 * j, 9 + 12 * j, 10 + 12 * j, 11 + 12 * j)
    }
    this._position = positions
    this._indices = indexs
  }

  calculateSts() {
    const sts = []
    const perimeter = 2 * Math.PI * this._parent._radius
    const radiohw = perimeter / this._length
    for (let triInd = 0; triInd < this._position.length / 9; triInd++) {
      if (this._position[9 * triInd + 2] === this._position[9 * triInd + 8]) {
        // 上下底
        sts.push((this._parent._radius - this._position[9 * triInd + 0]) / (this._parent._radius * 2), (this._parent._radius - this._position[9 * triInd + 1]) / (this._parent._radius * 2))
        sts.push((this._parent._radius - this._position[9 * triInd + 3]) / (this._parent._radius * 2), (this._parent._radius - this._position[9 * triInd + 4]) / (this._parent._radius * 2))
        sts.push((this._parent._radius - this._position[9 * triInd + 6]) / (this._parent._radius * 2), (this._parent._radius - this._position[9 * triInd + 7]) / (this._parent._radius * 2))
      } else {
        for (let p = 0; p < 3; p++) {
          const x = this._position[9 * triInd + 3 * p]
          const y = this._position[9 * triInd + 1 + 3 * p]
          const z = this._position[9 * triInd + 2 + 3 * p]
          let bl = 0
          if (y > 0 || y === 0) {
            // 第一二象限
            bl = Math.acos(x / this._parent._radius) / (2 * Math.PI)
          } else if (x < 0 || x === 0) {
            // 第三象限
            bl = (Math.acos((x * -1) / this._parent._radius) + Math.PI) / (2 * Math.PI)
          } else {
            // 第四象限
            bl = (Math.acos(x / this._parent._radius) + Math.PI * 1.5) / (2 * Math.PI)
          }

          sts.push(bl * radiohw, z === this._zMin ? 0 : 1)
        }
        // if (this._position[9 * triInd + 1] > 0 || this._position[9 * triInd + 1] === 0) {
        //   const bl = Math.acos(this._position[9 * triInd + 0] / this._parent._radius) / (2 * Math.PI)
        //   sts.push(
        //     bl,
        //     (this._length / 2 + this._position[9 * triInd + 2]) / (this._length)
        //   )
        // } else {

        // }
        // // sts.push(
        // //   (this._parent._radius - this._position[9 * triInd + 0]) / ((this._parent._radius) * 2),
        // //   (this._length / 2 + this._position[9 * triInd + 2]) / (this._length)
        // // )
        // sts.push(
        //   (this._parent._radius - this._position[9 * triInd + 3]) / ((this._parent._radius) * 2),
        //   (this._length / 2 + this._position[9 * triInd + 5]) / (this._length)
        // )
        // sts.push(
        //   (this._parent._radius - this._position[9 * triInd + 6]) / ((this._parent._radius) * 2),
        //   (this._length / 2 + this._position[9 * triInd + 8]) / (this._length)
        // )
      }
    }
    return sts
  }

  setZscale() {
    const mat = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(this._parent._center.x, this._parent._center.y, 0))
    const scaleZ = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, 1, this._parent._zStretch), new Cesium.Matrix4())
    this._model.modelMatrix = Cesium.Matrix4.multiply(mat, scaleZ, mat)
  }
}
export default Drill
