<template>
  <div class="dictriag">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <el-input
          placeholder="请输入内容"
          v-model="searchName"
          @clear="handleSearchName"
          @keyup.native.enter="handleSearchName"
          clearable
          size="small"
        >
        </el-input>
        <el-button
          icon="el-icon-search"
          size="small"
          plain
          class="sbtn"
          @click="handleSearchName"
          >搜索</el-button
        >
        <permission-btn
          class="btn_group"
          moduleName="customerResult"
          size="mini"
          v-on:btn-event="hadnleOnBtnClicked"
        ></permission-btn>
      </div>
      <!-- 主体内容树+字典 -->
      <div class="bodymain">
        <!-- 左侧tree选择当前字典 -->
        <div class="choose_tree">
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
        <!-- 右侧字典盒子 - 主体数据 -->
        <div class="content">
          <!-- 分诊队列字典 -->
          <div class="Dic_triag_queue" v-if="pageFlag == 'Dic_triag_queue'">
            <div class="dictriagqueue_box">
              <EasyTable
                height="100%"
                class="dictriagqueue"
                :loading="loading"
                :data="dictriagqueueData"
                :tableOptions="dictriagqueueOptions"
                :checkbox-config="{ rowClick: false }"
                @selected-change="handleDicTriagSelectQueue"
                @row-click="handleCheckTriagQueue"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              />
            </div>
            <div class="queue_details">
              <div class="dtopbtn">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isDicTriagQueue"
                  @click="handleSaveTriagQueue"
                  >保 存</el-button
                >
              </div>
              <el-form
                ref="form"
                :model="dictriagqueueForm"
                :disabled="isDicTriagQueue"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="队列编码">
                      <el-input
                        disabled
                        placeholder="系统自增"
                        v-model="dictriagqueueForm.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="队列名称">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="体检中心">
                      <el-select
                        clearable
                        filterable
                        v-model="dictriagqueueForm.meccode"
                      >
                        <el-option
                          v-for="(item, index) in meccodeItems"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="占位标志">
                      <el-select
                        clearable
                        filterable
                        v-model="dictriagqueueForm.seizeflag"
                      >
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="预留时间">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.reservetime"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item
                      clearable
                      filterable
                      size="small"
                      label="同时排队"
                    >
                      <el-select v-model="dictriagqueueForm.sameflag">
                        <el-option label="否" :value="0"></el-option>
                        <el-option label="是" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      clearable
                      filterable
                      size="small"
                      label="最大人数"
                    >
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.personmax"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="队列类型">
                      <el-select
                        clearable
                        filterable
                        v-model="dictriagqueueForm.queuetype"
                      >
                        <el-option label="不分配诊室" :value="0"></el-option>
                        <el-option label="分配诊室" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="过号次数">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.skipnumber"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      clearable
                      filterable
                      size="small"
                      label="过号后移"
                    >
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.movenumber"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="级别">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.level"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="说明">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item
                      clearable
                      filterable
                      size="small"
                      label="启用标志"
                    >
                      <el-select
                        clearable
                        filterable
                        v-model="dictriagqueueForm.status"
                      >
                        <el-option label="停用" :value="0"></el-option>
                        <el-option label="启用" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="排序">
                      <el-input
                        clearable
                        v-model="dictriagqueueForm.seq"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 区域管理字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_area'">
            <div class="dictriagarea_box">
              <EasyTable
                height="100%"
                class="dictriagarea"
                :loading="loading"
                :data="dictriagareaData"
                :tableOptions="dictriagareaOptions"
                :checkbox-config="{ rowClick: false }"
                @selected-change="handleDicTriagSelectArea"
                @row-click="handleCheckTriagArea"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isDicTriagArea"
                  @click="handleSaveTriagArea"
                  >保 存</el-button
                >
              </div>
              <el-form
                ref="form"
                :model="dictriagareaForm"
                :disabled="isDicTriagArea"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域编码">
                      <el-input
                        disabled
                        placeholder="系统自增"
                        v-model="dictriagareaForm.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域名称">
                      <el-input
                        clearable
                        v-model="dictriagareaForm.name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="体检中心">
                      <el-select
                        clearable
                        filterable
                        v-model="dictriagareaForm.meccode"
                      >
                        <el-option
                          v-for="(item, index) in meccodeItems"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="级别">
                      <el-input
                        clearable
                        v-model="dictriagareaForm.level"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域说明">
                      <el-input
                        clearable
                        v-model="dictriagareaForm.remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="排序">
                      <el-input
                        clearable
                        v-model="dictriagareaForm.seq"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="16">
                    <el-form-item size="small" label="队列集合">
                      <!-- collapse-tags -->
                      <el-select
                        style="width: 100%"
                        clearable
                        filterable
                        multiple
                        v-model="dictriagareaForm.detailitems"
                      >
                        <el-option
                          v-for="(item, index) in detailitemsItem"
                          :key="index"
                          :label="`${item.code}　${item.name}`"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 诊室字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_room'">
            <div class="dictriagarea_box">
              <EasyTable
                height="100%"
                class="dictriagarea"
                :loading="loading"
                :data="triagRoomData"
                :tableOptions="triagRoomOptions"
                :checkbox-config="{ rowClick: false }"
                @selected-change="handleDicTriagRoom"
                @row-click="handleCheckTriagRoom"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isDicTriagRoom"
                  @click="handleSaveTriagRoom"
                  >保 存</el-button
                >
              </div>
              <el-form
                ref="form"
                class="triagroomform"
                :model="triagRoomForm"
                :disabled="isDicTriagRoom"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室编码">
                      <el-input
                        disabled
                        placeholder="系统自增"
                        v-model="triagRoomForm.code"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室名称">
                      <el-input
                        clearable
                        v-model="triagRoomForm.name"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="体检中心">
                      <el-select
                        clearable
                        filterable
                        v-model="triagRoomForm.meccode"
                      >
                        <el-option
                          v-for="(item, index) in meccodeItems"
                          :key="index"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="队列集合">
                      <el-select
                        style="width: 100%"
                        clearable
                        filterable
                        v-model="triagRoomForm.queuecode"
                      >
                        <el-option
                          v-for="(item, index) in detailitemsItem"
                          :key="index"
                          :label="`${item.code}　${item.name}`"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="排队人数">
                      <el-input
                        clearable
                        v-model="triagRoomForm.personmax"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="性别限制">
                      <el-select
                        clearable
                        filterable
                        v-model="triagRoomForm.sexcontrol"
                      >
                        <el-option label="不限" :value="0"></el-option>
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="设备IP">
                      <el-input
                        clearable
                        v-model="triagRoomForm.deviceip"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室状态">
                      <el-select
                        clearable
                        filterable
                        v-model="triagRoomForm.status"
                      >
                        <el-option label="开诊" :value="0"></el-option>
                        <el-option label="停诊" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="检查医生">
                      <el-select
                        size="mini"
                        @change="handleChangeDoctor"
                        v-model="triagRoomForm.doctorcode"
                        clearable
                        filterable
                        placeholder=""
                      >
                        <el-option
                          v-for="item in operatorItems"
                          size="mini"
                          :key="item.id"
                          :label="`${item.account}　${item.name}`"
                          :value="item.account"
                        >
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室说明">
                      <el-input
                        clearable
                        v-model="triagRoomForm.remark"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="温馨提示">
                      <el-input
                        clearable
                        v-model="triagRoomForm.reminder"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="序号">
                      <el-input
                        clearable
                        v-model="triagRoomForm.seq"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="combineitems_row">
                  <el-col :span="16" class="combineitems_col">
                    <el-form-item size="small" label="组合集合">
                      <div class="combineitems_box">
                        <div
                          class="combineitems_item"
                          v-for="item in triagRoomForm.combineitemsZS"
                          :key="item.code"
                        >
                          {{ item.combinecode }} {{ item.combinename }}
                        </div>
                        <br />
                      </div>
                      <!-- collapse-tags -->
                      <!-- <el-select
                        style="width: 100%"
                        clearable
                        filterable
                        multiple
                        v-model="triagRoomForm.combineitems"
                      >
                        <el-option
                          v-for="(item, index) in combineitemsItem"
                          :key="index"
                          :label="`${item.code}　${item.name}`"
                          :value="item.code"
                        ></el-option>
                      </el-select> -->
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-button
                      size="small"
                      type="primary"
                      @click="handledialogitem"
                      >调整组合</el-button
                    >
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 区域距离字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_area_time'">
            <div class="dictriagarea_box">
              <EasyTable
                height="100%"
                class="dictriagarea"
                :loading="loading"
                :data="triagAreaTimeData"
                :tableOptions="triagAreaTimeOptions"
                :checkbox-config="{ rowClick: false }"
                @selected-change="handleDicTriagAreaTime"
                @row-click="handleCheckTriagAreaTime"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :cell-style="{ padding: '0' }"
              />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="isDicTriagAreaTime"
                  @click="handleSaveTriagAreaTime"
                  >保 存</el-button
                >
              </div>
              <el-form
                ref="form"
                :model="triagAreaTime"
                :disabled="isDicTriagAreaTime"
                label-width="80px"
              >
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="编号">
                      <el-input
                        disabled
                        placeholder="系统自增"
                        v-model="triagAreaTime.id"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="起始区域">
                      <el-select
                        clearable
                        filterable
                        v-model="triagAreaTime.start"
                      >
                        <el-option
                          v-for="(item, index) in triagareaItems"
                          :key="index"
                          :label="`${item.code}　${item.name}`"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="目标区域">
                      <el-select
                        clearable
                        filterable
                        v-model="triagAreaTime.target"
                      >
                        <el-option
                          v-for="(item, index) in triagareaItems"
                          :key="index"
                          :label="`${item.code}　${item.name}`"
                          :value="item.code"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="时间(分)">
                      <el-input
                        clearable
                        v-model="triagAreaTime.time"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="序号">
                      <el-input
                        clearable
                        v-model="triagAreaTime.seq"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 调整组合弹框 -->
          <el-dialog
            :destroy-on-close="true"
            :close-on-click-modal="false"
            class="dialog-mini custom-dialog user-dialog"
            width="1300px"
            title="调整组合"
            :visible.sync="addDialog"
            @close="handleCloseCombin"
          >
            <div
              class="filter-container"
              style="white-space: nowrap; overflow-x: auto"
            >
              <el-input
                @keyup.enter.native="handleGetDicCombineList"
                size="mini"
                style="width: 200px"
                class="filter-item"
                :placeholder="'名称'"
                v-model="keyword"
              >
              </el-input>

              <el-button
                class="filter-item"
                size="mini"
                icon="el-icon-search"
                @click="handleGetDicCombineList"
                >搜索</el-button
              >
            </div>
            <br />
            <el-row>
              <el-col :span="11">
                <el-tag type="info" style="font-weight: bold">组合信息</el-tag>
                <br />
                <br />
                <el-table
                  height="340px"
                  ref="partmainTable"
                  :data="combineitemsItem"
                  v-loading="listLoading"
                  fit
                  highlight-current-row
                  style="width: 100%"
                  @selection-change="parthandleSelectionChange"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                >
                  <el-table-column
                    type="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                  <el-table-column
                    prop="code"
                    label="组合编码"
                    placeholder="系统自动生成"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    width="200"
                    prop="name"
                    label="组合名称"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="deptname"
                    label="科室名称"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="price"
                    label="组合价格"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="sex"
                    label="性别"
                    show-overflow-tooltip
                  >
                    <template slot-scope="scope">
                      <span>
                        {{
                          scope.row.sex == 0
                            ? "未知"
                            : scope.row.sex == 1
                            ? "男"
                            : scope.row.sex == 2
                            ? "女"
                            : ""
                        }}</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="2">
                <div style="text-align: center; margin-top: 100px">
                  <el-button size="mini" @click="ascsort" type="primary"
                    >↑</el-button
                  >
                  <br />
                  <br />
                  <br />
                  <el-button size="mini" @click="dessort" type="primary"
                    >↓</el-button
                  >
                </div>
              </el-col>
              <el-col :span="11">
                <el-tag type="info" style="font-weight: bold"
                  >已包含{{
                    (triagRoomForm &&
                      triagRoomForm.combineitemsZS &&
                      triagRoomForm.combineitemsZS.length) ||
                    0
                  }}个组合</el-tag
                >
                <br />
                <br />
                <el-table
                  height="340px"
                  ref="chilmainTable"
                  @row-click="rowClick"
                  :default-sort="{ prop: 'seqno', order: 'ascending' }"
                  :data="triagRoomForm.combineitemsZS"
                  v-loading="listLoading"
                  fit
                  highlight-current-row
                  style="width: 100%"
                  @selection-change="chilhandleSelectionChange"
                  :border="false"
                  :header-cell-style="handleReturnStyle"
                  :row-class-name="handleTableRowClassName"
                  :cell-style="{ padding: '0' }"
                >
                  <el-table-column
                    type="selection"
                    align="center"
                    width="55"
                  ></el-table-column>
                  <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
                  <el-table-column
                    prop="code"
                    label="组合编码"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="组合名称"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                  <el-table-column
                    prop="deptname"
                    label="科室名称"
                    show-overflow-tooltip
                  >
                  </el-table-column>
                </el-table>
              </el-col>
            </el-row>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import { mapGetters } from "vuex";
import * as dictionary from "@/api/dictionary";
import {
  LoadTriagQueue,
  SaveTriagQueue,
  DeleteTriagQueue,
  LoadTriagArea,
  SaveTriagArea,
  DeleteTriagArea,
  LoadTriagRoom,
  SaveTriagRoom,
  DeleteTriagRoom,
  LoadTriagAreaTime,
  SaveTriagAreaTime,
  DeleteTriagAreaTime,
} from "@/api/dictriag.js";
import { getAllUser } from "@/api/customermanage.js";
import { getDicCombineList } from "@/api/projectdictionary2.js";
export default {
  name: "dictriag",

  components: { Sticky, permissionBtn },

  data() {
    return {
      searchName: "", // 搜索关键字
      pageFlag: "Dic_triag_queue", // 当前页面显示字典控制
      defaultProps: {
        children: "children",
        label: "label",
      }, // 文档树渲染配置
      defaultChecked: [1], // 默认选中数据
      treeData: [
        {
          label: "分诊队列字典",
          name: "Dic_triag_queue",
          id: 1,
        },
        {
          label: "区域管理字典",
          name: "Dic_triag_area",
          id: 2,
        },
        {
          label: "诊室字典",
          name: "Dic_triag_room",
          id: 3,
        },
        {
          label: "区域距离字典",
          name: "Dic_triag_area_time",
          id: 4,
        },
      ], // 文档树渲染数据
      loading: false,
      selectList: [], // 当前勾选数据
      dictriagqueueData: [], // 分诊队列字典列表数据
      dictriagqueueForm: {
        code: "",
        name: "",
        meccode: "",
        seizeflag: "",
        reservetime: null,
        sameflag: null,
        personmax: null,
        queuetype: null,
        skipnumber: null,
        movenumber: null,
        level: null,
        remark: "",
        status: null,
        pycode: "",
        wbcode: "",
        seq: null,
        delflag: 0,
      }, // 分诊队列字典表单数据
      isDicTriagQueue: true,
      chooseTriagQueue: null,
      meccodeItems: [], // 体检中心集
      dictriagareaData: [], // 区域管理字典列表数据
      dictriagareaForm: {
        code: "",
        name: "",
        meccode: "",
        level: null,
        remark: "",
        pycode: "",
        wbcode: "",
        seq: null,
        delflag: 0,
        detailitems: [],
      }, // 区域管理字典表单数据
      detailitemsItem: [], // 队列集合渲染
      selectListArea: [],
      chooseTriagArea: null,
      isDicTriagArea: true, // 是否禁用区域管理字典
      triagRoomData: [], // 诊室字典数据
      triagRoomForm: {
        code: "",
        name: "",
        meccode: "",
        queuecode: "",
        personmax: 0,
        sexcontrol: 0,
        deviceip: "",
        status: 0,
        doctorcode: "",
        doctorname: "",
        remark: "",
        Reminder: "",
        pycode: "",
        wbcode: "",
        seq: 0,
        delflag: 0,
        combineitems: [],
      }, // 诊室字典表单数据
      combineitemsItem: [], // 组合集合
      isDicTriagRoom: true, // 是否禁用诊室字典字典
      selectRoomList: [], // 诊室字典勾选数据
      chooseTriagRoom: null, // 诊室字典选中行数据
      operatorItems: [], // 用户合集
      triagAreaTimeData: [], // 区域距离字典数据
      isDicTriagAreaTime: true, // 是否禁用区域距离字典
      triagAreaTime: {
        id: "",
        start: "",
        target: "",
        time: 0,
        seq: 0,
      }, // // 区域距离字典表单数据
      triagareaItems: [],
      selectTriagAreaTime: [],
      chooseTriagAreaTime: null,
      addDialog: false,
      keyword: "",
      selectrow: {},
      listLoading: false,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 区域距离字典列表表格配置
    triagAreaTimeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "编码",
          prop: "id",
          width: 130,
          omit: 1,
        },
        {
          title: "起始区域编码",
          prop: "start",
          width: 150,
          omit: 1,
        },
        {
          title: "起始区域名称",
          prop: "startname",
          width: 150,
          omit: 1,
        },
        {
          title: "目标区域编码",
          prop: "target",
          width: 150,
          omit: 1,
        },
        {
          title: "目标区域名称",
          prop: "targetname",
          width: 150,
          omit: 1,
        },
        {
          title: "时间(分)",
          prop: "time",
          width: 130,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seq",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 诊室字典列表表格配置
    triagRoomOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "诊室编码",
          prop: "code",
          width: 130,
          omit: 1,
        },
        {
          title: "诊室名称",
          prop: "name",
          width: 130,
          omit: 1,
        },
        {
          title: "排队人数",
          prop: "personmax",
          width: 130,
          omit: 1,
        },
        {
          title: "性别限制",
          prop: "sexcontrol",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "不限" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "设备IP",
          prop: "deviceip",
          width: 150,
          omit: 1,
        },
        {
          title: "诊室状态",
          prop: "status",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "开诊" : "停诊";
          },
        },
        {
          title: "医生名称",
          prop: "doctorname",
          width: 150,
          omit: 1,
        },
        {
          title: "诊室说明",
          prop: "remark",
          width: 150,
          omit: 1,
        },
        {
          title: "温馨提示",
          prop: "reminder",
          width: 150,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seq",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 区域管理字典列表表格配置
    dictriagareaOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "区域编码",
          prop: "code",
          width: 130,
          omit: 1,
        },
        {
          title: "区域名称",
          prop: "name",
          width: 130,
          omit: 1,
        },
        {
          title: "级别",
          prop: "level",
          width: 130,
          omit: 1,
        },
        {
          title: "区域说明",
          prop: "remark",
          width: 170,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seq",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 分诊队列字典列表表格配置
    dictriagqueueOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "队列编码",
          prop: "code",
          width: 110,
          omit: 1,
        },
        {
          title: "队列名称",
          prop: "name",
          width: 170,
          omit: 1,
        },
        {
          title: "占位标志",
          prop: "seizeflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "预留时间",
          prop: "reservetime",
          width: 170,
          omit: 1,
        },
        {
          title: "同时排队",
          prop: "sameflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "队列最大人数",
          prop: "personmax",
          width: 150,
          omit: 1,
        },
        {
          title: "队列类型",
          prop: "queuetype",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "不分配诊室" : "分配诊室";
          },
        },
        {
          title: "过号次数",
          prop: "skipnumber",
          width: 110,
          omit: 1,
        },
        {
          title: "过号后移",
          prop: "movenumber",
          width: 110,
          omit: 1,
        },
        {
          title: "级别",
          prop: "level",
          width: 110,
          omit: 1,
        },
        {
          title: "说明",
          prop: "remark",
          width: 150,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "停用" : "启用";
          },
        },
        {
          title: "序号",
          prop: "seq",
          width: 150,
          omit: 1,
        },
      ];
    },
  },

  mounted() {
    this.handleCheckNode();
  },

  methods: {
    handleCloseCombin() {},
    ascsort() {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        const element = this.multipleSelection[index];
        if (
          element.code == this.selectrow.code &&
          this.multipleSelection[index - 1] != undefined
        ) {
          var temp = this.multipleSelection[index - 1];
          this.multipleSelection[index - 1] = element;
          this.multipleSelection[index] = temp;
        }
      }
      this.multipleSelection = Object.assign([], this.multipleSelection);
    },
    dessort() {
      var ind = 0;
      this.multipleSelection.forEach((element, index) => {
        if (
          element.code == this.selectrow.code &&
          this.multipleSelection[index + 1] != undefined
        ) {
          ind = index;
        }
      });
      if (
        this.selectrow.code == this.multipleSelection[ind].code &&
        this.multipleSelection[ind + 1] != undefined
      ) {
        var nowtemp = this.multipleSelection[ind];
        var temp = this.multipleSelection[ind + 1];
        this.multipleSelection[ind] = temp;
        this.multipleSelection[ind + 1] = nowtemp;
      }
      this.multipleSelection = Object.assign([], this.multipleSelection);
    },
    rowClick(row) {
      this.selectrow = row;
    },
    handleGetDicCombineList() {
      this.listLoading = true;
      getDicCombineList({
        page: 1,
        limit: 100000,
        key: this.keyword,
        deptname: "",
      })
        .then((res) => {
          this.listLoading = false;
          this.combineitemsItem = res.data.filter((k) => {
            return k.triagflag != 1;
          });
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    parthandleSelectionChange(val) {
      val.forEach((d) => {
        this.combineitemsItem.forEach((b) => {
          if (d.code == b.code) {
            this.combineitemsItem.splice(this.combineitemsItem.indexOf(b), 1);
            this.triagRoomForm.combineitems.push(b.combinecode);
            this.triagRoomForm.combineitemsZS.push(b);
            this.$forceUpdate();
            console.log(this.triagRoomForm.combineitemsZS);
          }
        });
      });
    },
    chilhandleSelectionChange(val) {
      val.forEach((d) => {
        this.triagRoomForm.combineitemsZS.forEach((b) => {
          if (d.code == b.code) {
            this.triagRoomForm.combineitemsZS.splice(
              this.triagRoomForm.combineitemsZS.indexOf(b),
              1
            );
            this.triagRoomForm.combineitems.splice(
              this.triagRoomForm.combineitems.indexOf(b.code),
              1
            );
            this.combineitemsItem.push(b);
            // this.temp.price -= b.price;
          }
        });
      });
    },
    handledialogitem() {
      this.addDialog = true;
    },
    // 区域距离字典列表回调
    handleLoadTriagAreaTime() {
      this.loading = true;
      LoadTriagAreaTime({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDicTriagAreaTime();
            this.isDicTriagAreaTime = true; // 解除表单限制
            this.triagAreaTimeData = [];
            return;
          }
          this.triagAreaTimeData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 区域距离字典新增/编辑
    handleSaveTriagAreaTime() {
      if (this.triagAreaTime.start == this.triagAreaTime.target) {
        this.$message.warning("起始区域不能与目标区域相等!");
        return;
      }
      SaveTriagAreaTime(this.triagAreaTime).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDicTriagAreaTime();
        this.chooseTriagAreaTime = null;
        this.isDicTriagAreaTime = true; // 解除表单限制
        this.selectTriagAreaTime = [];
        this.handleLoadTriagAreaTime();
      });
    },
    // 分诊队列字典删除回调
    handleDeleteTriagAreaTime() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectTriagAreaTime.map((k) => {
            return k.id;
          });
          DeleteTriagAreaTime(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDicTriagAreaTime();
            this.isDicTriagAreaTime = true; // 解除表单限制
            this.chooseTriagAreaTime = null;
            this.selectTriagAreaTime = [];
            this.handleLoadTriagAreaTime();
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
    // 区域距离字典添加表单
    handleResetDicTriagAreaTime() {
      this.triagAreaTime = {
        id: "",
        start: "",
        target: "",
        time: 0,
        seq: 0,
      }; // // 区域距离字典表单数据
    },
    //  区域距离字典当前勾选数据回调
    handleDicTriagAreaTime(val) {
      this.selectTriagAreaTime = val;
    },
    //  区域距离字典当前行点击事件
    handleCheckTriagAreaTime(row) {
      if (!row) return;
      this.isDicTriagAreaTime = true; // 解除表单限制
      this.chooseTriagAreaTime = JSON.parse(JSON.stringify(row));
      this.triagAreaTime = JSON.parse(JSON.stringify(row));
    },
    // --------------------------------------------------------------
    // 获取诊室字典数据列表回调
    handleLoadRoomList() {
      this.loading = true;
      LoadTriagRoom({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDictriagRoomForm();
            this.isDicTriagRoom = true; // 解除表单限制
            this.triagRoomData = [];
            return;
          }
          this.triagRoomData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 诊室字典检查医生改变回调
    handleChangeDoctor(value) {
      if (value) {
        let flag = this.operatorItems.filter((k) => k.account == value)[0];
        flag && (this.triagRoomForm.doctorname = flag.name);
      } else {
        this.triagRoomForm.doctorname = "";
      }
    },
    // 诊室字典新增/编辑
    handleSaveTriagRoom() {
      SaveTriagRoom(this.triagRoomForm).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDictriagRoomForm();
        this.chooseTriagRoom = null;
        this.isDicTriagRoom = true; // 解除表单限制
        this.selectRoomList = [];
        this.handleLoadRoomList();
      });
    },
    // 分诊队列字典删除回调
    handleDeleteTriagRoom() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectRoomList.map((k) => {
            return k.code;
          });
          DeleteTriagRoom(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDictriagRoomForm();
            this.isDicTriagRoom = true; // 解除表单限制
            this.chooseTriagRoom = null;
            this.selectRoomList = [];
            this.handleLoadRoomList();
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
    // 重置诊室字典添加表单
    handleResetDictriagRoomForm() {
      this.triagRoomForm = {
        code: "",
        name: "",
        meccode: "",
        queuecode: "",
        personmax: 0,
        sexcontrol: 0,
        deviceip: "",
        status: 0,
        doctorcode: "",
        doctorname: "",
        remark: "",
        Reminder: "",
        pycode: "",
        wbcode: "",
        seq: "",
        delflag: 0,
        combineitems: [],
      }; // 诊室字典表单数据
    },
    //  诊室字典当前勾选数据回调
    handleDicTriagRoom(val) {
      this.selectRoomList = val;
    },
    //  诊室字典当前行点击事件
    handleCheckTriagRoom(row) {
      if (!row) return;
      this.isDicTriagRoom = true; // 解除表单限制
      this.chooseTriagRoom = JSON.parse(JSON.stringify(row));
      if (row.combineitems.length > 0) {
        row.combineitemsZS = row.combineitems.map((k) => {
          return {
            ...k,
            code: k.combinecode,
            name: k.combinename,
          };
        });
        let combineitems = row.combineitems.map((k) => {
          return k.combinecode;
        });
        let tempRow = JSON.parse(JSON.stringify(row));
        tempRow.combineitems = combineitems;
        this.triagRoomForm = tempRow;
      } else {
        this.triagRoomForm = JSON.parse(JSON.stringify(row));
      }
    },
    // 区域管理字典列表回调
    handleLoadTriagArea() {
      this.loading = true;
      LoadTriagArea({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDictriagareaForm();
            this.isDicTriagArea = true; // 解除表单限制
            this.dictriagareaData = [];
            return;
          }
          this.dictriagareaData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 区域管理字典新增/编辑
    handleSaveTriagArea() {
      SaveTriagArea(this.dictriagareaForm).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDictriagareaForm();
        this.chooseTriagArea = null;
        this.isDicTriagArea = true; // 解除表单限制
        this.selectListArea = [];
        this.handleLoadTriagArea();
      });
    },
    // 分诊队列字典删除回调
    handleDeleteTriagArea() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectListArea.map((k) => {
            return k.code;
          });
          DeleteTriagArea(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDictriagareaForm();
            this.isDicTriagArea = true; // 解除表单限制
            this.chooseTriagArea = null;
            this.selectListArea = [];
            this.handleLoadTriagArea();
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
    // 分诊队列字典列表回调
    handleLoadTriagQueue() {
      this.loading = true;
      LoadTriagQueue({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDictriagqueueForm();
            this.isDicTriagQueue = true; // 解除表单限制
            this.dictriagqueueData = [];
            return;
          }
          this.dictriagqueueData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 重置区域管理添加表单
    handleResetDictriagareaForm() {
      this.dictriagareaForm = {
        code: "",
        name: "",
        meccode: "",
        level: null,
        remark: "",
        pycode: "",
        wbcode: "",
        seq: null,
        delflag: 0,
        detailitems: [],
      }; // 区域管理字典表单数据
    },
    // 重置队列添加表单
    handleResetDictriagqueueForm() {
      this.dictriagqueueForm = {
        code: "",
        name: "",
        meccode: "",
        seizeflag: "",
        reservetime: null,
        sameflag: null,
        personmax: null,
        queuetype: null,
        skipnumber: null,
        movenumber: null,
        level: null,
        remark: "",
        status: null,
        pycode: "",
        wbcode: "",
        seq: null,
        delflag: 0,
      }; // 分诊队列字典表单数据
    },
    // 分诊队列字典删除回调
    handleDeleteTriagQueue() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectList.map((k) => {
            return k.code;
          });
          DeleteTriagQueue(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDictriagqueueForm();
            this.isDicTriagQueue = true; // 解除表单限制
            this.chooseTriagQueue = null;
            this.selectList = [];
            this.handleLoadTriagQueue();
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
    // 新增/编辑分诊队列字典
    handleSaveTriagQueue() {
      SaveTriagQueue(this.dictriagqueueForm).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDictriagqueueForm();
        this.isDicTriagQueue = true; // 解除表单限制
        this.chooseTriagQueue = null;
        this.selectList = [];
        this.handleLoadTriagQueue();
      });
    },
    // 获取体检中心数据
    handleGetMeccode() {
      dictionary
        .getList({
          key: "",
          id: "",
          tableName: "Dic_Medical_center",
        })
        .then((response) => {
          this.meccodeItems = response.data;
        });
    },
    //  区域管理当前行点击事件
    handleCheckTriagArea(row) {
      if (!row) return;
      this.isDicTriagArea = true; // 解除表单限制
      this.chooseTriagArea = JSON.parse(JSON.stringify(row));
      if (row.detailitems.length > 0) {
        let detailitems = row.detailitems.map((k) => {
          return k.queuecode;
        });
        let tempRow = JSON.parse(JSON.stringify(row));
        tempRow.detailitems = detailitems;
        this.dictriagareaForm = tempRow;
      } else {
        this.dictriagareaForm = JSON.parse(JSON.stringify(row));
      }
    },
    //  项目字典当前行点击事件
    handleCheckTriagQueue(row) {
      if (!row) return;
      this.isDicTriagQueue = true; // 解除表单限制
      this.chooseTriagQueue = JSON.parse(JSON.stringify(row));
      this.dictriagqueueForm = JSON.parse(JSON.stringify(row));
    },
    //  项目字典当前勾选数据回调
    handleDicTriagSelectArea(val) {
      this.selectListArea = val;
    },
    //  项目字典当前勾选数据回调
    handleDicTriagSelectQueue(val) {
      this.selectList = val;
    },
    // 筛选输入框回调
    handleSearchName() {
      switch (this.pageFlag) {
        case "Dic_triag_queue": // 分诊队列字典
          this.handleResetDictriagqueueForm();
          this.isDicTriagQueue = true; // 解除表单限制
          this.handleLoadTriagQueue();
          break;
        case "Dic_triag_area": // 分诊队列字典
          this.handleResetDictriagareaForm();
          this.isDicTriagArea = true; // 解除表单限制
          this.handleLoadTriagArea();
          break;
        case "Dic_triag_room": // 诊室字典
          this.handleResetDictriagRoomForm();
          this.isDicTriagRoom = true; // 解除表单限制
          this.handleLoadRoomList();
          break;
        case "Dic_triag_area_time": // 区域距离字典
          this.handleResetDicTriagAreaTime();
          this.isDicTriagAreaTime = true; // 解除表单限制
          this.handleLoadTriagAreaTime();
          break;
        default:
          break;
      }
    },
    // 树形结构选中储存回调
    handleCheckNode() {
      // 页面加载默认选中第一个
      this.$nextTick(() => {
        let currentNode = localStorage.getItem("currentKeyNode");
        let code = "";
        if (currentNode) {
          this.defaultChecked.push(currentNode);
          code = currentNode;
        } else {
          this.defaultChecked.push(this.treeData[0].id);
          code = this.treeData[0].id;
        }
        this.$refs[`treeItem_${code}`].click();
      });
    },
    // 点击树形结构获取当前选中字典
    handleNodeClick(data) {
      // console.log(data.name);
      this.pageFlag = data.name;
      // 储存当前点击树模块名称ID
      localStorage.setItem("currentKeyNode", data.id);
      switch (data.name) {
        case "Dic_triag_queue": // 分诊队列字典
          this.handleResetDictriagqueueForm();
          this.isDicTriagQueue = true; // 解除表单限制
          this.chooseTriagQueue = null;
          this.selectList = [];
          this.handleLoadTriagQueue(); // 获取分诊队列字典列表数据
          this.handleGetMeccode(); // 获取体检中心数据
          break;
        case "Dic_triag_area": // 区域管理字典
          this.handleResetDictriagareaForm();
          this.isDicTriagArea = true; // 解除表单限制
          this.selectListArea = [];
          this.chooseTriagArea = null;
          LoadTriagQueue({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) return;
            this.detailitemsItem = res.data;
          }); // 获取队列
          this.handleLoadTriagArea(); // 获取区域管理字典列表数据
          this.handleGetMeccode(); // 获取体检中心数据
          break;
        case "Dic_triag_room": // 诊室字典
          this.handleResetDictriagRoomForm();
          this.isDicTriagRoom = true; // 解除表单限制
          this.chooseTriagRoom = null;
          this.selectRoomList = [];
          LoadTriagQueue({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) return;
            this.detailitemsItem = res.data;
          }); // 获取队列
          this.handleGetDicCombineList();
          getAllUser().then((res) => {
            this.operatorItems = res.data;
          });
          this.handleLoadRoomList(); // 获取诊室字典列表数据
          this.handleGetMeccode(); // 获取体检中心数据
          break;
        case "Dic_triag_area_time": // 区域距离字典
          this.handleResetDicTriagAreaTime();
          this.isDicTriagAreaTime = true; // 解除表单限制
          this.selectTriagAreaTime = [];
          this.chooseTriagAreaTime = null;
          LoadTriagArea({
            page: 1,
            limit: 100000,
            key: "",
          })
            .then((res) => {
              if (!res.data) {
                this.triagareaItems = [];
                return;
              }
              this.triagareaItems = res.data;
            })
            .catch((err) => {
              this.loading = false;
            });
          this.handleLoadTriagAreaTime(); // 获取区域管理字典列表数据
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
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          switch (this.pageFlag) {
            case "Dic_triag_queue": // 分诊队列字典
              this.handleResetDictriagqueueForm();
              this.isDicTriagQueue = false; // 解除表单限制
              break;
            case "Dic_triag_area": // 区域管理字典
              this.handleResetDictriagareaForm();
              this.isDicTriagArea = false; // 解除表单限制
              break;
            case "Dic_triag_room": // 诊室字典
              this.handleResetDictriagRoomForm();
              this.isDicTriagRoom = false; // 解除表单限制
              break;
            case "Dic_triag_area_time": // 区域距离字典
              this.handleResetDicTriagAreaTime();
              this.isDicTriagAreaTime = false; // 解除表单限制
              break;
            default:
              break;
          }
          break;
        case "btnEdit": // 编辑
          switch (this.pageFlag) {
            case "Dic_triag_queue": // 分诊队列字典
              if (!this.chooseTriagQueue) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicTriagQueue = false; // 解除表单限制
              //   else if (
              //     !this.chooseTriagQueue &&
              //     this.selectList.length == 1
              //   ) {
              //     this.isDicTriagQueue = false; // 解除表单限制
              //   } else {
              //     this.$message.warning("请先选中单条数据进行编辑!");
              //   }
              break;
            case "Dic_triag_area": // 分诊队列字典
              if (!this.chooseTriagArea) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicTriagArea = false; // 解除表单限制
              break;
            case "Dic_triag_room": // 分诊队列字典
              if (!this.chooseTriagRoom) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicTriagRoom = false; // 解除表单限制
              break;
            case "Dic_triag_area_time": // 区域距离字典
              if (!this.chooseTriagAreaTime) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicTriagAreaTime = false; // 解除表单限制
              break;
            default:
              break;
          }
          break;
        case "btnDel": // 删除
          switch (this.pageFlag) {
            case "Dic_triag_queue": // 分诊队列字典
              if (this.selectList.length == 0) {
                this.$message.warning("请先选中需删除数据!");
                return;
              }
              this.handleDeleteTriagQueue();
              break;
            case "Dic_triag_area": // 区域管理字典
              if (this.selectListArea.length == 0) {
                this.$message.warning("请先选中需删除数据!");
                return;
              }
              this.handleDeleteTriagArea();
              break;
            case "Dic_triag_room": // 诊室字典
              if (this.selectRoomList.length == 0) {
                this.$message.warning("请先选中需删除数据!");
                return;
              }
              this.handleDeleteTriagRoom();
              break;
            case "Dic_triag_area_time": // 区域距离字典
              if (this.selectTriagAreaTime.length == 0) {
                this.$message.warning("请先选中需删除数据!");
                return;
              }
              this.handleDeleteTriagAreaTime();
              break;
            default:
              break;
          }
          break;
        case "btnRefresh": // 重置
          switch (this.pageFlag) {
            case "Dic_triag_queue": // 分诊队列字典
              this.handleResetDictriagqueueForm();
              this.isDicTriagQueue = true; // 解除表单限制
              this.handleLoadTriagQueue();
              break;
            case "Dic_triag_area": // 区域管理字典
              this.handleResetDictriagareaForm();
              this.isDicTriagArea = true; // 解除表单限制
              this.handleLoadTriagArea();
              break;
            case "Dic_triag_room": // 诊室字典
              this.handleResetDictriagRoomForm();
              this.isDicTriagRoom = true; // 解除表单限制
              this.handleLoadRoomList();
              break;
            case "Dic_triag_area_time": // 区域距离字典
              this.handleResetDicTriagAreaTime();
              this.isDicTriagAreaTime = true; // 解除表单限制
              this.handleLoadTriagAreaTime();
              break;
            default:
              break;
          }
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
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
  },
  // 离开当前页面钩子-清空保存点击树id
  beforeRouteLeave(to, form, next) {
    localStorage.removeItem("currentKeyNode");
    next();
  },
  watch: {},
};
</script>
<style lang='scss' scoped>
// @import url("./css/index.scss");
.dictriag {
  padding: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .subject {
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
    .bodymain {
      width: 100%;
      height: calc(100% - 40px);
      box-sizing: border-box;
      padding: 5px;
      display: flex;
      .choose_tree {
        width: 150px;
        height: 100%;
        box-sizing: border-box;
        border-right: 1px solid #eaeefb;
        .pageTree {
          .el-icon-caret-right {
            display: none;
          }
        }
      }
      .content {
        width: calc(100% - 150px);
        height: 100%;
        padding-left: 5px;
        box-sizing: border-box;
        .Dic_triag_queue,
        .Dic_triag_area {
          width: 100%;
          height: 100%;
          display: flex;
          .dictriagqueue_box,
          .dictriagarea_box {
            width: 50%;
            height: 100%;
            .dictriagqueue,
            .dictriagarea {
              width: 100%;
              height: 100%;
              // /deep/.el-table {
              //   .current-row {
              //     background-color: #5586d1 !important;
              //   }
              //   .el-table__row--current {
              //     background-color: #5586d1 !important;
              //   }
              //   .el-table__row,
              //   .current-row {
              //     background-color: #5586d1 !important;
              //   }
              // }
            }
          }
          .queue_details,
          .area_details {
            width: 50%;
            height: 100%;
            .dtopbtn {
              height: 34px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              box-sizing: border-box;
              padding-right: 15px;
            }
            .el-form {
              margin-top: 5px;
            }
            .triagroomform {
              .combineitems_row {
                .combineitems_col {
                  .combineitems_box {
                    height: 500px;
                    overflow-y: auto;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
/deep/.el-tree {
  .is-current {
    .el-tree-node__content {
      background-color: #5586d1 !important;
      color: #fff;
    }
  }
}
.dictriagqueue,
.dictriagarea {
  /deep/.el-table {
    // .current-row {
    //   background-color: #5586d1 !important;
    // }
    // .el-table__row--current {
    //   background-color: #5586d1 !important;
    // }
    // 选中色
    .el-table__body tr.current-row > td {
      background-color: #5586d1 !important;
      color: #fff;
    }
  }
}
</style>