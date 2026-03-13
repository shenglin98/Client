<template>
  <div class="dictionary-wrap">
    <div class="dictionary-box">
      <div class="dictionary-container flex-row">
        <div style="width: 190px; border-right: 1px solid #ccc">
          <div class="buttons-box filter-container">
            <el-button :icon="`iconfont icon-${btn.icon}`" :type="btn.class" size="mini" v-for="btn of dictionaryBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
            <!-- <div @keyup.13="handleSearchdictionaryTypes">
              <el-input placeholder="请输入内容" v-model="typesListQuery.key" size="mini" style="margin-top: 10px; width: 130px">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleSearchdictionaryTypes">搜索</el-button>
            </div> -->
          </div>
          <el-card shadow="never" class="body-small dictionary-menu-card">
            <el-tree :current-node-key="listQuery.TypeId" node-key="id" :highlight-current="true" @node-click="handleNodeClick" :data="dicTypes" :expand-on-click-node="false" default-expand-all :props="dictionaryTypeProps">
              <span class="custom-tree-node" slot-scope="{ node }">
                <span><i class="el-icon-menu" style="margin-right: 10px"></i>{{ node.label }}</span>
              </span>
            </el-tree>
          </el-card>
        </div>
        <el-main class="dictionary-content flex-item">
          <sticky :className="'sub-navbar'">
            <div class="filter-container" style="white-space: nowrap; overflow-x: auto">
              <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
              </el-input>

              <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
              <el-button :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-for="btn of typesBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
            </div>
          </sticky>
          <EasyTable v-if="pageFlag === 'Dic_Medical_center'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicMedicalCenterOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_department_type'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicDepartmentTypeOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_department'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicDepartmentOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_doctor'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicDoctorOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_sample'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicSampleOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_container'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicContainerOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_describe'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicdescribeOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <EasyTable v-if="pageFlag === 'Dic_body_part'" height="calc(100vh - 151px)" ref="mainTable" :loading="listLoading" :data="tablelist" :tableOptions="dicBodyPartsOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          <!-- <el-table
            height="calc(100vh - 151px)"
            ref="mainTable"
            :key="tableKey"
            :data="tablelist"
            v-loading="listLoading"
            fit
            highlight-current-row
            style="width: 100%"
            @row-click="rowClick"
            @selection-change="handleSelectionChange"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :cell-style="{ padding: '0' }"
          >
            <el-table-column
              type="selection"
              align="center"
              style=""
              width="55"
            ></el-table-column>
            <el-table-column
              width="85"
              prop="id"
              label="编号"
              show-overflow-tooltip
            ></el-table-column>
            <template v-for="(headerItem, index) in headerList">
              <el-table-column
                :label="headerItem.description"
                :key="index"
                v-if="
                  headerItem.key != 'id' &&
                  headerItem.key != 'delflag' &&
                  headerItem.key != 'diccode' &&
                  headerItem.key != 'seqno' &&
                  headerItem.key != 'seq' &&
                  headerItem.key != 'pycode' &&
                  headerItem.key != 'wbcode' &&
                  headerItem.key != 'hospitalcode' &&
                  headerItem.key != 'meccode' &&
                  headerItem.key != 'typecode' &&
                  headerItem.key != 'deptcode'
                "
              >
                <template slot-scope="scope">
                  <template v-if="headerItem.key == 'sex'">
                    <span>{{
                      scope.row.sex == 1
                        ? "男"
                        : scope.row.sex == 2
                        ? "女"
                        : scope.row.sex == 0
                        ? "未知"
                        : ""
                    }}</span>
                  </template>
                  <template v-else-if="headerItem.key == 'name'">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{
                      scope.row[headerItem.key]
                    }}</span>
                  </template>
                  <template v-else>
                    <span>{{ scope.row[headerItem.key] }}</span>
                  </template>
                </template>
              </el-table-column>
            </template>
            <template v-for="(headerItem, index) in headerList">
              <el-table-column
                :label="headerItem.description"
                min-width="120px"
                :key="index"
                v-if="headerItem.key == 'pycode'"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[headerItem.key] }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-for="(headerItem, index) in headerList">
              <el-table-column
                :label="headerItem.description"
                min-width="120px"
                :key="index"
                v-if="headerItem.key == 'wbcode'"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[headerItem.key] }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-for="(headerItem, index) in headerList">
              <el-table-column
                :label="headerItem.description"
                min-width="120px"
                :key="index"
                v-if="headerItem.key == 'seqno'"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[headerItem.key] }}</span>
                </template>
              </el-table-column>
            </template>
            <template v-for="(headerItem, index) in headerList">
              <el-table-column
                :label="headerItem.description"
                min-width="120px"
                :key="index"
                v-if="headerItem.key == 'seq'"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row[headerItem.key] }}</span>
                </template>
              </el-table-column>
            </template>
          </el-table> -->
          <!-- <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handleCurrentChange" /> -->
        </el-main>
      </div>
      <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="400px" title="添加分组" :visible.sync="addTypesDialog">
        <el-form ref="dictionaryTypeForm" :model="dictionaryTypesInfo" :rules="dictionaryRules" el="dictionary-tayps-form" label-width="80px">
          <el-form-item prop="name" label="字典名称">
            <el-input size="small" v-model="dictionaryTypesInfo.name"></el-input>
          </el-form-item>
          <el-form-item prop="tablename" label="字典表名">
            <el-input size="small" v-model="dictionaryTypesInfo.tablename"></el-input>
          </el-form-item>
          <el-form-item prop="Seqno" label="排序">
            <el-input size="small" oninput="value=value.replace(/[^\d]/g,'')" v-model="dictionaryTypesInfo.Seqno"></el-input>
          </el-form-item>
        </el-form>
        <div style="text-align: right; margin-top: 10px">
          <el-button size="small" type="cancel" @click="addTypesDialog = false">取消</el-button>
          <el-button size="small" :loading="saveLoading" type="primary" @click="handleAdddictionary">确定</el-button>
        </div>
      </el-dialog>

      <el-dialog v-el-drag-dialog class="dialog-mini" :close-on-click-modal="false" width="500px" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="close">
        <el-form :rules="rules" ref="dataForm" :model="temp" label-position="right" label-width="100px">
          <template v-if="temp.tableName == 'Dic_pub_dictionary'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'字典名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'说明'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_department'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'字典名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'公用编码'" prop="hiscode">
              <el-input v-model="temp.hiscode"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'科室类型'" prop="typecode">
              <el-select v-model="temp.typecode">
                <el-option v-for="(item, index) in detailsdata.typeItem" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'数据接口'" prop="interfacecode">
              <el-input v-model="temp.interfacecode"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'说明'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'总检综述排序'">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqnototalcheck"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'注册机构'" prop="hospitalcode">
              <el-select v-model="temp.hospitalcode">
                <el-option v-for="(item, index) in detailsdata.hospitalItem" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'体检中心'" prop="meccode">
              <el-select v-model="temp.meccode">
                <el-option v-for="(item, index) in detailsdata.centerItem" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'检查地点'" prop="location">
              <el-input v-model="temp.location"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_pub_dictionary_detail'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'字典名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'字典类型'" prop="diccode">
              <el-select v-model="temp.diccode">
                <el-option v-for="(item, index) in detailsdata.dictionaryItems" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'说明'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_doctor'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'医生名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'性别'" prop="sex">
              <el-select v-model="temp.sex">
                <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'工号'" prop="hiscode">
              <el-input v-model="temp.hiscode"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'科室名称'" prop="deptcode">
              <el-select v-model="temp.deptcode">
                <el-option v-for="(item, index) in detailsdata.departmentItems" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_Medical_center'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'科室名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'档案号前缀'" prop="checknoprefix">
              <el-input v-model="temp.checknoprefix"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'注册机构'" prop="hospitalcode">
              <el-select v-model="temp.hospitalcode">
                <el-option v-for="(item, index) in detailsdata.hospitalItem" :key="index" :value="item.id" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'机构地点'" prop="address">
              <el-input v-model="temp.address"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'启用标志'">
              <el-select v-model="temp.wechatflag">
                <el-option :value="0" label="启用"></el-option>
                <el-option :value="1" label="不启用"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'说明'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input v-model="temp.seqno"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'电话'" prop=" telephone">
              <el-input v-model="temp.telephone"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'图片ID'">
              <el-upload class="upload-demo" ref="upload" name="files" action :on-change="upFile" :limit="1" :file-list="fileList" :show-file-list="false" accept=".jpg,.jpeg,.png" :auto-upload="false">
                {{ temp.fileid }}
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_department_type'">
            <el-form-item size="small" :label="'字典编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'科室类型'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'说明'" prop="remark">
              <el-input v-model="temp.remark"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seqno">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_sample'">
            <el-form-item size="small" :label="'类型编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'标本类型'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'对照码'">
              <el-input v-model="temp.contcode"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seq">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seq"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_container'">
            <el-form-item size="small" :label="'容器编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'所属字典表'" prop="tableName">
              <el-select v-model="temp.tableName" :disabled="true">
                <el-option v-for="(item, index) in dictionaryTypes" :key="index" :value="item.tableName" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'容器名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seq">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seq"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_describe'">
            <el-form-item size="small" :label="'编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'类型'" prop="typecode">
              <el-select v-model="temp.typecode">
                <el-option v-for="(item, index) in describeType" :key="index" :value="item.code" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'内容'" prop="name">
              <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 6 }" v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seq">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
          <template v-if="temp.tableName == 'Dic_body_part'">
            <el-form-item size="small" :label="'编码'" prop="id">
              <el-input v-model="temp.id" :disabled="true" placeholder="系统自动生成"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'部位名称'" prop="name">
              <el-input v-model="temp.name"></el-input>
            </el-form-item>
            <el-form-item size="small" :label="'性别控制'" prop="sex">
              <el-select v-model="temp.sex">
                <el-option v-for="item in sexarr" :key="item.key" :label="item.name" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item size="small" :label="'排序'" prop="seq">
              <el-input oninput="value=value.replace(/[^\d]/g,'')" v-model="temp.seqno"></el-input>
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
          <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="updateData">确认</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import extend from "@/extensions/dicdelRows.js";
import * as dictionary from "@/api/dictionary";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import {
  getPublicConfig,
  setFilesUpload,
  getFiles,
} from "@/api/personalregister.js";
export default {
  name: "dictionary",
  components: { Sticky, Pagination },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      describeType: [],
      tabPosition: "left",
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      pageKey: 1,
      listQuery: {
        // 查询条件
        key: "",
        id: "",
        tableName: "",
        // TypeId:1,
        // tableName: "Dic_Medical_center",
      },
      tablelist: [],
      detailsdata: null,
      saveLoading: false,
      temp: {
        id: "",
        name: "",
        hospitalcode: "",
        address: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        seqnototalcheck: 0,
        delflag: 0,
        hiscode: "",
        typecode: "",
        interfacecode: "",
        meccode: "",
        location: "",
        seq: 0,
        sex: "",
        wechatflag: 0,
        deptcode: "",
        diccode: "",
        checknoprefix: "",
        contcode: "",
      },
      sexarr: [
        { key: "0", name: "未知" },
        { key: "1", name: "男" },
        { key: "2", name: "女" },
      ],
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        appId: [
          { required: true, message: "必须选择一个应用", trigger: "change" },
        ],
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sex: [{ required: true, message: "性别不能为空", trigger: "blur" }],
        hoscode: [
          { required: true, message: "机构编码不能为空", trigger: "blur" },
        ],
        deptcode: [
          { required: true, message: "科室编码不能为空", trigger: "blur" },
        ],
        typecode: [
          { required: true, message: "科室类型不能为空", trigger: "blur" },
        ],
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        diccode: [
          { required: true, message: "字典类型不能为空", trigger: "blur" },
        ],
        licensekey: [
          { required: true, message: "许可秘钥不能为空", trigger: "blur" },
        ],
        prefix: [
          { required: true, message: "号码前缀不能为空", trigger: "blur" },
        ],
        curno: [
          { required: true, message: "当前流水不能为空", trigger: "blur" },
        ],
        minno: [{ required: true, message: "最小号不能为空", trigger: "blur" }],
      },
      downloadLoading: false,
      headerList: [],
      searchdictionary: "", // 分类搜索
      addTypesDialog: false,
      updateTypesDialog: false,
      dictionaryTypes: [],
      pageFlag: "Dic_Medical_center",
      dicTypes: [
        {
          createTime: "2021-08-16 17:36:37",
          id: "10162e11-ee8c-445c-a305-455903b3cf71",
          name: "体检中心",
          seqno: 1,
          tableName: "Dic_Medical_center",
          type: 0,
        },
        {
          createTime: "2021-08-16 17:34:51",
          id: "f2098177-b41f-42aa-9e60-ba8f68a73aeb",
          name: "科室类型",
          seqno: 2,
          tableName: "Dic_department_type",
          type: 0,
        },
        {
          createTime: "2021-08-16 17:34:00",
          id: "1f8cee04-25b8-45a4-846b-900505ea0d29",
          name: "检查科室",
          seqno: 3,
          tableName: "Dic_department",
          type: 0,
        },
        {
          createTime: "2021-08-16 17:35:45",
          id: "d590b5b0-9e8a-4f1a-bd98-c2d0d6510a4d",
          name: "检查医生",
          seqno: 4,
          tableName: "Dic_doctor",
          type: 0,
        },
        {
          createTime: "2021-08-16 17:37:52",
          id: "f185a9c6-d73c-46d8-9101-69940f6a07f3",
          name: "标本类型",
          seqno: 5,
          tableName: "Dic_sample",
          type: 0,
        },
        {
          createTime: "2021-08-16 17:38:33",
          id: "11c53593-c736-4ea7-aafa-5cd3f19124b9",
          name: "标本容器",
          seqno: 6,
          tableName: "Dic_container",
          type: 0,
        },
        {
          createTime: "2021-08-16 00:00:00",
          id: "49e016b8-92ef-4150-9bcb-fe6f61199602",
          name: "结论描述",
          seqno: 7,
          tableName: "Dic_describe",
          type: 0,
        },
        {
          createTime: "2021-08-31 00:00:00",
          id: "49e016b8-92ef-4150-9bcb-fe6f61199603",
          name: "人体部位",
          seqno: 8,
          tableName: "Dic_body_part",
          type: 0,
        },
      ],
      searchdictionaryType: "",
      dictionaryTypesInfo: {
        id: "",
        name: "",
        tableName: "",
        Seqno: "",
        type: 0,
      },
      updictionaryTypesInfo: {},
      dictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "字典id不能为空", trigger: "blur" }],
        tablename: [
          { required: true, message: "表名不能为空", trigger: "blur" },
        ],
      },
      updatedictionaryRules: {
        name: [
          { required: true, message: "字典名称不能为空", trigger: "blur" },
        ],
        id: [{ required: true, message: "字典id不能为空", trigger: "blur" }],
        tableName: [
          { required: true, message: "表名不能为空", trigger: "blur" },
        ],
      },

      dictionaryTypeProps: {
        children: "children",
        label: "name",
      },
      typesListQuery: {
        key: "",
        type: 0,
      },
      baseURL: window.baseUrl, // api的base_url
      fileList: [], // 上传图片
    };
  },
  filters: {
    statusFilter(disable) {
      const statusMap = {
        false: "color-success",
        true: "color-danger",
      };
      return statusMap[disable];
    },
  },
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["modulesTree", "iframeViews", "visitedViews"]),
    // 体检中心
    dicMedicalCenterOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 110,
          omit: 1,
        },
        {
          title: "机构名称",
          width: 250,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
          omit: 1,
        },
        {
          title: "机构地点",
          prop: "address",
          width: 110,
          omit: 1,
        },
        {
          title: "说明",
          prop: "remark",
          width: 110,
          omit: 1,
        },
        {
          title: "图片Id",
          prop: "remark",
          width: 110,
          omit: 1,
        },
        {
          title: "体检号前缀",
          prop: "checknoprefix",
          width: 120,
          omit: 1,
        },
        {
          title: "注册机构",
          prop: "hospitalname",
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 110,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 110,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          width: 110,
          omit: 1,
        },
      ];
    },
    // 科室类型
    dicDepartmentTypeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "科室类型",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "说明",
          prop: "remark",
          width: 280,
          omit: 1,
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 120,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 120,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          omit: 1,
        },
      ];
    },
    // 检查科室
    dicDepartmentOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "科室名称",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "公用编码",
          prop: "hiscode",
          width: 120,
          omit: 1,
        },
        {
          title: "检查地点",
          prop: "location",
          width: 120,
          omit: 1,
        },
        {
          title: "数据接口",
          prop: "interfacecode",
          width: 120,
          omit: 1,
        },
        {
          title: "说明",
          prop: "remark",
          width: 120,
          omit: 1,
        },
        {
          title: "体检中心",
          prop: "centername",
          width: 120,
          omit: 1,
        },
        {
          title: "注册机构",
          prop: "hospitalname",
          width: 120,
          omit: 1,
        },
        {
          title: "科室类型",
          prop: "typename",
          width: 120,
          omit: 1,
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 120,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 120,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          omit: 1,
        },
        {
          title: "总检综述排序",
          prop: "seqnototalcheck",
          width: 140,
          omit: 1,
        },
      ];
    },
    // 检查医生
    dicDoctorOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "医生名称",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          prop: "sex",
          width: 120,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "工号",
          prop: "hiscode",
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          omit: 1,
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 120,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 120,
          omit: 1,
        },
        {
          title: "科室名称",
          prop: "departmentname",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 标本类型
    dicSampleOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "标本类型",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "对照码",
          prop: "contcode",
          width: 120,
          omit: 1,
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 120,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 120,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          width: 120,
          omit: 1,
        },
      ];
    },
    // 标本容器
    dicContainerOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "容器名称",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 120,
          omit: 1,
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 120,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          width: 120,
          omit: 1,
        },
      ];
    },
    // 结论描述
    dicdescribeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "类型",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.title}
              </el-link>
            );
          },
        },
        {
          title: "内容",
          prop: "name",
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          width: 120,
          omit: 1,
        },
      ];
    },
    // 人体部位
    dicBodyPartsOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "部位编号",
          prop: "id",
          width: 120,
          omit: 1,
        },
        {
          title: "部位名称",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleUpdate(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },

        {
          title: "性别控制",
          prop: "sex",
          width: 120,
          omit: 1,
        },
        {
          title: "排序",
          prop: "seqno",
          width: 120,
          omit: 1,
        },
      ];
    },
    dictionaryBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements
          .filter(
            (item) =>
              item.domId === "btnDeldictionary" ||
              item.domId === "btnAdddictionary"
          )
          .sort((a, b) => {
            return a.sort - b.sort;
          });
      return elements || [];
    },
    typesBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements
          .filter(
            (item) =>
              item.domId !== "btnDeldictionary" &&
              item.domId !== "btnAdddictionary"
          )
          .sort((a, b) => {
            return a.sort - b.sort;
          });
      return elements || [];
    },
    isShowOperation() {
      const route = this.$route;
      const elements = route.meta.elements || [];
      let flag = false;
      elements.forEach((item) => {
        if (item.domId === "btnEdit") {
          flag = true;
        }
      });
      return flag;
    },
  },
  created() {
    this.loaddictionaryTypes();
  },
  mounted() {
    this.loaddictionaryTypes();
    getPublicConfig({ cc: "DescribeType" }).then((res) => {
      this.describeType = res.result;
    });
  },
  methods: {
    // 上传图片
    upFile(file, filelist) {
      console.log(file, filelist, "上传图片成功回调");
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(file.raw.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return false;
      }
      let data = new FormData();
      data.append("files", file.raw);
      setFilesUpload(data).then((res) => {
        this.temp.fileid = res.result[0].id;
        console.log(res);
      });
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
    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
        case "btnAdddictionary":
          this.addTypesDialog = true;
          break;
        case "btnRefresh":
          this.getList();
          break;
        case "btnDeldictionary":
          this.handleDeletedictionary();
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
      dictionary.getList(this.listQuery).then((response) => {
        response.columnHeaders.forEach((item) => {
          item.key = item.key.toLowerCase();
        });
        this.headerList = response.columnHeaders;
        console.log(this.pageFlag, "wuhu");
        if (this.pageFlag === "Dic_describe") {
          if (!response.data) {
            this.listLoading = false;
            return;
          }
          this.tablelist = response.data.map((k) => {
            let index = this.describeType.filter((item) => {
              return item.code === k.typecode;
            })[0];
            if (index) {
              return {
                ...k,
                title: index.name,
              };
            }
          });
        } else {
          this.tablelist = response.data;
        }
        // Dic_describe
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
        id: "",
        name: "",
        hospitalcode: "",
        address: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        seqnototalcheck: 0,
        delflag: 0,
        hiscode: "",
        typecode: "",
        interfacecode: "",
        meccode: "",
        location: "",
        seq: 0,
        wechatflag: 0,
        sex: "",
        deptcode: "",
        diccode: "",
        checknoprefix: "",
      };
    },
    resetdictionaryTypesInfoTemp() {
      this.dictionaryTypesInfo = {
        id: "",
        name: "",
        tableName: "",
        Seqno: "",
        type: 0,
      };
    },
    handleCreate() {
      // 弹出添加框
      this.temp.tableName = this.listQuery.tableName;
      this.dialogStatus = "create";
      console.log(this.listQuery, "this.listQuery");

      dictionary.detailsLoad(this.listQuery).then((res) => {
        this.detailsdata = res.data;
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          this.$refs["dataForm"].clearValidate();
        });
      });
    },
    //关闭弹框的事件
    close() {
      this.resetTemp();
    },
    createData() {
      // 保存提交

      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          dictionary.add(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.listQuery.tableName = this.temp.tableName;
            console.log(111);
            this.getList();
            this.resetTemp();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        }
      });
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
    handleUpdate(row) {
      // 弹出编辑框
      console.log(row);
      this.temp = row;
      this.temp.tableName = this.listQuery.tableName;
      console.log(this.temp);
      console.log(this.detailsdata);
      dictionary.detailsLoad(this.listQuery).then((res) => {
        this.detailsdata = res.data;
        console.log(this.detailsdata);
      });
      getPublicConfig({ cc: "DescribeType" }).then((res) => {
        this.describeType = res.result;
      });
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    updateData() {
      // 更新提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          const tempData = Object.assign({}, this.temp);
          dictionary.update(tempData).then(() => {
            this.getList();
            this.resetTemp();
            console.log(111);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: "更新成功",
              type: "success",
            });
            this.saveLoading = false;
          });
        }
      });
    },
    handleDelete(rows) {
      // 多行删除
      this.delrows(dictionary, rows, this.listQuery.tableName);
    },
    // 添加分类
    handleAdddictionary() {
      this.$refs["dictionaryTypeForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          dictionary.addType(this.dictionaryTypesInfo).then(() => {
            this.$notify({
              title: "成功",
              message: "添加成功",
              type: "success",
            });
            this.addTypesDialog = false;
            this.dictionaryTypes.push(this.dictionaryTypesInfo);
            this.dictionaryTypesInfo = {};
            this.loaddictionaryTypes();
            this.saveLoading = false;
          });
        }
      });
    },
    handleupdatedictionary() {
      this.$refs["updictionaryTypeForm"].validate((valid) => {
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          dictionary.updateType(this.updictionaryTypesInfo).then(() => {
            this.$notify({
              title: "修改",
              message: "修改成功",
              type: "success",
            });
            this.saveLoading = false;
            this.updateTypesDialog = false;
            this.dictionaryTypes.push(this.updictionaryTypesInfo);
          });
          this.loaddictionaryTypes();
        }
      });
    },
    // 删除分类
    handleDeletedictionary() {
      if (!this.typesListQuery.TypeId) {
        this.$message({
          showClose: true,
          message: "请选择需要删除的分类",
          type: "error",
        });
        return;
      }
      const ids = [this.typesListQuery.TypeId];
      var data = {
        ids: ids,
        tableName: this.typesListQuery.tableName,
      };

      dictionary.delType(data).then(() => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
        });
        this.dictionaryTypes = this.dictionaryTypes.filter(
          (item) => item.id !== this.typesListQuery.TypeId
        );
        this.loaddictionaryTypes();
      });
    },
    // 搜索分类
    handleSearchdictionaryTypes() {
      this.loaddictionaryTypes();
    },
    // 获取分类列表
    loaddictionaryTypes() {
      dictionary.loadType(this.typesListQuery).then((res) => {
        this.dictionaryTypes = [...res.data];
        // this.dicTypes = res.data;
        this.listQuery.tableName = res.data[3].tableName;
        this.getList();
        console.log(this.dictionaryTypes);
      });
    },
    handleNodeClick(val) {
      console.log(val);
      console.log("tabs切换");
      this.listQuery.tableName = val.tableName;
      this.pageFlag = val.tableName;
      this.typesListQuery.TypeId = val.id;
      this.updictionaryTypesInfo = val;
      this.getList();
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.dialog-mini .el-select {
  width: 100%;
}

.dictionary-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;

  .dictionary-menu-card {
    border: 0 none;
    height: calc(100vh - 150px);
    overflow: auto;

    .el-card__body {
      height: auto;
    }
  }
}

.dictionary-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;

  .dictionary-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;

    .dictionary-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }

  .buttons-box {
    padding: 22px 10px;
    background: #f5f5f5;
  }

  .dictionary-content {
    height: 100%;
    padding: 0;

    .buttons-box {
      text-align: right;
    }
  }
}
</style>
