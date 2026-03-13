<template>
    <div>
        <el-dialog title="APP版本信息" :close-on-click-modal="false" width="550px" @close="handleClose" :visible="show">
            <el-form :model="form" :rules="rules" ref="editForm" label-width="120px">
                <el-form-item size="small" label="版本标题" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item size="small" label="版本类型" prop="type">
                    <el-select v-model="form.type" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.code"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item size="small" label="版本号" prop="version">
                    <el-input v-model="form.version"></el-input>
                </el-form-item>
                <el-form-item size="small" label="下载地址" prop="downloadurl">
                    <el-input v-model="form.downloadurl"></el-input>
                </el-form-item>
                <el-form-item size="small" label="版本说明" prop="explain">
                    <el-input v-model="form.explain" type="textarea" :rows="3"></el-input>
                </el-form-item>
                <el-form-item size="small" label="状态" prop="status">
                    <el-select v-model="form.status" clearable filterable placeholder="请选择">
                        <el-option v-for="(item, index) in statusList" :key="index" :label="item.name" :value="item.code"> </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="mini" @click="handleClose">取 消</el-button>
                <el-button size="mini" type="primary" @click="handleSubmit">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { add, update } from "@/api/sys_app_version";
export default {
    name: "SysAppVersionEdit",
    components: {},
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        typeList: {
            type: Array,
            default: () => [],
        },
        statusList: {
            type: Array,
            default: () => [],
        },
        item: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            form: {
                id: "",
                name: "",
                type: "",
                version: "",
                downloadurl: "",
                explain: "",
                status: 1,
            },
            rules: {
                name: [{ required: true, message: "请填写版本标题", trigger: "blur" }],
                version: [{ required: true, message: "请填写版本号", trigger: "blur" }],
                type: [{ required: true, message: "请选择版本类型", trigger: "change" }],
                downloadurl: [{ required: true, message: "请填写下载地址", trigger: "blur" }],
            },
        };
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {
        if (this.item) {
            this.form = JSON.parse(JSON.stringify(this.item));
        }
    },
    methods: {
        handleClose() {
            this.form = {
                id: "",
                name: "",
                type: "",
                version: "",
                downloadurl: "",
                explain: "",
                status: 1,
            };
            this.$refs["editForm"].clearValidate();
            this.$emit("update:show", false);
        },
        handleSubmit() {
            this.$refs["editForm"].validate((valid) => {
                if (valid) {
                    if (this.form.id) {
                        update(this.form).then((res) => {
                            this.handleAfter(res.message);
                        });
                    } else {
                        add(this.form).then((res) => {
                            this.handleAfter(res.message);
                        });
                    }
                }
            });
        },
        handleAfter(msg) {
            this.$message.success(msg);
            this.$emit("change"); // 获取列表新数据
            this.handleClose(); // 关闭弹窗
        },
    },
};
</script>

<style lang="scss" scoped>
::v-deep {
    .el-select {
        width: 100%;
    }
}
</style>
