<script setup>
useHead({
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  charset: "utf-8",
  meta: [{ name: "description", content: "My amazing site." }],
  bodyAttrs: {
    id: "app",
  },
});
import { ref, reactive } from "vue";
import * as yup from "yup";
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const uprofile = userProfile();
const token = useCookie("autKey");
const sidebarOpen = ref(false);
const {
  data: navLink,
  error: nvError,
  refresh: Refnavlink,
} = await useAsyncData("navLink", () =>
  $fetch(`${BaseApi}access`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
);
const schemaUser = yup.object({
  od_password: yup.string().required("Please Enter your password"),
  password: yup
    .string()
    .required("Please Enter your password")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
      "ຂັ້ນຕໍ່າ 8 ຕົວອັກສອນ, ຕົວພິມໃຫຍ່, ຕົວພິມນ້ອຍ, ຕົວເລກ ແລະ ອັກຄະລະ"
    ),
  cpassword: yup.string().oneOf([yup.ref("password"), null], "ລະຫັດບໍ່ຖືກກັນ"),
});
const User = reactive({
  od_password: ref(""),
  password: ref(""),
  cpassword: ref(""),
});
const resPassword = async () => {
  await $fetch(`${BaseApi}passreset`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
    body: User,
  })
    .then((res) => {
      if (res.error !== true) {
        toast.value = {
          state: true,
          type: "success",
          data: "ປ່ຽນລະຫັດສຳເລັດ. ກາລຸນາເຂົ້າລະບົບໃໝ່",
        };
        setTimeout(() => {
          logoutUser().then((res) => {
            navigateTo("/login");
          });
        }, 2000);
      } else {
        toast.value = {
          state: true,
          type: "error",
          data: res.data,
        };
      }
    })
    .catch((err) => {
      toast.value = { state: true, type: "error" };
    });
};
const {
  data: UserProfile,
  error: upError,
  refresh: refUprofile,
} = await useAsyncData("userprofile", () =>
  $fetch(`${BaseApi}profile`, {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  })
);
onMounted(() => {
  uprofile.value = reactive(UserProfile);
  Refnavlink();
  refUprofile();
});
</script>

<template>
  <div class="relation">
    <NuxtLoadingIndicator />
    <div class="flex relation">
      <aside
        class="flex-none w-64 h-screen md:block lg:block hidden sticky top-0"
        aria-label="Sidebar"
        :class="{ 'w-[58px]': sidebarOpen }"
      >
        <div class="h-[34px]">
          <button class="pl-4 stick top-0" @click="sidebarOpen = !sidebarOpen">
            CRD
          </button>
        </div>

        <NavbarAside :menu="navLink" :toggle="sidebarOpen" />
      </aside>

      <main class="flex-1 relative">
        <NavbarAuthtop />
        <div class="absolute w-full h-[calc(100vh-40px)] overflow-auto pb-5">
          <NuxtPage />
        </div>
        <!-- <NuxtPage /> -->
      </main>
    </div>
    <div class="modal" id="resetpassword">
      <div class="modal-box">
        <VForm
          v-slot="{ errors }"
          :validation-schema="schemaUser"
          @submit="resPassword"
        >
          <h3 class="font-bold text-lg">ປ່ຽນລະຫັດຜ່ານ</h3>
          <div class="py-4 flex flex-col gap-4">
            <VField
              type="password"
              name="od_password"
              v-model="User.od_password"
              placeholder="ລະຫັດເກົ່າ"
              class="input input-sm input-bordered w-full"
              :class="errors.od_password ? 'input-error' : ''"
            />
            <VField
              type="password"
              name="password"
              v-model="User.password"
              placeholder="ລະຫັດໃໝ່"
              class="input input-sm input-bordered w-full"
              :class="errors.password ? 'input-error' : ''"
            />
            <div class="form-control w-full">
              <VField
                type="password"
                name="cpassword"
                v-model="User.cpassword"
                placeholder="ພິມລະຫັດໃໝ່ອີກຄັ້ງ"
                class="input input-sm input-bordered w-full"
                :class="errors.cpassword ? 'input-error' : ''"
              />

              <label class="label">
                <span class="label-text-alt text-error">{{
                  errors.cpassword
                }}</span>
              </label>
            </div>
          </div>
          <div class="modal-action">
            <button class="btn btn-sm btn-primary" type="submit">ບັນທຶກ</button>
            <a href="#" class="btn btn-sm btn-error">ຍົກເລີກ</a>
          </div>
        </VForm>
      </div>
    </div>
    <ModalToast />
  </div>
</template>