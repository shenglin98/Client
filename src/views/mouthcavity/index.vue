<template>
  <div class="setdictionary-wrap">
    <div class="setdictionary-box">
      <div class="setdictionary-container flex-row">
        <div style="border-right: 1px solid #ccc">
          <el-card shadow="never" class="body-small setdictionary-menu-card">
            <el-tree
              node-key="id"
              :highlight-current="true"
              @node-click="handleNodeClick"
              :default-checked-keys="defaultChecked"
              :data="setdictionaryTypes"
              :expand-on-click-node="false"
              default-expand-all
              :props="setdictionaryTypeProps"
            >
              <span
                class="custom-tree-node"
                :ref="`treeItem_${data.id}`"
                slot-scope="{ node, data }"
              >
                <span
                  ><i class="el-icon-menu" style="margin-right: 10px"></i
                  >{{ node.label }}</span
                >
              </span>
            </el-tree>
          </el-card>
        </div>
        <el-main class="setdictionary-content flex-item">
          <div class="btnBoxClas">
            <div class="form_box">
              <!-- -->
              <el-form ref="searchform" :model="searchform" :inline="true">
                <el-row>
                  <el-col :span="5">
                    <el-form-item clearable label="姓名" label-width="80px">
                      <el-input
                        v-model="searchform.name"
                        size="mini"
                        clearable
                        placeholder="姓名"
                      ></el-input> </el-form-item
                  ></el-col>
                  <el-col :span="5">
                    <el-form-item clearable label="体检号" label-width="80px">
                      <el-input
                        v-model="searchform.regid"
                        size="mini"
                        clearable
                        placeholder="体检号"
                      ></el-input> </el-form-item
                  ></el-col>

                  <el-col :span="6">
                    <el-form-item label="时间范围">
                      <el-date-picker
                        v-model="searchform.date"
                        size="mini"
                        style="width: 100%"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                      >
                      </el-date-picker> </el-form-item
                  ></el-col>
                </el-row>
              </el-form>
            </div>
            <div class="filter-container" style="white-space: nowrap; overflow-x: none">
              <template v-for="btn of typesBtns">
                <el-button
                  v-bind:key="btn.Id"
                  :icon="`iconfont icon-${btn.icon}`"
                  type="primary"
                  plain
                  size="mini"
                  class="filter-item"
                  @click="onBtnClicked(btn.domId)"
                  >{{ btn.name }}</el-button
                >
              </template>
            </div>
          </div>

          <template>
            <el-table
              height="calc(100% - 80px)"
              ref="recheck"
              :key="'2'"
              :data="allData"
              fit
              highlight-current-row
              @row-click="rowClick"
              @selection-change="handleSelectionChange"
              :border="false"
              :header-cell-style="handleReturnStyle"
              :cell-style="{ padding: '0' }"
            >
              <el-table-column type="selection"> </el-table-column>
              <el-table-column label="体检号" prop="regid"> </el-table-column>
              <el-table-column label="姓名" prop="name"> </el-table-column>
              <el-table-column label="性别" prop="sex">
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0 ? "未知" : scope.row.sex == 1 ? "男" : "女"
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="身份证号" prop="idcard"> </el-table-column>
              <el-table-column label="检查日期" prop="regdate"> </el-table-column>
              <!-- <el-table-column label="状态" prop="custom17"
                ><template v-slot="params">
                  <span>{{ params.row.custom17 == 1 ? "已完成" : "未完成" }}</span>
                </template></el-table-column
              > -->
            </el-table>
          </template>
          <!-- 编辑弹框 -->
          <el-dialog
            top="0"
            center
            :title="titleName"
            :visible.sync="DialogShow"
            class="detali_dia"
            fullscreen
            :before-close="handleCloseDialog"
            style="width: 850px; margin: auto"
            :close-on-click-modal="false"
          >
            <!-- 青少年 -->
            <template v-if="listQuery.tableName == 'boy'">
              <div class="formBoxClas">
                <!-- 用户信息 -->
                <div class="header">
                  <ul class="titleOne">
                    <li>
                      ID号: <span>{{ boy_babyForm.regid }}</span>
                    </li>
                    <li>
                      姓名: <span class="nameClas">{{ boy_babyForm.name }}</span>
                    </li>
                    <li>
                      性别:
                      <span>{{
                        boy_babyForm.sex == 0
                          ? "未知"
                          : boy_babyForm.sex == 1
                          ? "男"
                          : "女"
                      }}</span>
                    </li>
                    <li>
                      出生日期: <span>{{ boy_babyForm.birthday }}</span>
                    </li>
                  </ul>
                  <ul class="titleTwo">
                    <li>
                      检查年份: <span>{{ boy_babyForm.checkyear }}</span>
                    </li>
                    <li>
                      检查日期: <span>{{ boy_babyForm.checkdate }}</span>
                    </li>
                    <li>
                      受教有年限:
                      <span class="yearClas"
                        ><el-input
                          v-model="boy_babyForm.educateyear"
                          placeholder="年限"
                          style="width: 100%"
                        ></el-input
                      ></span>
                    </li>
                  </ul>
                </div>
                <div class="body1">
                  <!-- 牙状况 -->
                  <div class="toothBox">
                    <p class="toothTitle BTitle">牙状况</p>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number1" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[0]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number2" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[1]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number3" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[2]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number4" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[3]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <!-- 牙冠符号 -->
                  <div class="signBox">
                    <p class="signTitle BTitle">牙冠符号</p>
                    <table
                      class="tableClas"
                      v-for="i in 3"
                      :key="i"
                      :style="i == 2 ? 'width:240px' : ''"
                    >
                      <tr>
                        <th>乳牙</th>
                        <th>恒牙</th>
                        <th></th>
                      </tr>
                      <tr v-for="(item, index) in signData[i - 1]" :key="index">
                        <td>{{ item.ru }}</td>
                        <td>{{ item.heng }}</td>
                        <td style="width: 135px; text-align: left">{{ item.wu }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="body1 body2">
                  <!-- 牙状况 -->
                  <div class="toothBox">
                    <p class="toothTitle BTitle">牙周状况</p>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle toothItemBoxTitle2">
                        <span>牙龈出血</span>
                        <span>牙结石</span>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number1" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[4]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[5]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number2" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[6]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[7]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle toothItemBoxTitle2">
                        <span>牙结石</span>
                        <span>牙龈出血</span>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number3" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[8]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[9]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number4" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[10]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[11]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <!-- 牙冠符号 -->
                  <div class="signBox signBox2">
                    <div v-for="k in 2" :key="k">
                      <p class="signTitle signTitle2 BTitle">
                        {{ k == 1 ? "牙龈出血" : "牙结石" }}
                      </p>
                      <table class="tableClas">
                        <tr v-for="(item, index) in signData2" :key="index">
                          <td>{{ item.one }}</td>
                          <td>{{ item.two }}</td>
                          <td style="width: 135px; text-align: left">{{ item.tree }}</td>
                          <td style="width: 135px; text-align: left">{{ item.four }}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <!-- 氟牙症 -->
                <div class="body3">
                  <div class="item1">
                    <p class="BTitle">氟牙证(仅检查12岁年龄组学生)</p>
                    <ul>
                      <li><span>0</span><span>正常</span></li>
                      <li><span>1</span><span>可疑</span></li>
                      <li><span>2</span><span>很轻</span></li>
                      <li><span>3</span><span>轻度</span></li>
                      <li><span>4</span><span>中度</span></li>
                      <li><span>5</span><span>重度</span></li>
                      <li><span>9</span><span>不做记录</span></li>
                    </ul>
                    <div class="redBorder">
                      <input v-model="boy_babyForm.custom13" />
                    </div>
                  </div>
                  <div class="item2">
                    <p class="BTitle">需要立即处理和安排治疗的情况说明</p>
                    <div class="flex bottomRightClas">
                      <span>有=1</span>
                      <span class="redBorder">
                        <input v-model="boy_babyForm.custom14" />
                      </span>
                    </div>
                    <p class="BTitle">表格类型</p>
                    <div class="bottomRightClas2">
                      <ul>
                        <li>原始表=1</li>
                        <li>复查表=2</li>
                      </ul>
                      <span class="redBorder">
                        <input v-model="boy_babyForm.custom15" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <template v-if="listQuery.tableName == 'adult'">
              <div class="formBoxClas">
                <!-- 用户信息 -->
                <div class="header">
                  <ul class="titleOne">
                    <li>
                      ID号: <span>{{ boy_babyForm.regid }}</span>
                    </li>
                    <li>
                      姓名: <span class="nameClas">{{ boy_babyForm.name }}</span>
                    </li>
                    <li>
                      性别:
                      <span>{{
                        boy_babyForm.sex == 0
                          ? "未知"
                          : boy_babyForm.sex == 1
                          ? "男"
                          : "女"
                      }}</span>
                    </li>
                    <li>
                      出生日期: <span>{{ boy_babyForm.birthday }}</span>
                    </li>
                  </ul>
                  <ul class="titleTwo">
                    <li>
                      检查年份: <span>{{ boy_babyForm.checkyear }}</span>
                    </li>
                    <li>
                      检查日期: <span>{{ boy_babyForm.checkdate }}</span>
                    </li>
                    <li>
                      受教有年限:
                      <span class="yearClas"
                        ><el-input
                          v-model="boy_babyForm.educateyear"
                          placeholder="年限"
                          style="width: 100%"
                        ></el-input
                      ></span>
                    </li>
                  </ul>
                </div>
                <div class="body1">
                  <!-- 牙状况 -->
                  <div class="toothBox">
                    <p class="toothTitle BTitle">牙状况</p>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number1" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[0]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number2" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[1]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number3" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[2]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number4" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[3]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <!-- 牙冠符号 -->
                  <div class="signBox">
                    <p class="signTitle BTitle">牙冠符号</p>
                    <table
                      class="tableClas"
                      v-for="i in 3"
                      :key="i"
                      :style="i == 2 ? 'width:240px' : ''"
                    >
                      <tr>
                        <th>乳牙</th>
                        <th>恒牙</th>
                        <th></th>
                      </tr>
                      <tr v-for="(item, index) in signData[i - 1]" :key="index">
                        <td>{{ item.ru }}</td>
                        <td>{{ item.heng }}</td>
                        <td style="width: 135px; text-align: left">{{ item.wu }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <div class="body1 body2">
                  <!-- 牙状况 -->
                  <div class="toothBox">
                    <p class="toothTitle BTitle">牙周状况</p>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle toothItemBoxTitle2">
                        <span>牙龈出血</span>
                        <span>牙结石</span>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number1" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[4]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[5]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number2" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[6]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[7]"
                            :key="tem.val + tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle toothItemBoxTitle2">
                        <span>牙结石</span>
                        <span>牙龈出血</span>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number3" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[8]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[9]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number4" :key="index">{{ num }}</li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[10]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll[11]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <!-- 牙冠符号 -->
                  <div class="signBox signBox2">
                    <div v-for="k in 2" :key="k">
                      <p class="signTitle signTitle2 BTitle">
                        {{ k == 1 ? "牙龈出血" : "牙结石" }}
                      </p>
                      <table class="tableClas">
                        <tr v-for="(item, index) in signData2" :key="index">
                          <td>{{ item.one }}</td>
                          <td>{{ item.two }}</td>
                          <td style="width: 135px; text-align: left">{{ item.tree }}</td>
                          <td style="width: 135px; text-align: left">{{ item.four }}</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
                <!-- 氟牙症 -->
                <div class="body3">
                  <div class="item1">
                    <p class="BTitle">氟牙证(仅检查12岁年龄组学生)</p>
                    <ul>
                      <li><span>0</span><span>正常</span></li>
                      <li><span>1</span><span>可疑</span></li>
                      <li><span>2</span><span>很轻</span></li>
                      <li><span>3</span><span>轻度</span></li>
                      <li><span>4</span><span>中度</span></li>
                      <li><span>5</span><span>重度</span></li>
                      <li><span>9</span><span>不做记录</span></li>
                    </ul>
                    <div class="redBorder">
                      <input v-model="boy_babyForm.custom13" />
                    </div>
                  </div>
                  <div class="item2">
                    <p class="BTitle">需要立即处理和安排治疗的情况说明</p>
                    <div class="flex bottomRightClas">
                      <span>有=1</span>
                      <span class="redBorder">
                        <input v-model="boy_babyForm.custom14" />
                      </span>
                    </div>
                    <p class="BTitle">表格类型</p>
                    <div class="bottomRightClas2">
                      <ul>
                        <li>原始表=1</li>
                        <li>复查表=2</li>
                      </ul>
                      <span class="redBorder">
                        <input v-model="boy_babyForm.custom15" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- 幼儿 -->
            <template v-else>
              <div class="formBoxClas babyFormBoxClas">
                <!-- 用户信息 -->
                <div class="header">
                  <ul class="titleOne">
                    <li>
                      ID号: <span>{{ boy_babyForm.regid }}</span>
                    </li>
                    <li>
                      姓名: <span class="nameClas">{{ boy_babyForm.name }}</span>
                    </li>
                    <li>
                      性别:
                      <span>
                        {{
                          boy_babyForm.sex == 0
                            ? "未知"
                            : boy_babyForm.sex == 1
                            ? "男"
                            : "女"
                        }}</span
                      >
                    </li>
                    <li>
                      出生日期: <span>{{ boy_babyForm.birthday }}</span>
                    </li>
                  </ul>
                  <ul class="titleTwo">
                    <li>
                      <span>检查年份: {{ boy_babyForm.checkyear }}</span>
                      <span> 检查日期:{{ boy_babyForm.checkdate }}</span>
                    </li>
                  </ul>
                </div>
                <div class="body1">
                  <!-- 牙状况 -->
                  <div class="toothBox">
                    <p class="toothTitle BTitle">牙状况</p>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number1_2" :key="index">
                            {{ num }}
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="(tem, i) in numDataAll_2[0]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne border_buttom">
                        <ul class="numberClas">
                          <li v-for="(num, index) in number2_2" :key="index">
                            {{ num }}
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll_2[1]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                    <ul class="toothItemBox">
                      <li class="toothItemBoxTitle">牙冠</li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li :key="index" v-for="(num, index) in number3_2">
                            {{ num }}
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll_2[2]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                      <li class="toothItemOne">
                        <ul class="numberClas">
                          <li :key="index" v-for="(num, index) in number4_2">
                            {{ num }}
                          </li>
                          <li
                            class="bacRedClas"
                            v-for="tem in numDataAll_2[3]"
                            :key="tem.id"
                          >
                            <input v-model="tem.val" />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                  <!-- 牙冠符号 -->
                  <div class="signBox">
                    <p class="signTitle BTitle">牙冠符号</p>
                    <table class="tableClas">
                      <tr>
                        <th>乳牙</th>
                        <th>恒牙</th>
                        <th></th>
                      </tr>
                      <tr v-for="(item, index) in signData_baby" :key="index">
                        <td>{{ item.ru }}</td>
                        <td>{{ item.heng }}</td>
                        <td style="width: 140px; text-align: left">{{ item.wu }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <!-- 说明--- 表格类型  -->
                <div class="body3">
                  <div class="item2">
                    <div class="left">
                      <p class="BTitle">需要立即处理和安排治疗的情况说明</p>
                      <div class="bottomRightClas2">
                        <ul>
                          <li>有=1</li>
                          <li>无=0</li>
                        </ul>
                        <span class="redBorder">
                          <input v-model="boy_babyForm.custom5" />
                        </span>
                      </div>
                    </div>
                    <div class="right">
                      <p class="BTitle">表格类型</p>
                      <div class="bottomRightClas2">
                        <ul>
                          <li>原始表=1</li>
                          <li>复查表=2</li>
                        </ul>
                        <span class="redBorder">
                          <input v-model="boy_babyForm.custom6" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <span slot="footer" class="dialog-footer">
              <el-button size="mini" type="primary" @click="handleAllSubmit"
                >保 存</el-button
              >
            </span>
          </el-dialog>
          <!-- 分页 -->
          <!-- <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQuery.page"
            :page-size="listQuery.limit"
            :page-sizes="[1, 100, 200, 300, 1000, 5000]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="listQuery.count"
          >
          </el-pagination> -->
        </el-main>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import { Load, Detail, Save } from "@/api/mouthcavity";
import { printBase64 } from "@/api/printreport.js";
import waves from "@/directive/waves"; // 水波纹指令

export default {
  name: "setdictionary",
  directives: {
    waves,
  },
  components: { Sticky, Pagination },
  data() {
    const today = new Date();
    const oneMonthAgo = new Date();
    const star_endToday = new Date(today).toISOString().split("T")[0];

    // 设置一个月前的日期
    oneMonthAgo.setDate(today.getDate() - 30); // 这里假设一个月为大约30天，实际应用中可能需要更精确的计算方式
    // 格式化日期为 'yyyy-MM-dd'
    const formatToDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份加1是因为JavaScript中月份是从0开始的
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    };
    return {
      defaultChecked: [1], // 默认选中数据
      timeId: "", // 默认选中数据
      tableKey: 0,
      multipleSelection: [], // 列表checkbox选中的值
      defaultProps: {
        // tree配置项
        children: "children",
        label: "label",
      },
      // 树状数据
      setdictionaryTypes: [
        { name: "boy", txt: "青少年口腔体检", id: 1 },
        { name: "baby", txt: "婴幼儿口腔体检", id: 2 },
        { name: "adult", txt: "成人口腔体检", id: 3 },
      ],
      // 树状数据配置项
      setdictionaryTypeProps: {
        children: "children",
        label: "txt",
      },
      // 分页
      currentPage: 1,
      pageSize: 100,
      count: 0,
      DialogShow: false, // dialog 开关
      allData: [], // 数据
      listQuery: {
        // 查询条件
        key: undefined,
        id: undefined,
        date: "",
        page: 1,
        limit: 100,
        count: 0,
        tableName: "",
        combinecode: "",
      },
      searchform: {
        // 搜索集
        name: "",
        regid: "",
        date: [],
      },
      zongjian_startDate: formatToDateStr(oneMonthAgo),
      zongjian_endDate: formatToDateStr(today),
      star_endToday,
      // 青少年--幼儿表--header有年限
      boy_babyForm: {
        name: "",
        age: "",
        sex: "",
        regid: "",
        birthday: "",
        checkdate: "",
        checkyear: "",
        custom1: "",
        custom2: "",
        custom3: "",
        custom4: "",
        custom5: "",
        custom6: "",
        custom7: "",
        custom8: "",
        custom9: "",
        custom10: "",
        custom11: "",
        custom12: "",
        custom13: "",
        custom14: "",
        custom15: "",
        custom16: "",
      },
      // number 1-4 展示数据
      number1: [
        "",
        "",
        "55",
        "54",
        "53",
        "52",
        "51",
        "17",
        "16",
        "15",
        "14",
        "13",
        "12",
        "11",
      ],
      number2: [
        "61",
        "62",
        "63",
        "64",
        "65",
        "",
        "",
        "21",
        "22",
        "23",
        "24",
        "35",
        "26",
        "27",
      ],
      number3: [
        "",
        "",
        "85",
        "84",
        "83",
        "82",
        "81",
        "47",
        "46",
        "45",
        "44",
        "43",
        "42",
        "41",
      ],
      number4: [
        "71",
        "72",
        "73",
        "74",
        "75",
        "",
        "",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
      ],
      number1_2: ["", "55", "54", "53", "52", "51", "16", "15", "14", "13", "12", "11"],
      number2_2: ["61", "62", "63", "64", "65", "", "21", "22", "23", "24", "35", "26"],
      number3_2: ["", "85", "84", "83", "82", "81", "46", "45", "44", "43", "42", "41"],
      number4_2: ["71", "72", "73", "74", "75", "", "31", "32", "33", "34", "35", "36"],
      // signData  展示数据
      signData: [
        [
          { ru: "A", heng: "0", wu: "无龋" },
          { ru: "B", heng: "1", wu: "冠龋" },
          { ru: "C", heng: "2", wu: "已填充有龋" },
          { ru: "D", heng: "3", wu: "已填充无龋" },
        ],
        [
          { ru: "E", heng: "4", wu: "因龋缺失" },
          { ru: "X", heng: "5", wu: "引其他原因失牙" },
          { ru: "F", heng: "6", wu: "窝沟封闭" },
          { ru: "G", heng: "7", wu: "桥基牙,特殊冠或贴面" },
        ],
        [
          { ru: "X", heng: "8", wu: "未萌芽" },
          { ru: "T", heng: "T", wu: "外伤" },
          { ru: "N", heng: "9", wu: "不做记录" },
        ],
      ],
      signData2: [
        { one: "0", two: "无", tree: "9", four: "不做记录" },
        { one: "1", two: "有", tree: "X", four: "缺失牙" },
      ],
      signData_baby: [
        { ru: "A", heng: "0", wu: "无龋" },
        { ru: "B", heng: "1", wu: "冠龋" },
        { ru: "C", heng: "2", wu: "已填充有龋" },
        { ru: "D", heng: "3", wu: "已填充无龋" },
        { ru: "E", heng: "4", wu: "因龋缺失" },
        { ru: "X", heng: "5", wu: "因其他原因失牙" },
        { ru: "F", heng: "6", wu: "窝沟封闭" },
        { ru: "G", heng: "7", wu: "桥基牙,特殊冠或贴面" },
        { ru: "X", heng: "8", wu: "未萌芽" },
        { ru: "T", heng: "T", wu: "外伤" },
        { ru: "N", heng: "9", wu: "不做记录" },
      ],
      // numDataAll 传送数据
      numDataAll: [
        [
          { val: "", id: "a1" },
          { val: "", id: "a2" },
          { val: "", id: "a3" },
          { val: "", id: "a4" },
          { val: "", id: "a5" },
          { val: "", id: "a6" },
          { val: "", id: "a7" },
        ],
        [
          { val: "", id: "a8" },
          { val: "", id: "a9" },
          { val: "", id: "a10" },
          { val: "", id: "a11" },
          { val: "", id: "a12" },
          { val: "", id: "a13" },
          { val: "", id: "a14" },
        ],
        [
          { val: "", id: "15" },
          { val: "", id: "16" },
          { val: "", id: "17" },
          { val: "", id: "18" },
          { val: "", id: "19" },
          { val: "", id: "20" },
          { val: "", id: "21" },
        ],
        [
          { val: "", id: "22" },
          { val: "", id: "23" },
          { val: "", id: "24" },
          { val: "", id: "25" },
          { val: "", id: "26" },
          { val: "", id: "27" },
          { val: "", id: "28" },
        ],
        [
          { val: "", id: "29" },
          { val: "", id: "30" },
          { val: "", id: "31" },
          { val: "", id: "32" },
          { val: "", id: "33" },
          { val: "", id: "34" },
          { val: "", id: "35" },
        ],
        [
          { val: "", id: "36" },
          { val: "", id: "37" },
          { val: "", id: "38" },
          { val: "", id: "39" },
          { val: "", id: "40" },
          { val: "", id: "41" },
          { val: "", id: "42" },
        ],
        [
          { val: "", id: "43" },
          { val: "", id: "44" },
          { val: "", id: "45" },
          { val: "", id: "46" },
          { val: "", id: "47" },
          { val: "", id: "48" },
          { val: "", id: "49" },
        ],
        [
          { val: "", id: "50" },
          { val: "", id: "51" },
          { val: "", id: "52" },
          { val: "", id: "53" },
          { val: "", id: "54" },
          { val: "", id: "55" },
          { val: "", id: "56" },
        ],
        [
          { val: "", id: "57" },
          { val: "", id: "58" },
          { val: "", id: "59" },
          { val: "", id: "60" },
          { val: "", id: "61" },
          { val: "", id: "62" },
          { val: "", id: "63" },
        ],
        [
          { val: "", id: "64" },
          { val: "", id: "65" },
          { val: "", id: "67" },
          { val: "", id: "68" },
          { val: "", id: "69" },
          { val: "", id: "70" },
          { val: "", id: "71" },
        ],
        [
          { val: "", id: "72" },
          { val: "", id: "73" },
          { val: "", id: "74" },
          { val: "", id: "75" },
          { val: "", id: "76" },
          { val: "", id: "77" },
          { val: "", id: "78" },
        ],
        [
          { val: "", id: "79" },
          { val: "", id: "80" },
          { val: "", id: "81" },
          { val: "", id: "82" },
          { val: "", id: "83" },
          { val: "", id: "84" },
          { val: "", id: "85" },
        ],
      ],
      // 幼儿
      numDataAll_2: [
        [
          { val: "", id: "a1" },
          { val: "", id: "a2" },
          { val: "", id: "a3" },
          { val: "", id: "a4" },
          { val: "", id: "a5" },
          { val: "", id: "a6" },
        ],
        [
          { val: "", id: "a8" },
          { val: "", id: "a9" },
          { val: "", id: "a10" },
          { val: "", id: "a11" },
          { val: "", id: "a12" },
          { val: "", id: "a13" },
        ],
        [
          { val: "", id: "15" },
          { val: "", id: "16" },
          { val: "", id: "17" },
          { val: "", id: "18" },
          { val: "", id: "19" },
          { val: "", id: "20" },
        ],
        [
          { val: "", id: "22" },
          { val: "", id: "23" },
          { val: "", id: "24" },
          { val: "", id: "25" },
          { val: "", id: "26" },
          { val: "", id: "27" },
        ],
      ],
      titleName: "三沙市人民医院口腔健康调查表(6-14岁)",
      itemboy_babyForm: null, // 临时存储数据
    };
  },
  filters: {},
  computed: {
    // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters(["modulesTree", "iframeViews", "visitedViews"]),
    typesBtns() {
      var route = this.$route;
      var elements = route.meta.elements;
      elements =
        elements &&
        elements.length > 0 &&
        elements.sort((a, b) => {
          return a.sort - b.sort;
        });
      return elements || [];
    },
  },
  mounted() {
    clearTimeout(this.timeId);
    // 默认选中第一个
    this.timeId = setTimeout(() => {
      if (this.setdictionaryTypes.length == 0) return;
      this.defaultChecked.push(this.setdictionaryTypes[0].id);
      let code = this.setdictionaryTypes[0].id;
      this.$refs[`treeItem_${code}`].click();
    }, 400);
  },
  methods: {
    // 获取详情
    getDetail(regid, combinecode) {
      Detail({ regid, combinecode }).then((res) => {
        this.boy_babyForm = res.result;
        this.itemboy_babyForm = res; // 临时创建
        if (this.listQuery.tableName == "boy" || this.listQuery.tableName == "adult") {
          // 成人 | 青少年
          this.getBoyDetail(this.itemboy_babyForm);
        } else {
          // 婴幼儿
          this.getBabyDetail(this.itemboy_babyForm);
        }
      });
    },
    // 成人 | 青少年
    getBoyDetail(res) {
      console.log(res.result, "进入方法未处理数据");
      this.numDataAll.forEach((k, i) => {
        let RESULT = res.result[`custom${i + 1}`].split("|");
        let arr = [];
        // 第一次进来没有数据的话,就把原数据赋值,避免页面错乱(页面for循环数组渲染出来的)
        console.log(RESULT, RESULT.length, "RESULT");
        if (RESULT.length != "7") {
          RESULT = this.numDataAll[i];
          arr = RESULT.map((u, index) => {
            return {
              val: u.val,
              id: this.numDataAll[i][index].id, // 找到原数组的id
            };
          });
        } else {
          arr = RESULT.map((u, index) => {
            return {
              id: this.numDataAll[i][index].id,
              val: u,
            };
          });
        }
        this.numDataAll[i] = arr;
        this.boy_babyForm[`custom${i + 1}`] = "";
      });
      console.log(this.numDataAll, "处理过的数据");
    },

    getBabyDetail(res) {
      console.log(res.result, "进入方法未处理数据");
      this.numDataAll_2.forEach((k, i) => {
        let RESULT = res.result[`custom${i + 1}`].split("|");
        let arr = [];
        // 第一次进来没有数据的话,就把原数据赋值,避免页面错乱(页面for循环数组渲染出来的)
        console.log(RESULT, RESULT.length, "RESULT");
        if (RESULT.length != 6) {
          RESULT = this.numDataAll_2[i];
          arr = RESULT.map((u, index) => {
            return {
              val: u.val,
              id: this.numDataAll_2[i][index].id, // 找到原数组的id
            };
          }).filter(Boolean);
        } else {
          arr = RESULT.map((u, index) => {
            if (index > 5) return;
            return {
              id: this.numDataAll_2[i][index].id,
              val: u,
            };
          }).filter(Boolean);
        }
        this.numDataAll_2[i] = arr;
        this.boy_babyForm[`custom${i + 1}`] = "";
      });
      this.numDataAll_2.custom5 == "||||||" ? "" : this.numDataAll_2.custom5;
      this.numDataAll_2.custom6 == "||||||" ? "" : this.numDataAll_2.custom6;
      console.log(this.numDataAll_2, "处理过的数据");
    },
    // 搜索确定回调
    handlesearchSubmitDialog() {
      console.log(this.searchform, "this.searchform");
      this.searchform = {
        page: 1,
        limit: 99,
        whereitems: [
          {
            key: "name",
            value: this.searchform.name,
          },
          {
            key: "combinecode",
            value:
              this.listQuery.tableName == "boy"
                ? "205047"
                : this.listQuery.tableName == "baby"
                ? "205048"
                : "205049",
          },
          {
            key: "regid",
            value: this.searchform.regid,
          },
          {
            key: "startdate",
            value: this.searchform?.date[0] || "",
          },
          {
            key: "enddate",
            value: this.searchform?.date[1] || "",
          },
        ],
      };
      this.searchform.date = [];
      this.getList(this.searchform); // 获取对应数据
    },
    // 清空集合 初始化
    close() {
      this.searchform = {
        name: "",
        regid: "",
        date: [],
      };
      this.listQuery.page = 1;
      this.listQuery.limit = 100;
      // 清空数据
      this.numDataAll.forEach((k) => {
        k.forEach((u) => {
          u.val = "";
        });
      });
      this.numDataAll_2.forEach((k) => {
        k.forEach((u) => {
          u.val = "";
        });
      });
      this.boy_babyForm = {
        name: "",
        age: "",
        sex: "",
        regid: "",
        birthday: "",
        checkdate: "",
        checkyear: "",
        custom1: "",
        custom2: "",
        custom3: "",
        custom4: "",
        custom5: "",
        custom6: "",
        custom7: "",
        custom8: "",
        custom9: "",
        custom10: "",
        custom11: "",
        custom12: "",
        custom13: "",
        custom14: "",
        custom15: "",
        custom16: "",
      };
    },
    handleAllSubmit() {
      if (this.listQuery.tableName == "baby") {
        this.boy_babyForm.combinecode = "205048";
        this.handleBabySubmitDialog();
        return;
      }
      if (this.listQuery.tableName == "boy" || this.listQuery.tableName == "adult") {
        // this.boy_babyForm.combinecode = "205047";
        this.boy_babyForm.combinecode =
          this.listQuery.tableName == "boy" ? "205047" : "205049";
        this.handleBoySubmitDialog();
      }
    },
    // 确定回调 -- 幼儿
    handleBabySubmitDialog() {
      console.log("baby的数据", this.numDataAll_2);
      this.numDataAll_2.forEach((k, i) => {
        console.log(k, this.boy_babyForm[`custom${i + 1}`]);
        this.boy_babyForm[`custom${i + 1}`] = k
          .map((u) => {
            if (!!u.val) {
              return u.val;
            } else {
              return ``;
            }
          })
          .join("|");
      });
      this.saveFun(this.boy_babyForm);
    },
    // 青少年
    handleBoySubmitDialog() {
      // this.numDataAll 本地数据;
      this.numDataAll.forEach((k, i) => {
        this.boy_babyForm[`custom${i + 1}`] = k
          .map((u) => {
            if (!!u.val) {
              return u.val;
            } else {
              return ``;
            }
          })
          .join("|");
      });
      this.saveFun(this.boy_babyForm);
    },
    // 保存
    saveFun(obj) {
      console.log(1);
      Save(obj).then((res) => {
        if (res.code == 200) {
          this.$message.success("保存成功");
          this.getList();
          this.DialogShow = false;
        }
      });
      this.close();
    },

    // 编辑弹框关闭回调
    handleCloseDialog(node) {
      this.DialogShow = false;
      node();
    },
    // 勾选回调
    handleSelectionChange(row) {
      this.multipleSelection = row;
    },
    // 点击当前行
    rowClick(row) {},
    // 获取对应数据
    getList(searchObj) {
      Load(
        searchObj || {
          page: 1,
          limit: 99,
          whereitems: [
            {
              key: "combinecode",
              value:
                this.listQuery.tableName == "boy"
                  ? "205047"
                  : this.listQuery.tableName == "baby"
                  ? "205048"
                  : "205049",
            },
          ],
        }
      ).then((res) => {
        if (res.data != null) this.allData = res.data.customeritems;
        else this.allData = [];
      });
    },
    // 左侧切换回调
    handleNodeClick(val) {
      this.listQuery.tableName = val.name;
      console.log(this.listQuery.tableName);
      this.titleName =
        this.listQuery.tableName == "boy"
          ? "三沙市人民医院口腔健康调查表(6-14岁)"
          : this.listQuery.tableName == "adult"
          ? "三沙市人民医院口腔健康调查表"
          : "三沙市人民医院口腔健康调查表(3-5岁)";
      this.listQuery.page = 1;
      this.listQuery.limit = 100;
      this.close(); // 清空搜索表单
      this.getList(); // 获取对应数据
    },
    handlebtnPrint() {
      this.multipleSelection.forEach((k) => {
        let data = {
          fingercode: localStorage.getItem("md5code"),
          codes: [k.regid],
          repname:
            this.listQuery.tableName == "boy"
              ? "青少年口腔健康调查表"
              : "婴幼儿口腔健康调查表",
          printflag: 1,
          whereitems: [],
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
      });
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
    // 按钮组回调
    onBtnClicked: async function (domId) {
      console.log(domId);
      switch (domId) {
        // 添加
        case "btnAdd":
          break;
        // 编辑
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.DialogShow = true;
          let { regid } = this.multipleSelection[0];
          console.log(this.multipleSelection);
          await this.close();
          this.getDetail(
            regid,
            this.listQuery.tableName == "boy"
              ? "205047"
              : this.listQuery.tableName == "baby"
              ? "205048"
              : "205049"
          );
          break;
        case "btnPrint": // 打印口腔表
          this.handlebtnPrint();
          break;
        case "btnSearch": // 搜索
          this.handlesearchSubmitDialog();
          break;
        case "btnClose": // 关闭当前页
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    // 每页条数
    handleSizeChange(val) {
      this.listQuery.limit = val;
      console.log(val, "每页条数");
      this.getList();
    },
    // 当前页
    handleCurrentChange(val) {
      this.listQuery.page = val;
      console.log(val, "当前页");
      this.getList();
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
      if (row.illnessstatus > 0) {
        return "renBcClas";
      }
      if (rowIndex % 2 == 0) {
        return "statistics-warning-row";
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/* 
rel="stylesheet/scss"
*/
// @import url("./index.scss");
ul {
  margin: 0;
  padding: 0;
}

li:before,
li:after {
  content: "";
  display: block;
  height: 0;
  overflow: hidden;
}

/* 尝试清除特定浏览器中的样式 */
li {
  list-style-type: none !important;
  /* 使用 !important 关键字强制覆盖 */
}

.form_box {
  .el-form-item {
    display: flex !important;
  }

  .el-form-item__content {
    display: flex;
  }
}

.el-form-item {
  display: flex !important;
}

.el-form-item__content {
  display: flex;
}

.el-form-item {
  display: flex !important;
  margin: 0 !important;
  white-space: nowrap !important;
}

.el-form-item__content {
  display: flex;

  /deep/.el-form-item {
    display: flex !important;
    background-color: skyblue !important;
  }

  /deep/.el-form-item__content {
    display: flex;
  }
}

.btnBoxClas {
  display: flex;
  justify-content: center;

  /* 水平居中对齐 */
  .sub-navbar {
    height: auto;
  }

  .filter-container {
    display: flex;
    align-items: center;
  }
}

.el-table .renBcClas {
  background-color: rgb(241, 210, 210) !important;
}

.formBoxClas {
  width: 100%;
  border: 2px solid #000;

  input {
    border: 0;
    border: none;
    background: node;
  }

  input:focus {
    border: 0;
    outline: none;
  }

  /deep/.el-input__inner {
    border: 0;
    border: none;
    background: node;
    text-align: center;
  }

  .el-input__inner:focus {
    border: 0;
    border: none;
    outline: none;
  }

  .header {
    border-bottom: 2px solid black;
    padding: 5px 0;

    .titleOne,
    .titleTwo {
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      padding: 0 20px;

      span {
        display: inline-block;
      }
    }

    .titleOne {
      .nameClas {
        border-bottom: 2px solid black;
        width: 100px;
        text-align: center;
      }
    }

    .titleTwo {
      .yearClas {
        width: 150px;
        text-align: center;
        position: relative;

        input {
          text-align: center;
        }

        .el-input__inner {
          text-align: center;
        }
      }

      .yearClas::after {
        content: "";
        display: block;
        position: absolute;
        bottom: 3px;
        width: 150px;
        height: 2px;
        background-color: black;
        left: 50%;
        margin-left: -75px;
      }
    }
  }

  .body1 {
    border-bottom: 2px solid black;

    .toothBox,
    .signBox {
      margin: auto;
    }

    .toothBox::after {
      content: "";
      display: block;
      width: 3px;
      height: 200px;
      background-color: black;
      position: absolute;
      left: calc(55% - 19px);
      top: 50px;
    }

    .toothBox {
      width: 700px;
      height: 260px;
      position: relative;

      .toothItemBox > li {
        flex: 1;
      }

      .toothItemBox {
        display: flex;

        .border_buttom {
          border-bottom: 2px solid black;
          padding-bottom: 5px;
          margin-bottom: 10px;
        }

        .toothItemBoxTitle {
          flex: 0 1 13%;
          width: 50px;
          text-align: center;
          line-height: 102px;
        }

        .toothItemOne {
          flex: 0 1 20%;

          .numberClas {
            display: flex;
            flex-wrap: wrap;
            /* 允许子元素换行 */
            width: 280px;

            li {
              width: 33px;
              height: 30px;
              text-align: center;
              line-height: 30px;
              margin: 1px 3px;
            }

            .bacRedClas {
              border: 1px solid red;

              input {
                width: 100%;
                height: 100%;
                padding: 0;
                border: 0;
                background: none;
                text-align: center;
              }

              .el-input__inner {
                width: 100%;
                height: 100%;
                padding: 0;
                border: 0;
                background: none;
                text-align: center;
              }
            }
          }
        }
      }
    }

    .signBox {
      width: 700px;
      height: 180px;

      .tableClas {
        width: 230px;
        display: inline-block;
        vertical-align: top;

        th,
        td {
          width: 50px;
          text-align: center;
          font-weight: 500;
        }

        th {
        }
      }
    }
  }

  .BTitle {
    font-weight: bold;
    color: black;
    font-size: 17px;
  }

  .body2 {
    .toothBox::after {
      height: 264px !important;
    }

    .toothBox {
      height: auto !important;

      .toothItemBox {
        .toothItemBoxTitle2 {
          padding-top: 30px;

          span {
            display: block;
            margin: 0 auto;
            height: 34px;
          }
        }
      }
    }

    .signBox2 {
      display: flex !important;
      justify-content: space-between !important;
      padding: 0 25px !important;
      height: 120px !important;

      .signTitle2 {
      }
    }
  }

  .body3 {
    width: 100%;
    min-height: 180px;
    border: 2px solid balck;
    display: flex;

    .item1,
    .item2 {
      width: 50%;
      height: 100%;
    }

    .item1 {
      padding-left: 50px;

      p {
        margin: 0;
        padding: 0;
      }

      ul > li {
        width: 200px;
        padding: 2px 0;
      }

      ul > li span:first-child {
        display: inline-block;
        margin: 0 80px 0 20px;
      }

      ul,
      .redBorder {
        display: inline-block;
        vertical-align: top;
      }

      .redBorder {
        margin: 80px 0 0 55px;
        border: 1px solid red;
        width: 30px;
        height: 30px;

        input {
          width: 100%;
          height: 30px;
          padding: 0;
          border: 0;
          background: none;
          text-align: center;
        }

        .el-input__inner {
          width: 100%;
          height: 30px;
          padding: 0;
          border: 0;
          background: none;
          text-align: center;
        }
      }
    }

    .item2 {
      border-left: 2px solid black;
      padding-left: 30px;

      p {
        margin: 0;
        padding: 0;
      }

      .bottomRightClas {
        margin: 30px auto;
        width: 175px;
      }

      span,
      .redBorder {
        display: inline-block;
        vertical-align: top;
        line-height: 30px;
      }

      .redBorder {
        border: 1px solid red;
        width: 30px;
        height: 30px;

        input {
          width: 100%;
          height: 30px;
          padding: 0;
          border: 0;
          background: none;
          text-align: center;
        }

        .el-input__inner {
          width: 100%;
          height: 30px;
          padding: 0;
          border: 0;
          background: none;
          text-align: center;
        }
      }

      .bottomRightClas2 {
        margin: 30px auto;
        width: 175px;

        ul,
        span {
          display: inline-block;
          vertical-align: top;
        }

        .redBorder {
          margin: 11px 0 0 80px;
        }

        ul li {
          padding: 2px;
        }
      }
    }
  }
}

.babyFormBoxClas {
  .toothBox::after {
    left: calc(56% - 16px) !important;
  }

  .toothBox {
  }

  .toothItemBoxTitle {
    flex: 0 1 20% !important;
  }

  .numberClas {
    width: 240px !important;
  }

  .titleTwo > li > span {
    display: inline-block !important;
    margin-right: 114px !important;
  }

  .signBox {
    height: auto !important;

    .signTitle {
      margin-right: 80px;
    }

    .signTitle,
    .tableClas {
      display: inline-block !important;
    }

    .tableClas {
      width: 500px !important;
      margin-top: 13px;

      tr,
      td {
        width: 143px !important;
      }
    }
  }

  .body3 {
    .item2 {
      width: 100% !important;

      .left,
      .right {
        width: 50%;
        display: inline-block;
      }
    }
  }
}

.flex {
  display: flex;
  justify-content: space-between;
}
.dialog-mini .el-select {
  width: 100%;
}
.setdictionary-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;
  .setdictionary-menu-card {
    height: calc(100% - 86px);
    overflow: auto;
    .el-card__body {
      height: auto;
    }
  }
}
.setdictionary-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .setdictionary-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    .setdictionary-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }
  .buttons-box {
    padding: 10px 10px;
    background: #f5f5f5;
  }
  .setdictionary-content {
    height: 100%;
    padding: 0;
    .buttons-box {
      text-align: right;
    }
  }
}
</style>
