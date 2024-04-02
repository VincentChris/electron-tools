<template>
  <div class="container">
    <div class="flex">
      <el-select
        v-model="projectValue"
        placeholder="请选择项目"
        size="large"
        style="width: 240px"
        filterable
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input
        v-model="fileName"
        style="width: 200px; margin: 8px 16px"
        placeholder="请输入文件名称"
      />
      <el-button @click="handleGenerateI18nFile">读取剪切板生成国际化excel</el-button>
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
import { Codemirror } from 'vue-codemirror';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { LOCALSTORAGEKEYS } from '../common/constants';
import * as XLSX from 'xlsx';

const options = [
  {
    value: 'basesetting_web',
    label: 'basesetting_web'
  },
  {
    value: 'tms_web',
    label: 'tms_web'
  },
  {
    value: 'scs_web',
    label: 'scs_web'
  }
];

const projectValue = ref('basesetting_web');
const fileName = ref('');
const code = ref('');
const clipboardValue = ref('');
const extensions = [json(), oneDark];

const readClipboard = async () => {
  const clipboardData = await navigator.clipboard.readText();
  clipboardValue.value = clipboardData || '';
  return clipboardData;
};

const generateI18nJson = (text: string) => {
  if (!text) return;
  const workbook = XLSX.read(text, { type: 'string' });
  const sheet = workbook?.Sheets?.Sheet1;
  if (!sheet) return;
  const data = [[] as string[], [] as string[]];
  Object.keys(sheet).forEach((key) => {
    if (key.startsWith('A')) {
      data[0].push(sheet[key].v);
    }
    if (key.startsWith('B')) {
      data[1].push(sheet[key].v);
    }
  });
  const modulePrefix = '用户授权';
  const result = data[0]
    .map((item, index) => {
      return [
        {
          'languageCode*': `${modulePrefix}.${item}`,
          'project*': projectValue.value,
          'langType*': `zh_CN`,
          'languageValue*': `${item}`
        },
        {
          'languageCode*': `${modulePrefix}.${item}`,
          'project*': projectValue.value,
          'langType*': `en_US`,
          'languageValue*': `${modulePrefix}.${data[1][index]}`
        }
      ];
    })
    .flat();
  console.log('vincent', result);
};

const handleGenerateI18nFile = async () => {
  const clipboardData = await readClipboard();
  console.log('vincent vvv', clipboardData, fileName.value);
  if (!clipboardData) {
    ElMessage('请先复制国际化excel内容到剪切板');
    return;
  }
  if (!fileName.value) {
    ElMessage('请输入文件名称');
    return;
  }
  const directoryPath = localStorage.getItem(LOCALSTORAGEKEYS.I18NFILEDIR);
  generateI18nJson(clipboardData);
  window.ipcRenderer?.send('selectDirectory', directoryPath ?? undefined);
};

onMounted(() => {
  window?.api?.selectDirectoryCallback?.((event, directoryPath) => {
    localStorage.setItem(LOCALSTORAGEKEYS.I18NFILEDIR, directoryPath);
    console.log('vincent ee', event, directoryPath);
  });
});
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
