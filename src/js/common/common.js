/* eslint-disable */
import countyJson from '../../assets/data/county.json'
import townJson from '../../assets/data/town.json'
import * as turf from '@turf/turf'

function colorDecimalToRGBA(number) {
  var regPos = /^\d+(\.\d+)?$/ //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ //负浮点数
  if (!regPos.test(number) && !regNeg.test(number)) return number
  var alpha = (number >> 24) & 0xff
  var red = (number >> 16) & 0xff
  var green = (number >> 8) & 0xff
  var blue = number & 0xff
  return {
    red: red,
    green: green,
    blue: blue,
    alpha: alpha
  }
}
// 计算线长([经度、纬度、经度、纬度])
function calulationLineLength(points) {
  if (points.length < 4) return
  let length = 0
  const cartesians = Cesium.Cartesian3.fromDegreesArray(points)
  for (let index = 0; index < cartesians.length; index++) {
    if (index > 0) length += Cesium.Cartesian3.distance(cartesians[index], cartesians[index - 1])
  }
  return length
}

//计算三角形面积
function cmputeArea(points) {
  const a = calulationLineLength([points[0], points[1], points[2], points[3]])
  const b = calulationLineLength([points[0], points[1], points[4], points[5]])
  const c = calulationLineLength([points[4], points[5], points[2], points[3]])
  const p = (a + b + c) / 2
  return Math.sqrt(p * (p - a) * (p - b) * (p - c))
}
// 计算给定线外包中心点
function calulationLineRectCenter(points) {
  //if (points.length < 2)
  //    return;
  var maxx,
    maxy,
    minx,
    miny,
    xs = [],
    ys = []
  for (var i = 0; i < points.length; i += 2) {
    xs.push(points[i])
    ys.push(points[i + 1])
  }

  maxx = Math.max.apply(null, xs)
  maxy = Math.max.apply(null, ys)
  minx = Math.min.apply(null, xs)
  miny = Math.min.apply(null, ys)
  // var strLineLen = Math.sqrt((maxx - minx) * (maxx - minx) + (maxy - miny) * (maxy - miny)); //对角线长度
  return {
    x: (minx + maxx) / 2,
    y: (miny + maxy) / 2,
    z: 0
  }
}
// 相机到点的距离 （点格式 经纬度）
function calCameraToPointDistance(point) {
  const camP = Viewer.camera.position

  const leftP = Cesium.Cartesian3.fromDegrees(point.x, point.y, point.z)
  return Cesium.Cartesian3.distance(leftP, camP)
}
//获取镇
function getTownInfo(points) {
  const belongRegion = []
  townJson.features.forEach(m => {
    var pts = turf.points(points)
    var searchWithin = turf.polygon(m['geometry']['rings'])
    var ptsWithin = turf.pointsWithinPolygon(pts, searchWithin)
    if (ptsWithin.features.length > 0) {
      belongRegion.push(m['attributes']['name'])
    }
  })
  return belongRegion
}
//获取县
function getCounty(points) {
  const belongRegion = []
  countyJson.features.forEach(m => {
    var pts = turf.points(points)
    var searchWithin = turf.polygon(m['geometry']['rings'])
    var ptsWithin = turf.pointsWithinPolygon(pts, searchWithin)
    if (ptsWithin.features.length > 0) {
      belongRegion.push(m['attributes']['name'])
    }
  })
  return belongRegion
}

function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = '' //"" 引号里面可以加任意字符，代表拼接的意思，如果不加就是 纯32位支付

  var uuid = s.join('')
  return uuid
}

function sleep(sleepTime) {
  var start = new Date().getTime()
  while (new Date().getTime() - start < sleepTime) {
    continue
  }
}

function drag(dragBox, moveBox = dragBox) {
  dragBox.onmousedown = e => {
    var disX = e.clientX - moveBox.offsetLeft
    var disY = e.clientY - moveBox.offsetTop
    document.onmousemove = e => {
      e.preventDefault()
      var l = e.clientX - disX
      var t = e.clientY - disY
      var x = document.documentElement.clientWidth - moveBox.offsetWidth
      var y = document.documentElement.clientHeight - moveBox.offsetHeight
      l = l < 0 ? 0 : l > x ? x : l
      t = t < 0 ? 0 : t > y ? y : t
      moveBox.style.left = l + 'px'
      moveBox.style.top = t + 'px'
      return false
    }
    document.onmouseup = () => {
      document.onmousemove = null
      document.onmouseup = null
      return false
    }
    return false
  }
}

export { colorDecimalToRGBA, uuid, sleep, calulationLineLength, calulationLineRectCenter, calCameraToPointDistance, getTownInfo, getCounty, drag }
