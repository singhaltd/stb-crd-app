<template>
  <div class="">
    <input type="text" :value="selected" @input="updateValue($event.target.value)">
    <Combobox v-model="selected">
      <div class="relative mt-1">
        <div
          class="
            relative
            w-full
            cursor-default
            overflow-hidden
            rounded-lg
            text-left
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-white
            focus-visible:ring-opacity-75
            focus-visible:ring-offset-2
            focus-visible:ring-offset-teal-300
            sm:text-sm
          "
        >
          <ComboboxInput
            class="
              bg-gray-50
              border border-gray-300
              text-gray-900 text-sm
              rounded-lg
              focus:ring-blue-500 focus:border-blue-500
              block
              w-full
              p-2.5
              dark:bg-gray-700
              dark:border-gray-600
              dark:placeholder-gray-400
              dark:text-white
              dark:focus:ring-blue-500
              dark:focus:border-blue-500
            "
            :displayValue="(it) => it"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="
              absolute
              mt-1
              max-h-60
              w-full
              overflow-auto
              rounded-md
              bg-white
              py-1
              text-base
              shadow-lg
              ring-1 ring-black ring-opacity-5
              focus:outline-none
              sm:text-sm
            "
          >
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="
                relative
                cursor-default
                select-none
                py-2
                px-4
                text-gray-700
              "
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="it in filteredPeople"
              as="template"
              :key="it.id"
              :value="it"
              v-slot="{ selected, active }"
            >
              <li
                class="relative cursor-default select-none py-2 pl-10 pr-4"
                :class="{
                  'bg-teal-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ it.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-teal-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

const items = defineProps({
  items: ref(Object),
});

let selected = ref(items[0]);
let query = ref("");

let filteredPeople = computed(() =>
  query.value === ""
    ? items.items
    : items.items.filter((it) => {
        return it.name
          .toLowerCase()
          .replace(/\s+/g, "")
          .includes(query.value.toLowerCase().replace(/\s+/g, ""));
      })
);

const updateValue = (value) => {
  this.$emit("input", value);
};
</script>
