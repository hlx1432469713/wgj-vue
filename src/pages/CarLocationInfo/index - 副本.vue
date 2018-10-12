<template>
	<section>
<div class="m-map">
    <div class="search" v-if="placeSearch">
    <input type="text" placeholder="请输入关键字" v-model="searchKey">
    <button type="button" @click="handleSearch">搜索</button>
    <div id="js-result" v-show="searchKey" class="result"></div>
    </div>
    <div id="js-container" class="map"></div>
</div>    
</section>
</template>
<script>
import remoteLoad from '../../common/remoteLoad.js'
import { MapKey, MapCityName } from '../../config/config'
export default {
    data () {
        return {
            searchKey: '',
            placeSearch: null,
            dragStatus: false,
            AMapUI: null,
            AMap: null,
            lat: 114.31,
            lng: 30.52,
            Path: {"car1": [
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
            ],
            "car2":[
            [113.964458, 40.54664],
            [98.46826, 43.229964],
            [116.405289, 39.904987],
            [103.774185, 42.56996],
            ]},
            navg1: ""
        }
    },
    watch: {
        searchKey () {
            if (this.searchKey === '') {
            this.placeSearch.clear()
            }
        }
    },
    methods: {
        // 搜索
        handleSearch () {
            if (this.searchKey) {
            this.placeSearch.search(this.searchKey)
            }
        },
        renderTrace(Path){

        },
        // 实例化地图
        initMap () {
            // 加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
            let AMapUI = this.AMapUI = window.AMapUI
            let AMap = this.AMap = window.AMap
            console.log(AMapUI)
            //添加点标记，并使用自己的icon

            // AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function(PathSimplifier, $) {
            //     console.log("!!!",$)
                
            //     if (!PathSimplifier.supportCanvas) {
            //         alert('当前环境不支持 Canvas！');
            //         return;
            //     }

            //     var pathSimplifierIns = new PathSimplifier({
            //         zIndex: 100,
            //         //autoSetFitView:false,
            //         map: AMap, //所属的地图实例

            //         getPath: function(pathData, pathIndex) {

            //             return pathData.path;
            //         },
            //         getHoverTitle: function(pathData, pathIndex, pointIndex) {

            //             if (pointIndex >= 0) {
            //                 //point 
            //                 return pathData.name + '，点：' + pointIndex + '/' + pathData.path.length;
            //             }

            //             return pathData.name + '，点数量' + pathData.path.length;
            //         },
            //         renderOptions: {

            //             renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
            //         }
            //     });

            //     // window.pathSimplifierIns = pathSimplifierIns;

            //     // //设置数据
            //     // pathSimplifierIns.setData([{
            //     //     name: '路线0',
            //     //     path: [
            //     //         [116.405289, 39.904987],
            //     //         [113.964458, 40.54664],
            //     //         [111.47836, 41.135964],
            //     //         [108.949297, 41.670904],
            //     //         [106.380111, 42.149509],
            //     //         [103.774185, 42.56996],
            //     //         [101.135432, 42.930601],
            //     //         [98.46826, 43.229964],
            //     //         [95.777529, 43.466798],
            //     //         [93.068486, 43.64009],
            //     //         [90.34669, 43.749086],
            //     //         [87.61792, 43.793308]
            //     //     ]
            //     // }]);

            //     // //对第一条线路（即索引 0）创建一个巡航器
            //     // var navg1 = pathSimplifierIns.createPathNavigator(0, {
            //     //     loop: true, //循环播放
            //     //     speed: 1000000 //巡航速度，单位千米/小时
            //     // });

            //     // navg1.start();
            // });



            // 加载位置ui
            AMapUI.loadUI(['misc/PositionPicker'], PositionPicker => {
                let mapConfig = {
                    zoom: 16,
                    cityName: MapCityName
                }
                // if (this.lat && this.lng) {
                mapConfig.center = [this.lat, this.lng]
                // }
                let map = new AMap.Map('js-container', mapConfig)
                // 加载地图搜索插件
                AMap.service('AMap.PlaceSearch', () => {
                    this.placeSearch = new AMap.PlaceSearch({
                    pageSize: 5,
                    pageIndex: 1,
                    citylimit: true,
                    city: MapCityName,
                    map: map,
                    panel: 'js-result'
                    })
                })
                // 启用工具条
                AMap.plugin(['AMap.ToolBar'], function () {
                    map.addControl(new AMap.ToolBar({
                        position: 'RB'
                    }))
                })
                // 创建地图拖拽
                let positionPicker = new PositionPicker({
                    mode: 'dragMap', // 设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
                    map: map // 依赖地图对象
                })
                // 拖拽完成发送自定义 drag 事件
                positionPicker.on('success', positionResult => {
                    // 过滤掉初始化地图后的第一次默认拖放
                    if (!this.dragStatus) {
                        this.dragStatus = true
                    } else {
                        this.$emit('drag', positionResult)
                    }
                })
                // 启动拖放
                positionPicker.start()
            })

           let marker = new AMap.Marker({
                map: AMap,
                position: [ 114.31, 30.52],
                // icon: new AMap.Icon({            
                //     size: new AMap.Size(40, 50),  //图标大小
                //     image: "https://webapi.amap.com/theme/v1.3/images/newpc/way_btn2.png",
                //     imageOffset: new AMap.Pixel(0, -60)
                // })
            });
            marker.setMap(AMap)
        }
    },
    async created () {
        // 已载入高德地图API，则直接初始化地图
        if (window.AMap && window.AMapUI) {
            this.initMap()
        // 未载入高德地图API，则先载入API再初始化
        } else {
            await remoteLoad(`http://webapi.amap.com/maps?v=1.3&key=${MapKey}`)
            await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
            this.initMap()
        }
    }
}
</script>

<style lang="css">
.m-map{ width: 100%; height: 100%; position: relative; }
.m-map .map{ width: 100%; height:  600px }
.m-map .search{ position: absolute; top: 10px; left: 10px; width: 285px; z-index: 1; }
.m-map .search input{ width: 180px; border: 1px solid #ccc; line-height: 20px; padding: 5px; outline: none; }
.m-map .search button{ line-height: 26px; background: #fff; border: 1px solid #ccc; width: 50px; text-align: center; }
.m-map .result{ max-height: 300px; overflow: auto; margin-top: 10px; }
</style>