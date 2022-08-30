
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const route = useRoute();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const colleter = useColleter();
useHead({
  title: "ຫຼັກຊັບລູກຄ້າ",
});
definePageMeta({
  middleware: ["auth"],
});
const [
  { refresh: CustRef, data: Customer },
  { refresh: colRef, data: Colleteral },
  { refresh: provRef, data: Provinces },
] = await Promise.all([
  useFetch(`${BaseApi}customer/${route.params.cust_no}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}colleteral/${route.params.cust_no}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}city/province`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
CustRef();
colRef();
provRef();
const handlePrint = (str) => {
  window.open(
    `/print/col/${str}`,
    "",
    "location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
  );
};
const myInputModel = ref(0);
</script>
<template>
  <div class="w-full mt-5 px-5">
    <div class="flex justify-between">
      <div></div>
      <a
        class="btn btn-sm modal-button"
        @click="handlePrint(route.params.cust_no)"
        >ເບິ່ງສະຫຼຸບຫຼັກຊັບ</a
      >
    </div>
    <div class="flex -mx-3 mb-6">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="
            block
            uppercase
            tracking-wide
            text-gray-700 text-xs
            font-bold
            mb-2
          "
          for="grid-first-name"
        >
          ລະຫັດລູກຄ້າ
        </label>
        <input
          class="
            appearance-none
            block
            w-full
            bg-gray-200
            text-gray-700
            border
            rounded
            py-2
            px-4
            mb-3
            leading-tight
            focus:outline-none focus:bg-white
          "
          id="grid-first-name"
          type="text"
          placeholder="Jane"
          :value="Customer.data.cust_no"
          disabled
        />
      </div>

      <div class="w-full md:w-1/2 px-3">
        <label
          class="
            block
            uppercase
            tracking-wide
            text-gray-700 text-xs
            font-bold
            mb-2
          "
          for="grid-last-name"
        >
          ຊື່ ແລະ ນາມສະກຸນ
        </label>
        <input
          class="
            appearance-none
            block
            w-full
            bg-gray-200
            text-gray-700
            border border-gray-200
            rounded
            py-2
            px-4
            leading-tight
            focus:outline-none focus:bg-white focus:border-gray-500
          "
          disabled
          id="grid-last-name"
          type="text"
          :value="Customer.data.fullname"
        />
      </div>
    </div>
    <TabGroup>
      <TabList class="tabs overflow-x-auto">
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ທີ່ດິນພ້ອມສິ່ງປຸກສ້າງ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ບັນຊີເງິນຝາກ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ຍານພາຫະນະ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ໂຄງການ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ທີ່ດິນໃນໂຄງການສຳປະທານ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ຕຶກອາຄານ ແລະ ໂຮງງານ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ເຄື່ອງຈັກ
          </div>
        </Tab>
        <Tab v-slot="{ selected }">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            ອື່ນໆ
          </div>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <ColleteralDsolid
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.solid"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralAccount
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.account"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralVihicle
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.vihicle"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralProject
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.projects.filter((t) => t.cate == 7)"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralInproject
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.projects.filter((t) => t.cate == 3)"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralBuilding
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.building"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralMachine
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.machines"
            :province="Provinces.data"
            @update:refresh="colRef()"
          />
        </TabPanel>
        <TabPanel>
          <ColleteralOther
            :cust_no="route.params.cust_no"
            :itdata="Colleteral.data?.other"
            @update:refresh="colRef()"
          />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>