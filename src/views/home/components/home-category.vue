<template>
  <div class='home-category'
       @mouseleave="goodId = null">
    <ul class="menu">
      <li :class="{active:item.id === goodId}"
          v-for="item in menuList"
          :key="item.id"
          @mouseenter="goodId = item.id">
        <RouterLink :to="`/category/${item.id}`">{{item.name}}</RouterLink>
        <template v-if="item.children">
          <RouterLink v-for="sub in item.children"
                      :key="sub.id"
                      :to="`/category/sub/${sub.id}`">{{sub.name}}</RouterLink>
        </template>
        <!-- 骨架屏 -->
        <template v-else>
          <XtxSkeleton width="60px"
                       height="18px"
                       style="margin-right:5px"
                       bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton width="50px"
                       height="18px"
                       bg="rgba(255,255,255,0.2)" />
        </template>

      </li>
    </ul>

    <div class="layer">
      <h4 v-if="goodList">{{goodList.id==='lastItem'?'品牌':'分类'}}推荐 <small>根据您的购买或浏览记录推荐</small></h4>
      <ul v-if="goodList && goodList.goods">
        <li v-for="item in goodList.goods"
            :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture"
                 alt="">
            <div class="info">
              <p class="name ellipsis-2">{{item.name}}</p>
              <p class="desc ellipsis">{{item.desc}}</p>
              <p class="price"><i>¥</i>{{item.price}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
      <ul v-if="goodList && goodList.brands">
        <li class="brand"
            v-for="item in goodList.brands"
            :key="item.id">
          <RouterLink to="/">
            <img :src="item.picture"
                 alt="">
            <div class="info">
              <p class="place"><i class="iconfont icon-dingwei"></i>{{item.place}}</p>
              <p class="name ellipsis">{{item.name}}</p>
              <p class="desc ellipsis-2">{{item.desc}}</p>
            </div>
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { findBrand } from '@/api/home.js'
export default {
  name: 'HomeCategory',
  setup () {
    const store = useStore()
    const lastItem = reactive({
      id: 'lastItem',
      name: '品牌',
      children: [{ id: 'lastItemChild', name: '品牌推荐' }],
      brands: []
    })
    const menuList = computed(() => {
      // 得到9个分类且只有2个子分类
      const list = store.state.category.list && store.state.category.list.map((item) => {
        return {
          id: item.id,
          name: item.name,
          children: item.children && item.children.slice(0, 2),
          goods: item.goods
        }
      })
      list && list.push(lastItem)
      return list
    })

    const goodId = ref(null)
    const goodList = computed(() => {
      return menuList.value && menuList.value.find(item => item.id === goodId.value)
    })
    // 获取品牌物品列表
    findBrand().then(data => {
      lastItem.brands = data.result
      console.log(menuList.value)
    })
    return {
      goodId,
      menuList,
      goodList
    }
  }
}
</script>

<style scoped lang='less'>
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover,
      &.active {
        background: @xtxColor;
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
  .layer {
    width: 990px;
    height: 500px;
    background: rgba(255, 255, 255, 0.8);
    position: absolute;
    left: 250px;
    top: 0;
    display: none;
    padding: 0 15px;
    h4 {
      font-size: 20px;
      font-weight: normal;
      line-height: 80px;
      small {
        font-size: 16px;
        color: #666;
      }
    }
    ul {
      display: flex;
      flex-wrap: wrap;
      li {
        width: 310px;
        height: 120px;
        margin-right: 15px;
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 4px;
        background: #fff;
        li.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }
        &:nth-child(3n) {
          margin-right: 0;
        }
        a {
          display: flex;
          width: 100%;
          height: 100%;
          align-items: center;
          padding: 10px;
          &:hover {
            background: #e3f9f4;
          }
          img {
            width: 95px;
            height: 95px;
          }
          .info {
            padding-left: 10px;
            line-height: 24px;
            width: 190px;
            .name {
              font-size: 16px;
              color: #666;
            }
            .desc {
              color: #999;
            }
            .price {
              font-size: 22px;
              color: @priceColor;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }
  &:hover {
    .layer {
      display: block;
    }
  }
}
.xtx-skeleton {
  animation: fade 1s linear infinite alternate;
}
@keyframes fade {
  from {
    opacity: 0.2;
  }
  to {
    opacity: 1;
  }
}
</style>
