<script setup lang="ts"></script>

<template>
  <div class="container">
    <el-container class="content-container">
      <el-aside width="200px">
        <el-scrollbar height="100%" view-style="height:100%">
          <el-menu :default-openeds="['1']" style="height: 100%">
            <el-sub-menu index="1">
              <template #title>
                <el-icon><i-ep-menu /></el-icon>
                工具
              </template>
              <el-menu-item index="1-1">国际化excel转换</el-menu-item>
            </el-sub-menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>

      <el-main><RouterView /></el-main>
    </el-container>
  </div>
</template>

<style lang="less">
.container {
  width: 100%;
  height: 100%;
}

.content-container {
  height: 100%;
}
</style>
