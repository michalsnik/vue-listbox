<template>
  <div>
    <slot
      :is-open="isOpen"
      :components="{
        label: listboxLabelComponent,
        button: listboxButtonComponent,
        list: listboxListComponent,
        option: listboxOptionComponent
      }"
    />
  </div>
</template>

<script>
import debounce from "debounce";
import uuid from "../uuid";

import ListboxLabel from "./ListboxLabel.vue";
import ListboxButton from "./ListboxButton.vue";
import ListboxList from "./ListboxList.vue";
import ListboxOption from "./ListboxOption.vue";

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    items: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      isOpen: false,
      activeValue: this.value,
      labelId: uuid(),
      buttonId: uuid(),
      typeahead: "",
      listRef: null,
      buttonRef: null,
      options: []
    };
  },

  computed: {
    activeIndex() {
      return this.items.findIndex(item => item === this.activeValue);
    },

    activeOption() {
      return this.options.find(o => o.value === this.activeValue);
    },

    listboxLabelComponent() {
      const vm = this;
      return {
        render(h) {
          return h(ListboxLabel, {
            props: {
              id: vm.labelId
            },
            scopedSlots: this.$scopedSlots
          });
        }
      };
    },

    listboxButtonComponent() {
      const vm = this;
      return {
        render(h) {
          return h(ListboxButton, {
            props: {
              id: vm.buttonId,
              labelId: vm.labelId,
              isOpen: vm.isOpen
            },
            on: {
              setButtonRef: vm.setButtonRef,
              toggle: vm.toggle
            },
            scopedSlots: this.$scopedSlots
          });
        }
      };
    },

    listboxListComponent() {
      const vm = this;
      return {
        render(h) {
          return h(ListboxList, {
            props: {
              labelledBy: `${vm.buttonId} ${vm.labelId}`,
              typeahead: vm.typeahead,
              activeOptionId: vm.activeOption?.id,
              buttonRef: vm.buttonRef,
              items: vm.items
            },
            on: {
              setListRef: vm.setListRef,
              close: vm.close,
              focusPrev: vm.focusPrev,
              focusNext: vm.focusNext,
              selectActive: vm.selectActive,
              resetActive: vm.resetActive,
              type: vm.type
            },
            scopedSlots: this.$scopedSlots
          });
        }
      };
    },

    listboxOptionComponent() {
      const vm = this;
      return {
        props: {
          value: String
        },
        render(h) {
          return h(ListboxOption, {
            props: {
              activeValue: vm.activeValue,
              selectedValue: vm.value,
              value: this.$props.value
            },
            on: {
              registerOption: vm.registerOption,
              unregisterOption: vm.unregisterOption,
              select: vm.selectOption,
              setActiveValue: vm.setActiveValue
            },
            scopedSlots: this.$scopedSlots
          });
        }
      };
    }
  },

  methods: {
    setListRef(ref) {
      this.listRef = ref;
    },

    setButtonRef(ref) {
      this.buttonRef = ref;
    },

    toggle() {
      this.isOpen ? this.close() : this.open();
    },

    open() {
      this.isOpen = true;

      this.focus(this.value);

      this.$nextTick(() => {
        this.listRef.focus();
      });
    },

    close() {
      this.isOpen = false;
      this.buttonRef.focus();
    },

    focusPrev() {
      const indexToFocus = Math.max(this.activeIndex - 1, 0);
      this.focus(this.options[indexToFocus]?.value);
    },

    focusNext() {
      const indexToFocus = Math.min(
        this.activeIndex + 1,
        this.options.length - 1
      );
      this.focus(this.options[indexToFocus]?.value);
    },

    setActiveValue(value) {
      this.activeValue = value;
    },

    resetActive() {
      this.setActiveValue("");
    },

    selectActive() {
      this.selectOption(this.activeValue);
    },

    type(key) {
      this.typeahead = this.typeahead + key;

      const matchedOption = this.options.find(o =>
        o.value.toLowerCase().includes(this.typeahead)
      );

      if (matchedOption) {
        this.focus(matchedOption.value);
      }

      this.clearTypeahead();
    },

    clearTypeahead: debounce(function() {
      this.typeahead = "";
    }, 500),

    registerOption(option) {
      this.options.push(option);
    },

    unregisterOption(value) {
      const index = this.options.findIndex(o => o.value === value);
      if (index > -1) {
        this.options.splice(index, 1);
      }
    },

    selectOption(value) {
      this.$emit("input", value);
      this.$nextTick(() => {
        this.close();
      });
    },

    focus(value) {
      this.setActiveValue(value);

      if (!value) {
        return;
      }

      this.$nextTick(() => {
        this.activeOption?.ref?.scrollIntoView({
          block: "nearest"
        });
      });
    }
  }
};
</script>
