<script setup>

import { getStudentCountDataApi, getStudentGenderDataApi } from '@/api/report_stu';
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';


// 統計數據對象
const dataList = ref([]);

// 獲取班級與對應人數
const getStuCount = async () => {

    const result = await getStudentCountDataApi()

    if (result.code) { // 成功
        // 取得後端回傳的兩個陣列
        const { clazzList: clazz, dataList: values } = result.data;

        // 清空之前的資料
        dataList.value = []

        // 將兩個陣列組合成物件陣列
        clazz.forEach((clazz, index) => {
            dataList.value.push({
                name: clazz,
                value: values[index].toString()
            })
        })
    } else { // 失敗
        ElMessage.error(result.msg);
    }
    console.log(dataList.value);
}

// 統計性別對象
const genderList = ref([]);

// 獲取性別對應人數
const getGender = async () => {
    const result = await getStudentGenderDataApi();

    if (result.code) { // 成功
        genderList.value = result.data;
    } else { // 失敗
        ElMessage.error(result.msg);
    }
}

// 獲取統計圖表
const getCharts = () => {
    // 初始化 ECharts 圖表
    const myChart = echarts.init(document.getElementById('myChart-container'));
    const chart = echarts.init(document.getElementById('chart-container'));

    // 配置圖表
    myChart.setOption({
        title: {
            text: '班級人數統計'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {},
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: dataList.value.map(item => item.name)
        },
        series: [
            {
                name: '人數',
                type: 'bar',
                data: dataList.value.map(item => item.value)
            }
        ]
    },
        chart.setOption({
            title: {
                text: '學生性別統計'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: '人數',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: genderList.value[0].value, name: genderList.value[0].name },
                        { value: genderList.value[1].value, name: genderList.value[1].name }
                    ]
                }
            ]
        })
    )
}

onMounted(async () => {
    await getStuCount();
    await getGender();
    getCharts();
})

</script>

<template>
    <div id="myChart-container" style="width: 100%; height: 700px; margin: 30px;"></div>
    <div id="chart-container" style="width: 100%; height: 700px;"></div>
</template>

<style scoped></style>
