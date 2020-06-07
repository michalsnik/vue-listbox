<template>
  <span :id="id">
    <slot />
  </span>
</template>

<script>
export default {
  props: {
    id: String
  }
};
</script>
