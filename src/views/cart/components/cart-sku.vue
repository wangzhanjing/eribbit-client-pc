<template>
  <div class="cart-sku">
    <div class="attrs"
         @click="toggle">
      <span class="ellipsis">{{attrsText}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="layer"
         ref="target"
         v-if="visiable">
      <div v-if="loading"
           class="loading"></div>
      <GoodsSku v-else
                :goods="goods"
                :skuId="skuId"
                @change="changeSku" />
      <XtxButton v-if="!loading"
                 type="primary"
                 size="mini"
                 style="margin-left:60px"
                 @click="submitUpdateSku">确认</XtxButton>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { getSpecsAndSkus } from '@/api/cart'
import GoodsSku from '@/views/goods/components/goods-sku.vue'
export default {
  name: 'CartSku',
  props: {
    attrsText: {
      type: String,
      default: ''
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  components: {
    GoodsSku
  },
  setup (props, { emit }) {
    const visiable = ref(false)
    const goods = ref(null)
    const loading = ref(false)
    // 打开
    const open = () => {
      visiable.value = true
      loading.value = true
      getSpecsAndSkus(props.skuId).then(data => {
        goods.value = data.result
        loading.value = false
      })
    }
    // 关闭
    const close = () => {
      visiable.value = false
    }
    // 切换
    const toggle = () => {
      visiable.value ? close() : open()
    }
    // 点击其他地方关闭
    const target = ref(null)
    onClickOutside(target, () => {
      close()
    })
    // 记录修改完的sku信息
    const newSku = ref(null)
    const changeSku = (sku) => {
      newSku.value = sku
    }

    const submitUpdateSku = () => {
      //  当修改过skuId，并且与之前的skuId不同
      if (newSku.value && newSku.value.skuId && newSku.value.skuId !== props.skuId) {
        emit('changeSku', newSku.value)
      }
      close()
    }
    return {
      visiable,
      toggle,
      target,
      goods,
      loading,
      changeSku,
      submitUpdateSku
    }
  }
}
</script>
<style scoped lang="less">
.cart-sku {
  height: 28px;
  border: 1px solid #f5f5f5;
  padding: 0 6px;
  position: relative;
  margin-top: 10px;
  display: inline-block;
  .attrs {
    line-height: 24px;
    display: flex;
    span {
      max-width: 230px;
      font-size: 14px;
      color: #999;
    }
    i {
      margin-left: 5px;
      font-size: 14px;
    }
  }
  .layer {
    position: absolute;
    left: -1px;
    top: 40px;
    z-index: 10;
    width: 400px;
    border: 1px solid @xtxColor;
    box-shadow: 2px 2px 4px lighten(@xtxColor, 50%);
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    padding: 20px;
    &::before {
      content: "";
      width: 12px;
      height: 12px;
      border-left: 1px solid @xtxColor;
      border-top: 1px solid @xtxColor;
      position: absolute;
      left: 12px;
      top: -8px;
      background: #fff;
      transform: scale(0.8, 1) rotate(45deg);
    }
    .loading {
      height: 224px;
      background: url(../../../assets/images/loading.gif) no-repeat center;
    }
  }
}
</style>
