<script setup>
const token = useCookie("autKey");
// const getQuestion = ref(custQuestion);
const router = useRouter();
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
useHead({
  title: "Params ຄຳຖາມ",
});
definePageMeta({
  middleware: ["auth"],
});
const qcustomer = ref("");
const typeSearch = reactive({
  stype: "cust_no",
  str: ref(""),
});
const perpage = ref("10");
const curpage = ref(1);
const {
  data: getCustomer,
  pending,
  refresh,
  error,
} = await useFetch(
  () =>
    `${BaseApi}customer?cur_page=${curpage.value}&per_page=${perpage.value}${
      typeSearch.stype && typeSearch.str !== ""
        ? `&${typeSearch.stype}=${typeSearch.str}`
        : ""
    }`,
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);
const handleSearch = () => {
  refresh();
};
</script>
<template>
  <div class="mt-3 w-full px-5 overflow-x-auto">
    <TablePanel
      :numpage="getCustomer?.data.meta.last_page"
      @create="isActive = isActive = true"
      title="ຕອບແບບສອບຖາມ"
      v-model:totalPage="perpage"
    >
      <template #search>
        <div class="flex">
          <select
            v-model="typeSearch.stype"
            class="select select-sm bg-base-200 rounded-l-lg rounded-r-none"
          >
            <option value="cust_no">ລະຫັດລູກຄ້າ</option>
            <option value="fullname">ຊື່ ແລະ ນາມສະກຸນ</option>
            <option value="mobile">ເບີໂທ</option>
          </select>
          <input
            type="text"
            v-model="typeSearch.str"
            class="input w-full input-sm max-w-xs transparent rounded-none"
            placeholder="ປ້ອນການຄົ້ນຫາ..."
          />

          <button
            type="button"
            class="rounded-r-lg rounded-l-none btn-sm btn px-3"
            @click="handleSearch"
          >
            ຄົ້ນຫາ
          </button>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto mt-2">
          <table class="table table-compact w-full">
            <thead>
              <tr>
                <th>ສາຂາ</th>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ປະເພດສິນເຊື່ອ</th>
                <th>ສ້າງໂດຍ</th>
                <th>ເປີດເມື່ອວັນທີ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="getCustomer.data.data.length === 0">
                <td colspan="6">
                  <div>
                    <div class="flex items-center w-20 mx-auto">
                      <img
                        src="/list_empty.png"
                        class="w-16 rounded-3xl p-2 bg-base-200"
                      />
                      <p class="px-4">ບໍ່ມີລາຍການ</p>
                    </div>
                  </div>
                </td>
              </tr>
              <tr
                v-else
                v-for="ci in getCustomer.data.data"
                :key="ci"
                v-on:dblclick.native="router.push(`/qtions/${ci.cust_no}`)"
                class="hover"
              >
                <td>{{ ci.branch_code }}</td>
                <td>{{ ci.cust_no }}</td>
                <td>{{ ci.fullname }}</td>
                <td>{{ ci.cust_cate.name }}</td>
                <td>{{ ci.lntype.name }}</td>
                <td>{{ ci.maker }}</td>
                <td>{{ ci.created_at }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>ສາຂາ</th>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ປະເພດສິນເຊື່ອ</th>
                <th>ສ້າງໂດຍ</th>
                <th>ເປີດເມື່ອວັນທີ</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </TablePanel>
  </div>
</template>