import {getInfoApi, loginApi, logoutApi, registerApi} from "@/api/user";
import {resetRouter} from "@/router";
import {getToken, removeToken, setToken} from "@/utils/auth";

const state = {
  token: getToken(),
  name: "",
  email: "",
  avatar: "",
  roles: [],
  // 所有的标注文本
  imgList: [],
  videoList: [],
  taskList: [],
  receivetaskList: []
};

const mutations = {
  //token
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  //用户名
  SET_NAME: (state, name) => {
    state.name = name;
  },
    //用户名
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  //头像
  SET_AVATAR: (state, avatar) => {
    state.avatar =
      avatar ?? "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F1113%2F092919113248%2F1Z929113248-8-1200.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644025256&t=260f5add845ad8ff88d6a785a83c057b";
  },
  //角色，用于权鉴
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  /**
   * 设置所有的标注文本
   */
  SET_IMG_LIST: (state, imgList) => {
    state.imgList = imgList;
  },
  SET_VIDEO_LIST: (state, videoList) => {
    state.videoList = videoList;
  },
  SET_TASK_LIST: (state, taskList) => {
    state.taskList = taskList;
  },
  SET_RECEIVE_TASK_LIST: (state, taskList) => {
    state.receivetaskList = taskList;
  },
  ADD_RECEIVE_TASK_LIST: (state, task) => {
    state.receivetaskList.push(task);
  },

};

const actions = {
  // 用户登录
  login({commit}, userInfo) {
    const {username, password} = userInfo;
    return new Promise((resolve, reject) => {
      loginApi({username: username.trim(), password: password})
        .then((response) => {
          const {data} = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // 注册
  register({commit}, userInfo) {
    const {username, password, email} = userInfo;
    return new Promise((resolve, reject) => {
      registerApi({username: username.trim(), password: password, email: email.trim()})
        .then((response) => {
          const {data} = response;
          commit("SET_TOKEN", data.token);
          setToken(data.token);

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 获取用户信息
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      getInfoApi()
        .then((response) => {
          const {data} = response;

          if (!data) {
            reject("验证失败，请再次登录。");
          }

          const {roles, name, email, avatar, annotate_img_list, video_list, task_list, receive_task_list} = data;
          console.log(email)
          // 角色必须是非空数组
          if (!roles || roles.length <= 0) {
            reject("getInfo：角色必须是非空数组！");
          }

          commit("SET_ROLES", roles);
          commit("SET_NAME", name);
          commit("SET_EMAIL", email);
          commit("SET_AVATAR", avatar);
          commit("SET_TASK_LIST", task_list);
          commit("SET_RECEIVE_TASK_LIST", receive_task_list);
          commit("SET_IMG_LIST", annotate_img_list);
          commit("SET_VIDEO_LIST", video_list);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 用户注销
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      logoutApi(state.token)
        .then(() => {
          commit("SET_TOKEN", "");
          commit("SET_ROLES", []);
          commit("SET_AVATAR", "");
          removeToken();
          resetRouter();

          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // 删除令牌
  resetToken({commit}) {
    return new Promise((resolve) => {
      commit("SET_TOKEN", "");
      commit("SET_ROLES", []);
      removeToken();
      resolve();
    });
  },
  // 设置头像
  setAvatar({commit}, avatar) {
    commit("SET_AVATAR", avatar);
  },
  // 设置用户名
  setName({commit}, name) {
    commit("SET_NAME", name);
  },
    // 设置用户名
  setEmail({commit}, email) {
    commit("SET_EMAIL", email);
  },
  setImgList({commit}, textList) {
    commit("SET_IMG_LIST", textList);
  },

  setVideoList({commit}, videoList) {
    commit("SET_VIDEO_LIST", videoList);
  },

  setTaskList({commit}, taskList) {
    commit("SET_TASK_LIST", taskList);
  },
  setReceiveTaskList({commit}, taskList) {
    commit("SET_RECEIVE_TASK_LIST", taskList);
  },
  addReceiveTaskList({commit}, task) {
    commit("ADD_RECEIVE_TASK_LIST", task);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
