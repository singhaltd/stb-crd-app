<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
import * as yup from "yup";
const route = useRoute();
const router = useRouter();
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const toast = useSnakeToast();
definePageMeta({
  title: "ຂໍ້ມູນລູກຄ້າ",
  middleware: ["auth"],
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
const schemaUser = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  username: yup.string().required(),
  mobile: yup.string().required(),
  email: yup.string().required(),
});
const [
  { refresh, pending: deUser, data: User },
  { data: listDepart },
  { data: listBranch },
  { data: listRoles },
] = await Promise.all([
  useFetch(`${BaseApi}users/${route.params.id}`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}departments`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}branches`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
  useFetch(`${BaseApi}roles`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }),
]);

const updateUser = async () => {
  await $fetch(`${BaseApi}auth`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: User.value.data,
  })
    .then((res) => {
      toast.value = { state: true, type: "success" };
      router.push("/users");
    })
    .catch((err) => {
      toast.value = { state: true, type: "error" };
    });
};
onMounted(()=> {
  refresh();
})

</script>
<template>
  <div class="w-full mt-5">
    <div class="px-3">
      <h3>ຂໍ້ມູນຜູ້ໃຊ້ງານລະບົບ</h3>
      <VForm
        v-slot="{ handleSubmit, errors }"
        :validation-schema="schemaUser"
        as="div"
      >
        <form @submit="handleSubmit($event, updateUser)">
          <div class="mt-5">
            <div class="flex gap-3">
              <VField
                type="text"
                v-model="User.data.firstname"
                name="firstname"
                placeholder="ຊື່ແທ້"
                class="input input-sm input-bordered w-full mb-5"
                :class="errors.firstname ? 'input-error' : ''"
              />
              <VField
                type="text"
                v-model="User.data.lastname"
                name="lastname"
                placeholder="ນາມສະກຸນ"
                class="input input-sm input-bordered w-full mb-5"
                :class="errors.lastname ? 'input-error' : ''"
              />
            </div>
            <VField
              type="text"
              v-model="User.data.username"
              name="username"
              placeholder="username"
              class="input input-sm input-bordered w-full mb-5"
              :class="errors.username ? 'input-error' : ''"
              disabled
            />
            <VField
              type="email"
              name="email"
              v-model="User.data.email"
              placeholder="email"
              class="input input-sm input-bordered w-full mb-5"
            />
            <VField
              type="tel"
              name="mobile"
              v-model="User.data.mobile"
              placeholder="mobile"
              class="input input-sm input-bordered w-full mb-5"
              :class="errors.mobile ? 'input-error' : ''"
            />
            <select
              class="select select-sm select-bordered w-full mb-5"
              v-model="User.data.branch_code"
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
              v-model="User.data.dep_id"
            >
              <option :value="id.id" v-for="id in listDepart.data" :key="id">
                {{ id.dep_name }}
              </option>
            </select>
            <select
              class="select select-sm select-bordered w-full mb-5"
              v-model="User.data.role"
            >
              <option :value="id.id" v-for="id in listRoles.data" :key="id">
                {{ id.title }}
              </option>
            </select>
            <div class="flex justify-between">
              <div></div>
              <button type="submit" class="btn btn-sm">ບັນທຶກ</button>
            </div>
          </div>
        </form>
      </VForm>
    </div>
  </div>
</template>