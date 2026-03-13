<template>
  <div class="add_quotation">
    <div class="header">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="报价单名称">
          <el-input v-model="quotationName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="quotationRemark" size="small"></el-input>
        </el-form-item>
      </el-form>
      <div class="header_employ">
        <!-- <div class="copy_box">
                    <span @click="copyquotation">复制报价单</span>
                    <span @click="copyunit">复制单位体检</span>
                </div> -->
        <el-button type="primary" size="small" @click="handleSavePage"
          >保存</el-button
        >
      </div>
    </div>
    <div class="contact_box">
      <div class="contact">
        <div class="contact_header">
          <div class="contact_header_title">报价分组</div>
          <div class="add_contact" @click="handleAddGroup">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <el-table
          :data="customer_Sales_Quote_Group"
          style="width: 100%"
          max-height="610"
          @row-click="handleCheckGroup"
        >
          <el-table-column prop="index" label="序" width="30">
          </el-table-column>
          <el-table-column prop="groupname" label="分组名称" width="180">
          </el-table-column>
          <el-table-column prop="remark" label="说明" width="180">
          </el-table-column>
          <el-table-column
            prop="totaldiscount"
            label="优惠价（元）"
            width="180"
          >
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleGroupDelete(scope.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="contact">
        <div class="contact_header">
          <div class="contact_header_title">分组明细</div>
          <div class="add_contact" @click="handleAddQuoteDetails">
            <i class="el-icon-plus"></i>
          </div>
        </div>
        <el-table
          :data="checkGroup.customer_Sales_Quote_Details"
          style="width: 100%"
          max-height="480"
        >
          <el-table-column prop="index" label="序" width="30">
          </el-table-column>
          <el-table-column prop="combinename" label="体检组合">
          </el-table-column>
          <el-table-column prop="price" label="价格" width="100">
          </el-table-column>
          <el-table-column prop="num" label="数量" width="100">
          </el-table-column>
          <el-table-column prop="price" label="金额（元）" width="100">
          </el-table-column>
          <el-table-column prop="address" label="操作">
            <template slot-scope="scope">
              <el-link type="primary" @click="handleGroupDelete(scope.row)"
                >删除</el-link
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="price_box">
      <div>原价格合计：{{ checkGroup.total || 0 }}</div>
      <div>优惠价：{{ checkGroup.totaldiscount || 0 }}</div>
    </div>
    <el-dialog
      title="复制报价单"
      :visible.sync="dialogVisibleOne"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="60px"
        :model="formLabelAlign"
      >
        <div class="flex">
          <el-form-item label="搜索">
            <el-input v-model="formLabelAlign.name" size="mini"></el-input>
          </el-form-item>
          <el-button
            type="primary"
            @click="dialogVisibleOne = false"
            class="btn"
            size="mini"
            >关 闭</el-button
          >
        </div>
      </el-form>
      <div class="order_list">订单列表</div>
      <el-table
        :data="tableDataTwo"
        style="width: 100%"
        max-height="610"
        :header-cell-style="{ background: '#CFDEEB' }"
      >
        <el-table-column prop="username" label="客户名称" width="180">
        </el-table-column>
        <el-table-column prop="ordername" label="报价单名称" width="180">
        </el-table-column>
        <el-table-column prop="data" label="报价日期" width="180">
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.delflag == 0">正常</span> -->
            <span class="size" @click="choose()">选择</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span slot="footer" class="dialog-footer center">
                <el-button @click="dialogVisibleOne = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleOne = false">确 定</el-button>
            </span> -->
    </el-dialog>
    <el-dialog
      title="复制单位项目"
      :visible.sync="dialogVisibleTwo"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        :label-position="labelPosition"
        label-width="60px"
        :model="formLabelAlign"
      >
        <div class="flex">
          <el-form-item label="搜索">
            <el-input v-model="formLabelAlign.name" size="mini"></el-input>
          </el-form-item>
          <el-button
            type="primary"
            @click="dialogVisibleTwo = false"
            class="btn"
            size="mini"
            >关 闭</el-button
          >
        </div>
      </el-form>
      <div class="order_list">订单列表</div>
      <el-table
        :data="tableDataThree"
        style="width: 100%"
        max-height="610"
        :header-cell-style="{ background: '#CFDEEB' }"
      >
        <el-table-column prop="username" label="团体名称" width="260">
        </el-table-column>
        <el-table-column prop="ordername" label="批次" width="80">
        </el-table-column>
        <el-table-column prop="data" label="体检日期" width="240">
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <!-- <span v-if="scope.row.delflag == 0">正常</span> -->
            <span class="size" @click="choose()">选择</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- <span slot="footer" class="dialog-footer center">
                <el-button @click="dialogVisibleOne = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisibleOne = false">确 定</el-button>
            </span> -->
    </el-dialog>
    <!-- 添加报价分组 -->
    <el-dialog
      title="报价分组"
      :visible.sync="showAddGroup"
      width="25%"
      :before-close="handleClose"
      :show-close="false"
      :close-on-click-modal="false"
      class="addgroupdia"
    >
      <el-form label-width="80px" :model="groupForm">
        <el-form-item label="分组名称">
          <el-input v-model="groupForm.groupname" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="groupForm.remark" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="合计">
          <el-input v-model="groupForm.total" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="优惠合计">
          <el-input v-model="groupForm.totaldiscount" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer center">
        <el-button @click="(showAddGroup = false), handleResetGroupForm()"
          >取 消</el-button
        >
        <el-button type="primary" @click="handleAddGroupConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <SetMealDialog
      v-if="showProjectDialog"
      :sex="0"
      :groupTableData="checkGroup.customer_Sales_Quote_Details"
      @submit="handleSubmitMedicalItems"
      @close="showProjectDialog = false"
    />
  </div>
</template>
<script>
import { addQuote } from "@/api/customermanage.js";
import SetMealDialog from "@/components/SetMealDialog/index_qyzyy.vue"; // 新项目弹框
export default {
  props: {
    sasid: {
      require: true,
      type: String,
    },
  },
  components: { SetMealDialog },
  data() {
    return {
      quotationName: "",
      quotationRemark: "",
      form: {
        name: "",
      },
      dialogVisibleOne: false,
      dialogVisibleTwo: false,
      showAddGroup: false,
      groupForm: {
        grpid: "",
        sasid: "",
        queid: "",
        groupname: "",
        remark: "",
        total: "",
        totaldiscount: "",
        seqno: 0,
      },
      checkGroup: {},
      labelPosition: "right",
      formLabelAlign: {
        name: "",
        region: "",
        type: "",
      },
      customer_Sales_Quote_Group: [],
      customer_Sales_Quote_Details: [],
      showProjectDialog: false, // 控制显示体检项目弹框
      tableDataTwo: [
        {
          username: "广州市公安局",
          ordername: "2021年秋季体检报价单",
          data: "2021-03-06",
        },
        {
          username: "广州城建投资公司",
          ordername: "2020年体检报价单",
          data: "2021-01-09",
        },
        {
          username: "广发银行",
          ordername: "三八妇女节体检报价单",
          data: "2021-04-06",
        },
        {
          username: "中山大学",
          ordername: "2021年教职工报价单",
          data: "2021-03-10",
        },
      ],
      tableDataThree: [
        {
          username: "广州市公安局",
          ordername: "1",
          data: "2021-03-06",
        },
        {
          username: "广州城建投资公司",
          ordername: "2",
          data: "2021-01-09",
        },
        {
          username: "广发银行",
          ordername: "1",
          data: "2021-04-06",
        },
        {
          username: "中山大学",
          ordername: "1",
          data: "2021-03-10",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    handleSavePage() {
      let customer_Sales_Quote = {
        queid: "",
        sasid: this.sasid,
        quotename: this.quotationName,
        remark: this.quotationRemark,
      };
      let data = {
        customer_Sales_Quote,
        customer_Sales_Quote_Group: this.customer_Sales_Quote_Group,
      };
      addQuote(data).then((res) => {
        this.$message.warning(res.message);
        this.$emit("save");
      });
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems(data) {
      this.checkGroup.customer_Sales_Quote_Details = data.map((k) => {
        return {
          detid: "",
          sasid: this.sasid,
          grpid: "",
          combinecode: k.combinecode,
          combinename: k.combinename,
          deptcode: k.deptcode,
          price: k.price,
          discount: k.discount,
          amount: 0,
        };
      });
      this.showProjectDialog = false; // 打开弹框
    },
    handleAddQuoteDetails() {
      if (this.checkGroup && !this.checkGroup.groupname) {
        this.$message.warning("请先勾选报价分组!");
        return;
      }
      this.showProjectDialog = true;
    },
    handleCheckGroup(row) {
      this.checkGroup = row;
    },
    handleGroupDelete(row) {
      let index = this.customer_Sales_Quote_Group.filter((k) => {
        return k.groupname == row.groupname && k.total == row.total;
      });
      this.customer_Sales_Quote_Group.splice(index, 1);
    },
    handleAddGroupConfirm() {
      this.groupForm.sasid = this.sasid;
      this.groupForm.customer_Sales_Quote_Details = [];
      this.customer_Sales_Quote_Group.push(this.groupForm);
      this.handleResetGroupForm();
      this.showAddGroup = false;
    },
    handleAddGroup() {
      this.showAddGroup = true;
    },
    handleResetGroupForm() {
      this.groupForm = {
        grpid: "",
        sasid: "",
        queid: "",
        groupname: "",
        remark: "",
        total: "",
        totaldiscount: "",
        seqno: 0,
      };
    },
    // 弹窗
    handleClose(done) {
      done();
    },
    choose() {
      this.$alert("选择复制内容为【报价单名称】,是否继续", "", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },
    // 复制报价单
    copyquotation() {
      this.dialogVisibleOne = true;
    },
    // 复制报价单
    copyquotation() {
      this.dialogVisibleOne = true;
    },
    copyunit() {
      this.dialogVisibleTwo = true;
    },

    save() {
      this.$emit("save");
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./css/AddQuotation.scss";
</style>