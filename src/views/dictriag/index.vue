<template>
  <div class="dictriag">
    <div class="subject">
      <!-- 头部按钮组+搜索框 -->
      <div class="search_box">
        <div class="left_box">
          <div v-if="pageFlag == 'Dic_triag_queue' || pageFlag == 'Dic_triag_room'">
            <!-- 状态：<el-checkbox @change="checkIsStop()" v-model="checked">启用</el-checkbox>
            <el-checkbox @change="checkIsStop()" v-model="checked">停用</el-checkbox> -->
            状态：
            <el-popover v-if="showBtnStatus" ref="popoverRef" placement="bottom-start" trigger="click">
              <div class="content">
                <div class="content_item" v-for="item in checkUseOrStop" :key="item.code" @click="checkIsStop(item)">
                  {{ item.name }}
                </div>
              </div>
              <el-button plain type="primary" style="width: 80px" size="mini" slot="reference">{{stateStr}}</el-button>
            </el-popover>
          </div>
          <el-button style="margin-left: 10px;" v-if="pageFlag == 'Dic_triag_room'" plain type="primary" size="mini" @click="handleCheckRoomCombineSet">校验</el-button>
        </div>
        <div class="right_box">
          <el-input placeholder="请输入内容" v-model="searchName" @clear="handleSearchName" @keyup.native.enter="handleSearchName" clearable size="small"></el-input>
          <el-button icon="el-icon-search" size="small" plain class="sbtn" @click="handleSearchName">搜索</el-button>
          <el-button size="small" v-if="pageFlag == 'Dic_triag_queue'" style="margin-right: 6px" type="primary" :disabled="isDicTriagQueue" @click="handleSaveTriagQueue">保 存</el-button>
          <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
        </div>
      </div>
      <!-- 主体内容树+字典 -->
      <div class="bodymain">
        <!-- 左侧tree选择当前字典 -->
        <div class="choose_tree">
          <el-tree ref="pageTree" class="pageTree" :data="treeData" node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handleNodeClick">
            <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }"> <i class="el-icon-menu"></i> {{ node.label }} </span>
          </el-tree>
        </div>
        <!-- 右侧字典盒子 - 主体数据 -->
        <div class="content">
          <!-- 分诊队列字典 -->
          <div class="Dic_triag_queue" v-if="pageFlag == 'Dic_triag_queue'">
            <div class="dictriagqueue_box">
              <EasyTable height="100%" class="dictriagqueue" :loading="loading" :data="dictriagqueueData" :tableOptions="dictriagqueueOptions" :checkbox-config="{ rowClick: false }" @selected-change="handleDicTriagSelectQueue" @row-click="handleCheckTriagQueue" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" :row-style="rowstyle" />
            </div>
            <div class="queue_details">
              <!-- <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicTriagQueue" @click="handleSaveTriagQueue">保 存</el-button>
              </div> -->
              <el-form ref="dictriagqueueForm" :model="dictriagqueueForm" :rules="dictriagqueueRules" :disabled="isDicTriagQueue" label-width="100px">
                <el-form-item size="small" label="队列编码" prop="code">
                  <el-input disabled placeholder="系统自增" v-model="dictriagqueueForm.code"></el-input>
                </el-form-item>
                <el-form-item size="small" label="队列名称" prop="name">
                  <el-input clearable v-model="dictriagqueueForm.name"></el-input>
                </el-form-item>
                <el-form-item size="small" label="体检中心" prop="meccode">
                  <el-select clearable filterable v-model="dictriagqueueForm.meccode">
                    <el-option v-for="(item, index) in meccodeItems" :key="index" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="占位标志" prop="seizeflag">
                  <el-select clearable filterable v-model="dictriagqueueForm.seizeflag">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="预留时间" prop="reservetime">
                  <el-input clearable v-model="dictriagqueueForm.reservetime"></el-input>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="同时排队" prop="sameflag">
                  <el-select v-model="dictriagqueueForm.sameflag">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="最大人数" prop="personmax">
                  <el-input clearable v-model="dictriagqueueForm.personmax"></el-input>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="最小人数" prop="personmin">
                  <el-input clearable v-model="dictriagqueueForm.personmin"></el-input>
                </el-form-item>
                <el-form-item size="small" label="队列类型" prop="queuetype">
                  <el-select clearable filterable v-model="dictriagqueueForm.queuetype">
                    <el-option label="不分配诊室" :value="0"></el-option>
                    <el-option label="分配诊室" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="呼叫次数" prop="skipnumber">
                  <el-input clearable v-model="dictriagqueueForm.skipnumber"></el-input>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="过号后移" prop="movenumber">
                  <el-input clearable v-model="dictriagqueueForm.movenumber"></el-input>
                </el-form-item>
                <el-form-item size="small" label="级别">
                  <el-input clearable v-model="dictriagqueueForm.level" prop="level"></el-input>
                </el-form-item>
                <el-form-item size="small" label="说明" prop="remark">
                  <el-input clearable v-model="dictriagqueueForm.remark"></el-input>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="启用标志" prop="status">
                  <el-select clearable filterable v-model="dictriagqueueForm.status">
                    <el-option label="停用" :value="0"></el-option>
                    <el-option label="启用" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="排序" prop="seq">
                  <el-input clearable v-model="dictriagqueueForm.seq"></el-input>
                </el-form-item>
                <el-form-item clearable filterable size="small" label="公用队列" prop="status">
                  <el-select clearable filterable v-model="dictriagqueueForm.isPublicQueue">
                    <el-option label="否" :value="0"></el-option>
                    <el-option label="是" :value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" label="播报内容" prop="status">
                  <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请输入内容" resize="none" v-model="dictriagqueueForm.speekContent">
                  </el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <!-- 区域管理字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_area'">
            <div class="dictriagarea_box">
              <EasyTable height="100%" class="dictriagarea" :loading="loading" :data="dictriagareaData" :tableOptions="dictriagareaOptions" :checkbox-config="{ rowClick: false }" @selected-change="handleDicTriagSelectArea" @row-click="handleCheckTriagArea" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicTriagArea" @click="handleSaveTriagArea">保 存</el-button>
              </div>
              <el-form ref="form" :model="dictriagareaForm" :disabled="isDicTriagArea" label-width="80px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域编码">
                      <el-input disabled placeholder="系统自增" v-model="dictriagareaForm.code"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域名称">
                      <el-input clearable v-model="dictriagareaForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="体检中心">
                      <el-select clearable filterable v-model="dictriagareaForm.meccode">
                        <el-option v-for="(item, index) in meccodeItems" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="级别">
                      <el-input clearable v-model="dictriagareaForm.level"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="区域说明">
                      <el-input clearable v-model="dictriagareaForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="排序">
                      <el-input clearable v-model="dictriagareaForm.seq"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="导诊区域">
                      <el-select clearable filterable v-model="dictriagareaForm.parentcode">
                        <el-option v-for="(item, index) in triagConfigItems" :key="index" :label="item.name" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item size="small" label="队列集合">
                      <!-- collapse-tags -->
                      <!-- <el-select style="width: 100%" clearable filterable multiple v-model="dictriagareaForm.detailitems">
                        <el-option v-for="(item, index) in detailitemsItem" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select> -->

                      <el-transfer style="width: 100%" class="elTransferClas" filterable v-model="dictriagareaForm.detailitems" :filter-method="dictriagareaFilterMethod" filter-placeholder="请选择项" :titles="['未选', '已选']" :props="{
                          key: 'code',
                          label: 'name'
                        }" :data="detailitemsItem">
                      </el-transfer>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 诊室字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_room'">
            <div class="dictriagarea_box">
              <EasyTable height="100%" class="dictriagarea" :loading="loading" :data="triagRoomData" :tableOptions="triagRoomOptions" :checkbox-config="{ rowClick: false }" @selected-change="handleDicTriagRoom" :border="false" @row-click="handleCheckTriagRoom" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" :row-style="triagRoomRowstyle" />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicTriagRoom" @click="handleSaveTriagRoom">保 存</el-button>
              </div>
              <el-form ref="form" :model="triagRoomForm" :disabled="isDicTriagRoom" label-width="100px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室编码">
                      <el-input disabled placeholder="系统自增" v-model="triagRoomForm.code"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室名称">
                      <el-input clearable v-model="triagRoomForm.name"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="体检中心">
                      <el-select clearable filterable v-model="triagRoomForm.meccode">
                        <el-option v-for="(item, index) in meccodeItems" :key="index" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="队列集合">
                      <el-select style="width: 100%" clearable filterable v-model="triagRoomForm.queuecode">
                        <el-option v-for="(item, index) in detailitemsItem" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="屏幕显示人数">
                      <el-input clearable v-model="triagRoomForm.personmax"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="预留人数">
                      <el-input clearable v-model="triagRoomForm.reserveperson"></el-input>
                    </el-form-item>
                  </el-col>
                  <!-- <el-col :span="8">
                    <el-form-item size="small" label="最小排队人数">
                      <el-input clearable v-model="triagRoomForm.personmin"></el-input>
                    </el-form-item>
                  </el-col> -->
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="性别限制">
                      <el-select clearable filterable v-model="triagRoomForm.sexcontrol">
                        <el-option label="不限" :value="0"></el-option>
                        <el-option label="男" :value="1"></el-option>
                        <el-option label="女" :value="2"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="设备IP">
                      <el-input clearable v-model="triagRoomForm.deviceip"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="启用状态">
                      <el-select clearable filterable v-model="triagRoomForm.status">
                        <el-option label="启用" :value="0"></el-option>
                        <el-option label="停用" :value="1"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="检查医生">
                      <el-select size="mini" @change="handleChangeDoctor" v-model="triagRoomForm.doctorcode" clearable filterable placeholder="">
                        <el-option v-for="item in operatorItems" size="mini" :key="item.id" :label="`${item.account}　${item.name}`" :value="item.account"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="诊室说明">
                      <el-input clearable v-model="triagRoomForm.remark"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="房间号">
                      <el-input clearable v-model="triagRoomForm.roomno"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="序号">
                      <el-input clearable v-model="triagRoomForm.seq"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="科室名称">
                      <el-select v-model="triagRoomForm.deptcode" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in deptItems" :key="index" :label="item.name" :value="item.id"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="温馨提示">
                      <el-input type="textarea" :rows="2" clearable v-model="triagRoomForm.reminder"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <!-- <el-col :span="8">
                    <el-form-item size="small" label="预留人数">
                      <el-input clearable v-model="triagRoomForm.reserveperson"></el-input>
                    </el-form-item>
                  </el-col> -->
                  <el-col :span="8">
                    <el-form-item size="small" label="导诊窗口">
                      <el-select v-model="triagRoomForm.formcode" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in formcodeItems" :key="index" :label="item.name" :value="item.code"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="是否播报">
                      <el-select v-model="triagRoomForm.speekStatus" clearable filterable placeholder="请选择">
                        <el-option label="播报" :value="0"> </el-option>
                        <el-option label="不播报" :value="1"> </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row>
                  <el-col :span="24">
                    <el-form-item size="small" label="组合集合">
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
                      <!--  -->
                      <el-col :span="11">
                        <div style="display: flex; align-items: center">
                          <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="triagRoomCombineSearchL" @input="handleSearchCombineitems" @keyup.enter.native="handleSearchCombineitems" style="width: 60%; margin-right: 20px">
                          </el-input>
                          <el-select v-model="triagRoomCombineSearchLDept" clearable filterable placeholder="请选择" @change="handleSearchCombineitems">
                            <el-option v-for="(item, index) in deptItems" :key="index" :label="item.name" :value="item.id"></el-option>
                          </el-select>
                        </div>
                        <EasyTable style="overflow: auto" height="400px" class="dictriagarea" :loading="loading" :data="combineitemsItem" :tableOptions="triagRoomcombineCollections" :checkbox-config="{ rowClick: false }" @selected-change="handleTriagRoomCombineL" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                      </el-col>
                      <el-col :span="2" class="triagRoomCombineBtn">
                        <el-button size="mini" type="primary" icon="el-icon-arrow-left" @click="handleLeft"></el-button>
                        <el-button style="margin-left: 0px" size="mini" type="primary" icon="el-icon-arrow-right" @click="handleRight"></el-button>
                      </el-col>
                      <el-col :span="11">
                        <el-input placeholder="请输入搜索内容" prefix-icon="el-icon-search" v-model="triagRoomCombineSearchR" clearable> </el-input>
                        <EasyTable style="overflow: auto" height="400px" class="dictriagarea" :loading="loading" :data="triagRoomFormSS" :tableOptions="triagRoomcombineCollections" :checkbox-config="{ rowClick: false }" @selected-change="handleTriagRoomCombineR" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                      </el-col>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 区域距离字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_area_time'">
            <div class="dictriagarea_box">
              <EasyTable height="100%" class="dictriagarea" :loading="loading" :data="triagAreaTimeData" :tableOptions="triagAreaTimeOptions" :checkbox-config="{ rowClick: false }" @selected-change="handleDicTriagAreaTime" @row-click="handleCheckTriagAreaTime" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicTriagAreaTime" @click="handleSaveTriagAreaTime">保 存</el-button>
              </div>
              <el-form ref="form" :model="triagAreaTime" :disabled="isDicTriagAreaTime" label-width="80px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="编号">
                      <el-input disabled placeholder="系统自增" v-model="triagAreaTime.id"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="起始区域">
                      <el-select clearable filterable v-model="triagAreaTime.start">
                        <el-option v-for="(item, index) in triagConfigItems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="目标区域">
                      <el-select clearable filterable v-model="triagAreaTime.target">
                        <el-option v-for="(item, index) in triagConfigItems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item size="small" label="时间(分)">
                      <el-input clearable v-model="triagAreaTime.time"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item size="small" label="序号">
                      <el-input clearable v-model="triagAreaTime.seq"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <!-- 分诊前置字典 -->
          <div class="Dic_triag_area" v-if="pageFlag == 'Dic_triag_condition'">
            <div class="dictriagarea_box">
              <EasyTable height="100%" class="dictriagarea" :loading="loading" :data="triagConditionData" :tableOptions="triagConditionOptions" :checkbox-config="{ rowClick: false }" @selected-change="handleDicCondition" @row-click="handleCheckCondition" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            </div>
            <div class="area_details">
              <div class="dtopbtn">
                <el-button size="mini" type="primary" :disabled="isDicTriagCondition" @click="handleSaveTriagCondition">保 存</el-button>
              </div>
              <el-form ref="form" :model="triagCondition" :disabled="isDicTriagCondition" label-width="80px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item size="small" label="编号">
                      <el-input disabled placeholder="系统自增" v-model="triagCondition.id"></el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item size="small" label="前置队列">
                      <el-select style="width: 100%" clearable filterable v-model="triagCondition.firstcode">
                        <el-option v-for="(item, index) in firstItems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item size="small" label="组合">
                      <el-select clearable filterable collapse-tags multiple style="width: 100%" v-model="triagCondition.aftercode">
                        <el-option v-for="(item, index) in afterItems" :key="index" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item size="small" label="序号">
                      <el-input clearable v-model="triagCondition.seq"></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
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
import { getPublicConfig } from "@/api/personalregister.js";
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
  LoadTriagCondition,
  SaveTriagCondition,
  DeleteTriagCondition,
  CheckRoomCombineSet,
} from "@/api/dictriag.js";
import { DicLoad } from "@/api/totalcheck.js"; // 引入接口文件
import { getAllUser } from "@/api/customermanage.js";
import { getTriagCombineList } from "@/api/projectdictionary2.js";
export default {
  name: "dictriag",

  components: { Sticky, permissionBtn },

  data() {
    return {
      stateStr: "全部",
      dictriagqueueDataAll: [],
      triagRoomDataAll: [],
      checkUseOrStop: [
        { code: -1, name: "全部" },
        { code: 0, name: "停用" },
        { code: 1, name: "启用" },
      ],
      checked: false,
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
        {
          label: "分诊前置",
          name: "Dic_triag_condition",
          id: 5,
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
        personmin: null,
        queuetype: null,
        skipnumber: null,
        movenumber: null,
        level: null,
        remark: "",
        status: null,
        pycode: "",
        wbcode: "",
        speekContent: "",
        seq: null,
        delflag: 0,
        isPublicQueue: 0,
      }, // 分诊队列字典表单数据
      dictriagqueueRules: {
        name: [{ required: true, message: "请填写队列名称", trigger: "blur" }],
        meccode: [
          { required: true, message: "请选择体检中心", trigger: "blur" },
        ],
        sameflag: [
          { required: true, message: "请选择同时排队", trigger: "blur" },
        ],
        queuetype: [
          { required: true, message: "请选择队列类型", trigger: "blur" },
        ],
        skipnumber: [
          { required: true, message: "请填写呼叫次数", trigger: "blur" },
        ],
        level: [{ required: true, message: "请填写级别", trigger: "blur" }],
        status: [
          { required: true, message: "请选择启用标志", trigger: "blur" },
        ],
        seq: [{ required: true, message: "请填写排序", trigger: "blur" }],
      },
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
        parentcode: "",
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
        personmin: 0,
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
        formcode: "",
        deptcode: "",
        combineitems: [],
        roomno: "",
        reserveperson: 0,
        speekStatus: 0,
      }, // 诊室字典表单数据
      combineitemsItem: [], // 组合集合
      deptItems: [], // 组合集合
      isDicTriagRoom: true, // 是否禁用诊室字典字典
      selectRoomList: [], // 诊室字典勾选数据
      selectRoomListCombineL: [], // 诊室字典1 组合集合表格勾选数据
      selectRoomListCombineR: [], // 诊室字典2 组合集合表格勾选数据
      triagRoomCombineSearchL: "", // 组合集合表格搜索
      triagRoomCombineSearchLDept: "",
      triagRoomCombineSearchR: "",
      tempCombineitems: [], // 临时存储组合集合
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
      triagConditionData: [],
      triagCondition: {
        id: "",
        firstcode: "",
        aftercode: [],
        seq: 0,
      },
      isDicTriagCondition: false,
      firstItems: [],
      afterItems: [],
      selectTriagCondition: [],
      chooseTriagCondition: null,
      formcodeItems: [],
      triagConfigItems: [],
      showBtnStatus: true,
    };
  },

  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 分诊前置字典列表表格配置
    triagConditionOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "前置编码",
          prop: "firstcode",
          width: 110,
          omit: 1,
        },
        {
          title: "前置队列",
          prop: "firstname",
          width: 150,
          omit: 1,
        },
        {
          title: "组合编码",
          prop: "aftercode",
          width: 90,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "aftername",
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
          title: "房间号",
          prop: "roomno",
          width: 150,
          omit: 1,
        },
        {
          title: "队列集合",
          prop: "queuename",
          width: 200,
          omit: 1,
        },
        {
          title: "设备IP",
          prop: "deviceip",
          width: 150,
          omit: 1,
        },
        {
          title: "启用状态",
          prop: "status",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
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
    // 诊室字典表格
    triagRoomcombineCollections() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合编码",
          prop: "code",
          width: 90,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "name",
          width: 120,
          omit: 1,
        },
        {
          title: "科室名称",
          prop: "deptname",
          width: 110,
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
          title: "级别",
          prop: "level",
          width: 110,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>停用</span>
                <span v-show={data.status == 1}>启用</span>
              </div>
            );
          },
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
          title: "呼叫次数",
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
          title: "说明",
          prop: "remark",
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
    // 套餐表格搜索数据
    triagRoomFormSS() {
      const search = this.triagRoomCombineSearchR;
      if (search) {
        return this.triagRoomForm.combineitems.filter((data) => {
          return Object.keys(data).some((key) => {
            let containArr = ["name", "code"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.triagRoomForm.combineitems;
    },
  },

  mounted() {
    this.handleCheckNode();
    DicLoad({ tableName: "Dic_department" }).then((res) => {
      this.deptItems = res.data;
    });
  },

  methods: {
    // 分诊字典-校验
    handleCheckRoomCombineSet() {
      CheckRoomCombineSet().then((res) => {
        if (!res.result) {
          this.$message.error("暂无数据!");
          return;
        }
        this.$confirm(`${res.result.join("<br/>")}`, "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          showClose: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
          .then(() => {
            this.handleResetDictriagRoomForm();
            this.isDicTriagRoom = true; // 解除表单限制
            this.chooseTriagRoom = null;
            this.selectRoomList = [];
            this.selectRoomListCombine = [];
            this.triagRoomCombineSearchL = "";
            this.triagRoomCombineSearchLDept = "";
            this.triagRoomCombineSearchR = "";
            LoadTriagQueue({
              page: 1,
              limit: 100000,
              key: "",
            }).then((res) => {
              if (!res.data) return;
              this.detailitemsItem = res.data.filter((k) => k.status != 0);
            }); // 获取队列
            DicLoad({ tableName: "Dic_department" }).then((res) => {
              this.deptItems = res.data;
            });
            getTriagCombineList({
              key: this.triagRoomCombineSearchL.trim(),
              deptcode: this.triagRoomCombineSearchLDept,
            }).then((res) => {
              this.combineitemsItem = res.data;
            });
            getAllUser().then((res) => {
              this.operatorItems = res.data;
            });
            getPublicConfig({ cc: "TriagForm" }).then((res) => {
              if (!res.result) return;
              this.formcodeItems = res.result;
            });
            this.handleLoadRoomList(); // 获取诊室字典列表数据
            this.handleGetMeccode(); // 获取体检中心数据
          })
          .catch(() => {});
      });
    },
    checkIsStop(item) {
      this.stateStr = item.name;
      if (this.pageFlag == "Dic_triag_queue" && item.code == -1)
        this.handleLoadTriagQueue();
      if (this.pageFlag == "Dic_triag_queue" && item.code == 0)
        this.dictriagqueueData = this.dictriagqueueDataAll.filter(
          (n) => n.status == 0
        );
      if (this.pageFlag == "Dic_triag_queue" && item.code == 1)
        this.dictriagqueueData = this.dictriagqueueDataAll.filter(
          (n) => n.status == 1
        );

      if (this.pageFlag == "Dic_triag_room" && item.code == -1)
        this.handleLoadRoomList();
      if (this.pageFlag == "Dic_triag_room" && item.code == 0)
        this.triagRoomData = this.triagRoomDataAll.filter((n) => n.status == 1);
      if (this.pageFlag == "Dic_triag_room" && item.code == 1)
        this.triagRoomData = this.triagRoomDataAll.filter((n) => n.status == 0);
    },
    // 区域管理字典
    dictriagareaFilterMethod(query, item) {
      return item.name.indexOf(query) > -1;
    },
    // 分诊前置删除
    handleDeleteTriagCondition() {
      this.$confirm(`此操作将永久删除该数据, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectTriagCondition.map((k) => {
            return k.id;
          });
          DeleteTriagCondition(codes).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDicTriagCondition();
            this.isDicTriagCondition = true; // 解除表单限制
            this.chooseTriagCondition = null;
            this.selectTriagCondition = [];
            this.handleLoadTriagCondition();
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
    // 分诊前置列表加载
    handleLoadTriagCondition() {
      this.loading = true;
      LoadTriagCondition({
        page: 1,
        limit: 100000,
        key: this.searchName.trim() || "",
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.handleResetDicTriagCondition();
            this.isDicTriagCondition = true; // 解除表单限制
            this.triagConditionData = [];
            return;
          }
          this.triagConditionData = res.data;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 分诊前置表单重置
    handleResetDicTriagCondition() {
      this.triagCondition = {
        id: "",
        firstcode: "",
        aftercode: [],
        seq: 0,
      };
    },
    // 分诊前置字典保存
    handleSaveTriagCondition() {
      if (this.triagCondition.aftercode.length == 0) {
        this.triagCondition.aftercode = "";
      } else {
        this.triagCondition.aftercode = this.triagCondition.aftercode.join(",");
      }
      SaveTriagCondition(this.triagCondition).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDicTriagCondition();
        this.chooseTriagCondition = null;
        this.isDicTriagCondition = true; // 解除表单限制
        this.selectTriagCondition = [];
        this.handleLoadTriagCondition();
      });
    },
    // 分诊前置字典行点击
    handleCheckCondition(row) {
      if (!row) return;
      this.isDicTriagCondition = true; // 解除表单限制
      this.chooseTriagCondition = JSON.parse(JSON.stringify(row));
      this.triagCondition = JSON.parse(JSON.stringify(row));
      if (this.triagCondition.aftercode.length == 0) {
        this.triagCondition.aftercode = "";
      } else {
        this.triagCondition.aftercode =
          this.triagCondition.aftercode.split(",");
      }
    },
    // 分诊前置字典选中
    handleDicCondition(val) {
      this.selectTriagCondition = val;
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
      // if (this.triagAreaTime.start == this.triagAreaTime.target) {
      //   this.$message.warning("起始区域不能与目标区域相等!");
      //   return;
      // }
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
          this.triagRoomDataAll = res.data;
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
      let form = {
        ...this.triagRoomForm,
        combineitems: this.triagRoomForm.combineitems.map((k) => k.code),
      };
      SaveTriagRoom(form).then((res) => {
        if (res.code != 200) return;
        this.$message.success(res.message);
        this.handleResetDictriagRoomForm();
        this.chooseTriagRoom = null;
        this.isDicTriagRoom = true; // 解除表单限制
        this.selectRoomList = [];
        this.selectRoomListCombineL = [];
        this.selectRoomListCombineR = [];
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
        personmin: 0,
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
        deptcode: "",
        formcode: "",
        combineitems: [],
        roomno: "",
        reserveperson: 0,
      }; // 诊室字典表单数据
    },

    // 移到左边
    handleLeft() {
      if (this.selectRoomListCombineR.length < 1) {
        return this.$message.warning("请选择数据");
      }
      this.tempCombineitems = this.tempCombineitems.filter((k) => {
        return !this.selectRoomListCombineR.some((u) => u.code == k.code);
      });
      this.triagRoomForm.combineitems = this.triagRoomForm.combineitems.filter(
        (k) => {
          return !this.selectRoomListCombineR.some((u) => u.code == k.code);
        }
      );

      this.handleSearchCombineitems();
    },
    // 移到右边
    handleRight() {
      if (this.selectRoomListCombineL.length < 1) {
        return this.$message.warning("请选择数据");
      }
      let arr = this.selectRoomListCombineL;
      for (let i = 0; i < arr.length; i++) {
        this.triagRoomForm.combineitems.push(arr[i]);
        this.combineitemsItem.splice(i, 1, undefined);
      }
      this.tempCombineitems = this.triagRoomForm.combineitems;
      this.combineitemsItem = this.combineitemsItem.filter((k) => k);
    },
    // 已选数组的搜索回调
    handleGetSelectCombineitems() {
      if (this.triagRoomCombineSearchR.trim() == "") {
        this.triagRoomForm.combineitems = this.tempCombineitems;
        return;
      }
      let arr = [];
      this.triagRoomForm.combineitems.forEach((item) => {
        const result = item.name.split("").some((k) => {
          return (
            k.toLowerCase() == this.triagRoomCombineSearchR.trim().toLowerCase()
          );
        });
        if (result) arr.push(item);
      });
      console.log(arr, "arr");
      this.triagRoomForm.combineitems = arr;
    },
    // 组合集合搜索回调
    handleSearchCombineitems() {
      let data = [];
      getTriagCombineList({
        key: this.triagRoomCombineSearchL.trim(),
        deptcode: this.triagRoomCombineSearchLDept,
      }).then((res) => {
        // 使用 filter 方法过滤掉 triagflag == 1 的项和已经在 triagRoomForm.combineitems 中的项
        data = res.data.filter((item) => {
          return !this.triagRoomForm.combineitems.some(
            (combinedItem) => combinedItem.code === item.code
          );
        });

        this.combineitemsItem = data;
      });
    },
    // 诊室字典组合集合表格1 勾选回调
    handleTriagRoomCombineL(row) {
      this.selectRoomListCombineL = row;
    },
    // 诊室字典组合集合表格2 勾选回调
    handleTriagRoomCombineR(row) {
      this.selectRoomListCombineR = row;
    },
    //  诊室字典当前勾选数据回调
    handleDicTriagRoom(val) {
      this.selectRoomList = val;
    },
    //  诊室字典当前行点击事件
    handleCheckTriagRoom(row) {
      console.log("当前行", row);
      if (!row) return;
      this.isDicTriagRoom = true; // 解除表单限制
      this.chooseTriagRoom = JSON.parse(JSON.stringify(row));
      if (row.combineitems.length > 0) {
        let combineitems = row.combineitems.map((k) => {
          return k.combinecode;
        });
        let tempRow = JSON.parse(JSON.stringify(row));
        tempRow.combineitems = combineitems;
        this.init(tempRow);
      } else {
        this.triagRoomForm = JSON.parse(JSON.stringify(row));
      }
    },
    init(tempRow) {
      let data = [];
      getTriagCombineList({
        key: "",
        deptcode: "",
      }).then((res) => {
        data = res.data.filter((item) => {
          return tempRow.combineitems.some(
            (combinedItem) => combinedItem === item.code
          );
        });
        tempRow.combineitems = data;
        this.triagRoomForm = tempRow;
        this.tempCombineitems = JSON.parse(
          JSON.stringify(this.triagRoomForm.combineitems)
        );
      });
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
          this.dictriagqueueDataAll = res.data;
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
        level: 0,
        remark: "",
        pycode: "",
        wbcode: "",
        parentcode: "",
        seq: 0,
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
        personmin: null,
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
        isPublicQueue: 0,
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
      this.$refs["dictriagqueueForm"].validate((valid) => {
        if (valid) {
          SaveTriagQueue(this.dictriagqueueForm).then((res) => {
            if (res.code != 200) return;
            this.$message.success(res.message);
            this.handleResetDictriagqueueForm();
            this.isDicTriagQueue = true; // 解除表单限制
            this.chooseTriagQueue = null;
            this.selectList = [];
            this.handleLoadTriagQueue();
          });
        }
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
        case "Dic_triag_condition": // 分诊前置字典
          this.handleResetDicTriagCondition();
          this.isDicTriagCondition = true; // 解除表单限制
          this.handleLoadTriagCondition();
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
          getPublicConfig({ cc: "TriagArea" }).then((res) => {
            if (!res.result) return;
            this.triagConfigItems = res.result;
          });
          LoadTriagQueue({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) return;
            this.detailitemsItem = res.data.filter((k) => k.status != 0);
          }); // 获取队列
          this.handleLoadTriagArea(); // 获取区域管理字典列表数据
          this.handleGetMeccode(); // 获取体检中心数据
          break;
        case "Dic_triag_room": // 诊室字典
          this.handleResetDictriagRoomForm();
          this.isDicTriagRoom = true; // 解除表单限制
          this.chooseTriagRoom = null;
          this.selectRoomList = [];
          this.selectRoomListCombine = [];
          this.triagRoomCombineSearchL = "";
          this.triagRoomCombineSearchLDept = "";
          this.triagRoomCombineSearchR = "";
          LoadTriagQueue({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) return;
            this.detailitemsItem = res.data.filter((k) => k.status != 0);
          }); // 获取队列
          DicLoad({ tableName: "Dic_department" }).then((res) => {
            this.deptItems = res.data;
          });
          getTriagCombineList({
            key: this.triagRoomCombineSearchL.trim(),
            deptcode: this.triagRoomCombineSearchLDept,
          }).then((res) => {
            this.combineitemsItem = res.data;
          });
          getAllUser().then((res) => {
            this.operatorItems = res.data;
          });
          getPublicConfig({ cc: "TriagForm" }).then((res) => {
            if (!res.result) return;
            this.formcodeItems = res.result;
          });
          this.handleLoadRoomList(); // 获取诊室字典列表数据
          this.handleGetMeccode(); // 获取体检中心数据
          break;
        case "Dic_triag_area_time": // 区域距离字典
          this.handleResetDicTriagAreaTime();
          this.isDicTriagAreaTime = true; // 解除表单限制
          this.selectTriagAreaTime = [];
          this.chooseTriagAreaTime = null;
          getPublicConfig({ cc: "TriagArea" }).then((res) => {
            if (!res.result) return;
            this.triagConfigItems = res.result;
          });
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
        case "Dic_triag_condition": // 分诊前置字典
          LoadTriagQueue({
            page: 1,
            limit: 100000,
            key: "",
          }).then((res) => {
            if (!res.data) {
              this.firstItems = [];
              return;
            }
            this.firstItems = res.data;
          });
          getTriagCombineList({
            key: "",
            deptcode: "",
          }).then((res) => {
            if (!res.data) {
              this.afterItems = [];
              return;
            }
            this.afterItems = res.data;
          });
          this.handleResetDicTriagCondition();
          this.isDicTriagCondition = true; // 解除表单限制
          this.selectTriagCondition = [];
          this.chooseTriagCondition = null;
          this.handleLoadTriagCondition();
          break;
        default:
          break;
      }
      this.showBtnStatus = false;
      this.$nextTick(() => {
        this.showBtnStatus = true;
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
            case "Dic_triag_condition": // 分诊前置字典
              this.handleResetDicTriagCondition();
              this.isDicTriagCondition = false; // 解除表单限制
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
            case "Dic_triag_condition": // 分诊前置字典
              if (!this.chooseTriagCondition) {
                this.$message.warning("请先选中单条数据进行编辑!");
                return;
              }
              this.isDicTriagCondition = false; // 解除表单限制
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
            case "Dic_triag_condition": // 分诊前置字典
              if (this.selectTriagCondition.length == 0) {
                this.$message.warning("请先选中需删除数据!");
                return;
              }
              this.handleDeleteTriagCondition();
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
            case "Dic_triag_condition": // 分诊前置字典
              this.handleResetDicTriagCondition();
              this.isDicTriagCondition = true; // 解除表单限制
              this.handleLoadTriagCondition();
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
      this.$forceUpdate();
    },
    // 表格文本变色
    triagRoomRowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.status == 1) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
    },
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.status == 0) {
        // stylejson.background = "#e0838f"; // 背景颜色
        // 也可以修改文字颜色
        stylejson.color = "red !important";
        return stylejson;
      } else if (row.healthstatus == -1) {
        stylejson.color = "#0000ff !important";
        return stylejson;
      }
      return "";
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
<style lang="scss" scoped>
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
// @import "./css/index_gdgy.scss";
// @import url("./css/index.scss");
.elTransferClas {
  /deep/.el-transfer-panel {
    width: 47% !important;
    height: 600px;
  }
  /deep/.el-transfer-panel__list {
    height: 500px !important;
  }
  /deep/.el-transfer__buttons {
    padding: 0 !important;
  }
}
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
      justify-content: space-between;
      align-items: center;
      height: 40px;
      width: 100%;
      background-color: #f6f7fc;
      box-sizing: border-box;
      padding: 0 20px;
      .left_box {
        display: flex;
        align-items: center;
        padding-left: 140px;
      }
      .right_box {
        display: flex;
        align-items: center;
        gap: 10px; // 控制间距
        .el-input {
          width: 250px;
        }
        .sbtn {
          margin: 0 10px;
        }
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
            width: 45%;
            height: 100%;
            &.dictriagqueue_box {
              width: 70%;
            }
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
            position: relative;
            width: 55%;
            height: 100%;
            &.queue_details {
              width: 25%;
              min-height: 100%;
              height: auto;
              overflow-y: scroll;
              margin-left: 5%;
              .dtopbtn {
                position: sticky;
                top: 0;
                background-color: #fff;
                z-index: 1;
              }
              /deep/.el-select {
                width: 100%;
              }
            }
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
            .triagRoomCombineBtn {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              margin-top: 200px;
              /deep/.el-button.el-button--primary.el-button--mini.is-disabled {
                margin-left: 0px !important;
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
