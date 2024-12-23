<template>
    <div>
        <!-- Filter Section -->
        <el-row :gutter="20" class="chooser">
            <el-col :span="6">
                <el-form-item label="选择查看的报告">
                    <el-select v-model="report" placeholder="1">
                        <el-option label="1" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="攻击类别">
                    <el-select v-model="attackType" placeholder="1">
                        <el-option label="1" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="时间">
                    <el-date-picker v-model="time" type="daterange" range-separator="To" start-placeholder="开始日期"
                        end-placeholder="结束日期" />
                </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item label="API 端点">
                    <el-select v-model="apiEndpoint" placeholder="1">
                        <el-option label="1" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-divider />
        <!-- Summary Section -->
        <div id="summary">
            <el-row :gutter="40" class="summary">
                <el-col :span="12">
                    <div class="summary-box">
                        <p>攻击流量:</p>
                        <br />
                        <h1>{{ attack_stream }}条</h1>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="summary-box">
                        <p>受攻击的 API:</p>
                        <br>
                        <h1>{{ attacked_api_count }}个</h1>
                    </div>
                </el-col>
            </el-row>
            <div id="pie-chart" style="width: 400px; height: 200px;"></div>
            <div id="btn-container">
                <el-button type="primary">
                    下载报告<el-icon class="el-icon--right">
                        <Download />
                    </el-icon>
                </el-button>
            </div>
        </div>

        <!-- Attack Data Table -->
        <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="ip" label="IP" width="180"></el-table-column>
            <el-table-column prop="url" label="url" width="300"></el-table-column>
            <el-table-column prop="attackType" label="攻击类型"></el-table-column>
        </el-table>
        <div class="rightMenu" v-if="foldedState">
            <el-button class="back-btn" icon="ArrowLeft" @click="goBack()" circle></el-button>
            <el-table :data="itemData" style="width: 85%;">
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column prop="ip" label="IP"></el-table-column>
                <el-table-column prop="url" label="url"></el-table-column>
                <el-table-column prop="attackType" label="攻击类型"></el-table-column>
            </el-table>
            <div class="text_container">
                <!-- 错误原因 -->
                <el-row class="title-row" justify="start">
                    <el-col :span="24">
                        <el-tag type="danger" class="title">错误原因</el-tag>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <!-- 使用 el-card 显示错误原因 -->
                        <el-card class="content-card">
                            <div>{{ itemData[0].errorReason }}</div>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 建议 -->
                <el-row class="title-row" justify="start" style="margin-top: 20px;">
                    <el-col :span="24">
                        <el-tag type="success" class="title">建议</el-tag>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <!-- 使用 el-card 显示建议 -->
                        <el-card class="content-card">
                            <div>{{ itemData[0].suggestion }}</div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>
<script setup name="DetectDoc">
import { ref } from 'vue';
import { onMounted } from 'vue';
import * as echarts from 'echarts'

const report = ref('1');
const attackType = ref('1');
const time = ref([]);
const apiEndpoint = ref('1');
const attack_stream = ref(100);
const attacked_api_count = ref(10);
// 折叠状态
const foldedState = ref(false)
// Table Data
const tableData = ref([
    { date: '2024-12-01', ip: '192.168.0.1', url: '/api/v1/resource', attackType: 'SQL 注入' },
    // Additional data rows here...
]);

const itemData = ref([]);

const handleRowClick = (row) => {
    // 处理点击事件，row 是当前行的数据
    row.errorReason = 'SQL 注入攻击'
    row.suggestion = '请检查 SQL 注入攻击的防护策略'
    itemData.value = [row]
    foldedState.value = true
    console.log("当前行数据: ", row);
}

const goBack = () => {
    foldedState.value = false
}

onMounted(() => {
    // 获取 DOM 容器
    const chartDom = document.getElementById('pie-chart');
    const myChart = echarts.init(chartDom);

    // 配置饼图的选项
    const option = {
        title: {
            text: '攻击类型分布',
            left: 'center',
        },
        tooltip: {
            trigger: 'item',
        },
        legend: {
            orient: 'vertical',
            left: 'left',
        },
        series: [
            {
                name: '攻击类型',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: 1048, name: '注入' },
                    { value: 735, name: '越权' },
                    { value: 580, name: 'XSS' },
                    { value: 484, name: 'CSRF' },
                    { value: 300, name: 'DDoS' },
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                    },
                },
            },
        ],
    };

    // 渲染图表
    option && myChart.setOption(option);
});
</script>

<style scoped>
.summary {
    width: 50%;
}

.summary-box {
    text-align: center;
    border: 1px solid #e0e0e0;
    padding: 20px;
    height: 200px;
}

.summary-box p {
    font-size: large;
}

#summary {
    display: flex;
}

#pie-chart {
    margin-top: 20px;
    margin-left: 50px;
}

#btn-container {
    display: flex;
    align-items: center;
}

.rightMenu {
    height: 100%;
    width: 35%;
    position: fixed;
    right: 0;
    top: 0;
    z-index: 2;
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