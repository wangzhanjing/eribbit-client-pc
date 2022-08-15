<template>
  <div class="xtx-confirm"
       :class="{fade}">
    <div class="wrapper"
         :class="{fade}">
      <div class="header">
        <h3>{{title}}</h3>
        <a href="JavaScript:;"
           class="iconfont icon-close-new"
           @click="cancleCallBack"></a>
      </div>
      <div class="body">
        <i class="iconfont icon-warning"></i>
        <span>{{text}}</span>
      </div>
      <div class="footer">
        <XtxButton size="mini"
                   type="gray"
                   @click="cancleCallBack">取消</XtxButton>
        <XtxButton size="mini"
                   type="primary"
                   @click="submitCallBack">确认</XtxButton>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref } from 'vue'
import XtxButton from './xtx-button.vue'
export default {
  name: 'XtxConfirm',
  props: {
    title: {
      type: String,
      default: '温馨提示'
    },
    text: {
      type: String,
      default: ''
    },
    cancle: {
      type: Function

    },
    submit: {
      type: Function
    }
  },
  components: {
    XtxButton
  },
  setup (props) {
    const fade = ref(false)
    // 渲染完之后显示
    onMounted(() => {
      // 过渡元素的效果不会在组件创建完毕之后就加上，需要延时一下再加上，例如使用setTimeout
      setTimeout(() => {
        fade.value = true
      }, 0)
    })

    const submitCallBack = () => {
      // 其他事情
      props.submit()
    }
    const cancleCallBack = () => {
      props.cancle()
    }
    return {
      fade,
      submitCallBack,
      cancleCallBack
    }
  }
}
</script>
<style scoped lang="less">
.xtx-confirm {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 8888;
  background: rgba(0, 0, 0, 0);
  &.fade {
    transition: all 0.4s;
    background: rgba(0, 0, 0, 0.5);
  }

  .wrapper {
    width: 400px;
    background: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    opacity: 0;
    &.fade {
      transition: all 0.4s;
      transform: translate(-50%, -50%);
      opacity: 1;
    }

    .header,
    .footer {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    .body {
      padding: 20px 40px;
      font-size: 16px;
      .icon-warning {
        color: @priceColor;
        margin-right: 3px;
        font-size: 16px;
      }
    }
    .footer {
      text-align: right;
      .xtx-button {
        margin-left: 20px;
      }
    }
    .header {
      position: relative;
      h3 {
        font-weight: normal;
        font-size: 18px;
      }
      a {
        position: absolute;
        right: 15px;
        top: 15px;
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
        text-align: center;
        color: #999;
        &:hover {
          color: #666;
        }
      }
    }
  }
}
</style>
