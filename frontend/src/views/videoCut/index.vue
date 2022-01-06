<template>
  <div class="app-container">
    <!-- 按钮组 -->
    <div class="button-group">
      <div class="button-group-item">
        <el-upload
          class="upload-demo"
          name="file"
          multiple
          accept="video/mp4,video/avi,video/rmvb"
          :before-upload="onBeforeUpload"
          :headers="{ 'annotate-system-token': token }"
          action="http://localhost:8000/api/annotate/upload/"
          :on-success="handleSuccess"
          :on-error="handleError"
          :show-file-list="false"
        >
          <el-button type="primary">
            导入视频
          </el-button>
        </el-upload>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="search">
      <el-input
        v-model="keywords"
        placeholder="请搜索关键词"
        class="input-with-select"
        @input="search"
      >
        <el-select slot="prepend" v-model="searchTarget">
          <el-option label="描述" value="description"></el-option>
          <el-option label="视频" value="video"></el-option>
        </el-select>
        <el-button slot="append" icon="el-icon-search" @click="search"/>
      </el-input>
    </div>

    <!-- 表格 -->
    <div>
      <el-table
        v-loading="listLoading"
        :data="filterList"
        element-loading-text="Loading"
        :row-class-name="tableRowClassName"
        border
        fit
      >
        <!-- 序号 -->
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <!-- 描述 -->
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            <p class="single-line">
              {{ scope.row.description }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="视频名称" align="center">
          <template slot-scope="scope">
            <p class="single-line">
              {{ scope.row.video.split('/').pop() }}
            </p>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="SelectVideo(scope.row.video)"
            >
              截图
            </el-button>
            <el-button
              size="mini"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 视频 -->
    <div>
      <video :src="videoSrc" style="width: 960px; height: 720px" controls></video>
      <img :src="imgSrc">
      <div>
        <el-button @click="cutPicture">
          截图
        </el-button>
      </div>
      <canvas id="myCanvas" width="600" height="450"></canvas>
    </div>
    <!-- 编辑框 -->
    <el-dialog :visible.sync="showEditForm" :width="width">
      <el-form label-position="left" label-width="80px" :model="form">
        <el-form-item label="描述">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="update()">
          更新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  deleteAnnotateImgApi,
  updateAnnotateImgInfoApi,
} from "@/api/annotateText";
import{
    getInfoApi,
} from "@/api/user";
import {getToken} from "@/utils/auth";
import {mapGetters} from "vuex";

export default {
  name: "videoCut",

  data() {
    return {
      searchTarget: "描述", // 搜索对象
      videoSrc: "",
      imgSrc: [],
      keywords: "", // 搜索关键词
      filterList: [], //符合条件的数据
      list: [], // 所有数据列表
      listLoading: true, //加载效果
      showEditForm: false, //编辑框的显隐
      listEditIndex: 0, // 编辑索引
      handleItemId: 0, // 操作条目的id
      form: {
        //编辑框数据
        description: "",
      },
    };
  },
  computed: {
    // 编辑框宽度
    width() {
      return window.innerWidth <= 400 ? "80%" : "30%";
    },
    token() {
      return getToken();
    },
    ...mapGetters(["videoList"]),
  },
  mounted() {
    this.list = this.filterList = this.videoList;
    this.listLoading = false;
  },
  methods: {

    cutPicture() {
      var v = document.querySelector("video");
      let canvas = document.getElementById('myCanvas')
      var ctx = canvas.getContext('2d');
      ctx.drawImage(v, 0, 0, 600, 450);
      var oGrayImg = canvas.toDataURL('image/jpeg');
      this.imgSrc.push(oGrayImg)
      this.$store.dispatch("annotate/setVideoImgs", this.imgSrc);
    },
    SelectVideo(video) {
      this.videoSrc = video;
    },

    onBeforeUpload(file) {
      const isIMAGE = file.type === 'video/mp4' || 'video/avi' || 'video/rmvb';

      if (!isIMAGE) {
        this.$message.error('上传文件只能是视频格式!');
      }
      return isIMAGE;
    },
    /**
     * 上传成功的回调函数
     * @param response 响应数据
     */
    handleSuccess(response) {
      console.log(response.data)
      this.$message.success("上传成功");
      getInfoApi().then((response) => {
        this.filterList = this.list = response.data['video_list'];
      });
      // this.$store.dispatch("user/setVideoList", response.data);
      // console.log(response.data);
    },
    /**
     * 上传失败回调函数
     */
    handleError() {
      this.$message.error("上传失败");
    },
    /**
     * 搜索图片
     */
    search() {
      let keywords = this.keywords.trim();

      if (this.searchTarget == "描述") {
        this.filterList = this.list.filter((item) =>
          item.description.includes(keywords)
        );
      } else {
        this.filterList = this.list.filter((item) =>
          item[this.searchTarget].includes(keywords)
        );
      }
    },
    /**
     * 表格样式
     */
    tableRowClassName({row, rowIndex}) {
      row;
      if (rowIndex % 2) {
        return "highlight-row";
      }
      return "";
    },
    /**
     * 编辑
     * @param {object} row 操作当前行数据
     */
    handleEdit(index, row) {
      this.showEditForm = true;
      this.listEditIndex = index;
      this.form.description = row.description;
      this.handleItemId = row.id;
    },
    /**
     * 更新数据
     */
    update() {
      this.filterList[this.listEditIndex].description = this.form.description;
      updateAnnotateImgInfoApi(this.filterList[this.listEditIndex]);
      this.list.forEach((item) => {
        if (item.id === this.handleItemId) {
          item.description = this.form.description;
        }
      });
      this.showEditForm = false;
    },
    /**
     * 删除视频
     */
    handleDelete(index) {
      let id = this.filterList[index].id;
      deleteAnnotateImgApi(id);
      this.filterList.splice(index, 1);
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].id == id) {
          this.list.splice(i, 1);
          this.$store.dispatch("user/setVideoList", this.list);
        }
      }
    },
  },
};
</script>
<style lang="scss">
// 按钮组
.button-group {
  width: 100%;
  display: inline;
  margin: 20px 20px 20px 20px;

  &-item {
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
  }
}


// 搜索框
.search {
  margin-bottom: 20px;

  .el-select {
    width: 150px;
  }
}

// 表格样式
.el-table .highlight-row {
  background: #ebf0fa;
}

// 单行显示文本
.single-line {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
