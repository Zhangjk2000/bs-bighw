<template>
  <div>
    <div class="select">
      <el-form :model="formInline">
        <el-form-item style="margin-left: 20px" label="数据集：">
          <el-select v-model="formInline.region" placeholder="选择数据集">
            <el-option v-for="item in dataList" :label="item.name" :key="item.code" :value="item.name"></el-option>
          </el-select>
          <el-button type="primary" style="margin-left: 20px" @click="getImgList(formInline.region)">选择</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 图片导航 -->


    <el-row :gutter="12" class="tagList">
      <el-col :span="4">
        <div class="pics">
          <div class="arrow arrow-left" @click="showMore('down')"></div>
          <div class="pic-container">
            <div class="pic-box" ref="picContainer">
              <div class="pic" v-for="(v, i) in imgList" :key="i">
                <div
                  class="info"
                  :style="{ 'background-image': 'url(' + v + ')'}"
                  @click="activePic(v)"
                ></div>
              </div>
            </div>
          </div>
          <div class="arrow arrow-right" @click="showMore('up')"></div>
        </div>
      </el-col>
      <el-col :span="16">
        <ui-marker
          ref="aiPanel-editor"
          class="ai-observer"
          :uniqueKey="uuid"
          :ratio="16 / 9"
          :imgUrl="currentInfo.currentBaseImage"
          @vmarker:onImageLoad="onImageLoad"
        ></ui-marker>
      </el-col>
      <el-col :span="3">
        <div class="title">标签</div>
        <div class="tags" v-for="(v, i) in tags" :key="i">
          <el-tag size="small" @click="setTag(v)">
            {{ v.tagName }}
          </el-tag>
          <i class="el-icon-delete" @click="delTag(i)"></i>
        </div>
        <el-row>
          <el-button type="primary" class="handleButton" @click="addTag">
            添加标签
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" class="handleButton" @click="submitForm('xml')">
            导出为XML
          </el-button>
        </el-row>
        <el-row>
          <el-button type="primary" class="handleButton" @click="submitForm('createML')">
            导出为createML
          </el-button>
        </el-row>
      </el-col>
    </el-row>

    <!-- 添加标签 dialog -->
    <el-dialog
      width="30%"
      title="添加标签"
      :visible.sync="innerVisible"
      :before-close="beforeClose"
    >
      <el-form ref="innerForm" :model="innerForm" :rules="tep_rules">
        <el-form-item label="标签名称：" prop="tagName">
          <el-input v-model="innerForm.tagName"/>
        </el-form-item>
        <el-form-item label="标签编码：" prop="tag">
          <el-input v-model="innerForm.tag"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="createForm('innerForm')">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>


import {AIMarker} from 'vue-picture-bd-marker'
import {getImgListApi} from "@/api/annotateText"
import {mapGetters} from "vuex";

export default {
  name: 'stagePicPage',
  components: {'ui-marker': AIMarker},
  data() {
    return {
      formInline: {
        region: '',
        radio: '全部'
      },
      dataList: [],
      imgList: [],
      uuid: '0da9130',
      // 当前图片的信息，包含图片原本的高矮胖瘦尺寸
      currentInfo: {
        currentBaseImage:
          '',
        rawW: 0,
        rawH: 0,
        currentW: 0,
        currentH: 0,
        checked: false, // false表示当前图片还没有标记过
        data: [] // 表示图片矩形标记信息
      },

      active: 0, // 当前图片序号
      picTotal: 10, // 照片总数

      // *********************************************
      tags: [
        {
          tagName: 'cat',
          tag: '0x0001'
        },
        {
          tagName: 'dog',
          tag: '0x0002'
        }
      ],
      allInfo: [], // 图片的矩形标记信息集合
      imageInfo: [], // 存储图片原始信息

      innerVisible: false,
      innerForm: {
        tagName: '',
        tag: ''
      },

      tep_rules: {
        tagName: [{required: true, message: '请输入', trigger: 'blur'}],
        tag: [{required: true, message: '请输入', trigger: 'blur'}]
      }
    }
  },
  computed: {
    ...mapGetters(["receivetaskList"]),
    ...mapGetters(["labels"]),

  },
  mounted() {
    // this.onImageLoad()
    this.dataList = this.receivetaskList;
  },
  methods: {
    /**记录图片当前的大小和原始大小 data={rawW,rawH,currentW,currentH} */
    onImageLoad(data) {
      console.log("data:")
      console.log(data)
      this.imageInfo = data
    },
    getImgList(task_name) {
    console.log("task" + task_name)
      getImgListApi(task_name).then((response) => {
        this.imgList = response.data['img_list'];
      });
    },
    setTag(v) {
      this.$refs['aiPanel-editor'].getMarker().setTag(v)
    },
    addTag() {
      this.innerVisible = true
      this.innerForm.tagName = ''
      this.innerForm.tag = ''
    },
    delTag(index) {
      this.tags.splice(index, 1)
    },
    close() {
      this.innerVisible = false
      this.$refs['innerForm'].resetFields()
    },
    beforeClose(done) {
      this.$refs['innerForm'].resetFields()
      done()
    },
    createForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let index in this.tags) {
            let item = this.tags[index]
            if (
              item.tagName === this.innerForm.tagName ||
              item.tag === this.innerForm.tag
            ) {
              this.$message.warning('标签名或标签值已存在，请重新输入')
              return
            }
          }
          this.tags.push({
            tagName: this.innerForm.tagName,
            tag: this.innerForm.tag
          })
          this.innerVisible = false
        }
      })
    },
    /**
     * 完成标记，提交标记集合
     */
    submitForm(form) {
      let data = this.$refs['aiPanel-editor'].getMarker().getData()
      let Labels = {
        filename: '',
        height: 0,
        width: 0,
        xmin: [],
        xmax: [],
        ymin: [],
        ymax: [],
        tag: []
      }

      this.allInfo = data
      console.log(this.allInfo)

      let size = {
        width: this.imageInfo.rawW,
        height: this.imageInfo.rawH
      }

      console.log(this.currentInfo.currentBaseImage)
      console.log("name:" + this.currentInfo.currentBaseImage.split('/').pop().split('.')[0])
      Labels.filename = this.currentInfo.currentBaseImage.split('/').pop().split('.')[0]
      Labels.width = size.width
      Labels.height = size.height

      for (let i = 0; i < this.allInfo.length; i++) {
        let xmin = ((parseInt(this.allInfo[0].position.x.substring(0, this.allInfo[0].position.x.length - 1)) * size.width) / 100).toFixed(0).toString()
        console.log(xmin, '左上')
        let ymin = ((parseInt(this.allInfo[0].position.y.substring(0, this.allInfo[0].position.y.length - 1)) * size.height) / 100).toFixed(0).toString()
        console.log(ymin, '右上')
        let xmax = ((parseInt(this.allInfo[0].position.x1.substring(0, this.allInfo[0].position.x1.length - 1)) * size.width) / 100).toFixed(0).toString()
        console.log(xmax, '右上')
        let ymax = ((parseInt(this.allInfo[0].position.y1.substring(0, this.allInfo[0].position.y1.length - 1)) * size.height) / 100).toFixed(0).toString()
        console.log(ymax, '左上')
        let tag = this.allInfo[i].tagName
        Labels.xmin.push(xmin)
        Labels.xmax.push(xmax)
        Labels.ymin.push(ymin)
        Labels.ymax.push(ymax)
        Labels.tag.push(tag)
      }
      console.log("Labels:")
      console.log(Labels)


      this.$store.dispatch('annotate/setLabels', {'Labels': Labels, 'form': form});
      this.$message.success("标签保存成功");
      // console.log(
      //   (xmax - xmin).toFixed(2),
      //   (ymax - ymin).toFixed(2),
      //   '计算矩形宽高'
      // )
    },

    // 点击左右按钮显示更多
    showMore(v) {
      let el = this.$refs.picContainer
      if (v == 'up') {
        this.active++
        if (this.active >= this.picTotal - 3) {
          // 最后4张图
          this.active = this.pics.length - 3
          return
        }
        if (
          this.pics.length - 3 == this.active &&
          this.pics.length < this.picTotal
        ) {
          this.photoPageIndex++
          this.getPhotos()
          return
        }
      } else {
        this.active--
        if (this.active < 0) this.active = 0
      }
      el.style.transform =
        'translateX(-' + (this.active / this.pics.length) * 100 + '%)'
    },

    getPhotos() {
      return this.$nextTick(() => {
        let el = this.$refs.picContainer
        if (el) {
          el.style.width = el.scrollWidth + 'px'

          el.style.transform =
            'translateX(-' + (this.active / this.pics.length) * 100 + '%)'
        }
      })
    },
    /**得到当前点击图片*/
    activePic(v) {
      this.currentInfo.currentBaseImage = v
    },

    handleChange(label) {
      console.log(label)
    }
  }
}
</script>

<style lang="scss" scoped>

.select {
  width: 100%;
  display: inline;
  margin: 20px 20px 20px 20px;

  &-item {
    margin-right: 20px;
    margin-bottom: 20px;
    display: inline-block;
  }
}

.pics {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  .arrow {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    //background-image: url("../../../../assets/404.png");
    background-repeat: no-repeat;
    background-size: contain;

    &.arrow-right {
      transform: rotate(180deg);
    }
  }

  .pic-container {
    // width: 1180px;
    width: calc(100% - 30px);
    height: 960px;
    margin: 0 auto;
    overflow: hidden;

    .pic-box {
      height: 100%;
      // min-width: 1180px;
      min-width: calc(100% - 30px);
      transition: all 0.5s linear;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    .pic {
      float: left;
      border: 1px solid #ccc;
      box-sizing: border-box;
      margin-right: 10px;
      width: 185px;
      height: 114px;

      .info {
        width: 183px;
        height: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: relative;

        &:hover {
          border: 1px solid skyblue;
        }
      }
    }
  }
}

.tagList {
  .title {
    text-align: center;
    font-weight: bold;
  }

  .handleButton {
    width: 100%;
    margin-bottom: 10px;
  }

  .tags {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;

    .el-icon-delete {
      cursor: pointer;
    }
  }
}
</style>

