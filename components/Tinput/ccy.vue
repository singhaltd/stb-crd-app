<script setup lang="ts">
import { watch } from "vue";
import { useCurrencyInput } from "vue-currency-input";
import { useField } from "vee-validate";

const props = defineProps({
  name: String,
  options: Object,
  class: String,
  placeholder: String,
  disabled: Boolean,
});
const { formattedValue, inputRef, numberValue } = useCurrencyInput(
  props.options
);
const { errorMessage, handleChange } = useField(props.name);
watch(formattedValue, (newValue) => {
  if (newValue === "") {
    handleChange(undefined);
    return;
  }
  const newNumber = Number(newValue);
  if (Number.isNaN(newNumber)) {
    return;
  }
  handleChange(newNumber);
});
</script>

<template>
  <div>
    <input
      ref="inputRef"
      type="text"
      :value="formattedValue ? formattedValue : placeholder"
      :class="class"
      :placeholder="placeholder"
      :disabled="disabled ? disabled : false"
    />
    <!-- <span class="error">{{ errorMessage }}</span> -->
  </div>
</template>