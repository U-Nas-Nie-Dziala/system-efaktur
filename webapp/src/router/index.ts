import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("../layouts/LandingPageLayout.vue"),
    children: [
      {
        path: "",
        name: "landing-page",
        component: () => import("../views/LandingPage.vue"),
      },
    ],
  },

  {
    path: "/user",
    component: () => import("../layouts/DefaultLayout.vue"),
    children: [
      {
        path: "home",
        name: "home",
        component: () => import("../views/user/Home.vue"),
      },
      {
        path: "invoices",
        name: "invoices",
        component: () => import("../views/user/Invoices.vue"),
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("../views/user/Clients.vue"),
      },
      {
        path: "products",
        name: "products",
        component: () => import("../views/user/Products.vue"),
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("../views/user/Settings.vue"),
      },
    ],
  },

  {
    path: "/auth",
    component: () => import("../layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("../views/auth/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("../views/auth/Register.vue"),
      },
    ],
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});
