<template>
    <div class="task-page">
        <!-- 左侧按钮区 -->
        <el-card class="button-card">
            <el-button type="primary" @click="openDialog()">新建检测</el-button>
            <div class="card_container" v-for="detect in detectList">
                <el-card class="detect-card"
                    :body-style="{ padding: '0px', 'padding-top': '10px', 'padding-bottom': '10px', 'padding-left': '5px' }">
                    <el-row>
                        <el-col :span="15" class="detect-name">{{ detect.name }}</el-col>
                        <el-col :span="3">
                            <el-button icon="VideoPlay" circle class="detect_btn"
                                @click="startDetect(detect.id)"></el-button></el-col>
                        <el-col :span="3">
                            <el-button icon="Edit" circle class="detect_btn"
                                @click="editDetect(detect.id)"></el-button></el-col>
                        <el-col :span="3">
                            <el-button icon="Close" circle class="detect_btn"
                                @click="deleteDetect(detect.id)"></el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-card>
        <!-- 右侧表格区 -->
        <el-card class="table-card">
            <div class="table-header">
                <h3>186 attacks</h3>
                <span class="status">65.27% INB</span>
            </div>
            <el-table :data="attackData" border style="width: 100%">
                <el-table-column prop="date" label="Date" width="180"></el-table-column>
                <el-table-column prop="payloads" label="Payloads" width="150"></el-table-column>
                <el-table-column prop="hits" label="Hits" width="100"></el-table-column>
                <el-table-column prop="topIP" label="Top IP / Source" width="200"></el-table-column>
                <el-table-column prop="domain" label="Domain / Path" width="300"></el-table-column>
                <el-table-column prop="status" label="Status" width="150"></el-table-column>
                <el-table-column prop="parameter" label="Parameter" width="200"></el-table-column>
            </el-table>
        </el-card>

        <!-- 新建检测弹窗 -->
        <el-dialog title="新建检测任务" v-model="newdialogVisible" width="50%">
            <el-form :model="form" label-width="120px">
                <el-form-item label="检测任务名称">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="检测环境">
                    <el-select v-model="form.env" placeholder="请选择">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择检测的问题">
                    <el-checkbox-group v-model="form.issues">
                        <el-checkbox label="越权问题"></el-checkbox>
                        <el-checkbox label="注入问题"></el-checkbox>
                        <el-checkbox label="xxx"></el-checkbox>
                        <el-checkbox label="选项5"></el-checkbox>
                        <el-checkbox label="选项6"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="检测时间" style="width: 50%;">
                    <el-date-picker v-model="form.time" type="daterange" range-separator="To" start-placeholder="开始日期"
                        end-placeholder="结束日期" />
                </el-form-item>
                <el-form-item label="越权配置">
                    <el-input type="textarea" v-model="form.config" placeholder="请输入越权配置"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">新建</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改检测任务" v-model="editdialogVisible" width="50%">
            <el-form :model="form" label-width="120px">
                <el-formitem v-model="form.id" hidden></el-formitem>
                <el-form-item label="检测任务名称">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="检测环境">
                    <el-select v-model="form.env" placeholder="请选择">
                        <el-option label="1" value="1"></el-option>
                        <el-option label="2" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择检测的问题">
                    <el-checkbox-group v-model="form.issues">
                        <el-checkbox label="越权问题"></el-checkbox>
                        <el-checkbox label="注入问题"></el-checkbox>
                        <el-checkbox label="xxx"></el-checkbox>
                        <el-checkbox label="选项5"></el-checkbox>
                        <el-checkbox label="选项6"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="检测时间" style="width: 50%;">
                    <el-date-picker v-model="form.time" type="daterange" range-separator="To" start-placeholder="开始日期"
                        end-placeholder="结束日期" />
                </el-form-item>
                <el-form-item label="越权配置">
                    <el-input type="textarea" v-model="form.config" placeholder="请输入越权配置"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editForm">修改</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup name="Detect">
import { ref } from "vue";
import { nanoid } from "nanoid";
import { id } from "element-plus/es/locales.mjs";
const newdialogVisible = ref(false);
const editdialogVisible = ref(false);
const attackData = ref([
    {
        date: "22 Dec, 18:03",
        payloads: "Credential stuffing",
        hits: 975,
        topIP: "52.202.82.29 (AWS)",
        domain: "main-aplus.demo.wallarm.tools /api/v1/login",
        status: "Monitoring",
        parameter: "POST | JSON = password",
    }]);
const form = ref({
    id: "",
    name: "",
    env: "",
    issues: [],
    time: "",
    config: "",
});

const detectList = ref([
]);

const openDialog = () => {
    form.value = {
        name: "",
        env: "",
        issues: [],
        time: [],
        config: "",
    };
    newdialogVisible.value = true;
};

const startDetect = (id) => {
    console.log("开始检测:", id);
    //TODO
};

const editDetect = (id) => {
    console.log("编辑检测:", id);
    const data = detectList.value.find((item) => item.id == id);
    form.value = {
        id: data.id,
        name: data.name,
        env: data.env,
        issues: data.issues,
        time: data.time,
        config: data.config,
    };
    console.log(form.value);
    editdialogVisible.value = true;
};

const deleteDetect = (id) => {
    console.log("删除检测:", id);
    detectList.value = detectList.value.filter((item) => item.id !== id);
};

const submitForm = () => {
    console.log("提交表单");
    newdialogVisible.value = false;
    console.log(form.value);
    detectList.value.push({
        id: nanoid(),
        name: form.value.name,
        env: form.value.env,
        issues: form.value.issues,
        time: form.value.time,
        config: form.value.config,
    });
};

const editForm = () => {
    console.log("修改表单");
    editdialogVisible.value = false;
    const index = detectList.value.findIndex((item) => item.id.toString() == form.value.id.toString());
    detectList.value[index] = {
        id: form.value.id,
        name: form.value.name,
        env: form.value.env,
        issues: form.value.issues,
        time: form.value.time,
        config: form.value.config,
    };
};
</script>

<style scoped>
.task-page {
    display: flex;
    height: 100%;
}

.sidebar {
    width: 250px;
    height: 100%;
}

.button-card {
    width: 250px;
}


.detect-name {
    font-size: 16px;
}

.detect-card {
    margin-top: 10px;
}

.detect_btn {
    width: 20px;
    height: 20px;
    margin: 2px;
}

.table-card {
    flex: 1;
    margin-left: 20px;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
</style>