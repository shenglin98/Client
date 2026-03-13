<template>
  <div class="flex-column">
    <div class="app-container flex-item flex-column">
      <div class="flex-item">
        <el-card class="box-card" style="height: 100%">
          <div style="text-align: right; margin-top: 10px">
            <el-button size="mini" type="primary" plain @click="dialogitem">调整项目</el-button>
            <el-button size="mini" type="primary" :loading="loadBtn" plain @click="handleGetSetmealPrice">同步数据</el-button>
            <el-button size="mini" type="primary" plain @click="handleSetDiscount">折 扣</el-button>
            <el-button size="mini" type="primary" :loading="saveLoading" plain @click="btnsaveorupdate">保存</el-button>
            <el-button size="mini" type="primary" plain @click="btnclose">关闭</el-button>
          </div>
          <el-row :gutter="0" class="box_info">
            <el-row :gutter="50">
              <el-col :span="16" style="height: 100%; overflow-y: auto">
                <el-form ref="diccombinedataForm" class="diccombinedata_form" :model="temp" :rules="setdictionaryRules" el="setdictionary-tayps-form" label-width="120px">
                  <el-form-item>
                    <el-tag type="info" style="font-weight: bold">基本信息</el-tag>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="code" label="套餐编码">
                        <el-input size="small" v-model="temp.code" placeholder="系统自动生成" :disabled="true"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="name" label="套餐名称">
                        <el-input size="small" v-model="temp.name"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="price" label="套餐价格">
                        <el-input size="small" v-model="temp.price" @input="inputnum"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="companyprice" label="单位价格">
                        <el-input size="small" v-model="temp.companyprice" oninput="value=value.replace(/[^\d.]/g, '').replace(/\.{2,}/g, '.').replace('.', '$#$').replace(/\./g, '').replace('$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').replace(/^\./g, '')"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="sex" label="性别">
                        <el-select filterable size="small" v-model="temp.sex" style="width: 100%">
                          <el-option v-for="(item, index) in sexarr" :key="index" :value="item.key" :label="item.name"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="status" label="启用状态">
                        <el-select filterable size="small" v-model="temp.status" style="width: 100%">
                          <el-option v-for="(item, index) in statusarr" :key="index" :value="item.key" :label="item.name"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="seqno" label="排序">
                        <el-input size="small" v-model="temp.seqno" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="remark" label="说明">
                        <el-input size="small" v-model="temp.remark"></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="标签">
                        <el-input size="small" v-model="temp.label"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" label="适用人群">
                        <el-select v-model="temp.crowd" collapse-tags multiple placeholder="请选择">
                          <el-option v-for="(item, index) in crowdItems" :key="index" :label="item.name" :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item size="small" label="常用">
                        <el-select v-model="temp.commonlyused" collapse-tags multiple placeholder="请选择">
                          <el-option v-for="(item, index) in CommonlyusedItems" :key="index" :label="item.name" :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" label="从业类型">
                        <el-select v-model="temp.practicetype" collapse-tags multiple placeholder="请选择">
                          <el-option v-for="(item, index) in PracticetypeItems" :key="index" :label="item.name" :value="item.name">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item size="small" label="微信启用标志">
                        <el-select v-model="temp.wechatflag" placeholder="请选择">
                          <el-option label="不启用" :value="0"></el-option>
                          <el-option label="启用" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" label="体检中心">
                        <el-select v-model="temp.meccode" clearable placeholder="请选择" @change="handleChangeMeccode">
                          <el-option v-for="item in meccodeItems" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item size="small" label="预约时间">
                        <el-select v-model="temp.timeid" clearable collapse-tags multiple placeholder="请选择">
                          <el-option v-for="item in DicAppointmentCombinelist" :key="item.timeid" :label="item.timename" :value="item.timeid"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" label="套餐类型">
                        <el-select v-model="temp.settype" clearable placeholder="请选择">
                          <el-option v-for="item in settypeItems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item size="small" class="imgbox" label="详情图">
                        <!-- annex -->
                        <el-upload class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPploadSetmealurl2" ref="upload" :file-list="fileList" :auto-upload="false" accept=".jpg,.jpeg,.png">
                          <el-button slot="trigger" size="mini" type="primary" plain>选取图片</el-button>
                        </el-upload>
                        <el-link v-if="temp.setmealurl2" type="primary" class="filelink" target="_blank" :href="setmealurl2Url">{{ setmealurl2Name }}</el-link>
                        <el-button v-if="temp.setmealurl2" style="margin-left: 70px" size="mini" @click="handleDeletURL('setmealurl2')">删 除</el-button>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" class="imgbox" label="列表图">
                        <!-- annex -->
                        <el-upload class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPploadSetmealurl1" ref="upload" :file-list="fileList" :auto-upload="false" accept=".jpg,.jpeg,.png">
                          <el-button slot="trigger" size="mini" type="primary" plain>选取图片</el-button>
                        </el-upload>
                        <el-link v-if="temp.setmealurl1" type="primary" class="filelink" target="_blank" :href="setmealurl1Url">{{ setmealurl1Name }}</el-link>
                        <el-button v-if="temp.setmealurl1" style="margin-left: 70px" size="mini" @click="handleDeletURL('setmealurl1')">删 除</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="checkType" label="体检分类">
                        <el-select v-model="temp.checkType" clearable placeholder="请选择" size="mini">
                          <el-option v-for="item in checkType" :key="item.key" :label="item.name" :value="item.key"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="remark" label="体检类型">
                        <el-select v-model="temp.checkType1" clearable placeholder="请选择" size="mini">
                          <el-option v-for="item in checkType1Items" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item prop="remark" size="mini" label="启用时间段">
                        <el-date-picker @change="handleChangeDate" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" style="width: 100%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item prop="remark" label="是否允许自选">
                        <el-select size="mini" v-model="temp.autochoice" clearable placeholder="请选择">
                          <el-option label="允许" :value="0"></el-option>
                          <el-option label="不允许" :value="1"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="套餐定额">
                        <el-input size="small" v-model="temp.quota"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="mini" label="恢复原价">
                        <el-date-picker v-model="temp.resetquotatime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" style="width: 100%">
                        </el-date-picker>
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <!-- <el-row>
                    <el-col :span="12" v-if="temp.picture">
                      <el-form-item size="small" label="图片预览">
                        <a :href="fileUrl" target="_blank">{{ fileUrl }}</a>
                        <el-link
                          v-if="temp.picture"
                          type="primary"
                          class="filelink"
                          target="_blank"
                          :href="fileUrl"
                          >{{ fileName }}</el-link
                        >
                      </el-form-item>
                    </el-col>
                  </el-row> -->
                  <el-row>
                    <el-col :span="12">
                      <el-form-item size="small" class="richtext" label="套餐简介">
                        <vue-tinymce :key="tinymceFlag1" v-model="temp.setmealdes" :setting="setting" />
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item size="small" class="richtext" label="套餐须知">
                        <vue-tinymce :key="tinymceFlag2" v-model="temp.setmealwarnmsg" :setting="setting" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <el-form-item size="small" class="richtext" label="体检流程须知">
                        <vue-tinymce :key="tinymceFlag3" v-model="temp.processwarn" :setting="setting" />
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </el-col>
              <el-col :span="8" style="margin-left: 0">
                <el-tag type="info" style="font-weight: bold; margin-bottom: 10px; margin-top: 10px">已包含{{ count }}个组合</el-tag>
                <el-table height="calc(100vh - 315px)" ref="childatamainTable" :key="tableKey" :data="multipleSelection" v-loading="listLoading" fit highlight-current-row style="width: 100%; color: #000" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                  <el-table-column prop="code" label="组合编码" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="name" label="组合名称" width="250px" show-overflow-tooltip></el-table-column>
                  <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip></el-table-column>
                  <el-table-column label="折扣">
                    <template slot-scope="scope">
                      <input type="text" :class="`discount_input discount_${scope.$index}`" :max="1" :min="0" v-model.lazy="scope.row.discount" @focus="handleDiscountFocus" @keyup.enter="handleDiscountLower(scope.row, scope.$index)" @keyup.down="handleDiscountLower(scope.row, scope.$index)" @keyup.up="handleDiscountUpper(scope.row, scope.$index)" @change="handleChangeDiscount(scope.row)" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="price" label="折后价" show-overflow-tooltip>
                    <template slot-scope="scope">
                      {{ +scope.row.price * +scope.row.discount }}
                    </template>
                  </el-table-column>
                </el-table>
                <div class="bottom_info">
                  <div>总数：{{ multipleSelection.length || 0 }} 个</div>
                  <div>折后价：{{ multipleSelectionDic || 0 }} 元</div>
                  <div>总价：{{ temp.price || 0 }} 元</div>
                </div>
                <!-- <el-form :model="ruleForm" ref="ruleForm" :rules="setdictionaryRules" label-width="120px">
                  <el-form-item>
                    <el-tag type="info" style="font-weight: bold;">已包含{{ count }}个组合</el-tag>
                  </el-form-item>
                  <el-form-item>
                    <el-table height="calc(100vh - 285px)" ref="childatamainTable" :key="tableKey" :data="multipleSelection" v-loading="listLoading" fit highlight-current-row style="width: 100%; border:1px solid #f0f0f0; color: #000;" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                      <el-table-column prop="code" label="组合编码" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="name" label="组合名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                      </el-table-column>
                      <el-table-column prop="sex" label="性别" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <span> {{   scope.row.sex==0?"全部":scope.row.sex==1?"男":scope.row.sex==2?"女":"" }}</span>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form> -->
              </el-col>
            </el-row>
          </el-row>
        </el-card>

        <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="1300px" title="添加组合" :visible.sync="addDialog" @close="handleCloseCombin" :show-close="false">
          <div class="filter-container" style="white-space: nowrap; overflow-x: auto">
            <el-input @keyup.enter.native="handleFilter" size="mini" style="width: 200px" class="filter-item" :placeholder="'名称'" v-model="listQuery.key">
            </el-input>

            <el-button class="filter-item" size="mini" v-waves icon="el-icon-search" @click="handleFilter">搜索</el-button>
          </div>
          <br />
          <el-row style="height: 700px">
            <el-col :span="11" style="height: calc(100% - 60px)">
              <el-tag type="info" style="font-weight: bold">组合信息</el-tag>
              <br />
              <br />
              <el-table height="100%" ref="partmainTable" :key="tableKey" :data="tablelist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="parthandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column prop="code" label="组合编码" placeholder="系统自动生成" show-overflow-tooltip>
                </el-table-column>
                <el-table-column width="200" prop="name" label="组合名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip>
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
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="2" style="height: calc(100% - 60px)">
              <div style="text-align: center; margin-top: 100px">
                <el-button size="mini" @click="ascsort" type="primary">↑</el-button>
                <br />
                <br />
                <br />
                <el-button size="mini" @click="dessort" type="primary">↓</el-button>
              </div>
            </el-col>
            <el-col :span="11" style="height: calc(100% - 60px)">
              <el-tag type="info" style="font-weight: bold">已包含{{ count }}个组合</el-tag>
              <br />
              <br />
              <el-table height="100%" ref="chilmainTable" @row-click="rowClick" :default-sort="{ prop: 'seqno', order: 'ascending' }" :key="tableKey" :data="selectSetmenu" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="chilhandleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <!-- <el-table-column label="序号" type="index" width="50"></el-table-column> -->
                <el-table-column prop="code" label="组合编码" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="name" label="组合名称" width="200" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="deptname" label="科室名称" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="price" label="组合价格" show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="sex" label="性别" show-overflow-tooltip>
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
                      }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer" style="text-align: center;">
            <el-button size="mini" @click="handleCloseCombin">取 消</el-button>
            <el-button size="mini" type="primary" @click="handleConfirmCombin">确 定</el-button>
          </span>
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
      </div>
    </div>
  </div>
</template>

<script>
import { jump } from "@/utils/jumpRoute";
import * as setdictionary from "@/api/setdictionary";
import * as projectdictionary from "@/api/projectdictionary";
import waves from "@/directive/waves"; // 水波纹指令
import { setFilesUpload } from "@/api/company_register.js";
import { getDictionaryDicLoad } from "@/api/projectdictionary2.js";
import { getPublicConfig } from "@/api/customermanage.js";
import * as users from "@/api/users";
import * as dicpubdictionary from "@/api/dictionary";
import * as dicappointment from "@/api/dicappointment";
import { getDicCombineList } from "@/api/projectdictionary2.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import {
  setCollectChargeInfoForNotSave,
  CollectChargeInfoForNotSaveByFix,
} from "@/api/personalregister.js";
export default {
  directives: {
    waves,
  },
  data() {
    return {
      conditionDate: [],
      discountProperty: [],
      tinymceFlag1: 1,
      tinymceFlag2: 1,
      tinymceFlag3: 1,
      setting: {
        menubar: false, //去除文件栏
        branding: false, //去除右下角的'由tinymce驱动'
        elementpath: false, //左下角的当前标签路径
        statusbar: false, // 禁用状态栏
        language: "zh_CN", //本地化设置
        language_url:
          "https://lab.uxfeel.com/node_modules/tinymce/langs/zh_CN.js", //使用language_url会相对灵活
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar:
          "undo redo | fullscreen | formatselect alignleft aligncenter alignright alignjustify | link unlink | numlist bullist | image media table | fontselect fontsizeselect forecolor backcolor | emoticons | bold italic underline strikethrough | indent outdent | superscript subscript | removeformat ",
        toolbar_drawer: "sliding",
        quickbars_selection_toolbar:
          "removeformat  | bold italic underline strikethrough | fontsizeselect forecolor backcolor",
        quickbars_selection_toolbar: "bold forecolor backcolor",
        quickbars_insert_toolbar: true,
        plugins: "quickbars",
        plugins: "link image media table lists fullscreen quickbars emoticons",
        height: "100%",
        setup: function (editor) {
          editor.on("focus", function (e) {
            console.log("触发");
          });
        },
      }, // 富文本配置器
      fileList: [], // bodyForm.annex
      fileUrl: "", //文件预览路径
      fileName: "", //文件预览路径
      setmealurl1Url: "", //文件预览路径
      setmealurl1Name: "", //文件预览路径
      setmealurl2Url: "", //文件预览路径
      setmealurl2Name: "", //文件预览路径
      value: [],
      listQuery: {
        // 查询条件
        key: "",
        page: 1,
        limit: 10000,
      },
      temp: {
        code: "",
        name: "",
        price: 0,
        companyprice: 0,
        sex: 0,
        remark: "",
        status: 0,
        pycode: "",
        wbcode: "",
        seqno: 0,
        picture: "",
        setmealurl1: "",
        fileid1: "",
        setmealurl2: "",
        fileid2: "",
        label: "",
        crowd: [],
        meccode: "",
        wechatflag: 0,
        quota: "",
        settype: "",
        setname: "",
        commonlyused: [],
        practicetype: [],
        combineitems: [],
        timeid: [],
        autochoice: 0,
        opendate: "",
        closedate: "",
        resetquotatime: "",
        checkType: "",
        checkType1: "",
      },
      saveLoading: false,
      count: 0,
      listLoading: false,
      tablelist: [],
      addDialog: false,
      dialogStatus: "",
      deptItems: [],
      settypeItems: [],
      tableKey: 0,
      selectrow: {},
      multipleSelection: [],
      selectSetmenu: [],
      meccodeItems: [],
      multipletemp: [],
      comprice: 0,
      DicAppointmentCombinelist: [],
      crowdItems: [
        { name: "全年龄段" },
        { name: "少年儿童（12岁及以下）" },
        { name: "青少年（13-20岁）" },
        { name: "青年（21-30岁）" },
        { name: "中青年（21-40岁）" },
        { name: "中年（31-50岁）" },
        { name: "中老年（41-50岁）" },
        { name: "老年（61岁以上）" },
      ],
      CommonlyusedItems: [
        { name: "检后复查" },
        { name: "多发病" },
        { name: "常规" },
        { name: "常规体检" },
        { name: "常见病" },
        { name: "肿瘤筛查" },
        { name: "自由组合" },
        { name: "已婚女性" },
        { name: "男性" },
        { name: "自由选项" },
      ],
      PracticetypeItems: [{ name: "高端商务" }],
      setdictionaryRules: {
        name: [
          { required: true, message: "套餐名称不能为空", trigger: "blur" },
        ],
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        checkType: [
          { required: true, message: "请选择体检分类", trigger: "change" },
        ],
      },
      sexarr: [
        { key: 0, name: "未知" },
        { key: 1, name: "男" },
        { key: 2, name: "女" },
      ],
      guideprintarr: [
        { key: 0, name: "打印" },
        { key: 1, name: "不打印" },
      ],
      collectflagarr: [
        { key: 0, name: "不采集" },
        { key: 1, name: "采集" },
      ],
      resulttypearr: [
        { key: "01", name: "基础检查" },
        { key: "02", name: "常规检验" },
        { key: "03", name: "细菌检验" },
        { key: "04", name: "功能检查" },
      ],
      viewgrouparr: [
        { key: "1", name: "基础类" },
        { key: "2", name: "检验类" },
        { key: "3", name: "功能类" },
      ],
      resultinputarr: [
        { key: 0, name: "手工输入" },
        { key: 1, name: "接口获取" },
      ],
      statusarr: [
        { key: 0, name: "启用" },
        { key: 1, name: "停用" },
      ],
      checkType: [
        { key: 0, name: "通用" },
        { key: 1, name: "常规" },
        { key: 2, name: "职业病" },
        { key: 3, name: "活动套餐" },
      ],
      ruleForm: {
        infiledList: [],
      },
      dialogPvVisible: false,
      pvData: [],
      checkType1Items: [],
      discountProperty: [],
      showDiscount: false,
      discountValue: 0,
      loadBtn: false,
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
    multipleSelectionDic() {
      let price = 0;
      for (let i = 0; i < this.multipleSelection.length; i++) {
        price +=
          +this.multipleSelection[i].price *
          +this.multipleSelection[i].discount;
      }
      return price.toFixed(2);
    },
  },
  mounted() {
    const id = this.$route.params && this.$route.params.id;
    if (id == undefined || id == "" || id == null) {
      this.dialogStatus = "create";
    } else {
      this.dialogStatus = "update";
    }
    this.init();
    getDictionaryDicLoad({ tableName: "Dic_Medical_center" }).then((res) => {
      if (!res.data) return false;
      this.meccodeItems = res.data;
    });
    getPublicConfig({ cc: "SetType" }).then((res) => {
      this.settypeItems = res.result;
    });
    this.dialogStatus == "create" &&
      getSysConfigInfo({ cc: "Sys_File_ChargeCode" }).then((res) => {
        if (!res.result) return;
        let cailiaofeicode = res.result.split(",")[1];
        if (cailiaofeicode) {
          getDicCombineList({
            page: 1,
            limit: 1000000,
            key: "",
            deptname: "",
            filterStatus: true,
          }).then((res) => {
            this.cailiaofei = res.data.filter((k) => {
              return k.code === cailiaofeicode;
            })[0];
            this.cailiaofei &&
              this.multipleSelection.push({
                ...this.cailiaofei,
                combinecode: this.cailiaofei.code,
                combinename: this.cailiaofei.name,
                discount: 1,
                discountprice: this.cailiaofei.price * 1,
              });
          });
        }
      });
    this.loaddicpubdictionaryTypes();
    this.handleGetUserPropertyValues();
  },
  created() {},
  methods: {
    handleConfirmCombin() {
      if (this.selectSetmenu.length == 0) {
        this.$message.warning("请先勾选项目!");
        return;
      }
      let codeList = this.selectSetmenu.map((k) => {
        return k.code;
      });
      setCollectChargeInfoForNotSave(codeList)
        .then((res) => {
          let resDataArr = res.data.map((k) => {
            return {
              ...k,
              code: k.combinecode,
              name: k.combinename,
            };
          });
          this.multipleSelection = resDataArr; // 赋值对象中
          this.selectSetmenu = [];
          this.temp.price = 0;
          resDataArr.forEach((k) => {
            this.temp.price += k.price;
          });
          this.addDialog = false;
        })
        .catch(() => {
          this.addDialog = false;
        });
    },
    // 清空图片
    handleDeletURL(setmealurl) {
      if (setmealurl == "setmealurl2") {
        this.setmealurl2Url = "";
        this.setmealurl2Name = "";
        this.temp.setmealurl2 = "";
      } else {
        this.setmealurl1Url = "";
        this.setmealurl1Name = "";
        this.temp.setmealurl1 = "";
      }
      this.$message.success("清空成功");
    },
    handleGetSetmealPrice() {
      this.loadBtn = true;
      setdictionary
        .GetSetmealPrice({ code: this.temp.code })
        .then((res) => {
          this.loadBtn = false;
          this.$message.success(res.message);
          this.temp.price = res.result;
        })
        .catch((err) => {
          this.loadBtn = false;
          this.init();
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
    // 设置项目折扣弹框回调
    handleSetDiscount() {
      if (this.multipleSelection.length == 0) {
        this.$message.warning("请先添加体检项目!");
        return false;
      }
      this.discountValue = 1;
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
      this.multipleSelection.forEach((k) => {
        // if (k.discountflag === 0) {
        k.discount = +this.discountValue;
        // }
      });
      this.$message.success("操作成功!");
      this.handleCloseDiscount();
    },
    // 折扣弹框关闭回调
    handleCloseDiscount() {
      this.showDiscount = false;
    },
    handleChangeMeccode(value) {
      dicappointment
        .getList("DicAppointmentTime", { meccod: value })
        .then((response) => {
          this.DicAppointmentCombinelist = response.result.filter((k) => {
            return k.appointtype == 2;
          });
        });
    },
    // 获取体检类型
    loaddicpubdictionaryTypes() {
      dicpubdictionary
        .getList({
          key: "",
          id: "",
          tableName: "Dic_pub_dictionary",
        })
        .then((res) => {
          if (!res.data) return;
          let flag = res.data.filter((k) => k.id == "10003")[0];
          flag && (this.checkType1Items = flag.detailItems);
        });
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(arr) {
      if (arr) {
        this.temp.opendate = arr[0];
        this.temp.closedate = arr[1];
      } else {
        this.temp.opendate = "";
        this.temp.closedate = "";
      }
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
    handleDiscountFocus(e) {
      if (!e) return;
      e.currentTarget && e.currentTarget.select();
    },
    // 单项打折键盘↓键回调
    handleDiscountLower(data, index) {
      this.$nextTick(() => {
        if (index === this.multipleSelection.length - 1) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_${index + add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = 0; i < this.multipleSelection.length; i++) {
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
    // 单项打折键盘↑键回调
    handleDiscountUpper(data, index) {
      this.$nextTick(() => {
        if (index === 0) return;
        let add = 1;
        let pDom = document.querySelector(`.discount_${index - add}`);
        if (!pDom) return;
        if ($(pDom).is(":disabled")) {
          for (let i = add; i < this.multipleSelection.length; i++) {
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
    handleChangeSettype(value) {
      if (!value) {
        this.temp.setname = "";
      } else {
        let index = this.settypeItems.filter((k) => {
          return k.unioncode == value;
        })[0];
        index && (this.temp.setname = index.name);
      }
      console.log(this.temp, "this.temp");
    },
    handleCloseCombin() {
      this.selectSetmenu = [];
      this.addDialog = false;
      // if (this.multipleSelection.length > 0) {
      //   this.temp.price = 0;
      //   this.multipleSelection.forEach((k) => {
      //     this.temp.price += k.price;
      //   });
      // }
    },
    // 限制只能在输入框中输入小数点后两位
    inputnum() {
      if (this.temp.price) {
        this.temp.price = this.temp.price.replace(
          /^(\-)*(\d+)\.(\d\d).*$/,
          "$1$2.$3"
        );
        console.log(this.temp.price, "this.temp.price");
      }
    },
    // 上传触发回调
    handleOnPploadSetmealurl1(params, index, key) {
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(params.raw.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return false;
      }
      //图片大小
      // const isLt2M = params.size / 1024 < 10;
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过10kb");
      //   return false;
      // }
      let data = new FormData();
      data.append("files", params.raw);
      setFilesUpload(data).then((res) => {
        this.$message.success(res.message);
        this.setmealurl1Url = res.result[0].fileUrl;
        this.setmealurl1Name = res.result[0].fileName;
        this.temp.setmealurl1 = res.result[0].fileUrl;
        this.temp.fileid1 = res.result[0].id;
      });
    },
    // 上传触发回调
    handleOnPploadSetmealurl2(params, index, key) {
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(params.raw.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return false;
      }
      //图片大小
      // const isLt2M = params.size / 1024 < 10;
      // if (!isLt2M) {
      //   this.$message.error("上传图片大小不能超过10kb");
      //   return false;
      // }
      let data = new FormData();
      data.append("files", params.raw);
      setFilesUpload(data).then((res) => {
        this.$message.success(res.message);
        this.setmealurl2Url = res.result[0].fileUrl;
        this.setmealurl2Name = res.result[0].fileName;
        this.temp.setmealurl2 = res.result[0].fileUrl;
        this.temp.fileid2 = res.result[0].id;
      });
    },
    // 上传触发回调
    handleOnPpload(params, index, key) {
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(params.raw.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return false;
      }
      //图片大小
      const isLt2M = params.size / 1024 < 10;
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过10kb");
        return false;
      }
      let data = new FormData();
      data.append("files", params.raw);
      setFilesUpload(data).then((res) => {
        this.$message.success(res.message);
        console.log(res);
        this.fileUrl = res.result[0].fileUrl;
        this.fileName = res.result[0].fileName;
        this.temp.picture = res.result[0].fileUrl;
      });
    },
    init() {
      const id = this.$route.params && this.$route.params.id;
      this.temp.code = id;
      this.detailslist(id);
    },
    ascsort() {
      for (let index = 0; index < this.selectSetmenu.length; index++) {
        const element = this.selectSetmenu[index];
        if (
          element.code == this.selectrow.code &&
          this.selectSetmenu[index - 1] != undefined
        ) {
          var temp = this.selectSetmenu[index - 1];
          this.selectSetmenu[index - 1] = element;
          this.selectSetmenu[index] = temp;
        }
      }
      this.selectSetmenu = Object.assign([], this.selectSetmenu);
    },
    btnclose() {
      jump(this, "/setdictionary/index");
    },
    dessort() {
      var ind = 0;
      this.selectSetmenu.forEach((element, index) => {
        if (
          element.code == this.selectrow.code &&
          this.selectSetmenu[index + 1] != undefined
        ) {
          ind = index;
        }
      });
      if (
        this.selectrow.code == this.selectSetmenu[ind].code &&
        this.selectSetmenu[ind + 1] != undefined
      ) {
        var nowtemp = this.selectSetmenu[ind];
        var temp = this.selectSetmenu[ind + 1];
        this.selectSetmenu[ind] = temp;
        this.selectSetmenu[ind + 1] = nowtemp;
      }
      this.selectSetmenu = Object.assign([], this.selectSetmenu);
    },
    detailslist() {
      var code = {
        code: this.temp.code,
      };
      setdictionary.dicsetmealload(code).then((response) => {
        if (
          response.result != null &&
          response.result != undefined &&
          response.result != ""
        ) {
          this.temp = JSON.parse(JSON.stringify(response.result));
        }
        this.temp.price = 0;
        this.temp.combineitems.forEach((d) => {
          var multtemp = {
            code: d.combinecode,
            name: d.combinename,
            deptname: d.deptname,
            price: d.price,
            sex: d.sex,
            ...d,
          };
          this.temp.price += d.price;
          this.multipleSelection.push(multtemp);
        });
        this.count = this.multipleSelection.length;
        if (this.dialogStatus == "update") {
          this.temp.price = response.result.price;
        }
        if (this.temp.picture) {
          this.fileUrl = this.temp.picture;
          this.fileName = this.temp.picture;
        }
        if (this.temp.setmealurl1) {
          this.setmealurl1Url = this.temp.setmealurl1;
          this.setmealurl1Name = this.temp.setmealurl1;
        }
        if (this.temp.setmealurl2) {
          this.setmealurl2Url = this.temp.setmealurl2;
          this.setmealurl2Name = this.temp.setmealurl2;
        }
        if (this.temp.crowd && this.temp.crowd.length > 0) {
          this.temp.crowd = this.temp.crowd.split("|");
        } else {
          this.temp.crowd = "";
        }
        if (this.temp.practicetype && this.temp.practicetype.length > 0) {
          this.temp.practicetype = this.temp.practicetype.split("|");
        } else {
          this.temp.practicetype = "";
        }
        if (this.temp.commonlyused && this.temp.commonlyused.length > 0) {
          this.temp.commonlyused = this.temp.commonlyused.split("|");
        } else {
          this.temp.commonlyused = "";
        }
        if (this.temp.timeid && this.temp.timeid.length > 0) {
          this.temp.timeid = this.temp.timeid.split("|");
        } else {
          this.temp.timeid = "";
        }
        this.conditionDate = [this.temp.opendate, this.temp.closedate];
        this.temp.meccode &&
          dicappointment
            .getList("DicAppointmentTime", { meccod: this.temp.meccode })
            .then((response) => {
              this.DicAppointmentCombinelist = response.result.filter((k) => {
                return k.appointtype == 2;
              });
            });
      });
    },
    handleFilter() {
      this.$refs.partmainTable.clearSelection();
      if (
        this.listQuery.key != "" &&
        this.listQuery.key != undefined &&
        this.listQuery.key != null
      ) {
        // var reg = new RegExp(this.listQuery.key);
        projectdictionary.diccombineload(this.listQuery).then((response) => {
          this.tablelist = response.data.filter((k) => k.status != 1);
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
              }
            });
          });
          // if (
          //   this.tablelist.filter((item, index) => item.code.match(reg))
          //     .length > 0
          // ) {
          //   this.tablelist = Object.assign(
          //     [],
          //     this.tablelist.filter((item, index) => item.code.match(reg))
          //   );
          // }
          // if (
          //   this.tablelist.filter((item, index) => item.name.match(reg))
          //     .length > 0
          // ) {
          //   this.tablelist = Object.assign(
          //     [],
          //     this.tablelist.filter((item, index) => item.name.match(reg))
          //   );
          // }
          // if (
          //   this.tablelist.filter((item, index) => item.pycode.match(reg))
          //     .length > 0
          // ) {
          //   this.tablelist = Object.assign(
          //     [],
          //     this.tablelist.filter((item, index) => item.pycode.match(reg))
          //   );
          // }
          // if (
          //   this.tablelist.filter((item, index) => item.wbcode.match(reg))
          //     .length > 0
          // ) {
          //   this.tablelist = Object.assign(
          //     [],
          //     this.tablelist.filter((item, index) => item.wbcode.match(reg))
          //   );
          // }
          // if (
          //   this.tablelist.filter((item, index) => item.deptname.match(reg))
          //     .length > 0
          // ) {
          //   this.tablelist = Object.assign(
          //     [],
          //     this.tablelist.filter((item, index) => item.deptname.match(reg))
          //   );
          // }
        });
      } else {
        this.listLoading = true;
        projectdictionary.diccombineload(this.listQuery).then((response) => {
          this.tablelist = response.data.filter((k) => k.status != 1);
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
              }
            });
          });
          this.listLoading = false;
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
    rowClick(row) {
      this.selectrow = row;
    },
    dialogitem() {
      this.listLoading = true;
      projectdictionary.diccombineload(this.listQuery).then((response) => {
        response.data = response.data.filter((k) => k.status != 1);
        this.addDialog = true;
        if (this.temp.meccode) {
          response.data = response.data.map((k) => {
            return {
              ...k,
              discount: 1,
            };
          });
          this.tablelist = response.data.filter((k) => {
            return (
              (k.meccode === this.temp.meccode || k.meccode == "") &&
              k.status != 1
            );
          });
        } else {
          response.data = response.data.map((k) => {
            return {
              ...k,
              discount: 1,
            };
          });
          this.tablelist = response.data.filter((k) => {
            return k.status != 1;
          });
        }
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.forEach((b) => {
            this.tablelist.forEach((d) => {
              if (d.code == b.code) {
                this.tablelist.splice(this.tablelist.indexOf(d), 1);
                // this.$nextTick(() => {
                //   this.$refs.partmainTable.toggleRowSelection(d, true);
                // });
              }
            });
          });
        }
        this.selectSetmenu = JSON.parse(JSON.stringify(this.multipleSelection));
        this.listLoading = false;
      });
    },
    parthandleSelectionChange(val) {
      val.forEach((d) => {
        this.tablelist.forEach((b) => {
          if (d.code == b.code) {
            this.tablelist.splice(this.tablelist.indexOf(b), 1);
            this.selectSetmenu.push(b);
            // this.multipleSelection.push(b);
            // this.temp.price += b.price;
          }
        });
      });
      this.count = this.selectSetmenu.length;
      // this.count = this.multipleSelection.length;
      this.temp.itemtotal = this.count;
    },
    chilhandleSelectionChange(val) {
      console.log(val);
      val.forEach((d) => {
        this.selectSetmenu.forEach((b) => {
          if (d.code == b.code) {
            this.selectSetmenu.splice(this.selectSetmenu.indexOf(b), 1);
            // this.multipleSelection.splice(this.multipleSelection.indexOf(b), 1);
            this.tablelist.push(b);
            // this.temp.price -= b.price;
          }
        });
      });
      this.count = this.selectSetmenu.length;
    },
    btnsaveorupdate() {
      if (this.multipleSelection.length > 0) {
        var arr = this.multipleSelection.map((d) => {
          return {
            combinecode: d.code,
            discount: d.discount,
          };
        });
        // this.multipleSelection.forEach((d) => {
        //   arr.push(d.code);
        // });
        this.temp.combineitems = arr;
      } else {
        this.temp.combineitems = arr;
      }
      if (
        this.temp.code == "" ||
        this.temp.code == undefined ||
        this.temp.code == null
      ) {
        this.$refs["diccombinedataForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            console.log(this.temp, "this.temp");
            if (Array.isArray(this.temp.crowd) && this.temp.crowd.length > 0) {
              this.temp.crowd = this.temp.crowd.join("|");
            } else {
              this.temp.crowd = "";
            }
            if (
              Array.isArray(this.temp.commonlyused) &&
              this.temp.commonlyused.length > 0
            ) {
              this.temp.commonlyused = this.temp.commonlyused.join("|");
            } else {
              this.temp.commonlyused = "";
            }
            if (
              Array.isArray(this.temp.practicetype) &&
              this.temp.practicetype.length > 0
            ) {
              this.temp.practicetype = this.temp.practicetype.join("|");
            } else {
              this.temp.practicetype = "";
            }
            if (
              Array.isArray(this.temp.timeid) &&
              this.temp.timeid.length > 0
            ) {
              this.temp.timeid = this.temp.timeid.join("|");
            } else {
              this.temp.timeid = "";
            }
            setdictionary.dicsetmealadd(this.temp).then(() => {
              this.$notify({
                title: "成功",
                message: "创建成功",
                type: "success",
              });
              this.saveLoading = false;
              jump(this, "/setdictionary/index");
            });
          }
        });
      } else {
        this.$refs["diccombinedataForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            if (Array.isArray(this.temp.crowd) && this.temp.crowd.length > 0) {
              this.temp.crowd = this.temp.crowd.join("|");
            } else {
              this.temp.crowd = "";
            }
            if (
              Array.isArray(this.temp.commonlyused) &&
              this.temp.commonlyused.length > 0
            ) {
              this.temp.commonlyused = this.temp.commonlyused.join("|");
            } else {
              this.temp.commonlyused = "";
            }
            if (
              Array.isArray(this.temp.practicetype) &&
              this.temp.practicetype.length > 0
            ) {
              this.temp.practicetype = this.temp.practicetype.join("|");
            } else {
              this.temp.practicetype = "";
            }
            if (
              Array.isArray(this.temp.timeid) &&
              this.temp.timeid.length > 0
            ) {
              this.temp.timeid = this.temp.timeid.join("|");
            } else {
              this.temp.timeid = "";
            }
            setdictionary.dicsetmealupdate(this.temp).then(() => {
              this.$notify({
                title: "成功",
                message: "修改成功",
                type: "success",
              });
              this.saveLoading = false;
              jump(this, "/setdictionary/index");
            });
          }
        });
      }
    },
  },
  watch: {},
};
</script>

<style rel="stylesheet/scss" lang="scss">
.custom-dialog {
  .el-dialog__footer {
    text-align: center;
  }
}

.dialog-mini .el-select {
  width: 100%;
}
.tab-form .el-form-item__error {
  position: relative;
  left: -20px;
  line-height: 1 !important;
}
.bottom_info {
  height: 30px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 0 15px;
}
.diccombinedata_form {
  .el-form-item {
    margin-bottom: 10px;
    .el-select {
      width: 100%;
    }
  }
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
.richtext {
  .el-form-item__content {
    height: 200px;
  }
}
.imgbox {
  .el-form-item__content {
    display: flex;
    .el-link {
      width: 200px;
      margin-left: 8px;
      .el-link--inner {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
}
.box-card {
  .el-card__body {
    height: 100%;
    .box_info {
      height: calc(100% - 40px) !important;
      .el-row {
        height: 100%;
      }
    }
  }
}
</style>
