<template>
  <div>
    {{ props.error }}
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object,
});

clearError({ redirect: "/" });
</script>