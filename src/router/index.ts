import { createRouter, createWebHistory } from 'vue-router'
import DetectDoc from '@/components/DetectDoc.vue'
import CheckList from '@/components/CheckList.vue'
import Detect from '@/components/Detect.vue'
import APIAnalysis from '@/components/APIAnalysis.vue'
import APIFind from '@/components/APIFind.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/apifind'
        },
        {
            path: '/apifind',
            name: 'apifind',
            component: APIFind
        },
        {
            path: '/apianalysis',
            name: 'apianalysis',
            component: APIAnalysis
        },
        {
            path: '/detect',
            name: 'detect',
            component: Detect,
        },
        {
            path: '/detectdoc',
            name: 'detectdoc',
            component: DetectDoc,
        },
        {
            path: '/checklist',
            name: 'checklist',
            component: CheckList
        }
    ],
})

export default router
