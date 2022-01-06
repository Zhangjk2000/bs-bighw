/* Layout */
import Layout from "@/layout";
import Login from "@/views/login";
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const constantRoutes = [

  {
    path: "/login",
    component: Login,
    hidden: true,
    meta: {title: "登录", icon: "edit"},
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
    meta: {title: "注册", icon: "edit"},
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },
  {
    path: "/",
    redirect: "/dashboard",
    component: Layout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: {title: "主控台", icon: "dashboard"},
      },
    ],
  },

  {
    path: "/profile",
    component: Layout,
    children: [
      {
        path: "",
        component: () => import("@/views/profile/index"),
        name: "Profile",
        meta: {title: "个人中心", icon: "user", noCache: true},
      },
    ],
  },
  {
    path: "/imgAnnotate",
    component: Layout,
    children: [
      {
        path: "",
        name: "imgAnnotate",
        component: () => import("@/views/imgAnnotate"),
        meta: {title: "图像（视频）导入", icon: "el-icon-upload"},
      },
    ],
  },
  {
    path: "/entityAnnotate",
    component: Layout,
    children: [
      {
        path: "",
        name: "entityAnnotate",
        component: () => import("@/views/entityAnnotate"),
        meta: {title: "图像标注", icon: "el-icon-edit"},
      },
    ],
  },
  {
    path: "/videoCut",
    component: Layout,
    children: [
      {
        path: "",
        name: "videoCut",
        component: () => import("@/views/videoCut"),
        meta: {title: "视频截图", icon: "el-icon-picture"},
      },
    ],
  },
  {
    path: "/taskManage",
    component: Layout,
    children: [
      {
        path: "",
        name: "taskManage",
        component: () => import("@/views/taskManage"),
        meta: {title: "任务大厅", icon: "el-icon-notebook-1"},
      },
    ],
  },


  {path: "*", redirect: "/404", hidden: true},
];

const createRouter = () =>
  new Router({
    scrollBehavior: () => ({y: 0}),
    routes: constantRoutes,
    mode: 'history',
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

export default router;
