import request from "@/utils/request";

/**
 * 根据id删除一条标注文本数据
 * @param {number} id 文本的id
 */
export function deleteAnnotateImgApi(id) {
  return request({
    url: "api/annotate/delete/",
    method: "DELETE",
    data: { id: id },
  });
}

/**
 * 更新标注文本信息
 * @param {object} textInfo 文本信息
 */
export function updateAnnotateImgInfoApi(textInfo) {
  return request({
    url: "api/annotate/edit/",
    method: "POST",
    data: { textInfo: textInfo },
  });
}
export function Video2ImgsApi(data) {
  return request({
    url: "api/video2img/",
    method: "POST",
    data,
  });
}

export function Label2VocApi(data) {
  return request({
    url: "api/label2voc/",
    method: "POST",
    data,
  });
}


export function Label2CreateMLApi(data) {
  return request({
    url: "api/label2createML/",
    method: "POST",
    data,
  });
}



export function addTaskApi(data) {
  return request({
    url: "api/task/add/",
    method: "POST",
    data,
  });

}

export function receiveTaskApi(data) {
  return request({
    url: "api/task/receive/",
    method: "POST",
    data,
  });
}


export function getImgListApi(data){
  console.log("API:" + data)
  return request({
    url: "api/getImgList/",
    method: "POST",
    data:{data: data},
  })
}

export function deleteTaskApi(name) {
  return request({
    url: "api/task/delete/",
    method: "DELETE",
    data: {name: name},
  });
}

export function updateTaskInfoApi(taskInfo) {
  return request({
    url: "api/task/edit/",
    method: "POST",
    data: { taskInfo: taskInfo },
  });
}
