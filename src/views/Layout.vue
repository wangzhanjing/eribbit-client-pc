<template>
  <AppTopnav />

  <AppHeader />

  <AppHeaderSticky />
  <div class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </div>

  <AppFooter />
</template>

<script>
import AppTopnav from '@/components/app-navbar.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    const store = useStore()
    store.dispatch('category/getCategoryList')
    return {

    }
  }
}
</script>

<style lang="less" scoped>
.app-body {
  min-height: 600px;
}
</style>
