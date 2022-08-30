
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const route = useRoute();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
definePageMeta({
  title: "ຂໍ້ມູນລູກຄ້າ",
  middleware: ["auth"],
});
const [{ refresh: CustRef, data: custType }] = await Promise.all([
  useFetch(`${BaseApi}crd/cust_type/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
// const itemSele = customer;
const loanType = ref([
  { id: 1, name: "1", list: 2 },
  { id: 2, name: "2", list: 1 },
  { id: 3, name: "3", list: 1 },
]);
const getList = (list) => {
  return loanType.value.filter((i) => i.list == list);
};

const starDrag = (event, item) => {
  // console.log(item)
  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("itmv", item);
  //   console.log(item);
};

const onDrop = (event, list) => {
  const id = event.dataTransfer.getData("itmv");
  const it = loanType.value.find((it) => it.id == id);
  it.list = list;
  // loanType.list = 2
  console.log(list);
  //   console.log(loanType.value)
};
</script>
<template>
  <div class="mt-5">
    <div class="flex w-full">
      <div
        class="grid flex-grow card place-items-left"
        @dragenter.prevent
        @dragover.prevent
      >
        <div class="w-56 p-2 rounded-box shadow-lg">
          <h3 class="text-2xl">{{ custType?.data?.name }}</h3>
          <ul
            @drop="onDrop($event, 2)"
            class="
              menu menu-compact
              lg:menu-normal
              bg-base-100
              w-56
              p-2
              rounded-box
            "
          >
            <li
              v-for="i in getList(2)"
              :key="i"
              draggable="true"
              @dragstart="starDrag($event, i.id)"
            >
              <a> {{ i.name }}</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="divider divider-horizontal">OR</div>
      <div
        class="grid flex-grow card place-items-left"
        @dragenter.prevent
        @dragover.prevent
      >
        <!-- {{ getList() }} -->
        <ul
          @drop="onDrop($event, 1)"
          class="menu menu-compact bg-base-100 w-56 p-2 rounded-box shadow-lg"
        >
          <li
            v-for="i in getList(1)"
            :key="i"
            draggable="true"
            @dragstart="starDrag($event, i.id)"
          >
            {{ i.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>