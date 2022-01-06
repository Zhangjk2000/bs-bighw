import {Video2ImgsApi, Label2VocApi, Label2CreateMLApi} from "@/api/annotateText";

const state = {
  labels: [
    // 标签信息
  ],
};

const mutations = {
  /**
   *  设置标注标签
   * @param {*} state
   */
  SET_LABELS: (state, data) => {
    state.labels = data;
  },
};

const actions = {
  setLabels({commit}, data) {
    console.log("setLabels.data:")
    console.log(data);
    commit("SET_LABELS", data['Labels']);
    if(data['form'] === 'xml')
      Label2VocApi(data['Labels']);
    else
      Label2CreateMLApi(data['Labels']);
  },

  setVideoImgs({commit}, imgSrcs) {
    return new Promise((resolve, reject) => {
      Video2ImgsApi({imgsrcs: imgSrcs})
        .then((response) => {
          // commit("")
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });

  },

};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
