import './assets/main.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routes';

createApp(App).use(router).mount('#app');
