<template>
  <div class="questionnaire">
    <!-- 项目字典模块主体 -->
    <div class="subject">
      <!-- 左侧tree选择当前字典 -->
      <div class="choose_tree">
        <div class="head"></div>
        <el-tree
          ref="pageTree"
          class="pageTree"
          :data="treeData"
          node-key="id"
          :props="defaultProps"
          :default-expand-all="true"
          :default-checked-keys="defaultChecked"
          @node-click="handleNodeClick"
        >
          <span
            class="custom-tree-node"
            :ref="`treeItem_${data.id}`"
            slot-scope="{ node, data }"
          >
            <i class="el-icon-menu"></i> {{ node.label }}
          </span>
        </el-tree>
      </div>
      <!-- 右侧搜索组件 - 主体数据 -->
      <div class="content">
        <!-- 搜索盒子 -->
        <div class="search_box">
          <!-- <el-select size="small" v-model="department" @change="handleChangeDepart" filterable clearable placeholder="请选择">
            <el-option v-for="(item,index) in deptItems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select> -->
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
          <permission-btn
            class="btn_group"
            moduleName="customerResult"
            :questionNaireBtnDom="questionNaireBtnDomId"
            size="mini"
            v-on:btn-event="hadnleOnBtnClicked"
          ></permission-btn>
        </div>
        <!-- 子组件引入位置 -->
        <div class="child_components">
          <!-- 人体系统 -->
          <div class="human_system" v-if="pageFlag == 'Human_system'">
            <EasyTable
              height="100%"
              class="humansystem_data"
              :loading="loading"
              :data="humanSystemData"
              :tableOptions="humanSystemOptions"
              :checkbox-config="{ rowClick: true }"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :cell-style="{ padding: '0' }"
              @row-click="handleHumanSystem"
            />
          </div>
          <!-- 病史采集 -->
          <div class="history_taking" v-if="pageFlag == 'History_taking'">
            <el-tree
              class="taking_tree"
              :data="takingData"
              :props="takingProps"
              @node-click="handleNodeClickTaking"
              :default-expand-all="true"
            ></el-tree>
            <EasyTable
              height="100%"
              class="historytaking_data"
              :loading="loading"
              :data="historytakingData"
              :tableOptions="historytakingOptions"
              :checkbox-config="{ rowClick: true }"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :cell-style="{ padding: '0' }"
              @row-click="handleHistorytaking"
            />
            <el-dialog
              title="病史采集"
              :visible.sync="history_takingVisible"
              :close-on-click-modal="false"
              fullscreen
              style="width: 70%; margin: 0 auto"
            >
              <!-- 病史采集 -->
              <div class="history_takingDialogClas" v-if="history_takingVisible">
                <div class="card" v-for="item in medicalHistory" :key="item.syscode">
                  <!-- 标题 -->
                  <div class="title_head">
                    <div class="logo"></div>
                    <span>{{ item.sysname }}</span>
                  </div>
                  <!-- 内容 -->
                  <div class="c_content">
                    <div
                      class="content_item content_items"
                      :class="[
                        val.inputtype == 3 || val.inputtype == 4 ? 'content_input' : '',
                      ]"
                      v-for="val in item.historyitems"
                      :key="val.hoycode"
                    >
                      <el-checkbox
                        :label="val.hoyname"
                        v-if="[0, 2, 3, 4].indexOf(val.inputtype) !== -1"
                        v-model="val.flag"
                        :true-label="1"
                        :false-label="0"
                      >
                        <span>{{ val.hoyname }}</span>
                        <el-input
                          v-model="val.remark"
                          :disabled="val.flag == 0"
                          v-if="[3, 4].indexOf(val.inputtype) !== -1"
                          placeholder="请输入内容"
                          size="mini"
                          clearable
                        ></el-input>
                      </el-checkbox>
                      <div class="" v-if="val.inputtype === 1">
                        {{ val.hoyname }}
                        <el-input
                          size="mini"
                          v-model="val.remark"
                          :disabled="val.editstatus == 1"
                          style="width: 150px"
                          clearable
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="history_takingVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="handleHistory_takingDialog"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </div>
          <!-- 健康问卷 -->
          <div class="health_questionnaire" v-if="pageFlag == 'Health_questionnaire'">
            <EasyTable
              height="100%"
              class="healthquestionnaire_data"
              :loading="loading"
              :data="healthquestionnaireData"
              :tableOptions="healthquestionnaireOptions"
              :checkbox-config="{ rowClick: true }"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :cell-style="{ padding: '0' }"
              @row-click="handleHealthquestionnaire"
            />
          </div>
          <!-- 问卷明细  -->
          <div class="questionnaire_details" v-if="pageFlag == 'Questionnaire_details'">
            <!-- 筛选盒子 -->
            <div class="screen_box">
              <div class="select_box">
                <div class="title">健康问卷</div>
                <el-select
                  size="mini"
                  v-model="chooseSelect"
                  @change="handleChangeChooseSelect"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="(item, index) in healthOption"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </div>
              <div class="btn_group">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-plus"
                  @click="handleAddOptionalfilling"
                  >添加</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-edit-outline"
                  @click="handleEditOoptionalfillingData"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-delete"
                  @click="handleGetDicOptionDelete"
                  >删除</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-plus"
                  @click="handleSetDicAddSubitem"
                  >添加子项</el-button
                >
              </div>
              <!-- 三级 -->
              <div class="btn_group">
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-plus"
                  @click="handleAddOptionAnswer"
                  >添加</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-edit-outline"
                  @click="handleEditOptionAnswerData"
                  >编辑</el-button
                >
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  icon="el-icon-delete"
                  @click="handleGetOptionAnswerDelete"
                  >删除</el-button
                >
              </div>
            </div>
            <!-- 数据表格 -->
            <div class="details_table">
              <EasyTable
                height="100%"
                class="questionnairedetails_data"
                :loading="loading"
                :data="questionnairedetailsData"
                :tableOptions="questionnairedetailsOptions"
                :checkbox-config="{ rowClick: true }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
                @row-click="handleQuestionnairedetails"
              />
              <EasyTable
                height="100%"
                class="optionalfilling_data"
                :loading="loading"
                :data="optionalfillingData"
                :tableOptions="optionalfillingOptions"
                :checkbox-config="{ rowClick: true }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
                @row-click="handleClickOoptionalfilling"
              />
              <EasyTable
                height="100%"
                class="optionalfilling_data"
                :loading="loading"
                :data="optionanswerData"
                :tableOptions="optionanswerOptions"
                :checkbox-config="{ rowClick: true }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
                @row-click="handleClickOptionanswer"
              />
            </div>
            <el-dialog
              :title="questionnaireName"
              :visible.sync="questionnairedetailsVisible"
              :close-on-click-modal="false"
              fullscreen
              style="width: 70%; margin: 0 auto"
            >
              <!-- 问卷明细 -->
              <div class="questionnairedetailsDialogClas">
                <div class="life_habit">
                  <div
                    class="Questionnaire"
                    v-for="(item, index) in questionnairelist"
                    :key="index"
                  >
                    <div class="life_habit_title">
                      <h3>{{ item.itemname }}</h3>
                    </div>
                    <div class="life_habit_content">
                      <!-- 二级标题questionnaireitems -->
                      <div
                        class="basic_information"
                        v-for="item in item.questionnaireitems"
                        :key="item.itemcode"
                      >
                        <div class="two_topic">
                          <span>{{ item.itemname }}</span>
                          <!-- 二级选项optionitems -->
                          <div
                            class="two_options"
                            v-for="(value, index) in item.optionitems"
                            :key="index"
                          >
                            <span v-if="value.inputtype === -1">
                              <!-- v-html="value.content.replaceAll('|X|',`1`)" -->
                              <!-- {{ value.content}} -->
                              <!-- 渲染出来的input的值 拼接存到remake的哦 格式  就是这种 2020|x|01 会不会很麻烦
                           -->
                              <!-- <span v-for="(day,index) in value.content" :key="index">{{day+'c'}}</span> -->
                              <template
                                v-for="(val, index) in value.content
                                  .split('|X|')
                                  .filter((v) => v)"
                              >
                                <myInput
                                  :suffix="val"
                                  :disabled="item.editstatus == 1"
                                  :count="
                                    value.content.split('|X|').filter((v) => v).length
                                  "
                                  :value.sync="value.remark"
                                  :index="index"
                                  :key="val"
                                />
                              </template>
                              <!--  -->
                              <!-- <input type="text" :ref="'input'" :data-sortIndex="index" :data-remark="value.remark" :key="index" @input="handleTest" />  -->
                              <!-- <template v-for="(val,index) in value.content.split('|X|').filter(v => v )">
                            <el-input size="mini" :ref="val" v-model="obj[index]" :key="index">
                              <template slot="append">{{val}}</template>
                            </el-input>
                          </template> -->
                              <!-- {{value.content.split('|X|').filter(v => v ).map( v => `<span>${v}</span>`)}} -->
                            </span>
                            <!-- <el-radio v-model="value.flag" v-if="[0,3].indexOf(value.inputtype) !== -1" :label="value.content" style="margin-right: 5px;">{{ value.content }}</el-radio> -->
                            <el-radio-group
                              v-model="item.selectvalue"
                              :disabled="item.editstatus == 1"
                            >
                              <el-radio
                                v-if="[0, 3].indexOf(value.inputtype) !== -1"
                                :label="value.selectvalue"
                                style="margin-right: 5px"
                              >
                                <span v-if="value.content.indexOf('|X|') !== -1">
                                  <template
                                    v-for="(val, index) in value.content.split(',')"
                                  >
                                    <myInput
                                      :content="val"
                                      :disabled="val.editstatus == 1"
                                      :draggable="value.selectvalue != item.selectvalue"
                                      :count="value.content.split(',').length"
                                      :value.sync="value.remark"
                                      :index="index"
                                      :key="val"
                                    />
                                  </template>
                                </span>
                                <span v-else>
                                  {{ value.content }}
                                  <el-input
                                    v-if="[1, 3, 4].indexOf(value.inputtype) !== -1"
                                    size="mini"
                                    :disabled="value.content != item.selectvalue"
                                    v-model="value.remark"
                                    :placeholder="value.content"
                                    style="width: 160px"
                                  ></el-input>
                                </span>
                              </el-radio>
                            </el-radio-group>
                            <el-checkbox
                              v-if="[2, 4].indexOf(value.inputtype) !== -1"
                              v-model="value.flag"
                              :label="value.content"
                              :true-label="1"
                              :false-label="0"
                              >{{ value.content }}</el-checkbox
                            >
                            <!-- <el-input v-if="[1,3,4].indexOf(value.inputtype) !== -1" size="mini" v-model="value.remark" :placeholder="value.content" style="width: 160px;"></el-input> -->
                          </div>
                          <el-input
                            v-if="[1, 3, 4].indexOf(item.inputtype) !== -1"
                            size="mini"
                            :disabled="item.editstatus == 1"
                            v-model="item.remark"
                            placeholder="请输入"
                            style="width: 160px"
                          ></el-input>
                        </div>
                        <!-- 三级标题questionnaireitems -->
                        <div
                          class="three_topic"
                          v-for="item in item.questionnaireitems"
                          :key="item.itemcode"
                        >
                          <span v-if="item.itemname.indexOf('|X|') !== -1">
                            <template v-for="(val, index) in item.itemname.split(',')">
                              <myInput
                                :content="val"
                                :count="item.itemname.split(',').length"
                                :value.sync="item.remark"
                                :index="index"
                                :key="val"
                              />
                            </template>
                          </span>
                          <span v-else>
                            {{ item.itemname }}
                          </span>
                          <!-- 三级选项optionitems -->
                          <div class="three_content">
                            <!-- <el-checkbox-group v-model="checkList"> -->
                            <div
                              class="three_options"
                              v-for="(item, index) in item.optionitems"
                              :key="index"
                            >
                              <span v-if="[-1].indexOf(item.inputtype) !== -1">
                                <span v-if="item.content.indexOf('|X|') !== -1">
                                  <template
                                    v-for="(val, index) in item.content.split(',')"
                                  >
                                    <myInput
                                      :content="val"
                                      :count="item.content.split(',').length"
                                      :value.sync="item.remark"
                                      :index="index"
                                      :key="val"
                                    />
                                  </template>
                                </span>
                              </span>
                              <el-radio
                                v-model="sexradio"
                                v-if="[0, 3].indexOf(item.inputtype) !== -1"
                                :label="item.content"
                                style="margin-right: 5px"
                              >
                                <span v-if="item.content.indexOf('|X|') !== -1">
                                  <template
                                    v-for="(val, index) in item.content.split(',')"
                                  >
                                    <myInput
                                      :content="val"
                                      :count="item.content.split(',').length"
                                      :value.sync="item.remark"
                                      :index="index"
                                      :key="val"
                                    />
                                  </template>
                                </span>
                                <span v-else>
                                  {{ item.content }}
                                </span>
                              </el-radio>
                              <!-- <el-checkbox v-if="[2,4].indexOf(item.inputtype) !== -1" :label="item.content">{{ item.content }}</el-checkbox> -->
                              <!-- el-input item.content  -->
                              <el-checkbox
                                :label="item.hoyname"
                                v-if="[2, 4].indexOf(item.inputtype) !== -1"
                                v-model="item.flag"
                                :true-label="1"
                                :false-label="0"
                              >
                                <span v-if="item.content.indexOf('|X|') !== -1">
                                  <template
                                    v-for="(val, index) in item.content.split(',')"
                                  >
                                    <myInput
                                      :content="val"
                                      :disabled="item.flag == 0 ? true : false"
                                      :count="item.content.split(',').length"
                                      :value.sync="item.remark"
                                      :index="index"
                                      :key="val"
                                    />
                                  </template>
                                </span>
                                <span v-else>
                                  {{ item.content }}
                                </span>
                              </el-checkbox>
                              <el-input
                                v-if="[1].indexOf(item.inputtype) !== -1"
                                size="mini"
                                v-model="item.remark"
                                style="width: 160px"
                              ></el-input>
                              <el-input
                                v-if="[3, 4].indexOf(item.inputtype) !== -1"
                                :disabled="item.flag == 0"
                                size="mini"
                                v-model="item.remark"
                                style="width: 160px"
                              ></el-input>
                            </div>
                          </div>
                          <!-- </el-checkbox-group> -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <!-- <el-button @click="questionnairedetailsVisible = false">取 消</el-button> -->
                <el-button type="primary" @click="questionnairedetailsDialog"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </div>
          <!-- 组合问卷  -->
          <div
            class="combination_questionnaire"
            v-if="pageFlag == 'Combination_questionnaire'"
          >
            <div class="cqtable">
              <EasyTable
                height="100%"
                class="combination_data"
                :loading="loading"
                :data="combinationData"
                :tableOptions="combinationOptions"
                :checkbox-config="{ rowClick: false }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
                @row-click="handleCombination"
                @selected-change="handleSelectCombination"
              />
            </div>
            <div class="cqform">
              <div class="cqbtn_group">
                <el-button
                  :disabled="isDicCombination"
                  size="mini"
                  type="primary"
                  @click="handleQuestionnaireCombineLoadAddorEdit"
                  >保 存</el-button
                >
              </div>
              <el-form
                ref="form"
                :model="combinationForm"
                :disabled="isDicCombination"
                label-width="110px"
              >
                <el-form-item size="small" label="编号">
                  <el-input
                    disabled
                    placeholder="系统自增"
                    v-model="combinationForm.combineid"
                  ></el-input>
                </el-form-item>
                <el-form-item size="small" label="组合问卷名称">
                  <el-input placeholder="" v-model="combinationForm.name"></el-input>
                </el-form-item>
                <el-form-item size="small" label="性别">
                  <el-select
                    v-model="combinationForm.sex"
                    clearable
                    style="width: 100%"
                    placeholder="请选择"
                  >
                    <el-option label="未知" :value="0"> </el-option>
                    <el-option label="男" :value="1"> </el-option>
                    <el-option label="女" :value="2"> </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" class="lianjie" label="年龄范围">
                  <el-input placeholder="" v-model="combinationForm.minage"></el-input>
                  <div class="cqtips">-</div>
                  <el-input placeholder="" v-model="combinationForm.maxage"></el-input>
                </el-form-item>
                <el-form-item size="small" class="lianjie" label="IBM范围">
                  <el-input placeholder="" v-model="combinationForm.minibm"></el-input>
                  <div class="cqtips">-</div>
                  <el-input placeholder="" v-model="combinationForm.maxibm"></el-input>
                </el-form-item>
                <el-form-item size="small" label="状态">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="combinationForm.status"
                  >
                    <el-option label="启用" :value="0"></el-option>
                    <el-option label="停用" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="体检问卷">
                  <el-select
                    clearable
                    style="width: 100%"
                    v-model="combinationForm.quecodes"
                  >
                    <el-option
                      v-for="item in healthqueItems"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <!-- 人体系统新增删除 -->
      <el-dialog
        title="人体系统字典"
        :close-on-click-modal="false"
        class="humansystem_dia"
        width="550px"
        @close="handleCloseHumansystem"
        :visible.sync="showHumansystem"
      >
        <el-form
          :model="humansystemForm"
          :rules="humansystemRules"
          ref="humansystemForm"
          label-width="100px"
        >
          <el-form-item size="small" label="编码">
            <el-input
              disabled
              v-model="humansystemForm.code"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="名称" prop="name">
            <el-input v-model="humansystemForm.name"></el-input>
          </el-form-item>
          <el-form-item size="small" label="性别">
            <el-select v-model="humansystemForm.sex">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="状态">
            <el-select v-model="humansystemForm.status">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="humansystemForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseHumansystem">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitHumansystem"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 病史采集新增删除 -->
      <el-dialog
        title="病史采集字典"
        :close-on-click-modal="false"
        class="historytaking_dia"
        width="550px"
        @close="handleCloseHistorytaking"
        :visible.sync="showHistorytaking"
      >
        <el-form
          :model="historytakingForm"
          :rules="historytakingRules"
          ref="historytakingForm"
          label-width="100px"
        >
          <el-form-item size="small" label="自增ID">
            <el-input
              disabled
              v-model="historytakingForm.sysid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="chooseTaking" size="small" label="人体系统编码">
            <el-input disabled v-model="chooseTaking.code"></el-input>
          </el-form-item>
          <el-form-item size="small" label="病史编码">
            <el-input
              disabled
              v-model="historytakingForm.code"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="病史名称" prop="name">
            <el-input v-model="historytakingForm.name"></el-input>
          </el-form-item>
          <el-form-item size="small" label="性别">
            <el-select v-model="historytakingForm.sex">
              <el-option label="未知" :value="0"></el-option>
              <el-option label="男" :value="1"></el-option>
              <el-option label="女" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="录入方式">
            <el-select v-model="historytakingForm.inputtype">
              <el-option label="无" :value="-1"></el-option>
              <el-option label="单选" :value="0"></el-option>
              <el-option label="填写" :value="1"></el-option>
              <el-option label="多选" :value="2"></el-option>
              <el-option label="单选并填写" :value="3"></el-option>
              <el-option label="多选并填写" :value="4"></el-option>
              <el-option label="取消其他选项" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="启用状态">
            <el-select v-model="historytakingForm.status">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="输入框长">
            <el-input v-model="historytakingForm.contentlength"></el-input>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="historytakingForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseHistorytaking">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitHistorytaking"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 健康问卷字典新增删除 -->
      <el-dialog
        title="健康问卷字典"
        :close-on-click-modal="false"
        class="healthquestionnaire_dia"
        width="550px"
        @close="handleCloseHealthquestionnaire"
        :visible.sync="showHealthquestionnaire"
      >
        <el-form
          :model="healthquestionnaireForm"
          :rules="healthquestionnaireRules"
          ref="healthquestionnaireForm"
          label-width="100px"
        >
          <el-form-item size="small" label="编码">
            <el-input
              disabled
              v-model="healthquestionnaireForm.code"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="名称" prop="name">
            <el-input v-model="healthquestionnaireForm.name"></el-input>
          </el-form-item>
          <el-form-item size="small" label="是否子项">
            <el-select v-model="healthquestionnaireForm.ischild">
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="状态">
            <el-select v-model="healthquestionnaireForm.status">
              <el-option label="启用" :value="0"></el-option>
              <el-option label="停用" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="healthquestionnaireForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseHealthquestionnaire">取 消</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleSubmitHealthquestionnaireForm"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 问卷调查字典新增删除 -->
      <el-dialog
        title="问卷调查字典"
        :close-on-click-modal="false"
        class="questionnairedetails_dia"
        width="550px"
        @close="handleCloseQuestionnairedetails"
        :visible.sync="showQuestionnairedetails"
      >
        <el-form
          :model="questionnairedetailsForm"
          :rules="questionnairedetailsRules"
          ref="questionnairedetailsForm"
          label-width="100px"
        >
          <el-form-item size="small" label="自增ID">
            <el-input
              disabled
              v-model="questionnairedetailsForm.queid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="问卷编码">
            <el-input disabled v-model="questionnairedetailsForm.quecode"></el-input>
          </el-form-item>
          <el-form-item size="small" label="项目编码">
            <el-input
              disabled
              v-model="questionnairedetailsForm.itemcode"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="项目名称" prop="itemname">
            <el-input v-model="questionnairedetailsForm.itemname"></el-input>
          </el-form-item>
          <el-form-item size="small" label="父级编码">
            <el-select v-model="questionnairedetailsForm.hcode">
              <el-option
                v-for="(item, index) in questionnairedetailsData"
                :key="index"
                :label="item.itemname"
                :value="item.itemcode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="录入方式">
            <el-select v-model="questionnairedetailsForm.inputtype">
              <el-option label="无" :value="-1"></el-option>
              <el-option label="单选" :value="0"></el-option>
              <el-option label="填写" :value="1"></el-option>
              <el-option label="多选" :value="2"></el-option>
              <el-option label="单选并填写" :value="3"></el-option>
              <el-option label="多选并填写" :value="4"></el-option>
              <el-option label="取消其他选项" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="是否编辑">
            <el-select v-model="questionnairedetailsForm.editstatus">
              <el-option label="允许编辑" :value="0"></el-option>
              <el-option label="不允许编辑" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="输入框长">
            <el-input v-model="questionnairedetailsForm.contentlength"></el-input>
          </el-form-item>
          <el-form-item size="small" label="是否必填">
            <el-select v-model="questionnairedetailsForm.mustflag">
              <el-option label="非必填" :value="0"></el-option>
              <el-option label="必填" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="questionnairedetailsForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseQuestionnairedetails"
            >取 消</el-button
          >
          <el-button size="mini" type="primary" @click="handleSubmitQquestionnairedetails"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 调查问卷明细选项新增删除 -->
      <el-dialog
        title="调查问卷字典"
        :close-on-click-modal="false"
        class="optionalfilling_dia"
        width="550px"
        @close="handleCloseOptionalfilling"
        :visible.sync="showOptionalfilling"
      >
        <el-form
          :model="optionalfillingForm"
          :rules="optionalfillingRules"
          ref="optionalfillingForm"
          label-width="100px"
        >
          <el-form-item size="small" label="自增ID">
            <el-input v-if="isSubitemFlag" disabled placeholder="系统自增"></el-input>
            <el-input
              v-else
              disabled
              v-model="optionalfillingForm.tioid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="问卷编码">
            <el-input disabled v-model="optionalfillingForm.quecode"></el-input>
          </el-form-item>
          <el-form-item size="small" label="项目编码">
            <el-input
              disabled
              v-model="optionalfillingForm.itemcode"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="父级id">
            <!-- :disabled="!isSubitemFlag" -->
            <el-input
              v-model="optionalfillingForm.parentid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="项目名称" prop="itemname">
            <el-input v-model="optionalfillingForm.itemname"></el-input>
          </el-form-item>

          <el-form-item size="small" label="追问问题" prop="appendcontent">
            <el-input v-model="optionalfillingForm.appendcontent"></el-input>
          </el-form-item>
          <el-form-item size="small" label="选项内容" prop="content">
            <el-input v-model="optionalfillingForm.content"> </el-input>
          </el-form-item>
          <el-form-item size="small" label="录入方式">
            <el-select v-model="optionalfillingForm.inputtype">
              <el-option label="无" :value="-1"></el-option>
              <el-option label="单选" :value="0"></el-option>
              <el-option label="填写" :value="1"></el-option>
              <el-option label="多选" :value="2"></el-option>
              <el-option label="单选并填写" :value="3"></el-option>
              <el-option label="多选并填写" :value="4"></el-option>
              <el-option label="取消其他选项" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="是否编辑">
            <el-select v-model="optionalfillingForm.editstatus">
              <el-option label="允许编辑" :value="0"></el-option>
              <el-option label="不允许编辑" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="输入框长">
            <el-input v-model="optionalfillingForm.contentlength"></el-input>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="optionalfillingForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseOptionalfilling">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitOptionalfilling"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 调查问卷明细选项新增删除-三级 -->
      <el-dialog
        title="调查问卷字典"
        :close-on-click-modal="false"
        class="optionalfilling_dia"
        width="550px"
        @close="handleCloseOptionAnswer"
        :visible.sync="showOptionAnswer"
      >
        <!-- :rules="optionAnswerRules" -->
        <el-form :model="optionAnswerForm" ref="optionAnswerForm" label-width="100px">
          <el-form-item size="small" label="自增ID">
            <el-input
              disabled
              v-model="optionAnswerForm.answerid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="上级选项编码">
            <el-input
              disabled
              v-model="optionAnswerForm.tioid"
              placeholder="系统自增"
            ></el-input>
          </el-form-item>
          <el-form-item size="small" label="上级选项内容" prop="content">
            <el-input disabled v-model="optionAnswerForm.content"> </el-input>
          </el-form-item>
          <el-form-item size="small" label="选项内容" prop="content">
            <el-input v-model="optionAnswerForm.answercontent"> </el-input>
          </el-form-item>
          <el-form-item size="small" label="录入方式">
            <el-select v-model="optionAnswerForm.inputtype">
              <el-option label="无" :value="-1"></el-option>
              <el-option label="单选" :value="0"></el-option>
              <el-option label="填写" :value="1"></el-option>
              <el-option label="多选" :value="2"></el-option>
              <el-option label="单选并填写" :value="3"></el-option>
              <el-option label="多选并填写" :value="4"></el-option>
              <el-option label="取消其他选项" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="是否编辑">
            <el-select v-model="optionAnswerForm.editstatus">
              <el-option label="允许编辑" :value="0"></el-option>
              <el-option label="不允许编辑" :value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="输入框长">
            <el-input v-model="optionAnswerForm.contentlength"></el-input>
          </el-form-item>
          <el-form-item size="small" label="排序">
            <el-input v-model="optionAnswerForm.seqno"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseOptionAnswer">取 消</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitOptionAnswer"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <!-- 组合问卷预览 -->
      <el-dialog
        title="问卷预览"
        :close-on-click-modal="false"
        class="combinationPreview_dia"
        width="55%"
        top="1vh"
        height="100%"
        @close="handleClosecombinationPreview"
        :visible.sync="combinationDialogFlag"
      >
        <div class="previewTop">
          <el-steps :active="combinationStepsActive">
            <!-- description="" -->
            <el-step
              v-for="(item, index) in questionnaireData.dirList"
              :key="index"
              :title="item.name"
            ></el-step>
          </el-steps>
        </div>
        <div class="box">
          <!-- 问题及题目 -->
          <ul class="previewBody" style="padding: 0px">
            <li
              class="itemclas"
              v-for="(item, index) in questionnaireData.dirList[combinationStepsActive]
                .questions"
              :key="index"
            >
              <div class="title">{{ item.name }}</div>
              <!-- 问题 -->
              <template v-if="item.inputtype === 0">
                <div class="radioClas">
                  <div v-for="(k, i) in item.questions" :key="k.id + i">
                    <el-radio
                      v-model="item.radioVal"
                      :label="k.id"
                      @input="handleCkeck(k, i, item, index)"
                      class="radioItemClas"
                      >{{ k.name }}</el-radio
                    >
                  </div>
                </div>
              </template>
              <template v-if="item.inputtype === 1">
                <div class="radioClas">
                  <el-input
                    type="textarea"
                    v-model="item.inputVal"
                    placeholder="请输入内容"
                  ></el-input>
                </div>
              </template>
              <template v-if="item.inputtype === 2">
                <el-checkbox-group v-model="item.checkbox" class="radioClas">
                  <div v-for="(k, i) in item.questions" :key="i">
                    <!-- <div @click="handleCkeck(k, i, item, index)"> -->
                    <el-checkbox
                      class="radioItemClas"
                      :label="k.id"
                      @change="handleCkeck(k, i, item, index)"
                      >{{ k.name }}
                      <template v-if="k.checkVal"> ({{ k.checkVal }}) </template>
                    </el-checkbox>
                    <!-- </div> -->
                  </div>
                </el-checkbox-group>
              </template>
            </li>
          </ul>
          <div class="perviewFooter">
            <div class="perviewbtn_group">
              <el-button type="primary" @click="handlePreviouBtn">上一页</el-button>
              <el-button type="primary" @click="handleNextBtn">下一页</el-button>
            </div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="handleSubmitPreview"
            >关 闭</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import myInput from "./input.vue";
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";

import {
  getDicBodySystemList,
  getDicBodySystemAddorEdit,
  getDicBodySystemDelete,
  getDicMedicalHistoryList,
  getDicMedicalHistoryAddorEdit,
  getDicMedicalHistoryDelete,
  getDicQuestionnaireList,
  getDicQuestionnaireAddorEdit,
  getDicQuestionnaireDelete,
  getDicQuestionnaireItemList,
  getDicQuestionnaireItemAddorEdit,
  getDicQuestionnaireItemDelete,
  getDicOptionList,
  getDicOptionAddorEdit,
  getDicOptionDelete,
  getMedicalHistory,
  getQuestionnaire,
  questionnaireCombineLoad,
  questionnaireCombineLoadAddorEdit,
  questionnaireCombineDelete,
  OptionAnswerLoad,
  OptionAnswerAddorEdit,
  OptionAnswerDelete,
  PreviewQuestionnaireCombine,
} from "@/api/questionnaire.js";

export default {
  name: "questionnaire",

  components: { Sticky, permissionBtn, myInput },

  data() {
    return {
      questionnaireName: "", //  问卷名称
      sexradio: [],
      questionnairelist: [], // 问卷明细数据
      questionnairedetailsVisible: false, // 问卷明细 预览 dialog开关
      medicalHistory: [], // 病史采集 预览问卷数据
      history_takingVisible: false, // 病史采集预览 dialog开关
      questionNaireBtnDomId: "hide", // 是否显示预览按钮  show-显示   hide-隐藏
      treeData: [
        {
          label: "人体系统",
          name: "Human_system",
          id: 1,
        },
        {
          label: "病史采集",
          name: "History_taking",
          id: 2,
        },
        {
          label: "健康问卷",
          name: "Health_questionnaire",
          id: 3,
        },
        {
          label: "问卷明细",
          name: "Questionnaire_details",
          id: 4,
        },
        {
          label: "组合问卷",
          name: "Combination_questionnaire",
          id: 5,
        },
      ], // 文档树渲染数据
      defaultProps: {
        children: "children",
        label: "label",
      }, // 文档树渲染配置
      defaultChecked: [1], // 默认选中数据
      searchName: "", // 筛选名称
      deptItems: [], // 筛选科室下拉数据回调
      loading: false, //表格加载效果
      pageFlag: "", // 页面显示控制
      humanSystemData: [], // 人体系统表格数据
      takingData: [
        {
          label: "全部",
          children: [],
        },
      ], // 病史采集树形筛选条件菜单
      takingProps: {
        children: "children",
        label: "label",
      }, // 病史采集文档树渲染配置
      historytakingData: [], // 病史采集表格数据
      healthquestionnaireData: [], // 健康问卷表格数据
      chooseSelect: "", // 选中筛选项
      questionnairedetailsData: [], // 问卷明细表格数据
      optionalfillingData: [], // 问卷明细选填表格数据
      showHumansystem: false, // 人体系统新增编辑弹框控制
      humansystemForm: {
        code: "",
        name: "",
        sex: 0,
        status: 0,
        seqno: 0,
      }, // 人体系统新增编辑表单对象
      humansystemRules: {
        name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
      }, // 人体系统新增编辑表单验证
      chooseItem: undefined, // 选中人体系统操作数据行
      chooseTaking: undefined, // 选中人体系统数据
      showHistorytaking: false, // 病史采集新增编辑弹框控制
      historytakingForm: {
        sysid: "",
        syscode: "",
        code: "",
        name: "",
        sex: 0,
        inputtype: 0,
        contentlength: 0,
        status: 0,
        seqno: 0,
      }, // 病史采集新增编辑表单对象
      historytakingRules: {
        name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
      }, // 病史采集新增编辑表单验证
      chooseTakingItem: undefined, // 选中病史采集操作数据行
      showHealthquestionnaire: false, // 健康问卷字典控制显示
      chooseHealthquestionnaireItem: undefined, // 健康问卷选中项回调
      healthquestionnaireForm: {
        code: "",
        name: "",
        ischild: 1,
        status: 0,
        seqno: 0,
      }, // 健康问卷新增编辑表单对象
      healthquestionnaireRules: {
        name: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
      }, // 健康问卷新增编辑表单验证
      healthOption: [], // 问卷调查数据筛选
      showQuestionnairedetails: false, // 问卷调查新增编辑
      chooseQuestionnairedetailsItem: undefined, // 问卷调查选中数据项
      questionnairedetailsForm: {
        queid: "",
        quecode: "",
        itemcode: "",
        itemname: "",
        hcode: "",
        inputtype: 0,
        seqno: 0,
        editstatus: 0,
        contentlength: 0,
        delflag: 0,
      }, // 问卷调查新增编辑表单对象
      questionnairedetailsRules: {
        itemname: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
      }, // 问卷调查新增编辑表单验证
      showOptionalfilling: false, // 调查问卷明细选项字典控制显示
      chooseOptionalfillingItem: undefined, // 调查问卷明细选项字典控制显示
      optionalfillingForm: {
        tioid: "",
        quecode: "",
        itemcode: "",
        itemname: "",
        content: "",
        inputtype: 0,
        editstatus: 0,
        contentlength: 0,
        seqno: 0,
        appendcontent: "",
      }, // 健康问卷新增编辑表单对象
      optionalfillingRules: {
        itemname: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
        content: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
      }, // 健康问卷新增编辑表单验证
      chooseOoptionalfilling: undefined, // 健康问卷新增编辑选中数据
      combinationData: [],
      combinationForm: {
        combineid: "",
        name: "",
        sex: 0,
        minage: 0,
        maxage: 0,
        minibm: 0,
        maxibm: 0,
        quecodes: "",
        status: 0,
      },
      isDicCombination: false,
      chooseCombination: null,
      selectCombination: [],
      healthqueItems: [],
      optionanswerData: [],
      showOptionAnswer: false,
      optionAnswerForm: {
        answerid: "",
        tioid: "",
        answercontent: "",
        inputtype: 0,
        seqno: 0,
        editstatus: 0,
        contentlength: 0,
        contentlength: 0,
      },
      chooseOoptionAnswer: undefined, // 健康问卷新增编辑选中数据
      isSubitemFlag: false, // 是否为添加子项
      activeClas: "", // 高亮
      combinationDialogFlag: false, //预览
      combinationStepsActive: 0, // 步骤条
      questionnaireData: {
        dirList: [{ questions: [] }],
      }, // 组合问卷数据
      previewInitData: [], // 预览数据
      dialogTitle: "", // 标题
      dialogShow: false, // 预览开关
      dialogData: [], // 弹框数据
      checkData: {},
      // DialogWarning: false, // 弹框提示
      // dialogBtnLoading: false, // 弹框按钮状态
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 组合问卷表格配置
    combinationOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编码",
          prop: "combineid",
          width: 110,
          omit: 1,
        },
        {
          title: "组合问卷名称",
          prop: "name",
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 80,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄范围",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                {data.minage} - {data.maxage}
              </div>
            );
          },
        },
        {
          title: "ibm范围",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                {data.minibm} - {data.maxibm}
              </div>
            );
          },
        },
        {
          title: "启用状态",
          prop: "status",
          width: 90,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
      ];
    },
    // 人体系统表格配置
    humanSystemOptions() {
      return [
        {
          title: "系统编码",
          prop: "code",
        },
        {
          title: "系统名称",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleClickHumanSystem(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "排序",
          prop: "seqno",
        },
        {
          title: "拼音码",
          prop: "pycode",
        },
        {
          title: "五笔码",
          prop: "wbcode",
        },
        {
          title: "删除标志",
          prop: "delflag",
          returnVal: (value) => {
            return value == 0 ? "正常" : "删除";
          },
        },
      ];
    },
    // 病史采集表格配置
    historytakingOptions() {
      return [
        {
          title: "系统名称",
          prop: "syscodename",
        },
        {
          title: "病史编码",
          prop: "code",
        },
        {
          title: "病史名称",
          prop: "name",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleClickHistoryTaking(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "性别",
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "录入方式",
          prop: "inputtype",
          enumType: [
            {
              value: -1,
              label: "无",
            },
            {
              value: 0,
              label: "单选",
            },
            {
              value: 1,
              label: "填写",
            },
            {
              value: 2,
              label: "多选",
            },
            {
              value: 3,
              label: "单选并填写",
            },
            {
              value: 4,
              label: "多选并填写",
            },
            {
              value: 5,
              label: "取消其他选项",
            },
          ],
        },
        {
          title: "状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "排序",
          prop: "seqno",
        },
        {
          title: "删除标志",
          prop: "delflag",
          returnVal: (value) => {
            return value == 0 ? "正常" : "删除";
          },
        },
      ];
    },
    // 健康问卷表格配置
    healthquestionnaireOptions() {
      return [
        {
          title: "问卷编码",
          prop: "code",
        },
        {
          title: "问卷名称",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleClickHealthquestionnaire(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "是否子项",
          prop: "ischild",
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "排序",
          prop: "seqno",
        },
        {
          title: "拼音码",
          prop: "pycode",
        },
        {
          title: "五笔码",
          prop: "wbcode",
        },
        {
          title: "删除标志",
          prop: "delflag",
          returnVal: (value) => {
            return value == 0 ? "正常" : "删除";
          },
        },
      ];
    },
    // 问卷明细表格配置
    questionnairedetailsOptions() {
      return [
        {
          title: "明细编码",
          prop: "itemcode",
          width: 100,
        },
        {
          title: "父级编码",
          prop: "hcode",
          width: 100,
        },
        {
          title: "问卷明细",
          prop: "itemname",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleClickQuestionnairedetails(data)}
              >
                {data.itemname}
              </el-link>
            );
          },
        },
        {
          title: "录入方式",
          prop: "inputtype",
          width: 110,
          enumType: [
            {
              value: -1,
              label: "无",
            },
            {
              value: 0,
              label: "单选",
            },
            {
              value: 1,
              label: "填写",
            },
            {
              value: 2,
              label: "多选",
            },
            {
              value: 3,
              label: "单选并填写",
            },
            {
              value: 4,
              label: "多选并填写",
            },
            {
              value: 5,
              label: "取消其他选项",
            },
          ],
        },
        {
          title: "排序",
          prop: "seqno",
          width: 60,
        },
        // {
        //   title: "删除标志",
        //   prop: "delflag",
        //   returnVal: (value) => {
        //     return value == 0 ? "正常" : "删除";
        //   },
        // },
      ];
    },
    // 问卷明细选填表格配置
    optionalfillingOptions() {
      return [
        {
          title: "问卷选填模板",
          width: 110,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleEditOoptionalfilling(data)}
              >
                {data.content}
              </el-link>
            );
          },
        },
        {
          title: "录入方式",
          prop: "inputtype",
          width: 110,
          enumType: [
            {
              value: -1,
              label: "无",
            },
            {
              value: 0,
              label: "单选",
            },
            {
              value: 1,
              label: "填写",
            },
            {
              value: 2,
              label: "多选",
            },
            {
              value: 3,
              label: "单选并填写",
            },
            {
              value: 4,
              label: "多选并填写",
            },
            {
              value: 5,
              label: "取消其他选项",
            },
          ],
        },
        {
          title: "排序",
          prop: "seqno",
          width: 50,
        },
        {
          title: "id",
          width: 60,
          prop: "tioid",
        },
        {
          title: "父级id",
          width: 70,
          prop: "parentid",
        },
      ];
    },
    // 问卷明细选填表格配置-三级
    optionanswerOptions() {
      return [
        {
          title: "三级选项内容1",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                vOn:click_stop_prevent={() => this.handleEditOptionAnswer(data)}
              >
                {data.answercontent}
              </el-link>
            );
          },
        },
        {
          title: "录入方式",
          prop: "inputtype",
          width: 110,
          enumType: [
            {
              value: -1,
              label: "无",
            },
            {
              value: 0,
              label: "单选",
            },
            {
              value: 1,
              label: "填写",
            },
            {
              value: 2,
              label: "多选",
            },
            {
              value: 3,
              label: "单选并填写",
            },
            {
              value: 4,
              label: "多选并填写",
            },
            {
              value: 5,
              label: "取消其他选项",
            },
          ],
        },
        {
          title: "排序",
          prop: "seqno",
        },
      ];
    },
  },
  mounted() {
    this.handleCheckNode();
    // this.handleCombinationoPreview(); // 测试预览  要删掉
  },

  methods: {
    // 点击问题的追问开关
    handleCkeck(item, i, father, index) {
      console.log(item, father);
      item.checked = item.checked ? false : true; // 此处表示数据是否为勾选状态
      // 如果取消掉当前数据的勾选就清空checkbox
      if (!item.checked) {
        item.checkbox = []; // 多选项目
        item.radioVal = ""; // 单选项如果有值, 就清空
        item.checkVal = "";
      }
      let parent = this.questionnaireData.dirList[this.combinationStepsActive].questions[
        index
      ];
      if (!!parent) {
        let num = 0;
        // 子问题的父级id就是 题目的id,所以用题目的id筛选出子问题, 然后将子问题删除
        this.questionnaireData.dirList[this.combinationStepsActive].questions.forEach(
          (k, i, array) => {
            if (parent.id == k.parentid) {
              // console.log(k, "需要删除的数据");
              k.checkbox = [];
              k.checked = false;
              k.childItemFlag = true;
              k.isChild = true;
              k.radioVal = "";
              k.inputVal = "";
              num++;
            }
          }
        );
        // console.log("一共几个" + num,'从这里删除的索引:'+(index+1));
        this.questionnaireData.dirList[this.combinationStepsActive].questions.splice(
          index + 1,
          num
        );
      }
      if (item.childquestions && item.childquestions.length > 0 && item.inputtype !== 5) {
        // 把子问题插入到问题数组中
        item.childquestions.forEach((childItem, childIndex) => {
          this.questionnaireData.dirList[this.combinationStepsActive].questions.forEach(
            (k, i, array) => {
              const INDEX = array.findIndex((u) => u.id == childItem.id);
              if (INDEX == -1) {
                array.splice(index + 1, 0, childItem);
                index++;
              }
            }
          );
        });
      } else if (item.questions.length > 0 && item.inputtype !== 5 && item.checked) {
        // 有追问 并且不是选项无
        this.dialogTitle = item.appendcontent; // 弹框标题
        this.dialogShow = item.checked; // 开关
        this.dialogData = item; // 数据
        this.checkData = {
          fatherData: item,
          fatherIndex: index,
          childIndex: i,
        };
        console.log("进1", "问题的:" + item.checked, "弹框的:" + this.dialogShow);
      }

      //// 如果之前点击过-无- 就把无的id过滤掉
      if (item.inputtype == 1 || item.inputtype != 5) {
        father.checkbox = father.checkbox.filter((id) => {
          const ID = father.questions.find((u) => {
            if (u.name == "无") {
              console.log(u, "有无");
              return u;
            }
          });
          if (ID) {
            return id != ID.id;
          } else {
            return id;
          }
        });
      }
      // 选择了无
      if (item.inputtype == 5) {
        console.log("进2, 当前:", item, "父:", father);
        father.checkbox = [item.id];
        father.questions.forEach((c) => {
          c.checked = false;
          c.radioVal = ""; // 单选项如果有值, 就清空
          c.checkVal = "";
          c.checkbox = [];
          // console.log(c, "答案");
        });

        this.dialogShow = false; // 开关
      }
    },
    // 上一页
    handlePreviouBtn() {
      if (this.combinationStepsActive == 0) return;
      this.combinationStepsActive--;
    },
    // 下一页
    handleNextBtn() {
      if (this.combinationStepsActive == this.questionnaireData.dirList.length - 1)
        return;
      this.combinationStepsActive++;
    },
    // 组合预览确定回调
    handleSubmitPreview() {
      this.combinationDialogFlag = false;
    },
    // 组合问卷弹框关闭
    handleClosecombinationPreview() {
      this.combinationDialogFlag = false;
    },
    // 添加子项按钮回调
    handleSetDicAddSubitem() {
      if (!this.chooseOoptionalfilling) {
        this.$message.warning("请选中添加子项数据项!");
        return false;
      }
      this.isSubitemFlag = true;
      this.optionalfillingForm.parentid = this.chooseOoptionalfilling.tioid;
      this.handleAddOptionalfilling();
    },
    // 问卷明细三级字典删除
    handleGetOptionAnswerDelete() {
      if (!this.chooseOoptionAnswer) {
        this.$message.warning("请选中删除数据项!");
        return false;
      }
      let codeItems = [this.chooseOoptionAnswer.answerid];
      OptionAnswerDelete(codeItems).then((res) => {
        this.chooseOoptionAnswer = undefined;
        this.$message.success(res.message);
        this.handleGetDicOptionAnswerList();
      });
    },
    // 问卷明细三级字典编辑
    handleEditOptionAnswerData() {
      if (!this.chooseOoptionAnswer) {
        this.$message.warning("请选中编辑数据项!");
        return false;
      }
      this.handleEditOptionAnswer();
    },
    // 问卷明细三级字典编辑
    handleEditOptionAnswer(item) {
      if (item) {
        this.showOptionAnswer = true;
        this.optionAnswerForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showOptionAnswer = true;
        this.optionAnswerForm = JSON.parse(JSON.stringify(this.chooseOoptionAnswer));
      }
    },
    // 问卷明细三级字典列表
    handleGetDicOptionAnswerList() {
      OptionAnswerLoad({
        page: 1,
        limit: 100000,
        key: "",
        code: this.chooseOoptionalfilling.tioid,
      }).then((res) => {
        this.optionanswerData = res.data;
      });
    },
    // 问卷明细三级字典弹框保存提交
    handleSubmitOptionAnswer() {
      OptionAnswerAddorEdit(this.optionAnswerForm).then((res) => {
        this.$message.success(res.message);
        this.handleGetDicOptionAnswerList(); // 刷新首页数据
        this.handleCloseOptionAnswer(); // 关闭弹框
      });
    },
    // 问卷明细三级字典弹框关闭
    handleCloseOptionAnswer() {
      this.optionAnswerForm = {
        answerid: "",
        tioid: "",
        answercontent: "",
        inputtype: 0,
        seqno: 0,
        editstatus: 0,
        contentlength: 0,
      }; // 问卷调查新增编辑表单对象
      this.chooseOoptionAnswer = undefined;
      this.showOptionAnswer = false;
    },
    // 问卷明细三级字典新增
    handleAddOptionAnswer() {
      if (!this.chooseSelect) {
        this.$message.warning("请选中健康问卷再新增!");
        return false;
      }
      if (!this.chooseOoptionalfilling) {
        this.$message.warning("请先选中父级选项!");
        return false;
      }
      this.optionAnswerForm.tioid = this.chooseOoptionalfilling.tioid;
      this.optionAnswerForm.content = this.chooseOoptionalfilling.content;
      this.showOptionAnswer = true;
    },
    // 问卷明细三级字典
    handleClickOptionanswer(data) {
      this.chooseOoptionAnswer = data;
    },
    // 组合问卷删除
    handleQuestionnaireCombineDelete() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectCombination.map((k) => {
            return k.combineid;
          });
          questionnaireCombineDelete(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetCombinationForm();
            this.chooseCombination = null;
            this.isDicCombination = true; // 解除表单限制
            this.selectCombination = [];
            this.handleLoadCombination();
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
    // 组合问卷 行点击回调
    handleCombination(row) {
      if (!row) return;
      this.isDicCombination = true; // 解除表单限制
      this.chooseCombination = JSON.parse(JSON.stringify(row));
      this.combinationForm = JSON.parse(JSON.stringify(row));
    },
    // 组合问卷 勾选
    handleSelectCombination(val) {
      this.selectCombination = val;
      console.log(this.selectCombination);
    },
    // 组合问卷 列表加载
    handleLoadCombination() {
      this.loading = true;
      questionnaireCombineLoad({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetCombinationForm();
            this.isDicCombination = true; // 解除表单限制
            this.combinationData = [];
            return;
          }
          this.combinationData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 组合问卷 新增/编辑保存
    handleQuestionnaireCombineLoadAddorEdit() {
      questionnaireCombineLoadAddorEdit(this.combinationForm).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetCombinationForm();
        this.chooseCombination = null;
        this.isDicCombination = true; // 解除表单限制
        this.selectCombination = [];
        this.handleLoadCombination();
      });
    },
    // 组合问卷 表单重置
    handleResetCombinationForm() {
      this.combinationForm = {
        combineid: "",
        name: "",
        sex: 0,
        minage: 0,
        maxage: 0,
        minibm: 0,
        maxibm: 0,
        quecodes: "",
        status: 0,
      };
    },
    // 问卷明细 预览dialog弹框确定关闭回调
    questionnairedetailsDialog() {
      this.questionnairedetailsVisible = false;
      console.log(this.questionnairelist);
    },
    // 病史采集 预览dialog弹框确定关闭回调
    handleHistory_takingDialog() {
      this.history_takingVisible = false;
      console.log(this.medicalHistory);
    },
    setData(data) {
      !!data &&
        data.dirList.forEach((item, index) => {
          item.questions.forEach((f, i) => {
            f.inputVal = "";
            f.radioVal = "";
            f.checkbox = [];
            f.questions.forEach((s, i) => {
              s.checked = false;
              s.inputVal = "";
              s.radioVal = "";
              s.checkbox = [];
              if (s.questions.length > 0) {
                s.checkVal = "";
              }
              if (s.childquestions.length > 0) {
                s.childquestions.forEach((g, i) => {
                  g.checked = false;
                  g.inputVal = "";
                  g.radioVal = "";
                  g.checkbox = [];
                  g.childItemFlag = true;
                  g.isChild = true;
                  g.questions.forEach((v, k) => {
                    v.checked = false;
                    v.inputVal = "";
                    v.radioVal = "";
                    v.checkbox = [];
                  });
                });
              }
              s.questions.forEach((g, i) => {
                g.checked = false;
                g.inputVal = "";
                g.radioVal = "";
                g.checkbox = [];
              });
            });
          });
        });
      this.questionnaireData = data;
      console.log(this.questionnaireData, "初始数据");
    },

    // 组合预览按钮
    handleCombinationoPreview() {
      console.log("组合预览按钮");

      PreviewQuestionnaireCombine({
        combineid: this.selectCombination[0].combineid,
        // combineid: 10,
      }).then((res) => {
        // console.log(res);
        this.setData(res.result);
        this.combinationDialogFlag = true;
        this.combinationStepsActive = 0;
      });
    },
    // 预览按钮回调
    handleBtnPreview() {
      if (this.pageFlag == "History_taking") {
        console.log("病史采集");
        this.history_takingVisible = true;
        getMedicalHistory().then((res) => {
          console.log(res, "请求");
          this.medicalHistory = res.result;
        });
      } else {
        console.log("问卷明细");
        const result = this.healthOption.find((k) => {
          if (k.code == this.chooseSelect) {
            return k;
          }
        });
        if (!!result && !!result.name) {
          this.questionnairedetailsVisible = true; // 打开dialog
          this.questionnaireName = result.name; // 给问卷名称字段赋值,预览不同问卷, 显示不同名称
          getQuestionnaire({ titlecode: result.code }).then((res) => {
            this.questionnairelist = res.result;
          });
        }
      }
    },
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
    // 调查问卷明细选项删除回调
    handleGetDicOptionDelete() {
      if (!this.chooseOoptionalfilling) {
        this.$message.warning("请选中删除数据项!");
        return false;
      }
      let codeItems = [this.chooseOoptionalfilling.tioid];
      getDicOptionDelete(codeItems).then((res) => {
        this.chooseOoptionalfilling = undefined;
        this.$message.success(res.message);
        this.handleGetDicOptionList();
      });
    },
    // 调查问卷明细选项编辑回调
    handleEditOoptionalfillingData() {
      if (!this.chooseOoptionalfilling) {
        this.$message.warning("请选中编辑数据项!");
        return false;
      }
      this.handleEditOoptionalfilling();
    },
    // 调查问卷明细选项编辑回调
    handleEditOoptionalfilling(item) {
      if (item) {
        this.showOptionalfilling = true;
        // this.isSubitemFlag = true;
        this.optionalfillingForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showOptionalfilling = true;
        // this.isSubitemFlag = true;
        this.optionalfillingForm = JSON.parse(
          JSON.stringify(this.chooseOoptionalfilling)
        );
      }
    },
    // 调查问卷明细选项选中项赋值
    handleClickOoptionalfilling(data) {
      this.chooseOoptionalfilling = data;
      this.activeClas = data.$index;
      this.handleGetDicOptionAnswerList();
    },
    // 调查问卷明细选项字典新增回调
    handleAddOptionalfilling() {
      if (!this.chooseSelect) {
        this.$message.warning("请选中健康问卷再新增!");
        return false;
      }
      if (!this.chooseQuestionnairedetailsItem) {
        this.$message.warning("请先选中父级选项!");
        return false;
      }
      this.optionalfillingForm.quecode = this.chooseSelect;
      this.optionalfillingForm.itemcode = this.chooseQuestionnairedetailsItem.itemcode;
      this.optionalfillingForm.itemname = this.chooseQuestionnairedetailsItem.itemname;
      this.showOptionalfilling = true;
    },
    // 调查问卷明细选项字典新增编辑弹框提交
    handleSubmitOptionalfilling() {
      this.$refs["optionalfillingForm"].validate((valid) => {
        if (valid) {
          getDicOptionAddorEdit(this.optionalfillingForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicOptionList(); // 刷新首页数据
            this.handleCloseOptionalfilling(); // 关闭弹框
          });
        }
      });
    },
    // 调查问卷明细选项字典新增编辑弹框关闭
    handleCloseOptionalfilling() {
      this.$refs["optionalfillingForm"].clearValidate();
      this.optionalfillingForm = {
        tioid: "",
        quecode: "",
        itemcode: "",
        itemname: "",
        content: "",
        inputtype: 0,
        editstatus: 0,
        seqno: 0,
        appendcontent: "",
        parentid: "",
      }; // 问卷调查新增编辑表单对象
      // this.chooseOoptionalfilling = undefined;
      this.showOptionalfilling = false;
      this.isSubitemFlag = false; // 关闭子项状态
    },
    // 调查问卷明细选项字典列表数据回调
    handleGetDicOptionList() {
      getDicOptionList({
        page: 1,
        limit: 100000,
        key: "",
        code: this.chooseQuestionnairedetailsItem.queid,
      }).then((res) => {
        this.optionalfillingData = res.data;
      });
    },
    // 问卷明细删除回调数据回调
    handleGetDicQuestionnaireItemDelete() {
      let codeItems = [this.chooseQuestionnairedetailsItem.queid];
      getDicQuestionnaireItemDelete(codeItems).then((res) => {
        this.chooseQuestionnairedetailsItem = undefined;
        this.$message.success(res.message);
        this.handleGetDicQuestionnaireItemList();
      });
    },
    // 问卷明细编辑回调
    handleClickQuestionnairedetails(item) {
      if (item) {
        this.showQuestionnairedetails = true;
        this.questionnairedetailsForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showQuestionnairedetails = true;
        this.questionnairedetailsForm = JSON.parse(
          JSON.stringify(this.chooseQuestionnairedetailsItem)
        );
      }
    },
    // 问卷调查表格点击
    handleQuestionnairedetails(data) {
      this.chooseQuestionnairedetailsItem = data;
      this.optionanswerData = []; // 三级
      this.handleGetDicOptionList();
    },
    // 问卷明细新增编辑弹框提交
    handleSubmitQquestionnairedetails() {
      this.$refs["questionnairedetailsForm"].validate((valid) => {
        if (valid) {
          getDicQuestionnaireItemAddorEdit(this.questionnairedetailsForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicQuestionnaireItemList(); // 刷新首页数据
            this.handleCloseQuestionnairedetails(); // 关闭弹框
          });
        }
      });
    },
    // 问卷明细新增编辑弹框关闭
    handleCloseQuestionnairedetails() {
      this.$refs["questionnairedetailsForm"].clearValidate();
      this.questionnairedetailsForm = {
        queid: "",
        quecode: "",
        itemcode: "",
        itemname: "",
        hcode: "",
        inputtype: 0,
        seqno: 0,
        editstatus: 0,
        delflag: 0,
      }; // 问卷调查新增编辑表单对象
      this.chooseQuestionnairedetailsItem = undefined;
      this.showQuestionnairedetails = false;
    },
    // 头部筛选下拉改变回调
    handleChangeChooseSelect() {
      this.handleGetDicQuestionnaireItemList();
    },
    // 问卷明细列表数据回调
    handleGetDicQuestionnaireItemList() {
      getDicQuestionnaireItemList({
        page: 1,
        limit: 100000,
        key: this.searchName,
        code: this.chooseSelect,
      }).then((res) => {
        this.questionnairedetailsData = res.data;
      });
    },
    // 健康问卷字典删除数据回调
    handleGetDicQuestionnaireDelete() {
      let codeItems = [this.chooseHealthquestionnaireItem.code];
      getDicQuestionnaireDelete(codeItems).then((res) => {
        this.chooseHealthquestionnaireItem = undefined;
        this.$message.success(res.message);
        this.content.inputtype = "X岁,X次,X次";
        this.itemname = "项目名称";
        //
        this.handleGetDicQuestionnaireList();
      });
    },
    // 健康问卷字典表格点击赋值回调
    handleHealthquestionnaire(data) {
      this.chooseHealthquestionnaireItem = data;
    },
    // 健康问卷字典编辑回调
    handleClickHealthquestionnaire(item) {
      if (item) {
        this.showHealthquestionnaire = true;
        this.healthquestionnaireForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showHealthquestionnaire = true;
        this.healthquestionnaireForm = JSON.parse(
          JSON.stringify(this.chooseHealthquestionnaireItem)
        );
      }
    },
    // 健康问卷字典弹框提交回调
    handleSubmitHealthquestionnaireForm() {
      this.$refs["healthquestionnaireForm"].validate((valid) => {
        if (valid) {
          getDicQuestionnaireAddorEdit(this.healthquestionnaireForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicQuestionnaireList(); // 刷新首页数据
            this.handleCloseHealthquestionnaire(); // 关闭弹框
          });
        }
      });
    },
    // 健康问卷字典弹框关闭回调
    handleCloseHealthquestionnaire() {
      this.$refs["healthquestionnaireForm"].clearValidate();
      this.healthquestionnaireForm = {
        code: "",
        name: "",
        ischild: 1,
        status: 0,
        seqno: 0,
      }; // 健康问卷新增编辑表单对象
      this.chooseHealthquestionnaireItem = undefined;
      this.showHealthquestionnaire = false;
    },
    // 健康问卷字典列表回调
    handleGetDicQuestionnaireList() {
      getDicQuestionnaireList({
        page: 1,
        limit: 100000,
        key: this.searchName,
      }).then((res) => {
        this.healthquestionnaireData = res.data;
      });
    },
    //  病史采集新增删除
    handleGetDicMedicalHistoryDelete() {
      let codeItems = [this.chooseTakingItem.code];
      getDicMedicalHistoryDelete(codeItems).then((res) => {
        this.chooseTakingItem = undefined;
        this.$message.success(res.message);
        this.handleGetDicMedicalHistoryList();
      });
    },
    //  病史采集新增编辑弹框提交
    handleSubmitHistorytaking() {
      this.$refs["historytakingForm"].validate((valid) => {
        if (valid) {
          this.chooseTaking && (this.historytakingForm.syscode = this.chooseTaking.code);
          getDicMedicalHistoryAddorEdit(this.historytakingForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicMedicalHistoryList(); // 刷新首页数据
            this.handleCloseHistorytaking(); // 关闭弹框
          });
        }
      });
    },
    //  病史采集编辑回调
    handleClickHistoryTaking(item) {
      if (item) {
        this.showHistorytaking = true;
        this.historytakingForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showHistorytaking = true;
        this.historytakingForm = JSON.parse(JSON.stringify(this.chooseTakingItem));
      }
    },
    //  病史采集选中数据行赋值
    handleHistorytaking(data) {
      this.chooseTakingItem = data;
    },
    //  病史采集新增编辑弹框关闭
    handleCloseHistorytaking() {
      this.$refs["historytakingForm"].clearValidate();
      this.historytakingForm = {
        sysid: "",
        syscode: "",
        code: "",
        name: "",
        sex: 0,
        inputtype: 0,
        contentlength: 0,
        status: 0,
        seqno: 0,
      }; // 病史采集新增编辑表单对象
      this.chooseTaking = undefined;
      this.chooseTakingItem = undefined;
      this.showHistorytaking = false;
    },
    //  病史字典列表
    handleGetDicMedicalHistoryList(code = "") {
      getDicMedicalHistoryList({
        page: 1,
        limit: 100000,
        key: this.searchName,
        code,
      }).then((res) => {
        this.historytakingData = res.data;
      });
    },
    // 人体系统删除回调
    handleGetDicBodySystemDelete() {
      let codeItems = [this.chooseItem.code];
      getDicBodySystemDelete(codeItems).then((res) => {
        this.chooseItem = undefined;
        this.$message.success(res.message);
        this.handleGetDicBodySystemList();
      });
    },
    // 人体系统单行数据点击回调
    handleHumanSystem(data) {
      this.chooseItem = data;
    },
    // 人体系统编辑回调
    handleClickHumanSystem(item) {
      if (item) {
        this.showHumansystem = true;
        this.humansystemForm = JSON.parse(JSON.stringify(item));
      } else {
        this.showHumansystem = true;
        this.humansystemForm = JSON.parse(JSON.stringify(this.chooseItem));
      }
    },
    // 人体系统新增编辑弹框提交回调
    handleSubmitHumansystem() {
      this.$refs["humansystemForm"].validate((valid) => {
        if (valid) {
          getDicBodySystemAddorEdit(this.humansystemForm).then((res) => {
            this.$message.success(res.message);
            this.handleGetDicBodySystemList(); // 刷新首页数据
            this.handleCloseHumansystem(); // 关闭弹框
          });
        }
      });
    },
    // 人体系统新增编辑弹框关闭回调
    handleCloseHumansystem() {
      this.$refs["humansystemForm"].clearValidate();
      this.humansystemForm = {
        code: "",
        name: "",
        sex: 0,
        status: 0,
        seqno: 0,
      }; // 人体系统新增编辑表单对象
      this.chooseItem = undefined;
      this.showHumansystem = false;
    },
    // 人体系统字典新增或修改
    handleGetDicBodySystemAddorEdit() {
      getDicBodySystemAddorEdit().then((res) => {
        console.log(res);
      });
    },
    // 人体系统字典列表回调
    handleGetDicBodySystemList() {
      getDicBodySystemList({
        page: 1,
        limit: 100000,
        key: this.searchName,
      }).then((res) => {
        this.humanSystemData = res.data;
      });
    },
    // 病史采集树形筛选条件回,调
    handleNodeClickTaking(data) {
      if (data && data.code) {
        this.chooseTaking = data;
      }
      if (data.code) {
        this.handleGetDicMedicalHistoryList(data.code);
      } else {
        this.handleGetDicMedicalHistoryList();
      }
    },
    // 树形结构选中储存回调
    handleCheckNode() {
      // 页面加载默认选中第一个
      this.$nextTick(() => {
        // let currentNode = localStorage.getItem("currentNode");
        let code = "";
        // if (currentNode) {
        //   this.defaultChecked.push(currentNode);
        //   code = currentNode;
        // } else {
        this.defaultChecked.push(this.treeData[0].id);
        code = this.treeData[0].id;
        // }
        this.$refs[`treeItem_${code}`].click();
      });
    },
    // 筛选输入框回调
    handleSearchName() {
      console.log(this.pageFlag); // Human_system
      switch (this.pageFlag) {
        case "Human_system": // 人体系统字典
          this.handleGetDicBodySystemList();
          break;
        case "History_taking": // 病史采集字典
          this.handleGetDicMedicalHistoryList();
          break;
        case "Health_questionnaire": // 健康问卷字典
          this.handleGetDicQuestionnaireList();
          break;
        case "Questionnaire_details": // 问卷明细字典
          this.handleGetDicQuestionnaireItemList();
          break;
        case "Combination_questionnaire": // 问卷明细字典
          this.handleLoadCombination();
          break;
        default:
          break;
      }
    },
    // 筛选科室改变回调
    handleChangeDepart() {},
    // 点击树形结构获取当前选中字典
    handleNodeClick(data) {
      this.questionNaireBtnDomId = "hide"; // 隐藏预览按钮
      this.pageFlag = data.name;
      switch (this.pageFlag) {
        case "Human_system": // 人体系统字典
          this.handleGetDicBodySystemList();
          break;
        case "History_taking": // 病史采集字典
          this.questionNaireBtnDomId = "show"; // 点击病史采集字典 才显示预览按钮
          // 加载人体系统树形数据
          getDicBodySystemList({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            this.takingData[0].children = res.data.map((k) => {
              return {
                label: k.name,
                code: k.code,
                children: [],
              };
            });
          });
          this.handleGetDicMedicalHistoryList();
          break;
        case "Health_questionnaire": // 健康问卷字典
          this.handleGetDicQuestionnaireList();
          break;
        case "Questionnaire_details": // 问卷明细字典
          this.questionNaireBtnDomId = "show"; // 点击问卷明细字典 才显示预览按钮

          getDicQuestionnaireList({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            this.healthOption = res.data;
          });
          this.handleGetDicQuestionnaireItemList();
          break;
        case "Combination_questionnaire": // 组合问卷字典
          this.isDicCombination = true;
          this.questionNaireBtnDomId = "show"; // 点击组合  显示预览按钮
          getDicQuestionnaireList({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) return;
            this.healthqueItems = res.data.filter((k) => k.ischild == 1);
          });
          this.handleResetCombinationForm();
          this.chooseCombination = null;
          this.isDicCombination = true; // 解除表单限制
          this.selectCombination = [];
          this.handleLoadCombination();
          break;
        default:
          break;
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
    // 表格斑马纹颜色调整
    handleTableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      switch (domId) {
        case "btnAdd": // 新增
          switch (this.pageFlag) {
            case "Human_system": // 人体系统字典
              this.showHumansystem = true;
              break;
            case "History_taking": // 人体系统字典
              if (!this.chooseTaking) {
                this.$message.warning("请选中人体系统数据再新增!");
                return false;
              }
              this.showHistorytaking = true;
              break;
            case "Health_questionnaire": // 健康问卷字典
              this.showHealthquestionnaire = true;
              break;
            case "Questionnaire_details": // 问卷明细字典
              if (!this.chooseSelect) {
                this.$message.warning("请选中健康问卷再新增!");
                return false;
              }
              this.questionnairedetailsForm.quecode = this.chooseSelect;
              this.showQuestionnairedetails = true;
              break;
            case "Combination_questionnaire": // 人体系统字典
              this.isDicCombination = false;
              break;
            default:
              break;
          }
          break;
        case "btnEdit": // 编辑
          switch (this.pageFlag) {
            case "Human_system": // 人体系统字典
              if (!this.chooseItem) {
                this.$message.warning("请选中编辑数据项!");
                return false;
              }
              this.handleClickHumanSystem();
              break;
            case "History_taking": // 病史采集字典
              if (!this.chooseTakingItem) {
                this.$message.warning("请选中编辑数据项!");
                return false;
              }
              this.handleClickHistoryTaking();
              break;
            case "Health_questionnaire": // 病史采集字典
              if (!this.chooseHealthquestionnaireItem) {
                this.$message.warning("请选中编辑数据项!");
                return false;
              }
              this.handleClickHealthquestionnaire();
              break;
            case "Questionnaire_details": // 问卷明细字典
              if (!this.chooseQuestionnairedetailsItem) {
                this.$message.warning("请选中编辑数据项!");
                return false;
              }
              this.handleClickQuestionnairedetails();
              break;
            case "Combination_questionnaire": // 问卷明细字典
              if (!this.chooseCombination) {
                this.$message.warning("请选中编辑数据项!");
                return false;
              }
              this.isDicCombination = false;
              break;
            default:
              break;
          }
          break;
        case "btnDel": // 删除
          switch (this.pageFlag) {
            case "Human_system": // 人体系统字典
              if (!this.chooseItem) {
                this.$message.warning("请选中删除数据项!");
                return false;
              }
              this.handleGetDicBodySystemDelete();
              break;
            case "History_taking": // 病史采集字典
              if (!this.chooseTakingItem) {
                this.$message.warning("请选中删除数据项!");
                return false;
              }
              this.handleGetDicMedicalHistoryDelete();
              break;
            case "Health_questionnaire": // 健康问卷字典
              if (!this.chooseHealthquestionnaireItem) {
                this.$message.warning("请选中删除数据项!");
                return false;
              }
              this.handleGetDicQuestionnaireDelete();
              break;
            case "Questionnaire_details": // 问卷明细字典
              if (!this.chooseQuestionnairedetailsItem) {
                this.$message.warning("请选中删除数据项!");
                return false;
              }
              this.handleGetDicQuestionnaireItemDelete();
              break;
            case "Combination_questionnaire": // 问卷明细字典
              if (this.selectCombination.length == 0) {
                this.$message.warning("请选中删除数据项!");
                return false;
              }
              this.handleQuestionnaireCombineDelete();
              break;
            default:
              break;
          }
          break;
        case "btnPreview": // 预览按钮
          console.log(this.selectCombination);
          if (this.selectCombination.length == 0 || this.selectCombination.length > 1) {
            this.$message.warning("请选中一项预览数据!");
            return false;
          }
          if (this.pageFlag == "Combination_questionnaire") {
            this.handleCombinationoPreview();
          } else this.handleBtnPreview();

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
};
</script>
<style lang="scss" scoped>
@import "./css/index.scss";
@import "./css/wenjuan.scss";
</style>
