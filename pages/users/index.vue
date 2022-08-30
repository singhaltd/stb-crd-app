<script setup>
import * as yup from "yup";
import { ref, reactive } from "vue";
const router = useRouter();
const route = useRoute();
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const token = useCookie("autKey");
const toast = useSnakeToast();
definePageMeta({
  title: "ຈັດການຜູ້ໃຊ້ລະບົບ",
  middleware: ["auth"],
});
const perpage = ref("20");
const curpage = ref(1);
const isActive = ref(false);
const schemaUser = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  username: yup.string().required(),
  mobile: yup.string().required(),
  email: yup.string().required(),
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "ຂັ້ນຕໍ່າ 8 ຕົວອັກສອນ, ຕົວພິມໃຫຍ່, ຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ ອັກຄະລະ"
    ),
  cpassword: yup.string(),
});
const user = reactive({
  username: ref(""),
  fullname: ref(""),
  password: ref(""),
  cpassword: ref(""),
  email: ref(""),
  mobile: ref(""),
  branch_code: ref("001"),
  dep_id: ref(1),
  role: ref("BROLE"),
});
const typeSearch = reactive({
  stype: "fullname",
  str: ref(""),
});
const { data: listRoles } = await useFetch(() => `${BaseApi}roles`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const { data: listDepart } = await useFetch(() => `${BaseApi}departments`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const { data: listBranch } = await useFetch(() => `${BaseApi}branches`, {
  headers: {
    Authorization: `Bearer ${token.value}`,
  },
});
const {
  refresh,
  pending: deUser,
  data: listUsers,
} = await useFetch(
  () =>
    `${BaseApi}users?cur_page=${
      route.query.page ? route.query.page : 1
    }&per_page=${perpage.value}${
      typeSearch.stype && typeSearch.str !== ""
        ? `&${typeSearch.stype}=${typeSearch.str}`
        : ""
    }`,
  {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }
);

const createUser = async () => {
  await $fetch(`${BaseApi}auth/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: user,
  })
    .then((res) => {
      toast.value = { state: true, type: "success" };
      getUsers();
    })
    .catch((err) => {});
};

refresh();

const getUsers = () => {
  refresh();
};
</script>
<template>
  <div class="w-full mt-5 px-5">
    <ModalSm>
      <template #title> ເພີ່ມຜູ້ໃຊ້ລະບົບ </template>
      <template #body>
        <VForm
          v-slot="{ handleSubmit, errors }"
          :validation-schema="schemaUser"
          as="div"
        >
          <form @submit="handleSubmit($event, createUser)">
            <div class="mt-5">
              <div class="flex gap-3">
                <VField
                  type="text"
                  v-model="user.firstname"
                  name="firstname"
                  placeholder="ຊື່ແທ້"
                  class="input input-sm input-bordered w-full mb-5"
                  :class="errors.firstname ? 'input-error' : ''"
                />
                <VField
                  type="text"
                  v-model="user.lastname"
                  name="lastname"
                  placeholder="ນາມສະກຸນ"
                  class="input input-sm input-bordered w-full mb-5"
                  :class="errors.lastname ? 'input-error' : ''"
                />
              </div>
              <VField
                type="text"
                v-model="user.username"
                name="username"
                placeholder="username"
                class="input input-sm input-bordered w-full mb-5"
                :class="errors.username ? 'input-error' : ''"
              />
              <VField
                type="email"
                name="email"
                v-model="user.email"
                placeholder="email"
                class="input input-sm input-bordered w-full mb-5"
              />
              <VField
                type="tel"
                name="mobile"
                v-model="user.mobile"
                placeholder="mobile"
                class="input input-sm input-bordered w-full mb-5"
                :class="errors.mobile ? 'input-error' : ''"
              />
              <select
                class="select select-sm select-bordered w-full mb-5"
                v-model="user.branch_code"
              >
                <option
                  :value="ib.branch_code"
                  v-for="ib in listBranch.data"
                  :key="ib"
                >
                  {{ ib.branch_code }} - {{ ib.branch_name }}
                </option>
              </select>
              <select
                class="select select-sm select-bordered w-full mb-5"
                v-model="user.dep_id"
              >
                <option :value="id.id" v-for="id in listDepart.data" :key="id">
                  {{ id.dep_name }}
                </option>
              </select>
              <select
                class="select select-sm select-bordered w-full mb-5"
                v-model="user.role"
              >
                <option :value="id.id" v-for="id in listRoles.data" :key="id">
                  {{ id.title }}
                </option>
              </select>
              <div class="form-control w-full mb-5">
                <VField
                  type="text"
                  name="password"
                  v-model="user.password"
                  placeholder="password"
                  class="input input-sm input-bordered w-full"
                  :class="errors.password ? 'input-error' : ''"
                />
                <label class="label" v-if="errors.password">
                  <span class="label-text-alt text-error">{{
                    errors.password
                  }}</span>
                </label>
              </div>
              <VField
                type="text"
                name="cpassword"
                placeholder="confirm password"
                v-model="user.cpassword"
                class="input input-sm input-bordered w-full mb-5"
                :class="errors.cpassword ? 'input-error' : ''"
              />

              <div class="flex justify-between">
                <div></div>
                <button type="submit" class="btn btn-sm">ບັນທຶກ</button>
              </div>
            </div>
          </form>
        </VForm>
      </template>
    </ModalSm>
    <TablePanel
      :numpage="listUsers.data.meta.last_page"
      v-model:totalPage="perpage"
      title="ຜູ້ໃຊ້ລະບົບ"
    >
      <template #action>
        <label for="my-modal" class="btn btn-square btn-sm btn-primary ml-2"
          >+</label
        >
      </template>
      <template #search>
        <div class="flex">
          <select
            v-model="typeSearch.stype"
            class="select select-sm bg-base-200 rounded-l-lg rounded-r-none"
          >
            <option value="cust_id">ລະຫັດ</option>
            <option value="fullname">ຊື່ ແລະ ນາມສະກຸນ</option>
            <option value="mobile">ເບີໂທ</option>
          </select>
          <input
            type="text"
            v-model="typeSearch.str"
            class="input w-full input-sm max-w-xs transparent rounded-none"
            placeholder="ປ້ອນການຄົ້ນຫາ..."
          />

          <button
            type="button"
            class="rounded-r-lg rounded-l-none btn-sm btn px-3"
            @click="getUsers"
          >
            ຄົ້ນຫາ
          </button>
        </div>
      </template>
      <template #body>
        <div class="overflow-x-auto w-full">
          <table class="table table-compact w-full">
            <thead>
              <tr>
                <th>ລະຫັດອ້າງອີງ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ສາຂາ</th>
                <th>ເບີໂທ</th>
                <th>ລະດັບຜູ້ໃຊ້ງານ</th>
                <th>ລະຫັດພະນັກງານ</th>
                <th>ສັງກັດຢູ່ພະແນກ</th>
                <th>ສະຖານະ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="ui in listUsers.data.data"
                :key="ui"
                v-on:dblclick.native="router.push(`/users/${ui.username}`)"
                class="hover"
              >
                <th>{{ ui.cust_id }}</th>
                <th>{{ ui.fullname }}</th>
                <td>{{ ui.branch_code }}</td>
                <td>{{ ui.mobile }}</td>
                <td>{{ ui.role_id }}</td>
                <td></td>
                <td>{{ ui.dept.dep_name }}</td>
                <td>
                  <!-- <div class="flex justify-content">
                    <div class="flex">
                      <div class="tooltip" data-tip="ຍັງບໍ່ຕອບແບບສອບຖາມ">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          stroke-width="2"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div> -->
                </td>
                <td>
                  <NuxtLink
                    :to="`/users/${ui.cust_id}`"
                    class="btn btn-ghost btn-xs m-0"
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
                  ></NuxtLink>
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th>ລະຫັດອ້າງອີງ</th>
                <th>ຊື່ ແລະ ນາມສະກຸນ</th>
                <th>ສາຂາ</th>
                <th>ເບີໂທ</th>
                <th>ລະດັບຜູ້ໃຊ້ງານ</th>
                <th>ລະຫັດພະນັກງານ</th>
                <th>ສັງກັດຢູ່ພະແນກ</th>
                <th>ສະຖານະ</th>
                <th></th>
              </tr>
            </tfoot>
          </table>
        </div>
      </template>
    </TablePanel>
  </div>
</template>


<style>
</style>