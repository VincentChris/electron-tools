import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      selectDirectoryCallback: (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fn: (event: Electron.IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
    ipcRenderer: Electron.IpcRenderer;
  }
}
