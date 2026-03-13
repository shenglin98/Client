<template>
  <div class="setmeal_dialog">
    <!-- 主体套餐弹框 -->
    <el-dialog
      class="page_dialog"
      title="套餐组合选择"
      :visible.sync="dialogVisible"
      width="90%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="handleCloseSetMeal"
    >
      <div class="content">
        <div class="content_top">
          <div class="total_box">
            <div class="total">
              <div class="title">总数（个）</div>
              <div class="value">{{ chooseComData.length }}</div>
            </div>
            <div class="total">
              <div class="title bgtwo">费用（元）</div>
              <div class="value">{{ totalPrice }}</div>
            </div>
          </div>
          <div class="search_box">
            <el-input
              ref="searchInput"
              placeholder="请输入套餐或组合名称"
              v-model="searchName"
              @keydown.down.native="searchKeyDown"
              @keydown.up.native="searchKeyUp"
              @keydown.left.native="searchKeyLeft"
              @keydown.right.native="searchKeyRight"
              @keydown.enter.native="searchKeyEnter"
              clearable
            >
            </el-input>
            <el-button plain type="primary">搜 索</el-button>
          </div>
          <div class="btn_template">
            <el-button
              size="mini"
              plain
              type="primary"
              :loading="confirmFlag"
              @click="handleSubmitSetMeal"
              >确 认</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleSaveTemplate"
              >保存模板</el-button
            >
            <el-button size="mini" plain type="primary" @click="handleResetPage"
              >刷新</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleEmptyChooseData"
              >清空</el-button
            >
            <el-button
              size="mini"
              plain
              type="primary"
              @click="handleCloseSetMeal"
              >关 闭</el-button
            >
          </div>
        </div>
        <div class="table_box">
          <vxe-table
            class="setmeal_table color_table"
            ref="setmealitems"
            height="auto"
            border="inner"
            :row-class-name="handleKeyRowClassName"
            :loading="loading"
            highlight-hover-row
            :data="setmealitemsData"
            :checkbox-config="{ reserve: true }"
            :sort-config="{ trigger: 'cell' }"
            @checkbox-change="handleSelectSetMeal"
            row-id="setmealcode"
          >
            <vxe-table-column
              type="checkbox"
              width="45"
              :reserve-selection="true"
            ></vxe-table-column>
            <vxe-table-column
              field="setmealname"
              title="套餐名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <vxe-table
            class="combination_table color_table"
            ref="combination"
            v-if="showTableFlag"
            height="auto"
            border="inner"
            show-overflow
            :loading="loading"
            highlight-hover-row
            :data="combinationData"
            :checkbox-config="{ reserve: true }"
            :row-class-name="handleReturnIsChecked"
            :sort-config="{ trigger: 'cell' }"
            @cell-dblclick="handleDbclickCombination"
            row-id="combinecode"
          >
            <vxe-table-column
              field="combinename"
              title="组合名称"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
            <vxe-table-column
              field="price"
              title="价格"
              width="80px"
              show-header-overflow
              show-overflow="title"
              show-footer-overflow
            ></vxe-table-column>
          </vxe-table>
          <div class="choose_box">
            <div class="choose_table">
              <vxe-table
                ref="chooseCom"
                v-if="showTableFlag"
                height="auto"
                border="inner"
                show-overflow
                :loading="loading"
                highlight-hover-row
                :data="chooseComData"
                :checkbox-config="{ reserve: true }"
                :row-class-name="handleReturnIsChecked"
                :sort-config="{ trigger: 'cell' }"
                @cell-dblclick="handleDbclickChooseComData"
                row-id="combinecode"
              >
                <vxe-table-column field="" title="" width="42">
                  <template v-slot="{ row }">
                    <i
                      class="el-icon-delete delicon"
                      @click="handleDelChooseComData(row)"
                    ></i>
                  </template>
                </vxe-table-column>
                <vxe-table-column
                  field="combinename"
                  title="已选组合"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
                <vxe-table-column
                  field="price"
                  title="价格"
                  width="80px"
                  show-header-overflow
                  show-overflow="title"
                  show-footer-overflow
                ></vxe-table-column>
              </vxe-table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 保存模板弹框 -->
    <el-dialog
      class="temp_dialog"
      title="套餐模板维护"
      :visible.sync="showTemplate"
      width="45%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div class="content">
        <div class="update_temp">
          <div class="head">更新模板</div>
          <EasyTable
            class="template_table"
            ref="template_table"
            :loading="loading"
            height="100%"
            :data="templateData"
            :tableOptions="templateOptions"
            :radio-config="{ fetch: true, rowClick: true }"
            :border="false"
            :header-cell-style="handleReturnStyle"
            :row-class-name="handleTableRowClassName"
            :row-style="{ height: '32px' }"
            :cell-style="{ padding: '0' }"
            @checked-change="handleSelectTemplate"
          />
        </div>
        <div class="add_temp">
          <div class="head">新增模板</div>
          <div class="input_box">
            模板名称：<el-input v-model="tempName" size="mini" clearable>
            </el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          size="mini"
          plain
          type="primary"
          @click="handleSubmitTemplate"
          >确 认</el-button
        >
        <el-button size="mini" plain type="primary" @click="handleCloseTemplate"
          >关 闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getDicSetmealList,
  getTemplateList,
  setTemplateAddorUpdate,
  setTemplateDelete,
} from "@/api/setMealDialog.js";
import { mapGetters } from "vuex";

export default {
  name: "",

  components: {},
  props: {
    groupTableData: {
      type: Array,
      required: true,
    },
    flag: {
      type: String,
    },
    sex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      setmealitemsData: null, // 套餐筛选后数据
      combinationData: null, // 组合筛选后数据
      keyType: "left", // 组合筛选后数据
      dialogVisible: true, // 显示项目弹框
      searchName: "", // 检索名称
      loading: false, // 加载效果
      setmealitems: [], // 套餐表格数据 -- 源数据不改变
      combination: [], // 项目表格1数据 -- 源数据不改变
      chooseone: [], // 项目表格1数据 -- 选中操作数据
      choosetwo: [], // 项目表格1数据 -- 选中操作数据
      choosethree: [], // 项目表格1数据 -- 选中操作数据
      chooseComData: [], // 已选中数据
      selectSetMeal: [], // 套餐选中数据
      showTemplate: false, // 控制显示模板
      templateData: [], // 模板列表数据
      tempName: "", // 新增模板名称
      selectTemplate: [], // 个人模板表格选中数据
      templateObj: {
        code: "",
        name: "",
        price: 0,
        companyprice: 0,
        sex: 0,
        status: 0,
        seqno: 0,
        combineitems: [],
      },
      showTableFlag: true, // 控制表格显示
      confirmFlag: false,
    };
  },
  computed: {
    ...mapGetters(["name", "id"]),
    // 模板列表表格配置
    templateOptions() {
      return [
        {
          type: "radio",
          width: 45,
        },
        {
          title: "套餐模板",
          omit: 1,
          prop: "name",
        },
        {
          title: "价格",
          prop: "price",
          width: 80,
          omit: 1,
        },
        {
          title: "操作",
          width: 80,
          render: (h, data) => {
            return (
              <el-link
                type="primary"
                class="name_box"
                vOn:click_stop_prevent={() =>
                  this.handleSetTemplateDelete(data)
                }
              >
                删除
              </el-link>
            );
          },
        },
      ];
    },
    // 总选择金额
    totalPrice() {
      let price = 0;
      this.chooseComData.forEach((item) => {
        if (item.hasOwnProperty("discountprice")) {
          price += +item.discountprice;
        } else {
          price += +item.price;
        }
      });
      return price.toFixed(2);
    },
    // 套餐表格搜索数据
    // setmealitemsData() {
    //   if (this.isSearchNameChange === 3) {
    //     console.log(22)
    //     return
    //   }
    //   if (this.isSearchNameChange === 2) {
    //     this.isSearchNameChange = 3
    //   }
    //   const search = this.searchName;
    // if (search) {
    //   let data = [...this.setmealitems]
    //   data.map( v => {
    //     v.isHigh = false
    //     return v
    //   })
    //   this.setmealitems = [...data]
    //   let filterData = this.setmealitems.filter((data) => {
    //     return Object.keys(data).some((key) => {
    //       return (
    //         String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
    //       );
    //     });
    //   });
    //   filterData[0].isHigh = true
    //   return filterData
    // }
    //   if (this.setmealitems && this.setmealitems.length) {
    //     let idx = this.setmealitems.findIndex(v => !!v.isHigh)
    //     if (idx === -1) {
    //       this.setmealitems[0].isHigh = true
    //     }
    //   }
    //   return this.setmealitems;
    // },
    // 组合表格搜索数据1
    // combinationData() {
    //   const search = this.searchName;
    //   if (search && search !== this.searchName) {
    //     return this.combination.filter((data) => {
    //       return Object.keys(data).some((key) => {
    //         return (
    //           String(data[key]).toLowerCase().indexOf(search.toLowerCase()) > -1
    //         );
    //       });
    //     });
    //   }
    //   return this.combination;
    // },
  },

  watch: {
    combination(n) {
      if (n && n.length) {
        let idx = 0;
        if (this.combinationData && this.combinationData.length) {
          idx = this.combinationData.findIndex((v) => !!v.isHigh);
          idx === -1 ? (idx = 0) : "";
        }
        if (this.searchName) {
          let filterData = n.filter((data) => {
            return Object.keys(data).some((key) => {
              let returnArr = [
                "price",
                "deptseqno",
                "discountflag",
                "viewgroup",
              ];
              let containArr = ["combinename", "combinepy", "combinewb"];
              let equalArr = ["price", "combinename", "combinepy", "combinewb"];
              if (returnArr.includes(key)) return;
              if (containArr.includes(key)) {
                return (
                  String(data[key]).toLowerCase().indexOf(n.toLowerCase()) > -1
                );
              }
              if (!equalArr.includes(key)) {
                return (
                  String(data[key]).toLowerCase() ===
                  this.searchName.toLowerCase()
                );
              }
              // return (
              //   String(data[key])
              //     .toLowerCase()
              //     .indexOf(this.searchName.toLowerCase()) > -1
              // );
            });
          });
          if (filterData && filterData.length) {
            // console.log(filterData)
            filterData[idx].isHigh = true;
            this.combinationData = filterData;
          } else {
            this.combinationData = [];
          }
        } else {
          this.combinationData = [...this.combination];
        }
      }
    },
    searchName: {
      handler: function (n, o) {
        if (this.selectSetMeal && this.selectSetMeal.length) {
          // let d = [...this.selectSetMeal]
          this.setmealitemsData = [];
        } else {
          if (this.setmealitems && this.setmealitems.length) {
            this.setmealitems.map((v) => {
              v.isHigh = false;
              return v;
            });
            let filterData = this.setmealitems.filter((data) => {
              return Object.keys(data).some((key) => {
                let returnArr = [
                  "price",
                  "sex",
                  "companyprice",
                  "combineitems",
                  "setmealtyp",
                ];
                let containArr = ["setmealname", "setmealpx", "setmealwb"];
                let equalArr = ["setmealcode"];
                if (returnArr.includes(key)) return;
                if (containArr.includes(key)) {
                  return (
                    String(data[key]).toLowerCase().indexOf(n.toLowerCase()) >
                    -1
                  );
                }
                if (!equalArr.includes(key)) {
                  return (
                    String(data[key]).toLowerCase() ===
                    this.searchName.toLowerCase()
                  );
                }
                // console.log(String(data[key]).toLowerCase(), "对象的");
                // console.log(this.searchName.toLowerCase(), "输入的");
                // return (
                //   String(data[key]).toLowerCase().indexOf(n.toLowerCase()) > -1
                // );
              });
            });
            if (filterData && filterData.length) {
              // console.log(filterData)
              filterData[0].isHigh = true;
              this.setmealitemsData = filterData;
            } else {
              this.setmealitemsData = [];
            }
          }
        }
        if (this.combination && this.combination.length) {
          this.combination.map((v) => {
            v.isHigh = false;
            return v;
          });
          let filterData = this.combination.filter((data) => {
            return Object.keys(data).some((key) => {
              let returnArr = [
                "price",
                "deptseqno",
                "discountflag",
                "viewgroup",
              ];
              let containArr = ["combinename", "combinepy", "combinewb"];
              let equalArr = ["price", "combinename", "combinepy", "combinewb"];
              if (returnArr.includes(key)) return;
              if (containArr.includes(key)) {
                return (
                  String(data[key]).toLowerCase().indexOf(n.toLowerCase()) > -1
                );
              }
              if (!equalArr.includes(key)) {
                return (
                  String(data[key]).toLowerCase() ===
                  this.searchName.toLowerCase()
                );
              }
              // return (
              //   String(data[key]).toLowerCase().indexOf(n.toLowerCase()) > -1
              // );
            });
          });
          if (filterData && filterData.length) {
            // console.log(filterData)
            filterData[0].isHigh = true;
            this.combinationData = filterData;
          } else {
            this.combinationData = [];
          }
        }
      },
      immediate: true,
    },
  },

  created() {},

  mounted() {
    console.log(this.flag);

    // 项目加载获取表格数据
    this.handleGetDicSetmealList();
  },

  methods: {
    // 删除按钮删除数据
    handleDelChooseComData(row) {
      let index = this.chooseComData.findIndex(
        (k) => k.combinecode === row.combinecode
      );
      if (index != -1) {
        let temp = this.chooseComData.splice(index, 1);
        let setIndex = this.combination.findIndex(
          (k) => k.combinecode === temp[0].combinecode
        );
        setIndex == -1 && this.combination.push(temp[0]);
      }

      setTimeout(() => {
        this.$refs.searchInput.focus();
      }, 500);
    },
    /**
     * @description: 搜索框点击enter事件
     * @return {*}
     */
    searchKeyEnter() {
      console.log("enter");
      if (!this.setmealitemsData || this.setmealitemsData.length == 0) {
        this.keyType = "right";
      }
      if (this.keyType === "left") {
        let row = this.setmealitemsData.find((v) => {
          return !!v.isHigh;
        });
        if (row) {
          this.$refs.setmealitems.toggleCheckboxRow(row);
          this.handleSelectSetMeal({
            records: [row],
          });
        }
      }
      if (this.keyType === "right") {
        let row = this.combinationData.find((v) => {
          return !!v.isHigh;
        });
        if (row) {
          // this.$refs.setmealitems.toggleCheckboxRow(row)
          this.handleDbclickCombination({
            row: row,
          });
        }
      }
      this.searchName = "";
    },
    /**
     * @description: 搜索框点击↑事件
     * @return {*}
     */
    searchKeyUp() {
      console.log("up");
      if (this.keyType === "left") {
        this.leftTableUp();
      } else {
        this.rightTableUp();
      }
    },
    /**
     * @description: 搜索框点击→事件
     * @return {*}
     */
    searchKeyRight() {
      console.log("right");
      if (this.keyType === "right") {
        return;
      }
      if (!this.combinationData || !this.combinationData.length) {
        return;
      }

      let dataLeft = [...this.setmealitemsData];
      dataLeft.map((v) => {
        v.isHigh = false;
        return v;
      });
      this.setmealitemsData = dataLeft;

      this.keyType = "right";

      let dataRight = [...this.combinationData];
      dataRight[0].isHigh = true;
      this.combinationData = dataRight;
      // console.log(this.combinationData)
    },
    /**
     * @description: 搜索框点击←事件
     * @return {*}
     */
    searchKeyLeft() {
      console.log("left");
      if (this.keyType === "left") {
        return;
      }
      if (!this.setmealitemsData || !this.setmealitemsData.length) {
        return;
      }

      let dataRight = [...this.combinationData];
      dataRight.map((v) => {
        v.isHigh = false;
        return v;
      });
      this.combinationData = dataRight;

      this.keyType = "left";

      let dataLeft = [...this.setmealitemsData];
      dataLeft[0].isHigh = true;
      this.setmealitemsData = dataLeft;
      // console.log(this.setmealitemsData)
    },
    /**
     * @description: 搜索框点击↓事件
     * @return {*}
     */
    searchKeyDown() {
      console.log("down");
      if (this.selectSetMeal && this.selectSetMeal.length) {
        this.keyType = "right";
      }
      if (this.keyType === "left") {
        this.leftTableDown();
      } else {
        this.rightTableDown();
      }
    },
    leftTableUp() {
      if (!this.setmealitemsData || !this.setmealitemsData.length) {
        return;
      }
      let data = [...this.setmealitemsData];
      let idx = data.findIndex((v) => !!v.isHigh);
      data.map((v) => {
        v.isHigh = false;
        return v;
      });
      let posY = 36 * (data.length - 1);
      if (idx === 0) {
        data[data.length - 1].isHigh = true;
        posY = 36 * (data.length - 1);
      } else {
        data[idx - 1].isHigh = true;
        if (idx < data.length - 10) {
          posY = 36 * (idx - 5 - 1);
        }
      }
      setTimeout(() => {
        this.$refs.setmealitems.scrollTo(0, posY);
        // this.$refs.setmealitemsData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
      this.setmealitemsData = [...data];
    },
    rightTableUp() {
      if (!this.combinationData || !this.combinationData.length) {
        return;
      }
      let data = [...this.combinationData];
      let idx = data.findIndex((v) => !!v.isHigh);
      data.map((v) => {
        v.isHigh = false;
        return v;
      });
      let posY = 36 * (data.length - 1);
      if (idx === 0) {
        data[data.length - 1].isHigh = true;
        posY = 36 * (data.length - 1);
      } else {
        data[idx - 1].isHigh = true;
        if (idx < data.length - 10) {
          posY = 36 * (idx - 5 - 1);
        }
      }
      setTimeout(() => {
        this.$refs.combination.scrollTo(0, posY);
        // this.$refs.combinationData.$el.querySelector('.vxe-table--body-wrapper').scrollTo(0, posY)
      }, 500);
      this.combinationData = [...data];
    },
    leftTableDown() {
      if (!this.setmealitemsData || !this.setmealitemsData.length) {
        this.keyType = "right";
        this.rightTableDown();
        return;
      }
      let data = [...this.setmealitemsData];
      let idx = data.findIndex((v) => !!v.isHigh);
      data.map((v) => {
        v.isHigh = false;
        return v;
      });
      let posY = 0;
      if (idx < data.length - 1) {
        data[idx + 1].isHigh = true;
        if (idx > 10) {
          posY = 36 * (idx - 10 + 1);
        }
      } else {
        data[0].isHigh = true;
      }
      // console.log(idx, posY)
      this.setmealitemsData = [...data];
      setTimeout(() => {
        this.$refs.setmealitems.$el
          .querySelector(".vxe-table--body-wrapper")
          .scrollTo(0, posY);
      }, 500);
    },
    rightTableDown() {
      if (!this.combinationData || !this.combinationData.length) {
        return;
      }
      let data = [...this.combinationData];
      let idx = data.findIndex((v) => !!v.isHigh);
      data.map((v) => {
        v.isHigh = false;
        return v;
      });
      let posY = 0;
      if (idx < data.length - 1) {
        data[idx + 1].isHigh = true;
        if (idx > 10) {
          posY = 36 * (idx - 10 + 1);
        }
      } else {
        data[0].isHigh = true;
      }
      // console.log(idx, posY)
      this.combinationData = [...data];
      setTimeout(() => {
        this.$refs.combination.$el
          .querySelector(".vxe-table--body-wrapper")
          .scrollTo(0, posY);
      }, 500);
    },
    handleKeyRowClassName({ row }) {
      // console.log(row)
      if (row.isHigh) {
        return "row-high-color";
      }
      return "";
    },
    // 清空选中套餐
    handleEmptyChooseData() {
      // if (this.chooseComData == 0) return;
      this.combination.push(...this.chooseComData);
      this.chooseComData = [];
      this.selectSetMeal = [];
      this.searchName = "";
      let d = [...this.setmealitems];
      this.setmealitemsData = [...d];
      setTimeout(() => {
        this.$refs.setmealitems.clearCheckboxRow();
        this.$refs.searchInput.focus();
      }, 500);
    },
    // 套餐选中数据回调
    handleSelectSetMeal({ records, checked, row }) {
      console.log(records, row, checked);
      if (!checked) {
        if (row && row.combineitems && row.combineitems.length) {
          let propsData = this.chooseComData.filter(
            (item) =>
              !row.combineitems.some(
                (ele) => ele.combinecode === item.combinecode
              )
          );
          this.combination.push(...row.combineitems);
          this.chooseComData = [...propsData];
        }
        // return
      }
      // if (records.length == 0) return;
      // if (this.searchName) {
      if (records.length) {
        let d = [...records];
        this.setmealitemsData = [...d];
      } else {
        if (this.setmealitems && this.setmealitems.length) {
          this.setmealitems.map((v) => {
            v.isHigh = false;
            return v;
          });
          let filterData = this.setmealitems.filter((data) => {
            return Object.keys(data).some((key) => {
              return (
                String(data[key])
                  .toLowerCase()
                  .indexOf(this.searchName.toLowerCase()) > -1
              );
            });
          });
          if (filterData && filterData.length) {
            // console.log(filterData)
            filterData[0].isHigh = true;
            this.setmealitemsData = filterData;
          } else {
            this.setmealitemsData = [];
          }
        }
      }
      // }
      this.selectSetMeal = records;
      records.forEach((item) => {
        item.combineitems.forEach((val) => {
          let index = this.combination.findIndex(
            (k) => k.combinecode === val.combinecode
          );
          if (index != -1) {
            let temp = this.combination.splice(index, 1);
            let setIndex = this.chooseComData.findIndex(
              (k) => k.combinecode === temp[0].combinecode
            );
            setIndex == -1 && this.chooseComData.push(temp[0]);
          }
        });
      });
    },
    // 组合双击表格选中数据回调
    handleDbclickCombination({ row }, isEnter) {
      console.log(isEnter);
      if (isEnter) {
        this.combinationData.map((v) => {
          v.isHigh = false;
          return v;
        });
      }
      let index = this.combinationData.findIndex(
        (k) => k.combinecode === row.combinecode
      );
      if (index === 0) {
        if (this.combinationData.length > 1) {
          this.combinationData[index + 1].isHigh = true;
        }
      } else {
        if (this.combinationData.length - 1 == index) {
          this.combinationData[index - 1].isHigh = true;
        } else {
          this.combinationData[index + 1].isHigh = true;
        }
      }
      if (index != -1) {
        let temp = this.combinationData.splice(index, 1);
        let setIndex = this.chooseComData.findIndex(
          (k) => k.combinecode === temp[0].combinecode
        );
        setIndex == -1 && this.chooseComData.push(temp[0]);
      }
      let index2 = this.combination.findIndex(
        (k) => k.combinecode === row.combinecode
      );
      if (index2 != -1) {
        this.combination.splice(index2, 1);
      }
      this.searchName = "";
      setTimeout(() => {
        this.$refs.searchInput.focus();
        // this.rightTableDown()
      }, 500);
    },
    // 组合选中数据表格双击取消回调
    handleDbclickChooseComData({ row }) {
      let index = this.chooseComData.findIndex(
        (k) => k.combinecode === row.combinecode
      );
      if (index != -1) {
        let temp = this.chooseComData.splice(index, 1);
        let setIndex = this.combination.findIndex(
          (k) => k.combinecode === temp[0].combinecode
        );
        setIndex == -1 && this.combination.push(temp[0]);
      }

      setTimeout(() => {
        this.$refs.searchInput.focus();
      }, 500);
    },
    // 组合是否禁用回调
    handleReturnIsChecked({ row }) {
      // true--可以勾选  false--不允许勾选
      if (this.flag === "edit") {
        let editFlag = this.groupTableData.filter((k) => {
          return k.combinecode === row.combinecode && k.status >= 2;
        })[0];
        if (!editFlag) {
          if (row.isHigh) {
            return "row-high-color";
          }
          return "";
        } else {
          if (row.isHigh) {
            return "row-high-color disable_row";
          }
          return "disable_row";
        }
      } else {
        if (row.isHigh) {
          return "row-high-color";
        }
        return "";
      }
    },
    // 项目刷新回调
    handleResetPage() {
      this.chooseone = [];
      this.selectSetMeal = [];
      this.handleGetDicSetmealList();
      if (this.flag == "add") {
        // 清空前面回显
        this.$refs.combination.clearCheckboxRow();
      }
      setTimeout(() => {
        this.$refs.setmealitems.clearCheckboxRow();
        // this.$refs.searchInput.focus();
      }, 1000);
    },
    // 获取套餐 - 指定一个key标识这一行的数据
    handleGetSetmealitemsKey(row) {
      //id为row的data属性之一，必须唯一且与tableData中保持一致
      return row.setmealcode;
    },
    // 获取组合123 - 指定一个key标识这一行的数据
    handleGetcombinationKey(row) {
      //id为row的data属性之一，必须唯一且与tableData中保持一致
      return row.combinecode;
    },
    // 提交套餐选择弹框回调
    handleSubmitSetMeal() {
      this.confirmFlag = true;
      // 套餐可选性
      let chooseObj = undefined;
      let data = this.chooseComData;
      if (
        this.selectSetMeal.length === 1 &&
        this.selectSetMeal[0].combineitems.length === data.length
      ) {
        chooseObj = this.selectSetMeal[0];
      }
      data = data.map((item) => {
        if (item.combinecode == "ZH10009") {
          console.log(item);
        }
        return {
          detid: "",
          regid: "",
          setmealcode: (chooseObj && chooseObj.setmealcode) || "",
          setmealname: (chooseObj && chooseObj.setmealname) || "",
          combinecode: item.combinecode || "",
          combinename: item.combinename || "",
          deptcode: item.deptcode || "",
          deptname: item.deptname || "",
          operatorname: this.name || "",
          operatordate: new Date(+new Date() + 8 * 3600 * 1000)
            .toJSON()
            .substr(0, 16)
            .replace("T", " "),
          price: item.originalprice || item.price || 0,
          discount: item.discount || 1,
          discountprice: item.discountprice || item.price || 0,
          deptseqno: item.deptseqno || 0,
          discountflag: item.discountflag,
          viewgroup: item.viewgroup,
          qty: 1,
          isOptional: false,
          addflag: 0,
        };
      });
      // data = data.sort(function (a, b) {
      //   return a.deptseqno - b.deptseqno;
      // });
      this.$emit("submit", data, chooseObj); // 发送数据父组件
    },
    // 关闭套餐选择弹框回调
    handleCloseSetMeal() {
      this.$emit("close", false);
    },
    // 模板删除回调
    handleSetTemplateDelete(item) {
      console.log("触发");
      this.$confirm("此操作将删除当前模板, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let codeItems = [item.code];
          setTemplateDelete(codeItems).then((res) => {
            this.$message({
              message: res.message,
              type: "success",
              customClass: "zzXindex",
            });
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.handleGetTemplateList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 模板确认提交回调
    handleSubmitTemplate() {
      if (this.tempName != "" && this.selectTemplate.length != 0) {
        this.$message({
          message: "不能同时更新并新增!",
          type: "warning",
          customClass: "zzXindex",
        });
        return false;
      }
      //   新增
      if (this.tempName !== "") {
        this.templateObj.name = this.tempName;
        this.templateObj.combineitems = this.chooseComData.map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
      //   更新
      if (this.selectTemplate.length === 1) {
        this.templateObj.code = this.selectTemplate[0].code;
        this.templateObj.name = this.selectTemplate[0].name;
        this.templateObj.combineitems = this.chooseComData.map((k) => {
          return k.combinecode;
        });
        setTemplateAddorUpdate(this.templateObj).then((res) => {
          this.$message({
            message: res.message,
            type: "success",
            customClass: "zzXindex",
          });
          this.handleCloseTemplate();
        });
        return false;
      }
    },
    // 模板关闭回调
    handleCloseTemplate() {
      this.tempName = "";
      this.selectTemplate = [];
      this.showTemplate = false;
      //   this.handleGetDicSetmealList();
    },
    handleSelectTemplate(item) {
      this.selectTemplate = [];
      this.selectTemplate.push(item);
    },
    // 保存模板按钮回调
    handleSaveTemplate() {
      if (this.chooseComData.length === 0) {
        this.$message.warning("组合不能为空!");
        return false;
      }
      this.handleGetTemplateList();
      this.showTemplate = true;
    },
    // 获取个人模板表格数据
    handleGetTemplateList() {
      getTemplateList({
        page: 1,
        limit: 1000000,
        key: "",
      }).then((res) => {
        this.templateData = res.data;
      });
    },

    // 获取表格数据回调
    handleGetDicSetmealList() {
      this.loading = true;
      getDicSetmealList({ tp: "", sex: this.sex, gp: "1" }).then((res) => {
        this.loading = false;
        this.setmealitems = res.result.setmealitems;
        this.setmealitemsData = [...this.setmealitems];
        if (this.setmealitemsData && this.setmealitemsData.length) {
          this.setmealitemsData[0].isHigh = true;
        }
        this.combination = res.result.combineitems.map((k) => {
          return { ...k, depwb: "", combinewb: "" };
        });
        console.log(this.combination, "this.combination");
        // console.log(this.groupTableData);
        this.groupTableData.forEach((item) => {
          let index = this.combination.findIndex(
            (k) => k.combinecode === item.combinecode
          );
          index != -1 && this.combination.splice(index, 1);
        });
        this.combinationData = [...this.combination];
        this.chooseComData = JSON.parse(JSON.stringify(this.groupTableData));
        setTimeout(() => {
          this.$refs.searchInput.focus();
          if (true) {
            this.searchKeyRight();
          }
        }, 500);
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
    handleTableRowColor({ row, rowIndex }) {
      let rowBackground = {};
      if (row.setmealtyp == "Person") {
        rowBackground.background = "rgba(0, 255, 255, 0.5)";
        return rowBackground;
      }
    },
  },
};
</script>
<style lang='scss'>
.el-message-box__wrapper {
  z-index: 9999 !important;
  background-color: rgba(0, 0, 0, 0.4) !important;
}
.color_table .row-high-color {
  background-color: #81d3f8;
  // background-color: #e6f7ff;
}
.zzXindex {
  z-index: 999999 !important;
}
.disable_row {
  position: relative;
  ::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    cursor: not-allowed;
    z-index: 66;
  }
}
.combination_table {
  width: 35% !important;
}
.choose_table {
  height: 100% !important;
}
</style>
<style lang='scss' scoped>
@import "./css/index_qyzyy.scss";
</style>