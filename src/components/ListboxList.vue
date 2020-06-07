<template>
  <ul
    tabindex="-1"
    role="listbox"
    ref="list"
    :aria-activedescendant="activeOptionId"
    :aria-labelledby="labelledBy"
    @blur="onBlur"
    @mouseleave="$emit('resetActive')"
    @keydown.tab.prevent
    @keydown.esc.prevent="$emit('close')"
    @keydown.up.prevent="$emit('focusPrev')"
    @keydown.down.prevent="$emit('focusNext')"
    @keydown.enter.prevent="$emit('selectActive')"
    @keydown.exact="type"
  >
    <slot v-for="item in items" :item="item" />
  </ul>
</template>

<script>
export default {
  props: {
    items: Array,
    labelledBy: String,
    typeahead: String,
    activeOptionId: String,
    buttonRef: HTMLButtonElement
  },
  mounted() {
    this.$emit("setListRef", this.$refs.list);
  },
  beforeDestroy() {
    this.$emit("setListRef", null);
  },
  methods: {
    type(e) {
      if (Number.isInteger(e.key) || e.key.length !== 1) {
        return;
      }

      if (e.key === "Spacebar" || e.key === " ") {
        if (this.typeahead !== "") {
          this.$emit("type", " ");
        } else {
          this.$emit("selectActive");
        }

        return;
      }

      e.preventDefault();
      return this.$emit("type", e.key);
    },
    onBlur(e) {
      // Prevent closing when clicking on the button
      // as the button will toggle the list anyways
      if (e.relatedTarget === this.buttonRef) {
        return;
      }

      this.$emit("close");
    }
  }
};
</script>
