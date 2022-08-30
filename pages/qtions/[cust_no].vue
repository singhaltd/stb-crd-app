<script setup>
const token = useCookie("autKey");
const route = useRoute();
const router = useRouter();
const toast = useSnakeToast();
const test = ref([]);
const choise = ref([]);
// const getQuestion = ref(custQuestion);
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
useHead({
  title: "ຕອບແບບສອບຖາມ",
});
definePageMeta({
  middleware: ["auth"],
});
const qcustomer = ref("");
const [
  { refresh: refCust, data: Customer },
  { refresh: refQuest, data: CustQuestion },
] = await Promise.all([
  useFetch(`${BaseApi}customer/${route.params.cust_no}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}crd/questions/${route.params.cust_no}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
const handleSubmit = () => {
  let questions = [];
  for (let i = 0; i < CustQuestion.value.data.length; i++) {
    for (let x = 0; x < CustQuestion.value.data[i]["qeustions"].length; x++) {
      CustQuestion.value.data[i]["qeustions"][x].choise
        ? questions.push(CustQuestion.value.data[i]["qeustions"][x])
        : "";
    }
  }
  $fetch(`${BaseApi}crd/questions`, {
    method: "POST",
    body: { qt: questions, cust_no: route.params.cust_no },
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }).then((res) => {
    if (res.error == false) {
      toast.value = { state: true, type: "success" };
      router.push("/qtions");
    }
  });
};
onMounted(() => {
  refCust();
  refQuest();
});
</script>
<template>
  <div class="w-full px-5">
    <div
      class="
        flex
        justify-between
        sticky
        top-0
        pl-3
        py-2
        animated
        backdrop-blur
        supports-backdrop-blur:shadow supports-backdrop-blur:bg-white/60
      "
    >
      <div>ຕອບແບບສອບຖາມ</div>
      <button
        type="button"
        class="btn btn-primary btn-sm"
        @click="handleSubmit"
      >
        ບັນທຶກ
      </button>
    </div>
    <div class="flex flex-wrap -mx-3 mb-6 mt-2">
      <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label
          class="
            block
            uppercase
            tracking-wide
            text-gray-700 text-xs
            font-bold
            mb-2
          "
          for="grid-first-name"
        >
          ລະຫັດລູກຄ້າ
        </label>
        <input
          class="
            appearance-none
            block
            w-full
            bg-gray-200
            text-gray-700
            border
            rounded
            py-2
            px-4
            mb-3
            leading-tight
            focus:outline-none focus:bg-white
          "
          id="grid-first-name"
          type="text"
          placeholder="Jane"
          :value="Customer.data.cust_no"
          disabled
        />
      </div>
      <div class="w-full md:w-1/2 px-3">
        <label
          class="
            block
            uppercase
            tracking-wide
            text-gray-700 text-xs
            font-bold
            mb-2
          "
          for="grid-last-name"
        >
          ຊື່ ແລະ ນາມສະກຸນ
        </label>
        <input
          class="
            appearance-none
            block
            w-full
            bg-gray-200
            text-gray-700
            border border-gray-200
            rounded
            py-2
            px-4
            leading-tight
            focus:outline-none focus:bg-white focus:border-gray-500
          "
          disabled
          id="grid-last-name"
          type="text"
          :value="Customer.data.fullname"
        />
      </div>
    </div>
    <!-- {{CustQuestion}} -->
    <div
      class="border border-base-300 bg-base-100 rounded-box mt-3"
      v-for="it in CustQuestion?.data"
      :key="it"
    >
      <div class="collapse-title text-md font-medium">
        {{ it.title }}
      </div>
      <div class="px-4">
        <ol type="number">
          <li v-for="(iq, i) in it.qeustions" :key="iq">
            <h1 class="py-3">
              {{ i + 1 }}. {{ iq.title }}
              <client-only>
                <div v-if="iq.choise?.answ_id" class="hidden">
                  {{
                    iq.choise?.answ_id ? (iq.choise = iq.choise?.answ_id) : null
                  }}
                </div>
              </client-only>
            </h1>

            <template v-if="iq.input_type == 'radio'">
              <div class="form-control" v-for="asi in iq.answers" :key="asi">
                <label class="cursor-pointer my-1">
                  <input
                    type="radio"
                    v-model="iq.choise"
                    :value="asi.id"
                    class="radio checked:bg-red-500 radio-sm"
                    :disabled="iq.id == 31 ? true : false"
                  />
                  <span class="label-text pl-3 absolute">{{ asi.title }}</span>
                </label>
              </div>
            </template>
            <template v-if="iq.input_type == 'checkbox'">
              <!-- <div class="form-control" v-for="asi in iq.answers" :key="asi">
                <input
                  type="checkbox"
                  checked="checked"
                  class="checkbox checkbox-sm"
                />
              </div> -->
              <div class="form-control" v-for="asi in iq.answers" :key="asi">
                <label class="cursor-pointer my-1">
                  <input
                    type="checkbox"
                    name="choise"
                    v-model="iq.choise"
                    :value="asi.id"
                    class="checkbox checkbox-sm checked:bg-red-500"
                  />
                  <span class="label-text pl-3 absolute">{{ asi.title }}</span>
                </label>
              </div>
            </template>
          </li>
        </ol>
      </div>
    </div>
    <div class="flex justify-between py-3">
      <div></div>
      <button
        type="button"
        class="btn btn-sm btn-primary"
        @click="handleSubmit"
      >
        ບັນທຶກ
      </button>
    </div>
  </div>
</template>