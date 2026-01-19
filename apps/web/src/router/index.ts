import {
  createWebHistory,
  createRouter,
  type RouteRecordRaw,
} from "vue-router";
import { client, getAuthHeaders } from "../api";
import { createToastInterface } from "vue-toastification";

const toast = createToastInterface();
let companyGateToastShown = false;

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
        meta: { requiresCompany: true },
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("../views/user/Clients.vue"),
        meta: { requiresCompany: true },
      },
      {
        path: "products",
        name: "products",
        component: () => import("../views/user/Products.vue"),
        meta: { requiresCompany: true },
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

router.beforeEach(async (to) => {
  if (!to.meta?.requiresCompany){
    return true;
  };

  const token = localStorage.getItem("access_token");
  if (!token) {
    return { name: "login" };
  }

  try {
    const response = await client.meInfo({
      headers: getAuthHeaders(),
    });

    if (response.status === 200 && response.body.hasCompany) {
      return true;
    }
  } catch {
    // fallthrough to settings
  }

  if (!companyGateToastShown) {
    companyGateToastShown = true;
    toast.warning(
      "Brak dostępu: uzupełnij dane firmy w ustawieniach.",
      {
        timeout: 6000,
        closeOnClick: false
      }
    );
    setTimeout(() => {
      companyGateToastShown = false;
    }, 6500);
  }

  return { name: "settings", hash: "#company-settings" };
});
