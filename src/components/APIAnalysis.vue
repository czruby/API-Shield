<template>
    <div>
        <!-- 上方选择框 -->
        <div class="filters">
            <el-row gutter="20">
                <!-- 代理选择框 -->
                <el-col :span="12">
                    <el-select v-model="selectedProxy" placeholder="请选择代理" style="width: 50%;">
                        <el-option v-for="proxy in proxies" :key="proxy.value" :label="proxy.label"
                            :value="proxy.value"></el-option>
                    </el-select>
                </el-col>

                <!-- 日期选择框 -->
                <el-col :span="12">
                    <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期"
                        style="width: 50%;"></el-date-picker>
                </el-col>
            </el-row>
        </div>

        <div id="trafficChart" style="height: 300px;width: 100%;"></div>
        <div id="responseTimeChart" style="height: 300px;width: 100%;"></div>
    </div>
</template>

<script setup name="APIAnalysis">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

// 代理选择框和日期选择框的数据
const proxies = ref([
    { label: '代理1', value: 'proxy1' },
    { label: '代理2', value: 'proxy2' },
    { label: '代理3', value: 'proxy3' },
]);
const selectedProxy = ref('');
const selectedDate = ref(null);

// 假设的流量和响应时间数据
const trafficData = ref([
    { time: '00:00', value: 50 },
    { time: '01:00', value: 75 },
    { time: '02:00', value: 60 },
    { time: '03:00', value: 90 },
    { time: '04:00', value: 120 },
    { time: '05:00', value: 110 },
]);

const responseTimeData = ref([
    { time: '00:00', value: 100 },
    { time: '01:00', value: 200 },
    { time: '02:00', value: 150 },
    { time: '03:00', value: 220 },
    { time: '04:00', value: 300 },
    { time: '05:00', value: 250 },
]);

// ECharts 配置
const renderChart = () => {
    const trafficChartDom = document.getElementById('trafficChart');
    const responseTimeChartDom = document.getElementById('responseTimeChart');
    const trafficChart = echarts.init(trafficChartDom);
    const responseTimeChart = echarts.init(responseTimeChartDom);

    const trafficOption = {
        title: { text: '流量' },
        xAxis: {
            type: 'category',
            data: trafficData.value.map(item => item.time),
        },
        yAxis: {
            type: 'value',
            name: '流量',
        },
        series: [
            {
                data: trafficData.value.map(item => item.value),
                type: 'line',
                smooth: true,
                color: '#409EFF',
            },
        ],
    };

    const responseTimeOption = {
        title: { text: '响应时间' },
        xAxis: {
            type: 'category',
            data: responseTimeData.value.map(item => item.time),
        },
        yAxis: {
            type: 'value',
            name: '响应时间 (ms)',
        },
        series: [
            {
                data: responseTimeData.value.map(item => item.value),
                type: 'line',
                smooth: true,
                color: '#67C23A',
            },
        ],
    };

    // 渲染图表
    trafficChart.setOption(trafficOption);
    responseTimeChart.setOption(responseTimeOption);
};

// 在组件挂载后初始化图表
onMounted(() => {
    renderChart();
});

</script>

<style scoped>
.filters {
    margin-bottom: 20px;
}

.charts {
    margin-top: 20px;
}
</style>