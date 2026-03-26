import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
     {
        path: "/dangnhap",
        component: () => import("../components/admin/dangnhap.vue"),
        meta: { layout: "blank" },
    }, 
    // {
    //     path: "/dangky",
    //     component: () => import("../components/dang/dangky.vue"),
    //     meta: { layout: "blank" },
    // }, 
    // {
    //     path: "/home",
    //     component: () => import("../components/trangchu/trangchu.vue"),
    //     meta: { layout: "blank" },
    // },
    
    
    {
        path: "/blank",
        component: () => import("../layout/wrapper/blank.vue"),
        meta: { layout: "blank" },
    },
    {
        path: '/admin', 
        component: () => import('../layout/wrapper/admin.vue'), 
        meta: { layout: "admin" },
        children: [
            {
                path: '/admin',
                component: () => import('../components/admin/admin.vue'),
            }, 
            {
                path: '/admin/quanlynguoidung',
                component: () => import('../components/admin/quanlynguoidung.vue'),
            }, 
            
            {
                path: '/admin/cus_mgr',
                component: () => import('../components/admin/cus_mgr.vue'),
            }, 
                
        ]
    },
    {
        path: '/nhanvien', 
        component: () => import('../layout/wrapper/nhanvien.vue'), 
        meta: { layout: "nhanvien" },
        children: [
             
            {
                path: '/nhanvien', 
                component: () => import('../components/nhanvien/nhanvien.vue'),
            }, 
        ]
    },
    {
        path: '/khachhang', 
        component: () => import('../layout/wrapper/khachhang.vue'), 
        meta: { layout: "khachhang" },
        children: [ 
            {
                path: '/chisosuckhoe', 
                component: () => import('../components/khachhang/chisosuckhoe.vue'),
            },
            {
                path: '/histori', 
                component: () => import('../components/khachhang/histori.vue'),
            },
            {
                path: '/tientrinhtapluyen', 
                component: () => import('../components/khachhang/tientrinhtapluyen.vue'),
            },
            {
                path: '/hosocanhan', 
                component: () => import('../components/khachhang/hosocanhan.vue'),
            }
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router