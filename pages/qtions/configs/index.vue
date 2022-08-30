<script setup>
import { ref } from "vue";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const selectedTab = ref(0);
const router = useRouter()
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
definePageMeta({
  title: "Params ຄຳຖາມ",
  middleware: ["auth"],
});
const [
  { refresh: custTypeRef, data: custType },
  { refresh: loanTypeRef, data: loanType },
  { refresh: collateralTypeRef, data: collateralType },
] = await Promise.all([
  useFetch(`${BaseApi}crd/cust_type`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}crd/loan_type`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}crd/collateral_type`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
function changeTab(index) {
  selectedTab.value = index;
}

const ViewConfig = (str) => {
  navigateTo(`/qtions/configs/${str}`)
};
</script>
<template>
  <div class="mt-4 w-full px-5">
    <TabGroup>
      <TabList class="tabs mt-5">
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted tab-active'
                : 'tab tab-md tab-lifted',
            ]"
          >
            ປະເພດລູກຄ້າ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted tab-active'
                : 'tab tab-md tab-lifted',
            ]"
          >
            ປະເພດເງິນກູ້
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted tab-active'
                : 'tab tab-md tab-lifted',
            ]"
          >
            ປະເພດຫຼັກຊັບຄ້ຳປະກັນ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted tab-active'
                : 'tab tab-md tab-lifted',
            ]"
          >
            Approach
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted tab-active'
                : 'tab tab-md tab-lifted',
            ]"
          >
            ຄຳຖາມ ແລະ ຄຳຕອບ
          </div>
        </Tab>
      </TabList>
      <TabPanels class="mt-5">
        <TabPanel>
          <div class="overflow-x-auto w-full">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>ຫົວຂໍ້</th>
                  <th>ຄຳອະທິບາຍ</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="hover pointer"
                  v-for="ct in custType.data"
                  :key="ct"
                  v-on:dblclick.native="ViewConfig(ct.id)"
                >
                  <td>{{ ct.name }}</td>
                  <td>{{ ct.description }}</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="overflow-x-auto w-full">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>ຫົວຂໍ້</th>
                  <th>ຄຳອະທິບາຍ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ct in loanType.data" :key="ct">
                  <td>{{ ct.name }}</td>
                  <td>{{ ct.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="overflow-x-auto w-full">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>ຫົວຂໍ້</th>
                  <th>ຄຳອະທິບາຍ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ct in collateralType.data" :key="ct">
                  <td>{{ ct.name }}</td>
                  <td>{{ ct.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>
          <div class="absolute">div</div>
          <div class="overflow-x-auto w-full">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th>ຫົວຂໍ້</th>
                  <th>ຄຳອະທິບາຍ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ct in collateralType.data" :key="ct">
                  <td>{{ ct.name }}</td>
                  <td>{{ ct.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>