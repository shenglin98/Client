<template>
  <div class="dic_index">
    <!-- 项目字典模块主体 -->
    <div class="subject" v-if="showDicItemPage == ''">
      <!-- 左侧tree选择当前字典 -->
      <div class="choose_tree">
        <div class="head"></div>
        <el-tree ref="pageTree" class="pageTree" :data="treeData" node-key="id" :props="defaultProps" :default-expand-all="true" :default-checked-keys="defaultChecked" @node-click="handleNodeClick">
          <span class="custom-tree-node" :ref="`treeItem_${data.id}`" slot-scope="{ node, data }">
            <i class="el-icon-menu"></i> {{ node.label }}
          </span>
        </el-tree>
      </div>
      <!-- 右侧搜索组件 - 主体数据 -->
      <div class="content">
        <!-- 搜索盒子 -->
        <div class="search_box">
          <!-- <el-tag type="success">{{count}}个&nbsp;&nbsp;&nbsp;&nbsp;检查科室：</el-tag> -->
          <el-tag type="success">{{ sumData }}个</el-tag>
          <el-select size="small" v-model="department" @change="handleChangeDepart" filterable clearable placeholder="请选择科室">
            <el-option v-for="(item, index) in deptItems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="searchName" @clear="handleSearchName" @keyup.native.enter="handleSearchName" clearable size="small">
          </el-input>
          <el-button icon="el-icon-search" size="small" plain @click="handleSearchName">搜索</el-button>
          <el-button v-if="pageFlag == 'Dic_combine_his'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleGetCombineSync">同步his组合</el-button>
          <el-button v-if="pageFlag == 'Dic_item_charge'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleGetChargeSyncgeet">收费更新</el-button>
          <el-button v-if="pageFlag == 'Dic_item_charge'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleChangeStopTime(0)">启用</el-button>
          <el-button v-if="pageFlag == 'Dic_item_charge'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleChangeStopTime(1)">停用</el-button>
          <el-button v-if="pageFlag == 'Dic_combine_charge'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleGetCombineChargeSync">收费更新</el-button>
          <el-button v-if="pageFlag == 'Dic_item'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleSynchroDicItem">同步</el-button>
          <el-button v-if="pageFlag == 'Dic_item'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleDicItemContrastSync">同步项目对照</el-button>
          <el-button v-if="pageFlag == 'Dic_combine'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleSynchroDicCombineSync">同步</el-button>
          <el-button v-if="pageFlag == 'Dic_combine'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleSynchroDicCombineItemSync">同步组合项目</el-button>
          <el-button v-if="pageFlag == 'Dic_combine'" icon="el-icon-refresh-right" type="primary" size="mini" plain @click="handleSynchroDicCombineSyncUpdate">同步LIS合管</el-button>
          <permission-btn class="btn_group" moduleName="customerResult" size="mini" v-on:btn-event="hadnleOnBtnClicked"></permission-btn>
        </div>
        <!-- 子组件引入位置 -->
        <div class="child_components">
          <!-- 项目字典 -->
          <div class="dic_item" v-if="pageFlag == 'Dic_item'">
            <EasyTable height="100%" key="Dic_item" class="dicitem_data" :loading="loading" :data="dicItemData" :tableOptions="dicItemOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleDicItemCheck" v-loadmore="handleloadMore" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- 组合字典 -->
          <div class="dic_combine" v-if="pageFlag == 'Dic_combine'">
            <EasyTable height="100%" key="Dic_combine" class="combine_data" :loading="loading" :data="combineData" :tableOptions="combineOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleDicItemCheck" v-loadmore="handleloadMore" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- 项目常见结果字典 -->
          <div class="dic_item_value" v-if="pageFlag == 'Dic_item_value'">
            <EasyTable height="100%" key="Dic_item_value" class="dicItemValue_data" :loading="loading" :data="dicItemValueData" :tableOptions="dicItemValueOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @row-click="handleCheckDicItemValue" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <EasyTable height="100%" key="dicItemValueSon" ref="dicItemValueSon" class="dicItemValue_son" :loading="loadingSon" :data="dicItemValueSon" :tableOptions="dicItemValueSonOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectItemValueSon" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- 项目对照字典 -->
          <div class="dic_item_contrast" v-if="pageFlag == 'Dic_item_contrast'">
            <EasyTable height="100%" key="Dic_item_contrast" class="contrast_data" :loading="loading" :data="contrastData" :tableOptions="contrastOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @row-click="handleCheckDicItemValue" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <EasyTable height="100%" key="contrastSon" ref="contrastSon" class="contrast_son" :loading="loadingSon" :data="contrastSon" :tableOptions="contrastSonOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectContrastSon" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <!-- 收费明细字典 selectCharge-->
          <div class="dic_item_charge" v-if="pageFlag == 'Dic_item_charge'">
            <EasyTable height="100%" key="Dic_item_charge" class="dicItem_charge" ref="dicItemCharge" :loading="loading" :data="dicItemChargeData" :tableOptions="dicItemChargeOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @selected-change="handleSelectCharge" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassNameRed" />
          </div>
          <!-- 组合包含收费字典 -->
          <div class="dic_combine_charge" v-if="pageFlag == 'Dic_combine_charge'">
            <EasyTable height="100%" key="Dic_combine_charge" class="combineCharge_data" :loading="loading" :data="combineChargeData" :tableOptions="combineChargeOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @row-click="handleCheckCombineCharge" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <div class="combineCharge_son_box">
              <EasyTable height="100%" key="combineChargeSon" ref="combineChargeSon" class="combineCharge_son" :loading="loadingSon" :data="combineChargeSon" :tableOptions="combineChargeSonOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectcombineChargeSon" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
              <div class="botttom_Charge_son">
                <div class="divb_c">
                  总数：{{ combineChargeSon.length || 0 }}
                </div>
                <div class="divb_c">价格：{{ combineChargeSonPrice || 0 }}</div>
                <div class="divb_c">
                  折后价格：{{ combineChargeSonPriceDis || 0 }}
                </div>
              </div>
            </div>
          </div>
          <!-- 组合对应申请字典 -->
          <div class="dic_combine_apply" v-if="pageFlag == 'Dic_combine_apply'">
            <EasyTable height="100%" key="Dic_combine_apply" class="combine_data" :loading="loading" :data="combineApplyDataList" :tableOptions="combineApplyOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" @row-click="handleCheckCombineApply" />
            <EasyTable height="100%" key="combineApply" ref="combineApply" class="combineapply" :loading="loadingSon" :data="combineApplyData" :tableOptions="combineApplyListOptions" :checkbox-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" @selected-change="handleSelectCombineApply" />
          </div>
          <!-- 组合 his字典 -->
          <div class="dic_combine_his" v-if="pageFlag == 'Dic_combine_his'">
            <EasyTable height="100%" key="Dic_combine_his" class="combine_his" ref="dicCombine_his" :loading="loading" :data="hisForm" :tableOptions="combineHisOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @selected-change="handleSelectHis" @row-click="handleChooseHisForm" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
            <EasyTable height="100%" key="combine_his_son" class="combine_his_son" ref="dicCombine_his_son" :loading="loading" :data="hisFormSon" :tableOptions="combineHisOptionsSon" :checkbox-config="{ rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
          <div class="Dic_combine_group" v-if="pageFlag == 'Dic_combine_group'">
            <EasyTable height="100%" key="Dic_combine_group" class="combine_group" ref="dicCombine_group" :loading="loading" :data="combineGroupData" :tableOptions="combineGroupOptions" :checkbox-config="{ rowClick: true }" v-loadmore="handleloadMore" @selected-change="handleSelectCombineGroup" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
          </div>
        </div>
      </div>
    </div>
    <!-- 项目-组合字典新增编辑组件 -->
    <transition name="fade" mode="in-out">
      <DicItem v-if="showDicItemPage == 'Dic_item'" :dicItemId="dicItemId" @close="handleCloseDicItem" />
      <DicCombine v-if="showDicItemPage == 'Dic_combine'" :dicCombineId="dicCombineId" @close="handleCloseDicCombine" />
    </transition>
    <!-- 项目常见字典新增编辑弹框 -->
    <el-dialog title="项目常见结果字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseDicItemValue" :visible.sync="showDicItemValue">
      <el-form :model="dicitemvalueForm" :rules="dicitemvalueRules" ref="dicitemvalueForm" label-width="100px">
        <el-form-item size="small" label="编码">
          <el-input disabled v-model="dicitemvalueForm.vueid"></el-input>
        </el-form-item>
        <el-form-item v-if="chooseDicItemValue" size="small" label="项目名称">
          <el-input disabled v-model="chooseDicItemValue.name"></el-input>
        </el-form-item>
        <el-form-item size="small" label="结果描述" prop="value">
          <el-input type="textarea" resize="none" autosize v-model="dicitemvalueForm.value"></el-input>
          <!-- <el-input v-model="dicitemvalueForm.value"></el-input> -->
        </el-form-item>
        <el-form-item size="small" label="结论" prop="conclusion">
          <el-input type="textarea" resize="none" autosize v-model="dicitemvalueForm.conclusion"></el-input>
          <!-- <el-input v-model="dicitemvalueForm.conclusion"></el-input> -->
        </el-form-item>
        <el-form-item size="small" label="小结标志" prop="conflag">
          <el-select v-model="dicitemvalueForm.conflag">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="结论词标志" prop="wordflag">
          <el-select v-model="dicitemvalueForm.wordflag">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="输入码">
          <el-input v-model="dicitemvalueForm.incode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="排序">
          <el-input v-model.number="dicitemvalueForm.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseDicItemValue">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitDicItemValue">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 项目对照字典新增编辑弹框 -->
    <el-dialog title="项目对照字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseContrast" :visible.sync="showContrast">
      <el-form :model="contrastForm" :rules="contrastRules" ref="contrastForm" label-width="100px">
        <el-form-item size="small" label="编码">
          <el-input disabled v-model="contrastForm.conid"></el-input>
        </el-form-item>
        <el-form-item v-if="chooseDicItemValue" size="small" label="项目名称">
          <el-input disabled v-model="chooseDicItemValue.name"></el-input>
        </el-form-item>
        <el-form-item size="small" label="系统对照码" prop="contcode">
          <el-input v-model="contrastForm.contcode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="辅助编码">
          <el-input v-model="contrastForm.assistcode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="对照说明">
          <el-input v-model="contrastForm.remark"></el-input>
        </el-form-item>
        <el-form-item size="small" label="启用状态">
          <el-select v-model="contrastForm.status">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="排序">
          <el-input v-model.number="contrastForm.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseContrast">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitDicItemValue">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收费明细字典新增编辑弹框 -->
    <el-dialog title="收费明细字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseCharge" :visible.sync="showCharge">
      <el-form :model="chargeForm" :rules="chargeRules" ref="chargeForm" label-width="100px">
        <el-form-item size="small" label="收费编码" prop="code">
          <el-input v-model="chargeForm.code"></el-input>
        </el-form-item>
        <el-form-item size="small" label="收费名称" prop="name">
          <el-input v-model="chargeForm.name"></el-input>
        </el-form-item>
        <el-form-item size="small" label="收费科室">
          <el-select v-model="chargeForm.deptcode">
            <el-option v-for="(item, index) in deptItems" :key="index" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="价格" prop="price">
          <el-input v-model="chargeForm.price"></el-input>
        </el-form-item>
        <el-form-item size="small" label="收费类型">
          <el-input v-model="chargeForm.chargetype"></el-input>
        </el-form-item>
        <el-form-item size="small" label="重复收费">
          <el-select v-model="chargeForm.repeatflag">
            <el-option label="允许" :value="0"></el-option>
            <el-option label="不允许" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="最大收费数量">
          <el-input v-model.number="chargeForm.maxamount"></el-input>
        </el-form-item>
        <el-form-item size="small" label="排序" prop="seqno">
          <el-input v-model.number="chargeForm.seqno"></el-input>
        </el-form-item>
        <el-form-item size="small" label="单位" prop="unit">
          <el-input v-model="chargeForm.unit"></el-input>
        </el-form-item>
        <el-form-item size="small" label="类型" prop="fitem_type">
          <el-input v-model="chargeForm.fitem_type"></el-input>
        </el-form-item>
        <el-form-item size="small" label="规格" prop="fitem_spec">
          <el-input v-model="chargeForm.fitem_spec"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCharge">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCharge">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 收费明细字典新增编辑弹框 -->
    <el-dialog title="组合包含收费字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseCombineCharge" @open="handleOpenCombineCharge" :visible.sync="showCombineCharge">
      <el-form :model="combineChargeForm" :rules="combineChargeRules" ref="combineChargeForm" label-width="100px">
        <el-form-item size="small" label="编码">
          <el-input disabled v-model="combineChargeForm.chaid"></el-input>
        </el-form-item>
        <el-form-item v-if="chooseCombineCharge" size="small" label="组合编码">
          <el-input disabled v-model="chooseCombineCharge.codename"></el-input>
        </el-form-item>
        <el-form-item v-if="chooseCombineCharge" size="small" label="检查科室">
          <el-input disabled v-model="chooseCombineCharge.deptname"></el-input>
        </el-form-item>
        <el-form-item size="small" label="价格">
          <el-input disabled v-model="combineChargeForm.price"></el-input>
        </el-form-item>
        <el-form-item size="small" class="sfbm" label="收费编码" prop="code">
          <vxe-pulldown ref="xDown2" style="width: 100%">
            <template v-slot>
              <vxe-input style="width: 100%" v-model="combineChargeForm.code" @focus="handleFocusEvent2" @keyup.native="handleKeyupEvent2"></vxe-input>
            </template>
            <template v-slot:dropdown>
              <vxe-list height="200" class="my-dropdown2" :data="combineCodeItemsSS" auto-resize>
                <template v-slot="{ items }">
                  <div class="list-item2" :class="[
                      combineChargeForm.code === item.code ? 'active' : '',
                    ]" v-for="(item, index) in items" :key="index" @click="handleSelectEvent2(item)">
                    <span>{{
                      item.code +
                      "　　" +
                      item.name +
                      "　　" +
                      item.fitem_spec +
                      "　　" +
                      item.price
                    }}</span>
                  </div>
                </template>
              </vxe-list>
            </template>
          </vxe-pulldown>
        </el-form-item>
        <el-form-item size="small" label="收费名称">
          <el-input v-model.number="combineChargeForm.chargename" disabled></el-input>
        </el-form-item>
        <el-form-item size="small" label="规格">
          <el-input v-model.number="combineChargeForm.spec" disabled></el-input>
        </el-form-item>
        <el-form-item size="small" label="收费类型">
          <el-input v-model.number="combineChargeForm.chargetype"></el-input>
        </el-form-item>
        <el-form-item size="small" label="试管组合">
          <el-select v-model="combineChargeForm.cuvcode" multiple clearable filterable collapse-tags>
            <el-option v-for="(item, index) in combineItems" :key="index" :label="item.code + '　　　' + item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="合管编码">
          <el-input v-model="combineChargeForm.liscuv"></el-input>
        </el-form-item>
        <el-form-item size="small" label="数量" prop="amount">
          <el-input v-model="combineChargeForm.amount"></el-input>
        </el-form-item>
        <el-form-item size="small" label="序号" prop="seqno">
          <el-input v-model.number="combineChargeForm.seqno"></el-input>
        </el-form-item>
        <el-form-item size="small" label="折扣" prop="discount">
          <el-input v-model="combineChargeForm.discount" @input="handleChangeDiscount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCombineCharge">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCombineCharge">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 组合对应申请单字典新增编辑弹框 -->
    <el-dialog title="组合对应申请单字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseCombineAplly" :visible.sync="showCombineAplly">
      <el-form :model="combineApllyForm" :rules="combineApllyRules" ref="combineApllyForm" label-width="100px">
        <el-form-item size="small" label="编码">
          <el-input disabled v-model="combineApllyForm.appid" placeholder="系统自动生成"></el-input>
        </el-form-item>
        <el-form-item size="small" v-if="chooseCombineApply" label="组合编码">
          <el-input disabled v-model="chooseCombineApply.codename"></el-input>
        </el-form-item>
        <el-form-item size="small" label="申请项目编码">
          <el-input v-model="combineApllyForm.applycode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="申请项目名称">
          <el-input v-model="combineApllyForm.applyname"></el-input>
        </el-form-item>
        <el-form-item size="small" label="执行科室编码">
          <el-input v-model="combineApllyForm.execdeptcode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="执行科室名称">
          <el-input v-model="combineApllyForm.execdeptname"></el-input>
        </el-form-item>
        <el-form-item size="small" label="类别编码">
          <el-input v-model="combineApllyForm.categorycode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="类别名称">
          <el-input v-model="combineApllyForm.categoryname"></el-input>
        </el-form-item>
        <el-form-item size="small" label="检查部位">
          <el-input v-model="combineApllyForm.parts"></el-input>
        </el-form-item>
        <el-form-item size="small" label="分组编码">
          <el-input v-model="combineApllyForm.applygroup"></el-input>
        </el-form-item>
        <el-form-item size="small" label="启用状态" prop="status">
          <el-select v-model="combineApllyForm.status" clearable filterable>
            <el-option label="启用" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item size="small" label="序号" prop="seqno">
          <el-input v-model.number="combineApllyForm.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCombineAplly">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCombineAplly">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 组合his字典新增编辑弹框 -->
    <el-dialog title="组合his字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseCombineHis" :visible.sync="showCombineHis">
      <el-form :model="hisEdit" :rules="hisRules" ref="hisEdit" label-width="100px">
        <el-form-item size="small" label="组合编码" prop="hiscode">
          <el-input v-model="hisEdit.hiscode"></el-input>
        </el-form-item>
        <el-form-item size="small" label="组合名称" prop="hisname">
          <el-input v-model="hisEdit.hisname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCombineHis">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCombineHis">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 组合分组字典新增编辑弹框 -->
    <el-dialog title="组合分组字典" :close-on-click-modal="false" class="dicitemvalue_dia" width="550px" @close="handleCloseCombineGroup" :visible.sync="showCombineGroup">
      <el-form :model="combineGroupForm" :rules="combineGroupRules" ref="combineGroupForm" label-width="100px">
        <el-form-item size="small" label="分组编码">
          <el-input v-model="combineGroupForm.code" disabled></el-input>
        </el-form-item>
        <el-form-item size="small" label="分组名称" prop="groupname">
          <el-input v-model="combineGroupForm.groupname"></el-input>
        </el-form-item>
        <el-form-item size="small" label="检查地点" prop="location">
          <el-input v-model="combineGroupForm.location"></el-input>
        </el-form-item>
        <el-form-item size="small" label="注意事项">
          <el-input v-model="combineGroupForm.remark"></el-input>
        </el-form-item>
        <el-form-item size="small" label="序号">
          <el-input v-model="combineGroupForm.seqno"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseCombineGroup">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitCombineGroup">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
// import DicItem from "./components/DicItem";
import DicItem from "./components/DicItem_zyb";
// import DicCombine from "./components/DicCombine";
import DicCombine from "./components/DicCombine_zyb";
import { mapGetters } from "vuex";

import {
  getDicItemList,
  getDicItemDetail,
  setDicItemDelete,
  getDicCombineList,
  setDicCombineDelete,
  getDicItemChildDetail,
  setDicItemChildUpdate,
  setDeleteItemValue,
  getDicItemChargeList,
  setDicItemChargeSave,
  getDicItemChargeDetail,
  setDicItemChargeDelete,
  getCombineChargeDetail,
  setCombineChargeSave,
  setCombineChargeDelete,
  getDicCombineApplyList,
  getDicCombineApplySave,
  setDicCombineApplyDelete,
  getChargeSync,
  getCombineChargeSync,
  getCombineHisLoad,
  setCombineHisSave,
  setCombineHisDelete,
  getCombineSync,
  getCombineHisDetail,
  DicItemSync,
  DicItemContrastSync,
  DicCombineSync,
  DicCombineItemSync,
  DicCombineGroupLoad,
  DicCombineGroupCreate,
  DicCombineGroupDetail,
  DicCombineSyncUpdate,
  DicCombineGroupDelete,
  ChangeChargeStatus,
} from "@/api/projectdictionary2.js";
import { getSysConfigInfo } from "@/api/sysconfig";

export default {
  name: "projectdictionary",

  components: { Sticky, permissionBtn, DicItem, DicCombine },

  data() {
    return {
      pageFlag: "", // 当前页面显示字典控制
      treeData: [
        {
          label: "项目字典",
          name: "Dic_item",
          id: 1,
        },
        {
          label: "组合字典",
          name: "Dic_combine",
          id: 2,
        },
        {
          label: "项目常见结果字典",
          name: "Dic_item_value",
          id: 3,
        },
        {
          label: "项目对照字典",
          name: "Dic_item_contrast",
          id: 4,
        },
        {
          label: "收费明细字典",
          name: "Dic_item_charge",
          id: 5,
        },
        {
          label: "组合包含收费字典",
          name: "Dic_combine_charge",
          id: 6,
        },
        {
          label: "组合对应申请字典",
          name: "Dic_combine_apply",
          id: 7,
        },
        {
          label: "组合his字典",
          name: "Dic_combine_his",
          id: 8,
        },
        {
          label: "组合分类字典",
          name: "Dic_combine_group",
          id: 9,
        },
      ], // 文档树渲染数据
      defaultProps: {
        children: "children",
        label: "label",
      }, // 文档树渲染配置
      defaultChecked: [1], // 默认选中数据
      deptItems: [], // 筛选科室下拉数据回调
      department: "", // 筛选科室
      searchName: "", // 筛选名称
      loading: false, // 加载效果
      loadingSon: false, // 子表加载效果
      dicItemData: [], // 列表渲染数据
      count: 0, // 数据总数
      currentPage: 1, // 当前页码
      pageSize: 50, // 每页显示多少条数据
      first: true, // 是否首次加载
      timer: "", // 防抖ID
      showDicItemPage: "", // 项目字典新增编辑显示
      dicItemId: "", // 项目字典新增或编辑ID
      dicCombineId: "", // 组合字典新增或编辑ID
      selectList: [], // 列表选中数据
      combineData: [], // 组合字典表格数据
      dicItemValueData: [], // 项目常见结果字典表格数据
      chooseDicItemValue: undefined, // 项目常见结果字典选中行数据
      dicItemValueSon: [], // 项目常见结果子表字典表格数据
      showDicItemValue: false, //项目常见字典新增编辑弹框
      dicitemvalueForm: {
        vueid: "",
        itemcode: "",
        value: "",
        conclusion: "",
        conflag: 0,
        wordflag: 0,
        incode: "",
        seqno: 0,
      }, // 项目常见字典新增编辑表单
      dicitemvalueRules: {
        value: [{ required: true, message: "请填写结果描述", trigger: "blur" }],
        conclusion: [
          { required: true, message: "请填写结论", trigger: "blur" },
        ],
        conflag: [
          { required: true, message: "请选择结论标志", trigger: "change" },
        ],
        wordflag: [
          { required: true, message: "请选择结论词标志", trigger: "change" },
        ],
      }, // 项目常见字典新增编辑表单验证
      selectItemValueSon: [], //项目常见字典子表选中数据
      contrastData: [], // 项目对照字典表格数据
      contrastSon: [], // 项目对照子表字典表格数据
      showContrast: false, // 项目对照新增编辑弹框
      contrastForm: {
        conid: "",
        itemcode: "",
        contcode: "",
        assistcode: "",
        remark: "",
        status: 0,
        seqno: 0,
        delflag: 0,
      }, // 项目对照新增编辑表单
      contrastRules: {
        contcode: [
          { required: true, message: "请填写结果描述", trigger: "blur" },
        ],
      }, // 项目对照新增编辑表单验证
      selectContrastSon: [], //项目对照结果子表选中数据
      dicItemChargeData: [], // 收费字典列表数据
      showCharge: false, //收费明细字典新增编辑弹框显示
      chargeForm: {
        code: "",
        name: "",
        deptcode: "",
        deptname: "",
        price: 0,
        chargetype: "",
        repeatflag: 1,
        synchrodate: "",
        pycode: "",
        wbcode: "",
        maxamount: 1,
        seqno: 0,
        delflag: 0,
        ischeck: 2,
      }, // 收费明细字典新增编辑表单对象
      chargeRules: {
        code: [{ required: true, message: "请填写收费编码", trigger: "blur" }],
        name: [{ required: true, message: "请填写收费名称", trigger: "blur" }],
        price: [{ required: true, message: "请填写价格", trigger: "blur" }],
        seqno: [{ required: true, message: "请填写价格", trigger: "blur" }],
      }, //收费明细字典新增编辑表单验证
      chargeFlag: "", // 新增或编辑 add edit
      selectCharge: [], // 收费字典选中数据
      combineChargeData: [], // 组合收费字典-组合字典数据
      combineChargeSon: [], // 组合收费字典-子表数据
      combineItems: [], // 组合收费字典-子表数据
      hisForm: [], // his字典列表数据
      hisFormSon: [],
      chooseCombineCharge: undefined, // 组合收费字典-组合字典数据行选中数据
      showCombineCharge: false, // 组合收费字典-组合字典数据显示
      timeID: "",
      combineChargeForm: {
        chaid: "",
        code: "",
        combinecode: "",
        chargetype: "",
        liscuv: "",
        cuvcode: [],
        amount: 1,
        seqno: 0,
        discount: 1,
        spec: "",
        chargename: "",
      }, // 组合收费字典-组合字典表单对象
      combineChargeRules: {
        code: [
          { required: true, message: "请选择收费编码", trigger: "change" },
        ],
        amount: [
          { required: true, message: "请填写数量", trigger: "blur" },
          // { pattern: /^[1-9]\d*$/, message: "数量不能小于1" },
        ],
        seqno: [{ required: true, message: "请填写序号", trigger: "blur" }],
        discount: [{ required: true, message: "请填写折扣", trigger: "blur" }],
      }, // 组合收费字典-组合字典表单验证
      combineApllyRules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        seqno: [{ required: true, message: "请填写序号", trigger: "blur" }],
      }, // 组合对应申请单表单验证
      selectCombineCharge: [], //组合收费字典-子表选中数据
      combineCodeItems: [], // 收费编码合集
      sumData: 0,
      combineApplyDataList: [], // 组合-对应申请单字典
      combineApplyData: [], // 组合对应申请单字典列表
      chooseCombineApply: undefined, // 组合对应申请单-选中组合
      showCombineAplly: false, // 组合对应申请单-选中组合
      showCombineHis: false, // 组合his组合
      hisEdit: {
        hiscode: "",
        hisname: "",
        code: "",
      }, // 组合his字典 编辑新增
      selectCombineHis: [], //组合his选中数据
      combineApllyForm: {
        appid: "",
        combinecode: "",
        combinename: "",
        applycode: "",
        applyname: "",
        categorycode: "",
        categoryname: "",
        parts: "",
        applygroup: "",
        execdeptcode: "",
        execdeptname: "",
        status: 0,
        seqno: 0,
      }, // 组合对应申请单新增编辑表单
      selectCombineApply: [], // 组合对应申请单选中数据
      InputCombineCode: "",
      hisRules: {
        code: [{ required: true, message: "请填写组合编码", trigger: "blur" }],
        name: [{ required: true, message: "请填写组合名称", trigger: "blur" }],
      },
      combineGroupData: [], // 组合分组字典数据
      showCombineGroup: false, // 组合分组字典弹框控制
      combineGroupForm: {
        code: "",
        groupname: "",
        location: "",
        remark: "",
        seqno: 0,
      }, // 组合分组字典新增表单
      combineGroupRules: {
        groupname: [
          { required: true, message: "请填写组合分组名称", trigger: "blur" },
        ],
        location: [
          { required: true, message: "请填写检查地点", trigger: "blur" },
        ],
      },
      selectCombineGroup: [],
      combineChargeFilter: "",
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    combineChargeSonPrice() {
      let price = 0;
      this.combineChargeSon.forEach((k) => {
        price += k.price * k.amount;
      });
      return +price.toFixed(2);
    },
    combineChargeSonPriceDis() {
      let price = 0;
      this.combineChargeSon.forEach((k) => {
        price += k.price * k.discount * k.amount;
      });
      return +price.toFixed(2);
    },

    //   项目字典表格配置
    dicItemOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "项目编码",
          prop: "code",
          width: 110,
          omit: 1,
        },
        {
          title: "项目名称",
          prop: "name",
          width: 250,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditDicItem(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "项目简称",
          prop: "encode",
          width: 120,
          omit: 1,
        },
        {
          title: "科室名称",
          prop: "deptname",
          width: 150,
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "结果类型",
          prop: "resulttype",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "任意" : "数字";
          },
        },
        {
          title: "默认结果",
          prop: "defaultresult",
          width: 110,
          omit: 1,
        },
        {
          title: "参考值下限",
          prop: "normalmin",
          width: 180,
          omit: 1,
        },
        {
          title: "参考值上限",
          prop: "normalmax",
          width: 180,
          omit: 1,
        },
        {
          title: "单位",
          prop: "unit",
          width: 110,
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          width: 110,
          omit: 1,
        },
        {
          title: "对比标志",
          prop: "contrastflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "不需要" : "需要";
          },
        },
        {
          title: "偏低提示",
          prop: "minmark",
          width: 110,
          omit: 1,
        },
        {
          title: "偏高提示",
          prop: "maxmark",
          width: 110,
          omit: 1,
        },
        {
          title: "关键词输入方式",
          prop: "keytype",
          returnVal: (value) => {
            return value == 0 ? "替换" : "累加";
          },
          width: 180,
          omit: 1,
        },
        {
          title: "重要指标标志",
          prop: "importantflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "常规" : "重要";
          },
        },
        {
          title: "拼音",
          prop: "pycode",
          width: 110,
          omit: 1,
        },
        {
          title: "五笔",
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
    // 组合字典表格配置
    combineOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合编码",
          prop: "code",
          width: 110,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "name",
          width: 250,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type={data.status == 0 ? "primary" : "danger"}
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditDicCombine(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "价格",
          prop: "price",
          width: 120,
          omit: 1,
        },
        {
          title: "科室名称",
          prop: "deptname",
          width: 120,
          omit: 1,
        },
        {
          title: "性别",
          prop: "sex",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "结果类型",
          prop: "resulttype",
          width: 110,
          omit: 1,
          enumType: [
            {
              value: "01",
              label: "基础检查",
            },
            {
              value: "02",
              label: "常规检验",
            },
            {
              value: "03",
              label: "细菌检验",
            },
            {
              value: "04",
              label: "功能检验",
            },
          ],
        },
        {
          title: "复查要求",
          prop: "reviewRequirement",
          width: 110,
          omit: 1,
        },
        {
          title: "组合类型",
          prop: "frequently",
          width: 100,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "通用" : "常用";
          },
        },
        {
          title: "结果输入",
          prop: "resultinput",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "手工输入" : "接口获取";
          },
        },
        {
          title: "显示分组",
          prop: "viewgroup",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 1 ? "基础类" : value == 2 ? "检验类" : "功能类";
          },
        },
        {
          title: "标本类型",
          prop: "samplename",
          width: 110,
          omit: 1,
        },
        {
          title: "标本容器",
          prop: "containername",
          width: 110,
          omit: 1,
        },
        {
          title: "合并编码",
          prop: "mergecode",
          width: 110,
          omit: 1,
        },
        {
          title: "数据接口",
          prop: "interfacecode",
          width: 110,
          omit: 1,
        },
        {
          title: "项目数",
          prop: "itemtotal",
          width: 110,
          omit: 1,
        },
        {
          title: "注意事项",
          prop: "remind",
          width: 110,
          omit: 1,
        },
        {
          title: "检查意义",
          prop: "purpose",
          width: 180,
          omit: 1,
        },
        {
          title: "默认结论",
          prop: "defaultconclusion",
          width: 110,
          omit: 1,
        },
        {
          title: "指引单打印",
          prop: "guideprint",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "打印" : "不打印";
          },
        },
        {
          title: "标签打印",
          prop: "lableprint",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "打印" : "不打印";
          },
        },
        {
          title: "标本采集标志",
          prop: "collectflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "不采集" : "采集";
          },
        },
        {
          title: "标签数量",
          prop: "labletotal",
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
          title: "启用状态",
          prop: "status",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "拼音",
          prop: "pycode",
          width: 150,
          omit: 1,
        },
        {
          title: "五笔",
          prop: "wbcode",
          width: 150,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seqno",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 组合对应申请字典表格配置
    combineApplyOptions() {
      return [
        {
          title: "组合编码",
          prop: "code",
          width: 110,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "name",
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.name}</span>
                <span v-show={data.status == 1} style="color:#f56c6c">
                  {data.name}
                </span>
              </div>
            );
          },
        },
      ];
    },
    // 项目常见结果字典表格配置
    dicItemValueOptions() {
      return [
        {
          title: "项目编码",
          prop: "code",
          width: 150,
        },
        {
          title: "项目名称",
          prop: "name",
          omit: 1,
        },
      ];
    },
    // 项目常见结果字典子表表格配置
    dicItemValueSonOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "结果描述",
          prop: "value",
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditItemValueSon(data)}
              >
                {data.value}
              </el-link>
            );
          },
        },
        {
          title: "结论",
          prop: "conclusion",
          omit: 1,
        },
        {
          title: "结论标志",
          prop: "conflag",
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "结论词标志",
          prop: "wordflag",
          returnVal: (value) => {
            return value == 0 ? "否" : "是";
          },
        },
        {
          title: "输入码",
          prop: "incode",
        },
        {
          title: "排序",
          prop: "seqno",
        },
      ];
    },
    // 项目对照字典表格配置
    contrastOptions() {
      return [
        {
          title: "项目编码",
          prop: "code",
          width: 150,
        },
        {
          title: "项目名称",
          prop: "name",
          omit: 1,
        },
      ];
    },
    // 项目对照字典子表表格配置
    contrastSonOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "系统对照码",
          prop: "contcode",
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditContrastSon(data)}
              >
                {data.contcode}
              </el-link>
            );
          },
        },
        {
          title: "辅助编码",
          prop: "assistcode",
          omit: 1,
        },
        {
          title: "对照说明",
          prop: "remark",
        },
        {
          title: "启用状态",
          prop: "status",
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "排序",
          prop: "seqno",
        },
      ];
    },
    // 收费字典表格配置
    dicItemChargeOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "收费编码",
          prop: "code",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.code}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.code}
                </span>
              </div>
            );
          },
        },
        {
          title: "收费名称",
          prop: "name",
          width: 250,
          render: (h, data) => {
            return (
              <el-link
                type={data.status == 0 ? "primary" : "danger"}
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditcharge(data)}
              >
                {data.name}
              </el-link>
            );
          },
        },
        {
          title: "收费科室名称",
          prop: "deptname",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.deptname}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.deptname}
                </span>
              </div>
            );
          },
        },
        {
          title: "价格",
          prop: "price",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.price}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.price}
                </span>
              </div>
            );
          },
        },
        {
          title: "收费类型",
          prop: "chargetype",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.chargetype}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.chargetype}
                </span>
              </div>
            );
          },
        },
        {
          title: "重复收费",
          prop: "repeatflag",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "允许" : "不允许";
          },
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>
                  {data.repeatflag == 0 ? "允许" : "不允许"}
                </span>
                <span v-show={data.status == 1} style="color:red">
                  {data.repeatflag == 0 ? "允许" : "不允许"}
                </span>
              </div>
            );
          },
        },
        {
          title: "单位",
          prop: "unit",
          width: 170,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.unit}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.unit}
                </span>
              </div>
            );
          },
        },
        {
          title: "启用时间",
          prop: "starttime",
          width: 170,
          omit: 1,
        },
        {
          title: "最大收费数量",
          prop: "maxamount",
          width: 150,
          omit: 1,
        },
        {
          title: "停用时间",
          prop: "stoptime",
          width: 170,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.stoptime}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.stoptime}
                </span>
              </div>
            );
          },
        },
        {
          title: "状态",
          prop: "status",
          width: 120,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>正常</span>
                <span v-show={data.status == 1} style="color:red">
                  停用
                </span>
              </div>
            );
          },
        },
        {
          title: "类型",
          prop: "fitem_type",
          width: 170,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.fitem_type}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.fitem_type}
                </span>
              </div>
            );
          },
        },
        {
          title: "规格",
          prop: "fitem_spec",
          width: 170,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.fitem_spec}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.fitem_spec}
                </span>
              </div>
            );
          },
        },
        {
          title: "HIS同步时间",
          prop: "synchrodate",
          width: 170,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.synchrodate}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.synchrodate}
                </span>
              </div>
            );
          },
        },
        {
          title: "拼音码",
          prop: "pycode",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.pycode}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.pycode}
                </span>
              </div>
            );
          },
        },
        {
          title: "五笔码",
          prop: "wbcode",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.wbcode}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.wbcode}
                </span>
              </div>
            );
          },
        },
        {
          title: "排序",
          prop: "seqno",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.seqno}</span>
                <span v-show={data.status == 1} style="color:red">
                  {data.seqno}
                </span>
              </div>
            );
          },
        },
      ];
    },
    // 组合收费字典-组合字典表格配置
    combineChargeOptions() {
      return [
        {
          title: "组合编码",
          prop: "code",
          width: 110,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "name",
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.status == 0}>{data.name}</span>
                <span v-show={data.status == 1} style="color:#f56c6c">
                  {data.name}
                </span>
              </div>
            );
          },
        },
      ];
    },
    // 组合收费字典-子表表格配置
    combineChargeSonOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合编码",
          prop: "combinecode",
          width: 110,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "combinename",
          width: 250,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() =>
                  this.handleEditCombineCharge(data)
                }
              >
                {data.combinename}
              </el-link>
            );
          },
        },
        {
          title: "收费编码",
          prop: "chargecode",
          width: 110,
          omit: 1,
        },
        {
          title: "收费名称",
          prop: "chargename",
          width: 200,
          omit: 1,
        },
        {
          title: "收费价格",
          prop: "price",
          width: 120,
          omit: 1,
        },
        {
          title: "折扣",
          prop: "discount",
          width: 80,
          omit: 1,
        },
        {
          title: "折后价格",
          prop: "discount",
          width: 100,
          omit: 1,
          render: (h, data) => {
            return <span>{+data.price * +data.discount}</span>;
          },
        },
        {
          title: "收费数量",
          prop: "amount",
          width: 120,
          omit: 1,
        },
        {
          title: "收费科室名称",
          prop: "deptname",
          width: 200,
          omit: 1,
        },
        {
          title: "收费类型",
          prop: "chargetype",
          width: 120,
          omit: 1,
        },
      ];
    },
    // 组合对应申请单字典表格配置
    combineApplyListOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合编码",
          prop: "combinecode",
          width: 100,
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "combinename",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditCombineApply(data)}
              >
                {data.combinename}
              </el-link>
            );
          },
        },
        {
          title: "申请项目编码",
          prop: "applycode",
          width: 120,
          omit: 1,
        },
        {
          title: "申请项目名称",
          prop: "applyname",
          width: 120,
          omit: 1,
        },
        {
          title: "执行科室编码",
          prop: "execdeptcode",
          width: 120,
          omit: 1,
        },
        {
          title: "执行科室名称",
          prop: "execdeptname",
          width: 120,
          omit: 1,
        },
        {
          title: "类别编码",
          prop: "categorycode",
          omit: 1,
        },
        {
          title: "类别名称",
          prop: "categoryname",
          omit: 1,
        },
        {
          title: "检查部位",
          prop: "parts",
          omit: 1,
        },
        {
          title: "分组编码",
          prop: "applygroup",
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          omit: 1,
          returnVal: (value) => {
            return value == 0 ? "启用" : "停用";
          },
        },
        {
          title: "排序",
          prop: "seqno",
          omit: 1,
        },
      ];
    },
    // 组合his字典表格配置
    combineHisOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "组合编码",
          prop: "hiscode",
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "hisname",
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditCombineHis(data)}
              >
                {data.hisname}
              </el-link>
            );
          },
        },
      ];
    },
    // 组合his字典表格配置-子表
    combineHisOptionsSon() {
      return [
        {
          title: "his医嘱编码",
          prop: "hiscode",
          width: 130,
          omit: 1,
        },
        {
          title: "his医嘱名称",
          prop: "hisname",
          width: 130,
          omit: 1,
        },
        {
          title: "收费编码",
          prop: "chacode",
          width: 130,
          omit: 1,
        },
        {
          title: "收费名称",
          prop: "chaname",
          omit: 1,
        },
        {
          title: "同步时间",
          prop: "createtime",
          width: 150,
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          width: 130,
          omit: 1,
        },
        {
          title: "数量",
          prop: "amount",
          width: 130,
          omit: 1,
        },
      ];
    },
    // 组合分组字典
    combineGroupOptions() {
      return [
        // {
        //   title: "分组编码",
        //   prop: "code",
        //   width: 130,
        //   omit: 1,
        // },
        {
          type: "selection",
          width: 45,
        },
        {
          title: "分组名称",
          prop: "groupname",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() => this.handleEditCombineGroup(data)}
              >
                {data.groupname}
              </el-link>
            );
          },
        },
        {
          title: "检查地点",
          prop: "location",
          omit: 1,
        },
        {
          title: "注意事项",
          prop: "remark",
          width: 200,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seqno",
          width: 130,
          omit: 1,
        },
      ];
    },
  },
  mounted() {
    this.handleCheckNode();
    this.handleGetDicItemDetail();
  },

  methods: {
    handGetCombinechargeFilter() {
      getSysConfigInfo({ cc: "Sys_Depart_Other" }).then((res) => {
        if (!res.result) return;
        this.combineChargeFilter = res.result.split(",");
      });
    },
    // 收费明细字典启用/停用回调
    handleChangeStopTime(status) {
      if (!this.selectCharge.length) {
        this.$message.warning("请先选中数据!");
        return;
      }
      ChangeChargeStatus({
        tempids: this.selectCharge.map((k) => k.code),
        status,
      }).then((res) => {
        this.$message.success(res.message);
        this.currentPage = 1;
        this.dicItemChargeData = [];
        this.handleGetDicItemChargeList();
      });
    },
    // 组合分组字典删除回调
    handleSetDicCombineGroupDelete() {
      if (this.selectCombineGroup.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let arr = this.selectCombineGroup.map((k) => {
            k.code;
          });
          DicCombineGroupDelete(arr).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineGroupData = [];
            this.handleDicCombineGroupLoad();
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
    // 组合分组字典编辑回调
    handleEditCombineGroup(val) {
      if (val && val != "undefined") {
        this.showCombineGroup = true;
        this.combineGroupForm = JSON.parse(JSON.stringify(val));
      } else {
        if (this.selectCombineGroup.length !== 1) {
          this.$message.warning("请勾选1条数据进行编辑!");
        } else {
          this.showCombineGroup = true;
          this.combineGroupForm = JSON.parse(this.selectCombineGroup[0]);
        }
      }
    },
    // 组合分组字典新增编辑弹框提交回调
    handleSubmitCombineGroup() {
      this.$refs["combineGroupForm"].validate((valid) => {
        if (valid) {
          DicCombineGroupCreate(this.combineGroupForm).then((res) => {
            if (res.code == 200) {
              this.$message.success(res.message);
              this.currentPage = 1;
              this.combineGroupData = [];
              this.handleDicCombineGroupLoad(); // 重新拉取数据
              this.handleCloseCombineGroup(); // 提交后要关闭弹框
            }
          });
        }
      });
    },
    // 组合分组字典新增弹框关闭
    handleCloseCombineGroup() {
      this.showCombineGroup = false;
      this.combineGroupForm = {
        code: "",
        groupname: "",
        location: "",
        remark: "",
        seqno: 0,
      }; // 组合分组字典新增表单
    },
    // 组合分组字典-获取列表数据
    handleDicCombineGroupLoad() {
      this.loading = true;
      DicCombineGroupLoad({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
      })
        .then((res) => {
          this.count = res.count;
          this.combineGroupData.push(...res.data);
          this.loading = false;
          this.sumData = res.count;
        })
        .catch((err) => {
          this.currentPage = 1;
          this.count = 0;
          this.combineGroupData = [];
          this.loading = false;
        });
    },
    // 组合分组字典选中数据
    handleSelectCombineGroup(arr) {
      this.selectCombineGroup = arr;
    },
    //  点击同步组合LIS合管
    handleSynchroDicCombineSyncUpdate() {
      DicCombineSyncUpdate().then((res) => {
        this.$message.success(res.msg);
        this.combineData = [];
        this.handleGetDicCombineList();
      });
    },
    //  点击同步组合项目字典
    handleSynchroDicCombineItemSync() {
      DicCombineItemSync().then((res) => {
        this.$message.success(res.msg);
        this.combineData = [];
        this.handleGetDicCombineList();
      });
    },
    //  点击同步组合字典
    handleSynchroDicCombineSync() {
      DicCombineSync().then((res) => {
        this.$message.success(res.msg);
        this.combineData = [];
        this.handleGetDicCombineList();
      });
    },
    //  点击同步项目对照字典
    handleDicItemContrastSync() {
      DicItemContrastSync().then((res) => {
        this.$message.success(res.msg);
        this.dicItemData = [];
        this.handleGetDicItemList();
      });
    },
    //  点击同步项目字典
    handleSynchroDicItem() {
      DicItemSync().then((res) => {
        this.$message.success(res.msg);
        this.dicItemData = [];
        this.handleGetDicItemList();
      });
    },
    // 点击组合his字典行回调
    handleChooseHisForm(row) {
      console.log(row);
      if (!row) return;
      getCombineHisDetail({ hiscode: row.hiscode }).then((res) => {
        if (!res.result) return;
        this.hisFormSon = res.result;
      });
    },
    // 同步组合his组合字典
    handleGetCombineSync() {
      getCombineSync().then((res) => {
        if (res.data) {
          this.$message.success(res.msg);
          this.handleGetDicCombineHisList();
        }
      });
    },
    // 组合包含收费字典更新价格
    handleGetCombineChargeSync() {
      const loading = this.$loading({
        lock: true,
        text: "更新中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
        customClass: "loadingmask",
      });
      getCombineChargeSync()
        .then((res) => {
          loading.close();
          if (res.data) {
            this.currentPage = 1;
            this.combineChargeData = [];
            this.combineChargeSon = [];
            this.chooseCombineCharge = undefined;
            this.handleGetCombineChargeList();
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    // 收费字典更新价格
    handleGetChargeSyncgeet() {
      const loading = this.$loading({
        lock: true,
        text: "更新中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      getChargeSync()
        .then((res) => {
          loading.close();
          if (res.data) {
            this.currentPage = 1;
            this.dicItemChargeData = [];
            this.handleGetDicItemChargeList();
          }
        })
        .catch(() => {
          loading.close();
        });
    },
    handleFocusEvent2() {
      this.$refs.xDown2.showPanel();
    },
    handleKeyupEvent2() {
      const value2 = this.combineChargeForm.code;
      if (value2) {
        this.combineCodeItemsSS = this.combineCodeItems.filter((data) => {
          return Object.keys(data).some((key) => {
            return (
              String(data[key]).toLowerCase().indexOf(value2.toLowerCase()) > -1
            );
          });
        });
      } else {
        this.combineCodeItemsSS = this.combineCodeItems;
      }
      this.$refs.xDown2.showPanel();
      // this.combineCodeItemsSS = value2
      //   ? this.combineCodeItems.filter(
      //       (item) => item.label.indexOf(value2) > -1
      //     )
      //   : this.combineCodeItems;
    },
    handleSelectEvent2(item) {
      this.combineChargeForm.code = item.code;
      this.combineChargeForm.chargename = item.name;
      this.combineChargeForm.spec = item.fitem_spec;
      this.combineChargeForm.price = item.price;
      console.log(this.combineChargeForm, "this.combineChargeForm");
      this.$refs.xDown2.hidePanel().then(() => {
        this.combineCodeItemsSS = this.combineCodeItems;
      });
    },
    // 组合对应申请单字典删除回调
    handleSetDicCombineApplyDelete() {
      if (this.selectCombineApply.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = this.selectCombineApply.map((item) => {
            return item.appid;
          });
          setDicCombineApplyDelete(codeItems).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineApplyData = [];
            this.handleGetDicApplyList();
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
    // 组合对应申请单字典编辑回调
    handleEditCombineApply(item) {
      item && (this.selectCombineApply = [item]);
      if (this.selectCombineApply.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.combineApllyForm = JSON.parse(
          JSON.stringify(this.selectCombineApply[0])
        );
        this.showCombineAplly = true;
        this.$nextTick(() => {
          this.$refs["combineApllyForm"].clearValidate();
        });
      }
    },
    // 组合对应申请单字典选中数据回调
    handleSelectCombineApply(arr) {
      this.selectCombineApply = arr;
    },
    // 组合对应申请单字典新增编辑弹框提交回调
    handleSubmitCombineAplly() {
      this.$refs["combineApllyForm"].validate((valid) => {
        if (valid) {
          if (!this.combineApllyForm.appid) {
            this.combineApllyForm.combinecode = this.chooseCombineApply.code;
            this.combineApllyForm.combinename = this.chooseCombineApply.name;
          }
          getDicCombineApplySave(this.combineApllyForm).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineApplyData = [];
            this.selectCombineApply = [];
            this.handleGetDicApplyList();
            this.handleCloseCombineAplly();
          });
        }
      });
    },
    // 组合对应申请单字典新增编辑弹框关闭回调
    handleCloseCombineAplly() {
      this.$refs["combineApllyForm"].clearValidate();
      this.$refs["combineApply"].$refs.easyTable.clearSelection();
      this.combineApllyForm = {
        appid: "",
        combinecode: "",
        combinename: "",
        applycode: "",
        applyname: "",
        categorycode: "",
        categoryname: "",
        parts: "",
        applygroup: "",
        execdeptcode: "",
        execdeptname: "",
        status: 0,
        seqno: 0,
      }; // 组合对应申请单新增编辑表单
      this.showCombineAplly = false;
    },
    // 组合his字典获取列表回调
    handleGetDicCombineHisList() {
      getCombineHisLoad({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        id: "",
        code: "",
        type: "",
        tableName: "Dic_combine_his",
      }).then((res) => {
        if (res.code == 200) {
          this.hisForm = res.data;
          console.log(this.hisForm, "this.hisForm");
        }
        console.log(res, "组合his字典获取列表回调");
      });
    },
    // 组合his字典新增编辑框关闭回调
    handleCloseCombineHis() {
      console.log("组合his字典新增编辑框关闭回调");
      this.showCombineHis = false;
      this.hisEdit = {
        hiscode: "",
        hisname: "",
      }; // 组合his新增编辑表单
    },
    // 组合his字典新增编辑弹框提交回调
    handleSubmitCombineHis() {
      console.log("组合his字典新增编辑弹框提交回调");
      this.$refs["hisEdit"].validate((valid) => {
        if (valid) {
          setCombineHisSave(this.hisEdit).then((res) => {
            console.log(res);
            if (res.code == 200) {
              this.$message.success(res.message);
              this.currentPage = 1;
              this.hisForm = [];
              this.handleGetDicCombineHisList(); // 重新拉取数据
              this.handleCloseCombineHis(); // 提交后要关闭弹框
            }
            // this.$message.success(res.message);
          });
        }
      });
    },
    // 组合his字典删除回调
    handleSetDicCombineHisDelete() {
      console.log("组合his字典删除回调");
      this.showCombineHis = false;
      if (this.selectCombineHis.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let arr = [];
          this.selectCombineHis.forEach((item) => {
            arr.push(item.code);
          });
          setCombineHisDelete(arr).then((res) => {
            console.log(res);
            this.$message.success(res.message);
            this.currentPage = 1;
            this.hisForm = [];
            this.handleGetDicCombineHisList();
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
    // 组合his字典选中数据回调
    handleSelectHis(item) {
      console.log("组合his字典选中数据回调", item);
      item && (this.selectCombineHis = item);
    },
    // 组合his字典编辑回调
    handleEditCombineHis(val) {
      console.log("组合his字典编辑回调", val);
      if (val && val != "undefined") {
        this.showCombineHis = true;
        this.hisEdit = val;
        console.log(this.selectCombineHis, "this.selectCombineHis");
      } else {
        if (this.selectCombineHis.length !== 1) {
          this.$message.warning("请勾选1条数据进行编辑!");
        } else {
          this.showCombineHis = true;
          this.hisEdit = this.selectCombineHis[0];
          console.log(this.selectCombineHis, "this.selectCombineHis");
        }
      }
    },
    // 组合对应申请单字典列表回调
    handleGetDicApplyList() {
      if (!this.chooseCombineApply) return false;
      this.loadingSon = true;
      getDicCombineApplyList({
        page: 1,
        limit: 10000,
        key: "",
        code: this.chooseCombineApply.code,
      })
        .then((res) => {
          this.loadingSon = false;
          if (!res.data) return false;
          this.combineApplyData = res.data;
        })
        .catch((err) => {
          this.loadingSon = false;
          this.combineApplyData = [];
        });
    },
    // 组合列表点击获取对应申请字典
    handleCheckCombineApply(item) {
      this.chooseCombineApply = item;
      this.chooseCombineApply.codename = `${item.code}　${item.name}`;
      this.handleGetDicApplyList();
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
    // 组合收费字典-组合字典删除回调
    handleDelCombineCharge() {
      if (this.selectCombineCharge.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let chargecodes = this.selectCombineCharge.map((item) => {
            return item.chaid;
          });
          setCombineChargeDelete({
            combinecode: this.chooseCombineCharge.code,
            chargecodes,
          }).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineChargeSon = [];
            this.handleGetCombineChargeDetail();
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
    // 组合收费字典-组合字典编辑回调
    handleEditCombineCharge(item) {
      item && (this.selectCombineCharge = [item]);
      if (this.selectCombineCharge.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        getDicCombineList({
          page: 1,
          limit: 1000000,
          key: "",
          deptname: "",
        }).then((res) => {
          this.combineItems = res.data.filter((k) => {
            return this.combineChargeFilter.includes(k.deptcode);
          });
          // switch (this.Hospitals) {
          //   case "index":
          //     this.combineItems = res.data;
          //     break;
          //   case "index_gyey": // 广医二院
          //     this.combineItems = res.data.filter((k) => {
          //       return ["0", "51"].includes(k.deptcode);
          //     });
          //     break;
          //   default:
          //     this.combineItems = res.data.filter((k) => {
          //       return (
          //         k.deptname.includes("其它") ||
          //         k.deptname.includes("其他") ||
          //         (k.deptcode == 196 && k.deptname == "体检中心")
          //       );
          //     });
          //     break;
          // }
          // switch (this.Hospitals) {
          //   case "index":
          //     this.combineItems = res.data;
          //     break;
          //   case "index_qyzyy": // 清远中医药
          //     this.combineItems = res.data.filter((k) => {
          //       return ["16"].includes(k.deptcode);
          //     });
          //     break;
          //   case "index_mzjyyy": // 梅州嘉应
          //     this.combineItems = res.data.filter((k) => {
          //       return ["16"].includes(k.deptcode);
          //     });
          //     break;
          //   case "index_gyey": // 广医二院
          //     this.combineItems = res.data.filter((k) => {
          //       return ["0", "51"].includes(k.deptcode);
          //     });
          //     break;
          //   case "index_dgcayy": // 东莞长安医院
          //     this.combineItems = res.data.filter((k) => {
          //       return ["196"].includes(k.deptcode);
          //     });
          //     break;
          //   default:
          //     break;
          // }
        });
        this.selectCombineCharge[0].code =
          this.selectCombineCharge[0].chargecode;
        this.combineChargeForm = JSON.parse(
          JSON.stringify(this.selectCombineCharge[0])
        );
        if (
          this.combineChargeForm.cuvcode != "" &&
          this.combineChargeForm.cuvcode != null
        ) {
          this.combineChargeForm.cuvcode =
            this.combineChargeForm.cuvcode.split(",");
        } else {
          this.combineChargeForm.cuvcode = [];
        }
        this.showCombineCharge = true;
        this.$nextTick(() => {
          this.$refs["combineChargeForm"].clearValidate();
        });
      }
    },
    //  组合收费字典-组合字典弹框提交回调
    handleSubmitCombineCharge() {
      this.$refs["combineChargeForm"].validate((valid) => {
        if (valid) {
          this.combineChargeForm.combinecode = this.chooseCombineCharge.code;
          if (this.combineChargeForm.cuvcode.length > 0) {
            this.combineChargeForm.cuvcode =
              this.combineChargeForm.cuvcode.join(",");
          } else {
            this.combineChargeForm.cuvcode = "";
          }
          this.combineChargeForm.amount = +this.combineChargeForm.amount || 0;
          setCombineChargeSave(this.combineChargeForm).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineChargeSon = [];
            this.selectCombineCharge = [];
            this.handleGetCombineChargeDetail();
            this.handleCloseCombineCharge();
          });
        }
      });
    },
    //  组合收费字典-组合字典列表数据选中回调
    handleSelectcombineChargeSon(val) {
      this.selectCombineCharge = val;
    },
    handleOpenCombineCharge() {
      this.$nextTick(() => {
        this.$refs["combineChargeForm"] &&
          this.$refs["combineChargeForm"].clearValidate();
      });
    },
    //  组合收费字典-组合字典弹框关闭回调
    handleCloseCombineCharge() {
      this.$refs["combineChargeForm"].clearValidate();
      this.$refs["combineChargeSon"].$refs.easyTable.clearSelection();
      this.combineChargeForm = {
        chaid: "",
        code: "",
        chargename: "",
        combinecode: "",
        chargetype: "",
        liscuv: "",
        cuvcode: [],
        amount: 1,
        seqno: 0,
        discount: 1,
        spec: "",
      }; // 组合收费字典-组合字典表单对象
      this.showCombineCharge = false;
    },
    // 获取组合收费明细回调
    handleGetCombineChargeDetail() {
      if (!this.chooseCombineCharge) return false;
      getCombineChargeDetail({
        combinecode: this.chooseCombineCharge.code,
      }).then((res) => {
        if (!res.result) return;
        this.combineChargeSon = res.result;
      });
    },
    // 组合收费字典-组合字典数据行选中数据回调
    handleCheckCombineCharge(row) {
      this.chooseCombineCharge = row;
      this.chooseCombineCharge.codename = `${row.code} ${row.name}`;
      this.combineChargeForm.deptcode = row.deptcode;
      this.combineChargeForm.deptname = row.deptname;
      this.handleGetCombineChargeDetail();
    },
    // 组合包含收费字典组合字典列表回调
    handleGetCombineChargeList() {
      this.loading = true;
      getDicCombineList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        this.count = res.count;
        this.combineChargeData.push(...res.data);
        this.loading = false;
        this.sumData = res.count;
        this.department !== "" &&
          (this.sumData = this.combineChargeData.length);
      });
    },
    // 获取收费编码合集
    handleGetCombineCodeItems() {
      getDicItemChargeList({
        page: 1,
        limit: 1000000,
        key: "",
      }).then((res) => {
        console.log(res, "res");
        this.combineCodeItems = res.data.filter((k) => k.status != 1);
        this.combineCodeItemsSS = res.data.filter((k) => k.status != 1);
      });
    },
    // 收费字典删除回调
    handleDelcharge() {
      if (this.selectCharge.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codes = this.selectCharge.map((item) => {
            return item.code + item.fitem_spec;
          });
          setDicItemChargeDelete(codes).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.dicItemChargeData = [];
            this.handleGetDicItemChargeList();
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
    // 收费字典编辑回调
    handleEditcharge(item) {
      item && (this.selectCharge = [item]);
      if (this.selectCharge.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        getDicItemChargeDetail({
          code: this.selectCharge[0].code,
          fitem_spec: this.selectCharge[0].fitem_spec,
        }).then((res) => {
          this.chargeForm = res.result;
          this.chargeFlag = "edit";
          this.showCharge = true;
        });
      }
    },
    // 收费字典列表选中数据回调
    handleSelectCharge(val) {
      this.selectCharge = val;
      console.log(val);
    },
    // 收费字典新增编辑弹框提交回调
    handleSubmitCharge() {
      this.$refs["chargeForm"].validate((valid) => {
        if (valid) {
          this.chargeFlag == "add"
            ? (this.chargeForm.ischeck = 1)
            : (this.chargeForm.ischeck = 2);
          if (this.chargeForm.deptcode) {
            let flag = this.deptItems.findIndex(
              (k) => k.code == this.chargeForm.deptcode
            );
            flag !== -1 &&
              (this.chargeForm.deptname = this.deptItems[flag].name);
          }
          this.chargeForm.maxamount = +this.chargeForm.maxamount || 1;
          delete this.chargeForm.departments;
          setDicItemChargeSave(this.chargeForm).then((res) => {
            this.$message.success(res.message);
            this.chargeFlag = "";
            this.currentPage = 1;
            this.dicItemChargeData = [];
            this.selectCharge = [];
            this.handleCheckNode();
            this.handleCloseCharge();
          });
        }
      });
    },
    // 收费字典新增编辑弹框关闭回调
    handleCloseCharge() {
      this.$refs["chargeForm"].clearValidate();
      this.$refs["dicItemCharge"].$refs.easyTable.clearSelection();
      this.chargeForm = {
        code: "",
        name: "",
        deptcode: "",
        deptname: "",
        price: 0,
        chargetype: "",
        repeatflag: 1,
        synchrodate: "",
        pycode: "",
        wbcode: "",
        maxamount: 1,
        seqno: 0,
        delflag: 0,
        ischeck: 2,
        unit: "",
        fitemtype: "",
        fitemspec: "",
      }; // 收费明细字典新增编辑表单对象
      this.showCharge = false;
    },
    // 获取收费字典列表回调
    handleGetDicItemChargeList() {
      this.loading = true;
      getDicItemChargeList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        this.count = res.count;
        this.dicItemChargeData.push(...res.data);
        console.log(this.dicItemChargeData, "this.dicItemChargeData");
        this.loading = false;
        this.sumData = res.count;
        this.department !== "" &&
          (this.sumData = this.dicItemChargeData.length);
      });
    },
    // 项目字典常见结果删除回调
    handleSetDeleteItemValue() {
      if (this.pageFlag == "Dic_item_value") {
        if (this.selectItemValueSon.length == 0) {
          this.$message.warning("请勾选需删除的数据!");
          return false;
        }
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let vueidItems = this.selectItemValueSon.map((k) => {
              return k.vueid;
            });
            setDeleteItemValue({
              code: this.chooseDicItemValue.code,
              vueidItems,
            }).then((res) => {
              this.$message.success(res.message);
              this.handleGetDicItemChildDetail(); // 获取列表新数据
            });
          })
          .catch(() => {
            this.$message({
              showClose: true,
              type: "info",
              message: "已取消",
            });
          });
      } else {
        if (this.selectContrastSon.length == 0) {
          this.$message.warning("请勾选需删除的数据!");
          return false;
        }
        this.$confirm("是否确认删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let conidItems = this.selectContrastSon.map((k) => {
              return k.conid;
            });
            setDeleteItemValue({
              code: this.chooseDicItemValue.code,
              conidItems,
            }).then((res) => {
              this.$message.success(res.message);
              this.handleGetDicItemChildDetail(); // 获取列表新数据
            });
          })
          .catch(() => {
            this.$message({
              showClose: true,
              type: "info",
              message: "已取消",
            });
          });
      }
    },
    // 项目常见结果子表编辑回调
    handleEditItemValueSon(item) {
      item && (this.selectItemValueSon = [item]);
      if (this.selectItemValueSon.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.showDicItemValue = true;
        this.dicitemvalueForm = JSON.parse(
          JSON.stringify(this.selectItemValueSon[0])
        );
      }
    },
    // 项目对照结果子表编辑回调
    handleEditContrastSon(item) {
      item && (this.selectContrastSon = [item]);
      if (this.selectContrastSon.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.showContrast = true;
        this.contrastForm = JSON.parse(
          JSON.stringify(this.selectContrastSon[0])
        );
      }
    },
    // 项目常见结果子表选中数据回调
    handleSelectItemValueSon(val) {
      this.selectItemValueSon = val;
    },
    // 项目对照结果子表选中数据回调
    handleSelectContrastSon(val) {
      this.selectContrastSon = val;
    },
    // 项目字典新增编辑弹框提交回调
    handleSubmitDicItemValue() {
      if (this.pageFlag == "Dic_item_value") {
        this.$refs["dicitemvalueForm"].validate((valid) => {
          if (valid) {
            this.dicitemvalueForm.itemcode = this.chooseDicItemValue.code;
            setDicItemChildUpdate({
              valueitems: [this.dicitemvalueForm],
            }).then((res) => {
              this.$message.success(res.message);
              this.handleGetDicItemChildDetail(); // 获取列表新数据
              this.handleCloseDicItemValue(); // 关闭弹框
            });
          }
        });
      } else {
        this.$refs["contrastForm"].validate((valid) => {
          if (valid) {
            this.contrastForm.itemcode = this.chooseDicItemValue.code;
            setDicItemChildUpdate({
              contrastitems: [this.contrastForm],
            }).then((res) => {
              this.$message.success(res.message);
              this.handleGetDicItemChildDetail(); // 获取列表新数据
              this.handleCloseContrast(); // 关闭弹框
            });
          }
        });
      }
    },
    // 项目常见结果字典新增编辑弹框关闭回调
    handleCloseDicItemValue() {
      this.$refs["dicitemvalueForm"].clearValidate();
      this.$refs["dicItemValueSon"].$refs.easyTable.clearSelection();
      this.dicitemvalueForm = {
        vueid: "",
        itemcode: "",
        value: "",
        conclusion: "",
        conflag: 0,
        wordflag: 0,
        incode: "",
        seqno: 0,
      }; // 项目常见字典新增编辑表单
      this.showDicItemValue = false;
    },
    // 项目对照结果字典新增编辑弹框关闭回调
    handleCloseContrast() {
      this.$refs["contrastForm"].clearValidate();
      this.$refs["contrastSon"].$refs.easyTable.clearSelection();
      this.contrastForm = {
        conid: "",
        itemcode: "",
        contcode: "",
        assistcode: "",
        remark: "",
        status: 0,
        seqno: 0,
        delflag: 0,
      }; // 项目对照新增编辑表单
      this.showContrast = false;
    },
    // 项目字典结果、对照列表
    handleGetDicItemChildDetail() {
      if (!this.chooseDicItemValue) return false;
      this.loadingSon = true;
      getDicItemChildDetail({
        code: this.chooseDicItemValue.code,
        tb: this.pageFlag,
      }).then((res) => {
        if (this.pageFlag === "Dic_item_value") {
          this.dicItemValueSon = res.result.valueitems;
        } else {
          this.contrastSon = res.result.contrastitems;
        }
        this.loadingSon = false;
      });
    },
    // 组合包含收费字典折扣修改
    handleChangeDiscount() {
      clearTimeout(this.timeID);
      this.timeID = setTimeout(() => {
        if (this.combineChargeForm.discount < 0.1) {
          this.$message.warning("折扣不能低于一折!");
          return false;
        }
        if (this.combineChargeForm.discount > 1) {
          this.$message.warning("折扣不能高于十折!");
          return false;
        }
      }, 1000);
    },
    // 项目常见结果字典列表点击行回调
    handleCheckDicItemValue(row) {
      this.chooseDicItemValue = row;
      this.handleGetDicItemChildDetail();
    },
    // 树形结构选中储存回调
    handleCheckNode() {
      // 页面加载默认选中第一个
      this.$nextTick(() => {
        let currentNode = localStorage.getItem("currentNode");
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
      localStorage.setItem("currentNode", data.id);
      this.currentPage = 1;
      this.sumData = 0;
      switch (data.name) {
        case "Dic_item": // 项目字典
          this.dicItemData = [];
          this.handleGetDicItemList();
          break;
        case "Dic_combine": // 组合字典
          this.combineData = [];
          this.handleGetDicCombineList();
          break;
        case "Dic_item_value": // 项目常见结果字典表格数据
          this.chooseDicItemValue = undefined;
          this.dicItemValueData = [];
          this.dicItemValueSon = [];
          this.handleGetDicItemValue();
          break;
        case "Dic_item_contrast": // 项目对照字典表格数据
          this.chooseDicItemValue = undefined;
          this.contrastData = [];
          this.contrastSon = [];
          this.handleGetDicItemValue();
          break;
        case "Dic_item_charge": //  收费明细字典
          this.dicItemChargeData = [];
          this.handleGetDicItemChargeList();
          break;
        case "Dic_combine_charge": //  组合包含收费字典列表
          this.combineChargeData = [];
          this.handleGetCombineCodeItems(); // 获取收费编码合集
          this.handleGetCombineChargeList();
          this.handGetCombinechargeFilter();
          break;
        case "Dic_combine_apply": // 组合对应申请字典
          this.combineApplyDataList = [];
          this.combineApplyData = [];
          this.chooseCombineApply = undefined;
          this.handleGetDicCombineApplyList();
          break;
        case "Dic_combine_his": // 组合his字典
          this.hisForm = [];
          this.handleGetDicCombineHisList();
          break;
        case "Dic_combine_group": // 组合分组字典
          this.combineGroupData = [];
          this.handleDicCombineGroupLoad();
          break;
        default:
          break;
      }
    },
    // 组合字典新增编辑页关闭
    handleCloseDicCombine() {
      this.showDicItemPage = "";
      this.currentPage = 1;
      this.dicCombineId = "";
      this.combineData = [];
      this.selectList = [];
      this.handleCheckNode();
    },
    // 组合字典获取列表回调
    handleGetDicCombineList() {
      this.loading = true;
      getDicCombineList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        this.count = res.count;
        this.combineData.push(...res.data);
        this.loading = false;
        this.sumData = res.count;
        this.department !== "" && (this.sumData = this.combineData.length);
      });
    },
    // 组合字典获取列表回调-申请单
    handleGetDicCombineApplyList() {
      this.loading = true;
      getDicCombineList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        this.count = res.count;
        this.combineApplyDataList.push(...res.data);
        this.loading = false;
        this.sumData = res.count;
        this.department !== "" &&
          (this.sumData = this.combineApplyDataList.length);
      });
    },

    // 筛选科室改变回调
    handleChangeDepart() {
      switch (this.pageFlag) {
        case "Dic_item": // 项目字典
          this.currentPage = 1;
          this.dicItemData = [];
          this.handleGetDicItemList();
          break;
        case "Dic_combine": // 组合字典
          this.currentPage = 1;
          this.combineData = [];
          this.handleGetDicCombineList();
          break;
        case "Dic_item_value": // 组合字典
          this.currentPage = 1;
          this.dicItemValueData = [];
          this.dicItemValueSon = [];
          this.chooseDicItemValue = undefined;
          this.handleGetDicItemValue();
          break;
        case "Dic_item_contrast": // 组合字典
          this.currentPage = 1;
          this.contrastData = [];
          this.contrastSon = [];
          this.chooseDicItemValue = undefined;
          this.handleGetDicItemValue();
          break;
        case "Dic_item_charge": // 收费明细字典
          this.currentPage = 1;
          this.dicItemChargeData = [];
          this.handleGetDicItemChargeList();
          break;
        case "Dic_combine_charge": //  组合包含收费字典列表
          this.currentPage = 1;
          this.combineChargeData = [];
          this.combineChargeSon = [];
          this.chooseCombineCharge = undefined;
          this.handleGetCombineChargeList();
          break;
        case "Dic_combine_apply": // 组合对应申请字典
          this.currentPage = 1;
          this.combineApplyDataList = [];
          this.combineApplyData = [];
          this.chooseCombineApply = undefined;
          this.handleGetDicCombineApplyList();
          break;
        case "Dic_combine_his": // 组合his字典
          this.currentPage = 1;
          this.hisForm = [];
          this.handleGetDicCombineHisList();
          break;
        default:
          break;
      }
    },
    // 筛选输入框回调
    handleSearchName() {
      switch (this.pageFlag) {
        case "Dic_item": // 项目字典
          this.currentPage = 1;
          this.dicItemData = [];
          this.handleGetDicItemList();
          break;
        case "Dic_combine": // 组合字典
          this.currentPage = 1;
          this.combineData = [];
          this.handleGetDicCombineList();
          break;
        case "Dic_item_value": // 项目常见结果字典
          this.currentPage = 1;
          this.dicItemValueData = [];
          this.dicItemValueSon = [];
          this.chooseDicItemValue = undefined;
          this.handleGetDicItemValue();
          break;
        case "Dic_item_contrast": // 项目对照字典
          this.currentPage = 1;
          this.contrastData = [];
          this.contrastSon = [];
          this.chooseDicItemValue = undefined;
          this.handleGetDicItemValue();
          break;
        case "Dic_item_charge": // 收费明细字典
          this.currentPage = 1;
          this.dicItemChargeData = [];
          this.handleGetDicItemChargeList();
          break;
        case "Dic_combine_charge": //  组合包含收费字典列表
          this.currentPage = 1;
          this.combineChargeData = [];
          this.combineChargeSon = [];
          this.chooseCombineCharge = undefined;
          this.handleGetCombineChargeList();
          break;
        case "Dic_combine_apply": // 组合对应申请字典
          this.currentPage = 1;
          this.combineApplyDataList = [];
          this.combineApplyData = [];
          this.chooseCombineApply = undefined;
          this.handleGetDicCombineApplyList();
          break;
        case "Dic_combine_his": // 组合his字典
          this.currentPage = 1;
          this.hisForm = [];
          this.handleGetDicCombineHisList();
          break;
        case "Dic_combine_group": // 组合分组字典
          this.combineGroupData = [];
          this.handleDicCombineGroupLoad();
          break;
        default:
          break;
      }
    },
    //  项目字典当前勾选数据回调
    handleDicItemCheck(val) {
      this.selectList = val;
      console.log(val);
    },
    // 获取项目字典列表数据回调
    handleGetDicItemList() {
      this.loading = true;
      getDicItemList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      })
        .then((res) => {
          this.count = res.count;
          this.dicItemData.push(...res.data);
          this.loading = false;
          this.sumData = res.count;
          this.department !== "" && (this.sumData = this.dicItemData.length);
        })
        .catch((err) => {
          this.currentPage = 1;
          this.count = 0;
          this.dicItemData = [];
          this.loading = false;
        });
    },
    //   获取项目常见结果字典表格数据回调
    handleGetDicItemValue() {
      this.loading = true;
      getDicItemList({
        page: this.currentPage,
        limit: this.pageSize,
        key: this.searchName,
        deptname: this.department,
      }).then((res) => {
        this.count = res.count;
        if (this.pageFlag == "Dic_item_value") {
          this.dicItemValueData.push(...res.data);
          this.sumData = res.count;
          this.department !== "" &&
            (this.sumData = this.dicItemValueData.length);
        } else {
          this.contrastData.push(...res.data);
          this.sumData = res.count;
          this.department !== "" && (this.sumData = this.contrastData.length);
        }
        this.loading = false;
      });
    },
    // 懒加载方法回调
    handleloadMore() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        switch (this.pageFlag) {
          case "Dic_item": // 项目字典
            if (this.dicItemData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicItemList();
            break;
          case "Dic_combine": // 组合字典
            if (this.combineData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicCombineList();
            break;
          case "Dic_item_value": // 项目常见结果字典
            if (this.dicItemValueData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicItemValue();
            break;
          case "Dic_item_contrast": // 项目对照结果字典
            if (this.contrastData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicItemValue();
            break;
          case "Dic_item_charge": // 收费明细字典
            if (this.dicItemChargeData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicItemChargeList();
            break;
          case "Dic_combine_charge": // 组合收费字典-组合字典数据
            if (this.combineChargeData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetCombineChargeList();
            break;
          case "Dic_combine_apply": // 组合收费字典-组合字典数据
            if (this.combineApplyData.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicCombineApplyList();
            break;
          case "Dic_combine_his": // 组合his字典数据
            if (this.hisForm.length >= this.count) return false;
            this.currentPage++;
            this.handleGetDicCombineHisList();
            break;
          case "Dic_combine_group": // 组合分组字典数据
            if (this.combineGroupData.length >= this.count) return false;
            this.currentPage++;
            this.handleDicCombineGroupLoad();
            break;
          default:
            break;
        }
      }, 400);
    },
    // 项目字典新增编辑页关闭
    handleCloseDicItem() {
      this.showDicItemPage = "";
      this.currentPage = 1;
      this.dicItemId = "";
      this.dicItemData = [];
      this.selectList = [];
      this.handleCheckNode();
    },
    // 项目字典编辑回调
    handleEditDicItem(item) {
      console.log(item);
      item && (this.selectList = [item]);
      if (this.selectList.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.showDicItemPage = "Dic_item";
        this.dicItemId = this.selectList[0].code;
      }
    },
    // 项目字典删除回调
    handleDelDicItem() {
      if (this.selectList.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = this.selectList.map((item) => {
            return item.code;
          });
          setDicItemDelete(codeItems).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.dicItemData = [];
            this.handleGetDicItemList();
          });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });

      // if (this.selectList.length == 0) {
      //   this.$message.warning("请勾选需删除的数据!");
      //   return false;
      // }
      // let codeItems = this.selectList.map((item) => {
      //   return item.code;
      // });
      // setDicItemDelete(codeItems).then((res) => {
      //   this.$message.success(res.message);
      //   this.currentPage = 1;
      //   this.dicItemData = [];
      //   this.handleGetDicItemList();
      // });
    },
    // 获取项目字典详情回调
    handleGetDicItemDetail() {
      getDicItemDetail({ code: "" }).then((res) => {
        this.deptItems = res.result.deptItems;
      });
    },
    // 组合字典编辑回调
    handleEditDicCombine(item) {
      item && (this.selectList = [item]);
      if (this.selectList.length !== 1) {
        this.$message.warning("请勾选1条数据进行编辑!");
        return false;
      } else {
        this.showDicItemPage = "Dic_combine";
        this.dicCombineId = this.selectList[0].code;
      }
    },
    // 组合字典删除回调
    handleDelDicCombine() {
      if (this.selectList.length == 0) {
        this.$message.warning("请勾选需删除的数据!");
        return false;
      }
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = this.selectList.map((item) => {
            return item.code;
          });
          setDicCombineDelete(codeItems).then((res) => {
            this.$message.success(res.message);
            this.currentPage = 1;
            this.combineData = [];
            this.handleGetDicCombineList();
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

    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      // console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          switch (this.pageFlag) {
            case "Dic_item": // 项目字典
              this.showDicItemPage = "Dic_item";
              break;
            case "Dic_combine": // 组合字典
              this.showDicItemPage = "Dic_combine";
              break;
            case "Dic_item_value": // 项目常见字典
              if (!this.chooseDicItemValue) {
                this.$message.warning("请选择项目添加对照结果!");
                return false;
              }
              this.showDicItemValue = true;
              break;
            case "Dic_item_contrast": // 项目对照结果字典
              if (!this.chooseDicItemValue) {
                this.$message.warning("请选择项目添加对照结果!");
                return false;
              }
              this.showContrast = true;
              break;
            case "Dic_item_charge": // 收费明细字典
              this.chargeFlag = "add";
              this.showCharge = true;
              break;
            case "Dic_combine_charge": // 组合包含收费字典
              if (!this.chooseCombineCharge) {
                this.$message.warning("请选择组合项目!");
                return false;
              }
              getDicCombineList({
                page: 1,
                limit: 1000000,
                key: "",
                deptname: "",
              }).then((res) => {
                this.combineItems = res.data.filter((k) => {
                  return this.combineChargeFilter.includes(k.deptcode);
                });
                // switch (this.Hospitals) {
                //   case "index":
                //     this.combineItems = res.data;
                //     break;
                //   case "index_gyey": // 广医二院
                //     this.combineItems = res.data.filter((k) => {
                //       return ["0", "51"].includes(k.deptcode);
                //     });
                //     break;
                //   default:
                //     this.combineItems = res.data.filter((k) => {
                //       return (
                //         k.deptname.includes("其它") ||
                //         k.deptname.includes("其他") ||
                //         (k.deptcode == 196 && k.deptname == "体检中心")
                //       );
                //     });
                //     break;
                // }
              });
              this.showCombineCharge = true;
              console.log("触发不?");
              break;
            case "Dic_combine_apply": // 组合对应申请字典
              if (!this.chooseCombineApply) {
                this.$message.warning("请选择组合项目!");
                return false;
              }
              this.showCombineAplly = true;
              break;
            case "Dic_combine_his": // 组合his字典
              console.log("Dic_combine_his  点击新增");
              this.showCombineHis = true;
              break;
            case "Dic_combine_group": // 组合his字典
              this.showCombineGroup = true;
              break;
            default:
              break;
          }
          break;
        case "btnEdit": // 编辑
          switch (this.pageFlag) {
            case "Dic_item": // 项目字典
              this.handleEditDicItem();
              break;
            case "Dic_combine": // 项目字典
              this.handleEditDicCombine();
              break;
            case "Dic_item_value": // 项目常见结果
              this.handleEditItemValueSon();
              break;
            case "Dic_item_contrast": // 项目对照结果
              this.handleEditContrastSon();
              break;
            case "Dic_item_charge": // 收费明细字典
              this.handleEditcharge();
              break;
            case "Dic_combine_charge": // 组合包含收费字典
              this.handleEditCombineCharge();
              break;
            case "Dic_combine_apply": // 组合对应申请单字典
              this.handleEditCombineApply();
              break;
            case "Dic_combine_his": // 组合his字典
              this.handleEditCombineHis();
              break;
            case "Dic_combine_group": // 组合分组字典
              this.handleEditCombineGroup();
              break;
            default:
              break;
          }
          break;
        case "btnDel": // 删除
          switch (this.pageFlag) {
            case "Dic_item": // 项目字典
              this.handleDelDicItem();
              break;
            case "Dic_combine": // 组合字典
              this.handleDelDicCombine();
              break;
            case "Dic_item_value": // 项目常见结果字典
              this.handleSetDeleteItemValue();
              break;
            case "Dic_item_contrast": // 项目对照结果字典
              this.handleSetDeleteItemValue();
              break;
            case "Dic_item_charge": // 收费明细字典
              this.handleDelcharge();
              break;
            case "Dic_combine_charge": // 组合包含收费字典
              this.handleDelCombineCharge();
              break;
            case "Dic_combine_apply": // 组合对应申请字典
              this.handleSetDicCombineApplyDelete();
              break;
            case "Dic_combine_his": // 组合his字典
              this.handleSetDicCombineHisDelete();
              break;
            case "Dic_combine_group": // 组合分组字典
              this.handleSetDicCombineGroupDelete();
              break;
            default:
              break;
          }
          break;
        case "btnRefresh": // 重置
          switch (this.pageFlag) {
            case "Dic_item": // 项目字典
              this.currentPage = 1;
              this.dicItemData = [];
              this.handleGetDicItemList();
              break;
            case "Dic_combine": // 组合字典
              this.currentPage = 1;
              this.combineData = [];
              this.handleGetDicCombineList();
              break;
            case "Dic_item_value": // 项目常见结果字典
              this.currentPage = 1;
              this.dicItemValueSon = [];
              this.handleGetDicItemChildDetail();
              break;
            case "Dic_item_contrast": // 项目对照结果字典
              this.currentPage = 1;
              this.contrastSon = [];
              this.handleGetDicItemChildDetail();
              break;
            case "Dic_item_charge": // 收费明细字典
              this.currentPage = 1;
              this.dicItemChargeData = [];
              this.handleGetDicItemChargeList();
              break;
            case "Dic_combine_charge": // 组合包含收费字典
              this.currentPage = 1;
              this.combineChargeSon = [];
              this.handleGetCombineChargeDetail();
              break;
            case "Dic_combine_apply": // 组合对应申请字典
              this.combineApplyDataList = [];
              this.combineApplyData = [];
              this.chooseCombineApply = undefined;
              this.handleGetDicCombineApplyList();
              break;
            case "Dic_combine_his": // 组合his字典
              this.currentPage = 1;
              this.hisForm = [];
              this.handleGetDicCombineHisList();
              break;
            case "Dic_combine_group": // 组合分组字典
              this.currentPage = 1;
              this.combineGroupData = [];
              this.handleDicCombineGroupLoad();
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
    handleTableRowClassNameRed({ row, rowIndex }) {
      console.log(rowIndex);
      console.log(row.status);
      return row.status == 1 ? "row-color" : "";
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
    localStorage.removeItem("currentNode");
    next();
  },
  watch: {},
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
/* 添加行颜色 */
</style>
<style lang='scss'>
.row-color {
  color: red !important; /* 更改字体颜色 */
}
.loadingmask {
  .el-loading-spinner {
    .el-icon-loading {
      font-size: 40px;
    }
    .el-loading-text {
      font-size: 22px;
      font-weight: 600;
    }
  }
}
</style>
