<template>
  <div class="container">
    <div class="flex">
      <el-form :inline="true">
        <el-form-item label="项目名称">
          <el-select
            v-model="form.projectValue"
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
        </el-form-item>
        <el-form-item label="模块名称(用于国家化区分前缀)">
          <el-input v-model="form.modulePrefix" style="width: 200px" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item label="文件名称">
          <el-input v-model="form.fileName" style="width: 200px" placeholder="请输入文件名称" />
        </el-form-item>
        <el-form-item>
          <el-button @click="handleGenerateI18nFile">生成excel并且选择存放目录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="flex-1">
      <div class="tips">请将excel国际化内容复制到下方代码编辑器</div>
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
    value: 'web_basesetting',
    label: 'web_basesetting'
  },
  {
    value: 'web_tms',
    label: 'web_tms'
  },
  {
    value: 'web_scs',
    label: 'web_scs'
  }
];
const form = reactive({
  projectValue: 'basesetting_web',
  fileName: '',
  modulePrefix: ''
});
const code = ref('');
const extensions = [json(), oneDark];

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
  const result = data[0]
    .map((item, index) => {
      return [
        {
          'languageCode*': `${form.modulePrefix}.${item}`,
          'project*': form.projectValue,
          'langType*': `zh_CN`,
          'languageValue*': `${item}`
        },
        {
          'languageCode*': `${form.modulePrefix}.${item}`,
          'project*': form.projectValue,
          'langType*': `en_US`,
          'languageValue*': `${form.modulePrefix}.${data[1][index]}`
        }
      ];
    })
    .flat();
  return result;
};

const handleGenerateI18nFile = async () => {
  if (!code.value) {
    ElMessage('请先复制国际化excel内容到下方code编辑器');
    return;
  }
  if (!form.fileName) {
    ElMessage('请输入文件名称');
    return;
  }
  const directoryPath = localStorage.getItem(LOCALSTORAGEKEYS.I18NFILEDIR);
  const result = generateI18nJson(code.value);
  window.ipcRenderer?.invoke('selectDirectory', directoryPath ?? undefined)?.then((res) => {
    const filePath = `${res}/${form.fileName}.xlsx`;
    window.api.saveXlsx(filePath, result!);
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

.tips {
  margin-bottom: 12px;
}
</style>
