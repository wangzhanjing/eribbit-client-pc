<template>
  <div class='xtx-goods-page'
       v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`"
                      v-if="goods && goods.categories">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`"
                      v-if="goods && goods.categories">{{goods.categories[0].name}}</XtxBreadItem>
        <XtxBreadItem v-if="goods && goods.categories">{{goods.name}}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <GoodsImage :images="goods.mainPictures" />
          <GoodsSales />
        </div>

        <div class="spec">
          <GoodsName :goods="goods" />
          <!-- sku组件 -->
          <GoodsSku :goods="goods"
                    skuId="300470325"
                    @change="changeSku" />
          <XtxNumbox v-model="num"
                     label="数量"
                     :maxValue="goods.inventory" />
          <XtxButton type="primary"
                     style="margin-top:20px;"
                     @click="insertCart()">加入购物车</XtxButton>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant :goodsId="goods.id" />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <!-- <div class="goods-tabs"></div> -->
          <GoodsTabs />
          <!-- 注意事项 -->
          <!-- <div class="goods-warn"></div> -->
          <GoodsWarn />
        </div>
        <!-- 24热榜+专题推荐 -->
        <!-- <div class="goods-aside"></div> -->
        <div class="goods-aside">
          <GoodsHot :goodsId="goods.id"
                    :type="1" />
          <GoodsHot :goodsId="goods.id"
                    :type="2" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findGoods } from '@/api/product'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from './components/goods-image.vue'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name'
import GoodsSku from './components/goods-sku'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot'
import GoodsWarn from './components/goods-warn'
import { nextTick, ref, watch, provide } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: {
    GoodsRelevant,
    GoodsImage,
    GoodsSales,
    GoodsName,
    GoodsSku,
    GoodsTabs,
    GoodsHot,
    GoodsWarn
  },
  setup () {
    // 1、获取商品详情
    const goods = useGoods()
    provide('goods', goods)
    console.log(goods)
    // 2、监听选择规格事件
    const changeSku = (sku) => {
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      currSku.value = sku
    }
    // 3、监听数量变化
    const num = ref(1)
    // 加入购物车操作
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      // 我需要哪些字段必须和后端保持一致
      if (currSku.value && currSku.value.skuId) {
        store.dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: num.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory
        }).then(() => {
          Message({ type: 'success', text: '添加购物车成功' })
        })
      } else {
        Message({ text: '请选择完整规格' })
      }
    }

    return {
      goods,
      num,
      changeSku,
      insertCart
    }
  }
}
// 获取商品详情函数
const useGoods = () => {
  // 路由地址当前id发生变化，需要监听发送请求
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newValue) => {
    if (newValue && `/product/${newValue}` === route.path) {
      findGoods(route.params.id).then(data => {
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, {
    immediate: true
  })
  return goods
}

</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-tabs {
  min-height: 600px;
  background: #fff;
}
.goods-warn {
  min-height: 600px;
  background: #fff;
  margin-top: 20px;
}
</style>
