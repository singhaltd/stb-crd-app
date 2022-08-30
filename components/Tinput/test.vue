<template>
    <div>
        <input type="text" v-on:mask="['###.###.###-##', '##.###.###/####-##']">
    </div>
</template>

<script>
import { mask } from "vue-the-mask";
export default {
  directives: { mask },
};
</script>