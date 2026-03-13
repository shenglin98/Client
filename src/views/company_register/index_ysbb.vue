<template>
    <div class="company_register">
      <div v-if="!showAddOrEdit" class="filter-box">
        <div class="filter-container">
          <div class="filter-container-in">
            预约日期：　<el-date-picker
              v-model="queryDate"
              size="mini"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              class="daterange"
            >
            </el-date-picker>
            <el-input
              @keyup.enter.native="handleFilter"
              size="mini"
              style="width: 300px; margin-right: 20px"
              class="filter-item"
              :placeholder="'名称'"
              v-model="searchWord"
            >
            </el-input>
            <el-button
              class="filter-item"
              size="mini"
              type="primary"
              v-waves
              icon="el-icon-search"
              @click="handleFilter"
              >搜索</el-button
            >
          </div>
        </div>
        <div class="app-container">
          <div class="filter-container-btn">
            <permission-btn
              moduleName="company_register"
              ref="companyregister"
              size="mini"
              type="primary"
              plain
              v-on:btn-event="onBtnClicked"
            ></permission-btn>
          </div>
          <div class="bg-white" style="height: calc(100vh - 210px)">
            <el-table
              ref="mainTable"
              min-width="500"
              height="100%"
              stripe
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0px' }"
              :header-cell-style="{
                background: '#b6cfee',
                fontWeight: 600,
                color: '#18253a',
                height: '40px',
              }"
              :key="tableKey"
              :data="list"
              v-loading="listLoading"
              fit
              highlight-current-row
              style="width: 100%"
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                type="selection"
                align="center"
                width="55"
              ></el-table-column>
              <el-table-column
                prop="companycode"
                label="单位编码"
                width="100px"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="250px"
                align="left"
                prop="companyname"
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
                prop="batch"
                label="批次"
                show-overflow-tooltip
              ></el-table-column>
              <!-- <el-table-column prop="registerdate" label="预约时间" width="150px" show-overflow-tooltip></el-table-column> -->
              <el-table-column
                prop="total"
                label="体检人数"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="180"
                prop="startdate"
                label="开始时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                width="180"
                prop="enddate"
                label="结束时间"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="receptionname"
                label="接待人"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="contacts"
                label="联系人"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="telephone"
                label="联系电话"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="email"
                label="收费状态"
                show-overflow-tooltip
                width="120"
              >
                <template slot-scope="scope">
                  <el-select
                    class="filter-item"
                    size="mini"
                    filterable
                    v-model="scope.row.coststatus"
                    @change="handleChangeCoststatus(scope.row)"
                  >
                    <el-option label="未收费" :value="0"></el-option>
                    <el-option label="已收费" :value="1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-if="total > 0"
              :total="total"
              :page.sync="listQuery.page"
              :limit.sync="listQuery.limit"
              @pagination="handleCurrentChange"
            />
          </div>
          <el-dialog
            v-el-drag-dialog
            class="dialog-mini"
            max-width="1500px"
            top="50px"
            :close-on-click-modal="false"
            :title="textMap[dialogStatus]"
            :visible.sync="adddialogFormVisible"
            @close="close"
          >
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="addtemp"
              label-position="right"
              label-width="130px"
            >
              <sticky :className="'sub-navbar'">
                <el-button size="mini" type="primary" @click="chilopen"
                  >添加分组</el-button
                >
                <el-button size="mini" type="warning" @click="chilupd"
                  >修改分组</el-button
                >
                <el-button size="mini" type="danger" @click="childel"
                  >删除分组</el-button
                >
              </sticky>
              <el-tag type="info" style="margin-left: 70px" effect="dark">
                基本信息
              </el-tag>
              <br />
              <br />
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'单位名称'"
                    align="left"
                    prop="Companycode"
                  >
                    <el-select
                      v-model="addtemp.Companycode"
                      @change="companycurrentSel($event)"
                    >
                      <el-option
                        v-for="(item, index) in result.companyItems"
                        :key="index"
                        :value="item.id"
                        :label="item.companyname"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'批次'" prop="Batch">
                    <el-input
                      v-model="addtemp.Batch"
                      disabled="disabled"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'体检时间'" prop="Startdate">
                    <el-date-picker
                      v-model="addtemp.Startdate"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'至'" prop="Enddate">
                    <el-date-picker
                      v-model="addtemp.Enddate"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item size="small" :label="'体检人数'" prop="Total">
                    <el-input v-model="addtemp.Total"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'单位联系人'"
                    prop="Contacts"
                  >
                    <el-input v-model="addtemp.Contacts"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'联系电话'" prop="Telephone">
                    <el-input v-model="addtemp.Telephone"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'邮箱'" prop="Email">
                    <el-input v-model="addtemp.Email"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item size="small" :label="'体检地点'" prop="Meccode">
                    <el-select v-model="addtemp.Meccode">
                      <el-option
                        v-for="(item, index) in result.centers"
                        :key="index"
                        :value="item.id"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'接待人员'"
                    prop="Receptioncode"
                  >
                    <el-select
                      v-model="addtemp.Receptioncode"
                      @change="receptionnamecurrentSel($event)"
                    >
                      <el-option
                        v-for="(item, index) in result.users"
                        :key="index"
                        :value="item.account"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'预约时间'"
                    prop="Registerdate"
                  >
                    <el-date-picker
                      v-model="addtemp.Registerdate"
                      type="date"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'注册机构'"
                    prop="Hospitalcode"
                  >
                    <el-select v-model="addtemp.Hospitalcode">
                      <el-option
                        v-for="(item, index) in centerarr"
                        :key="index"
                        :value="item.code"
                        :label="item.name"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'合同编号'"
                    prop="ContractNo"
                  >
                    <el-input v-model="addtemp.ContractNo"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'合同名称'"
                    prop="Contractname"
                  >
                    <el-input v-model="addtemp.Contractname"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="small" :label="'合同附件'" prop="Telephone">
                    <el-upload
                      class="upload-demo"
                      ref="upload"
                      name="files"
                      :action="baseURL + '/Files/Upload'"
                      :on-success="upFile"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      multiple
                      :limit="1"
                      :on-exceed="handleExceed"
                      :file-list="fileList"
                    >
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item
                    size="small"
                    :label="'预约人'"
                    prop="Registername"
                  >
                    <el-input
                      v-model="addtemp.Registername"
                      disabled="disabled"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="20">
                  <el-form-item size="small" :label="'备注'" prop="Remark">
                    <el-input v-model="addtemp.Remark"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
  
              <el-row>
                <el-tag type="info" style="margin-left: 70px" effect="dark">
                  单位预约分组
                </el-tag>
                <br />
                <br />
                <el-col :span="4" style="margin-left: 70px">
                  <el-card
                    style="margin-top: 10px"
                    v-for="(item, index) in addtemp.Company_register_grouplist"
                    :key="index"
                  >
                    <a @click="combinechange(item)">
                      <div style="padding: 14px">
                        <span
                          >姓名：<span>{{ item.Groupname }}</span></span
                        >
                        <div class="bottom clearfix">
                          <span
                            >性别：<span>{{
                              item.Sex == 1
                                ? "男"
                                : item.Sex == 2
                                ? "女"
                                : item.Sex == 0
                                ? "未知"
                                : ""
                            }}</span></span
                          >
                          <el-button type="text" class="button"
                            >操作按钮</el-button
                          >
                        </div>
                      </div>
                    </a>
                  </el-card>
                </el-col>
                <el-col :span="17" style="margin-left: 50px">
                  <div class="bg-white">
                    <el-table
                      ref="mainTable"
                      :key="tableKey"
                      :data="company_register_combinelistcopy.CombineItems"
                      v-loading="listLoading"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%; margin-top: 10px; margin-left: 20px"
                      @row-click="rowClick"
                    >
                      <el-table-column
                        prop="setmealname"
                        label="体检套餐"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="combinename"
                        label="组合名称"
                        show-overflow-tooltip
                      ></el-table-column>
                      <!-- <el-table-column  prop="deptcode" label="检查科室" show-overflow-tooltip></el-table-column> -->
                      <el-table-column
                        prop="originalprice"
                        label="原价"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="discount"
                        label="折扣"
                        show-overflow-tooltip
                      ></el-table-column>
                      <el-table-column
                        prop="discountprice"
                        label="折后价格 "
                        show-overflow-tooltip
                      ></el-table-column>
                    </el-table>
                    <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" /> -->
                  </div>
                </el-col>
              </el-row>
            </el-form>
            <el-dialog
              v-el-drag-dialog
              class="dialog-mini"
              width="1500px"
              top="50px"
              :close-on-click-modal="false"
              :title="textMap[childialogStatus]"
              :visible.sync="chiladddialogFormVisible"
              @close="chilclose"
            >
              <el-form
                :rules="rules"
                ref="groupdataForm"
                :model="addCompany_register_grouptemp"
                label-position="right"
                label-width="130px"
              >
                <el-row>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'分组名称'"
                      prop="Groupname"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Groupname"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'优先级'" prop="Priority">
                      <el-input
                        v-model="addCompany_register_grouptemp.Priority"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'年龄上限'" prop="Maxage">
                      <el-input
                        v-model="addCompany_register_grouptemp.Maxage"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'年龄下限'" prop="Minage">
                      <el-input
                        v-model="addCompany_register_grouptemp.Minage"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'性别'" prop="Sex">
                      <el-select v-model="addCompany_register_grouptemp.Sex">
                        <el-option
                          v-for="(item, index) in sexarr"
                          :key="index"
                          :value="item.key"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'婚否'" prop="Marriage">
                      <el-select v-model="addCompany_register_grouptemp.Marriage">
                        <el-option
                          v-for="(item, index) in marriagearr"
                          :key="index"
                          :value="item.key"
                          :label="item.name"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'分组标识'"
                      prop="Groupmark"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Groupmark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'分组人数'"
                      prop="Grouptotal"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Grouptotal"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'所属部门'"
                      prop="Department"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Department"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'原价'"
                      prop="Originalprice"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Originalprice"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item size="small" :label="'折扣'" prop="Discount">
                      <el-input
                        v-model="addCompany_register_grouptemp.Discount"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'增项折扣'"
                      prop="AddDiscount"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.AddDiscount"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'折后价格'"
                      prop="Discountprice"
                    >
                      <el-input
                        v-model="addCompany_register_grouptemp.Discountprice"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'结算方式'"
                      prop="Settlementtype"
                    >
                      <el-select
                        v-model="addCompany_register_grouptemp.Settlementtype"
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
                  <el-col :span="6">
                    <el-form-item
                      size="small"
                      :label="'增项结算方式'"
                      prop="Addsettlementtype"
                    >
                      <el-select
                        v-model="addCompany_register_grouptemp.Addsettlementtype"
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
                </el-row>
                <el-row>
                  <el-col :span="18">
                    <el-form-item size="small" :label="'分组说明'" prop="Remark">
                      <el-input
                        v-model="addCompany_register_grouptemp.Remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item
                      size="small"
                      :label="'体检套餐字典'"
                      prop="Dic_setmeal"
                    >
                      <div class="bg-white">
                        <el-table
                          ref="setmealTable"
                          :key="tableKey"
                          :data="result.setmeal"
                          v-loading="listLoading"
                          border
                          fit
                          highlight-current-row
                          style="width: 100%; margin-top: 10px; margin-left: 20px"
                          @row-click="rowClick"
                          @selection-change="handleDic_setmealSelectionChange"
                        >
                          <el-table-column
                            type="selection"
                            align="center"
                            width="55"
                          ></el-table-column>
                          <el-table-column
                            prop="name"
                            label="套餐名称"
                            show-overflow-tooltip
                          >
                          </el-table-column>
                          <el-table-column
                            prop="price"
                            label="套餐价格"
                            show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column
                            prop="companyprice"
                            label="单位价格"
                            show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column
                            prop="sex"
                            label="性别"
                            show-overflow-tooltip
                          >
                            <template slot-scope="scope">
                              <span>{{
                                scope.row.sex == "1"
                                  ? "男"
                                  : scope.row.sex == "2"
                                  ? "女"
                                  : scope.row.sex == "0"
                                  ? "未知"
                                  : ""
                              }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" /> -->
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      size="small"
                      :label="'体检组合字典'"
                      prop="Dic_combine"
                    >
                      <div class="bg-white">
                        <el-table
                          ref="combineTable"
                          :key="tableKey"
                          :data="result.combines"
                          v-loading="listLoading"
                          border
                          fit
                          highlight-current-row
                          style="width: 100%; margin-top: 10px; margin-left: 20px"
                          @row-click="rowClick"
                          @selection-change="handleDic_combineSelectionChange"
                        >
                          <el-table-column
                            type="selection"
                            align="center"
                            width="55"
                          ></el-table-column>
                          <el-table-column
                            align="center"
                            prop="name"
                            label="组合名称"
                            show-overflow-tooltip
                          >
                            <template slot-scope="scope">
                              <span
                                class="link-type"
                                @click="handleUpdate(scope.row)"
                                >{{ scope.row.name }}</span
                              >
                            </template>
                          </el-table-column>
                          <el-table-column
                            align="center"
                            prop="deptcode"
                            label="科室编码"
                            show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column
                            align="center"
                            prop="price"
                            label="组合价格"
                            show-overflow-tooltip
                          ></el-table-column>
                          <el-table-column
                            align="center"
                            prop="sex"
                            label="性别控制"
                            show-overflow-tooltip
                          >
                            <template slot-scope="scope">
                              <span>{{
                                scope.row.sex == "1"
                                  ? "男"
                                  : scope.row.sex == "2"
                                  ? "女"
                                  : scope.row.sex == "0"
                                  ? "未知"
                                  : ""
                              }}</span>
                            </template>
                          </el-table-column>
                        </el-table>
                        <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" /> -->
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer">
                <el-button
                  size="mini"
                  @click="
                    (chiladddialogFormVisible = false),
                      resetaddCompany_register_grouptemp()
                  "
                  >取消</el-button
                >
                <el-button
                  size="mini"
                  v-if="childialogStatus == 'chilcreate'"
                  type="primary"
                  @click="Company_register_grouptempcreateData"
                  >确认</el-button
                >
                <el-button
                  size="mini"
                  v-else
                  type="primary"
                  @click="Company_register_grouptempupdateData"
                  >确认</el-button
                >
              </div>
            </el-dialog>
            <div slot="footer">
              <el-button
                size="mini"
                @click="(adddialogFormVisible = false), addresetTemp()"
                >取消</el-button
              >
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
      <transition name="fade" mode="in-out">
        <AddOrEdit
          v-if="showAddOrEdit"
          @submit="handleSubmitSuccess"
          :editObj="editObj"
          :addOrEdit="addOrEdit"
          @close="showAddOrEdit = false"
        />
      </transition>
    </div>
  </template>
  
  <script>
  import * as company_register_group from "@/api/company_register_group";
  import * as uploadFiles from "@/api/uploadFiles";
  import * as company_register from "@/api/CompanyRegister";
  import waves from "@/directive/waves"; // 水波纹指令
  import Sticky from "@/components/Sticky";
  import permissionBtn from "@/components/PermissionBtn";
  import Pagination from "@/components/Pagination";
  import elDragDialog from "@/directive/el-dragDialog";
  import extend from "@/extensions/registerdelRows.js";
  import ShowFormBase from "@/components/Formcreated/components/ShowFormBase";
  // 添加编辑子组件
  import AddOrEdit from "./components/AddOrEdit_ysbb.vue";
  import { getSysConfigInfo } from "@/api/sysconfig";
  import { printStaticsBase64 } from "@/api/printreport.js";
  import { mapGetters } from "vuex";
  
  export default {
    name: "company_register",
    components: {
      Sticky,
      permissionBtn,
      Pagination,
      ShowFormBase,
      AddOrEdit,
    },
    mixins: [extend],
    directives: {
      waves,
      elDragDialog,
    },
    data() {
      return {
        showAddOrEdit: false, // 控制页面显示
        addOrEdit: "add", // 新增还是编辑 add/edit
        editObj: undefined, //编辑数据对象
        currentDate: new Date(),
        baseImgUrl: window.baseUrlImg, // 图片根目录
        baseURL: window.baseUrl, // api的base_url
        multipleSelection: [], // 列表checkbox选中的值
        dic_combinemultipleSelection: [],
        dic_setmealmultipleSelection: [], // 列表checkbox选中的值
        tableKey: 0,
        list: null,
        total: 0,
        fileList: [],
        listLoading: true,
        jsonTemplate: "",
        previewVisible: false,
        createdFormData: {},
        updateFormData: {},
        result: [],
        queryDate: [], // 搜索条件日期
        searchWord: "", // 搜索关键字
        listQuery: {
          // 查询条件
          page: 1,
          limit: 20,
          whereitems: [],
        },
        department: [],
        sexarr: [
          { key: 0, name: "未知" },
          { key: 1, name: "男" },
          { key: 2, name: "女" },
        ],
        settlementtypearr: [
          { key: 0, name: "单位结算" },
          { key: 1, name: "个人结算" },
        ],
        addsettlementtypearr: [
          { key: 0, name: "单位结算" },
          { key: 1, name: "个人结算" },
          { key: 2, name: "其他" },
        ],
        marriagearr: [
          { key: "未婚", name: "未婚" },
          { key: "已婚", name: "已婚" },
          { key: "离异", name: "离异" },
          { key: "其他", name: "其他" },
        ],
        centerarr: [
          { code: "A10001", name: "南方医院" },
          { code: "A10002", name: "南方医院分院" },
          { code: "A10003", name: "一五七医院" },
        ],
        formDataSelect: null,
        addCompany_register_grouptemplist: [],
        addCompany_register_grouptemp: {
          Groupid: "",
          Regid: "",
          Groupcode: "",
          Groupname: "",
          Priority: "",
          Sex: "",
          Minage: "",
          Maxage: "",
          Marriage: "",
          Groupmark: "",
          Grouptotal: "",
          Department: "",
          Setmealcode: "",
          Setmealname: "",
          Originalprice: "",
          Discount: "",
          Discountprice: "",
          Settlementtype: "",
          Addsettlementtype: "",
          AddDiscount: "",
          Remark: "",
          Operatordate: "",
          CombineItems: [],
          Operatorcode: "",
          Operatorname: "",
          dic_setmeal: null,
          dic_combine: null,
          sexname: "",
        },
        Company_register_grouptemp: {
          Groupid: "",
          Regid: "",
          Groupcode: "",
          Groupname: "",
          Priority: "",
          Sex: "",
          Minage: "",
          Maxage: "",
          Marriage: "",
          Groupmark: "",
          Grouptotal: "",
          Department: "",
          Setmealcode: "",
          Setmealname: "",
          Originalprice: "",
          Discount: "",
          Discountprice: "",
          Settlementtype: "",
          Addsettlementtype: "",
          AddDiscount: "",
          Remark: "",
          Operatordate: "",
          CombineItems: [],
          Operatorcode: "",
          Operatorname: "",
          dic_setmeal: null,
          dic_combine: null,
          sexname: "",
        },
        company_register_combinelistcopy: [],
        addtemplist: [],
  
        temp: {
          Regid: "",
          Hospitalcode: "",
          Registername: "",
          Companycode: "",
          Companyname: "",
          Batch: "",
          Startdate: "",
          Enddate: "",
          Total: "",
          Contacts: "",
          Telephone: "",
          files: [],
          Faxnumber: "",
          Email: "",
          Address: "",
          ContractNo: "",
          Contractname: "",
          Receptioncode: "",
          Receptionname: "",
          Remark: "",
          Registerdate: "",
          Registercode: "",
          Registername: "",
          delflag: 0,
          Company_register_grouplist: [],
          Meccode: "",
        },
        Company_register_combine: [],
        addtemp: {
          Regid: "",
          Hospitalcode: "",
          Registername: "",
          Companycode: "",
          Companyname: "",
          Batch: "",
          Startdate: "",
          Enddate: "",
          Total: "",
          Contacts: "",
          Telephone: "",
          Faxnumber: "",
          Email: "",
          Address: "",
          ContractNo: "",
          Contractname: "",
          Receptioncode: "",
          Receptionname: "",
          Remark: "",
          Registerdate: "",
          Registercode: "",
          Registername: "",
          FileId: "",
          delflag: 0,
          Company_register_grouplist: [],
          Meccode: "",
        },
        formid: "",
        tempdata: [],
        companyItems: [],
        regid: "",
        templist: [],
        updatelist: [],
        dialogFormVisible: false,
        adddialogFormVisible: false,
        chiladddialogFormVisible: false,
        dialogStatus: "",
        childialogStatus: "",
        textMap: {
          update: "编辑",
          create: "添加",
          chilcreate: "添加分组",
          chilupdate: "编辑分组",
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          Companycode: [
            {
              required: true,
              message: "单位名称不能为空",
              trigger: "blur",
            },
          ],
          Hospitalcode: [
            {
              required: true,
              message: "注册机构不能为空",
              trigger: "blur",
            },
          ],
          Meccode: [
            {
              required: true,
              message: "体检地点不能为空",
              trigger: "blur",
            },
          ],
          Startdate: [
            {
              required: true,
              message: "开始时间不能为空",
              trigger: "blur",
            },
          ],
          Enddate: [
            {
              required: true,
              message: "结束时间不能为空",
              trigger: "blur",
            },
          ],
          Total: [
            {
              required: true,
              message: "检查人数不能为空",
              trigger: "blur",
            },
          ],
          Contacts: [
            {
              required: true,
              message: "单位联系人不能为空",
              trigger: "blur",
            },
          ],
          Registerdate: [
            {
              required: true,
              message: "预约时间不能为空",
              trigger: "blur",
            },
          ],
          Groupname: [
            {
              required: true,
              message: "分组名称不能为空",
              trigger: "blur",
            },
          ],
          Priority: [
            {
              required: true,
              message: "优先级不能为空",
              trigger: "blur",
            },
          ],
          Grouptotal: [
            {
              required: true,
              message: "分组人数不能为空",
              trigger: "blur",
            },
          ],
          Settlementtype: [
            {
              required: true,
              message: "结算方式不能为空",
              trigger: "blur",
            },
          ],
          Addsettlementtype: [
            {
              required: true,
              message: "增项结算方式不能为空",
              trigger: "blur",
            },
          ],
          AddDiscount: [
            {
              required: true,
              message: "增项折扣不能为空",
              trigger: "blur",
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
        printDate: "",
      };
    },
    computed: {
      ...mapGetters(["iframeViews", "visitedViews"]),
    },
    created() {
      this.handleGetSysConfigInfo();
      this.handleGetPrintDate();
    },
  
    methods: {
      handleChangeCoststatus(item, value) {
        if (!item) return;
        if (item.coststatus == 0) {
          company_register.UpdateCostStatusNo([item.regid]).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.getList();
          });
        } else {
          company_register.UpdateCostStatusYes([item.regid]).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.getList();
          });
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
      handleGetSysConfigInfo() {
        getSysConfigInfo({ cc: "Sys_Company_register_DateRange" }).then((res) => {
          // 获取条件计算日期范围回调
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
          this.queryDate = [this.gettime(start), this.gettime(end)];
          this.getList();
        });
      },
      handleGetPrintDate() {
        getSysConfigInfo({ cc: "Sys_StatisticsReport_DateRange" }).then((res) => {
          // 获取条件计算日期范围回调
          const end = new Date();
          const start = new Date();
          start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
          this.printDate = [this.gettime(start), this.gettime(end)];
        });
      },
      gettime(data) {
        let value =
          data.getFullYear() +
          "-" +
          this.checkTime(data.getMonth() + 1) +
          "-" +
          this.checkTime(data.getDate());
        return value;
      },
      checkTime(i) {
        if (i < 10) {
          i = "0" + i;
        }
        return i;
      },
      // 子组件编辑/新增成功
      handleSubmitSuccess(val) {
        this.showAddOrEdit = val;
        this.getList();
      },
      rowClick(row) {
        this.$refs.mainTable.clearSelection();
        this.$refs.mainTable.toggleRowSelection(row);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleDic_combineSelectionChange(val) {
        console.log(val);
        this.dic_combinemultipleSelection = val;
        if (val.length > 0) {
          if (this.dic_setmealmultipleSelection.length > 0) {
            this.dic_setmealmultipleSelection.forEach((d) => {
              val.forEach((b) => {
                d.combineItems.forEach((c) => {
                  if (c.combinecode != b.id) {
                    this.dic_setmealmultipleSelection.splice(
                      this.dic_setmealmultipleSelection.indexOf(d),
                      1
                    );
                    this.$nextTick(() => {
                      this.$refs.setmealTable.clearSelection();
                    });
                  }
                });
              });
            });
          }
        } else {
          if (this.dic_setmealmultipleSelection.length > 0) {
            this.dic_setmealmultipleSelection = [];
            this.$nextTick(() => {
              this.$refs.setmealTable.clearSelection();
            });
          }
        }
        // else {
        //   this.$nextTick(() => {
        //     this.$refs.setmealTable.clearSelection();
        //   });
        //   this.$nextTick(() => {
        //     this.$refs.combineTable.clearSelection();
        //   });
        // }
      },
      handleDic_setmealSelectionChange(val) {
        if (val.length > 0) {
          if (val.length > 1) {
            var newRows = val.filter((it, index) => {
              if (index == val.length - 1) {
                this.$refs.setmealTable.toggleRowSelection(it, true);
                return true;
              } else {
                this.$refs.setmealTable.toggleRowSelection(it, false);
                return false;
              }
            });
            this.dic_setmealmultipleSelection = newRows;
          } else {
            this.dic_setmealmultipleSelection = val;
          }
          console.log(this.dic_setmealmultipleSelection);
          if (this.dic_combinemultipleSelection.length <= 0) {
            val.forEach((d) => {
              d.combineItems.forEach((b) => {
                this.result.combines.forEach((c) => {
                  if (c.id == b.combinecode) {
                    this.dic_combinemultipleSelection.push(c);
                  }
                });
              });
            });
            this.$nextTick(() => {
              this.$refs.combineTable.clearSelection();
            });
            this.dic_combinemultipleSelection.forEach((d) => {
              this.$nextTick(() => {
                this.$refs.combineTable.toggleRowSelection(d, true);
              });
            });
          } else {
            val.forEach((d) => {
              d.combineItems.forEach((b) => {
                this.dic_combinemultipleSelection.forEach((c) => {
                  if (c.id != b.combinecode) {
                    console.log(c.id);
                    this.dic_combinemultipleSelection.splice(
                      this.dic_combinemultipleSelection.indexOf(c),
                      1
                    );
                    this.$nextTick(() => {
                      this.$refs.combineTable.toggleRowSelection(c, false);
                    });
                  }
                });
              });
            });
            // this.dic_combinemultipleSelection.forEach((d) => {
            //   this.$nextTick(() => {
            //     this.$refs.combineTable.toggleRowSelection(d);
            //   });
            // });
            // console.log(this.dic_combinemultipleSelection);
          }
        } else {
          if (this.dic_combinemultipleSelection.length <= 0) {
            this.$nextTick(() => {
              this.$refs.combineTable.clearSelection();
            });
          }
        }
      },
  
      //关闭弹框的事件
      close() {
        this.addresetTemp();
        this.resetaddCompany_register_grouptemp();
        this.company_register_combinelistcopy = [];
      },
      chilclose() {
        this.resetaddCompany_register_grouptemp();
        this.dic_combinemultipleSelection = [];
        this.dic_setmealmultipleSelection = [];
        this.$nextTick(() => {
          this.$refs.combineTable.clearSelection();
        });
        this.$nextTick(() => {
          this.$refs.setmealTable.clearSelection();
        });
      },
      combinechange(row) {
        console.log(row);
        this.company_register_combinelistcopy = row;
      },
      companycurrentSel(e) {
        let obj = {};
        obj = this.result.companyItems.find((item) => {
          return item.id === e; //筛选出匹配数据
        });
        this.addtemp.Companyname = obj.companyname;
      },
      receptionnamecurrentSel(e) {
        let obj = {};
        obj = this.result.users.find((item) => {
          return item.account === e; //筛选出匹配数据
        });
        console.log(obj);
        this.addtemp.Receptionname = obj.name;
      },
      sexcurrentSel(e) {
        let obj = {};
        obj = this.sexarr.find((item) => {
          return item.key === e; //筛选出匹配数据
        });
        console.log(obj);
        // this.addtemp.Sex = obj.sex;
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
            "批次",
            "体检人数",
            "开始时间",
            "结束时间",
            "接待人",
            "联系人",
            "联系电话",
            "邮箱",
          ]; // 导出的表头名信息
          const filterVal = [
            "companycode",
            "companyname",
            "batch",
            "total",
            "startdate",
            "enddate",
            "receptionname",
            "contacts",
            "telephone",
            "email",
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
      marriagecurrentSel(e) {
        let obj = {};
        obj = this.marriagearr.find((item) => {
          return item.key === e; //筛选出匹配数据
        });
        console.log(obj);
        // this.addtemp.Marriage = obj.marriage;
      },
      // 成功上传文件
      upFile(res, file) {
        if (res.code == 200) {
          this.fileList = [];
          // 文件上传成功后的回调，比如一些提示信息或者页面跳转都写在这里
          console.log(res.result);
          res.result.forEach((d) => {
            var data = {
              belongApp: d.belongApp,
              belongAppId: d.belongAppId,
              createTime: d.createTime,
              createUserId: d.createUserId,
              createUserName: d.createUserName,
              deleteMark: d.deleteMark,
              description: d.description,
              enable: d.enable,
              extension: d.extension,
              fileName: d.fileName,
              filePath: d.filePath,
              fileSize: d.fileSize,
              fileType: d.fileType,
              id: d.id,
              sortCode: d.sortCode,
              name: d.fileName,
              url: this.baseImgUrl + "/" + d.filePath.replace(/\\/g, "/"),
            };
            this.fileList.push(data);
          });
        }
      },
      // 打印回调
      handlePrintStaticsBase64() {
        // companyregister
        // printStaticsBase64
        this.$refs.companyregister.$children.forEach((d) => {
          if (d.$el.innerText == "打印") {
            this.multipleSelection.forEach((k) => {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [],
                repname: "单位预约单",
                printflag: 1,
                whereitems: [
                  {
                    key: "companycode",
                    value: k.companycode,
                  },
                  {
                    key: "batch",
                    value: k.batch,
                  },
                  {
                    key: "startTime",
                    value: this.printDate[0],
                  },
                  {
                    key: "endTime",
                    value: this.printDate[1],
                  },
                ],
              };
              printStaticsBase64(data).then((res) => {
                this.lodop = getLodop();
                console.log(this.lodop, "this.lodop");
                let printname = ``;
                if (res.data[0].printname == "") {
                  printname = this.lodop.GET_PRINTER_NAME(-1);
                } else {
                  printname = res.data[0].printname;
                }
                let printObj = new LodopPrinter(null, printname);
                console.log(printObj, "printObj");
                let fileList = res.data.map((k) => {
                  return k.base64String;
                });
                printObj.printBase64PdfReport(this.lodop, fileList);
              });
            });
          }
        });
      },
      onBtnClicked: function (domId) {
        console.log(domId);
        switch (domId) {
          case "btnAdd":
            // this.handleCreate();
  
            this.addOrEdit = "add";
            this.showAddOrEdit = true;
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
            break;
          case "btnPrint":
            this.handlePrintStaticsBase64();
            break;
          case "btnClose": // 关闭当前页面
            this.handleClosePage();
            break;
          default:
            break;
        }
      },
      chilopen() {
        this.chiladddialogFormVisible = true;
        this.childialogStatus = "chilcreate";
      },
      childel() {
        if (this.company_register_combinelistcopy != "") {
          console.log(this.addtemp.Company_register_grouplist);
          console.log(this.company_register_combinelistcopy);
          console.log(this.addtemp);
          this.addtemp.Company_register_grouplist.splice(
            this.addtemp.Company_register_grouplist.indexOf(
              this.company_register_combinelistcopy
            ),
            1
          );
          this.company_register_combinelistcopy = [];
        } else {
          this.$message({
            showClose: true,
            message: "请选择要删除的分组",
            type: "error",
          });
          return;
        }
      },
      chilupd() {
        console.log(this.company_register_combinelistcopy);
        if (this.company_register_combinelistcopy != "") {
          this.addCompany_register_grouptemp =
            this.company_register_combinelistcopy;
          console.log(this.addCompany_register_grouptemp);
          if (
            this.dic_setmealmultipleSelection.length > 0 ||
            this.dic_combinemultipleSelection.length > 0
          ) {
          } else {
            console.log(this.addCompany_register_grouptemp.dic_setmeal);
            if (this.addCompany_register_grouptemp.dic_setmeal.length > 0) {
              console.log(this.addCompany_register_grouptemp.dic_setmeal);
              this.dic_setmealmultipleSelection =
                this.addCompany_register_grouptemp.dic_setmeal;
              this.dic_setmealmultipleSelection.forEach((d) => {
                console.log(d);
                this.$nextTick(() => {
                  this.$refs.setmealTable.toggleRowSelection(d);
                });
              });
            } else if (
              this.addCompany_register_grouptemp.dic_setmeal.length <= 0 &&
              this.addCompany_register_grouptemp.dic_combine.length > 0
            ) {
              this.dic_combinemultipleSelection =
                this.addCompany_register_grouptemp.dic_combine;
              console.log(this.addCompany_register_grouptemp.dic_combine);
              this.dic_combinemultipleSelection.forEach((d) => {
                console.log(d);
                this.$nextTick(() => {
                  this.$refs.combineTable.toggleRowSelection(d);
                });
              });
            } else {
              this.$nextTick(() => {
                this.$refs.combineTable.clearSelection();
              });
              this.$nextTick(() => {
                this.$refs.setmealTable.clearSelection();
              });
            }
          }
          this.chiladddialogFormVisible = true;
  
          this.childialogStatus = "chilupdate";
        } else {
          this.$message({
            showClose: true,
            message: "请选择分组",
            type: "error",
          });
          return;
        }
      },
      getList() {
        this.listLoading = true;
        this.listQuery.whereitems = [];
        if (this.searchWord) {
          this.listQuery.whereitems.push({
            key: "CompanyName",
            value: this.searchWord,
          });
        }
        if (this.queryDate && this.queryDate.length != 0) {
          this.listQuery.whereitems.push({
            key: "RegisterTimeBegin",
            value: this.queryDate[0],
          });
          this.listQuery.whereitems.push({
            key: "RegisterTimeEnd",
            value: this.queryDate[1],
          });
        }
        company_register.getList(this.listQuery).then((res) => {
          this.list = res.data;
          this.total = res.count;
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
          Regid: "",
          Hospitalcode: "",
          Registername: "",
          Companycode: "",
          Companyname: "",
          Batch: "",
          Startdate: "",
          Enddate: "",
          Total: "",
          Contacts: "",
          Telephone: "",
          files: [],
          Faxnumber: "",
          Email: "",
          Address: "",
          ContractNo: "",
          Contractname: "",
          Receptioncode: "",
          Receptionname: "",
          Remark: "",
          Registerdate: "",
          Registercode: "",
          Registername: "",
          delflag: 0,
          Company_register_grouplist: [],
          Meccode: "",
        };
      },
      addresetTemp() {
        this.addtemp = {
          Regid: "",
          Hospitalcode: "",
          Registername: "",
          Companycode: "",
          Companyname: "",
          Batch: "",
          Startdate: "",
          Enddate: "",
          Total: "",
          Contacts: "",
          Telephone: "",
          files: [],
          Faxnumber: "",
          Email: "",
          Address: "",
          ContractNo: "",
          Contractname: "",
          Receptioncode: "",
          Receptionname: "",
          Remark: "",
          Registerdate: "",
          Registercode: "",
          Registername: "",
          delflag: 0,
          Company_register_grouplist: [],
          Meccode: "",
        };
      },
      resetaddCompany_register_grouptemp() {
        this.addCompany_register_grouptemp = {
          Groupid: "",
          Regid: "",
          Groupcode: "",
          Groupname: "",
          Priority: "",
          Sex: "",
          Minage: "",
          Maxage: "",
          Marriage: "",
          Groupmark: "",
          Grouptotal: "",
          Department: "",
          Setmealcode: "",
          Setmealname: "",
          Originalprice: "",
          Discount: "",
          Discountprice: "",
          Settlementtype: "",
          Addsettlementtype: "",
          AddDiscount: "",
          Remark: "",
          Operatordate: "",
          CombineItems: [],
          Operatorcode: "",
          Operatorname: "",
          dic_setmeal: null,
          dic_combine: null,
          sexname: "",
        };
      },
      resetCompany_register_grouptemp() {
        this.Company_register_grouptemp = {
          Groupid: "",
          Regid: "",
          Groupcode: "",
          Groupname: "",
          Priority: "",
          Sex: "",
          Minage: "",
          Maxage: "",
          Marriage: "",
          Groupmark: "",
          Grouptotal: "",
          Department: "",
          Setmealcode: "",
          Setmealname: "",
          Originalprice: "",
          Discount: "",
          Discountprice: "",
          Settlementtype: "",
          Addsettlementtype: "",
          AddDiscount: "",
          Remark: "",
          Operatordate: "",
          CombineItems: [],
          Operatorcode: "",
          Operatorname: "",
          dic_setmeal: null,
          dic_combine: null,
          sexname: "",
        };
      },
      handleCreate() {
        // 弹出添加框
        this.previewVisible = true;
        this.dialogStatus = "create";
        this.adddialogFormVisible = true;
        company_register.getDetail(this.regid).then((response) => {
          this.result = response.result;
          console.log(this.result);
        });
        if (this.$store.state.user.account != "") {
          this.addtemp.Registercode = this.$store.state.user.name;
        } else {
          this.addtemp.Registercode = this.$store.state.user.account;
        }
        if (this.$store.state.user.realname != "") {
          this.addtemp.Registername = this.$store.state.user.realname;
        } else {
          this.addtemp.Registername = this.$store.state.user.name;
        }
        console.log(this.addtemp.Registercode);
        console.log(this.addtemp.Registername);
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      Company_register_grouptempcreateData() {
        console.log(this.regid);
        this.addCompany_register_grouptemp.dic_setmeal =
          this.dic_setmealmultipleSelection;
        this.addCompany_register_grouptemp.dic_combine =
          this.dic_combinemultipleSelection;
        if (this.dic_setmealmultipleSelection.length > 0) {
          this.dic_combinemultipleSelection.forEach((d) => {
            var Discountprice = 0;
            if (this.addCompany_register_grouptemp.Discount == "") {
              Discountprice = d.price;
            } else {
              Discountprice =
                d.price * this.addCompany_register_grouptemp.Discount;
            }
            this.addCompany_register_grouptemp.Setmealname =
              this.dic_setmealmultipleSelection[0].name;
            var datatemp = {
              regcomid: "",
              groupid: "",
              setmealcode: this.dic_setmealmultipleSelection[0].id,
              setmealname: this.dic_setmealmultipleSelection[0].name,
              deptcode: d.deptcode,
              combinecode: d.id,
              combinename: d.name,
              originalprice: d.price,
              Discount: this.addCompany_register_grouptemp.Discount,
              Discountprice: Discountprice,
            };
            this.addCompany_register_grouptemp.CombineItems.push(datatemp);
          });
        } else {
          this.dic_combinemultipleSelection.forEach((d) => {
            var Discountprice = 0;
            if (this.addCompany_register_grouptemp.Discount == "") {
              Discountprice = d.price;
            } else {
              Discountprice =
                d.price * this.addCompany_register_grouptemp.Discount;
            }
            var datatemp = {
              regcomid: "",
              groupid: "",
              setmealcode: "",
              setmealname: "",
              deptcode: d.deptcode,
              combinecode: d.id,
              combinename: d.name,
              originalprice: d.price,
              Discount: this.addCompany_register_grouptemp.Discount,
              Discountprice: Discountprice,
            };
            this.addCompany_register_grouptemp.CombineItems.push(datatemp);
          });
        }
        if (
          this.addCompany_register_grouptemp.CombineItems.length <= 0 ||
          this.addCompany_register_grouptemp.CombineItems == "" ||
          this.addCompany_register_grouptemp.CombineItems == null ||
          this.addCompany_register_grouptemp.CombineItems == undefined
        ) {
          return this.$message.warning("请添加套餐或组合");
        }
        this.addtemp.Company_register_grouplist.push(
          this.addCompany_register_grouptemp
        );
  
        this.addCompany_register_grouptemp.Regid = this.addtemp.Regid;
        this.company_register_combinelistcopy =
          this.addCompany_register_grouptemp;
  
        this.chiladddialogFormVisible = false;
        this.dic_combinemultipleSelection = [];
        this.dic_setmealmultipleSelection = [];
  
        this.$nextTick(() => {
          this.$refs.combineTable.clearSelection();
        });
        this.$nextTick(() => {
          this.$refs.setmealTable.clearSelection();
        });
        this.resetaddCompany_register_grouptemp();
      },
      Company_register_grouptempupdateData() {
        this.addCompany_register_grouptemp.dic_setmeal =
          this.dic_setmealmultipleSelection;
        this.addCompany_register_grouptemp.dic_combine =
          this.dic_combinemultipleSelection;
        this.addtemp.Company_register_grouplist.splice(
          this.addtemp.Company_register_grouplist.indexOf(
            this.addCompany_register_grouptemp
          ),
          1
        );
        if (
          this.addCompany_register_grouptemp.CombineItems.length <= 0 ||
          this.addCompany_register_grouptemp.CombineItems == "" ||
          this.addCompany_register_grouptemp.CombineItems == null ||
          this.addCompany_register_grouptemp.CombineItems == undefined
        ) {
          return this.$message.warning("请添加套餐或组合");
        }
        this.addCompany_register_grouptemp.CombineItems = [];
        if (this.dic_setmealmultipleSelection.length <= 0) {
          this.addCompany_register_grouptemp.Setmealname = "";
          if (this.dic_combinemultipleSelection.length > 0) {
            var temp = [];
            console.log(this.dic_combinemultipleSelection);
            this.dic_combinemultipleSelection.forEach((d) => {
              var Discountprice = 0;
              if (this.addCompany_register_grouptemp.Discount == "") {
                Discountprice = d.price;
              } else {
                Discountprice =
                  d.price * this.addCompany_register_grouptemp.Discount;
              }
              var datatemp = {
                regcomid: "",
                groupid: this.addCompany_register_grouptemp.Groupid,
                setmealcode: "",
                setmealname: "",
                deptcode: d.deptcode,
                combinecode: d.id,
                combinename: d.name,
                originalprice: d.price,
                discount: this.addCompany_register_grouptemp.Discount,
                discountprice: Discountprice,
              };
              console.log(this.addCompany_register_grouptemp.CombineItems);
              console.log(datatemp.combinecode);
  
              temp.push(datatemp);
              this.addCompany_register_grouptemp.CombineItems = temp;
              // this.addCompany_register_grouptemp.CombineItems = [];
              // this.addCompany_register_grouptemp.CombineItems = datatemp;
              // if (this.addCompany_register_grouptemp.CombineItems.length > 0) {
              //   this.addCompany_register_grouptemp.CombineItems.forEach((c) => {
              //     this.addCompany_register_grouptemp.CombineItems.splice(
              //       this.addCompany_register_grouptemp.CombineItems.indexOf(c),
              //       1
              //     );
  
              //     // this.addCompany_register_grouptemp.CombineItems.push(datatemp);
              //     // if (c.combinecode == datatemp.combinecode) {
              //     //   // this.addCompany_register_grouptemp.CombineItems = [];
              //     //   // this.addCompany_register_grouptemp.CombineItems.push(
              //     //   //   datatemp
              //     //   // );
  
              //     // } else {
              //     //   this.addCompany_register_grouptemp.CombineItems.push(
              //     //     datatemp
              //     //   );
              //     // }
              //   });
              // } else {
              //   this.addCompany_register_grouptemp.CombineItems.push(datatemp);
              // }
            });
          } else {
            this.addCompany_register_grouptemp.CombineItems = [];
            this.addCompany_register_grouptemp.dic_setmeal = [];
            this.addCompany_register_grouptemp.dic_combine = [];
          }
        } else {
          this.addCompany_register_grouptemp.Setmealcode =
            this.dic_setmealmultipleSelection[0].id;
          this.addCompany_register_grouptemp.Setmealname =
            this.dic_setmealmultipleSelection[0].name;
          if (this.dic_combinemultipleSelection.length > 0) {
            var temp = [];
            this.dic_combinemultipleSelection.forEach((d) => {
              var Discountprice = 0;
              if (this.addCompany_register_grouptemp.Discount == "") {
                Discountprice = d.price;
              } else {
                Discountprice =
                  d.price * this.addCompany_register_grouptemp.Discount;
              }
              var datatemp = {
                regcomid: "",
                groupid: this.addCompany_register_grouptemp.Groupid,
                setmealcode: this.dic_setmealmultipleSelection[0].id,
                setmealname: this.dic_setmealmultipleSelection[0].name,
                deptcode: d.deptcode,
                combinecode: d.id,
                combinename: d.name,
                originalprice: d.price,
                discount: this.addCompany_register_grouptemp.Discount,
                discountprice: Discountprice,
              };
              console.log(this.addCompany_register_grouptemp.CombineItems);
              // var temp = [];
              temp.push(datatemp);
              // this.addCompany_register_grouptemp.CombineItems = [];
              this.addCompany_register_grouptemp.CombineItems.push(datatemp);
              // if (this.addCompany_register_grouptemp.CombineItems.length > 0) {
              //   var temp = [];
              //   this.addCompany_register_grouptemp.CombineItems.forEach((c) => {
              //     this.addCompany_register_grouptemp.CombineItems.splice(
              //       this.addCompany_register_grouptemp.CombineItems.indexOf(c),
              //       1
              //     );
              //     temp.push(datatemp);
              //     this.addCompany_register_grouptemp.CombineItems.push(datatemp);
              //     // if (c.combinecode == datatemp.combinecode) {
              //     //   this.addCompany_register_grouptemp.CombineItems.splice(
              //     //     this.addCompany_register_grouptemp.CombineItems.indexOf(c),
              //     //     1
              //     //   );
              //     //   this.addCompany_register_grouptemp.CombineItems.push(
              //     //     datatemp
              //     //   );
              //     //   // this.addCompany_register_grouptemp.CombineItems = [];
              //     //   // this.addCompany_register_grouptemp.CombineItems.push(
              //     //   //   datatemp
              //     //   // );
              //     // } else {
              //     //   this.addCompany_register_grouptemp.CombineItems.push(
              //     //     datatemp
              //     //   );
              //     // }
              //   });
              // } else {
              //   this.addCompany_register_grouptemp.CombineItems.push(datatemp);
              // }
            });
          } else {
            this.addCompany_register_grouptemp.CombineItems = [];
          }
        }
        if (
          this.addCompany_register_grouptemp.CombineItems.length <= 0 ||
          this.addCompany_register_grouptemp.CombineItems == "" ||
          this.addCompany_register_grouptemp.CombineItems == null ||
          this.addCompany_register_grouptemp.CombineItems == undefined
        ) {
          return this.$message.warning("请添加套餐或组合");
        }
        this.company_register_combinelistcopy =
          this.addCompany_register_grouptemp;
        this.addtemp.Company_register_grouplist.push(
          this.company_register_combinelistcopy
        );
        console.log(this.company_register_combinelistcopy);
        this.dic_combinemultipleSelection = [];
        this.dic_setmealmultipleSelection = [];
        this.$nextTick(() => {
          this.$refs.combineTable.clearSelection();
        });
        this.$nextTick(() => {
          this.$refs.setmealTable.clearSelection();
        });
        this.resetaddCompany_register_grouptemp();
        this.chiladddialogFormVisible = false;
      },
      createData() {
        console.log(this.addtemp);
        if (
          this.addtemp.Company_register_grouplist.length <= 0 ||
          this.addtemp.Company_register_grouplist == "" ||
          this.addtemp.Company_register_grouplist == null ||
          this.addtemp.Company_register_grouplist == undefined
        ) {
          return this.$message.warning("请添加分组");
        }
        // var CompanyRegisterVM = {
        //   Regid: this.addtemp.Regid,
        //   Hospitalcode: this.addtemp.Hospitalcode,
        //   Meccode: "B10001",
        //   Companycode: this.addtemp.Companycode,
        //   Companyname: this.addtemp.Companyname,
        //   Batch: this.addtemp.Batch,
        //   Startdate: this.addtemp.Startdate,
        //   Enddate: this.addtemp.Enddate,
        //   Total: this.addtemp.Total,
        //   Contacts: this.addtemp.Contacts,
        //   Telephone: this.addtemp.Telephone,
        //   Faxnumber: this.addtemp.Faxnumber,
        //   Email: this.addtemp.Email,
        //   Address: this.addtemp.Address,
        //   ContractNo: this.addtemp.ContractNo,
        //   Contractname: this.addtemp.Contractname,
        //   Receptioncode: this.addtemp.Receptioncode,
        //   Receptionname: this.addtemp.Receptionname,
        //   Remark: this.addtemp.Remark,
        //   Registerdate: this.addtemp.Registerdate,
        //   Registercode: this.addtemp.Registercode,
        //   Registername: this.addtemp.Registername,
        //   FileId: this.addtemp.FileId,
        // };
        var CompanyRegisterVM = {
          Regid: this.addtemp.Regid,
          Hospitalcode: this.addtemp.Hospitalcode,
          Meccode: this.addtemp.Meccode,
          Companycode: this.addtemp.Companycode,
          Companyname: this.addtemp.Companyname,
          Batch: this.addtemp.Batch,
          Startdate: this.addtemp.Startdate,
          Enddate: this.addtemp.Enddate,
          Total: this.addtemp.Total,
          Contacts: this.addtemp.Contacts,
          Telephone: this.addtemp.Telephone,
          Faxnumber: this.addtemp.Faxnumber,
          Email: this.addtemp.Email,
          Address: this.addtemp.Address,
          ContractNo: this.addtemp.ContractNo,
          Contractname: this.addtemp.Contractname,
          Receptioncode: this.addtemp.Receptioncode,
          Receptionname: this.addtemp.Receptionname,
          Remark: this.addtemp.Remark,
          Registerdate: this.addtemp.Registerdate,
          Registercode: this.addtemp.Registercode,
          Registername: this.addtemp.Registername,
          FileId: this.addtemp.FileId,
        };
        var GroupItems = [];
        var aData = new Date();
  
        this.addtemp.Company_register_grouplist.forEach((d) => {
          console.log(d);
          var CompanyRegisterGroupVM = {
            Groupid: d.Groupid,
            Regid: d.Regid,
            Groupcode: d.Groupcode,
            Groupname: d.Groupname,
            Priority: d.Priority,
            Sex: d.Sex,
            Minage: d.Minage,
            Maxage: d.Maxage,
            Marriage: d.Marriage,
            Groupmark: d.Groupmark,
            Grouptotal: d.Grouptotal,
            Department: d.Department,
            Setmealcode: d.Setmealcode,
            Setmealname: d.Setmealname,
            Originalprice: d.Originalprice,
            Discount: d.Discount,
            Discountprice: d.Discountprice,
            Settlementtype: d.Settlementtype,
            Addsettlementtype: d.Addsettlementtype,
            AddDiscount: d.AddDiscount,
            Remark: d.Remark,
            Operatordate: aData,
            Operatorcode: this.addtemp.Registercode,
            Operatorname: this.addtemp.Registername,
            CombineItems: d.CombineItems,
          };
  
          GroupItems.push(CompanyRegisterGroupVM);
        });
        var CompanyRegisterItemVM = {
          MainItem: CompanyRegisterVM,
          GroupItems: GroupItems,
        };
  
        //保存提交
        this.$refs["dataForm"].validate((valid) => {
          company_register.add(CompanyRegisterItemVM).then(() => {
            this.getList();
  
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
          });
          this.$nextTick(() => {
            this.$refs.combineTable.clearSelection();
          });
          this.$nextTick(() => {
            this.$refs.setmealTable.clearSelection();
          });
          this.resetaddCompany_register_grouptemp();
          this.addresetTemp();
          this.chiladddialogFormVisible = false;
          this.adddialogFormVisible = false;
          this.$refs["dataForm"].clearValidate();
          this.$refs["groupdataForm"].clearValidate();
        });
      },
      handleRemove(file, fileList) {
        var data = [];
        data.push(file.id);
        uploadFiles.del(data).then(() => {});
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(
          `当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
            files.length + fileList.length
          } 个文件`
        );
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${file.name}？`);
      },
      handleUpdate(row) {
        this.addOrEdit = "edit";
        this.editObj = Object.assign({}, row);
        this.showAddOrEdit = true; // 打开编辑页面
        return;
        console.log(row);
        var reg = {
          regid: row.regid,
        };
        company_register.getDetail(reg).then((response) => {
          this.result = response.result;
          console.log(this.result);
          this.result.uploadFile.forEach((d) => {
            var data = {
              belongApp: d.belongApp,
              belongAppId: d.belongAppId,
              createTime: d.createTime,
              createUserId: d.createUserId,
              createUserName: d.createUserName,
              deleteMark: d.deleteMark,
              description: d.description,
              enable: d.enable,
              extension: d.extension,
              fileName: d.fileName,
              filePath: d.filePath,
              fileSize: d.fileSize,
              fileType: d.fileType,
              id: d.id,
              sortCode: d.sortCode,
              name: d.fileName,
              url: this.baseImgUrl + "/" + d.filePath.replace(/\\/g, "/"),
            };
            this.fileList.push(data);
          });
  
          this.addtemp = {
            Regid: this.result.register.bodyItem.regid,
            Hospitalcode: this.result.register.bodyItem.hospitalcode,
            Registername: this.result.register.bodyItem.registername,
            Companycode: this.result.register.bodyItem.companycode,
            Companyname: this.result.register.bodyItem.companyname,
            Batch: this.result.register.bodyItem.batch,
            Startdate: this.result.register.bodyItem.startdate,
            Enddate: this.result.register.bodyItem.enddate,
            Total: this.result.register.bodyItem.total,
            Contacts: this.result.register.bodyItem.contacts,
            Telephone: this.result.register.bodyItem.telephone,
            Faxnumber: this.result.register.bodyItem.faxnumber,
            Email: this.result.register.bodyItem.email,
            Address: this.result.register.bodyItem.address,
            ContractNo: this.result.register.bodyItem.contractNo,
            Contractname: this.result.register.bodyItem.contractname,
            Receptioncode: this.result.register.bodyItem.receptioncode,
            Receptionname: this.result.register.bodyItem.receptionname,
            Remark: this.result.register.bodyItem.remark,
            Registerdate: this.result.register.bodyItem.registerdate,
            Registercode: this.result.register.bodyItem.registercode,
            Registername: this.result.register.bodyItem.registername,
            delflag: this.result.register.bodyItem.delflag,
            Company_register_grouplist: [],
            Meccode: this.result.register.bodyItem.meccode,
          };
          var GroupItems = [];
          this.result.register.groupItems.forEach((d) => {
            var CompanyRegisterGroupVM = {
              Groupid: d.groupItem.groupid,
              Regid: d.groupItem.regid,
              Groupcode: d.groupItem.groupcode,
              Groupname: d.groupItem.groupname,
              Priority: d.groupItem.priority,
              Sex: d.groupItem.sex,
              Minage: d.groupItem.minage,
              Maxage: d.groupItem.maxage,
              Marriage: d.groupItem.marriage,
              Groupmark: d.groupItem.groupmark,
              Grouptotal: d.groupItem.grouptotal,
              Department: d.groupItem.department,
              Setmealcode: d.groupItem.setmealcode,
              Setmealname: d.groupItem.setmealname,
              Originalprice: d.groupItem.originalprice,
              Discount: d.groupItem.discount,
              Discountprice: d.groupItem.discountprice,
              Settlementtype: d.groupItem.settlementtype,
              Addsettlementtype: d.groupItem.addsettlementtype,
              AddDiscount: d.groupItem.adddiscount,
              Remark: d.groupItem.remark,
              Operatordate: d.groupItem.Operatordate,
              Operatorcode: d.groupItem.Operatorcode,
              Operatorname: d.groupItem.Operatorname,
              CombineItems: [],
              dic_setmeal: [],
              dic_combine: [],
            };
            d.combineItems.forEach((z) => {
              if (CompanyRegisterGroupVM.Groupid == z.groupid) {
                CompanyRegisterGroupVM.CombineItems.push(z);
              }
            });
            this.result.setmeal.forEach((x) => {
              CompanyRegisterGroupVM.CombineItems.forEach((c) => {
                if (c.setmealcode == x.id) {
                  CompanyRegisterGroupVM.dic_setmeal.push(x);
                }
              });
            });
            this.result.combines.forEach((x) => {
              CompanyRegisterGroupVM.CombineItems.forEach((c) => {
                if (c.combinecode == x.id) {
                  CompanyRegisterGroupVM.dic_combine.push(x);
                }
              });
            });
  
            this.addtemp.Company_register_grouplist.push(CompanyRegisterGroupVM);
          });
          console.log(this.addtemp);
        });
  
        this.dialogStatus = "update";
  
        this.adddialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      },
      updateData() {
        console.log(this.addtemp);
        var CompanyRegisterVM = {
          Regid: this.addtemp.Regid,
          Hospitalcode: this.addtemp.Hospitalcode,
          Meccode: this.addtemp.Meccode,
          Companycode: this.addtemp.Companycode,
          Companyname: this.addtemp.Companyname,
          Batch: this.addtemp.Batch,
          Startdate: this.addtemp.Startdate,
          Enddate: this.addtemp.Enddate,
          Total: this.addtemp.Total,
          Contacts: this.addtemp.Contacts,
          Telephone: this.addtemp.Telephone,
          Faxnumber: this.addtemp.Faxnumber,
          Email: this.addtemp.Email,
          Address: this.addtemp.Address,
          ContractNo: this.addtemp.ContractNo,
          Contractname: this.addtemp.Contractname,
          Receptioncode: this.addtemp.Receptioncode,
          Receptionname: this.addtemp.Receptionname,
          Remark: this.addtemp.Remark,
          Registerdate: this.addtemp.Registerdate,
          Registercode: this.addtemp.Registercode,
          Registername: this.addtemp.Registername,
          FileId: this.addtemp.FileId,
        };
        var GroupItems = [];
        var aData = new Date();
        this.addtemp.Company_register_grouplist.forEach((d) => {
          console.log(d);
          var CompanyRegisterGroupVM = {
            Groupid: d.Groupid,
            Regid: d.Regid,
            Groupcode: d.Groupcode,
            Groupname: d.Groupname,
            Priority: d.Priority,
            Sex: d.Sex,
            Minage: d.Minage,
            Maxage: d.Maxage,
            Marriage: d.Marriage,
            Groupmark: d.Groupmark,
            Grouptotal: d.Grouptotal,
            Department: d.Department,
            Setmealcode: d.Setmealcode,
            Setmealname: d.Setmealname,
            Originalprice: d.Originalprice,
            Discount: d.Discount,
            Discountprice: d.Discountprice,
            Settlementtype: d.Settlementtype,
            Addsettlementtype: d.Addsettlementtype,
            AddDiscount: d.AddDiscount,
            Remark: d.Remark,
            Operatordate: aData,
            Operatorcode: this.addtemp.Registercode,
            Operatorname: this.addtemp.Registername,
            CombineItems: d.CombineItems,
          };
  
          GroupItems.push(CompanyRegisterGroupVM);
        });
        var CompanyRegisterItemVM = {
          MainItem: CompanyRegisterVM,
          GroupItems: GroupItems,
        };
        console.log(CompanyRegisterItemVM);
        this.$refs["dataForm"].validate((valid) => {
          company_register.update(CompanyRegisterItemVM).then(() => {
            this.getList();
            this.adddialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
          });
  
          this.dic_combinemultipleSelection = [];
          this.dic_setmealmultipleSelection = [];
          this.$nextTick(() => {
            this.$refs.combineTable.clearSelection();
          });
          this.$nextTick(() => {
            this.$refs.setmealTable.clearSelection();
          });
          this.resetaddCompany_register_grouptemp();
          this.addresetTemp();
          this.$refs["dataForm"].clearValidate();
          this.$refs["groupdataForm"].clearValidate();
        });
        //  company_register.update(tempData).then(() => {
        //   for (const v of this.list.data) {
        //     if (v.id === this.temp.id) {
        //       const index = this.list.data.indexOf(v);
        //       this.list.data.splice(index, 1, this.temp);
        //       break;
        //     }
        //   }
        // // 更新提交
        // this.temp.formid = this.formid;
        // this.$refs["dataForm"].validate((valid) => {
        //   if (valid) {
        //     const tempData = Object.assign({}, this.temp);
        //     if (
        //       this.formid != "" &&
        //       this.formid != undefined &&
        //       this.formid != null
        //     ) {
        //       this.$refs.updateForm
        //         .getData()
        //         .then((data) => {
        //           tempData.jsondata = JSON.stringify(data);
        //         })
        //         .catch(() => {
        //           this.$refs.formPreview.end();
        //         });
        //     }
        //     company_register.update(tempData).then(() => {
        //       for (const v of this.list.data) {
        //         if (v.id === this.temp.id) {
        //           const index = this.list.data.indexOf(v);
        //           this.list.data.splice(index, 1, this.temp);
        //           break;
        //         }
        //       }
        //       this.adddialogFormVisible = false;
        //       this.$notify({
        //         title: "成功",
        //         message: "更新成功",
        //         type: "success",
        //         duration: 2000,
        //       });
        //       this.getList();
        //     });
        //   }
        // });
      },
      handleDelete(rows) {
        // 多行删除
        this.delrows(company_register, rows);
      },
    },
    beforeRouteLeave: function (to, from, next) {
      this.showAddOrEdit = false;
      next();
    },
  };
  </script>
  <style lang="scss" scoped>
  .dialog-mini .el-select {
    width: 100%;
  }
  /deep/.el-upload-list__item.is-success.focusing .el-icon-close-tip {
    　　display: none !important;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  
  .button {
    padding: 0;
    float: right;
  }
  
  .image {
    width: 100%;
    display: block;
  }
  
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  
  @import "./css/qyzyy.scss";
  </style>
  