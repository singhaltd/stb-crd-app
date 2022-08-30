
<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import { ref, reactive } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import moment from "moment";
const route = useRoute();
const router = useRouter();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const colleter = useColleter();
const toast = useSnakeToast();
useHead({
  title: "ຫຼັກຊັບລູກຄ້າ",
});
definePageMeta({
  middleware: ["auth"],
});
const vProvince = ref(1);
const vDistrict = ref("");
const [
  { refresh: CustRef, data: Customer },
  { refresh: colRef, data: Colleteral },
  { refresh: provRef, data: Provinces },
] = await Promise.all([
  useFetch(`${BaseApi}customer/${route.params.cust_no}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(
    `${BaseApi}colleteral/solid/${route.params.cust_no}/${route.params.id}`,
    {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  ),
  useFetch(`${BaseApi}city/province`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);
CustRef();
colRef();
provRef();

const solidSchema = yup.object({
  owner: yup.string().required(),
  doc_no: yup.string().required(),
  size: yup.string().required(),
  issue_date: yup.string().required(),
  village: yup.string().required(),
  price_officer: yup.number().required(),
  price_market: yup.number().required(),
  price_org: yup.number().required(),
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
const createColSolid = async () => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(`${BaseApi}colleteral/solid/${route.params.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: JSON.parse(JSON.stringify(rcol)),
    }).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        malcheck.value = false;
        router.go();
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
const DeleteColleteral = async () => {
  let val = route.params.id;
  const { data: ColDel } = await useAsyncData("ColDel", () =>
    $fetch(`${BaseApi}colleteral/solid/${val}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }).then((res) => {
      if (res.status == 200) {
        toast.value = { state: true, type: "success" };
        router.push(`/collator/${route.params.cust_no}`);
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
const handlePrint = (str) => {
  window.open(
    `/print/col/${str}`,
    "",
    "location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes"
  );
};
watch(vProvince, () => {
  getDistrict(vProvince.value);
});
const Building = ref(null);
const Solid = ref(null);
watch(Colleteral, () => {
  Solid.value = Colleteral.value?.data.filter((t) => t.group_type == 1)[0];
  Building.value = Colleteral.value?.data.filter((t) => t.group_type != 1)[0];
  rcol.owner = Solid.value?.owner;
  rcol.doc_no = Solid.value?.doc_no;
  rcol.size = Solid.value?.size;
  rcol.issue_date = moment(new Date(Solid.value?.issue_date)).format(
    "YYYY-MM-DD"
  );
  rcol.road_ad = Solid.value?.road_ad;
  rcol.village = Solid.value?.village;
  rcol.district = Solid.value?.district;
  rcol.price_officer = Solid.value?.price_officer;
  rcol.price_market = Solid.value?.price_market;
  rcol.price_org = Solid.value?.price_org;
  rcol.price_total = Solid.value?.price_total;
  rcol.ccy = Solid.value?.ccy;
  rcol.remark = Solid.value?.remark;
  if (Building) {
    console.log(Building.value?.price_officer);
    rcol.build_floor = Building.value?.build_floor;
    rcol.age_build = Building.value?.age_build;
    rcol.typebuild = Building.value?.build_desc;
    rcol.sizebuild = Building.value?.size;
    rcol.bsize_wide = Building.value?.build_size_wide;
    rcol.bsize_width = Building.value?.build_size_width;
    rcol.areabuild = Building.value?.area;
    rcol.bprice_officer = Building.value?.price_officer;
    rcol.bprice_market = Building.value?.price_market;
    rcol.bprice_org = Building.value?.price_org;
    rcol.bprice_total = Building.value?.price_total;
  } else {
    rcol.bprice_total = 0;
  }

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
  } else {
    rcol.price_total = 0;
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
  } else {
    rcol.bprice_total = 0;
  }
  if (rcol.bsize_width || rcol.bsize_wide) {
    rcol.areabuild = computed(() => {
      return Number(rcol.bsize_width) * Number(rcol.bsize_wide) * 2;
    });
    rcol.sizebuild = `${rcol.bsize_width} x ${rcol.bsize_wide}`;
  }
});
const getDistrict = async (str) => {
  const district = await $fetch(`${BaseApi}city/district/${str}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  vDistrict.value = district.data;
};
setTimeout(() => {
  getDistrict(vProvince.value);
}, 10);
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
</script>
<template>
  <div class="w-full mt-5 px-5">
    <div class="w-[600px]">
      <div class="flex justify-between">
        <div><p class="py-3">ຂໍ້ມູນ ທີ່ດິນ ແລະ ສິ່ງປຸກສ້າງ</p></div>
        <div>
          <label class="btn btn-sm btn-gost" for="MdalCondel">
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
      </div>
      <VeeForm
        v-slot="{ handleSubmit, errors }"
        :validation-schema="solidSchema"
        as="div"
      >
        <form
          @submit="handleSubmit($event, createColSolid)"
          class="mt-4"
          name="createMachine"
        >
          <p class="py-3 font-bold">+ ຂໍ້ມູນ ທີ່ດິນ</p>
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
          <div>
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ໃບຕາດິນ ລົງວັນທີ່ <span class="text-[red]">*</span></label
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ແຂວງ</label
                >
                <select
                  class="select select-sm select-bordered w-full"
                  v-model="vProvince"
                >
                  <option :value="ip.id" v-for="ip in Provinces.data" :key="ip">
                    {{ ip.pv_name }}
                  </option>
                </select>
              </div>
              <div class="w-full">
                <label
                  for="ColUnit"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ເມືອງ <span class="text-[red]">*</span></label
                >
                <select
                  class="select select-sm select-bordered w-full"
                  v-model="rcol.district"
                  placeholder="ເລືອກເມືອງ"
                >
                  <option value="0" selected disabled>ເລືອກເມືອງ</option>
                  <option :value="iv.id" v-for="iv in vDistrict" :key="iv">
                    {{ iv.dt_name }}
                  </option>
                </select>
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
              <div class="w-full">
                <label
                  for="ColRoad"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າ ວິຊາການປະເມິນ <span class="text-[red]">*</span></label
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າໂຕຈິງຕາມ ທ້ອງຕະຫຼາດປະເມິນ
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າອົງການຄຸ້ມຄອງ ທີ່ດິນປະເມິນ
                  <span class="text-[red]">*</span></label
                >
                <TinputCcy
                  name="price_org"
                  id="ColPrice"
                  v-model="rcol.price_org"
                  :placeholder="Number(rcol.price_org).toLocaleString('en-US')"
                  class="input input-sm input-bordered w-full text-right"
                  :class="errors.price_org ? 'input-error' : ''"
                  :options="currencyOptions"
                />
              </div>
              <div class="w-full">
                <label
                  for="ColTotal"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າລວມປະເມີນ ທີ່ດິນ</label
                >
                <input
                  id="ColTotal"
                  disabled
                  class="input input-sm input-bordered w-full text-right w-full"
                  :value="Number(rcol.price_total).toLocaleString('en-US')"
                />
              </div>
            </div>
          </div>
          <div class="mt-5" :class="Building ? 'block' : 'hidden'">
            <p class="py-3 font-bold">+ ຂໍ້ມູນ ສິ່ງປຸກສ້າງ</p>
            <div class="flex gap-2 w-full mt-1">
              <div class="w-full">
                <label
                  for="ColPrice"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າ ວິຊາການປະເມິນ</label
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າໂຕຈິງຕາມ ທ້ອງຕະຫຼາດປະເມິນ</label
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
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າໂຕຈິງຕາມ ທ້ອງຕະຫຼາດປະເມິນ</label
                >
                <TinputCcy
                  name="bprice_market"
                  id="Colmarket"
                  v-model="rcol.bprice_org"
                  :placeholder="Number(rcol.bprice_org).toLocaleString('en-US')"
                  class="input input-sm input-bordered w-full text-right"
                  :class="errors.bprice_org ? 'input-error' : ''"
                  :options="currencyOptions"
                />
              </div>
              <div class="w-full">
                <label
                  for="ColTotal"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ມູນຄ່າລວມປະເມີນສິ່ງປຸກສ້າງ</label
                >
                <input
                  class="input input-sm input-bordered w-full text-right"
                  disabled
                  :value="Number(rcol.bprice_total).toLocaleString('en-US')"
                />
              </div>
            </div>
          </div>
          <div class="w-full mt-2">
            <label
              for="ColTotal"
              class="block mb-2 text-sm font-medium dark:text-gray-300"
              >ມູນຄ່າລວມປະເມີນທີ່ດີນບວກສິ່ງປຸກສ້າງ</label
            >
            <input
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
              class="textarea textarea-sm input-bordered w-full"
              v-model="rcol.remark"
            >
            </textarea>
          </div>
          <div class="flex justify-between mt-4">
            <div></div>
            <button type="submit" class="btn btn-primary btn-sm">ບັນທຶກ</button>
          </div>
        </form>
      </VeeForm>
    </div>
    <ModalCondel>
      <button class="btn" @click="DeleteColleteral">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>