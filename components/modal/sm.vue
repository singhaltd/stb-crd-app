<template>
  <div>
    <slot name="button" />
    <input type="checkbox" id="my-modal" class="modal-toggle" />
    <div class="modal">
      <div
        class="modal-box overflow-hidden max-h-[90vh] pt-0 px-0 pb-5 relative"
      >
        <div class="sticky top-0 bg-base-100 z-9 px-5 pt-3">
          <label
            for="my-modal"
            class="btn btn-xs btn-circle btn-error absolute right-2 top-2"
            >✕</label
          >
          <h3 class="font-bold text-md mb-3">
            <slot name="title"></slot>
          </h3>
        </div>

        <div class="w-full max-h-[80vh] overflow-y-auto pb-5 px-4">
          <slot name="body"></slot>
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