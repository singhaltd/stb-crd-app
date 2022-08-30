<script setup>
import { ref, reactive } from "vue";
import * as yup from "yup";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const { $toploading } = useNuxtApp();
useHead({
  title: "ເພີ່ມລູກຄ້າ",
});
const custId = ref(true);
const token = useCookie("autKey");
var getLoan = ref({ data: Object });
const loanCust = reactive({
  firstname: ref(""),
  lastname: ref(""),
  firstname_en: ref(""),
  lastname_en: ref(""),
  company: ref(""),
  company_en: ref(""),
  sex: ref("M"),
  cust_type: ref(""),
  loan_type: ref(""),
  questions: ref(""),
  finance: ref(0),
  ccy: ref("LAK"),
  cycle: ref(0),
  cycle_type: ref("Y"),
  exp: ref("N"),
  perpose: ref(""),
  dob: ref(Date),
  intrate: ref(0),
  cust_no: ref(""),
});
const schemaLoanCust = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  mobile: yup.string().required(),
  loan_type: yup.string().required(),
  cust_type: yup.string().required(),
  perpose: yup.string().required(),
});
const { pending, data: CutType } = await useAsyncData("CustType", () =>
  $fetch(`${BaseApi}crd/custype/loantype`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
);
watchEffect(() => {
  if (loanCust.cust_type) {
    getLoanType(loanCust.cust_type);
  }
});
watch(custId, () => (loanCust.cust_no = ""));

const getLoanType = (str) => {
  const dt = CutType.value.data.filter((i) => i.id == str);
  getLoan.value = dt[0].loans;
};

const CreateCustomer = async () => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(`${BaseApi}customer`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.parse(JSON.stringify(loanCust)),
    })
      .then((res) => {
        if (res.error == false) {
          toast.value = { state: true, type: "success" };
          navigateTo("/customer");
        } else {
          toast.value = { state: true, type: "error", data: res.data };
        }
      })
      .catch((er) => {
        console.log(er);
      })
  );
};
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
</script>

<template>
  <div class="w-full mx-auto mt-5 px-5">
    <VForm
      v-slot="{ handleSubmit, errors }"
      :validation-schema="schemaLoanCust"
      as="div"
    >
      <form @submit="handleSubmit($event, CreateCustomer)">
        <div
          class="
            sm:flex
            items-center
            justify-between
            sticky
            top-0
            animated
            backdrop-blur
            supports-backdrop-blur:shadow supports-backdrop-blur:bg-white/60
            mb-3
          "
        >
          <div class="flex items-center justify-between">
            <h2 class="py-3">ເພີ່ມລູກຄ້າ</h2>
          </div>
          <div class="flex">
            <div class="form-control -mt-1">
              <label class="label cursor-pointer">
                <span class="label-text pr-2">ລະຫັດລູກຄ້າ auto? </span>
                <input
                  type="checkbox"
                  class="toggle toggle-accent pl-2"
                  v-model="custId"
                />
              </label>
            </div>
            <input
              type="text"
              class="input input-sm input-bordered"
              placeholder="ປ້ອນລະຫັດລູກຄ້າ"
              v-model="loanCust.cust_no"
              v-show="!custId"
            />
            <button
              class="
                text-sm
                font-medium
                leading-none
                btn btn-primary btn-sm
                ml-2
              "
              type="submit"
            >
              ບັນທຶກ
            </button>
          </div>
        </div>
        <div class="grid gap-6 mb-3 lg:grid-cols-3">
          <div class="flex lg:flex-col md:flex-col sm:flex-col-2 gap-3">
            <div class="w-full">
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
            <div class="w-full">
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
          <div class="flex lg:flex-col md:flex-col sm:flex-col-2 gap-3">
            <div class="w-full">
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
                >ນາມສະກຸນ (ພາສາລາວ)<span class="text-[red]">*</span></label
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
            <div class="w-full">
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
          <div class="flex lg:flex-col-2 md:flex-col-2 sm:flex-col-2 gap-3">
            <div class="w-full">
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
            <div class="w-full">
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
              >ເບີໂທ <span class="text-[red]">*</span></label
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
            <input
              type="email"
              id="email"
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
              >ປະເພດລູກຄ້າ <span class="text-[red]">*</span></label
            >
            <VField
              as="select"
              name="cust_type"
              class="select select-bordered w-full select-sm"
              :class="errors.cust_type ? 'select-error' : ''"
              v-model="loanCust.cust_type"
            >
              <option disabled selected value="">ເລືອກປະເພດລູກຄ້າ</option>
              <option v-for="ci in CutType.data" :key="ci" :value="ci.id">
                {{ ci.name }}
              </option>
            </VField>
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
                >ປະເພດສິນເຊື່ອ <span class="text-[red]">*</span></label
              >
              <VField
                as="select"
                name="loan_type"
                class="select select-bordered w-full select-sm"
                :class="errors.loan_type ? 'select-error' : ''"
                v-model="loanCust.loan_type"
              >
                <option value="" disabled selected>ເລືອກປະເພດສິນເຊື່ອ</option>
                <option v-for="ci in getLoan" :key="ci" :value="ci.id">
                  {{ ci.name }}
                </option>
              </VField>
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
              <TinputCcy
                v-model="loanCust.finance"
                id="financeAm"
                name="financeAm"
                class="
                  input input-sm input-bordered
                  w-full
                  text-right
                  pr-[85px]
                "
                :class="errors.finance ? 'input-error' : ''"
                :options="currencyOptions"
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
                <option value="USD">USD</option>
                <option value="THB">THB</option>
                <option value="CNY">CNY</option>
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
              <input
                type="text"
                id="interest"
                name="interest"
                v-model="loanCust.intrate"
                disabled
                class="input input-sm input-bordered w-full"
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
            >ເປົ້າໝາຍສະເໜີກູ້ <span class="text-[red]">*</span></label
          >
          <VField
            as="textarea"
            id="perpose"
            name="perpose"
            v-model="loanCust.perpose"
            class="input input-sm input-bordered w-full h-20"
            :class="errors.perpose ? 'input-error' : ''"
          ></VField>
        </div>
        <div class="flex justify-between">
          <div></div>
          <button type="submit" class="btn mt-8 btn-primary btn-sm">
            ບັນທຶກ
          </button>
        </div>
      </form>
    </VForm>
  </div>
</template>
