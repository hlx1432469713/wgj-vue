<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
        <el-form :inline="true">
            <el-form-item>
                <el-input placeholder="车辆牌照" v-model="carNumber"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="locateCar">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    
    <el-col :span="24" class="toolbar">
        <div class="amap-page-container">
            <el-amap vid="amapDemo" :zoom="zoom" :center="center" :map-manager="AMapManager" :events="events" class="amap-demo" :plugin="plugin">
                
                <!-- <el-amap-marker :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable"></el-amap-marker> -->
                <!-- <el-amap-circle :center="circle.center" :radius="circle.radius" :fillOpacity="circle.fillOpacity" :events="circle.events" :strokeColor="circle.strokeColor" :strokeStyle="circle.strokeStyle" :fillColor="circle.fillColor"></el-amap-circle> -->
                <el-amap-marker :key="index" v-for="(carMarker, index) in carMarkers" :position="carMarker.position" 
                :events="carMarker.events" :visible="carMarker.visible" :icon="carMarker.icon" :draggable="carMarker.draggable" :vid="index"></el-amap-marker>
                <el-amap-info-window v-for="(carMarker, index) in carMarkers" 
                :position="carMarker.mywindow.position" :content="carMarker.mywindow.content" 
                :visible="carMarker.mywindow.visible" :events="carMarker.mywindow.events" :vid="index"></el-amap-info-window>
            </el-amap>
        </div>
    </el-col>
  </section>
</template>


<script>
import { AMapManager } from 'vue-amap';
import {getAllCarLocation, getCarInfoByCarNumber,getTrafficSituation} from '../../../api/api';

export default {

    data () {
        return {
            carNumber: "",
            zoom: 15,
            center: [121.5273285, 31.21515044],
            carLocList: [],
            core:[],
            location2:[],
            carMarkers: [
                // position: [121.5273285, 31.21515044],
                // events: {
                //     click: () => {
                //         alert('click marker');
                //     },
                //     dragend: (e) => {
                //         console.log('---event---: dragend')
                //         this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
                //     }
                // },
                // visible: true,
                // draggable: false,
                // template: '<span>1</span>',
                // icon: '/static/mapCar.png'
            ],
            mywindows: [
            ],
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
                
            }
        }
    },
    beforeMount() {
        console.log(this.traceArr)
        
    },
    methods: {
        getListIng: function () {
            getTrafficSituation().then((res) => {
                this.core = res.result.cores;
                console.log(this.core);
                if (this.core.length > 50 && this.core.length<100 ) {
                    this.$notify.info({
                        title: '车辆聚集黄色警告',
                        message: '警告！有超过50辆上岗车辆聚集！！！',
                        duration: 0,
                        type: 'warning'
                    });
                    let location1 = this.core[0];
                    this.location2[0] = parseFloat(location1[0])
                    this.location2[1] = parseFloat(location1[1])
                    console.log(   this.location2[0]);
                    console.log(   this.location2[1]);
                    let light = {
                        position:   this.location2,
                        icon: '/static/一.png',
                        events: {
                            click: () => {
                                // for(let carMarker of this.carMarkers)
                                // {
                                //     carMarker.mywindow.visible = false
                                // }
                                light.mywindow.visible = true

                                console.log(light.mywindow.visible, "hhahahah")
                            }
                        },
                        mywindow: {
                            position:  this.location2,
                            content: `<h4>聚集黄灯警告</h4>`,
                            visible: false,
                            events: {
                                // close () {
                                //     this.mywindow.visible = false
                                // }
                            }
                        }
                    };
                    this.carMarkers.push(light);
                    this.center = this.location2
                }
                else if (this.core.length >= 100) {
                    this.$notify.info({
                        title: '车辆聚集红色警告',
                        message: '警告！有超过100辆上岗车辆聚集！！！',
                        duration: 0,
                        type: 'warning'
                    });
                    let location1 = this.core[0];
                    this.location2[0] = parseFloat(location1[0])
                    this.location2[1] = parseFloat(location1[1])
                    console.log(   this.location2[0]);
                    console.log(   this.location2[1]);
                    let light = {
                        position:   this.location2,
                        icon: '/static/二.png',
                        events: {
                            click: () => {
                                // for(let carMarker of this.carMarkers)
                                // {
                                //     carMarker.mywindow.visible = false
                                // }
                                light.mywindow.visible = true

                                console.log(light.mywindow.visible, "hhahahah")
                            }
                        },
                        mywindow: {
                            position:  this.location2,
                            content: `<h4>聚集红灯警告</h4>`,
                            visible: false,
                            events: {
                                // close () {
                                //     this.mywindow.visible = false
                                // }
                            }
                        }
                    };
                    this.carMarkers.push(light);
                    this.center = this.location2
                }
            });

        },

        addMarker(item) {
            let location = item.driverInfo.driverLocation.split(",")
            location[0] = parseFloat(location[0])
            location[1] = parseFloat(location[1])
            let carMarker = {
                position: location,
                icon: '/static/mapCar.png',
                events: {
                    click: () => {
                        for(let carMarker of this.carMarkers){carMarker.mywindow.visible = false}
                        carMarker.mywindow.visible = true
                    
                        console.log(carMarker.mywindow.visible, "hhahahah")
                    }
                },
                mywindow: {
                    position: location,
                    content: `<h4>车辆牌照:${item.carInfo.carNumber}</h4>`,
                    visible: false,
                    events: {
                        // close () {
                        //     this.mywindow.visible = false
                        // }
                    }
                }
            };
            this.carMarkers.push(carMarker);
        },
        locateCar () {
            if (this.carNumber == '' || this.carNumber == null) {
                this.$notify({
                    title: '失败',
                    message: `车牌号为空，查询失败！,`,
                    type: 'error'
                });
            }
            else{
            let param = {
                carNumber: this.carNumber
            }
            getCarInfoByCarNumber(param).then(res => {
                if (res.status === 1) {
                    console.log(res.result)
                    if(res.result.driverInfo != null) {
                        for (let item of this.carLocList) {
                            if (item.carInfo.carId === res.result.carInfo.carId) {
                                let location = item.driverInfo.driverLocation.split(",")
                                location[0] = parseFloat(location[0])
                                location[1] = parseFloat(location[1])
                                this.center = location
                            }
                        }
                    }
                    else
                    {
                        this.$notify({
                            title: '失败',
                            message: `未查询到车牌号为 [${this.carNumber}]的司机上岗`,
                            type: 'error'
                        });
                    }

                } else {
                    this.$notify({
                        title: '失败',
                        message: `未查询到车牌号 [${this.carNumber}] 位置信息`,
                        type: 'error'
                    });
                }
            })
        }
        },
    open11(){
        getAllCarLocation().then(res => {
            if(res.status === 1){
                this.carLocList = res.result
                console.log(res.result)
                for(let item of res.result){
                    // let location = res.result[i].driverLocation.split(", ")
                    // location[0] = parseFloat(location[0])
                    // location[1] = parseFloat(location[1])
                    this.addMarker(item)
                }

                // let _this = this
                // this.events = {
                //     init(map) {
                //         console.log("!!!",map.getCenter())
                //         AMapUI.loadUI(['overlay/SimpleMarker'], function(SimpleMarker) {
                //             const marker = new SimpleMarker({
                //                 iconLabel: 'A',
                //                 iconStyle: 'red',
                //                 map: map,
                //                 position: location,
                //             });
                //         });

                //     }
                // }
            }
        })

    }
    },
    mounted() {
        this.open11();
        this.getListIng();
        setInterval(this.getListIng,1000*60*5);
        setInterval(this.open11,1000*60);//一分钟刷新一次车辆位置
        // setInterval(this.getListIng,1000*60*15);//s*1000//15分钟去获取一次 车辆聚集情况

    }
    
}
  </script>
<style>
  .amap-page-container {
    height: 600px;
  }
</style>

