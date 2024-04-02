import type { RouteParams, RouteRecordRaw } from 'vue-router';
import { createRouter, createWebHashHistory } from 'vue-router';
import I18nExcel from '../pages/I18nExcel.vue';
import { isAuthorized } from './guards';
import I18nFile from '@renderer/pages/I18nFile.vue';
import Lego from '@renderer/pages/lego/index.vue';

export type AppRouteNames = 'i18n-excel';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/i18n-excel'
  },
  {
    name: 'i18n-excel',
    path: '/i18n-excel',
    component: I18nExcel,
    beforeEnter: () => isAuthorized()
  },
  {
    name: 'i18n-file',
    path: '/i18n-file',
    component: I18nFile,
    beforeEnter: () => isAuthorized()
  },
  {
    name: 'lego',
    path: '/lego',
    component: Lego,
    beforeEnter: () => isAuthorized()
  }
];
export const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export function routerPush(
  name: AppRouteNames,
  params?: RouteParams
): ReturnType<typeof router.push> {
  return params === undefined ? router.push({ name }) : router.push({ name, params });
}
