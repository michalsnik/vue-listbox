<template>
  <Listbox
    v-model="selectedWrestler"
    :items="wrestlers"
    v-slot="{ isOpen, components }"
  >
    <contextual-component :use="components.label" class="sr-only">
      Select a wrestler
    </contextual-component>

    <contextual-component :use="components.button" class="rounded p-3 border">
      {{ selectedWrestler }}
    </contextual-component>

    <contextual-component
      :use="components.list"
      v-show="isOpen"
      v-slot="{ item }"
    >
      <contextual-component
        :use="components.option"
        :value="item"
        v-slot="{ isActive, isSelected }"
      >
        <div
          class="p-3"
          :class="
            isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'
          "
        >
          {{ item }}
          <img v-show="isSelected" src="@/assets/checkmark.svg" />
        </div>
      </contextual-component>
    </contextual-component>
  </Listbox>
</template>

<script>
import Listbox from "@/components/Listbox.vue";

export default {
  components: {
    Listbox
  },
  data() {
    return {
      selectedWrestler: "The Ultimate Warrior",
      wrestlers: [
        "The Ultimate Warrior",
        "Randy Savage",
        "Hulk Hogan",
        "Bret Hart",
        "The Undertaker",
        "Mr. Perfect",
        "Ted DiBiase",
        "Bam Bam Bigelow",
        "Yokozuna"
      ]
    };
  }
};
</script>
