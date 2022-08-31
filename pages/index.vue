<script setup>
const token = useCookie("autKey");
const route = useRoute();
const router = useRouter();
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
try {
} catch (e) {}
useHead({
  title: "Dashboard",
});
definePageMeta({
  middleware: ["auth"],
});
const qcustomer = ref("");
const [
  { refresh: rfworkflow, pending: dpworkflow, data: workflow },
  { refresh: rfexreate, pending: dpexreate, data: exreate },
] = await Promise.all([
  useFetch(`${BaseApi}workflow`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}currency/exrate?cur_page=1&per_page=20`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
onMounted(() => {
  rfworkflow();
  rfexreate();
});
</script>
<template>
  <div class="mt-2 px-2">
    <div class="stats shadow w-full" v-if="!dpworkflow">
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">ອານຸມັດ</div>
        <div class="stat-value">
          {{ workflow.data.filter((i) => i.grading == "A")[0]?.amt }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">ນຳສະເໜີ</div>
        <div class="stat-value">
          {{ workflow.data.filter((i) => i.grading == "B")[0]?.amt }}
        </div>
      </div>
      <div class="stat">
        <div class="stat-figure text-secondary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-8 h-8 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
            ></path>
          </svg>
        </div>
        <div class="stat-title">ບໍ່ອານຸມັດ</div>
        <div class="stat-value">
          {{ workflow.data.filter((i) => i.grading == "C")[0]?.amt }}
        </div>
      </div>
    </div>
    <section class="mt-5" v-if="!dpexreate">
      <p class="text-md py-3">ອັດຕາແລກປ່ຽນ</p>
      <div class="overflow-x-auto max-w-[400px]">
        <table class="table w-full table-compact">
          <tbody>
            <tr>
              <td>ສະກຸນເງິນ</td>
              <td>ອັດຕາຂາຍ</td>
            </tr>
            <tr
              v-for="ix in exreate?.data?.data.filter(
                (t) => t.ccy_type !== 'LAK'
              )"
              :key="ix"
            >
              <td>
                <div class="flex items-center space-x-3">
                  <div class="avatar">
                    <div class="mask mask-squircle w-12 h-6">
                      <img
                        :src="`/img/${ix.ccy_type}.png`"
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div class="font-bold">{{ ix.ccy_type }}</div>
                    <div class="text-sm opacity-50"></div>
                  </div>
                </div>
              </td>
              <td>
                {{ Number(ix.rate).toLocaleString("en-US") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>