<template>
  <div class="app-container">
    <!-- 按钮组 -->
    <div class="button-group">
      <div class="button-group-item">
        <el-button type="primary" @click="taskCreate">
          创建任务
        </el-button>
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
          <el-option label="状态" value="status"></el-option>
          <el-option label="任务" value="name"></el-option>
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
        <el-table-column label="任务名称" align="center">
          <template slot-scope="scope">
            <p class="single-line">
              {{ scope.row.name }}
            </p>
          </template>
        </el-table-column>
        <!-- 状态 -->
        <el-table-column
          class-name="status-col"
          label="状态"
          width="110"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="210" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="receiveTask(scope.$index)"
            >
              领取
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
    <!-- 任务创建框 -->
    <el-dialog :visible.sync="showTaskForm" :width="width">
      <el-form label-position="left" label-width="80px" :model="taskform">
        <el-form-item label="任务名称">
          <el-input v-model="taskform.name"></el-input>
        </el-form-item>
        <div>请选择组成任务的图片</div>

        <el-checkbox-group
          v-model="checkList"
        >
          <el-checkbox v-for="(img,index) in taskimgList" :label="img.img.split('/').pop()" :key="index">
            {{ img.img.split('/').pop() }}
            <div><img :src="img.img" style="width: 100px; height: 100px" alt="" class="img" @click="selectImg"></div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSuccess">
          创建
        </el-button>
      </div>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog :visible.sync="showEditForm" :width="width">
      <el-form label-position="left" label-width="80px" :model="form">
        <el-form-item label="描述">
          <el-input v-model="taskform.description"></el-input>
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
  deleteTaskApi,
  updateTaskInfoApi,

  addTaskApi,
  receiveTaskApi
} from "@/api/annotateText";
import {getToken} from "@/utils/auth";
import {mapGetters} from "vuex";

export default {
  name: "taskList",
  filters: {
    statusFilter(status) {
      const statusMap = {
        已领取: "success",
        未领取: "gray",
        已完成: "done",
      };
      return statusMap[status];
    },
  },

  data() {
    return {
      checkList: [],
      searchTarget: "描述", // 搜索对象
      showTaskForm: false,
      keywords: "", // 搜索关键词
      filterList: [], //符合条件的数据
      taskimgList: [],
      list: [], // 所有数据列表
      listLoading: true, //加载效果
      showEditForm: false, //编辑框的显隐
      listEditIndex: 0, // 编辑索引
      handleItemId: 0, // 操作条目的id
      taskform: {
        name: "",
        status: "未领取",
        imgs: [],
        description: "无",
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
    ...mapGetters(["taskList"]),
    ...mapGetters(["imgList"]),
    ...mapGetters(["receivetaskList"]),
  },
  mounted() {
    this.list = this.filterList = this.taskList;
    this.taskimgList = this.imgList;
    this.listLoading = false;
  },
  methods: {
    selectImg() {
      console.log(this.checkList)
    },

    taskCreate() {
      this.showTaskForm = true;
    },

    /**
     * 上传成功的回调函数
     * @param response 响应数据
     */
    handleSuccess() {
      console.log(this.checkList);
      this.taskform.imgs = this.checkList;
      this.filterList.push(this.taskform);
      this.$message.success("任务创建成功");
      console.log("%s", this.taskform.name);
      addTaskApi({
        name: this.taskform.name,
        status: this.taskform.status,
        imgs: this.taskform.imgs,
        description: this.taskform.description
      });
      this.showTaskForm = false;
    },
    /**
     * 上传失败回调函数
     */
    handleError() {
      this.$message.error("上传失败");
    },


    /**
     * 搜索文本
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
     * 前往标注页面
     */
    receiveTask(index) {
      this.filterList[index].status = "已领取";
      this.$store.dispatch("user/addReceiveTaskList", this.filterList[index]);

      receiveTaskApi(this.filterList[index]).then((response) => {
        console.log(response.data["flag"])
        if (response.data["flag"]) {
          this.$message.success("领取成功");
        }
      });
    },
    /**
     * 编辑
     * @param {object} row 操作当前行数据
     */
    handleEdit(index, row) {
      this.showEditForm = true;
      this.listEditIndex = index;
      this.taskform.description = row.description;
      this.taskform.name = row.name;
      this.handleItemId = row.id;
    },
    /**
     * 更新数据
     */
    update() {
      this.filterList[this.listEditIndex].description = this.taskform.description;
      updateTaskInfoApi(this.filterList[this.listEditIndex]);
      this.list.forEach((item) => {
        if (item.id === this.handleItemId) {
          item.description = this.taskform.description;
        }
      });
      this.showEditForm = false;
    },
    /**
     * 删除文本
     */
    handleDelete(index) {
      let name = this.filterList[index].name;
      deleteTaskApi(name);
      this.filterList.splice(index, 1);
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].name == name) {
          this.list.splice(i, 1);
          this.$store.dispatch("user/setTaskList", this.list);
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
