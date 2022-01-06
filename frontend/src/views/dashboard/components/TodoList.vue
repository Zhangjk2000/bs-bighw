<template>
  <div>
    <div class="col">
      <div class="row">
        <el-card shadow="always" :body-style="{padding: '0px'}" @click.native="goImgAnnotate">
          <div class="block">
            <i :class="'el-icon-edit'" :style="{ background: '#69d2ec82' }" class="icon-box"/>

            <div class="cont">
              <p class="title">图像标注</p>
            </div>
          </div>
        </el-card>
      </div>
      <div class="row">
        <el-card shadow="always" :body-style="{padding: '0px'}" @click.native="goImgUpload">
          <div class="block">
            <i :class="'el-icon-upload'" :style="{ background: '#69d2ec82' }" class="icon-box"/>
            <div class="cont">
              <p class="title">图片上传</p>
            </div>
          </div>
        </el-card>
      </div>
      <div class="row">
        <el-card shadow="always" :body-style="{padding: '0px'}" @click.native="goVideoCut">
          <div class="block">
            <i :class="'el-icon-picture'" :style="{ background: '#69d2ec82' }" class="icon-box"/>
            <div class="cont">
              <p class="title">视频截图</p>
            </div>
          </div>
        </el-card>
      </div>
      <div class="row">
        <el-card shadow="always" :body-style="{padding: '0px'}" @click.native="goTaskManage">
          <div class="block">
            <i :class="'el-icon-notebook-1'" :style="{ background: '#69d2ec82' }" class="icon-box"/>
            <div class="cont">
              <p class="title">任务大厅</p>
            </div>
          </div>
        </el-card>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "TodoList",
  methods: {
    goImgAnnotate() {
      this.$router.push('/entityAnnotate');
    },
    goImgUpload() {
      this.$router.push('/imgAnnotate');
    },
    goVideoCut() {
      this.$router.push('/videoCut');
    },
    goTaskManage() {
      this.$router.push('/taskManage');
    },
  }
};
</script>

<style lang="less">

.img {
  height: 200px;
  display: flex;
  margin-top: 50px
}

.col {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;

  .row {
    flex: 1;
    margin-right: 20px;

    .block {
      display: flex;
      align-items: center;
      height: 160px;

      .icon-box {
        font-size: 40px;
        width: 160px;
        height: 160px;
        text-align: center;
        line-height: 160px;
        color: #fff;
      }

      .cont {
        flex: 1;
        text-align: center;
        color: #515a6e;

        .count {
          line-height: 60px;
          font-size: 35px;
        }

        .title {
          font-size: 20px;
        }
      }
    }
  }
}

.card {
  height: 350px;
}
</style>

