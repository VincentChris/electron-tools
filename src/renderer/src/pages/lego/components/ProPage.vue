<template>
  <div class="container flex-column h-full">
    <div class="content flex-1 flex-column"><slot></slot></div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.container {
  padding: 12px;
  background-color: rgb(237, 239, 242);
}
.content {
  background-color: rgb(255, 255, 255);
  padding: 16px;
  border-radius: 8px;
  box-shadow: rgba(0, 22, 111, 0.1) 0px 0px 16px 0px;
}
</style>
