<template>
  <div class="login_container">
    <!-- 新登录页面 -->
    <div class="content">
      <div class="left_img"></div>
      <div class="form_box">
        <div class="head_title">
          <div class="big_text">健康体检管理平台</div>
          <div class="small_text">健康体检管理平台企业版</div>
        </div>
        <div class="form">
          <el-form
            autoComplete="on"
            :model="loginForm"
            :rules="loginRules"
            ref="loginForm"
            label-position="left"
          >
            <el-form-item label="用户名">
              <el-input
                name="username"
                type="text"
                @keyup.enter.native="handleJumpPassWord"
                v-model="loginForm.username"
                autoComplete="on"
                placeholder="请输入登录账号"
              ></el-input>
            </el-form-item>
            <el-form-item class="password mb10" label="密码">
              <el-input
                name="password"
                ref="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.password"
                autoComplete="on"
                placeholder="请输入密码"
              ></el-input>
              <span
                @click="showPwd(0)"
                :class="[
                  pwdType === 'password'
                    ? 'icon iconfont icon-xianshi_chakan'
                    : 'icon iconfont icon-yincang',
                  'icon_eye',
                ]"
              ></span>
            </el-form-item>
            <el-form-item class="mb10">
              <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
            </el-form-item>
            <el-form-item class="login_btn">
              <el-button
                class="login"
                v-waves
                type="primary"
                :loading="loading"
                @click.native.prevent="handleLogin"
                >登录</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 重置密码弹框 -->
      <!-- showResetPassword -->
      <el-dialog
        title="修改密码"
        :visible.sync="showResetPassword"
        class="resetpass"
        width="30%"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <span>
          <el-form
            :model="resetPassForm"
            ref="resetPassForm"
            label-width="100px"
            class="demo-ruleForm"
            :rules="resetPassFormRules"
          >
            <el-form-item
              class="password"
              size="mini"
              label="新密码"
              prop="password"
            >
              <el-input
                :type="resetPtype"
                v-model="resetPassForm.password"
                autocomplete="off"
              ></el-input>
              <span
                @click="showPwd(1)"
                :class="[
                  pwdType === 'password'
                    ? 'icon iconfont icon-xianshi_chakan'
                    : 'icon iconfont icon-yincang',
                  'icon_eye',
                ]"
              ></span>
            </el-form-item>
            <el-form-item
              class="password"
              size="mini"
              label="确认密码"
              prop="cpassword"
            >
              <el-input
                :type="cresetPtype"
                v-model="resetPassForm.cpassword"
                autocomplete="off"
              ></el-input>
              <span
                @click="showPwd(2)"
                :class="[
                  pwdType === 'password'
                    ? 'icon iconfont icon-xianshi_chakan'
                    : 'icon iconfont icon-yincang',
                  'icon_eye',
                ]"
              ></span>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showResetPassword = false"
            >取 消</el-button
          >
          <el-button size="mini" type="primary" @click="handleResetPassSubmit"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </div>
    <!-- 旧登录页  login-container -->
    <!-- <div class="content">
      <img class="leftImg" src="~@/assets/login/left.png" alt="">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title">健康体检管理平台</h3>
        <p class="tips">健康体检管理平台企业版</p>
        <el-form-item prop="username">

          <el-input suffix-icon="iconfont icon-yonghu_zhanghao_wode" name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入登录账号" />
        </el-form-item>
        <el-form-item prop="password">

          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="请输入密码"></el-input>

          <span @click="showPwd" :class="pwdType === 'password' ? 'icon iconfont icon-xianshi_chakan' : 'icon iconfont icon-yincang'"></span>

        </el-form-item>

         <el-form-item prop="tenantid">
          <span class="icon iconfont icon-yonghuguanli"></span>
          <el-select v-model="tenant" placeholder="请选择" @change="tenantChange">
            <el-option v-for="item in tenants" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> 

        <div class="tips" v-if="isIdentityAuth">
          <router-link to="/oidcRedirect">
            <el-badge is-dot>接口服务器启用了Oauth认证，请点击这里登录</el-badge>
          </router-link>
        </div>
        <el-form-item v-else>
          <el-button v-waves type="primary" style="width:100%;background:#4452D5;font-size: 24px;height: 50px;" :loading="loading" @click.native.prevent="handleLogin">
            登 录
          </el-button>
        </el-form-item>
         <p class="tips"> 默认System登录后，你可以无法无天</p>
        <p class="tips">admin/admin登录后，会少一点权限，资源管理/分类管理的字段会少一点</p>
        <p class="tips">test/test登录后，权限会更少,资源管理/分类管理的字段也更少</p> 
      </el-form>
    </div> -->
  </div>
</template>

<script>
import waves from "@/directive/waves"; // 水波纹指令
import { mapGetters, mapActions } from "vuex";
import JSEncrypt from "jsencrypt";
import { getSysConfigInfo } from "@/api/sysconfig";
import { login } from "@/api/login";
import socketService from "@/utils/socketService.js";

// 引入
const Base64 = require("js-base64").Base64;
export default {
  name: "login",
  directives: {
    waves,
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      if (value.length <= 0) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
      0;
    };
    return {
      murmur: "",
      showResetPassword: false,
      resetPassForm: {
        password: "",
        cpassword: "",
      },
      resetPassFormRules: {
        password: [
          { required: true, message: "密码不允许为空", trigger: "blur" },
        ],
        cpassword: [
          { required: true, message: "密码不允许为空", trigger: "blur" },
        ],
      },
      tenant: this.tenantid || "PEISDBContext", //当前选择的租户
      tenants: [
        {
          value: "PEISDBContext",
          label: "默认租户",
        },
      ],
      loginForm: {
        username: "", // System
        password: "", // 123456
        remember: false,
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePass,
          },
        ],
      },
      loading: false,
      pwdType: "password",
      resetPtype: "password",
      cresetPtype: "password",
      rememberPwd: "",
      strArr: [],
    };
  },
  computed: {
    ...mapGetters(["isIdentityAuth", "tenantid"]),
  },
  mounted() {
    // 在页面加载时从cookie获取登录信息
    let username = this.getCookie("username");
    let password = Base64.decode(this.getCookie("password"));
    // 如果存在赋值给表单，并且将记住密码勾选
    if (password) {
      this.loginForm.username = username;
      this.loginForm.password = password;
      this.loginForm.remember = true;
    }
  },
  methods: {
    handleResetPassSubmit() {
      this.$refs["resetPassForm"].validate((valid) => {
        if (valid) {
          if (
            this.resetPassForm.password.trim() !==
            this.resetPassForm.cpassword.trim()
          ) {
            this.$message.warning("两次输入密码不一致!");
            return;
          }
          var encryptor = new JSEncrypt(); // 创建加密对象实例
          //之前ssl生成的公钥，复制的时候要小心不要有空格
          encryptor.setPublicKey(window.pubKey); //设置公钥
          let password = encryptor.encrypt(
            Base64.encode(this.loginForm.password)
          ); // 对内容进行加密
          let newPassword = encryptor.encrypt(
            Base64.encode(this.resetPassForm.password)
          ); // 对内容进行加密
          login(this.loginForm.username, password, "", newPassword).then(
            (response) => {
              this.$message.success("操作成功!");
              this.showResetPassword = false;
            }
          );
        }
      });
    },
    handleTest() {
      let str = `5mdKQ1MbnLk/vPadSNU3Y3Dru0/lee+C9eY+m6/7apGSGRtXW4CPTpZbgqSmnMJOXDT9m0JDWnFZKHWZxju0XGknKTRVRxvWX20Dk7aCnfkjJKv63tPTrk4tLY+LyLqDqBeY6JxZD/Eje8/C9TlVaCS+gseLdvMOMB9SxUj0d1uv1Y6tpQs8RQ8vBhXVCVKwwwnd19Yeh3xAPpJp5Fo47edYfqK+e5Uib0bfHgdCc3RDHLftTP1ic0iHuOiCI97BTkskQzIMyrAdkBQzJ+r9eNAQLf9FtpmaAvEZIVggSSlwWqy1gmAYLtGW6tDpzXyw7QuvyH7tMGTdojcx8puehg==`;
      const forLength = Array.from(Array(Math.ceil(str.length / 100)));
      const slices = forLength.map((i, k) => {
        return str.slice(k * 100, (k + 1) * 100);
      });
      console.log(slices);
    },
    handleJumpPassWord() {
      this.$refs.password.focus();
    },
    ...mapActions([
      "setTenantId", //
    ]),

    // tenantChange(e) {
    //   this.setTenantId(e)
    // },
    showPwd(status) {
      if (status == 0) {
        if (this.pwdType === "password") {
          this.pwdType = "";
        } else {
          this.pwdType = "password";
        }
      } else if (status == 1) {
        if (this.resetPtype === "password") {
          this.resetPtype = "";
        } else {
          this.resetPtype = "password";
        }
      } else {
        if (this.cresetPtype === "password") {
          this.cresetPtype = "";
        } else {
          this.cresetPtype = "password";
        }
      }
    },
    getGuid() {
      //修订的另外一个版本
      var guid = "";
      for (var i = 1; i <= 32; i++) {
        var g = Math.floor(Math.random() * 16).toString(16);
        guid += g;
        if (i == 8 || i == 12 || i == 16 || i == 20) {
          guid += "";
        }
      }
      return guid.toUpperCase();
    },
    getFingerprintMd5Code() {
      let _that = this;
      let options = { excludes: {} };
      Fingerprint2.get(options, function (components) {
        const values = components.filter((t) => {
          return t.key == "canvas" ? t.value : "";
        })[0].value;
        // 指纹
        const murmur = _that.getGuid();
        // const murmur = Fingerprint2.x64hash128(values.join(""), 31);
        //写入cookied
        localStorage.setItem("md5code", murmur);
      });
      // let excludes = {};
      // excludes.audio = true;
      // excludes.enumerateDevices = true;
      // excludes.fontsFlash = true;
      // excludes.webgl = true;
      // let options = { excludes: excludes };
      // Fingerprint2.get(options, function (components) {
      //   // 参数
      //   const values = components.map(function (component) {
      //     return component.value;
      //   });
      //   // 指纹
      //   const murmur = Fingerprint2.x64hash128(values.join(""), 31);
      //   localStorage.setItem("md5code", murmur);
      // });
    },
    handleLogin() {
      this.setTenantId("PEISDBContext");
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          // this.loginForm.password = this.$Base64.encode(
          //   this.loginForm.password
          // );
          this.rememberPwd = this.loginForm.password;
          let data = JSON.parse(JSON.stringify(this.loginForm));
          this.$store
            .dispatch("Login", data)
            .then((res) => {
              this.loading = false;
              console.log(res.passwordStrength == 0);
              if (res.passwordStrength == 0) {
                // 储存登录信息
                this.setUserInfo();
                this.$router.push({
                  path: "/",
                });
                localStorage.setItem("critical", JSON.stringify(true));
                // if (
                //   localStorage.getItem("md5code") == null ||
                //   localStorage.getItem("md5code") == undefined ||
                //   localStorage.getItem("md5code") == ""
                // ) {
                //   this.getFingerprintMd5Code();
                // }
              } else {
                this.$alert(
                  "当前密码强度较低,请修改密码后登录!(符号+英文大小写+数字8位数)",
                  "提示",
                  {
                    confirmButtonText: "确定",
                    showClose: false,
                    closeOnClickModal: false,
                    callback: (action) => {
                      this.showResetPassword = true;
                    },
                  }
                );
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 储存表单信息
    setUserInfo() {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.loginForm.remember) {
        let passWord = Base64.encode(this.rememberPwd); // 对内容进行加密
        // let passWord = Base64.encode(this.rememberPwd);
        this.setCookie("username", this.loginForm.username, 7);
        // base64加密密码
        this.setCookie("password", passWord, 7);
        this.setCookie("remember", this.loginForm.remember, 7);
      } else {
        this.setCookie("username", this.loginForm.username, 7);
        this.setCookie("password", "");
      }
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 保存cookie
    setCookie(cName, value, expiredays) {
      var exdate = new Date();
      exdate.setDate(exdate.getDate() + expiredays);
      document.cookie =
        cName +
        "=" +
        decodeURIComponent(value) +
        (expiredays == null ? "" : ";expires=" + exdate.toGMTString());
    },
  },
  beforeUnload() {
    // 在用户关闭浏览器标签或离开当前页面时执行的操作
    alert("您确定要关闭页面吗？");
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;
$color_balck: #333;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $color_balck;
      height: 47px;

      &:-webkit-autofill {
        transition: background-color 5000s ease-in-out 0s;
      }
    }
  }

  .el-form-item {
    margin-bottom: 35px;
    border-radius: 5px;
    color: #454545;

    .el-form-item__content {
      background: #fff;
      border: 1px solid rgba(223, 223, 223, 1);
    }

    &:last-child {
      padding-top: 20px;

      .el-form-item__content {
        border: none;
      }
    }
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
@media screen and (max-width: 1150px) {
  .leftImg {
    width: 450px !important;
  }
}

@media screen and (max-width: 1010px) {
  .leftImg {
    width: 380px !important;
  }
}

@media screen and (max-width: 940px) {
  .leftImg {
    display: block;
    width: 260px !important;
    margin: 0 auto !important;
  }
}

$dark_gray: #d1dfe8;

.login-container {
  height: 100%;
  background: url("~@/assets/login/new_bg.png") no-repeat;
  background-color: #ebebea;
  background-position: 0 0;
  background-size: 100% 100%;
  text-align: center;

  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }

  .content {
    // display: inline-block;
    // vertical-align: middle;

    > img {
      width: 568px;
      margin-right: 150px;
      vertical-align: middle;
    }

    .login-form {
      display: inline-block;
      width: 400px;
      vertical-align: middle;
    }
  }

  .svg-container {
    color: $dark_gray;
    vertical-align: middle;
    width: 33px;
    display: inline-block;
    font-size: 22px;

    &_login {
      font-size: 31px;
    }
  }

  .title {
    font-size: 26px;
    font-weight: 400;
    color: #4452d5;
    margin: 0;
    text-align: left;
  }

  .tips {
    color: #959595;
    font-size: 14px;
    margin-top: 0;
    margin-bottom: 40px;
    text-align: left;
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    font-size: 24px;
  }
}
@import "./css/index.scss";
</style>