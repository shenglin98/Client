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
          <el-popover
            ref="popoverRefIdc"
            v-if="domIdArr.includes(btn.domId) && btn.domId != 'btnApply'"
            class="print_box"
            placement="bottom"
            trigger="click"
          >
            <el-button
              type="primary"
              plain
              slot="reference"
              :size="size"
              v-bind:key="btn.Id"
              v-bind:data-remark="btn.remark"
              class="filter-item"
              :ref="btn.domId"
              ><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button
            >
            <div class="print_item" @click="hadnleOnBtnClicked(btn.domId)">打印</div>
            <div class="print_item" @click="handlePreview(btn.domId)">预览</div>
          </el-popover>
          <el-button
            type="primary"
            plain
            v-else
            :size="size"
            v-bind:key="btn.Id"
            v-bind:data-remark="btn.remark"
            :ref="btn.domId"
            class="filter-item"
            :loading="loadingBtn"
            @click="hadnleOnBtnClicked(btn.domId)"
            ><i :class="`iconfont icon-${btn.icon}`"></i>{{ btn.name }}</el-button
          >
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
                  <el-radio-group
                    v-model="message"
                    @change="handleRadioButton"
                    size="small"
                    fill="#2a85ea"
                  >
                    <el-radio-button
                      v-for="(item, index) in typelist"
                      :key="index"
                      :label="item.titlecode"
                      >{{ item.titlename }}</el-radio-button
                    >
                  </el-radio-group>
                  <!-- <el-tag v-if="pageState" :type="pageState == 'add' ? 'success' : pageState == 'edit' ? 'warning' : ''" style="margin-left: 100px" size="medium">{{
                  pageState == 'add' ? '新增' : pageState == 'edit' ? '编辑' : '预览'
                }}</el-tag> -->
                  <div class="card_operations" v-if="message == 'basic'">
                    <el-select
                      :disabled="formFlag"
                      v-model="healthcardcode"
                      placeholder="请选择"
                      size="mini"
                      @change="handleSelectHealthcardCheck"
                    >
                      <el-option
                        v-for="item in healthcardArr"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                      >
                      </el-option>
                    </el-select>
                    <!-- <el-popover ref="popoverRefIdc" placement="bottom-start" trigger="click">
                      <div class="content">
                        <div class="content_item" v-for="item in healthcardArr" :key="item.code" @click="handleSelectHealthcardCheck(item)">
                          {{ item.name }}
                        </div>
                      </div>
                      
                      <el-button type="primary" plain size="mini" slot="reference" style="margin-right: 10px">{{ healthcardCheck }}</el-button>
                    </el-popover> -->
                    <input
                      type="text"
                      class="read_card"
                      v-model.lazy="healthCard"
                      ref="read_idcard"
                      v-if="healthcardcode == 'idcard'"
                      @keyup.enter="handleEnterIdcard"
                      :disabled="formFlag"
                    />
                    <input
                      type="text"
                      class="read_card"
                      v-model.lazy="healthCard"
                      ref="read_healthcard"
                      v-else
                      :disabled="formFlag"
                      @keyup.enter="handleCardReading"
                    />
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      @click="handleCardReading"
                      :disabled="formFlag"
                      style="margin-left: 10px"
                      >读卡</el-button
                    >
                  </div>
                  <div
                    class="card_operations"
                    v-if="message != 'basic' && message != 'other'"
                  >
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      icon="el-icon-success"
                      @click="handleSavePage"
                      >保存</el-button
                    >
                    <el-button
                      type="primary"
                      size="mini"
                      plain
                      icon="el-icon-delete"
                      @click="handleDeteleQuestion"
                      >删除</el-button
                    >
                  </div>
                </div>
                <!-- 测试问卷 -->
                <div
                  class="questionnairebox"
                  :class="[pageSwitch == '' ? 'medicalhistory' : '']"
                  v-if="message != 'basic' && message != 'other'"
                >
                  <div
                    class="centent"
                    v-for="item in typelist"
                    :key="item.titlecode"
                    v-show="pageSwitch == item.titlecode ? true : false"
                  >
                    <!-- 病史采集 -->
                    <div v-if="item.titletype == 'MedicalHistory' ? true : false">
                      <div
                        class="card"
                        v-for="item in medicalHistory"
                        :key="item.syscode"
                      >
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
                              val.inputtype == 3 || val.inputtype == 4
                                ? 'content_input'
                                : '',
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
                                          v-if="showMyInput"
                                          :suffix="val"
                                          :disabled="item.editstatus == 1"
                                          :count="
                                            value.content.split('|X|').filter((v) => v)
                                              .length
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
                                            v-for="(val, index) in value.content.split(
                                              ','
                                            )"
                                          >
                                            <myInput
                                              :content="val"
                                              :disabled="val.editstatus == 1"
                                              :draggable="
                                                value.selectvalue != item.selectvalue
                                              "
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
                                            v-if="
                                              [1, 3, 4].indexOf(value.inputtype) !== -1
                                            "
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
                                    <template
                                      v-for="(val, index) in item.itemname.split(',')"
                                    >
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
                                            v-for="(val, index) in item.content.split(
                                              ','
                                            )"
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
                                            v-for="(val, index) in item.content.split(
                                              ','
                                            )"
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
                                            v-for="(val, index) in item.content.split(
                                              ','
                                            )"
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
                    </div>
                  </div>
                </div>
                <!-- 个人信息 -->
                <div v-if="message == 'basic'" class="personal_info">
                  <!-- <div class="head">个人信息</div> -->
                  <!-- 主体表单form -->
                  <div class="info_body">
                    <div class="form_box">
                      <el-form
                        ref="form"
                        :disabled="formFlag"
                        :model="personalForm"
                        :rules="rulePersonalForm"
                        label-width="80px"
                      >
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="体检号">
                              <el-input disabled v-model="personalForm.regid"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item
                              size="mini"
                              label="姓名"
                              :rules="[{ required: !personalForm.name }]"
                            >
                              <!-- <el-input
                                v-model="personalForm.name"
                                @keyup.enter.native="handleGetRegisterInfo"
                              ></el-input> -->
                              <input
                                type="text"
                                class="read_card"
                                v-model.lazy="personalForm.name"
                                @keyup.enter="handleGetRegisterInfo"
                              />
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item
                              size="mini"
                              label="性别"
                              :rules="[{ required: !personalForm.sex }]"
                            >
                              <el-select v-model="personalForm.sex" placeholder="">
                                <el-option
                                  v-for="item in sexarr"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item
                              size="mini"
                              label-width="80px"
                              class="age"
                              label="年龄"
                              prop="numberlimit"
                            >
                              <el-input
                                type="number"
                                class="age_num"
                                v-model.number="personalForm.age"
                                :min="1"
                                :max="150"
                                @change.native="handleChangeAge"
                              ></el-input>
                              <el-select
                                @change="handleSelectChange"
                                v-model="personalForm.ageunit"
                                placeholder=""
                                style="width: 100px"
                              >
                                <el-option
                                  v-for="item in agearr"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item class="birthday" size="mini" label="出生日期">
                              <el-date-picker
                                style="width: 100%"
                                v-date-format
                                value-format="yyyy-MM-dd"
                                v-model="personalForm.birthday"
                                type="date"
                                placeholder="选择日期"
                                :editable="true"
                                @change="handleChangeBirthday"
                              >
                              </el-date-picker>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="婚姻">
                              <el-select
                                @change="handleSelectChange"
                                v-model="personalForm.marriage"
                                placeholder=""
                              >
                                <el-option
                                  v-for="item in marriagearr"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="证件类型">
                              <el-select
                                @change="handleSelectChange"
                                v-model="personalForm.idtype"
                                placeholder=""
                              >
                                <el-option
                                  v-for="item in idtypeItems"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="身份证">
                              <!-- <el-input
                                v-model="personalForm.idcard"
                              ></el-input> -->
                              <input
                                type="text"
                                class="read_card"
                                v-model.lazy="personalForm.idcard"
                                @change="handleEnterIdcardPf"
                                @keyup.enter="handleEnterIdcardPf"
                              />
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="体检类型">
                              <el-select
                                @change="handleSelectChange"
                                v-model="personalForm.checktype"
                                placeholder=""
                              >
                                <el-option
                                  v-for="item in checktypeitems"
                                  :key="item.code"
                                  :label="item.name"
                                  :value="item.code"
                                ></el-option>
                              </el-select>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="电话">
                              <el-input v-model="personalForm.telephone"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="住址">
                              <el-input v-model="personalForm.address"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="消费卡号">
                              <el-input v-model="personalForm.consumecardno"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                        <el-row>
                          <el-col :span="6">
                            <el-form-item size="mini" label="门诊卡">
                              <el-input v-model="personalForm.hiscode"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="序号">
                              <el-input disabled v-model="personalForm.seqno"></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="单位">
                              <el-input
                                v-model="personalForm.inputcompanyname"
                              ></el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="6">
                            <el-form-item size="mini" label="部门">
                              <el-input v-model="personalForm.department"></el-input>
                            </el-form-item>
                          </el-col>
                        </el-row>
                      </el-form>
                    </div>
                    <!-- 照片 -->
                    <div class="photo_box">
                      <!--开启摄像头-->
                      <img
                        @click="
                          pageState == 'add' && handleOnTake(),
                            pageState == 'edit' && handleOnTake()
                        "
                        :src="avatarImg"
                        @mouseenter="showDelPhotoBtn = true"
                        @mouseleave="showDelPhotoBtn = false"
                        class="avatar"
                        alt="摄像头"
                      />
                      <div
                        class="del_btn"
                        @mouseenter="showDelPhotoBtn = true"
                        @mouseleave="showDelPhotoBtn = false"
                        v-show="showDelPhotoBtn"
                      >
                        <!-- 裁剪icon -->
                        <i class="el-icon-crop" @click="handleCropPhotoBtn"></i>
                        <!-- 删除icon -->
                        <!-- <i
                          class="el-icon-delete"
                          @click="handleDelPhotoBtn"
                        ></i> -->
                      </div>
                      <!--拍照模态框-->
                      <el-dialog
                        class="photo_box_dialog"
                        title="拍照上传"
                        :close-on-click-modal="false"
                        :visible.sync="showCanvas"
                        @close="handleOnCancel"
                      >
                        <div class="box">
                          <video
                            id="videoCamera"
                            class="canvas"
                            :width="videoWidth"
                            :height="videoHeight"
                            autoPlay
                          ></video>
                          <canvas
                            id="canvasCamera"
                            class="canvas canvasCamera"
                            :width="videoWidth"
                            :height="videoHeight"
                          ></canvas>
                        </div>
                        <div slot="footer">
                          <el-button
                            @click="handleDrawImage"
                            icon="el-icon-camera"
                            size="small"
                          >
                            拍照
                          </el-button>
                          <el-button
                            v-if="os"
                            @click="handleGetCompetence"
                            icon="el-icon-video-camera"
                            size="small"
                          >
                            打开摄像头
                          </el-button>
                          <el-button
                            v-else
                            @click="handleStopNavigator"
                            icon="el-icon-switch-button"
                            size="small"
                          >
                            关闭摄像头
                          </el-button>
                          <el-button
                            @click="handleResetCanvas"
                            icon="el-icon-refresh"
                            size="small"
                          >
                            重置
                          </el-button>
                          <el-button
                            @click="handleOnComplete"
                            icon="el-icon-circle-close"
                            size="small"
                          >
                            完成
                          </el-button>
                        </div>
                      </el-dialog>
                    </div>
                  </div>
                </div>
                <div v-if="message == 'other'" class="other_info">
                  <div class="head">客户信息</div>
                  <el-form
                    ref="form"
                    class="other_info_form"
                    :disabled="formFlag"
                    :model="personalForm"
                    label-width="90px"
                  >
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="籍贯">
                          <el-input v-model="personalForm.nativeplace"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="职业">
                          <el-select
                            v-model="personalForm.occupation"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="(item, index) in occupationItems"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="民族">
                          <el-select
                            v-model="personalForm.nation"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="(item, index) in nationItems"
                              :key="index"
                              :label="item.name"
                              :value="item.name"
                            ></el-option>
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
                    </el-row>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item size="mini" label="导诊护士">
                          <el-select
                            v-model="personalForm.guidancecode"
                            @change="handleChangeGuidance"
                          >
                            <el-option
                              v-for="item in doctoritems"
                              :key="item.account"
                              :label="item.name"
                              :value="item.account"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item size="mini" label="业务员">
                          <el-select
                            v-model="personalForm.salesmancode"
                            @change="handleChangeSalesman"
                          >
                            <el-option
                              v-for="item in doctoritems"
                              :key="item.account"
                              :label="item.name"
                              :value="item.account"
                            ></el-option>
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
                        <el-checkbox
                          class="other_info_check"
                          v-model="personalForm.remindflag"
                          :true-label="1"
                          :false-label="0"
                          >体检提醒</el-checkbox
                        >
                      </el-col>
                      <el-col :span="6">
                        <el-checkbox
                          class="other_info_check"
                          v-model="personalForm.notmyself"
                          :true-label="1"
                          :false-label="0"
                          >非本人体检</el-checkbox
                        >
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
                          <el-select
                            @change="handleSelectChange"
                            v-model="personalForm.actualsex"
                            placeholder=""
                          >
                            <el-option
                              v-for="item in sexarr"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item
                          size="mini"
                          label-width="55px"
                          class="age"
                          label="年龄"
                          prop="numberlimit"
                        >
                          <el-input
                            type="number"
                            class="age_num"
                            v-model.number="personalForm.actualage"
                            :min="1"
                            :max="150"
                            @change.native="handleChangeAge"
                          ></el-input>
                          <el-select
                            @change="handleSelectChange"
                            v-model="personalForm.actualageunit"
                            placeholder=""
                            style="width: 100px"
                          >
                            <el-option
                              v-for="item in agearr"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
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
                        <el-form-item size="mini" label="客户级别">
                          <el-select
                            style="width: 100%"
                            v-model="personalForm.level"
                            placeholder=""
                          >
                            <el-option label="普通" :value="0"></el-option>
                            <el-option label="VIP" :value="1"></el-option>
                            <el-option label="保密" :value="2"></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="领取方式">
                          <el-select v-model="personalForm.reporttake" placeholder="">
                            <el-option
                              v-for="item in reporttakeItems"
                              :key="item.code"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="体检日期">
                          <el-input
                            :disabled="pageState !== 'add'"
                            v-model="personalForm.checkdate"
                            @focus="handleFocusCheckDate"
                          ></el-input>
                        </el-form-item>
                      </el-col>
                    </el-row>
                  </el-form>
                  <div class="head">职业信息</div>
                  <el-form
                    ref="form"
                    :disabled="formFlag"
                    :model="personalForm"
                    label-width="80px"
                  >
                    <el-row>
                      <el-col :span="6">
                        <el-form-item size="mini" label="危害因素">
                          <el-select
                            v-model="personalForm.harmcode"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="(item, index) in harmitems"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item size="mini" label="工种">
                          <el-select
                            v-model="personalForm.worktypecode"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="(item, index) in workitems"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
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
                          <el-select
                            v-model="personalForm.industrytypecode"
                            @change="handleSelectChange"
                          >
                            <el-option
                              v-for="(item, index) in industryitems"
                              :key="index"
                              :label="item.name"
                              :value="item.code"
                            ></el-option>
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
              </div>
              <!-- 团检信息 -->
              <div
                v-if="message === 'basic'"
                class="group_body"
                style="
                  width: 100%;
                  min-height: 300px;
                  background-color: #fff;
                  margin-top: 10px;
                  border-radius: 5px;
                "
              >
                <div class="team_inspect">
                  <div>
                    <div class="message-title">
                      <div class="headss">
                        <div class="heads-in"></div>
                        <div>体检项目</div>
                      </div>
                      <div class="message_content" style="width: 100%">
                        <el-form
                          ref="form"
                          :disabled="formFlag"
                          :model="personalForm"
                          label-width="80px"
                        >
                          <el-row>
                            <el-col :span="10">
                              <el-form-item class="tuanjian" size="mini" label="团检名称">
                                <el-select
                                  :disabled="editUnit"
                                  filterable
                                  clearable
                                  @change="handleSelectComany"
                                  v-model="personalForm.companycode"
                                  placeholder=""
                                >
                                  <el-option
                                    v-for="item in companyitems"
                                    :key="item.code"
                                    :label="`${item.code}　${item.name}`"
                                    :value="item.code"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item size="mini" label="团检批次">
                                <el-select
                                  :disabled="editUnit"
                                  @change="handleSelectBatch"
                                  style="width: 100%"
                                  v-model="personalForm.batch"
                                  placeholder=""
                                >
                                  <el-option
                                    v-for="item in batchitems"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                  ></el-option>
                                </el-select>
                              </el-form-item>
                            </el-col>
                            <el-col :span="7">
                              <el-form-item size="mini" label="团检分组">
                                <el-select
                                  @change="handleCheckGroup"
                                  :disabled="editUnit"
                                  style="width: 100%"
                                  v-model="personalForm.groupcode"
                                  placeholder=""
                                >
                                  <el-option
                                    v-for="item in groupitems"
                                    :key="item.code"
                                    :label="item.name"
                                    :value="item.code"
                                  ></el-option>
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
                        <el-link
                          type="primary"
                          style="margin-right: 10px"
                          @click="handleTodayCombinedBilling"
                          >今日组合开单</el-link
                        >
                        <el-button type="primary" size="mini" @click="handleSelectSetMeal"
                          >开单套餐</el-button
                        >
                        <el-button type="primary" size="mini" @click="handleSelectCmbine"
                          >开单组合</el-button
                        >
                        <!-- <el-button
                        type="primary"
                        size="mini"
                        @click="handleSelectGroup"
                        >编辑项目</el-button
                      > -->
                      </div>
                      <el-button
                        class="discount"
                        size="mini"
                        type="primary"
                        @click="handleSetDiscount"
                        >折扣</el-button
                      >
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
                  <EasyTable
                    :loading="loading"
                    class="group_table"
                    ref="multipleTable"
                    height="100%"
                    row-id="groupid"
                    :border-around="false"
                    :border-x="false"
                    :border-y="false"
                    :data="groupTableData"
                    :tableOptions="tableOptions"
                    :radio-config="{ fetch: true, rowClick: true }"
                    @row-click="handleChecked"
                    :border="false"
                    :header-cell-style="handleReturnStyle"
                    :row-class-name="handleTableRowClassName"
                    :row-style="{ height: '0' }"
                    :cell-style="{ padding: '0' }"
                  />
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
              <div
                class="content_table"
                style="background-color: #fff; border-radius: 5px"
              >
                <div class="message-title">
                  <!-- style="background-color: #f5f7fa" -->
                  <div class="headss">
                    <div class="heads-in"></div>
                    <div>检索条件</div>
                  </div>
                  <div class="condition">
                    <div class="checkup_code">
                      <el-popover
                        ref="popoverRef"
                        placement="bottom-start"
                        trigger="click"
                      >
                        <div class="content">
                          <div
                            class="content_item"
                            v-for="item in checkupCodeArr"
                            :key="item.code"
                            @click="handleSelectCondition(item)"
                          >
                            {{ item.name }}
                          </div>
                        </div>
                        <el-button
                          type="primary"
                          plain
                          style="width: 80px"
                          size="mini"
                          slot="reference"
                          >{{ condition }}</el-button
                        >
                        <!-- <div style="margin-top: 6px;margin-right: 12px;width: 80px;text-align: right; cursor:pointer;"  slot="reference">{{ condition }}</div> -->
                      </el-popover>
                      <el-input
                        size="mini"
                        clearable
                        ref="inputWorkFlage"
                        @clear="handleInputWork"
                        @keyup.enter.native="handleInputWork"
                        v-model="checkupWork"
                        placeholder="请输入内容"
                      ></el-input>
                      <el-button
                        type="primary"
                        size="mini"
                        plain
                        @click="handleInputWork"
                        icon="el-icon-search"
                        >搜索</el-button
                      >
                      <el-button
                        type="primary"
                        size="mini"
                        plain
                        @click="handleSearchCardReading"
                        icon="el-icon-search"
                        >读卡</el-button
                      >
                    </div>
                    <div class="checkup_date">
                      <div class="date_box">
                        <div class="date_title">日期范围</div>
                        <el-date-picker
                          @change="handleChangeDate"
                          size="mini"
                          v-model="conditionDate"
                          type="daterange"
                          align="right"
                          unlink-panels
                          range-separator="-"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                      </div>
                      <div class="unit_box">
                        <div class="unit_title">单位</div>
                        <el-select
                          filterable
                          size="mini"
                          clearable
                          @change="handleCompanycodeChange"
                          v-model="companycode"
                          placeholder=""
                        >
                          <el-option
                            v-for="item in companycodeItems"
                            :key="item.companycode"
                            :label="item.companycode + '　' + item.companyname"
                            :value="item.companycode"
                          ></el-option>
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
                    <el-radio-group
                      v-model="radio"
                      size="small"
                      fill="#2a85ea"
                      @change="radioChange"
                      style="
                        border: 1px solid #2a85ea;
                        border-radius: 5px;
                        color: #409eff;
                      "
                    >
                      <el-radio-button
                        label="全部"
                        style="color: #409eff"
                        value="1"
                      ></el-radio-button>
                      <el-radio-button
                        label="个人"
                        style="color: #409eff"
                        value="2"
                      ></el-radio-button>
                      <el-radio-button
                        label="单位"
                        style="color: #409eff"
                        value="3"
                      ></el-radio-button>
                    </el-radio-group>
                    <!-- <el-button
                      class="checkin"
                      type="primary"
                      size="mini"
                      plain
                      style="height: 28px"
                      @click="handleCopyCheckIn"
                      >复制登记</el-button
                    > -->
                    <el-button
                      class="checkin"
                      type="primary"
                      size="mini"
                      plain
                      style="height: 28px; margin-right: 10px"
                      @click="(setmealRadio = ''), handleGetPersonalRegisterList()"
                      >刷新</el-button
                    >
                    <!-- <el-switch v-model="isGuideSingle" active-text="打印指引单">
                    </el-switch> -->
                  </div>
                  <!-- 登记人员列表 -->
                  <div class="condition_table" @mouseleave="handlemouseLeaveReset">
                    <EasyTable
                      row-id="regid"
                      :loading="loadingCondition"
                      class="condition_table_es"
                      height="100%"
                      :data="conditionData"
                      :tableOptions="conditionOptions"
                      :radio-config="{
                        selectedVal: setmealRadio,
                        rowClick: true,
                      }"
                      @checked-change="handleCheckCondition"
                      @cell-mouse-enter="handleCheckConditionEnter"
                      @cell-mouse-leave="handleCheckConditionLeave"
                      :border="false"
                      :header-cell-style="handleReturnStyle"
                      :row-class-name="handleTableRowClassName"
                      :row-style="{ height: '32px' }"
                      :cell-style="{ padding: '0' }"
                    />
                    <el-pagination
                      :pager-count="5"
                      :small="true"
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[20, 50, 100, 200, 300]"
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="count"
                    >
                    </el-pagination>
                  </div>
                  <!-- <div class="condition_table">
                    <vxe-table height="auto" border="inner" :loading="loadingCondition" show-overflow highlight-hover-row :sort-config="{trigger: 'cell'}" :data="conditionData" @radio-change="handleCheckCondition">
                      <vxe-table-column type="radio" width="45"></vxe-table-column>
                      <vxe-table-column field="name" title="姓名" width="80px" show-overflow></vxe-table-column>
                      <vxe-table-column field="sex" title="性别" width="80px" show-overflow>
                        <template slot-scope="scope">
                          <span>{{scope.row.sex==0?"未知":scope.row.sex==1?"男":"女"}}</span>
                        </template>
                      </vxe-table-column>
                      <vxe-table-column field="age" title="年龄" width="80px" show-overflow></vxe-table-column>
                      <vxe-table-column field="checkno" title="档案号" width="120px" show-overflow></vxe-table-column>
                      <vxe-table-column field="regid" title="体检号" width="120px" show-overflow></vxe-table-column>
                      <vxe-table-column field="price" title="收费" width="120px" show-overflow></vxe-table-column>
                      <vxe-table-column field="checktypename" title="体检类型" width="120px" show-overflow></vxe-table-column>
                      <vxe-table-column field="regdate" title="登记日期" width="120px" show-overflow></vxe-table-column>
                    </vxe-table>
                  </div> -->
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 选择项目分组弹框 -->
      <!-- <SetMealDialog
        v-if="showProjectDialog"
        :sex="personalForm.sex"
        :flag="pageState"
        :groupTableData="groupTableData"
        @submit="handleProjectSubmit"
        @close="showProjectDialog = false"
      /> -->
      <!-- 选择套餐分组弹框 -->
      <SetMealOnly
        v-if="showSetMealDialog"
        :sex="personalForm.sex"
        :flag="pageState"
        :groupTableData="groupTableData"
        @submit="handleProjectSubmit"
        @close="showSetMealDialog = false"
      />
      <!-- 选择组合分组弹框 -->
      <CmbineOnly
        v-if="showCmbine"
        :sex="personalForm.sex"
        :flag="pageState"
        :groupTableData="groupTableData"
        @submit="handleProjectSubmit"
        @close="showCmbine = false"
      />
      <!-- <SetMealDialog v-if="showProjectDialog && pageState == 'edit'" :sex="pageState == 'edit'&&choosePeople.sex || pageState == 'add'&&personalForm.sex" :groupTableData="groupTableData" @submit="handleProjectSubmit" @close="showProjectDialog = false" />
      <SetMealDialog v-if="showProjectDialog && pageState == 'add'" :sex="pageState == 'edit'&&choosePeople.sex || pageState == 'add'&&personalForm.sex" :groupTableData="groupTableData" @submit="handleProjectSubmit" @close="showProjectDialog = false" /> -->
      <!-- 体检卡收费明细弹出层 -->
      <el-dialog
        class="dialog-mini charge_details_card"
        width="68%"
        top="4%"
        :close-on-click-modal="false"
        title="收费列表"
        :visible.sync="showChargeDetailsCard"
        @close="handleCloseChargeDetails"
      >
        <div class="tou_box">
          <span class="tou_item color_000"
            >项目总数：{{ chargeDataListCard.length }}个</span
          >
          <span class="tou_item">登记Id：{{ personalForm.regid }}</span>
          <span class="tou_item">姓名：{{ personalForm.name }}</span>
          <span class="tou_item"
            >性别：{{
              personalForm.sex == 0 ? "未知" : personalForm.sex == 1 ? "男" : "女"
            }}</span
          >
        </div>
        <div class="table_box">
          <EasyTable
            :loading="loadingGroup"
            class="table_item"
            height="100%"
            row-id="combinecode"
            :data="chargeDataListCard"
            :tableOptions="chargeGroupOptionsCard"
            :checkbox-config="{ rowClick: true, fetchVal: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
          <div class="charge_form">
            <div class="cfbox">
              <div class="cfbox_box">
                <div class="cfbox_item">
                  应收金额：{{ chargeItemsCard.receivabletotal }}
                </div>
                <div class="cfbox_item">
                  状态：{{
                    chargeItemsCard.chargeflag == 0
                      ? "未收费"
                      : chargeItemsCard.chargeflag == 1
                      ? "收费"
                      : "退费"
                  }}
                </div>
              </div>
              <div class="cfbox_box">
                <div class="cfbox_item">收费员：{{ chargeItemsCard.tollcollector }}</div>
                <div class="cfbox_item">
                  收费时间：{{ chargeItemsCard.tollcollecttime }}
                </div>
              </div>
            </div>
            <div class="cftable">
              <EasyTable
                class="cftable_item"
                height="100%"
                :data="chargeItemsCard.payments"
                :tableOptions="paymentsOptions"
                :checkbox-config="{ rowClick: true, fetchVal: true }"
                :border="false"
                :header-cell-style="handleReturnStyle"
                :row-class-name="handleTableRowClassName"
                :row-style="{ height: '32px' }"
                :cell-style="{ padding: '0' }"
              />
              <el-button size="mini" type="primary" @click="handleAddChargeCard"
                >新增体检卡</el-button
              >
            </div>
            <div class="form_btn">
              <el-button size="mini" type="success" @click="handleSetChargeCardConfirm"
                >确认</el-button
              >
              <el-button size="mini" type="danger" @click="handleCloseChargeDetails"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 收费明细弹出层 -->
      <el-dialog
        class="dialog-mini charge_details"
        width="58%"
        top="4%"
        :close-on-click-modal="false"
        title="收费列表"
        :visible.sync="showChargeDetails"
        @close="handleCloseChargeDetails"
      >
        <div>
          项目总数：{{ chargeDataList.length }}个
          <span style="margin-left: 20px">未交费项目：{{ noCharge.length }}个</span>
          <el-button
            size="mini"
            style="margin-left: 20px"
            type="primary"
            @click="handleSetAllChargeCancel"
            >取消收费</el-button
          >
        </div>
        <div class="table_box">
          <EasyTable
            :loading="loadingGroup"
            class="table_item"
            height="100%"
            row-id="combinecode"
            :data="chargeDataList"
            :tableOptions="chargeGroupOptions"
            :checkbox-config="{ rowClick: true, fetchVal: true }"
            @selected-change="handleSelectSharge"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
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
                  <el-select
                    size="mini"
                    v-model="chargeItems.paymenttype"
                    clearable
                    placeholder="请选择支付方式"
                  >
                    <el-option
                      v-for="(item, index) in payitems"
                      :key="index"
                      :label="item.name"
                      :value="item.code"
                    >
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
              <!-- v-if="chargeItems.chargeflag != 1" -->
              <el-button size="mini" type="success" @click="handleSetChargeConfirm"
                >收费</el-button
              >
              <!-- v-if="chargeItems.chargeflag == 1" -->
              <el-button size="mini" type="warning" @click="handleSetChargeCancel"
                >退费</el-button
              >
              <el-button size="mini" type="danger" @click="handleCloseChargeDetails"
                >取消</el-button
              >
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 签到流程 -->
      <FlowPath v-if="showFlowPath" :regid="flowPathRegid" @close="handleCloseFlowPath" />
      <!-- 客户历史体检记录弹框 -->
      <el-dialog
        class="dialog-mini history_pson"
        width="55%"
        height="100%"
        top="10%"
        :close-on-click-modal="false"
        title="历史体检信息"
        :visible.sync="historyShow"
        @close="handleCloseHistory"
      >
        <div class="table_box">
          <EasyTable
            class="table_item"
            height="100%"
            row-id="groupid"
            :data="historyData"
            :tableOptions="historyOptions"
            :radio-config="{ fetch: true, rowClick: true }"
            @row-dblclick="handleHistoryCheck"
            @cell-click="handleHistoryCopy"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
        </div>
        <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseHistory">关 闭</el-button>
        </div>
      </el-dialog>
      <!-- 门诊档案弹框 -->
      <el-dialog
        class="dialog-mini history_pson"
        width="55%"
        height="100%"
        top="10%"
        :close-on-click-modal="false"
        :show-close="false"
        title="门诊档案信息"
        :visible.sync="showOutpatient"
        @close="handleCloseOutpatient"
      >
        <div class="table_box">
          <EasyTable
            class="table_item"
            height="100%"
            row-id="groupid"
            :data="outpatientData"
            :tableOptions="outpatientOptions"
            :radio-config="{ fetch: true, rowClick: true }"
            @row-dblclick="handleOutpatientCheck"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
        </div>
        <!-- <div style="text-align: center; margin-top: 15px">
          <el-button size="mini" @click="handleCloseOutpatient"
            >关 闭</el-button
          >
        </div> -->
      </el-dialog>
      <!-- 历史项目弹框 -->
      <el-dialog
        class="dialog-mini history_table"
        width="65%"
        height="60%"
        top="10%"
        :close-on-click-modal="false"
        title="历史项目"
        :visible.sync="historyProjectShow"
        @close="handleClosehistoryProject"
      >
        <div class="history_table_box">
          <EasyTable
            :loading="loadingGroup"
            class="history_table_item"
            height="100%"
            row-id="groupid"
            :data="hTable1Data"
            :tableOptions="hTable1Options"
            :radio-config="{ fetch: true, rowClick: true }"
            @row-click="handleCheckhRow"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
          <EasyTable
            :loading="loadingItem"
            class="history_table_item"
            height="100%"
            row-id="groupid"
            :data="hTable2Data"
            :tableOptions="hTable2Options"
            :radio-config="{ fetch: true, rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleSubmitHistory"
            >继 存</el-button
          >
          <el-button size="mini" @click="handleClosehistoryProject">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 智能推荐 -->
      <el-dialog
        class="dialog-mini intellect"
        width="45%"
        height="60%"
        top="10%"
        :close-on-click-modal="false"
        title="智能推荐"
        :visible.sync="intellect"
        @close="handleCloseIntellect"
        :show-close="false"
      >
        <div class="big_box">
          <div class="table_box">
            <EasyTable
              class="table_item"
              height="100%"
              :data="intellectData"
              :tableOptions="intellectOptions"
              :radio-config="{ rowClick: true }"
              @checked-change="handleSelectIntellect"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0' }"
            />
          </div>
          <div class="table_box">
            <EasyTable
              class="table_item"
              height="100%"
              :data="intellectDataCb"
              :tableOptions="intellectOptionscb"
              :checkbox-config="{ rowClick: true }"
              @selected-change="handleSelectIntellectcb"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :row-class-name="handleTableRowClassName"
              :row-style="{ height: '32px' }"
              :cell-style="{ padding: '0' }"
            />
          </div>
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleSubmitIntellect"
            >确 认</el-button
          >
          <el-button size="mini" @click="handleCloseIntellect">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 折扣 -->
      <el-dialog
        class="dialog-mini discount_dialog"
        width="20%"
        top="20%"
        :close-on-click-modal="false"
        title="项目折扣"
        :visible.sync="discount"
        @close="handleCloseDiscount"
      >
        <div class="discount_box">
          <el-input
            size="mini"
            placeholder="请输入折扣"
            max="100"
            min="1"
            v-model="discountValue"
            clearable
          >
          </el-input>
          <!-- <div>%</div> -->
        </div>
        <span slot="footer" class="dialog-footer history_table_footer">
          <el-button size="mini" type="primary" @click="handleConfirmDiscount"
            >确 认</el-button
          >
          <el-button size="mini" @click="handleCloseDiscount">取 消</el-button>
        </span>
      </el-dialog>
      <!-- 预约日历 -->
      <Calendar
        v-if="showCalendar"
        :makeNumber="1"
        :makeFlag="makeFlag"
        @submit="handleSaveAppointment"
        @close="handleCloseCalendar"
      />
      <!-- 检索组件 -->
      <SearchDialog
        v-if="showSearch"
        :showSearch="showSearch"
        @close="handleCloseSearch"
        @submit="handleSearchSubmit"
      />
      <!-- 打印申请单 -->
      <el-dialog title="打印申请单" :visible.sync="showApplyPrint" width="50%">
        <el-tree
          :data="applyPrintTree"
          :props="applyPrintProps"
          show-checkbox
          default-expand-all
          @check="handleCheckChangeApplyPrint"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleCancelApplyPrint">取 消</el-button>
          <el-button size="mini" @click="handlePreviewApply">预 览</el-button>
          <el-button size="mini" type="primary" @click="handleSubmitApplyPrint"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <!-- 预览弹框 -->
      <el-dialog
        title="预览"
        class="preview_box"
        :visible.sync="dialogVisible"
        top="80px"
        width="700px"
        @close="handleCloseDialog"
      >
        <iframe
          ref="pdfCotainer"
          :src="pdfUrl"
          width="100%"
          style="height: calc(100vh - 247px)"
        ></iframe>
      </el-dialog>
      <!-- 今日开单组合查询弹框 -->
      <el-dialog
        title="今日组合开单量"
        :visible.sync="showTodayCombine"
        width="50%"
        class="todaycombine"
        @close="handleTodayCombinedBillingClose"
      >
        <div class="tc_content">
          <EasyTable
            :loading="loadingGroup"
            class="todaycombine"
            height="100%"
            :data="todayCombineList"
            :tableOptions="todayCombineOptions"
            :radio-config="{ fetch: true, rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
          />
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="handleTodayCombinedBillingClose"
            >取 消</el-button
          >
        </span>
      </el-dialog>
      <!-- 裁剪弹框 -->
      <el-dialog
        title="图片剪裁"
        :visible.sync="showCropperDialog"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        append-to-body
        width="1000px"
        class="cropper_dia"
      >
        <div class="box_content">
          <div class="crop_p">
            <vueCropper
              ref="cropper"
              :img="option.img"
              :autoCrop="option.autoCrop"
              :auto-crop-width="option.autoCropWidth"
              :auto-crop-height="option.autoCropHeight"
              :center-box="option.centerBox"
            ></vueCropper>
          </div>
          <div class="btn">
            <el-button type="primary" size="mini" @click="handleGetCropData()"
              >截图</el-button
            >
            <el-button
              type="primary"
              icon="el-icon-refresh-left"
              size="mini"
              @click="handleRotateLeft()"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-refresh-right"
              size="mini"
              @click="handleRotateRight()"
            ></el-button>
            <el-button type="primary" size="mini" @click="handleRefresh()"
              >重置</el-button
            >
            <el-button type="primary" size="mini" @click="handleConfirmCrop()"
              >完成</el-button
            >
            <el-button type="primary" size="mini" @click="handleCloseCrop()"
              >取消</el-button
            >
          </div>
          <img class="pic_p" :src="imgUrl" alt="" />
        </div>
      </el-dialog>
    </div>
    <!-- 调查问卷 -->
    <transition name="fade" mode="in-out">
      <Questionnaire
        :regid="questionnaireId"
        v-if="showQuestionnaire"
        @close="handleCloseQuestionnaire"
      />
    </transition>
    <transition name="fade" mode="in-out">
      <!-- choosePeople.regid -->
      <HealthView
        v-if="showHealthView"
        :userInfo="choosePeople"
        @close="showHealthView = false"
      />
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
  ProcessTrackList,
  NoPasswordDetail,
  MoreCost,
  SendCostApply,
} from "@/api/personalregister.js";
import { printBase64 } from "@/api/printreport.js";
import Project from "./components/project.vue";
import Calendar from "@/components/calendar"; // 预约日历组件
import SearchDialog from "@/components/searchDialog";
import Questionnaire from "@/components/surveyinformation"; // 调查问卷
import SetMealDialog from "@/components/SetMealDialog/index_qyzyy.vue"; // 新项目弹框
import SetMealOnly from "@/components/SetMealDialog/setmeal_qyzyy.vue"; // 套餐独立弹框
import CmbineOnly from "@/components/SetMealDialog/combine_qyzyy.vue"; // 组合独立弹框
import HealthView from "@/components/healthView/index.vue"; // 健康视图
import { setAppointmentSave } from "@/api/appointment.js";
import { getSysConfigInfo } from "@/api/sysconfig";
import { setFilesDelete } from "@/api/unitregistration.js";
import { getDicSetmealList } from "@/api/setMealDialog.js";
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
    SetMealDialog,
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
      editUnit: false,
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
        {
          code: "99",
          name: "其他法定有效证件",
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
      showChargeDetailsCard: false,
      noChargeCard: [],
      payitemsCard: [],
      chargeItemsCard: {},
      chargeDataListCard: [],
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
        idtype: [
          {
            type: "date",
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
      tempNumPrice: 0,
      tempTimeId: "",
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
                  disabled={data.discountflag == 1}
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
            return Math.floor(result * 100) / 100;
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
                  <el-dropdown-item command="复制登记">复制登记</el-dropdown-item>
                  <el-dropdown-item command="流程追踪">流程追踪</el-dropdown-item>
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
    paymentsOptions() {
      return [
        {
          title: "卡名",
          prop: "sort",
          width: 110,
          omit: 1,
          returnVal: (value) => {
            return `体检卡${value}`;
          },
        },
        {
          title: "卡号",
          omit: 1,
          render: (h, data) => {
            return (
              <input
                type="text"
                placeholder="输入卡号回车显示余额"
                size="mini"
                disabled={!data.isupdate}
                v-model={data.cardno}
                clearable
                class="discount_input"
                onkeyup={(e) => {
                  if (!e) return;
                  switch (e.keyCode) {
                    case 13: // 键盘回车
                      this.handleNoPasswordDetail(data);
                      break;
                    default:
                      break;
                  }
                }}
              />
            );
          },
        },
        {
          title: "余额",
          omit: 1,
          prop: "remainingamount",
          width: 110,
        },
        {
          title: "支付金额",
          omit: 1,
          width: 110,
          render: (h, data) => {
            return (
              <el-input
                size="mini"
                disabled={!data.isupdate}
                v-model={data.payprice}
                vOn:focus={(e) => {
                  e.stopPropagation();
                  this.tempNumPrice = data.payprice;
                  console.log("触发", this.tempNumPrice);
                }}
                vOn:input={(e) => {
                  clearTimeout(this.tempTimeId);
                  this.tempTimeId = setTimeout(() => {
                    if (+data.payprice > +data.remainingamount) {
                      this.$message.warning("输入金额不能大于卡余额!");
                      data.payprice = this.tempNumPrice;
                      this.tempNumPrice = data.remainingamount;
                      return;
                    }
                  }, 400);
                }}
                clearable
              ></el-input>
            );
          },
        },
      ];
    },
    // 收费明细表格主表表格配置
    chargeGroupOptionsCard() {
      return [
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
    // 进入页面连接身份证读卡器
    this.handleConnectIdcard();
    // 获取领取报告方式
    this.handleGetPublicConfig();
    // 类型列表
    this.handleQuestionnaireTitleList();
    this.handleGetPublicConfigs("Occupation"); // 职业类型
    this.handleGetPublicConfigs("Nation"); // 民族
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
    handleSendCostApply() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择发送人员!");
        return;
      }
      SendCostApply({ regid: this.choosePeople.regid }).then((res) => {
        this.$message.success(res.message);
      });
    },
    handleSetChargeCardConfirm() {
      let payments = this.chargeItemsCard.payments.filter((k) => k.isupdate);
      payments = payments.map((k) => {
        return {
          cardno: k.cardno,
          payprice: k.payprice,
          isupdate: k.isupdate,
        };
      });
      let data = {
        regid: this.personalForm.regid,
        payallamount: this.chargeItemsCard.receivabletotal,
        customerRegisterMoreCostDetailItems: payments,
      };
      MoreCost(data)
        .then((res) => {
          this.$message.success(res.message);
          this.handleCloseChargeDetailsCard();
        })
        .catch(() => {
          this.handleCloseChargeDetailsCard();
        });
    },
    // 收费明细弹出层关闭回调
    handleCloseChargeDetailsCard() {
      this.chargeDataListCard = []; // 收费明细表格主表
      this.showChargeDetailsCard = false;
      this.handleGetPersonalDetail(this.personalForm.regid);
    },
    handleNoPasswordDetail(data) {
      if (!data.cardno) {
        this.$message.warning("请先填写卡号信息!");
        return;
      }
      NoPasswordDetail({ cardno: data.cardno }).then((res) => {
        data.remainingamount = res.result.remainingamount;
        data.payprice = res.result.remainingamount;
        console.log(this.chargeItemsCard.payments);
      });
    },
    handleAddChargeCard() {
      let data = this.chargeItemsCard.payments;
      if (data.length == 0) {
        this.chargeItemsCard.payments.push({
          cardno: "",
          isupdate: true,
          payprice: 0,
          remainingamount: 0,
          sort: 1,
        });
        return;
      }
      if (!data[data.length - 1].cardno) {
        this.$message.warning("请先填写上一卡号信息!");
        return;
      }
      this.chargeItemsCard.payments.push({
        cardno: "",
        isupdate: true,
        payprice: 0,
        remainingamount: 0,
        sort: +data[data.length - 1].sort + 1,
      });
      console.log(this.chargeItemsCard.payments);
    },
    /* 360全景接口跳转 */
    handleJumpPanorama() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择查看人员!");
        return;
      }
      let userInfo = JSON.parse(localStorage.getItem("usernameOrId")) || "";
      if (!userInfo) return;
      let jumpLink = `http://10.0.3.8:8082/CCD/new/index_pc.html?hideSearch=false&isMenZenFilter=false&deptId=NY1306&emrUser=${userInfo.usercode}&hospitalizeNo=${this.choosePeople.regid}&urlFrom=TJXT`;
      window.open(jumpLink);
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
    // 头部切换按钮
    handleRadioButton(key) {
      console.log(this.message);
      if (key === "basic" || key === "other") return false;
      if (!this.choosePeople) {
        this.$message.warning("请先选中需查看人员信息!");
        this.message = "basic";
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
        console.log(this.medicalHistory, "this.medicalHistory");
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
          this.handleCopyCheckIn();
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
          this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
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
        console.log(window, "window");
        console.log(window.navigator, "window.navigator");
        console.log(window.navigator.mediaDevices, ".window.navigator.mediaDevices");
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
    //绘制图片
    handleDrawImage() {
      // 点击，canvas画图
      this.thisContext.drawImage(this.thisVideo, 0, 0, this.videoWidth, this.videoHeight);
      // 获取图片base64链接
      // this.avatarImg = this.thisCancas.toDataURL("image/png");
      // this.personalForm.filebase64 = this.avatarImg.split(",")[1];
      // let arr = this.avatarImg.split(",")[1];
      // console.log(arr, "arr");
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
      // console.log(file, "file");
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
          : val == 3
          ? "已退费"
          : "";
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
    handleCopyCheckIn() {
      if (!this.choosePeople) {
        this.$message.warning("请先选择复制信息!");
        return false;
      }
      this.pageState = "add"; // 当前编辑状态
      this.formFlag = false; // 解除表单限制可编辑
      this.groupdis = false; // 解除团检表单限制可编辑
      this.setmealRadio = ""; // 清空选中编辑对象
      this.avatarImg = require("./images/lin.jpg");
      this.handlePersonalFormReset(); // 重置表单对象
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
      /* if (this.personalForm.regid == "") {
        this.$message.warning("请先保存登记人员数据!");
        return false;
      } */
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
      setChargeConfirm({
        regid: this.personalForm.regid,
        paytype: (this.chargeItems && this.chargeItems.paymenttype) || "",
      })
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
      localStorage.setItem("groupTableData", JSON.stringify(this.groupTableData));
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
          groupid: select.id || "",
        }).then((res) => {
          if (res.result && res.result.length > 0) {
            this.groupTableData = res.result.map((k) => {
              return {
                ...k,
                price: k.originalprice,
                qty: 1,
              };
            });
          } else {
            this.groupTableData = [];
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
        "未知";
      // 检查类型列表 / 回显值
      this.checktypeitems = data.checktypeitems;
      this.personalForm.checktype =
        (data.checktypeitems.filter((k) => k.selected)[0] &&
          data.checktypeitems.filter((k) => k.selected)[0].code) ||
        "";
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
        this.personalForm[k] = row[k];
      });
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
      // if (this.personalForm.idcard.trim() == "") {
      //   this.$message.warning("证件号不能为空!");
      //   return;
      // }
      // if (this.personalForm.idtype.trim() == "") {
      //   this.$message.warning("证件类型不能为空!");
      //   return;
      // }
      // 图片文件流处理
      if (
        this.personalForm.filebase64 &&
        this.personalForm.filebase64.includes("data:image")
      ) {
        let temp = this.personalForm.filebase64.split("base64,");
        this.personalForm.filebase64 = temp[1];
      }
      if (!this.personalForm.idcard.trim() && !this.personalForm.birthday) {
        if (this.personalForm.age === 0) {
          let date = new Date();
          this.personalForm.birthday = `${date.getFullYear()}-01-01`;
        }
      }
      this.loadingBtn = true;
      this.personalForm.filebase64 && this.$set(this.personalForm, "fileid", "");
      if (this.pageState === "edit") {
        this.groupTableData.forEach((item, index) => {
          if (item.dedflag === 1) {
            this.groupTableData.splice(index, 1, undefined);
          }
        });
        this.groupTableData = this.groupTableData.filter((k) => k);
      }
      this.$set(this.personalForm, "combineitems", this.groupTableData);
      setSubmit(this.personalForm)
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
              this.handleGetPersonalRegisterList(); // 更新右侧人员数据
              this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
              this.$nextTick(() => {
                this.setmealRadio = res.result.regid;
                this.appointmentData = undefined;
                localStorage.removeItem("groupTableData");
              });
              this.$message("保存成功!");
              this.formFlag = true; // 解除表单限制可编辑
              this.message = "basic"; // 基本信息-basic 其他信息-other
            });
          } else {
            this.handleGetPersonalRegisterList(); // 更新右侧人员数据
            this.handleGetPersonalDetail(res.result.regid); // 更新详情人员数据
            this.$nextTick(() => {
              this.setmealRadio = res.result.regid;
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
    // 体检卡收费按钮点击回调
    handleChargePageCard() {
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
        this.chargeDataListCard = res.result.combineitems.map((k) => {
          return {
            operatorname: res.result.operatorname,
            ...k,
          };
        });
        this.chargeDataListCard.forEach((item) => {
          this.chargeTotalPrice += item.price;
        });
        this.chargeItemsCard = res.result;
        this.payitemsCard = res.result.payitems;
        this.noChargeCard = this.chargeDataListCard.filter((k) => k.chargeflag != 1);
        this.showChargeDetailsCard = true;
      });
      this.loadingGroup = false;
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
      console.log(obj, "obj");
      let data = obj[0];
      let dialogFlag = obj[1];
      if (dialogFlag === "combine") {
        console.log(this.groupTableData, "this.groupTableData");
        if (this.groupTableData.length > 0) {
          data = [...this.groupTableData, ...data];
        }
      }
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
          this.pageState = "edit"; // 当前页面状态 add edit preview
          this.showProjectDialog = false; // 关闭窗口
        });
      } else {
        this.groupTableData = data;
        this.groupPriceTotal = 0;
        this.personalForm.combineitems = data; // 赋值对象中
        localStorage.setItem("groupTableData", JSON.stringify(data));
        // 体检项目总金额
        this.groupTableData.forEach((item) => {
          console.log(item.price, "item.price");
          this.groupPriceTotal += item.price;
        });
        // 体检项目已经缴费金额
        this.groupTableData.forEach((item) => {
          if (item.chargeflag == 1) {
            this.groupPriceEnd += item.price;
          }
        });
        this.showProjectDialog = false; // 关闭窗口
      }
    },
    // 点击选择项目分组回调
    handleSelectGroup() {
      this.showProjectDialog = true;
    },
    // 点击选择套餐回调
    handleSelectSetMeal() {
      this.showSetMealDialog = true;
    },
    // 点击选择组合回调
    handleSelectCmbine() {
      this.showCmbine = true;
    },
    // 下拉改变单位选择值回调
    handleSelectComany(val) {
      if (!val) {
        this.personalForm.batch = "";
        return false;
      }
      let data = this.companyitems.filter((k) => k.code == val)[0];
      if (data) {
        this.personalForm.companyname = data.name;
      }
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
      this.editUnit = false; // 解除团检表单限制可编辑
      this.groupTableData = []; // 清空套餐数组
      this.setmealRadio = ""; // 清空选中编辑对象
      this.groupPriceTotal = 0; // 体检项目总金额
      this.groupPriceEnd = 0; // 体检项目已经缴费金额
      this.choosePeople = undefined; // 新增重置选中人员
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
          "未知";
        // 检查类型列表 / 回显值
        this.checktypeitems = data.checktypeitems;
        this.personalForm.checktype =
          (data.checktypeitems.filter((k) => k.selected)[0] &&
            data.checktypeitems.filter((k) => k.selected)[0].code) ||
          "";
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
          return a.deptseqno - b.deptseqno;
        });
        this.groupTableData = data.combineitems;
        for (let i = 0; i < this.groupTableData.length; i++) {
          if (this.groupTableData[i].status != 0) {
            this.editUnit = true;
            break;
          }
        }
        console.log(this.formFlag, "this.formFlag");
        console.log(this.editUnit, "this.editUnit");
        localStorage.setItem("groupTableData", JSON.stringify(data.combineitems));
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
        this.checktypeitems = checktypeitems;
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
        // 检查类型列表 / 回显值
        this.checktypeitems = checktypeitems;
        this.personalForm.checktype =
          (checktypeitems.filter((k) => k.selected)[0] &&
            checktypeitems.filter((k) => k.selected)[0].code) ||
          "";
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
    hadnleGetBatchOrGroup() {
      getBatchOrGroup({
        companycode: this.personalForm.companycode,
      })
        .then((res) => {
          let { batchitems, groupitems } = res.result;
          this.batchitems = batchitems;
          let batch = batchitems.filter((k) => k.selected)[0] || batchitems[0];
          batch && (this.personalForm.batch = batch.code);
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
      } else if (this.cardReaderFlag == "新中新" || this.cardReaderFlag == "中控") {
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
      if (this.persontype) {
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
        } else if (this.cardReaderFlag == "新中新" || this.cardReaderFlag == "中控") {
          this.handleReadCardXinZhongXin(); // 精伦读卡
        }
      } else {
        if (!this.healthCard) return false;
        getPatientInfo({
          patId: this.healthCard,
        })
          .then((res) => {
            if (res.result.length == 0) return;
            if (res.result.length == 1 && res.result[0].hiscode) {
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
            this.personalForm.sex =
              data.gender == 0 ? 2 : data.gender == 1 ? 1 : data.gender;
            console.log(data.gender, "gender");
            console.log(this.personalForm.sex, "sex");
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
              sex: data.gender == 0 ? "女" : data.gender == 1 ? "男" : "未知",
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
            this.personalForm.idtype = res.result[0].idtype;
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
        let dateObj = res.data.filter((k) => k.concode == "Sys_Reg_DefDateRange")[0];
        dateObj && (this.dateRange = dateObj.conitemValue);
        this.handleGetconditionDate();
      });
    },
    // 体检套餐行点击回调
    handleChecked(row) {
      // console.log(row);
    },
    // 点击编辑个人列表数据
    handleEditPage() {
      console.log(this.choosePeople);
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
      console.log(this.formFlag, "this.formFlag");
      console.log(this.editUnit, "this.editUnit");
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
          let temp = this.groupTableData.map((k) => k.combinecode);
          if (temp.includes("10186")) {
            let indexP =
              this.$refs.btnApply[0].$attrs["data-remark"].split("、")[0] + "、";
            printBase64({
              fingercode: localStorage.getItem("md5code"),
              codes: [this.choosePeople.regid],
              repname: `${indexP}申请单_液基薄层申请单`,
              printflag: 1,
              whereitems: [
                {
                  key: "regid",
                  value: this.choosePeople.regid,
                },
                {
                  key: "combinecodesin",
                  valueList: ["10186"],
                },
              ],
            }).then((res) => {
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
                this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
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
                this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
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
                this.pdfUrl = "/pdfjs/web/viewer.html?file=" + encodeURIComponent(url);
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
    // 打印指引单回调
    async handlePrintGuideSingle(isPrint) {
      if (!this.choosePeople && !this.choosePeople.regid) {
        this.$message({
          showClose: true,
          message: "请选择人员再进行导出指引单",
          type: "error",
        });
        return false;
      }
      let resObj = await ProcessTrackList({
        regid: this.choosePeople.regid,
        pt: "PrintGuide",
      });
      if (resObj.result && resObj.result.length > 0) {
        this.$confirm(
          `该指引单在${resObj.result[0].processdate}已打印，操作人${resObj.result[0].operatorname}是否确认再次打印 `,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "否",
            type: "warning",
          }
        )
          .then(() => {
            this.handlePrintGuideSinglePrint(isPrint);
          })
          .catch(() => {
            this.$message({
              showClose: true,
              type: "info",
              message: "已取消",
            });
          });
      } else {
        this.handlePrintGuideSinglePrint(isPrint);
      }
    },
    handlePrintGuideSinglePrint(isPrint) {
      let d = this.$refs.btnGuideSingle[0];
      if (d.$el.innerText == "指引单打印") {
        let indexP = d.$attrs["data-remark"].split("、")[0] + "、";
        let repname = "";
        if ([2, 7].includes(+this.choosePeople.checktype)) {
          repname = `${indexP}入职指引单`;
        } else {
          repname = d.$attrs["data-remark"];
        }
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [this.choosePeople.regid],
          printflag: 1,
          repname,
          whereitems: [
            {
              key: "regid",
              value: this.choosePeople.regid,
            },
          ],
        };
        printBase64(data).then((res) => {
          isPrint && this.handlePrintApplyAuto(); // 打印申请单
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
      switch (domId) {
        case "btnAdd": // 新增
          this.handleCreate();
          break;
        case "btnKeep": // 保存
          this.hadnleSubmit();
          break;
        case "btnDel": // 删除
          this.hadnleDelList();
          break;
        case "btnSendCostApply": // 发送申请
          this.handleSendCostApply();
          break;
        case "btnReset": // 重置
          this.handleResetPage();
          break;
        case "btnCharge": // 收费
          this.handleChargePage();
          break;
        case "btnChargeCard": // 收费
          this.handleChargePageCard();
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
        case "btnPanorama": // 360全景
          this.handleJumpPanorama();
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
            console.log(this.$refs.popoverRefIdc);
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
          if (!this.choosePeople) {
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
        case "btnGuideSingleAndApply": // 打印申请单
          this.handlePrintGuideSingle(true);
          break;
        case "btnPhysique": // 打印体格表
          this.handlePrintGuideSingleAdult();
          // if (
          //   this.personalForm.checktype == 2 ||
          //   this.personalForm.checktype == 7 ||
          //   this.personalForm.checktype == 8
          // ) {
          //   // 2 体格检查表
          //   this.handlePrintGuideSingleAdult();
          // } else if (this.personalForm.checktype == 4) {
          //   // 4 儿童体格检查表
          //   this.handlePrintGuideSingleChildren();
          // } else if (this.personalForm.checktype == 6) {
          //   // 10103 健康证检查表
          //   this.handlePrintHealthCertificate();
          // } else if (this.personalForm.checktype == 5) {
          //   // 10102 驾驶检查表
          //   this.handlePrintDriversLicense();
          // } else {
          //   this.$message.warning("该体检类型无体格检查单打印！");
          // }
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
    /* "personalForm.checktype": {
      handler(newVal, oldVal) {
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
    }, */
    // healthCard: {
    //   handler(newVal, oldVal) {
    //     console.log(newVal, oldVal);
    //     if(newVal.length>30){
    //       this.handleEnterIdcard();
    //     }
    //   },
    // },
  },
};
</script>
<style lang="scss" scoped>
@import "./css/index_qyzyy.scss";
@import "./css/wenjuan.scss";
// 裁剪框
.cropper_dia {
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
</style>
