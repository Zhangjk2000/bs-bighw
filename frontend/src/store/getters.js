const getters = {
  sidebar: (state) => state.app.sidebar, //侧边栏
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  email: (state) => state.user.email,
  roles: (state) => state.user.roles,
  imgList: (state) => state.user.imgList,
  videoList: (state) => state.user.videoList,
  taskList: (state) => state.user.taskList,
  receivetaskList: (state) => state.user.receivetaskList,
  labels: (state) => state.annotate.labels, //标签信息
  entityAnnotateData: (state) => state.annotate.entityAnnotateData, //标注数据
};
export default getters;
