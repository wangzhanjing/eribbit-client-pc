<template>
  <div class="sub-cartgory">
    <div class="container">
      <!-- 面包屑 -->
      <SubBread />
      <!-- 条件过滤 -->
      <SubFilter />
      <!-- 商品面板 -->
      <div class="goods-list">
        <SubSort @sort-change="sortChange" />

        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList"
              :key="goods.id">
            <GoodsItem :goods="goods" />
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <XtxInfiniteLoading :loading="loading"
                            @infinite="getData"
                            :finished="finished" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

import SubBread from './components/sub-bread'
import SubFilter from './components/sub-filter'
import SubSort from './components/sub-sort'
import GoodsItem from './components/goods-item'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'

export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup () {
    const route = useRoute()
    const loading = ref(false)
    const finished = ref(false)

    // 获取商品数据
    const goodsList = ref([])
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const getData = () => {
      loading.value = true
      // 设置二级分类id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        if (result.items.length) {
          goodsList.value.push(...result.items)
          // 获取下一页页码数据
          reqParams.page++
        } else {
          finished.value = true
        }
        loading.value = false
      })
    }
    // 更改二级分类的时候需要从新加载数据
    watch(() => route.params.id, (newValue) => {
      if (newValue && `/category/sub/${newValue}` === route.path) {
        finished.value = false
        goodsList.value = []
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 排序组件，当你点击了排序后 或者 复选框改变后 触发自定义事件 sort-change 传出排序参数
    // 筛选组件，当你改了品牌，或者其他筛选添加，触发自定义事件 filter-change 传出筛选参数
    // 在sub组件，分别绑定 sort-change filter-change 得到参数和当前参数合并，回到第一页，清空数据，设置未加载完成，触发加载。
    const sortChange = (sortParams) => {
      finished.value = false
      //  合并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    return {
      loading,
      finished,
      goodsList,
      sortChange,
      getData
    }
  }

}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
