<template>
  <div class="company_settlement">
    <!-- 内容主体 -->
    <div class="main">
      <!-- 内容左侧 -->
      <div class="main_left">
        <!-- 左侧头部 -->
        <div class="main_left_head"></div>
        <!-- 左侧内容 -->
        <div class="main_left_menu">
          <el-menu class="el-menu-vertical-demo left_menu" background-color="#fff" text-color="#606266" active-text-color="#4689cb" @select="handleSelect">
            <el-menu-item index="1" @click="handelObtainhHazards()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病危害因素</span>
            </el-menu-item>
            <el-menu-item index="2" @click="handelObtainhEvaluate()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病评价字典</span>
            </el-menu-item>
            <el-menu-item index="3" @click="handelObtainhIndustry()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病行业字典</span>
            </el-menu-item>
            <el-menu-item index="4" @click="handelObtainhJobs()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病工种字典</span>
            </el-menu-item>
            <el-menu-item index="5" @click="handelObtainhIrradiation()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病照射种类</span>
            </el-menu-item>
            <el-menu-item index="6" @click="handelObtainhRadiation()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病放射种类</span>
            </el-menu-item>
            <el-menu-item index="7" @click="handelObtainhObjective()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病体检目的</span>
            </el-menu-item>
            <el-menu-item index="8" @click="handelObtainhSuggestion()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病复查建议</span>
            </el-menu-item>
            <el-menu-item index="9" @click="handelObtainhOccupation()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病职业建议</span>
            </el-menu-item>
            <el-menu-item index="10" @click="handelObtainhrelevancy()">
              <i class="el-icon-menu"></i>
              <span slot="title">职业病关联危害</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="main_right">
        <!-- 右侧头部 -->
        <div class="main_right_head">
          <!-- 头部操作控件 -->
          <sticky :className="'sub-navbar'">
            <div class="filter-container">
              <el-input size="mini" v-model="searchValue" style="width: 200px;" :placeholder="'名称'"></el-input>
              <el-button size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked1" v-if="switchhazards" index='1'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked2" v-if="switchevaluate" index='2'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked3" v-if="switchIndustry" index='3'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked4" v-if="switchJobs" index='4'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked5" v-if="switchIrradiation" index='5'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked6" v-if="switchRadiation" index='6'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked7" v-if="switchObjective" index='7'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked8" v-if="switchSuggestion" index='8'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked9" v-if="switchOccupation" index='9'></permission-btn>
              <permission-btn moduleName="personalregister" ref="personalregister" size="mini" v-on:btn-event="hadnleOnBtnClicked10" v-if="switchrelevancy" index='10'></permission-btn>
            </div>
          </sticky>
        </div>
        <!-- 右侧内容 -->
        <div class="main_right_menu">
          <el-empty description="点击左侧菜单加载数据" v-show="empty"></el-empty>
          <el-row v-if="switchhazards" class="tablehazards">
            <el-col :span="11" class="tableClas">
              <!-- 职业危害因素表格 -->
              <el-table :data="hazards" height="calc(100vh - 152px)" style="border-radius: 5px;" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column label="编码">
                  <template slot-scope="scope">
                    <el-link type="primary" @click="handleEditHazards(scope.row)">{{ scope.row.code }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="关联">
                  <template slot-scope="">
                    <el-button type="primary" size="mini" @click="RelevancyVisible = true">关联</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="父级编码">
                  <template slot-scope="scope">
                    <!-- <el-link type="primary" @click="handleEditHazards(scope.row)">{{scope.row.encode}}</el-link> -->
                    <span>{{ scope.row.hcode }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="父级名称"></el-table-column>
                <el-table-column prop="sex" label="性别">
                  <template slot-scope="scope">
                    <span>
                      {{ scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "" }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="pycode" label="拼音码"></el-table-column>
                <el-table-column prop="wbcode" label="五笔码"></el-table-column>
                <el-table-column prop="seqno" label="排序"></el-table-column>
              </el-table>
            </el-col>
            <el-dialog title="关联危害" :visible.sync="RelevancyVisible" width="30%" :before-close="handleRelevancyClose">
              <el-col>
                <el-row>
                  <!-- <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
                </el-row>
                <el-row>
                  <el-table :data="setmeal" height="calc(50vh - 90px)" style="border-radius: 5px;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                  </el-table>
                </el-row>
                <el-row>
                  <el-table :data="combine" height="calc(50vh - 90px)" style="border-radius: 5px;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                  </el-table>
                </el-row>
              </el-col>
            </el-dialog>
            <el-col :span='12'>
              <el-row class="table_Packag">
                <el-table :data="hazards" height="calc(50vh - 90px)" style="border-radius: 5px;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                  <el-table-column prop='code' label="编码">
                  </el-table-column>
                  <el-table-column prop='setmealname' label="套餐名称">
                  </el-table-column>
                  <el-table-column prop='code' label="套餐价格">
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="handleEditHazards(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
              <el-row class="table_Combination">
                <el-table :data="hazards" height="calc(50vh - 90px)" style="border-radius: 5px;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                  <el-table-column prop='code' label="编码">
                  </el-table-column>
                  <el-table-column prop='code' label="组合名称">
                  </el-table-column>
                  <el-table-column prop='code' label="组合价格">
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="primary" size="mini" @click="handleEditHazards(scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-col>
          </el-row>
          <!-- 职业病评价字典表格 -->
          <el-table :data="evaluate" height="calc(100vh - 152px)" v-if="switchevaluate" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="评价编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditEvaluate(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="评价名称" min-width="180">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditEvaluate(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="sex" label="性别">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : scope.row.sex == 2 ? "女" : "" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="flag" label="职业病标志" width="100">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.flag == 0 ? "否" : scope.row.flag == 1 ? "是" : "" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="reviewflag" label="复查标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.flag == 0 ? "不需要" : scope.row.flag == 1 ? "需复查" : "" }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="reviewday" label="复查天数"></el-table-column>
            <el-table-column prop="incode" label="输入码"></el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
          </el-table>
          <!-- 职业病行业字典表格 -->
          <el-table :data="Industry" height="calc(100vh - 152px)" v-if="switchIndustry" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditIndustry(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditIndustry(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病工种字典表格 -->
          <el-table :data="Jobs" height="calc(100vh - 152px)" v-if="switchJobs" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditJobs(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditJobs(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 照射科 字典表格 -->
          <el-table :data="Irradiation" height="calc(100vh - 152px)" v-if="switchIrradiation" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditIrradiation(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditIrradiation(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 放射科 字典表格 -->
          <el-table :data="Radiation" height="calc(100vh - 152px)" v-if="switchRadiation" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditRadiation(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditRadiation(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 体检目的 字典表格 -->
          <el-table :data="Objective" height="calc(100vh - 152px)" v-if="switchObjective" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditObjective(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditObjective(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 复查建议 字典表格 -->
          <el-table :data="Suggestion" height="calc(100vh - 152px)" v-if="switchSuggestion" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="行业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditSuggestion(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="行业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditSuggestion(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 职业建议 字典表格 -->
          <el-table :data="Occupation" height="calc(100vh - 152px)" v-if="switchOccupation" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="职业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditOccupation(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="职业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditOccupation(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 职业病 关联危害 字典表格 -->
          <el-table :data="relevancy" height="calc(100vh - 152px)" v-if="switchrelevancy" @selection-change="handleSelectChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="code" label="职业编码">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditrelevancy(scope.row)">{{ scope.row.code }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="职业名称">
              <template slot-scope="scope">
                <el-link type="primary" @click="handleEditrelevancy(scope.row)">{{ scope.row.name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="pycode" label="拼音码"></el-table-column>
            <el-table-column prop="wbcode" label="五笔码"></el-table-column>
            <el-table-column prop="seqno" label="排序"></el-table-column>
            <el-table-column prop="delflag" label="删除标志">
              <template slot-scope="scope">
                <span>
                  {{ scope.row.delflag == 0 ? "正常" : scope.row.delflag == 1 ? "删除" : "" }}
                </span>
              </template>
            </el-table-column>
          </el-table>

        </div>
      </div>
      <!-- 添加职业危害因素弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible1" width="30%">
        <el-form :model="addhazards" ref="addhazards">
          <!-- <el-form-item label="危害因素编码" prop="name" :label-width="formLabelWidth" size="small">
            <el-input :disabled="true" ></el-input>
          </el-form-item> -->
          <el-form-item label="编码" prop="encode" :label-width="formLabelWidth" size="small">
            <el-input v-model="addhazards.code" :disabled="true" placeholder="系统自动生成"></el-input>
          </el-form-item>
          <el-form-item label="危害因素名称" prop="name" :rules="[{ required: true, message: '危害因素名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addhazards.name"></el-input>
          </el-form-item>
          <el-form-item label="父级编码" prop="hcode" :label-width="formLabelWidth" size="small">
            <el-select v-model="addhazards.hcode" placeholder="请选择">
              <el-option v-for="(item, index) in hazards" :key="index" :label="`${item.code} ${item.name}`" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="sex" :label-width="formLabelWidth" size="small">
            <el-select v-model="addhazards.sex" placeholder="请选择">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addhazards.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelAddHazards(); dialogFormVisible1 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible1 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 编辑职业危害因素弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible1" width="30%">
        <el-form :model="editcodeset">
          <!-- <el-form-item label="危害因素编码" prop="name" :label-width="formLabelWidth" size="small">
            <el-input></el-input>
          </el-form-item> -->
          <el-form-item label="编码" prop="code" :label-width="formLabelWidth" size="small">
            <el-input v-model="editcodeset.code" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="危害因素名称" prop="name" :rules="[{ required: true, message: '危害因素名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="父级编码" prop="hcode" :label-width="formLabelWidth" size="small">
            <el-select v-model="editcodeset.hcode" placeholder="请选择">
              <el-option :disabled="item.code == editcodeset.code" v-for="(item, index) in hazards" :key="index" :label="`${item.code} ${item.name}`" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" prop="sex" :label-width="formLabelWidth" size="small">
            <el-select v-model="editcodeset.sex" placeholder="请选择">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' },
          { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditHazards(); editFormVisible1 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible1 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加职业病评价字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible2" width="30%">
        <el-form :model="addevaluate" ref="addevaluate">
          <el-form-item label="评价编码" prop="" :rules="[{ required: true, message: '评价编码不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input placeholder="系统自动生成" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="评价名称" prop="name" :rules="[{ required: true, message: '评价名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addevaluate.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" :label-width="formLabelWidth" size="small">
            <el-select v-model="addevaluate.sex">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职业病标志" prop="flag" :rules="[{ required: true, message: '职业病标志不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-select v-model="addevaluate.flag">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复查标志" prop="reviewflag" :label-width="formLabelWidth" size="small">
            <el-select v-model="addevaluate.reviewflag">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需复查" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复查天数" prop="reviewday" :rules="[{ type: 'number', message: '复查天数必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addevaluate.reviewday"></el-input>
          </el-form-item>
          <el-form-item label="输入码" prop="incode" :label-width="formLabelWidth" size="small">
            <el-input v-model="addevaluate.incode"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addevaluate.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelAddEvaluate(); dialogFormVisible2 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible2 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 编辑职业病评价字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible2" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="评价编码" prop="" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '评价编码不能为空' }]">
            <el-input v-model="editcodeset.code" placeholder="可手动填写"></el-input>
          </el-form-item>
          <el-form-item label="评价名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '评价名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex" :label-width="formLabelWidth" size="small">
            <el-select v-model="editcodeset.sex">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="职业病标志" prop="flag" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '职业病标志不能为空' }]">
            <el-select v-model="editcodeset.flag">
              <el-option label="否" :value="0"></el-option>
              <el-option label="是" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复查标志" prop="reviewflag" :label-width="formLabelWidth" size="small">
            <el-select v-model="editcodeset.reviewflag">
              <el-option label="不需要" :value="0"></el-option>
              <el-option label="需复查" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="复查天数" prop="reviewday" :label-width="formLabelWidth" size="small" :rules="[{ type: 'number', message: '复查天数必须为数字值' }]">
            <el-input v-model.number="editcodeset.reviewday"></el-input>
          </el-form-item>
          <el-form-item label="输入码" prop="incode" :label-width="formLabelWidth" size="small">
            <el-input v-model="editcodeset.incode"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditEvaluate(); editFormVisible2 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible2 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加职业病 行业字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible3" width="30%">
        <el-form :model="addAll" ref="addIndustry">
          <el-form-item label="行业名称" prop="name" :rules="[{ required: true, message: '行业名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelIndustry(); dialogFormVisible3 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible3 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 行业字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible3" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="行业名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '行业名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditIndustry(); editFormVisible3 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible3 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加职业病 工种 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible4" width="30%">
        <el-form :model="addAll" ref="addJobs">
          <el-form-item label="工种名称" prop="name" :rules="[{ required: true, message: '工种名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelJobs(); dialogFormVisible4 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible4 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 工种 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible4" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="工种名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '工种名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditJobs(); editFormVisible4 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible4 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加职业病 照射科 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible5" width="30%">
        <el-form :model="addAll" ref="addIrradiation">
          <el-form-item label="照射科名称" prop="name" :rules="[{ required: true, message: '照射科名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelIrradiation(); dialogFormVisible5 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible5 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 照射科 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible5" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="照射科名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '照射科名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditIrradiation(); editFormVisible5 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible5 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加职业病 放射科 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible6" width="30%">
        <el-form :model="addAll" ref="addRadiation">
          <el-form-item label="放射科名称" prop="name" :rules="[{ required: true, message: '放射科名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelRadiation(); dialogFormVisible6 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible6 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 放射科 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible6" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="放射科名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '行业名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditRadiation(); editFormVisible6 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible6 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 添加职业病 体检目的 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible7" width="30%">
        <el-form :model="addAll" ref="addObjective">
          <el-form-item label="体检目的名称" prop="name" :rules="[{ required: true, message: '体检目的名称不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelObjective(); dialogFormVisible7 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible7 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 体检目的 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible7" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="体检目的名称" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '体检目的名称不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditObjective(); editFormVisible7 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible7 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加职业病 复查建议 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible8" width="30%">
        <el-form :model="addAll" ref="addObjective">
          <el-form-item label="复查建议" prop="name" :rules="[{ required: true, message: '复查建议不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelSuggestion(); dialogFormVisible8 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible8 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 复查建议 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible8" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="复查建议" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '复查建议不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditSuggestion(); editFormVisible8 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible8 = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 添加职业病 职业建议 字典弹窗 -->
      <el-dialog title="添加" label-position="right" :visible.sync="dialogFormVisible9" width="30%">
        <el-form :model="addAll" ref="addObjective">
          <el-form-item label="职业建议" prop="name" :rules="[{ required: true, message: '职业建议不能为空' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model="addAll.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]" :label-width="formLabelWidth" size="small">
            <el-input v-model.number="addAll.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelOccupation(); dialogFormVisible9 = false;">确 定</el-button>
          <el-button size="mini" @click="dialogFormVisible9 = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 编辑职业病 职业建议 字典弹窗 -->
      <el-dialog title="编辑" label-position="right" :visible.sync="editFormVisible9" width="30%">
        <el-form :model="editcodeset">
          <el-form-item label="职业建议" prop="name" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '职业建议不能为空' }]">
            <el-input v-model="editcodeset.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="seqno" :label-width="formLabelWidth" size="small" :rules="[{ required: true, message: '排序不能为空' }, { type: 'number', message: '排序必须为数字值' }]">
            <el-input v-model.number="editcodeset.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handelEditOccupation(); editFormVisible9 = false;">确 定</el-button>
          <el-button size="mini" @click="editFormVisible9 = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";

import {
  getDicOccupation,
  getOccupationalDiseaseLoad,
  getOccupationalDiseaseDelete,
  getOccupationalDiseaseUpdate,
  getOccupationalDiseaseAdd,
  getCreate,
  getDelete,
  getUpadate,
} from "@/api/dicoccupation.js";
export default {
  name: "dicoccupation",
  components: {
    Sticky,
    permissionBtn,
  },
  data() {
    return {
      searchValue: "",
      // 关联--------------------------------------------
      RelevancyVisible: false, // 关联dialog开关
      // 危害因素对应 体检套餐
      setmeal: [],
      // 危害因素对应 体检项目
      combine: [],
      // 关联-------------------------------------------
      // 职业危害因素数据
      hazards: [],
      // 职业病评价字典数据
      evaluate: [],
      // 职业病 行业数据
      Industry: [],
      // 职业病 工种数据
      Jobs: [],
      // 职业病  照射科数据
      Irradiation: [],
      // 职业病  放射科数据
      Radiation: [],
      // 职业病  体检目的
      Objective: [],
      // 职业病  复查建议
      Suggestion: [],
      // 职业病  职业建议
      Occupation: [],
      // 职业病  关联危害
      relevancy: [],
      empty: true,
      // 职业危害因素显示状态
      switchhazards: false,
      // 职业病评价字典显示状态
      switchevaluate: false,
      // 职业病行业字典显示状态
      switchIndustry: false,
      // 职业病工种字典显示状态
      switchJobs: false,
      // 职业病照射种类显示状态
      switchIrradiation: false,
      // 职业病放射种类显示状态
      switchRadiation: false,
      // 职业病体检目的显示状态
      switchObjective: false,
      // 职业病复查建议显示状态
      switchSuggestion: false,
      // 职业病职业建议显示状态
      switchOccupation: false,
      // 职业病关联危害显示状态
      switchrelevancy: false,
      // 添加职业危害因素数据
      addhazards: {
        name: "",
        code: "",
        hcode: "",
        sex: 0,
        seqno: 0,
      },
      // 添加职业病评价字典表单
      addevaluate: {
        name: "",
        sex: 0,
        flag: 0,
        reviewflag: 0,
        reviewday: "",
        incode: "",
        seqno: 0,
      },
      // 添加职业病行业 工种 照射科 放射科 体检目的 字典表单
      addAll: {
        code: 0,
        name: "",
        delflag: 0,
        seqno: 0,
        tableType: "",
      },
      // 删除编码集
      codeset: [],
      // 编辑编码集
      editcodeset: {},
      // 编辑职业病
      // editObj:{},
      open: [],
      // 职业病危害因素添加弹窗
      dialogFormVisible1: false,
      // 职业病评价字典添加弹窗
      dialogFormVisible2: false,
      // 职业病危害因素编辑弹窗
      editFormVisible1: false,
      changeFormVisible1: false,
      // 职业病危害因素编辑弹窗
      editFormVisible2: false,
      changeFormVisible2: false,
      // 职业病行业字典添加弹窗
      dialogFormVisible3: false,
      changeFormVisible3: false,
      // 职业病行业字典编辑弹窗
      editFormVisible3: false,
      // 职业病工种字典添加弹窗
      dialogFormVisible4: false,
      changeFormVisible4: false,
      // 职业病工种字典编辑弹窗
      editFormVisible4: false,
      // 职业病 照射科 字典添加弹窗
      dialogFormVisible5: false,
      changeFormVisible5: false,
      // 职业病 照射科 字典编辑弹窗
      editFormVisible5: false,
      // 职业病 放射科 字典添加弹窗
      dialogFormVisible6: false,
      changeFormVisible6: false,
      // 职业病 放射科 字典编辑弹窗
      editFormVisible6: false,
      // 职业病 体检目的 字典添加弹窗
      dialogFormVisible7: false,
      changeFormVisible7: false,
      // 职业病 体检目的 字典编辑弹窗
      editFormVisible7: false,

      // 职业病 复查建议 字典添加弹窗
      dialogFormVisible8: false,
      changeFormVisible8: false,
      // 职业病 复查建议 字典编辑弹窗
      editFormVisible8: false,

      // 职业病 职业建议 字典添加弹窗
      dialogFormVisible9: false,
      changeFormVisible9: false,
      // 职业病 职业建议 字典编辑弹窗
      editFormVisible9: false,

      multipleSelection: [],
      formLabelWidth: "110px",
    };
  },
  mounted() {
    // 参数
    // Dic_occupation_harm
    // Dic_evaluate_word
    // 获取列表数据方法二
    // var data = {
    // 	tablename: "Dis_occupation_harm",
    // };
    // getDicOccupation().then((data) => {
    // 	console.log(data);
    // });
  },

  methods: {
    // 职业危害因素关联--------------------------------------------------------
    handleRelevancyClose() {
      this.RelevancyVisible = false;
    },
    // -------------------点击表格名字回调
    handleEditHazards(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible1 = true;
    },

    handleEditEvaluate(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible2 = true;
    },
    //行业
    handleEditIndustry(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible3 = true;
    },
    // 工种
    handleEditJobs(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible4 = true;
    },
    // 照射科
    handleEditIrradiation(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible5 = true;
    },
    // 放射科
    handleEditRadiation(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible6 = true;
    },
    // 体检目的
    handleEditObjective(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible7 = true;
    },
    // 复查建议
    handleEditSuggestion(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible8 = true;
    },
    // 职业建议
    handleEditOccupation(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible9 = true;
    },
    //  职业病关联危害字典
    handleEditrelevancy(item) {
      if (!item) return false;
      this.editcodeset = item;
      this.editFormVisible10 = true;
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
    handleSearch() {
      console.log("搜索", this.searchValue);
      if (this.switchIndustry == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "1",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Industry = res.data;
          }
        });
      } else if (this.switchJobs == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "2",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Jobs = res.data;
          }
        });
      } else if (this.switchIrradiation == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "3",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Irradiation = res.data;
          }
        });
      } else if (this.switchRadiation == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "4",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Radiation = res.data;
          }
        });
      } else if (this.switchObjective == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "5",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Objective = res.data;
          }
        });
      } else if (this.switchSuggestion == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "6",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Suggestion = res.data;
          }
        });
      } else if (this.switchOccupation == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "7",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.Occupation = res.data;
          }
        });
      } else if (this.switchrelevancy == true) {
        getOccupationalDiseaseLoad({
          key: this.searchValue.trim(),
          type: "8",
        }).then((res) => {
          console.log(res);
          if (res.code == 200) {
            this.relevancy = res.data;
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
    editremind() {
      this.open = this.codeset;
      console.log(this.codeset);
      if (this.open.length > 1) {
        this.$message({
          showClose: true,
          message: "只能选择一条数据",
          type: "error",
        });
      } else if (this.open.length < 1) {
        this.$message({
          showClose: true,
          message: "至少选择一条数据",
          type: "error",
        });
      }
    },
    // 切换表单
    handleSelect(key) {
      console.log(key, "key--------------");
      this.empty = false;
      // console.log(key);
      this.addAll = {
        code: 0,
        name: "",
        seqno: 0,
        tableType: "",
      };
      if (key == 1) {
        this.StateAllShutDownFun();
        this.switchhazards = true;
      } else if (key == 2) {
        this.StateAllShutDownFun();
        this.switchevaluate = true;
      } else if (key == 3) {
        this.StateAllShutDownFun();
        this.switchIndustry = true;
      } else if (key == 4) {
        this.StateAllShutDownFun();
        this.switchJobs = true;
      } else if (key == 5) {
        this.StateAllShutDownFun();
        this.switchIrradiation = true;
      } else if (key == 6) {
        this.StateAllShutDownFun();
        this.switchRadiation = true;
      } else if (key == 7) {
        this.StateAllShutDownFun();
        this.switchObjective = true;
      } else if (key == 8) {
        this.StateAllShutDownFun();
        this.switchSuggestion = true;
      } else if (key == 9) {
        this.StateAllShutDownFun();
        this.switchOccupation = true;
      } else if (key == 10) {
        this.StateAllShutDownFun();
        this.switchrelevancy = true;
      }
    },
    // 关闭全部数据框
    StateAllShutDownFun() {
      this.switchhazards = false;
      this.switchevaluate = false;
      this.switchIndustry = false;
      this.switchJobs = false;
      this.switchIrradiation = false;
      this.switchRadiation = false;
      this.switchObjective = false;
      this.switchSuggestion = false;
      this.switchOccupation = false;
      this.switchrelevancy = false;
    },
    // ------------------------获取字典数据回调
    // 获取职业病危害因素列表数据
    handelObtainhHazards() {
      getDicOccupation({ tablename: "Dic_occupation_harm" }).then((res) => {
        this.hazards = res.data;
      });
    },
    // 获取职业病评价字典列表数据
    handelObtainhEvaluate(key) {
      getDicOccupation({ tablename: "Dic_evaluate_word" }).then((res) => {
        console.log(res);
        this.evaluate = res.data;
      });
    },
    // 职业病行业字典
    handelObtainhIndustry() {
      getOccupationalDiseaseLoad({ type: "1" }).then((res) => {
        console.log(res);
        res.data && (this.Industry = res.data);
      });
    },
    // 职业病工种字典
    handelObtainhJobs() {
      getOccupationalDiseaseLoad({ type: "2" }).then((res) => {
        console.log(res);
        res.data && (this.Jobs = res.data);
      });
    },
    // 职业病照射种类
    handelObtainhIrradiation() {
      getOccupationalDiseaseLoad({ type: "3" }).then((res) => {
        console.log(res);
        res.data && (this.Irradiation = res.data);
      });
    },
    // 职业病放射种类
    handelObtainhRadiation() {
      getOccupationalDiseaseLoad({ type: "4" }).then((res) => {
        console.log(res);
        res.data && (this.Radiation = res.data);
      });
    },
    // 职业病体检目的
    handelObtainhObjective() {
      getOccupationalDiseaseLoad({ type: "5" }).then((res) => {
        console.log(res);
        res.data && (this.Objective = res.data);
      });
    },
    // 职业病复查建议
    handelObtainhSuggestion() {
      getOccupationalDiseaseLoad({ type: "6" }).then((res) => {
        console.log(res);
        res.data && (this.Suggestion = res.data);
      });
    },
    // 职业病职业建议
    handelObtainhOccupation() {
      getOccupationalDiseaseLoad({ type: "7" }).then((res) => {
        console.log(res);
        res.data && (this.Occupation = res.data);
      });
    },
    //  职业病关联危害
    handelObtainhrelevancy() {
      getOccupationalDiseaseLoad({ type: "8" }).then((res) => {
        console.log(res);
        res.data && (this.Occupation = res.data);
      });
    },
    // ------------------------ 添加回调
    // 点击添加职业病危害因素
    handelAddHazards() {
      getCreate({
        occupationharmitem: this.addhazards,
      }).then((res) => {
        if (res.code == 200) {
          // 获取职业病危害因素列表数据
          this.handelObtainhHazards();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病评价字典
    handelAddEvaluate() {
      getCreate({
        evaluateworditem: this.addevaluate,
      }).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhEvaluate();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病行业字典
    handelIndustry() {
      this.addAll.tableType = "1";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhIndustry();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病工种字典
    handelJobs() {
      this.addAll.tableType = "2";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhJobs();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病照射科
    handelIrradiation() {
      this.addAll.tableType = "3";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhIrradiation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病放射科
    handelRadiation() {
      this.addAll.tableType = "4";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhRadiation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病体检目的
    handelObjective() {
      this.addAll.tableType = "5";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhObjective();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病复查建议
    handelSuggestion() {
      this.addAll.tableType = "6";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhSuggestion();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病 职业建议
    handelOccupation() {
      this.addAll.tableType = "7";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhOccupation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 点击添加职业病 职业建议
    handeldelrelevancy() {
      this.addAll.tableType = "7";
      getOccupationalDiseaseAdd(this.addAll).then((res) => {
        if (res.code == 200) {
          console.log(res);
          this.handelObtainhOccupation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 清空表单
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields();
      });
    },
    // 添加数据到删除、编辑列表
    handleSelectChange(row) {
      console.log(row);
      this.codeset = row;
      if (row.length == 1) {
        this.changeFormVisible1 = true;
        this.changeFormVisible2 = true;
        this.editcodeset = row[0];
      } else if (row.length == 0 || row.length > 1) {
        this.changeFormVisible1 = false;
        this.changeFormVisible2 = false;
      }
      // if (row.length > 0) {
      // 	if (row.length == 1) {
      // 		// 长度等于一添加到编辑列表
      // 		this.editcodeset = row[0]
      // 		console.log(this.editcodeset,'编辑数组');
      // 	}
      // 	for (let i = 0; i < row.length; i++) {
      // 		this.codeset.push(row[i].code)
      // 	}
      // 	console.log(this.codeset,'删除数组');
      // }else if (row.length == 0) {
      // 	// 取消勾选清空列表
      // 	this.codeset = []
      // 	this.editcodeset = {}
      // 	console.log(this.editcodeset);
      // }
    },
    // ---------------------------编辑按钮回调
    // 调用编辑职业危害因素接口
    handelEditHazards() {
      console.log("调用编辑职业危害因素接口");
      getUpadate({
        occupationharmitem: this.editcodeset,
      }).then((res) => {
        if (res.code == 200) {
          // 获取职业病危害因素列表数据
          this.handelObtainhHazards();
          this.$message({
            showClose: true,
            message: "修改成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病评价字典接口
    handelEditEvaluate() {
      console.log("调用编辑职业病评价字典接口");
      getUpadate({
        evaluateworditem: this.editcodeset,
      }).then((res) => {
        if (res.code == 200) {
          this.handelObtainhEvaluate();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 行业 字典接口
    handelEditIndustry() {
      console.log("调用编辑职业病行业字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhIndustry();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 工种 字典接口
    handelEditJobs() {
      console.log("调用编辑职业病工种字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhJobs();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 照射科 字典接口
    handelEditIrradiation() {
      console.log("调用编辑职业病照射科字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhIrradiation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 放射科 字典接口
    handelEditRadiation() {
      console.log("调用编辑职业病放射科字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhRadiation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 体检目的 字典接口
    handelEditObjective() {
      console.log("调用编辑职业病体检目的字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhObjective();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 复查建议 字典接口
    handelEditSuggestion() {
      console.log("调用编辑职业病复查建议字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhSuggestion();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // 调用编辑职业病 职业建议 字典接口
    handelEditOccupation() {
      console.log("调用编辑职业病复查建议字典接口");
      getOccupationalDiseaseUpdate(this.editcodeset).then((res) => {
        if (res.code == 200) {
          this.handelObtainhOccupation();
          this.$message({
            showClose: true,
            message: "添加成功",
            type: "success",
          });
        }
      });
    },
    // ------------------------------ 删除回调
    // 删除职业病危害因素数据
    delHazards() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getDelete({
            codes,
            tablename: "Dic_occupation_harm",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhHazards();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病评价字典数据
    delEvaluate() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getDelete({
            codes,
            tablename: "Dic_evaluate_word",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhEvaluate();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病行业字典数据
    delIndustry() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "1",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhIndustry();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病工种字典数据
    delJobs() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "2",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhJobs();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病照射科 数据
    delIrradiation() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "3",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhIrradiation();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病放射科 数据
    delRadiation() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "4",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhRadiation();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病体检目的 数据
    delObjective() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "5",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhObjective();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病复查建议 数据
    delSuggestion() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "6",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhSuggestion();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病职业建议 数据
    delOccupation() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "7",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhOccupation();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // 删除职业病职业建议 数据
    delrelevancy() {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.codeset.map((i) => {
            return i.code;
          });
          getOccupationalDiseaseDelete({
            ids: codes,
            tablename: "8",
          }).then((res) => {
            if (res.code == 200) {
              this.handelObtainhrelevancy();
              this.$message({
                showClose: true,
                message: "删除成功",
                type: "success",
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // -------------------------------按钮组回调
    // 职业病危害因素按钮回调
    hadnleOnBtnClicked1(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible1 = true;
          this.resetForm("addhazards");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible1 = this.changeFormVisible1;
          this.editremind();
          break;
        case "btnDel": // 删除
          this.delHazards();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病评价字典按钮回调
    hadnleOnBtnClicked2(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible2 = true;
          this.resetForm("addevaluate");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible2 = this.changeFormVisible2;
          this.editremind();
          break;
        case "btnDel": // 删除
          this.delEvaluate();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病行业字典按钮回调
    hadnleOnBtnClicked3(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible3 = true;
          this.resetForm("addIndustry");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible3 = this.changeFormVisible3;
          console.log(this.codeset);
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible3 = true;
          }
          break;
        case "btnDel": // 删除
          this.delIndustry();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病工种字典按钮回调
    hadnleOnBtnClicked4(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible4 = true;
          this.resetForm("addJobs");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible4 = this.changeFormVisible4;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible4 = true;
          }
          break;
        case "btnDel": // 删除
          this.delJobs();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病照射科字典按钮回调
    hadnleOnBtnClicked5(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible5 = true;
          this.resetForm("addIrradiation");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible5 = this.changeFormVisible5;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible5 = true;
          }
          break;
        case "btnDel": // 删除
          this.delIrradiation();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病放射科字典按钮回调
    hadnleOnBtnClicked6(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible6 = true;
          this.resetForm("addRadiation");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible6 = this.changeFormVisible6;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible6 = true;
          }
          break;
        case "btnDel": // 删除
          this.delRadiation();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病体检目的字典按钮回调
    hadnleOnBtnClicked7(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible7 = true;
          this.resetForm("addObjective");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible7 = this.changeFormVisible7;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible7 = true;
          }
          break;
        case "btnDel": // 删除
          this.delObjective();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病复查建议字典按钮回调
    hadnleOnBtnClicked8(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible8 = true;
          this.resetForm("Suggestion");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible8 = this.changeFormVisible8;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible8 = true;
          }
          break;
        case "btnDel": // 删除
          this.delSuggestion();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病职业建议字典按钮回调
    hadnleOnBtnClicked9(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.dialogFormVisible9 = true;
          this.resetForm("Occupation");
          break;
        case "btnEdit": // 编辑
          this.editFormVisible9 = this.changeFormVisible9;
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.editFormVisible9 = true;
          }
          break;
        case "btnDel": // 删除
          this.delOccupation();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 职业病 关联危害 字典按钮回调
    hadnleOnBtnClicked10(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.$router.push({
            path: "/dicoccupation/dicoccupationadd",
          });
          break;
        case "btnEdit": // 编辑
          this.open = this.codeset;
          if (this.open.length > 1) {
            this.$message({
              showClose: true,
              message: "只能选择一条数据",
              type: "error",
            });
          } else if (this.open.length < 1) {
            this.$message({
              showClose: true,
              message: "至少选择一条数据",
              type: "error",
            });
          } else {
            this.$router.push({
              path: "/dicoccupation/dicoccupationedit",
              query: {},
            });
          }
          break;
        case "btnDel": // 删除
          this.delOccupation();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
  },

  watch: {},

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },
};
</script>

<style lang='scss' scoped>
@import "./css/index.scss";
</style>
