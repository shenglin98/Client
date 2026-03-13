<template>
  <div class="flex-column">
    <sticky :className="'sub-navbar'">
      <div class="filter-container" ref="btndiv" id="btndiv">
        <el-input placeholder="输入关键字进行过滤" size="mini" style="width: 200px" class="filter-item" clearable @input="handleInputfilterText" @clear="collapsaAll" v-model="filterText">
        </el-input>
        <!-- <el-button
          type="primary"
          plain
          class="filter-item"
          size="mini"
          v-waves
          icon="el-icon-search"
          >搜索</el-button
        > -->
        <el-button type="primary" plain :icon="`iconfont icon-${btn.icon}`" :data-id="btn.id" :disabled="btndised" size="mini" v-for="(btn, index) of typesBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn, $event)" :ref="'btn_' + index">{{ btn.name }}</el-button>
        <el-button type="primary" plain :disabled="cleardisabled" style="height: 29px" size="mini" class="filter-item" @click="clear">取消</el-button>
      </div>
    </sticky>
    <div class="app-container">
      <el-row :gutter="4" class="fh">
        <el-col :span="5" class="fh ls-border">
          <div class="buttons-box" style="height: 50px">
            <el-button type="primary" plain :icon="`iconfont icon-${btn.icon}`" :disabled="btndised" size="mini" v-for="btn of dictionaryBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn, $event)">{{ btn.name }}</el-button>
          </div>
          <el-card shadow="never" class="body-small fh" style="overflow: auto; height: calc(100vh - 183px)">
            <el-tree ref="tree" :data="typetree" highlight-current node-key="id" :default-expanded-keys="defaultChecked" :default-checked-keys="defaultChecked" :filter-node-method="filterNode" :props="defaultProps" @node-click="handleNodeClick">
              <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
                <span>
                  <i :class="[
                      data.isFile == false
                        ? 'el-icon-folder-opened'
                        : 'el-icon-folder',
                    ]" :style="
                      data.isFile == false ? 'color:#faa755' : 'color:#1d953f'
                    "></i>
                  <!-- :style="data.isFile && data.status == 1 ? 'color:red' : ''" -->
                  <span :style="data.isFile && `color:${data.namecolor}`">
                    {{ node.label }}
                  </span>
                </span>
              </span>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="19" class="fh height_100">
          <div class="bg-white fh">
            <el-form ref="workform" :model="paramsSettingForm">
              <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-tab-pane label="详细信息" name="first">
                  <div style="margin: 10px">
                    <div class="top_message" style="height: 255px; overflow-y: auto">
                      <el-row>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'结论词编码'" prop="conid">
                            <el-input v-model="paramsSettingForm.wordtemp.conid" :disabled="true" size="small" placeholder="系统自动处理"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'分类名称'" :prop="'wordtemp.typename'">
                            <el-input v-model="typename" disabled size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="10">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'结论词名称'" :prop="'wordtemp.name'" :rules="[
                              {
                                required: true,
                                message: '结论词名称不可为空',
                                trigger: 'blur',
                              },
                            ]">
                            <el-input v-model="paramsSettingForm.wordtemp.name" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'ICD编码'" :prop="'wordtemp.icdcode'">
                            <el-input v-model="paramsSettingForm.wordtemp.icdcode" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'ICD名称'" :prop="'wordtemp.icdname'">
                            <el-input v-model="paramsSettingForm.wordtemp.icdname" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'性别'" :prop="'wordtemp.sex'" :rules="[
                              {
                                required: true,
                                message: '性别不可为空',
                                trigger: 'change',
                              },
                            ]">
                            <el-select class="filter-item" filterable clearable style="width: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.sex">
                              <el-option v-for="item in sexarr" :key="item.key" :label="item.name" :value="item.key">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" label="结论分级">
                            <el-select style="width: 100%" v-model="paramsSettingForm.wordtemp.level" clearable placeholder="请选择">
                              <el-option label="普通" :value="0"> </el-option>
                              <el-option label="重要" :value="1"> </el-option>
                              <el-option label="紧急" :value="2"> </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'疾病标志'" :prop="'wordtemp.flag'" :rules="[
                              {
                                required: true,
                                message: '疾病标志不可为空',
                                trigger: 'change',
                              },
                            ]">
                            <el-select class="filter-item" filterable clearable style="width: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.flag">
                              <el-option v-for="item in flagarr" :key="item.key" :label="item.name" :value="item.key">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'输入码'" :prop="'wordtemp.incode'">
                            <el-input v-model="paramsSettingForm.wordtemp.incode" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'排序'" :prop="'wordtemp.seqno'">
                            <el-input v-model="paramsSettingForm.wordtemp.seqno" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'启用状态'">
                            <el-select class="filter-item" style="width: 100%" filterable clearable :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.status">
                              <el-option label="启用" :value="0"></el-option>
                              <el-option label="禁用" :value="1"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'回访标志'" style="width: 100%" :prop="'wordtemp.trackflag'">
                            <el-select class="filter-item" filterable style="width: 100%" clearable :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.trackflag">
                              <el-option label="不需要" :value="0"></el-option>
                              <el-option label="需追踪" :value="1"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'回访天数'" :prop="'wordtemp.trackday'">
                            <el-input v-model.number="
                                paramsSettingForm.wordtemp.trackday
                              " :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'危急值标志'" :prop="'wordtemp.criticalflag'">
                            <el-select class="filter-item" filterable clearable style="width: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.criticalflag">
                              <el-option v-for="item in criticalflagarr" :key="item.key" :label="item.name" :value="item.key">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'颜色'">
                            <el-select class="filter-item" filterable style="width: 100%" clearable :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.namecolor">
                              <el-option v-for="item in colorItems" :key="item.code" :label="item.name" :value="item.code">
                              </el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <!-- ------ -->
                      <el-row>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'名词标题'">
                            <el-input v-model="paramsSettingForm.wordtemp.guidetitle" :disabled="worddisabled" size="small"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="5">
                          <el-form-item label-position="right" label-width="100px" size="small" :label="'名词内容'">
                            <el-input v-model="paramsSettingForm.wordtemp.guidecontent" :disabled="worddisabled" size="small" @focus="showGuideContent = true"></el-input>
                          </el-form-item>
                        </el-col>
                        <el-col :span="14">
                          <el-form-item label-position="right" label-width="100px" size="small" class="mctpbox" :label="'名词图片'">
                            <!-- annex -->
                            <el-upload class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPpload" ref="upload" :file-list="fileList" :auto-upload="false" accept=".jpg,.jpeg,.png">
                              <el-button slot="trigger" size="small" type="primary" :disabled="worddisabled">选取文件</el-button>
                            </el-upload>
                            <el-link v-if="fileUrl != ''" type="primary" class="filelink" target="_blank" :href="fileUrl" :disabled="worddisabled">{{ fileName }}</el-link>
                            <el-button v-if="fileUrl != ''" type="primary" size="mini" icon="el-icon-delete" :disabled="worddisabled" @click="handleDelFile"></el-button>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </div>
                    <!-- --------- -->
                    <el-row style="height: 515px">
                      <el-tabs class="wordtemp textarea_box" v-model="activeName1" @tab-click="handleClick1">
                        <el-tab-pane class="healthadvice" label="健康建议" name="healthadvice">
                          <el-form-item style="height: 100%" :prop="'wordtemp.healthadvice'">
                            <el-input type="textarea" class="conc_text" style="height: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.healthadvice"></el-input>
                            <!-- <vue-tinymce v-model="paramsSettingForm.wordtemp.healthadvice" :setting="setting" /> -->
                          </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane class="dietadvice" label="饮食建议" name="dietadvice">
                          <el-form-item style="height: 100%" :prop="'wordtemp.dietadvice'">
                            <el-input type="textarea" class="conc_text" style="height: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.dietadvice"></el-input>
                            <!-- <vue-tinymce v-model="paramsSettingForm.wordtemp.dietadvice" :setting="setting" /> -->
                          </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane class="sportsadvice" label="运动建议" name="sportsadvice">
                          <el-form-item style="height: 100%" :prop="'wordtemp.sportsadvice'">
                            <el-input type="textarea" class="conc_text" style="height: 100%" :disabled="worddisabled" v-model="paramsSettingForm.wordtemp.sportsadvice"></el-input>
                            <!-- <vue-tinymce v-model="paramsSettingForm.wordtemp.sportsadvice" :setting="setting" /> -->
                          </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane class="healthknowledge" label="健康知识" name="healthknowledge">
                          <el-form-item style="height: 100%" :prop="'wordtemp.healthknowledge'">
                            <el-input type="textarea" class="conc_text" style="height: 100%" :disabled="worddisabled" v-model="
                                paramsSettingForm.wordtemp.healthknowledge
                              "></el-input>
                            <!-- <vue-tinymce v-model="
                                paramsSettingForm.wordtemp.healthknowledge
                              " :setting="setting" /> -->
                          </el-form-item>
                        </el-tab-pane>
                        <div class="mark" v-if="worddisabled"></div>
                      </el-tabs>
                    </el-row>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="结论推导" name="second">
                  <div style="margin: 10px">
                    <el-button type="primary" plain size="mini" style="margin-bottom: 10px" icon="el-icon-circle-plus" :disabled="worddisabled" @click="addRow"></el-button>
                    <el-table height="calc(100vh - 240px)" :data="paramsSettingForm.wordtemp.relationitems" ref="table" tooltip-effect="dark" border stripe style="width: 100%" @selection-change="selectRow">
                      <!-- <el-table-column prop="relid" label="自增ID" align="center">
                        <template slot-scope="scope">
                          <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' + scope.$index + '.relid'
                            ">
                            <el-input v-model="scope.row.relid" :disabled="true"></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column>
                      <el-table-column prop="conid" label="结论词编码">
                        <template slot-scope="scope">
                          <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' + scope.$index + '.conid'
                            ">
                            <el-input v-model="scope.row.conid" :disabled="true"></el-input>
                          </el-form-item>
                        </template>
                      </el-table-column> -->
                      <el-table-column align="center" height="50px" :label="'操作'" width="80" class-name="small-padding fixed-width">
                        <template slot-scope="scope">
                          <el-button type="primary" plain style="height: 30px; margin-top: -20px" size="mini" :disabled="worddisabled" @click="delData(scope.$index)">删除</el-button>
                        </template>
                      </el-table-column>
                      <el-table-column prop="itemcode" label="项目名称" height="30px" width="400px">
                        <template slot-scope="scope">
                          <el-select class="filter-item" filterable clearable style="
                              width: 100%;
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " :disabled="worddisabled" v-model="scope.row.itemcode">
                            <el-option v-for="item in deptypesarrItems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code">
                            </el-option>
                          </el-select>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.itemcode'
                            ">
                           
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="relation" height="30px" width="150px" label="关系">
                        <template slot-scope="scope">
                          <el-select class="filter-item" size="mini" filterable clearable style="
                              width: 100%;
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " :disabled="worddisabled" v-model="scope.row.relation">
                            <el-option v-for="(item, key) in relationitemslist" :key="key" :label="item.name" :value="item.code">
                            </el-option>
                          </el-select>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.relation'
                            ">
                           
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="deptcode" height="30px" width="150px" label="科室设置">
                        <template slot-scope="scope">
                          <el-select class="filter-item" size="mini" filterable clearable style="
                              width: 100%;
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " :disabled="worddisabled" v-model="scope.row.deptcode">
                            <el-option v-for="(item, key) in deptItems" :key="key" :label="item.name" :value="item.id">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="keyword" width="260px" height="30px" label="关键字">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.keyword" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.keyword'
                            ">
                            
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="keyword" width="260px" height="30px" label="小结">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.conclusion" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.keyword'
                            ">
                            
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="group" height="30px" width="100" label="分组">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.group" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.group'
                            ">
                          
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="sex" height="30px" width="100px" label="性别">
                        <template slot-scope="scope">
                          <el-select class="filter-item" size="mini" filterable clearable style="
                              width: 100%;
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " :disabled="worddisabled" v-model="scope.row.sex">
                            <el-option v-for="(item, key) in sexarr" :key="key" :label="item.name" :value="item.key">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column prop="agel" height="30px" width="80" label="年龄下限">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.agel" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="ageh" height="30px" width="80" label="年龄上限">
                        <template slot-scope="scope">
                          <el-input v-model.number="scope.row.ageh" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column prop="expression" height="30px" width="150" label="计算公式">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.expression" style="
                              height: 30px;
                              margin-top: -20px;
                              margin-left: -15px;
                            " size="mini" :disabled="worddisabled"></el-input>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.expression'
                            ">
                           
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                      <el-table-column prop="seqno" height="30px" width="80" label="排序">
                        <template slot-scope="scope">
                          <el-input v-model="scope.row.seqno" style="
                              height: 30px;
                              margin-left: -15px;
                              margin-top: -20px;
                            " size="mini" :disabled="worddisabled"></el-input>
                          <!-- <el-form-item size="small" :prop="
                              'wordtemp.relationitems.' +
                                scope.$index +
                                '.seqno'
                            ">
                          
                          </el-form-item> -->
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-form>
          </div>
        </el-col>
      </el-row>
      <el-dialog :close-on-click-modal="false" width="516px" class="dialog-mini body-small" v-el-drag-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :model="typetemp" size="small" v-if="dialogFormVisible" label-position="right" label-width="100px">
          <el-form-item size="small" :label="'分类编码'" prop="typeid">
            <el-input v-model="typetemp.typeid" :disabled="true" size="small" placeholder="系统自动处理"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'科室'" prop="deptcode">
            <el-select class="filter-item" clearable filterable style="width: 100%" v-model="typetemp.deptcode">
              <el-option v-for="item in deptypesarr" :key="item.code" :label="item.name" :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" :label="'分类'" prop="typename">
            <el-input v-model="typetemp.typename" size="small"></el-input>
          </el-form-item>
          <el-form-item size="small" :label="'父级'" prop="parentid">
            <treeselect ref="menuTable" :normalizer="normalizer" :disabled="treeDisabled" :options="modulesTreeRoot" :default-expand-level="3" :multiple="false" :open-on-click="true" :open-on-focus="true" :clear-on-select="true" v-model="typetemp.parentid">
            </treeselect>
          </el-form-item>
          <el-form-item size="small" :label="'排序'" prop="seqno">
            <el-input v-model="typetemp.seqno" size="small"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button type="primary" plain size="mini" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" plain size="mini" :loading="saveLoading" @click="createData">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog title="名词内容" :visible.sync="showGuideContent" width="40%" :show-close="false" :close-on-click-modal="false">
        <span>
          <el-input class="conc_text" :rows="5" type="textarea" resize="none" v-model="paramsSettingForm.wordtemp.guidecontent"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showGuideContent = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { listToTreeSelect } from "@/utils";
import * as conclusions from "@/api/conclusions";
import { getDicItemDetailItem } from "@/api/conclusions";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import permissionBtn from "@/components/PermissionBtn";
import SelectRoles from "@/components/SelectRoles";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
import extend from "@/extensions/delRows.js";
// import { delete } from "vue/types/umd";
import { getDicItemDetail } from "@/api/projectdictionary2.js";
import { mapGetters } from "vuex";
import { getPublicConfig } from "@/api/personalregister.js";
import { setFilesUpload, setFilesDelete } from "@/api/company_register.js";
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import { DicLoad } from "@/api/totalcheck.js"; // 引入接口文件

export default {
  name: "conclusion",
  components: {
    Sticky,
    permissionBtn,
    Treeselect,
    SelectRoles,
    Pagination,
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      defaultChecked: [], // 默认选中数据
      currentNodeId: 0,
      deptypesarrItems: [],
      test: "",
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      normalizer(node) {
        // treeselect定义字段

        return {
          name: node.label,
          id: node.id,
          children: node.children,
        };
      },
      filterText: "",
      saveLoading: false,
      btndised: false,
      paramsSettingForm: {
        // 呼叫参数设置
        wordtemp: {
          conid: "",
          name: "",
          typeid: "",
          icdcode: "",
          icdname: "",
          sex: 0,
          flag: 0,
          healthadvice: "",
          dietadvice: "",
          sportsadvice: "",
          healthknowledge: "",
          conclusion: "",
          incode: "",
          seqno: 0,
          level: 0,
          trackflag: null,
          trackday: null,
          criticalflag: null,
          namecolor: "",
          relationitems: [],
          items: [],
          status: 0,
          relationitemslist: [],
          guidetitle: "",
          guidecontent: "",
          guidefileid: "",
        },
      },
      showGuideContent: false,
      typename: "",
      relationitems: [],
      selectlistRow: [],
      typetree: [],
      treeDisabled: false, // 树选择框时候可用
      deptypesarr: [],
      content: "",
      cleardisabled: true,
      setting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN",
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | numlist bullist | table | fontselect fontsizeselect forecolor backcolor | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        // plugins: "link image media table lists fullscreen quickbars emoticons",
        language: "zh_CN", //本地化设置
        height: "calc(100vh - 408px)",
      },
      typeid: "",
      mecName: "体检中心",
      worddisabled: true,
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      activeName: "first",
      activeName1: "healthadvice",
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      flagarr: [
        { key: 0, name: "否" },
        { key: 1, name: "是" },
      ],
      trackflagarr: [
        { key: 0, name: "不需要" },
        { key: 1, name: "需追踪" },
      ],
      criticalflagarr: [
        { key: 0, name: "否" },
        { key: 1, name: "是" },
      ],
      list: null,
      total: 0,
      listLoading: true,
      modulesTree: [],
      listQuery: {
        // 查询条件
        page: 1,
        limit: 20,
        orgId: "",
        parentId: "",
        key: undefined,
      },
      apps: [],
      statusOptions: [
        {
          key: 1,
          display_name: "停用",
        },
        {
          key: 0,
          display_name: "正常",
        },
      ],
      typetemp: {
        typeid: "",
        deptcode: "",
        parentid: "",
        typename: "",
        label: "",
        seqno: 0,
      },
      items: [],
      relationitemslist: [],
      showDescription: false,
      orgs: [], // 用户可访问到的组织列表
      orgsTree: [], // 用户可访问到的所有机构组成的树
      selectRoles: [], // 用户分配的角色
      selectRoleNames: "",
      typedata: "",
      dialogFormVisible: false,
      lastParentId: "", //最后一次选中的上级模块Id
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      rules: {
        name: [
          {
            required: true,
            message: "结论词名称不能为空",
            trigger: "blur",
          },
        ],
        sex: [
          {
            required: true,
            message: "性别不能为空",
            trigger: "change",
          },
        ],
        flag: [
          {
            required: true,
            message: "疾病标志不能为空",
            trigger: "change",
          },
        ],
      },
      downloadLoading: false,
      colorItems: [],
      fileList: [], // bodyForm.annex
      fileUrl: "",
      fileName: "",
      deptItems: [],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),

    modulesTreeRoot() {
      const root = [
        {
          label: "根节点",
          parentid: "",
          id: "",
        },
      ];
      return root.concat(this.modulesTree);
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
              item.domId === "btnAddType" ||
              item.domId === "btnUpdType" ||
              item.domId === "btnDelType"
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
              item.domId !== "btnAddType" &&
              item.domId !== "btnUpdType" &&
              item.domId !== "btnDelType"
          )
          .sort((a, b) => {
            return a.sort - b.sort;
          });
      return elements || [];
    },
  },
  created() {
    // this.getList();
  },
  mounted() {
    this.getList();
    getDicItemDetailItem({ code: "" }).then((res) => {
      this.deptypesarrItems = res.data;
    });
    getPublicConfig({ cc: "Color" }).then((res) => {
      if (!res.result) return;
      this.colorItems = res.result;
      console.log(this.colorItems, "this.colorItems");
    });
    DicLoad({ tableName: "Dic_department" }).then((res) => {
      this.deptItems = res.data;
    });
  },
  methods: {
    // 折叠所有节点
    handleInputfilterText() {
      console.log(this.filterText, "this.filterText");
      !this.filterText && this.collapsaAll();
    },
    // 折叠所有节点
    collapsaAll() {
      this.$refs.tree.store._getAllNodes().forEach((node) => {
        node.expanded = false;
      });
    },
    handleDelFile() {
      setFilesDelete([this.paramsSettingForm.wordtemp.guidefileid]).then(
        (res) => {
          this.$message.success(res.message);
          this.fileUrl = "";
          this.fileName = "";
          this.paramsSettingForm.wordtemp.guidefileid = "";
        }
      );
    },
    // 上传触发回调
    handleOnPpload(params, index, key) {
      const fileSuffix = params.name.substring(
        params.name.lastIndexOf(".") + 1
      );
      const whiteList = ["jpg", "jpeg", "png"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传图片只能是 .jpg,.jpeg,.png 格式!");
        return false;
      }
      let data = new FormData();
      data.append("files", params.raw);
      //   return;
      setFilesUpload(data).then((res) => {
        this.$message.success(res.message);
        this.paramsSettingForm.wordtemp.guidefileid = res.result[0].id;
        this.fileUrl = res.result[0].fileUrl;
        this.fileName = res.result[0].fileName;
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    handleClick1(tab, event) {
      console.log(tab, event);
    },
    selectRow(val) {
      console.log(val);
      this.selectlistRow = val;
    },
    clear() {
      var obj1 = document.querySelector("#btndiv").children;
      this.typesBtns.forEach((v, k) => {
        if (this.$refs["btn_" + k][0].$el.innerText == "保存") {
          this.typesBtns.forEach((d) => {
            if (d.id == this.$refs["btn_" + k][0].$attrs["data-id"]) {
              this.$refs["btn_" + k][0].$el.innerText = v.name;
              this.btndised = false;
              this.worddisabled = true;
              this.cleardisabled = true;
            }
          });
        }
      });
      // this.$nextTick(() => {
      //   console.log(this.$refs);
      //   console.log(this.$refs.btndiv);
      // });
      // this.btndised = false;
      // this.worddisabled = true;
      // obj1.forEach((d) => {
      //   if (d.innerText == "保存") {
      //     console.dir(d);
      //   }
      // });

      // this.$nextTick(() => {
      //   // this.resetwordtemp();
      //   this.$refs["workform"].clearValidate();
      //   el.innerText = obj.name;
      // });
    },
    filterNode(value, data) {
      if (!value) return true;
      let nowval = data[this.defaultProps.label].toUpperCase();
      return nowval.indexOf(value.toUpperCase()) !== -1;
      // return data.label.indexOf(value) !== -1;
    },
    // 增加行
    addRow() {
      var list = {
        relid: this.relid,
        conid: this.conid,
        itemcode: this.itemcode,
        relation: this.relation,
        keyword: this.keyword,
        deptcode: this.deptcode,
        group: this.group,
        expression: this.expression,
        conclusion: "",
        seqno: 0,
        sex: 0,
        agel: this.agel,
        ageh: this.ageh,
      };
      this.paramsSettingForm.wordtemp.relationitems.push(list);
    },
    // 删除方法
    // 删除选中行
    delData(index) {
      this.paramsSettingForm.wordtemp.relationitems.splice(index, 1);
    },

    handleNodeClick(data) {
      this.typedata = JSON.parse(JSON.stringify(data));
      if (
        this.typedata.word != undefined &&
        this.typedata.word != null &&
        this.typedata.word != ""
      ) {
        this.typeid = data.parentid;
        this.typetree.forEach((d) => {
          if (d.isFile == false && d.id == data.parentid) {
            this.typename = d.label;
          } else if (
            d.children != undefined &&
            d.children != null &&
            d.children != "" &&
            d.children.length > 0
          ) {
            this.treenamewhile(d.children, data.parentid);
          }
        });
        this.fileUrl = "";
        this.fileName = "";
        this.currentNodeId = data.id;
        var condata = {
          conid: this.typedata.word.word.conid,
        };
        conclusions.getWordDetail(condata).then((response) => {
          this.items = response.result.items;
          this.relationitemslist = response.result.relationitemslist;
          this.paramsSettingForm.wordtemp.relationitems =
            response.result.relationitems;
          this.paramsSettingForm.wordtemp = response.result;
          this.paramsSettingForm.wordtemp.guidefileid && this.handleGetFiles();
        });
        // console.log(this.typedata);
        // console.log(this.typedata.word.word);
        // this.paramsSettingForm.wordtemp.conid = this.typedata.word.word.conid;
        // this.paramsSettingForm.wordtemp.dietadvice =
        //   this.typedata.word.word.dietadvice;
        // this.paramsSettingForm.wordtemp.flag = this.typedata.word.word.flag;
        // this.paramsSettingForm.wordtemp.healthadvice =
        //   this.typedata.word.word.healthadvice;
        // this.paramsSettingForm.wordtemp.healthknowledge =
        //   this.typedata.word.word.healthknowledge;
        // this.paramsSettingForm.wordtemp.icdcode =
        //   this.typedata.word.word.icdcode;
        // this.paramsSettingForm.wordtemp.icdname =
        //   this.typedata.word.word.icdname;
        // this.paramsSettingForm.wordtemp.incode = this.typedata.word.word.incode;
        // this.paramsSettingForm.wordtemp.name = this.typedata.word.word.name;
        // this.paramsSettingForm.wordtemp.seqno = this.typedata.word.word.seqno;
        // this.paramsSettingForm.wordtemp.sex = this.typedata.word.word.sex;
        // this.paramsSettingForm.wordtemp.sportsadvice =
        //   this.typedata.word.word.sportsadvice;
        // this.paramsSettingForm.wordtemp.typeid = this.typedata.word.word.typeid;
        // this.paramsSettingForm.wordtemp.trackflag =
        //   this.typedata.word.word.trackflag;
        // this.paramsSettingForm.wordtemp.trackday =
        //   this.typedata.word.word.trackday;
        // this.paramsSettingForm.wordtemp.criticalflag =
        //   this.typedata.word.word.criticalflag;
        // this.paramsSettingForm.wordtemp.relationitems = this.typedata.word.relations;
      } else {
        this.typeid = this.typedata.id;
        this.typename = "";
        this.resetwordtemp();
      }
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.paramsSettingForm.wordtemp.guidefileid }).then(
        (res) => {
          this.fileUrl = res.result.fileUrl;
          this.fileName = res.result.fileName;
        }
      );
    },
    treenamewhile(childs, id) {
      childs.forEach((d) => {
        if (d.isFile == false && d.id == id) {
          this.typename = d.label;
        } else if (
          d.children != undefined &&
          d.children != null &&
          d.children != "" &&
          d.children.length > 0
        ) {
          this.treenamewhile(d.children, childs.parentid);
        }
      });
    },
    onBtnClicked: function (obj, event) {
      var el = event.currentTarget;
      switch (obj.domId) {
        case "btnAddType":
          console.log(this.content);
          this.handleCreate();
          break;
        case "btnUpdType":
          console.log(this.typedata);
          // if (this.multipleSelection.length !== 1) {
          //   this.$message({
          //     message: "只能选中一个进行编辑",
          //     type: "error",
          //   });
          //   return;
          // }
          if (
            this.typedata.word == undefined ||
            this.typedata.word == null ||
            this.typedata.word == ""
          ) {
            if (
              this.typedata == undefined ||
              this.typedata == null ||
              this.typedata == ""
            ) {
              this.$message({
                showClose: true,
                message: "请选择分类再进行编辑",
                type: "error",
              });
              return;
            } else {
              this.handleUpdate(this.typedata);
            }
          } else {
            this.handleUpdate(this.typedata);
            return;
            this.$message({
              showClose: true,
              message: "请选择分类再进行编辑，你当前选择的是结论词",
              type: "error",
            });
            return;
          }

          break;
        case "btnDelType":
          if (this.typedata.isFile == false) {
            if (
              this.typedata == undefined ||
              this.typedata == null ||
              this.typedata == ""
            ) {
              this.$message({
                showClose: true,
                message: "请选择分类再进行删除",
                type: "error",
              });
              return;
            } else {
              this.handleDelete(this.typedata);
            }
          } else {
            this.$message({
              showClose: true,
              message: "请选择分类再进行删除，你当前选择的是结论词",
              type: "error",
            });
            return;
          }
          break;
        case "btnAddWord":
          this.$nextTick(() => {
            // this.resetwordtemp();
            this.$refs["workform"].clearValidate();
          });
          if (this.typeid == "") {
            this.$message({
              showClose: true,
              message: "请选择分类再进行添加结论词",
              type: "error",
            });
            return;
          } else {
            if (
              this.typeid != "" &&
              this.typedata != undefined &&
              this.typedata != null &&
              this.typedata != "" &&
              this.typedata.word != undefined &&
              this.typedata.word != null &&
              this.typedata.word != ""
            ) {
              this.$message({
                showClose: true,
                message: "请选择分类再进行添加结论词",
                type: "error",
              });
              return;
            } else {
              if (el.innerText != "保存" && el.innerText != "取消") {
                conclusions.getWordDetail().then((response) => {
                  console.log(response.result);
                  this.items = response.result.items;
                  this.relationitemslist = response.result.relationitemslist;
                  console.log(this.relationitems);
                });
                this.typename = this.typedata.label;
                this.btndised = true;
                this.worddisabled = false;
                this.cleardisabled = false;
                this.$nextTick(() => {
                  el.classList.remove("is-disabled");
                  el.removeAttribute("disabled");
                  el.innerText = "保存";
                });
              }
              if (el.innerText == "保存") {
              }
              {
                this.$refs["workform"].validate((valid) => {
                  console.log(valid);
                  if (valid) {
                    if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
                    this.saveLoading = true;
                    console.log(this.typeid);
                    this.paramsSettingForm.wordtemp.typeid = this.typeid;
                    conclusions
                      .wordsave(this.paramsSettingForm.wordtemp)
                      .then((response) => {
                        console.log(response);
                        this.btndised = false;
                        this.worddisabled = true;
                        this.cleardisabled = true;
                        this.typedata = "";
                        this.typeid = "";
                        // this.typename = "";
                        // this.resetwordtemp();
                        this.getList();
                        this.$notify({
                          title: "成功",
                          message: "保存成功",
                          type: "success",
                        });
                        this.saveLoading = false;
                        this.$nextTick(() => {
                          this.$refs["workform"].clearValidate();
                          el.innerText = obj.name;
                        });
                      })
                      .catch((err) => {
                        this.btndised = false;
                        this.saveLoading = false;
                        this.worddisabled = true;
                        this.cleardisabled = true;
                      });
                  }
                });
              }
            }
          }

          break;
        case "btnUpdWord":
          this.$nextTick(() => {
            this.$refs["workform"].clearValidate();
          });
          if (
            this.typeid == "" ||
            this.typedata == undefined ||
            this.typedata == null ||
            this.typedata == "" ||
            this.typedata.word == undefined ||
            this.typedata.word == null ||
            this.typedata.word == ""
          ) {
            this.$message({
              showClose: true,
              message: "请选择分类再进行编辑结论词",
              type: "error",
            });
            return;
          } else {
            if (el.innerText != "保存" && el.innerText != "取消") {
              this.typename = this.typedata.label;
              conclusions.getWordDetail().then((response) => {
                console.log(response);
                this.relationitems = response.result.relationitems;
              });
              this.btndised = true;
              this.worddisabled = false;
              this.cleardisabled = false;
              this.$nextTick(() => {
                el.classList.remove("is-disabled");
                el.removeAttribute("disabled");
                el.innerText = "保存";
              });
            }
            if (el.innerText == "保存") {
              this.$refs["workform"].validate((valid) => {
                console.log(valid);
                if (valid) {
                  if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
                  this.saveLoading = true;
                  console.log(this.typeid);
                  conclusions
                    .wordsave(this.paramsSettingForm.wordtemp)
                    .then((response) => {
                      console.log(response);
                      this.btndised = false;
                      this.worddisabled = true;
                      this.cleardisabled = true;
                      // this.typename = "";
                      // this.resetwordtemp();
                      if (this.filterText) {
                      } else {
                        this.typedata = "";
                        this.typeid = "";
                        this.getList();
                      }
                      this.$notify({
                        title: "成功",
                        message: "保存成功",
                        type: "success",
                      });
                      this.saveLoading = false;
                      this.$nextTick(() => {
                        this.$refs["workform"].clearValidate();
                        el.innerText = obj.name;
                      });
                    })
                    .catch((err) => {
                      this.saveLoading = false;
                      this.btndised = true;
                    });
                }
              });
            }
          }
          break;
        case "btnDelWord":
          if (this.typedata.isFile == true) {
            if (
              this.typedata == undefined ||
              this.typedata == null ||
              this.typedata == ""
            ) {
              this.$message({
                showClose: true,
                message: "请选择结论词再进行删除",
                type: "error",
              });
              return;
            } else {
              this.handleWordDelete(this.typedata);
            }
          } else {
            this.$message({
              showClose: true,
              message: "请选择结论词再进行删除，你当前选择的是分类",
              type: "error",
            });
            return;
          }
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
      conclusions.getList(this.listQuery).then((response) => {
        console.log(response);
        this.typetree = response.result;
        this.filterText = "";
        // 页面加载默认选中第一个
        this.$nextTick(() => {
          console.log(this.currentNodeId, "this.currentNodeId");
          if (this.currentNodeId) {
            this.defaultChecked.push(this.currentNodeId);
            this.$refs[`treeItem_${this.currentNodeId}`].click();
          }
        });
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
    handleModifyStatus(row, status) {
      // 模拟修改状态
      this.$message({
        showClose: true,
        message: "操作成功",
        type: "success",
      });
      row.status = status;
    },
    resettypetemp() {
      this.typetemp = {
        typeid: "",
        deptcode: "",
        parentid: "",
        typename: "",
        label: "",
        seqno: 0,
      };
    },
    resetwordtemp() {
      this.paramsSettingForm.wordtemp = {
        conid: "",
        name: "",
        typeid: "",
        icdcode: "",
        icdname: "",
        sex: 0,
        flag: 0,
        healthadvice: "",
        dietadvice: "",
        sportsadvice: "",
        healthknowledge: "",
        conclusion: "",
        incode: "",
        seqno: 0,
        level: 0,
        status: 0,
        trackflag: null,
        trackday: null,
        criticalflag: null,
        namecolor: "",
        relationitems: [],
        guidetitle: "",
        guidecontent: "",
        guidefileid: "",
      };
    },
    getModulesTree() {
      this.modulesTree = JSON.parse(JSON.stringify(this.typetree));
      this.treedel(this.modulesTree);
    },
    treedel(val) {
      if (val != undefined && val != null && val != "") {
        val.forEach((d) => {
          if (d.isFile == true) {
            val.splice(val.indexOf(d), 1);
            this.treedel(val);
          } else {
            if (
              d.children != undefined &&
              d.children != null &&
              d.children != "" &&
              d.children.length > 0
            ) {
              if (
                d.children != undefined &&
                d.children != null &&
                d.children != "" &&
                d.children.filter((d) => d.isFile == true).length ==
                  d.children.length
              ) {
                delete d.children;
                this.treedel(val);
              } else {
                this.treedel(d.children);
              }
            } else {
              if (d.children != undefined) {
                delete d.children;
                this.treedel(val);
              }
            }
          }
        });
      }
    },
    handleCreate() {
      // 弹出添加框
      this.resettypetemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      // conclusions.gettypeDetail().then((response) => {
      //   this.deptypesarr = response.result.deptypes;
      // });
      getDicItemDetail({ code: "" }).then((res) => {
        this.deptypesarr = res.result.deptItems;
      });
      this.getModulesTree();
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      console.log(this.typetemp);
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
          this.saveLoading = true;
          delete this.typetemp.label;
          conclusions
            .typesave({
              ...this.typetemp,
              conid: this.paramsSettingForm.wordtemp.conid || "",
            })
            .then((response) => {
              console.log(response);
              this.typedata = "";
              this.resettypetemp();
              this.getList();
              this.dialogFormVisible = false;
              this.$notify({
                title: "成功",
                message: "保存成功",
                type: "success",
              });
              this.saveLoading = false;
            })
            .catch((err) => {
              this.saveLoading = false;
            });
        }
      });
    },
    handleUpdate(row) {
      // 弹出编辑框
      console.log(row);
      let temp = JSON.parse(JSON.stringify(row));
      this.typetemp.typeid = temp.id;
      this.typetemp.deptcode = temp.deptcode;
      this.typetemp.parentid = temp.parentid;
      this.typetemp.typename = temp.label;
      this.typetemp.seqno = temp.seqno;
      this.getModulesTree();
      // conclusions.gettypeDetail().then((response) => {
      //   this.deptypesarr = response.result.deptypes;
      // });
      getDicItemDetail({ code: "" }).then((res) => {
        this.deptypesarr = res.result.deptItems;
      });
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleDelete(rows) {
      this.$confirm("是否要删除当前分类?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var idarr = [];
          idarr.push(rows.id);
          conclusions.typedel(idarr).then((response) => {
            this.typedata = "";
            this.getList();
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleWordDelete(rows) {
      this.$confirm("是否要删除当前结论词?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var idarr = [];
          idarr.push(rows.id);
          conclusions.worddelete(idarr).then((response) => {
            this.typedata = "";
            this.typeid = "";
            this.typename = "";
            this.resetwordtemp();
            this.getList();
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss">
.el-tree {
  > .el-tree-node {
    /*设置横向滚动条*/
    min-width: 100%;
    display: inline-block;

    /*设置根节点隐藏*/
    > .el-tree-node__content {
      // display: none;
    }
  }
}

.mctpbox {
  .el-form-item__content {
    display: flex;
    .filelink {
      margin: 4px;
    }
  }
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card__header {
  padding: 12px 20px;
}

.body-small.dialog-mini .el-dialog__body .el-form {
  padding-right: 0px;
  padding-top: 0px;
}
.healthadvice {
  height: calc(100vh - 260px);
}
.dietadvice {
  height: calc(100vh - 260px);
}
.sportsadvice {
  height: calc(100vh - 260px);
}
.healthknowledge {
  height: calc(100vh - 260px);
}
.app-container {
  height: 100vh;
  /deep/.el-row {
    height: 100%;
  }
  .height_100 {
    height: 100%;
  }
}
    .wordtemp {
  .el-tabs__content {
    position: relative;
  }
  .mark {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    width: 100%;
    height: calc(100vh - 147px);
    background-color: rgba(0, 0, 0, 0);
    z-index: 3;
  }
}
.textarea_box {
  .el-form-item__content {
    height: calc(100% - 150px);
  }
}
.conc_text {
  height: calc(100% - 50px);
  .el-textarea__inner {
    height: 100%;
  }
}
.buttons-box {
  padding: 10px 10px;
  background: #f5f5f5;
}
.el-table__row {
  .el-input__inner {
    border: 0;
    background-color: transparent;
  }
}
.textarea_box .el-textarea.is-disabled .el-textarea__inner {
  background-color: #fff !important;
  color: #000 !important;
}
</style>
