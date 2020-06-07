import Vue from "vue";
import App from "./App.vue";

import "./assets/styles.css";

Vue.config.productionTip = false;

Vue.component("contextual-component", {
  inheritAttrs: false,
  props: {
    use: {
      type: Object,
      required: true
    }
  },
  render(h) {
    return h(this.use.component, {
      on: {
        ...(this.use.on || {}),
        ...this.$listeners
      },
      props: {
        ...(this.use.props || {}),
        ...this.$attrs
      },
      attrs: {
        ...(this.use.attrs || {}),
        ...this.$attrs
      },
      scopedSlots: this.$scopedSlots
    });
  }
});

new Vue({
  render: h => h(App)
}).$mount("#app");
