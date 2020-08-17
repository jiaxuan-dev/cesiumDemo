<template>
  <div>
    <div class="chartsList" v-show="staisticsChartsShow">
      <div @click="openStatisticsChart('surveyType')" class="chartListStyle"><span class="el-icon-s-data"></span>调查点类型</div>
      <div @click="openStatisticsChart('drillCount')" class="chartListStyle"><span class="el-icon-s-data"></span>钻孔数量</div>
      <div @click="openStatisticsChart('layerDepth')" class="chartListStyle"><span class="el-icon-s-data"></span>三维地层埋深</div>
      <div @click="openStatisticsChart('layerVolume')" class="chartListStyle"><span class="el-icon-s-data"></span>三维地层体积</div>
    </div>
    <dialogPage
      :width="500"
      :left="divleft"
      :top="150"
      height="350"
      :dialogShow="dialogShow"
      @close="closeChartsPanel"
      :markShow="false"
    >
      <div class="chartTitle">{{chartName}}</div>
      <div class="mycharts" id="mycharts"></div>
    </dialogPage>
  </div>
</template>
<style scoped>
.chartListStyle {
  padding: 5px;
  cursor: pointer;
}
.chartTitle {
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: '#fff';
  height: 30px;
  line-height: 30px;
  padding-top: 15px;
}
.chartListStyle :hover {
  background: rgba(18, 189, 208, 0.5);
}
.chartListStyle span{
  display: inline-block;
  width: 10px;
  height: 10px;
  margin: 0 5px;
}
.mycharts {
  width: 494px;
  /*height: 316px;*/
  height: 280px;
  /*margin-top: 30px;*/
}
</style>
<script>
import basicsData from '../../assets/data/基础数据表.json'
import layerInformation from '../../assets/data/地层信息.json'
import drillInformation from '../../assets/data/钻孔信息表.json'
import echarts from 'echarts'

export default {
  name: 'statisticsCharts',
  props: ['staisticsChartsShow'],
  data() {
    return {
      basicsData: basicsData,
      layerInformation: layerInformation,
      drillInformation: drillInformation,
      divleft: 0,
      chartName: '',
      option: {},
      dialogShow: false
    }
  },
  methods: {
    initChart: function(name) {
      var myChart = echarts.init(document.getElementById('mycharts'))
      myChart.clear()
      myChart.setOption(this.option)
    },
    Compare: function(obj) {
      const keys = Object.keys(obj).sort(function(a, b) {
        return obj[b] - obj[a]
      })
      var newObj = {}
      for (var i = 0; i < keys.length; i++) {
        const key = keys[i]
        newObj[key] = obj[key]
      }
      return newObj
    },
    openStatisticsChart: function(type) {
      this.divleft = (document.body.clientWidth - 500) / 2
      if (type === 'surveyType') {
        this.chartName = '调查点类型统计'
        var map = {}
        var xData = []
        var yData = []
        for (let i = 0; i < this.basicsData.length; i++) {
          var ai = this.basicsData[i]
          if (!map[ai['调查点类型']]) {
            xData.push(ai['调查点类型'])
            map[ai['调查点类型']] = 1
          } else {
            map[ai['调查点类型']] = map[ai['调查点类型']] + 1
          }
        }
        var newObj = this.Compare(map)
        xData = Object.keys(newObj)
        yData = Object.values(newObj)
        this.option = {
          backgroundColor: 'transparent',
          grid: {
            left: '12%',
            top: '10%',
            bottom: '25%',
            right: '18%'
          },
          xAxis: {
            data: xData,
            name: '调查点类型',
            nameTextStyle: {
              color: '#fff'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.5)',
                width: 1
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontSize: 12
              },
              interval: 0,
              rotate: 40
            }
          },
          yAxis: [
            {
              splitNumber: 2,
              name: '点数',
              nameTextStyle: {
                color: '#fff'
              },
              axisTick: {
                show: true
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(255, 255, 255, 0.5)',
                  width: 1
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#fff'
                }
              },
              splitArea: {
                areaStyle: {
                  color: 'rgba(255,255,255,.5)'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255, 129, 109, 0.1)',
                  width: 0.5,
                  type: 'dashed'
                }
              }
            }
          ],
          series: [
            {
              name: 'hill',
              type: 'pictorialBar',
              barCategoryGap: '0%',
              symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
              label: {
                show: true,
                position: 'top',
                distance: 15,
                color: '#fff',
                fontWeight: 'bolder',
                fontSize: 20
              },
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: 'rgba(239, 83, 82, 1)' //  0%  处的颜色
                      },
                      {
                        offset: 1,
                        color: 'rgba(239, 83, 82, .5)' //  100%  处的颜色
                      }
                    ],
                    global: false //  缺省为  false
                  }
                },
                emphasis: {
                  opacity: 1
                }
              },
              data: yData,
              z: 10
            }
          ]
        }
      } else if (type === 'drillCount') {
        this.chartName = '钻孔数量统计'
        var drillMap = {}
        var scaleData = []
        var nameArr = []
        for (let i = 0; i < this.drillInformation.length; i++) {
          var drill = this.drillInformation[i]
          if (!drillMap[drill['钻孔类型']]) {
            nameArr.push(drill['钻孔类型'])
            drillMap[drill['钻孔类型']] = 1
          } else {
            drillMap[drill['钻孔类型']] = drillMap[drill['钻孔类型']] + 1
          }
        }
        for (let m = 0; m < nameArr.length; m++) {
          var obj = {}
          obj.name = nameArr[m]
          obj.value = drillMap[nameArr[m]]
          scaleData.push(obj)
        }
        var rich = {
          white: {
            color: '#ddd',
            align: 'center',
            padding: [3, 0]
          }
        }
        var placeHolderStyle = {
          backgroundColor: 'transparent',
          normal: {
            label: {
              show: false
            },
            labelLine: {
              show: false
            },
            color: 'rgba(0, 0, 0, 0)',
            borderColor: 'rgba(0, 0, 0, 0)',
            borderWidth: 0
          }
        }
        var data = []
        var color = ['#00ffff', '#00cfff', '#006ced', '#ffe000', '#ffa800', '#ff5b00', '#ff3000']
        for (var i = 0; i < scaleData.length; i++) {
          data.push(
            {
              value: scaleData[i].value,
              name: scaleData[i].name,
              itemStyle: {
                normal: {
                  borderWidth: 4,
                  shadowBlur: 200,
                  borderColor: color[i],
                  shadowColor: color[i]
                }
              }
            },
            {
              value: 2,
              name: '',
              itemStyle: placeHolderStyle
            }
          )
        }
        var seriesObj = [
          {
            name: '',
            type: 'pie',
            clockWise: false,
            radius: [50, 100],
            hoverAnimation: false,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'outside',
                  color: '#ddd',
                  formatter: function(params) {
                    var percent = 0
                    var total = 0
                    for (var i = 0; i < scaleData.length; i++) {
                      total += scaleData[i].value
                    }
                    percent = ((params.value / total) * 100).toFixed(0)
                    if (params.name !== '') {
                      return params.name + '{white|' + '：' + params.value + '孔\n(' + percent + '%)}'
                    } else {
                      return ''
                    }
                  },
                  rich: rich
                },
                labelLine: {
                  length: 15,
                  length2: 50,
                  show: true,
                  color: '#00ffff'
                }
              }
            },
            data: data
          }
        ]
        this.option = {
          backgroundColor: 'transparent',
          tooltip: {
            show: false
          },
          legend: {
            show: false
          },
          toolbox: {
            show: false
          },
          series: seriesObj
        }
      } else if (type === 'layerDepth') {
        this.chartName = '地层埋深统计'
        var layerNameArr = []
        var layerValuerArr = []
        const layerfrom = []
        const heightArr = []
        for (let i = 0; i < this.layerInformation.length; i++) {
          layerNameArr.push(this.layerInformation[i]['地层'])
          layerfrom.push(this.layerInformation[i]['最大高程（米）'])
          layerValuerArr.push(this.layerInformation[i]['最小高程（米）'])
          heightArr.push(this.layerInformation[i]['最大高程（米）'] - this.layerInformation[i]['最小高程（米）'])
          // layerValuerArr.push([
          //   this.layerInformation[i]['最小高程（米）'],
          //   this.layerInformation[i]['最大高程（米）'],
          //   this.layerInformation[i]['最小高程（米）'],
          //   this.layerInformation[i]['最大高程（米）']
          // ])
        }
        this.option = {
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'axis',
            formatter: function(params) {
              if (params[0].name === 'Q') return '顶：' + params[1].data.toFixed(1) + '米<br />底：' + params[0].data.toFixed(1) + '米<br />厚：' + Math.abs(params[0].data.toFixed(1) - params[1].data.toFixed(1)).toFixed(1) + '米'
              else return '顶：' + params[0].data.toFixed(1) + '米<br />底：' + params[1].data.toFixed(1) + '米<br />厚：' + (params[0].data.toFixed(1) - params[1].data.toFixed(1)).toFixed(1) + '米'
            }
          },
          xAxis: {
            name: '地层',
            show: true,
            axisTick: {
              show: false
            },
            data: layerNameArr,
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 1
              },
              axisLine: {
                borderWidth: 1
              }
            }
          },
          yAxis: {
            type: 'value',
            name: '单位（米）',
            axisLine: {
              lineStyle: {
                color: '#fff',
                width: 2
              }
            }
          },
          series: [
            {
              data: layerfrom,
              type: 'bar',
              stack: 'one',
              color: 'transparent'
            },
            {
              data: layerValuerArr,
              type: 'bar',
              stack: 'one',
              barWidth: 25,
              barGap: '-100%',
              itemStyle: {
                borderWidth: 1,
                color: function(params) {
                  var colorList = ['#C1232B', '#B5C334', '#FCCE10', '#E87C25', '#FE8463', '#9BCA63', '#FAD860', '#F3A43B', '#60C0DD', '#D7504B', '#C6E579', '#F4E001', '#F0805A', '#26C0C0']

                  return colorList[params.dataIndex]
                }
              },
              label: {
                formatter: function(params) {
                  return Math.abs(heightArr[params.dataIndex].toFixed(1))
                },
                show: true,
                position: 'top',
                textStyle: {
                  fontWeight: 'bolder',
                  fontSize: '12',
                  color: '#fff'
                }
              },
              emphasis: {
                itemStyle: {
                  borderColor: 'rgba(255, 255, 255, 1)'
                }
              }
            }
          ]
        }
      } else if (type === 'layerVolume') {
        this.chartName = '地层体积统计'
        var allData = []
        for (let i = 0; i < this.layerInformation.length; i++) {
          const obj = {}
          obj.name = this.layerInformation[i]['地层']
          obj.value = this.layerInformation[i]['体积（亿立方米）']
          allData.push(obj)
        }
        this.option = {
          backgroundColor: 'transparent',
          color: ['#00ffff', '#00cfff', '#c703a9', '#ffe000', '#ffa800', '#ff5b00', '#ff3000', '#bf210c'],
          grid: {
            left: -100,
            top: 50,
            bottom: 100,
            right: 10,
            containLabel: true
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            top: 'bottom',
            left: 'center',
            textStyle: { color: '#fff' },
            data: ['Q', 'N', 'E', 'K', 'J', 'T', 'P', '基底']
          },
          polar: {},
          angleAxis: {
            interval: 1,
            type: 'category',
            data: [],
            z: 10,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#0b496b71',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              interval: 0,
              show: true,
              color: '#0B4A6B',
              margin: 1,
              fontSize: 16
            }
          },
          radiusAxis: {
            min: 40,
            max: 120,
            interval: 20,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#0b496b71',
                width: 1,
                type: 'solid'
              }
            },
            axisLabel: {
              formatter: '{value} %',
              show: false,
              padding: [0, 0, 20, 0],
              color: '#0B3E5E',
              fontSize: 1
            },
            splitLine: {
              lineStyle: {
                color: '#ffffffa6',
                width: 2,
                type: 'dashed'
              }
            }
          },
          calculable: true,
          series: [
            {
              type: 'pie',
              radius: ['5%', '10%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              labelLine: {
                normal: {
                  show: false,
                  length: 30,
                  length2: 55
                },
                emphasis: {
                  show: false
                }
              }
            },
            {
              type: 'pie',
              radius: ['60%', '65%'],
              center: ['50%', '50%'],
              hoverAnimation: false,
              labelLine: {
                normal: {
                  show: false,
                  length: 30,
                  length2: 55
                },
                emphasis: {
                  show: false
                }
              },
              name: '',
              data: [
                {
                  name: '',
                  value: 0,
                  itemStyle: {
                    normal: {
                      color: '#ffffff'
                    }
                  }
                }
              ]
            },
            {
              stack: 'a',
              type: 'pie',
              radius: ['20%', '60%'],
              center: ['50%', '50%'],
              roseType: 'area',
              zlevel: 10,
              label: {
                normal: {
                  show: true,
                  formatter: params => {
                    return params.value.toFixed(2) + '亿万方'
                  },
                  textStyle: {
                    fontSize: 14,
                    fontWeight: 'bolder'
                  },
                  position: 'outside'
                },
                emphasis: {
                  show: true
                }
              },
              labelLine: {
                normal: {
                  show: true,
                  length: 15,
                  length2: 30
                },
                emphasis: {
                  show: false
                }
              },
              data: allData
            }
          ]
        }
      }
      this.dialogShow = true
      this.initChart(type)
    },
    closeChartsPanel: function(value) {
      this.dialogShow = value
      this.option = {}
    },
    parentHandle:function(){
      this.dialogShow = false
    }
  }
}
</script>
