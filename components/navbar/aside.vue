<script setup>
import { reactive } from "vue";
const prop = defineProps({
  menu: reactive({}),
  toggle: { type: Boolean, default: true },
});
const emits = defineEmits(["update:toggleMenu"]);
const isActive = ref(false)
</script>
<style>
.fa-secondary {
  opacity: 0.4;
}
</style>
<template>
  <div
    class="
      px-2
      py-4
      overflow-y-auto
      rounded
      bg-gray-50
      dark:bg-gray-800
      shadow
      h-[calc(100vh-34px)]
    "
  >
    <client-only>
      <ul class="smenu">
        <li>
          <router-link to="/" custom v-slot="{ href, navigate, isActive }">
            <a
              :href="href"
              @click="navigate"
              class="
                flex
                items-center
                p-2
                text-base
                font-normal
                text-gray-900
                rounded-lg
                dark:text-white
                hover:bg-red
                dark:hover:bg-gray-700
              "
              :class="{
                'border-l-4 border-primary bg-base-200 -ml-1': isActive,
              }"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                class="
                  w-6
                  h-6
                  text-gray-500
                  transition
                  duration-75
                  dark:text-gray-400
                  group-hover:text-gray-900
                  dark:group-hover:text-white
                "
                viewBox="0 0 512 512"
              >
                <path
                  class="fa-primary"
                  d="M280 292.7C303.5 302.1 320 325.1 320 352C320 387.3 291.3 416 256 416C220.7 416 192 387.3 192 352C192 325.1 208.5 302.1 232 292.7V88C232 74.75 242.7 64 256 64C269.3 64 280 74.75 280 88V292.7z"
                />
                <path
                  class="fa-secondary"
                  d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM280 292.7V88C280 74.75 269.3 64 256 64C242.7 64 232 74.75 232 88V292.7C208.5 302.1 192 325.1 192 352C192 387.3 220.7 416 256 416C291.3 416 320 387.3 320 352C320 325.1 303.5 302.1 280 292.7zM144 176C161.7 176 176 161.7 176 144C176 126.3 161.7 112 144 112C126.3 112 112 126.3 112 144C112 161.7 126.3 176 144 176zM96 224C78.33 224 64 238.3 64 256C64 273.7 78.33 288 96 288C113.7 288 128 273.7 128 256C128 238.3 113.7 224 96 224zM416 288C433.7 288 448 273.7 448 256C448 238.3 433.7 224 416 224C398.3 224 384 238.3 384 256C384 273.7 398.3 288 416 288zM368 112C350.3 112 336 126.3 336 144C336 161.7 350.3 176 368 176C385.7 176 400 161.7 400 144C400 126.3 385.7 112 368 112z"
                />
              </svg>
              <span class="ml-3" :class="{ hidden: toggle }">ກະດານຂ້ອຍ</span>
            </a>
          </router-link>
        </li>
      </ul>
      <ul class="smenu" v-for="(ni, i) in prop.menu" :key="ni">
        <li
          v-if="ni.parent == null && ni.target == '_top'"
          :key="ni"
          :tabindex="i"
          class="relative"
        >
          <a
            href="#"
            class="
              flex
              items-center
              p-2
              text-base
              font-normal
              text-gray-900
              rounded-lg
              dark:text-white dark:hover:bg-gray-700
              w-full
            "
            :class="{ 'border-l-4 border-primary bg-base-200 -ml-1': isActive }"
          >
            <svg
              v-if="ni.slug == '/customer'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="
                w-6
                h-6
                text-gray-500
                transition
                duration-75
                dark:text-gray-400
                group-hover:text-gray-900
                dark:group-hover:text-white
              "
              viewBox="0 0 640 512"
            >
              <path
                class="fa-primary"
                d="M384 96C384 131.3 355.3 160 320 160C284.7 160 256 131.3 256 96C256 60.65 284.7 32 320 32C355.3 32 384 60.65 384 96zM384 448C384 465.7 369.7 480 352 480H288C270.3 480 256 465.7 256 448V405.2C218.2 387.2 192 348.7 192 304C192 242.1 242.1 192 304 192H336C397.9 192 448 242.1 448 304C448 348.7 421.8 387.2 384 405.2V448zM256 261.7C246 272.9 240 287.8 240 304C240 320.2 246 335.1 256 346.3V261.7zM400 304C400 287.8 393.1 272.9 384 261.7V346.3C393.1 335 400 320.2 400 304z"
              />
              <path
                class="fa-secondary"
                d="M64 96C64 60.65 92.65 32 128 32C163.3 32 192 60.65 192 96C192 131.3 163.3 160 128 160C92.65 160 64 131.3 64 96zM192 394.5V448C192 465.7 177.7 480 160 480H96C78.33 480 64 465.7 64 448V405.2C26.16 387.2 0 348.7 0 304C0 242.1 50.14 192 112 192H144C163.7 192 182.3 197.1 198.4 206.1C174.6 231.8 160 266.2 160 304C160 338.3 171.1 369.8 192 394.5zM64 346.3V261.7C54.04 272.9 48 287.8 48 304C48 320.2 54.04 335.1 64 346.3zM448 394.5C468 369.8 480 338.3 480 304C480 266.2 465.4 231.8 441.6 206.1C457.7 197.1 476.3 192 496 192H528C589.9 192 640 242.1 640 304C640 348.7 613.8 387.2 576 405.2V448C576 465.7 561.7 480 544 480H480C462.3 480 448 465.7 448 448V394.5zM592 304C592 287.8 585.1 272.9 576 261.7V346.3C585.1 335 592 320.2 592 304zM448 96C448 60.65 476.7 32 512 32C547.3 32 576 60.65 576 96C576 131.3 547.3 160 512 160C476.7 160 448 131.3 448 96z"
              />
            </svg>
            <svg
              v-if="ni.slug == '/users'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="
                w-6
                h-6
                text-gray-500
                transition
                duration-75
                dark:text-gray-400
                group-hover:text-gray-900
                dark:group-hover:text-white
              "
              viewBox="0 0 640 512"
            >
              <path
                class="fa-primary"
                d="M224 256c70.7 0 128-57.31 128-128S294.7 0 224 0C153.3 0 96 57.31 96 128S153.3 256 224 256zM274.7 304H173.3c-95.73 0-173.3 77.6-173.3 173.3C0 496.5 15.52 512 34.66 512H413.3C432.5 512 448 496.5 448 477.3C448 381.6 370.4 304 274.7 304z"
              />
              <path
                class="fa-secondary"
                d="M479.1 320h-73.85C451.2 357.7 480 414.1 480 477.3C480 490.1 476.2 501.9 470 512h138C625.7 512 640 497.6 640 479.1C640 391.6 568.4 320 479.1 320zM432 256C493.9 256 544 205.9 544 144S493.9 32 432 32c-25.11 0-48.04 8.555-66.72 22.51C376.8 76.63 384 101.4 384 128c0 35.52-11.93 68.14-31.59 94.71C372.7 243.2 400.8 256 432 256z"
              />
            </svg>
            <svg
              v-if="ni.slug == '/collator'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="
                w-6
                h-6
                text-gray-500
                transition
                duration-75
                dark:text-gray-400
                group-hover:text-gray-900
                dark:group-hover:text-white
              "
              viewBox="0 0 512 512"
            >
              <path
                class="fa-primary"
                d="M168 0C181.3 0 192 10.75 192 24V64H128V24C128 10.75 138.7 0 152 0H168zM328 0C341.3 0 352 10.75 352 24V64H288V24C288 10.75 298.7 0 312 0H328zM224 16C224 7.164 231.2 0 240 0C248.8 0 256 7.164 256 16V64H224V16zM416 16V272C416 280.8 408.8 288 400 288C391.2 288 384 280.8 384 272V16C384 7.164 391.2 0 400 0C408.8 0 416 7.164 416 16zM448 24C448 10.75 458.7 0 472 0H488C501.3 0 512 10.75 512 24V264C512 277.3 501.3 288 488 288H472C458.7 288 448 277.3 448 264V24zM264 160C277.3 160 288 170.7 288 184V200C288 213.3 277.3 224 264 224H88C74.75 224 64 213.3 64 200V184C64 170.7 74.75 160 88 160H264z"
              />
              <path
                class="fa-secondary"
                d="M288 96C323.3 96 352 124.7 352 160V448C352 483.3 323.3 512 288 512H64C28.65 512 0 483.3 0 448V160C0 124.7 28.65 96 64 96H288zM88 160C74.75 160 64 170.7 64 184V200C64 213.3 74.75 224 88 224H264C277.3 224 288 213.3 288 200V184C288 170.7 277.3 160 264 160H88zM80 288C71.16 288 64 295.2 64 304V336C64 344.8 71.16 352 80 352H144C152.8 352 160 344.8 160 336V304C160 295.2 152.8 288 144 288H80zM64 432C64 440.8 71.16 448 80 448H144C152.8 448 160 440.8 160 432V400C160 391.2 152.8 384 144 384H80C71.16 384 64 391.2 64 400V432zM208 288C199.2 288 192 295.2 192 304V336C192 344.8 199.2 352 208 352H272C280.8 352 288 344.8 288 336V304C288 295.2 280.8 288 272 288H208zM192 432C192 440.8 199.2 448 208 448H272C280.8 448 288 440.8 288 432V400C288 391.2 280.8 384 272 384H208C199.2 384 192 391.2 192 400V432z"
              />
            </svg>
            <svg
              v-if="ni.slug == '/qtions'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="
                w-6
                h-6
                text-gray-500
                transition
                duration-75
                dark:text-gray-400
                group-hover:text-gray-900
                dark:group-hover:text-white
              "
              viewBox="0 0 576 512"
            >
              <path
                class="fa-primary"
                d="M576 368C576 447.5 511.5 512 432 512C352.5 512 288 447.5 288 368C288 288.5 352.5 224 432 224C511.5 224 576 288.5 576 368zM432 416C418.7 416 408 426.7 408 440C408 453.3 418.7 464 432 464C445.3 464 456 453.3 456 440C456 426.7 445.3 416 432 416zM409.6 280C386.6 280 368 298.6 368 321.6V328C368 336.8 375.2 344 384 344C392.8 344 400 336.8 400 328V321.6C400 316.3 404.3 312 409.6 312H450.1C457.8 312 464 318.2 464 325.9C464 331.1 461.1 335.8 456.6 338.3L424.6 355.1C419.3 357.9 416 363.3 416 369.2V384C416 392.8 423.2 400 432 400C440.8 400 448 392.8 448 384V378.9L471.5 366.6C486.6 358.6 496 342.1 496 325.9C496 300.6 475.4 280 450.1 280H409.6z"
              />
              <path
                class="fa-secondary"
                d="M112 48C112 21.49 133.5 0 160 0C186.5 0 208 21.49 208 48C208 74.51 186.5 96 160 96C133.5 96 112 74.51 112 48zM120 512C102.3 512 88 497.7 88 480V256.9L59.43 304.5C50.33 319.6 30.67 324.5 15.52 315.4C.3696 306.3-4.531 286.7 4.573 271.5L62.85 174.6C80.2 145.7 111.4 128 145.1 128H174.9C208.6 128 239.8 145.7 257.2 174.6L302.1 249.3C285.1 266.9 273.4 287.7 265.5 310.8C263.6 308.9 261.1 306.8 260.6 304.5L232 256.9V480C232 497.7 217.7 512 200 512C182.3 512 168 497.7 168 480V352H152V480C152 497.7 137.7 512 120 512L120 512z"
              />
            </svg>

            <svg
              v-if="ni.slug == '/currencies'"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              class="
                w-6
                h-6
                text-gray-500
                transition
                duration-75
                dark:text-gray-400
                group-hover:text-gray-900
                dark:group-hover:text-white
              "
              viewBox="0 0 384 512"
            >
              <path
                class="fa-primary"
                d="M145.2 256L340.8 423.7C354.2 435.2 355.8 455.4 344.3 468.8C332.8 482.2 312.6 483.8 299.2 472.3L128 325.6V448C128 465.7 113.7 480 96 480C78.33 480 64 465.7 64 448V64C64 46.33 78.33 32 96 32C113.7 32 128 46.33 128 64V186.4L299.2 39.7C312.6 28.2 332.8 29.76 344.3 43.18C355.8 56.59 354.2 76.8 340.8 88.3L145.2 256z"
              />
              <path
                class="fa-secondary"
                d="M64 288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H64V288zM182.5 288L145.2 256L182.5 224H352C369.7 224 384 238.3 384 256C384 273.7 369.7 288 352 288H182.5z"
              />
            </svg>
            <div class="ml-3 flex text-sm" :class="{ hidden: toggle }">
              <p>{{ ni.title }}</p>
            </div>
          </a>
          <div
            class="absolute right-1 top-3 -rotate-90"
            :class="{ hidden: toggle }"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="w-5 h-5"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
        </li>

        <ul :class="{ hidden: toggle }">
          <li
            v-for="nit in prop.menu.filter((t) => t.parent == ni.id)"
            :key="nit"
          >
            <router-link
              :to="ni.slug + nit.slug"
              custom
              v-slot="{ href, navigate, isActive }"
            >
              <a
                :href="href"
                @click="navigate"
                class="
                  flex
                  items-center
                  p-2
                  font-normal
                  text-gray-900
                  rounded-lg
                  dark:text-white
                  hover:bg-gray-100
                  pl-[48px]
                  dark:hover:bg-gray-700
                  text-sm
                "
                :class="{
                  'border-r-4 border-primary bg-base-200 -ml-1': isActive,
                }"
                >{{ nit.title }}</a
              >
            </router-link>
          </li>
        </ul>
      </ul>
    </client-only>
  </div>
  <!--  -->
</template>