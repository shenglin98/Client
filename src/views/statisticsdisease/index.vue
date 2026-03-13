<template>
  <div class="statisticsdisease">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
      </div>
      <div class="mainbody">
        <el-row>
          <el-col :span="7" class="main_l">
            <div class="top_form">
              <el-form ref="form" :model="topForm" label-width="90px">
                <el-form-item class="df" size="mini" label="单位：">
                  <el-select v-model="topForm.companycode" clearable filterable @change.self="handleChangeCompany">
                    <el-option v-for="item in companyitems" :key="item.regid" :label="`${item.companycode}　${item.companyname}　${item.batch}`" :value="item.regid">
                    </el-option>
                  </el-select>
                  <el-button size="mini" plain @click="handleShowMore">更多条件</el-button>
                </el-form-item>
                <!-- <el-form-item size="mini" label="分组：">
                  <el-select
                    v-model="topForm.groupcode"
                    clearable
                    filterable
                    @change="handleChangeGroup"
                  >
                    <el-option
                      v-for="item in groupitems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="mini" label="部门：">
                  <el-select
                    v-model="topForm.department"
                    clearable
                    filterable
                    @change="handleChangeDepart"
                  >
                    <el-option
                      v-for="item in departitems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item> -->
                <!-- <div
                  class="date_box"
                  style="display: flex; margin-bottom: 10px"
                >
                  <el-popover
                    style="margin-right: 8px"
                    ref="popoverRef"
                    placement="bottom-start"
                    trigger="click"
                  >
                    <div class="content">
                      <div
                        class="content_item"
                        v-for="item in checkupDateArr"
                        :key="item.code"
                        @click="handleSelectConditionDate(item)"
                      >
                        {{ item.name }}
                      </div>
                    </div>
                    <el-button
                      type="primary"
                      plain
                      style="width: 80px"
                      size="mini"
                      slot="reference"
                      >{{ dateName }}</el-button
                    >
                  </el-popover>
                  <el-date-picker
                    @change="handleChangeDate"
                    size="mini"
                    v-model="conditionDate"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptions"
                  ></el-date-picker>
                </div> -->
                <el-form-item class="df tjhitem" size="mini" label="统计号：">
                  <div class="tjh_box">
                    <el-input class="tjhb_tjh" size="mini" readonly clearable v-model="topForm.statisticscode" placeholder="请输入内容"></el-input>
                    <!-- <div class="tjhb_tjh">{{ topForm.statisticscode }}</div> -->
                    <i class="el-icon-delete" v-if="topForm.statisticscode" @click="
                        (topForm.statisticscode = ''), (illnessstatic = null)
                      "></i>
                    <el-button size="mini" type="primary" @click="handleShowStatisticscode">...</el-button>
                  </div>
                  <!-- <el-select
                    v-model="topForm.statisticscode"
                    clearable
                    filterable
                  >
                    <el-option
                      v-for="item in statisticscodeItems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select> -->
                  <el-button class="tjbtn" size="mini" plain @click="handleStatistics">统 计</el-button>
                </el-form-item>
                <el-form-item class="df" size="mini" label="统计报表：">
                  <div class="dfb">
                    <el-select size="mini" v-model="topForm.report" clearable filterable placeholder="请选择">
                      <el-option v-for="item in reportItems" :key="item.repname" :label="item.repname" :value="item.repname">
                      </el-option>
                    </el-select>
                    <!-- <el-radio-group v-model="topForm.report">
                      <el-radio label="综合统计"></el-radio>
                      <el-radio label="疾病比例"></el-radio>
                      <el-radio label="人员疾病列表"></el-radio>
                      <el-radio label="疾病分布"></el-radio>
                    </el-radio-group> -->
                    <el-button size="mini" plain @click="handleMaintenance">维护大类</el-button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="btn_group_box">
              <el-button type="primary" plain size="mini" @click="handleSelectAll">全选</el-button>
              <el-button type="primary" plain size="mini" @click="handleReverseSelect">反选</el-button>
            </div>
            <!-- 人员列表 -->
            <div class="people_box">
              <vxe-table class="people_table" ref="peopleTable" height="100%" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="peopleList" :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
                <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
                <vxe-table-column field="regid" title="体检号" min-width="105" sortable></vxe-table-column>
                <vxe-table-column field="name" title="姓名" min-width="80" sortable></vxe-table-column>
                <vxe-table-column field="sex" title="性别" min-width="70" sortable>
                  <template slot-scope="scope">
                    <span>{{
                      scope.row.sex == 0
                        ? "未知"
                        : scope.row.sex == 1
                        ? "男"
                        : "女"
                    }}</span>
                  </template>
                </vxe-table-column>
                <vxe-table-column field="age" title="年龄" min-width="70" sortable></vxe-table-column>
                <vxe-table-column field="department" title="部门" min-width="120" sortable></vxe-table-column>
              </vxe-table>
            </div>
            <div class="total">共计：{{ peopleList.length }}人</div>
          </el-col>
          <el-col :span="17" class="main_r">
            <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" class="pdfbox"></iframe>
          </el-col>
        </el-row>
      </div>
      <!-- 大类弹框 -->
      <el-dialog title="大类维护" class="maintenance_dia" :visible.sync="dialogVisible" width="70%" :show-close="false" :close-on-click-modal="false">
        <div class="maintenance">
          <el-row>
            <el-col :span="12" class="mr">
              <div class="top_btn">
                <el-input placeholder="请输入大类关键字" size="mini" v-model="searchIllKey" clearable>
                </el-input>
                <el-button plain size="mini" @click="handleAddIll">增加大类</el-button>
                <el-button plain size="mini" @click="handleEditIll">修改大类</el-button>
                <el-button plain size="mini" @click="handleDelIll">删除大类</el-button>
                <el-button style="margin-left: 12px" type="primary" plain size="mini" @click="handleCheckAllIll">全选大类</el-button>
              </div>
              <div class="daleiBox">
                <vxe-table class="dalei_table" ref="daleiTable" height="auto" border="inner" :loading="loading" highlight-hover-row highlight-current-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="illDataSS" :checkbox-config="{ reserve: true }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @cell-click="handleChooseIllData">
                  <vxe-table-column field="code" title="大类ID" sortable width="120"></vxe-table-column>
                  <vxe-table-column field="illname" title="大类名称" sortable></vxe-table-column>
                  <vxe-table-column field="inputvalue" title="" width="60">
                    <template slot-scope="scope">
                      <div @click.stop>
                        <vxe-checkbox v-model="scope.row.inputvalue" :checked-value="'1'" :unchecked-value="'0'" size="small"></vxe-checkbox>
                      </div>
                    </template>
                  </vxe-table-column>
                </vxe-table>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="top_btn">
                <div class="select_box">
                  <span>将选中设置为</span>
                  <el-select v-model="selectIll" filterable clearable size="mini">
                    <el-option v-for="(item, index) in illData" :key="index" :label="`${item.code} ${item.illname}`" :value="item.illname">
                    </el-option>
                  </el-select>
                </div>
                <el-button plain size="mini" @click="handleSaveIll">保存</el-button>
                <el-button plain size="mini" @click="handleCloseIllDia">退出</el-button>
                <el-button plain size="mini" @click="handleSetIllData">设置</el-button>
              </div>
              <div class="select_input">
                <el-input placeholder="请输入疾病信息进行查找" size="mini" v-model="searchJibingKey" clearable>
                </el-input>
              </div>
              <div class="jibingBox">
                <vxe-table class="jibing_table" ref="jibingTable" height="auto" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="jibingDataSS" :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: true, gt: 0 }" @checkbox-change="handleSelectJibing" @checkbox-all="handleSelectJibingAll">
                  <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
                  <vxe-table-column field="wordname" title="疾病名称" width="200" sortable>
                    <template #default="{ row }">
                      <div class="wordname-cell" :title="row.wordname">{{ row.wordname }}</div>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column field="illcode" title="所属大类" width="110" sortable></vxe-table-column>
                  <vxe-table-column field="illname" title="大类名称" min-width="110" sortable></vxe-table-column>
                  <vxe-table-column field="regid" title="体检号" width="110" sortable></vxe-table-column>
                  <vxe-table-column field="name" title="姓名" width="110" sortable></vxe-table-column>
                </vxe-table>
              </div>
              <div class="jb_jishu">已选中：{{ selectJiBing.length }}</div>
            </el-col>
          </el-row>
        </div>
      </el-dialog>
      <!-- 填写疾病汇总统计名称 -->
      <el-dialog class="dialog-mini statisillnessname_dialog" width="50%" top="20%" :close-on-click-modal="false" title="" :visible.sync="showUnitDia" @close="handleCloseUnitDia">
        <div class="discount_box">
          <div class="dbox_input">
            <div class="dbi_title">疾病汇总统计名称：</div>
            <el-input style="width: 80%" placeholder="请输入疾病汇总统计名称" size="mini" max="100" min="1" v-model="statisillnessname" clearable>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmUnitname">确 认</el-button>
          <el-button size="mini" @click="handleCloseUnitDia">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 新增大类弹框 -->
      <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="增加大类" :visible.sync="showAddIll" :show-close="false" @close="handleCloseIll">
        <div class="discount_box">
          <div class="dbbx">
            <div class="dbbx_titile">大类ID:</div>
            <el-input size="mini" placeholder="请输入大类ID" v-model="addIllId" clearable>
            </el-input>
          </div>
          <div class="dbbx">
            <div class="dbbx_titile">大类名称</div>
            <el-input size="mini" placeholder="请输入大类名称" max="100" min="1" v-model="addIllname" clearable>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmIll">确 认</el-button>
          <el-button size="mini" @click="handleCloseIll">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 编辑大类弹框 -->
      <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="编辑大类" :visible.sync="showAddIllEdit" :show-close="false" @close="handleCloseIllEdit">
        <div class="discount_box">
          <div class="dbbx">
            <div class="dbbx_titile">大类ID:</div>
            <el-input size="mini" placeholder="请输入大类ID" v-model="addIllIdEdit" clearable>
            </el-input>
          </div>
          <div class="dbbx">
            <div class="dbbx_titile">大类名称:</div>
            <el-input size="mini" placeholder="请输入大类名称" max="100" min="1" v-model="addIllnameEdit" clearable>
            </el-input>
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmIllEdit">确 认</el-button>
          <el-button size="mini" @click="handleCloseIllEdit">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 更多条件 -->
      <el-dialog title="更多条件" class="morefactor_dia" :visible.sync="showMorefactor" :show-close="false" :close-on-click-modal="false" width="30%">
        <div class="morefactor_box">
          <div class="mb_item">
            <div class="mb_item_t">体检号</div>
            <div class="mb_item_c">
              <el-input size="mini" clearable v-model="topForm.regid"></el-input>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">姓名</div>
            <div class="mb_item_c">
              <el-input size="mini" clearable v-model="topForm.name"></el-input>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">身份证</div>
            <div class="mb_item_c">
              <el-input size="mini" clearable v-model="topForm.idcard"></el-input>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">联系电话</div>
            <div class="mb_item_c">
              <el-input size="mini" clearable v-model="topForm.telephone"></el-input>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">年龄段</div>
            <div class="mb_item_c">
              <el-input size="mini" clearable v-model="agestr"></el-input>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">性别</div>
            <div class="mb_item_c">
              <el-select size="mini" clearable v-model="topForm.sex" placeholder="">
                <el-option label="未知" :value="0"></el-option>
                <el-option label="男" :value="1"></el-option>
                <el-option label="女" :value="2"></el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">状态</div>
            <div class="mb_item_c">
              <el-select size="mini" clearable v-model="topForm.status" placeholder="">
                <el-option v-for="item in statusArr" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">体检类型</div>
            <div class="mb_item_c">
              <el-select size="mini" clearable v-model="topForm.checktype" multiple collapse-tags placeholder="">
                <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">分组</div>
            <div class="mb_item_c">
              <el-select v-model="topForm.groupcode" size="mini" clearable filterable multiple collapse-tags @change="handleChangeGroup">
                <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">部门</div>
            <div class="mb_item_c">
              <el-select v-model="topForm.department" size="mini" clearable filterable multiple collapse-tags>
                <el-option v-for="item in departitems" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">二级部门</div>
            <div class="mb_item_c">
              <el-select v-model="topForm.department2" size="mini" clearable filterable multiple collapse-tags>
                <el-option v-for="item in departitem2s" :key="item.code" :label="item.name" :value="item.code">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">登记日期</div>
            <div class="mb_item_c">
              <el-date-picker @change="handleChangeRegDate" size="mini" v-model="regdate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">体检日期</div>
            <div class="mb_item_c">
              <el-date-picker @change="handleChangeCheckDate" size="mini" v-model="checkdate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
          <div class="mb_item">
            <div class="mb_item_t">总检时间</div>
            <div class="mb_item_c">
              <el-date-picker @change="handleChangeTotaldate" size="mini" v-model="totaldate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
              </el-date-picker>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showMorefactor = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSearchMoreFactor">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 统计号操作弹框 -->
      <el-dialog title="统计号" :visible.sync="showStatisticscode" width="60%" :show-close="false" :close-on-click-modal="false" class="tjh_dialog">
        <div class="tjh_dialog_content">
          <div class="top_btn">
            <el-input placeholder="请输入检索关键字" v-model="searchName" size="mini" clearable>
            </el-input>
            <el-button size="mini" type="primary" @click="handleIllnessStaticsLoad">查 询</el-button>
            <el-button size="mini" type="primary" @click="handleIllnessStaticsDel">删 除</el-button>
            <el-button size="mini" type="primary" @click="handleIllnessStaticsConfirm">确 定</el-button>
            <el-button size="mini" type="primary" @click="handleIllnessStaticsClose">关 闭</el-button>
          </div>
          <div class="tjh_dialog_table_box">
            <div class="upl_table">
              <EasyTable :loading="loading" ref="persTable" class="pers_table" height="100%" :data="statisticscodeItemsSS" :tableOptions="persOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectCode" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
            </div>
            <!-- <el-pagination
              :pager-count="5"
              :small="true"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[20, 50, 100, 200, 300]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="persDataCount"
            >
            </el-pagination> -->
          </div>
        </div>
      </el-dialog>
      <!-- 设置确认弹框 -->
      <el-dialog title="设置为" :visible.sync="showSetup" width="60%" class="setupdia" :show-close="false" :close-on-click-modal="false">
        <div class="setup_box">
          <vxe-table class="setup_jibing_table" ref="setupjibingTable" width="100%" height="auto" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :auto-resize="true" :data="selectJiBing" :checkbox-config="{ reserve: true }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }">
            <vxe-table-column field="wordname" title="疾病名称" width="200px" sortable></vxe-table-column>
            <vxe-table-column field="illcode" title="所属大类" width="110px" sortable></vxe-table-column>
            <vxe-table-column field="illname" title="大类名称" min-width="200px" sortable>
              <template slot-scope="scope">
                {{ selectIll }}
              </template>
            </vxe-table-column>
            <vxe-table-column field="regid" title="体检号" width="110" sortable></vxe-table-column>
            <vxe-table-column field="name" title="姓名" width="110" sortable></vxe-table-column>
          </vxe-table>
        </div>
        <div class="setup_box_jishu">共计 {{ selectJiBing.length }} 条数据</div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showSetup = false">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitSetup">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import * as company_register from "@/api/CompanyRegister";
import { getCustomerBarcodeList } from "@/api/customerbarcode.js";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getBatchOrGroup, getPersonalDetail } from "@/api/searchDialog.js";
import { SysReportDesignLoad } from "@/api/systemreport.js";
import {
  CustomerIllList,
  IllnessStaticsSave,
  IllnessStaticsLoad,
  IllnessStaticsDetial,
  IllnessStaticsLoadCustomers,
  IllnessStaticsDelete,
} from "@/api/statisticsdisease.js";
export default {
  name: "statisticsdisease",

  components: { Sticky, permissionBtn },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    statisticscodeItemsSS() {
      const search = this.searchName;
      if (search) {
        return this.statisticscodeItems.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
            );
          });
        });
      }
      return this.statisticscodeItems;
    },
    // 疾病大类搜索数据
    illDataSS() {
      const search = this.searchIllKey;
      if (search) {
        return this.illData.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = ["code", "illname"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.illData;
    },
    // 疾病大类搜索数据
    jibingDataSS() {
      const search = this.searchJibingKey;
      if (search) {
        return this.jibingData.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = ["wordname", "illcode", "illname"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.jibingData;
    },
    persOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "统计号",
          prop: "code",
          omit: 1,
        },
        {
          title: "单位号",
          prop: "companycode",
          width: 110,
          omit: 1,
        },
        {
          title: "单位名称",
          prop: "companyname",
          width: 150,
          omit: 1,
        },
        {
          title: "统计时间",
          prop: "staticstime",
          width: 160,
          omit: 1,
        },
        {
          title: "统计者",
          prop: "operatorname",
          width: 120,
          omit: 1,
        },
        {
          title: "统计总人数",
          prop: "qty",
          width: 140,
          omit: 1,
        },
      ];
    },
  },

  data() {
    return {
      searchName: "",
      topForm: {
        companycode: "",
        statisticscode: "",
        report: "",
        groupcode: [],
        department: [],
        department2: [],
        regid: "",
        name: "",
        idcard: "",
        telephone: "",
        status: "",
        checktype: [],
        startdate: "",
        enddate: "",
        startcheckdate: "",
        endcheckdate: "",
        startinspectionplandate: "",
        endinspectionplandate: "",
        sex: 0,
      },
      checkupDateArr: [
        { code: "regdate", name: "登记时间" },
        { code: "totaldate", name: "总检时间" },
      ],
      dateCode: "regdate",
      dateName: "登记时间",
      agestr: "", // 年龄段
      regdate: [],
      checkdate: [],
      totaldate: [],
      loading: false,
      peopleList: [], // 人员列表
      pdfUrl: "", // 文件预览路径
      companyitems: [], // 公司列表数据
      groupitems: [], // 公司-分组列表数据
      departitems: [], // 公司-分组-部门列表数据
      departitem2s: [], // 公司-分组-部门列表数据
      batchObj: "",
      statisticscodeItems: [], // 统计号数据
      chooseCompany: null, // 当前选中单位对象
      selectPeople: [], // 勾选人员
      dialogVisible: false,
      showMorefactor: false,
      options: [],
      input: "",
      test: "",
      searchIllKey: "", // 检索大类关键字
      searchJibingKey: "", // 检索疾病关键字
      illData: [], // 疾病大类表格数据
      tempIndex: -1,
      jibingData: [], // 疾病列表数据
      showAddIll: false,
      addIllname: "",
      addIllId: "",
      selectIll: "", // 下拉选中大类
      selectJiBing: [], // 疾病勾选数据
      chooseIll: null, // 当前选中大类
      statisillnessname: "",
      showUnitDia: false,
      statusArr: [
        {
          code: "",
          name: "全部",
        },
        {
          code: 0,
          name: "已登记",
        },
        {
          code: 1,
          name: "已预约",
        },
        {
          code: 2,
          name: "已签到",
        },
        {
          code: 3,
          name: "体检中",
        },
        {
          code: 4,
          name: "已交表",
        },
        {
          code: 5,
          name: "可总检",
        },
        {
          code: 6,
          name: "已总检",
        },
        {
          code: 7,
          name: "已审核",
        },
      ], // 筛选状态数组
      checktypeitems: [], // 检查类型
      illnessstatic: null,
      showAddIllEdit: false,
      addIllIdEdit: "",
      addIllnameEdit: "",
      conditionDate: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, // 日期选择器配置
      showStatisticscode: false,
      selectCodeItem: [],
      persDataCount: 0,
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      showSetup: false,
      reportItems: [],
    };
  },

  mounted() {
    company_register
      .getList({
        page: 1,
        limit: 10000,
        whereitems: [],
      })
      .then((res) => {
        this.companyitems = res.data;
      });
    SysReportDesignLoad({
      page: 1,
      limit: 100000,
    }).then((res) => {
      if (!res.data) return;
      this.reportItems = res.data.filter((k) => k.reptype == "4");
    });
    this.handleGetDetail();
    this.handleGetPastHalfYear();
    // this.handleIllnessStaticsLoad();
  },

  methods: {
    // 关闭发送填写单位弹框
    handleCloseUnitDia() {
      this.showUnitDia = false;
      this.statisillnessname = ""; // 单位名称
    },
    handleCheckAllIll() {
      this.illData.forEach((k) => {
        k.inputvalue = "1";
      });
    },
    // 导出Excel
    handleExportExcel() {
      if (!this.topForm.statisticscode || !this.topForm.report) {
        this.$message.warning("请先选中统计号和报表名再进行统计!");
        return;
      }
      // let repname = "";
      // switch (this.topForm.report) {
      //   case "综合统计":
      //     repname = "广二团体报告书";
      //     // repname = "团体汇总报告";
      //     break;
      //   case "疾病比例":
      //     repname = "广二团检报告书_疾病统计";
      //     break;
      //   case "人员疾病列表":
      //     repname = "个人疾病统计";
      //     break;
      //   case "疾病分布":
      //     repname = "疾病分布统计";
      //     break;
      //   default:
      //     break;
      // }
      let data = {
        repname: this.topForm.report,
        filetype: "devxlsx",
        outtype: "url",
        whereitems: [
          {
            key: "code",
            value: this.topForm.statisticscode,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
        let url = res.data[0].fileurl;
        const a = document.createElement("a");
        a.href = url;
        a.download = "单位结算统计"; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
    // 统计号选中确认回调
    handleIllnessStaticsConfirm() {
      if (this.selectCodeItem.length != 1) {
        this.$message.warning("请先选中一条统计号数据再进行确认!");
        return;
      }
      this.topForm.statisticscode = this.selectCodeItem[0].code;
      this.handleIllnessStaticsClose();
    },
    // 关闭统计号弹框
    handleIllnessStaticsClose() {
      this.selectCodeItem = [];
      this.showStatisticscode = false;
    },
    // 删除统计号
    handleIllnessStaticsDel() {
      if (this.selectCodeItem.length == 0) {
        this.$message.warning("请先选中需删除统计号!");
        return;
      }
      this.$confirm("此操作将删除当前选中统计号, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectCodeItem.map((k) => k.code);
          IllnessStaticsDelete(codes).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.handleIllnessStaticsLoad();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 选择统计号
    handleSelectCode(val) {
      this.selectCodeItem = val;
    },
    // 点击弹出选中统计号弹框
    async handleShowStatisticscode() {
      await this.handleIllnessStaticsLoad();
      this.showStatisticscode = true;
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleIllnessStaticsLoad();
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(val) {
      this.handlePeopelList();
    },
    // 点击选择检索体检条件回调
    handleSelectConditionDate(val) {
      this.dateName = val.name;
      this.dateCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    handleSelectAll() {
      // this.$refs.xGrid.setAllCheckboxRow(true)
      this.$refs.peopleTable.toggleAllCheckboxRow();
    },
    //反选操作
    handleReverseSelect() {
      // //获取所有选中行
      for (var i = 0; i < this.peopleList.length; i++) {
        if (this.$refs.peopleTable.isCheckedByCheckboxRow(this.peopleList[i])) {
          this.$refs.peopleTable.setCheckboxRow(this.peopleList[i], false);
        } else {
          this.$refs.peopleTable.setCheckboxRow(this.peopleList[i], true);
        }
      }
      this.$nextTick(() => {
        let selectRecords = this.$refs.peopleTable.getCheckboxRecords();
        this.selectPeople = selectRecords;
      });
    },
    // 编辑统计号
    handleEditStatisticscode() {
      if (!this.topForm.statisticscode) {
        this.$message.warning("请先选中需编辑统计号!");
        return;
      }
      IllnessStaticsDetial({ code: this.topForm.statisticscode }).then(
        (res) => {
          if (!res.result) return;
          this.illData = res.result.illnessdetails;
          this.illnessstatic = res.result.illnessstatic;
          console.log(this.illnessstatic);
          this.dialogVisible = true;
        }
      );
    },
    // 获取人员列表
    handlePeopelList() {
      if (!this.chooseCompany) {
        this.$message.warning("请先选中单位1");
        return;
      }
      this.loading = true;
      let whereitems = [
        {
          key: "companycode",
          value: this.chooseCompany.companycode,
        },
        {
          key: "batch",
          value: this.chooseCompany.batch,
        },
      ];
      Object.keys(this.topForm).forEach((k) => {
        if (
          this.topForm[k] !== "" &&
          k != "companycode" &&
          k != "statisticscode" &&
          k != "report" &&
          k != "checktype" &&
          k != "groupcode" &&
          k != "department" &&
          k != "department2"
        ) {
          whereitems.push({
            key: k,
            value: this.topForm[k],
          });
        }
        if (
          ["checktype", "groupcode", "department", "department2"].includes(k)
        ) {
          this.topForm[k] =
            this.topForm[k].length == 0 ? "" : this.topForm[k].join(",");
          whereitems.push({
            key: k,
            value: this.topForm[k],
          });
        }
      });
      IllnessStaticsLoadCustomers({
        page: 1,
        limit: 10000,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (res.data.length == 0) {
            this.peopleList = [];
          } else {
            if (!this.agestr.trim()) {
              this.peopleList = res.data;
            } else {
              let ageFlagArr = this.agestr.split("|");
              let tempArr = [];
              for (let i = 0; i < ageFlagArr.length; i++) {
                let arr = res.data.filter((k) => {
                  return (
                    +ageFlagArr[i].split("-")[0] <= k.age &&
                    k.age <= +ageFlagArr[i].split("-")[1]
                  );
                });
                tempArr.push(...arr);
              }
              let map = new Map();
              for (let item of tempArr) {
                map.set(item.regid, item);
              }
              this.peopleList = [...map.values()];
              this.peopleList = this.peopleList.sort(function (a, b) {
                return b.age - a.age;
              });
            }
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 日期组件回调
    handleChangeRegDate(val) {
      if (val) {
        this.topForm.startdate = val[0];
        this.topForm.enddate = val[1];
        this.regdate = val;
      } else {
        this.topForm.startdate = "";
        this.topForm.enddate = "";
      }
    },
    // 日期组件回调
    handleChangeCheckDate(val) {
      if (val) {
        this.topForm.startcheckdate = val[0];
        this.topForm.endcheckdate = val[1];
        this.checkdate = val;
      } else {
        this.topForm.startcheckdate = "";
        this.topForm.endcheckdate = "";
      }
    },
    // 日期组件回调
    handleChangeTotaldate(val) {
      if (val) {
        this.topForm.startinspectionplandate = val[0];
        this.topForm.endinspectionplandate = val[1];
        this.totaldate = val;
      } else {
        this.topForm.startinspectionplandate = "";
        this.topForm.endinspectionplandate = "";
      }
    },
    // 更多条件确认回调
    handleSearchMoreFactor() {
      this.handlePeopelList();
      this.showMorefactor = false;
    },
    // 点击更多条件
    handleShowMore() {
      if (!this.chooseCompany) {
        this.$message.warning("请先选中单位");
        return;
      }
      this.showMorefactor = true;
      this.topForm.checktype &&
        (this.topForm.checktype = this.topForm.checktype.split(","));
      this.topForm.groupcode &&
        (this.topForm.groupcode = this.topForm.groupcode.split(","));
      this.topForm.department &&
        (this.topForm.department = this.topForm.department.split(","));
      this.topForm.department2 &&
        (this.topForm.department2 = this.topForm.department2.split(","));
    },
    // 点击统计按钮回调
    handleStatistics() {
      if (!this.topForm.statisticscode || !this.topForm.report) {
        this.$message.warning("请先选中统计号和报表名再进行统计!");
        return;
      }
      let repname = "";
      // switch (this.topForm.report) {
      //   case "综合统计":
      //     repname = "广二团体报告书";
      //     // repname = "团体汇总报告";
      //     break;
      //   case "疾病比例":
      //     repname = "广二团检报告书_疾病统计";
      //     break;
      //   case "人员疾病列表":
      //     repname = "个人疾病统计";
      //     break;
      //   case "疾病分布":
      //     repname = "疾病分布统计";
      //     break;
      //   default:
      //     break;
      // }
      let data = {
        repname: this.topForm.report,
        whereitems: [
          {
            key: "code",
            value: this.topForm.statisticscode,
          },
        ],
      };
      printStaticsBase64(data).then((res) => {
        if (!res.data) return;
        let code = res.data[0].base64String;
        code = code.replace(/[\n\r]/g, "");
        var raw = window.atob(code);
        let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        let url = window.URL.createObjectURL(
          new Blob([uInt8Array], { type: "application/pdf" })
        );
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    // 获取疾病统计列表
    handleIllnessStaticsLoad() {
      // if (!this.chooseCompany) {
      //   this.$message.warning("请先选中单位!");
      //   return;
      // }
      let whereitems = [];
      if (this.chooseCompany) {
        whereitems.push({
          key: "companycode",
          value: this.chooseCompany.companycode,
        });
        whereitems.push({
          key: "batch",
          value: this.chooseCompany.batch,
        });
      }
      this.loading = true;
      IllnessStaticsLoad({
        page: 1,
        limit: 100000,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (!res.result) {
            this.statisticscodeItems = [];
            this.persDataCount = 0;
          } else {
            this.statisticscodeItems = res.result;
            this.persDataCount = res.count;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 点击保存弹框回调
    handleSaveIll() {
      if (this.topForm.companycode) {
        let flag = this.companyitems.filter((k) => {
          return k.regid === this.topForm.companycode;
        })[0];
        flag && (this.statisillnessname = flag.companyname);
      } else {
        this.statisillnessname = "";
      }
      this.showUnitDia = true;
    },
    // 点击保存弹框回调
    handleConfirmUnitname() {
      if (!this.statisillnessname) {
        this.$message.warning("提交的疾病汇总统计名称不能为空!");
        return;
      }
      // this.selectIll && this.selectJiBing.length > 0 && this.handleSetIllData();
      let tempArr = [];
      let worditems = [];
      for (let i = 0; i < this.illData.length; i++) {
        let { words } = this.illData[i];
        words = words.map((k) => {
          return {
            ...k,
            inputvalue: this.illData[i].inputvalue,
          };
        });
        tempArr.push(...words);
      }
      worditems = tempArr.map((k) => {
        return {
          illcode: k.illcode,
          illname: k.illname,
          wordcode: k.wordcode,
          wordname: k.wordname,
          regid: k.regid,
          name: k.name,
          sex: k.sex,
          age: k.age,
          inputvalue: k.inputvalue,
        };
      });
      let data = {
        code: this.illnessstatic ? this.illnessstatic.code : "",
        name: this.illnessstatic
          ? this.illnessstatic.name
          : `${this.chooseCompany.companyname}-${
              this.chooseCompany.batch
            }-${new Date(+new Date() + 8 * 3600 * 1000)
              .toJSON()
              .substr(0, 19)
              .replace("T", " ")}`,
        companycode: this.illnessstatic
          ? this.illnessstatic.companycode
          : this.chooseCompany.companycode,
        batch: this.illnessstatic
          ? this.illnessstatic.batch
          : this.chooseCompany.batch,
        statisillnessname: this.statisillnessname,
        worditems,
      };
      IllnessStaticsSave(data).then((res) => {
        if (!res.result) {
          this.$message.warning("操作失败!请重试");
          return;
        }
        this.$message.success("操作成功!");
        this.topForm.statisticscode = res.result.code;
        this.handleCloseUnitDia();
        this.handleCloseIllDia();
      });
    },
    // 点击退出弹框弹框回调
    handleCloseIllDia() {
      this.dialogVisible = false;
      this.illData = [];
      this.jibingData = [];
      this.selectJiBing = [];
      this.$refs.jibingTable.clearCheckboxRow();
    },
    // 点击选中大类设置回调 - 弹框
    handleSubmitSetup() {
      for (let i = 0; i < this.selectJiBing.length; i++) {
        let index = this.jibingData.findIndex(
          (k) =>
            k.wordid == this.selectJiBing[i].wordid &&
            k.wordcode == this.selectJiBing[i].wordcode
        );
        if (index > -1) {
          this.jibingData.splice(index, 1);
          this.illData[this.tempIndex].words = this.jibingData;
          this.chooseIll.words = this.jibingData;
        }
      }
      let index = this.illData.findIndex((k) => k.illname === this.selectIll);
      if (index > -1) {
        for (let i = 0; i < this.selectJiBing.length; i++) {
          this.selectJiBing[i].illcode = this.illData[index].code;
          this.selectJiBing[i].illname = this.illData[index].illname;
        }
        this.illData[index].words.push(...this.selectJiBing);
        // 触发选中事件刷新右侧表格数据
        // this.handleChooseIllData({
        //   row: this.chooseIll,
        //   rowIndex: this.tempIndex,
        // });
        this.$refs.daleiTable.setCurrentRow(this.illData[0]);
        console.log(this.illData[0], "this.illData[0]");
        this.handleChooseIllData({
          row: this.illData[0],
          rowIndex: this.tempIndex,
        });
        this.searchIllKey = "";
        this.selectIll = "";
        this.selectJiBing = [];
        this.$refs.jibingTable.clearCheckboxRow();
        // this.$refs.daleiTable.setCurrentRow(this.illData[index]);
        this.showSetup = false;
        this.$message.success("操作成功!");
      }
    },
    // 点击选中大类设置回调
    handleSetIllData() {
      if (!this.selectIll) {
        this.$message.warning("请先选中需要设置的大类!");
        return;
      }
      if (this.selectJiBing.length == 0) {
        this.$message.warning("请先勾选需要设置的数据!");
        return;
      }
      if (this.chooseIll.illname === this.selectIll) {
        this.$message.warning("勾选疾病已在当前大类!");
        return;
      }
      this.showSetup = true;
    },
    // 点击删除大类回调
    handleDelIll() {
      if (!this.chooseIll) {
        this.$message.warning("请先选中需要删除的大类!");
        return;
      }
      this.$confirm("此操作将删除当前大类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let index = this.illData.findIndex((k) => k.code == 1);
          if (index > -1 && this.chooseIll.words.length > 0) {
            let tempData = this.chooseIll.words.map((k) => {
              return {
                ...k,
                illcode: this.illData[index].illcode,
                illname: this.illData[index].illname,
              };
            });
            console.log(tempData, "tempData");
            this.illData[index].words.push(...tempData);
          }
          let delIndex = this.illData.findIndex(
            (k) => k.illname == this.chooseIll.illname
          );
          delIndex > -1 && this.illData.splice(delIndex, 1);
          this.chooseIll = null;
          this.jibingData = [];
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 点击新增大类回调
    handleAddIll() {
      this.showAddIll = true;
    },
    // 点击新增大类回调
    handleEditIll() {
      if (!this.chooseIll) {
        this.$message.warning("请选择需要编辑的大类!");
        return;
      }
      this.addIllIdEdit = this.chooseIll.code;
      this.addIllnameEdit = this.chooseIll.illname;
      this.showAddIllEdit = true;
    },
    // 新增大类弹框提交回调
    handleConfirmIll() {
      if (!this.addIllId.trim() || !this.addIllname.trim()) {
        this.$message.warning("大类Id/名称不允许为空!");
        return;
      }
      let index = this.illData.findIndex(
        (k) => k.illname === this.addIllname.trim()
      );
      if (index > -1) {
        this.$message.warning("大类名称不允许重复!");
        return;
      }
      this.illData.push({
        code: this.addIllId.trim(),
        illname: this.addIllname.trim(),
        inputvalue: "0",
        words: [],
      });
      this.handleCloseIll();
    },
    // 编辑大类弹框提交回调
    handleConfirmIllEdit() {
      if (!this.addIllIdEdit.trim() || !this.addIllnameEdit.trim()) {
        this.$message.warning("大类ID/名称不允许为空!");
        return;
      }
      let index = this.illData.findIndex(
        (k) =>
          k.illname === this.addIllnameEdit.trim() &&
          k.code === this.addIllIdEdit.trim()
      );
      if (index > -1 && index != this.tempIndex) {
        this.$message.warning("大类名称不允许重复!");
        return;
      }
      let indexAdd = this.illData.findIndex(
        (k) => k.illname === this.chooseIll.illname
      );
      if (indexAdd > -1) {
        this.chooseIll.code = this.addIllIdEdit;
        this.chooseIll.illname = this.addIllnameEdit;
        this.chooseIll.words.forEach((k) => {
          k.illname = this.addIllnameEdit;
        });
        this.illData[indexAdd] = this.chooseIll;
        // this.illData[indexAdd].illname = this.addIllnameEdit;
        // this.illData[indexAdd].words.forEach((k) => {
        //   k.illname = this.addIllnameEdit;
        // });
      }
      this.chooseIll = null;
      console.log(this.illData);
      // this.illData
      this.handleCloseIllEdit();
    },
    // 关闭新增大类回调
    handleCloseIll() {
      this.showAddIll = false;
      this.addIllId = "";
      this.addIllname = "";
    },
    // 关闭新增大类回调
    handleCloseIllEdit() {
      this.showAddIllEdit = false;
      this.addIllIdEdit = "";
      this.addIllnameEdit = "";
      this.tempIndex = -1;
    },
    // 大类行点击回调
    handleChooseIllData({ row, rowIndex }) {
      console.log({ row, rowIndex });
      this.$refs.jibingTable.clearCheckboxRow();
      // this.selectIll && this.selectJiBing.length > 0 && this.handleSetIllData();
      if (!row) return;
      this.chooseIll = row;
      let index = this.illData.findIndex((k) => k.illname === row.illname);
      this.tempIndex = index; // 直接用传进来的会有bug 检索的时候
      // this.tempIndex = rowIndex; // 直接用传进来的会有bug 检索的时候
      this.jibingData = row.words;
      this.searchJibingKey = ""; // 清空右边检索内容
    },
    // 点击维护大类回调
    handleMaintenance() {
      if (this.topForm.statisticscode) {
        this.handleEditStatisticscode();
      } else {
        if (this.selectPeople.length == 0) {
          this.$message.warning("请选择人员!");
          return;
        }
        let regids = this.selectPeople.map((k) => {
          return k.regid;
        });
        CustomerIllList(regids).then((res) => {
          if (!res.result) return;
          this.illData = res.result;
          this.dialogVisible = true;
        });
      }
    },
    // 获取时间区间
    handleGetPastHalfYear() {
      let day2 = new Date();
      day2.setTime(day2.getTime());
      let today =
        day2.getFullYear() + "-" + (day2.getMonth() + 1) + "-" + day2.getDate();
      // 先获取当前时间
      let curDate = new Date().getTime();
      // 将半年的时间单位换算成毫秒
      let halfYear = (365 / 2) * 24 * 3600 * 1000;
      let pastResult = curDate - halfYear; // 半年前的时间（毫秒单位）
      // 日期函数，定义起点为半年前
      let pastDate = new Date(pastResult),
        pastYear = pastDate.getFullYear(),
        pastMonth = pastDate.getMonth() + 1,
        pastDay = pastDate.getDate();
      let half = pastYear + "-" + pastMonth + "-" + pastDay;
      let jinnian = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      let sanninaqian = new Date(
        +new Date() + 8 * 3600 * 1000 - 86400 * 1000 * 365 * 3
      )
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.regdate = [sanninaqian, jinnian];
      this.topForm.startdate = sanninaqian;
      this.topForm.enddate = jinnian;
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup() {
      getBatchOrGroup({
        companycode: this.chooseCompany.companycode,
      })
        .then((res) => {
          let { batchitems } = res.result;
          let batch = batchitems.filter(
            (k) => k.code == this.chooseCompany.batch
          )[0];
          this.batchObj = batchitems.filter(
            (k) => k.code == this.chooseCompany.batch
          )[0];
          batch && (this.groupitems = batch.groupitems);
          batch && (this.departitems = batch.departitems);
          batch && (this.departitem2s = batch.departitem2s);
          // this.handleSearch();
        })
        .catch((err) => {});
    },
    // 切换单位回调
    handleChangeCompany(value) {
      console.log(value, "切换单位回调");
      if (value) {
        let flag = this.companyitems.filter((k) => k.regid === value)[0];
        flag && (this.chooseCompany = flag);
      } else {
        this.chooseCompany = null;
      }
      this.illnessstatic = null;
      this.topForm.statisticscode = "";
      this.topForm.report = "";
      this.topForm.groupcode = [];
      this.topForm.department = [];
      this.selectPeople = [];
      this.groupitems = [];
      this.departitems = [];
      this.departitem2s = [];
      this.batchObj = "";
      this.peopleList = [];
      this.statisticscodeItems = [];
      this.chooseCompany && this.hadnleGetBatchOrGroup();
      this.handlePeopelList();
      // this.handleIllnessStaticsLoad();
    },
    // 新增获取个人登记明细/详情/新增回调
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let { checktypeitems } = res.result;
        this.checktypeitems = checktypeitems;
      });
    },
    // 切换分组回调
    handleChangeGroup(value) {
      if (value) {
        let group = this.groupitems.filter((k) => k.code == value)[0];
        group && (this.departitems = group.departitems);
        group && (this.departitem2s = group.departitem2s);
      } else {
        this.batchObj
          ? (this.departitems = this.batchObj.departitems)
          : (this.departitems = []);
        this.batchObj
          ? (this.departitem2s = this.batchObj.departitem2s)
          : (this.departitem2s = []);
      }
      this.topForm.department = [];
      // this.handlePeopelList();
    },
    // 切换部门回调
    handleChangeDepart(value) {
      this.handlePeopelList();
    },
    // 勾选疾病数据回调
    handleSelectJibing({ records, reserves }) {
      if (reserves.length > 0) {
        this.selectJiBing = Object.assign([], [...records, ...reserves]);
      } else {
        this.selectJiBing = Object.assign([], records);
      }
    },
    // 勾选疾病数据回调-全选
    handleSelectJibingAll({ records, reserves }) {
      if (reserves.length > 0) {
        this.selectJiBing = Object.assign([], [...records, ...reserves]);
      } else {
        this.selectJiBing = Object.assign([], records);
      }
    },
    // 勾选人员回调
    handleSelectPeople({ records }) {
      this.selectPeople = records;
    },
    // 勾选人员回调-全选
    handleSelectPeopleAll({ records }) {
      this.selectPeople = records;
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnSearch": // 搜索
          break;
        case "btnPrint": // 打印
          if (
            this.fileurl != undefined &&
            this.fileurl != null &&
            this.fileurl != ""
          ) {
            this.lodop = getLodop();
            let printname = ``;
            if (this.printname == "") {
              printname = this.lodop.GET_PRINTER_NAME(-1);
            } else {
              printname = this.printname;
            }
            let printObj = new LodopPrinter(null, printname);
            let fileList = [this.base64String];
            printObj.printBase64PdfReport(this.lodop, fileList);
          } else {
            this.$message({
              showClose: true,
              message: "请先进行统计",
              type: "warning",
            });
          }
          break;
        case "btnEdit": // 编辑
          this.handleEditStatisticscode();
          break;
        case "btnReset": // 重置
          this.$reload();
          break;
        case "btnExportExcel": // 重置
          this.handleExportExcel();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 关闭当前页面回调
    handleClosePage() {
      if (this.visitedViews.length < 1) return false;
      let view = this.visitedViews.filter(
        (k) => k.path === this.$route.path
      )[0];
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
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      return stylejson;
    },
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
  },

  watch: {},
};
</script>
<style lang="scss" scoped>
/* 方法一和通用样式 */
.wordname-cell,
.wordname-column .vxe-cell {
  white-space: normal !important;
  word-break: break-word !important;
}
// @import url("./css/index.scss");
.statisticsdisease {
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 6px;
    overflow: hidden;
    .search_box {
      display: flex;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      align-items: center;
      justify-content: flex-end;
      padding: 0 20px;
      .sbtn {
        margin: 0 10px;
      }
      .el-input {
        width: 250px;
      }
    }
    .mainbody {
      height: calc(100% - 40px);
      .el-row {
        height: 100%;
        .el-col {
          height: 100%;
        }
        .main_l {
          box-sizing: border-box;
          padding: 10px;
          .top_form {
            height: 130px;
            .el-form {
              .tjhitem {
                /deep/.el-form-item__content {
                  display: flex;
                  .tjh_box {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    .el-icon-delete {
                      color: #66b1ff;
                      margin: 0 4px;
                      cursor: pointer;
                    }
                    .tjhb_tjh {
                      min-width: 200;
                    }
                    .el-button {
                      width: 50px;
                    }
                  }
                  .tjbtn {
                    margin-left: 6px;
                    width: 80px;
                  }
                }
              }
              .el-form-item {
                margin-bottom: 5px;
              }
              .el-select {
                width: 100%;
              }
              .df {
                .dfb {
                  display: flex;
                  align-items: center;
                  .el-button {
                    height: 28px !important;
                  }
                }
                .el-select {
                  width: 72%;
                  margin-right: 2%;
                }
                .el-radio-group {
                  width: 72%;
                  margin-right: 2%;
                  .el-radio {
                    margin: 0 0 8px 0 !important;
                    width: 50%;
                  }
                }
                .el-button {
                  width: 25%;
                }
              }
            }
          }
          .btn_group_box {
            height: 30px;
          }
          .total {
            height: 20px;
            display: flex;
            align-items: center;
          }
          .people_box {
            height: calc(100% - 180px);
          }
        }
        .main_r {
          box-sizing: border-box;
          padding: 10px 10px 10px 0;
          .pdfbox {
            height: 100%;
          }
        }
      }
    }
    .maintenance_dia {
      .el-dialog__header {
        padding: 10px 10px 0 10px;
      }
      .el-dialog__body {
        padding: 10px;
        .maintenance {
          box-sizing: border-box;
          height: 600px;
          .el-row {
            height: 100%;
            box-sizing: border-box;
            .el-col {
              height: 100%;
              .top_btn {
                display: flex;
                align-items: center;
                height: 32px;
                margin-bottom: 8px;
                .el-input {
                  width: 200px;
                  margin-right: 8px;
                }
                .select_box {
                  display: flex;
                  align-items: center;
                  margin-right: 20px;
                  > span {
                    margin-right: 8px;
                  }
                  .el-select {
                    width: 200px;
                  }
                }
              }
              .daleiBox {
                height: calc(100% - 32px);
              }
              .jibingBox {
                height: calc(100% - 92px);
              }
              .jb_jishu {
                height: 30px;
                display: flex;
                align-items: center;
              }
              .select_input {
                height: 30px;
                .el-input {
                  width: 200px;
                }
              }
            }
            .mr {
              width: calc(50% - 8px);
              margin-right: 8px;
            }
          }
        }
        .vxe-body--row.row--current {
          background-color: #3489ca !important;
        }
      }
    }
    .morefactor_dia {
      /deep/.el-dialog__header {
        padding: 10px 10px 0 10px !important;
      }
      /deep/.el-dialog__body {
        padding: 10px;
        .morefactor_box {
          .mb_item {
            display: flex;
            margin-bottom: 8px;
            .mb_item_t {
              width: 80px;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              margin-right: 5px;
            }
            .mb_item_c {
              width: calc(100% - 85px);
              .el-select {
                width: 100%;
              }
              .el-date-editor {
                width: 100%;
              }
            }
          }
        }
      }
      /deep/.el-dialog__footer {
        padding: 10px;
        text-align: center;
      }
    }
    .discount_dialog {
      background-color: rgba(0, 0, 0, 0.3);
      .dbbx {
        display: flex;
        margin-top: 6px;
        .dbbx_titile {
          width: 110px;
        }
      }
    }
    .tjh_dialog {
      /deep/.el-dialog__header {
        padding: 10px;
      }
      /deep/.el-dialog__body {
        padding: 0 10px 10px 10px;
        .tjh_dialog_content {
          .top_btn {
            height: 30px;
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
            .el-input {
              width: 220px;
              margin-right: 5px;
            }
          }
          .tjh_dialog_table_box {
            height: 500px;
            .upl_table {
              height: calc(100% - 30px);
              .pers_table {
                height: 100%;
              }
            }
            .el-pagination {
              height: 30px;
              text-align: center;
            }
          }
        }
      }
    }
    .setupdia {
      /deep/.el-dialog__header {
        padding: 10px;
      }
      /deep/.el-dialog__footer {
        padding: 10px;
        text-align: center;
      }
      /deep/.el-dialog__body {
        padding: 0 10px 10px 10px;
        .setup_box {
          height: 500px;
          .setup_jibing_table {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    // 项目折扣
    .statisillnessname_dialog {
      background-color: rgba(0, 0, 0, 0.3);
      .discount_box {
        .dbox_input {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          /deep/.el-input {
            width: 150px;
          }
          > div {
            margin-left: 5px;
          }
        }
      }
      /deep/.el-dialog__footer {
        text-align: center;
      }
    }
  }
}
.el-popover {
  .content {
    .content_item {
      height: 20px;
      margin-bottom: 3px;
      padding: 0 10px;
      cursor: pointer;
    }
    .content_item:hover {
      color: #66b1ff;
      background-color: #ecf5ff;
    }
  }
  .print_item {
    margin-bottom: 3px;
    padding: 5px 10px;
    cursor: pointer;
  }
  .print_item:hover {
    background-color: #ecf5ff;
    color: #66b1ff;
  }
}
</style>
