/*
 * @Descripttion: 框架剖面
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-05-19 14:38:38
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-24 15:11:37
 */

class Section {
  constructor(options) {
    this._layerId = options.layerId
    this._layerName = options.layerName
    this._startElevation = options.startElevation
    this.depth = options.depth
    this._points = options.points
    this._datas = options.data
    this._center = options.center
    this._sectionType = options.type // 1:纵剖面 2:横剖面

    this._alpha = options.alpha || 1 // 透明度
    this._zStretch = options.zStretch || 1 // z拉伸
    this._zOffset = 0
    this._show = true // 可见性
    this._textureMode = options.textureMode || true // 纹理模式
    this._near = options.near ? options.near : 0
    this._far = options.far ? options.far : 700000
    this._models = []
    this._uuid = Cesium.createGuid()
    Object.defineProperties(this, {
      textureMode: {
        get: () => {
          return this._textureMode
        },
        set: bool => {
          this._textureMode = bool
          this.setAppearance()
        }
      },
      alpha: {
        get: () => {
          return this._alpha
        },
        set: value => {
          this._alpha = value
          this.setAlpha()
        }
      },
      zStretch: {
        get: () => {
          return this._zStretch
        },
        set: value => {
          this._zStretch = value
          this.setZscale()
        }
      },
      zOffset: {
        get: () => {
          return this._zOffset
        },
        set: value => {
          this._zOffset = value
          this.setZoffset()
        }
      },
      show: {
        get: () => {
          return this._show
        },
        set: value => {
          this._show = value
          this.setShow()
        }
      },
      topZ: {
        // 横剖面需要设置参考顶面z值
        get: () => {
          return this._center.z
        },
        set: value => {
          this._center.z = value
        }
      }
    })
  }

  instantiationPrimitives() {
    if (!this._datas) return
    this._datas.forEach(data => {
      if (data.plgData.length > 0) {
        const sectionChildren = new SectionChildren({
          data: data,
          parent: this
        })
        sectionChildren.instantiationPrimitive()
        this._models.push(sectionChildren)
      }
    })
    if (this._sectionType === 1) {
      this._center.z = this._models
        .map(m => {
          return m._zMax
        })
        .sort(function(a, b) {
          return b - a
        })[0]
    }
  }

  destroy() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.destroy()
    }
    this._models = []
    this._datas = null
  }

  setAlpha() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.setAlpha()
    }
  }

  setAppearance() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.setAppearance()
      model.setZscale()
      model.setZoffset()
    }
  }

  // 闪烁
  setBlink() {
    let show = true
    let time = 0
    let timer = setInterval(() => {
      this._models.forEach(model => {
        model._model.setSelect(show)
      })
      show = !show
      time += 200
      if (time > 1000) {
        clearInterval(timer)
        this._models.forEach(model => {
          model._model.setSelect(false)
        })
        timer = null
      }
    }, 200)
  }

  setShow() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.setShow(this._show)
    }
  }

  setZoffset() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.setZoffset()
    }
  }

  setZscale() {
    for (let index = 0; index < this._models.length; index++) {
      const model = this._models[index]
      model.setZscale()
    }
  }
}

class SectionChildren {
  constructor(options) {
    this._data = options.data
    this._parent = options.parent
    this._xMax = -999999999999999999
    this._xMin = 999999999999999999
    this._yMax = -999999999999999999
    this._yMin = 999999999999999999
    this._zMax = -999999999999999999
    this._zMin = 999999999999999999
    this._model = null
    // this.instantiationPrimitive()
    this._depth = this._zMax - this._zMin
  }

  instantiationPrimitive() {
    const { GeometryInstance, ColorGeometryInstanceAttribute, Primitive } = Cesium
    let id = null
    let color = null
    const gInstances = []
    if (this._data.name === 'Fault_result_line') {
      // 断层线
      if (this._data.plgData.length === 0) return
      const points = this._data.plgData
      color = Cesium.Color.RED
      id = {
        parentId: this._layerId,
        name: this._data.name
      }
      for (let i = 0; i < points.length; i += 6) {
        const line = [points[i], points[i + 1], points[i + 2], points[i + 3], points[i + 4], points[i + 5]]
        const geo = Cesium.SimplePolylineGeometry.createGeometry(
          new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(line)
          })
        )
        gInstances.push(
          new GeometryInstance({
            geometry: geo,
            id: id,
            attributes: {
              color: ColorGeometryInstanceAttribute.fromColor(color),
              distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(this._near, this._far)
            }
          })
        )
      }
    } else {
      const geo = this.createGeometry()
      this._depth = this._zMax - this._zMin
      color = new Cesium.Color(this._data.color.red / 255, this._data.color.green / 255, this._data.color.blue / 255, this._parent._alpha) || Cesium.Color.RED
      id = {
        id: this._data.id,
        parentId: this._parent._layerId,
        name: this._data.name,
        parentuuid: this._parent._uuid,
        depth: this._zMin,
        thick: this._zMax - this._zMin,
        type: 2
      }
      gInstances.push(
        new GeometryInstance({
          geometry: geo,
          id: id,
          attributes: {
            color: ColorGeometryInstanceAttribute.fromColor(color),
            distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(this._near, this._far)
          }
        })
      )
    }
    const model = new Primitive({
      cull: false,
      show: this._parent._show,
      geometryInstances: gInstances,
      modelMatrix: Cesium.Matrix4.IDENTITY,
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

  calculateExtremum(position) {
    if (position.x > this._xMax) this._xMax = position.x
    if (position.y > this._yMax) this._yMax = position.y
    if (position.z > this._zMax) this._zMax = position.z

    if (position.x < this._xMin) this._xMin = position.x
    if (position.y < this._yMin) this._yMin = position.y
    if (position.z < this._zMin) this._zMin = position.z
  }

  calculateSts() {
    const planex = this._xMax - this._xMin
    const planey = this._yMax - this._yMin
    const planez = this._zMax - this._zMin
    let curPlane
    let radiohw
    if (planez < 0.00001) {
      curPlane = 'GLB_PLANE_XY'
      radiohw = planey / planex
    } else if (planex > planey) {
      curPlane = 'GLB_PLANE_XZ'
      radiohw = Math.sqrt(planex * planex + planey * planey) / planez
    } else {
      curPlane = 'GLB_PLANE_YZ'
      radiohw = Math.sqrt(planex * planex + planey * planey) / planez
    }
    if (radiohw < 0.000001) {
      radiohw = 1
    }
    // radiohw = 1;
    const sts = []
    for (let triInd = 0; triInd < this._position.length / 9; triInd++) {
      if (curPlane === 'GLB_PLANE_XY') {
        sts.push(((this._position[9 * triInd + 0] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 1] - this._yMin) / (this._yMax - this._yMin))
        sts.push(((this._position[9 * triInd + 3] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 4] - this._yMin) / (this._yMax - this._yMin))
        sts.push(((this._position[9 * triInd + 6] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 7] - this._yMin) / (this._yMax - this._yMin))
      } else if (curPlane === 'GLB_PLANE_XZ') {
        sts.push(((this._position[9 * triInd + 0] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 2] - this._zMin) / (this._zMax - this._zMin))
        sts.push(((this._position[9 * triInd + 3] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 5] - this._zMin) / (this._zMax - this._zMin))
        sts.push(((this._position[9 * triInd + 6] - this._xMin) / (this._xMax - this._xMin)) * radiohw, (this._position[9 * triInd + 8] - this._zMin) / (this._zMax - this._zMin))
      } else {
        sts.push(((this._position[9 * triInd + 1] - this._yMin) / (this._yMax - this._yMin)) * radiohw, (this._position[9 * triInd + 2] - this._zMin) / (this._zMax - this._zMin))
        sts.push(((this._position[9 * triInd + 4] - this._yMin) / (this._yMax - this._yMin)) * radiohw, (this._position[9 * triInd + 5] - this._zMin) / (this._zMax - this._zMin))
        sts.push(((this._position[9 * triInd + 7] - this._yMin) / (this._yMax - this._yMin)) * radiohw, (this._position[9 * triInd + 8] - this._zMin) / (this._zMax - this._zMin))
      }
    }
    return sts
  }

  createGeometry() {
    const { Geometry, GeometryAttribute, ComponentDatatype, PrimitiveType, BoundingSphere } = Cesium
    const attributes = {}

    if (!this._position) {
      this.calculateGeometryInfo()
    }
    attributes.position = new GeometryAttribute({
      componentDatatype: ComponentDatatype.DOUBLE,
      componentsPerAttribute: 3,
      values: new Float64Array(this._position)
    })
    if (this._colors) {
      attributes.color = new GeometryAttribute({
        componentDatatype: ComponentDatatype.FLOAT,
        componentsPerAttribute: 4,
        //   normalize: true,
        values: new Float32Array(this._colors)
      })
    }
    if (this._parent._textureMode) {
      if (this._sts && this._sts.length > 0) {
        attributes.st = new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 2,
          values: new Float32Array(this._sts)
        })
      }
    }

    const geo = new Geometry({
      attributes: attributes,
      indices: new Uint32Array(this._indices),
      primitiveType: PrimitiveType.TRIANGLES,
      boundingSphere: BoundingSphere.fromVertices(this._position)
    })
    // 计算每个顶点法线，方法是平均入射到顶点的所有三角形
    Cesium.GeometryPipeline.computeNormal(geo)

    return geo
  }

  calculateGeometryInfo() {
    // 转换为cesium 世界坐标
    const mypositions = Cesium.Cartesian3.fromDegreesArrayHeights(this._data.plgData)
    // 点的数量
    const numPositions = mypositions.length
    // 点存储空间
    const pos = []
    const indexs = []
    for (let i = 0; i < numPositions; ++i) {
      indexs.push(i)
      pos.push(mypositions[i].x, mypositions[i].y, mypositions[i].z)
      // this.calculateExtremum(mypositions[i])
      this._zMax = this._data.plgData[i * 3 + 2] > this._zMax ? this._data.plgData[i * 3 + 2] : this._zMax
      this._zMin = this._data.plgData[i * 3 + 2] < this._zMin ? this._data.plgData[i * 3 + 2] : this._zMin
    }
    this._indices = indexs
    this._position = pos
    // this._sts = this.calculateSts()
    this._sts = this._data.uvData
  }

  createAppearence(url) {
    if (this._parent._textureMode && url) {
      return new Cesium.MaterialAppearance({
        // closed: true,
        // materialSupport: Cesium.MaterialAppearance.MaterialSupport.ALL,
        material: new Cesium.Material({
          fabric: {
            type: 'Image',
            uniforms: {
              image: url
            }
          }
        })
      })
    } else {
      return new Cesium.PerInstanceColorAppearance({
        closed: false, // 启用背面剔除
        // renderState: {
        //   blending: Cesium.BlendingState.ALPHA_BLEND, // 使用Alpha混合功能启用混合
        //   depthTest: {
        //     enabled: true
        //   }
        // },
        translucent: false // 显示为半透明
      })
    }
  }

  destroy() {
    Viewer.scene.primitives.remove(this._model)
    this._model = null
    this._data = null
    this._indices = null
    this._position = null
    this._sts = null
  }

  setAlpha() {
    const attributes = this._model.getGeometryInstanceAttributes(this._model._id)
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(this._model._color.red, this._model._color.green, this._model._color.blue, this._parent._alpha))
  }

  setAppearance() {
    this.instantiationPrimitive()
  }

  setShow() {
    this._model.show = this._parent._show
  }

  setSelect(bool) {
    const attributes = this.getGeometryInstanceAttributes(this._id)
    let color = null
    bool ? (color = Cesium.Color.RED) : (color = this._color)
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(color.red, color.green, color.blue, 1))
    if (this.appearance.material) {
      if (!bool) {
        this.appearance.material = new Cesium.Material({
          // 于JSON格式来描述materials的机制
          fabric: {
            type: 'DiffuseMap',
            uniforms: {
              image: this._renderPath
            }
          },
          translucent: false // 显示为半透明
        })
      } else {
        this.appearance.material = Cesium.Material.fromType('Color')
      }
    }
  }

  setZoffset() {
    const center = Cesium.Cartesian3.fromDegrees(this._parent._center.x, this._parent._center.y, 0)
    const normalCenter = Cesium.Cartesian3.normalize(center, new Cesium.Cartesian3()) // 平行于缩放方向的单位向量
    // 获取默认模型的矩阵的平移矩阵
    const translation = Cesium.Matrix4.getTranslation(this._model.modelMatrix, new Cesium.Cartesian3())
    const newTranslation = Cesium.Cartesian3.add(translation, Cesium.Cartesian3.multiplyByScalar(normalCenter, this._parent.zOffset, new Cesium.Cartesian3()), new Cesium.Cartesian3())

    this._model.modelMatrix = Cesium.Matrix4.setTranslation(this._model.modelMatrix, newTranslation, new Cesium.Matrix4())
  }

  setZscale() {
    // 转换到球中心
    const center = Cesium.Cartesian3.fromDegrees(this._parent._center.x, this._parent._center.y, 0)
    // 沿缩放方缩放
    const normalCenter = Cesium.Cartesian3.normalize(center, new Cesium.Cartesian3()) // 平行于缩放方向的单位向量
    const tt = Cesium.Matrix4.setTranslation(Cesium.Matrix4.IDENTITY, Cesium.Cartesian3.negate(center, new Cesium.Cartesian3()), new Cesium.Matrix4())
    const k = this._parent._zStretch // 缩放因子
    const nx = normalCenter.x
    const ny = normalCenter.y
    const nz = normalCenter.z
    // 矩阵变换：沿任意方向缩放 https://blog.csdn.net/zsq306650083/article/details/8776168
    const nn = new Cesium.Matrix4(
      1 + (k - 1) * nx * nx,
      (k - 1) * nx * ny,
      (k - 1) * nx * nz,
      0,
      (k - 1) * nx * ny,
      1 + (k - 1) * ny * ny,
      (k - 1) * nz * ny,
      0,
      (k - 1) * nx * nz,
      (k - 1) * nz * ny,
      1 + (k - 1) * nz * nz,
      0,
      0,
      0,
      0,
      1
    )
    // 拉回本来位置
    const ntt = Cesium.Matrix4.setTranslation(Cesium.Matrix4.IDENTITY, center, new Cesium.Matrix4())
    const mm = Cesium.Matrix4.multiply(ntt, Cesium.Matrix4.multiply(nn, tt, new Cesium.Matrix4()), new Cesium.Matrix4())
    this._model.modelMatrix = mm
  }
}
export { Section, SectionChildren }
