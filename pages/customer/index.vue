<script setup>
import { ref, reactive } from "vue";
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const router = useRouter();
const typeSearch = reactive({
  stype: "cust_no",
  str: ref(""),
});
useHead({
  title: "ລາຍການລູກຄ້າ",
});
definePageMeta({
  middleware: ["auth"],
});
const perpage = ref("20");
const curpage = ref(1);
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
refresh();
const getCustomer = () => {
  refresh();
};
</script>
<template>
  <div class="w-full mt-5 px-5">
    <TablePanel
      :numpage="customers?.data.meta.last_page"
      @create="isActive = isActive = true"
      title="ລູກຄ້າ"
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
      <template #action>
        <NuxtLink
          to="/customer/create"
          class="btn btn-square btn-primary btn-sm ml-2"
          >+</NuxtLink
        >
      </template>
      <template #body>
        <div class="overflow-x-auto">
          <table class="table w-full table-compact">
            <thead>
              <tr>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ອີເມວ໌</th>
                <th>ເບີໂທ</th>
                <th>ບໍລິສັດ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ສິນເຊື່ອ</th>
                <th>ເປົ້າໝາຍການນຳໃຊ້ເງິນກູ້</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="customers?.data?.data.length === 0">
                <td colspan="10">
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
                v-for="dt in customers?.data?.data"
                :key="dt"
                class="hover"
                v-on:dblclick.native="router.push(`/customer/${dt.cust_no}`)"
                v-else
              >
                <td>{{ dt.cust_no }}</td>
                <td>
                  <div class="flex items-center space-x-3">
                    <!-- <div class="avatar">
                      <div class="mask mask-squircle w-8 h-8">
                        <img
                          v-if="dt == 'image'"
                          src="/tailwind-css-component-profile-2@56w.png"
                          alt="Avatar Tailwind CSS Component"
                        />
                        <svg
                          v-else
                          class="absolute w-10 h-10 text-gray-400 -left-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </div>
                    </div> -->
                    <div>
                      <div class="font-bold">{{ dt.fullname }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ dt.email }}</td>
                <td>{{ dt.mobile }}</td>
                <td>{{ dt.company }}</td>
                <td>{{ dt.cust_cate.name }}</td>
                <td>{{ dt.lntype.name }}</td>
                <td class="whitespace-pre-line">{{ dt.perpose }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>ລະຫັດລູກຄ້າ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ອີເມວ໌</th>
                <th>ເບີໂທ</th>
                <th>ບໍລິສັດ</th>
                <th>ປະເພດລູກຄ້າ</th>
                <th>ສິນເຊື່ອ</th>
                <th>ເປົ້າໝາຍການນຳໃຊ້ເງິນກູ້</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </TablePanel>
  </div>
</template>


<style>
</style>