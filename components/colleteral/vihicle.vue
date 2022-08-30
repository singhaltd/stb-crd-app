<script setup>
import { ref, reactive } from "vue";
import * as yup from "yup";
import moment from "moment";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const token = useCookie("autKey");
const router = useRouter();
const emits = defineEmits(["update:refresh"]);
const props = defineProps({
  cust_no: ref(""),
  itdata: ref(Object),
  province: ref(1),
});
const form = ref({ title: "ເພີ່ມຫຼັກຊັບຍານພາຫະນະ", type: "create" });
const modalVal = ref(false);
const refkeydel = ref("");
const vProvince = ref(1);
const vDistrict = ref("");
const vihicleSchema = yup.object({
  owner: yup.string().required(),
  brand: yup.string().required(),
  model: yup.string().required(),
  color: yup.string().required(),
  vregist: yup.string().required(),
  engine: yup.string().required(),
  tank: yup.string().required(),
  issue_date: yup.string().required(),
  expire_date: yup.string().required(),
  village: yup.string().required(),
  vh_value: yup.number().required(),
  district: yup.number().required(),
  ccy: yup.string().min(3).required(),
});

const rcol = reactive({
  owner: ref(""),
  brand: ref(""),
  model: ref(""),
  color: ref(""),
  engine: ref(""),
  tank: ref(0),
  issue_date: ref("LAK"),
  expire_date: ref(""),
  village: ref(""),
  district: ref(0),
  vh_value: ref(0),
  ccy: ref("LAK"),
  type_id: ref(1),
  vregist: ref(""),
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
const coldefin = await $fetch(`${BaseApi}colleteral/define/VHC`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const createColVihicle = async () => {
  const { pending, data: ColVihicle } = await useAsyncData("ColVihicle", () =>
    $fetch(
      `${BaseApi}colleteral/vihicle/${
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
    $fetch(`${BaseApi}colleteral/vihicle/${val}`, {
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
  modalVal.value = true;
  refkeydel.value = val.id;
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບ ຍານພາຫະນະ";
  form.value.type = "update";
  rcol.owner = ref(val.owner);
  rcol.brand = val.brand;
  rcol.model = val.model;
  rcol.color = val.color;
  rcol.engine = val.engine;
  rcol.tank = val.tank;
  rcol.ccy = val.ccy;
  rcol.issue_date = moment(new Date(val.issue_date)).format("YYYY-MM-DD");
  rcol.expire_date = moment(new Date(val.expire_date)).format("YYYY-MM-DD");
  rcol.village = val.village;
  rcol.district = val.district;
  rcol.vh_value = val.fcy_total;
  rcol.vregist = val.vh_registration;
  rcol.type_id = ref(val.vhtype.id);
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
  <div class="px-2">
    <div class="flex justify-between mb-2">
      <div></div>
      <button
        for="my-modal-3"
        @click="modalVal = true"
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
            <th>ຊື່ເຈົ້າຂອງລົດ</th>
            <th>ປະເພດລົດ</th>
            <th>ຍີ່ຫໍ້ລົດ</th>
            <th>ລຸ້ນ</th>
            <th>ສີ</th>
            <th>ເລກທະບຽນ</th>
            <th>ເລກຈັກ</th>
            <th>ເລກຖັງ</th>
            <th>ອອກໃຫ້ວັນທີ</th>
            <th>ເຖີງວັນທີ</th>
            <th>ສະກຸນເງິນ</th>
            <th>ມູນຄ່າ</th>
            <th>ມູນຄ່າທຽບເທົ່າ LAK</th>
            <th class="w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ot in itdata"
            :key="ot"
            class="group hover"
            @dblclick="ColView(ot)"
          >
            <td>{{ ot.seq }}</td>
            <td>{{ ot.owner }}</td>
            <td>{{ ot.vhtype.title }}</td>
            <td>{{ ot.brand }}</td>
            <td>{{ ot.model }}</td>
            <td>{{ ot.color }}</td>
            <td>{{ ot.vh_registration }}</td>
            <td>{{ ot.engine }}</td>
            <td>{{ ot.tank }}</td>
            <td>{{ moment(new Date(ot.issue_date)).format("DD/MM/YYYY") }}</td>
            <td>{{ moment(ot.expire_date).format("DD/MM/YYYY") }}</td>
            <td>{{ ot.ccy }}</td>
            <td>{{ ot.fcy_total.toLocaleString("en-UK") }}</td>
            <td>{{ ot.vh_value.toLocaleString("en-UK") }}</td>
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
          class="modal-box relative overflow-hidden max-h-[90vh] pt-0 px-0 pb-5"
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
          <div class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4">
            <VForm
              v-slot="{ handleSubmit, errors }"
              :validation-schema="vihicleSchema"
              as="div"
            >
              <form
                @submit="handleSubmit($event, createColVihicle)"
                class="mt-4"
                name="createVihicle"
              >
                <div class="mt-1">
                  <label
                    for="Colowner"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຊື່ເຈົ້າຂອງລົດ <span class="text-[red]">*</span></label
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
                <div class="flex gap-2 mt-2">
                  <div class="w-full">
                    <label
                      for="ColvType"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ປະເພດ <span class="text-[red]">*</span></label
                    >

                    <VField
                      as="select"
                      name="type_id"
                      id="ColvType"
                      v-model="rcol.type_id"
                      class="input input-sm input-bordered w-full"
                      :class="errors.type_id ? 'input-error' : ''"
                    >
                      <option value="" disabled selected>ເລືອກປະເພດ</option>
                      <option :value="x.id" v-for="x in coldefin.data" :key="x">
                        {{ x.title }}
                      </option>
                    </VField>
                  </div>
                  <div class="w-full">
                    <label
                      for="colbrand"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ຍີຫໍ່ລົດ <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="text"
                      name="brand"
                      id="colbrand"
                      v-model="rcol.brand"
                      class="input input-sm input-bordered w-full"
                      :class="errors.brand ? 'input-error' : ''"
                    />
                  </div>
                </div>
                <div class="flex gap-2 w-full mt-1">
                  <div class="w-full">
                    <label
                      for="colmodel"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ລຸ້ນ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="model"
                      id="colmodel"
                      v-model="rcol.model"
                      class="input input-sm input-bordered w-full"
                      :class="errors.model ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="Colcolor"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ສີ <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="text"
                      name="color"
                      id="Colcolor"
                      v-model="rcol.color"
                      class="input input-sm input-bordered w-full"
                      :class="errors.color ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="vregist"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເລກທະບຽນ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="vregist"
                      id="vregist"
                      v-model="rcol.vregist"
                      class="input input-sm input-bordered w-full"
                      :class="errors.vregist ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="Colengine"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເລກຈັກ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="engine"
                      id="Colengine"
                      v-model="rcol.engine"
                      class="input input-sm input-bordered w-full"
                      :class="errors.engine ? 'input-error' : ''"
                    />
                  </div>
                </div>
                <div class="flex gap-2 w-full mt-1">
                  <div class="w-full">
                    <label
                      for="coltank"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເລກຖັງ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="tank"
                      id="Coltank"
                      v-model="rcol.tank"
                      class="input input-sm input-bordered w-full"
                      :class="errors.tank ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="colamount"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ອອກໃຫ້ວັນທີ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="date"
                      name="issue_date"
                      id="issue_date"
                      v-model="rcol.issue_date"
                      class="input input-sm input-bordered w-full"
                      :class="errors.issue_date ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="colamount"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເຖີງວັນທີ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="date"
                      name="expire_date"
                      id="expire_date"
                      v-model="rcol.expire_date"
                      class="input input-sm input-bordered w-full"
                      :class="errors.expire_date ? 'input-error' : ''"
                    />
                  </div>
                </div>

                <div>
                  <label
                    for="vh_value"
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
                      id="vh_value"
                      name="vh_value"
                      v-model="rcol.vh_value"
                      class="
                        input input-sm input-bordered
                        w-full
                        text-right
                        pr-[85px]
                      "
                      :placeholder="
                        Number(rcol.vh_value).toLocaleString('en-US')
                      "
                      :class="errors.vh_value ? 'input-error' : ''"
                      :options="currencyOptions"
                    />
                    <VField
                      as="select"
                      name="ccy"
                      v-model="rcol.ccy"
                      class="
                        absolute
                        right-0
                        top-0
                        mr-1
                        select select-ghost select-sm
                      "
                    >
                      <option value="LAK">LAK</option>
                      <option value="USD">USD</option>
                      <option value="THB">THB</option>
                    </VField>
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
                      >ເມືອງ <span class="text-[red]">*</span></label
                    >
                    <VField
                      as="select"
                      name="district"
                      class="select select-sm select-bordered w-full"
                      :class="errors.district ? 'select-error' : ''"
                      id="ColDistrict"
                      v-model="rcol.district"
                    >
                      <option value="0" selected disabled>ເລືອກເມືອງ</option>
                      <option :value="iv.id" v-for="iv in vDistrict" :key="iv">
                        {{ iv.dt_name }}
                      </option>
                    </VField>
                  </div>
                </div>
                <div class="flex gap-2 w-full mt-1">
                  <div class="w-full">
                    <label
                      for="ColVillage"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ບ້ານ <span class="text-[red]">*</span></label
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
                <div class="flex justify-between mt-4">
                  <div></div>
                  <button type="submit" class="btn btn-primary btn-sm">
                    ບັນທຶກ
                  </button>
                </div>
              </form>
            </VForm>
          </div>
        </div>
      </div>
    </div>
    <ModalCondel>
      <button class="btn" @click="DeleteColleteral">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>