<template>
  <div class="nav-header">
    <el-menu :default-active="activeIndex" class="nav" mode="horizontal" @select="handleSelect">
      <el-menu-item index="1"><router-link to="/">全部 Live</router-link></el-menu-item>
      <el-menu-item index="2"><router-link to="/about">关于</router-link></el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "NavHeader",
  data() {
    return {
      activeIndex: "1"
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>

<style >
.nav-header {
  width: 100%;
  margin-bottom: 30px;
  background-color: #fff;
}
.nav {
  width: 1140px;
  margin: 0 auto;
}
.nav a {
  text-decoration: none;
  display: inline-block;
}
</style>
