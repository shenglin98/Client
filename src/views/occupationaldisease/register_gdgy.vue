<template>
  <div class="personal_register">
    <div class="pageReg" v-if="!showQuestionnaire && !showHealthView">
      <div class="filter-container">
        <div v-for="(btn, index) of buttons" :key="index">
          <el-popover ref="popoverRefIdc" v-if="domIdArr.includes(btn.domId) && btn.domId != 'btnApply'" class="print_box" placement="bottom" trigger="click">
            <el-button type="primary" plain slot="reference" :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" class="filter-item" :ref="btn.domId"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
            <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">打印</div>
            <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
          </el-popover>
          <el-button type="primary" plain v-else :size="size" v-bind:key="btn.Id" v-bind:data-remark="btn.remark" :ref="btn.domId" class="filter-item" :loading="loadingBtn" @click="hadnleOnBtnClicked(btn.domId)"><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button>
        </div>
      </div>
      <!-- 主体数据结构 -->
      <div class="app-container">
        <el-row class="bg_white">
          <!-- 主体内容左侧 -->
          <el-col :span="16">
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
                    <el-select :disabled="formFlag" style="width: 90px" v-model="healthcardcode" placeholder="请选择" size="mini" @change="handleSelectHealthcardCheck">
                      <el-option v-for="item in healthcardArr" :key="item.code" :label="item.name" :value="item.code">
                      </el-option>
                    </el-select>
                    <input type="text" class="read_card" style="width: 260px" v-model.lazy="healthCard" ref="read_idcard" v-if="healthcardcode == 'idcard'" @keyup.enter="handleEnterIdcard" :disabled="formFlag" />
                    <input type="text" class="read_card" style="width: 260px" v-model.lazy="healthCard" ref="read_healthcard" v-else :disabled="formFlag" @keyup.enter="handleCardReading" />
                    <el-button type="primary" size="mini" plain @click="handleCardReading" :disabled="formFlag" style="margin-left: 10px">读卡</el-button>
                  </div>
                  <div class="card_operations" style="width: 20%;margin-left: 50px" v-if="message != 'basic' && message != 'other'">
                    <el-button type="primary" size="mini" plain icon="el-icon-success" @click="handleSavePage">保存</el-button>
                    <el-button type="primary" size="mini" plain icon="el-icon-delete" @click="handleDeteleQuestion">删除</el-button>
                  </div>
                </div>
                <!-- 测试问卷 -->
                <div class="questionnairebox" :class="[pageSwitch == '' ? 'medicalhistory' : '']" v-if="message != 'basic' && message != 'other' && message != 'occupational'">
                  <div class="centent" v-for="item in typelist" :key="item.titlecode" v-show="pageSwitch == item.titlecode ? true : false">
                    <!-- 病史采集 -->
                    <div v-if="item.titletype == 'MedicalHistory' ? true : false">
                      <div class="card" v-for="item in medicalHistory" :key="item.syscode">
                        <!-- 标题 -->
                        <div class="title_head">
                          <div class="logo"></div>
                          <span>{{ item.sysname }}</span>
                        </div>
                        <!-- 内容 -->
                        <div class="c_content">
                          <div class="content_item content_items" :class="[
                            val.inputtype == 3 || val.inputtype == 4
                              ? 'content_input'
                              : '',
                          ]" v-for="val in item.historyitems" :key="val.hoycode">
                            <el-checkbox :label="val.hoyname" v-if="[0, 2, 3, 4].indexOf(val.inputtype) !== -1" v-model="val.flag" :true-label="1" :false-label="0">
                              <span>{{ val.hoyname }}</span>
                              <el-input v-model="val.remark" :disabled="val.flag == 0" v-if="[3, 4].indexOf(val.inputtype) !== -1" placeholder="请输入内容" size="mini" clearable></el-input>
                            </el-checkbox>
                            <div class="" v-if="val.inputtype === 1">
                              {{ val.hoyname }}
                              <el-input size="mini" v-model="val.remark" :disabled="val.editstatus == 1" style="width: 150px" clearable></el-input>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!-- 问卷 -->
                    <div v-if="item.titletype == 'Questionnaire' ? true : false">
                      <div class="card" v-if="showMyInput">
                        <!-- 标题 -->
                        <div class="title_head">
                          <div class="logo"></div>
                          <h3>{{ item.titlename }}</h3>
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
                                        <myInput v-if="showMyInput" :suffix="val" :disabled="item.editstatus == 1" :count="value.content.split('|X|').filter((v) => v)
                                            .length
                                            " :value.sync="value.remark" :index="index" :key="val" />
                                      </template>
                                    </span>
                                    <el-radio-group v-model="item.selectvalue" :disabled="item.editstatus == 1">
                                      <el-radio v-if="[0, 3].indexOf(value.inputtype) !== -1" :label="value.selectvalue" style="margin-right: 5px">
                                        <span v-if="value.content.indexOf('|X|') !== -1">
                                          <template v-for="(val, index) in value.content.split(
                                            ','
                                          )">
                                            <myInput :content="val" :disabled="val.editstatus == 1" :draggable="value.selectvalue != item.selectvalue
                                              " :count="value.content.split(',').length" :value.sync="value.remark" :index="index" :key="val" />
                                          </template>
                                        </span>
                                        <span v-else>
                                          {{ value.content }}
                                          <el-input v-if="
                                            [1, 3, 4].indexOf(value.inputtype) !== -1
                                          " size="mini" :disabled="value.content != item.selectvalue" v-model="value.remark" :placeholder="value.content" style="width: 160px"></el-input>
                                        </span>
                                      </el-radio>
                                    </el-radio-group>
                                    <el-checkbox v-if="[2, 4].indexOf(value.inputtype) !== -1" v-model="value.flag" :label="value.content" :true-label="1" :false-label="0">{{ value.content
                                      }}</el-checkbox>
                                  </div>
                                  <el-input v-if="[1, 3, 4].indexOf(item.inputtype) !== -1" size="mini" :disabled="item.editstatus == 1" v-model="item.remark" placeholder="请输入" style="width: 160px"></el-input>
                                </div>
                                <!-- 三级标题questionnaireitems -->
                                <div class="three_topic" v-for="item in item.questionnaireitems" :key="item.itemcode">
                                  <span v-if="item.itemname.indexOf('|X|') !== -1">
                                    <template v-for="(val, index) in item.itemname.split(',')">
                                      <myInput :content="val" :count="item.itemname.split(',').length" :value.sync="item.remark" :index="index" :key="val" />
                                    </template>
                                  </span>
                                  <span v-else>
                                    {{ item.itemname }}
                                  </span>
                                  <!-- 三级选项optionitems -->
                                  <div class="three_content">
                                    <!-- <el-checkbox-group v-model="checkList"> -->
                                    <div class="three_options" v-for="(itemThree, index) in item.optionitems" :key="index">
                                      <span v-if="[-1].indexOf(itemThree.inputtype) !== -1">
                                        <span v-if="itemThree.content.indexOf('|X|') !== -1">
                                          <template v-for="(val, index) in itemThree.content.split(
                                            ','
                                          )">
                                            <myInput :content="val" :count="itemThree.content.split(',').length" :value.sync="itemThree.remark" :index="index" :key="val" />
                                          </template>
                                        </span>
                                      </span>
                                      <el-radio v-model="item.selectvalue" v-if="[0, 3].indexOf(itemThree.inputtype) !== -1" :label="itemThree.content" style="margin-right: 5px">
                                        <span v-if="itemThree.content.indexOf('|X|') !== -1">
                                          <template v-for="(val, index) in itemThree.content.split(
                                            ','
                                          )">
                                            <myInput :content="val" :count="itemThree.content.split(',').length" :value.sync="itemThree.remark" :index="index" :key="val" />
                                          </template>
                                        </span>
                                        <span v-else>
                                          {{ itemThree.content }}
                                        </span>
                                      </el-radio>
                                      <el-checkbox :label="itemThree.hoyname" v-if="[2, 4].indexOf(itemThree.inputtype) !== -1" v-model="itemThree.flag" :true-label="1" :false-label="0">
                                        <span v-if="itemThree.content.indexOf('|X|') !== -1">
                                          <template v-for="(val, index) in itemThree.content.split(
                                            ','
                                          )">
                                            <myInput :content="val" :disabled="itemThree.flag == 0 ? true : false" :count="itemThree.content.split(',').length" :value.sync="itemThree.remark" :index="index" :key="val" />
                                          </template>
                                        </span>
                                        <span v-else>
                                          {{ itemThree.content }}
                                        </span>
                                      </el-checkbox>
                                      <el-input v-if="[1].indexOf(itemThree.inputtype) !== -1" size="mini" v-model="itemThree.remark" style="width: 160px"></el-input>
                                      <el-input v-if="[3, 4].indexOf(itemThree.inputtype) !== -1" :disabled="itemThree.flag == 0" size="mini" v-model="itemThree.remark" style="width: 160px"></el-input>
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
                <!-- 个人信息 -->
                <div v-if="message == 'basic'" class="personal_info">
                  <!-- <div class="head">个人信息</div> -->
                  <!-- 主体表单form -->
                  <div class="info_body">
                    <div class="form_box">
                      <el-form ref="pageform" :disabled="formFlag" :model="personalForm" :rules="rulePersonalForm" label-width="95px">
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="体检号">
                              <el-input disabled v-model="personalForm.regid"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="姓名" :rules="[{ required: !personalForm.name }]">
                              <input type="text" class="read_card" v-model.lazy="personalForm.name" @keyup.enter="handleGetRegisterInfo" />
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" class="mess_select" label="性别" :rules="[{ required: !personalForm.sex }]">
                              <el-select v-model="personalForm.sex" placeholder="">
                                <el-option v-for="item in sexarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label-width="80px" class="age" label="年龄" prop="numberlimit">
                              <el-input type="number" class="age_num" v-model.number="personalForm.age" :min="1" :max="150" @change.native="handleChangeAge"></el-input>
                              <el-select @change="handleSelectChange" v-model="personalForm.ageunit" placeholder="" style="width: 100px">
                                <el-option v-for="item in agearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item class="birthday" size="mini" label="出生日期">
                              <el-date-picker style="width: 100%" v-date-format value-format="yyyy-MM-dd" v-model="personalForm.birthday" type="date" placeholder="选择日期" :editable="true" @change="handleChangeBirthday">
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" class="mess_select" label="婚姻">
                              <el-select @change="handleSelectChange" v-model="personalForm.marriage" placeholder="">
                                <el-option v-for="item in marriagearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" class="mess_select" label="证件类型" prop="idtype">
                              <el-select @change="handleSelectChange" v-model="personalForm.idtype" placeholder="">
                                <el-option v-for="item in idtypeItems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="身份证">
                              <input type="text" class="read_card" v-model.lazy="personalForm.idcard" @keyup.enter="handleEnterIdcardPf" />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" class="mess_select" label="体检类型" prop="checktype">
                              <el-select @change="handleSelectChange" v-model="personalForm.checktype" placeholder="">
                                <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="电话">
                              <el-input v-model="personalForm.telephone"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="12">
                            <el-form-item size="mini" label="住址">
                              <el-input v-model="personalForm.address"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="门诊卡">
                              <el-input v-model="personalForm.healthcard"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="标准金额">
                              <el-input disabled v-model="personalForm.quota"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="领取方式">
                              <el-select v-model="personalForm.reporttake" placeholder="">
                                <el-option v-for="item in reporttakeItems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="部门">
                              <el-input v-model="personalForm.department"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="客户级别">
                              <el-select style="width: 100%" v-model="personalForm.level" placeholder="">
                                <el-option label="普通" :value="0"></el-option>
                                <el-option label="VIP" :value="1"></el-option>
                                <el-option label="保密" :value="2"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="诊断">
                              <el-input v-model="personalForm.registerconclusion"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="检查目的">
                              <el-input v-model="personalForm.checkobjectivecode"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="当日号">
                              <el-input v-model="personalForm.hischargecode"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                    <!-- 照片 -->
                    <div class="photo_box_big">
                      <div class="photo_box">
                        <!--开启摄像头-->
                        <img @click="
                          pageState == 'add' && handleOnTake(),
                          pageState == 'edit' && handleOnTake()
                          " :src="avatarImg" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" class="avatar" alt="摄像头" />
                        <div class="del_btn" @mouseenter="showDelPhotoBtn = true" @mouseleave="showDelPhotoBtn = false" v-show="showDelPhotoBtn">
                          <!-- 裁剪icon -->
                          <i class="el-icon-crop" @click="handleCropPhotoBtn"></i>
                          <!-- 删除icon -->
                          <!-- <i
                          class="el-icon-delete"
                          @click="handleDelPhotoBtn"
                        ></i> -->
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
                      <el-upload style="margin-top: 4px; text-align: center" class="upload-demo" name="files" :show-file-list="false" action :on-change="handleOnPpload" ref="upload" :file-list="[]" :auto-upload="false" accept=".jpg,.jpeg,png">
                        <el-button slot="trigger" size="mini" type="primary">上传</el-button>
                      </el-upload>
                    </div>
                  </div>
                </div>
                <div v-if="message == 'other'" class="other_info">
                  <div class="head">客户信息</div>
                  <el-form ref="form" class="other_info_form" :disabled="formFlag" :model="personalForm" label-width="90px">
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="籍贯">
                          <el-input v-model="personalForm.nativeplace"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="职业">
                          <el-select v-model="personalForm.occupation" @change="handleSelectChange">
                            <el-option v-for="(item, index) in occupationItems" :key="index" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="民族">
                          <el-select v-model="personalForm.nation" @change="handleSelectChange">
                            <el-option v-for="(item, index) in nationItems" :key="index" :label="item.name" :value="item.name"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="邮箱">
                          <el-input v-model="personalForm.email"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="备注">
                          <el-input v-model="personalForm.remark"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="序号">
                          <el-input disabled v-model="personalForm.seqno"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="二级部门">
                          <el-input v-model="personalForm.department2"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="三级部门">
                          <el-input v-model="personalForm.department3"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="四级部门">
                          <el-input v-model="personalForm.department4"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="导诊护士">
                          <el-select v-model="personalForm.guidancecode" @change="handleChangeGuidance">
                            <el-option v-for="item in doctoritems" :key="item.account" :label="item.name" :value="item.account"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="业务员">
                          <el-select v-model="personalForm.salesmancode" @change="handleChangeSalesman">
                            <el-option v-for="item in doctoritems" :key="item.account" :label="item.name" :value="item.account"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="业务来源">
                          <el-input v-model="personalForm.businesssource"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="12">
                        <el-form-item size="mini" label="特殊说明">
                          <el-input v-model="personalForm.remindcontent"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-checkbox class="other_info_check" v-model="personalForm.remindflag" :true-label="1" :false-label="0">体检提醒</el-checkbox>
                      </el-col>
                      <el-col :span="6">
                        <el-checkbox class="other_info_check" v-model="personalForm.notmyself" :true-label="1" :false-label="0">非本人体检</el-checkbox>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="体检人姓名">
                          <el-input v-model="personalForm.actualname"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="性别">
                          <el-select @change="handleSelectChange" v-model="personalForm.actualsex" placeholder="">
                            <el-option v-for="item in sexarr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label-width="55px" class="age" label="年龄" prop="numberlimit">
                          <el-input type="number" class="age_num" v-model.number="personalForm.actualage" :min="1" :max="150" @change.native="handleChangeAge"></el-input>
                          <el-select @change="handleSelectChange" v-model="personalForm.actualageunit" placeholder="" style="width: 100px">
                            <el-option v-for="item in agearr" :key="item.code" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item size="mini" label="档案号">
                          <el-input v-model="personalForm.checkno"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="单位">
                          <el-input v-model="personalForm.inputcompanyname"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="体检日期">
                          <el-input :disabled="pageState !== 'add'" v-model="personalForm.checkdate" @focus="handleFocusCheckDate"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div class="head">职业信息</div>
                  <el-form ref="form" :disabled="formFlag" :model="personalForm" label-width="80px">
                    <el-row>
                      <el-col :span="6">
                        <el-form-item size="mini" label="危害因素">
                          <el-select v-model="personalForm.harmcode" @change="handleSelectChange">
                            <el-option v-for="(item, index) in harmitems" :key="index" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="工种">
                          <el-select v-model="personalForm.worktypecode" @change="handleSelectChange">
                            <el-option v-for="(item, index) in workitems" :key="index" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="总工龄">
                          <el-input v-model="personalForm.workyear"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="接害工龄">
                          <el-input v-model="personalForm.harmwordyear"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :span="6">
                        <el-form-item size="mini" label="行业类型">
                          <el-select v-model="personalForm.industrytypecode" @change="handleSelectChange">
                            <el-option v-for="(item, index) in industryitems" :key="index" :label="item.name" :value="item.code"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="工号">
                          <el-input v-model="personalForm.jobno"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="职务">
                          <el-input v-model="personalForm.occupation"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="车间">
                          <el-input v-model="personalForm.workshop"></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                </div>
                <div v-if="message == 'occupational'" class="occupational_info">
                  <!-- 职业病基本信息 -->
                  <div class="section-card">
                    <div class="section-header">
                      <span class="section-title">职业病基本信息</span>
                    </div>
                    <div class="section-body" style="padding: 8px 10px 0 !important;">
                      <el-form :model="occupationalForm" label-width="75px" size="small">
                        <el-row :gutter="20">
                          <el-col :span="6">
                            <el-form-item label="" label-width="0">
                              <div style="display: flex; align-items: center; gap: 10px;">
                                <el-checkbox v-model="occupationalForm.isReview">是否复检</el-checkbox>
                                <el-input v-model="occupationalForm.isReviewValue" :placeholder="occupationalForm.isReview?'请输入':'不允许修改'" style="flex: 1;" :disabled="!occupationalForm.isReview" clearable></el-input>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="在岗状态">
                              <el-select v-model="occupationalForm.workStatus" clearable placeholder="请选择" style="width: 100%;">
                                <el-option v-for="item in workStatusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="接害日期">
                              <el-date-picker v-model="occupationalForm.contactDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" clearable></el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="监测类型">
                              <el-select v-model="occupationalForm.monitorType" placeholder="请选择" clearable>
                                <el-option v-for="opt in monitorTypeOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row :gutter="20">
                          <el-col :span="6">
                            <el-form-item label="总工龄" label-width="90px">
                              <div class="unit-input-number">
                                <el-input-number v-model="occupationalForm.totalWorkYears" :min="0" :max="100" controls-position="right">
                                </el-input-number>
                                <el-dropdown class="unit-dropdown" @command="(cmd) => handleUnitChange('totalWorkYearsUnit', cmd)">
                                  <span class="unit-text">
                                    {{ occupationalForm.totalWorkYearsUnit }}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="年">年</el-dropdown-item>
                                    <el-dropdown-item command="月">月</el-dropdown-item>
                                    <el-dropdown-item command="日">日</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="接害工龄">
                              <div class="unit-input-number">
                                <el-input-number v-model="occupationalForm.harmWorkYears" :min="0" :max="100" controls-position="right">
                                </el-input-number>
                                <el-dropdown class="unit-dropdown" @command="(cmd) => handleUnitChange('harmWorkYearsUnit', cmd)">
                                  <span class="unit-text">
                                    {{ occupationalForm.harmWorkYearsUnit }}<i class="el-icon-arrow-down el-icon--right"></i>
                                  </span>
                                  <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="年">年</el-dropdown-item>
                                    <el-dropdown-item command="月">月</el-dropdown-item>
                                    <el-dropdown-item command="日">日</el-dropdown-item>
                                  </el-dropdown-menu>
                                </el-dropdown>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item label="工种代码">
                              <el-select v-model="occupationalForm.jobCode" placeholder="请输入关键字搜索或滚动浏览" clearable filterable remote reserve-keyword :remote-method="filterJobCode" :loading="jobCodeLoading" style="width: 100%;" popper-class="job-code-select-dropdown" @visible-change="handleJobCodeVisibleChange" @change="handleJobCodeChange">
                                <el-option v-for="(item, index) in jobCodeFilteredOptions" :key="item.code + '-' + index" :label="item.code + ' - ' + item.name" :value="item.code">
                                </el-option>
                                <div v-if="jobCodePagination.hasMore && !jobCodeSearchQuery" class="load-more-wrapper">
                                  <div class="load-more-btn" @click.stop="loadMoreJobCode">
                                    <i class="el-icon-loading" v-if="jobCodeLoadingMore"></i>
                                    <template v-else>
                                      <i class="el-icon-arrow-down"></i>
                                      <span class="btn-text">加载更多</span>
                                      <span class="btn-count">{{ jobCodeFilteredOptions.length }} / {{ jobCodeOptions.length }}</span>
                                    </template>
                                  </div>
                                </div>
                                <div v-else-if="!jobCodePagination.hasMore && jobCodeOptions.length > 0" class="no-more-wrapper">
                                  <div class="no-more-tip">
                                    <i class="el-icon-check"></i>
                                    <span>已加载全部 {{ jobCodeOptions.length }} 条</span>
                                  </div>
                                </div>
                              </el-select>
                            </el-form-item>
                          </el-col>

                        </el-row>
                      </el-form>
                    </div>
                  </div>

                  <!-- 接触危害因素集 -->
                  <div class="section-card">
                    <div class="section-header">
                      <span class="section-title">接触危害因素集</span>
                      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addHazardFactor">新增</el-button>
                    </div>
                    <div class="section-body hazard-factor-body">
                      <el-table :data="hazardFactorList" border size="small" class="modern-table">
                        <el-table-column prop="factorName" min-width="220">
                          <template slot="header">
                            <span class="required-label">危害因素</span>
                          </template>
                          <template slot-scope="scope">
                            <el-cascader v-model="scope.row.factorNamePath" :options="hazardFactorCascaderOptions" :props="{ checkStrictly: false, emitPath: false }" placeholder="请选择" size="mini" clearable filterable style="width: 100%;" @change="(val) => handleHazardFactorChange(val, scope.row)">
                            </el-cascader>
                          </template>
                        </el-table-column>
                        <el-table-column prop="otherHazard" label="其它危害" min-width="200">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.otherHazard" placeholder="其它需要填写内容" size="mini" clearable :disabled="!scope.row.isOtherHazard" @change="(val) => handleOtherHazardChange(val, scope.row)">
                            </el-input>
                          </template>
                        </el-table-column>
                        <el-table-column prop="isExamFactor" label="设为体检危害因素" width="140" align="center">
                          <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.isExamFactor"></el-checkbox>
                          </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100" align="center" fixed="right">
                          <template slot-scope="scope">
                            <el-button type="danger" size="mini" plain icon="el-icon-delete" @click="deleteHazardFactor(scope.$index)">删除</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>

                  <!-- 职业史集 -->
                  <div class="section-card">
                    <div class="section-header">
                      <span class="section-title">职业史集</span>
                      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addWorkHistory">新增</el-button>
                    </div>
                    <div class="section-body scrollable-body">
                      <div v-if="workHistoryList.length === 0" class="empty-state">
                        <i class="el-icon-document"></i>
                        <span>暂无职业史记录，请点击右上角"新增"按钮添加</span>
                      </div>
                      <div v-for="(item, index) in workHistoryList" :key="index" class="history-item">
                        <el-form :model="item" label-width="100px" size="small">
                          <el-row :gutter="20">
                            <el-col :span="9">
                              <el-form-item label-width="80px">
                                <span slot="label" class="required-label">起止日期</span>
                                <el-date-picker v-model="item.startEndDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="(val) => handleWorkDateChange(val, item)" style="width: 100%;" clearable></el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item>
                                <span slot="label" class="required-label">类型编码</span>
                                <el-select v-model="item.typeCode" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option v-for="opt in typeCodeOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7" class="delete-btn-col">
                              <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="deleteWorkHistory(index)"></el-button>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="9">
                              <el-form-item label-width="80px">
                                <span slot="label" class="required-label">检查日期</span>
                                <el-date-picker v-model="item.checkDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" clearable></el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label-width="110px">
                                <span slot="label" class="required-label">工作单位名称</span>
                                <el-input v-model="item.companyName" placeholder="请输入" clearable></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item label-width="80px">
                                <span slot="label" class="required-label">检查医生</span>
                                <el-input v-model="item.checkDoctor" placeholder="请输入" clearable></el-input>
                              </el-form-item>
                            </el-col>

                          </el-row>
                        </el-form>
                      </div>
                    </div>
                  </div>

                  <!-- 既往病史集 -->
                  <div class="section-card">
                    <div class="section-header">
                      <span class="section-title">既往病史集</span>
                      <el-button type="primary" size="mini" icon="el-icon-plus" @click="addMedicalHistory">新增</el-button>
                    </div>
                    <div class="section-body scrollable-body">
                      <div v-if="medicalHistoryList.length === 0" class="empty-state">
                        <i class="el-icon-document"></i>
                        <span>暂无既往病史记录，请点击右上角"新增"按钮添加</span>
                      </div>
                      <div v-for="(item, index) in medicalHistoryList" :key="index" class="history-item">
                        <el-form :model="item" label-width="100px" size="small">
                          <el-row :gutter="20">
                            <el-col :span="9">
                              <el-form-item label-width="80px">
                                <span slot="label" class="required-label">疾病名称</span>
                                <el-input v-model="item.diseaseName" placeholder="请输入" clearable></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="转归">
                                <el-select v-model="item.outcome" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option v-for="opt in outcomeOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>

                            <el-col :span="7" class="delete-btn-col">
                              <el-button type="danger" size="mini" circle icon="el-icon-delete" @click="deleteMedicalHistory(index)"></el-button>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="9">
                              <el-form-item label="诊断日期" label-width="80px">
                                <el-date-picker v-model="item.diagnosisDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="width: 100%;" clearable></el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="诊断单位">
                                <el-input v-model="item.diagnosisUnit" placeholder="请输入" clearable></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item label="病史描述">
                                <el-input v-model="item.description" placeholder="请输入" clearable></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-form>
                      </div>
                    </div>
                  </div>

                  <!-- 问卷模块 -->
                  <div class="section-card">
                    <div class="section-header">
                      <span class="section-title">问卷</span>
                    </div>
                    <div class="section-body questionnaire-body">
                      <el-form :model="questionnaireForm" label-width="130px" size="small">
                        <!-- 月经史 -->
                        <div class="form-group">
                          <div class="group-title"><i class="el-icon-female"></i> 月经史</div>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="月经史-初潮年龄">
                                <div class="unit-input-number">
                                  <el-input-number v-model="questionnaireForm.menarcheAge" :min="0" :max="100" controls-position="right"></el-input-number>
                                  <el-dropdown class="unit-dropdown" @command="(cmd) => handleQuestionnaireUnitChange('menarcheAgeUnit', cmd)">
                                    <span class="unit-text">
                                      {{ questionnaireForm.menarcheAgeUnit || '年' }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command="年">年</el-dropdown-item>
                                      <el-dropdown-item command="月">月</el-dropdown-item>
                                      <el-dropdown-item command="日">日</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="月经史-经期">
                                <el-input-number v-model="questionnaireForm.menstrualPeriod" :min="0" :max="30" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="月经史-周期">
                                <el-input-number v-model="questionnaireForm.menstrualCycle" :min="0" :max="60" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="月经史-停经年龄">
                                <div class="unit-input-number">
                                  <el-input-number v-model="questionnaireForm.menopauseAge" :min="0" :max="100" controls-position="right"></el-input-number>
                                  <el-dropdown class="unit-dropdown" @command="(cmd) => handleQuestionnaireUnitChange('menopauseAgeUnit', cmd)">
                                    <span class="unit-text">
                                      {{ questionnaireForm.menopauseAgeUnit || '年' }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command="年">年</el-dropdown-item>
                                      <el-dropdown-item command="月">月</el-dropdown-item>
                                      <el-dropdown-item command="日">日</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="月经史-是否经期">
                                <el-select v-model="questionnaireForm.isMenstrual" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option label="是" value="1"></el-option>
                                  <el-option label="否" value="0"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>

                        <!-- 生育史 -->
                        <div class="form-group">
                          <div class="group-title"><i class="el-icon-user-solid"></i> 生育史</div>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="生育史-子女人数">
                                <el-input-number v-model="questionnaireForm.childrenCount" :min="0" :max="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="生育史-流产次数">
                                <el-input-number v-model="questionnaireForm.abortionCount" :min="0" :max="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="生育史-早产次数">
                                <el-input-number v-model="questionnaireForm.prematureCount" :min="0" :max="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="生育史-死产次数">
                                <el-input-number v-model="questionnaireForm.stillbirthCount" :min="0" :max="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="生育史-畸胎次数">
                                <el-input-number v-model="questionnaireForm.teratismCount" :min="0" :max="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="生育史-子女健康状况" label-width="150px">
                                <el-select v-model="questionnaireForm.childrenHealth" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option label="全部健康" value="1"></el-option>
                                  <el-option label="大部分健康" value="2"></el-option>
                                  <el-option label="有轻微疾病" value="3"></el-option>
                                  <el-option label="有慢性疾病" value="4"></el-option>
                                  <el-option label="有遗传疾病" value="5"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>

                        <!-- 吸烟饮酒 -->
                        <div class="form-group">
                          <div class="group-title"><i class="el-icon-smoking"></i> 吸烟饮酒</div>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="吸烟情况">
                                <el-select v-model="questionnaireForm.smokingStatus" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option v-for="item in smokingStatusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="吸烟史">
                                <div class="unit-input-number">
                                  <el-input-number v-model="questionnaireForm.smokingHistory" :min="0" :max="100" controls-position="right"></el-input-number>
                                  <el-dropdown class="unit-dropdown" @command="(cmd) => handleQuestionnaireUnitChange('smokingUnit', cmd)">
                                    <span class="unit-text">
                                      {{ questionnaireForm.smokingUnit || '年' }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command="年">年</el-dropdown-item>
                                      <el-dropdown-item command="月">月</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="平均每天吸烟量-支" label-width="140px">
                                <el-input-number v-model="questionnaireForm.dailySmoking" :min="0" :max="100" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="饮酒情况">
                                <el-select v-model="questionnaireForm.drinkingStatus" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option v-for="opt in drinkingStatusOptions" :key="opt.value" :label="opt.label" :value="opt.value"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="饮酒史">
                                <div class="unit-input-number">
                                  <el-input-number v-model="questionnaireForm.drinkingHistory" :min="0" :max="100" controls-position="right"></el-input-number>
                                  <el-dropdown class="unit-dropdown" @command="(cmd) => handleQuestionnaireUnitChange('drinkingUnit', cmd)">
                                    <span class="unit-text">
                                      {{ questionnaireForm.drinkingUnit || '年' }}<i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                      <el-dropdown-item command="年">年</el-dropdown-item>
                                      <el-dropdown-item command="月">月</el-dropdown-item>
                                    </el-dropdown-menu>
                                  </el-dropdown>
                                </div>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="饮酒每天毫升数" label-width="140px">
                                <el-input-number v-model="questionnaireForm.dailyDrinking" :min="0" :max="5000" :step="50" controls-position="right" style="width: 100%;"></el-input-number>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>

                        <!-- 婚姻配偶 -->
                        <div class="form-group">
                          <div class="group-title"><i class="el-icon-s-custom"></i> 婚姻配偶</div>
                          <el-row :gutter="20">
                            <el-col :span="8">
                              <el-form-item label="婚姻史-结婚日期">
                                <el-date-picker v-model="questionnaireForm.marriageDate" type="date" placeholder="选择日期" style="width: 100%;" clearable></el-date-picker>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="配偶接触放射线情况" label-width="140px">
                                <el-select v-model="questionnaireForm.spouseRadiation" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option label="无接触" value="0"></el-option>
                                  <el-option label="偶尔接触" value="1"></el-option>
                                  <el-option label="经常接触" value="2"></el-option>
                                  <el-option label="职业接触" value="3"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="8">
                              <el-form-item label="配偶职业及健康状况" label-width="140px">
                                <el-select v-model="questionnaireForm.spouseOccupation" placeholder="请选择" clearable style="width: 100%;">
                                  <el-option label="健康-无业" value="1"></el-option>
                                  <el-option label="健康-上班族" value="2"></el-option>
                                  <el-option label="健康-自由职业" value="3"></el-option>
                                  <el-option label="亚健康-上班族" value="4"></el-option>
                                  <el-option label="患有慢性疾病" value="5"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>

                        <!-- 病史 -->
                        <div class="form-group">
                          <div class="group-title"><i class="el-icon-document"></i> 病史</div>
                          <el-row :gutter="20">
                            <el-col :span="24">
                              <el-form-item label="家族史">
                                <el-input v-model="questionnaireForm.familyHistory" type="textarea" :rows="2" placeholder="请输入家族史" clearable></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="24">
                              <el-form-item label="个人史">
                                <el-input v-model="questionnaireForm.personalHistory" type="textarea" :rows="2" placeholder="请输入个人史" clearable></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                          <el-row :gutter="20">
                            <el-col :span="24">
                              <el-form-item label="其它情况">
                                <el-input v-model="questionnaireForm.otherSituation" type="textarea" :rows="2" placeholder="请输入其它情况" clearable></el-input>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </div>
                      </el-form>
                    </div>
                  </div>

                </div>
              </div>

              <!-- 团检信息 -->
              <div v-if="message === 'basic'" class="group_body" style="
                  width: 100%;
                  min-height: 300px;
                  background-color: #fff;
                  margin-top: 10px;
                  border-radius: 5px;
                ">
                <div class="team_inspect">
                  <div>
                    <div class="message-title">
                      <div class="headss">
                        <div class="heads-in"></div>
                        <div>体检项目</div>
                      </div>
                      <div class="message_content" style="width: 100%">
                        <el-form ref="form" :disabled="groupdis" :model="personalForm" label-width="80px">
                          <el-row>
                            <el-col :span="10">
                              <el-form-item class="tuanjian" size="mini" label="团检名称">
                                <el-select filterable clearable @change="handleSelectComany" v-model="personalForm.companycode" placeholder="">
                                  <el-option v-for="item in companyitems" :key="item.code" :label="`${item.code}　${item.name}`" :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item size="mini" label="团检批次">
                                <el-select @change="handleSelectBatch" style="width: 100%" v-model="personalForm.batch" placeholder="">
                                  <el-option v-for="item in batchitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item size="mini" label="团检分组">
                                <el-select @change="handleCheckGroup" style="width: 100%" v-model="personalForm.groupcode" placeholder="">
                                  <el-option v-for="item in groupitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-form>
                        <!-- 体检项目 -->
                      </div>
                    </div>
                  </div>
                </div>
                <div class="checkup_project">
                  <div class="checkup_body">
                    <div class="state_group">
                      <div class="state_item">
                        <div class="title1">总数</div>
                        <div class="state1">{{ groupTableData.length }}</div>
                      </div>
                      <div class="state_item">
                        <div class="title2">费用原价</div>
                        <div class="state2">
                          {{ groupPriceTotal.toFixed(2) }}
                        </div>
                      </div>
                      <div class="state_item">
                        <div class="title3">折后价</div>
                        <div class="state3">
                          {{ afterFoldingPrice.toFixed(2) }}
                        </div>
                      </div>
                      <div class="state_item">
                        <div class="title4">实际缴费</div>
                        <div class="state4">
                          {{ this.personalForm.actPrice || groupPriceEnd.toFixed(2) }}
                        </div>
                      </div>
                    </div>
                    <div class="btn_state_gro">
                      <div class="state-add">
                        <!-- :disabled="formFlag" -->
                        <el-button type="primary" :disabled="!personalForm.companycode &&
                          !personalForm.batch &&
                          !personalForm.groupcode
                          " size="mini" @click="handleOptionalItem">自选项目</el-button>
                        <el-button type="primary" size="mini" @click="handleClearCombine">一键删除</el-button>
                        <el-link type="primary" style="margin-right: 10px" @click="handleTodayCombinedBilling">今日组合开单</el-link>
                        <el-button type="primary" size="mini" @click="handleSelectSetMeal">开单套餐</el-button>
                        <el-button type="primary" size="mini" @click="handleSelectCmbine">开单组合</el-button>
                      </div>
                      <el-button class="discount" size="mini" type="primary" @click="handleSetDiscount">折扣</el-button>
                      <el-dropdown trigger="click" @command="handleSelectProject">
                        <el-button type="primary" class="auxiliary">
                          辅助功能<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="历史项目">历史项目</el-dropdown-item>
                          <el-dropdown-item command="智能推荐">智能推荐</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                  </div>
                  <!-- 体检项目表格 -->
                  <EasyTable :loading="loading" class="group_table" ref="multipleTable" height="100%" row-id="groupid" :border-around="false" :border-x="false" :border-y="false" :data="groupTableData" :tableOptions="tableOptions" :radio-config="{ fetch: true, rowClick: true }" @selection-change="handleSelectItemList" @row-click="handleChecked" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '0' }" :cell-style="{ padding: '0' }" />
                </div>
              </div>
            </div>
          </el-col>
          <!-- 主体内容右侧 -->
          <el-col :span="8">
            <div class="content_right">
              <!-- <div class="card_operation-id">
                <div class="card_operations">
                  <el-popover ref="popoverRefIdc" placement="bottom-start" trigger="click">
                    <div class="content">
                      <div class="content_item" v-for="item in healthcardArr" :key="item.code" @click="handleSelectHealthcardCheck(item)">
                        {{ item.name }}
                      </div>
                    </div>
                    <el-button type="primary" style="width:80px" size="mini" slot="reference">{{condition}}</el-button>
                    <el-button type="primary" plain size="mini" slot="reference" style="margin-right: 10px">{{ healthcardCheck }}</el-button>
                  </el-popover>
                  <el-input v-model="healthCard" size="mini" placeholder="" :disabled="formFlag"></el-input>
                  <el-button type="primary" size="mini" plain @click="handleCardReading" :disabled="formFlag" style="margin-left: 10px">读卡</el-button>
                  <el-button type="primary" size="mini" plain icon="el-icon-edit" @click="handleCardReading" :disabled="formFlag" style="margin-left: 10px">编辑</el-button>
                </div>
              </div> -->
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
                      <el-input size="mini" clearable ref="inputWorkFlage" @clear="handleInputWork" @keyup.enter.native="handleInputWork" v-model="checkupWork" placeholder="请输入内容"></el-input>
                      <el-button type="primary" size="mini" plain @click="handleInputWork" icon="el-icon-search">搜索</el-button>
                      <el-button type="primary" size="mini" plain @click="handleSearchCardReading" icon="el-icon-search">读卡</el-button>
                    </div>
                    <div class="checkup_date">
                      <div class="date_box">
                        <div class="date_title">日期范围</div>
                        <el-date-picker @change="handleChangeDate" size="mini" v-model="conditionDate" type="daterange" align="right" unlink-panels range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                        </el-date-picker>
                      </div>
                      <div class="unit_box">
                        <div class="unit_title">单位</div>
                        <el-select filterable size="mini" clearable @change="handleCompanycodeChange" v-model="companycode" placeholder="">
                          <el-option v-for="item in companycodeItems" :key="item.companycode" :label="item.companyname" :value="item.companycode"></el-option>
                        </el-select>
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
                    <el-button class="checkin" type="primary" size="mini" plain style="height: 28px; margin-right: 10px" @click="(setmealRadio = ''), handleGetPersonalRegisterList()">刷新</el-button>
                    <el-button type="primary" style="margin-left: 20px" size="mini" plain @click="handleCopyCheckIn('all')">复制登记</el-button>
                    <el-button type="primary" size="mini" plain @click="handleCopyCheckIn('project')" style="margin-left: 10px">复制项目</el-button>
                    <!-- <el-switch v-model="isGuideSingle" active-text="打印指引单">
                    </el-switch> -->
                  </div>
                  <!-- 登记人员列表 -->
                  <div class="condition_table" @mouseleave="handlemouseLeaveReset">
                    <EasyTable row-id="regid" :loading="loadingCondition" class="condition_table_es" height="100%" :data="conditionData" :tableOptions="conditionOptions" :radio-config="{
                        selectedVal: setmealRadio,
                        rowClick: true,
                      }" @checked-change="handleCheckCondition" @cell-mouse-enter="handleCheckConditionEnter" @cell-mouse-leave="handleCheckConditionLeave" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
                    <el-pagination :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 50, 100, 200, 300]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
                    </el-pagination>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 选择套餐分组弹框 -->
      <SetMealOnly v-if="showSetMealDialog" :sex="personalForm.sex" :flag="pageState" :groupTableData="groupTableData" @submit="handleProjectSubmit" @close="showSetMealDialog = false" />
      <!-- 选择组合分组弹框 -->
      <CmbineOnly v-if="showCmbine" :sex="personalForm.sex" :flag="pageState" :CmbineOnlyloading="CmbineOnlyloading" :groupTableData="groupTableData" @submit="handleProjectSubmit" @close="showCmbine = false" />
      <!-- 收费明细弹出层 -->
      <el-dialog class="dialog-mini charge_details" width="58%" top="4%" :close-on-click-modal="false" title="收费列表" :visible.sync="showChargeDetails" @close="handleCloseChargeDetails">
        <div>
          项目总数：{{ chargeDataList.length }}个
          <span style="margin-left: 20px">未交费项目：{{ noCharge.length }}个</span>
        </div>
        <div class="table_box">
          <EasyTable :loading="loadingGroup" class="table_item" height="100%" row-id="combinecode" :data="chargeDataList" :tableOptions="chargeGroupOptions" :checkbox-config="{ rowClick: true, fetchVal: true }" @selected-change="handleSelectSharge" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          <div class="charge_form">
            <div class="form_body">
              <div class="form_body_item">
                <span class="title">卡号：</span>
                <span class="value blue">
                  <el-input placeholder="请输入内容" size="mini" v-model="cardAccount" clearable>
                  </el-input>
                </span>
              </div>
              <div class="form_body_item">
                <span class="title">密码：</span>
                <span class="value blue">
                  <el-input placeholder="请输入内容" size="mini" show-password v-model="cardPassword" clearable>
                  </el-input>
                </span>
              </div>
              <div class="form_body_item">
                <span class="title">卡余额：</span>
                <span class="value blue" v-if="cardDetail">{{
                  cardDetail.remainingamount
                }}</span>
                <span class="value blue" v-else></span>
              </div>
              <div class="form_body_item">
                <span class="title"></span>
                <span class="value blue">
                  <el-button size="mini" type="primary" @click="handleCardDetailDetail">查询</el-button>
                </span>
              </div>
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
                  personalForm.sex == 0 ? "未知" : personalForm.sex == 1 ? "男" : "女"
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
              <!-- <div class="form_body_item">
                <span class="title">折扣：</span>
                <span class="value red">{{ chargeItems.discount * 100 }}%</span>
              </div> -->
              <div class="form_body_item">
                <span class="title">折后价：</span>
                <span class="value red">{{ chargeItems.discounttotal }}</span>
              </div>
              <div class="form_body_item">
                <span class="title">实际缴费：</span>
                <span class="value red" v-if="chargeItems.chargeflag == 1">{{
                  chargeItems.discounttotal
                }}</span>
                <span class="value red" v-else>0</span>
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
              <el-button size="mini" type="warning" @click="handleSetChargeCancel">申请退费</el-button>
              <el-button size="mini" type="danger" @click="handleCloseChargeDetails">取消</el-button>
              <el-button size="mini" type="primary" @click="handleRefundForm">打印退费单</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 签到流程 -->
      <FlowPath v-if="showFlowPath" :regid="flowPathRegid" @close="handleCloseFlowPath" />
      <!-- 客户历史体检记录弹框 -->
      <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" title="历史体检信息" :visible.sync="historyShow" @close="handleCloseHistory">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" row-id="groupid" :data="historyData" :tableOptions="historyOptions" :radio-config="{ fetch: true, rowClick: true }" @row-dblclick="handleHistoryCheck" @cell-click="handleHistoryCopy" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 门诊档案弹框 -->
      <el-dialog class="dialog-mini history_pson" width="55%" height="100%" top="10%" :close-on-click-modal="false" :show-close="true" title="门诊档案信息" :visible.sync="showOutpatient" @close="handleCloseOutpatient">
        <div class="table_box">
          <EasyTable class="table_item" height="100%" row-id="groupid" :data="outpatientData" :tableOptions="outpatientOptions" :radio-config="{ fetch: true, rowClick: true }" @row-dblclick="handleOutpatientCheck" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
        </div>
        <!-- <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseOutpatient"
            >关 闭</el-button
          >
        </div> -->
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
      <el-dialog class="dialog-mini intellect" width="45%" height="60%" top="10%" :close-on-click-modal="false" title="智能推荐" :visible.sync="intellect" @close="handleCloseIntellect" :show-close="false">
        <div class="big_box">
          <div class="table_box">
            <EasyTable class="table_item" height="100%" :data="intellectData" :tableOptions="intellectOptions" :radio-config="{ rowClick: true }" @checked-change="handleSelectIntellect" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          </div>
          <div class="table_box">
            <EasyTable class="table_item" height="100%" :data="intellectDataCb" :tableOptions="intellectOptionscb" :checkbox-config="{ rowClick: true }" @selected-change="handleSelectIntellectcb" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :row-style="{ height: '32px' }" :cell-style="{ padding: '0' }" />
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleSubmitIntellect">确 认</el-button>
          <el-button size="mini" @click="handleCloseIntellect">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 折扣 -->
      <el-dialog class="dialog-mini discount_dialog" width="20%" top="20%" :close-on-click-modal="false" title="项目折扣" :visible.sync="discount" @close="handleCloseDiscount">
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
      <!-- 预约日历 -->
      <Calendar v-if="showCalendar" :makeNumber="1" :makeFlag="makeFlag" @submit="handleSaveAppointment" @close="handleCloseCalendar" />
      <!-- 检索组件 -->
      <SearchDialog v-if="showSearch" :showSearch="showSearch" @close="handleCloseSearch" @submit="handleSearchSubmit" />
      <!-- 打印申请单 -->
      <el-dialog title="打印申请单" :visible.sync="showApplyPrint" width="50%">
        <el-tree :data="applyPrintTree" :props="applyPrintProps" show-checkbox default-expand-all @check="handleCheckChangeApplyPrint">
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
      <!-- 裁剪弹框 -->
      <el-dialog title="图片剪裁" :visible.sync="showCropperDialog" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body width="1000px" class="cropper_dia">
        <div class="box_content">
          <div class="crop_p">
            <vueCropper ref="cropper" :img="option.img" :autoCrop="option.autoCrop" :auto-crop-width="option.autoCropWidth" :auto-crop-height="option.autoCropHeight" :center-box="option.centerBox"></vueCropper>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="handleGetCropData()">截图</el-button>
            <el-button type="primary" icon="el-icon-refresh-left" size="mini" @click="handleRotateLeft()"></el-button>
            <el-button type="primary" icon="el-icon-refresh-right" size="mini" @click="handleRotateRight()"></el-button>
            <el-button type="primary" size="mini" @click="handleRefresh()">重置</el-button>
            <el-button type="primary" size="mini" @click="handleConfirmCrop()">完成</el-button>
            <el-button type="primary" size="mini" @click="handleCloseCrop()">取消</el-button>
          </div>
          <img class="pic_p" :src="imgUrl" alt="" />
        </div>
      </el-dialog>
      <!-- 裁剪弹框 -->
      <el-dialog title="自选项目" :visible.sync="OptionalItemDialogFlag" :close-on-press-escape="false" :close-on-click-modal="false" append-to-body width="500px" class="cropper_dia">
        <div v-for="(item, i) in OptionalItemData" :key="i">
          <div class="title">
            <span>{{ item.deptname }}</span>
            <span class="subclose" @click="handleOptionalSelectAll(item)">全选</span>
            <span class="subclose" @click="handleOptionalCloseAll(item)"> 取消全选</span>
          </div>
          <el-checkbox-group v-model="item.checkList" class="optinalClass">
            <el-checkbox @change="handleOptionalSelect($event, item)" v-for="(k, ind) in item.combinitems" :key="ind" :label="k.combinecode" :value="k.combinecode">{{ k.combinename }}</el-checkbox>
          </el-checkbox-group>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleOptionalItemSubmitCopy">确 定</el-button>
          <el-button size="mini" @click="handleOptionalItemClose">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 点击完成弹出提示弹框 - 分诊 -->
      <el-dialog title="" class="tefinish_dia" :visible.sync="showFinish" width="34%" :show-close="false" :close-on-click-modal="false">
        <span>
          <div class="tetop_userinfo">
            <div class="tetop_item">姓名：{{ personalForm.name }}</div>
            <div class="tetop_item">性别：{{ personalForm.sex == 0 ? '未知' : personalForm.sex == 1 ? '男' : personalForm.sex
              == 2 ?
              '女' : '' }}
            </div>
            <div class="tetop_item">体检号：{{ personalForm.regid }}</div>
          </div>
          <div class="dtmessage">
            <div class="dtm_item">
              <div class="sgb">导诊信息</div>
            </div>
            <div class="dtm_item" v-for="item in finishTriag" :key="item">
              <div class="sgb">{{ item }}</div>
            </div>
          </div>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCloseShowFinish">确 认</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 调查问卷 -->
    <transition name="fade" mode="in-out">
      <Questionnaire :regid="questionnaireId" v-if="showQuestionnaire" @close="handleCloseQuestionnaire" />
    </transition>
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
  getPersonalDetail,
  setSubmit,
  setSubmitNew,
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
  getCombineStatic,
  setDeleteCombine,
  getIdCardInfo,
  setCollectChargeInfoForNotSave,
  setUpdatePatientInfo,
  updateCombine,
  clearCombine,
  CollectChargeInfoForNotSaveByFix,
  CardDetailDetail,
  RuleCombineList,
  CheckChooseRule,
  CheckPreSaveChooseRule,
  LastProcess,
  GetOccupationOther,
  SaveOccupation,
} from "@/api/personalregister.js";
// 引入页面接口
import { setSignIn } from "@/api/sign.js";
import { setFilesUpload } from "@/api/customerresult.js"; // 引入页面接口
import { filterSubmit } from "@/utils/common.js"; // 引入页面接口
import { printBase64 } from "@/api/printreport.js";
import Project from "./components/project.vue";
import Calendar from "@/components/calendar"; // 预约日历组件
import SearchDialog from "@/components/searchDialog";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
// import SetMealOnly from "@/components/SetMealDialog/setmeal_youhua.vue"; // 套餐独立弹框
import SetMealOnly from "@/components/SetMealDialog/setmeal_youhuaduoxuan.vue"; // 套餐独立弹框-多选
import CmbineOnly from "@/components/SetMealDialog/combine_youhua.vue"; // 组合独立弹框 - 速度优化
import HealthView from "@/components/healthView/index.vue"; // 健康视图
import { setAppointmentSave } from "@/api/appointment.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { setFilesDelete } from "@/api/unitregistration.js";
import { getDicSetmealList } from "@/api/setMealDialog.js";
import { LoadSetmealCombineList } from "@/api/setMealDialog.js";
import * as company_archives from "@/api/company_archives";
import * as users from "@/api/users";
// 引入裁剪组件
import { VueCropper } from "vue-cropper";
export default {
  name: "personalregister",

  components: {
    Sticky,
    permissionBtn,
    Project,
    FlowPath,
    Calendar,
    SearchDialog,
    Questionnaire,
    HealthView,
    myInput,
    VueCropper,
    SetMealOnly,
    CmbineOnly,
  },

  data() {
    var checkAge = (rule, value, callback) => {
      setTimeout(() => {
        if (!/(^[1-9]\d*$)/.test(this.personalForm.age)) {
          callback(new Error("请输入数字值"));
        } else {
          if (this.personalForm.age > 150) {
            this.personalForm.age = 0;
            callback(new Error("超出年龄限制范围"));
          } else {
            callback();
          }
        }
      }, 1000);
    };
    return {
      chooseList: [],
      cardAccount: "",
      cardPassword: "",
      cardDetail: null,
      discountProperty: [],
      lodop: "",
      companycode: "",
      companycodeItems: [],
      showSearch: false, // 显示检索组件
      // 默认选择第一个
      radio: "全部",
      showSubmitCamera: false, // 显示提交按钮
      dialogFlag: "", // 弹框标识
      checkGroup: {}, // 当前选中分组
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
          titlename: "其他信息",
          titletype: "other",
        },
        {
          titlecode: "occupational",
          titlename: "职业病信息",
          titletype: "occupational",
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
      healthCard: "", // 健康卡
      formFlag: true, // 控制表单是否允许编辑
      groupdis: true, // 控制团检表单是否允许编辑
      // 职业病信息表单数据
      occupationalForm: {
        regid: "",
        arsid: "",
        sourceregid: "",
        isReview: false,
        isReviewValue: "",
        workStatus: "",
        contactDate: "",
        monitorType: "",
        totalWorkYears: 0,
        totalWorkYearsUnit: "年",
        harmWorkYears: 0,
        harmWorkYearsUnit: "年",
        jobCode: "",
        jobName: "",
      },
      // 在岗状态选项列表
      workStatusOptions: [],
      // 工种代码选项列表
      jobCodeOptions: [],
      // 工种代码过滤后的选项列表
      jobCodeFilteredOptions: [],
      // 工种代码加载状态
      jobCodeLoading: false,
      // 工种代码分页参数
      jobCodePagination: {
        page: 1,
        pageSize: 100,
        total: 0,
        hasMore: true,
      },
      // 工种代码搜索关键字
      jobCodeSearchQuery: "",
      // 工种代码加载更多状态
      jobCodeLoadingMore: false,
      // 危害因素选项列表
      hazardFactorOptions: [],
      // 危害因素级联选项列表
      hazardFactorCascaderOptions: [],
      // 吸烟情况下拉选项列表
      smokingStatusOptions: [],
      // 是否已加载职业病信息数据
      isOccupationalDataLoaded: false,
      // 职业病详情数据（用于保存时获取regid和arsid）
      occupationalDetail: null,
      // 接触危害因素集
      hazardFactorList: [
        {
          factorCode: "",
          factorName: "",
          otherHazard: "",
          isExamFactor: false,
          isOtherHazard: false,
        },
      ],
      // 职业史集
      workHistoryList: [
        {
          startDate: "",
          endDate: "",
          typeCode: "",
          companyName: "",
          checkDate: "",
          checkDoctor: "",
        },
      ],
      // 既往病史集
      medicalHistoryList: [
        {
          diseaseName: "",
          outcome: "",
          diagnosisUnit: "",
          diagnosisDate: "",
          description: "",
        },
      ],
      // 问卷表单数据
      questionnaireForm: {
        // 月经史
        menarcheAge: 0,
        menarcheAgeUnit: "年",
        menstrualPeriod: "",
        menstrualCycle: "",
        menopauseAge: 0,
        menopauseAgeUnit: "年",
        isMenstrual: "",
        // 生育史
        childrenCount: "",
        abortionCount: "",
        prematureCount: "",
        stillbirthCount: "",
        teratismCount: "",
        childrenHealth: "",
        // 婚姻史
        marriageDate: "",
        // 配偶情况
        spouseRadiation: "",
        spouseOccupation: "",
        // 吸烟情况
        smokingStatus: "",
        dailySmoking: 0,
        smokingHistory: 0,
        smokingUnit: "年",
        // 饮酒情况
        drinkingStatus: "",
        dailyDrinking: 0,
        drinkingHistory: 0,
        drinkingUnit: "年",
        // 家族史、个人史、其它情况
        familyHistory: "",
        personalHistory: "",
        otherSituation: "",
      },
      loddp: "",
      personalForm: {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 0,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        checktype: "",
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
        reporttake: "现场自取",
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
        checkobjectivecode: "",
        registerconclusion: "",
      }, // 个人信息
      idtypeItems: [
        {
          code: "01",
          name: "身份证",
        },
        {
          code: "02",
          name: "居民户口簿",
        },
        {
          code: "03",
          name: "护照",
        },
        {
          code: "04",
          name: "军官证",
        },
        {
          code: "05",
          name: "驾驶证",
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
      occupationItems: [], // 职业类型集合
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
      condition: "体检号", //检索体检条件
      conditionCode: "regid",
      checkupWork: "", // 检索关键字
      conditionDate: "", //检索体检日期
      healthcardcode: "idcard", //选中健康卡/身份证对象编码
      healthcardCheck: "身份证", //选中健康卡/身份证对象名称
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
        { code: 0, name: "未知" },
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
      // 转归选项
      outcomeOptions: [
        { label: "痊愈", value: "痊愈" },
        { label: "康复", value: "康复" },
        { label: "好转", value: "好转" },
        { label: "缓解", value: "缓解" },
        { label: "未愈", value: "未愈" },
        { label: "迁延", value: "迁延" },
        { label: "恶化", value: "恶化" },
        { label: "进展", value: "进展" },
        { label: "后遗症", value: "后遗症" },
        { label: "复发", value: "复发" },
      ],
      // 监测类型选项
      monitorTypeOptions: [
        { label: "常规监测", value: "1" },
        { label: "主动监测", value: "2" },
      ],
      // 类型编码选项
      typeCodeOptions: [
        { label: "非放射", value: "2" },
        { label: "放射", value: "3" },
      ],
      // 饮酒情况选项
      drinkingStatusOptions: [
        { label: "不饮酒", value: "0" },
        { label: "偶尔饮", value: "1" },
        { label: "经常饮", value: "2" },
      ],
      // 工龄单位选项
      workYearsUnitOptions: [
        { label: "年", value: "年" },
        { label: "月", value: "月" },
        { label: "日", value: "日" },
      ],
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
      showSetMealDialog: false, // 控制显示体检套餐项目弹框
      showCmbine: false, // 控制显示体检组合项目弹框
      loading: false, // 加载效果
      chargeDataList: [], // 收费明细表格主表
      chargeItems: {}, // 收费明细右侧明细表
      payitems: [], // 收费明细支付方式集
      chargeTotalPrice: 0, // 收费明细总金额
      loadingGroup: false, //收费明细表格主表加载效果
      loadingItem: false, //收费明细右侧明细表加载效果
      loadingCondition: false, // 检索条件表格加载效果
      avatarImg: require("./images/lin.jpg"), // 头像
      showCanvas: false, //弹窗
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
      intellectDataCb: [], // 智能推荐表格数据
      // intellectSelect: [], // 多选选中数据
      intellectSelect: null, // 多选选中数据
      intellectSelectCb: [], // 多选选中数据
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
      rulePersonalForm: {
        numberlimit: { validator: checkAge, required: true, trigger: "blur" },
        idcard: [
          {
            required: true,
            message: "请填写身份证",
            trigger: "blur",
          },
        ],
        telephone: [
          {
            required: true,
            message: "请填写电话号码",
            trigger: "blur",
          },
        ],
        checktype: [
          {
            required: true,
            message: "请选择体检类型",
            trigger: "change",
          },
        ],
        idtype: [
          {
            required: true,
            message: "请选择证件类型",
            trigger: "change",
          },
        ],
      },
      applyPrintTree: [], // 打印申请单选择科室数据树
      showApplyPrint: false, // 打印申请单选择科室数据树
      choosePrintArr: [], // 打印申请单选择科室编码
      applyPrintProps: {
        label: "name",
        children: "children",
      },
      buttons: [],
      size: "mini",
      domIdArr: ["btnPaySingle", "btnLabel", "btnApply"],
      dialogVisible: false,
      pdfUrl: "",
      reporttakeItems: [], // 领取报告方式集合
      showTodayCombine: false,
      todayCombineList: [],
      loadingBtn: false, // 按钮加载效果
      showTableMoveId: "", // 显示更多操作
      leaveTimeId: "", // 显示更多操作定时器ID
      isGuideSingle: false, // 是否点击打印指引单
      isCensorShip: "", // 打印送检单项目
      selectSharge: [], // 退费选中项
      tempDiscount: 0,
      showDiscEdit: false,
      toUpdateDiscId: "",
      showDelPhotoBtn: false,
      showCropperDialog: false, // 裁剪弹框
      option: {
        img: "", // 裁剪图片的地址
        autoCrop: true, //是否默认生成截图框
        fixedBox: true, //固定截图框大小 不允许改变
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 248, // 默认生成截图框高度
        centerBox: true, // 截图框是否被限制在图片里面
      },
      imgUrl: "",
      outpatientData: [],
      showOutpatient: false,
      submitArr: [], // 新开单套餐组件筛选数组
      OptionalItemDialogFlag: false, // 自选项目弹框开关
      OptionalItemData: [], // 自选项目数据
      groupid: "",
      rulecombines: [],
      CmbineOnlyloading: false,
      showFinish: false,
      finishTriag: [],
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
    afterFoldingPrice() {
      let price = 0;
      this.groupTableData.forEach((k) => {
        if (k.chargeflag != 3) {
          price += k.price * k.discount;
        }
      });
      return price;
    },
    // 体检套餐表格配置
    tableOptions() {
      return [
        {
          type: "selection",
          width: 50,
          align: "center",
          omit: 1,
        },
        {
          title: "操作",
          omit: 1,
          width: 80,
          render: (h, data) => {
            if (this.pageState === "add") {
              return (
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  style="height:23px; padding: 0 10px;"
                  icon="el-icon-delete"
                  vOn:click_stop_prevent={() => {
                    this.hadnleDelCombination(data);
                  }}
                ></el-button>
              );
            } else {
              // disabled={
              //       [0, 3].indexOf(data.chargeflag) == -1 || data.status >= 2
              //     }
              return (
                <el-button
                  type="primary"
                  size="mini"
                  plain
                  style="height:23px;padding: 0 10px;"
                  icon="el-icon-delete"
                  vOn:click_stop_prevent={() => {
                    this.hadnleDelCombination(data);
                  }}
                ></el-button>
              );
            }
          },
        },
        {
          title: "体检组合",
          prop: "combinename",
          width: 200,
          omit: 1,
          render: (h, data) => {
            return (
              <div>
                {data.combineStatus == 1 ? (
                  <span style="color:red">{data.combinename}</span>
                ) : (
                  <span>{data.combinename}</span>
                )}
              </div>
            );
          },
        },
        {
          title: "原价",
          prop: "price",
        },
        {
          title: "折扣",
          width: 90,
          // returnVal: (value) => {
          //   return `${value * 100} %`;
          // },
          render: (h, data) => {
            return (
              <div style="display: flex;">
                <input
                  type="text"
                  style="height:23px"
                  class={`discount_${data.$index} discount_input`}
                  disabled={data.balanceflag == 1 || data.discountflag == 1}
                  onkeyup={(e) => {
                    if (!e) return;
                    switch (e.keyCode) {
                      case 13: // 键盘回车
                        this.handleAloneDiscount(data);
                        break;
                      case 38: // 键盘 ↑ 键盘
                        this.handleDiscountUpper(e, data);
                        this.handleAloneDiscount(data);
                        break;
                      case 40: // 键盘 ↓ 键盘
                        this.handleDiscountLower(e, data);
                        this.handleAloneDiscount(data);
                        break;
                      default:
                        break;
                    }
                  }}
                  vOn:focus={(e) => {
                    e.stopPropagation();
                    e.currentTarget && e.currentTarget.select();
                    this.tempDiscount = data.discount;
                  }}
                  v-model={data.discount}
                />
              </div>
            );
          },
        },
        {
          title: "折后价格",
          prop: "discountprice",
          returnVal: (value, data) => {
            let result = data.price * data.discount;
            return result.toFixed(2);
            /* return data.discountprice; */
          },
        },
        {
          title: "缴费",
          prop: "chargeflag",
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
          title: "体检套餐",
          prop: "setmealname",
          width: 130,
          omit: 1,
        },
        {
          title: "检查科室",
          prop: "deptname",
          width: 150,
          omit: 1,
        },
        {
          title: "结算方式",
          prop: "settlementtype",
          width: 140,
          render: (h, data) => {
            return (
              <div>
                <el-select
                  style="width:120px"
                  size="mini"
                  v-model={data.settlementtype}
                >
                  <el-option label="单位结算" value={0}></el-option>
                  <el-option label="个人结算" value={1}></el-option>
                </el-select>
              </div>
            );
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
          title: "开单时间",
          prop: "operatordate",
          width: 150,
          omit: 1,
        },
        {
          title: "检查状态",
          prop: "status",
          returnVal: (val) => {
            return val == 0 ? "登记" : val == 1 ? "弃检" : "完成";
          },
        },
        {
          title: "组合编码",
          prop: "combinecode",
          width: 150,
          omit: 1,
        },
        {
          title: "申请单号",
          prop: "hisapplyno",
          width: 150,
          omit: 1,
        },
      ];
    },
    // 自选项目
    OptionalItemOptions() {
      return [
        {
          type: "selection",
          width: 50,
          align: "center",
          omit: 1,
        },
        {
          title: "组合编码",
          prop: "combinecode",
          width: 150,
          omit: 1,
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
                  <el-dropdown-item command="复制登记">
                    复制登记
                  </el-dropdown-item>
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
            return `${value} ${data.ageunit}`;
          },
        },
        {
          title: "体检号",
          prop: "regid",
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
          title: "联系电话",
          prop: "telephone",
          width: 150,
          omit: 1,
        },
        {
          title: "收费",
          prop: "price",
          width: 100,
          omit: 1,
        },
        {
          title: "团检名称",
          prop: "companyname",
          width: 150,
          omit: 1,
        },
        {
          title: "体检类型",
          prop: "checktypename",
          width: 120,
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
        {
          title: "档案号",
          prop: "checkno",
          width: 120,
          omit: 1,
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
          // attrs: {
          //   selectable: this.handleChargeSelected,
          // },
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
          width: 120,
          returnVal: (value) => {
            return `${value} 元`;
          },
        },
        {
          title: "折扣",
          prop: "discount",
          // returnVal: (value) => {
          //   return `${value * 100} %`;
          // },
        },
        {
          title: "折后价格",
          width: 120,
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
          prop: "checkdate",
          align: "center",
          width: 130,
        },
      ];
    },
    // 门诊档案信息表格配置
    outpatientOptions() {
      return [
        {
          title: "健康卡号",
          prop: "healthcard",
          align: "center",
          width: 160,
        },
        {
          title: "门诊卡",
          prop: "hiscode",
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
          title: "地址",
          prop: "address",
          align: "center",
          width: 205,
          omit: 1,
        },
        {
          title: "体检时间",
          prop: "checkdate",
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
          type: "radio",
          width: 45,
        },
        {
          title: "套餐编码",
          prop: "setmealcode",
          omit: 1,
        },
        {
          title: "套餐名称",
          prop: "setmealname",
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
        },
        {
          title: "推荐说明",
          prop: "explain",
          omit: 1,
        },
      ];
    },
    // 智能推荐表格配置
    intellectOptionscb() {
      return [
        {
          type: "selection",
          width: 45,
        },

        {
          title: "组合编码",
          prop: "combinecode",
          omit: 1,
        },
        {
          title: "组合名称",
          prop: "combinename",
          omit: 1,
        },
        {
          title: "价格",
          prop: "price",
          omit: 1,
        },
        {
          title: "推荐说明",
          prop: "explain",
          omit: 1,
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
  },
  mounted() {
    // 获取按钮组数据
    let elements = this.$route.meta.elements;
    this.buttons = elements.sort((a, b) => {
      return a.sort - b.sort;
    });
    // 页面加载获取系统配置
    this.handleGetSysConfig();
    // 初次打开页面获取人员数据
    this.handleGetPersonalRegisterList();
    // 进入页面连接身份证读卡器
    this.handleConnectIdcard();
    // 获取领取报告方式
    this.handleGetPublicConfig();
    // 类型列表
    this.handleQuestionnaireTitleList();
    this.handleGetPublicConfigs("Occupation"); // 职业类型
    this.handleGetPublicConfigs("Nation"); // 民族
    this.handleGetPublicConfigs("OccupationCheckType"); // 体检类型
    this.handleGetAllUser(); // 导诊护士 业务员
    getSysConfigInfo({ cc: "Sys_Print_Inspection" }).then((res) => {
      // 获取条件计算日期范围回调
      this.isCensorShip = res.result;
    });
    getPublicConfig({ cc: "IDType" }).then((res) => {
      if (!res.result) return;
      this.idtypeItems = res.result;
    });
    {
      /* getSysConfigInfo({ cc: "Sys_IDCardReaderType" }).then((res) => {
      // 获取条件计算日期范围回调
      this.cardReaderFlag = res.result;
    }); */
    }
    this.handleGetPrintConfig();
    company_archives
      .getList({
        page: 1,
        limit: 100000,
        key: "",
      })
      .then((res) => {
        if (!res.data) return;
        this.companycodeItems = res.data;
      });
    window.onkeyup = function (e) {
      if (e.keyCode === 13) {
        e.stopPropagation();
        if ($(":focus")[0] && $(":focus")[0].className === "el-input__inner") {
          let index = $(".el-input__inner").index($(":focus"));
          $(".el-input__inner")
            .eq(index + 1)
            .focus();
        }
      }
    };
    this.handleCreate();
    this.handleGetUserPropertyValues();
  },

  methods: {
    // 获取在岗状态列表
    getWorkStatusList() {
      company_archives
        .GetOccupationTreeList({ category: "DutyStatus" })
        .then((res) => {
          console.log("在岗状态：", res);
          if (res.code == 200) {
            this.workStatusOptions = res.result || [];
          }
        })
        .catch((err) => {
          console.error("获取在岗状态列表失败:", err);
        });
    },
    // 职业病信息 - 新增接触危害因素
    addHazardFactor() {
      this.hazardFactorList.push({
        factorCode: "",
        factorName: "",
        factorNamePath: [],
        otherHazard: "",
        isExamFactor: false,
        isOtherHazard: false, // 是否其它危害（code包含999时启用）
      });
    },
    // 处理危害因素级联选择变化
    handleHazardFactorChange(value, row) {
      if (value) {
        // value 是选中的 code
        row.factorCode = value;
        // 根据 code 查找对应的 name
        const findName = (options, code) => {
          for (const option of options) {
            if (option.value === code) {
              return option.label;
            }
            if (option.children) {
              const name = findName(option.children, code);
              if (name) return name;
            }
          }
          return "";
        };
        row.factorName = findName(this.hazardFactorCascaderOptions, value);

        // 判断是否选择了"其它危害" (code 包含 999)
        if (value && value.includes && value.includes("999")) {
          row.isOtherHazard = true;
          // 不自动填入，由用户手动输入
          row.otherHazard = "";
        } else {
          row.isOtherHazard = false;
          row.otherHazard = "";
        }
      } else {
        row.factorCode = "";
        row.factorName = "";
        row.isOtherHazard = false;
        row.otherHazard = "";
      }
    },
    // 处理其它危害输入变化
    handleOtherHazardChange(value, row) {
      // 当输入其它危害时，替换危害因素显示的名称（code 保持不变）
      if (row.isOtherHazard && value) {
        row.factorName = value;
      }
    },
    // 处理单位切换
    handleUnitChange(field, value) {
      this.occupationalForm[field] = value;
    },
    // 处理问卷单位切换
    handleQuestionnaireUnitChange(field, value) {
      this.questionnaireForm[field] = value;
    },
    // 职业病信息 - 删除接触危害因素
    deleteHazardFactor(index) {
      this.$confirm("确认删除该危害因素?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.hazardFactorList.splice(index, 1);
        this.$message.success("删除成功");
      });
    },
    // 职业病信息 - 新增职业史
    addWorkHistory() {
      this.workHistoryList.push({
        startEndDate: [],
        startDate: "",
        endDate: "",
        typeCode: "",
        companyName: "",
        checkDate: "",
        checkDoctor: "",
      });
    },
    // 处理职业史起止日期变化
    handleWorkDateChange(value, row) {
      if (value && value.length === 2) {
        row.startDate = value[0];
        row.endDate = value[1];
      } else {
        row.startDate = "";
        row.endDate = "";
      }
    },
    // 职业病信息 - 删除职业史
    deleteWorkHistory(index) {
      this.$confirm("确认删除该职业史记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.workHistoryList.splice(index, 1);
        this.$message.success("删除成功");
      });
    },
    // 职业病信息 - 新增既往病史
    addMedicalHistory() {
      this.medicalHistoryList.push({
        diseaseName: "",
        outcome: "",
        diagnosisUnit: "",
        diagnosisDate: "",
        description: "",
      });
    },
    // 职业病信息 - 删除既往病史
    deleteMedicalHistory(index) {
      this.$confirm("确认删除该病史记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.medicalHistoryList.splice(index, 1);
        this.$message.success("删除成功");
      });
    },
    // 表格勾选项回调
    handleSelectItemList(row) {
      if (row && row.length > 0) {
        console.log(row, "表格勾选项");
        this.chooseList = row;
      }
    },
    hadnleSigninPrint() {
      setSignIn([this.choosePeople.regid]).then(async (res) => {
        if (res.result.nextQueInfos.length > 0) {
          this.finishTriag = res.result.nextQueInfos;
          this.showFinish = true;
        } else {
          this.$message.success("正在调用指引单打印!");
          this.handlePrintGuideSingle();
        }
      });
    },
    handleCloseShowFinish() {
      this.showFinish = false;
      this.finishTriag = [];
      this.$message.success("正在调用指引单打印!");
      this.handlePrintGuideSingle();
    },
    handleOptionalItemSubmitCopy() {
      this.rulecombines = this.OptionalItemData.map((k) => {
        k.checkList = k.checkList.filter((val) => val);
        return k.checkList && k.checkList.length > 0
          ? `${k.deptcode}:${k.checkList.join("|")}`
          : "";
      }).filter((k) => k);
      CheckChooseRule({
        groupid: this.groupid.id,
        rulecombines: this.rulecombines,
      }).then((res) => {
        if (!res.result.allowSubmit) {
          this.$message.warning();
          this.$message({
            dangerouslyUseHTMLString: true,
            type: "warning",
            message: `${res.result.rejectWarn}<br/>${res.result.msg}`,
          });
          // this.rulecombines.pop(); // 删除最后
          // item.checkList = []; // 清空勾选
        } else {
          this.handleOptionalItemSubmit();
        }
      });
    },
    // 自选项目 弹框确认
    handleOptionalItemSubmit() {
      let arr = [];
      this.OptionalItemData.forEach((item) => {
        item.combinitems.forEach((comb) => {
          if (item.checkList.includes(comb.combinecode)) {
            arr.push(comb);
          }
        });
      });
      let result = [];
      arr.forEach((item) => {
        if (
          !this.groupTableData.some((cd) => cd.combinecode === item.combinecode)
        ) {
          result.push(item);
        }
      });
      result = result.map((item) => {
        return {
          detid: "",
          regid: "",
          setmealcode: result[0].setmealcode,
          setmealname: result[0].setmealname,
          combinecode: item.combinecode,
          combinename: item.combinename,
          deptcode: item.deptcode,
          deptname: item.deptname,
          operatorname: this.name,
          operatordate: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 16)
            .replace("T", " "),
          price: item.originalprice || item.price || 0,
          discount: item.discount || 1,
          discountflag: item.discountflag,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
          settlementtype: item.settlementtype != 0 ? 1 : 0,
        };
      });
      let data = [...this.groupTableData, ...result];
      if (this.pageState === "edit") {
        /* this.$set(this.personalForm, "combineitems", data); */
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
        })
          .then((res) => {
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
            this.pageState = "edit"; // 当前页面状态 add edit preview
            this.OptionalItemDialogFlag = false;
          })
          .catch((err) => {
            this.OptionalItemDialogFlag = false;
            for (let i = 0; i < this.groupTableData.length; i++) {
              if (this.groupTableData[i].combinecode == delArr[0].combinecode) {
                this.groupTableData.splice(i, 1);
              }
            }
            this.$nextTick(() => {
              this.OptionalItemDialogFlag = false;
            });
          });
      } else {
        this.handleAddSaveGroupTableData(data, "combine");
        this.OptionalItemDialogFlag = false;
      }
    },
    //
    handleOptionalSelectAll(item) {
      for (let i = 0; i < this.OptionalItemData.length; i++) {
        if (this.OptionalItemData[i].deptcode == item.deptcode) {
          this.OptionalItemData[i].checkList = this.OptionalItemData[
            i
          ].combinitems.map((k) => k.combinecode);
        }
      }
      // this.handleOptionalSelect(true, item);
    },
    handleOptionalCloseAll(item) {
      for (let i = 0; i < this.OptionalItemData.length; i++) {
        if (this.OptionalItemData[i].deptcode == item.deptcode) {
          this.OptionalItemData[i].checkList = [];
        }
      }
      // this.handleOptionalSelect(false, item);
    },
    // 自选项目 弹框勾选回调
    handleOptionalSelect(flag, item) {
      return;
      if (item.checkall) {
        if (flag) {
          for (let i = 0; i < this.OptionalItemData.length; i++) {
            if (this.OptionalItemData[i].deptcode == item.deptcode) {
              this.OptionalItemData[i].checkList = this.OptionalItemData[
                i
              ].combinitems.map((k) => k.combinecode);
            }
          }
        } else {
          for (let i = 0; i < this.OptionalItemData.length; i++) {
            if (this.OptionalItemData[i].deptcode == item.deptcode) {
              this.OptionalItemData[i].checkList = [];
            }
          }
        }
      }
      this.rulecombines = this.OptionalItemData.map((k) => {
        k.checkList = k.checkList.filter((val) => val);
        return k.checkList && k.checkList.length > 0
          ? `${k.deptcode}:${k.checkList.join("|")}`
          : "";
      }).filter((k) => k);

      CheckChooseRule({
        groupid: this.groupid.id,
        rulecombines: this.rulecombines,
      }).then((res) => {
        if (!res.result.ismatch) {
          this.$message.warning(res.result.msg);
          this.rulecombines.pop(); // 删除最后
          item.checkList = []; // 清空勾选
        }
      });
    },
    // 自选项目 弹框取消
    handleOptionalItemClose() {
      this.OptionalItemDialogFlag = false;
    },
    // 自选项目
    handleOptionalItem() {
      this.loading = true;
      this.groupid =
        this.groupitems.filter(
          (k) => k.code == this.personalForm.groupcode
        )[0] || "";
      RuleCombineList({ groupid: this.groupid.id })
        .then((res) => {
          this.loading = false;
          if (!res.result) {
            this.$message.warning("暂无数据");
            return;
          }

          if (res.result) {
            this.OptionalItemDialogFlag = true;
            this.OptionalItemData = res.result.map((k) => {
              return { ...k, checkList: [] };
            });
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },

    /* 读卡快速搜索 */
    handleSearchCardReading() {
      this.conditionCode = "idcard";
      if (this.cardReaderFlag == "华视") {
        this.handleConnectIdcard();
        let url = `http://127.0.0.1:19196/readcard&picpath=D:/1/123.bmp&t=${Math.random()}`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data;
              this.checkupWork = data.certNumber;
              this.handleGetPersonalRegisterList();
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      } else if (this.cardReaderFlag == "精伦") {
        let url = `http://127.0.0.1:18889/api/readCert`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data.resultFlag == 0) {
              let data = res.data.resultContent;
              this.checkupWork = data.certNumber;
              this.handleGetPersonalRegisterList();
            } else {
              this.$message.warning(res.data.errorMsg);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      } else if (
        this.cardReaderFlag == "新中新" ||
        this.cardReaderFlag == "中控"
      ) {
        let url = `http://localhost:8989/api/ReadMsg?waitTime=3`;
        this.$axios
          .get(url)
          .then(async (res) => {
            if (res.data) {
              let data = res.data;
              this.checkupWork = data.cardno;
              this.handleGetPersonalRegisterList();
            } else {
              this.$message.warning(`${res.data.retmsg}，请联系管理员!`);
            }
          })
          .catch((err) => {
            this.$message.warning(err);
          });
      }
    },
    // 打印条码
    handlePrintBarCode() {
      if (!this.personalForm && !this.personalForm.regid) {
        this.$message.warning("请先选中人员!");
        return;
      }
      let d = this.$refs.btnBarCode[0];
      if (d.$el.innerText == "条码打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.personalForm.regid],
          repname: d.$attrs["data-remark"],
          whereitems: [],
          printflag: 1,
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
    },
    // 上传触发回调
    handleOnPpload(file, fileList) {
      let types = ["image/jpeg", "image/jpg", "image/png"];
      const isImage = types.includes(file.raw.type);
      if (!isImage) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
        return false;
      }
      let data = new FormData();
      data.append("files", file.raw);
      setFilesUpload(data).then((res) => {
        this.personalForm.fileid = res.result[0].id;
        this.avatarImg = res.result[0].fileUrl;
      });
    },
    handleAddPayment() {
      this.$refs.btnAddPayment.forEach((d) => {
        if (d.$el.innerText == "加项缴费单") {
          var data = {
            fingercode: localStorage.getItem("md5code"),
            codes: [this.choosePeople.regid],
            repname: d.$attrs["data-remark"],
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
    },
    handleCardDetailDetail() {
      if (!this.cardAccount || !this.cardPassword) {
        this.$message.warning("账号/密码不允许为空!");
        return;
      }
      CardDetailDetail({
        cardno: this.cardAccount,
        password: this.cardPassword,
      }).then((res) => {
        this.cardDetail = res.result;
      });
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
    // 获取体检类型对应套餐数据
    handleGetDicSetmealList() {
      getDicSetmealList({ tp: "", sex: 0, gp: "1" }).then((res) => {
        if (!res.result) return;
        let setmealitems = res.result.setmealitems;
        let chooseType = this.checktypeitems.filter((k) => {
          return k.code === this.personalForm.checktype;
        })[0];
        if (!chooseType) return;
        if (!chooseType.unioncode) return;
        let chooseSetmeal = setmealitems.filter((k) => {
          return k.setmealcode === chooseType.unioncode;
        })[0];
        if (!chooseSetmeal) return;
        let codeList = chooseSetmeal.combineitems.map((k) => {
          return `${k.combinecode}合管${k.liscuv || ""}`;
        });
        setCollectChargeInfoForNotSave(codeList).then((res) => {
          this.groupTableData = res.data;
          this.personalForm.combineitems = res.data; // 赋值对象中
          this.groupPriceTotal = 0;
          localStorage.setItem("groupTableData", JSON.stringify(res.data));
          // 体检项目总金额
          this.groupTableData.forEach((item) => {
            this.groupPriceTotal += item.price;
          });
          // 赋值套餐列表
          this.groupTableData = res.data;
          // 体检项目已经缴费金额
          this.groupTableData.forEach((item) => {
            if (item.chargeflag == 1) {
              this.groupPriceEnd += item.price;
            }
          });
        });
      });
    },
    // 输入身份证
    handleEnterIdcardPf() {
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
    // 获取光标到检索框
    handleFocuscheckupWorkInput() {
      this.$nextTick(() => {
        this.$refs.inputWorkFlage.focus();
      });
    },
    // 图片裁剪完成回调
    handleConfirmCrop() {
      if (!this.imgUrl) {
        this.$message.warning("请先裁剪图片再进行提交!");
        return;
      }
      this.avatarImg = this.imgUrl;
      this.personalForm.filebase64 = this.imgUrl;
      this.handleCloseCrop();
    },
    // 左旋转
    handleRotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 右旋转
    handleRotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 重置
    handleRefresh() {
      this.$refs.cropper.refresh();
    },
    // 关闭裁剪弹框
    handleCloseCrop() {
      this.option.img = "";
      this.imgUrl = "";
      this.showCropperDialog = false;
    },
    // 生成blob图片
    handleGetCropData() {
      this.$refs.cropper.getCropData((data) => {
        this.imgUrl = data;
      });
    },
    // 开始裁剪照片回调
    handleStartCropper() {},
    // 照片裁切弹框触发方法
    handleCropPhotoBtn() {
      if (!this.personalForm.fileid && !this.personalForm.filebase64) {
        this.$message.warning("暂无可裁剪照片!");
        return false;
      }
      this.option.img = this.avatarImg;
      this.showCropperDialog = true;
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
            setFilesDelete([fileid])
              .then((res) => {
                this.personalForm.fileid = "";
                this.personalForm.filebase64 = "";
                this.avatarImg = require("./images/lin.jpg");
                this.$message.success("操作成功!");
                this.hadnleSubmit();
              })
              .catch((err) => {
                this.$message.warning("操作失败!");
              });
          } else {
            this.personalForm.fileid = "";
            this.personalForm.filebase64 = "";
            this.avatarImg = require("./images/lin.jpg");
            this.$message.success("操作成功!");
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
        } else if (cc == "OccupationCheckType") {
          // 体检类型
          this.checktypeitems = res.result;
        }
      });
    },
    /* 一键清空项目 */
    handleClearCombine() {
      // if (!this.choosePeople) {
      //   this.$message.warning("请先选中人员!");
      //   return;
      // }

      if (!this.choosePeople) {
        this.groupTableData = [];
        this.personalForm.combineitems = [];
      } else {
        let combineCodes = "";
        this.chooseList.forEach((item) => {
          combineCodes += item.combinecode + ",";
        });
        combineCodes = combineCodes.substring(0, combineCodes.length - 1);
        clearCombine({
          regid: this.choosePeople.regid,
          combinecodes: combineCodes,
        }).then((res) => {
          this.chooseList = [];
          this.$message.success(res.message);
          this.handleGetPersonalDetail(this.personalForm.regid); // 更新详情人员数据
        });
      }
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
      if (this.message === "occupational") {
        // 职业病信息保存
        this.handleSaveOccupational();
      } else if (this.pageSwitch == "") {
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
        this.$message.success(res.message);
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
        this.$message.success(res.message);
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
        this.$message.success(res.message);
        this.message = "basic";
      });
    },
    // 职业病信息保存回调
    handleSaveOccupational() {
      // 校验危害因素集合
      for (let i = 0; i < this.hazardFactorList.length; i++) {
        const item = this.hazardFactorList[i];
        if (!item.factorCode) {
          this.$message.error({
            message: `【危害因素】第 ${i + 1} 条记录：危害因素不能为空！`,
            duration: 3000,
          });
          return;
        }
        // 校验其它危害：如果是其它危害(code包含999)，则其它危害内容不能为空
        if (item.isOtherHazard && !item.otherHazard.trim()) {
          this.$message.error({
            message: `【危害因素】第 ${
              i + 1
            } 条记录：选择了其它危害，请填写其它危害内容！`,
            duration: 3000,
          });
          return;
        }
      }

      // 校验既往病史集合
      for (let i = 0; i < this.medicalHistoryList.length; i++) {
        const item = this.medicalHistoryList[i];
        if (!item.diseaseName) {
          this.$message.error({
            message: `【既往病史】第 ${i + 1} 条记录：疾病名称不能为空！`,
            duration: 3000,
          });
          return;
        }
      }

      // 校验职业史集合
      for (let i = 0; i < this.workHistoryList.length; i++) {
        const item = this.workHistoryList[i];
        if (!item.startDate || !item.endDate) {
          this.$message.error({
            message: `【职业史】第 ${i + 1} 条记录：起止日期不能为空！`,
            duration: 3000,
          });
          return;
        }
        if (!item.typeCode) {
          this.$message.error({
            message: `【职业史】第 ${i + 1} 条记录：类型编码不能为空！`,
            duration: 3000,
          });
          return;
        }
        if (!item.companyName) {
          this.$message.error({
            message: `【职业史】第 ${i + 1} 条记录：工作单位名称不能为空！`,
            duration: 3000,
          });
          return;
        }
        if (!item.checkDate) {
          this.$message.error({
            message: `【职业史】第 ${i + 1} 条记录：检查日期不能为空！`,
            duration: 3000,
          });
          return;
        }
        if (!item.checkDoctor) {
          this.$message.error({
            message: `【职业史】第 ${i + 1} 条记录：检查医生不能为空！`,
            duration: 3000,
          });
          return;
        }
      }

      // 构建保存数据
      const submitData = {
        regid: this.occupationalDetail?.regid || "",
        arsid: this.occupationalDetail?.arsid || "",
        sourceregid: this.occupationalForm.sourceregid || "",
        jobin: this.occupationalForm.workStatus || "",
        contactDamageData: this.occupationalForm.contactDate || "",
        monitortype: this.occupationalForm.monitorType || "",
        workyear: String(this.occupationalForm.totalWorkYears || 0),
        harmwordyear: String(this.occupationalForm.harmWorkYears || 0),
        workyearunit: this.occupationalForm.totalWorkYearsUnit || "年",
        harmwordyearunit: this.occupationalForm.harmWorkYearsUnit || "年",
        worktypecode: this.occupationalForm.jobCode || "",
        worktypename: this.occupationalForm.jobName || "",
        // 危害因素集合
        customerRegisterHarmItems: this.hazardFactorList.map((item) => ({
          harmcode: item.factorCode || "",
          harmname: item.factorName || "",
          checkHarmFlag: item.isExamFactor ? 1 : 0,
        })),
        // 病史集合
        customerMedicalHistoryItems: this.medicalHistoryList.map((item) => ({
          medicalhistorydes: item.description || "",
          illName: item.diseaseName || "",
          diagnoseCompanyName: item.diagnosisUnit || "",
          diagnoseDate: item.diagnosisDate || "",
          illReturn: item.outcome || "",
        })),
        // 职业史集合
        customerWorkHistoryItems: this.workHistoryList.map((item) => ({
          checktype: item.typeCode || "",
          startdate: item.startDate || "",
          enddate: item.endDate || "",
          companyname: item.companyName || "",
          checkdate: item.checkDate || "",
          checkdoctor: item.checkDoctor || "",
        })),
        // 问卷信息
        basequestionItem: {
          regid: this.occupationalDetail?.regid || "",
          yj_ccnl: String(this.questionnaireForm.menarcheAge || 0),
          yj_jq: String(this.questionnaireForm.menstrualPeriod || ""),
          yj_zq: String(this.questionnaireForm.menstrualCycle || ""),
          yj_tjnl: String(this.questionnaireForm.menopauseAge || 0),
          yj_sfjq: this.questionnaireForm.isMenstrual || "",
          sy_znrs: String(this.questionnaireForm.childrenCount || 0),
          sy_lccs: String(this.questionnaireForm.abortionCount || 0),
          sy_zccs: String(this.questionnaireForm.prematureCount || 0),
          sy_sccs: String(this.questionnaireForm.stillbirthCount || 0),
          sy_jtcs: String(this.questionnaireForm.teratismCount || 0),
          sy_znjkzk: this.questionnaireForm.childrenHealth || "",
          hy_jhrq: this.questionnaireForm.marriageDate || "",
          pofsqk: this.questionnaireForm.spouseRadiation || "",
          pozyqk: this.questionnaireForm.spouseOccupation || "",
          smokeStatus: this.questionnaireForm.smokingStatus || "",
          smokeEveryCount: parseInt(this.questionnaireForm.dailySmoking) || 0,
          smokeYear: parseInt(this.questionnaireForm.smokingHistory) || 0,
          smokeUnit: this.questionnaireForm.smokingUnit || "年",
          drinkStatus: this.questionnaireForm.drinkingStatus || "",
          drinkEveryCount: String(this.questionnaireForm.dailyDrinking || ""),
          drinkYear: parseInt(this.questionnaireForm.drinkingHistory) || 0,
          drinkUnit: this.questionnaireForm.drinkingUnit || "年",
          familyHistory: this.questionnaireForm.familyHistory || "",
          personHistory: this.questionnaireForm.personalHistory || "",
          otherDes: this.questionnaireForm.otherSituation || "",
        },
      };

      SaveOccupation(submitData)
        .then((res) => {
          console.log("保存职业病信息:", res);
          this.$message.success(res.message || "保存成功");
          // 保存成功后清除数据缓存并重新获取详情
          this.clearOccupationalData();
          this.getOccupationDetail();
        })
        .catch((err) => {
          console.error("保存职业病信息失败:", err);
          this.$message.error(err.message || "保存失败");
        });
    },
    // 头部切换按钮
    handleRadioButton(key) {
      // 如果当前是职业病信息tab，切出时清除数据缓存
      if (this.message === "occupational" && key !== "occupational") {
        this.clearOccupationalData();
      }

      if (key === "basic" || key === "other") return false;
      if (!this.choosePeople) {
        this.$message.warning("请先选中需查看人员信息!");
        this.message = "basic";
        return false;
      }
      // 职业病信息tab特殊处理
      if (key === "occupational") {
        // 第一次点击时加载数据
        if (!this.isOccupationalDataLoaded) {
          this.loadOccupationalData();
          this.isOccupationalDataLoaded = true;
        }
        // 获取职业病详情数据
        this.getOccupationDetail();
        this.message = key;
        return false;
      }

      this.message = key;
      let flag = this.typelist.filter((k) => k.titlecode == key)[0];
      flag && (this.titletype = flag.titletype);
      this.pageSwitch = key;
      if (key == "") {
        // 病史采集
        this.handleMedicalHistory();
      } else {
        // 问卷调查
        this.handleQuestionnaire();
      }
    },
    // 加载职业病信息相关数据
    loadOccupationalData() {
      // 获取在岗状态列表
      this.getWorkStatusList();
      // 获取工种代码列表
      this.getJobCodeList();
      // 获取危害因素列表
      this.getHazardFactorList();
      // 获取吸烟情况列表
      this.getSmokingStatusList();
    },
    // 清除职业病信息数据缓存
    clearOccupationalData() {
      // 重置表单数据
      this.occupationalForm = {
        regid: "",
        arsid: "",
        sourceregid: "",
        isReview: false,
        isReviewValue: "",
        workStatus: "",
        contactDate: "",
        monitorType: "",
        totalWorkYears: 0,
        totalWorkYearsUnit: "年",
        harmWorkYears: 0,
        harmWorkYearsUnit: "年",
        jobCode: "",
        jobName: "",
        remark: "",
      };
      // 清空列表数据
      this.hazardFactorList = [
        {
          factorCode: "",
          factorName: "",
          otherHazard: "",
          isExamFactor: false,
          isOtherHazard: false,
        },
      ];
      this.workHistoryList = [];
      this.medicalHistoryList = [];
      // 清空问卷数据
      this.questionnaireForm = {
        menarcheAge: 0,
        menstrualPeriod: "",
        menstrualCycle: "",
        menopauseAge: 0,
        isMenstrual: "",
        childrenCount: 0,
        abortionCount: 0,
        prematureCount: 0,
        stillbirthCount: 0,
        teratismCount: 0,
        childrenHealth: "",
        marriageDate: "",
        spouseRadiation: "",
        spouseOccupation: "",
        smokingStatus: "",
        dailySmoking: 0,
        smokingHistory: 0,
        smokingUnit: "年",
        drinkingStatus: "",
        dailyDrinking: "",
        drinkingHistory: 0,
        drinkingUnit: "年",
        familyHistory: "",
        personalHistory: "",
        otherSituation: "",
      };
      // 清空详情缓存
      this.occupationalDetail = null;
      // 重置加载状态
      this.isOccupationalDataLoaded = false;
    },
    // 获取职业病详情数据
    getOccupationDetail() {
      if (!this.choosePeople?.regid) return;

      const loading = this.$loading({
        lock: true,
        text: "加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });

      GetOccupationOther({ regid: this.choosePeople.regid })
        .then((res) => {
          console.log("获取职业病详情:", res);
          if (res.code == 200 && res.result) {
            this.fillOccupationData(res.result);
          }
        })
        .catch((err) => {
          console.error("获取职业病详情失败:", err);
        })
        .finally(() => {
          loading.close();
        });
    },
    // 填充职业病数据到表单
    fillOccupationData(data) {
      // 保存详情数据，用于后续保存时获取regid和arsid
      this.occupationalDetail = data;

      // 填充主表单数据
      this.occupationalForm.sourceregid = data.sourceregid || "";
      this.occupationalForm.workStatus = data.jobin || "";
      this.occupationalForm.contactDate = data.contactDamageData || "";
      this.occupationalForm.monitorType = data.monitortype || "";
      this.occupationalForm.totalWorkYears = parseInt(data.workyear) || 0;
      this.occupationalForm.harmWorkYears = parseInt(data.harmwordyear) || 0;
      this.occupationalForm.totalWorkYearsUnit = data.workyearunit || "年";
      this.occupationalForm.harmWorkYearsUnit = data.harmwordyearunit || "年";
      this.occupationalForm.jobCode = data.worktypecode || "";
      this.occupationalForm.jobName = data.worktypename || "";

      // 填充危害因素列表
      if (
        data.customerRegisterHarmItems &&
        data.customerRegisterHarmItems.length > 0
      ) {
        this.hazardFactorList = data.customerRegisterHarmItems.map((item) => {
          const factorCode = item.harmcode || "";
          // 根据code查找完整的级联路径
          const factorNamePath = factorCode
            ? this.findCascaderPathByCode(
                this.hazardFactorCascaderOptions,
                factorCode
              )
            : [];
          // 判断是否包含999（其它危害）
          const isOtherHazard =
            factorCode && factorCode.includes && factorCode.includes("999");
          return {
            factorCode: factorCode,
            factorName: item.harmname || "",
            factorNamePath: factorNamePath,
            otherHazard: isOtherHazard ? item.harmname || "" : "",
            isExamFactor: item.checkHarmFlag === 1,
            isOtherHazard: isOtherHazard,
          };
        });
      }

      // 填充病史列表
      if (
        data.customerMedicalHistoryItems &&
        data.customerMedicalHistoryItems.length > 0
      ) {
        this.medicalHistoryList = data.customerMedicalHistoryItems.map(
          (item) => ({
            diseaseName: item.illName || "",
            outcome: item.illReturn || "",
            diagnosisDate: item.diagnoseDate || "",
            diagnosisUnit: item.diagnoseCompanyName || "",
            description: item.medicalhistorydes || "",
          })
        );
      }

      // 填充职业史列表
      if (
        data.customerWorkHistoryItems &&
        data.customerWorkHistoryItems.length > 0
      ) {
        this.workHistoryList = data.customerWorkHistoryItems.map((item) => {
          const startDate = item.startdate || "";
          const endDate = item.enddate || "";
          return {
            startEndDate: startDate && endDate ? [startDate, endDate] : [],
            startDate: startDate,
            endDate: endDate,
            typeCode: item.checktype || "",
            companyName: item.companyname || "",
            checkDate: item.checkdate || "",
            checkDoctor: item.checkdoctor || "",
          };
        });
      }

      // 填充问卷数据
      if (data.basequestionItem) {
        const q = data.basequestionItem;
        this.questionnaireForm.menarcheAge = parseInt(q.yj_ccnl) || 0;
        this.questionnaireForm.menstrualPeriod = q.yj_jq || "";
        this.questionnaireForm.menstrualCycle = q.yj_zq || "";
        this.questionnaireForm.menopauseAge = parseInt(q.yj_tjnl) || 0;
        this.questionnaireForm.isMenstrual = q.yj_sfjq || "";
        this.questionnaireForm.childrenCount = parseInt(q.sy_znrs) || 0;
        this.questionnaireForm.abortionCount = parseInt(q.sy_lccs) || 0;
        this.questionnaireForm.prematureCount = parseInt(q.sy_zccs) || 0;
        this.questionnaireForm.stillbirthCount = parseInt(q.sy_sccs) || 0;
        this.questionnaireForm.teratismCount = parseInt(q.sy_jtcs) || 0;
        this.questionnaireForm.childrenHealth = q.sy_znjkzk || "";
        this.questionnaireForm.marriageDate = q.hy_jhrq || "";
        this.questionnaireForm.spouseRadiation = q.pofsqk || "";
        this.questionnaireForm.spouseOccupation = q.pozyqk || "";
        this.questionnaireForm.smokingStatus = q.smokeStatus || "";
        this.questionnaireForm.dailySmoking = q.smokeEveryCount || 0;
        this.questionnaireForm.smokingHistory = q.smokeYear || 0;
        this.questionnaireForm.smokingUnit = q.smokeUnit || "年";
        this.questionnaireForm.drinkingStatus = q.drinkStatus || "";
        this.questionnaireForm.dailyDrinking = q.drinkEveryCount || 0;
        this.questionnaireForm.drinkingHistory = q.drinkYear || 0;
        this.questionnaireForm.drinkingUnit = q.drinkUnit || "年";
        this.questionnaireForm.familyHistory = q.familyHistory || "";
        this.questionnaireForm.personalHistory = q.personHistory || "";
        this.questionnaireForm.otherSituation = q.otherDes || "";
      }
    },
    // 获取工种代码列表
    getJobCodeList() {
      company_archives
        .GetOccupationTreeList({ category: "JobCode" })
        .then((res) => {
          console.log("工种代码：", res);
          if (res.code == 200) {
            this.jobCodeOptions = res.result || [];
            this.jobCodePagination.total = this.jobCodeOptions.length;
            this.jobCodePagination.hasMore =
              this.jobCodeOptions.length > this.jobCodePagination.pageSize;
            // 初始加载第一页数据
            this.loadJobCodePage(1);
          }
        })
        .catch((err) => {
          console.error("获取工种代码列表失败:", err);
        });
    },
    // 加载工种代码分页数据
    loadJobCodePage(page) {
      const start = (page - 1) * this.jobCodePagination.pageSize;
      const end = page * this.jobCodePagination.pageSize;
      const pageData = this.jobCodeOptions.slice(start, end);

      if (page === 1) {
        this.jobCodeFilteredOptions = pageData;
      } else {
        this.jobCodeFilteredOptions = [
          ...this.jobCodeFilteredOptions,
          ...pageData,
        ];
      }

      this.jobCodePagination.page = page;
      this.jobCodePagination.hasMore = end < this.jobCodeOptions.length;
    },
    // 加载更多工种代码
    loadMoreJobCode() {
      if (this.jobCodeLoadingMore || !this.jobCodePagination.hasMore) return;

      this.jobCodeLoadingMore = true;
      // 模拟异步加载效果
      setTimeout(() => {
        this.loadJobCodePage(this.jobCodePagination.page + 1);
        this.jobCodeLoadingMore = false;
      }, 300);
    },
    // 工种代码下拉框显示状态变化
    handleJobCodeVisibleChange(visible) {
      if (visible) {
        // 下拉框打开时，如果没有搜索关键字，重置为第一页
        if (!this.jobCodeSearchQuery) {
          this.jobCodePagination.page = 1;
          this.jobCodePagination.hasMore =
            this.jobCodeOptions.length > this.jobCodePagination.pageSize;
        }
      }
    },
    // 工种代码选择变化
    handleJobCodeChange(value) {
      if (value) {
        // 根据选中的code查找对应的name
        const selectedItem = this.jobCodeOptions.find(
          (item) => item.code === value
        );
        if (selectedItem) {
          this.occupationalForm.jobName = selectedItem.name;
        }
      } else {
        this.occupationalForm.jobName = "";
      }
    },
    // 过滤工种代码
    filterJobCode(query) {
      this.jobCodeSearchQuery = query;
      if (query !== "") {
        this.jobCodeLoading = true;
        setTimeout(() => {
          this.jobCodeLoading = false;
          // 根据输入关键字过滤，最多显示200条
          this.jobCodeFilteredOptions = this.jobCodeOptions
            .filter((item) => {
              return (
                item.name.toLowerCase().indexOf(query.toLowerCase()) > -1 ||
                item.code.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            })
            .slice(0, 200);
        }, 200);
      } else {
        // 空查询时重置为第一页
        this.loadJobCodePage(1);
      }
    },
    // 获取危害因素列表
    getHazardFactorList() {
      company_archives
        .GetOccupationTreeList({ category: "HarmFactor" })
        .then((res) => {
          console.log("危害因素：", res);
          if (res.code == 200) {
            this.hazardFactorOptions = res.result || [];
            // 将数据转换为级联格式
            this.hazardFactorCascaderOptions = this.convertToCascaderData(
              this.hazardFactorOptions
            );
          }
        })
        .catch((err) => {
          console.error("获取危害因素列表失败:", err);
        });
    },
    // 将危害因素数据转换为级联格式
    convertToCascaderData(data) {
      // 找出所有一级节点（parentcode为空或为特定值）
      const topLevel = data.filter(
        (item) =>
          !item.parentcode || item.parentcode === "" || item.parentcode === "0"
      );

      // 递归构建树形结构
      const buildTree = (parentCode) => {
        const children = data.filter((item) => item.parentcode === parentCode);
        return children.map((child) => {
          const node = {
            value: child.code,
            label: child.name,
            code: child.code,
            name: child.name,
          };
          const childNodes = buildTree(child.code);
          if (childNodes.length > 0) {
            node.children = childNodes;
          }
          return node;
        });
      };

      // 构建级联数据
      return topLevel.map((item) => ({
        value: item.code,
        label: item.name,
        code: item.code,
        name: item.name,
        children: buildTree(item.code),
      }));
    },
    // 根据叶子节点code查找级联路径
    findCascaderPathByCode(options, targetCode) {
      for (const option of options) {
        if (option.value === targetCode) {
          return [option.value];
        }
        if (option.children && option.children.length > 0) {
          const childPath = this.findCascaderPathByCode(
            option.children,
            targetCode
          );
          if (childPath.length > 0) {
            return [option.value, ...childPath];
          }
        }
      }
      return [];
    },
    // 获取吸烟情况列表
    getSmokingStatusList() {
      company_archives
        .GetOccupationTreeList({ category: "Smoking" })
        .then((res) => {
          console.log("吸烟情况：", res);
          if (res.code == 200) {
            this.smokingStatusOptions = res.result || [];
          }
        })
        .catch((err) => {
          console.error("获取吸烟情况列表失败:", err);
        });
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
      let data = {
        regid: this.choosePeople.regid,
        titlecode: this.pageSwitch,
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
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: this.$refs.btnApply[0].$attrs["data-remark"],
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
          this.$message.success("操作成功!");
          this.handleCancelApplyPrint();
          if (url) this.dialogVisible = true;
          this.pdfUrl =
            "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
        });
      }
    },
    // 申请单打印 弹框提交回调
    handleSubmitApplyPrint() {
      if (this.choosePrintArr.length === 0) {
        this.$message.warning("请勾选需要打印的组合!");
        return false;
      }
      if (this.$refs.btnApply[0].$el.innerText == "打印申请单") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: this.$refs.btnApply[0].$attrs["data-remark"],
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
          this.$message.success("操作成功!");
          this.handleCancelApplyPrint();
        });
      }
    },
    // 申请单打印 弹框取消回调
    handleCancelApplyPrint() {
      this.applyPrintTree = []; // 打印申请单选择科室数据树
      this.showApplyPrint = false; // 打印申请单选择科室数据树
      this.choosePrintArr = []; // 打印申请单选择科室编码
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
    // 关闭拍照弹框
    handleOnCancel() {
      this.showCanvas = false;
      this.handleStopNavigator(); // 关闭摄像头
      this.handleClearCanvas("canvasCamera"); // 清空画布
    },
    // 完成拍照弹框
    handleOnComplete() {
      this.avatarImg = this.thisCancas.toDataURL("image/png");
      this.personalForm.filebase64 = this.avatarImg.split(",")[1];
      this.showCanvas = false;
      this.handleStopNavigator(); // 关闭摄像头
      this.handleClearCanvas("canvasCamera"); // 清空画布
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
      // 获取图片base64链接
      // this.avatarImg = this.thisCancas.toDataURL("image/png");
      // this.personalForm.filebase64 = this.avatarImg.split(",")[1];
      // let arr = this.avatarImg.split(",")[1];
      // let mime = arr[0].match(/:(.*?);/)[1]; //设置file⽂件流的type名称
      // let suffix = mime.split("/")[1]; //设置file⽂件流的name名称
      // const bstr = window.atob(arr[1]);
      // let n = bstr.length;
      // const u8arr = new Uint8Array(n);
      // while (n--) {
      //   u8arr[n] = bstr.charCodeAt(n);
      // }
      // let file = new File([u8arr], `file.${suffix}`, {
      //   type: mime,
      // });
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
    // 组合项目删除数据
    hadnleDelCombination(item) {
      let val = item.chargeflag;
      let text =
        val == 0
          ? "未收费"
          : val == 1
          ? "已收费"
          : val == 2
          ? "申请退费"
          : "已退费";
      this.$confirm(
        `${item.combinename}【<span style="color:red">${text}</span>】此操作将删除当前项目, 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          dangerouslyUseHTMLString: true,
          type: "warning",
        }
      )
        .then(() => {
          if (this.personalForm.regid) {
            let data = {
              regid: this.personalForm.regid,
              combineCode: item.combinecode,
              detid: item.detid,
            };
            setDeleteCombine(data).then((res) => {
              this.handleGetPersonalDetail(this.personalForm.regid); // 更新详情人员数据
              this.$message({
                type: "success",
                message: "删除成功!",
              });
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
          // let index = this.groupTableData.findIndex(
          //   (k) => k.combinecode == item.combinecode
          // );
          // if (index > -1) {
          //   this.groupTableData.splice(index, 1);
          //   // 体检项目总金额
          //   this.groupPriceTotal = 0;
          //   this.groupPriceEnd = 0;
          //   this.groupTableData.forEach((item) => {
          //     this.groupPriceTotal += item.price;
          //   });
          //   // 体检项目已经缴费金额
          //   this.groupTableData.forEach((item) => {
          //     if (item.chargeflag == 1) {
          //       this.groupPriceEnd += item.price;
          //     }
          //   });
          //   this.personalForm.price = this.groupPriceTotal;
          //   this.personalForm.actPrice = this.groupPriceEnd;
          //   this.hadnleSubmit();
          // }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
      this.personalForm.birthday = `${thieYear - this.personalForm.age}-01-01`;
    },
    handleChangeBirthday() {
      getIdCardInfo({
        cc: this.personalForm.birthday,
        ct: "03",
      }).then((res) => {
        if (!res.result) return;
        this.personalForm.age = res.result.age;
      });
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
          if (item.discountflag === 0) {
            item.discount = this.discountValue;
            item.discountprice = +item.price * +this.discountValue;
          }
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
            this.$message.success(res.message);
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
    // 单项打折键盘↓键回调
    handleDiscountLower(e, data) {
      this.$nextTick(() => {
        if (data.$index === this.groupTableData.length - 1) return;
        let pDom = document.querySelector(`.discount_${data.$index + 1}`);
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 单项打折键盘↑键回调
    handleDiscountUpper(e, data) {
      this.$nextTick(() => {
        if (data.$index === 0) return;
        let pDom = document.querySelector(`.discount_${data.$index - 1}`);
        if (!pDom) return;
        pDom.focus();
      });
    },
    // 单个打折确认回调
    handleAloneDiscount(item) {
      if (!item) return;
      if (this.discountProperty.length != 2) {
        this.$message.warning("当前用户暂无打折权限!");
        item.discount = this.tempDiscount;
        return false;
      }
      if (this.discountProperty.length === 2) {
        let min = +this.discountProperty[0];
        let max = +this.discountProperty[1];
        if (+item.discount < min || +item.discount > max) {
          this.$message.warning("超出当前用户打折范围!");
          item.discount = this.tempDiscount;
          return false;
        }
      }
      if (item.discount == this.tempDiscount) return;
      if (!this.personalForm.regid) return;
      setDiscount({
        regid: this.personalForm.regid,
        discount: +item.discount,
        combinecodeitems: [item.combinecode],
      })
        .then((res) => {
          if (res.code == 200) {
            // this.toUpdateDiscId = item.combinecode;
            this.$message.success(res.message);
            this.handleGetPersonalDetail(this.personalForm.regid);
          } else {
            this.$message.error(res.message);
            this.handleGetPersonalDetail(this.personalForm.regid);
          }
        })
        .catch(() => {
          this.handleGetPersonalDetail(this.personalForm.regid);
        });
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
      this.discountValue = 1;
      // this.discountValue = this.groupTableData[0].discount * 100;
      this.discount = true;
    },
    // 折扣弹框关闭回调
    handleCloseDiscount() {
      this.discount = false;
    },
    // 收费确认回调
    handleSetChargeConfirm() {
      if (
        this.cardDetail &&
        +this.chargeItems.discounttotal > +this.cardDetail.remainingamount
      ) {
        this.$confirm(`实际缴费金额大于体检卡现有余额，是否继续缴费?`, "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          dangerouslyUseHTMLString: true,
          type: "warning",
        })
          .then(() => {
            this.handleSetChargeConfirmFun();
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.handleSetChargeConfirmFun();
      }
    },
    handleSetChargeConfirmFun() {
      let data = {
        regid: this.personalForm.regid,
        paytype: (this.chargeItems && this.chargeItems.paymenttype) || "",
      };
      if ((this.cardAccount || this.cardPassword) && !this.cardDetail) {
        this.$message.warning("请先检索卡信息!");
        return;
      } else if ((this.cardAccount || this.cardPassword) && this.cardDetail) {
        data["cardno"] = this.cardAccount;
        data["cardPassword"] = this.cardPassword;
      }
      setChargeConfirm(data)
        .then((res) => {
          this.$message.success(res.message);
          this.handleCloseChargeDetails();
        })
        .catch(() => {
          this.handleCloseChargeDetails();
        });
    },
    // 取消收费按钮回调
    handleSetAllChargeCancel() {
      if (this.groupTableData.length === 0) {
        this.$message.warning("请选择需退费组合!");
        return;
      }
      setChargeCancel({
        regid: this.personalForm.regid,
        cancletype: "All",
        combinecodeitems: this.groupTableData.map((k) => {
          return k.combinecode;
        }),
      })
        .then((res) => {
          this.$message.success(res.message);
          this.handleCloseChargeDetails();
        })
        .catch(() => {
          this.handleCloseChargeDetails();
        });
    },
    // 收费取消回调
    handleSetChargeCancel() {
      if (this.selectSharge.length === 0) {
        this.$message.warning("请勾选需退费组合!");
        return;
      }
      setChargeCancel({
        regid: this.personalForm.regid,
        combinecodeitems: this.selectSharge,
      })
        .then((res) => {
          this.$message.success(res.message);
          // this.handleCloseChargeDetails();
          this.handleChargePage();
        })
        .catch(() => {
          // this.handleCloseChargeDetails();
          this.handleChargePage();
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
          {
            key: "sourcetype",
            value: this.personalForm.checkno,
          }
        ];
        getPersonalRegisterList({
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
          if (!res.result) return;
          this.intellectData = res.result.setmealitems;
          this.intellectDataCb = res.result.combineitems;
        });
        this.intellect = true;
      }
    },
    // 智能推荐弹框关闭回调
    handleCloseIntellect() {
      this.intellectData = [];
      this.intellectDataCb = [];
      this.intellectSelect = null;
      this.intellectSelectCb = [];
      this.intellect = false;
    },
    // 智能推荐确认回调
    handleSubmitIntellect() {
      if (!this.intellectSelect && this.intellectSelectCb.length == 0) {
        this.$message.warning("至少需要选中一个套餐/组合!");
        return false;
      }
      let resData = [];
      if (this.intellectSelect) {
        resData.push(
          ...this.intellectSelect.combineitems.map((k) => {
            return {
              ...k,
              qty: 1,
              setmealcode: this.intellectSelect.setmealcode,
              setmealname: this.intellectSelect.setmealname,
            };
          })
        );
      }
      resData.push(
        ...this.intellectSelectCb.map((k) => {
          return {
            ...k,
            qty: 1,
          };
        })
      );
      this.groupPriceTotal = 0;
      this.groupTableData = resData;
      this.personalForm.combineitems = resData; // 赋值对象中
      localStorage.setItem("groupTableData", JSON.stringify(resData));
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
    handleSelectIntellect(row) {
      this.intellectSelect = row;
    },
    // 智能推荐数据复选选中回调
    handleSelectIntellectcb(arr) {
      this.intellectSelectCb = arr;
    },
    // 历史项目表格选中数据回调
    handleCheckhRow(row) {
      getPersonalDetail({
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
    handleCheckGroup(value) {
      let select = this.groupitems.filter((k) => k.code == value)[0] || "";
      select && (this.checkGroup = select);
      select &&
        getDetailedList({
          groupid: select.id,
        }).then((res) => {
          if (res.result && res.result.length > 0) {
            !this.personalForm.checktype &&
              (this.personalForm.checktype = res.result[0].checktype);
            this.groupTableData = res.result.map((k) => {
              return {
                ...k,
                price: k.originalprice,
                settlementtype: k.settlementtype != 0 ? 1 : 0,
              };
            });
            this.groupPriceTotal = 0;
            // 体检项目总金额
            this.groupTableData.forEach((item) => {
              this.groupPriceTotal += item.price;
            });
          }
        });
    },
    // 历史信息表格复制体检号回调
    handleHistoryCopy(row, column) {
      if (column.label === "体检号") {
        var input = document.createElement("input"); // 创建input对象
        input.value = row.regid; // 设置复制内容
        document.body.appendChild(input); // 添加临时实例
        input.select(); // 选择实例内容
        document.execCommand("Copy"); // 执行复制
        document.body.removeChild(input); // 删除临时实例
        this.$message.success("成功复制体检号!");
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
      // getPersonalDetail({
      //   regid: row.regid,
      // }).then((res) => {
      // this.groupTableData = res.result.combineitems;
      // res.result.combineitems.forEach((k) => {
      //   this.groupPriceTotal += k.price;
      // });
      // });
      let data = row;
      this.personalForm = data;
      this.personalForm.ageunit = "";
      // 年龄单位列表 / 回显值
      this.agearr = data.ageunititems;
      this.personalForm.idtype = "01";
      this.personalForm.ageunit =
        data.ageunititems.filter((k) => k.selected)[0] &&
        data.ageunititems.filter((k) => k.selected)[0].code;
      // 婚姻状态列表 /  回显值
      this.marriagearr = data.marriageitem;
      this.personalForm.marriage =
        (data.marriageitem.filter((k) => k.selected)[0] &&
          data.marriageitem.filter((k) => k.selected)[0].code) ||
        "其他";
      // 检查类型列表 - 使用 OccupationCheckType 接口获取的数据，不再从详情接口获取
      // this.checktypeitems = data.checktypeitems;
      // 回显体检类型选中值
      const selectedCheckType = this.checktypeitems.filter((k) => k.selected)[0];
      this.personalForm.checktype = selectedCheckType ? selectedCheckType.code : "";
      // 下拉单位列表 /  回显值
      // this.companyitems = data.companyitems;
      // this.batchitems = data.batchitems;
      // this.groupitems = data.groupitems;
      // let company = data.companyitems.filter((k) => k.selected)[0];
      // let batch = data.batchitems.filter((k) => k.selected)[0];
      // let group = data.groupitems.filter((k) => k.selected)[0];
      // this.personalForm.companycode = company && company.code;
      // this.personalForm.companyname = company && company.name;
      // this.personalForm.batch = batch && batch.code;
      // this.personalForm.groupcode = group && group.code;
      this.personalForm.fileid
        ? this.handleGetFiles()
        : (this.avatarImg = require("./images/lin.jpg"));
      this.handleCloseHistory();
      this.personalForm.regid = ""; // 体检号保持为空
    },
    // 历史信息表格选中人员回调
    handleOutpatientCheck(row) {
      if (!row) return;
      Object.keys(row).forEach((k) => {
        if (k != "checktype") {
          this.personalForm[k] = row[k];
        }
      });
      if (!this.personalForm.idtype && this.personalForm.idcard) {
        this.personalForm.idtype = "01";
      }
      this.handleCloseOutpatient();
      this.personalForm.regid = ""; // 体检号保持为空
    },
    // 身份证、姓名、性别获取历史信息回调
    handleGetRegisterInfo() {
      getRegisterInfo({
        idcard: this.personalForm.idcard || this.healthCard,
        name: this.personalForm.name || "",
        sex: this.personalForm.sex,
      }).then((res) => {
        // if (res.count > 1) {
        if (res.count == 0) return false;
        this.historyData = res.result;
        this.historyShow = true;
        // }
        //  else {
        //   let data = res.result[0];
        //   this.personalForm = data;
        //   this.personalForm.ageunit = "";
        //   // 年龄单位列表 / 回显值
        //   this.agearr = data.ageunititems;
        //   this.personalForm.ageunit =
        //     data.ageunititems.filter((k) => k.selected)[0] &&
        //     data.ageunititems.filter((k) => k.selected)[0].code;
        //   // 婚姻状态列表 /  回显值
        //   this.marriagearr = data.marriageitem;
        //   this.personalForm.marriage =
        //     (data.marriageitem.filter((k) => k.selected)[0] &&
        //       data.marriageitem.filter((k) => k.selected)[0].code) ||
        //     "其他";
        //   // 检查类型列表 / 回显值
        //   this.checktypeitems = data.checktypeitems;
        //   this.personalForm.checktype =
        //     (data.checktypeitems.filter((k) => k.selected)[0] &&
        //       data.checktypeitems.filter((k) => k.selected)[0].code) ||
        //     "";

        //   this.personalForm.fileid = data.fileid;
        //   this.personalForm.fileid && this.handleGetFiles(); // 获取头像文件
        // }
      });
    },
    // 历史信息表格选中人员关闭
    handleCloseHistory() {
      this.historyShow = false;
      this.historyData = [];
    },
    // 门诊卡表格选中人员关闭
    handleCloseOutpatient() {
      this.showOutpatient = false;
      this.outpatientData = [];
    },
    // id获取文件回调
    handleGetFiles() {
      getFiles({ Id: this.personalForm.fileid }).then((res) => {
        this.avatarImg = res.result.fileUrl;
      });
    },
    // 点击保存提交回调
    hadnleSubmit() {
      this.loadingBtn = true;
      this.message = "basic";
      if (!this.personalForm.telephone) {
        this.$confirm(`请填写电话号码!`, "系统提示", {
          confirmButtonText: "去填写",
          cancelButtonText: "否,直接保存",
          showConfirmButton: true,
          closeOnClickModal: false,
          showClose: false,
          showCancelButton: true,
          type: "warning",
        })
          .then(() => {
            this.loadingBtn = false;
          })
          .catch(() => {
            this.$nextTick(() => {
              this.$refs["pageform"].validate((valid) => {
                if (valid) {
                  // 身份证和证件类型不允许全都为空
                  if (
                    !this.personalForm.idcard &&
                    (!this.personalForm.idtype ||
                      this.personalForm.idtype == "01")
                  ) {
                    this.$message.warning("身份证为空，证件类型选择其他!");
                    return;
                  }
                  // 图片文件流处理
                  if (
                    this.personalForm.filebase64 &&
                    this.personalForm.filebase64.includes("data:image")
                  ) {
                    let temp = this.personalForm.filebase64.split("base64,");
                    this.personalForm.filebase64 = temp[1];
                  }
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
                  this.$set(
                    this.personalForm,
                    "combineitems",
                    this.groupTableData
                  );
                  // 校验是否有自选项目未填写
                  CheckPreSaveChooseRule(filterSubmit(this.personalForm)).then(
                    (res) => {
                      if (res.code == 200 && res.result) {
                        this.hadnleSubmitSaveApi();
                      } else {
                        this.$confirm(
                          "当前分组包含自选项目,是否继续选择?",
                          "提示",
                          {
                            confirmButtonText: "是",
                            cancelButtonText: "否",
                            showClose: false,
                            type: "warning",
                          }
                        )
                          .then(() => {
                            this.loadingBtn = false;
                          })
                          .catch(() => {
                            this.hadnleSubmitSaveApi();
                          });
                      }
                    }
                  );
                } else {
                  this.loadingBtn = false;
                }
              });
            });
          });
      } else {
        this.$nextTick(() => {
          this.$refs["pageform"].validate((valid) => {
            if (valid) {
              // 身份证和证件类型不允许全都为空
              if (
                !this.personalForm.idcard &&
                (!this.personalForm.idtype || this.personalForm.idtype == "01")
              ) {
                this.$message.warning("身份证为空，证件类型选择其他!");
                return;
              }
              // 图片文件流处理
              if (
                this.personalForm.filebase64 &&
                this.personalForm.filebase64.includes("data:image")
              ) {
                let temp = this.personalForm.filebase64.split("base64,");
                this.personalForm.filebase64 = temp[1];
              }
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
              // 校验是否有自选项目未填写
              CheckPreSaveChooseRule(filterSubmit(this.personalForm)).then(
                (res) => {
                  if (res.code == 200 && res.result) {
                    this.hadnleSubmitSaveApi();
                  } else {
                    this.$confirm(
                      "当前分组包含自选项目,是否继续选择?",
                      "提示",
                      {
                        confirmButtonText: "是",
                        cancelButtonText: "否",
                        showClose: false,
                        type: "warning",
                      }
                    )
                      .then(() => {
                        this.loadingBtn = false;
                      })
                      .catch(() => {
                        this.hadnleSubmitSaveApi();
                      });
                  }
                }
              );
            } else {
              this.loadingBtn = false;
            }
          });
        });
      }
    },
    // 保存真正逻辑方法
    hadnleSubmitSaveApi() {
      setSubmitNew(filterSubmit(this.personalForm))
        .then((res) => {
          this.loadingBtn = false;
          this.groupPriceTotal = 0;
          this.groupPriceEnd = 0;
          // 选中新增数据
          this.currentPage = 1;
          if (this.appointmentData) {
            setAppointmentSave({
              regiditems: [res.result.regid],
              checknoitems: [res.result.checkno],
              selectdate: this.appointmentData.selectdate,
              timeid: this.appointmentData.timeid,
            }).then((result) => {
              this.handleGetPersonalRegisterList("", res.result.regid); // 更新右侧人员数据
              this.checkupWork &&
                this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
              this.$nextTick(() => {
                // this.setmealRadio = res.result.regid;
                this.appointmentData = undefined;
                localStorage.removeItem("groupTableData");
              });
              this.$message("保存成功!");
              this.formFlag = true; // 解除表单限制可编辑
              this.message = "basic"; // 基本信息-basic 其他信息-other
            });
          } else {
            this.handleGetPersonalRegisterList("", res.result.regid); // 更新右侧人员数据
            this.checkupWork && this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
            this.$nextTick(() => {
              // this.setmealRadio = res.result.regid;
              this.appointmentData = undefined;
              localStorage.removeItem("groupTableData");
            });
            this.$message("保存成功!");
            this.formFlag = true; // 解除表单限制可编辑
            this.message = "basic"; // 基本信息-basic 其他信息-other
          }
        })
        .catch((err) => {
          this.loadingBtn = false;
        });
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
        if (!res.result) {
          this.$message.warning("该人员暂无收费信息!");
          return;
        }
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
        this.showChargeDetails = true;
      });
      this.loadingGroup = false;
    },
    // 收费明细弹出层关闭回调
    handleCloseChargeDetails() {
      this.chargeDataList = []; // 收费明细表格主表
      this.chargeTotalPrice = 0; // 收费明细总金额
      this.selectSharge = []; // 收费明细总金额
      this.cardAccount = "";
      this.cardPassword = "";
      this.cardDetail = null;
      this.showChargeDetails = false;
      this.handleGetPersonalDetail(this.personalForm.regid);
    },
    // 套餐弹框关闭回调
    handleCloseSetMealOnly(value) {
      this.dialogFlag = value;
      this.showSetMealDialog = false;
    },
    // 组合弹框关闭回调
    handleCloseCmbineOnly(value) {
      this.dialogFlag = value;
      this.showCmbine = false;
    },
    // 子组件添加项目提交回调
    handleProjectSubmit(obj) {
      let data = obj[0];
      let dialogFlag = obj[1];
      let delArr = [];
      // if (dialogFlag === "combine") {
      if (this.groupTableData.length > 0) {
        delArr = data;
        data = [...this.groupTableData, ...data];
      }
      // }
      if (this.pageState === "edit") {
        /* this.$set(this.personalForm, "combineitems", data); */
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
        })
          .then(async (res) => {
            this.$message("操作成功!");
            this.groupPriceTotal = 0;
            this.groupPriceEnd = 0;
            // 选中新增数据
            this.currentPage = 1;
            this.CmbineOnlyloading = true;
            this.showCmbine = false;
            await this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
            this.$nextTick(() => {
              this.setmealRadio = res.result.regid;
              localStorage.removeItem("groupTableData");
              dialogFlag === "combine" && (this.showCmbine = true);
            });
            this.pageState = "edit"; // 当前页面状态 add edit preview
            this.showProjectDialog = false; // 关闭窗口
          })
          .catch((err) => {
            this.showCmbine = false;
            for (let i = 0; i < this.groupTableData.length; i++) {
              if (this.groupTableData[i].combinecode == delArr[0].combinecode) {
                this.groupTableData.splice(i, 1);
              }
            }
            this.$nextTick(() => {
              dialogFlag === "combine" && (this.showCmbine = true);
            });
          });
      } else {
        if (dialogFlag == "setmeal") {
          if (data.length > 0) {
            this.submitArr = data;
            let setmealcode = [];
            let setmealtype = [];
            for (let i = 0; i < data.length; i++) {
              setmealcode.push(data[i].setmealcode);
              setmealtype.push(data[i].setmealtype);
            }
            LoadSetmealCombineList({
              setmealcode: setmealcode.join("|"),
              setmealtype: setmealtype.join("|"),
              ischeck: 1,
            }).then((res) => {
              if (!res.result) return;
              let dataTemp = res.result.map((item) => {
                return {
                  detid: "",
                  regid: "",
                  setmealcode: data[0].setmealcode,
                  setmealname: data[0].setmealname,
                  combinecode: item.combinecode,
                  combinename: item.combinename,
                  deptcode: item.deptcode,
                  deptname: item.deptname,
                  operatorname: this.name,
                  operatordate: new Date(+new Date() + 8 * 3600 * 1000)
                    .toJSON()
                    .substr(0, 16)
                    .replace("T", " "),
                  price: item.originalprice || item.price || 0,
                  discount: item.discount || 1,
                  discountflag: item.discountflag,
                  discountprice: item.discountprice || item.price || 0,
                  deptseqno: item.deptseqno || 0,
                  settlementtype: item.settlementtype != 0 ? 1 : 0,
                };
              });
              this.handleAddSaveGroupTableData(dataTemp, dialogFlag);
            });
          }
        } else {
          this.handleAddSaveGroupTableData(data, dialogFlag);
        }
      }
    },
    handleAddSaveGroupTableData(data, dialogFlag) {
      let temp = [...this.groupTableData];
      for (let i = 0; i < data.length; i++) {
        let index = this.groupTableData.findIndex(
          (k) => k.combinecode === data[i].combinecode
        );
        index == -1 && temp.push(data[i]);
      }
      let collectData = {
        setmealcode:
          dialogFlag == "combine" ? temp[0].setmealcode : data[0].setmealcode,
        setmealname:
          dialogFlag == "combine" ? temp[0].setmealname : data[0].setmealname,
        companycode: this.personalForm.companycode || "",
        batch: this.personalForm.batch || "",
        groupcode: this.personalForm.groupcode || "",
        combinecodeitems: temp.map((k) => {
          return `${k.combinecode}合管${k.liscuv || ""}`;
        }),
        combineotheritems: temp.map((k) => {
          return {
            combinecode: k.combinecode,
            settlementtype: k.settlementtype != 0 ? 1 : 0,
            discount: k.discount || 1,
          };
        }),
      };
      CollectChargeInfoForNotSaveByFix(collectData)
        .then((res) => {
          if (!res.data) return;
          let resDataArr = res.data.map((k) => {
            return {
              ...k,
              settlementtype: k.settlementtype != 0 ? 1 : 0,
            };
          });
          resDataArr = resDataArr.sort(function (a, b) {
            return b.sortindex - a.sortindex;
          });
          this.personalForm.combineitems = resDataArr; // 赋值对象中
          this.groupTableData = resDataArr; // 赋值对象中
          this.groupPriceTotal = 0;
          localStorage.setItem("groupTableData", JSON.stringify(resDataArr));
          // 体检项目总金额
          this.groupTableData.forEach((item) => {
            this.groupPriceTotal += item.price;
          });
          // 赋值套餐列表
          this.groupTableData = resDataArr;
          // 体检项目已经缴费金额
          this.groupTableData.forEach((item) => {
            if (item.chargeflag == 1) {
              this.groupPriceEnd += item.price;
            }
          });
          this.showProjectDialog = false; // 关闭窗口
        })
        .catch(() => {
          this.showProjectDialog = false; // 关闭窗口
        });
    },
    // 点击选择项目分组回调
    handleSelectGroup() {
      // this.groupTableData = this.groupTableData.filter((k) => {
      //   return k.dedflag !== 1;
      // });
      this.showProjectDialog = true;
    },
    // 点击选择套餐回调
    handleSelectSetMeal() {
      this.showSetMealDialog = true;
    },
    // 点击选择组合回调
    handleSelectCmbine() {
      this.CmbineOnlyloading = true;
      this.showCmbine = true;
    },
    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      if (!val) {
        this.personalForm.batch = "";
        this.personalForm.groupcode = "";
        this.personalForm.reporttake = "现场自取";
        return false;
      }
      let data = this.companyitems.filter((k) => k.code == val)[0];
      if (data) {
        this.personalForm.companyname = data.name;
      }
      this.personalForm.reporttake = "单位领取";
      this.hadnleGetBatchOrGroup();
    },
    // 下拉选中批次号触发回调
    handleSelectBatch(val) {
      let data = this.batchitems.filter((k) => k.code == val)[0];
      if (data) {
        this.groupitems = Object.assign([], data.groupitems);
      }
    },
    // 点击新增按钮回调
    handleCreate() {
      this.pageState = "add"; // 当前编辑状态
      this.healthCard = ""; // 清空身份证栏目
      this.formFlag = false; // 解除表单限制可编辑
      this.groupdis = false; // 解除团检表单限制可编辑
      this.groupTableData = []; // 清空套餐数组
      this.setmealRadio = ""; // 清空选中编辑对象
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.choosePeople = undefined; // 新增重置选中人员
      this.submitArr = []; // 新增重置新开单弹框多选套餐组件
      localStorage.removeItem("groupTableData");
      this.avatarImg = require("./images/lin.jpg");
      // 聚焦身份证框
      this.$nextTick(() => {
        if (this.healthcardcode == "idcard") {
          this.$refs.read_idcard.focus();
        } else {
          this.$refs.read_healthcard.focus();
        }
      });
      this.handlePersonalFormReset(); // 重置表单对象
      this.handleGetDetail(); // 获取下拉数据
    },
    // 获取个人登记明细/详情/新增回调
    handleGetPersonalDetail(regid) {
      this.loading = true;
      getPersonalDetail({
        regid,
      }).then((res) => {
        let data = res.result;
        this.choosePeople = res.result;
        this.personalForm = data;
        this.pageState = "edit";
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
        // 检查类型列表 - 使用 OccupationCheckType 接口获取的数据，不再从详情接口获取
        // this.checktypeitems = data.checktypeitems;
        // 回显体检类型选中值
        const selectedCheckType2 = this.checktypeitems.filter((k) => k.selected)[0];
        this.personalForm.checktype = selectedCheckType2 ? selectedCheckType2.code : "";
        // 下拉单位列表 /  回显值
        this.companyitems = data.companyitems;
        this.batchitems = data.batchitems;
        this.groupitems = data.groupitems;
        let company = data.companyitems.filter((k) => k.selected)[0];
        let batch = data.batchitems.filter((k) => k.selected)[0];
        let group = data.groupitems.filter((k) => k.selected)[0];
        this.personalForm.companycode = company && company.code;
        this.personalForm.companyname = company && company.name;
        this.personalForm.batch = batch && batch.code;
        this.personalForm.groupcode = group && group.code;
        if (this.personalForm.companycode && this.personalForm.batch) {
          this.hadnleGetBatchOrGroup(this.personalForm.batch);
        }
        // 职业病危害因素
        this.harmitems = data.harmitems;
        let harm = data.harmitems.filter((k) => k.selected)[0];
        this.personalForm.harmcode = harm && harm.code;
        this.personalForm.harmname = harm && harm.name;
        // 职业病行业类型
        this.industryitems = data.industryitems;
        let industry = data.industryitems.filter((k) => k.selected)[0];
        this.personalForm.industrytypecode = industry && industry.code;
        this.personalForm.industrytypename = industry && industry.name;
        // 职业病工种
        this.workitems = data.workitems;
        let work = data.workitems.filter((k) => k.selected)[0];
        this.personalForm.worktypecode = work && work.code;
        this.personalForm.worktypename = work && work.name;
        // 赋值套餐列表 在这里
        data.combineitems = data.combineitems.sort(function (a, b) {
          return a.combineSeqno - b.combineSeqno;
        });
        this.groupTableData = data.combineitems;
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
        // if (this.toUpdateDiscId !== "") {
        //   let index = data.combineitems.filter(
        //     (k) => k.combinecode === this.toUpdateDiscId
        //   )[0];
        //   index && (this.tempDiscount = index.discount * 100);
        //   this.toUpdateDiscId = "";
        // }
        if (this.isGuideSingle) {
          this.handlePrintGuideSingle(); // 打印指引单
        }
      });
    },
    // 新增获取个人登记明细/详情/新增回调
    handleGetDetail() {
      getPersonalDetail().then((res) => {
        let {
          ageunititems,
          checktypeitems,
          companyitems,
          marriageitem,
          harmitems,
          industryitems,
          workitems,
        } = res.result;
        this.agearr = ageunititems;
        // this.checktypeitems = checktypeitems; // 使用 OccupationCheckType 接口获取的数据
        this.marriagearr = marriageitem;
        this.companyitems = companyitems;
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
        // 检查类型列表 - 使用 OccupationCheckType 接口获取的数据，不再从详情接口获取
        // this.checktypeitems = checktypeitems;
        // 回显体检类型选中值
        const selectedCheckType3 = this.checktypeitems.filter((k) => k.selected)[0];
        this.personalForm.checktype = selectedCheckType3 ? selectedCheckType3.code : "";
        // 下拉单位列表 /  回显值
        this.companyitems = companyitems;
        let company = companyitems.filter((k) => k.selected)[0];
        this.personalForm.companycode = company && company.code;
        this.personalForm.companyname = company && company.name;
        // 职业病危害因素
        this.harmitems = harmitems;
        let harm = harmitems.filter((k) => k.selected)[0];
        this.personalForm.harmcode = harm && harm.code;
        this.personalForm.harmname = harm && harm.name;
        // 职业病行业类型
        this.industryitems = industryitems;
        let industry = industryitems.filter((k) => k.selected)[0];
        this.personalForm.industrytypecode = industry && industry.code;
        this.personalForm.industrytypename = industry && industry.name;
        // 职业病工种
        this.workitems = workitems;
        let work = workitems.filter((k) => k.selected)[0];
        this.personalForm.worktypecode = work && work.code;
        this.personalForm.worktypename = work && work.name;
      });
    },
    // 获取团检批次和分组回调
    hadnleGetBatchOrGroup(batchVal) {
      getBatchOrGroup({
        companycode: this.personalForm.companycode,
        batch: batchVal || "",
      })
        .then((res) => {
          let { batchitems, groupitems } = res.result;
          this.batchitems = batchitems;
          if (batchVal) {
            let batch =
              batchitems.filter((k) => k.code == batchVal)[0] || batchitems[0];
            batch && (this.personalForm.batch = batch.code);
            this.groupitems = batch.groupitems;
          } else {
            let batch =
              batchitems.filter((k) => k.selected)[0] || batchitems[0];
            batch && (this.personalForm.batch = batch.code);
            this.groupitems = batch.groupitems;
          }
        })
        .catch((err) => {});
    },
    // 收入检索身份证/条件号等回调
    handleInputWork() {
      this.currentPage = 1;
      this.handleGetPersonalRegisterList();
      // this.checkupWork = "";
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
      this.healthCard = ""; // 清空身份证栏目
      // this.checkupWork = row.regid; // 清空身份证栏目
      this.choosePeople = Object.assign({}, row);
      this.handleGetPersonalDetail(this.choosePeople.regid);
      this.pageState = "edit"; // 当前编辑状态
      this.message = "basic"; // 基本信息-basic 其他信息-other
      this.avatarImg = require("./images/lin.jpg");
      this.formFlag = true; // 解除表单限制可编辑

      this.clearOccupationalData();
    },
    handleCompanycodeChange() {
      this.handleGetPersonalRegisterList();
    },
    // 获取个人登记列表回调
    handleGetPersonalRegisterList(pageflag, regid) {
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
      if (this.persontype) {
        whereitems.push({
          key: "persontype",
          value: this.persontype,
        });
        whereitems.push({
          key: "sourcetype",
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
      getPersonalRegisterList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.count = res.count;
          this.conditionData = res.data;
          this.loadingCondition = false;
          this.choosePeople && (this.setmealRadio = this.choosePeople.regid);
          if (regid) {
            this.setmealRadio = regid;
          } else if (res.data.length == 1 && !regid) {
            this.setmealRadio = res.data[0].regid;
            this.handleGetPersonalDetail(res.data[0].regid);
          }
          // this.checkupWork = "";
        })
        .catch((err) => {
          this.count = 0;
          // this.checkupWork = "";
          this.conditionData = [];
          this.loadingCondition = false;
        });
    },
    // 重置表单对象
    handlePersonalFormReset() {
      this.personalForm = {
        regid: "",
        checkno: "",
        healthcard: "",
        name: "",
        sex: 0,
        age: 0,
        ageunit: "岁",
        marriage: "未知",
        checktype: "",
        birthday: new Date(),
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
        reporttake: "现场自取",
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
        checkobjectivecode: "",
        registerconclusion: "",
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
    // 点击读卡回调 身份证/健康卡 2082
    async handleCardReading() {
      if (this.healthcardcode == "idcard") {
        if (this.cardReaderFlag == "华视") {
          this.handleReadCardHuaShi(); // 华视读卡
        } else if (this.cardReaderFlag == "精伦") {
          this.handleReadCardJingLun(); // 精伦读卡
        } else if (
          this.cardReaderFlag == "新中新" ||
          this.cardReaderFlag == "中控"
        ) {
          this.handleReadCardXinZhongXin(); // 精伦读卡
        } else if (this.cardReaderFlag == "因纳伟盛") {
          this.handleReadCardYinNaWeiSheng(); // 因纳伟盛
        }
      } else {
        if (!this.healthCard) return false;
        getPatientInfo({
          patId: this.healthCard,
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
            this.healthCard = "";
          })
          .catch((err) => {
            this.healthCard = "";
          });
      }
      //this.handleGetDetail(); // 获取下拉数据
    },
    // 华视读卡
    handleReadCardHuaShi() {
      this.handleConnectIdcard();
      let url = `http://127.0.0.1:19196/readcard&picpath=D:/1/123.bmp&t=${Math.random()}`;
      this.$axios
        .get(url)
        .then(async (res) => {
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
            this.healthCard = data.certNumber;
            this.personalForm.age = year - data.bornDay.slice(0, 4);
            this.personalForm.filebase64 = data.identityPic;
            this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            await setUpdatePatientInfo({
              query_key: this.personalForm.idcard,
              name: this.personalForm.name,
              sex: data.gender,
              birthday: this.personalForm.birthday,
              idcard: this.personalForm.idcard,
              telephone: "",
              address: this.personalForm.address,
              age: +this.personalForm.age,
            });
            this.handleHealthCard();
            // this.handleGetRegisterInfo();
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
      let url = `http://127.0.0.1:18889/api/readCert`;
      this.$axios
        .get(url)
        .then(async (res) => {
          if (res.data.resultFlag == 0) {
            let data = res.data.resultContent;
            let date = new Date();
            let year = date.getFullYear();
            this.personalForm.name = data.partyName;
            this.personalForm.address = data.certAddress;
            this.personalForm.sex = data.gender;
            this.personalForm.birthday = data.bornDay.replace(
              /^(\d{4})(\d{2})(\d{2})$/,
              "$1-$2-$3"
            );
            this.personalForm.idcard = data.certNumber;
            this.healthCard = data.certNumber;
            this.personalForm.age = year - data.bornDay.slice(0, 4);
            this.personalForm.filebase64 = data.identityPic;
            this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
            await setUpdatePatientInfo({
              query_key: this.personalForm.idcard,
              name: this.personalForm.name,
              sex: data.gender == 0 ? "未知" : data.gender == 1 ? "男" : "女",
              birthday: this.personalForm.birthday,
              idcard: this.personalForm.idcard,
              telephone: "",
              address: this.personalForm.address,
              age: +this.personalForm.age,
            });
            this.handleHealthCard();
            // this.handleGetRegisterInfo();
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
      let url = `http://localhost:8989/api/ReadMsg?waitTime=3`;
      this.$axios
        .get(url)
        .then(async (res) => {
          if (res.data) {
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
            this.healthCard = data.cardno;
            this.personalForm.age = year - data.born.slice(0, 4);
            this.personalForm.filebase64 = data.photobase64;
            this.avatarImg = `data:image/jpeg;base64,${data.photobase64}`;
            await setUpdatePatientInfo({
              query_key: this.personalForm.idcard,
              name: this.personalForm.name,
              sex: data.sex,
              birthday: this.personalForm.birthday,
              idcard: this.personalForm.idcard,
              telephone: "",
              address: this.personalForm.address,
              age: +this.personalForm.age,
            });
            this.handleHealthCard();
            // this.handleGetRegisterInfo();
          } else {
            this.$message.warning(`${res.data.retmsg}，请联系管理员!`);
          }
        })
        .catch((err) => {
          this.$message.warning(err);
        });
    },
    // 因纳伟盛读卡
    handleReadCardYinNaWeiSheng() {
      let _this = this;
      let url = `http://localhost:8099/?cmd=readCard`;
      $.ajax({
        url: "http://localhost:8099/?cmd=readCard&charset=utf8",
        type: "get",
        cache: false,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "fnCallback",
        success: function (res) {
          let data = res.resultContent;
          let date = new Date();
          let year = date.getFullYear();
          _this.personalForm.name = data.partyName;
          _this.personalForm.address = data.certAddress;
          _this.personalForm.sex =
            data.gender == 1 ? 1 : data.gender == 0 ? 2 : 0;
          _this.personalForm.birthday = data.bornDay.replace(
            /^(\d{4})(\d{2})(\d{2})$/,
            "$1-$2-$3"
          );
          _this.personalForm.idcard = data.certNumber;
          _this.healthCard = data.certNumber;
          _this.personalForm.age = year - data.bornDay.slice(0, 4);
          _this.personalForm.filebase64 = data.identityPic;
          _this.avatarImg = `data:image/jpeg;base64,${data.identityPic}`;
          setUpdatePatientInfo({
            query_key: _this.personalForm.idcard,
            name: _this.personalForm.name,
            sex: data.sex,
            birthday: _this.personalForm.birthday,
            idcard: _this.personalForm.idcard,
            telephone: "",
            address: _this.personalForm.address,
            age: +_this.personalForm.age,
          });
          _this.handleHealthCard();
        },
        complete: function () {
          //clearForm();
        },
        error: function (err) {
          alert("error");
        },
      });
    },
    // 身份证搜索框回车
    handleEnterIdcard() {
      // this.handleGetRegisterInfo();
      this.handleHealthCard();
    },
    // 获取读卡接口返回
    handleHealthCard() {
      if (!this.healthCard) return false;
      getPatientInfo({
        patId: this.healthCard,
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
          } else if (res.result.length > 1) {
            this.outpatientData = res.result;
            this.showOutpatient = true;
          }
          this.healthCard = "";
        })
        .catch((err) => {
          this.healthCard = "";
        });
    },
    handleConnectIdcard() {
      if (this.cardReaderFlag == "华视") {
        let url = `http://127.0.0.1:19196/OpenDevice&t=${Math.random()}`;
        this.$axios.get(url).then((res) => {
          this.$message.success(res.data.errorMsg);
        });
      } else if (this.cardReaderFlag == "精伦") {
        //创建读卡控件
        let url = `http://127.0.0.1:18889/api/connect`;
        this.$axios.post(url).then((res) => {
          this.$message.success(res.data.errorMsg);
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
      start.setTime(start.getTime() - 3600 * 1000 * 24 * +this.dateRange);
      this.conditionDate = [this.gettime(start), this.gettime(end)];
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
        // 日期默认为空，不自动设置
        // this.handleGetconditionDate();
      });
    },
    // 体检套餐行点击回调
    handleChecked(row) {},
    // 点击编辑个人列表数据
    handleEditPage() {
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
      this.pageState = "edit";
      this.formFlag = false;
      this.groupdis = false;
    },
    // 点击删除个人列表数据
    hadnleDelList() {
      if (!this.setmealRadio) {
        this.$message.error("至少选中一条需删除数据!");
        return false;
      }
      if (this.choosePeople && this.choosePeople.status !== 0) {
        this.$message.error("当前人员状态不允许删除!");
        return false;
      }
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
      this.healthCard = ""; // 清空身份证栏目
      this.formFlag = true; // 解除表单限制可编辑
      this.groupdis = true; // 解除团检表单限制可编辑
      this.groupTableData = []; // 清空套餐数组
      this.setmealRadio = ""; // 清空选中编辑对象
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.currentPage = 1;
      this.handleGetPersonalRegisterList(); // 获取列表数据
      this.handlePersonalFormReset(); // 重置表单对象
      this.handleGetDetail(); // 获取下拉数据
    },
    // 检索组件提交回调
    handleSearchSubmit(regid) {
      this.checkupWork = regid;
      this.setmealRadio = regid;
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
    // 打印申请单
    handlePrintApply() {
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
      if (tempArr.length === 0) return false;
      let map = new Map();
      for (let item of tempArr) {
        map.set(item.code, item);
      }
      this.applyPrintTree = [...map.values()];
      this.applyPrintTree.forEach((k, i) => {
        this.groupTableData.forEach((item, index) => {
          if (k.code === item.deptcode && item.billprint === 0) {
            k.children.push({
              ...item,
              code: item.combinecode,
              name: item.combinename,
            });
          }
        });
      });
      this.showApplyPrint = true;
    },
    // 打印申请单 - 不需要选择
    handlePrintApplyAuto() {
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
      if (tempArr.length === 0) return false;
      let map = new Map();
      for (let item of tempArr) {
        map.set(item.code, item);
      }
      let printArrTemp = [...map.values()];
      let printArr = [];
      printArrTemp.forEach((k, i) => {
        this.groupTableData.forEach((item, index) => {
          if (k.code === item.deptcode && item.billprint === 0) {
            printArr.push(item.combinecode);
          }
        });
      });
      if (printArr.length > 0) {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: this.$refs.btnApply[0].$attrs["data-remark"],
          printflag: 1,
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
            {
              key: "combinecodesin",
              valueList: printArr,
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
          this.$message.success("操作成功!");
        });
      }
    },
    // 预览方法回调
    handlePreview(domId) {
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
            if (d.$children[0].$el.innerText == "指引单打印") {
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
    // 健康表打印回调
    handlePrintHealthTable() {
      if (!this.choosePeople) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印健康表",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnHealthTable[0];
      if (d.$el.innerText == "健康表打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: d.$attrs["data-remark"],
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
          this.isGuideSingle = false;
        });
      }
    },
    // 打印退费回调
    handleRefundForm() {
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname: `1、退费单`,
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
    },

    // 打印指引单回调
    handlePrintGuideSingle() {
      if (!this.personalForm.regid) {
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
      CheckPreSaveChooseRule(filterSubmit(this.personalForm)).then((res) => {
        if (res.code == 200 && res.result) {
          this.handlePrintGuideSingleSource();
        } else {
          this.$confirm("所属单位自选项目未选择，是否进行打印", "提示", {
            confirmButtonText: "是",
            cancelButtonText: "否",
            showClose: false,
            type: "warning",
          })
            .then(() => {
              this.handlePrintGuideSingleSource();
            })
            .catch(() => {});
        }
      });
    },
    // 打印指引单回调
    handlePrintGuideSingleSource() {
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
        LastProcess({ regid: this.choosePeople.regid, pt: "PrintGuide" }).then(
          (res) => {
            if (!res.result) {
              this.handlePrintGuideSingleDeactivate(d.$attrs["data-remark"]);
            } else {
              this.$confirm(
                `该用户已打印在【${res.result.processdate}】打印过指引单，是否继续打印`,
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              )
                .then(() => {
                  this.handlePrintGuideSingleDeactivate(
                    d.$attrs["data-remark"]
                  );
                })
                .catch(() => {
                  this.$message({
                    type: "info",
                    message: "已取消",
                  });
                });
            }
          }
        );
      }
    },
    handlePrintGuideSingleDeactivate(btnrepname) {
      let tempArr = [];
      for (let i = 0; i < this.groupTableData.length; i++) {
        if (this.groupTableData[i].combineStatus == 1) {
          tempArr.push(this.groupTableData[i].combinename);
        }
      }
      if (tempArr.length > 0) {
        this.$confirm(`${tempArr.join("、")} 项目停用，是否继续打印`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.handlePrintGuideSingleApi(btnrepname);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.handlePrintGuideSingleApi(btnrepname);
      }
    },
    handlePrintGuideSingleApi(btnrepname) {
      let indexP = btnrepname.split("、")[0] + "、";
      let repname = "";
      if (this.personalForm.level == 1) {
        repname = `${indexP}VIP指引单`;
      } else {
        repname = btnrepname;
      }
      let data = {
        fingercode: localStorage.getItem("md5code"),
        codes: [this.choosePeople.regid],
        repname,
        printflag: 1,
        // repname: d.$attrs["data-remark"],
        whereitems: [
          {
            key: "regid",
            value: this.choosePeople.regid,
          },
        ],
      };
      printBase64(data).then((res) => {
        this.isGuideSingle = false;
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
    // 打印指引单回调-同时打印体格表
    handlePrintGuideSingleAdult() {
      if (!this.choosePeople) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印体格单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
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
      if (d.$el.innerText == "指引单打印") {
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
          this.isGuideSingle = false;
        });
      }
    },
    // 打印指引单回调-同时健康证检查表
    handlePrintHealthCertificate() {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: "2、健康检查表",
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
          this.isGuideSingle = false;
        });
      }
    },
    // 打印指引单回调-同时驾驶证检查表
    handlePrintDriversLicense() {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: "2、驾驶检查表",
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
            {
              key: "checkno",
              value: this.choosePeople.checkno,
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
          this.isGuideSingle = false;
        });
      }
    },
    // 打印指引单回调-同时送检单
    handlePrintCensorShip() {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行打印送检单",
          type: "error",
        });
        return false;
      }
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          repname: "2、送检单",
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
          this.isGuideSingle = false;
        });
      }
    },
    // 预览窗口关闭
    handleCloseDialog() {
      this.pdfUrl = "";
      this.dialogVisible = false;
    },
    // 按钮组点击回调
    hadnleOnBtnClicked(domId) {
      console.log(domId);
      switch (domId) {
        case "btnAdd": // 新增
          this.handleCreate();
          break;
        case "btnKeep": // 保存
          this.hadnleSubmit();
          break;
        case "btnBarCode": // 打印条码
          this.handlePrintBarCode();
          break;
        case "btnDel": // 删除
          this.hadnleDelList();
          break;
        case "btnSigninPrint": // 签到并打印指引单
          if (!this.personalForm && !this.personalForm.regid) {
            this.$message.warning("请先选中人员!");
            return;
          }
          this.hadnleSigninPrint();
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
        case "btnAddPayment": // 调查问卷
          if (
            this.choosePeople != undefined &&
            this.choosePeople != null &&
            this.choosePeople != "" &&
            this.choosePeople.regid != undefined &&
            this.choosePeople.regid != null &&
            this.choosePeople.regid != ""
          ) {
            this.handleAddPayment();
          } else {
            this.$message({
              showClose: true,
              message: "请选择人员再进行打印",
              type: "error",
            });
          }
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
        case "btnGuideSingle": // 指引单打印
          this.handlePrintGuideSingle();
          return;
          if (!this.personalForm.regid) {
            this.isGuideSingle = true;
            this.hadnleSubmit();
          } else {
            this.handlePrintGuideSingle();
          }
          break;
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
          this.handlePrintApply();
          break;
        case "btnPhysique": // 打印体格表
          this.handlePrintGuideSingleAdult();
          break;
        case "btnHealthTable": // 健康表打印
          this.handlePrintHealthTable();
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
  watch: {
    condition: {
      handler() {
        this.handleFocuscheckupWorkInput();
      },
      deep: true,
    },
    "personalForm.checktype": {
      handler(newVal, oldVal) {
        return;
        if (this.pageState !== "add") return;
        let chooseType = this.checktypeitems.filter((k) => {
          return k.code === newVal;
        })[0];
        if (!chooseType) return;
        if (!chooseType.unioncode) {
          this.groupTableData = [];
        } else {
          this.handleGetDicSetmealList();
        }
      },
      deep: true,
    },
    // healthCard: {
    //   handler(newVal, oldVal) {
    //     if(newVal.length>30){
    //       this.handleEnterIdcard();
    //     }
    //   },
    // },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/register.scss";
@import "./css/wenjuan.scss";

.tefinish_dia {
  /deep/.el-dialog__header {
    display: none;
  }

  /deep/.el-dialog__body {
    padding: 0px;

    .tetop_userinfo {
      display: flex;
      height: 50px;
      background-color: #ecf5ff;
      justify-content: space-around;
      align-items: center;
      font-size: 18px;
      font-weight: 600;
    }

    .dtmessage {
      box-sizing: border-box;
      padding: 14px;

      .dtm_item {
        display: flex;
        font-size: 18px;

        .sgb {
          font-weight: 600;
        }
      }
    }
  }

  /deep/.el-dialog__footer {
    padding: 0 12px 12px 12px;
    text-align: center;
  }
}

// 裁剪框
.cropper_dia {
  .title {
    font-size: 18px;
    font-weight: bold;
  }

  .subclose {
    display: inline-block;
    margin: 5px 10px;
    color: #0076c8;
    cursor: pointer;
    text-decoration: underline;
  }

  .box_content {
    margin: 30px auto 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .crop_p,
  .pic_p {
    width: 300px;
    height: 372px;
    object-fit: cover;
  }

  .btn {
    display: flex;
    flex-direction: column;
  }

  .btn button {
    margin: 10px 0;
  }
}

.charge_details {
  .table_box {
    height: 500px !important;
  }
}
</style>
