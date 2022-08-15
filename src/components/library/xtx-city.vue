<template>
  <div class="xtx-city"
       ref="target">
    <div class="select"
         @click="toggleDialog"
         :class="{active}">
      <span class="placeholder"
            v-if="!fullLocation">请选择配送地址</span>
      <span class="value"
            v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option"
         v-if="active">
      <div v-if="loading"
           class="loading"></div>
      <template v-else>
        <span class="ellipsis"
              v-for="item in currList"
              :key="item.code"
              @click="changeItem(item)">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 控制展开收起,默认收起
    const active = ref(false)
    const cityList = ref([])
    const loading = ref(false)
    const openDialog = () => {
      active.value = true
      loading.value = true
      // 获取城市地区数据
      getCityData().then(data => {
        cityList.value = data
        loading.value = false
      })
      // 每次打开清空之前的选择地址
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const closeDialog = () => {
      active.value = false
    }
    // 切换展开收起
    const toggleDialog = () => {
      if (active.value) closeDialog()
      else openDialog()
    }
    // 点击其他位置隐藏
    const target = ref(null)
    onClickOutside(target, () => {
      closeDialog()
    })

    // 实现一个计算属性，获取当前的地区列表
    const currList = computed(() => {
      // 默认显示省一级的数据
      let list = cityList.value
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(item => {
          return item.code === changeResult.provinceCode
        }).areaList
      }
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(item => {
          return item.code === changeResult.cityCode
        }).areaList
      }
      return list
    })
    // 定义选择的地址数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 当点击地区按钮的时候记录
    const changeItem = (item) => {
      console.log(item)
      if (item.level === 0) {
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 拼接完整地址
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        // 选择完毕，关闭对话框，通知父组件
        closeDialog()
        emit('change', changeResult)
      }
    }
    return {
      active,
      toggleDialog,
      target,
      loading,
      currList,
      changeItem
    }
  }
}
// 获取省市区数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  // 这个位置可能有异步操作也有可能是同步操作，封装成promise
  return new Promise((resolve, reject) => {
    if (window.cityData) {
      // 有缓存
      resolve(window.cityData)
    } else {
      // 无缓存
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        window.cityData = res.data
        resolve(window.cityData)
      })
    }
  })
}
</script>
<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
