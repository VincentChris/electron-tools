<template>
  <div class="container">
    <el-upload
      class="upload-demo"
      :before-upload="beforeUpload"
      drag
      accept="application/vnd.ms-excel,.xlsx"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      :limit="1"
    >
      <el-icon class="el-icon--upload"><i-ep-upload-filled /></el-icon>
      <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
      <template #tip>
        <div class="el-upload__tip">xlsx files with a size less than 500kb</div>
      </template>
    </el-upload>
    <div class="flex">
      <el-button @click="handleGenerateI18nJson">读取剪切板生成国际化json</el-button>
      <el-input
        v-model="input"
        style="width: 200px; margin: 8px 16px"
        placeholder="请输入开始的表格"
      />
      <el-switch v-model="isEnUS" size="large" active-text="英文" inactive-text="中文" />
    </div>
    <div class="flex-1">
      <codemirror
        v-model="code"
        placeholder="Code goes here..."
        :style="{ height: '100%' }"
        :autofocus="true"
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UploadRawFile } from 'element-plus/es/components/upload/src/upload';
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import * as XLSX from 'xlsx';

const input = ref('A,B');
const isEnUS = ref(true);
const code = ref('');
const clipboardValue = ref('');
const extensions = [json(), oneDark];

const readClipboard = async () => {
  const clipboardData = await navigator.clipboard.readText();
  clipboardValue.value = clipboardData || '';
  return clipboardData;
};

const generateI18nJson = (text: string) => {
  if (!clipboardValue.value) return;
  const workbook = XLSX.read(text, { type: 'string' });
  const sheet = workbook?.Sheets?.Sheet1;
  if (!sheet) return;
  const StartCeils = input.value.split(',') as [string, string];
  const data = [[] as string[], [] as string[]];

  Object.keys(sheet).forEach((key) => {
    if (key.startsWith(StartCeils[0])) {
      data[0].push(sheet[key].v);
    }
    if (key.startsWith(StartCeils[1])) {
      data[1].push(sheet[key].v);
    }
  });
  console.log(sheet, StartCeils, Object.keys(sheet), data);
  const result = data[0].reduce((pre, cur, index) => {
    pre[cur] = isEnUS.value ? data[1][index] : cur;
    return pre;
  }, {});
  code.value = JSON.stringify(result, null, 2);
};

const handleGenerateI18nJson = async () => {
  const clipboardData = await readClipboard();
  generateI18nJson(clipboardData);
};

const beforeUpload = (file: UploadRawFile) => {
  return file.arrayBuffer().then((res) => {
    const xlsxResult = XLSX.read(res);
    console.log('vvvv ', xlsxResult);
    return false;
  });
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.row {
  margin-right: 0;
}
.flex {
  display: flex;
  align-items: center;
}

.flex-1 {
  flex: 1;
}
</style>
