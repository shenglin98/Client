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
          <el-button plain type="primary" size="small" @click="handleSameGroupCombinePrice">同步价格</el-button>
          <el-button plain type="primary" size="small" @click="handleClickPrint">打 印</el-button>
          <el-button plain type="primary" size="small" @click="handleClickExport">导 出</el-button>
          <el-button plain type="primary" size="small" @click="handleSubmitDialog">保 存</el-button>
          <el-button plain type="primary" size="small" icon="el-icon-close" @click="handleCloseDialog">关 闭</el-button>
        </div>
      </div>
      <el-form :rules="mainruls" ref="page_form" class="page_form" :model="bodyForm" label-width="90px">
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
              <div class="date_box">
                <el-date-picker v-model="rangeTime" style="width: 100%" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @focus="handleFocusRangeTime" @change="handleChangeRangeTime">
                </el-date-picker>
                <el-button type="primary" @click="handleShowAppointmentTime">预约时间段</el-button>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="体检人数" prop="total">
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
            <el-form-item size="small" label="联系人" prop="contacts">
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
              <el-input v-model="registername" disabled></el-input>
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
            <el-form-item size="small" label="修改分组">
              <el-select filterable clearable style="width: 100%" v-model="bodyForm.altergroup">
                <el-option :value="0" label="允许"></el-option>
                <el-option :value="1" label="不允许"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="允许折扣">
              <el-select filterable clearable style="width: 100%" v-model="bodyForm.altergroupdiscount">
                <el-option :value="0" label="允许"></el-option>
                <el-option :value="1" label="不允许"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="分组详情">
              <el-select filterable clearable style="width: 100%" v-model="bodyForm.showgroupdetailpage">
                <el-option :value="0" label="显示"></el-option>
                <el-option :value="1" label="不显示"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="取消时间">
              <el-input v-model.number="bodyForm.canclehours" @input="handleNumberInputCanclehours" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 5px">
          <el-col :span="6">
            <el-form-item size="small" label="备注">
              <el-input v-model="bodyForm.remark"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="折后价格">
              <el-input v-model="bodyForm.setdiscount"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="合同附件" class="form_df">
              <!-- annex -->
              <el-upload class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPpload" ref="upload" :file-list="fileList" :auto-upload="false" accept=".docx,.doc,.pdf">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              </el-upload>
              <el-link v-if="fileUrl != ''" type="primary" class="filelink" target="_blank" :href="fileUrl">{{ fileName }}</el-link>
              <el-button v-if="fileUrl != ''" type="primary" size="mini" icon="el-icon-delete" @click="handleDelFile"></el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="单位折扣">
              <el-input v-model="maindiscount" @keyup.enter.native="handleChangeMainDiscount"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5" v-if="fileUrl != ''">
            <el-form-item size="small" label="文件预览">
              <el-link
                type="primary"
                class="filelink"
                target="_blank"
                :href="fileUrl"
                >{{ fileName }}</el-link
              >
            </el-form-item>
          </el-col>
          <el-col :span="1" v-if="fileUrl != ''">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-delete"
              @click="handleDelFile"
            ></el-button>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="报告时间">
              <el-input v-model.number="bodyForm.reportviewtimes" @input="handleNumberInputReportviewtimes" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="报告控制">
              <el-select style="width: 100%" v-model="bodyForm.viewreportsettlement" clearable filterable placeholder="">
                <el-option size="mini" label="未结算允许查询" :value="0">
                </el-option>
                <el-option size="mini" label="未结算不能查询" :value="1">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="补约时间">
              <el-date-picker style="width: 100%" size="mini" v-model="bodyForm.supplementdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item size="small" label="补约时间段">
              <div class="date_box">
                <el-date-picker v-model="suppleDate" style="width: 100%" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleChangeSuppleDate">
                </el-date-picker>
                <el-button type="primary" @click="handleShowAppointSuppleDate">补约时间段</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item size="small" label="可约时间">
              <el-input v-model.number="bodyForm.registerhours" @input="handleNumberInputRegisterhours" clearable></el-input>
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
            <el-button type="primary" plain size="small" icon="el-icon-copy-document" @click="handleQueryCopy">查询复制</el-button>
          </div>
        </div>
        <div class="unit_grouping">
          <div v-for="(item, index) in groupList" :key="index" class="unit_item" @click="handleChooseGroup(item, index)" :class="[
              {
                current_row: active === index,
              },
            ]">
            <div class="form_box">
              <el-row>
                <el-col :span="8">
                  <div class="grid-content bg-purple">
                    <span>分组名称：</span>
                    <span>{{ item.groupname }}</span>
                  </div>
                </el-col>
                <!-- <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <span>分组人数：</span>
                    <span>{{ item.grouptotal }}</span>
                  </div>
                </el-col> -->
                <el-col :span="8">
                  <div class="grid-content bg-purple df">
                    <div class="df_title">折扣：</div>
                    <input type="text" class="discount_input title_input" :max="1" :min="0" v-model="item.discount" @keyup.enter="handleChangeItemDiscount(item)" />
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple df">
                    <div class="df_title">实际人数：</div>
                    <input type="text" class="discount_input title_input" :max="1" :min="0" v-model.lazy="item.realtotal" @change="handleChangeItemRealtotal(item)" />
                  </div>
                </el-col>
              </el-row>
              <el-row class="clearance_top">
                <!-- <el-col :span="6">
                  <div class="grid-content bg-purple">
                    <span>所属部门：</span>
                    <span>{{ item.department }}</span>
                  </div>
                </el-col> -->
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <span>性别：</span>
                    <span>{{
                      item.sex == 0 ? "未知" : item.sex == 1 ? "男" : "女"
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <span>结算方式：</span>
                    <span>{{
                      item.settlementtype == 0 ? "单位结算" : "个人结算"
                    }}</span>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                    <span>检查类型：</span>
                    <span>{{ registerCup(item.checktype) }}</span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <div class="link_btn">
              <el-link class="copy_group" :underline="false" type="primary" @click="handleCustomSettings(item)">自选设置</el-link>
              <el-link class="copy_group" :underline="false" type="primary" @click="handleCopyGroup(item)">复制分组</el-link>
            </div>
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
            <span style="margin-left: 15px" v-if="chooseGroup">分组折后总价{{ discountpriceCount }}元</span>
            <span style="margin-left: 15px" v-else>分组折后总价0元</span>
          </div>
          <div class="btn_group" style="margin-right: 10px">
            <!-- <el-button
              type="primary"
              size="small"
              plain
              icon="el-icon-plus"
              @click="handleSetDiscount"
              >折扣</el-button
            > -->
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
              <!-- <span v-if="scope.row.originalprice >= 0">{{
                (scope.row.originalprice * +scope.row.discount).toFixed(2)
              }}</span>
              <span v-else>{{
                (scope.row.price * +scope.row.discount).toFixed(2)
              }}</span> -->
              <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" v-model.lazy="scope.row.discountprice" @focus="handleFocusDiscountprice(scope.row)" @change="handleChangeDiscountprice(scope.row)" />
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
            <el-form-item size="mini" label="派单方式">
              <el-select v-model="groupForm.sendtype" placeholder="">
                <el-option label="现场打印" value="现场打印"></el-option>
                <el-option label="现场派单" value="现场派单"></el-option>
                <el-option label="已结算" value="已结算"></el-option>
                <el-option label="已停止" value="已停止"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item size="small" :label="'分组说明'" prop="Remark">
              <el-input v-model="groupForm.remark" style="width: 100%" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item size="small" :label="'检查类型'" prop="checktype">
              <el-select v-model="groupForm.checktype" clearable style="width: 100%">
                <el-option v-for="(item, index) in registerGroup" :key="index" :value="item.code" :label="item.name"></el-option>
              </el-select>
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
    <!-- 单位分组 分组信息弹框 -->
    <el-dialog class="dialog-mini group_form" width="68%" top="10%" :close-on-click-modal="false" title="复制查询" :visible.sync="showQueryCopy" :show-close="false">
      <div class="top_s">
        <el-date-picker style="width: 300px; margin-right: 20px" v-model="queryDate" type="daterange" size="mini" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleChangeQueryDate">
        </el-date-picker>
        <el-input placeholder="请输入搜索内容" size="mini" style="width: 300px; margin-right: 20px" v-model="searchWord" clearable @clear="handlegetQueryCopyList" @keyup.enter.native="handlegetQueryCopyList">
        </el-input>
      </div>
      <div class="table_box">
        <div class="table_l">
          <el-table ref="mainTable" min-width="500" height="100%" stripe :row-style="{ height: '32px' }" :cell-style="{ padding: '0px' }" :header-cell-style="{
              background: '#b6cfee',
              fontWeight: 600,
              color: '#18253a',
              height: '40px',
            }" :data="queryCopyList" fit highlight-current-row style="width: 100%" @row-click="hnadleChooseCopyCom">
            <el-table-column prop="companycode" label="单位编码" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column width="250px" align="left" prop="companyname" label="单位名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="batch" label="批次" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <div class="table_r">
          <div class="table_r_el">
            <el-table ref="mainTable" min-width="500" stripe height="100%" :row-style="{ height: '32px' }" :cell-style="{ padding: '0px' }" :header-cell-style="{
                background: '#b6cfee',
                fontWeight: 600,
                color: '#18253a',
                height: '40px',
              }" :data="queryCopyGroupList" @selection-change="handleChooseQueryCopyGroup">
              <el-table-column type="selection" width="55"> </el-table-column>
              <el-table-column prop="groupname" label="分组名称" sortable show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <div class="table_b_btn">
            <el-button size="mini" type="primary" @click="handleSubmitCopyGroup">复 制</el-button>
            <el-button size="mini" @click="showQueryCopy = false">关 闭</el-button>
          </div>
        </div>
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
    <!-- 复制分组 -->
    <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="复制分组" :visible.sync="showCopyGroup" @close="handleCloseCopyGroup">
      <div class="discount_box">
        <el-input size="mini" placeholder="请输入分组名" max="100" min="1" v-model="copyGroup" clearable>
        </el-input>
        <!-- <div>%</div> -->
      </div>
      <span slot="footer" class="dialog-footer history_table_footer">
        <el-button size="mini" type="primary" @click="handleConfirmCopyGroup">确 认</el-button>
        <el-button size="mini" @click="handleCloseCopyGroup">取 消</el-button>
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
    <el-dialog title="预约时间段列表" class="apptime_dia" :visible.sync="showAppointmentTime" width="85%" top="4%" :show-close="false" :close-on-click-modal="false">
      <div class="apptime_content">
        <EasyTable height="100%" class="apptime_table" :data="apptimeData" :tableOptions="apptimeOptions" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <div class="acdate_box">
          <div class="title_select">
            <div class="dbtitle">预约日期：</div>
            <el-select size="small" filterable clearable v-model="category">
              <el-option :value="'CompanyCheckDate_Yes'" label="可预约"></el-option>
              <el-option :value="'CompanyCheckDate_No'" label="不可预约"></el-option>
            </el-select>
          </div>
          <el-checkbox-group class="datecheck_box" v-model="propertyitems">
            <el-checkbox class="datecheck_item" v-for="(item, index) in dayitems" :key="index" :label="item">
              <div>{{ item.propertyvalue }}({{ item.description }})</div>
              <el-select v-model="item.propertytype" style="width: 150px; margin: 0 8px" clearable size="mini" placeholder="请选择">
                <el-option label="全天" value="全天"></el-option>
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
              </el-select>
              <el-input placeholder="请输入内容" style="width: 100px" size="mini" v-model="item.propertyothervalue" clearable>
              </el-input>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseAppTime">取 消</el-button>
        <el-button size="mini" type="success" @click="handleAddAppTime">新 增</el-button>
        <el-button size="mini" type="primary" @click="handleCloseAppTime">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="补约时间段列表" class="apptime_dia" :visible.sync="showAppointSupple" width="85%" top="4%" :show-close="false" :close-on-click-modal="false">
      <div class="apptime_content">
        <EasyTable height="100%" class="apptime_table" :data="apptimeDataSupple" :tableOptions="apptimeOptionsSupple" :radio-config="{ rowClick: true }" :row-style="rowstyle" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
        <div class="acdate_box">
          <div class="title_select">
            <div class="dbtitle">预约日期：</div>
            <el-select size="small" filterable clearable v-model="categorySupple">
              <el-option :value="'CompanyCheckDate_Yes'" label="可预约"></el-option>
              <el-option :value="'CompanyCheckDate_No'" label="不可预约"></el-option>
            </el-select>
          </div>
          <el-checkbox-group class="datecheck_box" v-model="supplementpropertyitems">
            <el-checkbox class="datecheck_item" v-for="(item, index) in supplementtimeitems" :key="index" :label="item">
              <div>{{ item.propertyvalue }}({{ item.description }})</div>
              <el-select v-model="item.propertytype" style="width: 150px; margin: 0 8px" clearable size="mini" placeholder="请选择">
                <el-option label="全天" value="全天"></el-option>
                <el-option label="上午" value="上午"></el-option>
                <el-option label="下午" value="下午"></el-option>
              </el-select>
              <el-input placeholder="请输入内容" style="width: 100px" size="mini" v-model="item.propertyothervalue" clearable>
              </el-input>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleCloseAppTimeSupple">取 消</el-button>
        <el-button size="mini" type="success" @click="handleAddAppTimeSupple">新 增</el-button>
        <el-button size="mini" type="primary" @click="handleCloseAppTimeSupple">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="自选设置" :visible.sync="showCustomSettings" width="60%" :show-close="false" :close-on-click-modal="false" class="cust_dialog">
      <div class="cdcontent">
        <div class="cdctop">
          <div class="cdctinput" v-if="chooseGroup">
            <div class="cdctititle">自选规则表达式：</div>
            <el-input size="mini" placeholder="请输入内容" v-model="chooseGroup.chooseruleexpress" clearable>
            </el-input>
          </div>
          <div class="cdctinput" v-if="chooseGroup">
            <div class="cdctititle">规则描述：</div>
            <el-input size="mini" placeholder="请输入内容" v-model="chooseGroup.chooseruledes" clearable>
            </el-input>
          </div>
          <el-button type="primary" size="small" plain icon="el-icon-plus" @click="handleAddProjectCS">添加项目</el-button>
        </div>
        <div class="cdctable" v-if="chooseGroup && chooseGroup.choosecombineitems">
          <el-table class="combineitems_table" :data="chooseGroup.choosecombineitems" ref="mainTable" height="calc(100% - 20px)" min-width="500" stripe fit highlight-current-row style="width: 100%" :row-style="{ height: '32px' }" :header-cell-style="{
              textAlign: 'center',
              background: '#b6cfee',
              fontWeight: 600,
              color: '#18253a',
              height: '40px',
            }" :cell-style="{ padding: '0px', textAlign: 'center' }">
            <el-table-column label="操作" show-overflow-tooltip>
              <template slot-scope="scope">
                <i class="el-icon-delete delDelCom" @click="handleDelComCS(scope.row)"></i>
              </template>
            </el-table-column>
            <el-table-column width="85" prop="combinecode" label="组合编码" show-overflow-tooltip></el-table-column>
            <el-table-column width="230" prop="combinename" label="组合名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="groupcode" label="分组" show-overflow-tooltip>
              <template slot-scope="scope">
                <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" :disabled="scope.row.discountflag === 1" v-model.lazy="scope.row.groupcode" @focus="handleDiscountFocus" />
              </template>
            </el-table-column>
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
                <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" :disabled="scope.row.discountflag === 1" v-model.lazy="scope.row.discount" @focus="handleDiscountFocus" @change="handleChangeDiscount(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column prop="discountprice" label="折后价" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <span v-if="scope.row.originalprice >= 0">{{
                (scope.row.originalprice * +scope.row.discount).toFixed(2)
              }}</span>
              <span v-else>{{
                (scope.row.price * +scope.row.discount).toFixed(2)
              }}</span> -->
                <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" v-model.lazy="scope.row.discountprice" @focus="handleFocusDiscountprice(scope.row)" @change="handleChangeDiscountprice(scope.row)" />
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-else class="empty_group">暂无数据</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="showCustomSettings = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="showCustomSettings = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 体检项目 -->
    <!-- <SetMealDialog v-if="showProjectDialog" :groupTableData="groupTableData" @submit="handleSubmitMedicalItems" @close="showProjectDialog = false" /> -->
    <SetMealDialog v-if="showProjectDialog" :sex="chooseGroup.sex" :flag="addOrEdit" :groupTableData="chooseGroup.combineitems" :groupName="chooseGroup ? chooseGroup.groupname : ''" @submit="handleSubmitMedicalItems" @close="showProjectDialog = false" />
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
  getList,
  SelectDays,
  SameGroupCombinePrice,
} from "@/api/company_register.js";
import { printStaticsBase64 } from "@/api/printreport.js";
import { getFiles } from "@/api/customerresult.js"; // 引入页面接口
// import SetMealDialog from "@/components/SetMealDialog/index_qyzyy.vue"; // 新项目弹框
// import SetMealDialog from "@/components/SetMealDialog/index_gyey.vue"; // 新项目弹框
import SetMealDialog from "@/components/SetMealDialog/index_gyey_youhua.vue"; // 新项目弹框
import * as company_archives from "@/api/company_archives";
import CreatedForm from "@/components/Formcreated/components/CreatedForm";
import { getSysConfigInfo } from "@/api/sysconfig";
import { setCollectChargeInfoForNotSave } from "@/api/personalregister.js";
import * as users from "@/api/users";
export default {
  name: "AddOrEdit_gyey",
  props: {
    addOrEditP: {
      required: true,
      type: String,
    },
    editObj: {},
  },
  components: { SetMealDialog, CreatedForm },

  computed: {
    apptimeOptionsSupple() {
      return [
        {
          title: "时段名称",
          width: 300,
          omit: 1,
          render: (h, data) => {
            return (
              <el-input
                placeholder="请输入名称"
                v-model={data.timename}
                clearable
                size="mini"
              ></el-input>
            );
          },
        },
        {
          title: "开始时间",
          width: 160,
          omit: 1,
          render: (h, data) => {
            return (
              <el-time-picker
                size="mini"
                style="width:100%;"
                v-model={data.starttime}
                picker-options={{
                  selectableRange: "00:00:00 - 23:59:59",
                  format: "HH:mm",
                }}
                placeholder="任意时间点"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            );
          },
        },
        {
          title: "结束时间",
          width: 160,
          omit: 1,
          render: (h, data) => {
            return (
              <el-time-picker
                size="mini"
                style="width:100%;"
                v-model={data.endtime}
                picker-options={{
                  selectableRange: "00:00:00 - 23:59:59",
                  format: "HH:mm",
                }}
                placeholder="任意时间点"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            );
          },
        },
        {
          title: "数量",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-input
                placeholder="请输入数量"
                v-model={data.total}
                clearable
                size="mini"
              ></el-input>
            );
          },
        },
        {
          title: "星期",
          omit: 1,
          render: (h, data) => {
            return (
              <div class="week_box">
                <el-checkbox
                  v-model={data.week1}
                  true-label={1}
                  false-label={0}
                >
                  周一
                </el-checkbox>
                <el-checkbox
                  v-model={data.week2}
                  true-label={1}
                  false-label={0}
                >
                  周二
                </el-checkbox>
                <el-checkbox
                  v-model={data.week3}
                  true-label={1}
                  false-label={0}
                >
                  周三
                </el-checkbox>
                <el-checkbox
                  v-model={data.week4}
                  true-label={1}
                  false-label={0}
                >
                  周四
                </el-checkbox>
                <el-checkbox
                  v-model={data.week5}
                  true-label={1}
                  false-label={0}
                >
                  周五
                </el-checkbox>
                <el-checkbox
                  v-model={data.week6}
                  true-label={1}
                  false-label={0}
                >
                  周六
                </el-checkbox>
                <el-checkbox
                  v-model={data.week7}
                  true-label={1}
                  false-label={0}
                >
                  周日
                </el-checkbox>
              </div>
            );
          },
        },
        {
          title: "操作",
          width: 80,
          omit: 1,
          render: (h, data) => {
            return (
              <el-button
                type="danger"
                size="mini"
                vOn:click_stop_prevent={(e) => {
                  this.handleDelAppTimeSupple(data);
                }}
              >
                删 除
              </el-button>
            );
          },
        },
      ];
    },
    apptimeOptions() {
      return [
        {
          title: "时段名称",
          width: 300,
          omit: 1,
          render: (h, data) => {
            return (
              <el-input
                placeholder="请输入名称"
                v-model={data.timename}
                clearable
                size="mini"
              ></el-input>
            );
          },
        },
        {
          title: "开始时间",
          width: 160,
          omit: 1,
          render: (h, data) => {
            return (
              <el-time-picker
                size="mini"
                style="width:100%;"
                v-model={data.starttime}
                picker-options={{
                  selectableRange: "00:00:00 - 23:59:59",
                  format: "HH:mm",
                }}
                placeholder="任意时间点"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            );
          },
        },
        {
          title: "结束时间",
          width: 160,
          omit: 1,
          render: (h, data) => {
            return (
              <el-time-picker
                size="mini"
                style="width:100%;"
                v-model={data.endtime}
                picker-options={{
                  selectableRange: "00:00:00 - 23:59:59",
                  format: "HH:mm",
                }}
                placeholder="任意时间点"
                format="HH:mm"
                value-format="HH:mm"
              ></el-time-picker>
            );
          },
        },
        {
          title: "数量",
          width: 140,
          omit: 1,
          render: (h, data) => {
            return (
              <el-input
                placeholder="请输入数量"
                v-model={data.total}
                clearable
                size="mini"
              ></el-input>
            );
          },
        },
        {
          title: "星期",
          omit: 1,
          render: (h, data) => {
            return (
              <div class="week_box">
                <el-checkbox
                  v-model={data.week1}
                  true-label={1}
                  false-label={0}
                >
                  周一
                </el-checkbox>
                <el-checkbox
                  v-model={data.week2}
                  true-label={1}
                  false-label={0}
                >
                  周二
                </el-checkbox>
                <el-checkbox
                  v-model={data.week3}
                  true-label={1}
                  false-label={0}
                >
                  周三
                </el-checkbox>
                <el-checkbox
                  v-model={data.week4}
                  true-label={1}
                  false-label={0}
                >
                  周四
                </el-checkbox>
                <el-checkbox
                  v-model={data.week5}
                  true-label={1}
                  false-label={0}
                >
                  周五
                </el-checkbox>
                <el-checkbox
                  v-model={data.week6}
                  true-label={1}
                  false-label={0}
                >
                  周六
                </el-checkbox>
                <el-checkbox
                  v-model={data.week7}
                  true-label={1}
                  false-label={0}
                >
                  周日
                </el-checkbox>
              </div>
            );
          },
        },
        {
          title: "操作",
          width: 80,
          omit: 1,
          render: (h, data) => {
            return (
              <el-button
                type="danger"
                size="mini"
                vOn:click_stop_prevent={(e) => {
                  this.handleDelAppTime(data);
                }}
              >
                删 除
              </el-button>
            );
          },
        },
      ];
    },
    combineitemsCount() {
      // let tempArr = this.chooseGroup.combineitems.filter((k) => !k.isOptional);
      let tempArr = this.chooseGroup.combineitems;
      return tempArr.length;
    },
    choosecombineitemsCount() {
      // let templen1 = this.chooseGroup.combineitems.filter((k) => k.isOptional);
      let templen1 = this.chooseGroup.combineitems;
      let templen2 = this.chooseGroup.choosecombineitems;
      return templen1.length || templen2.length || 0;
    },
    originalpriceCount() {
      let price = 0;
      // let tempArr = this.chooseGroup.combineitems.filter((k) => !k.isOptional);
      let tempArr = this.chooseGroup.combineitems;
      tempArr.forEach((k) => {
        if (k.hasOwnProperty("originalprice")) {
          price += +k.originalprice;
          // price += +k.originalprice * +k.discount;
        } else {
          price += +k.price;
          // price += +k.price * +k.discount;
        }
        // price += +k.originalprice || +k.price;
      });
      this.chooseGroup.originalprice = price.toFixed(2);
      return price.toFixed(2);
    },
    discountpriceCount() {
      let price = 0;
      this.chooseGroup.combineitems.forEach((k) => {
        if (k.hasOwnProperty("discountprice")) {
          price += +k.discountprice;
        }
        // price += +k.originalprice || +k.price;
      });
      // this.chooseGroup.originalprice = price.toFixed(2);
      return price.toFixed(2);
    },
    // 处理检查类型配置
    registerCup() {
      return (code) => {
        let res = this.registerGroup.filter((k) => k.code == code)[0];
        return res && res.name;
      };
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
      queryCopyDate: [],
      isPageStatus: "add",
      discountProperty: [],
      active: "",
      chooseQueryCopy: [],
      queryCopyGroupList: [],
      searchWord: "",
      queryDate: [],
      listQuery: {
        // 查询条件
        page: 1,
        limit: 100,
        whereitems: [],
      },
      queryCopyList: [],
      showQueryCopy: false,
      copyGroup: "",
      copyGroupItem: null,
      showCopyGroup: false,
      centerLoading: false,
      selectLoading: false,
      saveradio: "1",
      regid: "", // 编辑查询对象id
      fileList: [], // bodyForm.annex
      mainitem: "", // 登记信息
      companyitems: [], // 公司合集
      receptitems: [], // 接待人合集
      rangeTime: [], // 体检时间
      suppleDate: [], // 体检时间
      registername: "", // 登记人
      combosum: "", //套餐总数
      tempDiscountprice: 0,
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
        altergroup: 0,
        altergroupdiscount: 0,
        showgroupdetailpage: 0,
        canclehours: 0,
        registerhours: 0,
        reportviewtimes: 0,
        viewreportsettlement: 0,
        supplementdate: "",
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
        discount: 1,
        discountprice: 0,
        settlementtype: 0,
        addsettlementtype: 0,
        adddiscount: 0,
        sendtype: "现场打印",
        quota: 0,
        remark: "",
        checktype: "1",
        realtotal: 0,
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
      maindiscount: "",
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
      showAppointmentTime: false,
      showAppointSupple: false,
      apptimeData: [],
      apptimeDataSupple: [],
      propertyitems: [],
      supplementpropertyitems: [],
      addOrEdit: "add",
      category: "CompanyCheckDate_Yes",
      categorySupple: "CompanyCheckDate_Yes",
      dayitems: [],
      supplementtimeitems: [],
      selectDayitems: [],
      showCustomSettings: false,
      popupSettings: "",
      tempTime: [],
      officerFlag: false,
    };
  },

  mounted() {
    this.addOrEdit = this.addOrEditP;
    if (this.addOrEdit == "edit") {
      this.regid = this.editObj.regid;
      this.handleEditCompanyDetail();
    } else {
      let time = new Date(+new Date() + 8 * 3600 * 1000)
        .toJSON()
        .substr(0, 10)
        .replace("T", " ");
      this.rangeTime = [time, time];
      this.bodyForm.startdate = time;
      this.bodyForm.enddate = time;
    }
    //   页面加载获取单位预约 新增/详情数据
    this.handleGetCompanyDetail();
    this.handleGetRegisterGroup();
    this.handleGetCenterDic();
    this.handleGetSysConfigInfo();
    this.handleGetUserPropertyValues();
  },

  methods: {
    // 同步价格回调
    handleSameGroupCombinePrice() {
      if (!this.chooseGroup) {
        this.$message.warning("请先选中分组!");
        return;
      }
      SameGroupCombinePrice({
        groupid: this.chooseGroup.groupid,
        combinecodes: this.chooseGroup.combineitems.map((k) => k.combinecode),
      }).then((res) => {
        this.$message.success(res.message || res.msg);
        this.handleEditCompanyDetail();
      });
    },
    // 自选设置按钮回调
    handleCustomSettings(item) {
      if (!item) return;
      this.copyGroupItem = JSON.parse(JSON.stringify(item));
      this.showCustomSettings = true;
    },
    handleNumberInputReportviewtimes(event) {
      if (!/^\d*$/.test(this.bodyForm.reportviewtimes)) {
        // 使用正则表达式进行校验，确保只包含数字
        this.bodyForm.reportviewtimes = 0; // 清空输入框的值
      }
    },
    handleNumberInputRegisterhours(event) {
      if (!/^\d*$/.test(this.bodyForm.registerhours)) {
        // 使用正则表达式进行校验，确保只包含数字
        this.bodyForm.registerhours = 0; // 清空输入框的值
      }
    },
    handleNumberInputCanclehours(event) {
      if (!/^\d*$/.test(this.bodyForm.canclehours)) {
        // 使用正则表达式进行校验，确保只包含数字
        this.bodyForm.canclehours = 0; // 清空输入框的值
      }
    },
    handleCloseAppTimeSupple() {
      this.showAppointSupple = false;
    },
    handleCloseAppTime() {
      this.showAppointmentTime = false;
      // this.$confirm("是否修改时间段?", "提示", {
      //   confirmButtonText: "是",
      //   cancelButtonText: "否",
      //   type: "warning",
      //   closeOnClickModal: false,
      //   showClose: false,
      // })
      //   .then(() => {
      //     this.showAppointmentTime = false;
      //   })
      //   .catch(() => {});
    },
    handleDelAppTimeSupple(item) {
      if (!item);
      let index = this.apptimeDataSupple.findIndex(
        (k) => k.$index === item.$index
      );
      index > -1 && this.apptimeDataSupple.splice(index, 1);
    },
    handleDelAppTime(item) {
      if (!item);
      let index = this.apptimeData.findIndex((k) => k.$index === item.$index);
      index > -1 && this.apptimeData.splice(index, 1);
    },
    handleAddAppTimeSupple() {
      this.apptimeDataSupple.push({
        timeid: "",
        regid: this.bodyForm.regid || "",
        timename: "",
        starttime: "",
        endtime: "",
        total: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
        week6: 0,
        week7: 0,
        seqno: 0,
      });
    },
    handleAddAppTime() {
      this.apptimeData.push({
        timeid: "",
        regid: this.bodyForm.regid || "",
        timename: "",
        starttime: "",
        endtime: "",
        total: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
        week6: 0,
        week7: 0,
        seqno: 0,
      });
    },
    // 补约时间
    handleShowAppointSuppleDate() {
      if (!this.bodyForm.supplementstartdate) {
        this.$message.warning("请先选中补约时间段");
        return;
      }
      SelectDays({
        regid: this.regid,
        startdate: this.bodyForm.supplementstartdate,
        enddate: this.bodyForm.supplementenddate,
        bookingtype: 1,
      }).then((res) => {
        if (!res.result) return;
        let data = res.result;
        this.categorySupple = data.category;
        this.supplementpropertyitems = data.dayitems.filter((k) => k.selected);
        this.supplementtimeitems = data.dayitems;
        this.showAppointSupple = true;
      });
    },
    handleShowAppointmentTime() {
      SelectDays({
        regid: this.regid,
        startdate: this.bodyForm.startdate,
        enddate: this.bodyForm.enddate,
      }).then((res) => {
        if (!res.result) return;
        let data = res.result;
        this.category = data.category;
        this.propertyitems = data.dayitems.filter((k) => k.selected);
        this.dayitems = data.dayitems;
        this.showAppointmentTime = true;
      });
    },
    // 点击导出
    handleClickExport() {
      if (this.addOrEdit != "edit") {
        this.$message.warning("请先保存数据!");
        return false;
      }
      if (!this.chooseGroup || !this.chooseGroup.groupcode) {
        this.$message.warning("请先选中分组!");
        return false;
      }
      let whereitems = [
        {
          key: "companycode",
          value: this.bodyForm.companycode,
        },
        {
          key: "batch",
          value: this.bodyForm.batch,
        },
        {
          key: "groupcode",
          value: this.chooseGroup.groupcode,
        },
      ];
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: "分组明细表",
        whereitems,
      };
      printStaticsBase64(data).then((res) => {
        let code = res.data[0].base64String.replace(/[\n\r]/g, "");
        let raw = window.atob(code);
        let rawLength = raw.length; //转换成pdf.js能直接解析的Uint8Array类型
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        let url = window.URL.createObjectURL(
          new Blob([uInt8Array], { type: "application/pdf" })
        );
        const a = document.createElement("a");
        a.href = url;
        a.download = "分组明细表"; // 下载文件的名字
        // a.download = res.data[0].printname; // 下载文件的名字
        document.body.appendChild(a);
        a.click();
      });
    },
    // 点击打印
    handleClickPrint() {
      if (this.addOrEdit != "edit") {
        this.$message.warning("请先保存数据!");
        return false;
      }
      if (!this.chooseGroup || !this.chooseGroup.groupcode) {
        this.$message.warning("请先选中分组!");
        return false;
      }
      let whereitems = [
        {
          key: "companycode",
          value: this.bodyForm.companycode,
        },
        {
          key: "batch",
          value: this.bodyForm.batch,
        },
        {
          key: "groupcode",
          value: this.chooseGroup.groupcode,
        },
      ];
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [],
        repname: "分组明细表",
        printflag: 1,
        whereitems,
      };
      printStaticsBase64(data).then((res) => {
        this.lodop = getLodop();
        let printname = ``;
        if (res.data[0].printname == "") {
          printname = this.lodop.GET_PRINTER_NAME(-1);
        } else {
          printname = res.data[0].printname;
        }
        let printObj = new LodopPrinter(null, printname);
        let fileList = res.data.map((k) => {
          return k.base64String;
        });
        printObj.printBase64PdfReport(this.lodop, fileList);
      });
    },
    handleGetUserPropertyValues() {
      let id = JSON.parse(localStorage.getItem("userId"));
      let ct = "DiscountProperty";
      users.getUserProperty({ id, ct }).then((res) => {
        console.log(res);
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue.split("-"));
      });
    },
    handleSubmitCopyGroup() {
      if (this.chooseQueryCopy.length == 0) {
        this.$message.warning("请勾选需要复制的分组!");
        return;
      }
      for (let i = 0; i < this.chooseQueryCopy.length; i++) {
        this.groupList.push({
          ...this.chooseQueryCopy[i],
          groupid: "",
          groupcode: "",
        });
      }
      this.handleChooseGroup(
        this.groupList[this.groupList.length - 1],
        this.groupList.length - 1
      );
      this.showQueryCopy = false;
    },
    handleChooseQueryCopyGroup(rows) {
      this.chooseQueryCopy = rows;
    },
    // 查询复制
    handleQueryCopy() {
      this.handlegetQueryCopyList();
      this.showQueryCopy = true;
    },
    hnadleChooseCopyCom(row) {
      getCompanyDetail({ regid: row.regid }).then((res) => {
        this.queryCopyGroupList = res.result.groupitems;
      });
    },
    handleChangeQueryDate(date) {
      console.log(date);
      this.handlegetQueryCopyList();
    },
    handlegetQueryCopyList() {
      this.listQuery.whereitems = [];
      if (this.searchWord) {
        this.listQuery.whereitems.push({
          key: "CompanyName",
          value: this.searchWord,
        });
      }
      if (this.queryDate && this.queryDate.length != 0) {
        this.listQuery.whereitems.push({
          key: "RegisterTimeBegin",
          value: this.queryDate[0],
        });
        this.listQuery.whereitems.push({
          key: "RegisterTimeEnd",
          value: this.queryDate[1],
        });
      }
      getList(this.listQuery)
        .then((res) => {
          if (!res.data) {
            this.queryCopyList = [];
            this.queryCopyGroupList = [];
            return;
          }
          this.queryCopyList = res.data;
        })
        .catch((err) => {
          this.queryCopyList = [];
          this.queryCopyGroupList = [];
        });
    },
    handleConfirmCopyGroup() {
      if (!this.copyGroup) {
        this.$message.warning("分组名不能为空!");
        return;
      }
      let tempArr = JSON.parse(JSON.stringify(this.groupList));
      let findArr = tempArr.map((k) => {
        return k.groupname;
      });
      if (findArr.includes(this.copyGroup)) {
        this.$message.warning("分组名称不能重复!");
        return false;
      }
      this.groupList.push({
        ...this.copyGroupItem,
        groupcode: "",
        groupname: this.copyGroup,
        groupid: "",
      });
      this.handleChooseGroup(
        this.groupList[this.groupList.length - 1],
        this.groupList.length - 1
      );
      this.handleCloseCopyGroup();
    },
    // 复制分组按钮回调
    handleCopyGroup(item) {
      if (!item) return;
      this.copyGroupItem = JSON.parse(JSON.stringify(item));
      this.showCopyGroup = true;
    },
    handleCloseCopyGroup() {
      this.copyGroup = "";
      this.showCopyGroup = false;
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
      row.discountprice = (+row.price * +row.discount).toFixed(2);
    },
    handleChangeDiscountprice(row) {
      if (+row.price * +row.discount !== +row.discountprice) {
        row.discount = 1;
      }
      if (+row.discountprice > +row.price) {
        this.$message.error("折后价格不允许大于原价!");
        row.discountprice = this.tempDiscountprice;
        return;
      }
    },
    handleFocusDiscountprice(row) {
      this.tempDiscountprice = +row.discountprice;
    },
    handleGetSysConfigInfo() {
      getSysConfigInfo({ cc: "Sys_Company_register_DateRange" }).then((res) => {
        // 获取条件计算日期范围回调
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * +res.result);
        let startDate = new Date(+new Date() - 365 * 2 * 24 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " ");
        let endDate = new Date(+new Date() + 8 * 3600 * 1000)
          .toJSON()
          .substr(0, 10)
          .replace("T", " ");
        this.queryDate = [startDate, endDate];
      });
    },
    gettime(data) {
      let value =
        data.getFullYear() +
        "-" +
        this.checkTime(data.getMonth() + 1) +
        "-" +
        this.checkTime(data.getDate());
      return value;
    },
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
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
          this.$refs.contentDataObj
            .getData()
            .then((data) => {
              this.addtemp.formid = this.formid;
              this.addtemp.formcontroldata = JSON.stringify(data, null, "\t");
            })
            .catch(() => {
              this.$refs.formPreview.end();
            });
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
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.healthstatus == 1) {
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
        this.contentData = JSON.parse(formitem.contentData);
        if (formcontroldata) {
          this.formcontroldata = JSON.parse(formcontroldata);
        } else {
          this.formcontroldata = {};
        }
        this.contentData && (this.previewModelBase = true);
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
    handleDelComCS(item) {
      if (!item) return;
      let index = this.chooseGroup.choosecombineitems.findIndex(
        (k) => k.combinecode === item.combinecode
      );
      if (index != -1) {
        this.chooseGroup.choosecombineitems.splice(index, 1);
      }
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
      console.log(val);
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
            console.log(res);
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
    handleSelecetCenterDic(val) {
      console.log(val);
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
          console.log(res);
        });
      }, 200);
    },
    handleFocusRangeTime() {
      this.tempTime = [this.bodyForm.startdate, this.bodyForm.enddate];
    },
    handleChangeSuppleDate(value) {
      if (value) {
        this.bodyForm.supplementstartdate = value[0];
        this.bodyForm.supplementenddate = value[1];
      } else {
        this.bodyForm.supplementstartdate = "";
        this.bodyForm.supplementenddate = "";
      }
    },
    handleChangeRangeTime(value) {
      this.$confirm("是否修改时间段?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        closeOnClickModal: false,
        showClose: false,
      })
        .then(() => {
          value && (this.bodyForm.startdate = value[0]);
          value && (this.bodyForm.enddate = value[1]);
          this.tempTime = [];
          this.handleShowAppointmentTime();
        })
        .catch(() => {
          this.bodyForm.startdate = this.tempTime[0];
          this.bodyForm.enddate = this.tempTime[1];
          this.rangeTime = [this.tempTime[0], this.tempTime[1]];
          this.tempTime = [];
        });
      // if (!value) {
      //   this.rangeTime = [];
      // }
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
        console.log(res, "Dic_Medical_center");
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
        this.apptimeData = data.timeitems;
        this.apptimeDataSupple = data.supplementtimeitems;
        let select = data.mainitem.companyitems.filter((k) => k.selected)[0];
        let recept = data.mainitem.receptitems.filter((k) => k.selected)[0];
        recept
          ? (this.bodyForm.receptcode = recept.code)
          : (this.bodyForm.receptcode = "");

        select && (this.bodyForm.companycode = select.code);
        select && (this.bodyForm.companyname = select.name);
        this.rangeTime = [data.mainitem.startdate, data.mainitem.enddate];
        this.suppleDate = [
          data.mainitem.supplementstartdate,
          data.mainitem.supplementenddate,
        ];
        this.groupList = data.groupitems;
        this.chooseGroup = this.groupList[0];
        this.active = 0;
        this.bodyForm.fileid && this.handleGetFiles();
        if (data.mainitem.companytype == 10107) {
          this.officerFlag = true;
        }
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
        // let select = res.result.findIndex((k) => k.selected);
        // select > -1
        //   ? (this.groupForm.checktype = res.result[select].code)
        //   : (this.groupForm.checktype = ""),
        this.registerGroup = res.result;
      });
    },
    // 点击提交保存当前页面回调
    handleSubmitDialog() {
      // 分组不能为空
      if (this.groupList && this.groupList.length == 0) {
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
      if (this.suppleDate) {
        this.bodyForm.supplementstartdate = this.suppleDate[0];
        this.bodyForm.supplementenddate = this.suppleDate[1];
      }
      if (this.bodyForm.receptcode) {
        this.bodyForm.receptionname = this.receptitems.filter(
          (k) => k.code == this.bodyForm.receptcode
        )[0].name;
      }
      // console.log(this.bodyForm);
      // console.log(this.groupList, "this.groupList");
      // let flag = false;
      // this.groupList.forEach((k) => {
      //   if (k.combineitems.length == 0) {
      //     flag = true;
      //   }
      // });
      // if (flag) {
      //   this.$message.warning("分组项目不允许为空!");
      //   return false;
      // }
      this.$refs["page_form"].validate((valid) => {
        if (valid) {
          if (this.addOrEdit == "edit") {
            setGroupUpdate({
              mainitem: this.bodyForm,
              groupitems: this.groupList,
              timeitems: this.apptimeData,
              supplementtimeitems: this.apptimeDataSupple,
              propertyitems: this.propertyitems.map((k) => {
                return { ...k, category: this.category };
              }),
              supplementpropertyitems: this.supplementpropertyitems.map((k) => {
                return { ...k, category: this.categorySupple };
              }),
            }).then((res) => {
              this.$message.success("更新成功!");
              this.addOrEdit = "edit";
              this.regid = res.result;
              this.handleEditCompanyDetail();
              // this.$emit("submit", false);
            });
          } else {
            getCompanyAdd({
              mainitem: this.bodyForm,
              groupitems: this.groupList,
              timeitems: this.apptimeData,
              supplementtimeitems: this.apptimeDataSupple,
              propertyitems: this.propertyitems.map((k) => {
                return { ...k, category: this.category };
              }),
              supplementpropertyitems: this.supplementpropertyitems.map((k) => {
                return { ...k, category: this.categorySupple };
              }),
            }).then((res) => {
              this.$message.success("保存成功!");
              this.addOrEdit = "edit";
              this.regid = res.result;
              this.handleEditCompanyDetail();
              // this.$emit("submit", false);
            });
          }
        }
      });
    },
    // 点击提交保存当前页面回调
    handleSubmitDialogClose() {
      // 分组不能为空
      if (this.groupList && this.groupList.length == 0) {
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
      if (this.suppleDate) {
        this.bodyForm.supplementstartdate = this.suppleDate[0];
        this.bodyForm.supplementenddate = this.suppleDate[1];
      }
      if (this.bodyForm.receptcode) {
        this.bodyForm.receptionname = this.receptitems.filter(
          (k) => k.code == this.bodyForm.receptcode
        )[0].name;
      }
      this.$refs["page_form"].validate((valid) => {
        if (valid) {
          if (this.addOrEdit == "edit") {
            setGroupUpdate({
              mainitem: this.bodyForm,
              groupitems: this.groupList,
              timeitems: this.apptimeData,
              supplementtimeitems: this.apptimeDataSupple,
              propertyitems: this.propertyitems.map((k) => {
                return { ...k, category: this.category };
              }),
              supplementpropertyitems: this.supplementpropertyitems.map((k) => {
                return { ...k, category: this.categorySupple };
              }),
            }).then((res) => {
              this.$message.success("更新成功!");
              this.handleEditCompanyDetail();
              this.$emit("submit", false);
            });
          } else {
            getCompanyAdd({
              mainitem: this.bodyForm,
              groupitems: this.groupList,
              timeitems: this.apptimeData,
              supplementtimeitems: this.apptimeDataSupple,
              propertyitems: this.propertyitems.map((k) => {
                return { ...k, category: this.category };
              }),
              supplementpropertyitems: this.supplementpropertyitems.map((k) => {
                return { ...k, category: this.categorySupple };
              }),
            }).then((res) => {
              this.$message.success("保存成功!");
              this.handleEditCompanyDetail();
              this.$emit("submit", false);
            });
          }
        }
      });
    },
    // 点击关闭当前页面回调
    handleCloseDialog() {
      this.$confirm("是否先保存数据?", "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning",
        closeOnClickModal: false,
        showClose: false,
      })
        .then(() => {
          this.handleSubmitDialogClose();
        })
        .catch(() => {
          this.$emit("close", false);
        });
    },
    // 点击保存套餐项目回调
    handleSubmitMedicalItems(data) {
      if (this.popupSettings == "settings") {
        this.chooseGroup.choosecombineitems = data; // 赋值对象中
      } else {
        let codeList = data.map((k) => {
          return k.combinecode;
        });
        setCollectChargeInfoForNotSave(codeList).then((res) => {
          let resDataArr = res.data.map((k) => {
            return {
              ...k,
              setmealcode: data[0].setmealcode || "",
              setmealname: data[0].setmealname || "",
              discountflag: k.balanceflag,
            };
          });
          this.chooseGroup.combineitems = resDataArr; // 赋值对象中
          this.chooseGroup.originalprice = 0;
          this.chooseGroup.combineitems.forEach((k) => {
            this.chooseGroup.originalprice += k.price;
          });
        });
      }
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
    // 点击体检项目-添加项目回调-自选内容
    handleAddProjectCS() {
      if (!this.chooseGroup) {
        this.$message.error("请先勾选至少一个分组!");
        return false;
      }
      this.popupSettings = "settings";
      this.showProjectDialog = true; // 打开弹框
    },
    // 点击体检项目-添加项目回调
    handleAddProject() {
      if (!this.chooseGroup) {
        this.$message.error("请先勾选至少一个分组!");
        return false;
      }
      if (this.officerFlag) {
        this.$message.error("该单位为老干体检，不允许修改项目!");
        return false;
      }
      this.popupSettings = "";
      this.showProjectDialog = true; // 打开弹框
    },
    // 点击选择当前选中分组
    handleChooseGroup(item, index) {
      this.chooseGroup = item;
      this.active = index;
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
        this.groupList.splice(this.active, 1);
        // this.groupList.splice(delIndex, 1);
        this.chooseGroup = undefined;
        this.active = "";
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
      if (+this.groupForm.discount < 0 || +this.groupForm.discount > 1) {
        this.$message.error("分组折扣超出正常范围!,参考范围0-1");
        return;
      }
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
              // let editIndex = this.groupList.findIndex(
              //   (item) => this.groupForm.groupid == item.groupid
              // );
              this.groupList.splice(index, 1, this.groupForm);
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
            if (this.isPageStatus == "add") {
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
              let tempArr = JSON.parse(JSON.stringify(this.groupList));
              // if (this.groupForm.id) {
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
              // let editIndex = this.groupList.findIndex(
              //   (item) => this.groupForm.groupname == item.groupname
              // );
              this.groupList.splice(index, 1, this.groupForm);
              // }
              // else {
              //   let totalP = 0;
              //   this.groupList.forEach((k) => {
              //     totalP += k.grouptotal;
              //   });
              //   console.log(this.groupList, "groupList");
              //   console.log(this.chooseGroup, "this.chooseGroup");
              //   console.log(tempArr, "tempArr");
              //   if (this.chooseGroup) {
              //     let index = tempArr.findIndex((k) => {
              //       return this.chooseGroup.groupname == k.groupname;
              //     });
              //     index > -1 && tempArr.splice(index, 1);
              //   }
              //   // if (totalP + this.groupForm.grouptotal > this.bodyForm.total) {
              //   //   this.$message.warning("分组人数超过单位总体检人数!");
              //   //   return false;
              //   // }
              //   let flag = this.groupList.findIndex((k) => {
              //     return this.groupForm.groupname == k.groupname;
              //   });
              //   if (flag > -1) {
              //     // this.$message.warning("分组名称不能重复!");
              //     // return;
              //     this.groupList.splice(flag, 1, this.groupForm);
              //   } else {
              //     // 新增
              //     this.groupList.push({
              //       ...this.groupForm,
              //       id: this.groupList[this.groupList.length - 1].id + 1,
              //     });
              //   }
            }
          }
          this.handleResetGroupForm();
          this.chiladddialogFormVisible = false;
          // } else {
          //   return false;
          // }
        });
      }
      if (
        +this.groupForm.discount > 0 &&
        this.groupForm.combineitems.length > 0
      ) {
        this.groupForm.combineitems = this.groupForm.combineitems.map((k) => {
          return {
            ...k,
            discount: +this.groupForm.discount,
          };
        });
      }
      // this.handleResetGroupForm();
    },
    handleChangeItemRealtotal(item) {
      item.realtotal = +item.realtotal;
    },
    handleChangeMainDiscount() {
      if (this.groupList.length == 0) {
        this.$message.warning("当前单位暂无分组!");
        this.maindiscount = 1;
        return false;
      }
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        this.maindiscount = 1;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+this.maindiscount < min || +this.maindiscount > max) {
          this.$message.warning("超出当前用户打折范围!");
          this.maindiscount = 1;
          return false;
        }
      }

      for (let i = 0; i < this.groupList.length; i++) {
        this.groupList[i].discount = +this.maindiscount;
        if (
          +this.maindiscount > 0 &&
          this.groupList[i].combineitems.length > 0
        ) {
          this.groupList[i].combineitems.forEach((k) => {
            if (k.discountflag == 0) {
              k.discount = +this.maindiscount;
              k.discountprice = (+this.maindiscount * +k.price).toFixed(2);
            }
          });
        }
      }
    },
    handleChangeItemDiscount(item) {
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        item.discount = 1;
        item.combineitems.forEach((k) => {
          if (k.discountflag == 0) {
            k.discount = +item.discount;
            k.discountprice = (+item.discount * +k.price).toFixed(2);
          }
        });
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+item.discount < min || +item.discount > max) {
          this.$message.warning("超出当前用户打折范围!");
          item.discount = 1;
          item.combineitems.forEach((k) => {
            if (k.discountflag == 0) {
              k.discount = +item.discount;
              k.discountprice = (+item.discount * +k.price).toFixed(2);
            }
          });
          return false;
        }
      }
      // if (+item.discount < 0 || +item.discount > 1) {
      //   this.$message.error("分组折扣超出正常范围!,参考范围0-1");
      //   return;
      // }
      if (+item.discount > 0 && item.combineitems.length > 0) {
        item.combineitems.forEach((k) => {
          if (k.discountflag == 0) {
            k.discount = +item.discount;
            k.discountprice = (+item.discount * +k.price).toFixed(2);
          }
        });
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
        sendtype: "现场打印",
        remark: "",
        checktype: "1",
        combineitems: [],
        realtotal: 0,
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
        this.groupForm.discountprice = this.groupForm.discountprice.toFixed(2);
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/AddOrEdit.scss";
.current_row {
  background-color: #e6f1fa;
  border: 1px solid #0076c8 !important;
}
.unit_item {
  display: flex !important;
  .form_box {
    width: calc(100% - 80px);
  }
  .link_btn {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .copy_group {
    width: 80px;
  }
  // 选中类
}
.top_s {
  height: 35px;
  display: flex;
}
.table_box {
  height: 360px !important;
  display: flex;
  .table_l {
    height: 100%;
    width: 49%;
  }
  .table_r {
    height: 100%;
    width: 49%;
  }
  .table_r {
    margin-left: 10px;
    .table_r_el {
      height: calc(100% - 40px);
    }
    .table_b_btn {
      margin-top: 8px;
      height: 30px;
      text-align: center;
    }
  }
}
.date_box {
  width: 100%;
  display: flex;
  .el-button {
    margin-left: 5px;
  }
}
.apptime_dia {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .apptime_content {
      height: 580px;
      display: flex;
      .acdate_box {
        height: 100%;
        width: calc(30% - 18px);
        .title_select {
          display: flex;
          align-items: center;
          height: 40px;
          .dbtitle {
            font-size: 16px;
            margin-right: 8px;
          }
        }
        .datecheck_box {
          width: 100%;
          height: calc(100% - 40px);
          overflow-y: auto;
          margin-top: 12px;
          .datecheck_item {
            margin: 8px 0;
            display: flex;
            align-items: center;
            .el-checkbox__label {
              display: flex;
              align-items: center;
            }
          }
        }
      }
      .apptime_table {
        height: 100%;
        width: 70%;
        margin-right: 18px;
        .week_box {
          .el-checkbox {
            width: 65px;
            margin: 0 5px 0 0;
          }
        }
      }
    }
  }
  /deep/.el-dialog__footer {
    padding: 10px;
    text-align: center;
  }
}
.cust_dialog {
  /deep/.el-dialog__header {
    padding: 10px;
  }
  /deep/.el-dialog__body {
    padding: 0 10px;
    .cdcontent {
      height: 430px;
      .cdctop {
        height: 30px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        .cdctinput {
          display: flex;
          align-items: center;
          .cdctititle {
            width: 130px;
          }
          .el-input {
            width: 250px;
          }
        }
      }
      .cdctable {
        height: calc(100% - 40px);
        .combineitems_table {
          height: 100%;
          .del_com {
            cursor: pointer;
            color: #3188ea;
          }
          .delDelCom {
            cursor: pointer;
            color: #3188ea;
          }
          .discount_input {
            width: 100%;
            height: 28px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            outline: none;
            background-color: #fff;
          }
          .discount_input:focus {
            border: 1px solid #0076c8;
          }
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
