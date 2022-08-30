<script setup>
const props = defineProps({
  data: {
    type: Object,
    default: [],
  },
});
const solid = [
  ...new Map(props.data?.solid.map((item) => [item["seq"], item])).values(),
];
const lcyResult = computed((str) => str);
</script>

<template>
  <div>
    <div class="w-full mt-4">
      <h1 class="text-bloder"></h1>
      <!-- {{ data }} -->
      <div v-if="data?.solid.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ລາຄາທີ່ດິນ ແລະ ສິ່ງປຸກສ້າງ
        </h1>
        <table
          class="table-compact w-full mt-5"
          v-for="(si, i) in solid"
          :key="i"
        >
          <tbody>
            <tr>
              <td>ປະເພດຫຼັກຊັບຄ້ຳປະກັນ</td>
              <td class="border text-center">ໃບຕາດິນເລກທີ</td>
              <td class="border text-center">ເນື້ອທີ່</td>
              <td class="border text-center">ຊື່ເຈົ້າຂອງຫຼັກຊັບ</td>
              <td class="border text-center">ລົງວັນທີ່</td>
              <td class="border text-center">ທີ່ຕັ້ງຂອງຫຼັກຊັບຄ້ຳປະກັນ</td>
              <td class="text-right border">ມູນຄ່າວິຊາການປະເມິນ</td>
              <td class="text-right border">ມູນຄ້າໂຕຈິງຕາມທ້ອງຕະຫຼາດປະເມິນ</td>
              <td class="text-right border">ມູນຄ້າອົງການຄຸ້ມຄອງທີ່ດິນປະເມິນ</td>
              <td class="text-right border">ມູນຄ່າລວມປະເມີນ</td>
            </tr>
            <tr
              v-for="(x, i) in data?.solid.filter((t) => t.seq == si.seq)"
              :key="i"
            >
              <td class="border">
                {{ x.building_key !== null ? "ສິ່ງປຸກສ້າງ" : "ທີ່ດິນ" }}
              </td>
              <td class="text-right border">
                {{ x.doc_no }}
              </td>
              <td class="text-right border">
                {{ x.size }}
              </td>
              <td class="text-right border">
                {{ x.owner }}
              </td>
              <td class="text-right border">
                {{
                  String(x.issue_date).substr(0, 10) != "null"
                    ? String(x.issue_date).substr(0, 10)
                    : ""
                }}
              </td>
              <td class="text-right border"></td>
              <td class="text-right border">
                {{ x.price_officer.toLocaleString("en-UK") }}
              </td>
              <td class="text-right border">
                {{ x.price_market.toLocaleString("en-UK") }}
              </td>
              <td class="text-right border">
                {{ x.price_org.toLocaleString("en-UK") }}
              </td>
              <td class="text-right border">
                {{
                  (
                    ((x.price_officer + x.price_market + x.price_org) / 3) *
                    x.size
                  ).toLocaleString("en-UK")
                }}
              </td>
            </tr>
            <tr>
              <td colspan="9" class="text-right border">
                ລວມມູນຄ່າຕອນທີ່ {{ i+1 }}:
              </td>
              <td class="border">{{lcyResult}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--- Account -->
      <div v-if="data?.account.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ບັນຊີເງິນຝາກ
        </h1>
        <table class="table-compact border w-full">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ເລກບັນຊີເງິນຝາກ</td>
              <td class="border">CIF</td>
              <td class="border">ຊື່ເຈົ້າຂອງບັນຊີ</td>
              <td class="border">ວ ດ ປີ ເປີດ</td>
              <td class="border">ວ ດ ປີ ໝົດກຳນົດ</td>
              <td class="border">ໄລຍະເວລາຝາກ</td>
              <td class="border">ສະກຸນເງິນຝາກ</td>
              <td class="border">ອັດຕາດອກເບັ້ຍ</td>
              <td class="border">ທີ່ຢູ່</td>
              <td class="border">ມູນຄ່າເງິນຝາກ</td>
            </tr>
            <tr v-for="(x, n) in data?.account" :key="n">
              <td rowspan="1" class="border text-center">
                <p>{{ n + 1 }}</p>
              </td>
              <td class="border">{{ x.ac_no }}</td>
              <td class="border">{{ x.cif }}</td>
              <td class="border">{{ x.ac_name }}</td>
              <td class="border">{{ x.open_date.substr(0, 10) }}</td>
              <td class="border">{{ x.expire_date.substr(0, 10) }}</td>
              <td class="border"></td>
              <td class="border">{{ x.ccy }}</td>
              <td class="border">{{ x.interest }}</td>
              <td class="border"></td>
              <td class="border">{{ x.amount.toLocaleString("en-UK") }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- vihicle -->
      <div v-if="data?.vihicle.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ຍານພາຫະນະ
        </h1>
        <table class="table-compact w-full mt-5">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ປະເພດລົດ</td>
              <td class="border text-center">ຍີ່ຫໍ້ລົດ</td>
              <td class="border text-center">ລຸ້ນ</td>
              <td class="border text-center">ສີ</td>
              <td class="border text-center">ເລກທະບຽນ</td>
              <td class="border text-center">ເລກຈັກ</td>
              <td class="text-right border">ເລກຖັງ</td>
              <td class="text-right border">ອອກໃຫ້ວັນທີ</td>
              <td class="text-right border">ເຖີງວັນທີ</td>
              <td class="text-right border">ຊື່ເຈົ້າຂອງລົດ</td>
              <td class="text-right border">ທີ່ຢູ່</td>
              <td class="text-right border">ມູນຄ່າ (ກີບ)</td>
            </tr>
            <tr v-for="(x, i) in data?.vihicle" :key="i">
              <td class="border text-center">{{ x.seq }}</td>
              <td class="border"></td>
              <td class="border text-center">{{ x.brand }}</td>
              <td class="border text-center">{{ x.model }}</td>
              <td class="border text-center">{{ x.color }}</td>
              <td class="border text-center">{{ x.vh_registration }}</td>
              <td class="border text-center">{{ x.engine }}</td>
              <td class="text-right border">{{ x.tank }}</td>
              <td class="text-right border">{{ x.issue_date }}</td>
              <td class="text-right border">{{ x.expire_date }}</td>
              <td class="border">{{ x.owner }}</td>
              <td class="text-right border"></td>
              <td class="text-right border">
                {{ x.vh_value.toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- project -->
      <div v-if="data?.projects.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ໂຄງການ
        </h1>
        <table class="table-compact w-full mt-5">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ຊື່ໂຄງການ</td>
              <td class="border text-center">ເລກທີ</td>
              <td class="border text-center">ລົງວັນທີ</td>
              <td class="border text-center">ມື້ໝົດສັນຍາໂຄງການ</td>
              <td class="border text-right">ມູນຄ່າໂຄງການ</td>
              <td class="border text-right">ມູນຄ່າເບີກຈ່າຍກ່ອນ</td>
              <td class="text-right border">ມູນຄ່າຍັງເຫຼືອ</td>
              <td class="text-right border">ທີ່ຢູ່</td>
              <td class="text-right border">ມູນຄ່າຫຼັກຊັບ (ກີບ)</td>
            </tr>
            <tr v-for="(x, i) in data?.projects" :key="i">
              <td class="border text-center">{{ i + 1 }}</td>
              <td class="border">{{ x.name }}</td>
              <td class="border text-center">{{ x.doc_no }}</td>
              <td class="border text-center">
                {{ String(x.issue_date).substr(0, 10) }}
              </td>
              <td class="border text-center">
                {{ String(x.expire_date).substr(0, 10) }}
              </td>
              <td class="border text-right">
                {{ Number(x.value).toLocaleString("en-UK") }}
              </td>
              <td class="border text-right">
                {{ Number(x.pi_value).toLocaleString("en-UK") }}
              </td>
              <td class="text-right border">
                {{ Number(x.cur_value).toLocaleString("en-UK") }}
              </td>
              <td class="text-right border"></td>
              <td class="text-right border">
                {{ Number(x.lcy_total).toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- in project -->
      <div v-if="data?.building.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ທີ່ດິນໃນໂຄງການສຳປະທານ
        </h1>
        <table class="table-compact w-full mt-5">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ຊື່ໂຄງການສຳປະທານ</td>
              <td class="border text-center">ເລກທີ</td>
              <td class="border text-center">ລົງວັນທີ</td>
              <td class="border text-center">ມື້ໝົດສັນຍາໂຄງການ</td>
              <td class="border text-right">ມູນຄ່າໂຄງການ</td>
              <td class="text-right border">ທີ່ຢູ່</td>
              <td class="text-right border">ມູນຄ່າຫຼັກຊັບ (ກີບ)</td>
            </tr>
            <tr v-for="(x, i) in data?.projects" :key="i">
              <td class="border text-center">{{ i + 1 }}</td>
              <td class="border">{{ x.name }}</td>
              <td class="border text-center">{{ x.doc_no }}</td>
              <td class="border text-center">
                {{ String(x.issue_date).substr(0, 10) }}
              </td>
              <td class="border text-center">
                {{ String(x.expire_date).substr(0, 10) }}
              </td>
              <td class="border text-right">
                {{ Number(x.value).toLocaleString("en-UK") }}
              </td>
              <td class="text-right border"></td>
              <td class="text-right border">
                {{ Number(x.lcy_total).toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- building -->
      <div v-if="data?.building.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ຕຶກອາຄານ ແລະ ໂຮງງານ
        </h1>
        <table class="table-compact w-full mt-5">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ປະເພດຫຼັກຊັບຄ້ຳປະກັນ</td>
              <td class="border text-center">ຊື່ເຈົ້າຂອງຫຼັກຊັບ</td>
              <td class="border text-center">ເລກທີ</td>
              <td class="border text-center">ລົງວັນທີ</td>
              <td class="border text-right">ມູນຄ່າ</td>
              <td class="text-right border">ທີ່ຢູ່</td>
              <td class="text-right border">ມູນຄ່າຫຼັກຊັບ (ກີບ)</td>
            </tr>
            <tr v-for="(x, i) in data?.building" :key="i">
              <td class="border text-center">{{ i + 1 }}</td>
              <td class="border">{{ x.name }}</td>
              <td class="border text-center">{{ x.doc_no }}</td>
              <td class="border text-center">
                {{ String(x.issue_date).substr(0, 10) }}
              </td>
              <td class="border text-center">
                {{ String(x.expire_date).substr(0, 10) }}
              </td>
              <td class="border text-right">
                {{ Number(x.value).toLocaleString("en-UK") }}
              </td>
              <td class="text-right border"></td>
              <td class="text-right border">
                {{ Number(x.lcy_total).toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Machin -->
      <div v-if="data?.machines.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">
          ຫຼັກຊັບ ເຄື່ອງຈັກ
        </h1>
        <table class="table-compact w-full">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ປະເພດເຄື່ອງຈັກ</td>
              <td class="border">ລະຫັດເຄື່ອງຈັກ</td>
              <td class="border">ປີຜະລິດ</td>
              <td class="border">ປີຊື້ເຄື່ອງຈັກ</td>
              <td class="border text-center">ສະພາບເຄື່ອງຈັກ</td>
              <td class="border text-right">ມູນຄ່າຕາມໃບບິນ</td>
              <td class="border text-right">ມູນຄ່າປະຈຸບັນ</td>
              <td class="border">ບ້ານ</td>
              <td class="border">ເມືອງ</td>
              <td class="border">ແຂວງ</td>
              <td class="border text-right">ມູນຄ່າຫຼັກຊັບ (ກີບ)</td>
            </tr>
            <tr v-for="(x, n) in data?.machines" :key="n">
              <td rowspan="1" class="border text-center">
                <p>{{ n + 1 }}</p>
              </td>
              <td class="border"></td>
              <td class="border">{{ x.model_no }}</td>
              <td class="border">{{ x.manual_year }}</td>
              <td class="border">{{ x.buy_year }}</td>
              <td class="border text-center">{{ x.mac_percent }} %</td>

              <td class="border text-right">
                {{ x.buy_price.toLocaleString("en-UK") }}
              </td>
              <td class="border text-right">
                {{ x.cur_price.toLocaleString("en-UK") }}
              </td>
              <td class="border">{{ x.village }}</td>
              <td class="border">%</td>
              <td class="border">%</td>
              <td class="border text-right">
                {{ x.lcy_total.toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="data?.other.length > 0">
        <h1 class="text-md py-5 underline underline-offset-4">ຫຼັກຊັບ ອື່ນໆ</h1>
        <table class="table-compact w-full">
          <tbody>
            <tr>
              <td class="border text-center">ລ.ດ</td>
              <td class="border">ຊື່ເຈົ້າຂອງຫຼັກຊັບ</td>
              <td class="border">ເລກທີໃບຮັບຮອງ</td>
              <td class="border">ລົງວັນທີ</td>
              <td class="border">ຮັບຮອງຈາກ</td>
              <td class="border">ນ້ຳໜັກ</td>
              <td class="border">ຫົວໜ່ວຍ</td>
              <td class="border text-right">ມູນຄ່າ</td>
              <td class="border text-right">ມູນຄ່າຫຼັກຊັບ (ກີບ)</td>
            </tr>
            <tr v-for="(x, n) in data?.other" :key="n">
              <td rowspan="1" class="text-center border">
                <p>{{ n + 1 }}</p>
              </td>
              <td class="border">{{ x.owner }}</td>
              <td class="border">{{ x.doc_no }}</td>
              <td class="border">{{ x.issue_date.substr(0, 10) }}</td>
              <td class="border">{{ x.verify_by }}</td>
              <td class="border">{{ x.weight }}</td>
              <td class="border">{{ x.unit }}</td>
              <td class="border text-right">
                {{ x.price.toLocaleString("en-UK") }}
              </td>
              <td class="border text-right">
                {{ x.total.toLocaleString("en-UK") }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>