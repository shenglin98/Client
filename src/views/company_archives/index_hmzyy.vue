<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-input
          @keyup.enter.native="handleFilter"
          size="mini"
          style="width: 200px"
          class="filter-item"
          :placeholder="'名称'"
          v-model="listQuery.key"
        >
        </el-input>
        <el-button
          class="filter-item"
          size="mini"
          v-waves
          icon="el-icon-search"
          @click="handleFilter"
          >搜索</el-button
        >
        <permission-btn
          moduleName="company_archives"
          size="mini"
          v-on:btn-event="onBtnClicked"
        ></permission-btn>
      </div>
    </sticky>
    <div class="app-container">
      <div class="bg-white" style="height: calc(100vh - 147px)">
        <el-table
          ref="mainTable"
          :key="tableKey"
          height="calc(100vh - 147px)"
          :data="list"
          v-loading="listLoading"
          stripe
          fit
          :row-style="{ height: '32px' }"
          :cell-style="{ padding: '0px' }"
          :header-cell-style="{
            background: '#b6cfee',
            fontWeight: 600,
            color: '#18253a',
            height: '40px',
          }"
          highlight-current-row
          style="width: 100%"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            align="left"
            prop="companycode"
            width="85px"
            label="单位编码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="companyname"
            width="230px"
            label="单位名称"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="link-type" @click="handleUpdate(scope.row)">{{
                scope.row.companyname
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="left"
            prop="companyhname"
            width="230px"
            label="上级单位"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="shortname"
            width="150px"
            label="单位简称"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="typename"
            width="150px"
            label="单位类型"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="contacts"
            label="联系人"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="telephone"
            label="联系电话"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="faxnumber"
            label="传真号码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="email"
            label="邮箱"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="address"
            label="地址"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="postalcode"
            label="邮编"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="remark"
            label="备注"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="pycode"
            label="拼音码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="wbcode"
            label="五笔码"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="seqno"
            label="排序"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="left"
            prop="healthcard"
            label="门诊卡号"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
        <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" /> -->
      </div>
      <!-- 编辑弹框 -->
      <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        class="dialog-mini dialog-margin"
        width="1000px"
        title="编辑"
        :visible.sync="dialogFormVisible"
        @close="close"
      >
        <el-card class="box-card">
          <el-tag effect="dark"> 基本信息 </el-tag>
          <el-form
            :rules="rules"
            ref="upddataForm"
            :model="temp"
            label-position="right"
            label-width="130px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位编码'" prop="id">
                  <el-input
                    v-model="temp.companycode"
                    :disabled="true"
                    placeholder="系统自动生成"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位名称'" prop="companyname">
                  <el-input v-model="temp.companyname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'上级单位'" prop="companyhcode">
                  <!-- <el-select v-model="temp.companyhcode" filterable clearable>
                    <el-option v-for="(item, index) in companyitems" :key="index" :value="item.code" :label="item.name"></el-option>
                  </el-select> -->
                  <el-select
                    v-model="temp.companyhcode"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="handleRemoteMethod"
                    :loading="selectLoading"
                    @clear="handleRemoteMethod"
                  >
                    <el-option
                      v-for="item in companyitems"
                      :key="item.code"
                      :label="`${item.code}　${item.name}`"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位简称'" prop="shortname">
                  <el-input v-model="temp.shortname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位类型'">
                  <el-select v-model="temp.typecode" clearable>
                    <el-option
                      v-for="(item, index) in typeitems"
                      :key="index"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'联系人'" prop="contacts">
                  <el-input v-model="temp.contacts"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'联系电话'" prop="telephone">
                  <el-input v-model="temp.telephone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'传真号码'" prop="faxnumber">
                  <el-input v-model="temp.faxnumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'邮箱'" prop="email">
                  <el-input v-model="temp.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'地址'" prop="address">
                  <el-input v-model="temp.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'邮编'" prop="postalcode">
                  <el-input v-model="temp.postalcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'注册名称'" prop="registername">
                  <el-input v-model="temp.registername"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'税号'" prop="taxnumber">
                  <el-input v-model="temp.taxnumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'法人代表'" prop="legalperson">
                  <el-input v-model="temp.legalperson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'企业电话'" prop="companytel">
                  <el-input v-model="temp.companytel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'开户银行'" prop="openingbank">
                  <el-select v-model="temp.openingbank" clearable>
                    <el-option
                      v-for="(item, index) in bankitems"
                      :key="index"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'银行账号'" prop="bankaccount">
                  <el-input v-model="temp.bankaccount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'备注'" prop="remark">
                  <el-input v-model="temp.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'排序'" prop="seqno">
                  <el-input v-model="temp.seqno"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'门诊卡号'">
                  <el-input v-model="temp.healthcard" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'预约码'">
                  <el-input v-model="temp.bookingcode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 表单对象 -->
          <el-tag effect="dark" v-if="previewModelBase"> 其他信息 </el-tag>
          <CreatedForm
            :insite="true"
            :value="formcontroldata"
            :isArchives="isArchives"
            v-if="previewModelBase"
            :data="contentData"
            ref="contentDataObj"
          />
        </el-card>
        <br />
        <!-- <template v-if="formid != ''">
          <el-tag effect="dark"> 开票信息 </el-tag>
          <el-card class="box-card">
            <ShowFormBase
              ref="updateForm"
              :data="updateFormData"
            ></ShowFormBase>
          </el-card>
        </template> -->

        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button
            size="mini"
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="createData"
            >确认</el-button
          >
          <el-button size="mini" v-else type="primary" @click="updateData"
            >确认</el-button
          >
        </div>
      </el-dialog>
      <!-- 新增弹框 -->
      <el-dialog
        v-el-drag-dialog
        :close-on-click-modal="false"
        class="dialog-mini"
        width="1000px"
        title="添加"
        :visible.sync="adddialogFormVisible"
        @close="addclose"
      >
        <el-card class="box-card">
          <el-tag effect="dark"> 基本信息 </el-tag>
          <el-form
            :rules="rules"
            ref="dataForm"
            :model="addtemp"
            label-position="right"
            label-width="130px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位编码'" prop="id">
                  <el-input
                    v-model="addtemp.companycode"
                    :disabled="true"
                    placeholder="系统自动生成"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位名称'" prop="companyname">
                  <el-input v-model="addtemp.companyname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'上级单位'" prop="companyhcode">
                  <!-- <el-select v-model="addtemp.companyhcode" clearable>
                    <el-option v-for="(item, index) in companyitems" :key="index" :value="item.code" :label="item.name"></el-option>
                  </el-select> -->
                  <el-select
                    v-model="addtemp.companyhcode"
                    clearable
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="handleRemoteMethod"
                    :loading="selectLoading"
                    @clear="handleRemoteMethod"
                  >
                    <el-option
                      v-for="item in companyitems"
                      :key="item.code"
                      :label="`${item.code}　${item.name}`"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位简称'" prop="shortname">
                  <el-input v-model="addtemp.shortname"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'单位类型'">
                  <el-select v-model="addtemp.typecode" clearable>
                    <el-option
                      v-for="(item, index) in typeitems"
                      :key="index"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'联系人'" prop="contacts">
                  <el-input v-model="addtemp.contacts"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'联系电话'" prop="telephone">
                  <el-input v-model="addtemp.telephone"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'传真号码'" prop="faxnumber">
                  <el-input v-model="addtemp.faxnumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'邮箱'" prop="email">
                  <el-input v-model="addtemp.email"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'地址'" prop="address">
                  <el-input v-model="addtemp.address"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'邮编'" prop="postalcode">
                  <el-input v-model="addtemp.postalcode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'注册名称'" prop="registername">
                  <el-input v-model="addtemp.registername"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'税号'" prop="taxnumber">
                  <el-input v-model="addtemp.taxnumber"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'法人代表'" prop="legalperson">
                  <el-input v-model="addtemp.legalperson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'企业电话'" prop="companytel">
                  <el-input v-model="addtemp.companytel"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'开户银行'" prop="openingbank">
                  <el-select v-model="addtemp.openingbank" clearable>
                    <el-option
                      v-for="(item, index) in bankitems"
                      :key="index"
                      :value="item.code"
                      :label="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'银行账号'" prop="bankaccount">
                  <el-input v-model="addtemp.bankaccount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'备注'" prop="remark">
                  <el-input v-model="addtemp.remark"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="mini" :label="'排序'" prop="seqno">
                  <el-input v-model="addtemp.seqno"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'门诊卡号'">
                  <el-input v-model="temp.healthcard" disabled></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="mini" :label="'预约码'">
                  <el-input v-model="addtemp.bookingcode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- 表单对象 -->
          <el-tag effect="dark" v-if="previewModelBase"> 其他信息 </el-tag>
          <CreatedForm
            :insite="true"
            :isArchives="isArchives"
            v-if="previewModelBase"
            :data="contentData"
            ref="contentDataObj"
          />
        </el-card>
        <br />
        <!-- <template v-if="formid != ''">
          <el-tag effect="dark"> 开票信息 </el-tag>
          <el-card v-if="formid != ''" class="box-card">
            <ShowFormBase
              ref="generateForm"
              :data="createdFormData"
            ></ShowFormBase>
          </el-card>
        </template> -->
        <div slot="footer">
          <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
          <el-button
            size="mini"
            v-if="dialogStatus == 'create'"
            type="primary"
            @click="createData"
            >确认</el-button
          >
          <el-button size="mini" v-else type="primary" @click="updateData"
            >确认</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as Export from "@/api/export";
import * as company_archives from "@/api/company_archives";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/companydelRows.js";
import ShowFormBase from "@/components/Formcreated/components/ShowFormBase";
import CreatedForm from "@/components/Formcreated/components/CreatedForm";
import ModelBase from "@/components/Formcreated/components/ModelBase";
import { mapGetters } from "vuex";

export default {
  name: "company_archives",
  components: {
    Sticky,
    permissionBtn,
    Pagination,
    ShowFormBase,
    CreatedForm,
    ModelBase,
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      selectLoading: false, //加载特效
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: [],
      total: 0,
      listLoading: true,
      jsonTemplate: "",
      previewVisible: false,
      createdFormData: {},
      updateFormData: {},
      listQuery: {
        // 查询条件
        page: 1,
        limit: 100000,
        key: "",
      },
      formDataSelect: null,
      temp: {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        telephone: "",
        faxnumber: "",
        email: "",
        address: "",
        postalcode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        openingbank: "",
        bankaccount: "",
        remark: "",
        seqno: 0,
        bookingcode: "",
      },
      addtemp: {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        telephone: "",
        faxnumber: "",
        email: "",
        address: "",
        postalcode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        openingbank: "",
        bankaccount: "",
        remark: "",
        seqno: 0,
        bookingcode: "",
      },
      companyitems: undefined, // 上级单位集
      typeitems: undefined, // 单位类型集
      bankitems: undefined, // 开户行集
      formid: "",
      tempdata: [],
      templist: [],
      updatelist: [],
      dialogFormVisible: false,
      adddialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        telephone: [
          {
            required: true,
            message: "联系电话不能为空",
            trigger: "blur",
          },
        ],
        address: [
          {
            required: true,
            message: "地址不能为空",
            trigger: "blur",
          },
        ],
        companyname: [
          {
            required: true,
            message: "单位名称不能为空",
            trigger: "blur",
          },
        ],
        typecode: [
          {
            required: true,
            message: "单位类型不能为空",
            trigger: "blur",
          },
        ],
        seqno: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
        companyhcode: [
          {
            required: true,
            message: "上级单位不能为空",
            trigger: "change",
          },
        ],
      },
      ceshi: [
        {
          id: "",
          key: "",
        },
      ],
      jobCallList: [],
      downloadLoading: false,
      previewModelBase: false,
      formitem: {}, // 自定义表单对象
      contentData: {}, // 自定义表单对象
      isArchives: true, // 单位建档
      formcontroldata: {}, // 单位建档
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter((k) => k.path === this.$route.path)[0];
      if (view) {
        // 设置删除vuex中tabs值
        if (view.path.split("/")[1]) {
          this.$store.commit("handlerSetTabRemove", view.path.split("/")[1]);
        }
        this.$store.dispatch("delVisitedViews", view).then((views) => {
          const latestView = views.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        });
      }
    },
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
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      console.log("触发了吗");
      console.log(val);
      this.multipleSelection = val;
    },
    // 列表下载
    downloadExcel() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请选择需要导出的信息!");
        return false;
      }
      this.$confirm("确定下载列表文件?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.excelData = this.multipleSelection;
          this.export2Excel();
        })
        .catch(() => {});
    },
    // 数据写入excel
    export2Excel() {
      var that = this;
      require.ensure([], () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [
          "单位编码",
          "单位名称",
          "上级单位",
          "单位简称",
          "单位类型",
          "联系人",
          "联系电话",
          "传真号码",
          "邮箱",
          "地址",
          "邮编",
          "备注",
          "拼音码",
          "五笔码",
          "排序",
          "门诊卡号",
        ]; // 导出的表头名信息
        const filterVal = [
          "companycode",
          "companyname",
          "companyhname",
          "shortname",
          "typename",
          "contacts",
          "telephone",
          "faxnumber",
          "address",
          "postalcode",
          "remark",
          "pycode",
          "wbcode",
          "seqno",
          "healthcard",
        ]; // 导出的表头字段名，需要导出表格字段名
        const list = this.excelData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "导出数据"); // 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        case "btnRefresh":
          this.getList();
          break;
        case "btnDerive":
          this.downloadExcel();
          // var data = {
          //   apicontrol: "CompanyArchives",
          //   apimethod: "CompanyArchivesLoad",
          // };
          // Export.fileExport(data).then((response) => {
          //   console.log(response);
          //   window.open(response.result);
          // });
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      company_archives.getList(this.listQuery).then((response) => {
        this.list = response.data;
        this.total = response.count;
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page = val.page;
      this.listQuery.limit = val.limit;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        telephone: "",
        faxnumber: "",
        email: "",
        address: "",
        postalcode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        openingbank: "",
        bankaccount: "",
        remark: "",
        seqno: 0,
        bookingcode: "",
      };
    },
    addresetTemp() {
      this.addtemp = {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        Telephone: "",
        Faxnumber: "",
        email: "",
        address: "",
        postalCode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        OpeningBank: "",
        bankaccount: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Company_archives",
        jsondata: "",
        formid: "",
      };
    },
    // 获取详情下拉框数据
    handleGetDetailList(code) {
      company_archives.getDetailList({ code }).then((res) => {
        let {
          companyitems,
          typeitems,
          bankitems,
          formitem,
          formid,
          formcontroldata,
          bookingcode,
        } = res.result;
        this.companyitems = companyitems;
        this.typeitems = typeitems;
        this.bankitems = bankitems;
        this.formitem = formitem;
        this.formid = formid;
        this.temp = {
          ...this.temp,
          bookingcode,
        };
        console.log(res.result, "result");
        formitem && (this.contentData = JSON.parse(formitem.contentData));
        if (formcontroldata) {
          this.formcontroldata = JSON.parse(formcontroldata);
        } else {
          this.formcontroldata = {};
        }
        this.contentData && (this.previewModelBase = true);
      });
    },
    handleCreate() {
      // 弹出添加框

      this.previewVisible = true;
      this.dialogStatus = "create";
      this.adddialogFormVisible = true;
      this.handleGetDetailList();
      // this.createdFormData = JSON.parse(this.list.form.contentData);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.addtemp.formid = this.formid;
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.formid != "" && this.formid != undefined && this.formid != null) {
            // this.$refs.generateForm
            //   .getData()
            //   .then((data) => {
            //     this.addtemp.jsondata = JSON.stringify(data, null, "\t");
            //   })
            //   .catch(() => {
            //     this.$refs.formPreview.end();
            //   });
          }
          this.$refs.contentDataObj
            .getData()
            .then((data) => {
              this.addtemp.formid = this.formid;
              this.addtemp.formcontroldata = JSON.stringify(data, null, "\t");
            })
            .catch(() => {
              this.$refs.formPreview.end();
            });
          company_archives.addCompany(this.addtemp).then(() => {
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
            this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
            });
            this.addresetTemp();
            console.log(111);
            this.getList();
            this.adddialogFormVisible = false;
          });
        }
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.temp = JSON.parse(JSON.stringify(row));
      console.log(this.temp);
      this.handleGetDetailList(row.companycode);
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["upddataForm"].clearValidate();
      });
    },
    updateData() {
      //更新提交
      this.$refs["upddataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          if (this.formid != "" && this.formid != undefined && this.formid != null) {
            // this.$refs.updateForm
            //   .getData()
            //   .then((data) => {
            //     tempData.jsondata = JSON.stringify(data);
            //   })
            //   .catch(() => {
            //     this.$refs.formPreview.end();
            //   });
          }
          this.$refs.contentDataObj
            .getData()
            .then((data) => {
              this.temp.formid = this.formid;
              this.temp.formcontroldata = JSON.stringify(data, null, "\t");
            })
            .catch(() => {
              this.$refs.formPreview.end();
            });
          company_archives.addCompany(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
            this.$nextTick(() => {
              this.$refs["upddataForm"].clearValidate();
            });
            this.getList();
          });
        }
      });
    },
    close() {
      this.resetTemp();
    },
    addclose() {
      this.addresetTemp();
    },
    handleDelete(rows) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log("删除");
          let data = rows.map((item) => {
            return item.companycode;
          });
          company_archives.del(data).then(() => {
            this.getList();
            this.$notify({
              title: "成功",
              message: "删除成功",
              type: "success",
            });
          });
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style lang="scss">
.dialog-mini .el-select {
  width: 100%;
}
.dialog-margin {
  .el-form {
    .el-form-item {
      margin-bottom: 9px !important;
    }
  }
}
</style>
