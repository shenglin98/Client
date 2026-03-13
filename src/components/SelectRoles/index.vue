<template>
  <div>
    <el-select
      v-if="rolesList.length > 0"
      style="width: 100%"
      v-model="selectList"
      @change="handleChangeSelectList"
      multiple
      filterable
    >
      <el-option
        v-for="item in rolesList"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import selectUsersCom from "@/components/SelectUsersCom";

import { getList } from "@/api/roles";
export default {
  name: "select-roles",
  components: {
    selectUsersCom,
  },
  props: ["roles", "userNames", "placeholder", "ignoreAuth"],
  data() {
    return {
      selectDialog: false,
      flag: false,
      selectList: [],
      rolesList: [],
    };
  },
  mounted() {
    this.handleGetRolesList();
    this.selectList = this.roles || [];
  },
  methods: {
    handleChangeSelectList(val) {
      this.$emit("roles-change", "roles", val);
    },
    // 获取角色列表
    handleGetRolesList() {
      getList({
        page: 1,
        limit: 100000,
        orgId: "",
        key: "",
      }).then((res) => {
        this.rolesList = res.result.filter((k) => {
          return k.status === 0;
        });
      });
    },
  },
  computed: {
    selectRoles: {
      get() {
        return this.roles;
      },
      set(val) {
        this.$emit("roles-change", "roles", val);
      },
    },
    names: {
      get() {
        return this.userNames;
      },
      set(val) {
        this.$emit("roles-change", "Texts", val);
      },
    },
  },
  watch: {
    userNames() {
      this.names = this.userNames;
    },
    // userNames() {
    //   this.names = this.userNames;
    // },
  },
};
</script>

<style lang="scss">
.el-transfer {
  margin-top: 10px;
}
.user-dialog {
  &.custom-dialog {
    .el-dialog {
      height: 70%;
      .el-dialog__body {
        height: calc(100% - 35px - 40px);
      }
      .el-dialog__headerbtn {
        top: 0;
      }
    }
  }
}
</style>
