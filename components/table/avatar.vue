<template>
  <div>
    <div class="overflow-x-auto w-full">
      <table class="table w-full">
        <!-- head -->
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" class="checkbox" name="checkme" />
              </label>
            </th>
            <th v-for="x in column" :key="x">{{ x }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dt in items" :key="dt">
            <th>
              <label>
                <input type="checkbox" name="checkme" class="checkbox" />
              </label>
            </th>
            <td>
              <div class="flex items-center space-x-3">
                <div class="avatar">
                  <div class="mask mask-squircle w-8 h-8">
                    <img
                      v-if="dt == 'image'"
                      src="/tailwind-css-component-profile-2@56w.png"
                      alt="Avatar Tailwind CSS Component"
                    />
                    <svg
                      v-else
                      class="absolute w-10 h-10 text-gray-400 -left-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <div class="font-bold">{{ dt.fullname }}</div>
                </div>
              </div>
            </td>
            <td>
              {{ dt.email }}
            </td>
            <td>{{ dt.mobile }}</td>
            <td>{{ dt.restrict_auth }}</td>
            <td>{{ dt.restrict_address }}</td>
            <td>{{ dt.created_at }}</td>
            <th>
              <NuxtLink
                :to="`/users/${dt.username}`"
                class="btn btn-ghost btn-xs"
                >view</NuxtLink
              >
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    footer: {
      type: Boolean,
      default: false,
    },
    column: {
      type: Array,
    },
    items: {
      type: Object,
    },
  },
};
</script>

<style>
</style>