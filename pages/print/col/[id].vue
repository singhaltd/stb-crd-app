<script setup>
const route = useRoute();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
useHead({
  title: "ຂໍ້ມູນການປະເມີນຫຼັກຊັບຂອງລູກຄ້າ",
});
definePageMeta({
  layout: "none",
  middleware: ["auth"],
});
const [
  { refresh: Crefres, data: Collet },
  { data: ColRefesh, ColleterAll },
  { data: RateRefresh, ccyRate },
] = await Promise.all([
  useFetch(`${BaseApi}rp/col/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}colleteral/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}rp/ccy/exchange`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
const inyear = (str) => {
  return str == "Y" ? "ປີ" : "ເດືອນ";
};
const handleAct = (str) => {
  window.print();
};
onMounted(() => {
  Crefres();
  ColRefesh();
  RateRefresh();
});
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
  <div>
    <div class="print px-2">
      <div class="fixed flex gap-2 right-0 print:hidden">
        <button class="btn btn-sm">Export</button>
        <button class="btn btn-sm" @click="handleAct('print')">ພິມ</button>
      </div>
      <div class="text-center text-2xl py-4">
        ຂໍ້ມູນການປະເມີນຫຼັກຊັບຂອງລູກຄ້າໃນເບື້ອງຕົ້ນ
      </div>
      <ColleteralRessolb :data="ColleterAll?.data" />
      <div class="mt-5 relative flex">
        <div v-if="ccyRate">
          <p>ອັດຕາແລກປ່ຽນ</p>
          <table class="table-compact absolute left-0">
            <tbody>
              <tr
                class="border"
                v-for="r in ccyRate.filter((t) => t.ccy_type != 'LAK')"
                :key="r"
              >
                <td class="text-right border w-[100px]">{{ r.ccy_type }}</td>
                <td class="text-right w-[100px]">
                  {{ Number(r.rate).toLocaleString("en-UK") }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <table class="table-compact absolute right-0">
          <tbody>
            <tr class="border">
              <td class="text-right border">ລວມມູນຄ່າດິນທັ້ງໝົດ</td>
              <td class="text-right">
                {{ Number(Collet?.total?.lcy).toLocaleString("en-UK") }}
              </td>
              <td>LAK</td>
            </tr>
            <tr class="border">
              <td class="text-right border">ທຽບເທົ່າໂດລາ</td>
              <td class="text-right">
                {{
                  Number(
                    Collet?.total?.lcy /
                      ccyRate.find((i) => (i.ccy = "USD")).rate
                  ).toLocaleString("en-UK")
                }}
              </td>
              <td>USD</td>
            </tr>
            <tr class="border">
              <td class="text-right border">ທຽບເທົ່າບາດ</td>
              <td class="text-right">
                {{
                  Number(
                    Collet.total.lcy / ccyRate.find((i) => (i.ccy = "THB")).rate
                  ).toLocaleString("en-UK")
                }}
              </td>
              <td>THB</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="fixed print -bottom-1 text-xs text-right w-full">
        ວັນທີ: {{ new Date().toISOString().substr(0, 10) }}
      </div>
    </div>
  </div>
</template>
