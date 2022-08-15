<template>
  <div class='xtx-carousel'
       @mouseover="stop"
       @mouseleave="start">
    <ul class="carousel-body">
      <li class="carousel-item"
          :class="{fade:index === i}"
          v-for="(item,i) in sliders"
          :key="i">
        <!-- 图片轮播 -->
        <RouterLink v-if="item.imgUrl"
                    to="/">
          <img :src="item.imgUrl"
               alt="">
        </RouterLink>
        <!-- 商品列表轮播 -->
        <div v-else
             class="slider">
          <RouterLink v-for="goods in item"
                      :key="goods.id"
                      :to="`/product/${goods.id}`">
            <img :src="goods.picture"
                 alt="">
            <p class="name ellipsis">{{goods.name}}</p>
            <p class="price">&yen;{{goods.price}}</p>
          </RouterLink>
        </div>
      </li>
    </ul>
    <a href="javascript:;"
       class="carousel-btn prev"
       @click="toggle(-1)"><i class="iconfont icon-angle-left"></i></a>
    <a href="javascript:;"
       class="carousel-btn next"
       @click="toggle(1)"><i class="iconfont icon-angle-right"></i></a>
    <div class="carousel-indicator">
      <span v-for="(item,i) in sliders"
            :key="i"
            :class="{active:index === i}"></span>
    </div>
  </div>
</template>

<script>
import { onUnmounted, ref, watch } from 'vue'
export default {
  name: 'XtxCarousel',
  props: {
    sliders: {
      type: Array,
      default: () => []
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 1500
    }
  },
  setup (props) {
    // 控制显示图片的索引
    const index = ref(0)

    // 轮播图自动播放的逻辑
    // 1、自动播放
    let timer = null
    const autoPlayFn = () => {
      // 防止定时器重复开启
      clearInterval(timer)
      timer = setInterval(() => {
        index.value++
        if (index.value >= props.sliders.length) {
          index.value = 0
        }
      }, props.duration)
    }
    watch(() => props.sliders, (newValue) => {
      if (newValue.length && props.autoPlay) {
        autoPlayFn()
      }
    }, { immediate: true })

    // 2、当自动轮播的时候，鼠标进入停止，离开开始
    const stop = () => {
      if (timer) {
        clearInterval(timer)
      }
    }
    const start = () => {
      if (props.sliders.length && props.autoPlay) {
        autoPlayFn()
      }
    }

    // 3、点击切换
    const toggle = (i) => {
      const newIndex = index.value + i
      console.log(newIndex)
      if (newIndex > props.sliders.length - 1) {
        index.value = 0
        return
      }
      if (newIndex < 0) {
        index.value = props.sliders.length - 1
        return
      }
      index.value = newIndex
    }

    // 4、组件卸载时候清除定时器
    onUnmounted(() => {
      clearInterval(timer)
    })
    return {
      index,
      stop,
      start,
      toggle
    }
  }
}
</script>
<style scoped lang="less">
.xtx-carousel {
  width: 100%;
  height: 100%;
  min-width: 300px;
  min-height: 150px;
  position: relative;
  .carousel {
    &-body {
      width: 100%;
      height: 100%;
    }
    &-item {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      transition: opacity 0.5s linear;
      &.fade {
        opacity: 1;
        z-index: 1;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    &-indicator {
      position: absolute;
      left: 0;
      bottom: 20px;
      z-index: 2;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        cursor: pointer;
        ~ span {
          margin-left: 12px;
        }
        &.active {
          background: #fff;
        }
      }
    }
    &-btn {
      width: 44px;
      height: 44px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      border-radius: 50%;
      position: absolute;
      top: 228px;
      z-index: 2;
      text-align: center;
      line-height: 44px;
      opacity: 0;
      transition: all 0.5s;
      &.prev {
        left: 20px;
      }
      &.next {
        right: 20px;
      }
    }
  }
  &:hover {
    .carousel-btn {
      opacity: 1;
    }
  }
  // 轮播商品
  .slider {
    display: flex;
    justify-content: space-around;
    padding: 0 40px;
    > a {
      width: 240px;
      text-align: center;
      img {
        padding: 20px;
        width: 230px !important;
        height: 230px !important;
      }
      .name {
        font-size: 16px;
        color: #666;
        padding: 0 40px;
      }
      .price {
        font-size: 16px;
        color: @priceColor;
        margin-top: 15px;
      }
    }
  }
}
</style>
