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
            <el-col :span="12">
                <el-form-item label="选择查看的代理">
                    <el-select v-model="reportid" placeholder="请选择代理" @change="handleProxyChange">
                        <el-option v-for="proxy in proxyList" :key="proxy.id" :label="proxy.name" :value="proxy.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <div class="search-bar">
                <el-input v-model="searchKeyword" placeholder="搜索API" clearable @clear="clearSearch()" />
                <el-button type="primary" @click="handleSearch">
                    搜索
                </el-button>
            </div>
            <el-table :data="showAPIData" stripe border>
                <el-table-column prop="method" label="类型" width="100px">
                    <template #default="{ row }">
                        <el-button disabled
                            :style="{ 'background-color': getColor(row.method), 'color': 'white', width: '100%' }">
                            {{ row.method }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="url" label="API地址" />
                <el-table-column prop="edit" label="编辑" width="100px">
                    <template #default="{ row }">
                        <el-button type="text" @click="handleEdit(row)">
                            Edit
                        </el-button>
                    </template>
                </el-table-column>
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
            <el-form :model="form" :rules="newrules" label-width="120px" ref="newformRef">
                <el-form-item hidden v-model="form.id"></el-form-item>
                <el-form-item label="代理名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="服务地址与端口" prop="ipconfig">
                    <el-input v-model="form.ipconfig" placeholder="请输入服务地址与端口(格式ip:port)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">新建</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改代理" v-model="editdialogVisible" width="50%">
            <el-form :model="form" :rules="updaterules" label-width="120px" ref="updateformRef">
                <el-form-item hidden v-model="form.id"></el-form-item>
                <el-form-item label="代理名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="服务地址与端口" prop="ipconfig">
                    <el-input v-model="form.ipconfig" placeholder="请输入服务地址与端口(格式ip:port)"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editdialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editForm">修改</el-button>
            </div>
        </el-dialog>
        <div class="rightMenu" v-if="flowMenu">
            <el-button class="back-btn" icon="ArrowLeft" @click="goBack()" circle></el-button>
            <el-row class="title_container">
                <el-col :span="24">
                    <div class="title-row">
                        <h3>流量数据</h3>
                    </div>
                </el-col>
            </el-row>
            <div class="api_info">
                <p>代理名称: {{ flowDatas[0].proxy }}</p>
                <p>请求方法:
                    <el-button disabled
                        :style="{ 'background-color': getColor(flowDatas[0].method), 'color': 'white' }">
                        {{ flowDatas[0].method }}
                    </el-button>
                </p>
            </div>
            <el-table :data="flowDatas" style="width: 85%;" border>
                <el-table-column prop="url" label="请求地址"></el-table-column>
                <el-table-column prop="traffic_data" label="详细信息">
                    <template #default="scope">
                        <el-button type="text" @click="showDetails(scope.row)">{{ scope.row.traffic_data }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog v-model="detailDialog" title="详细信息">
                <div>
                    <h3>Head</h3>
                    <el-input type="textarea" v-model="detailData.head" readonly></el-input>
                    <h3>Body</h3>
                    <el-input type="textarea" v-model="detailData.body" readonly></el-input>
                    <h3>Status Code</h3>
                    <el-input type="textarea" v-model="detailData.status_code" readonly></el-input>
                </div>
            </el-dialog>
        </div>
        <div class="rightMenu" v-if="editAPI">
            <el-button class="back-btn" icon="ArrowLeft" @click="goBack()" circle></el-button>
            <el-row class="title_container">
                <el-col :span="24">
                    <div class="title-row">
                        <h3>编辑API</h3>
                    </div>
                </el-col>
            </el-row>
            <el-form :model="editAPIForm" :rules="editAPIRule" ref="editAPIFormRef" style="width: 85%;">
                <el-form-item hidden v-model="editAPIForm.id"></el-form-item>
                <el-form-item label="API地址" prop="url">
                    <el-input v-model="editAPIForm.url" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="API方法" prop="method" style="width: 50%;">
                    <el-select v-model="editAPIForm.method" placeholder="请选择">
                        <el-option v-for="item in methodList" :key="item.value" :label="item.label" :value="item.value">
                            <el-button disabled :style="{ 'background-color': getColor(item.label), 'color': 'white' }">
                                {{ item.label }}
                            </el-button></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="editAPI = false">取消</el-button>
                <el-button type="primary" @click="editAPIFormSubmit()">修改</el-button>
            </div>
        </div>
    </div>
</template>

<script setup name="Detect">
import { onMounted, ref } from "vue";
import axios from 'axios';
import { ElMessage } from 'element-plus';
// 配置axios的baseURL
axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/916474-2385209-default';
const newdialogVisible = ref(false);
const editdialogVisible = ref(false);
const searchKeyword = ref("");
const reportid = ref("");
const flowMenu = ref(false);
const editAPI = ref(false);
const detailDialog = ref(false);
const flowDatas = ref([
]);
const newrules = ref({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ],
    ipconfig: [
        { required: true, message: '请输入IP配置', trigger: 'blur' },
    ],
});
const updaterules = ref({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
    ],
    ipconfig: [
        { required: true, message: '请输入IP配置', trigger: 'blur' },
    ],
});

const editAPIRule = ref({
    url: [
        { required: true, message: '请输入API地址', trigger: 'blur' },
    ],
    method: [
        { required: true, message: '请选择API方法', trigger: 'blur' },
    ],
});
const handleSearch = () => {
    filterAPIData();
};
const APIData = ref([
])

const showAPIData = ref([
])

const handleEdit = (row) => {
    console.log("编辑", row);
    editAPI.value = true;
    editAPIForm.value = {
        id: row.id,
        url: row.url,
        method: row.method,
    }
};
const handleView = (row) => {
    console.log("查看", row);
    flowMenu.value = true;
    viewFlows(row.id);
};

const goBack = () => {
    flowMenu.value = false
    editAPI.value = false
}


const form = ref({
    id: "",
    name: "",
    description: "",
    ipconfig: "",
});


const editAPIForm = ref({
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
    deleteProxyData(id)
};

const newformRef = ref(null);
const editAPIFormRef = ref(null);
const submitForm = () => {
    newformRef.value.validate((valid) => {
        if (valid) {
            console.log('提交表单', form.value);
            // 调用上传数据的方法
            uploadProxyData();
            newdialogVisible.value = false;
        } else {
            ElMessage.error('信息不完整');
            return false;
        }
    });

};

const updateformRef = ref(null);
const editForm = () => {
    updateformRef.value.validate((valid) => {
        if (valid) {
            console.log("修改表单");
            const index = proxyList.value.findIndex((item) => item.id.toString() == form.value.id.toString());
            let hasChanged = false
            if (proxyList.value[index].name !== form.value.name || proxyList.value[index].description !== form.value.description || proxyList.value[index].ipconfig !== form.value.ipconfig) {
                hasChanged = true
            }
            // 修改数据
            if (hasChanged) {
                updateProxyData()
            } else {
                ElMessage.warning('数据未修改')
            }
            editdialogVisible.value = false;
        } else {
            ElMessage.error('信息不完整');
            return false;
        }
    });
};

const editAPIFormSubmit = () => {
    editAPIFormRef.value.validate((valid) => {
        if (valid) {
            console.log("修改API表单");
            // 调用修改API的方法
            updateAPI()
            editAPI.value = false
        } else {
            ElMessage.error('信息不完整');
            return false;
        }
    });
};

const detailData = ref({
    head: '',
    body: '',
    status_code: ''
});
const showDetails = (row) => {
    // TODO 获取详细数据
    detailData.value = {
        head: "Head",
        body: "Body",
        status_code: "Status Code"
    };
    detailDialog.value = true;
};

const handleProxyChange = () => {
    console.log("proxy change")
    fetchAPIS()
}

const methodList = ref([
    { label: "GET", value: "GET" },
    { label: "POST", value: "POST" },
    { label: "PUT", value: "PUT" },
    { label: "DELETE", value: "DELETE" },
    { label: "PATCH", value: "PATCH" },
])
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

const filterAPIData = () => {
    if (searchKeyword.value === "") {
        ElMessage.warning("请输入搜索关键字")
        showAPIData.value = APIData.value
        return
    } else {
        showAPIData.value = APIData.value.filter((item) =>
            item.url.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
            item.method.toLowerCase().includes(searchKeyword.value.toLowerCase())
        );
    }
}
const clearSearch = () => {
    showAPIData.value = APIData.value
    searchKeyword.value = ""
}

const fetchProxyList = async () => {
    axios.get('/APIFind/proxies/').then(response => {
        if (response.status === 200) {
            proxyList.value = response.data;
        }
    }).catch(error => {
        if (error.status === 500) {
            ElMessage.error("服务器出现错误");
        } else {
            ElMessage.error("获取代理列表失败");
        }
    });
};

const uploadProxyData = async () => {
    axios.post('/APIFind/proxies/create/', {
        name: form.value.name,
        description: form.value.description,
        ipconfig: form.value.ipconfig,
    }).then(response => {
        console.log(response);
        if (response.status === 200) {
            if (response.data.proxy_id) {
                proxyList.value.push({
                    id: response.data.proxy_id,
                    name: form.value.name,
                    description: form.value.description,
                    ipconfig: form.value.ipconfig,
                });
                ElMessage.success("创建代理成功");
            } else {
                ElMessage.error("创建代理失败，服务器返回数据不完整");
            }
        }
    }).catch(error => {
        if (error.status == 404) {
            ElMessage.error("删除代理失败，代理不存在");
        } else if (error.status === 500) {
            ElMessage.error("删除代理失败，服务器出现错误");
        }
    });
};

const updateProxyData = async () => {
    axios.put('/APIFind/proxies/' + form.value.id + '/', {
        name: form.value.name,
        description: form.value.description,
        ipconfig: form.value.ipconfig,
    }).then(response => {
        if (response.status === 200) {
            const index = proxyList.value.findIndex((item) => item.id.toString() == form.value.id.toString());
            proxyList.value[index] = {
                id: form.value.id,
                name: form.value.name,
                description: form.value.description,
                ipconfig: form.value.ipconfig,
            };
            ElMessage.success("更新代理成功");
        }
    }).catch(error => {
        console.log(error)
    });
};

const deleteProxyData = async (id) => {
    axios.delete('/APIFind/proxies/' + id + '/delete/').then(response => {
        if (response.status === 200) {
            proxyList.value = proxyList.value.filter((item) => item.id !== id);
            console.log(reportid.value)

            if (reportid.value == id || reportid.value == false) {
                reportid.value = null
            }
            ElMessage.success("删除代理成功");
        }
    }).catch(error => {
        if (error.status == 404) {
            ElMessage.error("删除代理失败，代理不存在");
        } else if (error.status === 500) {
            ElMessage.error("删除代理失败，服务器出现错误");
        }
    });
}

const fetchAPIS = async () => {
    axios.get('/APIFind/proxies/' + reportid.value + '/apis/').then(response => {
        if (response.status === 200) {
            console.log(response.data)
            APIData.value = response.data;
            showAPIData.value = response.data;
        }
    }).catch(error => {
        if (error.status == 404) {
            ElMessage.error("获取代理列表失败，代理不存在");
        }
        else if (error.status === 500) {
            ElMessage.error("获取代理列表失败，服务器出现错误");
        }
    });

}

const viewFlows = async (id) => {
    axios.get('/APIFind/apis/' + id + '/flows/').then(response => {
        if (response.status === 200) {
            console.log(response.data)
            flowDatas.value = response.data;
        }
    }).catch(error => {
        if (error.status == 404) {
            ElMessage.error("未找到API Endpoint");
        }
        else if (error.status === 500) {
            ElMessage.error("获取代理列表失败，服务器出现错误");
        }
    });
}

const updateAPI = async () => {
    axios.put('/APIFind/apis/' + editAPIForm.value.id + '/', {
        url: editAPIForm.value.url,
        method: editAPIForm.value.method,
    }).then(response => {
        if (response.status === 200) {
            const index = APIData.value.findIndex((item) => item.id.toString() == editAPIForm.value.id.toString());
            APIData.value[index] = {
                id: editAPIForm.value.id,
                url: editAPIForm.value.url,
                method: editAPIForm.value.method,
            };
            ElMessage.success("更新API成功");
        }
    }).catch(error => {
        if (error.status == 404) {
            ElMessage.error("更新API失败，API不存在");
        } else if (error.status === 500) {
            ElMessage.error("更新API失败，服务器出现错误");
        }
    });
}

onMounted(() => {
    fetchProxyList();
});
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

.title_container {
    margin-left: 5px;
    margin-bottom: 10px;
    width: 100%;
}

.back-btn {
    position: absolute;
    z-index: 10;
    left: 10px;
}

.title-row {
    text-align: center;
}

.api_info {
    text-align: left;
    /* 确保文字左对齐 */
    width: 85%;
    margin: 10px;
}
</style>