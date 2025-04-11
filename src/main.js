import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import ToastService from 'primevue/toastservice';
import 'primeicons/primeicons.css'
import './assets/main.css';
import './assets/sidebar.css';
import './assets/dashboard.css'

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
});
app.use(ToastService);
app.use(pinia); 
app.use(router);
app.mount('#app');
