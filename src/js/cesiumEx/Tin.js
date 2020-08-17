/*
 * @Author: hxl
 * @Date: 2020-04-22 14:07:56
 * @LastEditTime: 2020-07-23 14:56:48
 * @LastEditors: hxl
 * @Description: 解析tin几何数据
 * @FilePath: \CreatarWebGlobe\src\js\cesiumEx\Tin.js
 */
class Tin {
  /**
   * @description: 解析tin几何数据
   * @para {Object} 数据
   * @return:{Primitive} Tin
   */
  constructor(options) {
    this._id = options.id
    this._name = options.name || ''
    this._parentName = options.parentName || ''
    this._parentId = options.parentId
    this._parentNodeId = options.parentNodeId
    this._nodeId = options.nodeId
    this._color = options.color ? Cesium.Color.fromBytes(options.color.red, options.color.green, options.color.blue, options.color.alpha) : Cesium.Color.RED
    this._renderPath = options.renderPath || ''
    this.data = options.layerdatas || []
    // this._height = options.height; // 模型空间高度
    this._extent = options.modelExtent // 总模型四至范围
    this._tinExtent = options.extent // 单层范围
    this._isSmoot = options.isSmoot || true // 采用共顶点绘制
    this._alpha = options.alpha || 1 // 透明度

    this._zOffset = -150
    this._zStretch = 1 // z拉伸
    this._show = true // 可见性
    this._textureMode = options.textureMode || false // 纹理模式
    this._textureInfo = options.textureInfo // 纹理模型信息
    this._near = options.near ? options.near : 0
    this._far = options.far ? options.far : 700000

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
      }
    })
  }

  instantiation() {
    this.instantiationPrimitive() // 颜色模型
    this.instantiationModel()
    this.setZoffset()
  }

  instantiationModel() {
    if (!this._textureInfo) return
    const mat = this.getModelMatrix()

    this._model = Cesium.Model.fromGltf({
      id: {
        id: this._id,
        parentId: this._parentId,
        name: this._name
      },
      show: this._textureMode,
      url: this._textureInfo.url,
      modelMatrix: mat,
      color: Cesium.Color.WHITE.withAlpha(this._alpha),
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(this._near, this._far)
    })
    // 绑定选中事件到对象原型上
    this._model.setSelect = this.setModelSelect
    Viewer.scene.primitives.add(this._model)
  }

  instantiationPrimitive() {
    if (!this.data) return
    const { GeometryInstance, ColorGeometryInstanceAttribute, Primitive, PerInstanceColorAppearance } = Cesium
    const geo = this.createGeometry()

    const gInstance = new GeometryInstance({
      geometry: geo,
      id: {
        id: this._id,
        parentId: this._parentId,
        name: this._name
      },
      // modelMatrix: Cesium.Matrix4.multiplyByTranslation(
      //   Cesium.Matrix4.IDENTITY,
      //   new Cesium.Cartesian3(0.0, 0.0, 1000),
      //   new Cesium.Matrix4()
      // ),
      attributes: {
        color: new ColorGeometryInstanceAttribute(this._color.red, this._color.green, this._color.blue, this._alpha),
        distanceDisplayCondition: new Cesium.DistanceDisplayConditionGeometryInstanceAttribute(this._near, this._far)
      }
    })
    this._colorModel = new Primitive({
      cull: false,
      show: !this._textureMode,
      geometryInstances: [gInstance],
      modelMatrix: Cesium.Matrix4.IDENTITY,
      appearance: new PerInstanceColorAppearance({
        // closed: false, // 启用背面剔除
        renderState: {
          blending: Cesium.BlendingState.ALPHA_BLEND, // 使用Alpha混合功能启用混合
          depthTest: {
            enabled: true
          }
        },
        translucent: false // 显示为半透明
      })
    })
    // 绑定选中事件到对象原型上
    this._colorModel._color = this._color
    this._colorModel._id = gInstance.id
    this._colorModel.setSelect = this.setSelect
    Viewer.scene.primitives.add(this._colorModel)
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
    // if (defined(normals)) {
    //   attributes.normal = new GeometryAttribute({
    //     componentDatatype: ComponentDatatype.FLOAT,
    //     componentsPerAttribute: 3,
    //     values: new Float64Array(normals)
    //   });
    // }
    // attributes.color = new Cesium.GeometryAttribute({
    //   componentDatatype: Cesium.ComponentDatatype.FLOAT,
    //   componentsPerAttribute: 4,
    //   values: new Float64Array(colors)
    // })
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
    let positions = []
    // const normals = []
    const colors = []
    let indexs = []

    let lasttinVertexIndex = 0
    // 共顶点 平滑
    if (this._isSmoot) {
      this.data.forEach(layerdata => {
        const triangles = layerdata.triangles
        const vertexes = layerdata.vertexes
        const number = vertexes.length

        let newVertexes = []
        // 顶点坐标
        if (this._zStretch > 1) {
          for (let i = 0; i < number; i += 3) {
            newVertexes.push(vertexes[i])
            newVertexes.push(vertexes[i + 1])
            newVertexes.push(vertexes[i + 2] * this._zStretch)
          }
        } else {
          newVertexes = vertexes
        }
        positions = positions.concat(newVertexes)
        // 顶点索引
        indexs = indexs.concat(
          triangles.map(function(triangle) {
            return triangle + lasttinVertexIndex
          })
        )
        lasttinVertexIndex += vertexes.length / 3
        for (let j = 0; j < vertexes.length / 3; j++) {
          colors.push(this._color.red, this._color.green, this._color.blue, this._color.alpha)
        }
      })
    } else {
      indexs = []
      this.data.forEach(layerdata => {
        const triangles = layerdata.triangles
        const vertexes = layerdata.vertexes
        for (let i = 0, l = triangles.length; i < l; i += 3) {
          const x1 = vertexes[triangles[i] * 3]
          const y1 = vertexes[triangles[i] * 3 + 1]
          const z1 = vertexes[triangles[i] * 3 + 2] * this._zStretch
          const x2 = vertexes[triangles[i + 1] * 3]
          const y2 = vertexes[triangles[i + 1] * 3 + 1]
          const z2 = vertexes[triangles[i + 1] * 3 + 2] * this._zStretch
          const x3 = vertexes[triangles[i + 2] * 3]
          const y3 = vertexes[triangles[i + 2] * 3 + 1]
          const z3 = vertexes[triangles[i + 2] * 3 + 2] * this._zStretch

          positions.push(x1, y1, z1, x2, y2, z2, x3, y3, z3)
          indexs.push(i + lasttinVertexIndex, i + lasttinVertexIndex + 1, i + lasttinVertexIndex + 2)
          colors.push(this._color.red, this._color.green, this._color.blue, this._color.alpha)
          colors.push(this._color.red, this._color.green, this._color.blue, this._color.alpha)
          colors.push(this._color.red, this._color.green, this._color.blue, this._color.alpha)
          // const vx = new Cesium.Cartesian3(x2 - x1, y2 - y1, z2 - z1);
          // const vx2 = new Cesium.Cartesian3(x3 - x1, y3 - y1, z3 - z1);
          // let vx3 = Cesium.Cartesian3.cross(vx, vx2, new Cesium.Cartesian3());
          // vx3 = Cesium.Cartesian3.normalize(vx3, new Cesium.Cartesian3());
          // normals.push(vx3.x, vx3.y, vx3.z);
          // normals.push(vx3.x, vx3.y, vx3.z);
          // normals.push(vx3.x, vx3.y, vx3.z);
        }
        lasttinVertexIndex = lasttinVertexIndex + triangles.length
      })
    }
    // 转换为cesium 世界坐标
    const mypositions = Cesium.Cartesian3.fromDegreesArrayHeights(positions)
    // 点的数量
    const numPositions = mypositions.length
    // 点存储空间
    const pos = []
    for (let i = 0; i < numPositions; ++i) {
      pos[i * 3] = mypositions[i].x
      pos[i * 3 + 1] = mypositions[i].y
      pos[i * 3 + 2] = mypositions[i].z
    }
    this._position = pos
    this._indices = indexs
    this._colors = colors
  }

  destroy() {
    if (this._colorModel) {
      Viewer.scene.primitives.remove(this._colorModel)
      this._colorModel.destroy()
    }

    if (this._model) {
      Viewer.scene.primitives.remove(this._model)
      this._model.destroy()
    }
    this.data = null
    this._indices = null
    this._position = null
    this._colors = null
    this._sts = null
  }

  setAlpha() {
    if (this._model) {
      this._model.color = Cesium.Color.WHITE.withAlpha(this._alpha)
    }
    if (this._colorModel) {
      const attributes = this._colorModel.getGeometryInstanceAttributes(this._colorModel._id)
      attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(this._color.red, this._color.green, this._color.blue, this._alpha))
    }
  }

  setShow() {
    this._textureMode ? (this._model.show = this._show) : (this._colorModel.show = this._show)
  }

  setZscale() {
    if (this._model) {
      this._model.modelMatrix = this.getModelMatrix()
    }
    this._colorModel.modelMatrix = this.getColorMatrix()
    this.setZoffset()
  }

  getColorMatrix() {
    // 转换到球中心
    const center = Cesium.Cartesian3.fromDegrees((this._extent.maxx + this._extent.minx) / 2, (this._extent.maxy + this._extent.miny) / 2, 0)
    // 沿缩放方缩放
    const normalCenter = Cesium.Cartesian3.normalize(center, new Cesium.Cartesian3()) // 平行于缩放方向的单位向量
    const tt = Cesium.Matrix4.setTranslation(Cesium.Matrix4.IDENTITY, Cesium.Cartesian3.negate(center, new Cesium.Cartesian3()), new Cesium.Matrix4())
    const k = this._zStretch // 缩放因子
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
    return mm
  }

  getModelMatrix() {
    const origin = Cesium.Cartesian3.fromDegrees((this._extent.maxx + this._extent.minx) / 2, (this._extent.maxy + this._extent.miny) / 2, this._extent.maxz) // 默认偏移50  (this._extent.maxz + this._extent.minz) / 2 - 100
    const mat = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
    var heading = Cesium.Math.toRadians(-90)
    var rotationZ = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(heading))
    Cesium.Matrix4.multiply(mat, rotationZ, mat)
    const scaleZ = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, 1, this._zStretch), new Cesium.Matrix4())
    Cesium.Matrix4.multiply(mat, scaleZ, mat)
    return mat
  }

  setRealZscale() {
    Viewer.scene.primitives.remove(this._colorModel)
    this._colorModel = this.instantiationPrimitive()
    Viewer.scene.primitives.add(this._colorModel)
  }

  setZoffset() {
    const center = Cesium.Cartesian3.fromDegrees((this._extent.maxx + this._extent.minx) / 2, (this._extent.maxy + this._extent.miny) / 2, 0)
    const normalCenter = Cesium.Cartesian3.normalize(center, new Cesium.Cartesian3()) // 平行于缩放方向的单位向量
    if (this._model) {
      const translation = Cesium.Matrix4.getTranslation(this.getModelMatrix(), new Cesium.Cartesian3())
      const newTranslation = Cesium.Cartesian3.add(translation, Cesium.Cartesian3.multiplyByScalar(normalCenter, this._zOffset, new Cesium.Cartesian3()), new Cesium.Cartesian3())
      this._model.modelMatrix = Cesium.Matrix4.setTranslation(this._model.modelMatrix, newTranslation, new Cesium.Matrix4())
    }
    // 获取默认颜色模型的矩阵的平移矩阵
    const translation = Cesium.Matrix4.getTranslation(this.getColorMatrix(), new Cesium.Cartesian3())
    const newTranslation = Cesium.Cartesian3.add(translation, Cesium.Cartesian3.multiplyByScalar(normalCenter, this._zOffset, new Cesium.Cartesian3()), new Cesium.Cartesian3())
    this._colorModel.modelMatrix = Cesium.Matrix4.setTranslation(this._colorModel.modelMatrix, newTranslation, new Cesium.Matrix4())
  }

  setAppearance() {
    if (!this._show) return
    if (this._textureMode) {
      if (this._model) {
        this._colorModel.show = false
        this._model.show = true
      } else {
        if (!this._textureInfo) {
          this._textureMode = false
          return
        }
        this._colorModel.show = false
      }
    } else {
      if (this._colorModel) {
        this._colorModel.show = true
        if (this._model) {
          this._model.show = false
        }
      }
    }
  }

  setModelSelect(bool) {
    bool ? (this.color = Cesium.Color.RED.withAlpha(this._alpha)) : (this.color = Cesium.Color.WHITE.withAlpha(this._alpha))
  }

  setSelect(bool) {
    const attributes = this.getGeometryInstanceAttributes(this._id)
    let color = null
    bool ? (color = Cesium.Color.RED) : (color = this._color)
    attributes.color = Cesium.ColorGeometryInstanceAttribute.toValue(new Cesium.Color(color.red, color.green, color.blue, 1))
  }
}
export default Tin
