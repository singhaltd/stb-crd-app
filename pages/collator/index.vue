<script setup>
import { ref, reactive } from "vue";
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const router = useRouter();
useHead({
  title: "ຫຼັກຊັບລູກຄ້າ",
});
definePageMeta({
  middleware: ["auth"],
});
const perpage = ref("20");
const curpage = ref(1);
const user = reactive({
  username: ref(""),
  fullname: ref(""),
  password: ref(""),
  cpassword: ref(""),
  email: ref(""),
  mobile: ref(""),
});
const typeSearch = reactive({
  stype: "cust_no",
  str: ref(""),
});
const {
  refresh,
  pending,
  data: customers,
} = useLazyAsyncData("customers", () =>
  $fetch(
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
  )
);
watch(perpage, () => {
  if (perpage.value) {
    refresh();
  }
});
const getCustomer = () => {
  refresh();
};
</script>
<template>
  <div class="w-full mt-5 px-5">
    <TablePanel
      :numpage="customers?.data.meta.last_page"
      @create="isActive = isActive = true"
      title="ຫຼັກຊັບຄ້ຳປະກັນລູກຄ້າ"
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
            @click="getCustomer"
          >
            ຄົ້ນຫາ
          </button>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="table w-full table-compact">
            <thead>
              <tr>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ລວມຫຼັກຊັບ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customers?.data?.data.length === 0">
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
                v-for="dt in customers?.data?.data"
                :key="dt"
                class="hover"
                v-on:dblclick.native="router.push(`/collator/${dt.cust_no}`)"
              >
                <td>{{ dt.cust_no }}</td>
                <td>
                  <div class="flex items-center space-x-3">
                    <div>
                      <div class="font-bold">{{ dt.fullname }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ dt.email }}</td>
                <td>{{ dt.mobile }}</td>
                <td>{{ dt.company }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ລວມຫຼັກຊັບ</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </TablePanel>
  </div>
</template>