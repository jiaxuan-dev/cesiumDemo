/*
 * @Descripttion: 虚拟tin
 * @version: 1.0
 * @Author: hxl
 * @Date: 2020-07-17 16:40:29
 * @LastEditors: hxl
 * @LastEditTime: 2020-07-22 11:03:11
 */
import Tin from './Tin'
export default class VirtualTin extends Tin {
  constructor(options) {
    super(options)
    this.data = options.plgData || []
    this._zOffset = 0
  }

  calculateGeometryInfo() {
    // 转换为cesium 世界坐标
    const mypositions = Cesium.Cartesian3.fromDegreesArrayHeights(this.data)
    // 点的数量
    const numPositions = mypositions.length
    // 点存储空间
    const pos = []
    const indexs = []
    for (let i = 0; i < numPositions; ++i) {
      indexs.push(i)
      pos.push(mypositions[i].x, mypositions[i].y, mypositions[i].z)
    }
    this._indices = indexs
    this._position = pos
  }
}
