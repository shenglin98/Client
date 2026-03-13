<template>
  <div class="setdictionary-wrap">
    <div class="setdictionary-box">
      <div class="setdictionary-container flex-row">
        <div style="border-right: 1px solid #ccc">
          <el-card shadow="never" class="body-small setdictionary-menu-card">
            <el-tree node-key="id" :highlight-current="true" @node-click="handleNodeClick" :default-checked-keys="defaultChecked" :data="setdictionaryTypes" :expand-on-click-node="false" default-expand-all :props="setdictionaryTypeProps">
              <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                <span><i class="el-icon-menu" style="margin-right: 10px"></i>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-card>
        </div>
        <el-main class="setdictionary-content flex-item">
          <div class="btnBoxClas">
            <div class="form_box">
              <!-- -->
              <el-form ref="searchform" :model="searchform" :inline="true">
                <el-row>
                  <el-col :span="4">
                    <el-form-item label="操作人" label-width="80px">
                      <el-select class="filter-item" v-model="searchform.createperson" placeholder="选择操作人" clearable style="width: 100%" size="mini">
                        <el-option v-for="item in createpersonOptions" :key="item.id" :label="item.name" :value="item.account">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-form-item clearable v-show="
                        listQuery.tableName !== 'serum' &&
                        listQuery.tableName !== 'electrocardiogram' &&
                        listQuery.tableName !== 'blutabnahme'
                      " label="体检号" label-width="80px">
                      <el-input v-model="searchform.regid" size="mini" clearable placeholder="体检号"></el-input> </el-form-item></el-col>
                  <el-col :span="4">
                    <el-form-item v-show="
                        listQuery.tableName !== 'serum' &&
                        listQuery.tableName !== 'electrocardiogram' &&
                        listQuery.tableName !== 'blutabnahme'
                      " clearable label="客户姓名" label-width="100px">
                      <el-input v-model="searchform.name" size="mini" placeholder="客户姓名" clearable style="width: 100%"></el-input> </el-form-item></el-col>
                  <el-col :span="6" v-if="
                      listQuery.tableName !== 'deskilling' &&
                      listQuery.tableName !== 'recheck'
                    ">
                    <el-form-item label="时间范围" label-width="100px">
                      <el-date-picker v-model="searchform.date" size="mini" style="width: 100%" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker> </el-form-item></el-col>
                  <el-col :span="6">
                    <el-form-item label="总检时间" v-if="
                        listQuery.tableName == 'deskilling' ||
                        listQuery.tableName == 'recheck'
                      " label-width="80px">
                      <el-date-picker v-model="searchform.date2" size="mini" style="width: 100%" type="daterange" value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <template v-if="listQuery.tableName == 'deskilling'">
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="转诊指引" label-width="80px">
                        <el-input placeholder="转诊指引" v-model="searchform.transferguide" size="mini" clearable>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="带诊" label-width="80px">
                        <el-input placeholder="带诊" v-model="searchform.guahao" size="mini">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="状态" label-width="80px">
                        <el-select placeholder="状态" v-model="searchform.transferstatus" size="mini" clearable style="width: 100%">
                          <el-option label="未转诊" :value="0"></el-option>
                          <el-option label="已转诊" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="回访" label-width="80px">
                        <el-input placeholder="回访" v-model="searchform.dengji" size="mini" clearable style="width: 100%">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
                <template v-if="listQuery.tableName == 'recheck'">
                  <el-row>
                    <el-col :span="4">
                      <el-form-item label="复检指导" label-width="80px">
                        <el-input placeholder="复检指导" v-model="searchform.fujianguide" size="mini" clearable>
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="开单" label-width="80px">
                        <el-input placeholder="开单" v-model="searchform.registerpersonname" size="mini">
                        </el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="状态" label-width="80px">
                        <el-select placeholder="状态" v-model="searchform.repeatstatus" size="mini" clearable style="width: 100%">
                          <el-option label="未转诊" :value="0"></el-option>
                          <el-option label="已转诊" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="4">
                      <el-form-item label="回访" label-width="80px">
                        <el-input placeholder="回访" v-model="searchform.backvisit" size="mini" clearable style="width: 100%">
                        </el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                </template>
              </el-form>
            </div>
            <div class="filter-container" style="white-space: nowrap; overflow-x: none">
              <template v-for="btn of typesBtns">
                <el-button v-bind:key="btn.Id" :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-if="
                    listQuery.tableName !== 'deskilling' &&
                    listQuery.tableName !== 'recheck' &&
                    listQuery.tableName !== 'special' &&
                    btn.domId !== 'btnExport'
                  " class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>

                <el-button v-bind:key="btn.Id" :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-else-if="
                    (listQuery.tableName == 'deskilling' ||
                      listQuery.tableName == 'recheck') &&
                    (btn.domId == 'btnSearch' || btn.domId == 'btnExport')
                  " class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
                <el-button v-bind:key="btn.Id" :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-else-if="
                    listQuery.tableName == 'special' && btn.domId == 'btnSearch'
                  " class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
              </template>
            </div>
          </div>
          <template v-if="
              listQuery.tableName != 'deskilling' &&
              listQuery.tableName != 'recheck' &&
              listQuery.tableName != 'special'
            ">
            <el-table height="calc(100% - 80px)" ref="serum" :key="tableKey" :data="allData" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :cell-style="{ padding: '0' }">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="executname" label="执行人">
              </el-table-column>
              <el-table-column label="数量" prop="executnum"> </el-table-column>
              <el-table-column label="统计类型" v-if="listQuery.tableName == 'reportEntry'" prop="billingtype">
                <template v-slot="params">
                  <span>{{ params.row.billingtype }}</span>
                </template>
              </el-table-column>
              <el-table-column label="时间">
                <template v-slot="params">
                  <span>{{ params.row.executtime.split(" ")[0] }}</span>
                </template>
              </el-table-column>
              <el-table-column v-if="this.listQuery.tableName == 'billing'" label="开单类型" prop="billingtype">
              </el-table-column>
              <el-table-column label="操作人" prop="createpersonname">
              </el-table-column>
              <el-table-column label="修改人" prop="lastpersonname">
              </el-table-column>
              <el-table-column label="操作" width="150px">
                <template v-slot="params">
                  <!-- <el-button size="mini">修改</el-button> -->
                  <el-button size="mini" type="danger" @click="handleAllDataDelete(params.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-if="listQuery.tableName == 'deskilling'">
            <el-table height="calc(100% - 80px)" ref="deskilling" :key="'1'" :data="deskillingData" fit style="width: 100%" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
              <el-table-column type="selection"> </el-table-column>
              <el-table-column label="客户姓名" prop="name" width="80px">
              </el-table-column>
              <el-table-column label="性别" prop="sex" width="70px">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="年龄" prop="age" width="70px">
              </el-table-column>
              <el-table-column label="电话" prop="telephone" width="120px">
              </el-table-column>
              <el-table-column label="审核" prop="checkname" width="90px"></el-table-column>
              <el-table-column label="体检时间" prop="regdate" width="160px"></el-table-column>
              <el-table-column label="转诊原因" show-overflow-tooltip width="200px">
                <template v-slot="params">
                  <el-popover placement="right" title="异常结果" width="490" trigger="manual" v-model="PopoverFlag[params.row.regid]">
                    <el-table :data="abnormalDetailData_deskilling" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" v-loading="Showloading" height="300px">
                      <el-table-column width="200" property="conclusion" label="异常名称" show-overflow-tooltip></el-table-column>
                      <el-table-column width="160" label="异常期限">
                        <template v-slot="params">
                          <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                          <el-input size="mini" v-model="params.row.conclusionname" placeholder="异常期限"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column width="100" label="是否完成">
                        <template v-slot="params">
                          <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                          <el-checkbox :true-label="1" :false-label="0" v-model="params.row.status"></el-checkbox>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                    <el-button size="mini" type="primary" @click="handlePopoverHide_deskilling(params.row)">保 存</el-button>
                    <el-button size="mini" type="primary" @click="handleClose(params.row)">关 闭</el-button>
                    <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                    <div slot="reference" @click="handlePopoverShow_deskilling(params.row)" style="cursor: pointer">
                      {{ params.row.conclusions }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="回访记录" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.followinfo" placeholder="回访记录" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="转诊科室" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-select size="mini" multiple v-model="params.row.department" placeholder="请选择转诊科室" clearable>
                    <el-option v-for="item in departmentData" :key="item.code" :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="转诊指导" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.transferguide" placeholder="转诊指导" size="mini" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="带诊" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.guahao" placeholder="带诊" size="mini" clearable></el-input>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="transferstatus" width="120px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-select v-model="params.row.transferstatus" placeholder="请选择" size="mini" style="width: 100%" clearable>
                    <el-option label="未转诊" :value="0"></el-option>
                    <el-option label="已转诊" :value="1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="回访" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.dengji" placeholder="回访" size="mini"></el-input>
                </template>
              </el-table-column>

              <el-table-column label="操作人" width="85px" prop="createpersonname">
              </el-table-column>
              <el-table-column label="修改人" prop="lastpersonname" width="85px"></el-table-column>
              <el-table-column label="操作" width="90px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-button size="mini" type="primary" @click="handledeskillingSubmit(params.row)">保存</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-if="listQuery.tableName == 'recheck'">
            <el-table height="calc(100% - 80px)" ref="recheck" :key="'2'" :data="recheckData" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :cell-style="{ padding: '0' }">
              <el-table-column type="selection"> </el-table-column>
              <el-table-column label="客户姓名" prop="name" width="80px">
              </el-table-column>
              <el-table-column label="性别" prop="sex" width="70px">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="年龄" prop="age" width="70px">
              </el-table-column>
              <el-table-column label="电话" prop="telephone" width="120px">
              </el-table-column>
              <el-table-column label="审核" prop="checkname" width="90px"></el-table-column>
              <el-table-column label="体检时间" prop="regdate" width="160px"></el-table-column>
              <el-table-column label="复查内容" width="200px" prop="conclusions" show-overflow-tooltip>
                <template v-slot="params">
                  <el-popover placement="right" title="异常结果" width="490" trigger="manual" v-model="PopoverFlag[params.row.regid]">
                    <el-table :data="abnormalDetailData_recheck" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" v-loading="Showloading" height="300px">
                      <el-table-column width="200" property="conclusion" label="异常名称" show-overflow-tooltip></el-table-column>
                      <el-table-column width="160" label="异常期限">
                        <template v-slot="params">
                          <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                          <el-input size="mini" v-model="params.row.conclusionname" placeholder="异常期限"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column width="100" label="是否完成">
                        <template v-slot="params">
                          <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                          <el-checkbox :true-label="1" :false-label="0" v-model="params.row.status"></el-checkbox>
                        </template>
                      </el-table-column>
                    </el-table>
                    <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                    <el-button size="mini" type="primary" @click="handlePopoverHide_recheck(params.row)">保 存</el-button>
                    <el-button size="mini" type="primary" @click="handleClose(params.row)">关 闭</el-button>
                    <div slot="reference" @click="handlePopoverShow_recheck(params.row)" style="cursor: pointer">
                      {{ params.row.conclusions }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="回访记录" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.followinfo" placeholder="回访记录" width="200px" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="复查时间" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.repeatcheckdate" placeholder="复查时间" width="200px" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="复检指导" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.fujianguide" placeholder="复检指导" width="200px" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="repeatstatus" width="120px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-select v-model="params.row.repeatstatus" placeholder="请选择" size="mini" style="width: 100%">
                    <el-option label="未复查" :value="0"></el-option>
                    <el-option label="已复查" :value="1"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <!-- 开单之前是登记人 -->
              <el-table-column label="开单" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.registerpersonname" placeholder="开单" width="200px" size="mini"></el-input>
                </template>
              </el-table-column>
              <!-- 回访 -->
              <el-table-column label="回访" width="200px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-input v-model="params.row.backvisit" placeholder="回访" width="200px" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作人" prop="createpersonname" width="85px">
              </el-table-column>
              <el-table-column label="修改人" prop="lastpersonname" width="85px">
              </el-table-column>
              <el-table-column label="操作" width="90px">
                <template v-slot="params">
                  <!-- :disabled="!verifyUseId(params.row.createperson)" -->
                  <el-button size="mini" type="primary" @click="handlerecheckSubmit(params.row)">保存</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <template v-if="listQuery.tableName == 'special'">
            <el-table height="calc(100% - 80px)" ref="special" :key="'2'" :data="specialData" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :cell-style="{ padding: '0' }">
              <el-table-column label="日期" prop="regdate" min-width="170px"></el-table-column>
              <el-table-column label="姓名" prop="name" width="80px">
              </el-table-column>
              <el-table-column label="性别" prop="sex" width="70px">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="年龄" prop="age" width="70px">
              </el-table-column>
              <el-table-column label="转诊/复查" min-width="120px">
                <template v-slot="params">
                  <el-select v-model="params.row.transferfujian" placeholder="请选择" size="mini" style="width: 100%" clearable>
                    <el-option label="转诊" value="转诊"></el-option>
                    <el-option label="复查" value="复查"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="医生" width="200px">
                <template v-slot="params">
                  <el-input v-model="params.row.doctor" placeholder="医生" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="登记人" width="200px">
                <template v-slot="params">
                  <el-input v-model="params.row.register" placeholder="登记人" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="带诊人/开单人" min-width="120px">
                <template v-slot="params">
                  <el-select v-model="params.row.billing" placeholder="请选择" size="mini" style="width: 100%" clearable>
                    <el-option v-for="item in operatorItems" size="mini" :key="item.id" :label="item.name" :value="item.account">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="备注" width="200px">
                <template v-slot="params">
                  <el-input v-model="params.row.remark" placeholder="备注" size="mini"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="90px">
                <template v-slot="params">
                  <el-button size="mini" type="primary" @click="handleSpecialSubmit(params.row)">保存</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
          <!-- 新增--编辑弹框 -->
          <el-dialog :title="DialogTitle" :visible.sync="DialogShow" class="detali_dia" :show-close="false" :close-on-click-modal="false">
            <el-row class="displayFlex">
              <el-form ref="form" inline :model="form" label-width="95px">
                <el-col :span="5">
                  <el-form-item size="mini" label="执行人">
                    <el-input v-model="form.executname" clearable size="mini" placeholder="执行人"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item size="mini" label="数量">
                    <el-input v-model="form.executnum" clearable size="mini" placeholder="数量"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6" v-if="this.listQuery.tableName == 'billing'">
                  <el-form-item size="mini" label="开单类型" label-width="100px">
                    <el-select class="filter-item" v-model="form.billingtype" placeholder="选择操作人" clearable style="width: 100%" size="mini">
                      <el-option v-for="item in billingTypeSelect" :key="item.id" :label="item.name" :value="item.name">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" v-if="this.listQuery.tableName == 'reportEntry'">
                  <el-form-item size="mini" label="统计类型" :rules="[{ required: !form.billingtype }]" label-width="120px">
                    <el-select size="mini" v-model="form.billingtype" placeholder="请选择统计类型">
                      <el-option :label="'报告录入'" :value="'报告录入'"></el-option>
                      <el-option :label="'个检报告书审核'" :value="'个检报告书审核'"></el-option>
                      <el-option :label="'团检报告审核'" :value="'团检报告审核'"></el-option>
                      <el-option :label="'入职报告审核'" :value="'入职报告审核'"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item size="mini" label="时间" :rules="[{ required: !form.executtime }]">
                    <el-date-picker v-model="form.executtime" style="width: 100%" value-format="yyyy-MM-dd" size="mini" type="date" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
              </el-form>
            </el-row>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" type="primary" @click="handleCloseDialog">关 闭</el-button>
              <el-button size="mini" type="primary" @click="handleSubmitDialog">确 认</el-button>
            </span>
          </el-dialog>
          <!-- 分页 -->
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page" :page-size="listQuery.limit" :page-sizes="[1, 100, 200, 300, 1000, 5000]" layout="total, sizes, prev, pager, next, jumper" :total="listQuery.count">
          </el-pagination>
        </el-main>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import * as api from "@/api/workloadstatistics";
import waves from "@/directive/waves"; // 水波纹指令
// 引入页面接口
import { getAllUser } from "@/api/customermanage.js";
export default {
  name: "workloadstatistics",
  directives: {
    waves,
  },
  components: { Sticky, Pagination },
  data() {
    const today = new Date();
    const oneMonthAgo = new Date();
    const star_endToday = new Date(today).toISOString().split("T")[0];

    // 设置一个月前的日期
    oneMonthAgo.setDate(today.getDate() - 30); // 这里假设一个月为大约30天，实际应用中可能需要更精确的计算方式
    // 格式化日期为 'yyyy-MM-dd'
    const formatToDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份加1是因为JavaScript中月份是从0开始的
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    return {
      defaultChecked: [1], // 默认选中数据
      timeId: "", // 默认选中数据
      tableKey: 0,
      multipleSelection: [], // 列表checkbox选中的值
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      // 树状数据
      setdictionaryTypes: [
        { name: "serum", txt: "血压统计", id: 1 },
        { name: "electrocardiogram", txt: "心电图统计", id: 2 },
        { name: "blutabnahme", txt: "抽血统计", id: 3 },
        { name: "billing", txt: "开单统计", id: 5 },
        { name: "vaccine", txt: "疫苗统计", id: 8 },
        { name: "gynecologicalExamination", txt: "妇检统计", id: 10 },
        { name: "checkIn", txt: "彩超登记统计", id: 4 },
        { name: "bindingReport", txt: "装订报告统计", id: 9 },
        { name: "colorUltrasoundEntry", txt: "打字员彩超录入统计", id: 11 },
        { name: "reportEntry", txt: "审核统计", id: 12 },
        { name: "deskilling", txt: "转诊报表", id: 6 },
        { name: "recheck", txt: "复检指引", id: 7 },
        { name: "special", txt: "专项检查统计", id: 13 },
      ],
      // 树状数据配置项
      setdictionaryTypeProps: {
        children: "children",
        label: "txt",
      },
      // 分页
      currentPage: 1,
      pageSize: 100,
      count: 0,
      // 表单
      form: {
        id: "",
        category: "",
        executname: "",
        executnum: 0,
        executtime: "",
        remark: "",
        billingtype: "",
      },
      DialogTitle: "新增", // dialog title
      DialogShow: false, // dialog 开关
      editState: "", //  Add Edit  是编辑还是新增
      allData: [], // 血压统计数据  心电图统计数据  抽血统计数据   手工统计
      deskillingData: [], // 转诊报表数据
      recheckData: [], // 复检指引数据
      listQuery: {
        // 查询条件
        key: undefined,
        id: undefined,
        date: "",
        page: 1,
        limit: 100,
        count: 0,
        tableName: "serum",
      },
      Assembly: {
        page: 1,
        limit: 100,
        whereitems: [],
      },
      whereitems: [],
      deskillingAssembly: {
        page: 1,
        limit: 100,
        whereitems: [],
      },
      recheckAssembly: {
        page: 1,
        limit: 100,
        whereitems: [],
      },
      specialFrom: {
        page: 1,
        limit: 100,
        whereitems: [],
      },
      searchDialogShow: false, // 搜索弹框
      searchform: {
        // 搜索集
        name: "",
        regid: "",
        createperson: "",
        startcreatetime: "",
        endcreatetime: "",
        date: [],
        date2: [],
        category: "",
      },
      billingTypeSelect: [
        { name: "个人体检", id: 1 },
        { name: "招工体检", id: 2 },
        { name: "驾驶证体检", id: 3 },
      ],
      createpersonOptions: [], //人员名单
      zongjian_startDate: formatToDateStr(oneMonthAgo),
      zongjian_endDate: formatToDateStr(today),
      star_endToday,
      Showloading: false,
      abnormalDetailData_deskilling: [], // 异常详情数据 -- 转诊
      abnormalDetailData_recheck: [], // 异常详情数据 -- 复检
      departmentData: [], // 科室数据
      departmentSelect: [], // 已选择的科室数据
      PopoverFlag: {},
      specialData: [],
      operatorItems: [],
    };
  },
  filters: {},
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["modulesTree", "iframeViews", "visitedViews"]),
    typesBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements.sort((a, b) => {
          return a.sort - b.sort;
        });
      return elements || [];
    },
  },
  mounted() {
    this.defaultTime(); // 默认时间
    this.getLoad(); // 获取操作人员
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      if (this.setdictionaryTypes.length == 0) return;
      this.defaultChecked.push(this.setdictionaryTypes[0].id);
      let code = this.setdictionaryTypes[0].id;
      this.$refs[`treeItem_${code}`].click();
    }, 400);
  },
  methods: {
    getSpecialList() {
      this.specialFrom.page = this.listQuery.page;
      this.specialFrom.limit = this.listQuery.limit;
      api.UserSpecialCheckLoad(this.specialFrom).then((res) => {
        this.listQuery.count = res.count;
        this.specialData = res.data;
        this.whereitems = [];
      });
    },
    handleSpecialSubmit(row) {
      api.UserSpecialCheckSave(row).then((res) => {
        res.code == 200 && this.$message.success("保存成功");
        this.getSpecialList();
      });
    },
    // 校验
    // verifyUseId(itemCode) {
    //   const CODE = JSON.parse(localStorage.getItem("usernameOrId")).hisCode;
    //   if (itemCode == CODE || itemCode == "0397") {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    // 转诊点击弹框 -- 请求
    handlePopoverShow_deskilling(row) {
      this.PopoverFlag[row.regid] = true;
      this.getAbnormalList(row);
    },

    // 保存按钮回调 -- 转诊
    handlePopoverHide_deskilling() {
      this.setAbnormalList(this.abnormalDetailData_deskilling);
    },
    // 关闭回调
    handleClose(row) {
      this.PopoverFlag[row.regid] = false;
    },
    // 复检点击弹框 -- 请求
    handlePopoverShow_recheck(row) {
      this.PopoverFlag[row.regid] = true;
      this.getAbnormalList(row);
    },
    // 保存按钮回调 -- 复检
    handlePopoverHide_recheck() {
      this.setAbnormalList(this.abnormalDetailData_recheck);
    },
    // 保存方法
    setAbnormalList(data) {
      let { regid } = data[0];
      console.log(data);
      api.UserFuJianTransferConclusionSave(data).then((res) => {
        this.$message.success("保存成功");
        this.PopoverFlag[regid] = false;
      });
      //
    },
    // 返回处理好的数据
    returnList(row) {
      let arr = row.conclusions.split(",");
      const RESULT = arr.map((k) => {
        return {
          regid: row.regid,
          category:
            this.listQuery.tableName == "deskilling" ? "transfer" : "fujian",
          conclusion: k,
          conclusionname: "",
          status: 0,
        };
      });
      console.log(RESULT, "处理过的数据");
      return RESULT;
    },
    // 获取详情数据
    getAbnormalList(row) {
      api
        .UserFuJianTransferConclusionLoad({
          page: 1,
          limit: 99,
          whereitems: [
            {
              key: "regid",
              value: row.regid,
            },
            {
              key: "category",
              value:
                this.listQuery.tableName == "deskilling"
                  ? "transfer"
                  : "fujian",
            },
          ],
        })
        .then((res) => {
          if (this.listQuery.tableName == "deskilling") {
            console.log(1);
            if (res.data.length > 0) {
              console.log(11);
              this.abnormalDetailData_deskilling = res.data;
            } else {
              console.log(12);
              this.abnormalDetailData_deskilling = this.returnList(row);
            }
          } else {
            console.log(2);
            if (res.data.length > 0) {
              this.abnormalDetailData_recheck = res.data;
            } else {
              this.abnormalDetailData_recheck = this.returnList(row);
              console.log(this.abnormalDetailData_recheck);
            }
          }
        });
    },
    // 数据写入excel
    export2Excel() {
      var that = this;
      let list = null;
      require.ensure([], async () => {
        const { export_json_to_excel } = require("@/vendor/Export2Excel"); // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = []; // 固定导出的表头名信息
        const filterVal = []; // 固定导出的表头字段名，需要导出表格字段名
        let excelName = "";
        if (this.listQuery.tableName === "deskilling") {
          excelName = "转诊报表";
          tHeader.push(
            "客户姓名",
            "性别",
            "年龄",
            "电话",
            "审核",
            "体检时间",
            "转诊原因",
            "转诊科室",
            "转诊指导",
            "带诊",
            "状态",
            "回访",
            "操作人",
            "修改人"
          );
          filterVal.push(
            "name",
            "sex",
            "age",
            "telephone",
            "checkname",
            "regdate", // --
            "conclusions",
            "department",
            "transferguide",
            "guahao",
            "transferstatus",
            "dengji",
            "createpersonname",
            "lastpersonname"
          );
          list = this.deskillingData.map((k) => {
            const kCopy = { ...k }; // 创建一个浅副本,为了避免修改数据而影响源数据
            kCopy.sex == 0
              ? (kCopy.sex = "未知")
              : kCopy.sex == 1
              ? (kCopy.sex = "男")
              : (kCopy.sex = "女");
            if (kCopy.transferstatus == 1) {
              kCopy.transferstatus = "已转诊";
            } else {
              kCopy.transferstatus = "未转诊";
            }
            return kCopy;
          }); // 表格数据
        } else {
          excelName = "复检指引";
          tHeader.push(
            "客户姓名",
            "性别",
            "年龄",
            "电话",
            "审核",
            "体检时间",
            "复查内容",
            "复查时间",
            "复检指导",
            "状态",
            "开单",
            "回访",
            "操作人",
            "修改人"
          );
          filterVal.push(
            "name",
            "sex",
            "age",
            "telephone",
            "checkname",
            "regdate", //--
            "conclusions",
            "repeatcheckdate",
            "fujianguide",
            "repeatstatus",
            "registerpersonname",
            "backvisit",
            "createpersonname",
            "lastpersonname"
          );
          let result = await api.UserFuJianStaticLoad({
            page: 1,
            limit: 100,
            whereitems: [],
          });
          if (!result.data) {
            this.$message.warning("查询数据失败!");
            return;
          }
          let tempData = result.data;
          list = tempData.map((k) => {
            const kCopy = { ...k }; // 创建一个浅副本,为了避免修改数据而影响源数据
            kCopy.sex == 0
              ? (kCopy.sex = "未知")
              : kCopy.sex == 1
              ? (kCopy.sex = "男")
              : (kCopy.sex = "女");
            if (kCopy.repeatstatus == 1) {
              kCopy.repeatstatus = "已复检";
            } else {
              kCopy.repeatstatus = "未复检";
            }
            return kCopy;
          }); // 表格数据
        }

        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, excelName); // excelName 导出的表格名称，根据需要自己命名
      });
    },
    // 格式转换，直接复制即可
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    // 默认时间
    defaultTime() {
      this.$nextTick(() => {
        // 总检时间
        this.searchform.date2 = [this.star_endToday, this.star_endToday];
      });
    },
    set_zongjianDate() {
      let whereitems = [
        {
          key: "startcheckdate",
          value: this.star_endToday,
        },
        {
          key: "endcheckdate",
          value: this.star_endToday,
        },
      ];

      this.deskillingAssembly.whereitems = whereitems;
      this.recheckAssembly.whereitems = whereitems;
    },
    // 搜索谈款关闭回调
    handlesearchCloseDialog() {
      this.searchDialogShow = false;
      console.log("关闭");
      this.close();
    },
    // 搜索确定回调
    handlesearchSubmitDialog() {
      this.searchDialogShow = false;
      // 获取对应数据
      let name = this.listQuery.tableName;
      this.searchform.category =
        name == "serum"
          ? "血压"
          : name == "electrocardiogram"
          ? "心电图"
          : name == "blutabnahme"
          ? "抽血"
          : name == "billing"
          ? "开单"
          : name == "checkIn"
          ? "彩超登记"
          : name == "vaccine"
          ? "疫苗"
          : name == "bindingReport"
          ? "装订报告"
          : name == "gynecologicalExamination"
          ? "妇检"
          : name == "colorUltrasoundEntry"
          ? "打字员彩超录入"
          : name == "reportEntry"
          ? "审核统计"
          : name == "special"
          ? "专项检查统计"
          : "";
      // this.whereitems = Object.entries(this.searchform)
      //   .flatMap(([key, value]) => {
      //     if (value == null || value === "") {
      //       return [];
      //     }

      //     if (key === "date" || key === "date2") {
      //       if (key === "date") {
      //         console.log(value, "date");
      //         return [
      //           { key: "startcreatetime", value: value[0] },
      //           { key: "endcreatetime", value: value[1] },
      //         ];
      //       } else {
      //         console.log(value, "date2");
      //         return [
      //           { key: "startcheckdate", value: value[0] },
      //           { key: "endcheckdate", value: value[1] },
      //         ];
      //       }
      //     } else {
      //       return [{ key, value }];
      //     }
      //   })
      //   .filter(Boolean);

      // 优化
      this.whereitems = Object.entries(this.searchform)
        .flatMap(([key, value]) => {
          const [startKey, endKey] =
            key === "date"
              ? ["startcreatetime", "endcreatetime"]
              : key === "date2"
              ? ["startcheckdate", "endcheckdate"]
              : [key, key];

          return value == null || value === ""
            ? []
            : key === "date" || key === "date2"
            ? [
                { key: startKey, value: value[0] },
                { key: endKey, value: value[1] },
              ]
            : [{ key, value }];
        })
        .filter(Boolean);

      if (
        this.listQuery.tableName !== "deskilling" &&
        this.listQuery.tableName !== "recheck" &&
        this.listQuery.tableName !== "special"
      ) {
        this.Assembly.whereitems = this.whereitems;
        this.getUserItemStaticLoadFun();
      }
      if (this.listQuery.tableName == "deskilling") {
        this.deskillingAssembly.whereitems = this.whereitems;
        this.getDeskillingList();
      }
      if (this.listQuery.tableName == "recheck") {
        this.recheckAssembly.whereitems = this.whereitems;
        this.getRecheckList();
      }
      if (this.listQuery.tableName == "special") {
        this.specialFrom.whereitems = this.whereitems;
        this.getSpecialList();
      }
      // this.close();
    },
    // 清空集合 初始化
    close() {
      this.searchform = {
        ...this.searchform,
        name: "",
        regid: "",
        date: [],
        createperson: "",
        startcreatetime: "",
        endcreatetime: "",
        registerpersonname: "",
        repeatcheckdate: "",
        category: "",
      };
      this.listQuery.page = 1;
      this.listQuery.limit = 100;
    },
    // 血压 抽血 血清 获取数据
    getUserItemStaticLoadFun() {
      this.allData = [];
      this.Assembly.page = this.listQuery.page;
      this.Assembly.limit = this.listQuery.limit;
      api.UserItemStaticLoad(this.Assembly).then((res) => {
        if (res.code == 200) {
          this.listQuery.count = res.count;
          this.allData = res.data;
          this.whereitems = [];
        }
      });
    },
    // 转诊报表数据
    getDeskillingList() {
      this.deskillingAssembly.page = this.listQuery.page;
      this.deskillingAssembly.limit = this.listQuery.limit;
      api.UserTransferStaticLoad(this.deskillingAssembly).then((res) => {
        if (res.code == 200) {
          this.listQuery.count = res.count;
          this.deskillingData = res.data;
          if (res.data.length > 0) {
            res.data.forEach((k) => {
              if (!!k.department) {
                k.department = k.department.split(",");
              } else {
                k.department = [];
              }
            });
          }
          this.whereitems = [];
        }
      });
    },
    // 复检报表数据
    getRecheckList() {
      this.recheckAssembly.page = this.listQuery.page;
      this.recheckAssembly.limit = this.listQuery.limit;
      api.UserFuJianStaticLoad(this.recheckAssembly).then((res) => {
        this.listQuery.count = res.count;
        this.recheckData = res.data;
        this.whereitems = [];
      });
    },
    // 删除按钮回调
    handleAllDataDelete(row) {
      // if (!this.verifyUseId(row.createperson)) {
      //   this.$message.warning("只允许修改自己的数据");
      //   return;
      // }
      this.$confirm("此操作将删除当前数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let deleteArr = [];
          !!row && deleteArr.push(row.id);
          this.multipleSelection.forEach((k) => {
            deleteArr.push(k.id);
          });
          api.UserItemStaticDelete(deleteArr).then(() => {
            this.getUserItemStaticLoadFun();
          });
        })
        .catch((e) => {
          console.log(e);
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 转诊 保存回调
    handledeskillingSubmit(row) {
      // if (!this.verifyUseId(row.createperson)) {
      //   this.$message.warning("只允许修改自己的数据");
      //   return;
      // }
      row.department = row.department.join(",");
      api.UserTransferStaticSave(row).then((res) => {
        res.code == 200 && this.$message.success("保存成功");
        this.getDeskillingList();
      });
    },
    // 复检指引--保存数据回调
    handlerecheckSubmit(row) {
      // if (!this.verifyUseId(row.createperson)) {
      //   this.$message.warning("只允许修改自己的数据");
      //   return;
      // }
      api.UserFuJianStaticSave(row).then((res) => {
        res.code == 200 && this.$message.success("保存成功");
        this.getRecheckList();
      });
    },
    // 弹框确定回调
    handleSubmitDialog() {
      api.UserItemStaticSave(this.form).then((res) => {
        if (res.code == 200) {
          this.$message.success("保存成功");
          this.getUserItemStaticLoadFun();
          this.DialogShow = false;
          this.form = {
            id: "",
            category: "",
            executname: "",
            executnum: 0,
            executtime: "",
            remark: "",
            billingtype: "",
          };
        }
      });
    },

    // 弹框关闭回调
    handleCloseDialog() {
      this.DialogShow = false;
    },
    // 勾选回调
    handleSelectionChange(row) {
      this.multipleSelection = row;
    },
    // 点击当前行
    rowClick(row) {},
    // 获取人员名单
    getLoad() {
      api
        .load({
          page: 1,
          limit: 10000,
          orgId: "",
          parentId: "",
          tableName: "Dic_department",
        })
        .then((res) => {
          this.createpersonOptions = res.data;
        });
    },
    // 获取对应数据
    async getList() {
      if (
        this.listQuery.tableName !== "deskilling" &&
        this.listQuery.tableName !== "recheck" &&
        this.listQuery.tableName !== "special"
      ) {
        let name = this.listQuery.tableName;
        let val =
          name == "serum"
            ? "血压"
            : name == "electrocardiogram"
            ? "心电图"
            : name == "blutabnahme"
            ? "抽血"
            : name == "billing"
            ? "开单"
            : name == "checkIn"
            ? "彩超登记"
            : name == "vaccine"
            ? "疫苗"
            : name == "bindingReport"
            ? "装订报告"
            : name == "gynecologicalExamination"
            ? "妇检"
            : name == "colorUltrasoundEntry"
            ? "打字员彩超录入"
            : name == "reportEntry"
            ? "审核统计"
            : name == "special"
            ? "专项检查统计"
            : "";
        this.Assembly.whereitems = [
          {
            key: "category",
            value: val,
          },
        ];
        this.getUserItemStaticLoadFun();
        return;
      }
      if (this.listQuery.tableName == "deskilling") {
        this.getDeskillingList();
      }
      if (this.listQuery.tableName == "recheck") {
        this.getRecheckList();
      }
      if (this.listQuery.tableName == "special") {
        let res = await getAllUser();
        this.operatorItems = res.data;
        this.getSpecialList();
      }
      this.getDepartmentData();
    },
    // 获取科室数据
    getDepartmentData() {
      api.getDepartment().then((res) => {
        // console.log(res);
        this.departmentData = res.result.deptitems;
      });
    },
    // 左侧切换回调
    handleNodeClick(val) {
      this.listQuery.tableName = val.name;
      this.listQuery.page = 1;
      this.listQuery.limit = 100;
      this.Assembly.whereitems = [];
      this.defaultTime(); // 默认时间
      this.set_zongjianDate(); // 设置总检时间为当天
      this.close(); // 清空搜索表单
      this.getList(); // 获取对应数据
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
    // 按钮组回调
    onBtnClicked: function (domId) {
      switch (domId) {
        // 添加
        case "btnAdd":
          this.editState = "Add";
          this.DialogTitle = "新增";
          let name = this.listQuery.tableName;
          this.form.category =
            name == "serum"
              ? "血压"
              : name == "electrocardiogram"
              ? "心电图"
              : name == "blutabnahme"
              ? "抽血"
              : name == "billing"
              ? "开单"
              : name == "checkIn"
              ? "彩超登记"
              : name == "vaccine"
              ? "疫苗"
              : name == "bindingReport"
              ? "装订报告"
              : name == "gynecologicalExamination"
              ? "妇检"
              : name == "colorUltrasoundEntry"
              ? "打字员彩超录入"
              : name == "reportEntry"
              ? "审核统计"
              : "";
          this.DialogShow = true;
          break;
        // 编辑
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          if (
            this.listQuery.tableName == "deskilling" ||
            this.listQuery.tableName == "recheck"
          )
            return;
          this.editState = "Edit";
          this.DialogTitle = "编辑";
          if (
            this.listQuery.tableName !== "deskilling" &&
            this.listQuery.tableName !== "recheck"
          ) {
            // if (!this.verifyUseId(this.form.createperson)) {
            //   this.$message.warning("只允许修改自己的数据");
            //   return;
            // }
            this.DialogShow = true;
            this.form = this.multipleSelection[0];
            return;
          }

          break;
        case "btnSearch": // 搜索
          this.handlesearchSubmitDialog();
          break;
        case "btnExport": // 导出
          // if (this.multipleSelection.length < 1) {
          //   this.$message({
          //     showClose: true,
          //     message: "至少导出一条数据",
          //     type: "error",
          //   });
          //   return;
          // } else {
          //   this.export2Excel();
          // }
          if (this.listQuery.tableName == "deskilling") {
            if (this.deskillingData.length < 1) {
              this.$message({
                showClose: true,
                message: "导出数据不能为空",
                type: "error",
              });
              return;
            } else {
              this.export2Excel();
            }
          } else {
            if (this.recheckData.length < 1) {
              this.$message({
                showClose: true,
                message: "导出数据不能为空",
                type: "error",
              });
              return;
            } else {
              this.export2Excel();
            }
          }
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnDel": // 删除
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          } else {
            this.handleAllDataDelete();
          }
          break;
        default:
          break;
      }
    },
    // 每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      console.log(val, "每页条数");
      // this.getList();
      this.handlesearchSubmitDialog();
    },
    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val;
      console.log(val, "当前页");
      // this.getList();
      this.handlesearchSubmitDialog();
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
      if (row.illnessstatus > 0) {
        return "renBcClas";
      }
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
@import url("./index.scss");
.dialog-mini .el-select {
  width: 100%;
}
.setdictionary-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;
  .setdictionary-menu-card {
    height: calc(100% - 86px);
    overflow: auto;
    .el-card__body {
      height: auto;
    }
  }
}
.setdictionary-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .setdictionary-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    .setdictionary-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }
  .buttons-box {
    padding: 10px 10px;
    background: #f5f5f5;
  }
  .setdictionary-content {
    height: 100%;
    padding: 0;
    .buttons-box {
      text-align: right;
    }
  }
}
</style>
