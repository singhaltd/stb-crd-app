<script setup>
import { ref, reactive } from "vue";
import * as yup from "yup";
import moment from "moment";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
const token = useCookie("autKey");
const router = useRouter();
const props = defineProps({
  cust_no: ref(""),
  itdata: ref(Object),
});
const emits = defineEmits(["update:refresh"]);
const form = ref({ title: "ເພີ່ມຫຼັກຊັບອື່ນໆ", type: "create" });
const modalVal = ref(false);
const refkeydel = ref("");
const otherSchema = yup.object({
  owner: yup.string().required(),
  doc_no: yup.string().required(),
  issue_date: yup.string().required(),
  verify_by: yup.string().required(),
  weight: yup.string().required(),
  unit: yup.string().required(),
  price: yup.number().required(),
});
const rcol = reactive({
  owner: ref(""),
  doc_no: ref(""),
  issue_date: ref(""),
  verify_by: ref(""),
  weight: ref(""),
  unit: ref(""),
  price: ref(0),
});
const CreateColleteral = async () => {
  const { pending, data: CustCreate } = await useAsyncData("CustCreate", () =>
    $fetch(
      `${BaseApi}colleteral/other/${
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
    $fetch(`${BaseApi}colleteral/other/${val}`, {
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
  form.value.title = "ຂໍ້ມູນຫຼັກຊັບອື່ນໆ";
  form.value.type = "update";
  refkeydel.value = val.id;
  rcol.owner = ref(val.owner);
  rcol.doc_no = val.doc_no;
  rcol.issue_date = moment(new Date(val.issue_date)).format("YYYY-MM-DD");
  rcol.verify_by = val.verify_by;
  rcol.unit = val.unit;
  rcol.weight = val.weight;
  rcol.price = val.price;
};
const currencyOptions = {
  currency: "LAK",
  currencyDisplay: "hidden",
};
</script>

<template>
  <div class="px-3">
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
            <th>seq</th>
            <th>ຊື່ເຈົ້າຂອງຫຼັກຊັບ</th>
            <th>ເລກທີໃບຮັບຮອງ</th>
            <th>ລົງວັນທີ</th>
            <th>ຮັບຮອງຈາກ</th>
            <th class="text-center">ນ້ຳໜັກ</th>
            <th class="text-center">ຫົວໜ່ວຍ</th>
            <th class="text-right">ມູນຄ່າ</th>
            <th class="text-right">ມູນຄ່າຫຼັກຊັບ (ກີບ)</th>
            <th class="text-right w-[60px]"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="ot in itdata"
            :key="ot"
            class="group hover"
            @dblclick="ColView(ot)"
          >
            <th>{{ ot.seq }}</th>
            <th>{{ ot.owner }}</th>
            <td>{{ ot.doc_no }}</td>
            <td>{{ moment(new Date(ot.issue_date)).format("DD/MM/YYYY") }}</td>
            <td>{{ ot.verify_by }}</td>
            <td class="text-center">{{ ot.weight }}</td>
            <td class="text-center">{{ ot.unit }}</td>
            <td class="text-right">{{ ot.price.toLocaleString("en-UK") }}</td>
            <td class="text-right">{{ ot.total.toLocaleString("en-UK") }}</td>
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
                  id="handleAlert"
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
        id="colOther"
        class="modal-toggle"
        :checked="modalVal"
      />
      <div class="modal" id="colOther">
        <div
          class="modal-box overflow-hidden max-h-[90vh] pt-0 px-0 pb-5 relative"
        >
          <div class="sticky top-0 bg-base-100 z-9 px-5 pt-3">
            <button
              @click="
                modalVal = false;
                form.title = 'ເພີ່ມຫຼັກຊັບອື່ນໆ';
                form.type = 'create';
              "
              class="btn btn-xs btn-circle btn-error absolute right-2 top-2"
            >
              ✕
            </button>
            <h3 class="font-bold text-md mb-3">
              {{ form.title }}
            </h3>
          </div>
          <VForm
            v-slot="{ handleSubmit, errors }"
            :validation-schema="otherSchema"
            class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4"
            as="div"
          >
            <form
              @submit="handleSubmit($event, CreateColleteral)"
              class="mt-4"
              name="frmOther"
            >
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
                  for="colDoc"
                  class="block mb-2 text-sm font-medium dark:text-gray-300"
                  >ເລກທີໃບຮັບຮອງ <span class="text-[red]">*</span></label
                >

                <VField
                  type="text"
                  name="doc_no"
                  id="colDoc"
                  v-model="rcol.doc_no"
                  class="input input-sm input-bordered w-full"
                  :class="errors.doc_no ? 'input-error' : ''"
                />
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColIsdate"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ລົງວັນທີ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="date"
                    name="issue_date"
                    id="ColIsdate"
                    v-model="rcol.issue_date"
                    class="input input-sm input-bordered w-full"
                    :class="errors.issue_date ? 'input-error' : ''"
                  />
                </div>
                <div class="w-full">
                  <label
                    for="colVerify"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຮັບຮອງຈາກ <span class="text-[red]">*</span></label
                  >
                  <VField
                    type="text"
                    name="verify_by"
                    id="colVerify"
                    v-model="rcol.verify_by"
                    class="input input-sm input-bordered w-full"
                    :class="errors.verify_by ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColWieght"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ນ້ຳໜັກ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="weight"
                    id="ColWieght"
                    v-model="rcol.weight"
                    class="input input-sm input-bordered w-full"
                    :class="errors.weight ? 'input-error' : ''"
                  />
                </div>
                <div class="w-full">
                  <label
                    for="ColUnit"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ຫົວໜ່ວຍ <span class="text-[red]">*</span></label
                  >

                  <VField
                    type="text"
                    name="unit"
                    id="ColUnit"
                    v-model="rcol.unit"
                    class="input input-sm input-bordered w-full"
                    :class="errors.unit ? 'input-error' : ''"
                  />
                </div>
              </div>
              <div class="flex gap-2 w-full mt-1">
                <div class="w-full">
                  <label
                    for="ColPrice"
                    class="block mb-2 text-sm font-medium dark:text-gray-300"
                    >ມູນຄ່າ <span class="text-[red]">*</span></label
                  >
                  <TinputCcy
                    name="price"
                    id="ColPrice"
                    v-model.lazy="rcol.price"
                    :placeholder="Number(rcol.price).toLocaleString('en-US')"
                    class="input input-sm input-bordered w-full text-right"
                    :class="errors.price ? 'input-error' : ''"
                    :options="currencyOptions"
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
    <ModalCondel>
      <button class="btn" @click="DeleteColleteral">ຕົກລົງ</button>
    </ModalCondel>
  </div>
</template>