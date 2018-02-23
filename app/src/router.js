import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Live from "./views/Live.vue";
import About from "./views/About.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/:id/messages",
      name: "live",
      component: Live
    },
    {
      path: "/about",
      name: "about",
      component: About
    }
  ]
});
