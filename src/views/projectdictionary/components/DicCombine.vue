<template>
  <div class="dic_combine">
    <div class="btn_group">
      <el-button type="danger" size="mini" @click="handleAddProject">添加项目</el-button>
      <el-button type="primary" size="mini" @click="handleSubmit">保存</el-button>
      <el-button type="warning" size="mini" @click="handleClosePage">关闭</el-button>
    </div>
    <div class="content">
      <el-row class="content_box">
        <el-col class="page_form_box form_col" :span="17">
          <el-tag size="medium" style="width: 70px">基本信息</el-tag>
          <el-form
            ref="form"
            :rules="rules"
            class="page_form"
            :model="form"
            label-width="120px"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="组合编码">
                  <el-input
                    disabled
                    v-model="form.code"
                    clearable
                    placeholder="系统自动生成"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" prop="name" label="组合名称">
                  <el-input v-model="form.name" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" prop="deptcode" label="科室名称">
                  <el-select
                    v-model="form.deptcode"
                    clearable
                    @change="handleChangeDeptcode"
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in deptItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="组合价格">
                  <el-input v-model="form.price" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="性别">
                  <el-select v-model="form.sex" clearable filterable placeholder="请选择">
                    <el-option
                      v-for="(item, index) in sexItem"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" prop="resulttype" label="结果类型">
                  <el-select
                    v-model="form.resulttype"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in resultTypeItem"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" prop="resultinput" label="结果输入">
                  <el-select
                    v-model="form.resultinput"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in resultInputItem"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" prop="viewgroup" label="显示分组">
                  <el-select
                    v-model="form.viewgroup"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in viewGroupItem"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="标本类型">
                  <el-select
                    v-model="form.samplecode"
                    clearable
                    filterable
                    placeholder="请选择"
                    @change="handleChangeMergeCode"
                  >
                    <el-option
                      v-for="(item, index) in sampleitems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="标本容器">
                  <el-select
                    v-model="form.containercode"
                    @change="handleChangeMergeCode"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in containeritems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="合并编码">
                  <el-input v-model="form.mergecode" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="检查地点">
                  <el-input v-model="form.location" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="数据接口">
                  <!-- <el-input v-model="form.interfacecode" clearable></el-input> -->
                  <el-select
                    v-model="form.interfacecode"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in interfacecodeitmes"
                      :key="index"
                      :label="item.code"
                      :value="item.code"
                    ></el-option>
                    <!-- <el-option label="LIS" value="LIS"></el-option>
                    <el-option label="BL" value="BL"></el-option>
                    <el-option label="ECG" value="ECG"></el-option>
                    <el-option label="PACS" value="PACS"></el-option>
                    <el-option label="CT" value="CT"></el-option>
                    <el-option label="MR" value="MR"></el-option>
                    <el-option label="BC" value="BC"></el-option>
                    <el-option label="C13" value="C13"></el-option> -->
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="项目数">
                  <el-input disabled v-model="form.itemtotal" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="注意事项">
                  <el-input v-model="form.remind" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="检查意义">
                  <el-input v-model="form.purpose" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="申请单打印">
                  <el-select
                    v-model="form.billprint"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in billPrintItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="指引单打印">
                  <el-select
                    v-model="form.guideprint"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in guidePrintItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="标签打印">
                  <el-select
                    v-model="form.lableprint"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in lablePrintItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="标本采集标志">
                  <el-select
                    v-model="form.collectflag"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in colleCtflagItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="标签数量">
                  <el-input v-model="form.labletotal" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="启用状态">
                  <el-select
                    v-model="form.status"
                    clearable
                    filterable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="(item, index) in statusItems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="说明">
                  <el-input v-model="form.remark" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="排序">
                  <el-input v-model.number="form.seqno" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="默认结论">
                  <el-input v-model="form.defaultconclusion" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="微信启用标志">
                  <el-select v-model="form.wechatflag" placeholder="请选择">
                    <el-option label="不启用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="体检中心">
                  <el-select v-model="form.meccode" clearable placeholder="请选择">
                    <el-option
                      v-for="item in meccodeItems"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="允许折扣">
                  <el-select v-model="form.discountflag" placeholder="请选择">
                    <el-option label="允许" :value="0"></el-option>
                    <el-option label="不允许" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <!-- hiscombinecode hiscombinename collectcode collectname -->
              <el-col :span="8">
                <el-form-item size="small" label="HIS组合">
                  <el-select
                    v-model="form.hiscombinecode"
                    @change="handleChangeHisCombine"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in hiscombineItems"
                      :key="item.code"
                      :label="`${item.code} ${item.name}`"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="采集方法">
                  <el-select
                    v-model="form.collectcode"
                    @change="handleChangeCollect"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in collectItems"
                      :key="item.code"
                      :label="`${item.code} ${item.name}`"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="早餐">
                  <el-select v-model="form.eattype" placeholder="请选择">
                    <el-option label="无" :value="0"></el-option>
                    <el-option label="餐前体检" :value="1"></el-option>
                    <el-option label="餐后体检" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="分诊标志">
                  <el-select v-model="form.triagflag" placeholder="请选择">
                    <el-option label="需分诊" :value="0"></el-option>
                    <el-option label="无需分诊" :value="1"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="检查时间">
                  <el-input v-model.number="form.checktime" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="检查次数">
                  <el-input v-model.number="form.checkfrequency" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="人体部位">
                  <el-select v-model="form.bodypartcode" placeholder="请选择">
                    <el-option
                      v-for="item in body_partData"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="排斥组合">
                  <el-select
                    v-model="form.rejectcombinecode"
                    filterable
                    clearable
                    multiple
                    collapse-tags
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in rejectItems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item size="small" label="关联组合">
                  <el-select
                    v-model="form.relatecombinecode"
                    filterable
                    clearable
                    multiple
                    collapse-tags
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in relateItems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item size="small" label="组合大类">
                  <el-select
                    v-model="form.category"
                    filterable
                    clearable
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in categoryItems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="list_tips">
            备注：数据接口类型LIS-检验，BL-病理，ECG-心电图，PACS-彩超，CT-CT，BC-B超，MR-MR
          </div>
        </el-col>
        <el-col class="page_form_box" :span="8">
          <el-tag size="medium">已包含{{ form.dicitems.length }}个项目</el-tag>
          <EasyTable
            height="100%"
            class="page_data"
            :loading="loading"
            :data="form.dicitems"
            :tableOptions="pageOptions"
            :checkbox-config="{ rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :cell-style="{ padding: '0' }"
          />
        </el-col>
      </el-row>
    </div>
    <!-- 添加项目 -->
    <el-dialog
      title="添加项目"
      class="project_dia"
      top="5%"
      :close-on-click-modal="false"
      width="90%"
      :visible.sync="showProjectDialog"
    >
      <!-- 搜索盒子 -->
      <div class="search_box">
        <el-tag type="success">检查科室：</el-tag>
        <el-select
          size="small"
          v-model="department"
          @change="handleChangeDepart"
          filterable
          clearable
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in deptItems"
            :key="index"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-input
          placeholder="请输入内容"
          v-model="searchName"
          @clear="handleSearchName"
          @keyup.native.enter="handleSearchName"
          clearable
          size="small"
        >
        </el-input>
        <el-button icon="el-icon-search" size="small" plain @click="handleSearchName"
          >搜索</el-button
        >
        <el-button
          v-if="activeName == 'second'"
          type="primary"
          size="small"
          plain
          @click="handleSetCurrent"
          >确 认</el-button
        >
      </div>
      <el-tabs v-model="activeName" type="card" class="project_content_box">
        <el-tab-pane label="项目信息" name="first">
          <!-- 主体表格 -->
          <el-row class="project_content">
            <el-col :span="11">
              <el-tag size="medium">项目信息</el-tag>
              <vxe-table
                ref="projectData"
                class="project_data"
                height="650"
                border="inner"
                :loading="loading"
                highlight-hover-row
                :data="projectData"
                :checkbox-config="{ trigger: 'row' }"
                @checkbox-change="handleSelectProject"
                @checkbox-all="handleSelectProjectAll"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
              >
                <vxe-table-column
                  type="checkbox"
                  width="40px"
                  :reserve-selection="true"
                ></vxe-table-column>
                <vxe-table-column
                  field="code"
                  title="项目编码"
                  show-header-overflow
                  show-overflow="title"
                  width="140px"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="name"
                  title="项目名称"
                  show-header-overflow
                  min-width="140px"
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="encode"
                  title="项目简称"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                  width="140px"
                ></vxe-table-column>
                <vxe-table-column
                  field="deptname"
                  title="科室名称"
                  width="140px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
              </vxe-table>
              <!-- <EasyTable
                height="100%"
                class="project_data"
                :loading="loading"
                :data="projectData"
                :tableOptions="projectOptions"
                :checkbox-config="{ rowClick: true }"
                @selected-change="handleSelectProject"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              /> -->
            </el-col>
            <el-col :span="3" class="btn_group">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-top"
                @click="handleMoveTop"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-bottom"
                @click="handleMoveBottom"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-right"
                @click="handleMoveRight"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="el-icon-back"
                @click="handleMoveLeft"
              ></el-button>
            </el-col>
            <el-col :span="10">
              <el-tag size="medium">已包含{{ form.dicitems.length }}个项目</el-tag>
              <vxe-table
                ref="addProjectData"
                class="add_project_data"
                height="650"
                border="inner"
                :loading="loading"
                highlight-hover-row
                :data="form.dicitems"
                :checkbox-config="{ trigger: 'row' }"
                @checkbox-change="handleSelectDicitems"
                @checkbox-all="handleSelectDicitemsAll"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
              >
                <vxe-table-column
                  type="checkbox"
                  width="40px"
                  :reserve-selection="true"
                ></vxe-table-column>
                <vxe-table-column
                  field="code"
                  title="项目编码"
                  show-header-overflow
                  width="140px"
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="name"
                  title="项目名称"
                  min-width="140px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="mustflag"
                  title="必录"
                  width="140px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                >
                  <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.mustflag">
                      <el-option label="是" :value="1"></el-option>
                      <el-option label="否" :value="0"></el-option>
                    </el-select>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="summaryflag"
                  title="进小结"
                  show-header-overflow
                  show-overflow="title"
                  width="140px"
                  show-footer-overflow
                >
                  <template slot-scope="scope">
                    <el-select size="mini" v-model="scope.row.summaryflag">
                      <el-option label="是" :value="0"></el-option>
                      <el-option label="否" :value="1"></el-option>
                    </el-select>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="deptname"
                  title="科室名称"
                  show-header-overflow
                  width="140px"
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
              </vxe-table>
              <!-- <EasyTable
                height="100%"
                class="add_project_data"
                :data="form.dicitems"
                :tableOptions="addProjectOptions"
                :checkbox-config="{ rowClick: true }"
                @selected-change="handleSelectDicitems"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              /> -->
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="组合信息" name="second">
          <div class="combination_box">
            <!-- 主体表格 -->
            <el-row class="project_content">
              <el-col class="hhh" :span="12">
                <vxe-table
                  ref="projectData"
                  height="650"
                  border="inner"
                  :loading="loading"
                  highlight-hover-row
                  :data="combineList"
                  :checkbox-config="{ trigger: 'row' }"
                  @checkbox-change="handleSelectItemList"
                  @checkbox-all="handleSelectItemListAll"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                >
                  <vxe-table-column
                    type="checkbox"
                    width="40px"
                    :reserve-selection="true"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="code"
                    title="组合编码"
                    show-header-overflow
                    width="140px"
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="name"
                    title="组合名称"
                    min-width="400px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="deptname"
                    title="科室名称"
                    width="140px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                </vxe-table>
              </el-col>
              <el-col class="hhh" :span="12">
                <vxe-table
                  ref="selectCombineListRef"
                  height="650"
                  border="inner"
                  :loading="loading"
                  highlight-hover-row
                  :data="selectCombineList"
                  :checkbox-config="{ trigger: 'row' }"
                  @checkbox-change="handleSlectCombineList"
                  @checkbox-all="handleSlectCombineListAll"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                >
                  <vxe-table-column
                    type="checkbox"
                    width="40px"
                    :reserve-selection="true"
                  ></vxe-table-column>
                  <vxe-table-column
                    field="itemcode"
                    title="项目编码"
                    show-header-overflow
                    width="140px"
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="itemname"
                    title="项目名称"
                    min-width="140px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                  <vxe-table-column
                    field="mustflag"
                    title="必录"
                    width="140px"
                    show-header-overflow
                    show-overflow="title"
                    show-footer-overflow
                  >
                    <template slot-scope="scope">
                      <el-select size="mini" v-model="scope.row.mustflag">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                      </el-select>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="summaryflag"
                    title="进小结"
                    show-header-overflow
                    show-overflow="title"
                    width="140px"
                    show-footer-overflow
                  >
                    <template slot-scope="scope">
                      <el-select size="mini" v-model="scope.row.summaryflag">
                        <el-option label="是" :value="0"></el-option>
                        <el-option label="否" :value="1"></el-option>
                      </el-select>
                    </template>
                  </vxe-table-column>
                  <vxe-table-column
                    field="deptname"
                    title="科室名称"
                    show-header-overflow
                    width="140px"
                    show-overflow="title"
                    show-footer-overflow
                  ></vxe-table-column>
                </vxe-table>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDicItemList,
  getDicItemDetail,
  getDicCombineDetail,
  setDicCombineCreate,
  setDicCombineUpdate,
  getDictionaryDicLoad,
  getbodyDicLoad,
  getDicCombineList,
  getDicCombineItemList,
} from "@/api/projectdictionary2.js";
// 引入页面接口
import { getPublicConfig } from "@/api/personalregister.js";
import { deepEqual } from "assert";
export default {
  name: "",

  components: {},
  props: {
    // "新增或编辑标志"
    dicCombineId: {
      type: String,
      require: true,
    },
  },

  data() {
    return {
      ssCombineList: [],
      combineList: [], // 弹框组合列表数据
      selectCombineList: [], // 弹框组合列表选中数据
      activeName: "first",
      hiscombineItems: [],
      collectItems: [],
      loading: false, //表格加载特效
      form: {
        name: "",
        deptcode: "",
        price: 0,
        sex: 0,
        resulttype: "",
        resultinput: 0,
        viewgroup: "",
        samplecode: "",
        containercode: "",
        mergecode: "",
        location: "",
        interfacecode: "",
        itemtotal: "",
        remind: "",
        purpose: "",
        defaultconclusion: "",
        guideprint: 0,
        lableprint: 0,
        billprint: 0,
        collectflag: 0,
        labletotal: 0,
        remark: "",
        status: 0,
        pycode: "",
        wbcode: "",
        seqno: 0,
        wechatflag: 0,
        discountflag: 0,
        eattype: 0,
        triagflag: 0,
        checktime: 0,
        checkfrequency: 0,
        meccode: "",
        hiscombinecode: "",
        hiscombinename: "",
        collectcode: "",
        collectname: "",
        dicitems: [],
        items: [],
        bodypartcode: "",
        category: "",
        rejectcombinecode: [],
        relatecombinecode: [],
      }, // 主体表单数据
      rules: {
        name: [{ required: true, message: "该内容不能为空", trigger: "blur" }],
        deptcode: [{ required: true, message: "该内容不能为空", trigger: "change" }],
        resulttype: [{ required: true, message: "该内容不能为空", trigger: "change" }],
        resultinput: [{ required: true, message: "该内容不能为空", trigger: "change" }],
        viewgroup: [{ required: true, message: "该内容不能为空", trigger: "change" }],
      },
      deptItems: [], // 筛选科室下拉数据回调
      department: "", // 选中科室code
      searchName: "", // 添加项目搜索关键字
      sexItem: [
        {
          code: 0,
          name: "未知",
        },
        {
          code: 1,
          name: "男",
        },
        {
          code: 2,
          name: "女",
        },
      ],
      resultTypeItem: [
        {
          code: "01",
          name: "基础检查",
        },
        {
          code: "02",
          name: "常规检验",
        },
        {
          code: "03",
          name: "细菌检验",
        },
        {
          code: "04",
          name: "功能检查",
        },
      ],
      resultInputItem: [
        {
          code: 0,
          name: "手工输入",
        },
        {
          code: 1,
          name: "接口获取",
        },
      ],
      viewGroupItem: [
        {
          code: "1",
          name: "基础类",
        },
        {
          code: "2",
          name: "检验类",
        },
        {
          code: "3",
          name: "功能类",
        },
      ],
      billPrintItems: [
        {
          code: 0,
          name: "打印",
        },
        {
          code: 1,
          name: "不打印",
        },
      ],
      guidePrintItems: [
        {
          code: 0,
          name: "打印",
        },
        {
          code: 1,
          name: "不打印",
        },
      ],
      lablePrintItems: [
        {
          code: 0,
          name: "打印",
        },
        {
          code: 1,
          name: "不打印",
        },
      ],
      colleCtflagItems: [
        {
          code: 0,
          name: "不采集",
        },
        {
          code: 1,
          name: "采集",
        },
      ],
      statusItems: [
        {
          code: 0,
          name: "启用",
        },
        {
          code: 1,
          name: "停用",
        },
      ],
      sampleitems: [],
      containeritems: [],
      showProjectDialog: false, // 添加项目弹框
      projectData: [], // 项目主体数据
      selectProject: [], // 项目主体选中数据
      selectDicitems: [], // 已添加项目数据
      meccodeItems: [], // 体检中心集
      interfacecodeitmes: [],
      body_partData: [], // 人体部位
      rejectItems: [], // 排斥组合
      relateItems: [], // 排斥组合
      categoryItems: [], // 组合大类
    };
  },
  computed: {
    //   主体表格数据
    pageOptions() {
      return [
        {
          title: "项目编码",
          prop: "code",
        },
        {
          title: "项目名称",
          prop: "name",
          omit: 1,
        },
        {
          title: "项目简称",
          prop: "encode",
        },
        {
          title: "必录",
          prop: "mustflag",
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "进小结",
          prop: "summaryflag",
          returnVal: (value) => {
            return value == 0 ? "是" : "否";
          },
        },
        {
          title: "科室名称",
          prop: "deptname",
        },
      ];
    },
    // 项目主体表格配置
    projectOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "项目编码",
          prop: "code",
        },
        {
          title: "项目名称",
          prop: "name",
          omit: 1,
        },
        {
          title: "项目简称",
          prop: "encode",
        },
        {
          title: "科室名称",
          prop: "deptname",
        },
      ];
    },
    // 添加项目表格配置
    addProjectOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "项目编码",
          prop: "code",
        },
        {
          title: "项目名称",
          width: 280,
          prop: "name",
          omit: 1,
        },
        // {
        //   title: "项目简称",
        //   prop: "encode",
        // },
        {
          title: "必录",
          prop: "mustflag",
          render: (h, data) => {
            return (
              <el-select size="mini" v-model={data.mustflag}>
                <el-option label="是" value={1}></el-option>
                <el-option label="否" value={0}></el-option>
              </el-select>
            );
          },
        },
        {
          title: "进小结",
          prop: "summaryflag",
          render: (h, data) => {
            return (
              <el-select size="mini" v-model={data.summaryflag}>
                <el-option label="否" value={1}></el-option>
                <el-option label="是" value={0}></el-option>
              </el-select>
            );
          },
        },
        {
          title: "科室名称",
          prop: "deptname",
        },
      ];
    },
  },

  mounted() {
    this.getBodyData();
    this.handleGetDicCombineDetail();
    getDictionaryDicLoad({ tableName: "Dic_Medical_center" }).then((res) => {
      if (!res.data) return false;
      this.meccodeItems = res.data;
    });
    getPublicConfig({ cc: "HisCombine" }).then((res) => {
      this.hiscombineItems = res.result;
    });
    getPublicConfig({ cc: "HisCombineCollect" }).then((res) => {
      this.collectItems = res.result;
    });
    getPublicConfig({ cc: "CombineCategory" }).then((res) => {
      this.categoryItems = res.result;
    });
    getDicCombineList({
      page: 1,
      limit: 10000,
      key: "",
      deptname: "",
    }).then((res) => {
      this.rejectItems = res.data;
      this.relateItems = res.data;
      this.combineList = res.data;
    });
  },

  methods: {
    // 设置当前组合项目
    handleSetCurrent() {
      let data = [...this.form.dicitems, ...this.ssCombineList];
      let map = new Map();
      for (let item of data) {
        map.set(item.itemcode, item);
      }
      this.form.dicitems = [...map.values()];
      this.showProjectDialog = false;
    },
    handleSlectCombineList({ records }) {
      this.ssCombineList = records;
    },
    handleSlectCombineListAll({ records }) {
      this.ssCombineList = records;
    },
    handleSelectItemList({ records }) {
      let data = records.map((k) => k.code);
      getDicCombineItemList(data).then((res) => {
        if (!res.result) {
          this.selectCombineList = [];
          return;
        }
        let map = new Map();
        for (let item of res.result) {
          map.set(item.itemcode, item);
        }
        this.selectCombineList = [...map.values()];
        this.$nextTick(() => {
          this.$refs.selectCombineListRef.setAllCheckboxRow(true);
        });
      });
    },
    handleSelectItemListAll({ records }) {
      let data = records.map((k) => k.code);
      getDicCombineItemList(data).then((res) => {
        if (!res.result) {
          this.selectCombineList = [];
          return;
        }
        let map = new Map();
        for (let item of res.result) {
          map.set(item.itemcode, item);
        }
        this.selectCombineList = [...map.values()];
        this.$nextTick(() => {
          this.$refs.selectCombineListRef.setAllCheckboxRow(true);
        });
      });
    },
    handleChangeDeptcode(value) {
      if (value) {
        let temp = this.deptItems.filter((k) => {
          return k.code === value;
        })[0];
        if (!temp) return;
        if (temp.name === "检验科") {
          this.form.location = "请到体检中心抽血处抽血";
        } else {
          this.form.location = "";
        }
      } else {
        this.form.location = "";
      }
    },
    handleChangeMergeCode() {
      if (this.form.samplecode == "" && this.form.containercode == "") {
        this.form.mergecode = "";
      } else {
        this.form.mergecode = `${this.form.samplecode}-${this.form.containercode}`;
      }
    },
    handleChangeHisCombine(val) {
      if (!val) {
        this.form.hiscombinename = "";
      } else {
        let index = this.hiscombineItems.findIndex((k) => k.code === val);
        index != -1 && (this.form.hiscombinename = this.hiscombineItems[index].name);
      }
    },
    handleChangeCollect(val) {
      if (!val) {
        this.form.collectname = "";
      } else {
        let index = this.collectItems.findIndex((k) => k.code === val);
        index != -1 && (this.form.collectname = this.collectItems[index].name);
      }
    },
    // 提交
    handleSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          let dataCom = JSON.parse(JSON.stringify(this.form.dicitems));
          this.form.items = dataCom.map((k) => {
            return {
              itemcode: k.code,
              mustflag: k.mustflag,
              summaryflag: k.summaryflag,
            };
          });
          if (this.form.rejectcombinecode) {
            this.form.rejectcombinecode = this.form.rejectcombinecode.join(",");
          }
          if (this.form.relatecombinecode) {
            this.form.relatecombinecode = this.form.relatecombinecode.join(",");
          }
          if (this.dicCombineId == "") {
            setDicCombineCreate({ ...this.form }).then((res) => {
              this.$message.success(res.message);
              this.handleClosePage(); // 关闭回调
            });
          } else {
            setDicCombineUpdate({ ...this.form }).then((res) => {
              this.$message.success(res.message);
              this.handleClosePage(); // 关闭回调
            });
          }
        }
      });
    },
    // 项目数据上移回调
    handleMoveTop() {
      if (this.selectDicitems.length !== 1) {
        this.$message.warning("请勾选一个项目进行移动!");
        return false;
      }
      let index = this.form.dicitems.findIndex(
        (k) => k.code == this.selectDicitems[0].code
      );
      if (index == 0) {
        this.$message.warning("当前数据已移动到最顶部!");
        return false;
      }
      this.form.dicitems.splice(index, 1);
      this.form.dicitems.splice(index - 1, 0, this.selectDicitems[0]);
    },
    // 项目数据下移回调
    handleMoveBottom() {
      if (this.selectDicitems.length !== 1) {
        this.$message.warning("请勾选一个项目进行移动!");
        return false;
      }
      let index = this.form.dicitems.findIndex(
        (k) => k.code == this.selectDicitems[0].code
      );
      if (index == this.form.dicitems.length - 1) {
        this.$message.warning("当前数据已移动到最底部!");
        return false;
      }
      this.form.dicitems.splice(index, 1);
      this.form.dicitems.splice(index + 1, 0, this.selectDicitems[0]);
    },
    // 项目数据右移回调
    handleMoveRight() {
      if (this.selectProject.length == 0) {
        this.$message.warning("请选择要添加的项目!");
        return false;
      }
      //遍历获得多选选中的index值 -- 删除选中数据
      this.selectProject.forEach((value, index) => {
        //遍历多选框获取的数据
        this.projectData.forEach((v, i) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.code == v.code) {
            this.projectData.splice(i, 1);
          }
        });
      });
      this.form.dicitems.push(...this.selectProject); //  移动选中数据
      this.selectProject = []; // 重置勾选数组
    },
    // 项目数据左移回调
    handleMoveLeft() {
      if (this.selectDicitems.length == 0) {
        this.$message.warning("请选择要取消的项目!");
        return false;
      }
      //遍历获得多选选中的index值 -- 删除选中数据
      this.selectDicitems.forEach((value, index) => {
        //遍历多选框获取的数据
        this.form.dicitems.forEach((v, i) => {
          //遍历数据表，任意一个属性值相同，则说明该数据被选中，其i则为索引值
          if (value.code == v.code) {
            this.form.dicitems.splice(i, 1);
          }
        });
      });
      this.projectData.push(...this.selectDicitems); //  移动选中数据
      this.selectDicitems = []; // 重置勾选数组
    },
    // 项目主体表格数据选中回调
    handleSelectProject({ records }) {
      this.selectProject = records;
    },
    // 项目主体表格数据选中回调-全选
    handleSelectProjectAll({ records }) {
      this.selectProject = records;
    },
    // 已添加项目表格数据选中回调
    handleSelectDicitems({ records }) {
      this.selectDicitems = records;
    },
    // 已添加项目表格数据选中回调
    handleSelectDicitemsAll({ records }) {
      this.selectDicitems = records;
    },
    //   获取项目字典列表数据回调
    handleGetDicItemList() {
      this.loading = true;
      getDicItemList({
        page: 1,
        limit: 100000,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        if (this.form.dicitems.length == 0) {
          this.projectData = res.data;
        } else {
          this.projectData = [];
          res.data.forEach((item) => {
            if (this.form.dicitems.findIndex((k) => k.code == item.code) === -1) {
              this.projectData.push(item);
            }
          });
        }
        this.projectData = this.projectData.map((k) => {
          return {
            ...k,
            mustflag: 0,
          };
        });
        this.loading = false;
      });
    },
    // 筛选科室改变回调
    handleChangeDepart() {
      this.handleGetDicItemList();
    },
    // 添加项目输入框回调
    handleSearchName() {
      this.handleGetDicItemList();
    },
    // 点击添加项目回调
    handleAddProject() {
      console.log(this.form.dicitems);
      this.showProjectDialog = true;
      this.activeName = "first";
      this.handleGetDicItemList();
    },
    // 组合字典详情回调
    handleGetDicCombineDetail() {
      getDicCombineDetail({ code: this.dicCombineId }).then((res) => {
        console.log(res, "200123");
        if (this.dicCombineId == "") {
          this.deptItems = res.result.deptitems;
          this.sampleitems = res.result.sampleitems;
          this.containeritems = res.result.containeritems;
          this.interfacecodeitmes = res.result.interfacecodeitmes;
        } else {
          this.form = res.result;
          this.deptItems = res.result.deptitems;
          this.sampleitems = res.result.sampleitems;
          this.containeritems = res.result.containeritems;
          this.interfacecodeitmes = res.result.interfacecodeitmes;
          if (res.result.rejectcombinecode) {
            this.form.rejectcombinecode = res.result.rejectcombinecode.split(",");
          }
          if (res.result.relatecombinecode) {
            this.form.relatecombinecode = res.result.relatecombinecode.split(",");
          }
        }
        this.$nextTick(() => {
          // DOM 更新了
          this.$refs["form"].clearValidate();
        });
      });
    },
    // 获取人体部位下拉框数据
    getBodyData() {
      getbodyDicLoad({ tableName: "Dic_body_part" }).then((res) => {
        this.body_partData = res.data;
      });
    },
    // 关闭回调
    handleClosePage() {
      this.$refs["form"].resetFields();
      this.$emit("close");
    },
    // 表头样式调整
    handleReturnStyle({ row, rowIndex }) {
      let stylejson = {};
      // stylejson.background = "#e0838f"; // 背景颜色
      // 也可以修改文字颜色
      stylejson.color = "#000";
      stylejson["font-weight"] = "bold";
      stylejson.background = "#d0ddeb";
      stylejson.height = "32px";
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
.dic_combine {
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 6px;
  padding: 15px;
  box-sizing: border-box;
  /*vxe-table 自定义行高 */
  /deep/.vxe-table .vxe-body--column.col--ellipsis {
    height: 30px;
  }
  /deep/.vxe-table .vxe-body--column:not(.col--ellipsis),
  /deep/.vxe-table .vxe-footer--column:not(.col--ellipsis),
  /deep/.vxe-table .vxe-header--column:not(.col--ellipsis) {
    padding: 5px 0;
    height: 30px;
  }

  .btn_group {
    text-align: right;
    height: 30px;
  }

  .content {
    margin-top: 20px;
    height: calc(100% - 50px);

    .content_box {
      height: 100%;
      display: flex;

      .form_col {
        margin-right: 20px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
      }

      .page_form_box {
        height: 100%;

        .page_data {
          margin-top: 15px;
          height: calc(100% - 40px);
        }

        .page_form {
          margin: 15px 0;
          // height: calc(100% - 80px);
        }

        .list_tips {
          height: 30px;
          display: flex;
          align-items: center;
          font-size: 20px;
        }

        .el-form-item {
          .el-select {
            width: 100%;
          }
        }
      }
    }
  }

  .project_dia {
    /deep/.el-dialog__header {
      background-color: #f8f8f8;
      border-bottom: 1px solid #dcdfe6;
      padding: 10px;
    }

    /deep/.el-dialog__body {
      padding: 10px;
    }

    .search_box {
      display: flex;

      .el-select,
      .el-input {
        width: 200px;
      }
    }
    .project_content_box {
      margin-top: 5px;
      /deep/.el-tabs__header {
        margin-bottom: 5px;
      }
    }
    .combination_box {
      height: 670px;
    }
    .project_content {
      height: 670px;
      .hhh {
        height: 100% !important;
        .vxe-table {
          height: 100% !important;
        }
      }
      .el-col {
        height: 100%;
      }

      .btn_group {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        .el-button {
          margin: 15px 0 0 0;
        }
      }

      .project_data,
      .add_project_data {
        margin-top: 10px;
        width: 100%;
        height: calc(100% - 40px);
      }
    }
  }
}
</style>
