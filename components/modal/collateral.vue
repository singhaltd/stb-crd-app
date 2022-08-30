<script setup>
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/vue";
</script>
<template>
  <div>
    <input type="checkbox" id="modal-collateral" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box w-11/12 max-w-5xl">
        <h3 class="font-bold text-lg">ຫຼັກຊັບຄ້ຳປະກັນ</h3>
        <TabGroup>
          <TabList class="tabs">
            <Tab v-slot="{ selected }" as="template">
              <div
                :class="[
                  selected
                    ? 'tab tab-md tab-lifted gap-2 tab-active'
                    : 'tab tab-md tab-lifted gap-2',
                ]"
              >
                asdfsad
                <div class="badge">0%</div>
              </div>
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel> dsafas </TabPanel>
          </TabPanels>
        </TabGroup>
        <div class="modal-action">
          <label for="modal-collateral" class="btn">Yay!</label>
        </div>
      </div>
    </div>
  </div>
</template>
