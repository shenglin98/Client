<template>
  <div class="add_edit">
    <el-card class="box-card message_box">
      <div class="head_box">
        <div class="head_box-title">
          <div
            style="
              width: 5px;
              background-color: #2a85ea;
              border-radius: 2px;
              height: 20px;
            "
          ></div>
          <div
            style="
              font-size: 20px;
              font-weight: 600;
              margin: 10px 10px 10px 5px;
            "
          >
            单位信息
          </div>
        </div>
        <div class="btn_group" style="margin-right: 10px">
          <el-button
            plain
            type="primary"
            size="small"
            @click="handleSubmitDialog"
            >保存</el-button
          >
          <el-button
            plain
            type="primary"
            size="small"
            icon="el-icon-close"
            @click="handleCloseDialog"
            >关闭</el-button
          >
        </div>
      </div>
      <el-form
        :rules="mainruls"
        ref="form"
        class="page_form"
        :model="bodyForm"
        label-width="80px"
      >
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="单位名称" prop="companycode">
              <el-select
                style="width: 100%"
                :disabled="addOrEdit == 'edit'"
                v-model="bodyForm.companycode"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="handleRemoteMethod"
                :loading="selectLoading"
                @change="handleSelectChange"
                @clear="handleRemoteMethod"
              >
                <el-option
                  v-for="(item, index) in companyitems"
                  :key="index"
                  :value="item.code"
                  :label="`${item.code}　${item.name}`"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检批次">
              <el-input
                v-model="bodyForm.batch"
                disabled
                placeholder="自动生成"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检时间" prop="rangeTime">
              <el-date-picker
                v-model="rangeTime"
                style="width: 100%"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检人数">
              <el-input v-model.number="bodyForm.total"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item size="small" label="预约时间" prop="registerdate">
              <el-date-picker v-model="bodyForm.registerdate" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="联系人" prop="contacts">
              <el-input v-model="bodyForm.contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="联系电话">
              <el-input v-model="bodyForm.telephone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="邮箱">
              <el-input v-model="bodyForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检地点">
              <!-- <el-input v-model="bodyForm.address"></el-input> -->
              <el-select
                v-model="bodyForm.address"
                placeholder="请选择"
                style="width: 100%"
                :loading="centerLoading"
                clearable
                filterable
                remote
                reserve-keyword
                :remote-method="handleSelecetCenterDic"
                @clear="handleSelecetCenterDic"
              >
                <el-option
                  v-for="item in hospitalnameArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="接待人">
              <el-select
                filterable
                @change="handleSelectChange"
                style="width: 100%"
                v-model="bodyForm.receptcode"
              >
                <el-option
                  v-for="(item, index) in receptitems"
                  :key="index"
                  :value="item.code"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="登记人">
              <el-input v-model="registername" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="合同编码">
              <el-input v-model="bodyForm.contractno"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="合同名称">
              <el-input v-model="bodyForm.contractname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="备注">
              <el-input v-model="bodyForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="合同附件">
              <!-- annex -->
              <el-upload
                class="upload-demo"
                name="files"
                :show-file-list="false"
                action
                :on-change="handleOnPpload"
                ref="upload"
                :file-list="fileList"
                :auto-upload="false"
                accept=".docx,.doc,.pdf"
              >
                <el-button slot="trigger" size="small" type="primary"
                  >选取文件</el-button
                >
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="fileUrl != ''">
            <el-form-item size="small" label="文件预览">
              <!-- <a :href="fileUrl" target="_blank">{{ fileUrl }}</a> -->
              <el-link
                type="primary"
                class="filelink"
                target="_blank"
                :href="fileUrl"
                >{{ fileName }}</el-link
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 体检进度 -->
    <el-card v-if="addOrEdit == 'edit'" class="schedule">
      <div class="head_box-titles">
        <div
          style="
            width: 5px;
            background-color: #2a85ea;
            border-radius: 2px;
            height: 20px;
          "
        ></div>
        <div
          class="box-titles"
          style="font-size: 20px; font-weight: 600; margin: 10px 10px 10px 5px"
        >
          体检进度
        </div>
        <div class="subscribe_group">
          <div class="sub_item">
            <span class="sub_title sub_success">预约</span>
            <span
              class="sub_value"
              style="
                color: #fc5531;
                border: 1px solid #fc5531;
                width: 50%;
                text-align: center;
              "
              >{{ bodyForm.registercount }}</span
            >
          </div>
          <div class="sub_item">
            <span class="sub_title sub_primary">未检</span>
            <span
              class="sub_value"
              style="
                color: #67c23a;
                border: 1px solid #67c23a;
                width: 50%;
                text-align: center;
              "
              >{{ bodyForm.notcheckcount }}</span
            >
          </div>
          <div class="sub_item">
            <span class="sub_title sub_warning">检中</span>
            <span
              class="sub_value"
              style="
                color: #409eff;
                border: 1px solid #409eff;
                width: 50%;
                text-align: center;
              "
              >{{ bodyForm.checkingcount }}</span
            >
          </div>
          <div class="sub_item">
            <span class="sub_title sub_ok">完成</span>
            <span
              class="sub_value"
              style="
                color: #e6a23c;
                border: 1px solid #e6a23c;
                width: 50%;
                text-align: center;
              "
              >{{ bodyForm.checkedcount }}</span
            >
          </div>
        </div>
      </div>
    </el-card>
    <!-- 单位分组体检项目 -->
    <div
      class="bottom_group"
      :class="[addOrEdit == 'edit' ? 'edit_h' : 'add_h']"
    >
      <!-- 单位分组 -->
      <el-card class="box-card clearance_right">
        <div class="head_box" style="margin-bottom: 10px">
          <div class="head_box-title">
            <div
              style="
                width: 5px;
                background-color: #2a85ea;
                border-radius: 2px;
                height: 20px;
              "
            ></div>
            <div
              style="
                font-size: 20px;
                font-weight: 600;
                margin: 10px 10px 10px 5px;
              "
            >
              单位分组
            </div>
          </div>
          <div class="btn_group" style="margin-right: 10px">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAddUnitGroup"
              >添加分组</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              icon="el-icon-edit"
              @click="handleEditUnitGroup"
              >修改分组</el-button
            >
            <el-button
              type="primary"
              plain
              size="small"
              icon="el-icon-delete"
              @click="handleDelUnitGroup"
              >删除分组</el-button
            >
          </div>
        </div>
        <div class="unit_grouping">
          <div
            v-for="(item, index) in groupList"
            :key="index"
            class="unit_item"
            @click="handleChooseGroup(item)"
            :class="[
              {
                current_row:
                  chooseGroup && item.groupname == chooseGroup.groupname,
              },
            ]"
          >
            <el-row>
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <span>分组名称：</span>
                  <span>{{ item.groupname }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple-light">
                  <span>性别：</span>
                  <span>{{
                    item.sex == 0 ? "未知" : item.sex == 1 ? "男" : "女"
                  }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <span>分组人数：</span>
                  <span>{{ item.grouptotal }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="clearance_top">
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <span>所属部门：</span>
                  <span>{{ item.department }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple-light">
                  <span>结算方式：</span>
                  <span>{{
                    item.settlementtype == 0 ? "单位结算" : "个人结算"
                  }}</span>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple-light">
                  <span>检查类型：</span>
                  <span>{{ registerCup(item.checktype) }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="groupList.length == 0" class="empty_group">暂无数据</div>
        </div>
      </el-card>
      <!-- 体检项目 -->
      <el-card class="box-card combineitems">
        <div class="head_box" style="height: 38px">
          <div class="tj_box">
            <div class="head_box-title" style="margin-left: 0px">
              <div
                style="
                  width: 5px;
                  background-color: #2a85ea;
                  border-radius: 2px;
                  height: 20px;
                "
              ></div>
              <div
                style="
                  font-size: 20px;
                  font-weight: 600;
                  margin: 10px 10px 10px 5px;
                "
              >
                体检项目
              </div>
            </div>
          </div>
          <div class="price_box" v-if="chooseGroup">
            <span v-if="chooseGroup" style="margin-right: 10px">{{
              chooseGroup.groupname
            }}</span>
            <span v-else>暂无分组</span>
            <span
              v-if="chooseGroup && chooseGroup.combineitems"
              style="margin-right: 10px"
              >含{{ chooseGroup.combineitems.length }}个项目</span
            >
            <span v-else>含0个项目</span>
            <span v-if="chooseGroup"
              >金额{{ chooseGroup.originalprice.toFixed(2) }}元</span
            >
            <span v-else>金额0元</span>
          </div>
          <div class="btn_group" style="margin-right: 10px">
            <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleAddProject"
              >添加项目</el-button
            >
          </div>
        </div>
        <el-table
          class="combineitems_table"
          v-if="chooseGroup && chooseGroup.combineitems"
          :data="chooseGroup.combineitems"
          ref="mainTable"
          height="calc(100% - 20px)"
          min-width="500"
          stripe
          fit
          highlight-current-row
          style="width: 100%"
          :row-style="{ height: '32px' }"
          :header-cell-style="{
            textAlign: 'center',
            background: '#b6cfee',
            fontWeight: 600,
            color: '#18253a',
            height: '40px',
          }"
          :cell-style="{ padding: '0px', textAlign: 'center' }"
        >
          <el-table-column
            width="85"
            prop="combinecode"
            label="组合编码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            width="230"
            prop="combinename"
            label="组合名称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="价格" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.originalprice >= 0">{{
                scope.row.originalprice
              }}</span>
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="discount"
            label="折扣"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="discountprice"
            label="折后价"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <div v-else class="empty_group">暂无数据</div>
      </el-card>
    </div>
    <!-- 单位分组 分组信息弹框 -->
    <el-dialog
      class="dialog-mini group_form"
      width="58%"
      top="10%"
      :close-on-click-modal="false"
      title="添加分组"
      :visible.sync="chiladddialogFormVisible"
      @open="handleOpenChiladd"
      @close="handleChilclose"
    >
      <el-form
        ref="groupdataForm"
        :model="groupForm"
        :rules="groupRules"
        label-position="right"
        label-width="100px"
      >
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组名称'" prop="groupname">
              <el-input
                ref="groupname"
                v-model="groupForm.groupname"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'优先级'" prop="Priority">
              <el-input v-model="groupForm.priority" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="fromitem"
              size="small"
              :label="'年龄范围'"
              prop="Maxage"
            >
              <el-input class="range_age" v-model="groupForm.minage"></el-input>
              <span class="range_line">-</span>
              <el-input class="range_age" v-model="groupForm.maxage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'性别'" prop="sex">
              <el-select v-model="groupForm.sex" clearable style="width: 100%">
                <el-option
                  v-for="(item, index) in sexarr"
                  :key="index"
                  :value="item.key"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'婚否'" prop="Marriage">
              <el-select
                v-model="groupForm.marriage"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in marriagearr"
                  :key="index"
                  :value="item.key"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组标识'" prop="Groupmark">
              <el-input v-model="groupForm.groupmark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组人数'" prop="grouptotal">
              <el-input
                v-model.number="groupForm.grouptotal"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'所属部门'">
              <el-input v-model="groupForm.department" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'费用小计'" prop="Originalprice">
              <el-input
                v-model="groupForm.originalprice"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'折扣'" prop="Discountprice">
              <el-input
                v-model="groupForm.discount"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'折后费用'" prop="Discountprice">
              <el-input
                v-model="groupForm.discountprice"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'增项折扣'" prop="Discountprice">
              <el-input
                v-model="groupForm.adddiscount"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="'结算方式'"
              prop="Settlementtype"
            >
              <el-select
                v-model="groupForm.settlementtype"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in settlementtypearr"
                  :key="index"
                  :value="item.key"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              size="small"
              :label="'增项结算方式'"
              prop="Addsettlementtype"
            >
              <el-select
                v-model="groupForm.addsettlementtype"
                style="width: 100%"
                clearable
              >
                <el-option
                  v-for="(item, index) in addsettlementtypearr"
                  :key="index"
                  :value="item.key"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'检查类型'" prop="checktype">
              <el-select
                v-model="groupForm.checktype"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in registerGroup"
                  :key="index"
                  :value="item.code"
                  :label="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item size="small" :label="'分组说明'" prop="Remark">
              <el-input
                v-model="groupForm.remark"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'标准金额'">
              <el-input
                v-model.number="groupForm.quota"
                style="width: 100%"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="handleChilclose">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitAddGroup"
          >确认</el-button
        >
      </div>
    </el-dialog>
    <!-- 体检项目 -->
    <!-- <SetMealDialog v-if="showProjectDialog" :groupTableData="groupTableData" @submit="handleSubmitMedicalItems" @close="showProjectDialog = false" /> -->
    <SetMealDialog
      v-if="showProjectDialog"
      :sex="chooseGroup.sex"
      :groupTableData="chooseGroup.combineitems"
      @submit="handleSubmitMedicalItems"
      @close="showProjectDialog = false"
    />
  </div>
</template>
<script>
import {
  getSetMeal,
  getCompanyDetail,
  getCompanyAdd,
  setFilesUpload,
  getRegisterGroup,
  setGroupUpdate,
  getCenterDic,
} from "@/api/company_register.js";
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import SetMealDialog from "@/components/SetMealDialog/index.vue"; // 新项目弹框
import * as company_archives from "@/api/company_archives";

export default {
  name: "",
  props: {
    addOrEdit: {
      required: true,
      type: String,
    },
    editObj: {},
  },
  components: { SetMealDialog },

  computed: {
    // 处理检查类型配置
    registerCup() {
      return (code) => {
        let res = this.registerGroup.filter((k) => k.code == code)[0];
        return res && res.name;
      };
    },
    // 主体套餐表格配置
    tableOptions() {
      return [
        {
          title: "选择",
          type: "radio",
          width: 45,
        },
        {
          title: "名称",
          prop: "setmealname",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 85,
        },
      ];
    },
    // 循环副套餐表格配置
    tableOptionsFor() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 85,
        },
      ];
    },
  },

  data() {
    let checkGrouptotal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("体检人数不能为0!"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value <= 0) {
            callback(new Error("体检人数不能为0!"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      centerLoading: false,
      selectLoading: false,
      saveradio: "1",
      regid: "", // 编辑查询对象id
      fileList: [], // bodyForm.annex
      mainitem: "", // 登记信息
      companyitems: [], // 公司合集
      receptitems: [], // 接待人合集
      rangeTime: [], // 体检时间
      registername: "", // 登记人
      combosum: "", //套餐总数
      bodyForm: {
        regid: "",
        companycode: "",
        companyname: "",
        startdate: "",
        enddate: "",
        total: 0,
        contacts: "",
        telephone: "",
        registerdate: "",
        faxnumber: "",
        email: "",
        address: "",
        contractno: "",
        contractname: "",
        receptcode: "",
        receptionname: "",
        remark: "",
        fileid: "",
      }, // 主体表单数据
      listLoading: true,
      groupForm: {
        groupid: "",
        regid: "",
        groupname: "",
        priority: 0,
        sex: 0,
        minage: 0,
        maxage: 0,
        marriage: "",
        groupmark: "",
        grouptotal: 0,
        department: "",
        setmealcode: "",
        setmealname: "",
        originalprice: 0,
        discount: 0,
        discountprice: 0,
        settlementtype: 0,
        addsettlementtype: 0,
        adddiscount: 0,
        quota: 0,
        remark: "",
        checktype: "",
        combineitems: [],
      }, // 添加单位分组表单对象
      groupList: [], // 单位分组数据list
      chooseGroup: undefined, // 当前选择分组
      id: 0, //新增数据id
      registerGroup: [],
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ], // 性别选择
      marriagearr: [
        { key: "未知", name: "未知" },
        { key: "未婚", name: "未婚" },
        { key: "已婚", name: "已婚" },
        { key: "离异", name: "离异" },
        { key: "全部", name: "全部" },
      ], // 婚姻状态
      settlementtypearr: [
        { key: 0, name: "单位结算" },
        { key: 1, name: "个人结算" },
      ],
      addsettlementtypearr: [
        { key: 0, name: "单位结算" },
        { key: 1, name: "个人结算" },
        { key: 2, name: "其他" },
      ],
      mainruls: {
        companycode: [
          { required: true, message: "请选择单位", trigger: "blur" },
        ],
        registerdate: [
          { required: true, message: "请填写预约时间", trigger: "blur" },
        ],
        rangeTime: [{ message: "请填写体检时间", trigger: "blur" }],
        contacts: [
          { required: true, message: "请填写单位联系人", trigger: "blur" },
        ],
      },
      groupRules: {
        groupname: [
          { required: true, message: "请填写分组名称", trigger: "blur" },
        ],
        checktype: [
          { required: true, message: "请填写检查类型", trigger: "change" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        grouptotal: [
          { required: true, validator: checkGrouptotal, trigger: "blur" },
        ],
        department: [
          { required: true, message: "请填写所属部门", trigger: "blur" },
        ],
      }, // 添加分组验证规则
      chiladddialogFormVisible: false, // 控制显示单位分组弹框
      showProjectDialog: false, // 控制显示体检项目弹框
      setmealitems: [], // 套餐合计数组
      setmealitems1: [],
      setmealitems2: [],
      setmealitems3: [],
      combineitems: [], // 预约编码合集
      combineone: [], // 预约编码合集套餐渲染数据1
      combinetwo: [], // 预约编码合集套餐渲染数据2
      combinethree: [], // 预约编码合集套餐渲染数据3
      setmealRadio: "", // 套餐单选选择对象
      totalPrice: 0, // 勾选套餐总金额
      multipleSelection: [],
      chooseone: [], // 预约编码合集选中数据1
      choosetwo: [], // 预约编码合集选中数据2
      choosethree: [], // 预约编码合集选中数据3
      listLoading: true, // 控制表格加载效果
      fileUrl: "", //文件预览路径
      fileName: "", //文件预览路径
      saveTemplate: false, // 保存模板
      hospitalnameArr: [], // 体检地点数据
    };
  },

  mounted() {
    if (this.addOrEdit == "edit") {
      this.regid = this.editObj.regid;
      this.handleEditCompanyDetail();
    }
    //   页面加载获取单位预约 新增/详情数据
    this.handleGetCompanyDetail();
    this.handleGetRegisterGroup();
    this.handleGetCenterDic();
  },

  methods: {
    handleRemoteMethod(val) {
      console.log(val);
      this.selectLoading = true;
      setTimeout(() => {
        this.selectLoading = false;
        company_archives
          .getList({
            page: 1,
            limit: 100000,
            key: val,
          })
          .then((res) => {
            console.log(res);
            this.companyitems = res.data.map((k) => {
              return {
                ...k,
                code: k.companycode,
                name: k.companyname,
              };
            });
          });
      }, 200);
    },
    handleSelecetCenterDic(val) {
      console.log(val);
      this.centerLoading = true;
      setTimeout(() => {
        this.centerLoading = false;
        getCenterDic({
          page: 1,
          limit: 1000,
          key: val,
          tableName: "Dic_Medical_center",
        }).then((res) => {
          this.hospitalnameArr = res.data;
          console.log(res);
        });
      }, 200);
    },

    // 体检地点列表
    handleGetCenterDic() {
      let data = {
        page: 1,
        limit: 1000,
        key: "",
        tableName: "Dic_Medical_center",
      };
      getCenterDic(data).then((res) => {
        console.log(res, "Dic_Medical_center");
        this.hospitalnameArr = res.data;
      });
    },
    handleSelectChange() {
      this.$forceUpdate();
    },
    // 上传触发回调
    handleOnPpload(params, index, key) {
      const fileSuffix = params.name.substring(
        params.name.lastIndexOf(".") + 1
      );
      const whiteList = ["pdf", "doc", "docx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传图片只能是 .docx,.doc,.pdf 格式!");
        return false;
      }
      let data = new FormData();
      data.append("files", params.raw);
      //   return;
      setFilesUpload(data).then((res) => {
        this.$message.success("合同附件上传成功!");
        this.bodyForm.fileid = res.result[0].id;
        this.fileUrl = res.result[0].fileUrl;
        this.fileName = res.result[0].fileName;
      });
    },
    // 获取单位预约 详情数据回调
    handleEditCompanyDetail() {
      getCompanyDetail({ regid: this.regid }).then((res) => {
        let data = res.result;
        this.bodyForm = data.mainitem;
        let select = data.mainitem.companyitems.filter((k) => k.selected)[0];
        let recept = data.mainitem.receptitems.filter((k) => k.selected)[0];
        recept
          ? (this.bodyForm.receptcode = recept.code)
          : (this.bodyForm.receptcode = ""),
          (this.bodyForm.companycode = select.code);
        this.bodyForm.companyname = select.name;
        this.rangeTime = [data.mainitem.startdate, data.mainitem.enddate];
        this.groupList = data.groupitems;
        this.chooseGroup = this.groupList[0];
        this.bodyForm.fileid && this.handleGetFiles();
      });
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.bodyForm.fileid }).then((res) => {
        this.fileUrl = res.result.fileUrl;
        this.fileName = res.result.fileName;
      });
    },
    //   获取单位预约 新增/详情数据回调
    handleGetCompanyDetail() {
      getCompanyDetail().then((res) => {
        this.companyitems = res.result.mainitem.companyitems;
        this.receptitems = res.result.mainitem.receptitems;
        this.registername = res.result.mainitem.registername;
      });
    },
    // 单位预约检查类型回调
    handleGetRegisterGroup() {
      getRegisterGroup({ cc: "CheckType" }).then((res) => {
        let select = res.result.findIndex((k) => k.selected);
        select > -1
          ? (this.groupForm.checktype = res.result[select].code)
          : (this.groupForm.checktype = ""),
          (this.registerGroup = res.result);
      });
    },
    // 点击提交保存当前页面回调
    handleSubmitDialog() {
      // 分组不能为空
      if (this.groupList.length == 0) {
        this.$message.error("请先添加分组");
        return false;
      }
      // 处理开始结束时间和公司名称
      if (this.bodyForm.companycode) {
        this.bodyForm.companyname = this.companyitems.filter((k) => {
          return k.code == this.bodyForm.companycode;
        })[0].name;
      }
      if (this.rangeTime) {
        this.bodyForm.startdate = this.rangeTime[0];
        this.bodyForm.enddate = this.rangeTime[1];
      }
      if (this.bodyForm.receptcode) {
        this.bodyForm.receptionname = this.receptitems.filter(
          (k) => k.code == this.bodyForm.receptcode
        )[0].name;
      }
      // console.log(this.bodyForm);
      // console.log(this.groupList, "this.groupList");
      let flag = false;
      this.groupList.forEach((k) => {
        if (k.combineitems.length == 0) {
          flag = true;
        }
      });
      if (flag) {
        this.$message.warning("分组项目不允许为空!");
        return false;
      }
      if (this.addOrEdit == "edit") {
        setGroupUpdate({
          mainitem: this.bodyForm,
          groupitems: this.groupList,
        }).then((res) => {
          this.$message.success("更新成功!");
          this.$emit("submit", false);
        });
      } else {
        getCompanyAdd({
          mainitem: this.bodyForm,
          groupitems: this.groupList,
        }).then((res) => {
          this.$message.success("保存成功!");
          this.$emit("submit", false);
        });
      }
    },
    // 点击关闭当前页面回调
    handleCloseDialog() {
      this.$emit("close", false);
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems(data) {
      this.chooseGroup.combineitems = data;
      this.chooseGroup.originalprice = 0;
      data.forEach((k) => {
        this.chooseGroup.originalprice += k.price;
      });
      this.showProjectDialog = false; // 打开弹框
    },
    // 点击关闭套餐项目弹框按钮回调
    handleCloseMedicalItems() {
      this.setmealRadio = "";
      this.totalPrice = 0;
      //   this.combineone = [];
      //   this.combinetwo = [];
      //   this.combinethree = [];
      this.showProjectDialog = false; // 打开弹框
    },
    // 复选框回调one
    handleSelectionChangeOne(val) {
      this.chooseone = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调Two
    handleSelectionChangeTwo(val) {
      this.choosetwo = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调Three
    handleSelectionChangeThree(val) {
      this.choosethree = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调
    handleSelectionChange(val) {
      this.totalPrice = 0;
      val.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.multipleSelection = val;
      console.log(this.multipleSelection);
    },
    // 点击体检项目-添加项目回调
    handleAddProject() {
      if (!this.chooseGroup) {
        this.$message.error("请先勾选至少一个分组!");
        return false;
      }
      this.showProjectDialog = true; // 打开弹框
    },
    // 点击选择当前选中分组
    handleChooseGroup(item) {
      this.chooseGroup = item;
      // this.chooseGroup = Object.assign({}, item);
      console.log(this.chooseGroup);
    },
    // 点击添加分组回调
    handleAddUnitGroup() {
      this.handleGetRegisterGroup();
      this.chiladddialogFormVisible = true;
    },
    handleOpenChiladd() {
      this.$nextTick(() => {
        this.$refs.groupname.focus();
      });
    },
    // 点击编辑分组回调
    handleEditUnitGroup() {
      if (this.chooseGroup) {
        this.chiladddialogFormVisible = true;
        let editIndex = this.groupList.findIndex(
          (item) => this.chooseGroup.groupname == item.groupname
        );
        this.groupForm = Object.assign({}, this.groupList[editIndex]);
      } else {
        this.$message.error("请先选中所需编辑数据!");
      }
    },
    // 点击删除分组回调
    handleDelUnitGroup() {
      if (this.chooseGroup) {
        let delIndex = this.groupList.findIndex(
          (item) => this.chooseGroup.groupname == item.groupname
        );
        this.groupList.splice(delIndex, 1);
        this.chooseGroup = undefined;
        this.$message.success("删除成功!");
      } else {
        this.$message.error("请先选中所需删除数据!");
      }
    },
    // 添加分组弹框关闭回调
    handleChilclose() {
      //   清空校验规则
      this.$refs.groupdataForm.clearValidate();
      this.handleResetGroupForm();
      this.chiladddialogFormVisible = false;
    },
    // 点击新增分组提交回调 groupdataForm
    handleSubmitAddGroup() {
      if (this.addOrEdit == "edit") {
        this.$refs.groupdataForm.validate((valid) => {
          if (valid) {
            // return;
            // 已经有数据了
            if (this.groupForm.groupid) {
              let tempArr = JSON.parse(JSON.stringify(this.groupList));
              let index = tempArr.findIndex((k) => {
                return this.chooseGroup.groupname == k.groupname;
              });
              index > -1 && tempArr.splice(index, 1);
              let totalP = 0;
              tempArr.forEach((k) => {
                totalP += k.grouptotal;
              });
              if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                this.$message.warning("分组人数超过单位总体检人数!");
                return false;
              }
              let findArr = tempArr.map((k) => {
                return k.groupname;
              });
              if (findArr.includes(this.groupForm.groupname)) {
                this.$message.warning("分组名称不能重复!");
                return false;
              }
              // 编辑
              let editIndex = this.groupList.findIndex(
                (item) => this.groupForm.groupid == item.groupid
              );
              this.groupList.splice(editIndex, 1, this.groupForm);
            } else {
              let totalP = 0;
              this.groupList.forEach((k) => {
                totalP += k.grouptotal;
              });
              if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                this.$message.warning("分组人数超过单位总体检人数!");
                return false;
              }
              let flag = this.groupList.findIndex((k) => {
                return this.groupForm.groupname == k.groupname;
              });
              if (flag > -1) {
                this.$message.warning("分组名称不能重复!");
                return false;
              }
              // 新增
              // this.groupList.push({
              //   ...this.groupForm,
              //   groupid: this.groupList[this.groupList.length - 1].groupid + 1,
              // });
              this.groupList.push(this.groupForm);
            }
            this.handleResetGroupForm();
            this.chiladddialogFormVisible = false;
          } else {
            return false;
          }
        });
      } else {
        this.$refs.groupdataForm.validate((valid) => {
          if (valid) {
            if (this.groupList.length == 0) {
              let totalP = 0;
              this.groupList.forEach((k) => {
                totalP += k.grouptotal;
              });
              if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                this.$message.warning("分组人数超过单位总体检人数!");
                return false;
              }
              // 第一次添加数据
              this.groupList.push({ ...this.groupForm, id: this.id + 1 });
            } else {
              // 已经有数据了
              if (this.groupForm.id) {
                let tempArr = JSON.parse(JSON.stringify(this.groupList));
                let index = tempArr.findIndex((k) => {
                  return this.chooseGroup.groupname == k.groupname;
                });
                index > -1 && tempArr.splice(index, 1);
                let totalP = 0;
                tempArr.forEach((k) => {
                  totalP += k.grouptotal;
                });
                if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                  this.$message.warning("分组人数超过单位总体检人数!");
                  return false;
                }
                let findArr = tempArr.map((k) => {
                  return k.groupname;
                });
                if (findArr.includes(this.groupForm.groupname)) {
                  this.$message.warning("分组名称不能重复!");
                  return false;
                }
                // 编辑
                let editIndex = this.groupList.findIndex(
                  (item) => this.groupForm.id == item.id
                );
                this.groupList.splice(editIndex, 1, this.groupForm);
              } else {
                let totalP = 0;
                this.groupList.forEach((k) => {
                  totalP += k.grouptotal;
                });
                if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                  this.$message.warning("分组人数超过单位总体检人数!");
                  return false;
                }
                let flag = this.groupList.findIndex((k) => {
                  return this.groupForm.groupname == k.groupname;
                });
                if (flag > -1) {
                  this.$message.warning("分组名称不能重复!");
                  return false;
                }
                // 新增
                this.groupList.push({
                  ...this.groupForm,
                  id: this.groupList[this.groupList.length - 1].id + 1,
                });
              }
            }
            this.handleResetGroupForm();
            this.chiladddialogFormVisible = false;
          } else {
            return false;
          }
        });
      }
      // this.handleResetGroupForm();
    },
    // 重置添加分组绑定数据
    handleResetGroupForm() {
      this.groupForm = {
        groupid: "",
        regid: "",
        groupname: "",
        priority: 0,
        sex: 0,
        minage: 0,
        maxage: 0,
        marriage: "",
        groupmark: "",
        grouptotal: 0,
        department: "",
        setmealcode: "",
        setmealname: "",
        originalprice: 0,
        discount: 0,
        quota: 0,
        discountprice: 0,
        settlementtype: 0,
        addsettlementtype: 0,
        adddiscount: 0,
        remark: "",
        checktype: "",
        combineitems: [],
      };
      this.chooseGroup = undefined;
    },
    // 单选
    handleChecked(rows) {
      console.log(rows);
    },
    // 多选
    handleSelected(rows) {
      console.log(rows);
    },
  },

  watch: {
    "groupForm.discount": {
      handler() {
        this.groupForm.discountprice =
          +this.groupForm.originalprice * (+this.groupForm.discount / 100);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/AddOrEdit.scss";
</style>
