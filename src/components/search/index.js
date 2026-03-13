import Search from "./index.vue";

const install = (Vue, opts = {}) => {
  Vue.prototype.$SearchOptions = opts;

  Vue.component(Search.name, Search);
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  version: "0.0.1",
  install,
};
