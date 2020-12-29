<template>
  <div class="container" :style="{'max-width': maxWidth}">
    <slot />
  </div>
</template>
<script>
import Vue from 'vue';
export default Vue.extend({
  props: {
    maxWidth: {
      required: false,
      default: '1200px'
    }
  }
})
</script>
<style lang="scss">
.container {
  margin: 0 auto;
  //border: 1px solid blue;
}
</style>
