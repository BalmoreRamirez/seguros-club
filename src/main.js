import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from "./router/index.js";
import Tailwind from 'primevue/passthrough/tailwind';
import 'primeicons/primeicons.css';
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import './style.css';
import 'primevue/resources/themes/lara-light-teal/theme.css';

const app = createApp(App);
app.use(router);
app.use(ToastService);
app.component('Toast', Toast);
app.use(PrimeVue, {
    unstyled: false,
    pt: Tailwind
});
app.mount('#app');