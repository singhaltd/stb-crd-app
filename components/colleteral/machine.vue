<script setup>
import { ref, reactive } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const token = useCookie("autKey");
const router = useRouter();
const props = defineProps({
  cust_no: ref(""),
  itdata: ref(Object),
  province: ref(Object),
});
const emits = defineEmits(["update:refresh"]);
const form = ref({ title: "ເພີ່ມຫຼັກເຄື່ອງຈັກ", type: "create" });
const modalVal = ref(false);
const refkeydel = ref("");
const vProvince = ref(1);
const vDistrict = ref("");
const machineSchema = yup.object({
  model_no: yup.string().required(),
  buy_year: yup.string().required(),
  manual_year: yup.string().required(),
  mac_percent: yup.number().required(),
  buy_price: yup.number().required(),
  village: yup.string().required(),
  district: yup.number().required(),
  mac_type: yup.string().required(),
});
const rcol = reactive({
  owner: ref(""),
  model_no: ref(""),
  buy_year: ref("2022"),
  manual_year: ref("2022"),
  mac_percent: ref(0),
  buy_price: ref(0),
  village: ref(""),
  district: ref(0),
  mac_type: ref(""),
  col_desc: ref(""),
});
watch(vProvince, () => {
  getDistrict(vProvince.value);
});
const getDistrict = async (str) => {
  const district = await $fetch(`${BaseApi}city/district/${str}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  vDistrict.value = district.data;
};
const CreateColMachine = async (errors) => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(
      `${BaseApi}colleteral/machine/${
        form.value.type == "create" ? props.cust_no : refkeydel.value
      }`,
      {
        method: form.value.type == "create" ? "POST" : "PUT",
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        body: JSON.parse(JSON.stringify(rcol)),
      }
    ).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        modalVal.value = false;
        emits("update:refresh");
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};

const ColView = async (val) => {
  refkeydel.value = val.id;
  modalVal.value = true;
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບເຄື່ອງຈັກ";
  form.value.type = "update";
  rcol.owner = ref(val.owner);
  rcol.model_no = val.model_no;
  rcol.buy_year = val.buy_year;
  rcol.manual_year = val.manual_year;
  rcol.mac_percent = val.mac_percent;
  rcol.buy_price = val.buy_price;
  rcol.village = ref(val.village);
  rcol.mac_type = ref(val.mac_type);
  rcol.district = val.district;
};
const DeleteColleteral = async () => {
  let val = refkeydel.value;
  const { data: ColDel } = await useAsyncData("ColDel", () =>
    $fetch(`${BaseApi}colleteral/machine/${val}`, {
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
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
setTimeout(() => {
  getDistrict(vProvince.value);
}, 10);
</script>

<template>
  <div class="px-3">
    <div class="flex justify-between mb-2">
      <div></div>
      <button
        @click="
          modalVal = true;
          form.title = 'ເພີ່ມຫຼັກເຄື່ອງຈັກ';
          form.type = 'create';
        "
        class="btn btn-sm modal-button"
      >
        +
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>seq</th>
            <th>ຊື່ເຈົ້າຂອງຫຼັກຊັບ</th>
            <th>ປະເພດເຄື່ອງຈັກ</th>
            <th>ລະຫັດເຄື່ອງຈັກ</th>
            <th class="text-center">ສະພາບເຄື່ອງຈັກ</th>
            <th class="text-right">ມູນຄ່າຕາມໃບບິນ</th>
            <th class="text-right">ມູນຄ່າປະຈຸບັນ</th>
            <th class="text-right">ມູນຄ່າຫຼັກຊັບ (ກີບ)</th>
            <th class="text-right w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ot in itdata"
            :key="ot"
            class="group hover"
            @dblclick="ColView(ot)"
          >
            <th>{{ ot.seq }}</th>
            <th>{{ ot.owner }}</th>
            <td>{{ ot.mac_type }}</td>
            <td>{{ ot.model_no }}</td>
            <td class="text-center">{{ ot.mac_percent }}%</td>
            <td class="text-right">
              {{ Number(ot.buy_price).toLocaleString("en-UK") }}
            </td>
            <td class="text-right">
              {{ Number(ot.cur_price).toLocaleString("en-UK") }}
            </td>
            <td class="text-right">
              {{ Number(ot.lcy_total).toLocaleString("en-UK") }}
            </td>
            <td>
              <div class="flex gap-1">
                <button class="hidden group-hover:block" @click="ColView(ot)">
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
                  @click="refkeydel = ot.id"
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
      </table>
      <input
        type="checkbox"
        id="ModalMachine"
        :checked="modalVal"
        class="modal-toggle"
      />
      <div class="modal" id="ModalMachine">
        <div class="modal-box overflow-hidden pt-0 px-0 pb-5 relative">
          <div class="sticky top-0 bg-base-100 z-9 px-5 pt-3">
            <button
              @click="modalVal = false"
              class="btn btn-xs btn-circle btn-error absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 class="font-bold text-md mb-3">
              {{ form.title }}
            </h3>
          </div>
          <VForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="machineSchema"
            class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4"
            as="div"
          >
            <form
              @submit="handleSubmit($event, CreateColMachine)"
              name="createMachine"
            >
              <div class="mt-1">
                <label
                  for="coltype"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ປະເພດຫຼັກຊັບຄ້ຳປະກັນ <span class="text-[red]">*</span></label
                >
                <VField
                  type="text"
                  name="col_desc"
                  id="coltype"
                  v-model="rcol.col_desc"
                  class="input input-sm input-bordered w-full"
                  :class="errors.col_desc ? 'input-error' : ''"
                />
              </div>
              <div class="mt-1">
                <label
                  for="first_name"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ຊື່ເຈົ້າຂອງຫຼັກຊັບ</label
                >
                <VField
                  type="text"
                  name="owner"
                  id="owner"
                  v-model="rcol.owner"
                  class="input input-sm input-bordered w-full"
                  :class="errors.owner ? 'input-error' : ''"
                />
              </div>

              <div class="mt-1">
                <label
                  for="coltype"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ປະເພດເຄື່ອງຈັກ <span class="text-[red]">*</span>
                </label>

                <VField
                  type="text"
                  name="mac_type"
                  id="coltype"
                  v-model="rcol.mac_type"
                  class="input input-sm input-bordered w-full"
                  :class="errors.mac_type ? 'input-error' : ''"
                />
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="Colmodel_no"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ລະຫັດເຄື່ອງຈັກ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="model_no"
                    id="Colmodel_no"
                    v-model="rcol.model_no"
                    class="input input-sm input-bordered w-full"
                    :class="errors.model_no ? 'input-error' : ''"
                  />
                </div>
                <div class="w-full">
                  <label
                    for="colVerify"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ປີຜະລິດ <span class="text-[red]">*</span></label
                  >
                  <VField
                    type="text"
                    name="manual_year"
                    id="colmyear"
                    v-model="rcol.manual_year"
                    class="input input-sm input-bordered w-full"
                    :class="errors.manual_year ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="Colbuyyear"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ປີຊື້ເຄື່ອງຈັກ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="buy_year"
                    id="Colbuyyear"
                    v-model="rcol.buy_year"
                    class="input input-sm input-bordered w-full"
                    :class="errors.buy_year ? 'input-error' : ''"
                  />
                </div>
                <div class="w-full">
                  <label
                    for="ColUnit"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ສະພາບເຄື່ອງຈັກ (%) <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="mac_percent"
                    id="ColUnit"
                    v-model="rcol.mac_percent"
                    class="input input-sm input-bordered w-full"
                    :class="errors.mac_percent ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="Colbuyyear"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ແຂວງ <span class="text-[red]">*</span></label
                  >
                  <select
                    class="select select-sm select-bordered w-full"
                    v-model="vProvince"
                  >
                    <option :value="ip.id" v-for="ip in province" :key="ip">
                      {{ ip.pv_name }}
                    </option>
                  </select>
                </div>
                <div class="w-full">
                  <label
                    for="Coldistict"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ເມືອງ <span class="text-[red]">*</span></label
                  >
                  <Field
                    as="select"
                    name="district"
                    id="Coldistict"
                    class="select select-sm select-bordered w-full"
                    :class="errors.district ? 'select-error' : ''"
                    v-model="rcol.district"
                  >
                    <option value="0" selected disabled>ເລືອກເມືອງ</option>
                    <option :value="iv.id" v-for="iv in vDistrict" :key="iv">
                      {{ iv.dt_name }}
                    </option>
                  </Field>
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="Colbuyyear"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ບ້ານ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="village"
                    id="Colbuyyear"
                    v-model="rcol.village"
                    class="input input-sm input-bordered w-full"
                    :class="errors.village ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="buy_price"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ມູນຄ່າຕາມໃບບິນ <span class="text-[red]">*</span></label
                  >
                  <TinputCcy
                    name="buy_price"
                    id="buy_price"
                    v-model="rcol.buy_price"
                    :placeholder="
                      Number(rcol.buy_price).toLocaleString('en-US')
                    "
                    class="input input-sm input-bordered w-full text-right"
                    :class="errors.buy_price ? 'input-error' : ''"
                    :options="currencyOptions"
                  />
                </div>
                <div class="w-full">
                  <label
                    for="ColTotal"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ມູນຄ່າປະຈຸບັນ</label
                  >
                  <p
                    type="number"
                    name="lcy_total"
                    id="ColTotal"
                    class="input input-sm input-bordered w-full text-right"
                    disabled
                  >
                    {{
                      Number(
                        (rcol.buy_price * rcol.mac_percent) / 100
                      ).toLocaleString("en-US")
                    }}
                  </p>
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColTotal"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ມູນຄ່າຫຼັກຊັບ</label
                  >
                  <p
                    type="number"
                    name="lcy_total"
                    id="ColTotal"
                    class="input input-sm input-bordered w-full text-right"
                    disabled
                  >
                    {{
                      Number(
                        (((rcol.buy_price * rcol.mac_percent) / 100) * 70) / 100
                      ).toLocaleString("en-US")
                    }}
                  </p>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <div></div>
                <button
                  type="submit"
                  class="btn btn-primary btn-sm"
                  @click="CreateColMachine(errors)"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </VForm>
        </div>
      </div>
    </div>
    <ModalCondel>
      <button class="btn" @click="DeleteColleteral">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>