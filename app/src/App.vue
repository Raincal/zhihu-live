<template>
  <div id="app">
    <NavHeader />
    <router-view/>
  </div>
</template>

<script>
import NavHeader from "@/components/NavHeader.vue";

export default {
  components: {
    NavHeader
  }
};
</script>


<style>
body {
  background: url("./assets/bg.jpg");
  background-repeat: no-repeat;
  background-attachment: fixed;
  margin: 0;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
