import { contextBridge, ipcRenderer } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import XLSX from 'xlsx';

// Custom APIs for renderer
const api = {
  selectDirectoryCallback: (fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
    ipcRenderer.on('directorySelected', fn);
  },
  saveXlsx: (path: string, data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dates');

    XLSX.utils.sheet_add_aoa(
      worksheet,
      [['languageCode*', 'project*', 'langType*', 'languageValue*']],
      { origin: 'A1' }
    );
    const max_width = data.reduce(
      (w, r) => {
        const [aWidth, bWidth, cWidth, dWidth] = w;
        return [
          Math.max(aWidth, r['languageCode*'].length * 2.5),
          Math.max(bWidth, r['project*'].length * 2.5),
          Math.max(cWidth, r['langType*'].length * 2.5),
          Math.max(dWidth, r['languageValue*'].length * 2.5)
        ];
      },
      [50, 30, 30, 50]
    );
    worksheet['!cols'] = max_width.map((item) => ({ wch: item }));
    XLSX.writeFile(workbook, path, { compression: true });
  }
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.ipcRenderer = ipcRenderer;
}
