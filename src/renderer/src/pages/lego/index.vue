<template>
  <div class="container">
    <el-container>
      <el-aside width="400px" class="left">
        <el-collapse v-model="activeItems" style="color: #000">
          <el-collapse-item
            v-for="category in compListRegisted"
            :key="category.id"
            :title="category.name"
            :name="category.id"
            style="--el-collapse-header-text-color: #000; --el-collapse-border-color: #ebeef5"
          >
            <div class="component-list">
              <VueDraggable
                v-model="category.children"
                :animation="150"
                ghost-class="ghost"
                :group="{ name: 'canvas', pull: 'clone', put: false }"
                :sort="false"
                @clone="onClone"
              >
                <div
                  v-for="item in category.children"
                  :key="item.id"
                  :title="item.name"
                  :data-id="item.id"
                >
                  <div class="component-item flex-column">
                    <div class="component-item-image">
                      <el-image :src="item.image" fit="fill" style="width: 56px; height: 56px" />
                    </div>
                    <div class="component-item-title">
                      {{ item.name }}
                    </div>
                  </div>
                </div>
              </VueDraggable>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-main>
        <div class="canvas">
          <NestedComponent :model-value="compListInCanvas" />
        </div>
      </el-main>
      <el-aside width="400px" class="right">Aside</el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { SortableEvent, VueDraggable } from 'vue-draggable-plus';
import { componentList } from './componentRegister';
import { recursiveFind } from '@renderer/utils/array';
import NestedComponent from './NestedComponent.vue';

interface IList {
  id: string;
  name: string;
  image: string;
  children: IList[];
}
const activeItems = ref([componentList[0].name]);
const compListRegisted = ref(componentList);
const compListInCanvas = ref<IList[]>([]);
function onClone(evt: SortableEvent) {
  console.log('vincent onClone', evt);
  const { item } = evt;
  const { id } = item.dataset;
  const clonedItem = recursiveFind(id!, compListRegisted.value);
  return {
    ...clonedItem,
    id: crypto.randomUUID()
  };
}
watch(compListInCanvas.value, () => {
  console.log('vvv', compListInCanvas.value);
});
console.log(compListInCanvas.value);
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  color: #000;
}
.left {
  border-right: 1px solid #000;
  padding: 8px;
}
.component-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  color: #000;
}
.component-item {
  display: flex;
  justify-content: center;
  border: 1px solid #eaeaea;
  padding: 14px;
  cursor: grabbing;
  &:hover {
    box-shadow: 0 6px 16px 0 rgba(0, 0, 0, 0.15);
  }
}
.component-item-image {
  display: flex;
  justify-content: center;
}
.component-item-title {
  display: flex;
  justify-content: center;
}

.canvas {
  width: 100%;
  height: 100%;
}
.right {
  border-left: 1px solid #000;
}
</style>
