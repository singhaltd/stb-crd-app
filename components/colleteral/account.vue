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
const modalVal = ref(false);
const form = ref({ title: "ເພີ່ມຫຼັກຊັບບັນຊີເງິນຝາກ", type: "create" });
const refkeydel = ref("");
const vProvince = ref(1);
const vDistrict = ref("");
const accountSchema = yup.object({
  ac_name: yup.string().required(),
  ac_no: yup.string().required(),
  interest: yup.number().required(),
  open_date: yup.string().required(),
  expire_date: yup.string().required(),
  village: yup.string().required(),
  district: yup.string().required(),
  amount: yup.number().required(),
  ccy: yup.string().max(3).min(3).required(),
  cif: yup.string().required(),
});
const rcol = reactive({
  ac_name: ref(""),
  ac_no: ref(""),
  interest: ref(0),
  open_date: ref(""),
  expire_date: ref(""),
  amount: ref(0),
  ccy: ref("LAK"),
  village: ref(""),
  district: ref(0),
  cif: ref(""),
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
const createColAccount = async () => {
  const { pending, data: createColAccount } = await useAsyncData(
    "ColAccount",
    () =>
      $fetch(
        `${BaseApi}colleteral/account/${
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
    $fetch(`${BaseApi}colleteral/account/${val}`, {
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
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບ ບັນຊີເງິນຝາກ";
  form.value.type = "update";
  rcol.ac_name = val.ac_name;
  rcol.ac_no = val.ac_no;
  rcol.issue_date = moment(new Date(val.issue_date)).format("YYYY-MM-DD");
  rcol.open_date = moment(new Date(val.open_date)).format("YYYY-MM-DD");
  rcol.expire_date = moment(new Date(val.expire_date)).format("YYYY-MM-DD");
  rcol.interest = val.interest;
  rcol.village = val.village;
  rcol.district = val.district;
  rcol.amount = val.amount;
  rcol.ccy = val.ccy;
  rcol.cif = val.cif;
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
      <button @click="modalVal = true" class="btn btn-sm modal-button">
        +
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>Seq</th>
            <th>ເລກ CIF</th>
            <th>ເລກບັນຊີ</th>
            <th>ຊື່ບັນຊີ</th>
            <th>ວັນທີເດືອນປີ ເປີດບັນຊີ</th>
            <th>ວັນທີເດືອນປີ ຄົບກຳນົດ</th>
            <th>ສະກຸນເງິນ</th>
            <th>ອັດຕາດອກເບ້ຍ</th>
            <th>ຈຳນວນເງິນຝາກ</th>
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
            <td>{{ ot.cif }}</td>
            <td>{{ ot.ac_name }}</td>
            <td>{{ ot.ac_no }}</td>
            <td>
              {{ moment(String(ot.open_date)).format("DD/MM/YYYY") }}
            </td>
            <td>{{ moment(String(ot.expire_date)).format("DD/MM/YYYY") }}</td>
            <td class="text-center">{{ ot.ccy }}</td>
            <td class="text-center">{{ ot.interest }}%</td>
            <td class="text-right">
              {{ ot.amount.toLocaleString("en-UK") }}
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
        id="colAccount"
        :checked="modalVal"
        class="modal-toggle"
      />
      <div class="modal" id="colAccount">
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
          <div class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4">
            <VForm
              v-slot="{ handleSubmit, errors }"
              :validation-schema="accountSchema"
              as="div"
            >
              <form
                @submit="handleSubmit($event, createColAccount)"
                class="mt-4"
                name="createMachine"
              >
                <div class="mt-1">
                  <label
                    for="first_name"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຊື່ບັນຊີ <span class="text-[red]">*</span></label
                  >
                  <VField
                    type="text"
                    name="ac_name"
                    id="owner"
                    v-model="rcol.ac_name"
                    class="input input-sm input-bordered w-full"
                    :class="errors.ac_name ? 'input-error' : ''"
                  />
                </div>
                <div class="flex gap-2 mt-2">
                  <div class="w-full">
                    <label
                      for="Colmodel_no"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >CIF <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="text"
                      name="cif"
                      id="Colcif"
                      v-model="rcol.cif"
                      class="input input-sm input-bordered w-full"
                      :class="errors.cif ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="colDocno"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເລກບັນຊີເງິນຝາກ <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="text"
                      name="ac_no"
                      id="colDocno"
                      v-model="rcol.ac_no"
                      class="input input-sm input-bordered w-full"
                      :class="errors.ac_no ? 'input-error' : ''"
                    />
                  </div>
                </div>

                <div class="flex gap-2 w-full mt-1">
                  <div class="w-full">
                    <label
                      for="colopen"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ວັນທີ ເປີດ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="date"
                      name="open_date"
                      id="colopen"
                      v-model="rcol.open_date"
                      class="input input-sm input-bordered w-full"
                      :class="errors.open_date ? 'input-error' : ''"
                    />
                  </div>
                </div>
                <div class="flex gap-2 w-full mt-1">
                  <div class="w-full">
                    <label
                      for="ColClose"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ວັນທີ ຄົບກຳນົດ <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="date"
                      name="expire_date"
                      id="ColClose"
                      v-model="rcol.expire_date"
                      class="input input-sm input-bordered w-full"
                      :class="errors.expire_date ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="Colccy"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ສະກຸນເງິນ</label
                    >
                    <VField
                      as="select"
                      name="ccy"
                      id="Colccy"
                      v-model="rcol.ccy"
                      class="select select-sm select-bordered w-full"
                      :class="errors.ccy ? 'select-error' : ''"
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
                      for="Colmodel_no"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ອັດຕາດອກເບ້ຍ <span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="interest"
                      id="Colinterest"
                      v-model="rcol.interest"
                      class="input input-sm input-bordered w-full text-right"
                      :class="errors.interest ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="colamount"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ມູນຄ່າເງິນຝາກ <span class="text-[red]">*</span></label
                    >
                    <TinputCcy
                      name="amount"
                      id="colamount"
                      v-model="rcol.amount"
                      :placeholder="Number(rcol.amount).toLocaleString('en-US')"
                      class="input input-sm input-bordered w-full text-right"
                      :class="errors.amount ? 'input-error' : ''"
                      :options="currencyOptions"
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
                      >ເມືອງ <span class="text-[red]">*</span></label
                    >
                    <VField
                      as="select"
                      class="select select-sm select-bordered w-full"
                      id="ColDistrict"
                      name="district"
                      v-model="rcol.district"
                      :class="errors.district ? 'select-error' : ''"
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