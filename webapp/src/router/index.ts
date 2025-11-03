import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "index",
    component: () => import("../views/Index.vue"),
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
