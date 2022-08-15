<template>
  <div class="xtx-pagination">
    <a href="javascript:;"
       v-if="myCurrentPage > 1"
       @click="changePage(myCurrentPage-1)">上一页</a>
    <a v-else
       href="javascript:;"
       class="disabled">上一页</a>
    <span v-if="pager.star > 1">...</span>
    <a href="javascript:;"
       :class="{active:i ===myCurrentPage }"
       v-for="i in pager.btnArr"
       :key="i"
       @click="changePage(i)">{{i}}</a>
    <span v-if="pager.end < pager.pageCount">...</span>
    <a href="javascript:;"
       v-if="myCurrentPage < pager.pageCount"
       @click="changePage(myCurrentPage+1)">下一页</a>
    <a href="javascript:;"
       v-else
       class="disabled">下一页</a>
  </div>
</template>
<script>
import { computed, ref, watch } from 'vue'
export default {
  name: 'XtxPagination',
  props: {
    total: {
      type: Number,
      default: 100
    },
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  setup (props, { emit }) {
    // 需要的数据：
    // 1、按钮的个数（5）
    const count = ref(5)
    // 2、当前显示页码
    const myCurrentPage = ref(1)
    // 3、总页数 = 总条数 / 每一页个数 向上取整
    const myTotal = ref(100)
    const myPageSize = ref(10)
    // 其他数据：总页数、起始按钮、结束按钮等依赖上面数据
    const pager = computed(() => {
      // 总页数
      const pageCount = Math.ceil(myTotal.value / myPageSize.value)
      // 起始按钮 结束按钮 按钮数组
      // 1、理想情况
      const offset = Math.floor(count.value / 2)
      let star = myCurrentPage.value - offset
      let end = star + count.value - 1
      // 2、如果计算完的其实页码小于1
      if (star < 1) {
        star = 1
        end = (star + count.value - 1) > pageCount ? pageCount : (star + count.value - 1)
      }
      // 3、如果结束页码大于总页数
      if (end > pageCount) {
        end = pageCount
        star = (end - count.value + 1) < 1 ? 1 : (end - count.value + 1)
      }

      // 计算按钮个数数组
      const btnArr = []
      for (let i = star; i <= end; i++) {
        btnArr.push(i)
      }
      return {
        pageCount,
        btnArr,
        star,
        end
      }
    })
    // 监听传入的props变化
    watch(props, () => {
      myCurrentPage.value = props.currentPage
      myTotal.value = props.total
      myPageSize.value = props.pageSize
    }, {
      immediate: true
    })

    // 切换分页的函数
    const changePage = (page) => {
      myCurrentPage.value = page
      emit('current-change', page)
    }
    return {
      count,
      myCurrentPage,
      myTotal,
      myPageSize,
      pager,
      changePage
    }
  }
}
</script>
<style scoped lang="less">
.xtx-pagination {
  display: flex;
  justify-content: center;
  padding: 30px;
  > a {
    display: inline-block;
    padding: 5px 10px;
    border: 1px solid #e4e4e4;
    border-radius: 4px;
    margin-right: 10px;
    &:hover {
      color: @xtxColor;
    }
    &.active {
      background: @xtxColor;
      color: #fff;
      border-color: @xtxColor;
    }
    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      &:hover {
        color: #333;
      }
    }
  }
  > span {
    margin-right: 10px;
  }
}
</style>
