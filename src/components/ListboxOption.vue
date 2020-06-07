<template>
  <li
    :id="id"
    role="option"
    :aria-selected="isSelected"
    @click="$emit('select', value)"
    @mousemove="$emit('setActiveValue', value)"
  >
    <slot :is-active="isActive" :isSelected="isSelected" />
  </li>
</template>

<script>
import uuid from "../uuid";

export default {
  props: {
    activeValue: String,
    selectedValue: String,
    value: String
  },
  data() {
    return {
      id: uuid()
    };
  },
  computed: {
    isActive() {
      return this.value === this.activeValue;
    },
    isSelected() {
      return this.value === this.selectedValue;
    }
  },
  mounted() {
    this.$emit("registerOption", {
      id: this.id,
      value: this.value,
      ref: this.$el
    });
  },
  beforeDestroy() {
    this.$emit("unregisterOption", this.value);
  }
};
</script>
