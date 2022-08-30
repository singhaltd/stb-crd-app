
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
const route = useRoute();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const showMore = ref(false);
useHead({
  title: "ຂໍ້ມູນລູກຄ້າ",
});
definePageMeta({
  middleware: ["auth"],
});
const [
  { refresh: CustRef, data: customer },
  { refresh: colRef, data: colApproach },
] = await Promise.all([
  useFetch(`${BaseApi}customer/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}customer/crd/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
onMounted(() => {
  CustRef();
  colRef();
});
</script>
<template>
  <div class="mt-5 px-3">
    <ProfileCustinfo :data="customer.data" />
    <div class="flex">
      <div class="flex-auto">
        <button
          class="btn btn-sm absolute right-2 lg:hidden md:hidden block z-[9999]"
          @click="showMore = !showMore"
        >
          ຂໍ້ມູນເພີ່ມຕື່ມ
        </button>
        <ProfileCustomer :data="customer.data" />
      </div>
      <div
        class="
          lg:block
          md:block
          lg:relative
          md:relative
          hidden
          fixed
          lg:w-auto
          w-full
          z-10
        "
        :class="{ block: showMore }"
      >
        <div>
          <table class="table table-compact w-full">
            <tbody>
              <tr>
                <th>ສາຂາ:</th>
                <td class="text-right">
                  {{ customer.data?.branch.branch_code }} -
                  {{ customer.data?.branch.branch_name }}
                </td>
              </tr>
              <tr>
                <th>ຈຳນວນເງີນຂໍກູ້:</th>
                <td class="text-right">
                  {{ customer.data?.finance.toLocaleString("en-UK") }}
                </td>
              </tr>
              <tr>
                <th>ສະກຸນເງີນ:</th>
                <td class="text-right">{{ customer.data?.ccy }}</td>
              </tr>
              <tr>
                <th>ຄະແນນ:</th>
                <td class="text-right">{{ customer.data?.score }} %</td>
              </tr>
              <tr class="border">
                <th>ຈັດເກດຄວາມສ່ຽງລູກຄ້າ:</th>
                <td class="text-right">{{ customer.data?.grade }}</td>
              </tr>
              <tr class="border">
                <th>ຄຳເຫັນການອະນຸມັດ/ປະຕິເສດ:</th>
                <td class="text-right">
                  <p class="text-lg">
                    {{ customer.data?.grade_info }}
                  </p>
                </td>
              </tr>
              <tr>
                <th>ອັດຕາດອກເບ້ຍຕໍ່ປີ:</th>
                <td class="text-right">{{ customer.data?.int_rate }} %</td>
              </tr>
              <tr>
                <th>ໄລຍະເວລາກູ້:</th>
                <td class="text-right">
                  {{ customer.data?.period }} {{ customer.data?.period_type }}
                </td>
              </tr>
              <tr>
                <th>ເປົ້າໝາຍການນຳໃຊ້ເງິນກູ້:</th>
                <td class="text-right">
                  <div class="tooltip" :data-tip="customer.data?.perpose">
                    <p>{{ customer.data?.perpose }}</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <TabGroup>
      <TabList class="tabs sticky top-10 z-[9999]">
        <Tab v-slot="{ selected }" v-for="ap in colApproach.data" :key="ap">
          <div
            :class="[
              selected
                ? 'tab tab-md tab-lifted gap-2 tab-active'
                : 'tab tab-md tab-lifted gap-2',
            ]"
          >
            {{ ap.title }}
          </div>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(cp, ic) in colApproach.data" :key="cp">
          <div class="overflow-x-auto mt-3">
            <table class="table table-compact w-full">
              <thead>
                <tr>
                  <th style="width: 50px"></th>
                  <th>ຫົວຂໍ້</th>
                  <th>ຄະແນນ (%)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(it, i) in colApproach.data[ic].qeustions" :key="it">
                  <th style="width: 50px" class="text-center">{{ i + 1 }}</th>
                  <td>{{ it.title }}</td>
                  <td style="width: 100px" class="text-center">
                    {{ it.choise?.weight }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th colspan="2" class="text-right"></th>
                  <th style="width: 50px" class="text-center"></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>