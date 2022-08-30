<script setup>
const props = defineProps({
  numpage: {
    type: Number,
    default: 0,
  },
  title: {
    type: String,
    default: "",
  },
  action: {
    type: String,
    default: "",
  },
  totalPage: {
    type: String,
  },
});
const emits = defineEmits([
  "totalPage",
  "delete",
  "create",
  "update:totalPage",
]);
</script>
<template>
  <div>
    <div class="flex justify-between my-2">
      <div>{{ title }}</div>
      <div class="flex">
        <select
          class="select select-sm bg-base-200 mr-4 select-bordered"
          @input="emits('update:totalPage', $event.target.value)"
        >
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="150">150</option>
          <option value="200">200</option>
          <option value="">ທັງໝົດ</option>
        </select>
        <div class="rounded-lg input input-bordered input-sm px-0 py-0">
          <slot name="search"></slot>
        </div>
        <slot name="action"></slot>
        <button
          type="button"
          class="rounded-lg btn-sm btn btn-primary px-3 ml-2"
          @click="handleCrate"
          v-if="action"
        >
          +
        </button>
        <ActionDrop />
      </div>
    </div>
    <slot name="body"></slot>
    <div class="flex justify-between mt-4 mb-4" v-if="props.numpage > 1">
      <div></div>
      <div class="btn-group">
        <router-link
          :to="`?page=${i}`"
          custom
          v-slot="{ href, navigate, isActive }"
          v-for="i in props.numpage"
          :key="i"
        >
          <a
            :href="href"
            @click="navigate"
            :class="[
              isActive
                ? 'btn btn-sm btn-active btn-primary'
                : 'btn btn-sm btn-primary',
            ]"
            >{{ i }}
          </a>
        </router-link>
      </div>
    </div>
  </div>
</template>