<script setup>
import moment from "moment";
import { ref, reactive } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const token = useCookie("autKey");
const toast = useSnakeToast();
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const router = useRouter();
const typeSearch = reactive({
  stype: "cust_no",
  str: ref(""),
});
definePageMeta({
  title: "customer",
  middleware: ["auth"],
});
const otherSchema = yup.object({
  rate: yup.number().required(),
});
const perpage = ref("20");
const curpage = ref(1);
const crate = ref(Array);
const modalVal = ref(false);
const {
  refresh,
  pending,
  data: currency,
} = useLazyAsyncData("currency", () =>
  $fetch(
    `${BaseApi}currency/ccy?cur_page=${curpage.value}&per_page=${
      perpage.value
    }${
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
const { data: exrate, refresh: rateRefresh } = useLazyAsyncData("exrate", () =>
  $fetch(
    `${BaseApi}currency/exrate?cur_page=${curpage.value}&per_page=${
      perpage.value
    }${
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
const view = async () => {
  modalVal.value = true;
  crate.value = exrate.value.data?.data;
};
const updateRate = async () => {
  await $fetch(`${BaseApi}currency/exrate`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: JSON.parse(JSON.stringify({ rate: crate.value })),
  }).then((res) => {
    if (res.status == 200) {
      toast.value = { state: true, type: "success" };
      modalVal.value = false;
      rateRefresh();
    } else {
      toast.value = { state: true, type: "error", data: res.data };
    }
  });
};
const mdRate = exrate?.data;
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
</script>
<template>
  <div>
    <div class="w-full mt-5 px-5">
      <TablePanel
        :numpage="exrate?.data.meta.last_page"
        @create="isActive = isActive = true"
        :title="`ອັດຕາແລກປ່ຽນ: ${moment(new Date(exrate?.last_date)).format(
          'DD/MM/YYYY'
        )} | ຮອບທີ ${exrate?.last_round}`"
        v-model:totalPage="perpage"
      >
        <template #search>
          <div class="flex">
            <input
              type="text"
              v-model="typeSearch.str"
              class="input w-full input-sm max-w-xs transparent rounded-none"
              placeholder="ປ້ອນການຄົ້ນຫາ ສະກຸນເງິນ..."
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
          <button @click="view" class="btn btn-square btn-primary btn-sm ml-2">
            +
          </button>
        </template>
        <template #body>
          <div class="overflow-x-auto">
            <table class="table w-full table-compact">
              <thead>
                <tr>
                  <th class="w-3"></th>
                  <th>ປະເພດ</th>
                  <th>ອັດຕາຂາຍ</th>
                  <th>ຮອບ</th>
                  <th>ວັນທີ່ເດືອນປີ</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="exrate?.data?.data.length === 0">
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
                  v-for="dt in exrate?.data?.data"
                  :key="dt"
                  class="hover"
                  v-else
                >
                  <th>
                    <label>
                      <input
                        type="checkbox"
                        name="checkme"
                        class="checkbox checkbox-sm"
                      />
                    </label>
                  </th>
                  <td>{{ dt.ccy_type }}</td>
                  <td>{{ Number(dt.rate).toLocaleString("en-US") }}</td>
                  <td>{{ dt.round }}</td>
                  <td>
                    {{ moment(new Date(dt.trn_dt)).format("DD/MM/YYYY") }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th class="w-3"></th>
                  <th>ປະເພດ</th>
                  <th>ອັດຕາຂາຍ</th>
                  <th>ຮອບ</th>
                  <th>ວັນທີ່ເດືອນປີ</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </TablePanel>
    </div>
    <input
      type="checkbox"
      id="mdExrate"
      :checked="modalVal"
      class="modal-toggle"
    />
    <div class="modal">
      <div class="modal-box relative">
        <button
          @click="
            modalVal = false;
            rateRefresh();
          "
          class="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">ອັບເດດອັດຕາແລກປ່ຽນ</h3>
        <form @submit.prevent="updateRate" class="mt-4" name="frmOther">
          <div class="w-full">
            <div class="flex flex-row">
              <p class="w-[60px]">Code</p>
              <p class="text-right pl-3">ອັດຕາຂາຍ</p>
            </div>
            <div
              class="flex flex-row mt-3 gap-2"
              v-for="(t, i) in crate"
              :key="i"
            >
              <input
                type="text"
                disabled
                class="input input-sm w-[60px]"
                v-model="t.ccy_type"
              />
              <input
                type="text"
                name="rate"
                :disabled="t.ccy_type == 'LAK' ? true : false"
                class="input input-sm input-bordered w-full text-right"
                v-model="t.rate"
              />
              <input
                type="date"
                name="trn_dt"
                class="input input-sm input-bordered w-full text-right"
                v-model="t.trn_dt"
              />
              <p class="w-[200px] text-right">
                {{ Number(t.rate).toLocaleString("en-US") }}
              </p>
            </div>
            <div class="flex justify-between">
              <div></div>
              <button class="btn btn-sm btn-primary mt-4 right-0" type="submit">
                ບັນທຶກ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>