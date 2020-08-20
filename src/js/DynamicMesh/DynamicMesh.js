import * as Cesium from 'cesium/Build/Cesium/Cesium'
import colormap from 'colormap'
import * as turf from '@turf/turf'
export default class DynamicMesh {
  constructor(viewer, option, callback) {
    this.callback = callback || undefined
    this.viewer = viewer
    this.polygonPositons = option.polygonPositons
    this.smoothHeights = []
    this.pointdes = option.des
    this.colormap = option.colorMap
    this.color = colormap({
      colormap: this.colormap,
      nshades: 100,
      format: 'float',
      alpha: 1
    })
    this.speed = 40
    this._index = 0
    this.primitives = []
    this.linePrimitivearr = []
    this.Pindex = 0
    this.maxMinHeight()
    this.smooth()
    this.move()
  }

  setisoLines() {
    const pointarr = []
    const instances = []
    for (const i in this.polygonPositons[this._index]) {
      if (i % 3 === 0) {
        const location = turf.point([this.polygonPositons[this._index][i], this.polygonPositons[this._index][Number(i) + 1]], { height: this.polygonPositons[this._index][Number(i) + 2] })
        pointarr.push(location)
      }
    }

    const grid = turf.featureCollection(pointarr)
    // console.log(grid)
    const breaks = []
    for (let i = this.minH; i < this.maxH; i = i + 10) {
      breaks.push(i)
    }

    // var breaks = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    var lines = turf.isolines(grid, breaks, { zProperty: 'height' });

    // console.log(lines)
    for (const n in lines.features) {
      for (const j in lines.features[n].geometry.coordinates) {
        const positions = []
        for (const m in lines.features[n].geometry.coordinates[j]) {
          if (lines.features[n].properties.height <= this.maxH) {
            positions.push(lines.features[n].geometry.coordinates[j][m][0])
            positions.push(lines.features[n].geometry.coordinates[j][m][1])
            positions.push(lines.features[n].properties.height + 10)
          }
        }
        // let Cindex = parseInt((lines.features[n].properties.height - this.minH) / (this.maxH - this.minH) * 100)
        // console.log(this.color[Cindex], Cindex)
        instances.push(new Cesium.GeometryInstance({
          geometry: new Cesium.PolylineGeometry({
            positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
            width: 3.0,
            vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT
          }),
          attributes: {
            color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(1, 1, 1, 1))
          }
        }))
      }
    }
    const lineprimitive = new Cesium.Primitive({
      geometryInstances: instances,
      appearance: new Cesium.PolylineColorAppearance(),
      show: false
    })
    const lineprimintives = this.viewer.scene.primitives.add(lineprimitive)
    this.linePrimitivearr.push(lineprimintives)
    // { translucent: false }
  }

  smooth() {
    // console.time("sort1");
    let heightDiff = []
    for (const i in this.polygonPositons) {
      if (i < this.polygonPositons.length - 1) {
        for (const j in this.polygonPositons[i]) {
          if (j % 3 === 0) {
            heightDiff.push(this.polygonPositons[Number(i) + 1][Number(j) + 2] - this.polygonPositons[i][Number(j) + 2])
          } else {
            heightDiff.push(0)
          }
        }
        this.smoothHeights.push(heightDiff)
      }
      heightDiff = []
    }

    // console.timeEnd("sort1");
  }

  _changePoint() {
    this.meshPoint = Cesium.Cartesian3.fromDegreesArrayHeights(this.polygonPositons[this._index])
    const positionsArray = []
    const indices = []
    for (const i in this.meshPoint) {
      positionsArray.push(this.meshPoint[i].x)
      positionsArray.push(this.meshPoint[i].y)
      positionsArray.push(this.meshPoint[i].z)
      if (i < this.pointdes[this._index].ncols * (this.pointdes[this._index].nrows - 1) && i % this.pointdes[this._index].ncols !== this.pointdes[this._index].ncols - 1) {
        indices.push(Number(i))
        indices.push(i * 1 + 1)
        indices.push(i * 1 + this.pointdes[this._index].ncols)
        indices.push(i * 1 + 1)
        indices.push(i * 1 + this.pointdes[this._index].ncols + 1)
        indices.push(i * 1 + this.pointdes[this._index].ncols)
      }
    }
    this.indices = new Uint32Array(indices);
    this.positionsArray = new Float64Array(positionsArray);
  }

  maxMinHeight() {
    // console.time("sort3");
    let maxH = 0
    let minH = 0
    for (const m in this.polygonPositons) {
      for (const i in this.polygonPositons[m]) {
        if (i % 3 === 0) {
          if (this.polygonPositons[m][Number(i) + 2] !== -9999) {
            if (this.polygonPositons[m][Number(i) + 2] > maxH) {
              maxH = this.polygonPositons[m][Number(i) + 2]
            }
            if (this.polygonPositons[m][Number(i) + 2] < minH) {
              minH = this.polygonPositons[m][Number(i) + 2]
            }
          }
        }
      }
    }

    this.maxH = maxH
    this.minH = minH
    for (const m in this.polygonPositons) {
      for (const i in this.polygonPositons[m]) {
        if (i % 3 === 0) {
          if (this.polygonPositons[m][Number(i) + 2] === -9999) {
            this.polygonPositons[m][Number(i) + 2] = this.maxH + 1
            // if (this.polygonPositons[m][Number(i) + 2] > maxH) {
            //     maxH = this.polygonPositons[m][Number(i) + 2]
            // }
            // if (this.polygonPositons[m][Number(i) + 2] < minH) {
            //     minH = this.polygonPositons[m][Number(i) + 2]
            // }
          }
        }
      }
    }
    // console.timeEnd("sort3");
  }

  _changeColor() {
    const colors = []
    const color = this.color
    // console.log(color)
    for (const j in this.polygonPositons[this._index]) {
      if (j % 3 === 0) {
        if (this.polygonPositons[this._index][Number(j) + 2] > this.maxH) {
          colors.push(0)
          colors.push(0)
          colors.push(0)
          colors.push(0)
        } else {
          const Cindex = parseInt((this.polygonPositons[this._index][Number(j) + 2] - this.minH) / (this.maxH - this.minH) * 100)
          if (Cindex < 100 && Cindex >= 0) {
            colors.push(color[Cindex][0])
            colors.push(color[Cindex][1])
            colors.push(color[Cindex][2])
            colors.push(color[Cindex][3])
          } else {
            if (Cindex < 0) {
              colors.push(color[0][0])
              colors.push(color[0][1])
              colors.push(color[0][2])
              colors.push(color[0][3])
            } else if (Cindex >= 100) {
              colors.push(color[99][0])
              colors.push(color[99][1])
              colors.push(color[99][2])
              colors.push(color[99][3])
            }
          }
        }
      }
    }

    this.colors = new Float64Array(colors)
  }

  setupMesh() {
    // console.time("sort4");
    let geometry = new Cesium.Geometry({
      attributes: {
        position: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: this.positionsArray
        }),
        color: new Cesium.GeometryAttribute({
          componentDatatype: Cesium.ComponentDatatype.FLOAT,
          componentsPerAttribute: 4,
          values: this.colors
        })
        // st: new Cesium.GeometryAttribute({
        //     componentDatatype: Cesium.ComponentDatatype.FLOAT,
        //     componentsPerAttribute: 2,
        //     values: this.colors
        // })
      },
      indices: this.indices,
      primitiveType: Cesium.PrimitiveType.TRIANGLES,
      boundingSphere: Cesium.BoundingSphere.fromVertices(this.positionsArray)
    });
    geometry = Cesium.GeometryPipeline.computeNormal(geometry)
    const myInstance = new Cesium.GeometryInstance({
      geometry: geometry
    });

    this.primitive = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
        show: false,
        geometryInstances: myInstance,
        asynchronous: false,
        // releaseGeometryInstances: false,
        appearance: new Cesium.PerInstanceColorAppearance()
      })
    )

    // new Cesium.Primitive({
    //     geometryInstances: myInstance,
    //     asynchronous: false,
    //     // releaseGeometryInstances: false,
    //     appearance: new Cesium.PerInstanceColorAppearance()
    // })

    this.primitives.push(this.primitive)
    // { translucent: false }
    // console.timeEnd("sort4");
  }

  addMesh() {
    if (this.callback !== undefined && typeof this.callback === 'function') {
      this.callback()
    }
    let Pindex = 0
    let seconds = this.viewer.clock.currentTime
    // console.time('sort');
    this._addMesh = () => {
      // console.log(e)
      if (Pindex < this.linePrimitivearr.length) {
        for (const i in this.linePrimitivearr) {
          if (Number(i) !== Pindex) {
            this.primitives[i].show = false
            this.linePrimitivearr[i].show = false
          } else {
            this.primitives[i].show = true
            this.linePrimitivearr[i].show = true
          }
        }
        // Pindex = Pindex + 1
        // console.log(Cesium.JulianDate.secondsDifference(seconds, e.currentTime))
        // console.log(Cesium.JulianDate.secondsDifference(seconds, this.viewer.clock.currentTime))
        // console.log(seconds)
        // console.log(this.viewer.clock.currentTime)
        // console.timeEnd('sort');
        if (Cesium.JulianDate.secondsDifference(this.viewer.clock.currentTime, seconds) > this.speed / 1000) {
          Pindex = Pindex + 1
          seconds = this.viewer.clock.currentTime
        } else {

        }
      } else {
        this.viewer.clock.onTick.removeEventListener(this._addMesh)
        this.addMesh()
      }
    }
    this.viewer.clock.onTick.addEventListener(this._addMesh)
  }

  move() {
    // console.time("sort");
    this.flag = 0
    this._move = () => {
      if (this._index < this.polygonPositons.length) {
        this._changeColor()
        this._changePoint()
        this.setupMesh()
        this.setisoLines()
        if (this._index < this.smoothHeights.length) {
          for (const i in this.polygonPositons[this._index]) {
            if (i % 3 === 0) {
              this.polygonPositons[this._index][Number(i) + 2] = this.polygonPositons[this._index][Number(i) + 2] + (this.smoothHeights[this._index][i] / 20)
            }
          }
          this.flag = this.flag + 1
          if (this.flag >= 20) {
            this._index = this._index + 1
            this.flag = 0
          }
        } else {
          this._index = this._index + 1
        }
      } else {
        this.viewer.clock.onTick.removeEventListener(this._move)
        // console.timeEnd("sort");
        this.addMesh()
      }
    }
    this.viewer.clock.onTick.addEventListener(this._move)
  }

  remove() {
    if (this.primitive !== undefined) {
      this.viewer.clock.onTick.removeEventListener(this._addMesh)
      for (const i in this.primitives) {
        this.viewer.scene.primitives.remove(this.primitives[i])
      }
      for (const i in this.linePrimitivearr) {
        this.viewer.scene.primitives.remove(this.linePrimitivearr[i])
      }
    }
  }

  PauseOrContinue(flag) {
    if (flag) {
      this.viewer.clock.onTick.addEventListener(this._addMesh)
    } else {
      this.viewer.clock.onTick.removeEventListener(this._addMesh)
    }
  }

  setIntervalTime(num) {
    this.speed = num
  }

  setTips() {

  }
}
