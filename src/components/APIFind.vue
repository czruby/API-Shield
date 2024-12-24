<template>
    <div class="task-page">
        <!-- 左侧按钮区 -->
        <el-card class="button-card">
            <el-button type="primary" @click="openDialog()">新建代理</el-button>
            <div class="card_container" v-for="proxy in proxyList">
                <el-card class="proxy-card"
                    :body-style="{ padding: '0px', 'padding-top': '10px', 'padding-bottom': '10px', 'padding-left': '5px' }">
                    <el-row>
                        <el-col :span="15" class="proxy-name">{{ proxy.name }}</el-col>
                        <el-col :span="3">
                            <el-button icon="VideoPlay" circle class="proxy_btn"
                                @click="startDetect(proxy.id)"></el-button></el-col>
                        <el-col :span="3">
                            <el-button icon="Edit" circle class="proxy_btn"
                                @click="editDetect(proxy.id)"></el-button></el-col>
                        <el-col :span="3">
                            <el-button icon="Close" circle class="proxy_btn"
                                @click="deleteDetect(proxy.id)"></el-button>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-card>
        <!-- 右侧表格区 -->
        <el-card class="table-card">
            <el-col :span="6">
                <el-form-item label="选择查看的代理">
                    <el-select v-model="report" placeholder="1">
                        <el-option label="1" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <div class="search-bar">
                <el-input v-model="searchKeyword" placeholder="搜索API" clearable />
                <el-button type="primary" @click="handleSearch">
                    搜索
                </el-button>
            </div>
            <el-table :data="APIData" stripe border>
                <el-table-column prop="apiType" label="类型" width="100px">
                    <template #default="{ row }">
                        <el-button disabled
                            :style="{ 'background-color': getColor(row.apiType), 'color': 'white', width: '100%' }">
                            {{ row.apiType }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="apiUrl" label="名称" />
                <el-table-column prop="flowCount" label="流量数" width="100px" />
                <el-table-column label="详细信息" width="100px">
                    <template #default="{ row }">
                        <el-button type="text" @click="handleView(row)">
                            View
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 新建检测弹窗 -->
        <el-dialog title="新建代理" v-model="newdialogVisible" width="50%">
            <el-form :model="form" label-width="120px">
                <el-form-item hidden v-model="form.id"></el-form-item>
                <el-form-item label="代理名称">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="服务地址与端口">
                    <el-input v-model="form.ipconfig" placeholder="请输入服务地址与端口(格式ip:port)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">新建</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改代理" v-model="editdialogVisible" width="50%">
            <el-form :model="form" label-width="120px">
                <el-form-item hidden v-model="form.id"></el-form-item>
                <el-form-item label="代理名称">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="服务地址与端口">
                    <el-input v-model="form.ipconfig" placeholder="请输入服务地址与端口(格式ip:port)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editForm">修改</el-button>
            </div>
        </el-dialog>
        <div class="rightMenu" v-if="foldedState">
            <el-button class="back-btn" icon="ArrowLeft" @click="goBack()" circle></el-button>
            <el-table :data="flowDatas" style="width: 85%;" border>
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="ip" label="IP"></el-table-column>
                <el-table-column prop="url" label="url"></el-table-column>
                <el-table-column prop="attackType" label="攻击类型"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup name="Detect">
import { ref } from "vue";
import { nanoid } from "nanoid";
import { id } from "element-plus/es/locales.mjs";
const newdialogVisible = ref(false);
const editdialogVisible = ref(false);
const searchKeyword = ref("");
const foldedState = ref(false);
const flowDatas = ref([
    {
        date: "2021-09-01",
        ip: "192.168.1.1",
        url: "https://www.baidu.com",
        attackType: "SQL注入",
    },
    {
        date: "2021-09-02",
        ip: "192.168.1.2",
        url: "https://www.google.com",
        attackType: "XSS漏洞",
    }
]);
const handleSearch = () => {
    console.log("搜索");
};
const APIData = ref([
    {
        apiType: "GET",
        apiUrl: "https://api1.com",
        flowCount: "100",
    },
    {
        apiType: "POST",
        apiUrl: "https://api2.com",
        flowCount: "200",
    },
    {
        apiType: "PUT",
        apiUrl: "https://api3.com",
        flowCount: "300",
    },
    {
        apiType: "DELETE",
        apiUrl: "https://api4.com",
        flowCount: "400",
    },
    {
        apiType: "PATCH",
        apiUrl: "https://api5.com",
        flowCount: "500",
    },
])

const handleView = (row) => {
    console.log("查看", row);
    foldedState.value = true;
};

const goBack = () => {
    foldedState.value = false
}


const form = ref({
    id: "",
    name: "",
    description: "",
    ipconfig: "",
});

const proxyList = ref([
]);

const openDialog = () => {
    form.value = {
    };
    newdialogVisible.value = true;
};

const startDetect = (id) => {
    console.log("开始检测:", id);
    //TODO
};

const editDetect = (id) => {
    console.log("编辑检测:", id);
    const data = proxyList.value.find((item) => item.id == id);
    form.value = {
        id: data.id,
        name: data.name,
        description: data.description,
        ipconfig: data.ipconfig,
    };
    console.log(form.value);
    editdialogVisible.value = true;
};

const deleteDetect = (id) => {
    console.log("删除检测:", id);
    proxyList.value = proxyList.value.filter((item) => item.id !== id);
};

const submitForm = () => {
    console.log("提交表单");
    newdialogVisible.value = false;
    console.log(form.value);
    proxyList.value.push({
        id: nanoid(),
        name: form.value.name,
        description: form.value.description,
        ipconfig: form.value.ipconfig,
    });
};

const editForm = () => {
    console.log("修改表单");
    editdialogVisible.value = false;
    const index = proxyList.value.findIndex((item) => item.id.toString() == form.value.id.toString());
    proxyList.value[index] = {
        id: form.value.id,
        name: form.value.name,
        description: form.value.description,
        ipconfig: form.value.ipconfig,
    };
};

const getColor = (type) => {
    switch (type) {
        case "GET":
            return "#409EFF";
        case "POST":
            return "#67C23A";
        case "PUT":
            return "#E6A23C";
        case "DELETE":
            return "#F56C6C";
        case "PATCH":
            return "#909399";
        default:
            return "#909399";
    }
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


.proxy-name {
    font-size: 16px;
}

.proxy-card {
    margin-top: 10px;
}

.proxy_btn {
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

.search-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}


.rightMenu {
    height: 100%;
    width: 35%;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 9;
    background-color: white;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    align-items: center;
    margin-top: 20px;
}

.text_container {
    width: 85%;
    margin: 10px;
}

.text_container .title-row {
    margin-bottom: 10px;
}

.content-card {
    padding: 5px;
    height: 250px;
    background-color: #f9f9f9;
}

.back-btn {
    position: absolute;
    top: 5px;
    left: 5px;
    z-index: 10;
    /* 确保按钮在其他元素之上 */
}
</style>