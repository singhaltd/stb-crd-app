<template>
  <div>
    <TablePanel
      :numpage="1"
      :v-model="perpage"
      @create="isActive = isActive = true"
      title="ລູກຄ້າ"
    >
      <div class="overflow-x-auto">
        <table class="table w-full table-compact">
          <!-- head -->
          <thead>
            <tr>
              <th>
                <label>
                  <input
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    name="checkme"
                  />
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
                  <input
                    type="checkbox"
                    name="checkme"
                    class="checkbox checkbox-sm"
                  />
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
              <td>{{ dt.email }}</td>
              <td>{{ dt.mobile }}</td>
              <td>{{ dt.company }}</td>
              <td>{{ dt.cust_cate.name }}</td>
              <td>{{ dt.lntype.name }}</td>
              <td>{{ dt.perpose }}</td>
              <th>
                <div class="flex justify-content">
                  <div class="flex">
                    <div
                      class="tooltip"
                      data-tip="ຍັງບໍ່ຕອບແບບສອບຖາມ"
                      v-if="dt.rec_stat == 'N'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <NuxtLink
                    :to="`/customer/${dt.cust_no}`"
                    class="btn btn-ghost btn-xs"
                    >view</NuxtLink
                  >
                </div>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </TablePanel>
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