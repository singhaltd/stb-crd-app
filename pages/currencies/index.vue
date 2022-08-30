<script setup>
import { ref, reactive } from "vue";
import * as yup from "yup";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const router = useRouter();
const toast = useSnakeToast();
const typeSearch = reactive({
  stype: "cust_no",
  str: ref(""),
});
definePageMeta({
  title: "customer",
  middleware: ["auth"],
});
const modalVal = ref(false);
const refkeydel = ref("");
const perpage = ref("20");
const curpage = ref(1);
const schema = yup.object({
  ccy: yup.string().required(),
  code: yup.number().required(),
});
const mdelCcy = reactive({
  ccy: ref(""),
  code: ref(),
  description: ref(""),
});
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
const createCurrency = async () => {
  const { data: ccyCreate } = await useAsyncData("ccyCreate", () =>
    $fetch(`${BaseApi}currency/ccy`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.parse(JSON.stringify(mdelCcy)),
    }).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        router.go();
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
const delCurrency = async () => {
   let val = refkeydel.value;
  const { data: ccyCreate } = await useAsyncData("ccyCreate", () =>
    $fetch(`${BaseApi}currency/ccy/${val}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        router.go();
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
watch(perpage, () => {
  if (perpage.value) {
    refresh();
  }
});
refresh();
const getCustomer = () => {
  refresh();
};

const createCurrent = () => {};
</script>
<template>
  <div>
    <div class="w-full mt-5 px-5">
      <TablePanel
        :numpage="currency?.meta.last_page"
        @create="isActive = isActive = true"
        title="ສະກຸນເງິນ"
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
          <button
            @click="modalVal = true"
            class="btn btn-square btn-primary btn-sm ml-2"
          >
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
                  <th>ລະຫັດ</th>
                  <th>ຄຳອະທິບາຍ</th>
                  <th class="w-[60px]"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="currency?.data.length === 0">
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
                  v-for="dt in currency?.data"
                  :key="dt"
                  class="group hover"
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
                  <td>{{ dt.ccy }}</td>
                  <td>
                    <div class="flex items-center space-x-3">
                      <div>
                        <div class="font-bold">{{ dt.ccy_type }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ dt.description }}</td>
                  <td>
                    <div class="flex gap-1">
                      <button
                        class="hidden group-hover:block"
                        @click="ColView(dt.ccy)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <label
                        class="hidden group-hover:block"
                        @click="refkeydel = dt.ccy"
                        for="MdalCondel"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="red"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>ປະເພດ</th>
                  <th>ລະຫັດ</th>
                  <th>ຄຳອະທິບາຍ</th>
                  <th></th>
                </tr>
              </tfoot>
            </table>
          </div>
        </template>
      </TablePanel>
    </div>

    <input
      type="checkbox"
      id="my-modal-3"
      :checked="modalVal"
      class="modal-toggle"
    />
    <div class="modal">
      <div class="modal-box relative">
        <button
          @click="modalVal = false"
          class="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold">ເພີ່ມສະກຸນເງິນ</h3>
        <div class="py-4 flex flex-col gap-y-2">
          <VeeForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="schema"
            as="div"
          >
            <form
              @submit="handleSubmit($event, createCurrency)"
              name="createCurrency"
            >
              <div class="form-controll">
                <label>ສະກຸນເງິນ</label>
                <VField
                  type="text"
                  name="ccy"
                  id="ccy"
                  v-model="mdelCcy.ccy"
                  class="input input-sm input-bordered w-full"
                  :class="errors.ccy ? 'input-error' : ''"
                />
              </div>
              <div class="form-controll">
                <label>ລະຫັດ</label>
                <VField
                  name="code"
                  v-model="mdelCcy.code"
                  type="number"
                  class="input input-sm input-bordered w-full"
                  :class="errors.code ? 'input-error' : ''"
                />
              </div>
              <div class="form-controll">
                <label>ຄຳອະທິບາຍ</label>
                <textarea
                  type="number"
                  v-model="mdelCcy.description"
                  class="textarea textarea-bordered w-full"
                  rows="2"
                ></textarea>
              </div>
              <div class="flex justify-between">
                <div class="form-controll"></div>
                <button class="btn btn-sm btn-primary" type="submit">
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </VeeForm>
        </div>
      </div>
    </div>
    <ModalCondel>
      <button class="btn" @click="delCurrency">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>