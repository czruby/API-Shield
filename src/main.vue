<template>
    <div class="common-layout full-screen">
        <el-container>
            <!-- Header -->
            <el-header id="index-header" height="50px">
                <img src="./assets/logo.png" alt="Logo" style="height: 40px;display: inline-block;"></img>
                <span style="margin-left:10px;font-size: 24px;">逆锋灵盾</span></el-header>

            <!-- Body Content -->
            <el-container>
                <!-- Sidebar Menu -->
                <el-aside width="250px" id="index-sidebar">
                    <el-menu default-active="4" class="index-aside" @open="handleOpen" @close="handleClose">
                        <el-menu-item index="1" @click="gotoRoute('apifind')">
                            <template #title>
                                <el-icon>
                                    <Search />
                                </el-icon>
                                <span>API发现</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="2" @click="gotoRoute('apianalysis')">
                            <template #title>
                                <el-icon>
                                    <DataAnalysis />
                                </el-icon>
                                <span>API分析</span>
                            </template>
                        </el-menu-item>
                        <el-menu-item index="3" @click="gotoRoute('detect')">
                            <template #title>
                                <el-icon>
                                    <WarnTriangleFilled />
                                </el-icon>
                                <span>异常流量监测</span>
                            </template>

                        </el-menu-item>
                        <el-menu-item index="4" @click="gotoRoute('detectdoc')"><template #title>
                                <el-icon>
                                    <Document />
                                </el-icon>
                                <span>检测报告</span>
                            </template></el-menu-item>
                        <el-menu-item index="5" @click="gotoRoute('checklist')">
                            <template #title>
                                <el-icon>
                                    <Checked />
                                </el-icon>
                                <span>检查清单</span>
                            </template>
                        </el-menu-item>
                    </el-menu>
                </el-aside>

                <!-- Main Content -->
                <el-main>
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script lang="ts" setup name="Main">
import { ref } from 'vue';
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
const router = useRouter()
const gotoRoute = (name: string) => {
    router.push({ name: name })
}

const handleOpen = () => {
    console.log('open');
};

const handleClose = () => {
    console.log('close');
};
</script>

<style scoped>
.full-screen {
    height: 100vh;
    width: 100vw;
    display: flex;
}

#index-header {
    background-color: white;
    color: black;
    text-align: left;
    display: flex;
    align-items: center;
    z-index: 1;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
}

#index-sidebar {
    background-color: white;
}

#index-main {
    background-color: #f7f8fa;
    padding: 20px;
}
</style>