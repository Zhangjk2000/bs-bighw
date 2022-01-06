<template>
  <div class="register">
    <!-- 注册面板 -->
    <div class="register-box">
      <div class="register-box-title">
        图像标注系统
      </div>
      <div class="register-box-from">
        <el-form
          ref="registerForm"
          :rules="registerRules"
          :model="registerForm"
          class="demo-ruleForm"
          auto-complete="on"
          label-position="left"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="registerForm.username"
              placeholder="请输入用户名"
              size="medium"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            >
              <el-button slot="prepend" icon="el-icon-user"/>
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="registerForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              size="medium"
              name="password"
              tabindex="2"
              auto-complete="on"
            >
              <el-button slot="prepend" icon="el-icon-key"/>
            </el-input>
            <span class="show-pwd" @click="showPwd">
              <SvgIcon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
              />
            </span>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item prop="email">
            <el-input
              ref="email"
              v-model="registerForm.email"
              placeholder="请输入邮箱"
              size="medium"
              name="email"
              tabindex="1"
              auto-complete="on"
              @keyup.enter.native="handleRegister"
            >
              <el-button slot="prepend" icon="el-icon-message"/>
            </el-input>
          </el-form-item>
          <!-- 注册按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              size="medium"
              :loading="loading"
              style="width: 100%;"
              @click.native.prevent="handleRegister"
            >
              注册
            </el-button>
          </el-form-item>
          <router-link to="/login" class="login-text">
            登录
          </router-link>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import {
  validateRegisterUsername,
  validateRegisterPassword,
  validateRegisterEmail
} from "@/utils/validate.js";

export default {
  name: "Register",

  data() {
    return {
      //表单数据
      registerForm: {
        username: "",
        password: "",
        email: ""
      },
      //表单验证
      registerRules: {
        username: [
          // 当组件离开焦点的时候进行验证
          {required: true, message: '请输入用户名', trigger: 'blur'},
          // 验证长度
          {required: true, trigger: 'blur', validator: validateRegisterUsername},
          {required: true, trigger: 'change', validator: validateRegisterUsername},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {required: true, trigger: 'blur', validator: validateRegisterPassword},
          {required: true, trigger: 'change', validator: validateRegisterPassword},
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {required: true, trigger: 'blur', validator: validateRegisterEmail},
          {required: true, trigger: 'change', validator: validateRegisterEmail},
        ]
      },
      loading: false,
      passwordType: "password",
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 显示密码
     */
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    /**
     * 注册
     */
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/register", this.registerForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/"
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("提交错误!!");
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
img {
  margin: 10px 20px 0 0;
  width: 40px;
  height: 40px;
  cursor: pointer;
}

.register {
  width: 100%;
  height: 100%;
  position: relative;
  &-box {
    width: 350px;

    /* height: 287px; */
    background: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    box-shadow: 0 0 2px #f7f7f7;
    border: 1px solid #f7f7f7;
    position: absolute;
    left: 50%;
    top: 40%;
    margin-left: -175px;
    margin-top: -150px;

    &-title {
      line-height: 50px;
      font-size: 20px;
      color: #000;
      text-align: center;
      border-bottom: 1px solid #312a2a;
    }

    &-from {
      width: 100%;
      height: auto;
      padding: 30px;
      box-sizing: border-box;

      .login-text {
        cursor: pointer;
        float: right;
      }

      .show-pwd {
        position: absolute;
        right: 10px;
        top: 0;
        font-size: 16px;
        color: #889aa4;
        cursor: pointer;
        user-select: none;
      }
    }
  }
}
</style>
