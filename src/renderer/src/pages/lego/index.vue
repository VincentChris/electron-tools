<template>
  <div class="container">
    <el-container>
      <el-aside width="400px" class="left">
        <el-collapse v-model="activeItems" style="color: #000">
          <el-collapse-item
            v-for="category in componentList"
            :key="category.name"
            :title="category.name"
            :name="category.name"
            style="--el-collapse-header-text-color: #000; --el-collapse-border-color: #ebeef5"
          >
            <div class="component-list">
              <div v-for="item in category.children" :key="item.name" :title="item.name">
                <div class="component-item flex-column">
                  <div class="component-item-image">
                    <el-image :src="item.image" fit="fill" style="width: 56px; height: 56px" />
                  </div>
                  <div class="component-item-title">
                    {{ item.name }}
                  </div>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-aside>
      <el-main>Main</el-main>
      <el-aside width="400px" class="right">Aside</el-aside>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { componentList } from './componentRegister';
const activeItems = ref([componentList[0].name]);
console.log(componentList);
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
.right {
  border-left: 1px solid #000;
}
</style>
