<script setup lang="ts">
import { MenuItemRegistered } from 'element-plus/es/components/menu/src/types';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';

const route = useRoute();
const router = useRouter();

function redirect(e: MenuItemRegistered) {
  const { index } = e;
  router.push(index);
}
const defaultExpanded = ['tools'];
const defaultActive = computed(() => route.path);
</script>

<template>
  <div class="container">
    <el-container class="content-container">
      <splitpanes style="width: 100%" vertical class="dark-theme">
        <pane size="15" min-size="10" max-size="50">
          <el-aside style="width: 100%; height: 100%">
            <el-scrollbar height="100%" view-style="height:100%">
              <el-menu
                :default-openeds="defaultExpanded"
                style="height: 100%; border-right: none"
                :default-active="defaultActive"
              >
                <el-sub-menu index="tools">
                  <template #title>
                    <el-icon><i-ep-menu /></el-icon>
                    工具
                  </template>
                  <el-menu-item index="/i18n-excel" @click="redirect"
                    >国际化excel转换json</el-menu-item
                  >
                  <el-menu-item index="/i18n-file" @click="redirect"
                    >国际化转换excel文件</el-menu-item
                  >
                </el-sub-menu>
              </el-menu>
            </el-scrollbar>
          </el-aside>
        </pane>
        <pane min-size="50">
          <el-main class="h-full"><RouterView /></el-main>
        </pane>
      </splitpanes>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.h-full {
  height: 100vh;
}

.content-container {
  height: 100%;
}

.dark-theme {
  :deep(.splitpanes__splitter) {
    width: 2px;
    border-left: 1px solid var(--el-menu-border-color);
    margin-left: -1px;
    background-color: var(--el-menu-border-color);
    box-sizing: border-box;
    position: relative;
    flex-shrink: 0;
    min-width: 1px;
    cursor: col-resize;
  }
}
</style>
