import Vue from 'vue';
import App from './App';
// import router from './router';

const bus = new Vue(); // Single event hub

// Distribute to components using global mixin
Vue.mixin({
  data: function() {
    return {
      bus,
    };
  },
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // router,
  render: (h) => h(App),
});
