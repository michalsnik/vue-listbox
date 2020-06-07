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
      return {
        component: ListboxLabel,
        props: {
          id: this.labelId
        }
      };
    },

    listboxButtonComponent() {
      return {
        component: ListboxButton,
        props: {
          id: this.buttonId,
          labelId: this.labelId,
          isOpen: this.isOpen
        },
        on: {
          setButtonRef: this.setButtonRef,
          toggle: this.toggle
        }
      };
    },

    listboxListComponent() {
      return {
        component: ListboxList,
        props: {
          labelledBy: `${this.buttonId} ${this.labelId}`,
          typeahead: this.typeahead,
          activeOptionId: this.activeOption?.id,
          buttonRef: this.buttonRef,
          items: this.items
        },
        on: {
          setListRef: this.setListRef,
          close: this.close,
          focusPrev: this.focusPrev,
          focusNext: this.focusNext,
          selectActive: this.selectActive,
          resetActive: this.resetActive,
          type: this.type
        }
      };
    },

    listboxOptionComponent() {
      return {
        component: ListboxOption,
        props: {
          activeValue: this.activeValue,
          selectedValue: this.value,
          value: null // passed directly
        },
        on: {
          registerOption: this.registerOption,
          unregisterOption: this.unregisterOption,
          select: this.selectOption,
          setActiveValue: this.setActiveValue
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
