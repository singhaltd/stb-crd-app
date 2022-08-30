<script setup>
import { ref, reactive, computed } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import moment from "moment";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const { $toploading } = useNuxtApp();
definePageMeta({});
const token = useCookie("autKey");
const props = defineProps({
  data: ref(Object),
});
var getLoan = ref({ data: "" });
const loanCust = reactive({
  firstname: props.data?.firstname,
  firstname_en: props.data?.firstname_en,
  lastname: props.data?.lastname,
  lastname_en: props.data?.lastname_en,
  sex: props.data?.sex,
  cust_type: props.data?.cust_type,
  loan_type: props.data?.loan_type,
  email: props.data?.email,
  mobile: props.data?.mobile,
  company: props.data?.company,
  company_en: props.data?.company_en,
  finance: props.data?.finance,
  ccy: props.data?.ccy,
  cycle: props.data?.period,
  cycle_type: props.data?.period_type,
  exp: props.data?.exp,
  perpose: props.data?.perpose,
  dob: moment(new Date(props.data.dob)).format("YYYY-MM-DD"),
  intrate: props.data?.int_rate,
});
const schemaLoanCust = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  mobile: yup.string().required(),
  email: yup.string().required(),
  loan_type: yup.string().required(),
  cust_type: yup.string().required(),
  perpose: yup.string().required(),
});
const {
  pending,
  refresh,
  data: CutType,
} = await useAsyncData("CustType", () =>
  $fetch(`${BaseApi}crd/custype/loantype`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
);
const getLoanType = (str) => {
  const dt = CutType.value.data.filter((i) => i.id == str);
  getLoan.value = dt[0].loans;
};
getLoanType(props.data?.cust_type);
const UpdateCustomer = async () => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(`${BaseApi}customer/${props.data?.cust_no}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.parse(JSON.stringify(loanCust)),
    }).then((res) => {
      toast.value = { state: true, type: "success" };
      navigateTo("/customer");
    })
  );
};
onMounted(() => {
  refresh();
});
</script>

<template>
  <div>
    <div class="modal" id="custInfo">
      <div
        class="
          modal-box
          w-11/12
          max-w-5xl
          overflow-hidden
          max-h-[90vh]
          pt-0
          px-0
          pb-5
          relative
        "
      >
        <div class="sticky top-0 bg-base-100 z-9 px-5 pt-3">
          <a
            href="#"
            class="btn btn-xs btn-circle btn-error absolute right-2 top-2"
            >✕</a
          >
          <h3 class="font-bold text-md mb-3">
            ຂໍ້ມູນລູກຄ້າ - {{ props.data?.cust_no }}
          </h3>
        </div>
        <div class="w-full max-h-[80vh] overflow-y-auto pb-5">
          <VForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="schemaLoanCust"
            as="div"
            class="px-5"
          >
            <form @submit="handleSubmit($event, UpdateCustomer)">
              <div class="grid gap-6 mb-3 lg:grid-cols-3">
                <div class="flex flex-col">
                  <div>
                    <label
                      for="first_name"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ຊື່ແທ້ (ພາສາລາວ)<span class="text-[red]">*</span></label
                    >
                    <VField
                      type="text"
                      name="firstname"
                      id="first_name"
                      v-model="loanCust.firstname"
                      class="input input-sm input-bordered w-full"
                      :class="errors.firstname ? 'input-error' : ''"
                    />
                  </div>
                  <div class="mt-3">
                    <label
                      for="first_name_en"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ຊື່ແທ້ (ພາສາອັງກິດ)</label
                    >
                    <input
                      type="text"
                      id="first_name_en"
                      v-model="loanCust.firstname_en"
                      class="input input-sm input-bordered w-full"
                    />
                  </div>
                </div>
                <div class="flex flex-col">
                  <div>
                    <label
                      for="last_name"
                      class="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-300
                      "
                      >ນາມສະກຸນ (ພາສາລາວ)<span class="text-[red]"
                        >*</span
                      ></label
                    >
                    <VField
                      type="text"
                      id="last_name"
                      name="lastname"
                      v-model="loanCust.lastname"
                      class="input input-sm input-bordered w-full"
                      :class="errors.lastname ? 'input-error' : ''"
                    />
                  </div>
                  <div class="mt-3">
                    <label
                      for="first_name_en"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ນາມສະກຸນ (ພາສາອັງກິດ)</label
                    >
                    <input
                      type="text"
                      id="last_name_en"
                      v-model="loanCust.lastname_en"
                      class="input input-sm input-bordered w-full"
                    />
                  </div>
                </div>
                <div>
                  <div>
                    <label
                      for="cdob"
                      class="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-300
                      "
                      >ວັນທີເດືອນປີເກີດ</label
                    >
                    <VField
                      type="date"
                      id="cdob"
                      name="cdob"
                      v-model="loanCust.dob"
                      class="input input-sm input-bordered w-full"
                    />
                  </div>
                  <div class="mt-4">
                    <label
                      class="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-300
                      "
                      >ເພດ</label
                    >
                    <div class="flex">
                      <div class="flex">
                        <input
                          type="radio"
                          name="sex"
                          v-model="loanCust.sex"
                          class="radio radio-sm"
                          value="M"
                          id="sexm"
                        />
                        <label class="pl-4" for="sexm">ຊາຍ</label>
                      </div>
                      <div class="flex pl-5">
                        <input
                          type="radio"
                          name="sex"
                          v-model="loanCust.sex"
                          class="radio radio-sm"
                          id="sexf"
                          value="F"
                        />
                        <label class="pl-4" for="sexf">ຍິງ</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    for="company"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ຊື່ວິສາຫະກິດ (ພາສາລາວ)</label
                  >
                  <VField
                    type="text"
                    name="company"
                    id="company"
                    v-model="loanCust.company"
                    class="input input-sm input-bordered w-full"
                  />
                </div>
                <div>
                  <label
                    for="company"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ຊື່ວິສາຫະກິດ (ພາສາອັງກິດ)</label
                  >
                  <VField
                    type="text"
                    name="company_en"
                    id="company_en"
                    v-model="loanCust.company_en"
                    class="input input-sm input-bordered w-full"
                  />
                </div>

                <div>
                  <label
                    for="phone"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ເບີໂທ</label
                  >
                  <VField
                    type="tel"
                    id="phone"
                    name="mobile"
                    v-model="loanCust.mobile"
                    class="input input-sm input-bordered w-full"
                    :class="errors.mobile ? 'input-error' : ''"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ອີເມວ໌</label
                  >
                  <VField
                    type="email"
                    id="email"
                    name="email"
                    v-model="loanCust.email"
                    class="input input-sm input-bordered w-full"
                    placeholder="stb@stbanklaos.com"
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ປະເພດລູກຄ້າ</label
                  >
                  <select
                    class="select select-bordered w-full select-sm"
                    v-model="loanCust.cust_type"
                  >
                    <option disabled selected>ເລືອກປະເພດລູກຄ້າ</option>
                    <option v-for="ci in CutType.data" :key="ci" :value="ci.id">
                      {{ ci.name }}
                    </option>
                  </select>
                </div>
                <div class="flex gap-2">
                  <div class="w-full">
                    <label
                      for="email"
                      class="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-300
                      "
                      >ປະເພດສິນເຊື່ອ</label
                    >
                    <select
                      class="select select-bordered w-full select-sm"
                      v-model="loanCust.loan_type"
                    >
                      <option disabled selected>ເລືອກປະເພດສິນເຊື່ອ</option>
                      <option v-for="ci in getLoan" :key="ci" :value="ci.id">
                        {{ ci.name }}
                      </option>
                    </select>
                  </div>
                  <div class="w-full">
                    <label
                      for="email"
                      class="
                        block
                        mb-2
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-gray-300
                      "
                      >ເຄີຍກູ້?</label
                    >
                    <div class="flex mt-3">
                      <div class="flex">
                        <input
                          type="radio"
                          name="exp"
                          v-model="loanCust.exp"
                          class="radio radio-sm"
                          value="Y"
                          id="expy"
                        />
                        <label class="pl-4" for="expy">ເຄີຍ</label>
                      </div>
                      <div class="flex pl-5">
                        <input
                          type="radio"
                          name="exp"
                          v-model="loanCust.exp"
                          class="radio radio-sm"
                          id="expn"
                          value="N"
                        />
                        <label class="pl-4" for="expn">ບໍ່ເຄີຍ</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    for="financeAm"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ວົງເງິນສະເໜີກູ້</label
                  >
                  <div class="relative">
                    <VField
                      type="number"
                      id="financeAm"
                      name="financeAm"
                      v-model="loanCust.finance"
                      class="input input-sm input-bordered w-full"
                      required
                    />
                    <select
                      v-model="loanCust.ccy"
                      class="
                        absolute
                        right-0
                        top-0
                        mr-1
                        select select-ghost select-sm
                      "
                    >
                      <option value="LAK">LAK</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    for="cycle"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ໄລຍະເວລາ
                  </label>
                  <div class="relative">
                    <VField
                      name="cycle"
                      type="number"
                      id="cycle"
                      v-model="loanCust.cycle"
                      class="input input-sm input-bordered w-full"
                      required
                    />
                    <select
                      v-model="loanCust.cycle_type"
                      class="
                        absolute
                        right-0
                        top-0
                        mr-1
                        select select-ghost select-sm
                        text-center
                      "
                    >
                      <option value="Y">ປີ</option>
                      <option value="M">ເດືອນ</option>
                      <option value="D">ວັນ</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label
                    for="cycle"
                    class="
                      block
                      mb-2
                      text-sm
                      font-medium
                      text-gray-900
                      dark:text-gray-300
                    "
                    >ອັດຕາດອກເບ້ຍຕໍ່ປີ
                  </label>
                  <div class="relative">
                    <VField
                      type="text"
                      id="interest"
                      name="interest"
                      v-model="loanCust.intrate"
                      class="input input-sm input-bordered w-full"
                      required
                    />
                  </div>
                </div>
              </div>
              <div>
                <label
                  for="perpose"
                  class="
                    block
                    mb-2
                    text-sm
                    font-medium
                    text-gray-900
                    dark:text-gray-300
                  "
                  >ເປົ້າໝາຍສະເໜີກູ້</label
                >
                <textarea
                  id="perpose"
                  v-model="loanCust.perpose"
                  class="input input-sm input-bordered w-full h-20"
                ></textarea>
              </div>
              <div class="flex justify-between">
                <div></div>
                <button
                  type="button"
                  class="btn mt-8 btn-primary btn-sm"
                  @click="UpdateCustomer"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </VForm>
        </div>
      </div>
    </div>
  </div>
</template>