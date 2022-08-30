<script setup>
const props = defineProps({
  malcheck: Boolean,
});
import { ref, reactive } from "vue";
import { Form as VeeForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const token = useCookie("autKey");
const router = useRouter();
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
  typebuild: ref(""),
  sizebuild: ref(""),
  areabuild: ref(""),
  yearbuild: ref(0),
  bprice_officer: ref(0),
  bprice_market: ref(0),
  bprice_org: ref(0),
});
watch(vProvince, () => {
  getDistrict(vProvince.value);
});
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
        emits('update:refresh')
      } else {
        toast.value = { state: true, type: "error", data: res.data };
      }
    })
  );
};
const getDistrict = async (str) => {
  const district = await $fetch(`${BaseApi}city/district/${str}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  });
  vDistrict.value = district.data;
};
</script>

<template>
  <div>
    <input
      type="checkbox"
      id="my-modal-3"
      class="modal-toggle"
      :checked="props.malcheck"
    />
    <div class="modal">
      <div class="modal-box relative overflow-y-auto">
        <div class="asbolute">
          <button
            class="btn btn-xs btn-circle absolute right-2 top-2"
            @click="props.malcheck = false"
          >
            ✕
          </button>
          <h3 class="text-lg font-bold">ເພີ່ມຫຼັກຊັບທີ່ດິນພ້ອມສິ່ງປຸກສ້າງ</h3>
        </div>
        <div>
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
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
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
                      >ມູນຄ່າ ວິຊາການປະເມິນ
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
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ມູນຄ່າລວມປະເມີນ ທີ່ດິນ</label
                    >
                    <div
                      id="ColTotal"
                      class="
                        input input-sm input-bordered
                        w-full
                        text-right
                        w-full
                      "
                    >
                      {{ Number(rcol.price_total).toLocaleString("en-US") }}
                    </div>
                  </div>
                </div>
              </div>
              <div :class="stapSo != 1 ? `block` : 'hidden'">
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
                      >ຂະໜາດ</label
                    >

                    <VField
                      type="text"
                      name="sizebuild"
                      id="sizebuild"
                      v-model="rcol.sizebuild"
                      class="input input-sm input-bordered w-full"
                      :class="errors.sizebuild ? 'input-error' : ''"
                    />
                  </div>
                  <div class="w-full">
                    <label
                      for="areabuild"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ເນຶ້ອທີ່</label
                    >

                    <VField
                      type="text"
                      name="areabuild"
                      id="areabuild"
                      v-model="rcol.areabuild"
                      class="input input-sm input-bordered w-full"
                      :class="errors.areabuild ? 'input-error' : ''"
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
                      for="ColTotal"
                      class="block mb-2 text-sm font-medium dark:text-gray-300"
                      >ມູນຄ່າລວມປະເມີນ ທີ່ດິນ</label
                    >
                    <div
                      class="input input-sm input-bordered w-full text-right"
                    >
                      {{ rcol.bprice_org }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex justify-between mt-4">
                <div></div>
                <button
                  type="submit"
                  class="btn btn-primary btn-sm"
                  @click="createColSolid"
                >
                  ບັນທຶກ
                </button>
              </div>
            </form>
          </VeeForm>
        </div>
      </div>
    </div>
  </div>
</template>