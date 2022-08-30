<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const selectedTab = ref(0);
useHead({
  title: "Params ຄຳຖາມ",
});
definePageMeta({
  middleware: ["auth"],
});

const { data: custType } = await useAsyncData("custType", () =>
  $fetch(`${BaseApi}crd/cust_type`)
);

function changeTab(index) {
  selectedTab.value = index;
}
</script>
<template>
  <div class="mt-4 w-full px-8">custType</div>
</template>