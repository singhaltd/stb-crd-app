<template>
  <div>
    <div class="absolute px-2 z-10">
      <div class="flex gap-2">
        <button class="btn btn-sm" @click="handlePrint(props.data?.cust_no)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          ພີມລາຍການ
        </button>
        <a href="#custInfo" class="btn btn-sm btn-bordered">ຂໍ້ມູນສ່ວນຕົວ</a>
        <a href="#delConfirm" class="btn btn-sm btn-bordered btn-error">
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </a>
      </div>
    </div>
    <div
      class="w-full bg-cover z-1 bg-no-repeat bg-center"
      style="height: 200px"
    >
      <img
        class="opacity-0 w-full h-full z-1"
        src="https://pbs.twimg.com/profile_banners/2161323234/1585151401/600x200"
        alt=""
      />
    </div>
    <div class="p-4">
      <div class="relative flex w-full">
        <div class="flex flex-1">
          <div style="margin-top: -6rem">
            <div
              style="height: 9rem; width: 9rem"
              class="md rounded-full relative avatar"
            >
              <img
                style="height: 9rem; width: 9rem"
                class="md rounded-full relative border-4 border-gray-900"
                src="/avatar.png"
                alt=""
              />
              <div class="absolute"></div>
            </div>
          </div>
        </div>
        <div class="flex flex-rows text-right gap-4">
          <NuxtLink
            :to="`/collator/${props.data?.cust_no}`"
            for="modal-collateral"
            class="btn btn-sm btn-bordered"
          >
            ຫຼັກຊັບຄ້ຳປະກັນ
          </NuxtLink>
          <NuxtLink
            :to="`/qtions/${props.data?.cust_no}`"
            v-if="props.data?.activity?.answer != 100"
            class="btn btn-sm btn-bordered btn-error"
            >ຕອບແບບສອບຖາມ
            <div class="badge ml-2">
              {{ props.data?.activity?.answer }} %
            </div></NuxtLink
          >
        </div>
      </div>
      <div class="space-y-1 justify-center w-full mt-3 ml-3">
        <div>
          <h2 class="text-xl leading-6 font-bold text-white">
            {{ props.data?.fullname }}
          </h2>
        </div>
        <div class="mt-3">
          <p class="text-white leading-tight mb-2">
            {{ props.data?.company }}
          </p>
          <div class="text-gray-600 flex">
            <span class="flex mr-2"
              ><svg viewBox="0 0 24 24" class="h-5 w-5 paint-icon">
                <g>
                  <path
                    d="M11.96 14.945c-.067 0-.136-.01-.203-.027-1.13-.318-2.097-.986-2.795-1.932-.832-1.125-1.176-2.508-.968-3.893s.942-2.605 2.068-3.438l3.53-2.608c2.322-1.716 5.61-1.224 7.33 1.1.83 1.127 1.175 2.51.967 3.895s-.943 2.605-2.07 3.438l-1.48 1.094c-.333.246-.804.175-1.05-.158-.246-.334-.176-.804.158-1.05l1.48-1.095c.803-.592 1.327-1.463 1.476-2.45.148-.988-.098-1.975-.69-2.778-1.225-1.656-3.572-2.01-5.23-.784l-3.53 2.608c-.802.593-1.326 1.464-1.475 2.45-.15.99.097 1.975.69 2.778.498.675 1.187 1.15 1.992 1.377.4.114.633.528.52.928-.092.33-.394.547-.722.547z"
                  ></path>
                  <path
                    d="M7.27 22.054c-1.61 0-3.197-.735-4.225-2.125-.832-1.127-1.176-2.51-.968-3.894s.943-2.605 2.07-3.438l1.478-1.094c.334-.245.805-.175 1.05.158s.177.804-.157 1.05l-1.48 1.095c-.803.593-1.326 1.464-1.475 2.45-.148.99.097 1.975.69 2.778 1.225 1.657 3.57 2.01 5.23.785l3.528-2.608c1.658-1.225 2.01-3.57.785-5.23-.498-.674-1.187-1.15-1.992-1.376-.4-.113-.633-.527-.52-.927.112-.4.528-.63.926-.522 1.13.318 2.096.986 2.794 1.932 1.717 2.324 1.224 5.612-1.1 7.33l-3.53 2.608c-.933.693-2.023 1.026-3.105 1.026z"
                  ></path>
                </g>
              </svg>
              <a
                href="https://ricardoribeirodev.com/personal/"
                target="#"
                class="leading-5 ml-1 text-blue-400"
                >{{ props.data?.email }}</a
              ></span
            >
            <span class="flex mr-2"
              ><svg viewBox="0 0 24 24" class="h-5 w-5 paint-icon">
                <g>
                  <path
                    d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"
                  ></path>
                  <circle cx="7.032" cy="8.75" r="1.285"></circle>
                  <circle cx="7.032" cy="13.156" r="1.285"></circle>
                  <circle cx="16.968" cy="8.75" r="1.285"></circle>
                  <circle cx="16.968" cy="13.156" r="1.285"></circle>
                  <circle cx="12" cy="8.75" r="1.285"></circle>
                  <circle cx="12" cy="13.156" r="1.285"></circle>
                  <circle cx="7.032" cy="17.486" r="1.285"></circle>
                  <circle cx="12" cy="17.486" r="1.285"></circle>
                </g>
              </svg>
              <span class="leading-5 ml-1">{{ props.data?.mobile }}</span></span
            >
            <span class="flex mr-2"
              ><svg viewBox="0 0 24 24" class="h-5 w-5 paint-icon">
                <g>
                  <path
                    d="M19.708 2H4.292C3.028 2 2 3.028 2 4.292v15.416C2 20.972 3.028 22 4.292 22h15.416C20.972 22 22 20.972 22 19.708V4.292C22 3.028 20.972 2 19.708 2zm.792 17.708c0 .437-.355.792-.792.792H4.292c-.437 0-.792-.355-.792-.792V6.418c0-.437.354-.79.79-.792h15.42c.436 0 .79.355.79.79V19.71z"
                  ></path>
                  <circle cx="7.032" cy="8.75" r="1.285"></circle>
                  <circle cx="7.032" cy="13.156" r="1.285"></circle>
                  <circle cx="16.968" cy="8.75" r="1.285"></circle>
                  <circle cx="16.968" cy="13.156" r="1.285"></circle>
                  <circle cx="12" cy="8.75" r="1.285"></circle>
                  <circle cx="12" cy="13.156" r="1.285"></circle>
                  <circle cx="7.032" cy="17.486" r="1.285"></circle>
                  <circle cx="12" cy="17.486" r="1.285"></circle>
                </g>
              </svg>
              <span class="leading-5 ml-1">{{
                String(props.data?.createdAt).substr(0, 10)
              }}</span></span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="delConfirm">
      <div class="modal-box w-60">
        <p class="py-4 text-center">ທ່ານຢືນຢັນລົບລາຍການນີ້ບໍ</p>
        <div class="flex justify-between">
          <button
            @click="trashUser(`${props.data?.cust_no}`)"
            class="btn btn-sm btn-error"
          >
            ຍອມຮັບ
          </button>
          <a href="#" class="btn btn-sm">ຍົກເລີກ</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const token = useCookie("autKey");
const BaseApi = useRuntimeConfig().public.BASE_URL_API;
const props = defineProps({
  data: {
    type: Object,
  },
});

const handlePrint = (str) => {
  window.open(`/print/crs/${str}`, "", "width=900,height=700");
};

const trashUser = (str) => {
  $fetch(`${BaseApi}customer/${str}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  }).then((res) => {
    navigateTo("/customer");
  });
};
</script>