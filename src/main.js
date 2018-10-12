import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'
import Login from './pages/Login.vue'
import Home from './pages/Home.vue'
import LogInfo from './pages/LogInfo/LogInfo.vue'
import DriverInfo from './pages/DriverInfo/driver.vue'
import CarLocation from './pages/CarLocationInfo/CarLocation/index.vue'
import CarTrack from './pages/CarLocationInfo/CarTrack/index.vue'
import AdminGroup from './pages/AdminInfo/AdminGroup/AdminGroup.vue'
import AdminInfo from './pages/AdminInfo/index.vue'
import CarManage from './pages/CarManage/index.vue'
import OrderList from './pages/OrderManage/OrderList/index.vue'
import OrderComplaint from './pages/OrderManage/OrderComplaint/index.vue'
import OrderStatistics from './pages/OrderManage/OrderStatistics/index.vue'
import echartsYear from './pages/charts/echartsYear.vue'
import echartsMonth from './pages/charts/echartsMonth.vue'
import index from './pages/charts/index.vue'

import AMap from 'vue-amap'
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: 'a4d5be4201b602022f2850dc370ef6f4',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0.11' // 版本号
})

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

NProgress.configure({ showSpinner: false });


const routes = [
    { path: '/', redirect: '/login' ,   hidden: true//不显示在导航中
    },
  {
    path: '/login',

    component: Login,
    hidden: true//不显示在导航中
  },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa fa-money',
        children: [
            { path: '/order/complaint', component: OrderComplaint, name: '投诉处理' },
            { path: '/order/list', component: OrderList, name: '订单检索' },

            // { path: '/order/statistics', component: OrderStatistics, name: '数据统计' }
        ]
    },

    {
    path: '/carManage',
    component: Home,
    name: '',
    iconCls: 'fa fa-cogs',
    leaf: true,//只有一个节点
    children: [
      { path: '/carManage', component: CarManage, name: '车辆管理', }
    ]
  },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/driver', component: DriverInfo, name: '司机管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        leaf: true,//只有一个节点
        iconCls: 'fa fa-reorder',//图标样式class
        children: [
            { path: '/logInfo', component: LogInfo, name: '日志管理' },

        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-users',
        //leaf: true,//只有一个节点
        children: [
            { path: '/adminInfo', component: AdminInfo, name: '人员管理' },
            // { path: '/adminGroup', component: AdminGroup, name: '分组管理' }
        ]
    },

  {
    path: '/',
    component: Home,
    name: '车辆定位',
    iconCls: 'fa fa-truck',
    children: [
      { path: '/CarLocation', component: CarLocation, name: '位置查询' },
      { path: '/CarTrack', component: CarTrack, name: '历史轨迹查询' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '服务报表',
    iconCls: 'fa fa-bar-chart',
    children: [
     // { path: '/echart', component: index, name: 'index' },
        { path: '/echartsMonth', component: echartsMonth, name: '月份统计报表' },
        // { path: '/echartsYear', component: echartsYear, name: '年份统计报表' }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')

