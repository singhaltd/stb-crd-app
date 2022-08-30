<script setup>
import { ref, reactive } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import moment from "moment";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const token = useCookie("autKey");
const form = ref({ title: "ເພີ່ມຫຼັກຊັບຕຶກອາຄານ ແລະ ໂຮງງານ", type: "create" });
const modalVal = ref(false);
const refkeydel = ref("");
const router = useRouter();
const props = defineProps({
  cust_no: ref(""),
  itdata: ref(Object),
  province: ref(1),
});
const emits = defineEmits(["update:refresh"]);
const vProvince = ref(1);
const vDistrict = ref("");
const otherSchema = yup.object({
  owner: yup.string().required(),
  doc_no: yup.string().required(),
  issue_date: yup.string().required(),
  value: yup.number().required(),
});
const rcol = reactive({
  owner: ref(""),
  doc_no: ref(""),
  issue_date: ref(""),
  village: ref(""),
  district: ref(""),
  value: ref(0),
  ccy: ref("LAK"),
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
const CreateColleteral = async () => {
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບຕຶກອາຄານ ແລະ ໂຮງງານ";
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(
      `${BaseApi}colleteral/building/${
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

const DeleteColleteral = async () => {
  let val = refkeydel.value;
  const { data: ColDel } = await useAsyncData("ColDel", () =>
    $fetch(`${BaseApi}colleteral/building/${val}`, {
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
const ColView = async (val) => {
  refkeydel.value = val.id;
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບຕຶກອາຄານ ແລະ ໂຮງງານ";
  modalVal.value = true;
  form.value.type = "update";
  rcol.owner = ref(val.owner);
  rcol.col_desc = ref(val.col_desc);
  rcol.doc_no = val.doc_no;
  rcol.issue_date = moment(new Date(val.issue_date)).format("YYYY-MM-DD");
  rcol.value = ref(val.value);
  rcol.village = ref(val.village);
  rcol.district = ref(val.district);
  rcol.ccy = ref(val.ccy);
};
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
setTimeout(() => {
  getDistrict(vProvince.value);
}, 10);

const openMenu = (e) => {
  console.log(e);
};
</script>

<template>
  <div class="px-3">
    <div class="flex justify-between mb-2">
      <div></div>
      <button
        @click="
          modalVal = true;
          form.title = 'ເພີ່ມຫຼັກຊັບຕຶກອາຄານ ແລະ ໂຮງງານ';
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
            <th>ປະເພດ</th>
            <th>ຊື່ເຈົ້າຂອງຫຼັກຊັບ</th>
            <th>ເລກທີ</th>
            <th>ລົງວັນທີ</th>
            <th>ສະກຸນເງິນ</th>
            <th class="text-right">ມູນຄ່າ</th>
            <th class="text-right">ມູນຄ່າຫຼັກຊັບ (ກີບ)</th>
            <th class="text-right w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ot in itdata"
            :key="ot"
            @dblclick="ColView(ot)"
            class="group hover"
          >
            <th>{{ ot.seq }}</th>
            <th>{{ ot.col_desc }}</th>
            <th>{{ ot.owner }}</th>
            <td>{{ ot.doc_no }}</td>
            <td>{{ moment(new Date(ot.issue_date)).format("DD/MM/YYYY") }}</td>
            <td>
              {{ ot.ccy }}
            </td>
            <td class="text-right">{{ ot.value.toLocaleString("en-UK") }}</td>
            <td class="text-right">
              {{ ot.lcy_total.toLocaleString("en-UK") }}
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
        id="my-modal-3"
        :checked="modalVal"
        class="modal-toggle"
      />
      <div class="modal">
        <div
          class="modal-box overflow-hidden max-h-[90vh] pt-0 px-0 pb-5 relative"
        >
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
          <VeeForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="otherSchema"
            class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4"
            as="div"
          >
            <form @submit="handleSubmit($event, CreateColleteral)">
              <div>
                <label
                  for="first_name"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ປະເພດຫຼັກຊັບຄ້ຳປະກັນ <span class="text-[red]">*</span></label
                >
                <VField
                  type="text"
                  name="col_desc"
                  id="col_desc"
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
                  for="colDoc"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ເລກທີ <span class="text-[red]">*</span></label
                >

                <VField
                  type="text"
                  name="doc_no"
                  id="colDoc"
                  v-model="rcol.doc_no"
                  class="input input-sm input-bordered w-full"
                  :class="errors.doc_no ? 'input-error' : ''"
                />
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColIsdate"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ລົງວັນທີ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="date"
                    name="issue_date"
                    id="ColIsdate"
                    v-model="rcol.issue_date"
                    class="input input-sm input-bordered w-full"
                    :class="errors.issue_date ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="colProvince"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ແຂວງ</label
                  >
                  <select
                    class="select select-sm select-bordered w-full"
                    id="colProvince"
                    v-model="vProvince"
                  >
                    <option :value="ip.id" v-for="ip in province" :key="ip">
                      {{ ip.pv_name }}
                    </option>
                  </select>
                </div>
                <div class="w-full">
                  <label
                    for="ColDistrict"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ເມືອງ</label
                  >
                  <select
                    class="select select-sm select-bordered w-full"
                    id="ColDistrict"
                    v-model="rcol.district"
                  >
                    <option value="" selected disabled>ເລືອກເມືອງ</option>
                    <option :value="iv.id" v-for="iv in vDistrict" :key="iv">
                      {{ iv.dt_name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColVillage"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ບ້ານ</label
                  >

                  <VField
                    type="text"
                    name="village"
                    id="ColVillage"
                    v-model="rcol.village"
                    class="input input-sm input-bordered w-full"
                    :class="errors.village ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="w-full">
                <label
                  for="ColValue"
                  class="
                    block
                    mb-2
                    text-sm
                    font-medium
                    text-gray-900
                    dark:text-gray-300
                  "
                  >ມູນຄ່າ <span class="text-[red]">*</span></label
                >
                <div class="relative">
                  <TinputCcy
                    v-model="rcol.value"
                    id="ColValue"
                    name="value"
                    :placeholder="Number(rcol.value).toLocaleString('en-US')"
                    class="
                      input input-sm input-bordered
                      w-full
                      text-right
                      pr-[85px]
                    "
                    :class="errors.value ? 'input-error' : ''"
                    :options="currencyOptions"
                  />
                  <select
                    class="
                      absolute
                      right-0
                      top-0
                      mr-1
                      select select-ghost select-sm
                    "
                    v-model="rcol.ccy"
                  >
                    <option value="LAK">LAK</option>
                    <option value="USD">USD</option>
                    <option value="THB">THB</option>
                  </select>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <div></div>
                <button type="submit" class="btn btn-primary btn-sm">
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </VeeForm>
        </div>
      </div>
    </div>
    <ModalCondel>
      <button class="btn" @click="DeleteColleteral">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>