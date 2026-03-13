<template>
  <div class="makepolicy">
    <!-- 头部tabs切换页面 -->
    <el-radio-group v-model="pageStatus" @change="handleChangePageStatus" size="small" class="page_status">
      <el-radio-button label="crowd">
        <div class="text">人群分析</div>
      </el-radio-button>
      <el-radio-button label="income">
        <div class="text">收入分析</div>
      </el-radio-button>
      <el-radio-button label="TAT">
        <div class="text">TAT分析</div>
      </el-radio-button>
    </el-radio-group>
    <!-- 头部筛选盒子 -->
    <div class="search_box" v-if="pageStatus != 'TAT'">
      <!-- 时间 -->
      <div class="time_box">
        <div class="t_title">体检时间</div>
        <el-date-picker size="mini" v-model="searchDate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <!-- 按钮组 -->
      <div class="group_btn">
        <!-- <el-button type="primary" size="mini" plain>上一月</el-button>
        <el-button type="primary" size="mini" plain>下一月</el-button> -->
        <el-button type="primary" size="mini" plain @click="handleGetSearchTime">今年</el-button>
        <el-button type="primary" size="mini" plain @click="handleGetSearchTime('prev')">上一年</el-button>
        <!-- <el-button
          type="primary"
          size="mini"
          plain
          @click="handleGetSearchTime('next')"
          >下一年</el-button
        > -->
      </div>
      <div class="reset_btn">
        <el-button type="primary" size="mini" icon="el-icon-refresh" plain @click="handleResetPage">刷新</el-button>
        <el-button type="primary" size="mini" icon="el-icon-close" plain @click="handleClosePage">关闭</el-button>
      </div>
    </div>
    <!-- 人群分析 -->
    <div class="crowd_analys" v-if="pageStatus == 'crowd'">
      <!-- 体检进度 -->
      <div class="check_schedule mt2">
        <!-- 头部标题 -->
        <div class="head">
          <div class="title">体检进度</div>
        </div>
        <!-- 主体扇形图 -->
        <div class="check_body">
          <div class="check_item total">
            <img :src="imgTotal" :draggable="false" alt="" />
            <div class="num_box">
              <!-- <countTo class="subscribe" :startVal='0' :endVal='480000' :duration="2000" /> -->
              <countTo class="subscribe" :startVal="0" :endVal="nowYearCount" :duration="2000" />
              <div class="text">人数</div>
            </div>
          </div>
          <!-- 检查图表 -->
          <div class="check_item bg2 inspect">
            <div class="inspect_top">
              <div class="percentage">
                <!-- <div class="p_top">
                  <div class="p_icon" v-show="group">↑</div>
                  <div class="p_icon" v-show="!group">↓</div>
                  <div class="p_text" v-show="group">{{ groupUp }}</div>
                  <div class="p_text" v-show="!group">{{ groupDown }}</div>
                </div> -->
                <div class="p_bom">
                  团检{{ inspect.groupMedicalPercentage }}
                </div>
              </div>
              <div id="inspectChart" ref="inspectChart" class="inspectChart"></div>
              <div class="percentage">
                <div class="p_top">
                  <!-- <div class="p_icon" v-show="personal">↑</div>
                  <div class="p_icon" v-show="!personal">↓</div>
                  <div class="p_text" v-show="personal">{{ personalUp }}</div>
                  <div class="p_text" v-show="!personal">
                    {{ personalDown }}
                  </div> -->
                </div>
                <div class="p_bom">
                  个检{{ inspect.personalMedicalPercentage }}
                </div>
              </div>
            </div>
            <div class="inspect_bottom">
              <div class="ib_l">
                <span class="text">团检</span>
                <countTo class="ib_l_num" :startVal="0" :endVal="inspect.groupMedicalCount" :duration="2000" />
              </div>
              <div class="ib_r">
                <span class="text">个检</span>
                <countTo class="ib_r_num" :startVal="0" :endVal="inspect.personalMedicalCount" :duration="2000" />
              </div>
            </div>
          </div>
          <!-- 性别图表 -->
          <div class="check_item bg2 gender">
            <div class="inspect_top">
              <div class="percentage">
                <div class="p_top">
                  <!-- <div class="p_icon" v-show="man">↑</div>
                  <div class="p_icon" v-show="!man">↓</div>
                  <div class="p_text" v-show="man">{{ manUp }}</div>
                  <div class="p_text" v-show="!man">{{ manDown }}</div> -->
                </div>
                <div class="p_bom">男性{{ inspect.manPercentage }}</div>
              </div>
              <div id="genderChart" ref="genderChart" class="genderChart"></div>
              <div class="percentage">
                <div class="p_top">
                  <!-- <div class="p_icon" v-show="woman">↑</div>
                  <div class="p_icon" v-show="!woman">↓</div>
                  <div class="p_text" v-show="woman">{{ womanUp }}</div>
                  <div class="p_text" v-show="!woman">{{ womanDown }}</div> -->
                </div>
                <div class="p_bom">女性{{ inspect.womanPercentage }}</div>
              </div>
            </div>
            <div class="inspect_bottom">
              <div class="ib_l">
                <span class="text">男性</span>
                <countTo class="ib_l_num" :startVal="0" :endVal="inspect.manCount" :duration="2000" />
              </div>
              <div class="ib_r">
                <span class="text">女性</span>
                <countTo class="ib_r_num" :startVal="0" :endVal="inspect.womanCount" :duration="2000" />
              </div>
            </div>
          </div>
          <!-- 婚姻图表 -->
          <div class="check_item bg2 marriage">
            <div class="inspect_top">
              <div class="percentage">
                <div class="p_top">
                  <!-- <div class="p_icon" v-show="single">↑</div>
                  <div class="p_icon" v-show="!single">↓</div>
                  <div class="p_text" v-show="single">{{ singleUp }}</div>
                  <div class="p_text" v-show="!single">{{ singleDown }}</div> -->
                </div>
                <div class="p_bom">未婚{{ inspect.singlePercentage }}</div>
              </div>
              <div id="marriageChart" ref="marriageChart" class="marriageChart"></div>
              <div class="percentage">
                <div class="p_top">
                  <!-- <div class="p_icon" v-show="married">↑</div>
                  <div class="p_icon" v-show="!married">↓</div>
                  <div class="p_text" v-show="married">{{ marriedUp }}</div>
                  <div class="p_text" v-show="!married">{{ marriedDown }}</div> -->
                </div>
                <div class="p_bom">已婚{{ inspect.marriedPercentage }}</div>
              </div>
            </div>
            <div class="inspect_bottom">
              <div class="ib_l">
                <span class="text">未婚</span>
                <countTo class="ib_l_num" :startVal="0" :endVal="inspect.singleCount" :duration="2000" />
              </div>
              <div class="ib_r">
                <span class="text">已婚</span>
                <countTo class="ib_r_num" :startVal="0" :endVal="inspect.marriedCount" :duration="2000" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 主体柱状图 -->
      <div class="columnar mt2">
        <!-- 年度对比 -->
        <div class="year_ratio">
          <!-- 头部标题 -->
          <div class="head">
            <div class="title">年度对比</div>
          </div>
          <!-- 年度柱状图 -->
          <div id="yearChart" ref="yearChart" class="yearChart"></div>
        </div>
        <!-- 人群年龄分布 -->
        <div class="age_spread">
          <!-- 头部标题 -->
          <div class="head">
            <div class="title">人群年龄分布</div>
          </div>
          <!-- 年度柱状图 -->
          <div id="ageChart" ref="ageChart" class="ageChart"></div>
        </div>
      </div>
      <!-- 主体柱状图 -->
      <div class="columnar mt2">
        <!-- 月度对比 -->
        <div class="month_ratio">
          <!-- 头部标题 -->
          <div class="head">
            <div class="title">月度对比</div>
          </div>
          <!-- 月度柱状图 -->
          <div id="monthChart" ref="monthChart" class="monthChart"></div>
        </div>
        <!-- 检查分布 -->
        <div class="check_spread">
          <!-- 头部标题 -->
          <div class="head">
            <div class="title">检查分布</div>
          </div>
          <!-- 图标盒子 -->
          <div class="chart_box">
            <!-- 团检企业占比 -->
            <div class="group_check">
              <div class="c_title">团检企业占比</div>
              <div class="chart_bg">
                <!-- 团检企业占比饼状图 -->
                <div id="groupCheckChart" ref="groupCheckChart" class="groupCheckChart"></div>
              </div>
            </div>
            <!-- 体检类型分布 -->
            <div class="type_check">
              <div class="c_title">体检类型分布</div>
              <div class="chart_bg">
                <!-- 体检类型分布饼状图 -->
                <div id="typeCheckChart" ref="typeCheckChart" class="typeCheckChart"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 收入分析 -->
    <div class="income_analys" v-if="pageStatus == 'income'">
      <Income :searchDate="searchDate" />
    </div>
    <!-- TAT分析 -->
    <!--<div class="txt_analysis">-->
    <!-- 单位通知 -->
    <!-- <div class="unit_notice">
        <div class="head_title">单位体检提醒通知</div>
        <div class="txt_content">
          <el-card
            class="box-card"
            v-for="(item, index) in unitnotice"
            :key="index"
          >
            <div slot="header" class="clearfix">
              <div class="gsmc">{{ item.companyname }}</div>
              <div class="tjsj">
                去年体检时间({{ item.startdate.substring(0, 10) }}至{{
                  item.enddate.substring(0, 10)
                }})
              </div>
            </div>
            <div class="tccard_content">
              <div class="tccard_item">
                <div>提醒天数</div>
                <div>总人数</div>
                <div>已通知</div>
                <div>未通知</div>
              </div>
              <div class="tccard_item">
                <div>30-60天</div>
                <div>
                  <el-tag
                    @click="
                      handleCheckUnitnotice(
                        'timetype60_30',
                        item.companycode,
                        ''
                      )
                    "
                    >{{ item.list30_60[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    @click="
                      handleCheckUnitnotice(
                        'timetype60_30',
                        item.companycode,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list30_60[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    @click="
                      handleCheckUnitnotice(
                        'timetype60_30',
                        item.companycode,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list30_60[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>30-15天</div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckUnitnotice(
                        'timetype30_15',
                        item.companycode,
                        ''
                      )
                    "
                    >{{ item.list15_30[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckUnitnotice(
                        'timetype30_15',
                        item.companycode,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list15_30[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckUnitnotice(
                        'timetype30_15',
                        item.companycode,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list15_30[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>15天内</div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckUnitnotice(
                        'timetype15_0',
                        item.companycode,
                        ''
                      )
                    "
                    >{{ item.list0_15[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckUnitnotice(
                        'timetype15_0',
                        item.companycode,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list0_15[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckUnitnotice(
                        'timetype15_0',
                        item.companycode,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list0_15[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>逾期</div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckUnitnotice('timetype0', item.companycode, '')
                    "
                    >{{ item.list0[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckUnitnotice(
                        'timetype0',
                        item.companycode,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list0[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckUnitnotice(
                        'timetype0',
                        item.companycode,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list0[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div> -->
    <!-- 个人通知 -->
    <!-- <div class="self_notice">
        <div class="head_title">个人体检提醒通知</div>
        <div class="txt_content">
          <el-card
            class="box-card"
            v-for="(item, index) in selfnotice"
            :key="index"
          >
            <div slot="header" class="clearfix">
              <div class="gsmc">{{ item.checktypename }}</div>
              <div class="tjsj">
                去年体检时间({{ item.startdate.substring(0, 10) }}至{{
                  item.enddate.substring(0, 10)
                }})
              </div>
            </div>
            <div class="tccard_content">
              <div class="tccard_item">
                <div>提醒天数</div>
                <div>总人数</div>
                <div>已通知</div>
                <div>未通知</div>
              </div>
              <div class="tccard_item">
                <div>30-60天</div>
                <div>
                  <el-tag
                    @click="
                      handleCheckSelfnotice('timetype60_30', item.checktype, '')
                    "
                    >{{ item.list30_60[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    @click="
                      handleCheckSelfnotice(
                        'timetype60_30',
                        item.checktype,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list30_60[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    @click="
                      handleCheckSelfnotice(
                        'timetype60_30',
                        item.checktype,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list30_60[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>30-15天</div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckSelfnotice('timetype30_15', item.checktype, '')
                    "
                    >{{ item.list15_30[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckSelfnotice(
                        'timetype30_15',
                        item.checktype,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list15_30[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="success"
                    @click="
                      handleCheckSelfnotice(
                        'timetype30_15',
                        item.checktype,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list15_30[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>15天内</div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckSelfnotice('timetype15_0', item.checktype, '')
                    "
                    >{{ item.list0_15[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckSelfnotice(
                        'timetype15_0',
                        item.checktype,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list0_15[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="warning"
                    @click="
                      handleCheckSelfnotice(
                        'timetype15_0',
                        item.checktype,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list0_15[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
              <div class="tccard_item">
                <div>逾期</div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckSelfnotice('timetype0', item.checktype, '')
                    "
                    >{{ item.list0[0].allperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckSelfnotice(
                        'timetype0',
                        item.checktype,
                        'NextCheckTime'
                      )
                    "
                    >{{ item.list0[0].noticeperson }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    type="danger"
                    @click="
                      handleCheckSelfnotice(
                        'timetype0',
                        item.checktype,
                        'NoNextCheckTime'
                      )
                    "
                    >{{ item.list0[0].nonoticeperson }}</el-tag
                  >
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div> -->
    <!--</div> -->
    <!-- TAT分析弹框标记数据 -->
    <el-dialog title="操作" :visible.sync="showTxtSign" width="80%" :show-close="false" :close-on-click-modal="false" class="dia_txtsign">
      <div class="txtsign_content">
        <!-- 单位标记 -->
        <div class="diaunit" v-if="txtsignFlag == 'diaunit'">
          <div class="head_condition">
            <el-form ref="form" :model="conditionForm" label-width="80px">
              <el-form-item label="单位" size="mini">
                <el-select v-model="conditionForm.companycode" filterable clearable placeholder="请选择单位" @change="handleTatNextCheckList">
                  <el-option v-for="item in companyItems" :key="item.companycode" :label="`${item.companycode}　${item.companyname}`" :value="item.companycode"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间段" size="mini">
                <el-select clearable v-model="conditionForm.timetype" placeholder="请选择时间段" @change="handleTatNextCheckList">
                  <el-option label="30-60天" value="timetype60_30"></el-option>
                  <el-option label="15-30天" value="timetype30_15"></el-option>
                  <el-option label="15天内" value="timetype15_0"></el-option>
                  <el-option label="逾期" value="timetype0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通知状态" size="mini">
                <el-select clearable v-model="conditionForm.noticecategory" placeholder="请选择通知状态" @change="handleTatNextCheckList">
                  <el-option label="已通知" value="NextCheckTime"></el-option>
                  <el-option label="未通知" value="NoNextCheckTime"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="btn_group">
              <el-button size="mini" type="primary" @click="handleTatNextCheckList">搜 索</el-button>
              <el-button size="mini" type="primary" @click="handleSetNotice">标记已通知</el-button>
              <el-button size="mini" type="primary" @click="handleResetTxtDia">关闭</el-button>
            </div>
          </div>
          <div class="table_box">
            <vxe-table class="people_table" ref="peopleTable" height="auto" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="peopleList" auto-resize :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
              <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
              <vxe-table-column field="regid" title="体检号" min-width="105" sortable></vxe-table-column>
              <vxe-table-column field="name" title="姓名" min-width="80" sortable></vxe-table-column>
              <vxe-table-column field="sex" title="性别" min-width="70" sortable>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" min-width="70" sortable></vxe-table-column>
              <vxe-table-column field="companyname" title="单位" min-width="250" sortable></vxe-table-column>
              <vxe-table-column field="batch" title="批次" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="setmealname" title="套餐分组" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="checkdate" title="上次体检时间" min-width="180" sortable></vxe-table-column>
              <vxe-table-column field="price" title="体检金额" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="noticestatus" title="通知状态" min-width="100" sortable>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.noticestatus == 0 ? "未通知" : "已通知"
                  }}</span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
        <!-- 个人标记 -->
        <div class="diaself" v-else>
          <div class="head_condition">
            <el-form ref="form" :model="conditionForm" label-width="80px">
              <el-form-item label="体检类型" size="mini">
                <el-select v-model="conditionForm.checktype" filterable clearable placeholder="请选择体检类型" @change="handleTatNextCheckList">
                  <el-option v-for="item in checktypeitems" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="时间段" size="mini">
                <el-select clearable v-model="conditionForm.timetype" placeholder="请选择时间段" @change="handleTatNextCheckList">
                  <el-option label="30-60天" value="timetype60_30"></el-option>
                  <el-option label="15-30天" value="timetype30_15"></el-option>
                  <el-option label="15天内" value="timetype15_0"></el-option>
                  <el-option label="逾期" value="timetype0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="通知状态" size="mini">
                <el-select clearable v-model="conditionForm.noticecategory" placeholder="请选择通知状态" @change="handleTatNextCheckList">
                  <el-option label="已通知" value="NextCheckTime"></el-option>
                  <el-option label="未通知" value="NoNextCheckTime"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div class="btn_group">
              <el-button size="mini" type="primary" @click="handleTatNextCheckList">搜 索</el-button>
              <el-button size="mini" type="primary" @click="handleSetNotice">标记已通知</el-button>
              <el-button size="mini" type="primary" @click="handleResetTxtDia">关闭</el-button>
            </div>
          </div>
          <div class="table_box">
            <vxe-table class="people_table" ref="peopleTable" height="auto" border="inner" :loading="loading" highlight-hover-row :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :data="peopleList" auto-resize :checkbox-config="{ reserve: true, trigger: 'row' }" :sort-config="{ trigger: 'cell' }" :scroll-y="{ enabled: false }" @checkbox-change="handleSelectPeople" @checkbox-all="handleSelectPeopleAll">
              <vxe-table-column type="checkbox" width="45" :reserve-selection="true"></vxe-table-column>
              <vxe-table-column field="regid" title="体检号" min-width="105" sortable></vxe-table-column>
              <vxe-table-column field="name" title="姓名" min-width="80" sortable></vxe-table-column>
              <vxe-table-column field="sex" title="性别" min-width="70" sortable>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.sex == 0
                      ? "未知"
                      : scope.row.sex == 1
                      ? "男"
                      : "女"
                  }}</span>
                </template>
              </vxe-table-column>
              <vxe-table-column field="age" title="年龄" min-width="70" sortable></vxe-table-column>
              <vxe-table-column field="companyname" title="单位" min-width="250" sortable></vxe-table-column>
              <vxe-table-column field="batch" title="批次" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="setmealname" title="套餐分组" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="checkdate" title="上次体检时间" min-width="180" sortable></vxe-table-column>
              <vxe-table-column field="price" title="体检金额" min-width="100" sortable></vxe-table-column>
              <vxe-table-column field="noticestatus" title="通知状态" min-width="100" sortable>
                <template slot-scope="scope">
                  <span>{{
                    scope.row.noticestatus == 0 ? "未通知" : "已通知"
                  }}</span>
                </template>
              </vxe-table-column>
            </vxe-table>
          </div>
          <el-pagination :pager-count="5" :small="true" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[100, 200, 300, 500]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import countTo from "vue-count-to"; // 引入计数组件
import Income from "./components/Income.vue";
import * as company_archives from "@/api/company_archives";
import {
  getCheckSchedule,
  getYearCompared,
  getCrowdAgeDistributed,
  getMonthCompared,
  getTypeDistributed,
  TatCompanyCheckStaticsForNextCheck,
  TatPersonCheckStaticsForNextCheck,
  TatNextCheckList,
  SetNotice,
} from "@/api/makepolicy.js";
import { getPersonalDetail } from "@/api/searchDialog.js";
import { mapGetters } from "vuex";

export default {
  name: "makepolicy",

  components: { countTo, Income },

  data() {
    return {
      pageStatus: "crowd", // crowd-人群分析 income-收入分析 TAT-TAT分析
      searchDate: [], // 筛选时间
      imgTotal: require("./images/total.png"),
      inspectOption: {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "检查",
            type: "pie",
            // radius: "85%",
            radius: ["0%", "85%"],
            color: ["#efc30f", "#30adc6"],
            data: [
              { value: null, name: "个检" },
              { value: null, name: "团检" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }, // 检查图表
      genderOption: {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "检查",
            type: "pie",
            // radius: "85%",
            radius: ["0%", "85%"],
            color: ["#efc30f", "#85b827"],
            data: [
              { value: 300, name: "女性" },
              { value: 700, name: "男性" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }, // 性别图表
      marriageOption: {
        title: {
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "检查",
            type: "pie",
            // radius: "85%",
            radius: ["0%", "85%"],
            color: ["#efc30f", "#d33e23"],
            data: [
              { value: 300, name: "已婚" },
              { value: 700, name: "未婚" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              normal: {
                show: false,
              },
            },
            labelLine: {
              normal: {
                show: false,
              },
            },
          },
        ],
      }, // 婚姻图表
      yearOption: {
        title: {
          text: "年度体检人数",
          x: "center",
          y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["个检", "团检"],
          // x: "center", //可设定图例在左、右、居中
          // y: "bottom", //可设定图例在上、下、居中
          orient: "horizontal",
          left: "center",
          top: "bottom",
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: [],
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
        color: ["#30adc6", "#efc30f"],
        series: [
          {
            name: "个检",
            type: "bar",
            stack: "Ad",
            barWidth: 50, //柱图宽度
            emphasis: {
              focus: "series",
            },
            data: [],
          },
          {
            name: "团检",
            type: "bar",
            stack: "Ad",
            barWidth: 50, //柱图宽度
            emphasis: {
              focus: "series",
            },
            data: [],
          },
        ],
      }, // 年度对比
      ageOption: {
        title: {
          text: "人群年龄分布",
          x: "center",
          y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["男性", "女性"],
          // x: "center", //可设定图例在左、右、居中
          // y: "bottom", //可设定图例在上、下、居中
          orient: "horizontal",
          left: "center",
          top: "bottom",
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        color: ["#30adc6", "#d33e23"],
        series: [
          {
            name: "男性",
            type: "bar",
            data: [],
          },
          {
            name: "女性",
            type: "bar",
            data: [],
          },
        ],
      }, // 人群年龄分布
      monthOption: {
        title: {
          text: "月度体检人数对比",
          x: "center",
          y: "20px",
          textAlign: "left",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: ["个检", "团检"],
          // x: "center", //可设定图例在左、右、居中
          // y: "bottom", //可设定图例在上、下、居中
          orient: "horizontal",
          left: "center",
          top: "bottom",
          // padding: [0, 0, -10, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [
            "2017年一月",
            "2018年一月",
            "2019年一月",
            "2020年一月",
            "2021年一月",
          ],
          axisLabel: {
            interval: 0,
            rotate: 40,
          },
        },
        yAxis: {
          type: "value",
        },
        color: ["#85b827", "#d33e23"],
        series: [
          {
            name: "个检",
            type: "bar",
            barWidth: 25, //柱图宽度
            data: [],
          },
          {
            name: "团检",
            type: "bar",
            barWidth: 25, //柱图宽度
            data: [],
          },
        ],
      }, // 月度对比
      groupCheckOption: {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: "50%",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            data: [
              // { value: 1048, name: "私营企业" },
              // { value: 735, name: "其他" },
              // { value: 580, name: "国有企业" },
              // { value: 484, name: "国家行政机关" },
              // { value: 300, name: "外资企业" },
              // { value: 300, name: "合资企业" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}({d}%)",
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      }, // 团检企业占比
      typeCheckOption: {
        title: {},
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "left",
        },
        series: [
          {
            name: "占比",
            type: "pie",
            radius: "50%",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            data: [
              { value: 1048, name: "其他" },
              { value: 22048, name: "健康体检" },
              { value: 735, name: "入职体检" },
              { value: 580, name: "驾驶证体检" },
              { value: 484, name: "职业病体检" },
              { value: 300, name: "健康证" },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  formatter: "{b}({d}%)",
                },
                labelLine: { show: true },
              },
            },
          },
        ],
      }, // 体检类型分布
      nowYearCount: 0, // 总数
      year: [],
      inspect: {}, // 检查图表数据对象
      group: true,
      groupUp: "", // 团检↑
      groupDown: "", // 团检↓
      personal: true,
      personalUp: "", // 个检↑
      personalDown: "", // 个检↓
      man: true,
      manUp: "", // 男性↑
      manDown: "", // 男性↓
      woman: true,
      womanUp: "", // 女性↑
      womanDown: "", // 女性↓
      married: true,
      marriedUp: "", // 已婚↑
      marriedDown: "", // 已婚↓
      single: true,
      singleUp: "", // 未婚↑
      singleDown: "", // 未婚↓
      unitnotice: [],
      selfnotice: [],
      showTxtSign: false,
      conditionForm: {
        timetype: "",
        companycode: "",
        checktype: "",
        noticecategory: "",
      },
      peopleList: [],
      selectPeople: [],
      currentPage: 1, // 当前页
      pageSize: 100, // 页面条数
      count: 0, // 总条数
      companyItems: [],
      checktypeitems: [],
      loading: false,
      txtsignFlag: "diaunit", // 单位-diaunit 个人-diaself
    };
  },
  computed: {
    ...mapGetters(["iframeViews", "visitedViews"]),
  },

  mounted() {
    this.handleGetSearchTime(); // 获取搜索时间
    this.handleGetCheckSchedule(); // 获取体检进度
    this.handleGetYearCompared(); // 获取年度对比
    this.handleGetCrowdAgeDistributed(); // 人群年龄分布
    this.handleGetMonthCompared(); // 月度对比
    this.handleGetTypeDistributed(); // 类型分布
  },

  methods: {
    // 点击个人展示弹框
    handleCheckSelfnotice(timetype, checktype, noticecategory) {
      this.conditionForm = {
        timetype,
        companycode: "",
        checktype,
        noticecategory,
      };
      this.txtsignFlag = "diaself";
      let whereitems = [];
      Object.keys(this.conditionForm).forEach((k) => {
        if (this.conditionForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.conditionForm[k],
          });
        }
      });
      TatNextCheckList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.peopleList = [];
            this.count = res.count;
          } else {
            this.peopleList = res.data;
            this.count = res.count;
          }
          this.showTxtSign = true;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 点击单位展示弹框
    handleCheckUnitnotice(timetype, companycode, noticecategory) {
      this.conditionForm = {
        timetype,
        companycode,
        checktype: "",
        noticecategory,
      };
      this.txtsignFlag = "diaunit";
      let whereitems = [];
      Object.keys(this.conditionForm).forEach((k) => {
        if (this.conditionForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.conditionForm[k],
          });
        }
      });
      TatNextCheckList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.peopleList = [];
            this.count = res.count;
          } else {
            this.peopleList = res.data;
            this.count = res.count;
          }
          this.showTxtSign = true;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 标记为已通知
    handleSetNotice() {
      if (this.selectPeople.length == 0) {
        this.$message.warning("请先选中数据!");
        return;
      }
      SetNotice({
        category: "NextCheckTime",
        regiditems: this.selectPeople.map((k) => k.regid),
      }).then((res) => {
        this.$message.success(res.message);
        this.handleResetTxtDia();
        this.handleTatCompanyCheckStaticsForNextCheck(); // 单位列表
        this.handleTatPersonCheckStaticsForNextCheck(); // 个人列表
      });
    },
    // 重置弹框数据
    handleResetTxtDia() {
      this.conditionForm = {
        timetype: "",
        companycode: "",
        checktype: "",
        noticecategory: "",
      };
      this.peopleList = [];
      this.selectPeople = [];
      this.currentPage = 1; // 当前页
      this.pageSize = 100; // 页面条数
      this.count = 0; // 总条数
      this.companyItems = [];
      this.checktypeitems = [];
      this.showTxtSign = false;
    },
    // 数字点击进入分页列表
    handleTatNextCheckList() {
      this.loading = true;
      let whereitems = [];
      Object.keys(this.conditionForm).forEach((k) => {
        if (this.conditionForm[k] != "") {
          whereitems.push({
            key: k,
            value: this.conditionForm[k],
          });
        }
      });
      TatNextCheckList({
        page: this.currentPage,
        limit: this.pageSize,
        whereitems,
      })
        .then((res) => {
          this.loading = false;
          if (!res.data) {
            this.peopleList = [];
            this.count = res.count;
          } else {
            this.peopleList = res.data;
            this.count = res.count;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    // 当前改变每页条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.handleTatNextCheckList();
    },
    // 当前改变翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.handleTatNextCheckList();
    },
    // 勾选人员回调
    handleSelectPeople({ records }) {
      this.selectPeople = records;
    },
    // 勾选人员回调-全选
    handleSelectPeopleAll({ records }) {
      this.selectPeople = records;
    },
    // 单位体检提醒通知数据回调
    handleTatCompanyCheckStaticsForNextCheck() {
      TatCompanyCheckStaticsForNextCheck().then((res) => {
        if (!res.result) {
          this.unitnotice = [];
        } else {
          this.unitnotice = res.result;
        }
      });
    },
    // 个人体检提醒通知数据回调
    handleTatPersonCheckStaticsForNextCheck() {
      TatPersonCheckStaticsForNextCheck().then((res) => {
        if (!res.result) {
          this.selfnotice = [];
        } else {
          this.selfnotice = res.result;
        }
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
    // 获取体检进度回调
    handleGetCheckSchedule() {
      let whereitems = [
        {
          key: "RegisterTimeBegin",
          value: this.searchDate[0],
        },
        {
          key: "RegisterTimeEnd",
          value: this.searchDate[1],
        },
      ];
      getCheckSchedule({ whereitems }).then((res) => {
        let data = res.result;
        console.log(data);
        this.nowYearCount = data.nowYearCount; // 总数

        // 百分比数据
        this.group = data.groupMedicalIncrease > data.groupMedicalReduce;
        this.groupUp = data.groupMedicalIncrease; // 团检↑
        this.groupDown = data.groupMedicalReduce; // 团检↓
        this.personal =
          data.personalMedicalIncrease > data.personalMedicalReduce;
        this.personalUp = data.personalMedicalIncrease; // 个检↑
        this.personalDown = data.personalMedicalReduce; // 个检↓
        this.man = data.manCountIncrease > data.manCountReduce;
        this.manUp = data.manCountIncrease; // 男性↑
        this.manDown = data.manCountReduce; // 男性↓
        this.woman = data.womanCountIncrease > data.womanCountReduce;
        this.womanUp = data.womanCountIncrease; // 女性↑
        this.womanDown = data.womanCountReduce; // 女性↓
        this.married = data.marriedCountIncrease > data.marriedCountReduce;
        this.marriedUp = data.marriedCountIncrease; // 已婚↑
        this.marriedDown = data.marriedCountReduce; // 已婚↓
        this.single = data.singleCountIncrease > data.singleCountReduce;
        this.singleUp = data.singleCountIncrease; // 未婚↑
        this.singleDown = data.singleCountReduce; // 未婚↓

        // 图表数据
        this.inspectOption.series[0].data[0].value = data.personalMedicalCount; // 个检数量
        this.inspectOption.series[0].data[1].value = data.groupMedicalCount; // 团检数量
        this.genderOption.series[0].data[0].value = data.womanCount; // 女性检查数量
        this.genderOption.series[0].data[1].value = data.manCount; // 男性检查数量
        this.marriageOption.series[0].data[0].value = data.marriedCount; // 已婚检查数量
        this.marriageOption.series[0].data[1].value = data.singleCount; // 未婚检查数量

        // 页面数据
        this.inspect = {
          personalMedicalCount: data.personalMedicalCount, // 个检数量
          groupMedicalCount: data.groupMedicalCount, // 团检数量
          personalMedicalPercentage: data.personalMedicalPercentage, // 个检百分比
          groupMedicalPercentage: data.groupMedicalPercentage, // 团检百分比
          manPercentage: data.manPercentage, // 男性检查百分比
          womanPercentage: data.womanPercentage, // 女性检查百分比
          marriedPercentage: data.marriedPercentage, // 已婚检查百分比
          singlePercentage: data.singlePercentage, // 未婚检查百分比
          manCount: data.manCount, // 男性检查数量
          womanCount: data.womanCount, // 女性检查数量
          singleCount: data.singleCount, // 未婚检查数量
          marriedCount: data.marriedCount, // 已婚检查数量
        };
        let inspectChart = this.$echarts.init(this.$refs.inspectChart); // 检查图表
        let genderChart = this.$echarts.init(this.$refs.genderChart); // 性别图表
        let marriageChart = this.$echarts.init(this.$refs.marriageChart); // 婚姻图表
        // 赋值图标配置
        inspectChart.setOption(this.inspectOption);
        genderChart.setOption(this.genderOption);
        marriageChart.setOption(this.marriageOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          inspectChart.resize();
          genderChart.resize();
          marriageChart.resize();
        });
      });
    },
    // 获取年度对比回调
    handleGetYearCompared() {
      getYearCompared().then((res) => {
        let data = res.result;
        let year = data.map((i) => i.year);
        let personalmedicalcount = data.map((i) => i.personalmedicalcount);
        let groupmedicalcount = data.map((i) => i.groupmedicalcount);
        this.yearOption.xAxis[0].data = year; // 年份
        this.yearOption.series[0].data = personalmedicalcount; // 个检数量
        this.yearOption.series[1].data = groupmedicalcount; // 团检数量
        let yearChart = this.$echarts.init(this.$refs.yearChart); // 年度对比
        // 赋值图标配置
        yearChart.setOption(this.yearOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          yearChart.resize();
        });
      });
    },
    // 人群年龄分布
    handleGetCrowdAgeDistributed() {
      let whereitems = [
        {
          key: "RegisterTimeBegin",
          value: this.searchDate[0],
        },
        {
          key: "RegisterTimeEnd",
          value: this.searchDate[1],
        },
      ];
      getCrowdAgeDistributed({ whereitems }).then((res) => {
        let data = res.result;
        let arr = [
          data.less20,
          data.between20_30,
          data.between30_40,
          data.between40_50,
          data.between50_60,
          data.greater60,
          data.name,
          data.mancount,
          data.womancount,
        ];
        let name = data.map((i) => i.name);
        let mancount = data.map((i) => i.mancount);
        let womancount = data.map((i) => i.womancount);
        this.ageOption.xAxis.data = name; // 名称
        this.ageOption.series[0].data = mancount; // 男性数量
        this.ageOption.series[1].data = womancount; // 女性数量
        let ageChart = this.$echarts.init(this.$refs.ageChart); // 人群年龄分布
        // 赋值图标配置
        ageChart.setOption(this.ageOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          ageChart.resize();
        });
      });
    },
    // 月度对比
    handleGetMonthCompared() {
      let whereitems = [
        {
          key: "RegisterTimeBegin",
          value: this.searchDate[0],
        },
        {
          key: "RegisterTimeEnd",
          value: this.searchDate[1],
        },
      ];
      getMonthCompared({ whereitems }).then((res) => {
        let data = res.result;
        let year = data.map((i) => i.year);
        let personalmedicalcount = data.map((i) => i.personalmedicalcount);
        let groupmedicalcount = data.map((i) => i.groupmedicalcount);
        this.monthOption.xAxis.data = year; // 年份
        this.monthOption.series[0].data = personalmedicalcount; // 个检数量
        this.monthOption.series[1].data = groupmedicalcount; // 团检数量
        let monthChart = this.$echarts.init(this.$refs.monthChart); // 月度对比
        // 赋值图标配置
        monthChart.setOption(this.monthOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          monthChart.resize();
        });
      });
    },
    // 类型分布
    handleGetTypeDistributed() {
      let whereitems = [
        {
          key: "RegisterTimeBegin",
          value: this.searchDate[0],
        },
        {
          key: "RegisterTimeEnd",
          value: this.searchDate[1],
        },
      ];
      getTypeDistributed({ whereitems }).then((res) => {
        let data = res.result;
        let enterprise = data.enterprise;
        let medicaltype = data.medicaltype;

        // 团检企业占比
        this.groupCheckOption.series[0].data = [];
        let arr1 = [];
        for (let i = 0; i < enterprise.length; i++) {
          arr1.push({
            value: enterprise[i].count,
            name: enterprise[i].companyname,
          });
        }
        this.groupCheckOption.series[0].data = arr1;

        // 体检类型分布
        this.typeCheckOption.series[0].data = [];
        let arr2 = [];
        for (let i = 0; i < medicaltype.length; i++) {
          arr2.push({
            value: medicaltype[i].count,
            name: medicaltype[i].checktypename,
          });
        }
        this.typeCheckOption.series[0].data = arr2;

        let groupCheckChart = this.$echarts.init(this.$refs.groupCheckChart); // 团检企业占比
        let typeCheckChart = this.$echarts.init(this.$refs.typeCheckChart); // 体检类型分布
        // 赋值图标配置
        groupCheckChart.setOption(this.groupCheckOption);
        typeCheckChart.setOption(this.typeCheckOption);
        // 监听窗口变化重新渲染echarts图标
        window.addEventListener("resize", function () {
          groupCheckChart.resize();
          typeCheckChart.resize();
        });
        // window.addEventListener('resize',function() {typeCheckChart.resize()});
      });
    },
    // 获取时间回调
    handleGetSearchTime(flag) {
      let y = new Date().getFullYear();
      if (flag == "prev") y = y - 1;
      if (flag == "next") y = y + 1;
      //第一天
      let first = y + "-01-01";
      //最后一天
      let last = y + "-12-31";
      this.searchDate = [first, last];
    },
    // 顶部tabs切换重载数据
    handleChangePageStatus() {
      if (this.pageStatus == "crowd") {
        this.handleGetSearchTime(); // 获取搜索时间
        this.handleGetCheckSchedule(); // 获取体检进度
        this.handleGetYearCompared(); // 获取年度对比
        this.handleGetCrowdAgeDistributed(); // 人群年龄分布
        this.handleGetMonthCompared(); // 月度对比
        this.handleGetTypeDistributed(); // 类型分布
      } else if (this.pageStatus == "TAT") {
        this.handleTatCompanyCheckStaticsForNextCheck(); // 单位列表
        this.handleTatPersonCheckStaticsForNextCheck(); // 个人列表
        company_archives
          .getList({
            // 查询条件
            page: 1,
            limit: 100000,
            key: "",
          })
          .then((response) => {
            this.companyItems = response.data;
          });
        getPersonalDetail().then((res) => {
          let { checktypeitems } = res.result;
          this.checktypeitems = checktypeitems;
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
    // 刷新页面
    handleResetPage() {
      if (this.pageStatus == "crowd") {
        this.handleGetCheckSchedule(); // 获取体检进度
        this.handleGetYearCompared(); // 获取年度对比
        this.handleGetCrowdAgeDistributed(); // 人群年龄分布
        this.handleGetMonthCompared(); // 月度对比
        this.handleGetTypeDistributed(); // 类型分布
      }
      let temp = this.pageStatus;
      this.pageStatus = "";
      this.$nextTick(() => {
        this.pageStatus = temp;
      });
    },
  },

  watch: {
    searchDate: {
      handler() {
        if (this.searchDate) this.handleResetPage();
      },
      deep: true,
    },
  },
};
</script>
<style lang='scss' scoped>
@import "./css/index.scss";
</style>