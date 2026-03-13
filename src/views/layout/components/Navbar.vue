<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="logo">
      <img class="user-avatar" draggable="false" :src="logo" />健康体检管理平台
    </div>
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <el-dropdown class="itemavatar-container" trigger="click">
      <div class="avatar-wrapper">
        {{ parentName }}-{{ center }}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <template v-for="item in organItems">
          <el-dropdown-item>
            <span @click="changecenter(item.id, $event)">{{ item.name }}</span>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown class="avatar-container" @command="handleCommand" trigger="click">
      <div class="avatar-wrapper">
        欢迎您，{{ name }}
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <el-dropdown-item command="handleGoProfile">
          <span>个人中心</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span>切换主题
            <el-switch :active-value="1" :inactive-value="0" style="margin-left: 5px" v-model="theme" />
          </span>
        </el-dropdown-item>
        <el-dropdown-item command="assist">
          <span>帮助</span>
        </el-dropdown-item>
        <el-dropdown-item command="logout" divided>
          <span>退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Hamburger from "@/components/Hamburger";
import logo from "@/assets/logo.png?imageView2/1/w/80/h/80";
import * as userlogin from "@/api/login";
import socketService from "@/utils/socketService.js";
export default {
  data: function () {
    return {
      logo: logo,
      theme: 1,
      parentName: "",
      center: "",
      organItems: [],
      meccode: "",
      theme: 1,
      loginForm: {
        username: "",
        password: "",
        Meccode: "",
      },
    };
  },
  components: {
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "isIdentityAuth", "name", "themeStatus"]),
  },
  watch: {
    theme() {
      this.toggleClass(document.body, "custom-theme");
    },
  },
  mounted() {
    if (window.logoName) {
      this.logo = require(`@/assets/${window.logoName}`);
      console.log(this.logo);
    }
    this.theme = Number(this.themeStatus);
    this.toggleClass(document.body, "custom-theme");
    this.load();
  },
  methods: {
    ...mapActions(["signOutOidc", "saveTheme"]),
    toggleClass(element, className) {
      if (!element || !className) {
        return;
      }
      let classString = element.className;
      const nameIndex = classString.indexOf(className);
      if (nameIndex === -1) {
        classString += "" + className;
      } else if (this.theme !== 1) {
        classString =
          classString.substr(0, nameIndex) +
          classString.substr(nameIndex + className.length);
      }
      element.className = this.theme === 1 ? classString : "";
      this.saveTheme(this.theme);
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    load() {
      userlogin.GetMyOrgs().then((response) => {
        this.organItems = response.result.organItems;
        this.loginForm.username = response.result.account;
        this.loginForm.password = response.result.password;
        this.meccode = response.result.meccode;
        localStorage.setItem("userId", JSON.stringify(response.result.userId));
        localStorage.setItem(
          "usernameOrId",
          JSON.stringify({
            usercode: response.result.account,
            username: response.result.name,
            usertype: response.result.userType,
            sex: response.result.sex,
            hisCode: response.result.hisCode,
            meccode: response.result.meccode,
          })
        );
        response.result.organItems.forEach((element) => {
          if (element.id == response.result.meccode) {
            this.center = element.name;
            this.parentName = element.parentName;
          }
        });
      });
    },
    changecenter(code, event) {
      console.log(this.organItems);
      console.log(this.meccode);
      console.log(code);
      if (this.organItems.length > 1 && this.meccode != code) {
        this.loginForm.Meccode = code;
        this.$store.dispatch("LogOut").then(() => {
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              location.reload();
            })
            .catch(() => {});
        });
      }
    },
    logout() {
      if (this.isIdentityAuth) {
        this.signOutOidc();
      } else {
        this.$store.dispatch("LogOut").then(() => {
          localStorage.removeItem("userId");
          location.reload(); // 为了重新实例化vue-router对象 避免bug
          // socketService.close();
        });
      }
    },
    assist() {
      this.$router.push("/assistance");
    },
    handleGoProfile() {
      this.$router.push("/profile");
    },
    handleCommand(name) {
      if (!name) return;
      this[name]();
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.logo {
  font-size: 18px !important;
  // font-weight: 600 !important;
}
</style>
