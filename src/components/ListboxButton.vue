<template>
  <button
    type="button"
    ref="button"
    :id="id"
    aria-haspopup="listbox"
    :aria-labelledby="`${labelId} ${id}`"
    :aria-expanded="isOpen"
    @click="$emit('toggle')"
  >
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    id: String,
    labelId: String,
    isOpen: Boolean
  },
  mounted() {
    this.$emit("setButtonRef", this.$refs.button);
  },
  beforeDestroy() {
    this.$emit("setButtonRef", null);
  }
};
</script>
