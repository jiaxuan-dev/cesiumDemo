<template>
  <dialogPage
    :title="title"
    width="400"
    height="230"
    left="500"
    top="120"
    :dialogShow="visible"
    @close="setVisible"
  >
    <div class="input">
      <div class="con">
        <el-select v-model="colorMapValue" placeholder="点击选择色带">
          <el-option
            v-for="item in colorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="con">
        <el-button @click="begin">开始</el-button>
        <el-button @click="PauseOrContinue">{{PauseOrContinuetext}}</el-button>
        <el-button @click="remove">清除</el-button>
      </div>
      <div class="con">
        <el-slider @input="changeSpeed" v-model="intervalTime"></el-slider>
      </div>
      <div class="con">
        <input multiple style="width: 70px;display:none" ref="file" @input="read" type="file" />
        <el-button @click="setdata" plain>导入本地新数据</el-button>
      </div>
    </div>
  </dialogPage>
</template>
<script>
import { saveAs } from 'file-saver'
import DynamicMesh from './../../js/DynamicMesh/DynamicMesh'
import meshData from './../../assets/data/cjl.json'
export default {
  name: 'mesh-panel',
  data() {
    return {
      title: '动态网格',
      data: [],
      datasDes: [],
      visible: false,
      PauseOrContinuetext: '暂停',
      PauseOrContinueflag: false,
      colorOptions: [
        {
          value: 'jet',
          label: 'jet'
        },
        {
          value: 'hsv',
          label: 'hsv'
        },
        {
          value: 'hot',
          label: 'hot'
        },
        {
          value: 'cool',
          label: 'cool'
        },
        {
          value: 'spring',
          label: 'spring'
        },
        {
          value: 'summer',
          label: 'summer'
        },
        {
          value: 'autumn',
          label: 'autumn'
        },
        {
          value: 'winter',
          label: 'winter'
        },
        {
          value: 'earth',
          label: 'earth'
        }
      ],
      colorMapValue: '',
      intervalTime: 0
    }
  },
  methods: {
    setdata() {
      this.$refs.file.click()
    },
    changeSpeed() {
      if (this.mesh != undefined) {
        this.mesh.setIntervalTime(this.intervalTime / 100)
      }
    },
    PauseOrContinue() {
      if (this.mesh != undefined) {
        this.mesh.PauseOrContinue(this.PauseOrContinueflag)
        if (this.PauseOrContinueflag) {
          this.PauseOrContinueflag = false
          this.PauseOrContinuetext = '暂停'
        } else {
          this.PauseOrContinueflag = true
          this.PauseOrContinuetext = '继续'
        }
      }
    },
    setVisible(bool) {
      this.visible = bool
    },
    remove() {
      if (this.mesh != undefined) {
        this.mesh.remove()
      }
      this.data = []
      this.datasDes = []
      this.filePath = []
      this.PauseOrContinuetext = '暂停'
      this.PauseOrContinueflag = false
      this.mesh = undefined
    },
    begin() {
      if (this.mesh === undefined) {
        this.mesh = new DynamicMesh(Viewer, {
          polygonPositons: this.data.length === 0 ? JSON.parse(JSON.stringify(meshData.data)) : this.data,
          des: this.datasDes.length === 0 ? JSON.parse(JSON.stringify(meshData.datasDes)) : this.datasDes,
          colorMap: this.colorMapValue === '' ? 'jet' : this.colorMapValue
        })
      }

      this.$refs.file.value = ''
    },
    read(event) {
      this.readFile(event.target.files)
    },
    readFile(file) {
      let fileIndex = 0
      let that = this
      let reader = new FileReader()
      reader.readAsText(file[fileIndex])
      reader.onload = function() {
        // console.log(this.result.split('\n'))
        let allArray = this.result.split('\n')
        let heightArray = []
        for (const i in allArray) {
          if (i > 5 && i < allArray.length - 1) {
            let altmixarr = allArray[i].split(' ')
            altmixarr.pop()
            heightArray.push(altmixarr)
          }
        }
        // console.log(heightArray)

        let mixncols = allArray[0].split(' ')
        let mixnrows = allArray[1].split(' ')
        let mixlng = allArray[2].split(' ')
        let mixlat = allArray[3].split(' ')
        let mixcellsize = allArray[4].split(' ')
        let dataDes = {}
        dataDes.ncols = Number(mixncols[mixncols.length - 1])
        dataDes.nrows = Number(mixnrows[mixnrows.length - 1])
        dataDes.xllcorner = Number(mixlng[mixlng.length - 1])
        dataDes.yllcorner = Number(mixlat[mixlat.length - 1])
        dataDes.cellsize = Number(mixcellsize[mixcellsize.length - 1])

        // console.log(dataDes)
        // debugger
        const positions = []
        for (let j = 0; j < dataDes.nrows; j++) {
          for (let i = 0; i < dataDes.ncols; i++) {
            positions.push(j * dataDes.cellsize + dataDes.xllcorner)
            positions.push(i * dataDes.cellsize + dataDes.yllcorner)
            positions.push(Number(heightArray[j][i]))
          }
        }
        that.datasDes.push(dataDes)
        that.data.push(positions)
        // console.log(that.data)
        if (fileIndex < file.length - 1) {
          fileIndex = fileIndex + 1
          reader.readAsText(file[fileIndex])
          // that.readFile(file)
        } else {
          fileIndex = 0
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.input {
  padding: 25px;
}
.con {
  margin: 0 0 5px 0;
}
</style>
<style lang="scss">
.input {
  .el-input__inner {
    background-color: #e6e6e600 !important;
    color: white;
  }
  .el-button {
    background: none !important;
    color: white !important;
  }
  .el-button:hover {
    background: none !important;
  }
  .el-slider__runway {
    width: 50% !important;
  }
}
</style>