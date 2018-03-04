import Vue from "vue";
import axios from "axios";
import {
  Table,
  TableColumn,
  Pagination,
  Loading,
  Card,
  Tag,
  Rate,
  Menu,
  MenuItem
} from "element-ui";

import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading);
Vue.use(Card);
Vue.use(Tag);
Vue.use(Rate);
Vue.use(Menu);
Vue.use(MenuItem);

Vue.prototype.axios = axios;

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount("#app");
