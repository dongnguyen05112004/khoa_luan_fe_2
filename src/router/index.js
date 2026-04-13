import { createRouter, createWebHistory } from "vue-router"; // cài vue-router: npm install vue-router@next --save

const routes = [
    {
        path: '/',
        name: 'LandingPage',
        component: () => import('../components/home/LandingPage.vue'),
        meta: { layout: 'blank' },
    },
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

    ,
    {
        path: "/forgot-password",
        name: "ForgotPassword",
        component: () => import("../components/home/ForgotPassword.vue"),
        meta: { layout: "blank" },
    },

    {
        path: "/reset-password",
        name: "ResetPassword",
        component: () => import("../components/home/ResetPassword.vue"),
        meta: { layout: "blank" },
    },

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
                path: '/admin/quanlynguoidung',
                component: () => import('../components/admin/quanlynguoidung.vue'),
            },
            {
                path: '/admin/config',
                component: () => import('../components/admin/system_config.vue'),
            },
            {
                path: '/admin/nhat_ky',
                component: () => import('../components/admin/nhat_ky.vue'),
            }

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
            {
                path: '/nhanvien/ho_so',
                component: () => import('../components/nhanvien/ho_so.vue'),
            },
            {
                path: '/nhanvien/quanlyhoivien',
                component: () => import('../components/nhanvien/quanlyhoivien.vue'),
            },
            {
                path: '/nhanvien/hop_dong',
                component: () => import('../components/nhanvien/hop_dong.vue'),
            },
            {
                path: '/nhanvien/checkin',
                component: () => import('../components/nhanvien/checkin.vue'),
            },
            {
                path: '/nhanvien/hoi_vien_moi',
                component: () => import('../components/nhanvien/hoi_vien_moi.vue'),
            },
            {
                path: '/nhanvien/thu_tien',
                component: () => import('../components/nhanvien/thu_tien.vue'),
            },
            {
                path: '/nhanvien/xuly_thanh_toan',
                component: () => import('../components/nhanvien/xuly_thanh_toan.vue'),
            },
            {
                path: '/nhanvien/caidat',
                component: () => import('../components/nhanvien/caidat.vue'),
            },

        ]
    },
    {
        path: '/quanly',
        component: () => import('../layout/wrapper/quanly.vue'),
        meta: { layout: "quanly" },
        children: [
            {
                path: '/quanly/baocao',
                component: () => import('../components/quanly/trungtambaocaothongke.vue'),
            },
            {
                path: '/quanly/goitap',
                component: () => import('../components/quanly/goi_tap.vue'),
            },
            {
                path: '/quanly/khuyenmai',
                component: () => import('../components/quanly/baocao/tab_khuyenmai.vue'),
            },
            {
                path: '/quanly/taikhoan',
                component: () => import('../components/quanly/tai_khoan.vue'),
            },
            {
                path: '/quanly/thietbi',
                component: () => import('../components/quanly/thietbi.vue'),
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