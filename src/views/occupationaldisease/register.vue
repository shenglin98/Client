<template>
  <div class="personal_register">
    <div class="pageReg" v-if="!showQuestionnaire && !showHealthView">
      <!-- <div class="filter-container">
          <div class="filter-container-in">
            <permission-btn
              moduleName="personalregister"
              ref="personalregister"
              size="mini"
              v-on:btn-event="hadnleOnBtnClicked"
            ></permission-btn>
          </div>
        </div> -->
      <div class="filter-container">
        <div v-for="(btn, index) of buttons" :key="index">
          <!-- v-if="domIdArr.includes(btn.domId) && btn.domId != 'btnApply'" -->
          <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId)" class="print_box" placement="bottom" trigger="click">
            <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" :ref="btn.domId"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
            <div class="print_item" v-if="btn.domId != 'btnApply'" @click="hadnleOnBtnClicked(btn.domId)">
              打印
            </div>
            <div class="print_item" v-if="btn.domId != 'btnApply'" @click="handlePreview(btn.domId)">
              预览
            </div>
            <div class="print_item" v-if="btn.domId == 'btnApply'" @click="handlePrintApplyOneKey()">
              一键打印
            </div>
            <div class="print_item" v-if="btn.domId == 'btnApply'" @click="handlePrintApplyCheck()">
              勾选打印
            </div>
          </el-popover>
          <el-button type="primary" plain v-else :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" :ref="btn.domId" class="filter-item" :loading="loadingBtn" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
        </div>
      </div>
      <!-- 主体数据结构 -->
      <div class="app-container">
        <el-row class="bg_white">
          <!-- 主体内容左侧 -->
          <el-col :span="17">
            <div class="content_left" :class="[message != 'basic' ? 'height_h' : '']">
              <!-- 基本信息/其他信息 -->
              <div class="basicInfo">
                <div class="message">
                  <!-- tabs切换 -->
                  <el-radio-group v-model="message" @change="handleRadioButton" size="small" fill="#2a85ea">
                    <el-radio-button v-for="(item, index) in typelist" :key="index" :label="item.titlecode">{{
                      item.titlename }}</el-radio-button>
                  </el-radio-group>
                  <div class="card_operations" v-if="message == 'basic'">
                    <el-button type="primary" size="mini" :disabled="formFlag" plain style="margin-left: 10px">身份证</el-button>
                    <input type="text" class="read_card" v-model.lazy="inputIdCard" :disabled="formFlag" ref="read_idcard" @keyup.enter="handleEnterIdcard" />

                    <!-- @click="handleCopyCheckIn('all')" -->
                    <el-button type="primary" style="margin-left: 20px" size="mini" plain @click="
                      pageState == 'add'
                        ? handleCardReading()
                        : handleCardReadingEdit()
                      ">读卡</el-button>

                    <el-upload class="upload-demo" name='file' ref="pictureMaterialUpload" action='' :http-request="handlepictureMaterialExclChange">
                      <el-button type="primary" style="margin-left: 50px" size="mini" plain>批量导入excl</el-button>
                    </el-upload>
                    <!-- 读卡后显示复检项目弹框 -->
                    <el-dialog destroy-on-close :close-on-click-modal="false" title="历史体检记录" class="ReviewTableClas" :visible.sync="ReviewProjectDialogFlag" @close="ReviewProjectDialogClose">
                      <!-- ReviewProjectDialogData -->
                      <el-table :data="ReviewProjectDialogData" max-height="600" style="width: 100%; " :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                        <el-table-column label="操作" width="80">
                          <template v-slot='params'>
                            <span style="color: #409EFF; cursor: pointer; " @click="PeviewCopyProjectFun(params.row)">
                              复制项目
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="name" label="姓名">
                        </el-table-column>
                        <el-table-column prop="age" label="年龄">
                        </el-table-column>
                        <el-table-column prop="sex" label="性别">
                        </el-table-column>
                        <el-table-column prop="telephone" label="手机号">
                        </el-table-column>
                        <el-table-column prop="regdate" label="登记时间">
                        </el-table-column>
                      </el-table>
                    </el-dialog>
                  </div>

                </div>
                <!-- 个人信息 -->
                <div v-show="message == 'basic'" class="personal_info">
                  <!-- <div class="head">个人信息</div> -->
                  <!-- 主体表单form -->
                  <div class="info_body">
                    <div class="form_box">
                      <el-form ref="form" :disabled="formFlag" :model="personalForm" :rules="rulePersonalForm" label-width="95px">
                        <el-row>
                          <el-row>
                            <el-col :span="6">
                              <el-form-item size="mini" label="体检类型" :rules="[{ required: !personalForm.checkType }]">
                                <!-- @change="checktypeFun" -->
                                <el-select @change="checktypeFun" v-model="personalForm.checkType" placeholder="">
                                  <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6">
                              <el-form-item size="mini" label="团检类型">
                                <!-- @change="groupInspectionFun"  -->
                                <el-select v-model="personalForm.personalflag" @change="groupInspectionFun" placeholder="">
                                  <el-option :label="'个人'" :value="0"></el-option>
                                  <el-option :label="'团检'" :value="1"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6">
                              <el-form-item size="mini" label="检查类型">
                                <el-select v-model="personalForm.reviewtype" placeholder="">
                                  <el-option :label="'初检'" :value="0"></el-option>
                                  <el-option :label="'复检'" :value="1"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6">
                              <el-form-item size="mini" label="监护类型" :rules="[{ required: !personalForm.jobin }]">
                                <el-select v-model="personalForm.jobin" placeholder="">
                                  <el-option v-for="item in jobinItems" :key="item.code" :label="item.name" :value="item.code"></el-option>

                                  <!-- <el-option :label="'上岗前'" :value="'上岗前'"></el-option>
                                  <el-option :label="'在岗期间'" :value="'在岗期间'"></el-option>
                                  <el-option :label="'离岗时'" :value="'离岗时'"></el-option>
                                  <el-option :label="'应急检查'" :value="'应急检查'"></el-option>
                                  <el-option :label="'医学随访'" :value="'医学随访'"></el-option>
                                  <el-option :label="'离岗后健康检查'" :value="'离岗后健康检查'"></el-option> -->
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="体检号">
                              <el-input disabled v-model="personalForm.regid"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="姓名" :rules="[{ required: !personalForm.name }]">
                              <el-input v-model="personalForm.name" @keyup.enter.native="handleGetRegisterInfo"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="性别" :rules="[{ required: !personalForm.sex }]">
                              <el-select v-model="personalForm.sex" placeholder="">
                                <el-option v-for="item in sexarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label-width="55px" class="age" label="年龄" prop="numberlimit" :rules="[{ required: !personalForm.age }]">
                              <el-input type="number" class="age_num" v-model.number="personalForm.age" :min="1" :max="150" @change.native="handleChangeAge"></el-input>
                              <div style="
                                  width: 90px;
                                  height: 26px;
                                  border: 0.5px solid #c0c4cc;
                                  border-radius: 5px;
                                  padding-left: 6px;
                                  margin: 1px 0 0 6px;
                                ">
                                岁
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item class="birthday" size="mini" label="出生日期">
                              <el-date-picker style="width: 100%" value-format="yyyy-MM-dd" v-model="personalForm.birthday" type="date" placeholder="选择日期" :editable="true" @change="handleChangeBirthday">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="婚姻">
                              <el-select @change="handleSelectChange" v-model="personalForm.marriage" placeholder="">
                                <el-option v-for="item in marriagearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item size="mini" label="证件类型" :rules="[{ required: !personalForm.idcard }]">
                              <div style="display: flex;">
                                <el-select @change="handleSelectChange" v-model="personalForm.idtype" style="width:75% !important;" placeholder="">
                                  <el-option v-for="item in idtypeItems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                                <el-input v-model="personalForm.idcard" :disabled="pageState == 'edit'" @keyup.enter.native="handleChangeIdcard"></el-input>
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="联系电话">
                              <el-input v-model="personalForm.telephone"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="住址">
                              <el-input v-model="personalForm.address"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="工号">
                              <el-input v-model="personalForm.jobno"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="门诊卡">
                              <el-input v-model="personalForm.hiscode" disabled></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="单位名称" :rules="[{required:!personalForm.companycode}]">
                              <!-- allow-create 可手动输入 -->
                              <el-select filterable clearable @change="handleSelectComany" class="btn" v-model="personalForm.companycode" placeholder="">
                                <el-option v-for="item in companyitems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                              </el-select>
                              <el-button type="primary" size="mini" @click="AddIndustryComany">增加</el-button>
                              <el-dialog destroy-on-close :close-on-click-modal="false" title="单位名称字典新增" :visible.sync="AddIndustryDictionaryFlag" @close="UnitIndustryDialogClose">
                                <el-form ref="companyRefForm" :model="AddIndustryDialogData" label-position="right" label-width="130px">
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'单位编码'" prop="id">
                                        <el-input v-model="AddIndustryDialogData.companycode" :disabled="true" placeholder="系统自动生成"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'单位名称'" prop="companyname" :rules="[{required:!AddIndustryDialogData.companyname}]">
                                        <el-input v-model="AddIndustryDialogData.companyname"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'上级单位'" prop="companyhcode">
                                        <el-select v-model="AddIndustryDialogData.companyhcode" clearable filterable remote reserve-keyword :remote-method="handleRemoteMethod" :loading="selectLoading" @clear="handleRemoteMethod">
                                          <el-option v-for="item in organization_companyitems" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode">
                                          </el-option>
                                        </el-select>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'单位简称'" prop="shortname">
                                        <el-input v-model="AddIndustryDialogData.shortname"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'单位类型'">
                                        <el-select v-model="AddIndustryDialogData.typecode" clearable>
                                          <el-option v-for="(item, index) in typeitems" :key="index" :value="item.code" :label="item.name"></el-option>
                                        </el-select>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'联系人'" prop="contacts">
                                        <el-input v-model="AddIndustryDialogData.contacts"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'联系电话'" prop="telephone" :rules="[{required:!AddIndustryDialogData.telephone}]">
                                        <el-input v-model="AddIndustryDialogData.telephone"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'传真号码'" prop="faxnumber">
                                        <el-input v-model="AddIndustryDialogData.faxnumber"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'邮箱'" prop="email">
                                        <el-input v-model="AddIndustryDialogData.email"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>

                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'地址'" prop="address" :rules="[{required:!AddIndustryDialogData.address}]">
                                        <el-input v-model="AddIndustryDialogData.address"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'邮编'" prop="postalcode">
                                        <el-input v-model="AddIndustryDialogData.postalcode"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'注册名称'" prop="registername">
                                        <el-input v-model="AddIndustryDialogData.registername"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'税号'" prop="taxnumber">
                                        <el-input v-model="AddIndustryDialogData.taxnumber"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'法人代表'" prop="legalperson">
                                        <el-input v-model="AddIndustryDialogData.legalperson"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'企业电话'" prop="companytel">
                                        <el-input v-model="AddIndustryDialogData.companytel"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'开户银行'" prop="openingbank">
                                        <el-select v-model="AddIndustryDialogData.openingbank" clearable>
                                          <el-option v-for="(item, index) in bankitems" :key="index" :value="item.code" :label="item.name"></el-option>
                                        </el-select>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'银行账号'" prop="bankaccount">
                                        <el-input v-model="AddIndustryDialogData.bankaccount"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'备注'" prop="remark">
                                        <el-input v-model="AddIndustryDialogData.remark"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                  <el-row>
                                    <el-col :span="8">
                                      <el-form-item size="mini" :label="'排序'" prop="seqno" :rules="[{required:!AddIndustryDialogData.seqno}]">
                                        <el-input v-model="AddIndustryDialogData.seqno"></el-input>
                                      </el-form-item>
                                    </el-col>
                                  </el-row>
                                </el-form>
                                <div slot="footer">
                                  <el-button size="mini" @click="AddIndustryDictionaryFlag = false">取消</el-button>
                                  <el-button size="mini" type="primary" @click="createIndustryDictionaryData">确认</el-button>
                                </div>
                              </el-dialog>
                            </el-form-item>
                          </el-col>
                          <el-col :span="5">
                            <el-form-item size="mini" label="批次">
                              <!-- allow-create 可手动输入 -->
                              <el-select filterable @change="handleSelectBatch" style="width: 100%" v-model="personalForm.batch" placeholder="">
                                <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="5">
                            <el-form-item size="mini" label="入厂日期" :rules="[{required:!personalForm.entrytime}]">
                              <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" @change="calculateSeniorityFun" v-model="personalForm.entrytime" type="date" placeholder="选择日期" :editable="true">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="3">
                            <el-form-item size="mini" label="车间部门">
                              <el-input v-model="personalForm.workshop"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="5">
                            <el-form-item size="mini" label="接害日期" :rules="[{required:!personalForm.contactDamageData}]">
                              <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" @change="calculateSeniorityFun('ContactDamage')" v-model="personalForm.contactDamageData" type="date" placeholder="选择日期" :editable="true">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <!-- res.data,'行业' -->
                            <el-form-item size="mini" label="行业" :rules="[{required:!personalForm.industrytypename}]">
                              <!-- allow-create 可手动输入 -->
                              <el-select filterable clearable @change="handleSelectIndustry" class="btn" v-model="personalForm.industrytypename" placeholder="">
                                <el-option v-for="item in SelectIndustryData" :key="item.code" :label="`${item.name}`" :value="item.code"></el-option>
                              </el-select>
                              <el-button type="primary" size="mini" @click="AddIndustryDictionary">增加</el-button>
                              <el-dialog destroy-on-close :close-on-click-modal="false" title="行业字典新增" :visible.sync="AddindustryFlag" @close="industryDialogClose">
                                <el-form ref="industryRefForm" :model="Addindustry_HY_DialogData" label-position="right" label-width="130px">
                                  <el-row>
                                    <el-form-item size="mini" label="行业名称">
                                      <el-input v-model="Addindustry_HY_DialogData.name"></el-input>
                                    </el-form-item>
                                  </el-row>
                                  <el-row>
                                    <el-form-item size="mini" label="排序">
                                      <el-input v-model="Addindustry_HY_DialogData.seqno"></el-input>
                                    </el-form-item>
                                  </el-row>
                                </el-form>
                                <div slot="footer">
                                  <el-button size="mini" @click="AddindustryFlag = false">取消</el-button>
                                  <el-button size="mini" type="primary" @click="createindustryData">确认</el-button>
                                </div>
                              </el-dialog>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <!-- res.data,'工种' -->
                            <el-form-item size="mini" label="工种" :rules="[{required:!personalForm.worktypename}]">
                              <!-- allow-create 可手动输入 -->
                              <el-select filterable clearable @change="handleSelectJobs" class="btn" v-model="personalForm.worktypename" placeholder="">
                                <el-option v-for="item in SelectJobsData" :key="item.code" :label="`${item.name}`" :value="item.code"></el-option>
                              </el-select>
                              <el-button type="primary" size="mini" @click="AddIndustryJobs">增加</el-button>
                              <!-- AddJobsDictionaryDialogData -->
                              <el-dialog destroy-on-close :close-on-click-modal="false" title="工种字典新增" :visible.sync="AddJobsDictionaryFlag" @close="JobsDictionaryDialogClose">
                                <el-form ref="jobsRefForm" :model="AddJobsDictionaryDialogData" label-position="right" label-width="130px">
                                  <el-row>
                                    <el-form-item size="mini" label="工种名称">
                                      <el-input v-model="AddJobsDictionaryDialogData.name"></el-input>
                                    </el-form-item>
                                  </el-row>
                                  <el-row>
                                    <el-form-item size="mini" label="排序">
                                      <el-input v-model="AddJobsDictionaryDialogData.seqno"></el-input>
                                    </el-form-item>
                                  </el-row>
                                </el-form>
                                <div slot="footer">
                                  <el-button size="mini" @click="AddJobsDictionaryFlag = false">取消</el-button>
                                  <el-button size="mini" type="primary" @click="createJobsData">确认</el-button>
                                </div>
                              </el-dialog>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="总工龄" :rules="[{required:!personalForm.workyear}]">
                              <div style="display:flex;">
                                <el-input style="width:150px;" v-model="personalForm.workyear"></el-input>
                                <el-select style="width:200px;" @change="handleSelectChange" v-model="personalForm.workyearunit" placeholder="">
                                  <el-option v-for="item in seniorityDate1 " :key="item.code" :label="item.value" :value="item.code"></el-option>
                                </el-select>
                                <el-input style="width:150px;" v-show="seniorityMonthFlag" v-model="personalForm.workyearMonth"></el-input>
                                <el-input style="width:200px;" v-show="seniorityMonthFlag" v-model="seniorityMonth" disabled></el-input>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="接害工龄" :rules="[{required:!personalForm.harmwordyear}]">
                              <div style="display:flex;">
                                <el-input style="width:150px;" v-model="personalForm.harmwordyear"></el-input>
                                <el-select style="width:200px;" @change="handleSelectChange" v-model="personalForm.harmwordyearunit" placeholder="">
                                  <el-option v-for="item in seniorityDate2 " :key="item.code" :label="item.value" :value="item.code"></el-option>
                                </el-select>
                                <el-input style="width:150px;" v-show="seniorityMonthFlag2" v-model="personalForm.harmwordmonth"></el-input>
                                <el-input style="width:200px;" v-show="seniorityMonthFlag2" v-model="seniorityMonth" disabled></el-input>
                              </div>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="35">
                            <el-form-item size="mini" label="职业危害" :rules="[{required:!HarmMsg}]">
                              <div style="display: flex; width: 100%;">
                                <el-input class="inputClas" style="width: 700px;" disabled v-model="HarmMsg"></el-input>
                                <el-button type="warning" @click="addHarmItemFun()" size="mini">...</el-button>
                                <!-- 添加危害项 dialog框 -->
                                <el-dialog title="职业危害" :visible.sync="HarmDialogFlag" width="50%" @close="DialogHarmClose" :close-on-click-modal="false">
                                  <!--  -->
                                  <el-row>
                                    <el-col :span="12">
                                      <div> 已选择 </div>
                                      <EasyTable class="todaycombine todaycombine1 HazardsClas" height="100%" :data="DialogFormSelectData" :tableOptions="DialogFormAlreadySelected" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                                    </el-col>
                                    <el-col :span="12">
                                      <!-- <div> 职业危害字典 </div> -->
                                      <div>
                                        <div style="display: inline-block;">搜索:</div>
                                        <el-input style="width:50%;" @keyup.enter.native="getHarmData" v-model="HarmSearch" placeholder="请输入搜索内容" size="mini"></el-input>
                                      </div>
                                      <EasyTable class="todaycombine HazardsClas" height="100%" :data="DialogFormData" :tableOptions="DialogFormItem" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" @cell-dblclick="handleItem" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                                    </el-col>
                                  </el-row>
                                  <span slot="footer" class="dialog-footer">
                                    <el-button @click="HarmDialogFlag = false, DialogHarmFun('取消')">取 消</el-button>
                                    <el-button type="primary" @click="HarmDialogFlag = false, DialogHarmFun('确定')">确
                                      定</el-button>
                                  </span>
                                </el-dialog>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="当日号">
                              <el-input v-model="personalForm.hischargecode"></el-input>
                            </el-form-item>
                          </el-col>
                          <!-- <el-col :span="5">
                            <el-form-item size="mini" label="检查目的" :rules="[{required:!personalForm.checkPoint}]">
                              <el-select v-model="personalForm.checkPoint" placeholder="">
                                <el-option v-for="item in PurposeOfTheInspectionData" :key="item.id" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col> -->
                        </el-row>
                      </el-form>
                    </div>
                    <!-- 照片 -->
                    <div class="photo_box">
                      <!--开启摄像头-->
                      <img @click="
                        pageState == 'add' && handleOnTake(),
                        pageState == 'edit' && handleOnTake()
                        " :src="avatarImg" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" class="avatar" alt="摄像头" />
                      <div class="del_btn" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" v-show="showDelPhotoBtn">
                        <i class="el-icon-delete" @click="handleDelPhotoBtn"></i>
                      </div>
                      <!--拍照模态框-->
                      <el-dialog class="photo_box_dialog" title="拍照上传" :close-on-click-modal="false" :visible.sync="showCanvas" @close="handleOnCancel">
                        <div class="box">
                          <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
                          <canvas id="canvasCamera" class="canvas canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                        </div>
                        <div slot="footer">
                          <el-button @click="handleDrawImage" icon="el-icon-camera" size="small">
                            拍照
                          </el-button>
                          <el-button v-if="os" @click="handleGetCompetence" icon="el-icon-video-camera" size="small">
                            打开摄像头
                          </el-button>
                          <el-button v-else @click="handleStopNavigator" icon="el-icon-switch-button" size="small">
                            关闭摄像头
                          </el-button>
                          <el-button @click="handleResetCanvas" icon="el-icon-refresh" size="small">
                            重置
                          </el-button>
                          <el-button @click="handleOnComplete" icon="el-icon-circle-close" size="small">
                            完成
                          </el-button>
                        </div>
                      </el-dialog>
                    </div>
                  </div>
                </div>
                <!-- 档案信息 -->
                <div v-if="message == 'other'" class="other_info personal_info">
                  <el-button-group>
                    <el-button size="mini" type="primary" plain @click="archivesFormAllFlag = false, archivesFun('edit')">编辑</el-button>
                    <el-button size="mini" type="primary" plain @click="archivesFormAllFlag = false, archivesFun('keep')">保存</el-button>
                    <el-button size="mini" type="primary" plain @click="archivesFun('shutDown')">关闭</el-button>
                  </el-button-group>
                  <div class="content">
                    <div class="btnbox">
                      <el-button-group>
                        <el-button size="mini" type="primary" :class="[archivesFlag == 0 ? 'baccolor' : '']" plain @click="archivesFlag = '0'">基本信息</el-button>
                        <el-button size="mini" type="primary" :class="[archivesFlag == 1 ? 'baccolor' : '']" plain @click="archivesFlag = '1'">既往病史</el-button>
                        <el-button size="mini" type="primary" :class="[archivesFlag == 2 ? 'baccolor' : '']" plain @click="archivesFlag = '2'">工作既往史</el-button>
                        <el-button size="mini" type="primary" :class="[archivesFlag == 3 ? 'baccolor' : '']" plain @click="archivesFlag = '3'">问诊</el-button>
                        <el-button size="mini" type="primary" :class="[archivesFlag == 4 ? 'baccolor' : '']" plain @click="archivesFlag = '4'">自觉症状</el-button>
                      </el-button-group>
                    </div>
                    <!-- 档案信息主体 -->
                    <div class="contentBox" v-show="archivesFlag == 0">
                      <div class="info_body">
                        <div class="form_box">
                          <el-form ref="form" size="mini" :disabled="archivesFormAllFlag" :model="archivesForm" :rules="rulePersonalForm" label-width="80px">
                            <el-row>
                              <!-- <el-row>
                                <el-col :span="7">
                                  <el-form-item size="mini" label="体检类型"> 
                                    <el-select v-model="archivesForm.checktype" placeholder="">
                                      <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="7">
                                  <el-form-item size="mini" label="团检类型">
                                    <el-select @change="groupInspectionFun" v-model="archivesForm.personalflag" placeholder="">
                                      <el-option :label="'个人'" :value="0"></el-option>
                                      <el-option :label="'团检'" :value="1"></el-option>
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                  <el-form-item size="mini" label="检查类型">
                                    <el-select v-model="archivesForm.reviewtype" placeholder="">
                                      <el-option :label="'初检'" :value="0"></el-option>
                                      <el-option :label="'复检'" :value="1"></el-option>
                                    </el-select>
                                  </el-form-item>
                                </el-col>
                              </el-row> -->
                              <el-col :span="6">
                                <el-form-item size="mini" label="体检号">
                                  <el-input disabled v-model="archivesForm.checkno"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="姓名" :rules="[{ required: !archivesForm.name }]">
                                  <el-input v-model="archivesForm.name" @keyup.enter.native="handleGetRegisterInfo"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="性别" :rules="[{ required: !archivesForm.sex }]">
                                  <el-select v-model="archivesForm.sex" placeholder="">
                                    <el-option v-for="item in sexarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <!-- <el-col :span="6">
                                <el-form-item size="mini" label-width="55px" class="age" label="年龄" prop="numberlimit" :rules="[{ required: !archivesForm.age }]">
                                  <el-input type="number" class="age_num" v-model.number="archivesForm.age" :min="1" :max="150" @change.native="handleChangeAge2"></el-input>
                                  <div style="
                                  width: 90px;
                                  height: 26px;
                                  border: 0.5px solid #c0c4cc;
                                  border-radius: 5px;
                                  padding-left: 6px;
                                  margin: 1px 0 0 6px;
                                ">
                                    岁
                                  </div>
                                </el-form-item>
                              </el-col> -->
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                <el-form-item class="birthday" size="mini" label="出生日期">
                                  <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="archivesForm.birthday" type="date" placeholder="选择日期" :editable="true" @change="handleChangeBirthday">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="婚姻">
                                  <el-select @change="handleSelectChange" v-model="archivesForm.marriage" placeholder="">
                                    <el-option v-for="item in marriagearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                <el-form-item size="mini" label="身份证" :rules="[{ required: !archivesForm.idcard }]">
                                  <div style="display: flex;">
                                    <!-- <el-select @change="handleSelectChange" v-model="archivesForm.idtype" placeholder="">
                                      <el-option v-for="item in idtypeItems" :key="item.code" :label="item.name"
                                        :value="item.code"></el-option>
                                    </el-select> -->
                                    <el-input v-model="archivesForm.idcard" :disabled="true" @keyup.enter.native="handleChangeIdcard"></el-input>
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                <el-form-item size="mini" label="联系电话">
                                  <el-input v-model="archivesForm.telephone"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="10">
                                <el-form-item size="mini" label="住址">
                                  <el-input v-model="archivesForm.address"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :span="8">
                                <el-form-item size="mini" label="工号">
                                  <el-input v-model="archivesForm.jobno"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <!-- <el-col :span="6">
                                <el-form-item size="mini" label="单位名称">
                                  <el-select filterable clearable @change="handleSelectComany2" v-model="archivesForm.companycode" placeholder="">
                                    <el-option v-for="item in companyitems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>

                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="批次">
                                  <el-select @change="handleSelectBatch2" style="width: 100%" v-model="archivesForm.batch" placeholder="">
                                    <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col> -->
                              <el-col :span="6">
                                <el-form-item size="mini" label="入厂日期">
                                  <el-date-picker style="width: 100%" value-format="yyyy-MM-dd HH:mm:ss" v-model="archivesForm.entrytime" type="date" placeholder="选择日期" :editable="true" @change="calculateSeniorityFun2">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="车间部门">
                                  <el-input v-model="archivesForm.workshop"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="6">
                                <el-form-item size="mini" label="行业">
                                  <!-- <el-input v-model="archivesForm.industrytypename"></el-input> -->
                                  <!-- allow-create 手工输入属性 -->
                                  <el-select filterable clearable @change="handleSelectIndustry" v-model="archivesForm.industrytypename" placeholder="">
                                    <el-option v-for="item in SelectIndustryData" :key="item.code" :label="`${item.name}`" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="工种">
                                  <!-- <el-input v-model="archivesForm.worktypename"></el-input> -->
                                  <!-- allow-create 手工输入属性 -->
                                  <el-select filterable clearable @change="handleSelectJobs" v-model="archivesForm.worktypename" placeholder="">
                                    <el-option v-for="item in SelectJobsData" :key="item.code" :label="`${item.name}`" :value="item.code"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="总工龄">
                                  <div style="display:flex;">
                                    <el-input v-model="archivesForm.workyear"></el-input>
                                    <el-select @change="handleSelectChange" v-model="archivesForm.workyearunit" placeholder="">
                                      <el-option v-for="item in seniorityDate1 " :key="item.code" :label="item.value" :value="item.code"></el-option>
                                    </el-select>
                                  </div>
                                </el-form-item>
                              </el-col>
                              <el-col :span="6">
                                <el-form-item size="mini" label="接害工龄" :rules="[{ required: !archivesForm.harmwordyearunit }]">
                                  <div style="display:flex;">
                                    <el-input v-model="archivesForm.harmwordyear"></el-input>
                                    <el-select @change="handleSelectChange" v-model="archivesForm.harmwordyearunit" placeholder="">
                                      <el-option v-for="item in seniorityDate2" :key="item.code" :label="item.value" :value="item.code"></el-option>
                                    </el-select>
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                            </el-row>
                            <el-row>
                              <el-col :span="40">
                                <el-form-item size="mini" label="照射种类">
                                  <div style="display: flex; width: 100%;">
                                    <el-input class="inputClas" disabled style="width: 700px;" v-model="archivesForm.irradiation"></el-input>
                                    <el-button type="warning" @click="IrradiationDialogFlag = true" size="mini">...</el-button>
                                    <!-- 添加危害项 dialog框 -->
                                    <el-dialog title="照射种类" :visible.sync="IrradiationDialogFlag" width="50%" @close="DialogHarmClose" :close-on-click-modal="false">
                                      <!--  -->
                                      <el-row>
                                        <el-col :span="12">
                                          <div> 已选择 </div>
                                          <EasyTable class="todaycombine todaycombine1" height="100%" :data="typeOfIrradiationchooseData" :tableOptions="typeOfIrradiationDataChoose" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                                        </el-col>
                                        <el-col :span="12">
                                          <div> 照射种类字典 </div>
                                          <EasyTable class="todaycombine" height="100%" :data="typeOfIrradiationData" :tableOptions="typeOfIrradiationDataItem" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" @cell-dblclick="hadnleIrradiationDialogSelect" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                                        </el-col>
                                      </el-row>
                                      <span slot="footer" class="dialog-footer">
                                        <el-button @click="IrradiationDialogFlag = false, DialogIrradiationFun('取消')">取
                                          消</el-button>
                                        <el-button type="primary" @click="IrradiationDialogFlag = false, DialogIrradiationFun('确定')">确
                                          定</el-button>
                                      </span>
                                    </el-dialog>
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="30">
                                <el-form-item size="mini" label="档案备注">
                                  <div style="display: flex; width: 100%;">
                                    <el-input class="inputClas" maxlength="25" style="width: 700px;" v-model="archivesForm.remark"></el-input>
                                  </div>
                                </el-form-item>
                              </el-col>
                              <el-col :span="5">
                                <el-form-item size="mini" label="既往评残">
                                  <div style="display:flex;">
                                    <el-select @change="handleSelectChange" v-model="archivesForm.disabilityrating">
                                      <el-option label="是" value="1"></el-option>
                                      <el-option label="否" value="0"></el-option>
                                    </el-select>
                                  </div>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-form>
                          <div style="display: block; text-align: center; font-weight: bold; color:#606266;">表单</div>
                          <!-- 自动生成表单 -->
                          <CreatedForm :insite="true" v-show="archivesFlag == 0" :value="archivesForm.formcontroldata" :isArchives="!archivesFormAllFlag" :data="contentData" ref="contentDataObj" />
                        </div>
                        <!-- 照片 -->
                        <div class="photo_box">
                          <!--开启摄像头-->
                          <img @click="
                            pageState == 'add' && handleOnTake(),
                            pageState == 'edit' && handleOnTake()
                            " :src="avatarImg" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" class="avatar" alt="摄像头" />
                          <div class="del_btn" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" v-show="showDelPhotoBtn">
                            <i class="el-icon-delete" @click="handleDelPhotoBtn"></i>
                          </div>
                          <!--拍照模态框-->
                          <el-dialog class="photo_box_dialog" title="拍照上传" :close-on-click-modal="false" :visible.sync="showCanvas" @close="handleOnCancel">
                            <div class="box">
                              <video id="videoCamera" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
                              <canvas id="canvasCamera" class="canvas canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                            </div>
                            <div slot="footer">
                              <el-button @click="handleDrawImage" icon="el-icon-camera" size="small">
                                拍照
                              </el-button>
                              <el-button v-if="os" @click="handleGetCompetence" icon="el-icon-video-camera" size="small">
                                打开摄像头
                              </el-button>
                              <el-button v-else @click="handleStopNavigator" icon="el-icon-switch-button" size="small">
                                关闭摄像头
                              </el-button>
                              <el-button @click="handleResetCanvas" icon="el-icon-refresh" size="small">
                                重置
                              </el-button>
                              <el-button @click="handleOnComplete" icon="el-icon-circle-close" size="small">
                                完成
                              </el-button>
                            </div>
                          </el-dialog>
                        </div>
                      </div>
                    </div>
                    <!-- 既往病史主体 -->
                    <div class="contentBox" v-show="archivesFlag == '1'">
                      <div class="info_body">
                        <div class="form_box relative">
                          <!-- @cell-dblclick="handleItem" -->
                          <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                          <el-table class="pictureMaterialTableClas" :data="pastMedicalHistoryData" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                            <el-table-column prop="illnesstypename" label="疾病类型">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.illnesstypename" :disabled="archivesFormAllFlag">
                                </el-input>
                                <!-- <el-select v-model="param.row.illnesstypename" clearable placeholder="请选择">
                                  <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                  </el-option>
                                </el-select> -->
                              </template>
                            </el-table-column>
                            <el-table-column prop="illnessname" label="疾病名称">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.illnessname" :disabled="archivesFormAllFlag">
                                </el-input>
                                <!-- <el-select v-model="param.row.illnessname" :disabled="archivesFormAllFlag" clearable
                                  placeholder="请选择">
                                  <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                  </el-option>
                                </el-select> -->
                              </template>
                            </el-table-column>
                            <el-table-column prop="diagnosisdate" label="诊断日期/年限">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.diagnosisdate" :disabled="archivesFormAllFlag">
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="diagnosticInstitution" label="诊断单位">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.diagnosticInstitution" :disabled="archivesFormAllFlag">
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="healflag" label="是否痊愈">
                              <template v-slot="param">
                                <!-- <el-input placeholder="请输入内容" v-model="param.row.healflag"
                                  :disabled="archivesFormAllFlag">
                                </el-input> -->
                                <el-select :disabled="archivesFormAllFlag" v-model="param.row.healflag">
                                  <el-option label="是" value="1"></el-option>
                                  <el-option label="否" value="0"></el-option>
                                </el-select>
                              </template>
                            </el-table-column>
                            <el-table-column prop="healflag" label="操作">
                              <template v-slot="param">
                                <span style="color:blue;cursor: pointer;" @click="pastMedicalHistoryDelete(param.row)">删除</span>
                              </template>
                            </el-table-column>
                          </el-table>
                          <!-- 既往病史 dialog -->
                          <el-dialog title="新增" :visible.sync="pastMedicalDiloagFlag" :close-on-click-modal="false" @close="DiloagpastMedicalHistory = {}">
                            <el-form :model="DiloagpastMedicalHistory">
                              <el-form-item label="疾病类型" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="DiloagpastMedicalHistory.illnesstypename">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="疾病名称" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="DiloagpastMedicalHistory.illnessname">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="诊断日期/年限" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="DiloagpastMedicalHistory.diagnosisdate">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="诊断单位" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="DiloagpastMedicalHistory.diagnosticInstitution">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="是否痊愈" :label-width="formLabelWidth">
                                <!-- <el-input placeholder="请输入内容" v-model="DiloagpastMedicalHistory.healflag">
                                </el-input> -->
                                <el-select v-model="DiloagpastMedicalHistory.healflag">
                                  <el-option label="是" value="1"></el-option>
                                  <el-option label="否" value="0"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                              <el-button @click="(pastMedicalDiloagFlag = false, DiloagpastMedicalHistory = {})">取
                                消</el-button>
                              <el-button type="primary" @click.stop=" btnKeepFun('1')">确
                                定</el-button>
                            </div>
                          </el-dialog>
                          <div>总记录数: {{ pastMedicalHistoryData?.length }}</div>
                        </div>
                      </div>
                    </div>
                    <!-- 工作既往史 -->
                    <div class="contentBox" v-show="archivesFlag == '2'">
                      <div class="info_body">
                        <div class="form_box relative">
                          <el-button-group>
                            <el-button size="mini" type="primary" :class="[workHistoryFlag == 0 ? 'baccolor' : '']" plain @click="workHistoryFlag = '0'">职业史</el-button>
                            <el-button size="mini" type="primary" :class="[workHistoryFlag == 1 ? 'baccolor' : '']" plain @click="workHistoryFlag = '1'">放射工作职业史</el-button>
                            <el-button size="mini" type="primary" :class="[workHistoryFlag == 2 ? 'baccolor' : '']" plain @click="workHistoryFlag = '2'">职业病史</el-button>
                            <el-button size="mini" type="primary" :class="[workHistoryFlag == 3 ? 'baccolor' : '']" plain @click="workHistoryFlag = '3'">档案图片资料</el-button>
                          </el-button-group>
                          <span style="margin-left:50px;"> </span>
                          <!-- 导入历史工作既往史 -->
                          <el-button size="mini" type="primary" plain @click.stop="importHistoryFun">导入历史工作既往史</el-button>
                          <!-- 职业史 -->
                          <div v-show="workHistoryFlag == '0'">
                            <!-- @cell-dblclick="handleItem" -->
                            <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                            <el-table class="pictureMaterialTableClas" :data="careerHistoryData" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                              <el-table-column prop="workunit" label="工作单位">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.workunit" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.workunit" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="startdate" label="起始年月">
                                <template v-slot="param">
                                  <el-date-picker v-model="param.row.startdate" :disabled="archivesFormAllFlag" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </template>
                              </el-table-column>
                              <el-table-column prop="enddate" label="终止年月">
                                <template v-slot="param">
                                  <el-date-picker v-model="param.row.enddate" :disabled="archivesFormAllFlag" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </template>
                              </el-table-column>
                              <el-table-column prop="workshop" label="车间">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.workshop" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.workshop" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="worktypename" label="工种">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.worktypename" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="harmname" label="有害因素名称">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.harmname" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.harmname" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="concentration" label="有害因素浓度">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.concentration" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.concentration" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="" label="删除">
                                <template v-slot="param">
                                  <span style="color:blue;" @click="careerHistoryDelete(param.row)">删除</span>
                                </template>
                              </el-table-column>
                            </el-table>
                            <!-- 职业史dialog -->
                            <el-dialog title="新增" @close="careerHistoryHistory = {}" :close-on-click-modal="false" :visible.sync="careerHistoryDiloagFlag">
                              <el-form :model="careerHistoryHistory">
                                <el-form-item label="工作单位" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="careerHistoryHistory.workunit">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="起始年月" :label-width="formLabelWidth">
                                  <el-date-picker v-model="careerHistoryHistory.startdate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </el-form-item>
                                <el-form-item label="终止年月" :label-width="formLabelWidth">
                                  <el-date-picker v-model="careerHistoryHistory.enddate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </el-form-item>
                                <el-form-item label="车间" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="careerHistoryHistory.workshop">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="工种" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="careerHistoryHistory.worktypename">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="有害因素名称" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="careerHistoryHistory.harmname">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="有害因素浓度" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="careerHistoryHistory.concentration">
                                  </el-input>
                                </el-form-item>
                              </el-form>
                              <div slot="footer" class="dialog-footer">
                                <el-button @click="careerHistoryDiloagFlag = false">取 消</el-button>
                                <el-button type="primary" @click.stop=" btnKeepFun('2')">确
                                  定</el-button>
                              </div>
                            </el-dialog>
                            <div>总记录数: {{ careerHistoryData?.length }}</div>
                          </div>
                          <!-- 放射工作职业史 -->
                          <div v-show="workHistoryFlag == '1'">
                            <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                            <el-table class="pictureMaterialTableClas" :data="radiationWorkData" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                              <el-table-column prop="workunit" label="工作单位">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.workunit" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.workunit" :disabled="archivesFormAllFlag" clearable placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="startdate" label="起始年月">
                                <template v-slot="param">
                                  <el-date-picker v-model="param.row.startdate" :disabled="archivesFormAllFlag" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </template>
                              </el-table-column>
                              <el-table-column prop="enddate" label="终止年月">
                                <template v-slot="param">
                                  <el-date-picker v-model="param.row.enddate" :disabled="archivesFormAllFlag" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </template>
                              </el-table-column>
                              <el-table-column prop="workshop" label="部门">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.workshop" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.workshop" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="worktypename" label="工种">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.worktypename" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="radiatename" label="放射线种类">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.radiatename" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="workday" label="每日工作日数或工作量" width="180px">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.workday" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="dose" label="累计受照计量">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.dose" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="" label="操作">
                                <template v-slot="param">
                                  <span style="color:blue; cursor: pointer;" @click="radiationWorkDelete(param.row)">删除</span>
                                </template>
                              </el-table-column>
                            </el-table>
                            <!-- 放射工作职业史dialog -->
                            <el-dialog title="新增" @close="radiationWorkHistory = {}" :close-on-click-modal="false" :visible.sync="radiationWorkDiloagFlag">
                              <el-form :model="radiationWorkHistory" label-width="160px">
                                <el-form-item label="工作单位">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.workunit">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="起始年月">
                                  <el-date-picker v-model="radiationWorkHistory.startdate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </el-form-item>
                                <el-form-item label="终止年月">
                                  <el-date-picker v-model="radiationWorkHistory.enddate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </el-form-item>
                                <el-form-item label="部门">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.workshop">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="工种">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.worktypename">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="放射线种类">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.radiatename">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="每日工作日数或工作量">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.workday">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="累计受照计量">
                                  <el-input placeholder="请输入内容" v-model="radiationWorkHistory.dose">
                                  </el-input>
                                </el-form-item>
                              </el-form>
                              <div slot="footer" class="dialog-footer">
                                <el-button @click="radiationWorkDiloagFlag = false">取 消</el-button>
                                <el-button type="primary" @click.stop="btnKeepFun('3')">确
                                  定</el-button>
                              </div>
                            </el-dialog>
                            <div>总记录数: {{ radiationWorkData?.length }}</div>
                          </div>
                          <!-- 职业病史 -->
                          <div v-show="workHistoryFlag == '2'">
                            <!-- @cell-dblclick="handleItem" -->
                            <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                            <el-table class="pictureMaterialTableClas" :data="workHistoryData" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                              <el-table-column prop="illnessname" label="病名">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.illnessname" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.illnessname" :disabled="archivesFormAllFlag" clearable
                                    placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="diagnosisdate" label="诊断日期">
                                <template v-slot="param">
                                  <el-date-picker :disabled="archivesFormAllFlag" v-model="param.row.diagnosisdate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </template>
                              </el-table-column>
                              <el-table-column prop="diagnosticInstitution" label="诊断单位">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.diagnosticInstitution" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.diagnosticInstitution" :disabled="archivesFormAllFlag"
                                    clearable placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="treatmentprocess" label="治疗经过">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.treatmentprocess" :disabled="archivesFormAllFlag">
                                  </el-input>
                                  <!-- <el-select v-model="param.row.treatmentprocess" :disabled="archivesFormAllFlag"
                                    clearable placeholder="请选择">
                                    <el-option v-for="item in 10" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select> -->
                                </template>
                              </el-table-column>
                              <el-table-column prop="returnto" label="转归">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.returnto" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="healflag" label="是否痊愈">
                                <template v-slot="param">
                                  <!-- <el-input placeholder="请输入内容" v-model="param.row.healflag"
                                    :disabled="archivesFormAllFlag">
                                  </el-input> -->
                                  <el-select :disabled="archivesFormAllFlag" v-model="param.row.healflag">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                  </el-select>
                                </template>
                              </el-table-column>
                              <el-table-column prop="" label="操作">
                                <template v-slot="param">
                                  <span style="color:blue; cursor: pointer;" @click="workHistoryDelete(param.row)">删除</span>
                                </template>
                              </el-table-column>
                            </el-table>
                            <!-- 职业病史dialog -->
                            <el-dialog title="新增" @close="workHistoryHistory = {}" :close-on-click-modal="false" :visible.sync="workHistoryDiloagFlag">
                              <el-form :model="workHistoryHistory">
                                <el-form-item label="病名" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="workHistoryHistory.illnessname">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="诊断日期" :label-width="formLabelWidth">
                                  <el-date-picker v-model="workHistoryHistory.diagnosisdate" type="date" placeholder="选择日期">
                                  </el-date-picker>
                                </el-form-item>
                                <el-form-item label="诊断单位" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="workHistoryHistory.diagnosticInstitution">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="治疗经过" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="workHistoryHistory.treatmentprocess">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="转归" :label-width="formLabelWidth">
                                  <el-input placeholder="请输入内容" v-model="workHistoryHistory.returnto">
                                  </el-input>
                                </el-form-item>
                                <el-form-item label="是否痊愈" :label-width="formLabelWidth">
                                  <!-- <el-input placeholder="请输入内容" v-model="workHistoryHistory.healflag">
                                  </el-input> -->
                                  <el-select v-model="workHistoryHistory.healflag">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                  </el-select>
                                </el-form-item>
                              </el-form>
                              <div slot="footer" class="dialog-footer">
                                <el-button @click="workHistoryDiloagFlag = false">取 消</el-button>
                                <el-button type="primary" @click.stop=" btnKeepFun('4')">确
                                  定</el-button>
                              </div>
                            </el-dialog>
                            <div>总记录数: {{ workHistoryData?.length }}</div>
                          </div>
                          <!-- 档案图片资料 -->
                          <div v-show="workHistoryFlag == '3'">
                            <!--  @cell-dblclick="handleItem" -->
                            <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                            <el-table :data="pictureMaterialData" class="pictureMaterialTableClas" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                              <!-- <el-table-column prop="combinename" label="图片类型">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.combinename"
                                    :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column> -->
                              <el-table-column prop="filename" label="图片名称">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.filename" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="operatdate" label="导入日期">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.operatdate" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="operatorname" label="导入人">
                                <template v-slot="param">
                                  <el-input placeholder="请输入内容" v-model="param.row.operatorname" :disabled="archivesFormAllFlag">
                                  </el-input>
                                </template>
                              </el-table-column>
                              <el-table-column prop="" label="操作">
                                <template v-slot="param">
                                  <el-upload style="display: none;" class="upload-demo" name='files' ref="pictureMaterialUpload" :http-request="handlepictureMaterialChange" action=''>
                                  </el-upload>
                                  <el-button size="small" type="primary" style=" cursor: pointer; color:#fff;" @click="viewFun(param.row)">查看</el-button>
                                  <el-dialog title="查看" :visible.sync="viewFlag" width="46%">
                                    <el-image style="width: 500px; height: 500px" :src="viewUrl" :fit="'contain'"></el-image>
                                  </el-dialog>
                                  <!-- <el-button size="small" type="primary" style=" cursor: pointer;  color:#fff;" @click="photographFun(param.row)">拍照</el-button> -->
                                  <el-button size="small" type="primary" style=" cursor: pointer;  color:#fff;" @click="importFun(param)">导入</el-button>
                                  <el-button size="small" type="danger" style=" cursor: pointer;  color:#fff;" @click="pictureMaterialDelete(param)">删除</el-button>
                                </template>
                              </el-table-column>
                            </el-table>
                            <div>总记录数: {{ pictureMaterialData?.length }}</div>

                          </div>
                          <!--拍照模态框-->
                          <el-dialog class="photo_box_dialog" title="拍照上传" :close-on-click-modal="false" :visible.sync="photoCanvasFlag" @close="handleOnCancel">
                            <div class="box">
                              <video id="videoCamera2" class="canvas" :width="videoWidth" :height="videoHeight" autoPlay></video>
                              <canvas id="canvasCamera2" class="canvas canvasCamera" :width="videoWidth" :height="videoHeight"></canvas>
                            </div>
                            <div slot="footer">
                              <el-button @click="handleDrawImage" icon="el-icon-camera" size="small">
                                拍照
                              </el-button>
                              <el-button v-if="os" @click="handleGetCompetence2" icon="el-icon-video-camera" size="small">
                                打开摄像头
                              </el-button>
                              <el-button v-else @click="handleStopNavigator" icon="el-icon-switch-button" size="small">
                                关闭摄像头
                              </el-button>
                              <el-button @click="handleResetCanvas2" icon="el-icon-refresh" size="small">
                                重置
                              </el-button>
                              <el-button @click="handleOnComplete2" icon="el-icon-circle-close" size="small">
                                完成
                              </el-button>
                            </div>
                          </el-dialog>
                        </div>
                      </div>
                    </div>
                    <!-- 问诊 -->
                    <div class="contentBox" v-show="archivesFlag == '3'">
                      <div class="info_body">
                        <div class="form_box ">
                          <!-- 问卷 -->
                          <div class="centent">
                            <div class="card">
                              <!-- 标题 -->
                              <div class="title_head">
                                <div class="logo"></div>
                                <h3>问诊</h3>
                              </div>
                              <!-- 内容 -->
                              <div class="life_habit">
                                <!-- 问卷题目 -->
                                <!-- 一级标题questionnairelist -->
                                <div class="Questionnaire" v-for="(item, index) in questionnairelist" :key="index">
                                  <div class="life_habit_title">
                                    <h3>{{ item.itemname }}</h3>
                                  </div>
                                  <div class="life_habit_content">
                                    <!-- 二级标题questionnaireitems -->
                                    <div class="basic_information" v-for="item in item.questionnaireitems" :key="item.itemcode">
                                      <div class="two_topic">
                                        <span>{{ item.itemname }}</span>
                                        <!-- 二级选项optionitems -->
                                        <div class="two_options" v-for="(value, index) in item.optionitems" :key="index">
                                          <span v-if="value.inputtype === -1">
                                            <!-- v-html="value.content.replaceAll('|X|',`1`)" -->
                                            <!-- {{ value.content}} -->
                                            <!-- 渲染出来的input的值 拼接存到remake的哦 格式  就是这种 2020|x|01 会不会很麻烦
                           -->
                                            <!-- <span v-for="(day,index) in value.content" :key="index">{{day+'c'}}</span> -->
                                            <template v-for="(val, index) in value.content
                                              .split('|X|')
                                              .filter((v) => v)">
                                              <myInput v-if="showMyInput" :suffix="val" :disabled="archivesFormAllFlag" :count="value.content
                                                  .split('|X|')
                                                  .filter((v) => v).length
                                                  " :value.sync="value.remark" :index="index" :key="val" />
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
                                          <el-radio-group v-model="item.selectvalue" :disabled=" archivesFormAllFlag">
                                            <el-radio v-if="[0, 3].indexOf(value.inputtype) !== -1
                                              " :label="value.selectvalue" style="margin-right: 5px">
                                              <span v-if="value.content.indexOf('|X|') !== -1
                                                ">
                                                <template v-for="(
                                              val, index
                                            ) in value.content.split(',')">
                                                  <myInput :content="val" :disabled=" archivesFormAllFlag" :draggable="value.selectvalue !=
                                                    item.selectvalue
                                                    " :count="value.content.split(',').length
    " :value.sync="value.remark" :index="index" :key="val" />
                                                </template>
                                              </span>
                                              <span v-else>
                                                {{ value.content }}
                                                <el-input v-if="[1, 3, 4].indexOf(
                                                  value.inputtype
                                                ) !== -1
                                                  " size="mini" :disabled="  archivesFormAllFlag
    " v-model="value.remark" :placeholder="value.content" style="width: 160px"></el-input>
                                              </span>
                                            </el-radio>
                                          </el-radio-group>
                                          <el-checkbox v-if="[2, 4].indexOf(value.inputtype) !== -1
                                            " v-model="value.flag" :label="value.content" :true-label="1" :false-label="0">{{
                                              value.content }}</el-checkbox>
                                          <!-- <el-input v-if="[1,3,4].indexOf(value.inputtype) !== -1" size="mini" v-model="value.remark" :placeholder="value.content" style="width: 160px;"></el-input> -->
                                        </div>
                                        <el-input v-if="[1, 3, 4].indexOf(item.inputtype) !== -1
                                          " size="mini" :disabled="  archivesFormAllFlag" v-model="item.remark" placeholder="请输入" style="width: 160px"></el-input>
                                      </div>
                                      <!-- 三级标题questionnaireitems -->
                                      <div class="three_topic" v-for="item in item.questionnaireitems" :key="item.itemcode">
                                        <span v-if="item.itemname.indexOf('|X|') !== -1">
                                          <template v-for="(
                                        val, index
                                      ) in item.itemname.split(',')">
                                            <myInput :content="val" :count="item.itemname.split(',').length" :value.sync="item.remark" :index="index" :key="val" />
                                          </template>
                                        </span>
                                        <span v-else>
                                          {{ item.itemname }}
                                        </span>
                                        <!-- 三级选项optionitems -->
                                        <div class="three_content">
                                          <!-- <el-checkbox-group v-model="checkList"> -->
                                          <div class="three_options" v-for="(item, index) in item.optionitems" :key="index">
                                            <span v-if="[-1].indexOf(item.inputtype) !== -1
                                              ">
                                              <span v-if="item.content.indexOf('|X|') !== -1
                                                ">
                                                <template v-for="(
                                              val, index
                                            ) in item.content.split(',')">
                                                  <myInput :content="val" :count="item.content.split(',').length
                                                    " :value.sync="item.remark" :index="index" :key="val" />
                                                </template>
                                              </span>
                                            </span>
                                            <el-radio v-model="sexradio" v-if="[0, 3].indexOf(item.inputtype) !== -1
                                              " :label="item.content" style="margin-right: 5px">
                                              <span v-if="item.content.indexOf('|X|') !== -1
                                                ">
                                                <template v-for="(
                                              val, index
                                            ) in item.content.split(',')">
                                                  <myInput :content="val" :count="item.content.split(',').length
                                                    " :value.sync="item.remark" :index="index" :key="val" />
                                                </template>
                                              </span>
                                              <span v-else>
                                                {{ item.content }}
                                              </span>
                                            </el-radio>
                                            <!-- <el-checkbox v-if="[2,4].indexOf(item.inputtype) !== -1" :label="item.content">{{ item.content }}</el-checkbox> -->
                                            <!-- el-input item.content  -->
                                            <el-checkbox :label="item.hoyname" v-if="[2, 4].indexOf(item.inputtype) !== -1
                                              " v-model="item.flag" :true-label="1" :false-label="0">
                                              <span v-if="item.content.indexOf('|X|') !== -1
                                                ">
                                                <template v-for="(
                                              val, index
                                            ) in item.content.split(',')">
                                                  <myInput :content="val" :disabled="  archivesFormAllFlag" :count="item.content.split(',').length" :value.sync="item.remark" :index="index" :key="val" />
                                                </template>
                                              </span>
                                              <span v-else>
                                                {{ item.content }}
                                              </span>
                                            </el-checkbox>
                                            <el-input v-if="[1].indexOf(item.inputtype) !== -1
                                              " size="mini" v-model="item.remark" style="width: 160px"></el-input>
                                            <el-input v-if="[3, 4].indexOf(item.inputtype) !== -1
                                              " :disabled="  archivesFormAllFlag" size="mini" v-model="item.remark" style="width: 160px"></el-input>
                                          </div>
                                        </div>
                                        <!-- </el-checkbox-group> -->
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 自觉症状 -->
                    <div class="contentBox" v-show="archivesFlag == '4'">
                      <div class="info_body">
                        <div class="form_box relative">
                          <el-button type="primary" @click.stop="dialogFun" plain class="btnClas">新增</el-button>
                          <el-table :data="consciousSymptomsData" class="pictureMaterialTableClas" style="width: 100%" :header-cell-style="handleReturnStyle" :border="false" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" :row-class-name="handleTableRowClassName">
                            <el-table-column prop="symptom" label="症状">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.symptom" :disabled="archivesFormAllFlag">
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="degree" label="程度">
                              <template v-slot="param">
                                <el-input placeholder="请输入内容" v-model="param.row.degree" :disabled="archivesFormAllFlag">
                                </el-input>
                              </template>
                            </el-table-column>
                            <el-table-column prop="operatdate" label="出现时间">
                              <template v-slot="param">
                                <el-date-picker v-model="param.row.operatdate" :disabled="archivesFormAllFlag" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                              </template>
                            </el-table-column>
                            <el-table-column prop="" label="操作">
                              <template v-slot="param">
                                <span @click="consciousSymptomsDelete(param.row)" style=" cursor: pointer;color:blue;">删除</span>
                              </template>
                            </el-table-column>
                          </el-table>
                          <!-- 自觉症状 dialog -->
                          <el-dialog title="新增" :close-on-click-modal="false" @close="consciousSymptomsHistory = {}" :visible.sync="consciousSymptomsDiloagFlag">
                            <el-form :model="consciousSymptomsHistory">
                              <el-form-item label="症状" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="consciousSymptomsHistory.symptom">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="程度" :label-width="formLabelWidth">
                                <el-input placeholder="请输入内容" v-model="consciousSymptomsHistory.degree">
                                </el-input>
                              </el-form-item>
                              <el-form-item label="出现时间" :label-width="formLabelWidth">
                                <el-date-picker v-model="consciousSymptomsHistory.operatdate" type="datetime" placeholder="选择日期时间">
                                </el-date-picker>
                              </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                              <el-button @click="consciousSymptomsDiloagFlag = false">取 消</el-button>
                              <el-button type="primary" @click.stop=" btnKeepFun('5')">确
                                定</el-button>
                            </div>
                          </el-dialog>
                          <div>总记录数: {{ consciousSymptomsData?.length }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 团检信息 -->
              <div v-if="message === 'basic'" class="group_body" style="
                  width: 100%;
                  min-height: 300px;
                  background-color: #fff;
                  margin-top: 1px;
                  border-radius: 5px;
                ">
                <div class="team_inspect">
                  <div>
                    <div class="message-title">
                      <!-- <div class="headss">
                        <div class="heads-in"></div>
                        <div>体检套餐</div>
                      </div> -->
                      <div class="message_content" style="width: 100%">
                        <el-form ref="form" :disabled="formFlag" :model="personalForm">
                          <el-row>
                            <!-- <el-col :span="6">
                              <el-form-item size="mini">
                                <el-select @change="handleCheckGroup" style="width: 100%" v-model="personalForm.groupcode"
                                  placeholder="">
                                  <el-option v-for="item in groupitems" :key="item.code" :label="item.name"
                                    :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col> -->
                            <el-col :span="30" size="mini">
                              <el-form-item>
                                <div class="message_content" style="width: 100%">
                                  <div class="state_group">
                                    <div class="state_item">
                                      <div class="title1">总数</div>
                                      <div class="state1">
                                        {{
                                          this.personalForm.nodedflagcount ||
                                          groupTableData.length
                                        }}
                                      </div>
                                    </div>
                                    <div class="state_item">
                                      <div class="title2">费用估计</div>
                                      <div class="state2">
                                        {{
                                          (this.personalForm.regid &&
                                            this.personalForm.price) ||
                                          groupPriceTotal.toFixed(2)
                                        }}
                                      </div>
                                    </div>
                                    <div class="state_item">
                                      <div class="title3">缴费</div>
                                      <div class="state3">
                                        {{
                                          (this.personalForm.regid &&
                                            this.personalForm.actPrice) ||
                                          groupPriceEnd.toFixed(2)
                                        }}
                                      </div>
                                    </div>
                                    <div class="state_item">
                                      <el-button type="primary" @click="handleSelectGroup" size="mini">添加项目</el-button>
                                      <el-button type="primary" @click="hadnleBtnDelCombination" size="mini">删除</el-button>
                                    </div>
                                  </div>
                                </div>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-form>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="checkup_project">
                  <div class="checkup_body">
                  </div>
                  <EasyTable :loading="loading" class="group_table" ref="multipleTable" height="100%" row-id="groupid" :border-around="false" :border-x="false" :border-y="false" :data="groupTableData" :tableOptions="tableOptions" :radio-config="{ fetch: true, rowClick: true }" @row-click="handleChecked" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '25px' }" @selected-change="handleSelectionChange" :cell-style="{ padding: '0' }" />
                </div>
              </div>
            </div>
          </el-col>
          <!-- 主体内容右侧 -->
          <el-col :span="7">
            <div class="content_right">
              <div class="content_table" style="background-color: #fff; border-radius: 5px">
                <div class="message-title">
                  <!-- style="background-color: #f5f7fa" -->
                  <div class="headss">
                    <div class="heads-in"></div>
                    <div>检索条件</div>
                  </div>
                  <div class="condition">
                    <div class="checkup_code">
                      <el-popover ref="popoverRef" placement="bottom-start" trigger="click">
                        <div class="content">
                          <div class="content_item" v-for="item in checkupCodeArr" :key="item.code" @click="handleSelectCondition(item)">
                            {{ item.name }}
                          </div>
                        </div>
                        <el-button type="primary" plain style="width: 80px" size="mini" slot="reference">{{ condition
                        }}</el-button>
                        <!-- <div style="margin-top: 6px;margin-right: 12px;width: 80px;text-align: right; cursor:pointer;"  slot="reference">{{ condition }}</div> -->
                      </el-popover>
                      <el-input size="mini" clearable @clear="handleInputWork" @keyup.enter.native="handleInputWork" v-model="checkupWork" placeholder="请输入内容"></el-input>
                      <el-button type="primary" size="mini" plain @click="handleInputWork" icon="el-icon-search">搜索</el-button>
                    </div>
                    <!-- <div class="unit_box">
                      <div class="unit_title">单位</div>
                      <el-select filterable size="mini" clearable @change="handleCompanycodeChange" v-model="companycode"
                        placeholder="">
                        <el-option v-for="item in companycodeItems" :key="item.companycode"
                          :label="item.companycode + '　' + item.companyname" :value="item.companycode"></el-option>
                      </el-select>
                    </div> -->
                    <div class="checkup_date">
                      <div class="date_box">
                        <div class="date_title">日期范围</div>
                        <el-date-picker @change="handleChangeDate" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                        </el-date-picker>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="checkup_btn-in">
                  <div class="checkup_btn">
                    <!-- <el-button type="primary" size="mini" plain class="checkins" @click="handleClickAll">全部</el-button>
                      <el-button type="primary" size="mini" plain class="checkins" @click="handleClickPersonal">个人</el-button>
                      <el-button type="primary" size="mini" plain class="checkins" @click="handleClickCompany">单位</el-button> -->
                    <el-radio-group v-model="radio" size="small" fill="#2a85ea" @change="radioChange" style="
                        border: 1px solid #2a85ea;
                        border-radius: 5px;
                        color: #409eff;
                      ">
                      <el-radio-button label="全部" style="color: #409eff" value="1"></el-radio-button>
                      <el-radio-button label="个人" style="color: #409eff" value="2"></el-radio-button>
                      <el-radio-button label="单位" style="color: #409eff" value="3"></el-radio-button>
                    </el-radio-group>

                    <el-button class="checkin" type="primary" size="mini" plain style="height: 28px" @click="
                      (setmealRadio = ''), handleGetPersonalRegisterList()
                      ">刷新</el-button>
                    <el-button type="primary" style="margin-left: 20px" size="mini" plain @click="handleCopyCheckIn('all')">复制登记</el-button>
                    <el-button type="primary" size="mini" plain @click="handleCopyCheckIn('project')" style="margin-left: 10px">复制项目</el-button>
                  </div>
                  <!-- 登记人员列表 -->
                  <div class="condition_table" @mouseleave="handlemouseLeaveReset">
                    <EasyTable row-id="regid" :loading="loadingCondition" class="condition_table_es" height="100%" :data="conditionData" :row-style="rowstyle" :tableOptions="conditionOptions" :radio-config="{
                        selectedVal: setmealRadio,
                        rowClick: true,
                      }" @checked-change="handleCheckCondition" @cell-mouse-enter="handleCheckConditionEnter" @cell-mouse-leave="handleCheckConditionLeave" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }" />
                    <el-pagination :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200, 300]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 选择项目分组弹框 -->
      <SetMealDialog_zyb v-if="showProjectDialog" :sex="pageState == 'edit' && choosePeople.sex || pageState == 'add' && personalForm.sex" :groupTableData="groupTableData" @submit="handleProjectSubmit" @close="showProjectDialog = false" />
      <!-- 收费明细弹出层 -->
      <el-dialog class="dialog-mini charge_details" width="74%" top="4%" :close-on-click-modal="false" title="收费列表" :visible.sync="showChargeDetails" @close="handleCloseChargeDetails">
        <div style="display: flex; align-items: center">
          项目总数：{{ chargeDataList.length }} 未交费项目：{{
            noCharge.length
          }}个
          <el-input style="width: 300px; margin-left: 30px" placeholder="请输入搜索内容" size="mini" v-model="chargeDatainput" clearable>
          </el-input>
        </div>
        <div class="table_box">
          <EasyTable :loading="loadingGroup" class="table_item" height="100%" row-id="combinecode" :data="chargeDataListData" :tableOptions="chargeGroupOptions" :checkbox-config="{ rowClick: true, fetchVal: true }" @selected-change="handleSelectSharge" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          <div class="charge_form">
            <div class="form_body">
              <div class="form_body_item">
                <span class="title">体检号：</span>
                <span class="value blue">{{ personalForm.regid }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">姓名：</span>
                <span class="value blue">{{ personalForm.name }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">性别：</span>
                <span class="value blue">{{
                  personalForm.sex == 0
                  ? "未知"
                  : personalForm.sex == 1
                    ? "男"
                    : "女"
                }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">团检：</span>
                <span class="value blue">{{ personalForm.companyname }}</span>
              </div>
              <div class="form_body_item">
                <!-- payitems -->
                <span class="title">支付：</span>
                <span class="value blue">
                  <el-select size="mini" v-model="chargeItems.paymenttype" clearable placeholder="请选择支付方式">
                    <el-option v-for="(item, index) in payitems" :key="index" :label="item.name" :value="item.code">
                    </el-option>
                  </el-select>
                </span>
              </div>
              <div class="form_body_item">
                <span class="title">原价：</span>
                <span class="value red">{{ chargeItems.total }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">折扣：</span>
                <span class="value red">{{ chargeItems.discount }}</span>
                <!-- <span class="value red">{{ chargeItems.discount * 100 }}%</span> -->
              </div>
              <div class="form_body_item">
                <span class="title">费用：</span>
                <span class="value red">{{ chargeItems.discounttotal }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">状态：</span>
                <span class="value red">{{
                  chargeItems.chargeflag == 0
                  ? "未收费"
                  : chargeItems.chargeflag == 1
                    ? "收费"
                    : "退费"
                }}</span>
              </div>
            </div>
            <div class="form_btn">
              <el-button size="mini" v-if="chargeItems.chargeflag != 1" type="success" @click="handleSetChargeConfirm">收费</el-button>
              <el-button size="mini" v-if="chargeItems.chargeflag == 1" type="warning" @click="handleSetChargeCancel">退费</el-button>
              <el-button size="mini" type="danger" @click="handleCloseChargeDetails">取消</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 签到流程 -->
      <FlowPath v-if="showFlowPath" :regid="flowPathRegid" @close="handleCloseFlowPath" />
      <!-- 客户历史体检记录弹框 -->
      <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" title="历史体检信息" :visible.sync="historyShow" @close="handleCloseHistory">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" row-id="groupid" :data="historyData" :tableOptions="historyOptions" :radio-config="{ fetch: true, rowClick: true }" @row-click="handleHistoryCheck" @cell-click="handleHistoryCopy" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 历史项目弹框 -->
      <el-dialog class="dialog-mini history_table" width="65%" height="60%" top="10%" :close-on-click-modal="false" title="历史项目" :visible.sync="historyProjectShow" @close="handleClosehistoryProject">
        <div class="history_table_box">
          <EasyTable :loading="loadingGroup" class="history_table_item" height="100%" row-id="groupid" :data="hTable1Data" :tableOptions="hTable1Options" :radio-config="{ fetch: true, rowClick: true }" @row-click="handleCheckhRow" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          <EasyTable :loading="loadingItem" class="history_table_item" height="100%" row-id="groupid" :data="hTable2Data" :tableOptions="hTable2Options" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleSubmitHistory">继 存</el-button>
          <el-button size="mini" @click="handleClosehistoryProject">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 智能推荐 -->
      <el-dialog class="dialog-mini intellect" width="45%" height="60%" top="10%" :close-on-click-modal="false" title="智能推荐" :visible.sync="intellect" @close="handleCloseIntellect">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" :data="intellectData" :tableOptions="intellectOptions" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectIntellect" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleSubmitIntellect">确 认</el-button>
          <el-button size="mini" @click="handleCloseIntellect">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 认证身份 -->
      <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" :show-close="false" title="身份确认" :visible.sync="showConfirmPassword">
        <div class="discount_box">
          <el-input style="width: 100%" size="mini" placeholder="请输入密码" v-model="confirmPassword" show-password clearable @keyup.enter.native="handleConfirmConfirmPassword">
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmConfirmPassword">确 认</el-button>
          <el-button size="mini" @click="handleCloseConfirmPassword">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 折扣 -->
      <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="项目折扣" :visible.sync="discount" @close="handleCloseDiscount">
        <div class="discount_box">
          <el-input size="mini" placeholder="请输入折扣" max="100" min="1" v-model="discountValue" clearable>
          </el-input>
          <div>折</div>
          <!-- <div>%</div> -->
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmDiscount">确 认</el-button>
          <el-button size="mini" @click="handleCloseDiscount">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 预约日历 -->
      <Calendar v-if="showCalendar" :makeNumber="1" :makeFlag="makeFlag" @submit="handleSaveAppointment" @close="handleCloseCalendar" />
      <!-- 检索组件 -->
      <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" @checkIn='handleSearchCheckIn' @copy="handleSearchCopy" />
      <!-- 打印申请单 -->
      <el-dialog title="打印申请单" :visible.sync="showApplyPrint" width="50%">
        <el-tree ref="casetree" :data="applyPrintTree" :props="applyPrintProps" :check-strictly="false" :check-on-click-node="true" show-checkbox default-expand-all @check="handleCheckChangeApplyPrint" node-key="code">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCancelApplyPrint">取 消</el-button>
          <el-button size="mini" @click="handlePreviewApply">预 览</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitApplyPrint">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 预览弹框 -->
      <el-dialog title="预览" class="preview_box" :visible.sync="dialogVisible" top="80px" width="700px" @close="handleCloseDialog">
        <iframe ref="pdfCotainer" :src="pdfUrl" width="100%" style="height: calc(100vh - 247px)"></iframe>
      </el-dialog>
      <!-- 今日开单组合查询弹框 -->
      <el-dialog title="今日组合开单量" :visible.sync="showTodayCombine" width="50%" class="todaycombine" @close="handleTodayCombinedBillingClose">
        <div class="tc_content">
          <EasyTable :loading="loadingGroup" class="todaycombine" height="100%" :data="todayCombineList" :tableOptions="todayCombineOptions" :radio-config="{ fetch: true, rowClick: true }" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleTodayCombinedBillingClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 调查问卷 -->
    <transition name="fade" mode="in-out">
      <!-- choosePeople.regid -->
      <HealthView v-if="showHealthView" :userInfo="choosePeople" @close="showHealthView = false" />
    </transition>
  </div>
</template>
<script>
import * as Sys_ConfiguringPrinters from "@/api/Sys_ConfiguringPrinters";
import Sticky from "@/components/Sticky"; // 引入按钮组
import permissionBtn from "@/components/PermissionBtn";
import FlowPath from "@/components/flowPath"; // 签到流程组件
import { mapGetters } from "vuex";
import myInput from "./input";
import { getSysConfigInfo } from "@/api/sysconfig";
import { setDateRange } from "@/utils/setDateRange.js";
import {
  questionnaireTitleList,
  medicalHistory,
  questionnaire,
  SaveMedicalHistory,
  SaveQuestionnaire,
  DeteleQuestion,
} from "@/api/surveyinformation.js";
// 引入页面接口
import {
  getSysConfig,
  getPersonalRegisterList,
  getPersonalRegisterList2,
  getPersonalDetail,
  getPersonalOccupationDetail,
  setSubmit,
  getBatchOrGroup,
  setDelete,
  getCostDetail,
  getFiles,
  setFiles64,
  getRegisterInfo,
  getRecommend,
  setChargeConfirm,
  setChargeCancel,
  setDiscount,
  getDetailedList,
  getPatientInfo,
  setImportImage,
  getAllUser,
  getPublicConfig,
  setDeleteCombine,
  getCombineStatic,
  getIdCardInfo,
  checkUserAcount,
  updateCombine,
  GetPatientInfo_zyb,
} from "@/api/personalregister.js";
import { printBase64 } from "@/api/printreport.js";
import Project from "./components/project.vue";
import Calendar from "@/components/calendar"; // 预约日历组件
import SearchDialog from "@/components/searchDialog/index_zyb.vue";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
import SetMealDialog_zyb from "@/components/SetMealDialog/index_gyey_zyb.vue"; // 新项目弹框
import CreatedForm from "@/components/Formcreated/components/CreatedForm";
import HealthView from "@/components/healthView/index.vue"; // 健康视图
import { setAppointmentSave } from "@/api/appointment.js";
import { setFilesDelete } from "@/api/unitregistration.js";
import * as company_archives from "@/api/company_archives";
import * as users from "@/api/users";
import * as userlogin from "@/api/login";
import {
  getLoadType1,
  getLoadType2,
  getHarm,
  setAddData,
  setEditData,
  getLoadProject,
  getGetHarms,
  GetProfessionList,
  SetEditProfession,
  OccupationalDiseaseUpload,
  GetUserEmploymentHistory,
  Getirradiation,
  GetPurposeOfTheInspection,
  GetFileUrl,
  ExcelToDb,
  SaveQuestionnaireArchives,
  QuestionnaireArchives,
  getTemplateList,
  GetOccupationCombine,
  GetDate,
  GetSetmealCombine,
  addCompany,
  getCompanyArchivesDetail,
  AddOccupationalDisease,
  GetUserReview,
  GetUserReviewItem,
} from "@/api/register.js";

export default {
  name: "",

  components: {
    Sticky,
    permissionBtn,
    Project,
    FlowPath,
    Calendar,
    SearchDialog,
    Questionnaire,
    SetMealDialog_zyb,
    HealthView,
    myInput,
    CreatedForm,
  },

  data() {
    // console.log(setDateRange("2000-01-05", "2000-01-05"));
    var checkAge = (rule, value, callback) => {
      setTimeout(() => {
        if (!/(^[1-9]\d*$)/.test(this.personalForm.age)) {
          callback(new Error("请输入数字值"));
        } else {
          if (this.personalForm.age > 150) {
            this.personalForm.age = 0;
            callback(new Error("超出年龄限制范围"));
            this.$message.error("超出年龄限制范围");
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      companyitems: [], //单位名称下拉数据
      isIdCardFlag: false, // 判断是否是输入身份证号进入
      seniorityMonth: "月", // 总工龄单位
      seniorityMonthFlag: false, // 总工龄的月份开关
      seniorityMonthFlag2: false, // 总工龄的月份开关
      formLabelWidth: "120px", // dialog 宽度
      SelectIndustryData: [], // 行业 下拉框数据
      SelectJobsData: [], // 工种 下拉框数据
      DialogFormSelectData: [], // 添加危害dialog 选择的数据
      DialogFormData: [], // 添加危害dialog数据
      HarmDialogFlag: false, //  添加危害项目开关
      IrradiationDialogFlag: false, //  添加照射种类项目 开关
      seniorityDate1: [
        { code: "0", value: "天" },
        { code: "1", value: "月" },
        { code: "2", value: "年" },
      ], // 年月日单位
      seniorityDate2: [
        { code: "0", value: "天" },
        { code: "1", value: "月" },
        { code: "2", value: "年" },
      ], // 年月日单位
      caseCheckAll: false, //全选按钮的绑定值
      isIndeterminate: false, //全选按钮的全选，半选样式
      showConfirmPassword: false,
      confirmPassword: "",
      discountProperty: [],
      companycode: "",
      companycodeItems: [],
      lodop: "",
      isSearchDiaFrom: false,
      showSearch: false, // 显示检索组件
      // 默认选择第一个
      radio: "全部",
      showSubmitCamera: false, // 显示提交按钮
      cameraBase64: "",
      showFlowPath: false, // 控制显示登记流程
      flowPathRegid: "", // 登记流程查询ID
      pageState: "", // 当前页面状态 add edit preview
      setmealRadio: "", // 单选选中id
      showChargeDetails: false,
      message: "basic", // 基本信息-basic 其他信息-other
      typelist: [
        {
          titlecode: "basic",
          titlename: "基本信息",
          titletype: "basic",
        },
        {
          titlecode: "other",
          titlename: "档案信息",
          titletype: "other",
        },
      ],
      pageSwitch: "", //页面切换key
      checkList: [],
      checkList1: [], // 个人病史选择
      checkList2: [], // 家族病史选择
      physicalsymptoms: [], // 身体症状选择
      inputValue1: "",
      medicalHistory: [], // 病史
      questionnairelist: [], // 问卷
      sexradio: [],
      titletype: "", // 标题类型
      showMyInput: true,
      inputIdCard: "", // 健康卡
      formFlag: true, // 控制表单是否允许编辑
      groupdis: true, // 控制团检表单是否允许编辑
      loddp: "",
      HarmMsg: "", // 危害
      HarmSearch: "", // 职业危害搜索框
      archivesFormHarmMsg: "", // 危害
      personalForm: {
        reviewtype: 0, // 初检
        workyearMonth: "", //月份
        seniorityMonth: "月",
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 1,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        // checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        filebase64: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
        harmcode: "",
        harmname: "",
        worktypecode: "",
        worktypename: "",
        workyear: "",
        harmwordyear: "",
        harmwordmonth: "",
        industrytypecode: "",
        industrytypename: "",
        harmwordmonthunit: "0",
        jobno: "",
        workshop: "",
        level: 0,
        reporttake: "",
        remark: "",
        nativeplace: "",
        occupation: "",
        nation: "",
        email: "",
        department: "",
        guidancecode: "",
        guidancename: "",
        salesmancode: "",
        salesmanname: "",
        businesssource: "",
        remindcontent: "",
        remindflag: 0,
        notmyself: 0,
        actualname: "",
        actualsex: 0,
        actualageunit: "岁",
        idtype: "01",
        medicalcertify: "",
        jobin: "",
        positionin: "",
        industryname: "",
        harmwordyearunit: "1",
        workyearunit: "1",
        harms: [{ name: "", value: "" }],
        customermedicaldetails: [
          {
            setmealcode: "", //套餐编码
            setmealname: "", // 套餐名称
            combinecode: "", //	 组合编码
            combinename: "", //	 组合名称
            deptcode: "", //	 科室编码
            deptname: "", //	 科室名称
            price: "", // 价格
            discount: "", //	 折扣
            discountprice: "", // 折后价格
            delflag: "", //	 删除标志
            liscuv: "", // 检验合并码
            qty: "", // 数量
          },
        ],
        checkobjectivecode: "",
        checkobjectivename: "",
        personalflag: 0, // 团检类型
      }, // 个人信息
      archivesForm: {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 1,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        // checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        filebase64: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
        harmcode: "",
        harmname: "",
        worktypecode: "",
        worktypename: "",
        workyear: "",
        harmwordyear: "",
        industrytypecode: "",
        industrytypename: "",
        jobno: "",
        workshop: "",
        level: 0,
        reporttake: "",
        remark: "",
        nativeplace: "",
        occupation: "",
        nation: "",
        email: "",
        department: "",
        guidancecode: "",
        guidancename: "",
        salesmancode: "",
        salesmanname: "",
        businesssource: "",
        remindcontent: "",
        remindflag: 0,
        notmyself: 0,
        actualname: "",
        actualsex: 0,
        actualageunit: "岁",
        idtype: "01",
        medicalcertify: "",
        jobin: "",
        positionin: "",
        industryname: "",
        harmwordyearunit: "0",
        workyearunit: "0",
        harms: [{ name: "", value: "" }],
        customermedicaldetails: [
          {
            setmealcode: "", //套餐编码
            setmealname: "", // 套餐名称
            combinecode: "", //	 组合编码
            combinename: "", //	 组合名称
            deptcode: "", //	 科室编码
            deptname: "", //	 科室名称
            price: "", // 价格
            discount: "", //	 折扣
            discountprice: "", // 折后价格
            delflag: "", //	 删除标志
            liscuv: "", // 检验合并码
            qty: "", // 数量
          },
        ],
        checkobjectivecode: "",
        checkobjectivename: "",
        formcontroldata: {}, // 动态表单数据
        irradiation: "", // 照射种类字符串
      }, // 档案信息数据
      archivesFormJSON: {}, // 渲染JSON
      archivesFlag: "0", // 档案信息切换页面开关
      AllFormData: [], // 存放案例全部数据
      pastMedicalHistoryData: [], // 既往病史数据
      consciousSymptomsData: [], // 自觉症状
      workHistoryFlag: "0", // 工作既往史内的表格开关
      arsid: "", // 档案ID
      careerHistoryData: [
        //   {
        //   arsid:'' , // 档案id
        //   workunit:"",//工作单位
        //   startdate:"", // 开始时间
        //   enddate:"", // 结束时间
        //   workshop:"", // 车间
        //   worktypecode:"" ,// 工种编号
        //   worktypename:"", // 工种名称
        //   harmname:"", // 有害因素名称(从字典选择,可手动编辑)
        //   concentration:"",// 有害因素浓度
        //   protectivemeasures:"",// 防护措施
        //   operatdate:"",// 操作日期
        //   operatorcode:"",// 操作人编码
        //   operatorname:"",// 操作人姓名
        //   seqno:"",// 排序
        // }
      ], // 工作既往内的表格数据 职业史
      radiationWorkData: [], // 工作既往内的表格数据 放射工作职业
      workHistoryData: [], // 工作既往内的表格数据  职业病史
      archivesFormAllFlag: true, // 全部表格开关  开启才能编辑
      pictureMaterialData: [], // 工作既往内的表格数据  档案图片资料
      //
      DiloagpastMedicalHistory: {}, //既往病史 的dialog
      pastMedicalDiloagFlag: false, // dialog 开关
      careerHistoryHistory: {}, //   职业史 的dialog
      careerHistoryDiloagFlag: false, //   dialog的开关
      radiationWorkHistory: {}, //     放射工作职业史的dialog
      radiationWorkDiloagFlag: false, // dialog的开关
      workHistoryHistory: {}, // 职业病史
      workHistoryDiloagFlag: false, //  职业病史dialog
      consciousSymptomsHistory: {}, // 自觉症状dialog
      consciousSymptomsDiloagFlag: false, // dialog 开关
      //
      pictureMaterialheaders: {
        "X-Token": "",
      }, // 上传token
      regID: "", // 存用户id
      contentData: {}, // 动态表单
      formid: "",
      fileIndex: "", // 点击导入 保存当前行索引
      viewFlag: false, // 图片查看的开关
      viewUrl: "", // 存放查看图片 url地址
      occupationItems: [], // 职业类型集合
      typeOfIrradiationMSG: "", //存放照射种类 字符串
      typeOfIrradiationData: [], //存放照射种类数据
      typeOfIrradiationchooseData: [], //存放照射种类  已选择数据
      PurposeOfTheInspectionData: [], // 存放检查目的下拉框数据
      interrogationCode: "", // 保存问诊的code 保存会用到
      unitNameData: [], // 单位名称
      nationItems: [], // 民族集合
      doctoritems: [], // 民族集合
      companyitems: [], // 团检名称 // 单位选择
      batchitems: [], // 团检名称 // 批次选择
      groupitems: [], // 团检名称 // 分组选择
      harmitems: [], // 职业病信息 // 危害因素集合
      industryitems: [], // 职业病信息 // 行业类型集合
      workitems: [], // 职业病信息 // 工种集合
      groupTableData: [], // 体检项目表信息
      groupPriceTotal: 0, // 体检项目总金额
      groupPriceEnd: 0, // 体检项目已经缴费金额
      conditionData: [], // 检索条件表信息
      inputIdCard: "",
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字
      conditionDate: "", //检索体检日期
      healthcardcode: "idcard", //选中健康卡/身份证对象编码
      healthcardArr: [
        { code: "idcard", name: "身份证" },
        { code: "healthcard", name: "门诊卡" },
      ], // 检索条件身份证等数组
      checkupCodeArr: [
        { code: "regid", name: "体检号" },
        { code: "checkno", name: "档案号" },
        { code: "idcard", name: "身份证" },
        { code: "hiscode", name: "门诊卡号" },
        { code: "name", name: "姓名" },
      ], // 检索条件身份证等数组
      sexarr: [
        // { code: 0, name: "未知" },
        { code: 1, name: "男" },
        { code: 2, name: "女" },
      ], // 性别选择
      marriagearr: [
        { code: "未知", name: "未知" },
        { code: "未婚", name: "未婚" },
        { code: "已婚", name: "已婚" },
        { code: "离异", name: "离异" },
      ], // 婚姻状态
      agearr: [
        { code: "岁", name: "岁" },
        { code: "月", name: "月" },
        { code: "天", name: "天" },
      ], // 年龄单位
      // 写死年龄单位
      agearrNew: [{ code: "岁", name: "岁" }],
      checktypeitems: [], // 检查类型
      dateRange: "1", // ,默认日期范围
      pickerOptions: {
        shortcuts: [
          {
            text: "近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      }, // 日期选择器配置
      persontype: "", // 检索条件 类型 全部：“”，个人：“0”，单位：“1”
      choosePeople: undefined, // 当前选中编辑人员
      showProjectDialog: false, // 控制显示体检项目弹框
      loading: false, // 加载效果
      chargeDataList: [], // 收费明细表格主表
      chargeDatainput: "",
      chargeItems: {}, // 收费明细右侧明细表
      payitems: [], // 收费明细支付方式集
      chargeTotalPrice: 0, // 收费明细总金额
      loadingGroup: false, //收费明细表格主表加载效果
      loadingItem: false, //收费明细右侧明细表加载效果
      loadingCondition: false, // 检索条件表格加载效果
      avatarImg: require("./images/lin.jpg"), // 头像
      showCanvas: false, //弹窗
      photoCanvasFlag: false, //弹窗
      os: false, //控制摄像头开关
      thisVideo: null, // 媒体对象
      thisContext: null, //画图对象
      thisCancas: null, // 当前相机对象
      videoWidth: 300, // 拍照尺寸宽
      videoHeight: 450, // 拍照尺寸高
      historyData: [], // 客户历史体检记录数据
      historyShow: false, // 客户历史体检记录弹框显示
      historyProjectShow: false, // 历史项目弹框显示
      noCharge: [], // 历史项目弹框显示
      hTable1Data: [], // 历史项目表格数据
      choosehTableRow: undefined, // 当前选中历史项目
      hTable2Data: [],
      intellect: false, // 智能推荐弹框显示
      intellectData: [], // 智能推荐表格数据
      intellectSelect: [], // 多选选中数据
      discount: false, // 折扣弹框
      discountValue: 0, // 折扣弹框
      showCalendar: false, // 控制显示预约日历
      makeFlag: "manual", // 日历预约标识  手动/manual 自动/auto
      showQuestionnaire: false, // 调查问卷显示
      questionnaireId: "",
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      showHealthView: false, // 健康视图
      appointmentData: undefined, // 预约数据
      cardReaderFlag: "新中新", // 读卡器品牌 华视 精伦 新中新
      isSetSubmit: false,
      rulePersonalForm: {
        numberlimit: { validator: checkAge, required: true, trigger: "blur" },
        idcard: [
          {
            required: true,
            message: "请填写身份证",
            trigger: "blur",
          },
        ],
      },
      applyPrintTree: [], // 打印申请单选择科室数据树
      showApplyPrint: false, // 打印申请单选择科室数据树
      choosePrintArr: [], // 打印申请单选择科室编码
      jobinItems: [],
      idtypeItems: [
        {
          code: "01",
          name: "身份证",
        },
        {
          code: "03",
          name: "护照",
        },
        {
          code: "06",
          name: "港澳居民来往内地通行证",
        },
        {
          code: "07",
          name: "台湾居民来往内地通行证",
        },
      ], // 证件类型
      applyPrintProps: {
        label: "name",
        children: "children",
      },
      buttons: [],
      size: "mini",
      domIdArr: ["btnPaySingle", "btnLabel"],
      dialogVisible: false,
      pdfUrl: "",
      reporttakeItems: [], // 领取报告方式集合
      showTodayCombine: false,
      todayCombineList: [],
      loadingBtn: false, // 按钮加载效果
      showTableMoveId: "", // 显示更多操作
      leaveTimeId: "", // 显示更多操作定时器ID
      isGuideSingle: false, // 是否点击打印指引单
      selectSharge: [], // 退费选中项
      showDelPhotoBtn: false, // 删除照片按钮
      companycodes: "", //判断单位打印指引单类型 12666
      seven: "",
      sourceregid: "", // 初查复查regid
      comboPackagesSelect: [], // 组合套餐数据
      // --------新增字典按钮-------------
      AddindustryFlag: false, // 新增行业dialog开关
      AddJobsDictionaryFlag: false, // 工种
      AddIndustryDictionaryFlag: false, // 单位名称
      // 数据
      Addindustry_HY_DialogData: {}, // 行业
      AddJobsDictionaryDialogData: {}, // 工种
      AddIndustryDialogData: {
        address: "",
        bankaccount: "",
        companyhcode: "",
        companyname: "",
        companytel: "",
        contacts: "",
        email: "",
        faxnumber: "",
        legalperson: "",
        openingbank: "",
        postalcode: "",
        registername: "",
        remark: "",
        seqno: "",
        shortname: "",
        taxnumber: "",
        telephone: "",
        typecode: "",
      }, // 单位名称
      bankitems: [], //开户银行
      organization_companyitems: [], //上级单位
      selectLoading: false, //  远程搜索loding状态
      typeitems: [], // 单位类型
      ReviewProjectDialogData: [], // 最后一次复查项目数据
      ReviewProjectDialogFlag: false, // 同上 dialog开关
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    // 收费列表表格搜索数据
    chargeDataListData() {
      const search = this.chargeDatainput;
      if (search) {
        return this.chargeDataList.filter((data) => {
          return Object.keys(data).some((key) => {
            if (key === "price") return;
            let containArr = ["combinename", "chargecode"];
            if (containArr.includes(key)) {
              return (
                String(data[key]).toLowerCase().indexOf(search.toLowerCase()) >
                -1
              );
            }
          });
        });
      }
      return this.chargeDataList;
    },

    // 体检套餐表格配置
    tableOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "体检组合",
          prop: "combinename",
          width: 200,
          omit: 1,
        },
        {
          title: "原价",
          prop: "price",
        },
        {
          title: "折扣",
          prop: "discount",
          returnVal: (value) => {
            return value;
            // return `${value * 100} %`;
          },
        },
        {
          title: "折后价格",
          prop: "discountprice",
          returnVal: (value, data) => {
            return value.toFixed(2);
            // let result = data.price * data.discount;
            // return Math.floor(result * 100) / 100;
          },
        },
        {
          title: "缴费",
          prop: "chargeflag",
          returnVal: (val) => {
            return val == 0
              ? "未收费"
              : val == 1
              ? "已收费"
              : val == 2
              ? "申请退费"
              : "已退费";
          },
        },
        {
          title: "开单时间",
          prop: "operatordate",
          width: 150,
          omit: 1,
        },
        {
          title: "检查科室",
          prop: "deptname",
        },
        {
          title: "检查单号",
          prop: "detid",
          width: 150,
          omit: 1,
        },
        {
          title: "结算方式",
          prop: "settlementtype",
          returnVal: (val, row) => {
            return val == 0 ? "单位结算" : "个人结算";
          },
        },
        {
          title: "加减",
          prop: "addflag",
          returnVal: (val, row) => {
            return val == 1 ? "加" : row.dedflag == 1 ? "减" : "";
          },
        },
        {
          title: "开单医生",
          prop: "operatorname",
          width: 100,
          omit: 1,
        },

        {
          title: "体检套餐",
          prop: "setmealname",
          width: 130,
          omit: 1,
        },
        {
          title: "检查状态",
          prop: "status",
          returnVal: (val) => {
            return val == 0 ? "登记" : val == 1 ? "弃检" : "完成";
          },
        },
      ];
    },
    // 检索条件表信息表格配置
    conditionOptions() {
      return [
        {
          type: "radio",
          width: 30,
        },
        {
          title: "",
          width: 20,
          omit: 1,
          // attrs: {
          //   fixed: "right",
          // },
          render: (h, data) => {
            return (
              <el-dropdown trigger="click" vOn:command={this.handleCommand}>
                <span
                  class="el-dropdown-link"
                  v-show={this.showTableMoveId === data.regid}
                  style="cursor:pointer;font-weight: 600;"
                >
                  ⋮
                </span>
                <el-dropdown-menu slot="dropdown">
                  {/* <el-dropdown-item command="复制登记">
                    复制登记
                  </el-dropdown-item>
                  <el-dropdown-item command="复制项目">
                    复制项目
                  </el-dropdown-item> */}
                  <el-dropdown-item command="流程追踪">
                    流程追踪
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            );
          },
        },
        {
          width: 25,
          render: (h, data) => {
            let src = "";
            switch (data.status) {
              case 0:
                src = require("@/assets/images/登记.png");
                break;
              case 1:
                src = require("@/assets/images/预约.png");
                break;
              case 2:
                src = require("@/assets/images/签到.png");
                break;
              case 3:
                src = require("@/assets/images/检查.png");
                break;
              case 4:
                src = require("@/assets/images/交表.png");
                break;
              case 5:
                src = require("@/assets/images/总检.png");
                break;
              case 6:
                src = require("@/assets/images/总检.png");
                break;
              case 7:
                src = require("@/assets/images/审核.png");
                break;
              default:
                break;
            }
            return (
              <img
                class="user-avatar"
                draggable={false}
                style="width:15px;height:15px;"
                src={src}
              />
            );
          },
        },
        {
          title: "姓名",
          prop: "name",
          width: 80,
          omit: 1,
        },
        {
          title: "性别",
          width: 65,
          prop: "sex",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          width: 65,
          prop: "age",
          returnVal: (value, data) => {
            return `${value}`;
          },
        },
        {
          title: "体检号",
          prop: "regid",
          width: 120,
          omit: 1,
        },
        {
          title: "序号",
          prop: "seqno",
          width: 120,
          omit: 1,
        },
        {
          title: "开单医生",
          prop: "operatorname",
          width: 140,
          omit: 1,
        },
        {
          title: "档案号",
          prop: "checkno",
          width: 120,
          omit: 1,
        },
        {
          title: "收费",
          prop: "price",
          width: 100,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
          omit: 1,
        },
        {
          title: "单位名称",
          prop: "companyname",
          width: 150,
          omit: 1,
        },
        {
          title: "单位分组",
          prop: "groupname",
          width: 120,
          omit: 1,
        },
        {
          title: "登记日期",
          prop: "regdate",
          width: 150,
          omit: 1,
        },
        {
          title: "状态",
          prop: "status",
          width: 100,
          enumType: [
            {
              value: 0,
              label: "已登记",
            },
            {
              value: 1,
              label: "已预约",
            },
            {
              value: 2,
              label: "已签到",
            },
            {
              value: 3,
              label: "体检中",
            },
            {
              value: 4,
              label: "已交表",
            },
            {
              value: 5,
              label: "可总检",
            },
            {
              value: 6,
              label: "已总检",
            },
            {
              value: 7,
              label: "已审核",
            },
          ],
        },
      ];
    },
    // 收费明细表格主表表格配置
    chargeGroupOptions() {
      return [
        {
          type: "selection",
          width: 45,
          align: "center",
          attrs: {
            selectable: this.handleChargeSelected,
          },
        },
        {
          title: "体检组合",
          prop: "combinename",
          width: 165,
          omit: 1,
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
          width: 110,
          omit: 1,
        },
        {
          title: "收费状态",
          prop: "chargeflag",
          width: 110,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                <span v-show={data.chargeflag == 0}>未收费</span>
                <span v-show={data.chargeflag == 1} style="color:#409167">
                  已收费
                </span>
                <span v-show={data.chargeflag == 2} style="color:#9da408">
                  申请退费
                </span>
                <span v-show={data.chargeflag == 3} style="color:#d63737">
                  已退费
                </span>
              </div>
            );
          },
        },
        {
          title: "价格",
          prop: "price",
          returnVal: (value) => {
            return `${value} 元`;
          },
        },
        {
          title: "折扣",
          prop: "discount",
          returnVal: (value) => {
            return value;
            // return `${value * 100} %`;
          },
        },
        {
          title: "折后价格",
          prop: "discountprice",
          returnVal: (value) => {
            return `${value} 元`;
          },
        },
        {
          title: "收费员",
          prop: "operatorname",
          width: 110,
          omit: 1,
        },
      ];
    },
    // 收费明细右侧明细表表格配置
    chargeItemOptions() {
      return [
        {
          title: "名称",
          prop: "itemname",
          width: 150,
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
        },
        {
          title: "数量",
          prop: "qty",
        },
        {
          title: "编码",
          prop: "itemcode",
        },
      ];
    },
    // 历史信息表格配置
    historyOptions() {
      return [
        {
          title: "体检号",
          prop: "regid",
          align: "center",
          width: 110,
        },
        {
          title: "档案号",
          prop: "checkno",
          align: "center",
          width: 110,
        },
        {
          title: "姓名",
          prop: "name",
          align: "center",
        },
        {
          title: "性别",
          prop: "sex",
          align: "center",
          returnVal: (value) => {
            return value == 0 ? "未知" : value == 1 ? "男" : "女";
          },
        },
        {
          title: "年龄",
          prop: "age",
          align: "center",
          returnVal: (value) => {
            return `${value}岁`;
          },
        },
        {
          title: "电话",
          prop: "telephone",
          width: 110,
        },
        {
          title: "身份证号",
          prop: "idcard",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "团检",
          prop: "companyname",
          align: "center",
          width: 175,
          omit: 1,
        },
        {
          title: "体检时间",
          prop: "regdate",
          align: "center",
          width: 130,
        },
      ];
    },
    // 历史项目表格配置1
    hTable1Options() {
      return [
        {
          title: "姓名",
          prop: "name",
        },
        {
          title: "体检时间",
          prop: "regdate",
        },
      ];
    },
    // 历史项目表格配置2
    hTable2Options() {
      return [
        {
          title: "科室",
          prop: "deptname",
          omit: 1,
          width: 100,
        },
        {
          title: "体检组合",
          prop: "combinename",
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
          width: 75,
          returnVal: (value) => {
            return `${value} 元`;
          },
        },
      ];
    },
    // 智能推荐表格配置
    intellectOptions() {
      return [
        {
          type: "selection",
          width: 45,
        },
        {
          title: "科室",
          prop: "deptname",
          omit: 1,
        },
        {
          title: "体检组合",
          prop: "combinename",
          omit: 1,
        },
        {
          title: "检查人数",
          prop: "rate",
          width: 100,
          returnVal: (value) => {
            return `${value}%`;
          },
        },
      ];
    },
    // 今日组合开单
    todayCombineOptions() {
      return [
        {
          title: "组合名称",
          prop: "combinename",
          width: 200,
          omit: 1,
        },
        {
          title: "最大数量",
          prop: "total",
          width: 120,
          omit: 1,
        },
        {
          title: "已开",
          prop: "usedcout",
          omit: 1,
        },
        {
          title: "剩余",
          prop: "leftcount",
          omit: 1,
        },
      ];
    },
    // 已选择危害项目
    DialogFormAlreadySelected() {
      return [
        {
          title: "职业危害",
          prop: "name",
          width: 150,
          omit: 1,
        },
        {
          title: "监护种类",
          prop: "typesOfGuardianship",
          width: 150,
          omit: 1,
        },
        {
          title: "操作",
          width: 60,
          omit: 1,
          render: (h, data) => {
            return (
              <span
                style="color:red; cursor: pointer;"
                vOn:click_stop_prevent={() => {
                  this.hadnleHarmDialogDel(data);
                }}
              >
                删除
              </span>
            );
          },
        },
      ];
    },
    // 职业危害字典
    DialogFormItem() {
      return [
        {
          title: "职业危害",
          prop: "name",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return <span style="color:blue;cursor: pointer;">{data.name}</span>;
          },
        },
        {
          title: "监护种类",
          prop: "typesOfGuardianship",
          width: 150,
          omit: 1,
        },
        {
          title: "操作",
          width: 60,
          omit: 1,
          render: (h, data) => {
            return (
              <span
                style="color:blue; cursor: pointer;"
                vOn:click_stop_prevent={() => {
                  this.hadnleHarmDialogSelect(data);
                }}
              >
                选择
              </span>
            );
          },
        },
      ];
    },
    // 照射种类字典
    typeOfIrradiationDataItem() {
      return [
        {
          title: "照射种类",
          prop: "name",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return <span style="color:blue;cursor: pointer;">{data.name}</span>;
          },
        },
        {
          title: "操作",
          width: 60,
          omit: 1,
          render: (h, data) => {
            return (
              <span
                style="color:blue; cursor: pointer;"
                vOn:click_stop_prevent={() => {
                  this.hadnleIrradiationDialogSelect(data);
                }}
              >
                选择
              </span>
            );
          },
        },
      ];
    },
    // 照射种类 已选择
    typeOfIrradiationDataChoose() {
      return [
        {
          title: "照射种类",
          prop: "name",
          width: 150,
          omit: 1,
          render: (h, data) => {
            return <span style="color:blue;cursor: pointer;">{data.name}</span>;
          },
        },
        {
          title: "操作",
          width: 60,
          omit: 1,
          render: (h, data) => {
            return (
              <span
                style="color:red; cursor: pointer;"
                vOn:click_stop_prevent={() => {
                  this.hadnleIrradiationDialogDele(data);
                }}
              >
                删除
              </span>
            );
          },
        },
      ];
    },
  },
  mounted() {
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    // 页面加载获取系统配置
    this.handleGetSysConfig();
    // 进入页面连接身份证读卡器
    this.handleConnectIdcard();
    // 获取领取报告方式
    this.handleGetPublicConfig();
    // 获取下拉框数据
    this.handleGetDetail();
    // 聚焦身份证框
    this.handleCreate();
    // 类型列表
    this.handleGetPublicConfigs("Occupation"); // 职业类型
    this.handleGetPublicConfigs("Nation"); // 民族
    this.handleGetAllUser(); // 导诊护士 业务员
    getPublicConfig({ cc: "IDType" }).then((res) => {
      if (!res.result) return;
      this.idtypeItems = res.result;
    });
    getPublicConfig({ cc: "OccupationCustodyType" }).then((res) => {
      if (!res.result) return;
      this.jobinItems = res.result;
    });
    this.handleGetPrintConfig();
    this.handleGetUserPropertyValues();
    this.getHarmData();
  },

  methods: {
    // 获取单位名称字典下拉数据
    getCompanyArchivesDetailFun() {
      company_archives
        .getList({
          page: 1,
          limit: 100000,
          key: "",
        })
        .then((res) => {
          if (!res.data) return;
          this.organization_companyitems = res.data;
        });
      // 获取单位名称字典下拉数据
      getCompanyArchivesDetail().then((res) => {
        let { bankitems, typeitems } = res.result;
        this.typeitems = typeitems;
        this.bankitems = bankitems;
      });
    },
    // 单位名称添加字典 上级单位远程搜索回调
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
            if (!res.data) return;
            this.organization_companyitems = res.data;
          });
      }, 200);
    },
    // 单位名称关闭回调
    UnitIndustryDialogClose() {
      this.AddIndustryDialogData = {};
    },
    // 行业关闭回调
    industryDialogClose() {
      this.Addindustry_HY_DialogData = {};
    },
    // 工种关闭回调
    JobsDictionaryDialogClose() {
      this.AddJobsDictionaryDialogData = {};
    },
    // 添加行业字典dialog内的 确定按钮回调
    createindustryData() {
      let obj = {
        name: this.Addindustry_HY_DialogData.name,
        seqno: this.Addindustry_HY_DialogData.seqno,
        tableType: "1",
      };
      console.log("添加行业字典dialog内的");
      return new Promise((resolve, reject) => {
        try {
          AddOccupationalDisease(obj).then((res) => {
            res.code == 200 && (this.AddindustryFlag = false);
            this.$notify({
              title: "成功",
              message: res.message,
              type: "success",
            });
            // 行业
            getLoadType1().then((res) => {
              this.SelectIndustryData = res.data;
            });
          });
        } catch (error) {
          return reject(error);
        }
      });
    },
    // 添加工种字典dialog内的 确定按钮回调
    createJobsData() {
      console.log("添加工种字典dialog内的");
      this.AddJobsDictionaryDialogData;
      let obj = {
        name: this.AddJobsDictionaryDialogData.name,
        seqno: this.AddJobsDictionaryDialogData.seqno,
        tableType: "2",
      };
      AddOccupationalDisease(obj).then((res) => {
        res.code == 200 && (this.AddJobsDictionaryFlag = false);
        this.$notify({
          title: "成功",
          message: res.message,
          type: "success",
        });
        getLoadType2().then((res) => {
          this.SelectJobsData = res.data;
        });
      });
    },
    // 添加单位字典dialog内的 确定按钮回调
    createIndustryDictionaryData() {
      console.log(this.AddIndustryDialogData, "添加单位字典dialog内的");
      addCompany(this.AddIndustryDialogData).then((res) => {
        res.code == 200 && (this.AddIndustryDictionaryFlag = false);
        this.$notify({
          title: "成功",
          message: res.message,
          type: "success",
        });
        // 新增数据成功,重新获取字典,保持最新数据
        getPersonalOccupationDetail().then((res) => {
          this.companyitems = res.result.companyitems;
        });
      });
    },

    // 添加行业字典 按钮回调
    AddIndustryDictionary() {
      console.log(
        this.personalForm.industrytypecode,
        this.personalForm.industrytypename
      );
      this.AddindustryFlag = true;
    },
    // 添加工种字典 按钮回调
    AddIndustryJobs() {
      console.log(
        this.personalForm.worktypecode,
        this.personalForm.worktypename
      );
      this.AddJobsDictionaryFlag = true;
    },
    // 添加单位名称字典 按钮回调
    AddIndustryComany() {
      this.AddIndustryDictionaryFlag = true;
      this.getCompanyArchivesDetailFun(); // 获取单位名称字典下拉数据
    },
    // 团检类型 下拉框回调
    groupInspectionFun() {
      //  团检类型选择 个人--把组合结算方式也改为个人结算   团检---结算方式改为团队结算
      this.groupTableData.forEach((item) => {
        if (this.personalForm.personalflag == 0) {
          item.settlementtype = 1;
        } else {
          item.settlementtype = 0;
        }
      });
      this.$forceUpdate();
      // if (this.personalForm.personalflag == 0) {
      //   this.personalForm.companycode = ""; // 清空单位名称
      //   this.personalForm.batch = ""; // 清空单位批次
      // }
      // if (this.archivesForm.personalflag == 0) {
      //   this.archivesForm.companycode = ""; // 清空单位名称
      //   this.archivesForm.batch = ""; // 清空单位批次
      // }
    },
    // 输入入厂日期 计算总工龄
    calculateSeniorityFun(val) {
      let date = "";
      if (val == "ContactDamage") {
        date = this.personalForm.contactDamageData?.split(" ")[0];
      } else {
        date = this.personalForm.entrytime?.split(" ")[0];
      }
      date &&
        GetDate({ data: date }).then((res) => {
          let { days, months, year } = res.result;
          console.log(`${year}年,${months}月,${days}日`);
          if (val == "ContactDamage") {
            if (year) {
              this.personalForm.harmwordyearunit = "2"; // 单位 2 = 年
              this.personalForm.harmwordyear = year;
              if (months) {
                this.personalForm.harmwordmonth = months;
                this.seniorityMonthFlag2 = true; // 月份展示
              }
              console.log(`${year}年${months}月`);
            } else if (months) {
              this.personalForm.harmwordyear = months;
              this.personalForm.harmwordyearunit = "1"; // 单位 1=月
              this.seniorityMonthFlag2 = false; // 月份展示
              console.log(`${months}月`);
            } else if (days) {
              this.personalForm.harmwordyear = days;
              this.personalForm.harmwordyearunit = "0"; // 单位 0=天
              this.seniorityMonthFlag2 = false; // 关闭月份展示
              console.log(days + "天");
            }
          } else if (year >= 0 || months >= 0) {
            if (year) {
              this.personalForm.workyearunit = "2"; // 单位 2 = 年
              this.personalForm.workyear = year;
              if (months) {
                this.personalForm.workyearMonth = months;
                this.seniorityMonthFlag = true; // 月份展示
              }
            } else if (months) {
              this.personalForm.workyear = months;
              this.personalForm.workyearunit = "1"; // 单位 0=天
              this.seniorityMonthFlag = false; // 月份展示
            } else if (days) {
              this.personalForm.workyear = days;
              this.personalForm.workyearunit = "0"; // 单位 0=天
              this.seniorityMonthFlag = false; // 关闭月份展示
            }
          }
        });
    },

    calculateSeniorityFun2() {
      const date = this.archivesForm.entrytime.split(" ")[0];
      GetDate({ data: date }).then((res) => {
        let { days, months, year } = res.result;
        console.log(`${year}年,${months}月,${days}日`);
        if (year >= 0 || months >= 0) {
          if (year) {
            this.archivesForm.workyearunit = "2"; // 单位 2 = 年
            this.archivesForm.workyear = year;
            return;
          } else if (months) {
            this.archivesForm.workyear = months;
            this.archivesForm.workyearunit = "1"; // 单位 0=天
            return;
          } else if (days) {
            this.archivesForm.workyear = days;
            this.archivesForm.workyearunit = "0"; // 单位 0=天
            return;
          }
        }
      });
    },
    // 输入框有害因素名称
    handleHarmname(data) {
      console.log(data);
    },
    // 输入框放射性种类名称
    handleradiatename(data) {
      console.log(data);
    },
    // 已选择框点击删除 回调
    hadnleIrradiationDialogDele(data) {
      console.log(data, "获取到的数据");
      let index = this.typeOfIrradiationchooseData.findIndex(
        (item) => item.code == data.code
      );
      console.log(index);
      this.typeOfIrradiationchooseData.splice(index, 1);
    },
    // 选择照射种类 添加到已选择表格中
    hadnleIrradiationDialogSelect(data) {
      console.log(data, "添加到已选择表格中");
      let result = this.typeOfIrradiationchooseData.some(
        (item) => item.code == data.code
      );
      !result && this.typeOfIrradiationchooseData.push(data);
      result &&
        this.$message({
          showClose: true,
          message: "已经添加过该项了",
          type: "waning",
        });
    },
    // 点击取消/确定按钮回调
    DialogIrradiationFun(val) {
      console.log(this.typeOfIrradiationchooseData);

      if (val != "取消") {
        const result = this.typeOfIrradiationchooseData
          .map((item, index) => `${index + 1}、${item.name}`)
          .join("  ");
        // 回显的绑定字段
        this.archivesForm.irradiation = result;
        console.log(result, this.archivesForm.irradiation, "提交数据");
      }
    },
    // 导入历史工作既往史
    importHistoryFun() {
      this.$confirm(`此操作将导入历史工作既往史, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          //  2000908564 测试用的chekeno号
          GetUserEmploymentHistory({ checkno: this.personalForm.checkno }).then(
            (res) => {
              console.log(res);
              let {
                employmentHistoryEntity, // 职业史
                fileEntity, // 档案图片资料
                ocmedicalhistoryEntity, // 职业病史
                radiateHistoryEntity, // 放射工作
              } = res.result;
              if (res.code == 200) {
                this.careerHistoryData.push(...employmentHistoryEntity);
                this.radiationWorkData.push(...radiateHistoryEntity);
                this.workHistoryData.push(...ocmedicalhistoryEntity);
                this.pictureMaterialData.push(...fileEntity);
                this.$message.success("导入成功");
                console.log(this.radiationWorkData, fileEntity);
              }
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取档案信息
    GetProfessionListFun() {
      this.archivesFormHarmMsg = []; //清空档案信息职业危害,重新获取
      Getirradiation().then((res) => {
        // console.log(res, "获取照射种类");
        // res.data
        this.typeOfIrradiationData = res.data;
        // typeOfIrradiationMSG
        // typeOfIrradiationData
      });
      // 获取单位名称,批次等下拉数据
      getPersonalOccupationDetail().then((res) => {
        // console.log(res);
        // 单位名称下拉框数据
        this.unitNameData = res.result.companyitems;
        this.companyitems = res.result.companyitems;
      });

      GetProfessionList({ checkno: this.personalForm.checkno }).then((res) => {
        console.log(res, "获取档案信息");
        /* 
        res.result.employmentHistoryEntity  职业史
        res.result.radiateHistoryEntity     放射工作职业史
        res.result.ocmedicalhistoryEntity   职业病史
        res.result.fileEntity               图片档案
        res.result.pasthistoryEntity        既往病史      
        res.result.symptomEntity            自觉症状      
        */
        this.archivesForm = res.result.archive;
        this.arsid = res.result.archive.arsid;
        // 职业史
        this.careerHistoryData = res.result?.employmentHistoryEntity;
        // 放射工作职业史
        res.result?.radiateHistoryEntity &&
          (this.radiationWorkData = res.result?.radiateHistoryEntity);
        // 职业病史
        this.workHistoryData = res.result?.ocmedicalhistoryEntity;
        // 图片档案
        this.pictureMaterialData = res.result?.fileEntity;
        // 既往病史
        this.pastMedicalHistoryData = res.result?.pasthistoryEntity;
        // 自觉症状
        this.consciousSymptomsData = res.result?.symptomEntity;
        this.formid = res.result.form.id;
        this.contentData = JSON.parse(res.result.form.contentData);
        console.log(this.questionnairelist, "this.questionnairelist");
        // 获取问诊
        QuestionnaireArchives({
          regid: this.choosePeople.regid,
          titlecode: this.questionnairelist[0]?.quecode || "1006",
        }).then((res) => {
          console.log(res, "获取问诊");
        });
        if (res.result.formData != null && res.result.formData.dataJson) {
          res.result.formData &&
            (this.archivesForm.formcontroldata = JSON.parse(
              res.result.formData?.dataJson
            ));
          this.formid = res.result.formData.fromID;
          // console.log(
          //   this.archivesForm.formcontroldata,
          //   "this.archivesFormJSON***"
          // );
        } else {
          this.archivesForm.formcontroldata = {};
        }
      });
    },

    // 档案信息dialog回调
    dialogFun() {
      if (this.archivesFlag == "1") {
        console.log("既往病史");
        this.pastMedicalDiloagFlag = true;
      }
      // 工作既往史内
      // 职业史
      if (this.archivesFlag == "2" && this.workHistoryFlag == "0") {
        console.log("职业史");
        this.careerHistoryDiloagFlag = true;
      }
      // 放射工作
      if (this.archivesFlag == "2" && this.workHistoryFlag == "1") {
        console.log("放射工作");
        this.radiationWorkDiloagFlag = true;
      }
      // 职业病史
      if (this.archivesFlag == "2" && this.workHistoryFlag == "2") {
        console.log("职业病史");
        this.workHistoryDiloagFlag = true;
      }
      // 档案图片资料
      if (this.archivesFlag == "2" && this.workHistoryFlag == "3") {
        console.log("档案图片资料");
        this.pictureMaterialData.push({
          filename: "",
          operatdate: "",
          operatorname: "",
        });
      }
      // 自觉症状
      if (this.archivesFlag == "4") {
        console.log("自觉症状");
        this.consciousSymptomsDiloagFlag = true;
      }
    },
    fun(obj) {
      // 档案id
      obj.arsid = this.arsid;
      // 职业史
      obj.employmentHistoryEntity = this.careerHistoryData;
      // 放射工作职业史
      obj.radiateHistoryEntity = this.radiationWorkData;
      // 职业病史
      obj.ocmedicalhistoryEntity = this.workHistoryData;
      // 图片档案
      obj.fileEntity = this.pictureMaterialData;
      // 既往病史
      obj.pasthistoryEntity = this.pastMedicalHistoryData;
      //   // 自觉症状
      obj.symptomEntity = this.consciousSymptomsData;
      return obj;
    },
    // 保存提交按钮接口回调
    submitKeepFun(obj) {
      console.log(obj, "保存提交按钮接口回调");
      if (this.showProjectDialog) {
        this.$message.error("请添加项目");
        return;
      }
      const result = obj.fileEntity.findIndex((item) => item.filename == "");
      result != "-1" && obj.fileEntity.splice(result, 1);

      console.log(result);
      SetEditProfession(obj).then((res) => {
        console.log("新增/编辑,返回数据", res);
        if (res.code == 200) {
          this.$message({
            showClose: true,
            type: "success",
            message: res.message,
          });
          this.groupTableData = []; // 清空添加项目
          // 关闭所有新增弹框
          this.pastMedicalDiloagFlag = false;
          this.careerHistoryDiloagFlag = false;
          this.radiationWorkDiloagFlag = false;
          this.workHistoryDiloagFlag = false;
          this.consciousSymptomsDiloagFlag = false;
          // 获取档案信息
          this.GetProfessionListFun();
        } else {
          this.$message.error(res.message);
        }
      });
      // 动态表单保存
      this.$refs.contentDataObj
        .getData()
        .then((data) => {
          console.log(
            this.archivesForm,
            data,
            this.questionnairelist,
            "动态表单数据"
          );
          this.archivesForm.fromId = this.formid;
          this.archivesForm.dataJson = JSON.stringify(data, null, "\t");
          console.log(this.archivesForm, "动态表单数据");
          console.log(
            this.fun(obj),
            "this.fun(obj)保存的方法返回所有需保存的对象"
          );
          // 保存问诊回调
          SaveQuestionnaireArchives({
            regid: this.choosePeople.regid,
            questionnaireitems: this.questionnairelist,
          }).then((res) => {
            console.log(res, "保存问诊 回调");
          });

          // 全部表格开关
          this.archivesFormAllFlag = true;
        })
        .catch(() => {
          // this.$refs.formPreview.end();
        });
    },
    // 档案信息 新增
    btnKeepFun(num) {
      let obj = this.archivesForm;
      console.log(this.fun(obj));
      // 既往病史 新增
      if (this.archivesFlag == "1") {
        // console.log('既往病史');
        this.DiloagpastMedicalHistory.arsid = this.arsid;
        let ArrObj = this.DiloagpastMedicalHistory;
        let arr = this.pastMedicalHistoryData;
        arr.push(Object.assign({}, ArrObj));
        this.fun(obj).pasthistoryEntity = arr;
        console.log(this.fun(obj), "this.fun(obj)");
        this.submitKeepFun(this.fun(obj));
        // this.pastMedicalDiloagFlag = false
        this.DiloagpastMedicalHistory = {};
      }

      // 工作既往史内
      // 职业史 新增
      if (this.archivesFlag == "2" && this.workHistoryFlag == "0") {
        console.log("职业史");

        this.careerHistoryHistory.arsid = this.arsid;
        let ArrObj = this.careerHistoryHistory;
        let arr = this.careerHistoryData;
        arr.push(Object.assign({}, ArrObj));
        this.fun(obj).employmentHistoryEntity = arr;
        console.log(this.fun(obj), "this.fun(obj)");
        this.submitKeepFun(this.fun(obj));
        console.log(obj.employmentHistoryEntity, "职业史");
        // SetEditProfession().then(res=>{})
      }
      // 放射工作 新增
      if (this.archivesFlag == "2" && this.workHistoryFlag == "1") {
        console.log("放射工作");
        // obj.radiateHistoryEntity = this.radiationWorkData
        this.radiationWorkHistory.arsid = this.arsid;
        let ArrObj = this.radiationWorkHistory;
        let arr = this.radiationWorkData;
        arr.push(Object.assign({}, ArrObj));
        this.fun(obj).radiateHistoryEntity = arr;
        console.log(this.fun(obj), "this.fun(obj)");
        this.submitKeepFun(this.fun(obj));
        console.log(obj.radiateHistoryEntity, "放射工作");
        // SetEditProfession().then(res=>{})
      }
      // 职业病史 新增
      if (this.archivesFlag == "2" && this.workHistoryFlag == "2") {
        console.log("职业病史");
        // SetEditProfession().then(res=>{})
        // obj.ocmedicalhistoryEntity = this.workHistoryData

        this.workHistoryHistory.arsid = this.arsid;
        let ArrObj = this.workHistoryHistory;
        let arr = this.workHistoryData;
        arr.push(Object.assign({}, ArrObj));
        this.fun(obj).ocmedicalhistoryEntity = arr;
        console.log(this.fun(obj), "this.fun(obj)");
        this.submitKeepFun(this.fun(obj));
        console.log(obj.ocmedicalhistoryEntity, "职业病史");
      }
      // 档案图片资料 新增
      if (this.archivesFlag == "2" && this.workHistoryFlag == "3") {
        console.log("档案图片资料");
        obj.fileEntity = this.pictureMaterialData;
        console.log(obj.fileEntity, "档案图片资料");
        // 不清楚图片上传流程, 先不处理
        // let ArrObj = this.workHistoryHistory
        // let arr = this.pictureMaterialData
        // arr.push(Object.assign({}, ArrObj))
        // this.fun(obj).fileEntity = arr
        // console.log(this.fun(obj), 'this.fun(obj)');
        // this.submitKeepFun(this.fun(obj))
        // 请求
        // SetEditProfession().then(res=>{})
      }
      // 自觉症状
      if (num == "5") {
        // consciousSymptomsHistory
        this.consciousSymptomsHistory.arsid = this.arsid;
        console.log(this.consciousSymptomsHistory);
        this.fun(obj).symptomEntity.push(
          Object.assign({}, this.consciousSymptomsHistory)
        );
        console.log(this.fun(obj), "自觉症状保存");
        this.consciousSymptomsHistory = {};
        this.submitKeepFun(this.fun(obj));
      }
    },
    // 档案信息 编辑保存关闭
    archivesFun(state) {
      let obj = this.archivesForm;
      // console.log(this.fun(obj));
      if (state == "edit") {
        console.log("编辑");
        this.archivesFormAllFlag = false;
      } else if (state == "keep") {
        console.log("保存");

        this.submitKeepFun(this.fun(obj));
      } else if (state == "shutDown") {
        console.log("关闭");
        this.message = "basic"; // 切换到基本信息页面
      }
    },

    // 上传excl回调
    handlepictureMaterialExclChange(file) {
      console.log("上传excl回调", file.file);
      let data = new FormData();
      data.append("file", file.file);
      ExcelToDb(data).then((res) => {
        console.log(res);
        res.code == 200 && this.$message.success("导入成功");
        res.code != 200 && this.$message.error(res.message);
      });
    },
    // 上传图片
    handlepictureMaterialChange(file) {
      // console.log("点击", file);

      let data = new FormData();
      data.append("files", file.file);
      OccupationalDiseaseUpload(data).then((res) => {
        console.log(res, "上传后获取图片信息");
        let obj = this.archivesForm;
        // 把当前图片数据存放 到 整个obj中, 再把obj传给保存回调
        if (res.code == 200) {
          this.pictureMaterialData[this.fileIndex] = {
            arsid: this.arsid,
            // filename: file.file.name,
            filename: res.result[0].fileName,
            fileId: res.result[0].id,
          };
          this.fun(obj); //把图片数据保存在obj中
          this.submitKeepFun(this.fun(obj));
          console.log(this.fun(obj).fileEntity);
        }
      });
    },
    // 档案推片资料表格内的 查看
    viewFun(row) {
      console.log(row, "查看", this.questionnairelist);
      this.viewFlag = true;
      GetFileUrl({ id: row.fileId }).then((res) => {
        console.log(res);
        // this.viewUrl =  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";
        this.viewUrl = res.result.fileUrl;
      });
    },
    // 档案推片资料表格内的 拍照
    photographFun(row) {
      console.log(row, "拍照");
      // this.showCanvas = true;
      // this.handleOnTake2(); // 拍照
    },

    // 档案推片资料表格内的 导入
    importFun(row) {
      this.fileIndex = row.$index;
      const upload = this.$refs.pictureMaterialUpload;
      upload.$el.children[0].children[0].click();
      // console.log(row, "查看上传文件数组");
    },
    // 档案图片资料 点击删除行
    pictureMaterialDelete(data) {
      console.log(data, "当前数据");
      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          this.pictureMaterialData.splice(data.$index, 1);
          // this.GetProfessionListFun()
          this.submitKeepFun(this.fun(this.personalForm));
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 职业病史 点击删除行
    workHistoryDelete(data) {
      console.log(data, "当前数据");
      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          const index = this.workHistoryData.findIndex(
            (item) => item.id == data.id
          );
          this.workHistoryData.splice(index, 1);
          // this.GetProfessionListFun()
          this.submitKeepFun(this.fun(this.personalForm));
          this.workHistoryHistory = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 放射工作职业史 点击删除行
    radiationWorkDelete(data) {
      console.log(data, "当前数据");

      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          const index = this.radiationWorkData.findIndex(
            (item) => item.id == data.id
          );
          this.radiationWorkData.splice(index, 1);
          this.submitKeepFun(this.fun(this.personalForm));
          this.radiationWorkHistory = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 职业史 点击删除行
    careerHistoryDelete(data) {
      console.log(data, "当前数据");
      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          const index = this.careerHistoryData.findIndex(
            (item) => item.id == data.id
          );
          this.careerHistoryData.splice(index, 1);
          this.submitKeepFun(this.fun(this.personalForm));
          this.careerHistoryHistory = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 自觉症状 点击删除行
    consciousSymptomsDelete(data) {
      console.log(data, "当前数据");
      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          const index = this.consciousSymptomsData.findIndex(
            (item) => item.id == data.id
          );
          this.consciousSymptomsData.splice(index, 1);
          this.submitKeepFun(this.fun(this.personalForm));
          this.consciousSymptomsHistory = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 既往病史 点击删除行
    pastMedicalHistoryDelete(data) {
      console.log(data, "当前数据");
      this.$confirm(`此操作将删除当前项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          const index = this.pastMedicalHistoryData.findIndex(
            (item) => item.id == data.id
          );
          this.pastMedicalHistoryData.splice(index, 1);
          this.submitKeepFun(this.fun(this.personalForm));
          this.DiloagpastMedicalHistory = {};
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 体检类型
    checktypeFun() {
      // this.personalForm.checktype
      console.log(this.personalForm.checkType, this.checktypeitems);
      const result = this.checktypeitems.find(
        (item) => item.code == this.personalForm.checkType
      );

      console.log(result);
      this.personalForm.checkType = result.code;
      this.personalForm.checkobjectivename = result.name;
      console.log(
        this.personalForm.checkobjectivename,
        this.personalForm.checkType
      );
    },

    // 点击添加项目回调
    handleSelectGroup() {
      this.groupTableData = this.groupTableData.filter((k) => {
        return k.dedflag !== 1;
      });
      this.showProjectDialog = true;
    },
    // 危害项目框关闭回调
    DialogHarmClose() {
      // this.DialogFormSelectData = []
      this.HarmDialogFlag = false;
    },
    // 危害项目 dialog 确定取消
    DialogHarmFun(val) {
      this.HarmSearch = ""; // 清空搜索内容

      if (val != "取消") {
        const result = this.DialogFormSelectData.map((item, index) => {
          if (index != this.DialogFormSelectData.length - 1)
            return `${item.name},`;
          else return `${item.name}`;
        }).join("  ");
        this.archivesFormHarmMsg = result;
        this.HarmMsg = result;

        const arr = this.DialogFormSelectData.map((item) => {
          console.log(item, "看是否有code");
          return {
            value: item.code,
            name: item.name,
            typesOfGuardianship: item.typesOfGuardianship,
          };
        });
        this.personalForm.harms = arr;
        // console.log(result, arr, "提交数据");
        if (!this.archivesFormHarmMsg) {
          this.DialogFormSelectData = [];
        }
        this.DialogFormSelectData.length > 0 &&
          GetSetmealCombine(arr.map((k) => k.value)).then((res) => {
            // console.log(res, this.groupTableData, "根据职业危害id获取的项目");

            if (this.groupTableData.length == 0 && res.result) {
              this.groupTableData = res.result;
            } else if (!!res.result) {
              const idMap = new Map();
              // 将array2中的对象ID添加到哈希表中
              this.groupTableData.forEach((k) => {
                idMap.set(k.combinecode, true);
              });
              const differentObjects = res.result.filter(
                (u) => !idMap.has(u.combinecode)
              );
              // console.log(differentObjects, "数组");
              this.groupTableData.push(...differentObjects);
              //  判断团检类型     个人--把组合结算方式也改为个人结算   团检---结算方式改为单位结算
              this.groupTableData.forEach((item) => {
                if (this.personalForm.personalflag == 0) {
                  item.settlementtype = 1;
                } else {
                  item.settlementtype = 0;
                }
              });
            }
          });
      }
    },
    // 双击危害项目表格回调
    handleItem(row) {
      // console.log(row, "双击");
      this.hadnleHarmDialogSelect(row);
    },
    // 获取危害项目字典数据
    getHarmData() {
      // console.log("触发了");
      // search 职业危害搜索字段
      let msg = null;
      if (this.HarmSearch.trim() != "") msg = this.HarmSearch;
      else msg = "";
      getHarm({
        tablename: "Dic_occupation_harm",
        search: msg,
      }).then((res) => {
        // console.log(res, '获取到危害字典');
        if (res.code == 200) {
          this.DialogFormData = res.data;
          this.HarmSearch = "";
        }
      });
    },

    // 选择职业危害项 添加到已选择表格
    hadnleHarmDialogSelect(data) {
      // console.log(data, this.DialogFormSelectData, "添加到已选择表格中");
      if (
        (!!this.DialogFormSelectData &&
          this.DialogFormSelectData != undefined) ||
        this.DialogFormSelectData != null
      ) {
        let result = this.DialogFormSelectData.some(
          (item) => item.name == data.name
        );
        // console.log(result);
        !result && this.DialogFormSelectData.push(data);
        result &&
          this.$message({
            showClose: true,
            message: "已经添加过该项了",
            type: "waning",
          });
      } else {
        this.DialogFormSelectData = [];
        let result = this.DialogFormSelectData.some(
          (item) => item.name == data.name
        );
        // console.log(result);
        !result && this.DialogFormSelectData.push(data);
        result &&
          this.$message({
            showClose: true,
            message: "已经添加过该项了",
            type: "waning",
          });
      }
    },
    // dialog点击删除回调
    hadnleHarmDialogDel(data) {
      // console.log(data, "获取到的数据");
      let index = this.DialogFormSelectData.findIndex(
        (item) => item.name == data.name
      );
      // console.log(index);
      this.DialogFormSelectData.splice(index, 1);
    },
    // 添加危害项回调
    addHarmItemFun(form) {
      // console.log("添加危害项回调");
      this.getHarmData();
      this.HarmDialogFlag = true;
    },
    // 表格文本变色
    rowstyle({ row, rowIndex }) {
      let stylejson = {};
      if (row.chargeflag == 1) {
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
    handleGetUserPropertyValues() {
      let id = JSON.parse(localStorage.getItem("userId"));
      let ct = "DiscountProperty";
      users.getUserProperty({ id, ct }).then((res) => {
        // console.log(res);
        if (!res.result) return;
        let resDis = res.result.filter((k) => {
          return k.category === ct;
        })[0];
        resDis && (this.discountProperty = resDis.propertyvalue.split("-"));
      });
    },
    handleChangeIdcard() {
      if (this.personalForm.idtype != "01") return;
      getIdCardInfo({
        cc: this.personalForm.idcard,
        ct: "03",
      }).then((res) => {
        if (!res.result) return;
        this.personalForm.age = res.result.age;
        this.personalForm.birthday = res.result.birthday;
        this.personalForm.sex = res.result.sex;
      });
    },
    // 获取cookie
    getCookie(key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + "=");
        if (start !== -1) {
          start = start + key.length + 1;
          var end = document.cookie.indexOf(";", start);
          if (end === -1) end = document.cookie.length;
          return unescape(document.cookie.substring(start, end));
        }
      }
      return "";
    },
    // 删除照片
    handleDelPhotoBtn() {
      if (!this.personalForm.fileid && !this.personalForm.filebase64) {
        this.$message.warning("暂无可删除照片!");
        return false;
      }
      this.$confirm("此操作将删除当前照片, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let fileid = this.personalForm.fileid;
          if (fileid) {
            this.personalForm.fileid = "";
            this.personalForm.filebase64 = "";
            this.avatarImg = require("./images/lin.jpg");
            this.$message({
              type: "success",
              duration: 500,
              message: "操作成功!",
            });
          } else {
            this.personalForm.fileid = "";
            this.personalForm.filebase64 = "";
            this.avatarImg = require("./images/lin.jpg");
            this.$message({
              type: "success",
              duration: 500,
              message: "操作成功!",
            });
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 退费列表选中数据
    handleSelectSharge(arr) {
      this.selectSharge = arr;
    },
    // 退费勾选禁用回调
    handleChargeSelected(row, index) {
      if (row.chargeflag === 1) {
        return true; //不可勾选
      } else {
        return false; //可勾选
      }
    },
    // 鼠标移入显示更多按钮
    handleCheckConditionEnter(row) {
      if (!row.regid) return false;
      this.showTableMoveId = row.regid;
    },
    // 鼠标移入隐藏更多按钮
    handleCheckConditionLeave(row) {
      if (row.regid === this.showTableMoveId) return false;
      clearTimeout(this.leaveTimeId);
      this.leaveTimeId = setTimeout(() => {
        this.showTableMoveId = "";
      }, 400);
    },
    // 清空更多按钮条件
    handlemouseLeaveReset() {
      this.showTableMoveId = "";
    },
    handleChangeGuidance(item) {
      let flag = this.doctoritems.filter((k) => {
        return k.account === item;
      })[0];
      flag && (this.personalForm.guidancename = flag.name);
    },
    handleChangeSalesman(item) {
      let flag = this.doctoritems.filter((k) => {
        return k.account === item;
      })[0];
      flag && (this.personalForm.salesmanname = flag.name);
    },
    // 获取 导诊护士 业务员
    handleGetAllUser() {
      getAllUser({
        page: 1,
        limit: 10000,
        orgId: "",
        parentId: "",
        tableName: "Dic_department",
      }).then((res) => {
        this.doctoritems = res.data;
      });
    },
    // 公共配置编码
    handleGetPublicConfigs(cc) {
      getPublicConfig({ cc }).then((res) => {
        if (cc == "Occupation") {
          this.occupationItems = res.result;
        } else if (cc == "Nation") {
          this.nationItems = res.result;
        }
      });
    },
    // 今日开单组合点击回调
    handleTodayCombinedBilling() {
      getCombineStatic().then((res) => {
        if (!res.result) return false;
        this.showTodayCombine = true;
        this.todayCombineList = res.result;
      });
    },
    // 今日开单组合点击关闭
    handleTodayCombinedBillingClose() {
      this.showTodayCombine = false;
      this.todayCombineList = [];
    },
    // 保存按钮回调
    handleSavePage() {
      if (this.pageSwitch == "") {
        // 病史采集
        // 病史
        this.handleSaveMedicalHistory();
      } else {
        this.handleSaveQuestionnaire();
      }
    },
    // 病史采集或问卷调查保存回调
    handleDeteleQuestion() {
      DeteleQuestion({
        regid: this.choosePeople.regid,
        titletype: this.titletype,
        titlecode: this.pageSwitch,
      }).then((res) => {
        this.showMyInput = false;
        this.$nextTick(function () {
          this.showMyInput = true;
        });
        this.$message({
          type: "success",
          duration: 500,
          message: res.message,
        });
        if (this.pageSwitch == "") {
          // 病史采集
          this.handleMedicalHistory();
        } else {
          // 问卷调查
          this.handleQuestionnaire();
        }
      });
    },
    // 问卷调查保存回调
    handleSaveQuestionnaire() {
      SaveQuestionnaire({
        regid: this.choosePeople.regid,
        questionnaireitems: this.questionnairelist,
      }).then((res) => {
        this.$message({
          type: "success",
          duration: 500,
          message: res.message,
        });
        this.message = "basic";
      });
    },
    // 病史采集保存回调
    handleSaveMedicalHistory() {
      //   return;
      SaveMedicalHistory({
        regid: this.choosePeople.regid,
        bodysystemitems: this.medicalHistory,
      }).then((res) => {
        this.$message({
          type: "success",
          duration: 500,
          message: res.message,
        });
        this.message = "basic";
      });
    },
    // 头部切换按钮
    handleRadioButton(key) {
      console.log(this.message);
      if (key === "other" && !!this.personalForm.idcard) {
        // this.$refs.contentDataObj.disabled = true
        //  console.log( this.$refs.contentDataObj.disabled,'this.$refs.contentDataObj.disabled');
        this.DialogFormSelectData = []; // 清空已选择的职业危害数组
        // 获取档案信息
        this.GetProfessionListFun();
        // 问卷/问诊信息
        this.handleQuestionnaire();
      } else if (key != "basic") {
        this.$message.warning("请先选中需查看人员信息!");
        this.message = "basic";
        return false;
      }
      if (key === "basic" || key === "other") return false;
      this.message = key;
      // let flag = this.typelist.filter((k) => k.titlecode == key)[0];
      // flag && (this.titletype = flag.titletype);
      this.archivesFormAllFlag = true; //  档案信息 禁止输入
      this.pageSwitch = key;
      if (key == "") {
        // 病史采集
        this.handleMedicalHistory();
      } else {
        // 问卷调查
        this.handleQuestionnaire();
      }
    },
    // 类型列表
    handleQuestionnaireTitleList() {
      questionnaireTitleList().then((res) => {
        this.typelist.push(...res.result);
        this.pageSwitch = res.result[0].titlecode;
        this.titletype = res.result[0].titletype;
      });
    },
    // 病史
    handleMedicalHistory() {
      let data = {
        regid: this.choosePeople.regid,
      };
      medicalHistory(data).then((res) => {
        this.medicalHistory = res.result;
      });
    },
    // 问卷
    handleQuestionnaire() {
      // console.log(this.choosePeople.regid, "this.choosePeople.regid");
      let data = {
        regid: this.regID,
        titlecode: this.pageSwitch || "1006",
      };
      questionnaire(data).then((res) => {
        this.questionnairelist = res.result;
      });
    },
    // 人员表格更过选项选中回调
    handleCommand(command) {
      if (!command) return false;
      switch (command) {
        case "复制登记":
          this.handleCopyCheckIn("all");
          break;
        case "复制项目":
          this.handleCopyCheckIn("project");
          break;
        case "流程追踪":
          this.handleShowFlowPath();
          break;
        default:
          break;
      }
    },
    // 获取领取报告方式
    handleGetPublicConfig() {
      getPublicConfig({ cc: "ReportType" }).then((res) => {
        this.reporttakeItems = res.result;
        let index = res.result.filter((k) => k.selected)[0];
        index && (this.personalForm.reporttake = index.code);
      });
    },
    // 申请单预览 弹框提交回调
    handlePreviewApply() {
      if (this.choosePrintArr.length === 0) {
        this.$message.warning("请勾选需要打印的组合!");
        return false;
      }
      if (this.$refs.btnApply[0].$el.innerText == "打印申请单") {
        let indexP =
          this.$refs.btnApply[0].$attrs["data-remark"].split("、")[0] + "、";
        let repname = "";
        this.choosePeople.meccode == 1
          ? (repname = "高干申请单A4")
          : (repname = this.$refs.btnApply[0].$attrs["data-remark"]);
        if (this.choosePeople.meccode == 1) {
          repname = `${indexP}${repname}`;
        }
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname,
          printflag: 1,
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
            {
              key: "combinecodesin",
              valueList: this.choosePrintArr,
            },
          ],
        };
        printBase64(data).then((res) => {
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
          this.$message({
            type: "success",
            duration: 500,
            message: "操作成功!",
          });
          this.handleCancelApplyPrint();
          if (url) this.dialogVisible = true;
          this.pdfUrl =
            "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
        });
      }
    },
    // 申请单打印 弹框提交回调
    async handleSubmitApplyPrint() {
      if (this.choosePrintArr.length === 0) {
        this.$message.warning("请勾选需要打印的组合!");
        return false;
      }
      let printArr = [];
      // 组装循环打印数据
      for (let i = 0; i < this.applyPrintTree.length; i++) {
        let data = {
          code: this.applyPrintTree[i].code,
          name: this.applyPrintTree[i].name,
          combinecodesin: [],
        };
        for (let j = 0; j < this.applyPrintTree[i].children.length; j++) {
          let index = this.choosePrintArr.findIndex((val) => {
            return val === this.applyPrintTree[i].children[j].combinecode;
          });
          index > -1 &&
            data.combinecodesin.push(
              this.applyPrintTree[i].children[j].combinecode
            );
          if (j == this.applyPrintTree[i].children.length - 1) {
            printArr.push(data);
          }
        }
      }
      printArr = printArr.filter((k) => {
        return k.combinecodesin.length > 0;
      });
      if (this.$refs.btnApply[0].$el.innerText == "打印申请单") {
        for (let i = 0; i < printArr.length; i++) {
          let indexP =
            this.$refs.btnApply[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          this.choosePeople.meccode == 1
            ? (repname = "高干申请单A4")
            : (repname = this.$refs.btnApply[0].$attrs["data-remark"]);
          if (this.choosePeople.meccode == 1) {
            repname = `${indexP}${repname}`;
          }
          let data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [this.choosePeople.regid],
            repname,
            printflag: 1,
            whereitems: [
              {
                key: "regid",
                value: this.choosePeople.regid,
              },
              {
                key: "combinecodesin",
                valueList: printArr[i].combinecodesin,
              },
            ],
          };
          await printBase64(data).then((res) => {
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
            this.$message({
              type: "success",
              duration: 500,
              message: "操作成功!",
            });
            if (i == printArr.length - 1) {
              this.handleCancelApplyPrint();
            }
          });
        }
      }
    },
    // 申请单打印 弹框取消回调
    handleCancelApplyPrint() {
      this.applyPrintTree = []; // 打印申请单选择科室数据树
      this.showApplyPrint = false; // 打印申请单选择科室数据树
      this.choosePrintArr = []; // 打印申请单选择科室编码
    },
    caseCheckChange() {
      //树节点check事件
      let checked_count = 0; //被勾选上的一级节点个数
      let disabled_count = 0; //置灰的一级节点个数
      let indeterminate_flag = false; //有没有一级节点处于半选状态
      // 深度遍历所有一级节点
      var numArray = [];
      let stack = [...this.applyPrintTree],
        node;
      while ((node = stack.shift())) {
        numArray.push(node.id);
        if (this.$refs.casetree.getNode(node).disabled == true) {
          disabled_count += 1; //如果有置灰的节点，置灰变量加1
        }
        if (this.$refs.casetree.getNode(node).checked == true) {
          checked_count += 1; //如果有勾选的节点，勾选变量加1
        }
        if (this.$refs.casetree.getNode(node).indeterminate == true) {
          indeterminate_flag = true; //如果有半选的节点，半选变量设为true
        }
        // 如果有子元素的话进行压栈操作
        if (node.children) stack.unshift(...node.children);
      }
      if (checked_count == 0) {
        this.isIndeterminate = false;
        this.caseCheckAll = false; //如果勾选的一级节点数为0，则设置全选按钮样式不为半选样式，全选的值为false
        if (indeterminate_flag == true) {
          //如果下面有半选的，设置全选按钮的样式为半选样式
          this.isIndeterminate = true;
          this.caseCheckAll = false;
        }
      } else if (checked_count + disabled_count == numArray.length) {
        //如果树上勾上的和置灰的加起来等于tree上data的长度，设置全选按钮样式不为半选样式，全选值为true
        this.isIndeterminate = false;
        this.caseCheckAll = true;
      } else {
        //上面条件不满足，则说明没有全部勾上，设置样式为半选，全选值为false
        this.isIndeterminate = true;
        this.caseCheckAll = false;
      }
      return;
    },
    // 申请单打印树形结构勾选回调
    handleCheckChangeApplyPrint(data, value) {
      if (value.checkedNodes.length == 0) {
        this.choosePrintArr = [];
        return false;
      }
      this.choosePrintArr = [];
      value.checkedNodes.forEach((k) => {
        if (k.combinecode) {
          this.choosePrintArr.push(k.combinecode);
        }
      });
    },
    /*调用摄像头拍照开始*/
    handleOnTake() {
      this.showCanvas = true;
      this.handleGetCompetence();
    },
    /*调用摄像头拍照开始*/
    handleOnTake2() {
      this.photoCanvasFlag = true;
      this.handleGetCompetence2();
    },
    // 关闭拍照弹框
    handleOnCancel() {
      this.showCanvas = false;
      this.photoCanvasFlag = false;
      this.handleStopNavigator(); // 关闭摄像头
      this.handleClearCanvas("canvasCamera"); // 清空画布
      this.handleClearCanvas("canvasCamera2"); // 清空画布
    },
    // 完成拍照弹框
    handleOnComplete() {
      this.avatarImg = this.thisCancas.toDataURL("image/png");
      this.personalForm.filebase64 = this.avatarImg.split(",")[1];
      this.showCanvas = false;
      this.handleStopNavigator(); // 关闭摄像头
      this.handleClearCanvas("canvasCamera"); // 清空画布
    },
    // 完成拍照弹框2
    handleOnComplete2() {
      this.avatarImg = this.thisCancas.toDataURL("image/png");
      let filebase64 = this.avatarImg.split(",")[1];

      console.log(this.avatarImg, filebase64);
      this.photoCanvasFlag = false;

      this.handleStopNavigator(); // 关闭摄像头

      this.handleClearCanvas("canvasCamera2"); // 清空画布
    },
    // 调用摄像头权限
    handleGetCompetence() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.os = false; //切换成关闭摄像头
        this.thisCancas = document.getElementById("canvasCamera");
        this.thisContext = this.thisCancas.getContext("2d");
        this.thisVideo = document.getElementById("videoCamera");
        console.log(window, "window");
        console.log(window.navigator, "window.navigator");
        console.log(
          window.navigator.mediaDevices,
          ".window.navigator.mediaDevices"
        );
        console.log(
          window.navigator.mediaDevices.getUserMedia,
          ".window.navigator.mediaDevices.getUserMedia"
        );
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.menavigatordiaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)",
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.thisVideo) {
              _this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream);
            }
            _this.thisVideo.onloadedmetadata = function (e) {
              _this.thisVideo.play();
            };
          })
          .catch((err) => {
            this.showCanvas = false;
            this.$notify({
              title: "警告",
              message: "没有开启摄像头权限或浏览器版本不兼容.",
              type: "warning",
            });
          });
      });
    },
    // 调用摄像头权限
    handleGetCompetence2() {
      //必须在model中render后才可获取到dom节点,直接获取无法获取到model中的dom节点
      this.$nextTick(() => {
        const _this = this;
        this.os = false; //切换成关闭摄像头
        this.thisCancas = document.getElementById("canvasCamera2");
        this.thisContext = this.thisCancas.getContext("2d");
        this.thisVideo = document.getElementById("videoCamera2");
        console.log(window, "window");
        console.log(window.navigator, "window.navigator");
        console.log(
          window.navigator.mediaDevices,
          ".window.navigator.mediaDevices"
        );
        console.log(
          window.navigator.mediaDevices.getUserMedia,
          ".window.navigator.mediaDevices.getUserMedia"
        );
        // 旧版本浏览器可能根本不支持mediaDevices，我们首先设置一个空对象
        if (navigator.mediaDevices === undefined) {
          navigator.menavigatordiaDevices = {};
        }
        // 一些浏览器实现了部分mediaDevices，我们不能只分配一个对象
        // 使用getUserMedia，因为它会覆盖现有的属性。
        // 这里，如果缺少getUserMedia属性，就添加它。
        if (navigator.mediaDevices.getUserMedia === undefined) {
          navigator.mediaDevices.getUserMedia = function (constraints) {
            // 首先获取现存的getUserMedia(如果存在)
            let getUserMedia =
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.getUserMedia;
            // 有些浏览器不支持，会返回错误信息
            // 保持接口一致
            if (!getUserMedia) {
              return Promise.reject(
                new Error("getUserMedia is not implemented in this browser")
              );
            }
            // 否则，使用Promise将调用包装到旧的navigator.getUserMedia
            return new Promise(function (resolve, reject) {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          };
        }
        const constraints = {
          audio: false,
          video: {
            width: _this.videoWidth,
            height: _this.videoHeight,
            transform: "scaleX(-1)",
          },
        };
        navigator.mediaDevices
          .getUserMedia(constraints)
          .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in _this.thisVideo) {
              _this.thisVideo.srcObject = stream;
            } else {
              // 避免在新的浏览器中使用它，因为它正在被弃用。
              _this.thisVideo.src = window.URL.createObjectURL(stream);
            }
            _this.thisVideo.onloadedmetadata = function (e) {
              _this.thisVideo.play();
            };
          })
          .catch((err) => {
            this.photoCanvasFlag = false;
            this.$notify({
              title: "警告",
              message: "没有开启摄像头权限或浏览器版本不兼容.",
              type: "warning",
            });
          });
      });
    },
    //绘制图片
    handleDrawImage() {
      // 点击，canvas画图
      this.thisContext.drawImage(
        this.thisVideo,
        0,
        0,
        this.videoWidth,
        this.videoHeight
      );
    },
    //清空画布
    handleClearCanvas(id) {
      let c = document.getElementById(id);
      let cxt = c.getContext("2d");
      cxt.clearRect(0, 0, c.width, c.height);
    },
    //重置画布
    handleResetCanvas() {
      this.avatarImg = "";
      this.handleClearCanvas("canvasCamera");
    },
    //重置画布
    handleResetCanvas2() {
      this.avatarImg = "";
      this.handleClearCanvas("canvasCamera2");
    },
    //关闭摄像头
    handleStopNavigator() {
      if (this.thisVideo && this.thisVideo !== null) {
        this.thisVideo.srcObject.getTracks()[0].stop();
        this.os = true; //切换成打开摄像头
      }
    },
    /*调用摄像头拍照结束*/
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
    // 组合套餐 点击删除按钮回调
    hadnleBtnDelCombination() {
      this.$confirm(`此操作将删除当前勾选项目, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        dangerouslyUseHTMLString: true,
        type: "warning",
      })
        .then(() => {
          this.comboPackagesSelect.length <= 0 &&
            this.$message.warning("最少勾选一项");
          this.comboPackagesSelect.forEach((item) =>
            this.hadnleDelCombination(item)
          );
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message.warning("取消删除");
        });
    },
    // 组合项目选中回调
    handleSelectionChange(row) {
      // console.log(row, "组合项目选中回调");
      this.comboPackagesSelect = row;
    },
    // 组合项目删除数据
    hadnleDelCombination(item) {
      console.log(item);
      if (this.personalForm.regid == "") {
        let index = this.groupTableData.findIndex(
          (k) => k.combinecode == item.combinecode
        );
        if (index > -1) {
          this.groupTableData.splice(index, 1);
          // 体检项目总金额
          this.groupPriceTotal = 0;
          this.groupPriceEnd = 0;
          this.groupTableData.forEach((item) => {
            this.groupPriceTotal += item.price;
          });
          // 体检项目已经缴费金额
          this.groupTableData.forEach((item) => {
            if (item.chargeflag == 1) {
              this.groupPriceEnd += item.price;
            }
          });
          this.personalForm.price = this.groupPriceTotal;
          this.personalForm.actPrice = this.groupPriceEnd;
        }
      } else {
        if (this.personalForm.regid) {
          let data = {
            regid: this.personalForm.regid,
            combineCode: item.combinecode,
            detid: item.detid,
          };
          setDeleteCombine(data).then((res) => {
            this.handleGetPersonalDetail(this.personalForm.regid); // 更新详情人员数据
          });
        } else {
          let index = this.groupTableData.findIndex(
            (k) => k.combinecode == item.combinecode
          );
          if (index > -1) {
            this.groupTableData.splice(index, 1);
            // 体检项目总金额
            this.groupPriceTotal = 0;
            this.groupPriceEnd = 0;
            this.groupTableData.forEach((item) => {
              this.groupPriceTotal += item.price;
            });
            // 体检项目已经缴费金额
            this.groupTableData.forEach((item) => {
              if (item.chargeflag == 1) {
                this.groupPriceEnd += item.price;
              }
            });
            this.personalForm.price = this.groupPriceTotal;
            this.personalForm.actPrice = this.groupPriceEnd;
          }
        }
      }
    },
    // 健康视图显示回调
    handleShowHealthView() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择查看人员!");
        return false;
      }
      this.showHealthView = true;
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleGetPersonalRegisterList();
    },
    // 显示调查问卷
    handleShowQuestionnaire() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择调查人员!");
        return false;
      }
      this.questionnaireId = this.choosePeople.regid;
      this.showQuestionnaire = true;
    },
    // 关闭调查问卷
    handleCloseQuestionnaire() {
      this.questionnaireId = "";
      this.showQuestionnaire = false;
    },
    handleChangeAge() {
      if (this.personalForm.age == 0) {
        this.personalForm.birthday = "";
        return false;
      }
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);
      let thieYear = date.getFullYear();
      // console.log(
      //   timestamp,
      //   date,
      //   thieYear,
      //   "查看时间",
      //   "-",
      //   thieYear - this.personalForm.age
      // );
      this.personalForm.birthday = `${
        thieYear - this.personalForm.age
      }-01-01 00:00:00`;
    },
    handleChangeAge2() {
      if (this.archivesForm.age == 0) {
        this.archivesForm.birthday = "";
        return false;
      }
      let timestamp = Date.parse(new Date());
      let date = new Date(timestamp);
      let thieYear = date.getFullYear();
      // console.log(
      //   timestamp,
      //   date,
      //   thieYear,
      //   "查看时间",
      //   "-",
      //   thieYear - this.archivesForm.age
      // );
      this.archivesForm.birthday = `${
        thieYear - this.archivesForm.age
      }-01-01 00:00:00`;
    },
    handleChangeBirthday() {
      getIdCardInfo({
        cc: this.personalForm.birthday,
        ct: "03",
      }).then((res) => {
        if (!res.result) return;
        this.personalForm.age = res.result.age;
      });
      // console.log(
      //   this.personalForm.entrytime,
      //   "-",
      //   this.personalForm.birthday,
      //   "查看是否时分秒"
      // );
      // if(!!this.personalForm.birthday && this.personalForm.birthday != 'undefined' ){
      //   let date1 = this.personalForm.birthday + ' ' + '00:00:00'
      // this.personalForm.birthday = date1
      // }
      // if(!!personalForm.entrytime && personalForm.entrytime != 'undefined') {
      //   let date2 = this.personalForm.entrytime + ' ' + '00:00:00'
      // // this.personalForm.entrytime = this.personalForm.entrytime
      // this.personalForm.entrytime = date2
      // }
    },
    // 单选操作回调
    radioChange(val) {
      if (val === "全部") {
        this.handleClickAll();
      } else if (val === "个人") {
        this.handleClickPersonal();
      } else {
        this.handleClickCompany();
      }
    },

    // 聚焦调用日历组件
    handleFocusCheckDate() {
      if (this.pageState === "add") {
        this.showCalendar = true;
      }
    },
    // 日历组件提交回调
    handleSaveAppointment(data) {
      this.personalForm.checkdate = data.selectdate;
      this.appointmentData = data;
      this.makeFlag = "manual";
      this.showCalendar = false;
    },
    // 关闭日历组件回调
    handleCloseCalendar() {
      this.makeFlag = "manual";
      this.showCalendar = false;
    },
    // 复制登记回调
    handleCopyCheckIn(flag) {
      if (!this.choosePeople) {
        this.$message.warning("请先选择复制信息!");
        return false;
      }
      this.pageState = "add"; // 当前编辑状态
      this.formFlag = false; // 解除表单限制可编辑
      this.groupdis = false; // 解除团检表单限制可编辑
      this.setmealRadio = ""; // 清空选中编辑对象
      this.avatarImg = require("./images/lin.jpg");
      if (flag == "all") {
        this.personalForm.regid = "";
      } else if (flag === "project") {
        if (this.personalForm.regid) {
          this.groupTableData = this.personalForm.combineitems;
        }
        this.handlePersonalFormReset(); // 重置表单对象
        this.personalForm.regid = "";
        this.personalForm.companycode = "";
        this.personalForm.companyname = "";
        this.personalForm.batch = "";
        this.personalForm.groupcode = "";
        this.personalForm.groupname = "";
      } else {
        this.handlePersonalFormReset(); // 重置表单对象
      }
      this.personalForm.hiscode = "";
      this.personalForm.healthcard = "";
      this.personalForm.checkno = "";
      this.groupTableData = this.groupTableData.map((k) => {
        return {
          detid: "",
          regid: "",
          setmealcode: k.setmealcode,
          setmealname: k.setmealname,
          combinecode: k.combinecode,
          combinename: k.combinename,
          deptcode: k.deptcode,
          price: k.price,
          discount: k.discount,
          discountprice: k.price,
        };
      });
      {
        /* this.handleGetDetail(); // 获取下拉数据 */
      }
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
      if (!this.personalForm.regid) {
        this.groupTableData.forEach((item) => {
          item.discount = this.discountValue;
          item.discountprice = +item.price * +this.discountValue;
        });
        this.handleCloseDiscount();
      } else {
        setDiscount({
          regid: this.personalForm.regid,
          discount: +this.discountValue,
          combinecodeitems: this.groupTableData.map((k) => {
            return k.combinecode;
          }),
        }).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              duration: 500,
              message: res.message,
            });
            this.groupTableData.forEach((item) => {
              item.discount = this.discountValue;
            });
            this.handleGetPersonalDetail(this.personalForm.regid);
            this.handleCloseDiscount();
          } else {
            this.$message.error(res.message);
            this.handleGetPersonalDetail(this.personalForm.regid);
            this.handleCloseDiscount();
          }
        });
      }
    },
    // 确认身份认证密码弹框
    handleConfirmConfirmPassword() {
      if (!this.confirmPassword.trim()) {
        this.$message.warning("提交密码不允许为空!");
        return;
      }
      let userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || null;
      if (!userInfo) return;
      checkUserAcount({
        account: userInfo.usercode,
        password: this.confirmPassword.trim(),
      }).then((res) => {
        if (!res.result) return;
        this.handleCloseConfirmPassword();
        this.discountValue = 1;
        this.discount = true;
      });
    },
    // 确认身份认证密码取消弹框
    handleCloseConfirmPassword() {
      this.confirmPassword = "";
      this.showConfirmPassword = false;
    },
    // 设置项目折扣弹框回调
    handleSetDiscount() {
      if (this.groupTableData.length == 0) {
        this.$message.warning("请先添加体检项目!");
        return false;
      }
      // if (this.personalForm.regid == "") {
      //   this.$message.warning("请先保存登记人员数据!");
      //   return false;
      // }
      // this.discountValue = 1;
      // this.discountValue = this.groupTableData[0].discount * 100;
      // this.discount = true;
      this.showConfirmPassword = true;
    },
    // 折扣弹框关闭回调
    handleCloseDiscount() {
      this.discount = false;
    },
    // 收费确认回调
    handleSetChargeConfirm() {
      setChargeConfirm({
        regid: this.personalForm.regid,
        paytype: (this.chargeItems && this.chargeItems.paymenttype) || "",
      })
        .then((res) => {
          this.$message({
            type: "success",
            duration: 500,
            message: res.message,
          });
          this.handleGetPersonalRegisterList(); // 获取列表数据
          this.handleCloseChargeDetails();
        })
        .catch(() => {
          this.handleCloseChargeDetails();
        });
    },
    // 收费取消回调
    handleSetChargeCancel() {
      setChargeCancel({
        regid: this.personalForm.regid,
        combinecodeitems: this.selectSharge,
      })
        .then((res) => {
          this.$message({
            type: "success",
            duration: 500,
            message: res.message,
          });
          this.handleCloseChargeDetails();
        })
        .catch(() => {
          this.handleCloseChargeDetails();
        });
    },
    // 辅助功能下拉菜单选中回调
    handleSelectProject(flag) {
      if (flag == "历史项目") {
        if (this.pageState != "add") {
          this.$message.warning("仅在新增状态下可获取历史项目!");
          return false;
        }
        if (!this.personalForm.checkno) {
          this.historyProjectShow = true;
          return false;
        }
        let whereitems = [
          {
            key: "checkno",
            value: this.personalForm.checkno,
          },
        ];
        whereitems.push({
          key: "sourcetype",
          value: "1",
        });
        getPersonalRegisterList2({
          page: this.currentPage,
          limit: this.pageSize,
          whereitems,
        }).then((res) => {
          this.hTable1Data = res.data;
          this.historyProjectShow = true;
        });
      } else {
        if (this.pageState != "add") {
          this.$message.warning("仅在新增状态下可获取智能推荐!");
          return false;
        }
        this.intellect = true;
        getRecommend({
          sex: this.personalForm.sex,
          age: this.personalForm.age,
          marriage: this.personalForm.marriage,
        }).then((res) => {
          res.result && (this.intellectData = res.result);
        });
        this.intellect = true;
      }
    },
    // 智能推荐弹框关闭回调
    handleCloseIntellect() {
      this.intellectData = [];
      this.intellectSelect = [];
      this.intellect = false;
    },
    // 智能推荐确认回调
    handleSubmitIntellect() {
      if (this.intellectSelect.length == 0) {
        this.$message.warning("请先选中需推荐的项目!");
        return false;
      }
      this.groupPriceTotal = 0;
      this.groupTableData = this.intellectSelect;
      this.personalForm.combineitems = this.intellectSelect; // 赋值对象中
      localStorage.setItem(
        "groupTableData",
        JSON.stringify(this.intellectSelect)
      );
      // 体检项目总金额
      this.groupTableData.forEach((item) => {
        this.groupPriceTotal += item.price;
      });
      // 体检项目已经缴费金额
      this.groupTableData.forEach((item) => {
        if (item.chargeflag == 1) {
          this.groupPriceEnd += item.price;
        }
      });
      this.handleCloseIntellect(); // 关闭窗口
    },
    // 智能推荐数据复选选中回调
    handleSelectIntellect(arr) {
      this.intellectSelect = arr;
    },
    // 历史项目表格选中数据回调
    handleCheckhRow(row) {
      getPersonalOccupationDetail({
        regid: row.regid,
      }).then((res) => {
        this.hTable2Data = res.result.combineitems;
      });
    },
    // 历史项目弹框关闭回调 getPersonalRegisterList
    handleClosehistoryProject() {
      this.hTable1Data = [];
      this.hTable2Data = [];
      this.historyProjectShow = false;
    },
    // 历史项目继存项目回调
    handleSubmitHistory() {
      if (this.hTable2Data.length == 0) {
        this.$message.warning("请先选中需继存项目!");
        return false;
      }
      this.groupPriceTotal = 0;
      this.groupTableData = this.hTable2Data.map((k) => {
        return {
          detid: "",
          regid: "",
          setmealcode: k.setmealcode || "",
          setmealname: k.setmealname || "",
          combinecode: k.combinecode,
          combinename: k.combinename,
          deptcode: k.deptcode,
          price: k.price,
          discount: 1,
          discountprice: k.price,
        };
      });
      this.personalForm.combineitems = this.hTable2Data; // 赋值对象中
      localStorage.setItem(
        "groupTableData",
        JSON.stringify(this.groupTableData)
      );
      // 体检项目总金额
      this.groupTableData.forEach((item) => {
        this.groupPriceTotal += item.price;
      });
      // 体检项目已经缴费金额
      this.groupTableData.forEach((item) => {
        if (item.chargeflag == 1) {
          this.groupPriceEnd += item.price;
        }
      });
      this.handleClosehistoryProject(); // 关闭窗口
    },
    // 分组下拉选中回调
    // handleCheckGroup(value) {
    //   let select = this.groupitems.filter((k) => k.code == value)[0] || "";
    //   if (select) {
    //     this.personalForm.checktype = select.checktype;
    //     console.log(select.checktype, "select.checktype");
    //     getDetailedList({
    //       groupid: select.id,
    //     }).then((res) => {
    //       if (res.result && res.result.length > 0) {
    //         this.groupTableData = res.result.map((k) => {
    //           return {
    //             ...k,
    //             price: k.originalprice,
    //           };
    //         });
    //       }
    //     });
    //   }
    // },
    // 历史信息表格复制体检号回调
    handleHistoryCopy(row, column) {
      if (column.label === "体检号") {
        var input = document.createElement("input"); // 创建input对象
        input.value = row.regid; // 设置复制内容
        document.body.appendChild(input); // 添加临时实例
        input.select(); // 选择实例内容
        document.execCommand("Copy"); // 执行复制
        document.body.removeChild(input); // 删除临时实例
        this.$message({
          type: "success",
          duration: 500,
          message: "成功复制体检号!",
        });
      }
    },
    // 历史信息表格选中人员回调
    handleHistoryCheck(row) {
      if (this.historyData[0].remindflag === 1) {
        let tempObj = JSON.parse(JSON.stringify(this.historyData[0]));
        this.$confirm(tempObj.remindcontent, "系统提示", {
          cancelButtonText: "关闭",
          showConfirmButton: false,
          closeOnClickModal: false,
          type: "warning",
        }).then(() => {});
      }
      getPersonalOccupationDetail({
        regid: row.regid,
      }).then((res) => {
        console.log(res.result, "getPersonalOccupationDetail**-**");
        let data = res.result;
        this.groupTableData = res.result.combineitems;
        res.result.combineitems.forEach((k) => {
          this.groupPriceTotal += k.price;
        });
        this.groupPriceEnd = 0;
        this.personalForm = data;
        this.personalForm.ageunit = "";
        // 年龄单位列表 / 回显值
        this.agearr = data.ageunititems;
        this.personalForm.ageunit =
          data.ageunititems.filter((k) => k.selected)[0] &&
          data.ageunititems.filter((k) => k.selected)[0].code;
        // 婚姻状态列表 /  回显值
        this.marriagearr = data.marriageitem;
        this.personalForm.marriage =
          (data.marriageitem.filter((k) => k.selected)[0] &&
            data.marriageitem.filter((k) => k.selected)[0].code) ||
          "其他";
        // 体检类型列表 / 回显值
        this.checktypeitems = [];
        data.checktypeitems.forEach((item) => {
          if (item.checkType == "1") this.checktypeitems.push(item);
        });
        // this.personalForm.checktype =
        //   (data.checktypeitems.filter((k) => k.selected)[0] &&
        //     data.checktypeitems.filter((k) => k.selected)[0].code) ||
        //   "";

        this.personalForm.companycode = "";
        this.personalForm.companyname = "";
        this.personalForm.batch = "";
        this.personalForm.groupcode = "";
        this.personalForm.fileid
          ? this.handleGetFiles()
          : (this.avatarImg = require("./images/lin.jpg"));
        this.handleCloseHistory();
        this.personalForm.regid = ""; // 体检号保持为空
      });
    },
    // 身份证、姓名、性别获取获取门诊卡
    handleGetRegisterInfo() {
      GetPatientInfo_zyb({
        idCard: this.personalForm.idcard || this.inputIdCard,
      }).then((res) => {
        this.isIdCardFlag = true; // 输入身份证进入
        // console.log(res, "获取门诊卡");
        // healthcard  hiscode
        if ((res.result && res.result?.length == 0) || !res.result)
          return false;
        if (res.result && res.result?.length > 1) {
          this.historyData = res.result;
          this.historyShow = true;
          this.inputIdCard = "";
          this.personalForm.idcard = "";
        } else {
          res.result && (this.personalForm = res?.result[0]);
          if (res.result) {
            console.log("此时只有一条数据");
            this.personalForm.idcard = res?.result[0]?.idcard;
            this.personalForm.healthCode = res?.result[0]?.healthcard;
            this.personalForm.healthcard = res?.result[0]?.healthcard;
            this.personalForm.reviewtype = 0;
            this.personalForm.seniorityMonth = "月";
            this.personalForm.ageunit = "岁";
            this.personalForm.marriage = "未知";
            this.personalForm.remindflag = 0;
            this.personalForm.notmyself = 0;
            this.personalForm.actualsex = 0;
            this.personalForm.actualageunit = "岁";
            this.personalForm.idtype = "01";
            this.personalForm.harmwordyearunit = "1";
            this.personalForm.harmwordyear = "";
            this.personalForm.harmwordmonthunit = "1";
            this.personalForm.harmwordmonth = "";
            this.personalForm.workyearunit = "1";
            this.personalForm.personalflag = 0;
          }
        }
      });
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historyData = [];
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.personalForm.fileid }).then((res) => {
        this.avatarImg = res.result.fileUrl;
      });
    },
    // 身份证验证
    idCarverify(idCard) {
      if (!idCard) {
        this.$message.warning("身份证不能为空!");
        return;
      }
      // 修改为不做校验
      this.hadnleSubmit();
      return;
      // 正则表达式规则
      const pattern =
        /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}(\d|X|x)$/;
      // 校验身份证号码
      if (pattern.test(idCard)) {
        // 计算校验位
        const weightedFactors = [
          7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2,
        ];
        const checkCodes = [
          "1",
          "0",
          "X",
          "9",
          "8",
          "7",
          "6",
          "5",
          "4",
          "3",
          "2",
        ];
        const idCardArray = idCard.split("");
        let sum = 0;
        for (let i = 0; i < 17; i++) {
          sum += parseInt(idCardArray[i]) * weightedFactors[i];
        }
        const mod = sum % 11;
        const checkCode = checkCodes[mod];

        // 检查校验位
        if (idCardArray[17].toUpperCase() === checkCode) {
          // 身份证号码校验通过
          return this.hadnleSubmit();
        }
      }
      // 身份证号码校验不通过
      return this.$message.error("请输入正确的身份证号");
    },
    // 点击保存提交回调
    hadnleSubmit() {
      this.personalForm.ageunit = "年";
      this.isIdCardFlag = false;
      if (this.pageState == "add") {
        this.loadingBtn = true;
        this.personalForm.filebase64 &&
          this.$set(this.personalForm, "fileid", "");
        if (this.pageState === "edit") {
          this.groupTableData.forEach((item, index) => {
            if (item.dedflag === 1) {
              this.groupTableData.splice(index, 1, undefined);
            }
          });
          this.groupTableData = this.groupTableData.filter((k) => k);
        }

        // console.log(this.personalForm, "我是新增添加");
        if (this.groupTableData?.length > 0) {
          this.$set(
            this.personalForm,
            "customermedicaldetails",
            this.groupTableData
          );
        } else {
          this.$set(this.personalForm, "customermedicaldetails", []);
        }
        if (this.DialogFormSelectData <= 0) {
          this.$set(this.personalForm, "harms", []);
        } else {
          if (
            this.DialogFormSelectData != undefined &&
            this.DialogFormSelectData != null
          ) {
            const arr = this.DialogFormSelectData.map((item) => {
              // console.log(item, "看是否有code");
              return {
                value: item.code,
                name: item.name,
                typesOfGuardianship: item.typesOfGuardianship,
              };
            });
            this.$set(this.personalForm, "harms", arr);
          }
        }
        // console.log(this.personalForm.harms, "查看是否有类型和code");
        !!this.sourceregid &&
          (this.personalForm.sourceregid = this.sourceregid);
        setAddData(this.personalForm)
          .then((res) => {
            this.$message({
              type: "success",
              duration: 1000,
              message: "保存成功!",
            });
            this.HarmMsg = "";
            this.handleResetPage(); // 重置全部
            console.log("新增!!!!!!!", res);
            if (res.result && !res.result.regid) {
              this.$message.error("操作失败,没有regId");
              return;
            }
            let resRegid = res.result.regid;
            if (this.conditionCode == "regid") {
              this.checkupWork = res.result.regid;
            }

            this.loadingBtn = false;
            // this.isSetSubmit = true;
            this.groupPriceTotal = 0;
            this.groupPriceEnd = 0;
            // 选中新增数据
            this.currentPage = 1;
            this.handleGetPersonalRegisterList(); // 更新右侧人员数据
            this.handleGetPersonalDetail(resRegid); // 更新详情人员数据
            this.$nextTick(() => {
              this.setmealRadio = resRegid;
              this.appointmentData = undefined;
              localStorage.removeItem("groupTableData");
            });

            this.formFlag = true; // 解除表单限制可编辑
            this.message = "basic"; // 基本信息-basic 其他信息-other
          })
          .catch((err) => {
            this.loadingBtn = false;
            this.isGuideSingle = false;
          });
        return;
      }
      if (this.personalForm.telephone === "" && this.pageState === "add") {
        this.$confirm(`是否提醒用户填写电话!`, "系统提示", {
          confirmButtonText: "去填写",
          cancelButtonText: "否,直接保存",
          showConfirmButton: true,
          closeOnClickModal: false,
          showClose: false,
          showCancelButton: true,
          type: "warning",
        })
          .then(() => {})
          .catch(() => {
            this.loadingBtn = true;
            this.personalForm.filebase64 &&
              this.$set(this.personalForm, "fileid", "");
            if (this.pageState === "edit") {
              this.groupTableData.forEach((item, index) => {
                if (item.dedflag === 1) {
                  this.groupTableData.splice(index, 1, undefined);
                }
              });
              this.groupTableData = this.groupTableData.filter((k) => k);
            }
            this.$set(this.personalForm, "combineitems", this.groupTableData);
            // setAddData
            // setSubmit(this.personalForm)
            // console.log(this.personalForm, "我是新增添加");
            // let date = this.personalForm.entrytime + ' ' + '00:00:00';
            // let Date = this.personalForm.birthday + ' ' + '00:00:00';
            // this.personalForm.entrytime = date
            // this.personalForm.birthday = Date

            if (this.groupTableData.length > 0) {
              this.$set(
                this.personalForm,
                "customermedicaldetails",
                this.groupTableData
              );
            } else {
              this.$set(this.personalForm, "customermedicaldetails", []);
            }
            if (this.DialogFormSelectData <= 0) {
              this.$set(this.personalForm, "harms", []);
            } else {
              const arr = this.DialogFormSelectData.map((item) => {
                // console.log(item, "看是否有code");
                return { value: item.hcode, name: item.name };
              });
              this.$set(this.personalForm, "harms", arr);
            }
            // console.log(this.DialogFormSelectData);
            !!this.sourceregid &&
              (this.personalForm.sourceregid = this.sourceregid);
            setAddData(this.personalForm)
              .then((res) => {
                if (res.result && res.result.regid) {
                  this.$message.error("操作失败,没有regId");
                  return;
                }
                let resRegid = res.result.regid;
                if (this.conditionCode == "regid") {
                  this.checkupWork = res.result.regid;
                }
                this.loadingBtn = false;
                // this.isSetSubmit = true;
                this.groupPriceTotal = 0;
                this.groupPriceEnd = 0;
                // 选中新增数据
                // console.log(this.appointmentData, '看这里是真还是假!');
                this.currentPage = 1;
                if (res.code == 200) {
                  this.handleGetPersonalRegisterList(); // 更新右侧人员数据
                  this.handleGetPersonalDetail(resRegid); // 更新详情人员数据
                  this.$nextTick(() => {
                    this.setmealRadio = resRegid;
                    this.appointmentData = undefined;
                    localStorage.removeItem("groupTableData");
                  });
                  this.$message({
                    type: "success",
                    duration: 1000,
                    message: "保存成功!",
                  });
                  this.formFlag = true; // 解除表单限制可编辑
                  this.message = "basic"; // 基本信息-basic 其他信息-other
                }
                // if (this.appointmentData) {
                // if (res.code == 200) {
                //   setAppointmentSave({
                //     regiditems: [res.result.regid],
                //     checknoitems: [res.result.checkno],
                //     selectdate: this.appointmentData.selectdate,
                //     timeid: this.appointmentData.timeid,
                //   }).then((result) => {
                //     this.handleGetPersonalRegisterList(); // 更新右侧人员数据
                //     this.handleGetPersonalDetail(resRegid); // 更新详情人员数据
                //     this.$nextTick(() => {
                //       this.setmealRadio = resRegid;
                //       this.appointmentData = undefined;
                //       localStorage.removeItem("groupTableData");
                //     });
                //     this.$message({
                //       type: "success",
                //       duration: 1000,
                //       message: "保存成功!",
                //     });
                //     this.formFlag = true; // 解除表单限制可编辑
                //     this.message = "basic"; // 基本信息-basic 其他信息-other
                //   });
                // } else {
                //   this.handleGetPersonalRegisterList(); // 更新右侧人员数据
                //   this.handleGetPersonalDetail(resRegid); // 更新详情人员数据
                //   this.$nextTick(() => {
                //     this.setmealRadio = resRegid;
                //     this.appointmentData = undefined;
                //     localStorage.removeItem("groupTableData");
                //   });
                //   this.$message({
                //     type: "success",
                //     duration: 1000,
                //     message: "保存成功!",
                //   });
                //   this.formFlag = true; // 解除表单限制可编辑
                //   this.message = "basic"; // 基本信息-basic 其他信息-other
                // }
              }) //  编辑 还有 体检类型 Copy一个,  搜搜!!!@!@
              .catch((err) => {
                this.loadingBtn = false;
                this.isGuideSingle = false;
              });
            return;
          });
      } else {
        // 编辑
        this.loadingBtn = true;
        this.personalForm.filebase64 &&
          this.$set(this.personalForm, "fileid", "");
        if (this.pageState === "edit") {
          this.groupTableData.forEach((item, index) => {
            if (item.dedflag === 1) {
              this.groupTableData.splice(index, 1, undefined);
            }
          });
          this.groupTableData = this.groupTableData.filter((k) => k);
        }
        this.$set(this.personalForm, "combineitems", this.groupTableData);
        // this.groupTableData.length <= 0 ? this.$set(this.personalForm, "Customermedicaldetails", [])
        // : this.$set(this.personalForm, "Customermedicaldetails", this.groupTableData)

        this.personalForm.entrytime = this.personalForm.entrytime;
        // console.log(this.DialogFormSelectData);
        if (this.DialogFormSelectData.length <= 0) {
          this.DialogFormSelectData = [];
        }
        if (this.groupTableData.length > 0) {
          this.$set(
            this.personalForm,
            "customermedicaldetails",
            this.groupTableData
          );
          this.personalForm;
        } else {
          this.$set(this.personalForm, "customermedicaldetails", []);
        }
        if (this.DialogFormSelectData <= 0) {
          this.$set(this.personalForm, "harms", []);
        } else {
          const arr = this.DialogFormSelectData.map((item) => {
            // console.log(item, '看是否有code');
            return {
              value: item.code,
              name: item.name,
              typesOfGuardianship: item.typesOfGuardianship,
            };
          });
          this.$set(this.personalForm, "harms", arr);
        }
        !!this.sourceregid &&
          (this.personalForm.sourceregid = this.sourceregid);
        // console.log(this.personalForm.sourceregid, "初检复检");
        setEditData(this.personalForm)
          .then((res) => {
            // console.log(res, " 是编辑 ");
            this.$message({
              type: "success",
              duration: 1000,
              message: "编辑成功!",
            });
            this.handleGetPersonalDetail(this.regID); // 再次获取数据
            this.formFlag = true; // 不可再输入编辑,点击编辑按钮后可编辑
            this.loadingBtn = false;
            if (this.conditionCode == "regid") {
              this.checkupWork = res.result;
            }

            // this.handlePersonalFormReset()
            // this.groupTableData=[]
            this.groupPriceTotal = 0;
            this.groupPriceEnd = 0;
            // 选中新增数据
            this.currentPage = 1;
          })
          .catch((err) => {
            this.loadingBtn = false;
            this.isGuideSingle = false;
          });
      }
    },
    // 收费按钮点击回调
    handleChargePage() {
      this.loadingGroup = true;
      if (!this.personalForm.regid) {
        this.$message.error("请先保存人员信息,再进行收费!");
        return false;
      }
      getCostDetail({
        regid: this.personalForm.regid,
      }).then((res) => {
        if (!res.result) return;
        this.chargeDataList = res.result.combineitems.map((k) => {
          return {
            operatorname: res.result.operatorname,
            ...k,
          };
        });
        this.chargeDataList.forEach((item) => {
          this.chargeTotalPrice += item.price;
        });
        this.chargeItems = res.result;
        this.payitems = res.result.payitems;
        this.noCharge = this.chargeDataList.filter((k) => k.chargeflag != 1);
        // ---------------------------------- 重组数据排序
        let typeArr1 = this.chargeDataList.filter((k) => {
          return k.resulttype == "01";
        });
        let typeArr2 = this.chargeDataList.filter((k) => {
          return k.resulttype == "02";
        });
        let typeArr3 = this.chargeDataList.filter((k) => {
          return k.resulttype == "03";
        });
        let typeArr4 = this.chargeDataList.filter((k) => {
          return k.resulttype == "04";
        });
        typeArr1 = typeArr1.sort(function (a, b) {
          return a.deptcode - b.deptcode;
        });
        typeArr2 = typeArr2.sort(function (a, b) {
          return a.deptcode - b.deptcode;
        });
        typeArr3 = typeArr3.sort(function (a, b) {
          return a.deptcode - b.deptcode;
        });
        typeArr4 = typeArr4.sort(function (a, b) {
          return a.deptcode - b.deptcode;
        });
        this.chargeDataList = [
          ...typeArr1,
          ...typeArr2,
          ...typeArr3,
          ...typeArr4,
        ];
        // ---------------------------------- 重组数据排序
        this.showChargeDetails = true;
      });
      this.loadingGroup = false;
    },
    // 收费明细弹出层关闭回调
    handleCloseChargeDetails() {
      this.chargeDataList = []; // 收费明细表格主表
      this.chargeTotalPrice = 0; // 收费明细总金额
      this.selectSharge = []; // 收费明细总金额
      this.showChargeDetails = false;
      this.handleGetPersonalDetail(this.personalForm.regid);
    },
    // 子组件添加项目提交回调
    handleProjectSubmit(data) {
      if (this.pageState === "edit") {
        // this.$set(this.personalForm, "combineitems", data);
        updateCombine({
          regid: this.personalForm.regid,
          personalflag: this.personalForm.personalflag,
          setmealcode: data[0].setmealcode || this.personalForm.setmealcode,
          setmealname: data[0].setmealname || this.personalForm.setmealname,
          companycode: this.personalForm.companycode || "",
          batch: this.personalForm.batch || "",
          groupcode: this.personalForm.groupcode || "",
          combineitems: data.map((k) => {
            return k.combinecode;
          }),
        }).then((res) => {
          this.$message("操作成功!");
          this.groupPriceTotal = 0;
          this.groupPriceEnd = 0;
          // 选中新增数据
          this.currentPage = 1;
          this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
          this.$nextTick(() => {
            this.setmealRadio = res.result.regid;
            localStorage.removeItem("groupTableData");
          });
          this.pageState = "preview"; // 当前页面状态 add edit preview
          // this.pageState = "edit"; // 当前页面状态 add edit preview
          this.formFlag = true; // 表单限制不可编辑
          this.showProjectDialog = false; // 关闭窗口
        });
      } else {
        this.groupTableData = data;
        this.groupPriceTotal = 0;
        this.personalForm.combineitems = data; // 赋值对象中
        localStorage.setItem("groupTableData", JSON.stringify(data));
        // 体检项目总金额
        this.groupTableData.forEach((item) => {
          this.groupPriceTotal += item.price;
        });
        this.personalForm.customermedicaldetails = this.groupTableData;
        // 体检项目已经缴费金额
        this.groupTableData.forEach((item) => {
          if (item.chargeflag == 1) {
            this.groupPriceEnd += item.price;
          }
        });
        this.showProjectDialog = false; // 关闭窗口
      }
      //  判断团检类型     个人--把组合结算方式也改为个人结算   团检---结算方式改为单位结算
      this.groupTableData.forEach((item) => {
        if (this.personalForm.personalflag == 0) {
          item.settlementtype = 1;
        } else {
          item.settlementtype = 0;
        }
      });
    },

    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      console.log(val);
      if (!val) {
        this.personalForm.batch = "";
        return false;
      }
      // this.personalForm.companycode != 0 &&
      //   (this.personalForm.personalflag = 1);
      let data = this.companyitems.filter((k) => k.code == val)[0];
      // console.log(data, "差单位名称是否有name");
      if (data) this.personalForm.companyname = data.name;
      if (data) this.personalForm.companycode = data.code;
      if (data) this.hadnleGetBatchOrGroup();
      // 单位名称手动输入没有code值,传 空 或者直接传输入内容
      // if (!data) this.personalForm.companyname = val;
      // if (!data) this.personalForm.companycode = val;
    },
    // 下拉改变单位选择值回调
    handleSelectComany2(val) {
      if (!val) {
        this.archivesForm.batch = "";
        return false;
      }

      let data = this.companyitems.filter((k) => k.code == val)[0];
      if (data) this.archivesForm.companyname = data.name;
      if (data) this.archivesForm.companycode = data.code;
      this.hadnleGetBatchOrGroup2();
    },
    // 下拉选中批次号触发回调
    handleSelectBatch(val) {
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
      }
    },
    // 下拉选中批次号触发回调
    handleSelectBatch2(val) {
      // console.log("档案信息批次", val);
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
      }
    },
    // 点击新增按钮回调
    handleCreate() {
      this.pageState = "add"; // 当前编辑状态
      this.inputIdCard = ""; // 清空身份证栏目
      this.inputIdCard = "";
      this.formFlag = false; // 解除表单限制可编辑
      this.groupdis = false; // 解除团检表单限制可编辑
      this.groupTableData = []; // 清空套餐数组
      this.setmealRadio = ""; // 清空选中编辑对象
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.choosePeople = undefined; // 新增重置选中人员
      this.personalForm.harmwordyearunit = "0";
      this.personalForm.workyearunit = "0";
      this.personalForm.personalflag = 0; //团检类型
      this.personalForm.reviewtype = 0; //检查类型
      this.personalForm.marriage = "未知";
      this.seniorityMonthFlag = false;
      this.personalForm.workyearMonth = "0";
      this.personalForm.seniorityMonth = "月";
      localStorage.removeItem("groupTableData");
      this.avatarImg = require("./images/lin.jpg");
      // 聚焦身份证框
      this.$refs.read_idcard &&
        this.$nextTick(() => {
          // if (this.healthcardcode == "idcard") {
          this.$refs.read_idcard.focus();
          // } else {
          //   this.$refs.read_healthcard.focus();
          // }
        });
      this.handlePersonalFormReset(); // 重置表单对象

      this.handleGetDetail(); // 获取下拉数据
    },
    // 获取个人登记明细/详情/新增回调
    handleGetPersonalDetail(regid, flag) {
      let that = this;
      this.loading = true;
      this.isIdCardFlag = false;
      // getPersonalDetail({
      getLoadProject({
        regid,
      }).then((res) => {
        // console.log(res.result, "点击行 获取到的数据");
        this.regID = res.result.regid;
        // 获取单位名称,批次等下拉数据
        getPersonalDetail().then((res) => {
          // 单位名称下拉框数据
          this.unitNameData = res.result.companyitems;
          this.companyitems = res.result.companyitems;
        });
        getGetHarms({ regid: res.result.regid }).then((res) => {
          // console.log(res, '获取字符串');
          if (res.code == 200) {
            this.HarmMsg = res.result?.keyString;
            this.DialogFormSelectData = res.result?.keyValues;
          }
        });
        // this.handleGetDetail() //  获取下拉框数据
        // 单位名称 /批次
        that.personalForm.companyname = res.result.companyname;
        that.personalForm.companycode = res.result.companycode;

        // 批次
        that.personalForm.batch = res.result.batch;

        // 行业/ 工种
        that.personalForm.industrytypename = res.result.industrytypename;
        that.personalForm.worktypename = res.result.worktypename;

        let data = res.result;
        res.result = data;
        this.choosePeople = data;
        this.personalForm = data;
        let birthday = `${data.birthday} 00:00:00`;
        this.personalForm.birthday = birthday;
        let entrytime = `${data.entrytime} 00:00:00`;
        this.personalForm.entrytime = entrytime;
        this.pageState = "preview";
        this.personalForm.ageunit = "";
        // 判断单位打印指引单类型 12666
        this.companycodes = res.result.companycode;

        // 年龄单位列表 / 回显值
        this.agearr = data.ageunititems;
        this.personalForm.ageunit =
          data.ageunititems.filter((k) => k.selected)[0] &&
          data.ageunititems.filter((k) => k.selected)[0].code;
        // 婚姻状态列表 /  回显值
        this.marriagearr = data.marriageitem;
        this.personalForm.marriage =
          (data.marriageitem.filter((k) => k.selected)[0] &&
            data.marriageitem.filter((k) => k.selected)[0].code) ||
          "其他";
        // 检查类型列表 / 回显值
        this.checktypeitems = [];
        data.checktypeitems.forEach((item) => {
          if (item.checkType == "1") this.checktypeitems.push(item);
        });
        // this.personalForm.checktype =
        //   (data.checktypeitems.filter((k) => k.selected)[0] &&
        //     data.checktypeitems.filter((k) => k.selected)[0].code) ||
        //   "";
        // 下拉单位列表 /  回显值
        this.companyitems = data.companyitems;
        this.batchitems = data.batchitems;
        this.groupitems = data.groupitems;
        let company = data.companyitems.filter((k) => k.selected)[0];
        let batch = data.batchitems.filter((k) => k.selected)[0];
        let group = data.groupitems.filter((k) => k.selected)[0];
        // this.personalForm.companycode = company && company.code;
        // this.personalForm.companyname = company && company.name;
        // this.personalForm.batch = batch && batch.code;
        this.personalForm.groupcode = group && group.code;
        // 职业病危害因素
        this.harmitems = data.harmitems;
        let harm = data.harmitems.filter((k) => k.selected)[0];
        this.personalForm.harmcode = harm && harm.code;
        this.personalForm.harmname = harm && harm.name;
        // 职业病行业类型
        this.industryitems = data.industryitems;
        // 职业病工种
        this.workitems = data.workitems;

        // 工龄 接害工龄 时间单位
        // workyear
        // harmwordyear
        this.personalForm.workyearunit =
          res.result.workyearunit == "0"
            ? "天"
            : res.result.workyearunit == "1"
            ? "月"
            : "年";
        this.personalForm.harmwordyearunit =
          res.result.harmwordyearunit == "0"
            ? "天"
            : res.result.harmwordyearunit == "1"
            ? "月"
            : "年";
        // 总工龄 月份
        !!res.result.workyearMonth && (this.seniorityMonthFlag = true); // 展开月份
        !!res.result.harmwordmonth && (this.seniorityMonthFlag2 = true); // 展开月份
        this.personalForm.workyearMonth = res.result.workyearMonth; // 月份赋值
        this.personalForm.harmwordmonth = res.result.harmwordmonth; // 月份赋值
        // ---------------------------------- 重组数据排序
        let temp1 = this.reduceSort(
          this.reduceGroup(data.combineitems, "resulttype")
        );
        let sortArr = [];
        for (const key in temp1) {
          let temp = this.reduceSort(this.reduceGroup(temp1[key], "deptcode"));
          for (const keySon in temp) {
            sortArr.push(
              ...temp[keySon].sort(function (a, b) {
                return a.seqno - b.seqno;
              })
            );
          }
        }
        this.groupTableData = sortArr;

        // ---------------------------------- 重组数据排序
        localStorage.setItem(
          "groupTableData",
          JSON.stringify(data.combineitems)
        );
        this.groupPriceTotal = 0;
        this.groupPriceEnd = 0;
        // 体检项目总金额
        data.combineitems &&
          data.combineitems.forEach((item) => {
            // if (item.chargeflag != 1) {
            this.groupPriceTotal += item.price;
            // }
          });
        // 体检项目已经缴费金额
        data.combineitems &&
          data.combineitems.forEach((item) => {
            if (item.chargeflag == 1) {
              this.groupPriceEnd += item.price;
            }
          });
        this.personalForm.fileid = data.fileid;
        this.personalForm.fileid && this.handleGetFiles(); // 获取头像文件
        this.loading = false; // 关闭加载
        if (this.isGuideSingle) {
          this.handlePrintGuideSingle();
          if (this.personalForm.checktype == 2) {
            // 2 体格检查表
            this.handlePrintGuideSingleAdult();
          } else if (this.personalForm.checktype == 4) {
            // 4 儿童体格检查表
            this.handlePrintGuideSingleChildren();
          }
        }
        if (this.isSearchDiaFrom) {
          this.personalForm.actPrice = 0;
          this.groupPriceEnd = 0;
          this.isSearchDiaFrom = false;
        }
        // this.choosePeople.inputcompanyname = "";
        this.personalForm.companyname = "";
        if (flag) {
          this.personalForm.sourceregid = regid;
          this.pageState = "add"; // 从检索过来复检登记新增逻辑
          if (!!this.personalForm.sourceregid) {
            this.personalForm.reviewtype = 1;
            this.personalForm.sourceregid = "";
          }
          this.personalForm.reviewtype = 1;
        }
      });
    },
    // 排序渲染
    reduceGroup(lists, index) {
      // rv为累加器，current为对象数组中的每一项即是一个对象
      return lists.reduce((rv, current) => {
        (rv[current[index]] = rv[current[index]] || []).push(current);
        return rv;
      }, {});
    },
    reduceSort(arys) {
      //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获	取的属性名进行排序，newkey是一个数组
      var newkey = Object.keys(arys).sort();
      //console.log('newkey='+newkey);
      var newObj = {}; //创建一个新的对象，用于存放排好序的键值对
      for (var i = 0; i < newkey.length; i++) {
        //遍历newkey数组
        newObj[newkey[i]] = arys[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
      }
      return newObj; //返回排好序的新对象
    },
    // 行业下拉框 选择回调
    handleSelectIndustry(row) {
      // console.log("行业回调", row);
      const result = this.SelectIndustryData.find((u) => u.code == row);
      if (this.message == "other") {
        // 档案信息页面
        !result && (this.archivesForm.industrytypename = row); // 如果是手动输入
        !result && (this.archivesForm.industrytypecode = row); // 如果是手动输入 code不能为空, 所以把name赋给code
        !!result &&
          ((this.archivesForm.industrytypecode = result.code),
          (this.archivesForm.industrytypename = result.name));
      } else if (this.message == "basic") {
        !result && (this.personalForm.industrytypename = row); // 如果是手动输入
        !result && (this.personalForm.industrytypecode = row); // 如果是手动输入 code不能为空, 所以把name赋给code
        !!result &&
          ((this.personalForm.industrytypecode = result.code),
          (this.personalForm.industrytypename = result.name));
      }
    },
    // 工种下拉框  选择回调
    handleSelectJobs(row) {
      console.log("工种回调", row);
      const result = this.SelectJobsData.find((u) => u.code == row);
      if (this.message == "other") {
        // 档案信息页面
        !result && (this.archivesForm.worktypename = row); // 如果是手动输入
        !result && (this.archivesForm.worktypecode = row); // 如果是手动输入 code不能为空, 所以把name赋给code
        !!result &&
          ((this.archivesForm.worktypecode = result.code),
          (this.archivesForm.worktypename = result.name));
      } else if (this.message == "basic") {
        !result && (this.personalForm.worktypecode = row); // 如果是手动输入
        !result && (this.personalForm.worktypename = row); // 如果是手动输入 code不能为空, 所以把name赋给code
        !!result &&
          ((this.personalForm.worktypecode = result.code),
          (this.personalForm.worktypename = result.name));
      }
    },
    // 获取下拉框数据
    handleGetDetail() {
      // 行业
      getLoadType1().then((res) => {
        // console.log(res.data, '行业');
        this.SelectIndustryData = res.data;
      });
      // 工种
      getLoadType2().then((res) => {
        // console.log(res.data, '工种');
        this.SelectJobsData = res.data;
      });
      // 获取检查目的
      GetPurposeOfTheInspection().then((res) => {
        // console.log(res, "获取检查目的");
        this.PurposeOfTheInspectionData = res.data;
      });
      getPersonalOccupationDetail().then((res) => {
        let {
          ageunititems,
          checktypeitems,
          companyitems,
          marriageitem,
          harmitems,
          industryitems,
          workitems,
        } = res.result;
        // console.log(res.result, "result!!!!!!!!!!");
        this.agearr = ageunititems;
        // 年龄单位列表 / 回显值
        this.agearr = ageunititems;
        this.personalForm.ageunit =
          ageunititems.filter((k) => k.selected)[0] &&
          ageunititems.filter((k) => k.selected)[0].code;
        // 婚姻状态列表 /  回显值
        this.marriagearr = marriageitem;
        this.personalForm.marriage =
          (marriageitem.filter((k) => k.selected)[0] &&
            marriageitem.filter((k) => k.selected)[0].code) ||
          "未知";
        // 检查类型列表 / 回显值
        this.checktypeitems = [];
        checktypeitems.forEach((item) => {
          if (item.checkType == "1") this.checktypeitems.push(item);
        });
        // 下拉单位列表 /  回显值
        this.companyitems = companyitems;
        let company = companyitems.filter((k) => k.selected)[0];
        // 职业病危害因素
        this.harmitems = harmitems;
        // console.log(this.harmitems, "职业病危害因素");
        let harm = harmitems.filter((k) => k.selected)[0];
        // 职业病行业类型
        this.industryitems = industryitems;
        // console.log(this.industryitems, "职业病行业类型");
        let industry = industryitems.filter((k) => k.selected)[0];
        // 职业病工种
        this.workitems = workitems;
        // console.log(this.workitems, "职业病工种");
        let work = workitems.filter((k) => k.selected)[0];
        getSysConfigInfo({
          cc: "DefaultCheckTypeUser",
        }).then((res) => {
          let isCheckArr = res.result.split(",");

          if (isCheckArr.includes(this.getCookie("username"))) {
            // this.personalForm.checktype = "2";
          }
        });
      });
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup() {
      getBatchOrGroup({
        companycode: this.personalForm.companycode,
      })
        .then((res) => {
          console.log("获取批次和分组", res);
          let { batchitems, groupitems } = res.result;
          this.batchitems = batchitems;
          let batch = batchitems.filter((k) => k.selected)[0] || batchitems[0];
          batch && (this.personalForm.batch = batch.code);
          this.groupitems = batch.groupitems;
        })
        .catch((err) => {});
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup2() {
      getBatchOrGroup({
        companycode: this.archivesForm.companycode,
      })
        .then((res) => {
          // 获取批次和分组
          let { batchitems, groupitems } = res.result;
          this.batchitems = batchitems;
          let batch = batchitems.filter((k) => k.selected)[0] || batchitems[0];
          batch && (this.archivesForm.batch = batch.code);
          this.groupitems = batch.groupitems;
        })
        .catch((err) => {});
    },
    // 收入检索身份证/条件号等回调
    handleInputWork() {
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
      this.checkupWork = "";
    },
    // 赋默认值无法切换回调
    handleSelectChange() {
      this.$forceUpdate();
    },
    // 点击检索条件筛选全部回调
    handleChangeDate(val) {
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 点击检索条件筛选全部回调
    handleClickAll() {
      this.persontype = "";
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 点击检索条件筛选个人回调
    handleClickPersonal() {
      this.persontype = "0";
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 点击检索条件筛选单位回调
    handleClickCompany() {
      this.persontype = "1";
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 检索条件表信息选中行回调
    handleCheckCondition(row) {
      if (!row) return false;
      this.setmealRadio = row.regid;
      this.groupdis = true;
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.inputIdCard = ""; // 清空身份证栏目
      this.inputIdCard = "";
      // this.checkupWork = row.regid; // 清空身份证栏目
      // this.choosePeople = Object.assign({}, row);
      this.handleGetPersonalDetail(this.setmealRadio);
      // this.isSetSubmit == false &&
      //   this.handleGetPersonalDetail(this.choosePeople.regid);
      this.pageState = "preview"; // 当前预览状态
      this.message = "basic"; // 基本信息-basic 其他信息-other
      this.avatarImg = require("./images/lin.jpg");
      this.formFlag = true; // 解除表单限制可编辑
    },
    handleCompanycodeChange() {
      this.handleGetPersonalRegisterList();
    },
    // 获取个人登记列表回调
    handleGetPersonalRegisterList(pageflag) {
      this.loadingCondition = true;
      let whereitems = [];
      // 搜索关键词
      if (this.checkupWork) {
        whereitems.push({
          key: this.conditionCode,
          value: this.checkupWork.trim(),
        });
      }
      // 日期
      if (this.conditionDate && this.conditionDate.length > 0) {
        whereitems.push({
          key: "startdate",
          value: this.conditionDate[0],
        });
        whereitems.push({
          key: "enddate",
          value: this.conditionDate[1],
        });
      }
      // 类型
      if (this.persontype != "") {
        whereitems.push({
          key: "persontype",
          value: this.persontype,
        });
      }
      // 单位
      if (this.companycode) {
        whereitems.push({
          key: "companycode",
          value: this.companycode,
        });
      }
      // 是否允许不需要时间条件
      if (pageflag && typeof pageflag === "string") {
        whereitems.push({
          key: "pageflag",
          value: pageflag,
        });
      }
      whereitems.push({
        key: "sourcetype",
        value: "1",
      });
      getPersonalRegisterList2({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          // console.log(res, '搜索到的数据');
          this.count = res.count;
          this.conditionData = res.data;
          this.loadingCondition = false;
          this.choosePeople && (this.setmealRadio = this.choosePeople.regid);
          if (res.data.length == 1) {
            this.setmealRadio = res.data[0].regid;
            // this.handleGetPersonalDetail(res.data[0].regid);
          }
          this.checkupWork = "";
        })
        .catch((err) => {
          this.count = 0;
          this.checkupWork = "";
          this.conditionData = [];
          this.loadingCondition = false;
        });
    },
    // 重置表单对象-保留单位
    handleFormResetOfCom() {
      let tempcompanycode = this.personalForm.companycode;
      let tempcompanyname = this.personalForm.companyname;
      let tempbatch = this.personalForm.batch;
      let tempgroupcode = this.personalForm.groupcode;
      this.personalForm = {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 1,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        // checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        filebase64: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
        harmcode: "",
        harmname: "",
        worktypecode: "",
        worktypename: "",
        workyear: "",
        harmwordmonthunit: "1",
        harmwordmonth: "",
        harmwordyear: "",
        industrytypecode: "",
        industrytypename: "",
        jobno: "",
        workshop: "",
        level: 0,
        reporttake: "",
        remark: "",
        nativeplace: "",
        occupation: "",
        nation: "",
        email: "",
        department: "",
        guidancecode: "",
        guidancename: "",
        salesmancode: "",
        salesmanname: "",
        businesssource: "",
        remindcontent: "",
        remindflag: 0,
        notmyself: 0,
        actualname: "",
        actualsex: 0,
        actualageunit: "岁",
        idtype: "01",
        medicalcertify: "",
        jobin: "",
        positionin: "",
      };
      this.personalForm.companycode = tempcompanycode;
      this.personalForm.companyname = tempcompanyname;
      this.personalForm.batch = tempbatch;
      this.personalForm.groupcode = tempgroupcode;
    },
    // 重置表单对象
    handlePersonalFormReset() {
      this.seniorityMonthFlag = false;
      this.seniorityMonthFlag2 = false;
      this.personalForm = {
        reviewtype: 0,
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 1,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        // checktype: "",
        birthday: "",
        nation: "",
        occupation: "",
        telephone: "",
        address: "",
        idcard: "",
        hiscode: "",
        fileid: "",
        filebase64: "",
        companycode: "",
        companyname: "",
        batch: "",
        groupcode: "",
        combineitems: "",
        harmcode: "",
        harmname: "",
        worktypecode: "",
        worktypename: "",
        workyear: "",
        industrytypecode: "",
        industrytypename: "",
        jobno: "",
        workshop: "",
        level: 0,
        reporttake: "",
        remark: "",
        nativeplace: "",
        occupation: "",
        nation: "",
        email: "",
        department: "",
        guidancecode: "",
        guidancename: "",
        salesmancode: "",
        salesmanname: "",
        businesssource: "",
        remindcontent: "",
        remindflag: 0,
        notmyself: 0,
        actualname: "",
        actualsex: 0,
        actualageunit: "岁",
        idtype: "01",
        medicalcertify: "",
        jobin: "",
        positionin: "",
        harmwordyear: "",
        harmwordyearunit: "0",
        harmwordmonth: "",
        harmwordmonthunit: "0",
        workyearunit: "0",
        harmwordyearunit: "0",
        personalflag: 0,
        workyearMonth: "",
        seniorityMonth: "月",
      };
    },
    /* 获取打印配置 */
    handleGetPrintConfig() {
      var data = {
        id: localStorage.getItem("md5code"),
      };
      Sys_ConfiguringPrinters.getList(data).then((res) => {
        if (!res.result) return;
        let flag = res.result.filter((k) => {
          return k.printtype === "idcarddev";
        })[0];
        if (!flag) return;
        this.cardReaderFlag = flag.printname;
      });
    },
    // 点击读卡回调 身份证 编辑状态
    handleCardReadingEdit() {
      this.handlePersonalFormReset(); //重置表单
      // if (this.healthcardcode == "idcard") {
      if (this.cardReaderFlag == "华视") {
        this.handleConnectIdcard();
        let url = `http://127.0.0.1:19196/readcard&picpath=D:/1/123.bmp&t=${Math.random()}`;
        this.$axios
          .get(url)
          .then((res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data;
              let date = new Date();
              let year = date.getFullYear();
              this.inputIdCard = "";
              this.personalForm.name = data.partyName;
              this.personalForm.address = data.certAddress;
              this.personalForm.sex = data.gender == "男" ? 1 : 2;
              this.personalForm.birthday = data.bornDay.replace(
                /^(\d{4})(\d{2})(\d{2})$/,
                "$1-$2-$3"
              );
              this.personalForm.idcard = data.certNumber;
              this.personalForm.age = year - data.bornDay.slice(0, 4);
              this.personalForm.filebase64 = data.identityPic;
              this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.cardReaderFlag == "精伦") {
        let url = `http://127.0.0.1:18889/api/readCert`;
        this.$axios
          .post(url)
          .then((res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data.resultContent;
              let date = new Date();
              let year = date.getFullYear();
              this.inputIdCard = "";
              this.personalForm.name = data.partyName;
              this.personalForm.address = data.certAddress;
              data.gender == 0
                ? (this.personalForm.sex = 2)
                : data.gender == 1
                ? (this.personalForm.sex = 1)
                : (this.personalForm.sex = 2);
              this.personalForm.birthday = data.bornDay.replace(
                /^(\d{4})(\d{2})(\d{2})$/,
                "$1-$2-$3"
              );
              this.personalForm.idcard = data.certNumber;
              this.personalForm.age = year - data.bornDay.slice(0, 4);
              this.personalForm.filebase64 = data.identityPic;
              this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else if (this.cardReaderFlag == "新中新") {
        let url = `http://localhost:8989/api/ReadMsg?waitTime=3`;
        this.$axios
          .get(url)
          .then((res) => {
            if (res.data.code == "0") {
              let data = res.data;
              let date = new Date();
              let year = date.getFullYear();
              this.inputIdCard = "";
              this.personalForm.name = data.name;
              this.personalForm.address = data.address;
              this.personalForm.sex = data.sex == "男" ? 1 : 2;
              this.personalForm.birthday = data.born.replace(
                /^(\d{4})(\d{2})(\d{2})$/,
                "$1-$2-$3"
              );
              this.personalForm.idcard = data.cardno;
              this.personalForm.age = year - data.born.slice(0, 4);
              this.personalForm.filebase64 = data.photobase64;
              this.avatarImg = `data:image/jpeg;base64,${data.photobase64}`;
            } else {
              this.$message.warning(`${res.data.retmsg}，请联系管理员!`);
            }
          })
          .catch((err) => {
            this.$message.warning(`${err.data.retmsg}，请联系管理员!`);
          });
      }
    },
    // 点击读卡回调 身份证/健康卡 2082
    async handleCardReading() {
      this.handlePersonalFormReset(); //重置表单
      if (this.healthcardcode == "idcard") {
        if (this.cardReaderFlag == "华视") {
          this.handleReadCardHuaShi(); // 华视读卡
        } else if (this.cardReaderFlag == "精伦") {
          this.handleReadCardJingLun(); // 精伦读卡
        } else if (this.cardReaderFlag == "新中新") {
          this.handleReadCardXinZhongXin(); // 新中新读卡
        }
      } else {
        if (!this.inputIdCard) return false;
        getPatientInfo({
          patId: this.inputIdCard,
        })
          .then((res) => {
            if (res.result.length == 0) return;
            if (res.result.length == 1) {
              if (!res.result[0] || !res.result[0].idcard) return false;
              this.personalForm.address = res.result[0].address;
              this.personalForm.birthday = res.result[0].birthday;
              this.personalForm.idcard = res.result[0].idcard;
              this.personalForm.name = res.result[0].name;
              this.personalForm.sex = res.result[0].sex;
              this.personalForm.telephone = res.result[0].telephone;
              this.personalForm.age = res.result[0].age;
              this.personalForm.hiscode = res.result[0].hiscode;
              this.personalForm.healthcard = res.result[0].healthcard;
            } else {
              this.outpatientData = res.result;
              this.showOutpatient = true;
            }
            this.inputIdCard = "";
          })
          .catch((err) => {
            this.inputIdCard = "";
          });
      }
      //this.handleGetDetail(); // 获取下拉数据
    },
    // 华视读卡
    handleReadCardHuaShi() {
      console.log("华视读卡-华视读卡-华视读卡");
      this.handleConnectIdcard();
      let url = `http://127.0.0.1:19196/readcard&picpath=D:/1/123.bmp&t=${Math.random()}`;
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.resultFlag == 0) {
            let data = res.data;
            let date = new Date();
            let year = date.getFullYear();
            this.personalForm.name = data.partyName;
            this.personalForm.address = data.certAddress;
            this.personalForm.sex = data.gender == "男" ? 1 : 2;
            this.personalForm.birthday = data.bornDay.replace(
              /^(\d{4})(\d{2})(\d{2})$/,
              "$1-$2-$3"
            );
            this.personalForm.idcard = data.certNumber;
            // this.inputIdCard = data.certNumber;
            this.personalForm.age = year - data.bornDay.slice(0, 4);
            this.personalForm.filebase64 = data.identityPic;
            this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            // this.handleHealthCard();
            // this.handleGetRegisterInfo(); // 读取档案数据
            //  获取历史信息
            this.handleReadAtLastReviewProject(data.certNumber);
          } else {
            this.$message.warning(res.data.errorMsg);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 精伦读卡
    handleReadCardJingLun() {
      console.log("精伦读卡-精伦读卡-精伦读卡");
      let url = `http://127.0.0.1:18889/api/readCert`;
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.resultFlag == 0) {
            let data = res.data.resultContent;
            let date = new Date();
            let year = date.getFullYear();
            this.personalForm.name = data.partyName;
            this.personalForm.address = data.certAddress;
            // 读卡器返回 0=女 1=男
            this.personalForm.sex =
              data.gender == 0 ? 2 : data.gender == 1 ? 1 : 0;
            this.personalForm.birthday = data.bornDay.replace(
              /^(\d{4})(\d{2})(\d{2})$/,
              "$1-$2-$3"
            );
            this.personalForm.idcard = data.certNumber;
            // this.inputIdCard = data.certNumber;
            this.personalForm.age = year - data.bornDay.slice(0, 4);
            this.personalForm.filebase64 = data.identityPic;
            this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            // this.handleHealthCard();
            // this.handleGetRegisterInfo(); // 读取档案数据
            // 获取历史信息
            this.handleReadAtLastReviewProject(data.certNumber);
          } else {
            this.$message.warning(res.data.errorMsg);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 新中新读卡
    handleReadCardXinZhongXin() {
      console.log("新中新读卡-新中新读卡-新中新读卡");
      let url = `http://localhost:8989/api/ReadMsg?waitTime=3`;
      this.$axios
        .get(url)
        .then((res) => {
          if (res.data.code != -1) {
            let data = res.data;
            let date = new Date();
            let year = date.getFullYear();
            this.personalForm.name = data.name;
            this.personalForm.address = data.address;
            this.personalForm.sex = data.sex == "男" ? 1 : 2;
            this.personalForm.birthday = data.born.replace(
              /^(\d{4})(\d{2})(\d{2})$/,
              "$1-$2-$3"
            );
            this.personalForm.idcard = data.cardno;
            // this.inputIdCard = data.cardno;
            this.personalForm.age = year - data.born.slice(0, 4);
            this.personalForm.filebase64 = data.photobase64;
            this.avatarImg = `data:image/jpeg;base64,${data.photobase64}`;
            // this.handleHealthCard();
            // this.handleGetRegisterInfo(); // 读取档案数据
            // 获取历史信息
            this.handleReadAtLastReviewProject(data.cardno);
          } else {
            this.$message.warning(`${res.data.retmsg}，请联系管理员!`);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 获取历史记录--复制项目回调
    PeviewCopyProjectFun(row) {
      console.log(row, "row");
      this.ReviewProjectDialogFlag = false; // dialog开关
      GetUserReviewItem({ regid: row.regid }).then((res) => {
        console.log(res);
        if (res.code == 200) {
          // 获取到regis 赋值给sourceregid 表示此流程为复检操作
          this.sourceregid = res.result.register.regid; // 复查id
          this.personalForm.sourceregid = res.result.register.regid;
          !!res.result.medicalDetail &&
            (this.groupTableData = res.result.medicalDetail);
          this.HarmMsg = res.result?.keyString; // 职业危害字段展示
          this.DialogFormSelectData = res.result?.harms; // 职业危害
          this.personalForm = res.result?.register; // 基本信息
          // ---- 3.6
          this.ReviewProjectDialogFlag = false; // dialog开关
        } else {
          this.$message.error(res.message);
        }
      });
    },
    // 读卡时获取历史记录--弹框取消回调
    ReviewProjectDialogClose() {
      this.ReviewProjectDialogFlag = false;
    },
    // 读卡时获取历史记录
    handleReadAtLastReviewProject(idCard) {
      console.log(idCard);
      GetUserReview({ idCard }).then((res) => {
        console.log(res, "读卡时获取历史记录");
        if (res.code != 200) {
          this.$message.error(res.message);
          return;
        } else if (!res.result) {
          this.$message.warning("暂无数据");
          return;
        }
        if (res.result?.jobin == "离岗时") {
          this.$message({
            type: "warning",
            message: "当前患者已离职无需复检",
            time: 3000,
          });
          return;
        }

        this.ReviewProjectDialogFlag = true; // dialog开关
        this.ReviewProjectDialogData; // dialog数据
        this.ReviewProjectDialogData = res.result.combineCode;
      });
    },
    // 身份证搜索框回车
    handleEnterIdcard() {
      // this.handleGetRegisterInfo();
      // this.handlePersonalFormReset(); // 重置表单
      // this.handleReadAtLastReviewProject(this.inputIdCard); // 获取身份证历史体检记录
      console.log(this.inputIdCard);
      this.handleHealthCard();
    },
    // 获取读卡接口返回
    handleHealthCard() {
      if (!this.inputIdCard) return false;
      getPatientInfo({
        patId: this.inputIdCard,
      })
        .then((res) => {
          if (res.result.length == 0) return;
          if (res.result.length == 1) {
            this.personalForm.address = res.result[0].address;
            this.personalForm.birthday = res.result[0].birthday;
            this.personalForm.idcard = res.result[0].idcard;
            this.personalForm.name = res.result[0].name;
            this.personalForm.sex = res.result[0].sex;
            this.personalForm.telephone = res.result[0].telephone;
            this.personalForm.age = res.result[0].age;
            this.personalForm.hiscode = res.result[0].hiscode;
            this.personalForm.healthcard = res.result[0].healthcard;
          }
          this.inputIdCard = "";
        })
        .catch((err) => {
          this.inputIdCard = "";
        });
      this.inputIdCard = "";
    },
    handleConnectIdcard() {
      if (this.cardReaderFlag == "华视") {
        let url = `http://127.0.0.1:19196/OpenDevice&t=${Math.random()}`;
        this.$axios.get(url).then((res) => {
          this.$message({
            type: "success",
            duration: 500,
            message: res.data.errorMsg,
          });
        });
      } else if (this.cardReaderFlag == "精伦") {
        //创建读卡控件
        let url = `http://127.0.0.1:18889/api/connect`;
        this.$axios.post(url).then((res) => {
          this.$message({
            type: "success",
            duration: 500,
            message: res.data.errorMsg,
          });
        });
      } else if (this.cardReaderFlag == "新中新") {
      }
    },
    // 点击选择健康卡/身份证回调
    handleSelectHealthcardCheck(val) {
      // this.healthcardCheck = val.name;
      this.healthcardcode = val;
    },
    // 点击选择检索体检条件回调
    handleSelectCondition(val) {
      this.condition = val.name;
      this.conditionCode = val.code;
      this.$refs.popoverRef.doClose(); // 关闭弹出层popover
    },
    // 获取条件计算日期范围回调
    handleGetconditionDate() {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() + 3600 * 1000 * 24 * +6);
      this.conditionDate = [this.gettime(end), this.gettime(start)];
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
    },
    // 获取系统配置回调
    handleGetSysConfig() {
      getSysConfig({
        page: 1,
        limit: 100000,
      }).then((res) => {
        let dateObj = res.data.filter(
          (k) => k.concode == "Sys_Reg_DefDateRange"
        )[0];
        dateObj && (this.dateRange = dateObj.conitemValue);
        // 获取当前体检中心
        userlogin.GetMyOrgs().then((response) => {
          if (response.result.meccode == 0) {
            this.radio = "个人";
            this.persontype = "0";
          }
          this.handleGetconditionDate();
        });
      });
    },
    // 体检套餐行点击回调
    handleChecked(row) {
      // console.log(row);
    },
    // 点击编辑个人列表数据
    handleEditPage() {
      this.isIdCardFlag = false;
      if (!this.choosePeople) {
        this.formFlag = true;
        this.groupdis = true;
        this.$message.warning("请选择编辑人员!");
        return false;
      }
      if (this.choosePeople.status == 6 && this.choosePeople.status == 7) {
        this.$message.warning("已总检,不允许编辑!");
        return false;
      }
      this.message = "basic"; // 展示基本信息页面
      this.pageState = "edit";
      this.formFlag = false;
      this.handleGetDetail(); // 获取下拉框数据
    },
    // 点击删除个人列表数据
    hadnleDelList() {
      if (!this.setmealRadio) {
        this.$message.error("至少选中一条需删除数据!");
        return false;
      }
      // if (this.choosePeople && this.choosePeople.status !== 0) {
      //   this.$message.error("当前人员状态不允许删除!");
      //   return false;
      // }
      this.$confirm(
        `此操作将永久删除该数据, 是否继续?　　${this.choosePeople.name}`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          setDelete([this.setmealRadio]).then((res) => {
            this.pageState = "add"; // 当前编辑状态
            this.formFlag = false; // 解除表单限制可编辑
            this.groupdis = false; // 解除团检表单限制可编辑
            this.groupTableData = []; // 清空套餐数组
            this.setmealRadio = ""; // 清空选中编辑对象
            this.groupPriceTotal = 0; // 体检项目总金额
            this.groupPriceEnd = 0; // 体检项目已经缴费金额
            this.currentPage = 1;
            this.handleGetPersonalRegisterList(); // 获取列表数据
            this.handlePersonalFormReset(); // 重置表单对象
            this.handleGetDetail(); // 获取下拉数据
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
    // 控制显示登记流程
    handleShowFlowPath() {
      if (!this.personalForm) {
        this.$message.warning("请先选择查看人员!");
        return false;
      }
      this.flowPathRegid = this.personalForm.regid;
      this.showFlowPath = true;
    },
    // 控制显示登记流程
    handleCloseFlowPath(val) {
      this.showFlowPath = val;
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
    // 点击重置按钮回调
    handleResetPage() {
      this.pageState = ""; // 当前编辑状态
      this.inputIdCard = ""; // 清空身份证栏目
      this.inputIdCard = "";
      if (this.isIdCardFlag) {
        this.formFlag = false; // 解除表单限制可编辑
      } else {
        this.formFlag = true; // 表单限制可不编辑
        this.handleGetPersonalRegisterList(); // 获取列表数据
      }
      this.groupdis = true; // 解除团检表单限制可编辑
      this.groupTableData = []; // 清空套餐数组
      this.setmealRadio = ""; // 清空选中编辑对象
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.currentPage = 1;
      this.handlePersonalFormReset(); // 重置表单对象
      this.handleGetDetail(); // 获取下拉数据
    },
    handleSearchCopy(data) {
      console.log(data, "data");
      getPersonalOccupationDetail({
        regid: data.regid,
      }).then((res) => {
        if (!res.result) return;
        this.pageState = "add"; // 当前编辑状态
        this.formFlag = false; // 解除表单限制可编辑
        this.groupdis = false; // 解除团检表单限制可编辑
        this.setmealRadio = ""; // 清空选中编辑对象
        // this.avatarImg = require("./images/lin.jpg");
        if (data.flag === "projectDia") {
          // this.handlePersonalFormReset(); // 重置表单对象
        } else {
          this.personalForm = res.result;
          this.personalForm.regid = "";
        }
        this.personalForm.actPrice = 0;
        this.groupPriceEnd = 0;
        this.personalForm.companycode = "";
        this.personalForm.companyname = "";
        this.personalForm.batch = "";
        this.personalForm.groupcode = "";
        this.personalForm.groupname = "";
        this.personalForm.hiscode = "";
        this.personalForm.healthcard = "";
        this.personalForm.checkno = "";
        this.groupTableData = res.result.combineitems.map((k) => {
          return {
            detid: "",
            regid: "",
            setmealcode: "",
            setmealname: "",
            // setmealcode: k.setmealcode,
            // setmealname: k.setmealname,
            combinecode: k.combinecode,
            combinename: k.combinename,
            deptcode: k.deptcode,
            price: k.price,
            discount: k.discount,
            discountprice: k.price,
            addflag: k.addflag,
            dedflag: k.dedflag,
            settlementtype: this.personalForm.personalflag == 0 ? 1 : 0, // 复制登记进来判断团检类型 是个人还是单位,更改项目结算类型
          };
        });
        this.handleGetDetail(); // 获取下拉数据
      });
    },

    // 检索组件 复查登记回调
    handleSearchCheckIn(data, regid, flag) {
      this.hadnleOnBtnClicked("btnAdd"); // 先调新增 清空
      this.pageState = "add"; // 从检索过来复检登记  是新增逻辑
      console.log(data, regid, "复查登记回调");
      this.showSearch = false;
      this.sourceregid = regid; // 把当前用户regid存储, sourceregid有值就是复检
      this.personalForm.sourceregid = regid;
      getTemplateList({
        page: 1,
        limit: 1000000,
        key: "",
      }).then((res) => {
        //  调接口返回数据
        const ids = data.map((u) => u.combinecode);
        GetOccupationCombine(ids).then((res) => {
          res.code == 200 && (this.groupTableData = res.result);
        });
        this.formFlag = false; // 可编辑
        this.pageState = "add";
      });
      // 检索过来默认复检 不调详情接口，避免数据覆盖
      if (!!flag) {
        this.handleGetPersonalDetail(regid, flag);
      }
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      this.checkupWork = regid;
      this.setmealRadio = regid;
      this.isSearchDiaFrom = true;
      this.handleGetPersonalDetail(this.checkupWork);
    },
    // 检索组件显示回调
    handleShowSearch() {
      this.showSearch = true;
    },
    // 检索组件关闭回调
    handleCloseSearch(value) {
      this.showSearch = value;
    },
    // 打印申请单 - 一键
    handlePrintApplyOneKey() {
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (!this.choosePeople) {
        this.$message.warning("请先选择需要打印申请单人员!");
        return false;
      }
      //  请求申请单打印的科室配置 , meccode = 0 (9号楼) | meccode = 1 (8号楼)
      getSysConfigInfo({ cc: "Sys_Print_Apply" }).then(async (res) => {
        if (!res.result) return;
        let departArr = res.result.split("|");
        let meccode = this.choosePeople.meccode;
        let depart =
          meccode == 0 ? departArr[0] : meccode == 1 ? departArr[1] : "";
        if (!depart) {
          this.$message.warning("暂无科室配置!");
          return;
        }
        if (this.$refs.btnApply[0].$el.innerText == "打印申请单") {
          let indexP =
            this.$refs.btnApply[0].$attrs["data-remark"].split("、")[0] + "、";
          let repname = "";
          meccode == 1
            ? (repname = "高干申请单A4")
            : (repname = this.$refs.btnApply[0].$attrs["data-remark"]);
          if (meccode == 1) {
            repname = `${indexP}${repname}`;
          }
          let printDepart = depart.split(",");
          for (let i = 0; i < printDepart.length; i++) {
            let index = this.groupTableData.findIndex((k) => {
              return k.deptcode === printDepart[i];
            });
            if (index < 0) continue; // 找不到科室 跳过当前科室打印
            // 根据科室循环打印
            let data = {
              fingercode: localStorage.getItem("md5code"),
              codes: [this.choosePeople.regid],
              repname,
              printflag: 1,
              whereitems: [
                {
                  key: "deptcode",
                  value: printDepart[i],
                },
              ],
            };
            await printBase64(data).then((res) => {
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
          }
        }
      });
    },
    // 打印申请单 - 勾选
    handlePrintApplyCheck() {
      // this.$refs.popoverRefIdc.forEach((k) => {
      //   k.doClose(); // 关闭弹出层popover
      // });
      if (!this.choosePeople) {
        this.$message.warning("请先选择需要打印申请单人员!");
        return false;
      }
      let tempArr = this.groupTableData.map((k) => {
        if (k.billprint === 0) {
          return {
            code: k.deptcode,
            name: k.deptname,
            children: [],
          };
        }
      });
      tempArr = tempArr.filter((k) => k);
      if (tempArr.length === 0) {
        this.$message.warning("无申请单打印!");
        return false;
      }
      let map = new Map();
      for (let item of tempArr) {
        map.set(item.code, item);
      }
      this.applyPrintTree = [...map.values()];
      this.applyPrintTree.forEach((k, i) => {
        this.groupTableData.forEach((item, index) => {
          if (item.dedflag == 1) return;
          if (item.delflag == 1) return;
          if (k.code === item.deptcode) {
            k.children.push({
              ...item,
              code: item.combinecode,
              name: item.combinename,
            });
          }
        });
      });
      this.applyPrintTree = this.applyPrintTree.filter((k) => {
        return k.children.length > 0;
      });
      this.showApplyPrint = true;
    },
    // 预览方法回调
    handlePreview(domId) {
      console.log("预览", domId);
      this.$refs.popoverRefIdc.forEach((k) => {
        k.doClose(); // 关闭弹出层popover
      });
      if (!this.choosePeople) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行预览",
          type: "error",
        });
        return false;
      }
      this.dialogVisible = true;
      switch (domId) {
        case "btnGuideSingle": // 指引单
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "打印") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.choosePeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
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
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnPaySingle": // 缴费单
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "缴费单") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.choosePeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
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
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        case "btnLabel": // 标签
          this.$refs.popoverRefIdc.forEach((d) => {
            if (d.$children[0].$el.innerText == "标签打印") {
              let data = {
                fingercode: localStorage.getItem("md5code"),
                codes: [this.choosePeople.regid],
                repname: d.$children[0].$attrs["data-remark"],
                whereitems: [],
              };
              printBase64(data).then((res) => {
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
                if (url) this.dialogVisible = true;
                this.pdfUrl =
                  "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
              });
            }
          });
          break;
        default:
          break;
      }
    },
    // 打印指引单回调
    handlePrintGuideSingle(resRegid) {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      if (this.choosePeople.freeze == 1) {
        this.$message.warning(`${this.choosePeople.name} 数据已冻结!`);
        return;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "打印指引单") {
        let indexP = d.$attrs["data-remark"].split("、")[0] + "、";
        console.log(indexP, d);
        let repname = "";
        let lengthP = this.groupTableData.length;
        let tempArr = this.groupTableData.map((k) => {
          return k.combinecode;
        });
        repname = `${indexP}指引单`;
        // if (tempArr.includes("205032")) {
        //   repname = `${indexP}高干指引单知书版`;
        // } else if (
        //   this.choosePeople.meccode == 0 &&
        //   this.choosePeople.companytype.toLowerCase().indexOf("vip") > -1
        // ) {
        //   if (this.choosePeople.checktype == "1") {
        //     repname = `${indexP}指引单`;
        //   } else if (this.choosePeople.checktype == "2") {
        //     repname = `${indexP}入职指引单`;
        //   } else {
        //     repname = `${indexP}团体指引单`;
        //   }
        // } else if (this.choosePeople.meccode == 1) {
        //   // 判断单位打印指引单类型 12666
        //   if (this.companycodes == 12666) {
        //     lengthP < 6
        //       ? (repname = `${indexP}高干入职指引单A5`)
        //       : (repname = `${indexP}高干入职指引单A4`);
        //   } else {
        //     lengthP < 6
        //       ? (repname = `${indexP}高干指引单A5`)
        //       : (repname = `${indexP}高干指引单A4`);
        //   }
        // } else {
        //   if (this.choosePeople.personalflag == 1) {
        //     repname = `${indexP}团体指引单`;
        //   } else {
        //     repname = d.$attrs["data-remark"];
        //   }
        // }
        // if (this.choosePeople.meccode == 1) {
        //   repname = d.$attrs["data-remark"];
        // }
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: resRegid ? [resRegid] : [this.choosePeople.regid],
          repname,
          whereitems: [
            {
              key: "regid",
              value: resRegid || this.choosePeople.regid,
            },
          ],
        };
        console.log(data, "这传入请求的data是啥?????????");
        printBase64(data)
          .then((res) => {
            console.log(res, "打印指引单的res");
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
            this.isGuideSingle = false;
          })
          .catch((err) => {
            this.isGuideSingle = false;
          });
      }
    },
    // 打印指引单回调-同时打印体格表
    handlePrintGuideSingleAdult() {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: "2、体格检查表",
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
          ],
        };
        printBase64(data)
          .then((res) => {
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
            this.isGuideSingle = false;
          })
          .catch((err) => {
            this.isGuideSingle = false;
          });
      }
    },
    // 打印指引单回调-同时儿童体格表
    handlePrintGuideSingleChildren() {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: "2、儿童体格检查表",
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
          ],
        };
        printBase64(data)
          .then((res) => {
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
            this.isGuideSingle = false;
          })
          .catch((err) => {
            this.isGuideSingle = false;
          });
      }
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    // 预览指引单
    PreviewGuideSingleFun() {
      let d = this.$refs.btnGuideSingle[0];
      // let d = this.$refs.btnPreviewGuideSingle[0]
      console.log(d, d.$attrs["data-remark"]);
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname: d.$attrs["data-remark"],
        whereitems: [],
      };
      printBase64(data).then((res) => {
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
        if (url) this.dialogVisible = true;
        this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
      });
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.DialogFormSelectData = []; // 点击新建 . 把已选择的职业危害清空
          this.HarmMsg = "";
          this.message = "basic";
          this.handleCreate();
          break;
        case "btnKeep": // 保存
          if (
            this.pageState == "add" &&
            (this.personalForm.sex == 0 || this.personalForm.age == 0)
          ) {
            this.$confirm(`请填写基本信息!`, "提示", {
              confirmButtonText: "去填写",
              showConfirmButton: true,
              closeOnClickModal: false,
              showClose: false,
              showCancelButton: false,
              type: "warning",
            })
              .then(() => {})
              .catch(() => {
                this.idCarverify(this.personalForm.idcard);
              });
          } else {
            this.idCarverify(this.personalForm.idcard);
          }
          break;
        case "btnDel": // 删除
          this.hadnleDelList();
          break;
        case "btnReset": // 重置
          this.handleResetPage();
          break;
        case "btnCharge": // 收费
          this.handleChargePage();
          break;
        case "btnEdit": // 编辑
          this.handleEditPage();
          break;
        case "btnSearch": // 检索
          this.handleShowSearch();
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        case "btnFlowPath": // 流程
          this.handleShowFlowPath();
          break;
        case "btnQuestionnaire": // 调查问卷
          this.handleShowQuestionnaire();
          break;
        case "btnHealthView": // 健康视图
          this.handleShowHealthView();
          break;
        case "btnLabel": // 标签
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          if (
            this.choosePeople != undefined &&
            this.choosePeople != null &&
            this.choosePeople != "" &&
            this.choosePeople.regid != undefined &&
            this.choosePeople.regid != null &&
            this.choosePeople.regid != ""
          ) {
            // console.log(this.$refs.popoverRefIdc);
            this.$refs.popoverRefIdc.forEach((d) => {
              if (d.$children[0].$el.innerText == "标签打印") {
                var data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [this.choosePeople.regid],
                  repname: d.$children[0].$attrs["data-remark"],
                  whereitems: [
                    {
                      key: "regid",
                      value: this.choosePeople.regid,
                    },
                  ],
                };
                printBase64(data).then((res) => {
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
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "请选择人员再进行导出标签",
              type: "error",
            });
          }
          break;

        case "btnPreviewGuideSingle": // 预览指引单
          console.log("btnPreviewGuideSingle");
          // this.handlePreview();
          this.PreviewGuideSingleFun(); //预览
          // if (
          //   this.choosePeople != undefined &&
          //   this.choosePeople != null &&
          //   this.choosePeople != "" &&
          //   this.choosePeople.regid != undefined &&
          //   this.choosePeople.regid != null &&
          //   this.choosePeople.regid != ""
          // ){
          //   // this.dialogVisible = true;
          // }else{
          //   this.$message({
          //     showClose: true,
          //     message: "请选择人员再进行预览",
          //     type: "error",
          //   });
          // }
          break;
        case "btnGuideSingle": // 指引单打印
          if (!this.choosePeople) {
            this.isGuideSingle = true;
            this.hadnleSubmit();
          } else {
            this.handlePrintGuideSingle();
          }

          // console.log(this.pageState, "this.pageState");
          // if (this.pageState == "add") {
          //   this.isGuideSingle = true;
          //   this.hadnleSubmit();
          // } else if (this.pageState == "edit") {
          //   this.$confirm("当前数据暂未保存, 是否需要保存?", "提示", {
          //     confirmButtonText: "是",
          //     cancelButtonText: "否",
          //     type: "warning",
          //   })
          //     .then(() => {
          //       this.isGuideSingle = true;
          //       this.hadnleSubmit();
          //       return;
          //     })
          //     .catch(() => {
          //       this.handlePrintGuideSingle();
          //       return;
          //     });
          // } else if (this.pageState == "preview") {
          //   this.handlePrintGuideSingle();
          // }

          break;

        // break;
        case "btnPaySingle": // 指引缴费单
          this.$refs.popoverRefIdc.forEach((k) => {
            k.doClose(); // 关闭弹出层popover
          });
          if (
            this.choosePeople != undefined &&
            this.choosePeople != null &&
            this.choosePeople != "" &&
            this.choosePeople.regid != undefined &&
            this.choosePeople.regid != null &&
            this.choosePeople.regid != ""
          ) {
            this.$refs.popoverRefIdc.forEach((d) => {
              if (d.$children[0].$el.innerText == "缴费单") {
                var data = {
                  fingercode: localStorage.getItem("md5code"),
                  codes: [this.choosePeople.regid],
                  repname: d.$children[0].$attrs["data-remark"],
                  whereitems: [
                    {
                      key: "regid",
                      value: this.choosePeople.regid,
                    },
                  ],
                };
                printBase64(data).then((res) => {
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
              }
            });
          } else {
            this.$message({
              showClose: true,
              message: "请选择人员再进行导出缴费单",
              type: "error",
            });
          }
          break;
        case "btnApply": // 打印申请单
          // this.handlePrintApply();
          this.handlePrintApplyCheck();
          break;
        default:
          break;
      }
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
  },
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      // beforeRouteENnter不能通过this访问组件实例，但是可以通过 vm 访问组件实例
      if (to.query.regid) {
        vm.checkupWork = to.query.regid;
        // vm.setmealRadio = to.query.regid;
        vm.handleGetPersonalRegisterList("customerresult");
        // vm.handleGetPersonalDetail(to.query.regid);
      }
    });
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
@import "./css/register.scss";
@import "./css/wenjuan.scss";
</style>
  