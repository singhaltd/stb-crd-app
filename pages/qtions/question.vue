<script setup>
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const token = useCookie("autKey");
const route = useRoute();
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const { $mloading } = useNuxtApp();
const itemAnswer = useState();
useHead({
  title: "Params ຄຳຖາມ",
});
// import { useAnserStore } from '@/store/qanswer'
// const main = useAnserStore();
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
// const getQuestion = ref(custQuestion);
definePageMeta({
  middleware: ["auth"],
});
let perpage = ref(10);
const qcustomer = ref("");
let isActive = ref(false);
let isActive2 = ref(false);

const itAnswer = reactive({
  title: ref(""),
  grade: ref("A"),
  weight: ref(0),
});
const paramQeustion = reactive({
  title: ref(""),
  approach: ref("COND"),
  description: ref(""),
  input: ref("radio"),
  answer: ref([]),
});
const {
  data: getQuestion,
  pending,
  refresh,
  error,
} = await useFetch(
  () =>
    `${BaseApi}questions?cur_page=${
      route.query.page ? route.query.page : 1
    }&per_page=${perpage.value}`,
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);
const {
  data: getApproach,
  pending: penApproach,
  refresh: refApproach,
  error: errApproach,
} = await useFetch(() => `${BaseApi}crd/approach`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});

watchEffect(() => {
  if (perpage.value) {
    refresh();
  }
});
const isRequired = (value) => {
  if (value && value.trim()) {
    return true;
  }
  return "ກາລຸນາປ້ອນຂໍ້ມູນ";
};
const addAnswer = () => {
  paramQeustion.answer.push({
    title: itAnswer.title,
    grade: itAnswer.grade,
    weight: itAnswer.weight,
  });
  itAnswer.title = "";
  itAnswer.weight = 0;
  isActive2.value = false;
};

const schema = yup.object({
  qname: yup.string().required(),
});
const schemaAnswer = yup.object({
  atitle: yup.string().required(),
  aweight: yup.number().required().min(0.01),
});
function saveQuestion() {
  const result = $fetch(`${BaseApi}questions`, {
    method: "POST",
    body: paramQeustion,
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });

  if (result) {
    paramQeustion.title = ref("");
    paramQeustion.approach = ref("COND");
    paramQeustion.description = ref("");
    paramQeustion.input = ref("radio");
    paramQeustion.answer = ref([]);
    isActive.value = false;
  }
}

const viewQuestion = (str) => {
  $mloading;
  console.log(str);
};
</script>
<template>
  <div class="mt-4 w-full px-5 overflow-x-auto">
    <TablePanel
      :numpage="getQuestion.meta.last_page"
      :v-model="perpage"
      title="ລູກຄ້າ"
    >
    <template #action>
        <button
          @click="isActive = isActive = true"
          class="btn btn-square btn-primary btn-sm ml-2"
          >+</button
        >
      </template>
      <template #body>
        <div class="overflow-x-auto mt-5">
          <table class="table table-compact w-full">
            <thead>
              <tr>
                <th>ຫົວຂໍ້</th>
                <th>ຄຳອະທິບາຍ</th>
                <th>ໝວດໝູ່</th>
                <th>ປະເພດການຄຳຕອບ</th>
                <th>ລວມຄະແນນ</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ci in getQuestion.data"
                :key="ci"
                @contextmenu.native="viewQuestion('test')"
                class="hover"
              >
                <td>{{ ci.title }}</td>
                <td>{{ ci.description }}</td>
                <td>{{ ci.aprch.title }}</td>
                <td>{{ ci.input }}</td>
                <td>
                  <a @click="viewQuestion(ci.id)"
                    ><svg
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
                      /></svg
                  ></a>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>ຫົວຂໍ້</th>
                <th>ຄຳອະທິບາຍ</th>
                <th>ໝວດໝູ່</th>
                <th>ປະເພດການຄຳຕອບ</th>
                <th>ລວມຄະແນນ</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </TablePanel>

    <input
      type="checkbox"
      id="my-modal-5"
      class="modal-toggle"
      :checked="isActive"
    />
    <div class="modal">
      <div class="modal-box w-11/12 max-w-5xl p-0">
        <div class="glass h-[35px] sticky top-0">
          <h3 class="font-bold text-md py-1 pl-4">ເພີ່ມຄຳຖາມ</h3>
          <label
            @click="isActive = false"
            class="
              btn btn-sm
              h-full
              pr-4
              rounded-none
              btn-error
              absolute
              right-0
              top-0
            "
            >✕</label
          >
        </div>
        <div class="px-5 py-4">
          <VeeForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="schema"
            as="div"
          >
            <form @submit="handleSubmit($event, saveQuestion)">
              <div class="w-full">
                <label
                  for="qname"
                  class="mb-1 block text-base font-medium text-[#07074D]"
                >
                  ຫົວຂໍ້
                </label>
                <VField
                  name="qname"
                  v-model="paramQeustion.title"
                  type="text"
                  id="qname"
                  class="input input-bordered input-sm w-full"
                  :class="errors.qname ? 'input-error' : ''"
                />
                <label class="label" v-if="errors.qname">
                  <span class="label-text-alt text-[red]">{{
                    errors.qname
                  }}</span>
                </label>
              </div>
              <div class="flex flex-cols-2 gap-5 mt-1">
                <div class="mb-5 w-full">
                  <label
                    for="qname"
                    class="mb-1 block text-base font-medium text-[#07074D]"
                  >
                    ໝວດໝູ່
                  </label>
                  <select
                    class="select select-bordered select-sm w-full"
                    v-model="paramQeustion.approach"
                  >
                    <option
                      v-for="api in getApproach.data"
                      :key="api"
                      :value="api.id"
                    >
                      {{ api.title }}
                    </option>
                  </select>
                </div>
                <div class="mb-5 w-full">
                  <label
                    for="qatype"
                    class="mb-1 block text-base font-medium text-[#07074D]"
                  >
                    ປະເພດການຄຳຕອບ
                  </label>
                  <select
                    class="select select-bordered select-sm w-full"
                    id="qatype"
                    v-model="paramQeustion.input"
                  >
                    <option value="radio" selected>ຄຳຕອບດຽວ</option>
                  </select>
                </div>
              </div>

              <div class="mb-5">
                <label
                  for="qname"
                  class="mb-1 block text-base font-medium text-[#07074D]"
                >
                  ຄຳອະທິບາຍ
                </label>
                <textarea
                  class="textarea textarea-bordered w-full"
                  v-model="paramQeustion.description"
                ></textarea>
              </div>

              <div class="flex justify-between">
                <h3>ຄຳຕອບ</h3>
                <button
                  class="rounded-lg btn-sm btn btn-primary px-3 mb-1"
                  @click="isActive2 = true"
                >
                  +
                </button>
              </div>
              <div>
                <div class="overflow-x-auto">
                  <table class="table table-compact w-full">
                    <thead>
                      <tr>
                        <th>ຫົວຂໍ້</th>
                        <th>ເກຣດ</th>
                        <th>ຄະແນນ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="ai in paramQeustion.answer" :key="ai">
                        <th>{{ ai.title }}</th>
                        <td>{{ ai.grade }}</td>
                        <td>{{ ai.weight }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="modal-action">
                <button type="submit" class="btn btn-sm">ບັນທຶກ</button>
              </div>
            </form>
          </VeeForm>
        </div>
      </div>
    </div>
    <input
      type="checkbox"
      id="my-modal-3"
      class="modal-toggle"
      :checked="isActive2"
    />
    <div class="modal">
      <div class="modal-box relative">
        <label
          @click="isActive2 = false"
          class="btn btn-sm btn-circle absolute right-2 top-2"
          >✕</label
        >
        <VeeForm
          v-slot="{ handleSubmit, errors }"
          :validation-schema="schemaAnswer"
          as="div"
        >
          <form @submit="handleSubmit($event, addAnswer)">
            <h3 class="text-lg font-bold">ເພີ່ມຄຳຕອບ</h3>
            <div class="mt-4">
              <div class="flex flex-cols-2">
                <div class="mb-5 w-full">
                  <label
                    for="titleAnw"
                    class="mb-1 block text-base font-medium text-[#07074D]"
                  >
                    ຫົວຂໍ້
                  </label>
                  <VField
                    name="atitle"
                    v-model="itAnswer.title"
                    type="text"
                    id="titleAnw"
                    class="input input-bordered input-sm w-full"
                    :class="errors.atitle ? 'input-error' : ''"
                  />
                  <label class="label" v-if="errors.atitle">
                    <label class="label-text-alt text-[red]">{{
                      errors.atitle
                    }}</label>
                  </label>
                </div>
              </div>
              <div class="flex flex-cols-2 gap-5">
                <div class="mb-5 w-full">
                  <label
                    for="gradeAnw"
                    class="mb-1 block text-base font-medium text-[#07074D]"
                  >
                    ເກຣດ
                  </label>
                  <select
                    class="select select-bordered select-sm w-full max-w-xs"
                    id="gradeAnw"
                    v-model="itAnswer.grade"
                  >
                    <option v-for="x in alphabet" :key="x" :value="x">
                      {{ x }}
                    </option>
                  </select>
                </div>
                <div class="mb-5 w-full">
                  <label
                    for="aweight"
                    class="mb-1 block text-base font-medium text-[#07074D]"
                  >
                    ຄະແນນ
                  </label>
                  <VField
                    name="aweight"
                    v-model="itAnswer.weight"
                    type="text"
                    id="aweight"
                    class="input input-bordered input-sm w-full"
                    :class="errors.aweight ? 'input-error' : ''"
                  />
                  <label class="label" v-if="errors.aweight">
                    <label class="label-text-alt text-[red]">{{
                      errors.aweight
                    }}</label>
                  </label>
                </div>
              </div>
            </div>
            <div class="modal-action">
              <button type="submit" class="btn btn-sm">ບັນທຶກ</button>
            </div>
          </form>
        </VeeForm>
      </div>
    </div>
  </div>
</template>