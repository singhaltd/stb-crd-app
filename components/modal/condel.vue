<template>
  <div>
    <input type="checkbox" id="MdalCondel" class="modal-toggle" />
    <div class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">ຢືນຢັນການລົບລາຍການ</h3>
        <p class="py-4">ທ່ານຕ້ອງການລົບລາຍການນີ້ບໍ?</p>
        <div class="modal-action">
          <slot />
          <label for="MdalCondel" class="btn">ຍົກເລີກ</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>