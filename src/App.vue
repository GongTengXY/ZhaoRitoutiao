<template>
  <div id="app">
    <!-- 路由出口 -->
        <keep-alive exclude="Search,Detail,Login,Chat">
          <router-view></router-view>
        </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped lang="less"></style>

