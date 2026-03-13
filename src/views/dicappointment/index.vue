<template>
  <div>
    <sticky :className="'sub-navbar'">
      <div class="filter-container">
        <el-button v-if="activeName != 'DicaAppointmentTotalNumberSource'" :icon="`iconfont icon-${btn.icon}`" type="primary" plain size="mini" v-for="btn of typesBtns" v-bind:key="btn.Id" class="filter-item" @click="onBtnClicked(btn.domId)">{{ btn.name }}</el-button>
        <el-button v-if="activeName == 'DicaAppointmentTotalNumberSource'" type="primary" size="mini" plain @click="handleAddNumberSourceData">新增</el-button>
        <el-button v-if="activeName == 'DicaAppointmentTotalNumberSource'" type="primary" size="mini" plain @click="handleNumberSourceDataList">刷新</el-button>
        <el-button v-if="activeName == 'DicaAppointmentTotalNumberSource'" type="primary" size="mini" plain @click="handleClosePage">关闭</el-button>
      </div>
    </sticky>
    <div class="dicappointment-wrap">
      <div class="dicappointment-box">
        <div class="dicappointment-container flex-row">
          <el-tabs :tab-position="tabPosition" v-model="activeName" style="height: 100%; width: 100%" @tab-click="handleClick">
            <el-tab-pane label="预约时段" name="DicAppointmentTime">
              <el-select size="small" style="margin-top: 10px; margin-bottom: 10px; margin-left: 10px" v-model="selectvalue" clearable filterable placeholder="请选择体检中心" @change="valuechange">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="DicAppointmentTimelist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column align="left" width="150px" prop="timeid" label="体检预约时段编码" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="timename" width="250px" label="时段名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{
                      scope.row.timename
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="starttime" label="开始时间" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="endtime" label="结束时间" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="appointtype" label="预约类型" width="130px" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.appointtype == 0">非项目预约</span>
                    <span v-else-if="scope.row.appointtype == 1">项目预约</span>
                    <span v-else-if="scope.row.appointtype == 2">个人套餐预约</span>
                    <span v-else-if="scope.row.appointtype == 3">号源控制</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="personaltotal" label="个检人数" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="companytotal" label="团检人数" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="total" label="总数" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="week1" label="星期一" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week1 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week2" label="星期二" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week2 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week3" label="星期三" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week3 == 1 ? true : false" aria-readonly=""></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week4" label="星期四" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week4 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week5" label="星期五" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week5 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week6" label="星期六" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week6 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="week7" label="星期日" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox :value="scope.row.week7 == 1 ? true : false" @click="return false;"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="假期设置" name="DicaAppointmentVacation">
              <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="DicaAppointmentVacationlist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column align="left" width="150px" prop="vanid" label="体检预约假期编码" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="vacationname" label="假期名称" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{
                      scope.row.vacationname
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="startdate" label="开始时间" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="enddate" label="结束时间" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="status" label="状态" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span>{{ scope.row.status == 0 ? "正常" : "停用" }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="remark" label="备注" show-overflow-tooltip></el-table-column>
                <el-table-column align="left" prop="seqno" label="排序" show-overflow-tooltip></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="项目预约" name="DicAppointmentCombine">
              <el-row>
                <el-select size="small" style="
                    margin-top: 10px;
                    margin-bottom: 10px;
                    margin-left: 10px;
                  " v-model="selectvalue" clearable filterable placeholder="请选择体检中心" @change="valuechange">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-row>
              <el-row :gutter="15">
                <el-col :span="12">
                  <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="DicAppointmentCombinelist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="dicAppointmentCombineRowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                    <el-table-column type="selection" align="center" width="55"></el-table-column>
                    <el-table-column align="left" width="150px" prop="meccodname" label="体检机构" show-overflow-tooltip></el-table-column>
                    <el-table-column align="left" prop="combinename" label="体检组合" show-overflow-tooltip>
                      <template slot-scope="scope">
                        <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.combinename }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="left" width="150px" prop="deptname" label="科室名称" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
                <el-col :span="12">
                  <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="combinetimes" v-loading="listLoading" fit highlight-current-row style="width: 100%" @row-click="rowClick" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                    <el-table-column align="left" width="150px" prop="timename" label="预约时段" show-overflow-tooltip></el-table-column>
                    <el-table-column align="left" prop="personaltotal" label="个检人数" show-overflow-tooltip></el-table-column>
                    <el-table-column align="left" prop="companytotal" label="团检人数" show-overflow-tooltip></el-table-column>
                    <el-table-column align="left" prop="total" label="总数" show-overflow-tooltip></el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="节假日" name="DicaAppointmentHolidays">
              <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="DicaAppointmentHolidaylist" v-loading="listLoading" fit highlight-current-row style="width: 100%" @selection-change="handleSelectionChange" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column type="selection" align="center" width="55"></el-table-column>
                <el-table-column align="left" width="150px" label="节假日时间" show-overflow-tooltip>
                  <template v-slot="params">
                    <span>{{ params.row.holiday_date.split(" ")[0] }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="left" prop="holiday_name" label="节假日描述" show-overflow-tooltip>
                </el-table-column>
                <el-table-column align="left" prop="holiday_name" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDeletHoliday(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="总号源设置" name="DicaAppointmentTotalNumberSource">
              <el-table ref="mainTable" height="calc(100vh - 190px)" :key="tableKey" :data="totalNumberSourceData" v-loading="listLoading" fit highlight-current-row style="width: 100%" :border="false" :header-cell-style="handleReturnStyle" :row-class-name="handleTableRowClassName" :cell-style="{ padding: '0' }">
                <el-table-column align="left" label="日期" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-date-picker size="mini" v-model="scope.row.bookingdate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
                    </el-date-picker>
                  </template>
                </el-table-column>
                <el-table-column width="220px" align="left" prop="week" label="星期" show-overflow-tooltip>
                </el-table-column>
                <el-table-column width="300px" align="left" prop="week" label="个人总数" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入内容" v-model="scope.row.personalnum" clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column width="300px" align="left" prop="week" label="单位总数" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-input size="mini" placeholder="请输入内容" v-model="scope.row.companynum" clearable>
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column width="200px" align="left" prop="week" label="是否使用" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.status" :true-label="0" :false-label="1"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column width="200px" align="left" prop="data" label="操作" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleSaveNumberSourceData(scope.row)">保存</el-button>
                    <el-button size="mini" type="danger" @click="handleDeletNumberSourceData(scope.row,scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
          <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="60%" :title="textMap[dialogStatus]" :visible.sync="dicappointmentHolidayDialog">
            <el-form ref="DicaAppointmentHolidaysForm" :model="holidayForm" :rules="dicappointmentholidayRules" label-width="110px">
              <el-form-item prop="timeid" label="节假日时间">
                <!-- :picker-options="pickerOptions" -->
                <el-date-picker v-model="holidayForm.holidaydate" value-format="yyyy-MM-dd" size="mini" type="dates" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="timeid" label="节假日描述">
                <el-input size="small" v-model="holidayForm.holidayname"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" @click="dicappointmentHolidayDialog = false">取消</el-button>
              <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
              <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="holidayEditData">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="60%" :title="textMap[dialogStatus]" :visible.sync="dicappointmenttimeDialog">
            <el-form ref="DicAppointmentTimeForm" :model="dicappointmenttime" :rules="dicappointmenttimeRules" label-width="110px">
              <el-form-item prop="timeid" label="体检预约时段编码">
                <el-input size="small" v-model="dicappointmenttime.timeid" disabled></el-input>
              </el-form-item>
              <el-form-item prop="mecname" label="体检中心">
                <el-input size="small" v-model="dicappointmenttime.mecname" disabled></el-input>
              </el-form-item>
              <el-form-item prop="timename" label="时段名称">
                <el-input size="small" v-model="dicappointmenttime.timename"></el-input>
              </el-form-item>
              <el-form-item prop="starttime" label="开始时间">
                <el-time-select size="small" style="width: 100%" v-model="dicappointmenttime.starttime" :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                  }" placeholder="选择时间">
                </el-time-select>
              </el-form-item>
              <el-form-item prop="endtime" label="结束时间">
                <el-time-select size="small" style="width: 100%" v-model="dicappointmenttime.endtime" :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:59',
                  }" placeholder="选择时间">
                </el-time-select>
              </el-form-item>
              <el-form-item prop="personaltotal" label="预约类型">
                <el-select v-model="dicappointmenttime.appointtype" clearable size="small" placeholder="请选择">
                  <el-option label="非项目预约" :value="0"> </el-option>
                  <el-option label="项目预约" :value="1"> </el-option>
                  <el-option label="个人套餐预约" :value="2"> </el-option>
                  <el-option label="号源控制" :value="3"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="personaltotal" label="个检人数">
                <el-input size="small" v-model.number="dicappointmenttime.personaltotal"></el-input>
              </el-form-item>
              <el-form-item prop="companytotal" label="团检人数">
                <el-input size="small" v-model.number="dicappointmenttime.companytotal"></el-input>
              </el-form-item>
              <el-form-item prop="total" label="总数">
                <el-input size="small" v-model.number="dicappointmenttime.total" disabled></el-input>
              </el-form-item>
              <el-form-item prop="seqno" label="排序">
                <el-input size="small" v-model.number="dicappointmenttime.seqno"></el-input>
              </el-form-item>
              <el-form-item size="small" :label="'星期几'" prop="codeitems">
                <el-checkbox-group v-model="dicappointmenttime.codeitems">
                  <el-checkbox v-for="item in checkList" :key="item.code" :label="item.code">{{ item.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" @click="dicappointmenttimeDialog = false">取消</el-button>
              <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
              <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="createData">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="50vw" :title="textMap[dialogStatus]" :visible.sync="dicappointmentvacationDialog">
            <el-form ref="DicappointmentvacationForm" :model="dicappointmentvacation" :rules="dicappointmentvacationRules" label-width="110px">
              <el-form-item prop="vanid" label="体检预约假期编码">
                <el-input size="small" v-model="dicappointmentvacation.vanid" disabled></el-input>
              </el-form-item>
              <el-form-item prop="vacationname" label="假期名称">
                <el-input size="small" v-model="dicappointmentvacation.vacationname"></el-input>
              </el-form-item>
              <el-form-item prop="startdate" label="开始时间">
                <el-date-picker size="small" style="width: 100%" v-model="dicappointmentvacation.startdate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="enddate" label="结束时间">
                <el-date-picker size="small" style="width: 100%" v-model="dicappointmentvacation.enddate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="status" label="状态">
                <!-- <el-input size="small" v-model="dicappointmentvacation.status"></el-input> -->
                <el-radio-group v-model="dicappointmentvacation.status">
                  <el-radio :label="0">正常</el-radio>
                  <el-radio :label="1">停用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="remark" label="备注">
                <el-input size="small" v-model="dicappointmentvacation.remark"></el-input>
              </el-form-item>
              <el-form-item prop="seqno" label="排序">
                <el-input size="small" v-model.number="dicappointmentvacation.seqno"></el-input>
              </el-form-item>
            </el-form>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" @click="dicappointmentvacationDialog = false">取消</el-button>
              <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
              <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="createData">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog :destroy-on-close="true" :close-on-click-modal="false" class="dialog-mini custom-dialog user-dialog" width="50vw" :title="textMap[dialogStatus]" :visible.sync="dicAppointmentCombineDialog">
            <el-form ref="DicAppointmentCombineForm" :model="dicAppointmentCombine" :rules="dicAppointmentCombineRules" label-width="110px">
              <el-form-item prop="comid" label="体检预约组合编码">
                <el-input size="small" v-model="dicAppointmentCombine.comid" disabled></el-input>
              </el-form-item>
              <el-form-item prop="mecname" label="体检中心">
                <el-input size="small" v-model="dicAppointmentCombine.mecname" disabled></el-input>
              </el-form-item>
              <el-form-item prop="combinecode" label="组合名称">
                <el-select size="small" v-model="dicAppointmentCombine.combinecode" clearable filterable placeholder="请选择组合" @change="combinechange">
                  <el-option v-for="item in dicAppointmentCombine.diccombines" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="组合简称">
                <el-input size="small" v-model.number="dicAppointmentCombine.combinenameinfo"></el-input>
              </el-form-item>
              <el-form-item prop="deptcode" label="科室名称">
                <el-select size="small" v-model="dicAppointmentCombine.deptcode" clearable filterable placeholder="请选择科室" @change="deptchange">
                  <el-option v-for="item in dicAppointmentCombine.departments" :key="item.code" :label="item.name" :value="item.code">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="seqno" label="排序">
                <el-input size="small" v-model="dicAppointmentCombine.seqno"></el-input>
              </el-form-item>
              <el-form-item prop="personaltotal" label="个检人数">
                <el-input size="small" v-model.number="dicAppointmentCombine.personaltotal"></el-input>
              </el-form-item>
              <el-form-item prop="companytotal" label="团检人数">
                <el-input size="small" v-model.number="dicAppointmentCombine.companytotal"></el-input>
              </el-form-item>
              <div style="display: flex" :key="index" v-for="(item, index) in dicAppointmentCombine.combinetimeitems">
                <el-form-item label="体检预约时段" :rules="[
                    { required: true, message: '不能为空', trigger: 'blur' },
                  ]">
                  <!-- 这里双向绑定用循环的每一项(item)，不然每新增行，你去选择的话会影响其它行 -->
                  <el-select size="small" style="width: 100%" filterable clearable v-model="item.timeid" placeholder="请选择">
                    <el-option v-for="item in dicAppointmentCombine.dicappointmenttimes" :key="item.timeid" :label="item.timename" :value="item.timeid">
                    </el-option>
                  </el-select>
                </el-form-item>
                <i v-if="index === 0" @click="addIntroductionList(item)" style="font-size: 20px; color: #25c4fe; margin: 8px 0 0 10px" class="el-icon-circle-plus"></i>
                <i v-if="index > 0" @click="deleteIntroductionList(index)" style="font-size: 20px; color: #25c4fe; margin: 8px 0 0 10px" class="el-icon-remove"></i>
              </div>
            </el-form>
            <div style="text-align: right; margin-top: 10px">
              <el-button size="mini" @click="dicAppointmentCombineDialog = false">取消</el-button>
              <el-button size="mini" :loading="saveLoading" v-if="dialogStatus == 'create'" type="primary" @click="createData">确认</el-button>
              <el-button size="mini" :loading="saveLoading" v-else type="primary" @click="createData">确认</el-button>
            </div>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import extend from "@/extensions/dicdelRows.js";
import * as dicappointment from "@/api/dicappointment";
import waves from "@/directive/waves"; // 水波纹指令
import Sticky from "@/components/Sticky";
import Pagination from "@/components/Pagination";
import elDragDialog from "@/directive/el-dragDialog";
export default {
  name: "dicappointment",
  components: { Sticky, Pagination },
  mixins: [extend],
  directives: {
    waves,
    elDragDialog,
  },
  data() {
    return {
      saveLoading: false,
      tabPosition: "left",
      multipleSelection: [], // 列表checkbox选中的值
      tableKey: 0,
      DicAppointmentTimelist: null,
      DicaAppointmentVacationlist: null,
      DicaAppointmentHolidaylist: [],
      DicAppointmentCombinelist: [],
      listLoading: false,
      options: [],
      mecname: "",
      dicappointmenttimeDialog: false,
      dicappointmentvacationDialog: false,
      dicAppointmentCombineDialog: false,
      dicappointmentHolidayDialog: false,
      activeName: "DicAppointmentTime",
      selectvalue: "",
      checkList: [
        {
          code: "week1",
          name: "星期一",
          selected: false,
        },
        {
          code: "week2",
          name: "星期二",
          selected: false,
        },
        {
          code: "week3",
          name: "星期三",
          selected: false,
        },
        {
          code: "week4",
          name: "星期四",
          selected: false,
        },
        {
          code: "week5",
          name: "星期五",
          selected: false,
        },
        {
          code: "week6",
          name: "星期六",
          selected: false,
        },
        {
          code: "week7",
          name: "星期日",
          selected: false,
        },
      ],
      combinetimes: [],
      dicappointmenttime: {
        timeid: "",
        meccod: "",
        timename: "",
        starttime: "",
        endtime: "",
        personaltotal: "",
        companytotal: "",
        mecname: "",
        total: "",
        appointtype: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
        week6: 0,
        week7: 0,
        codeitems: [],
        seqno: 0,
        delflag: 0,
      },
      dicappointmentvacation: {
        vanid: "",
        vacationname: "",
        startdate: "",
        enddate: "",
        status: 0,
        remark: "",
        seqno: 0,
        delflag: 0,
      },
      dicAppointmentCombine: {
        comid: "",
        meccod: "",
        mecname: "",
        combinecode: "",
        combinename: "",
        combinenameinfo: "",
        personaltotal: 0,
        companytotal: 0,
        deptcode: "",
        deptname: "",
        seqno: 0,
        delflag: 0,
        combinetimes: [
          {
            comtimeid: "",
            comid: "",
            timeid: "",
            timename: "",
            personaltotal: "",
            companytotal: "",
            total: "",
            seqno: 0,
            delflag: 0,
          },
        ],
        diccombines: [],
        departments: [],
        dicappointmenttimes: [],
        organs: [],
      },
      sexarr: [
        { key: "0", name: "未知" },
        { key: "1", name: "男" },
        { key: "2", name: "女" },
      ],
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      dialogPvVisible: false,
      dicappointmenttimeRules: {
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        timename: [
          { required: true, message: "时段名称为空", trigger: "blur" },
        ],
        starttime: [
          {
            required: true,
            message: "必须选择开始时间",
            trigger: "change",
          },
        ],
        endtime: [
          {
            required: true,
            message: "必须选择结束时间",
            trigger: "change",
          },
        ],
        codeitems: [
          {
            required: true,
            message: "必须选择星期集",
            trigger: "change",
          },
        ],
      },
      dicappointmentvacationRules: {
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        vacationname: [
          { required: true, message: "假期名称为空", trigger: "blur" },
        ],
        startdate: [
          {
            required: true,
            message: "必须选择开始时间",
            trigger: "change",
          },
        ],
        enddate: [
          {
            required: true,
            message: "必须选择结束时间",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "必须选择状态",
            trigger: "change",
          },
        ],
      },
      dicAppointmentCombineRules: {
        seqno: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        combinecode: [
          {
            required: true,
            message: "必须选择组合",
            trigger: "change",
          },
        ],
        deptcode: [
          {
            required: true,
            message: "必须选择科室",
            trigger: "change",
          },
        ],
      },
      dicappointmentholidayRules: {
        holidaydate: [
          {
            required: true,
            message: "必须选择日期",
            trigger: "change",
          },
        ],
        holidayname: [
          { required: true, message: "节假日名称为空", trigger: "blur" },
        ],
      },
      holidayForm: {
        operationtype: "",
        holidaydate: "",
        holidayname: "",
      }, // 节假日
      holidays: [
        "2024-01-01",
        "2024-01-25",
        "2024-01-26" /* 其他不可选的节假日日期 */,
      ],
      totalNumberSourceData: [],
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
    isShowOperation() {
      const route = this.$route;
      const elements = route.meta.elements || [];
      let flag = false;
      elements.forEach((item) => {
        if (item.domId === "btnEdit") {
          flag = true;
        }
      });
      return flag;
    },
    // // 不可选节假日
    // pickerOptions() {
    //   return  {
    //     disabledDate: this.isDisabledDate
    //   }
    // },
  },
  created() {
    this.loadcenter();
  },
  methods: {
    // 新增总号源-行
    handleNumberSourceDataList() {
      dicappointment.LoadAllAppointmentNum().then((res) => {
        if (!res.data) return;
        this.$message.success(res.msg || res.message);
        this.totalNumberSourceData = res.data;
      });
    },
    // 新增总号源-行
    handleAddNumberSourceData() {
      this.totalNumberSourceData.push({
        code: "",
        bookingdate: "",
        week: "",
        personalnum: "",
        companynum: "",
        status: 0,
      });
    },

    // 保存总号源-行
    handleSaveNumberSourceData(item) {
      dicappointment.SaveAllAppointmentNum(item).then((res) => {
        this.$message.success(res.msg || res.message);
        this.handleNumberSourceDataList();
      });
    },
    // 删除总号源-行
    handleDeletNumberSourceData(item, index) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (item.code) {
            dicappointment.DeleteAllAppointmentNum([item.code]).then((res) => {
              this.$message.success(res.msg || res.message);
              this.handleNumberSourceDataList();
            });
          } else {
            this.totalNumberSourceData.splice(index, 1);
          }
        })
        .catch((e) => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
    },
    // isDisabledDate(date) {
    //   const dateString = this.formatDate(date);
    //   return this.holidays.includes(dateString);
    // },
    // formatDate(date) {
    //   const year = date.getFullYear();
    //   const month = date.getMonth() + 1;
    //   const day = date.getDate();
    //   return `${year}-${month < 10 ? "0" + month : month}-${
    //     day < 10 ? "0" + day : day
    //   }`;
    // },
    // 编辑节假日
    holidayEditData() {
      this.holidayForm.operationtype = "Update";
      this.dicappointmentHolidayDialog = false;
      this.setHolidays();
    },
    // 获取节假日数据
    getHoliday() {
      dicappointment.HolidayLoad().then((res) => {
        this.DicaAppointmentHolidaylist = res.data;
      });
    },
    // 新增--编辑节假日
    setHolidays() {
      let arr = this.holidayForm.holidaydate;
      if (this.dialogStatus == "create") {
        for (let i = 0; i < arr.length; i++) {
          this.addData(arr[i]);
        }
      } else {
        let { operationtype, holidayname } = this.holidayForm;
        let obj = {
          holidaydate: arr,
          holidayname,
          operationtype,
        };
        dicappointment.UpdateHoliday(obj).then((res) => {
          if (res.code == 200) {
            this.dicappointmentHolidayDialog = false;
            this.$message.success("操作成功");
            this.holidayForm = {
              operationtype: "",
              holiday_date: "",
              holiday_name: "",
            };
            this.getHoliday();
          }
        });
      }
      // this.$message.success("操作成功");
      // this.holidayForm = {
      //   operationtype: "",
      //   holiday_date: "",
      //   holiday_name: "",
      // };
      // this.getHoliday();
    },
    addData(item) {
      return new Promise((resolve, reject) => {
        try {
          let { operationtype, holidayname } = this.holidayForm;
          let obj = {
            holidaydate: item,
            holidayname,
            operationtype,
          };
          dicappointment.UpdateHoliday(obj).then((res) => {
            if (res.code == 200) {
              this.dicappointmentHolidayDialog = false;
              this.holidayForm = {
                operationtype: "",
                holiday_date: "",
                holiday_name: "",
              };
              this.getHoliday();
            }
          });
          resolve();
        } catch (err) {
          return reject(err);
        }
      });
    },
    // 删除节假日
    handleDeletHoliday({ holiday_date, holiday_name }) {
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.holidayForm = {
            operationtype: "Delete",
            holidaydate: holiday_date,
            holidayname: holiday_name,
          };
          dicappointment.UpdateHoliday(this.holidayForm).then((res) => {
            if (res.code == 200) {
              this.dicappointmentHolidayDialog = false;
              this.$message.success(res.message);
              this.holidayForm = {
                operationtype: "",
                holiday_date: "",
                holiday_name: "",
              };
              this.getHoliday();
            }
          });
        })
        .catch((e) => {
          this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
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

    rowClick(row) {
      this.$refs.mainTable.clearSelection();
      this.$refs.mainTable.toggleRowSelection(row);
    },
    dicAppointmentCombineRowClick(row) {
      this.combinetimes = row.combinetimeitems;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    valuechange() {
      console.log(this.selectvalue);
      if (this.activeName == "DicAppointmentTime") {
        let resultArr = this.options.filter((item) => {
          return item.value === this.selectvalue;
        });
        if (resultArr.length > 0) {
          this.mecname = resultArr[0].label;
          this.getList();
        }
      }
      if (this.activeName == "DicAppointmentCombine") {
        let resultArr = this.options.filter((item) => {
          return item.value === this.selectvalue;
        });
        if (resultArr.length > 0) {
          this.mecname = resultArr[0].label;
          this.getDicAppointmentCombinelist();
        }
      }
    },
    // 新增
    addIntroductionList(item) {
      // item.comid = "";
      // this.dicAppointmentCombine.combinetimeitems.push(item);
      this.dicAppointmentCombine.combinetimeitems.push({
        comtimeid: "",
        comid: "",
        timeid: "",
        timename: "",
        personaltotal: "",
        companytotal: "",
        total: "",
        seqno: "",
        delflag: "",
      });
    },
    // 删除
    deleteIntroductionList(index) {
      this.dicAppointmentCombine.combinetimeitems.splice(index, 1);
    },
    onBtnClicked: function (domId) {
      switch (domId) {
        case "btnAdd":
          this.handleCreate();
          break;
        case "btnEdit":
          if (this.multipleSelection.length !== 1) {
            this.$message({
              showClose: true,
              message: "只能选中一个进行编辑",
              type: "error",
            });
            return;
          }
          this.handleUpdate(this.multipleSelection[0]);
          break;
        case "btnDel":
          if (this.multipleSelection.length < 1) {
            this.$message({
              showClose: true,
              message: "至少删除一个",
              type: "error",
            });
            return;
          }
          if (this.multipleSelection.length > 1) {
            this.$message({
              showClose: true,
              message: "至多删除一个",
              type: "error",
            });
            return;
          }
          this.handleDelete(this.multipleSelection);
          break;
        case "btnClose": // 关闭当前页面
          this.handleClosePage();
          break;
        default:
          break;
      }
    },
    combinechange() {
      let diccombinesArr = this.dicAppointmentCombine.diccombines.filter(
        (item) => {
          return item.code === this.dicAppointmentCombine.combinecode;
        }
      );
      console.log(diccombinesArr);
      if (diccombinesArr.length > 0) {
        this.dicAppointmentCombine.combinename = diccombinesArr[0].name;
      }
    },
    deptchange() {
      let departmentsArr = this.dicAppointmentCombine.departments.filter(
        (item) => {
          return item.code === this.dicAppointmentCombine.deptcode;
        }
      );
      console.log(departmentsArr);
      if (departmentsArr.length > 0) {
        this.dicAppointmentCombine.deptname = departmentsArr[0].name;
      }
    },
    getList() {
      this.listLoading = true;
      console.log(this.activeName);
      var temp = {
        meccod: this.selectvalue,
      };
      dicappointment.getList(this.activeName, temp).then((response) => {
        console.log(response);
        this.DicAppointmentTimelist = response.result;
        this.listLoading = false;
      });
    },
    getDicAppointmentCombinelist() {
      this.listLoading = true;
      console.log(this.activeName);
      var temp = {
        meccod: this.selectvalue,
      };
      dicappointment.getList(this.activeName, temp).then((response) => {
        console.log(response);
        this.DicAppointmentCombinelist = response.result;
        this.listLoading = false;
      });
    },
    dicappointmentvacationgetList() {
      dicappointment.getList(this.activeName).then((response) => {
        this.DicaAppointmentVacationlist = response.data;
        this.listLoading = false;
      });
    },
    resetdicappointmenttime() {
      this.dicappointmenttime = {
        timeid: "",
        meccod: "",
        timename: "",
        starttime: "",
        endtime: "",
        personaltotal: "",
        companytotal: "",
        mecname: "",
        total: "",
        appointtype: 0,
        week1: 0,
        week2: 0,
        week3: 0,
        week4: 0,
        week5: 0,
        week6: 0,
        week7: 0,
        codeitems: [],
        seqno: 0,
        delflag: 0,
      };
    },
    resetdicappointmentvacation() {
      this.dicappointmentvacation = {
        vanid: "",
        vacationname: "",
        startdate: "",
        enddate: "",
        status: 0,
        remark: "",
        seqno: 0,
        delflag: 0,
      };
    },
    resetdicAppointmentCombine() {
      this.dicAppointmentCombine = {
        comid: "",
        meccod: "",
        mecname: "",
        combinecode: "",
        combinename: "",
        combinenameinfo: "",
        deptcode: "",
        deptname: "",
        seqno: 0,
        delflag: 0,
        combinetimes: [
          {
            comtimeid: "",
            comid: "",
            timeid: "",
            timename: "",
            personaltotal: "",
            companytotal: "",
            total: "",
            seqno: 0,
            delflag: 0,
          },
        ],
        diccombines: [],
        departments: [],
        dicappointmenttimes: [],
        organs: [],
      };
    },
    handleCreate() {
      if (this.activeName == "DicAppointmentTime") {
        if (
          this.selectvalue != undefined &&
          this.selectvalue != null &&
          this.selectvalue != ""
        ) {
          this.resetdicappointmenttime();
          // 弹出添加框
          this.dialogStatus = "create";
          this.dicappointmenttimeDialog = true;
          this.dicappointmenttime.mecname = this.mecname;
          this.$nextTick(() => {
            this.$refs["DicAppointmentTimeForm"].clearValidate();
          });
        } else {
          this.$message({
            showClose: true,
            message: "请选择体检中心",
            type: "warning",
          });
        }
      }

      if (this.activeName == "DicaAppointmentVacation") {
        this.dialogStatus = "create";
        this.dicappointmentvacationDialog = true;
        this.$nextTick(() => {
          this.$refs["DicappointmentvacationForm"].clearValidate();
        });
      }

      if (this.activeName == "DicAppointmentCombine") {
        if (
          this.selectvalue != undefined &&
          this.selectvalue != null &&
          this.selectvalue != ""
        ) {
          this.dialogStatus = "create";
          this.dicAppointmentCombineDialog = true;
          this.dicAppointmentCombine.meccod = this.selectvalue;
          this.dicAppointmentCombine.mecname = this.mecname;
          dicappointment.detail(this.activeName).then((response) => {
            this.dicAppointmentCombine.departments =
              response.result.departments;
            this.dicAppointmentCombine.combinenameinfo =
              response.result.combinenameinfo;
            this.dicAppointmentCombine.dicappointmenttimes =
              response.result.dicappointmenttimes;
            this.dicAppointmentCombine.diccombines =
              response.result.diccombines;
            this.dicAppointmentCombine.organs = response.result.organs;
            this.dicAppointmentCombine.combinetimeitems = [
              {
                comtimeid: "",
                comid: "",
                timeid: "",
                timename: "",
                personaltotal: "",
                companytotal: "",
                total: "",
                seqno: "",
                delflag: "",
              },
            ];
          });
          this.$nextTick(() => {
            this.$refs["DicAppointmentCombineForm"].clearValidate();
          });
        } else {
          this.$message({
            showClose: true,
            message: "请选择体检中心",
            type: "warning",
          });
        }
      }
      if (this.activeName == "DicaAppointmentHolidays") {
        this.dialogStatus = "create";
        this.dicappointmentHolidayDialog = true;
      }
    },
    //关闭弹框的事件
    close() {
      this.resetdicappointmenttime();
    },
    createData() {
      // 保存提交
      if (this.activeName == "DicAppointmentTime") {
        this.$refs["DicAppointmentTimeForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            var keys = Object.keys(this.dicappointmenttime);
            this.dicappointmenttime.codeitems.forEach((d) => {
              keys.forEach((b) => {
                if (b.indexOf("week") >= 0 && d == b) {
                  this.dicappointmenttime[b] = 1;
                }
              });
            });

            this.dicappointmenttime.meccod = this.selectvalue;
            dicappointment
              .save(this.activeName, this.dicappointmenttime)
              .then(() => {
                this.dicappointmenttimeDialog = false;
                this.getList();
                this.resetdicappointmenttime();
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                });
                this.saveLoading = false;
              })
              .catch((err) => {
                this.saveLoading = false;
              });
          }
        });
      }
      if (this.activeName == "DicaAppointmentVacation") {
        this.$refs["DicappointmentvacationForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            console.log(this.dicappointmentvacation);
            dicappointment
              .save(this.activeName, this.dicappointmentvacation)
              .then(() => {
                this.dicappointmentvacationDialog = false;
                this.dicappointmentvacationgetList();
                this.resetdicappointmentvacation();
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                });
                this.saveLoading = false;
              })
              .catch((err) => {
                this.saveLoading = false;
              });
          }
        });
      }
      if (this.activeName == "DicAppointmentCombine") {
        this.$refs["DicAppointmentCombineForm"].validate((valid) => {
          if (valid) {
            if (this.saveLoading) return; //当接口请求没响应之前，loading为true，此时通过该语句return掉不执行下面的操作，从而控制请求次数
            this.saveLoading = true;
            console.log(this.dicAppointmentCombine);
            if (
              this.dicAppointmentCombine.dicappointmenttimes.length > 0 &&
              this.dicAppointmentCombine.combinetimeitems.length > 0
            ) {
              this.dicAppointmentCombine.dicappointmenttimes.forEach((d) => {
                this.dicAppointmentCombine.combinetimeitems.forEach((b) => {
                  if (d.timeid == b.timeid) {
                    b.companytotal = d.companytotal;
                    b.personaltotal = d.personaltotal;
                    b.total = d.total;
                    b.timename = d.timename;
                  }
                });
              });
            }
            delete this.dicAppointmentCombine["diccombines"];
            delete this.dicAppointmentCombine["dicappointmenttimes"];
            delete this.dicAppointmentCombine["departments"];
            dicappointment
              .save(this.activeName, this.dicAppointmentCombine)
              .then(() => {
                this.dicAppointmentCombineDialog = false;
                this.combinetimeitems = [];
                this.getDicAppointmentCombinelist();
                this.resetdicAppointmentCombine();
                this.$notify({
                  title: "成功",
                  message: "操作成功",
                  type: "success",
                });
                this.saveLoading = false;
              })
              .catch((err) => {
                this.dicAppointmentCombineDialog = false;
                this.saveLoading = false;
                this.combinetimeitems = [];
                this.getDicAppointmentCombinelist();
                this.resetdicAppointmentCombine();
              });
          }
        });
      }
      if (this.activeName == "DicaAppointmentHolidays") {
        this.holidayForm.operationtype = "Add";
        this.setHolidays();
      }
    },
    handleClick: function (tab, event) {
      console.log(this.activeName);
      this.multipleSelection = [];
      this.DicAppointmentTimelist = null;
      this.selectvalue = "";
      if (this.activeName == "DicaAppointmentVacation") {
        this.dicappointmentvacationgetList();
      }
      if (this.activeName == "DicAppointmentCombine") {
        this.DicAppointmentCombinelist = [];
        this.combinetimes = [];
      }
      if (this.activeName == "DicaAppointmentHolidays") {
        this.getHoliday();
      }
      if (this.activeName == "DicaAppointmentTotalNumberSource") {
        this.handleNumberSourceDataList();
      }
    },
    handleUpdate(row) {
      console.log(this.activeName, "this.activeName");
      // DicAppointmentCombine
      if (this.activeName == "DicAppointmentTime") {
        // 弹出编辑框
        this.dicappointmenttime.companytotal = row.companytotal;
        this.dicappointmenttime.delflag = row.delflag;
        this.dicappointmenttime.endtime = row.endtime;
        this.dicappointmenttime.meccod = row.meccod;
        this.dicappointmenttime.mecname = row.mecname;
        this.dicappointmenttime.personaltotal = row.personaltotal;
        this.dicappointmenttime.seqno = row.seqno;
        this.dicappointmenttime.starttime = row.starttime;
        this.dicappointmenttime.timeid = row.timeid;
        this.dicappointmenttime.timename = row.timename;
        this.dicappointmenttime.appointtype = row.appointtype;
        this.dicappointmenttime.total = row.total;
        this.dicappointmenttime.week1 = row.week1;
        this.dicappointmenttime.week2 = row.week2;
        this.dicappointmenttime.week3 = row.week3;
        this.dicappointmenttime.week4 = row.week4;
        this.dicappointmenttime.week5 = row.week5;
        this.dicappointmenttime.week6 = row.week6;
        this.dicappointmenttime.week7 = row.week7;
        var keys = Object.keys(this.dicappointmenttime);
        var reg = new RegExp("week");
        keys.forEach((d) => {
          if (d.indexOf("week") >= 0 && this.dicappointmenttime[d] == 1) {
            this.dicappointmenttime.codeitems.push(d);
          }
        });
        this.dicappointmenttime.week1 = 0;
        this.dicappointmenttime.week2 = 0;
        this.dicappointmenttime.week3 = 0;
        this.dicappointmenttime.week4 = 0;
        this.dicappointmenttime.week5 = 0;
        this.dicappointmenttime.week6 = 0;
        this.dicappointmenttime.week7 = 0;
        this.dialogStatus = "update";
        this.dicappointmenttimeDialog = true;
      }

      if (this.activeName == "DicaAppointmentVacation") {
        // 弹出编辑框
        this.dicappointmentvacation = row;
        this.dialogStatus = "update";
        this.dicappointmentvacationDialog = true;
      }
      if (this.activeName == "DicAppointmentCombine") {
        console.log(row);
        // 弹出编辑框
        var temp = {
          comid: row.comid,
        };
        dicappointment
          .detail(this.activeName, { comid: row.comid })
          .then((response) => {
            console.log(response);

            this.dicAppointmentCombine.departments =
              response.result.departments;
            this.dicAppointmentCombine.dicappointmenttimes =
              response.result.dicappointmenttimes;
            this.dicAppointmentCombine.diccombines =
              response.result.diccombines;
            this.dicAppointmentCombine.organs = response.result.organs;
            this.dicAppointmentCombine.combinenameinfo =
              response.result.combinenameinfo;
          });
        this.dicAppointmentCombine.combinecode = row.combinecode;
        this.dicAppointmentCombine.combinename = row.combinename;
        this.dicAppointmentCombine.combinetimes = row.combinetimes;
        this.dicAppointmentCombine.combinetimeitems = row.combinetimeitems;
        this.dicAppointmentCombine.comid = row.comid;
        this.dicAppointmentCombine.delflag = row.delflag;
        this.dicAppointmentCombine.deptcode = row.deptcode;
        this.dicAppointmentCombine.deptname = row.deptname;
        this.dicAppointmentCombine.meccod = row.meccod;
        this.dicAppointmentCombine.mecname = row.mecname;
        this.dicAppointmentCombine.seqno = row.seqno;
        this.dialogStatus = "update";
        this.dicAppointmentCombineDialog = true;
      }
      if (this.activeName == "DicaAppointmentHolidays") {
        this.holidayForm = {
          holidaydate: row.holiday_date,
          holidayname: row.holiday_name,
          ...row,
        };
        this.dialogStatus = "update";
        this.dicappointmentHolidayDialog = true;
      }
    },
    handleDelete(rows) {
      // 多行删除
      this.$confirm("是否确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.activeName == "DicAppointmentTime") {
            // 多行删除
            dicappointment
              .del(
                this.activeName,
                rows.map((u) => u.timeid)
              )
              .then(() => {
                this.getList();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                });
              });
          }

          if (this.activeName == "DicaAppointmentVacation") {
            // 多行删除
            dicappointment
              .del(
                this.activeName,
                rows.map((u) => u.vanid)
              )
              .then(() => {
                this.dicappointmentvacationgetList();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                });
              });
          }

          if (this.activeName == "DicAppointmentCombine") {
            // 多行删除
            dicappointment
              .del(
                this.activeName,
                rows.map((u) => u.comid)
              )
              .then(() => {
                this.combinetimes = [];
                this.getDicAppointmentCombinelist();
                this.$notify({
                  title: "成功",
                  message: "删除成功",
                  type: "success",
                });
              });
          }
          if (this.activeName == "DicaAppointmentHolidays") {
            console.log(rows[0]);
            this.holidayForm = {
              operationtype: "Delete",
              holidaydate: rows[0].holiday_date,
              holidayname: rows[0].holiday_name,
            };
            this.setHolidays();
          }
        })
        .catch(() => {
          _this.$message({
            showClose: true,
            type: "info",
            message: "已取消",
          });
        });
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
    loadcenter() {
      this.options = [];
      dicappointment.getorganlist().then((response) => {
        response.result.forEach((d) => {
          console.log(d);
          var temp = {
            value: d.id,
            label: d.parentName + "-" + (d && d.name),
          };
          this.options.push(temp);
        });
        console.log(response);
      });
    },
  },
  watch: {
    "dicappointmenttime.personaltotal": {
      handler(newVal, oldVal) {
        this.dicappointmenttime.total =
          newVal + this.dicappointmenttime.companytotal;
      },
      deep: true,
      immediate: true,
    },
    "dicappointmenttime.companytotal": {
      handler(newVal, oldVal) {
        this.dicappointmenttime.total =
          newVal + this.dicappointmenttime.personaltotal;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss">
.dialog-mini .el-select {
  height: 100%;
  width: 100%;
}
.dicappointment-wrap {
  width: 100%;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  padding: 10px;
  .dicappointment-menu-card {
    border: 0 none;
    height: calc(100vh - 150px);
    overflow: auto;
    .el-card__body {
      height: auto;
    }
  }
}
.dicappointment-box {
  height: 100%;
  background: #fff;
  box-sizing: border-box;
  .dicappointment-container {
    width: 100%;
    height: 100%;
    border: 1px solid #ccc;
    box-sizing: border-box;
    position: relative;
    .dicappointment-item {
      height: 30px;
      line-height: 30px;
      padding: 0 10px !important;
    }
  }
  .buttons-box {
    padding: 22px 10px;
    background: #f5f5f5;
  }
  .dicappointment-content {
    height: 100%;
    padding: 0;
    .buttons-box {
      text-align: right;
    }
  }
}
.el-tabs--left .el-tabs__header.is-left {
  margin-right: 0px !important;
}
</style>
