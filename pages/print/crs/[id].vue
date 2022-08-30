<script setup>
const route = useRoute();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
useHead({
  title: "ພີມຂໍ້ມູນລູກຄ້າ",
});
definePageMeta({
  layout: "none",
  middleware: ["auth"],
});
const [
  { refresh: Crefres, data: customer },
  { refresh: colRefresh, data: colApproach },
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
Crefres();
colRefresh();
const inyear = (str) => {
  return str == "Y" ? "ປີ" : "ເດືອນ";
};
const handleAct = () => {
  window.print();
};
</script>
<style>
@media screen, print {
  .tb-gblue {
    background-color: rgb(37, 0, 170) !important;
    color: white;
  }
  .tb-ggreen {
    background-color: rgb(0, 184, 55) !important;
    color: white;
  }
}
/* table#tablePrint {
  border: 0px solid rgba(247, 247, 247, 0) !important;
} */
.tb-gblue {
  background-color: rgb(37, 0, 170) !important;
  color: white;
}
.tb-ggreen {
  background-color: rgb(0, 184, 55);
  color: white !important;
}
</style>
<template>
  <div class="print">
    <div class="fixed flex gap-2 right-0 print:hidden">
      <button class="btn btn-sm" @click="handleAct('print')">ພິມ</button>
    </div>
    <div class="text-center text-2xl py-4">ຜົນຂອງການຈັດອັນດັບຂອງລູກຄ້າ</div>
    <table class="w-1/2" id="tablePrint">
      <tr class="border">
        <td class="px-2 tb-gblue">Name of:<br />ຊື່ວິສາຫະກິດ</td>
        <td class="text-right px-3">{{ customer?.data?.company }}</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue" style="background-color: red">
          Name of borrower:<br />
          ຊື່ຜູ້ກູ້ຢືມ:
        </td>
        <td class="text-right px-3">{{ customer?.data?.fullname }}</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue w-40">
          Branch:<br />
          ສາຂາ:
        </td>
        <td class="text-right px-3">
          {{ customer?.data?.branch_code }}
          {{ customer?.data?.branch?.branch_name }}
        </td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">
          Loan amount:<br />
          ຈຳນວນເງີນຂໍກູ້:
        </td>
        <td class="text-right">
          {{ (customer?.data?.finance).toLocaleString("en-UK") }}
        </td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">
          Currency: <br />
          ສະກຸນເງີນ
        </td>
        <td class="text-right px-3">{{ customer?.data?.ccy }}</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">
          Customer risk grade: <br />ຈັດເກດຄວາມສ່ຽງລູກຄ້າ
        </td>
        <td class="text-right px-3">{{ customer?.data?.grade }}</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">ຄຳເຫັນການອະນຸມັດ/ປະຕິເສດ</td>
        <td class="text-right px-3">{{ customer?.data?.grade_info }}</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">ອັດຕາດອກເບ້ຍຕໍ່ປີ</td>
        <td class="text-right px-3">{{ customer?.data?.int_rate }} %</td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">ໄລຍະເວລາກູ້</td>
        <td class="text-right px-3">
          {{ customer.data?.period }} {{ inyear(customer?.data?.period_type) }}
        </td>
      </tr>
      <tr class="border">
        <td class="px-2 tb-gblue">ເປົ້າໝາຍການນຳໃຊ້ເງິນກູ້</td>
        <td class="text-right px-3">{{ customer?.data?.perpose }}</td>
      </tr>
    </table>
    <table class="w-full mt-5" id="tablePrint">
      <thead class="border">
        <th>No.</th>
        <th>Parameters</th>
        <th>Grade</th>
        <th>Score</th>
      </thead>
      <tbody>
        <template v-for="(api, i) in colApproach.data" :key="i">
          <tr class="border">
            <td></td>
            <td>{{ i + 1 }}. {{ api.title }}</td>
            <td></td>
            <td></td>
          </tr>
          <tr class="border" v-for="(qi, x) in api.qeustions" :key="x">
            <td class="text-center">{{ x + 1 }}</td>
            <td>{{ qi.title }}</td>
            <td class="text-center">
              {{ qi?.choise?.grade }}
            </td>
            <td class="text-center">{{ qi?.choise?.weight }} %</td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="fixed print -bottom-1 text-xs text-right w-full">
      ວັນທີ: {{ new Date().toISOString().substr(0, 10) }}
    </div>
  </div>
</template>
