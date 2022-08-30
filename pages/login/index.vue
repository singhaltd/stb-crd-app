<script setup>
import { ref } from "vue";
import * as yup from "yup";
import { setAccessToken, getAccessToken } from "~~/auth";
const authKey = useCookie("autKey");
const router = useRouter();
const route = useRoute();
definePageMeta({
  layout: "none",
});
useHead({
  title: "ເຂົ້າສູ່ລະບົບ",
});
const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required().min(8),
});
const ErrMess = ref("");
const loading = ref(false);
const signin = async () => {
  ErrMess.value = "";
  loading.value = true;
  navigateTo;
  await signInUser(signinForm)
    .then((res) => {
      if (res.token) {
        setAccessToken(res.token);
        loading.value = false;
        window.location.reload();
      } else {
        loading.value = false;
        ErrMess.value = res.message;
      }
    })
    .catch((er) => {
      loading.value = false;
      ErrMess.value = er;
    });
};
const signinForm = ref({ username: "", password: "" });
onMounted(() => {
  authKey.value != "" ? navigateTo("/") : "";
});
</script>
<template>
  <div class="min-h-screen flex flex-col items-center justify-center">
    <section
      class="
        fixed
        h-screen
        w-full
        -z-1
        from-cyan-500
        to-blue-500
        dark:from-cyan-500 dark:to-blue-500
      "
    ></section>
    <div
      class="
        flex flex-col
        light:bg-white
        shadow-md
        px-4
        sm:px-6
        md:px-8
        lg:px-10
        py-8
        bg-blend-lighten
        z-0
        rounded-3xl
        w-[420px]
      "
    >
      <div class="px-5 pt-5" v-html="$t('_message_login')"></div>
      <div class="px-5 py-5">
        <VForm
          v-slot="{ handleSubmit, errors }"
          :validation-schema="schema"
          as="div"
        >
          <form @submit="handleSubmit($event, signin)">
            <div class="flex flex-col mb-5">
              <label
                for="email"
                class="mb-1 text-xs tracking-wide dark:text-white"
                >ຊື່ຜູ້ໃຊ້ລະບົບ:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>

                <VField
                  id="username"
                  type="text"
                  name="username"
                  v-model="signinForm.username"
                  class="
                    input-md
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    input-bordered
                    rounded-lg
                    input
                    w-full
                    focus:outline-none focus:border-blue-400
                  "
                  :class="errors.username ? 'input-error' : ''"
                  placeholder="ປ້ອນ ອີເມວ໌ ຫຼື ເບີໂທ"
                />
              </div>
            </div>
            <div class="flex flex-col mb-6">
              <label
                for="password"
                class="
                  mb-1
                  text-xs
                  rounded
                  sm:text-sm
                  tracking-wide
                  text-gray-600
                  dark:text-white
                "
                >ລະຫັດຜ່ານ:</label
              >
              <div class="relative">
                <div
                  class="
                    inline-flex
                    items-center
                    justify-center
                    absolute
                    left-0
                    top-0
                    h-full
                    w-10
                    text-gray-400
                  "
                >
                  <span>
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
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                  </span>
                </div>

                <VField
                  id="password"
                  type="password"
                  name="password"
                  v-model="signinForm.password"
                  class="
                    text-sm
                    placeholder-gray-500
                    pl-10
                    pr-4
                    input input-bordered
                    rounded-lg
                    w-full
                    focus:outline-none focus:border-blue-400
                  "
                  :class="errors.password ? 'input-error' : ''"
                  placeholder="ປ້ອນລະຫັດຜ່ານ"
                />
              </div>
            </div>
            <div
              class="alert alert-error alert-sm shadow-lg mb-3"
              v-if="errors.username || errors.password || ErrMess != ''"
            >
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="stroke-current flex-shrink-0 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span class="text-sm">{{
                  ErrMess
                    ? "ຊື່ຜູ້ໃຊ້ລະບົບ, ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ"
                    : "ກາລຸນາກວດສອບ ຊື່ຜູ້ໃຊ້ລະບົບ, ລະຫັດຜ່ານ"
                }}</span>
              </div>
            </div>
            <button
              :class="loading ? 'btn w-full loading' : 'btn w-full btn-md'"
              type="submit"
            >
              ເຂົ້າສູ່ລະບົບ
            </button>
          </form>
        </VForm>
      </div>
      <p class="text-center text-sm">{{ $t("version") }} 1.1.2-UAT</p>
    </div>
  </div>
</template>