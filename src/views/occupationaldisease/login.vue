<template>
  <div class="login-main"> 
    <div class="login-form"> 
      <img class="abImg" src="../../../img/人物.png" />
      <div class="form-inputs">
        <div class="login-title">职业健康检查机构设置</div>
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
          <el-form-item prop="userName" label="组织名称">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.orgame" placeholder="组织名称"></el-input>
          </el-form-item>
          <!-- <el-form-item prop="password" label="上报单位">
            <el-input prefix-icon="el-icon-lock" v-model="dataForm.password" type="password" placeholder="上报单位"></el-input>
          </el-form-item> -->
          <el-form-item label="登录用户">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.userName" placeholder="登录用户"></el-input>
          </el-form-item>
          <el-form-item label="登陆密码">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.userPwd" placeholder="登陆密码"></el-input>
          </el-form-item>
          <el-form-item label="平台地址">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.requesturl" placeholder="平台地址"></el-input>
          </el-form-item>
          <!-- <el-form-item label="填表人">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.userName" placeholder="填表人"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.userName" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="上传数据后查看返回信息">
            <el-input class="br" prefix-icon="el-icon-user" v-model="dataForm.userName" placeholder="上传数据后查看返回信息"></el-input>
          </el-form-item> -->
          <el-form-item>
            <el-button class="login-btn-submit" type="primary" @click="dataFormSubmit()">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
  
<script>
// import { getUUID } from '@/utils'
import * as report from "@/api/report";
export default {
  data() {
    return {
      dataForm: {
        userName: "",
        password: "",
        uuid: "",
        captcha: "",
      },
      dataRule: {
        userName: [
          { required: true, message: "帐号不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
        ],
      },
      captchaPath: "",
    };
  }, 
  created() { 
    console.log(sessionStorage.getItem("diseaseInfo"), this.$router);
    const session = sessionStorage.getItem("diseaseInfo")
    if (!!session?.username) {
      console.log("进来了");
      this.$router.push({
        path: "/occupationaldisease/diseasedata",
      });
    }
  },
  methods: {
    // 提交表单
    dataFormSubmit() {
      var that = this;
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          report
            .dataFormSubmit({
              businesstype: "CustomerLogin",
              whereitems: [
                { key: "account", value: that.dataForm.userName },
                { key: "pwd", value: that.encode(that.dataForm.password) },
                { key: "code", value: that.dataForm.captcha },
                { key: "uuid", value: that.dataForm.uuid },
              ],
            })
            .then((res) => {
              if (res.code == 200) {
                localStorage.setItem("diseaseInfo", JSON.stringify(res.result));
                this.$router.push({
                  path: "/occupationaldisease/diseasedata",
                });
              }
            });
        }
      });
    },
    encode(str) {
      // 对字符串进行编码
      var encode = encodeURI(str);
      // 对编码的字符串转化base64
      var base64 = btoa(encode);
      return base64;
    }, 
  },
};
</script>

<style scoped>
.login-main {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgb(238, 238, 238);
  background: url("../../../img/背景.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.login-form {
  padding: 20px;
  background-color: rgb(255, 255, 255);
  border-radius: 8px;
  display: inline-flex;
  background-image: url("../../../img/背景底图.png");
  background-repeat: no-repeat;
}
.abImg {
  width: 350px;
  height: 350px;
  padding-top: 20px;
  flex: 3;
}
.form-inputs {
  flex: 2;
  margin-left: 10px;
}
.login-btn-submit {
  width: 300px;
}
.login-title {
  color: #ffffff;
  font-size: 30px;
  padding-bottom: 30px;
  letter-spacing: 4px;
  font-weight: 700;
}
</style>
  