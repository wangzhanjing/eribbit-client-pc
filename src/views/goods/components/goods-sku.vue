<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs"
        :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values"
                  :key="val.name">
          <img :class="{selected:val.selected,disabled:val.disabled}"
               v-if="val.picture"
               :src="val.picture"
               :title="val.name"
               @click="changeSku(item,val)">
          <span v-else
                :class="{selected:val.selected,disabled:val.disabled}"
                @click="
                changeSku(item,val)">{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@//vender/power-set.js'
// 得到一个路径字典集合
const getPathMap = (skus) => {
  // 1、得到所有的sku集合  props.goods.skus
  // 2、从所有的sku中筛选出有效的sku
  // 3、根据有效的sku使用power-set得到子集
  // 4、根据子集往路径对象（路径字典）中存储数据
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 有库存，计算子集
      const valueArr = sku.specs.map(item => item.valueName)
      const valueArrPowerSet = powerSet(valueArr)
      valueArrPowerSet.forEach(arr => {
        // 数组不能做key，将数组转换为字符串
        const key = arr.join('-')
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 获取选中的值的数组集合
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 找到选中的按钮对象
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  // console.log(arr)
  return arr
}
// 按钮禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 1、约定每一个按钮的状态由它的disabled来决定
  specs.forEach((item, index) => {
    const selectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2、判断当前按钮是否是选中状态，选中的话不需要判断
      if (val.selected) return
      // 3、拿到当前的值按顺序存入数组
      selectedValues[index] = val.name
      // 4、去除undefined数据，按照分隔符拼接成key
      const key = selectedValues.filter(arrItem => arrItem).join('-')
      // 5、拿着这个key去路径字典里面找是否包含
      val.disabled = !pathMap[key]
    })
  })
}

// 初始化默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1、找出sku的信息
  // 2、遍历每一个按钮，如果名称相同，则选中
  const sku = goods.skus.find(item => item.id === skuId)
  if (sku) {
    goods.specs.forEach((spec, index) => {
      const value = sku.specs[index].valueName
      spec.values.forEach(val => {
        val.selected = val.name === value
      })
    })
  }
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // 初始化默认选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    const pathMap = getPathMap(props.goods.skus)
    // 组件初始化的时候更新按钮的状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1、选中和取消选中，约定每个按钮都有自己的一个选中数据 selected
    // 1.1、点击的是未选中的，需要将同规格其他选中的取消，将自己选中
    const changeSku = (item, val) => {
      // 当按钮是禁用时候，直接返回，阻止运行
      if (val.disabled) return
      if (!val.selected) {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      } else {
        val.selected = false
      }
      // 点击完按钮更新按钮的状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将选择完的数据通知给父组件
      // 1、没有选择完整，不需要发送数据给父组件
      // 2、选择完整，发送数据给父组件
      const selectedList = getSelectedValues(props.goods.specs).filter(item => item)
      if (selectedList.length === props.goods.specs.length) {
        const skuId = pathMap[selectedList.join('-')][0]
        const sku = props.goods.skus.find(item => item.id === skuId)
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').trim()
        })
      } else {
        // 选择不完整的时候
        emit('change', {})
      }
    }

    return {
      changeSku
    }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
