<template>
  <div class="add_edit">
    <el-card class="box-card message_box">
      <div class="head_box">
        <div class="head_box-title">
          <div style="
              width: 5px;
              background-color: #2a85ea;
              border-radius: 2px;
              height: 20px;
            "></div>
          <div style="
              font-size: 20px;
              font-weight: 600;
              margin: 10px 10px 10px 5px;
            ">
            单位信息
          </div>
        </div>
        <div class="btn_group" style="margin-right: 10px">
          <el-button plain type="primary" size="small" @click="handleSubmitDialog">保存</el-button>
          <el-button plain type="primary" size="small" icon="el-icon-close" @click="handleCloseDialog">关闭</el-button>
        </div>
      </div>
      <el-form :rules="mainruls" ref="form" class="page_form" :model="bodyForm" label-width="95px">
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" class="companyItem" label="单位名称" prop="companycode">
              <el-select style="width: 100%" :disabled="addOrEdit == 'edit'" v-model="bodyForm.companycode" clearable filterable remote reserve-keyword :remote-method="handleRemoteMethod" :loading="selectLoading" @change="handleSelectChange" @clear="handleRemoteMethod">
                <el-option v-for="(item, index) in companyitems" :key="index" :value="item.code" :label="`${item.code}　${item.name}`"></el-option>
              </el-select>
              <el-button v-if="addOrEdit == 'add'" size="mini" type="primary" @click="handleCreate">建档</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检批次">
              <el-input v-model="bodyForm.batch" disabled placeholder="自动生成"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检时间" prop="rangeTime">
              <el-date-picker v-model="rangeTime" style="width: 100%" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleChangeRangeTime">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检人数">
              <el-input v-model.number="bodyForm.total"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="6">
            <el-form-item size="small" label="预约时间" prop="registerdate">
              <el-date-picker v-model="bodyForm.registerdate" style="width:100%" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="联系人">
              <el-input v-model="bodyForm.contacts"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="联系电话">
              <el-input v-model="bodyForm.telephone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="邮箱">
              <el-input v-model="bodyForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检地点">
              <!-- <el-input v-model="bodyForm.address"></el-input> -->
              <el-select v-model="bodyForm.address" placeholder="请选择" style="width: 100%" :loading="centerLoading" clearable filterable remote reserve-keyword :remote-method="handleSelecetCenterDic" @clear="handleSelecetCenterDic">
                <el-option v-for="item in hospitalnameArr" :key="item.id" :label="item.name" :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="业务员">
              <el-select filterable @change="handleSelectChange" style="width: 100%" v-model="bodyForm.receptcode">
                <el-option v-for="(item, index) in receptitems" :key="index" :value="item.code" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="登记人">
              <el-select size="mini" @change="handleChangeRegister" v-model="bodyForm.registercode" clearable filterable placeholder="">
                <el-option v-for="item in operatorItems" size="mini" :key="item.id" :label="item.name" :value="item.account">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="合同编码">
              <el-input v-model="bodyForm.contractno"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="合同名称">
              <el-input v-model="bodyForm.contractname"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="备注">
              <el-input v-model="bodyForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="合同附件">
              <!-- annex -->
              <el-upload class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPpload" ref="upload" :file-list="fileList" :auto-upload="false" accept=".docx,.doc,.pdf">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="fileUrl != ''">
            <el-form-item size="small" label="文件预览">
              <!-- <a :href="fileUrl" target="_blank">{{ fileUrl }}</a> -->
              <el-link type="primary" class="filelink" target="_blank" :href="fileUrl">{{ fileName }}</el-link>
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="fileUrl != ''">
            <el-button type="primary" size="mini" icon="el-icon-delete" @click="handleDelFile"></el-button>
          </el-col>
          <el-col :span="4">
            <el-form-item size="small" label="">
              <el-button type="primary" size="mini" @click="handleShowAppointDate">预约日期</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!-- 体检进度 -->
    <el-card v-if="addOrEdit == 'edit'" class="schedule">
      <div class="head_box-titles">
        <div style="
            width: 5px;
            background-color: #2a85ea;
            border-radius: 2px;
            height: 20px;
          "></div>
        <div class="box-titles" style="font-size: 20px; font-weight: 600; margin: 10px 10px 10px 5px">
          体检进度
        </div>
        <div class="subscribe_group">
          <div class="sub_item">
            <span class="sub_title sub_success">预约</span>
            <span class="sub_value" style="
                color: #fc5531;
                border: 1px solid #fc5531;
                width: 50%;
                text-align: center;
              ">{{ bodyForm.registercount }}</span>
          </div>
          <div class="sub_item">
            <span class="sub_title sub_primary">未检</span>
            <span class="sub_value" style="
                color: #67c23a;
                border: 1px solid #67c23a;
                width: 50%;
                text-align: center;
              ">{{ bodyForm.notcheckcount }}</span>
          </div>
          <div class="sub_item">
            <span class="sub_title sub_warning">检中</span>
            <span class="sub_value" style="
                color: #409eff;
                border: 1px solid #409eff;
                width: 50%;
                text-align: center;
              ">{{ bodyForm.checkingcount }}</span>
          </div>
          <div class="sub_item">
            <span class="sub_title sub_ok">完成</span>
            <span class="sub_value" style="
                color: #e6a23c;
                border: 1px solid #e6a23c;
                width: 50%;
                text-align: center;
              ">{{ bodyForm.checkedcount }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <!-- 单位分组体检项目 -->
    <div class="bottom_group" :class="[addOrEdit == 'edit' ? 'edit_h' : 'add_h']">
      <!-- 单位分组 -->
      <el-card class="box-card clearance_right">
        <div class="head_box" style="margin-bottom: 10px">
          <div class="head_box-title">
            <div style="
                width: 5px;
                background-color: #2a85ea;
                border-radius: 2px;
                height: 20px;
              "></div>
            <div style="
                font-size: 20px;
                font-weight: 600;
                margin: 10px 10px 10px 5px;
              ">
              单位分组
            </div>
          </div>
          <div class="btn_group" style="margin-right: 10px">
            <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleAddUnitGroup">添加分组</el-button>
            <el-button type="primary" plain size="small" icon="el-icon-edit" @click="handleEditUnitGroup">修改分组</el-button>
            <el-button type="primary" plain size="small" icon="el-icon-delete" @click="handleDelUnitGroup">删除分组</el-button>
          </div>
        </div>
        <div class="unit_grouping">
          <div v-for="(item, index) in groupList" :key="index" class="unit_item" @click="handleChooseGroup(item)" :class="[
              {
                current_row:
                  chooseGroup && item.groupname == chooseGroup.groupname,
              },
            ]">
            <el-row>
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <span>分组名称：</span>
                  <span>{{ item.groupname }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple-light">
                  <span>性别：</span>
                  <span>{{
                    item.sex == 0 ? "未知" : item.sex == 1 ? "男" : "女"
                  }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div class="grid-content bg-purple">
                  <span>分组人数：</span>
                  <span>{{ item.grouptotal }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row class="clearance_top">
              <el-col :span="7">
                <div class="grid-content bg-purple">
                  <span>所属部门：</span>
                  <span>{{ item.department }}</span>
                </div>
              </el-col>
              <el-col :span="7">
                <div class="grid-content bg-purple-light">
                  <span>结算方式：</span>
                  <span>{{
                    item.settlementtype == 0 ? "单位结算" : "个人结算"
                  }}</span>
                </div>
              </el-col>
              <el-col :span="10">
                <div class="grid-content bg-purple-light">
                  <span>检查类型：</span>
                  <span>{{ registerCup(item.checktype) }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div v-if="groupList.length == 0" class="empty_group">暂无数据</div>
        </div>
      </el-card>
      <!-- 体检项目 -->
      <el-card class="box-card combineitems">
        <div class="head_box" style="height: 38px">
          <div class="tj_box">
            <div class="head_box-title" style="margin-left: 0px">
              <div style="
                  width: 5px;
                  background-color: #2a85ea;
                  border-radius: 2px;
                  height: 20px;
                "></div>
              <div style="
                  font-size: 20px;
                  font-weight: 600;
                  margin: 10px 10px 10px 5px;
                ">
                体检项目
              </div>
            </div>
          </div>
          <div class="price_box" v-if="chooseGroup">
            <span v-if="chooseGroup" style="margin-right: 10px">{{
              chooseGroup.groupname
            }}</span>
            <span v-else>暂无分组</span>
            <span v-if="chooseGroup && chooseGroup.combineitems" style="margin-right: 10px">含{{ chooseGroup.combineitems.length }}个项目</span>
            <span v-else>含0个项目</span>
            <span v-if="chooseGroup">金额{{ originalpriceCount }}元</span>
            <span v-else>金额0元</span>
          </div>
          <div class="btn_group" style="margin-right: 10px">
            <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleSetDiscount">折扣</el-button>
            <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleAddProject">添加项目</el-button>
          </div>
        </div>
        <el-table class="combineitems_table" v-if="chooseGroup && chooseGroup.combineitems" :data="chooseGroup.combineitems" ref="mainTable" height="calc(100% - 20px)" min-width="500" stripe fit highlight-current-row style="width: 100%" :row-style="{ height: '32px' }" :header-cell-style="{
            textAlign: 'center',
            background: '#b6cfee',
            fontWeight: 600,
            color: '#18253a',
            height: '40px',
          }" :cell-style="{ padding: '0px', textAlign: 'center' }">
          <el-table-column label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
              <i class="el-icon-delete delDelCom" @click="handleDelCom(scope.row)"></i>
            </template>
          </el-table-column>
          <el-table-column width="85" prop="combinecode" label="组合编码" show-overflow-tooltip></el-table-column>
          <el-table-column width="230" prop="combinename" label="组合名称" show-overflow-tooltip></el-table-column>
          <el-table-column label="价格" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.originalprice >= 0">{{
                scope.row.originalprice
              }}</span>
              <span v-else>{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="discount" label="折扣" show-overflow-tooltip>
            <template slot-scope="scope">
              <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" :disabled="scope.row.discountflag === 1" v-model.lazy="scope.row.discount" @focus="handleDiscountFocus" @keyup.enter="handleDiscountLower(scope.row, scope.$index)" @keyup.down="handleDiscountLower(scope.row, scope.$index)" @keyup.up="handleDiscountUpper(scope.row, scope.$index)" @change="handleChangeDiscount(scope.row)" />
            </template>
          </el-table-column>
          <el-table-column prop="discountprice" label="折后价" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.originalprice >= 0">{{handleRound(scope.row.originalprice * +scope.row.discount,2)}}</span>
              <span v-else>{{
                handleRound(scope.row.price * +scope.row.discount,2)
              }}</span>
              <!-- <span v-if="scope.row.originalprice >= 0">{{
                (scope.row.originalprice * +scope.row.discount).toFixed(2)
              }}</span>
              <span v-else>{{
                (scope.row.price * +scope.row.discount).toFixed(2)
              }}</span> -->
            </template>
          </el-table-column>
        </el-table>
        <div v-else class="empty_group">暂无数据</div>
      </el-card>
    </div>
    <!-- 单位分组 分组信息弹框 -->
    <el-dialog class="dialog-mini group_form" width="58%" top="10%" :close-on-click-modal="false" title="添加分组" :visible.sync="chiladddialogFormVisible" @open="handleOpenChiladd" @close="handleChilclose">
      <el-form ref="groupdataForm" :model="groupForm" :rules="groupRules" label-position="right" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组名称'" prop="groupname">
              <el-input ref="groupname" v-model="groupForm.groupname" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'优先级'" prop="Priority">
              <el-input clearable v-model="groupForm.priority"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item class="fromitem" size="small" :label="'年龄范围'" prop="Maxage">
              <el-input class="range_age" v-model="groupForm.minage"></el-input>
              <span class="range_line">-</span>
              <el-input class="range_age" v-model="groupForm.maxage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'性别'" prop="sex">
              <el-select v-model="groupForm.sex" clearable style="width: 100%">
                <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'婚否'" prop="Marriage">
              <el-select v-model="groupForm.marriage" clearable style="width: 100%">
                <el-option v-for="(item, index) in marriagearr" :key="index" :value="item.key" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组标识'">
              <el-input clearable v-model="groupForm.groupmark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组人数'">
              <el-input v-model.number="groupForm.grouptotal" clearable oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'所属部门'">
              <el-input clearable v-model="groupForm.department"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'费用小计'" prop="Originalprice">
              <el-input v-model="groupForm.originalprice" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'折扣'" prop="Discountprice">
              <el-input v-model="groupForm.discount" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'折后费用'" prop="Discountprice">
              <el-input v-model="groupForm.discountprice" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'增项折扣'" prop="Discountprice">
              <el-input v-model="groupForm.adddiscount" oninput="value=value.replace(/[^0-9.]/g,'')" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'结算方式'" prop="Settlementtype">
              <el-select v-model="groupForm.settlementtype" clearable style="width: 100%">
                <el-option v-for="(item, index) in settlementtypearr" :key="index" :value="item.key" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'增项结算方式'" prop="Addsettlementtype">
              <el-select v-model="groupForm.addsettlementtype" style="width: 100%" clearable>
                <el-option v-for="(item, index) in addsettlementtypearr" :key="index" :value="item.key" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'检查类型'" prop="checktype">
              <el-select v-model="groupForm.checktype" clearable style="width: 100%">
                <el-option v-for="(item, index) in registerGroup" :key="index" :value="item.code" :label="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item size="small" :label="'分组说明'" prop="Remark">
              <el-input v-model="groupForm.remark" style="width: 100%" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'标准金额'">
              <el-input v-model="groupForm.quota" style="width: 100%" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="handleChilclose">取消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmitAddGroup">确认</el-button>
      </div>
    </el-dialog>
    <!-- 折扣 -->
    <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="项目折扣" :visible.sync="showDiscount" @close="handleCloseDiscount">
      <div class="discount_box">
        <el-input size="mini" placeholder="请输入折扣" max="100" min="1" v-model="discountValue" clearable>
        </el-input>
        <!-- <div>%</div> -->
      </div>
      <span slot="footer" class="dialog-footer history_table_footer">
        <el-button size="mini" type="primary" @click="handleConfirmDiscount">确 认</el-button>
        <el-button size="mini" @click="handleCloseDiscount">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 建档新增弹框 -->
    <el-dialog :close-on-click-modal="false" class="dialog-mini" width="1000px" title="添加" :visible.sync="adddialogFormVisible" @close="addclose">
      <el-card class="box-card">
        <el-tag effect="dark"> 基本信息 </el-tag>
        <el-form :rules="rules" ref="dataForm" :model="addtemp" label-position="right" label-width="130px">
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'单位编码'" prop="id">
                <el-input v-model="addtemp.companycode" :disabled="true" placeholder="系统自动生成"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'单位名称'" prop="companyname">
                <el-input v-model="addtemp.companyname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'上级单位'" prop="companyhcode">
                <!-- <el-select v-model="addtemp.companyhcode" clearable>
                    <el-option v-for="(item, index) in companyitems" :key="index" :value="item.code" :label="item.name"></el-option>
                  </el-select> -->
                <el-select v-model="addtemp.companyhcode" clearable filterable remote reserve-keyword :remote-method="handleRemoteMethod" :loading="selectLoading" @clear="handleRemoteMethod">
                  <el-option v-for="item in companyitemsDia" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'单位简称'" prop="shortname">
                <el-input v-model="addtemp.shortname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'单位类型'">
                <el-select v-model="addtemp.typecode" clearable>
                  <el-option v-for="(item, index) in typeitemsDia" :key="index" :value="item.code" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'联系人'" prop="contacts">
                <el-input v-model="addtemp.contacts"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'联系电话'" prop="telephone">
                <el-input v-model="addtemp.telephone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'传真号码'" prop="faxnumber">
                <el-input v-model="addtemp.faxnumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'邮箱'" prop="email">
                <el-input v-model="addtemp.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'地址'" prop="address">
                <el-input v-model="addtemp.address"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'邮编'" prop="postalcode">
                <el-input v-model="addtemp.postalcode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'注册名称'" prop="registername">
                <el-input v-model="addtemp.registername"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'税号'" prop="taxnumber">
                <el-input v-model="addtemp.taxnumber"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'法人代表'" prop="legalperson">
                <el-input v-model="addtemp.legalperson"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'企业电话'" prop="companytel">
                <el-input v-model="addtemp.companytel"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'开户银行'" prop="openingbank">
                <el-select v-model="addtemp.openingbank" clearable>
                  <el-option v-for="(item, index) in bankitemsDia" :key="index" :value="item.code" :label="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'银行账号'" prop="bankaccount">
                <el-input v-model="addtemp.bankaccount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item size="mini" :label="'备注'" prop="remark">
                <el-input v-model="addtemp.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item size="mini" :label="'排序'" prop="seqno">
                <el-input v-model="addtemp.seqno"></el-input>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item size="mini" :label="'门诊卡号'">
                <el-input v-model="temp.healthcard" disabled></el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <!-- 表单对象 -->
        <el-tag effect="dark" v-if="previewModelBase"> 其他信息 </el-tag>
        <CreatedForm :insite="true" :isArchives="isArchives" v-if="previewModelBase" :data="contentData" ref="contentDataObj" />
      </el-card>
      <br />
      <div slot="footer">
        <el-button size="mini" @click="adddialogFormVisible = false">取消</el-button>
        <el-button size="mini" type="primary" @click="createData">确认</el-button>
      </div>
    </el-dialog>
    <!-- 预约日期 -->
    <el-dialog title="单位预约" :visible.sync="showAppoint" class="appointdate_dia" width="30%" :show-close="false" :close-on-click-modal="false">
      <div class="appointdate_content">
        <el-button type="primary" style="margin-bottom: 10px" size="mini" icon="el-icon-plus" @click="handleAddAppointDate"></el-button>
        <div class="appdatec_table">
          <EasyTable class="cftable_item" height="100%" :data="appdateList" :tableOptions="appdateListOptions" :checkbox-config="{ rowClick: true, fetchVal: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showAppoint = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!-- 体检项目 -->
    <!-- <SetMealDialog v-if="showProjectDialog" :groupTableData="groupTableData" @submit="handleSubmitMedicalItems" @close="showProjectDialog = false" /> -->
    <SetMealDialog v-if="showProjectDialog" :sex="chooseGroup.sex" :groupTableData="chooseGroup.combineitems" @submit="handleSubmitMedicalItems" @close="showProjectDialog = false" />
  </div>
</template>
<script>
import {
  getSetMeal,
  getCompanyDetail,
  getCompanyAdd,
  setFilesUpload,
  getRegisterGroup,
  setGroupUpdate,
  getCenterDic,
  setFilesDelete,
} from "@/api/company_register.js";
import { getAllUser } from "@/api/customermanage.js";
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
import SetMealDialog from "@/components/SetMealDialog/index_qyzyy.vue"; // 新项目弹框
import * as company_archives from "@/api/company_archives";
import CreatedForm from "@/components/Formcreated/components/CreatedForm";
import * as users from "@/api/users";

export default {
  name: "",
  props: {
    addOrEdit: {
      required: true,
      type: String,
    },
    editObj: {},
  },
  components: { SetMealDialog, CreatedForm },

  computed: {
    originalpriceCount() {
      let price = 0;
      this.chooseGroup.combineitems.forEach((k) => {
        if (k.hasOwnProperty("originalprice")) {
          price += +k.originalprice * +k.discount;
        } else {
          price += +k.price * +k.discount;
        }
        // price += +k.originalprice || +k.price;
      });
      this.chooseGroup.originalprice = price.toFixed(2);
      return price.toFixed(2);
    },
    // 处理检查类型配置
    registerCup() {
      return (code) => {
        let res = this.registerGroup.filter((k) => k.code == code)[0];
        return res && res.name;
      };
    },
    appdateListOptions() {
      return [
        {
          title: "预约日期",
          omit: 1,
          render: (h, data) => {
            return (
              <el-date-picker
                v-model={data.date}
                type="date"
                size="mini"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            );
          },
        },
        {
          title: "预约人数",
          omit: 1,
          width: 110,
          render: (h, data) => {
            return (
              <el-input size="mini" v-model={data.count} clearable></el-input>
            );
          },
        },
        {
          title: "操作",
          omit: 1,
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                size="mini"
                vOn:click_stop_prevent={() => {
                  this.handleDelAppointDate(data);
                }}
              >
                删 除
              </el-link>
            );
          },
        },
      ];
    },
    // 主体套餐表格配置
    tableOptions() {
      return [
        {
          title: "选择",
          type: "radio",
          width: 45,
        },
        {
          title: "名称",
          prop: "setmealname",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 85,
        },
      ];
    },
    // 循环副套餐表格配置
    tableOptionsFor() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "名称",
          prop: "combinename",
          omit: 1, // 等价于 show-overflow-tooltip
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 85,
        },
      ];
    },
  },

  data() {
    let validateDate = (rule, value, callback) => {
      if (this.rangeTime.length == 0) {
        callback(new Error("请填写体检时间"));
      } else {
        callback();
      }
    };
    let checkGrouptotal = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("体检人数不能为0!"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          if (value <= 0) {
            callback(new Error("体检人数不能为0!"));
          } else {
            callback();
          }
        }
      }, 100);
    };
    return {
      showAppoint: false,
      appdateList: [],
      discountProperty: [],
      operatorItems: [],
      centerLoading: false,
      selectLoading: false,
      saveradio: "1",
      regid: "", // 编辑查询对象id
      fileList: [], // bodyForm.annex
      mainitem: "", // 登记信息
      companyitems: [], // 公司合集
      receptitems: [], // 接待人合集
      rangeTime: [], // 体检时间
      registername: "", // 登记人
      combosum: "", //套餐总数
      bodyForm: {
        regid: "",
        companycode: "",
        companyname: "",
        startdate: "",
        enddate: "",
        total: 0,
        contacts: "",
        telephone: "",
        registerdate: "",
        faxnumber: "",
        email: "",
        address: "",
        contractno: "",
        contractname: "",
        receptcode: "",
        receptionname: "",
        remark: "",
        fileid: "",
        registercode: "",
        registername: "",
      }, // 主体表单数据
      listLoading: true,
      groupForm: {
        groupid: "",
        regid: "",
        groupname: "",
        priority: 0,
        sex: 0,
        minage: 0,
        maxage: 0,
        marriage: "",
        groupmark: "",
        grouptotal: 0,
        department: "",
        setmealcode: "",
        setmealname: "",
        originalprice: 0,
        discount: 0,
        discountprice: 0,
        settlementtype: 0,
        addsettlementtype: 0,
        adddiscount: 0,
        quota: 0,
        remark: "",
        checktype: "",
        combineitems: [],
      }, // 添加单位分组表单对象
      showDiscount: false,
      discountValue: 0,
      groupList: [], // 单位分组数据list
      chooseGroup: undefined, // 当前选择分组
      id: 0, //新增数据id
      registerGroup: [],
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ], // 性别选择
      marriagearr: [
        { key: "未知", name: "未知" },
        { key: "未婚", name: "未婚" },
        { key: "已婚", name: "已婚" },
        { key: "离异", name: "离异" },
        { key: "全部", name: "全部" },
      ], // 婚姻状态
      settlementtypearr: [
        { key: 0, name: "单位结算" },
        { key: 1, name: "个人结算" },
      ],
      addsettlementtypearr: [
        { key: 0, name: "单位结算" },
        { key: 1, name: "个人结算" },
        { key: 2, name: "其他" },
      ],
      mainruls: {
        companycode: [
          { required: true, message: "请选择单位", trigger: "blur" },
        ],
        total: [{ required: true, message: "体检人数必填", trigger: "blur" }],
        registerdate: [
          { required: true, message: "请填写预约时间", trigger: "blur" },
        ],
        rangeTime: [
          { required: true, validator: validateDate, trigger: "change" },
        ],
        contacts: [
          { required: true, message: "请填写单位联系人", trigger: "blur" },
        ],
      },
      groupRules: {
        groupname: [
          { required: true, message: "请填写分组名称", trigger: "blur" },
        ],
        groupmark: [
          { required: true, message: "请填写分组标识", trigger: "blur" },
        ],
        checktype: [
          { required: true, message: "请填写检查类型", trigger: "change" },
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
        grouptotal: [
          { required: true, validator: checkGrouptotal, trigger: "blur" },
        ],
        department: [
          { required: true, message: "请填写所属部门", trigger: "blur" },
        ],
      }, // 添加分组验证规则
      chiladddialogFormVisible: false, // 控制显示单位分组弹框
      showProjectDialog: false, // 控制显示体检项目弹框
      setmealitems: [], // 套餐合计数组
      setmealitems1: [],
      setmealitems2: [],
      setmealitems3: [],
      isPageStatus: "add",
      combineitems: [], // 预约编码合集
      combineone: [], // 预约编码合集套餐渲染数据1
      combinetwo: [], // 预约编码合集套餐渲染数据2
      combinethree: [], // 预约编码合集套餐渲染数据3
      setmealRadio: "", // 套餐单选选择对象
      totalPrice: 0, // 勾选套餐总金额
      multipleSelection: [],
      chooseone: [], // 预约编码合集选中数据1
      choosetwo: [], // 预约编码合集选中数据2
      choosethree: [], // 预约编码合集选中数据3
      listLoading: true, // 控制表格加载效果
      fileUrl: "", //文件预览路径
      fileName: "", //文件预览路径
      saveTemplate: false, // 保存模板
      hospitalnameArr: [], // 体检地点数据
      previewVisible: false,
      dialogStatus: "",
      adddialogFormVisible: false,
      formitem: {}, // 自定义表单对象
      contentData: {}, // 自定义表单对象
      formcontroldata: {}, // 单位建档
      previewModelBase: false,
      formid: "",
      addtemp: {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        telephone: "",
        faxnumber: "",
        email: "",
        address: "",
        postalcode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        openingbank: "",
        bankaccount: "",
        remark: "",
        seqno: 0,
      },
      companyitemsDia: [],
      typeitemsDia: [],
      bankitemsDia: [],
      rules: {
        companyname: [
          {
            required: true,
            message: "单位名称不能为空",
            trigger: "blur",
          },
        ],
        typecode: [
          {
            required: true,
            message: "单位类型不能为空",
            trigger: "blur",
          },
        ],
        seqno: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
      },
      isArchives: true, // 单位建档
    };
  },

  mounted() {
    if (this.addOrEdit == "edit") {
      this.regid = this.editObj.regid;
      this.handleEditCompanyDetail();
    } else {
      let time = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.rangeTime = [time, time];
    }
    getAllUser().then((res) => {
      this.operatorItems = res.data;
    });
    //   页面加载获取单位预约 新增/详情数据
    this.handleGetCompanyDetail();
    this.handleGetRegisterGroup();
    this.handleGetCenterDic();
    this.handleGetUserPropertyValues();
  },

  methods: {
    handleRound(value, decimals) {
      const factor = 10 ** decimals;
      return Math.round(Math.sign(value) * Math.abs(value) * factor) / factor;
    },
    handleDelAppointDate(data) {
      let index = this.appdateList.findIndex((k) => k.flag === data.flag);
      index > -1 && this.appdateList.splice(index, 1);
    },
    handleAddAppointDate() {
      this.appdateList.push({
        date: "",
        count: "",
        flag: new Date().getTime(),
      });
    },
    handleShowAppointDate() {
      this.showAppoint = true;
    },
    handleChangeRegister(value) {
      if (!value) {
        this.bodyForm.registername = "";
      } else {
        let flag = this.operatorItems.filter((k) => {
          return value == k.account;
        })[0];
        flag && (this.bodyForm.registername = flag.name);
      }
    },
    handleGetUserPropertyValues() {
      let id = JSON.parse(localStorage.getItem("userId"));
      let ct = "DiscountProperty";
      users.getUserProperty({ id, ct }).then((res) => {
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue.split("-"));
      });
    },
    createData() {
      this.addtemp.formid = this.formid;
      // 保存提交
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          // if (
          //   this.formid != "" &&
          //   this.formid != undefined &&
          //   this.formid != null
          // ) {
          //   this.$refs.generateForm
          //     .getData()
          //     .then((data) => {
          //       this.addtemp.jsondata = JSON.stringify(data, null, "\t");
          //     })
          //     .catch(() => {
          //       this.$refs.formPreview.end();
          //     });
          // }
          // this.$refs.contentDataObj
          //   .getData()
          //   .then((data) => {
          //     this.addtemp.formid = this.formid;
          //     this.addtemp.formcontroldata = JSON.stringify(data, null, "\t");
          //   })
          //   .catch(() => {
          //     this.$refs.formPreview.end();
          //   });
          company_archives.addCompany(this.addtemp).then((data) => {
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
            });
            this.$nextTick(() => {
              this.$refs["dataForm"].clearValidate();
            });
            this.addresetTemp();
            // this.getList();
            this.adddialogFormVisible = false;
            // 选中当前建档单位
            // res.result
            getCompanyDetail().then((result) => {
              this.companyitems = result.result.mainitem.companyitems;
              this.bodyForm.companycode = data.result;
            });
          });
        }
      });
    },
    addclose() {
      this.addresetTemp();
    },
    addresetTemp() {
      this.addtemp = {
        companycode: "",
        companyname: "",
        companyhcode: "",
        shortname: "",
        typecode: "",
        contacts: "",
        Telephone: "",
        Faxnumber: "",
        email: "",
        address: "",
        postalCode: "",
        registername: "",
        taxnumber: "",
        legalperson: "",
        companytel: "",
        OpeningBank: "",
        bankaccount: "",
        remark: "",
        pycode: "",
        wbcode: "",
        seqno: 0,
        delflag: 0,
        TableName: "Company_archives",
        jsondata: "",
        formid: "",
      };
    },
    handleCreate() {
      // 弹出添加框
      this.previewVisible = true;
      this.dialogStatus = "create";
      this.adddialogFormVisible = true;
      this.handleGetDetailList();
      // this.createdFormData = JSON.parse(this.list.form.contentData);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    // 获取详情下拉框数据
    handleGetDetailList(code) {
      company_archives.getDetailList({ code }).then((res) => {
        let {
          companyitems,
          typeitems,
          bankitems,
          formitem,
          formid,
          formcontroldata,
        } = res.result;
        this.companyitemsDia = companyitems;
        this.typeitemsDia = typeitems;
        this.bankitemsDia = bankitems;
        this.formitem = formitem;
        this.formid = formid;
        // this.contentData = JSON.parse(formitem.contentData);
        // if (formcontroldata) {
        //   this.formcontroldata = JSON.parse(formcontroldata);
        // } else {
        //   this.formcontroldata = {};
        // }
        // this.contentData && (this.previewModelBase = true);
      });
    },
    // ---------------------------------------------------------------------------
    handleDelFile() {
      setFilesDelete([this.bodyForm.fileid]).then((res) => {
        this.$message.success(res.message);
        this.fileUrl = "";
        this.fileName = "";
        this.bodyForm.fileid = "";
      });
    },
    // 设置项目折扣弹框回调
    handleSetDiscount() {
      if (!this.chooseGroup) {
        this.$message.warning("请先选择分组!");
        return false;
      }
      if (this.chooseGroup.combineitems.length == 0) {
        this.$message.warning("请先添加体检项目!");
        return false;
      }
      this.discountValue = 1;
      // this.discountValue = this.groupTableData[0].discount * 100;
      this.showDiscount = true;
    },
    // 打折弹框确认回调
    handleConfirmDiscount() {
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        this.discountValue = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+this.discountValue < min || +this.discountValue > max) {
          this.$message.warning("超出当前用户打折范围!");
          this.discountValue = 1;
          return false;
        }
      }
      this.chooseGroup.combineitems.forEach((k) => {
        if (k.discountflag === 0) {
          k.discount = +this.discountValue;
          k.price && (k.discountprice = +k.discount * k.price);
          k.originalprice && (k.discountprice = +k.discount * k.originalprice);
        }
      });
      this.$message.success("操作成功!");
      this.handleCloseDiscount();
    },
    // 折扣弹框关闭回调
    handleCloseDiscount() {
      this.showDiscount = false;
    },
    handleDiscountKeyup(data, index) {},
    // 单项打折键盘↓键回调
    handleDiscountLower(data, index) {
      this.$nextTick(() => {
        if (index === this.chooseGroup.combineitems.length - 1) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_${index + add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = 0; i < this.chooseGroup.combineitems.length; i++) {
            pDom = document.querySelector(`.discount_${index + add}`);
            if ($(pDom).is(":disabled")) {
              ++add;
              continue;
            } else {
              if (!pDom) return;
              pDom.focus();
              break;
            }
          }
        } else {
          pDom.focus();
        }
      });
    },
    // 单项打折键盘↑键回调
    handleDiscountUpper(data, index) {
      this.$nextTick(() => {
        if (index === 0) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_${index - add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = add; i < this.chooseGroup.combineitems.length; i++) {
            pDom = document.querySelector(`.discount_${index - add}`);
            if ($(pDom).is(":disabled")) {
              ++add;
              continue;
            } else {
              if (!pDom) return;
              pDom.focus();
              break;
            }
          }
        } else {
          pDom.focus();
        }
      });
    },
    handleDiscountInput() {},
    handleDiscountFocus(e) {
      if (!e) return;
      e.currentTarget && e.currentTarget.select();
    },
    handleDelCom(item) {
      if (!item) return;
      let index = this.chooseGroup.combineitems.findIndex(
        (k) => k.combinecode === item.combinecode
      );
      if (index != -1) {
        this.chooseGroup.combineitems.splice(index, 1);
      }
    },
    handleRemoteMethod(val) {
      this.selectLoading = true;
      setTimeout(() => {
        this.selectLoading = false;
        company_archives
          .getList({
            page: 1,
            limit: 100000,
            key: val,
          })
          .then((res) => {
            this.companyitems = res.data.map((k) => {
              return {
                ...k,
                code: k.companycode,
                name: k.companyname,
              };
            });
          });
      }, 200);
    },
    handleChangeDiscount(row) {
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        row.discount = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+row.discount < min || +row.discount > max) {
          this.$message.warning("超出当前用户打折范围!");
          row.discount = 1;
          return false;
        }
      }
      row.discountprice = +row.price * +row.discount;
    },
    handleSelecetCenterDic(val) {
      this.centerLoading = true;
      setTimeout(() => {
        this.centerLoading = false;
        getCenterDic({
          page: 1,
          limit: 1000,
          key: val,
          tableName: "Dic_Medical_center",
        }).then((res) => {
          this.hospitalnameArr = res.data;
        });
      }, 200);
    },
    handleChangeRangeTime(value) {
      if (!value) {
        this.rangeTime = [];
      }
    },
    // 体检地点列表
    handleGetCenterDic() {
      let data = {
        page: 1,
        limit: 1000,
        key: "",
        tableName: "Dic_Medical_center",
      };
      getCenterDic(data).then((res) => {
        this.hospitalnameArr = res.data;
      });
    },
    handleSelectChange() {
      this.$forceUpdate();
    },
    // 上传触发回调
    handleOnPpload(params, index, key) {
      const fileSuffix = params.name.substring(
        params.name.lastIndexOf(".") + 1
      );
      const whiteList = ["pdf", "doc", "docx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传图片只能是 .docx,.doc,.pdf 格式!");
        return false;
      }
      let data = new FormData();
      data.append("files", params.raw);
      //   return;
      setFilesUpload(data).then((res) => {
        this.$message.success("合同附件上传成功!");
        this.bodyForm.fileid = res.result[0].id;
        this.fileUrl = res.result[0].fileUrl;
        this.fileName = res.result[0].fileName;
      });
    },
    // 获取单位预约 详情数据回调
    handleEditCompanyDetail() {
      getCompanyDetail({ regid: this.regid }).then((res) => {
        let data = res.result;
        this.bodyForm = data.mainitem;
        let select = data.mainitem.companyitems.filter((k) => k.selected)[0];
        let recept = data.mainitem.receptitems.filter((k) => k.selected)[0];
        recept
          ? (this.bodyForm.receptcode = recept.code)
          : (this.bodyForm.receptcode = ""),
          (this.bodyForm.companycode = select.code);
        this.bodyForm.companyname = select.name;
        this.rangeTime = [data.mainitem.startdate, data.mainitem.enddate];
        this.groupList = data.groupitems;
        this.chooseGroup = this.groupList[0];
        this.bodyForm.fileid && this.handleGetFiles();
      });
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.bodyForm.fileid }).then((res) => {
        this.fileUrl = res.result.fileUrl;
        this.fileName = res.result.fileName;
      });
    },
    //   获取单位预约 新增/详情数据回调
    handleGetCompanyDetail() {
      getCompanyDetail().then((res) => {
        this.companyitems = res.result.mainitem.companyitems;
        this.receptitems = res.result.mainitem.receptitems;
        this.registername = res.result.mainitem.registername;
      });
    },
    // 单位预约检查类型回调
    handleGetRegisterGroup() {
      getRegisterGroup({ cc: "CheckType" }).then((res) => {
        let select = res.result.findIndex((k) => k.selected);
        select > -1
          ? (this.groupForm.checktype = res.result[select].code)
          : (this.groupForm.checktype = ""),
          (this.registerGroup = res.result);
      });
    },
    // 点击提交保存当前页面回调
    handleSubmitDialog() {
      // 分组不能为空
      if (this.groupList.length == 0) {
        this.$message.error("请先添加分组");
        return false;
      }
      // 处理开始结束时间和公司名称
      if (this.bodyForm.companycode) {
        this.bodyForm.companyname = this.companyitems.filter((k) => {
          return k.code == this.bodyForm.companycode;
        })[0].name;
      }
      if (this.rangeTime) {
        this.bodyForm.startdate = this.rangeTime[0];
        this.bodyForm.enddate = this.rangeTime[1];
      }
      if (this.bodyForm.receptcode) {
        this.bodyForm.receptionname = this.receptitems.filter(
          (k) => k.code == this.bodyForm.receptcode
        )[0].name;
      }

      if (this.addOrEdit == "edit") {
        setGroupUpdate({
          mainitem: this.bodyForm,
          groupitems: this.groupList,
        }).then((res) => {
          this.$message.success("更新成功!");
          this.$emit("submit", false);
        });
      } else {
        getCompanyAdd({
          mainitem: this.bodyForm,
          groupitems: this.groupList,
        }).then((res) => {
          this.$message.success("保存成功!");
          this.$emit("submit", false);
        });
      }
    },
    // 点击关闭当前页面回调
    handleCloseDialog() {
      this.$emit("close", false);
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems(data) {
      this.chooseGroup.combineitems = data;
      this.chooseGroup.originalprice = 0;
      data.forEach((k) => {
        this.chooseGroup.originalprice += k.price;
        // if (k.hasOwnProperty("originalprice")) {
        //   this.chooseGroup.originalprice += +k.originalprice * +k.discount;
        // } else {
        //   this.chooseGroup.originalprice += +k.price * +k.discount;
        // }
      });
      this.showProjectDialog = false; // 打开弹框
    },
    // 点击关闭套餐项目弹框按钮回调
    handleCloseMedicalItems() {
      this.setmealRadio = "";
      this.totalPrice = 0;
      //   this.combineone = [];
      //   this.combinetwo = [];
      //   this.combinethree = [];
      this.showProjectDialog = false; // 打开弹框
    },
    // 复选框回调one
    handleSelectionChangeOne(val) {
      this.chooseone = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调Two
    handleSelectionChangeTwo(val) {
      this.choosetwo = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调Three
    handleSelectionChangeThree(val) {
      this.choosethree = val;
      this.handleGetTotalPrice();
    },
    // 复选框回调
    handleSelectionChange(val) {
      this.totalPrice = 0;
      val.forEach((item) => {
        this.totalPrice += item.price;
      });
      this.multipleSelection = val;
    },
    // 点击体检项目-添加项目回调
    handleAddProject() {
      if (!this.chooseGroup) {
        this.$message.error("请先勾选至少一个分组!");
        return false;
      }
      this.showProjectDialog = true; // 打开弹框
    },
    // 点击选择当前选中分组
    handleChooseGroup(item) {
      this.chooseGroup = item;
      // this.chooseGroup = Object.assign({}, item);
    },
    // 点击添加分组回调
    handleAddUnitGroup() {
      this.handleGetRegisterGroup();
      this.isPageStatus = "add";
      this.chiladddialogFormVisible = true;
    },
    handleOpenChiladd() {
      this.$nextTick(() => {
        this.$refs.groupname.focus();
      });
    },
    // 点击编辑分组回调
    handleEditUnitGroup() {
      this.isPageStatus = "edit";
      if (this.chooseGroup) {
        this.chiladddialogFormVisible = true;
        let editIndex = this.groupList.findIndex(
          (item) => this.chooseGroup.groupname == item.groupname
        );
        this.groupForm = Object.assign({}, this.groupList[editIndex]);
      } else {
        this.$message.error("请先选中所需编辑数据!");
      }
    },
    // 点击删除分组回调
    handleDelUnitGroup() {
      if (this.chooseGroup) {
        let delIndex = this.groupList.findIndex(
          (item) => this.chooseGroup.groupname == item.groupname
        );
        this.groupList.splice(delIndex, 1);
        this.chooseGroup = undefined;
        this.$message.success("删除成功!");
      } else {
        this.$message.error("请先选中所需删除数据!");
      }
    },
    // 添加分组弹框关闭回调
    handleChilclose() {
      //   清空校验规则
      this.$refs.groupdataForm.clearValidate();
      this.handleResetGroupForm();
      this.chiladddialogFormVisible = false;
    },
    // 点击新增分组提交回调 groupdataForm
    handleSubmitAddGroup() {
      if (this.addOrEdit == "edit") {
        this.$refs.groupdataForm.validate((valid) => {
          if (valid) {
            // return;
            // 已经有数据了
            if (this.isPageStatus == "edit") {
              let tempArr = JSON.parse(JSON.stringify(this.groupList));
              let index = tempArr.findIndex((k) => {
                return this.chooseGroup.groupname == k.groupname;
              });
              index > -1 && tempArr.splice(index, 1);
              let totalP = 0;
              tempArr.forEach((k) => {
                totalP += k.grouptotal;
              });
              // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
              //   this.$message.warning("分组人数超过单位总体检人数!");
              //   return false;
              // }
              // let findArr = tempArr.map((k) => {
              //   return k.groupname;
              // });
              // if (findArr.includes(this.groupForm.groupname)) {
              //   this.$message.warning("分组名称不能重复!");
              //   return false;
              // }
              // 编辑
              let editIndex = this.groupList.findIndex(
                (item) => this.groupForm.groupid == item.groupid
              );
              this.groupList.splice(editIndex, 1, this.groupForm);
            } else {
              let totalP = 0;
              this.groupList.forEach((k) => {
                totalP += k.grouptotal;
              });
              // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
              //   this.$message.warning("分组人数超过单位总体检人数!");
              //   return false;
              // }
              let flag = this.groupList.findIndex((k) => {
                return this.groupForm.groupname == k.groupname;
              });

              if (flag > -1) {
                this.$message.warning("分组名称不能重复!");
                return false;
              } else {
              }
              // 新增
              this.groupList.push(this.groupForm);
              // groupid: this.groupList[this.groupList.length - 1].groupid + 1,
            }
            this.handleResetGroupForm();
            this.chiladddialogFormVisible = false;
          } else {
            return false;
          }
        });
      } else {
        this.$refs.groupdataForm.validate((valid) => {
          if (valid) {
            if (this.groupList.length == 0) {
              let totalP = 0;
              this.groupList.forEach((k) => {
                totalP += k.grouptotal;
              });
              // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
              //   this.$message.warning("分组人数超过单位总体检人数!");
              //   return false;
              // }
              // 第一次添加数据
              this.groupList.push({ ...this.groupForm, id: this.id + 1 });
            } else {
              // 已经有数据了
              if (this.groupForm.id) {
                let tempArr = JSON.parse(JSON.stringify(this.groupList));
                let index = tempArr.findIndex((k) => {
                  return this.chooseGroup.groupname == k.groupname;
                });
                index > -1 && tempArr.splice(index, 1);
                let totalP = 0;
                tempArr.forEach((k) => {
                  totalP += k.grouptotal;
                });
                // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                //   this.$message.warning("分组人数超过单位总体检人数!");
                //   return false;
                // }
                let findArr = tempArr.map((k) => {
                  return k.groupname;
                });
                if (findArr.includes(this.groupForm.groupname)) {
                  this.$message.warning("分组名称不能重复!");
                  return false;
                }
                // 编辑
                let editIndex = this.groupList.findIndex(
                  (item) => this.groupForm.groupname == item.groupname
                );
                this.groupList.splice(editIndex, 1, this.groupForm);
              } else {
                let totalP = 0;
                this.groupList.forEach((k) => {
                  totalP += k.grouptotal;
                });
                // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
                //   this.$message.warning("分组人数超过单位总体检人数!");
                //   return false;
                // }
                let flag = this.groupList.findIndex((k) => {
                  return this.groupForm.groupname == k.groupname;
                });
                if (flag > -1) {
                  this.$message.warning("分组名称不能重复!");
                  return false;
                }
                // 新增
                this.groupList.push({
                  ...this.groupForm,
                  // id: this.groupList[this.groupList.length - 1].id + 1,
                });
              }
            }
            this.handleResetGroupForm();
            this.chiladddialogFormVisible = false;
          } else {
            return false;
          }
        });
      }
      // this.handleResetGroupForm();
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
    // 重置添加分组绑定数据
    handleResetGroupForm() {
      this.groupForm = {
        groupid: "",
        regid: "",
        groupname: "",
        priority: 0,
        sex: 0,
        minage: 0,
        maxage: 0,
        marriage: "",
        groupmark: "",
        grouptotal: 0,
        department: "",
        setmealcode: "",
        setmealname: "",
        originalprice: 0,
        discount: 0,
        quota: 0,
        discountprice: 0,
        settlementtype: 0,
        addsettlementtype: 0,
        adddiscount: 0,
        remark: "",
        checktype: "",
        combineitems: [],
      };
      this.chooseGroup = undefined;
    },
    // 单选
    handleChecked(rows) {},
    // 多选
    handleSelected(rows) {},
  },

  watch: {
    "groupForm.discount": {
      handler() {
        this.groupForm.discountprice =
          +this.groupForm.originalprice * +this.groupForm.discount;
      },
      deep: true,
    },
    groupList: {
      handler() {
        if (this.groupList.length == 0) return;
        this.bodyForm.total = 0;
        this.groupList.forEach((k) => {
          this.bodyForm.total += +k.grouptotal;
        });
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/AddOrEdit.scss";
.appointdate_dia {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 10px;
    .appointdate_content {
      .appdatec_table {
        height: 250px;
        .cftable_item {
          height: 100%;
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
</style>
