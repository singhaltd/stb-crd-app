import { Form, Field, ErrorMessage } from 'vee-validate';
// import Maska from 'maska'
// import VueTheMask from 'vue-the-mask'
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("VForm", Form);
  nuxtApp.vueApp.component("VField", Field);
  nuxtApp.vueApp.component("VErrorMessage", ErrorMessage);
});