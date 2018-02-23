import Vue from "vue";
import axios from "axios";
import { Table, TableColumn, Pagination, Loading } from "element-ui";

import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Loading);

Vue.prototype.axios = axios;

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount("#app");
