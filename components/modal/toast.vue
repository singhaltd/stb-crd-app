<template>
  <div>
    <input
      type="checkbox"
      id="my-modal-3"
      :checked="toast?.state | false"
      class="modal-toggle"
    />
    <div class="modal">
      <div class="modal-box" style="max-width: 400px">
        <div class="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 mx-auto"
            v-if="toast?.type == 'success'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="red"
            stroke-width="2"
            v-if="toast?.type == 'error'"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div class="mt-3">{{ message }}</div>
          <div class="mt-3">{{ toast?.data }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const toast = useSnakeToast();
const tiktime = ref(0);
defineProps({
  check: { type: Boolean, default: false },
  data: { type: String, default: "" },
});

watch(toast, () => {
  if (toast.value) {
    let reset = setTimeout(() => {
      toast.value = { state: false, message: "", data: "" };
      tiktime.value++;
    }, 2000);
    if (tiktime.value > 0) {
      tiktime.value = 0;
      clearTimeout(reset);
    }
  }
});
const message = computed(() => {
  return toast.value?.type == "success" ? "ສຳເລັດ" : "ບໍ່ສຳເລັດ";
});
</script>

<style>
</style>