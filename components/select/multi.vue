<template>
  <Combobox v-model="selectedPeople" multiple>
    <ul v-if="selectedPeople.length > 0">
      <li v-for="person in selectedPeople" :key="person.id">
        {{ person.name }}
      </li>
    </ul>
    <ComboboxInput :displayValue="(person) => person.name" class="select select-sm select-bordered" />
    <ComboboxOptions>
      <ComboboxOption v-for="person in people" :key="person" :value="person">
        {{ person.name }}
      </ComboboxOption>
    </ComboboxOptions>
  </Combobox>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];
const selectedPeople = ref([]);
</script>