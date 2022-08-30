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
  province: ref(1),
});
const emits = defineEmits(["update:refresh"]);
const headfrom = ref("ເພີ່ມຫຼັກຊັບທີ່ດິນພ້ອມສິ່ງປຸກສ້າງ");
const fromType = ref("create");
const refkeydel = ref("");
const stapSo = ref(1);
const vProvince = ref(1);
const vDistrict = ref("");
const malcheck = ref(false);
const solidSchema = yup.object({
  owner: yup.string().required(),
  doc_no: yup.string().required(),
  size: yup.string().required(),
  issue_date: yup.string().required(),
  village: yup.string().required(),
  district: yup.string().required(),
  cate: yup.string().required(),
  price_officer: yup.number().required(),
  price_market: yup.number().required(),
  price_org: yup.number().required(),
  price_total: yup.string().required(),
});
const rcol = reactive({
  owner: ref(""),
  doc_no: ref(""),
  size: ref(0),
  issue_date: ref(""),
  road_ad: ref(""),
  cate: ref(0),
  price_officer: ref(0),
  village: ref(""),
  district: ref(0),
  price_market: ref(0),
  price_org: ref(0),
  price_total: ref(0),
  ccy: ref("LAK"),
  typebuild: ref(""),
  sizebuild: ref(""),
  bsize_wide: ref(0),
  bsize_width: ref(0),
  areabuild: ref(""),
  age_build: ref(0),
  build_floor: ref(0),
  bprice_officer: ref(0),
  bprice_market: ref(0),
  bprice_org: ref(0),
  bprice_total: ref(0),
});
watchEffect;
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
const createColSolid = async () => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(`${BaseApi}colleteral/solid/${props.cust_no}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.parse(JSON.stringify(rcol)),
    }).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        malcheck.value = false;
        emits("update:refresh");
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
setTimeout(() => {
  getDistrict(vProvince.value);
}, 10);
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
const ColView = (ob) => {
  router.push(`/collator/${props.cust_no}/cate-${props.cust_no}/${ob.id}`);
};

watchEffect(() => {
  if (rcol.price_officer || rcol.price_market || rcol.price_org) {
    rcol.price_total = computed(() => {
      return (
        ((Number(rcol.price_officer) +
          Number(rcol.price_market) +
          Number(rcol.price_org)) /
          3) *
        Number(rcol.size)
      );
    });
  }
  if (rcol.bprice_officer || rcol.bprice_market || rcol.bprice_org) {
    rcol.bprice_total = computed(() => {
      return (
        ((Number(rcol.bprice_officer) +
          Number(rcol.bprice_market) +
          Number(rcol.bprice_org)) /
          3) *
        Number(rcol.areabuild)
      );
    });
  }
  if (rcol.bsize_width || rcol.bsize_wide) {
    rcol.areabuild = computed(() => {
      return Number(rcol.bsize_width) * Number(rcol.bsize_wide) * 2;
    });
    rcol.sizebuild = `${rcol.bsize_width} x ${rcol.bsize_wide}`;
  }
});
</script>
<template>
  <div class="px-2">
    <div class="flex justify-between mb-2">
      <div></div>
      <div class="flex gap-2">
        <button
          @click="
            malcheck = true;
            headfrom = 'ເພີ່ມຫຼັກຊັບທີ່ດິນພ້ອມສິ່ງປຸກສ້າງ';
            fromType = 'create';
          "
          class="btn btn-sm modal-button"
        >
          +
        </button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="table table-compact w-full">
        <thead>
          <tr>
            <th>Seq</th>
            <th>ປະເພດ</th>
            <th>ໃບຕາດິນເລກທີ</th>
            <th>ເນື້ອທີ່</th>
            <th>ຂະໜາດ</th>
            <th>ສະກຸນເງິນ</th>
            <th>ລາຄາ ວິຊາການປະເມິນ (m<sup>2</sup>)</th>
            <th>ລາຄາ ທ້ອງຕະຫຼາດປະເມິນ (m<sup>2</sup>)</th>
            <th>ລາຄາອົງການຄຸ້ມຄອງ ທີ່ດິນປະເມິນ</th>
            <th>ມູນຄ່າສະເລ່ຍທັງໝົດ</th>
            <th class="w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ot in itdata.filter((t) => t.group_type == 1)"
            :key="ot"
            @dblclick="ColView(ot)"
            class="group hover"
          >
            <td>{{ ot.seq }}</td>
            <td>
              {{
                ot.building_key != null && ot.id != ot.building_key
                  ? "ທີ່ດິນພ້ອມສິ່ງປຸກສ້າງ"
                  : "ທີ່ດິນ"
              }}
            </td>
            <td>{{ ot.doc_no }}</td>
            <td>{{ ot.size }}</td>
            <td>{{ ot.area }}</td>
            <td>{{ ot.ccy }}</td>
            <td class="text-right">
              {{ Number(ot.price_officer).toLocaleString("en-UK") }}
            </td>
            <td class="text-right">
              {{ Number(ot.price_market).toLocaleString("en-UK") }}
            </td>
            <td class="text-right">
              {{ Number(ot.price_org).toLocaleString("en-UK") }}
            </td>
            <td class="text-right">
              {{ Number(ot.price_total).toLocaleString("en-UK") }}
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
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <input
        type="checkbox"
        id="my-modal-3"
        class="modal-toggle"
        :checked="malcheck"
      />
      <div class="modal">
        <div
          class="modal-box overflow-hidden max-h-[90vh] pt-0 px-0 pb-5 relative"
        >
          <div class="sticky top-0 bg-base-100 z-9 px-5 pt-3">
            <button
              class="btn btn-xs btn-circle btn-error absolute right-2 top-2"
              @click="malcheck = false"
            >
              ✕
            </button>
            <h3 class="font-bold text-md mb-3">
              {{ headfrom }}
            </h3>
          </div>
          <div class="w-full max-h-[80vh] overflow-y-auto pb-5">
            <VForm
              v-slot="{ handleSubmit, errors }"
              :validation-schema="solidSchema"
              as="div"
              class="px-5"
            >
              <form
                @submit="handleSubmit($event, createColSolid)"
                name="createMachine"
              >
                <div class="tabs tabs-boxed sticky top-0">
                  <a
                    :class="stapSo == 1 ? 'tab tab-active' : 'tab'"
                    @click="stapSo = 1"
                    >ທີ່ດິນ</a
                  >
                  <a
                    :class="stapSo == 2 ? 'tab tab-active' : 'tab'"
                    @click="stapSo = 2"
                  >
                    ສິ່ງປຸກສ້າງ
                  </a>
                </div>
                <div class="mt-1">
                  <label
                    for="first_name"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຊື່ເຈົ້າຂອງຫຼັກຊັບ <span class="text-[red]">*</span></label
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
                    for="first_name"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ສະກຸນເງິນ</label
                  >
                  <select
                    v-model="rcol.ccy"
                    class="select select-sm select-bordered w-full"
                  >
                    <option value="LAK">LAK</option>
                    <option value="USD">USD</option>
                    <option value="THB">THB</option>
                  </select>
                </div>
                <div :class="stapSo == 1 ? `block` : 'hidden'">
                  <div class="mt-1">
                    <label
                      for="colDocno"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ໃບຕາດິນເລກທີ <span class="text-[red]">*</span></label
                    >

                    <VField
                      type="text"
                      name="doc_no"
                      id="colDocno"
                      v-model="rcol.doc_no"
                      class="input input-sm input-bordered w-full"
                      :class="errors.doc_no ? 'input-error' : ''"
                    />
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="Colmodel_no"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ເນຶ້ອທີ່ <span class="text-[red]">*</span></label
                      >

                      <VField
                        type="text"
                        name="size"
                        id="Colsize"
                        v-model="rcol.size"
                        class="input input-sm input-bordered w-full"
                        :class="errors.size ? 'input-error' : ''"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="colVerify"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ໃບຕາດິນ ລົງວັນທີ່
                        <span class="text-[red]">*</span></label
                      >
                      <VField
                        type="date"
                        name="issue_date"
                        id="colmyear"
                        v-model="rcol.issue_date"
                        class="input input-sm input-bordered w-full"
                        :class="errors.issue_date ? 'input-error' : ''"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="Colbuyyear"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ແຂວງ</label
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
                        for="ColUnit"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ເມືອງ <span class="text-[red]">*</span></label
                      >
                      <select
                        class="select select-sm select-bordered w-full"
                        v-model="rcol.district"
                        placeholder="ເລືອກເມືອງ"
                      >
                        <option value="0" selected disabled>ເລືອກເມືອງ</option>
                        <option
                          :value="iv.id"
                          v-for="iv in vDistrict"
                          :key="iv"
                        >
                          {{ iv.dt_name }}
                        </option>
                      </select>
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="Colbuyyear"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
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
                    <div class="w-full">
                      <label
                        for="ColRoad"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ຖະໜົນ/ຮ່ອມ</label
                      >

                      <VField
                        type="text"
                        name="road_ad"
                        id="ColRoad"
                        v-model="rcol.road_ad"
                        class="input input-sm input-bordered w-full"
                        :class="errors.road_ad ? 'input-error' : ''"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="ColPrice"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາປະເມິນຕໍ່ m<sup>2</sup>
                        <span class="text-[red]">*</span></label
                      >
                      <TinputCcy
                        name="price_officer"
                        id="ColPrice"
                        v-model="rcol.price_officer"
                        :placeholder="
                          Number(rcol.price_officer).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.price_officer ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="Colmarket"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາທ້ອງຕະຫຼາດປະເມິນ ຕໍ່ m<sup>2</sup>
                        <span class="text-[red]">*</span></label
                      >
                      <TinputCcy
                        name="price_market"
                        id="Colmarket"
                        v-model="rcol.price_market"
                        :placeholder="
                          Number(rcol.price_market).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.price_market ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="ColPrice"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາອົງການຄຸ້ມຄອງ ທີ່ດິນປະເມິນຕໍ່ m<sup>2</sup>
                        <span class="text-[red]">*</span></label
                      >
                      <TinputCcy
                        name="price_org"
                        id="ColPrice"
                        v-model="rcol.price_org"
                        :placeholder="
                          Number(rcol.price_org).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.price_org ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="ColTotal"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ມູນຄ່າລວມປະເມີນທັງໝົດ (ທີ່ດິນ)</label
                      >
                      <input
                        type="text"
                        id="ColTotal"
                        class="
                          input input-sm input-bordered
                          w-full
                          text-right
                          disabled
                          w-full
                        "
                        :value="
                          Number(rcol.price_total).toLocaleString('en-US')
                        "
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div :class="stapSo != 1 ? `block` : 'hidden'">
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="ColPrice"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ປະເພດສິ່ງປຸກສ້າງ</label
                      >

                      <VField
                        type="text"
                        name="typebuild"
                        id="ColPrice"
                        v-model="rcol.typebuild"
                        class="input input-sm input-bordered w-full"
                        :class="errors.typebuild ? 'input-error' : ''"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="sizebuild"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ຂະໜາດ <span class="text-[red]">*</span></label
                      >
                      <div class="w-full input input-sm input-bordered p-0">
                        <VField
                          type="text"
                          name="bsize_width"
                          id="bsize_width"
                          v-model="rcol.bsize_width"
                          class="w-[45%] input input-xs text-center"
                          placeholder="ລວງກ້ວາງ"
                          :class="errors.bsize_width ? 'input-error' : ''"
                        />
                        <span>X</span>
                        <VField
                          type="text"
                          name="bsize_wide"
                          id="bsize_wide"
                          v-model="rcol.bsize_wide"
                          class="w-[45%] input input-xs text-center"
                          placeholder="ລວງຍາວ"
                          :class="errors.bsize_wide ? 'input-error' : ''"
                        />
                      </div>
                    </div>
                    <div class="w-full">
                      <label
                        for="areabuild"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ເນຶ້ອທີ່</label
                      >

                      <input
                        type="text"
                        id="areabuild"
                        v-model="rcol.areabuild"
                        class="input input-sm input-bordered w-full text-center"
                        disabled
                        :class="errors.areabuild ? 'input-error' : ''"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="ColPrice"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ຈຳນວນຊັ້ນ</label
                      >
                      <input
                        name="build_floor"
                        id="build_floor"
                        v-model="rcol.build_floor"
                        class="input input-sm input-bordered w-full text-right"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="Colmarket"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ອາຍຸສິ່ງປຸກສ້າງ</label
                      >
                      <input
                        name="age_build"
                        id="age_build"
                        v-model="rcol.age_build"
                        class="input input-sm input-bordered w-full text-right"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="ColPrice"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາ ວິຊາການປະເມິນ (m<sup>2</sup>)</label
                      >
                      <TinputCcy
                        name="bprice_office"
                        id="ColPrice"
                        v-model="rcol.bprice_officer"
                        :placeholder="
                          Number(rcol.bprice_officer).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.bprice_officer ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="Colmarket"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາ ທ້ອງຕະຫຼາດປະເມິນ (m<sup>2</sup>)</label
                      >
                      <TinputCcy
                        name="bprice_market"
                        id="Colmarket"
                        v-model="rcol.bprice_market"
                        :placeholder="
                          Number(rcol.bprice_market).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.bprice_market ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                  </div>
                  <div class="flex gap-2 w-full mt-1">
                    <div class="w-full">
                      <label
                        for="Colmarket"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ລາຄາອົງການຄຸ້ມຄອງ ປະເມິນຕໍ່ m<sup>2</sup></label
                      >
                      <TinputCcy
                        name="bprice_market"
                        id="Colmarket"
                        v-model="rcol.bprice_org"
                        :placeholder="
                          Number(rcol.bprice_org).toLocaleString('en-US')
                        "
                        class="input input-sm input-bordered w-full text-right"
                        :class="errors.bprice_org ? 'input-error' : ''"
                        :options="currencyOptions"
                      />
                    </div>
                    <div class="w-full">
                      <label
                        for="ColTotal"
                        class="
                          block
                          mb-2
                          text-sm
                          font-medium
                          dark:text-gray-300
                        "
                        >ມູນຄ່າລວມປະເມີນສິ່ງປຸກສ້າງ</label
                      >
                      <input
                        type="text"
                        class="input input-sm input-bordered w-full text-right"
                        :value="
                          Number(rcol.bprice_total).toLocaleString('en-US')
                        "
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div class="w-full mt-2">
                  <label
                    for="ColTotal"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ລວມມູນຄ່າປະເມີນທັງໝົດທີ່ດີນບວກ + ສິ່ງປຸກສ້າງ</label
                  >
                  <input
                    type="text"
                    class="input input-sm input-bordered w-full text-right"
                    disabled
                    :value="
                      Number(
                        Number(rcol.bprice_total) + Number(rcol.price_total)
                      ).toLocaleString('en-US')
                    "
                  />
                </div>
                <div class="w-full mt-2">
                  <label
                    for="ColTotal"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຄຳອະທິບາຍ</label
                  >
                  <textarea
                    v-model="rcol.remark"
                    class="
                      textarea textarea-sm
                      input-bordered
                      w-full
                      text-right
                    "
                  >
                  </textarea>
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
  </div>
</template>