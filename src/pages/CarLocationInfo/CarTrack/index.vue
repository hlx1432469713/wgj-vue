<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            
            <el-form-item label="起始时间(时间和日期都要选)">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期" v-model="trackDate.startYmd" style="width: 100%;" ></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间" v-model="trackDate.startHms" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item><br>
            <el-form-item label="结束时间(时间和日期都要选)">
                <el-col :span="11">
                    <el-date-picker type="date" placeholder="选择日期"  v-model="trackDate.endYmd" style="width: 100%;"></el-date-picker>
                </el-col>
                <el-col class="line" :span="2">&nbsp;&nbsp;&nbsp;&nbsp;-</el-col>
                <el-col :span="11">
                    <el-time-picker type="fixed-time" placeholder="选择时间"  v-model="trackDate.endHms" style="width: 100%;"></el-time-picker>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="车辆牌照" v-model="carNumber"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="traceCar">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    
    <el-col :span="24" class="toolbar">
        <div class="amap-page-container">
        <el-amap vid="amapDemo" :zoom="zoom" :center="center" :map-manager="AMapManager" :events="events" class="amap-demo" :plugin="plugin">

        </el-amap>
        </div>
    </el-col>
  </section>
</template>


<script>
    import { AMapManager } from 'vue-amap';
	import { getLocationInfoByDate } from '../../../api/api';
	import { formatDate } from '../../../common/util'

export default {

    data () {
        return {
            zoom: 15,
            center: [121.5273285, 31.21515044],
            plugin: {
                pName: 'Scale',
                events: {
                    init (instance) {
                    console.log(instance)
                    }
                }
            },
            AMapManager,
            traceArr: [1,2,3],
            events: {
                
            },
            trackDate: {
                startYmd: null,
                startHms: null,
                endYmd: null,
                endHms: null
            },
            carNumber: "",
            orderList: [],
            trackData: [],
            navgList: [],
            pathSimplifierIns: null
        }
    },
    methods: {
        /*
            后台返回经纬度和日期数组
         */
        traceCar () {
            for(let o in this.trackDate){
                if(this.trackDate[o] == null|| this.trackDate[o] == ''){
                    this.$notify({
                        title: '失败',
                        message: `请选择时间`,
                        type: 'error'
                    });
                    return
                }
            }
            // var start ='';
            // var end ='';
            // if(this.trackDate.startYmd!=null&&this.trackDate.startYmd!=''&&this.trackDate.startHms!=''&&this.trackDate.startHms!=null&&
            //     this.trackDate.endYmd!=null&&this.trackDate.endYmd!=''&&this.trackDate.endHms!=''&&this.trackDate.endHms) {
                let start = this.formatDate(this.trackDate.startYmd, 0) + " " + this.formatDate(this.trackDate.startHms, 1)

               let end = this.formatDate(this.trackDate.endYmd, 0) + " " + this.formatDate(this.trackDate.endHms, 1)
            // }
            // else
            // {
            //     start ='';
            //      end ='';
            // }
            let param = {
                startTime: start,
                endTime: end,
                carNumber: this.carNumber
            }
            console.log(param.startTime, param.endTime)
            getLocationInfoByDate(param).then(res => {
                if(res.status === 1){
                    // 清除动画
                    this.pathSimplifierIns = null
                    window.pathSimplifierIns = null
                    let _this = this
                    if(this.trackData != []){
                        if(this.navgList != []){
                            // console.log()
                            for(let item of this.navgList){
                                console.log("djsadasjdkasjl",this.navg)
                                item.destroy()

                                // item.start()
                            }
                        }
                    }
                    let orderList = res.result
                    this.orderList = orderList

                    let pathArr = [], data = []
                    for(let i in orderList){
                        pathArr = []
                        let a = orderList[i].locationInfo
                        let locArr =  a.split("-") // ["111.22,22.11","111.22,22.11"]形式
                        console.log(locArr)
                        for(let loc of locArr){
                            let splitedLoc = loc.split(",")//["111.22","22.11"]形式
                            splitedLoc[0] = parseFloat(splitedLoc[0])
                            splitedLoc[1] = parseFloat(splitedLoc[1])
                            splitedLoc.push(i)
                            pathArr.push(splitedLoc)
                        }
                        data.push({
                            name: `订单ID:${orderList[i].orderId}  司机ID：${orderList[i].driverId}`,
                            path: pathArr
                        })
                    
                    }
                    this.trackData = data
                    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {



                        if (!PathSimplifier.supportCanvas) {
                            alert('当前环境不支持 Canvas！');
                            return;
                        }

                        _this.pathSimplifierIns = new PathSimplifier({
                            zIndex: 100,
                            //autoSetFitView:false,
                            map: window.amap, //所属的地图实例

                            getPath: function(pathData, pathIndex) {

                                return pathData.path;
                            },
                            getHoverTitle: function(pathData, pathIndex, pointIndex) {
                                console.log(pathData, pathIndex, pointIndex)
                                if (pointIndex === 0){
                                    // pathData.path
                                    return "起点";
                                }
                                if (pointIndex > 0) {
                                    //point 
                                    return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
                                }

                                return pathData.name + '，点数量' + pathData.path.length;
                            },
                            renderOptions: {

                                renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                            }
                        });

                        window.pathSimplifierIns = _this.pathSimplifierIns;

                        //设置数据
                        _this.pathSimplifierIns.setData(_this.trackData);

                        for(let i in _this.trackData){

                            //对第一条线路（即索引 0）创建一个巡航器
                            let navg = _this.pathSimplifierIns.createPathNavigator(i, {
                                loop: true, //循环播放
                                speed: 300, //巡航速度，单位千米/小时
                                pathNavigatorStyle: {
                                    width: 16,
                                    height: 32,
                                    content: PathSimplifier.Render.Canvas.getImageContent('/static/mapCar.png', onload, onerror),
                                    strokeStyle: null,
                                    fillStyle: null
                                }
                            });
                            _this.navgList.push(navg)
                            navg.start();
                        }
                        
                    
                    });
                    // console.log("轨迹数组：",pathArr)
                }
            })


            // let trackArr = [
            //     [106.405289, 39.904987],
            //     [103.964458, 40.54664],
            //     [101.47836, 41.135964],
            //     [108.949297, 41.670904],
            //     [106.380111, 42.149509],
            //     [103.774185, 42.56996],
            //     [101.135432, 42.930601],
            //     [78.46826, 43.229964],
            //     [65.777529, 43.466798],
            //     [43.068486, 43.64009],
            //     [90.34669, 43.749086],
            //     [87.61792, 43.793308]
            // ]
            
        

        },
        formatDate (date, flag) {
            if(flag===0){//格式化年月日
                var date = new Date(date);
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                let d = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
                return `${y}-${m}-${d}`
            }else{//格式化时分秒
                var date = new Date(date);
                let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours()
                let m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                let s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                return `${h}:${m}:${s}`
            }
        },
    },
    beforeMount () {
        console.log(this.traceArr)
        
    },
    mounted() {
        this.traceArr = [
            [116.405289, 39.904987],
            [113.964458, 40.54664],
            [111.47836, 41.135964],
            [108.949297, 41.670904],
            [106.380111, 42.149509],
            [103.774185, 42.56996],
            [101.135432, 42.930601],
            [98.46826, 43.229964],
            [95.777529, 43.466798],
            [93.068486, 43.64009],
            [90.34669, 43.749086],
            [87.61792, 43.793308]
        ]
        let _this = this
        this.events = { 
            init(map) {
                window.amap = map
            }
        }
    },
}
</script>
<style>
  .amap-page-container {
    height: 600px;
  }
</style>

