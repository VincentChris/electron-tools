<template>
  <VueDraggable
    v-model="list"
    class="flex-column flex-1 h-full"
    tag="div"
    group="canvas"
    data-type="container"
    @end="onEnd"
  >
    <div v-for="el in list" :key="el.id" class="flex-column" data-type="component">
      <component :is="el.component"
        ><nested-component v-if="el.category === 'container'" v-model="el.children"
      /></component>
    </div>
  </VueDraggable>
</template>
<script setup lang="ts">
// import { Component } from 'vue';
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';

interface IList {
  name: string;
  id: string;
  image: string;
  category?: string;
  children: IList[];
}

interface Props {
  modelValue: IList[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'update:modelValue', value: IList[]): void;
}

const emits = defineEmits<Emits>();
const list = computed({
  get: () =>
    props.modelValue.map((item) => {
      console.log('vincent item', item);
      return {
        ...item,
        component: defineAsyncComponent(() => import(`./components/${item.name}.vue`))
      };
    }),
  set: (value) => emits('update:modelValue', value)
});
watch(props.modelValue, (value) => {
  console.log('vincent value', value);
});

function onEnd(e: SortableEvent) {
  console.log('vincent onEnd', e);
}
</script>
<style scoped></style>
