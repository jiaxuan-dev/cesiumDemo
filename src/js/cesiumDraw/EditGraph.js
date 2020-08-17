/**
 * @author jiaxuan <jiax@creatar.com>
 */
import * as Cesium from 'cesium/Build/Cesium/Cesium'
class ArrowPolyline {
  /**
   * 箭头线
   * @param {object} option 绘制箭头线的颜色大小等属性
   */
  constructor(option = {}) {
    this._color = option.color || Cesium.Color.RED;
    this._width = option.width || 3;
    this._headWidth = option.headWidth || 2 * this._width;
    this._length = option.length || 300
    this._headLength = option.headLength || 10
    this._inverse = option.inverse || false
    this.position = option.position
    const id = option.id
    //这里用的是圆锥几何对象，当topRadius和bottomRadius相同时，它就是一个圆柱
    const line = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._length,
      topRadius: this._width,
      bottomRadius: this._width
    }));
    const arrow = Cesium.CylinderGeometry.createGeometry(new Cesium.CylinderGeometry({
      length: this._headLength,
      topRadius: 0,
      bottomRadius: this._headWidth
    }));
    let offset = (this._length + this._headLength) / 2
    if (this._inverse) {
      offset = -offset
    }

    ArrowPolyline.translate(arrow, [0, 0, offset]);

    const pri = new Cesium.Primitive({
      modelMatrix: this.position,
      geometryInstances: [new Cesium.GeometryInstance({
        id: id + '-line',
        geometry: line,
      }),
      new Cesium.GeometryInstance({
        id: id + '-arrow',
        geometry: arrow,
      })
      ],
      appearance: new Cesium.MaterialAppearance({
        material: Cesium.Material.fromType('Color', {
          color: this._color
        })
      })
    });
    pri.id = id
    return pri
  }
  /**
   * 按上面的方法画出的箭头在线的中间，我们需要把它平移到线的一端
   * @param {object} geometry 箭头的实例
   * @param {Array} offset 箭头尖端需要平移多少的数组
   */
  static translate = function (geometry, offset) {
    const scratchOffset = new Cesium.Cartesian3();
    if (Array.isArray(offset)) {
      scratchOffset.x = offset[0];
      scratchOffset.y = offset[1];
      scratchOffset.z = offset[2];
    } else {
      Cesium.Cartesian3.clone(offset, scratchOffset);
    }

    for (let i = 0; i < geometry.attributes.position.values.length; i += 3) {
      geometry.attributes.position.values[i] += scratchOffset.x;
      geometry.attributes.position.values[i + 1] += scratchOffset.y;
      geometry.attributes.position.values[i + 2] += scratchOffset.z;
    }
  }
}

//画圆用的方法
/**
 * @param {String} id 圆形的ID
 * @param {Object} position Cartesian3
 * @param {Object} matrix 4*4矩阵
 * @param {Object} color cesium格式颜色
 */
function createAxisSphere(id, position, matrix, color) {
  const geometry = new Cesium.PolylineGeometry({
    positions: position,
    id: id,
    width: 10
  });
  const instnce = new Cesium.GeometryInstance({
    geometry: geometry,
    id: id,
    attributes: {
      color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)
    }
  });
  return new Cesium.Primitive({
    id: id,
    geometryInstances: instnce,
    appearance: new Cesium.PolylineColorAppearance({
      translucent: false
    }),
    modelMatrix: matrix
  });
}
//编辑类
/**
 * @class
 * @classdesc 绘制图形的类
 * @callback endEditCallback
 * @param {Object} viewer Cesium.Viewer
 * @param {endEditCallback} callback 结束绘制后的回调函数
 * @param {string} id 需要编辑的ID
 */
export default class EditGraph {
  constructor(viewer) {
    this._viewer = viewer
    this._handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    this.pointID = []
    if (this._viewer.entities.getById('OperationTips') == undefined) {
      this.label = this._viewer.entities.add({
        id: 'OperationTips',
        label: {
          font: '10px sans-serif',
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          showBackground: true,
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT
        }
      })
    } else {
      this.label = this._viewer.entities.getById('OperationTips')
    }
  }
  editMarker(markObject, callback) {
    //编辑标注
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
    let flag = false
    let that = this
    this.label.label.text = '鼠标左键拖动标注，右键点击屏幕结束编辑。'
    this._handler.setInputAction(function (event) {
      let pickedObject = that._viewer.scene.pick(event.position)
      if (Cesium.defined(pickedObject)) {
        if (pickedObject.id.billboard != undefined && pickedObject.id.id == markObject.id) {
          flag = true
          that._viewer.scene.screenSpaceCameraController.enableRotate = false;
          that._viewer.scene.screenSpaceCameraController.enableZoom = false;
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    //鼠标按下
    this._handler.setInputAction(function (event) {
      let pick = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
      let cartesian = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick), that._viewer.scene);
      if (flag) {
        markObject.position = cartesian
      }
      that.label.position = cartesian
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE) //鼠标移动
    this._handler.setInputAction(function (event) {
      flag = false
      that._viewer.scene.screenSpaceCameraController.enableRotate = true;
      that._viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP) //鼠标抬起
    this._handler.setInputAction(function (event) {
      that.overEditMarker()
      that.label.label.text = undefined
      that.label.position = undefined
      if (typeof (callback) == 'function') {
        callback({
          position: that._viewer.entities.getById(markObject.id).position._value
        })
      } else {
        console.log('回调函数，传函数')
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK) //右键结束编辑
  }
  editPolyline(lineObject, callback) { //编辑折线
    let polylinePos = lineObject.polyline.positions._value
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
    let that = this
    let flag = false
    let pickPointId = null
    let index = null
    for (let i in polylinePos) {
      let point = this._viewer.entities.add({
        name: "line_point",
        position: polylinePos[i],
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 8,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        }
      });
      this.pointID.push(point.id)
    } //添加关键点

    this.label.label.text = '鼠标左键拖动关键点，右键点击屏幕结束编辑。'
    this._handler.setInputAction(function (event) {
      let pickedObject = that._viewer.scene.pick(event.position)
      if (Cesium.defined(pickedObject)) {
        for (let i in that.pointID) {
          if (pickedObject.id.id == that.pointID[i]) {
            flag = true
            that._viewer.scene.screenSpaceCameraController.enableRotate = false;
            that._viewer.scene.screenSpaceCameraController.enableZoom = false;
            pickPointId = that.pointID[i]
            index = i
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN) //鼠标按下

    this._handler.setInputAction(function (event) {
      let pick = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
      let cartesian = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick), that._viewer.scene);
      if (flag) {
        that._viewer.entities.getById(pickPointId).position = cartesian
        polylinePos[index] = cartesian
        lineObject.polyline.positions = new Cesium.CallbackProperty(function () {
          return polylinePos
        }, false)
      }
      that.label.position = cartesian
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE) //鼠标移动
    this._handler.setInputAction(function (event) {
      lineObject.polyline.positions = polylinePos
      flag = false
      that._viewer.scene.screenSpaceCameraController.enableRotate = true;
      that._viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP) //鼠标抬起

    this._handler.setInputAction(function (event) {
      that.overEditPoly()
      that.label.label.text = undefined
      that.label.position = undefined
      if (typeof (callback) == 'function') {
        callback({
          position: polylinePos
        })
      } else {
        console.log('回调函数，传函数')
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
    //右键结束编辑
  }
  editPolygon(gonObject, callback) { //编辑多边形
    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)
    let that = this
    // let polygon = this._viewer.entities.getById(id)
    let flag = false
    let pickPointId = null
    let index = null
    let polygonPos = gonObject.polygon.hierarchy._value.positions
    for (let i in polygonPos) {
      let point = this._viewer.entities.add({
        name: "gon_point",
        position: polygonPos[i],
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 8,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        }
      });
      this.pointID.push(point.id)
    } //绘制关键点
    this.label.label.text = '鼠标左键拖动关键点，右键点击屏幕结束编辑。'

    this._handler.setInputAction(function (event) {
      let pickedObject = that._viewer.scene.pick(event.position)
      if (Cesium.defined(pickedObject)) {
        for (let i in that.pointID) {
          if (pickedObject.id.id == that.pointID[i]) {
            flag = true
            that._viewer.scene.screenSpaceCameraController.enableRotate = false;
            that._viewer.scene.screenSpaceCameraController.enableZoom = false;
            pickPointId = that.pointID[i]
            index = i
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN) //鼠标按下

    this._handler.setInputAction(function (event) {
      let pick = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
      let cartesian = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick), that._viewer.scene);
      if (flag) {
        that._viewer.entities.getById(pickPointId).position = cartesian
        polygonPos[index] = cartesian
        gonObject.polygon.hierarchy = new Cesium.CallbackProperty(function () {
          return new Cesium.PolygonHierarchy(polygonPos)
        }, false)
      }
      that.label.position = cartesian
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE) //鼠标移动

    this._handler.setInputAction(function (event) {
      gonObject.polygon.hierarchy = new Cesium.PolygonHierarchy(polygonPos)
      flag = false
      that._viewer.scene.screenSpaceCameraController.enableRotate = true;
      that._viewer.scene.screenSpaceCameraController.enableZoom = true;
    }, Cesium.ScreenSpaceEventType.LEFT_UP) //鼠标抬起
    this._handler.setInputAction(function (event) {
      that.overEditPoly()
      that.label.label.text = undefined
      that.label.position = undefined
      if (typeof (callback) == 'function') {
        callback({
          position: polygonPos
        })
      } else {
        console.log('回调函数，传函数')
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK) //右键结束编辑
  }
  editModel(model, callback) {
    this.overEditModel()
    const center1 = model.modelMatrix

    const boundingShpere = model.boundingSphere;
    const radius = boundingShpere.radius
    //绘制箭头线
    const axisZ = new ArrowPolyline({
      id: "axisZ",
      color: Cesium.Color.RED,
      position: center1,
      width: radius / 50,
      headWidth: radius / 50 + 5,
      length: radius * 4,
      headLength: radius / 50 + 10
    });
    const axisX = new ArrowPolyline({
      id: "axisX",
      color: Cesium.Color.GREEN,
      position: center1,
      width: radius / 50,
      headWidth: radius / 50 + 5,
      length: radius * 4,
      headLength: radius / 50 + 10
    });
    const axisY = new ArrowPolyline({
      id: "axisY",
      color: Cesium.Color.BLUE,
      position: center1,
      width: radius / 50,
      headWidth: radius / 50 + 5,
      length: radius * 4,
      headLength: radius / 50 + 10
    });
    //旋转箭头线
    const mx = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(90));
    const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
    Cesium.Matrix4.multiply(
      axisX.geometryInstances[0].modelMatrix,
      rotationX,
      axisX.geometryInstances[0].modelMatrix
    );
    Cesium.Matrix4.multiply(
      axisX.geometryInstances[1].modelMatrix,
      rotationX,
      axisX.geometryInstances[1].modelMatrix
    );
    const my = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90));
    const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
    Cesium.Matrix4.multiply(
      axisY.geometryInstances[0].modelMatrix,
      rotationY,
      axisY.geometryInstances[0].modelMatrix
    );
    Cesium.Matrix4.multiply(
      axisY.geometryInstances[1].modelMatrix,
      rotationY,
      axisY.geometryInstances[1].modelMatrix
    );
    this._viewer.scene.primitives.add(axisZ)
    this._viewer.scene.primitives.add(axisX)
    this._viewer.scene.primitives.add(axisY)
    //绘制圆形

    const position = [];
    for (let i = 0; i <= 360; i += 3) {
      const sin = Math.sin(Cesium.Math.toRadians(i));
      const cos = Math.cos(Cesium.Math.toRadians(i));
      const x = radius * cos;
      const y = radius * sin;
      position.push(new Cesium.Cartesian3(x, y, 0));
    }
    const axisSphereZ = createAxisSphere(
      "axisSphereZ",
      position,
      center1,
      Cesium.Color.RED
    );
    this._viewer.scene.primitives.add(axisSphereZ);
    const axisSphereY = createAxisSphere(
      "axisSphereY",
      position,
      center1,
      Cesium.Color.GREEN
    );
    this._viewer.scene.primitives.add(axisSphereY);
    Cesium.Matrix4.multiply(
      axisSphereY.geometryInstances.modelMatrix,
      rotationY,
      axisSphereY.geometryInstances.modelMatrix
    );
    const axisSphereX = createAxisSphere(
      "axisSphereX",
      position,
      center1,
      Cesium.Color.BLUE
    );
    this._viewer.scene.primitives.add(axisSphereX);
    Cesium.Matrix4.multiply(
      axisSphereX.geometryInstances.modelMatrix,
      rotationX,
      axisSphereX.geometryInstances.modelMatrix
    );

    let axisXflag = false //X轴平移开关
    let axisYflag = false //Y轴平移开关
    let axisZflag = false //Z轴平移开关
    let axisSphereXflag = false //X轴旋转开关
    let axisSphereYflag = false //Y轴旋转开关
    let axisSphereZflag = false //Z轴旋转开关
    let that = this

    this._handler = new Cesium.ScreenSpaceEventHandler(this._viewer.canvas)

    this.label.label.text = '鼠标左键拖动左边系和圆环进行编辑，右键点击屏幕结束编辑。'
    //鼠标按下
    this._handler.setInputAction(function (event) {
      let pickedObject = that._viewer.scene.pick(event.position)
      if (Cesium.defined(pickedObject)) {
        if (typeof (pickedObject.id) == 'string') {
          if (pickedObject.id.indexOf('axisX') != -1) {
            axisXflag = true
          }
          if (pickedObject.id.indexOf('axisY') != -1) {
            axisYflag = true
          }
          if (pickedObject.id.indexOf('axisZ') != -1) {
            axisZflag = true
          }
          if (pickedObject.id.indexOf('axisSphereX') != -1) {
            axisSphereXflag = true
          }
          if (pickedObject.id.indexOf('axisSphereY') != -1) {
            axisSphereYflag = true
          }
          if (pickedObject.id.indexOf('axisSphereZ') != -1) {
            axisSphereZflag = true
          }
          if (pickedObject.id.indexOf('axis') != -1) {
            that._viewer.scene.screenSpaceCameraController.enableRotate = false;
            that._viewer.scene.screenSpaceCameraController.enableZoom = false;
          }
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_DOWN)
    //鼠标移动
    // let cartesianfirst = Cesium.Matrix4.getTranslation(model.modelMatrix, new Cesium.Cartesian3())
    // let matrix4first = Cesium.Transforms.eastNorthUpToFixedFrame(cartesianfirst);

    // let mat31 = Cesium.Matrix4.getMatrix3(matrix4first, new Cesium.Matrix3());
    // let q1 = Cesium.Quaternion.fromRotationMatrix(mat31);
    // let hpr1 = Cesium.HeadingPitchRoll.fromQuaternion(q1)
    // console.log(hpr1.heading * 180 / Math.PI)
    // console.log(hpr1.pitch * 180 / Math.PI)
    // console.log(hpr1.roll * 180 / Math.PI)
    this._handler.setInputAction(function (event) {
      let pick1 = new Cesium.Cartesian2(event.startPosition.x, event.startPosition.y);
      let cartesian1 = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick1), that._viewer.scene);
      let pick2 = new Cesium.Cartesian2(event.endPosition.x, event.endPosition.y);
      let cartesian2 = that._viewer.scene.globe.pick(that._viewer.camera.getPickRay(pick2), that._viewer.scene);
      that.label.position = cartesian1
      // let mat3 = Cesium.Matrix4.getMatrix3(model.modelMatrix, new Cesium.Matrix3());
      // let q = Cesium.Quaternion.fromRotationMatrix(mat3);
      // let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q)
      console.log(axisXflag)
      if (axisXflag) { //X轴平移
        // if ((hpr.heading - hpr1.heading) * 180 / Math.PI < 26 && (hpr.heading - hpr1.heading) * 180 / Math.PI > -20 || (hpr.heading - hpr1.heading) * 180 / Math.PI < -290 && (hpr.heading - hpr1.heading) * 180 / Math.PI > -335) {
        if (cartesian2.x < cartesian1.x) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        } else if (cartesian2.x > cartesian1.x) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        }
        // } else if ((hpr.heading - hpr1.heading) * 180 / Math.PI > -110 && (hpr.heading - hpr1.heading) * 180 / Math.PI <= -20) {
        //   if (cartesian2.y > cartesian1.y) {
        //     const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
        //     Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        //     Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        //   } else if (cartesian2.y < cartesian1.y) {
        //     const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
        //     Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        //     Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        //   }
        // }else if ((hpr.heading - hpr1.heading) * 180 / Math.PI > -200 && (hpr.heading - hpr1.heading) * 180 / Math.PI <= -110) {
        //   if (cartesian2.x < cartesian1.x) {
        //     const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
        //     Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        //     Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        //   } else if (cartesian2.x > cartesian1.x) {
        //     const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(-Cesium.Cartesian3.distance(cartesian1, cartesian2), 0, 0))
        //     Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
        //     Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
        //     Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        //   }
        // }
      }
      if (axisYflag) { //Y轴平移
        if (cartesian2.y < cartesian1.y) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, Cesium.Cartesian3.distance(cartesian1, cartesian2), 0))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        } else if (cartesian2.y > cartesian1.y) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, -Cesium.Cartesian3.distance(cartesian1, cartesian2), 0))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        }
      }
      if (axisZflag) { //Z轴平移
        if (cartesian2.z > cartesian1.z) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, Cesium.Cartesian3.distance(cartesian1, cartesian2)))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        } else if (cartesian2.z < cartesian1.z) {
          const translation = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, -Cesium.Cartesian3.distance(cartesian1, cartesian2)))
          Cesium.Matrix4.multiply(model.modelMatrix, translation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, translation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, translation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, translation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, translation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, translation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, translation, axisSphereZ.modelMatrix)
        }
      }
      if (axisSphereXflag) { //X轴旋转
        if (cartesian2.y > cartesian1.y) {
          const angel = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        } else if (cartesian2.y < cartesian1.y) {
          const angel = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(-1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        }
      }
      if (axisSphereYflag) { //Y轴旋转
        if (cartesian2.x < cartesian1.x) {
          const angel = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        } else if (cartesian2.x > cartesian1.x) {
          const angel = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        }
      }
      if (axisSphereZflag) { //Z轴旋转
        if (cartesian2.x < cartesian1.x) {
          const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        } else if (cartesian2.x > cartesian1.x) {
          const angel = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(-1))
          const rotation = Cesium.Matrix4.fromRotationTranslation(angel)
          Cesium.Matrix4.multiply(model.modelMatrix, rotation, model.modelMatrix)
          Cesium.Matrix4.multiply(axisX.modelMatrix, rotation, axisX.modelMatrix)
          Cesium.Matrix4.multiply(axisY.modelMatrix, rotation, axisY.modelMatrix)
          Cesium.Matrix4.multiply(axisZ.modelMatrix, rotation, axisZ.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereX.modelMatrix, rotation, axisSphereX.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereY.modelMatrix, rotation, axisSphereY.modelMatrix)
          Cesium.Matrix4.multiply(axisSphereZ.modelMatrix, rotation, axisSphereZ.modelMatrix)
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    //鼠标抬起
    this._handler.setInputAction(function (event) {
      axisXflag = false
      axisYflag = false
      axisZflag = false
      axisSphereXflag = false
      axisSphereYflag = false
      axisSphereZflag = false
      that._viewer.scene.screenSpaceCameraController.enableRotate = true;
      that._viewer.scene.screenSpaceCameraController.enableZoom = true;

      // let mat3 = Cesium.Matrix4.getMatrix3(model.modelMatrix, new Cesium.Matrix3());
      // let q = Cesium.Quaternion.fromRotationMatrix(mat3);
      // let hpr = Cesium.HeadingPitchRoll.fromQuaternion(q)
      // console.log((hpr.heading - hpr1.heading) * 180 / Math.PI)
      // console.log((hpr.pitch - hpr1.pitch) * 180 / Math.PI)
      // console.log((hpr.roll - hpr1.roll) * 180 / Math.PI)
    }, Cesium.ScreenSpaceEventType.LEFT_UP)
    //右键结束绘制
    this._handler.setInputAction(function (event) {
      that.overEditModel()
      that.label.label.text = undefined
      that.label.position = undefined
      if (typeof (callback) == 'function') {
        callback({
          modelMatrix: model.modelMatrix
        })
      } else {
        console.log('回调函数，传函数')
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  overEditModel() { //编辑模型时结束编辑
    for (let i in this._viewer.scene.primitives._primitives) {
      if (this._viewer.scene.primitives._primitives[i]._instanceIds != undefined && typeof (this._viewer.scene.primitives._primitives[i]._instanceIds[0]) == 'string' && this._viewer.scene.primitives._primitives[i]._instanceIds[0].indexOf('axis') != -1) {
        let index = this._viewer.scene.primitives._primitives.indexOf(this._viewer.scene.primitives._primitives[i])
        this._viewer.scene.primitives.remove(this._viewer.scene.primitives.get(index))
        this.overEditModel()
      }
    }
    this._handler.destroy()
  }
  overEditPoly() { //编辑折线和多边形时结束编辑
    this._handler.destroy()
    if (this.pointID != []) {
      for (let i in this.pointID) {
        this._viewer.entities.remove(this._viewer.entities.getById(this.pointID[i]))
      }
    }
    this.pointID = []
  }
  overEditMarker() { //编辑标注时结束编辑
    this._handler.destroy()
  }
  overEditAll() { //整体结束绘制
    if (this.pointID != []) { //删除存在的点
      for (let i in this.pointID) {
        this._viewer.entities.remove(this._viewer.entities.getById(this.pointID[i]))
      }
    }
    for (let i in this._viewer.scene.primitives._primitives) { //删除模型的辅助线
      if (this._viewer.scene.primitives._primitives[i]._instanceIds != undefined && this._viewer.scene.primitives._primitives[i]._instanceIds[0].indexOf('axis') != -1) {
        let index = this._viewer.scene.primitives._primitives.indexOf(this._viewer.scene.primitives._primitives[i])
        this._viewer.scene.primitives.remove(this._viewer.scene.primitives.get(index))
        this.overEditAll()
      }
    }
    this._handler.destroy()
  }
}
