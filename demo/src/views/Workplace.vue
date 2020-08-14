<template>
  <div class="wrapper">
    <div class="navi-mode-btn">
      <!--          <i-Switch v-model="isNaviMode" @on-change="changeNaviMode"/>-->
      <!--          <Button @click="startNavi" to="/navi">导航页面</Button>-->
    </div>
    <Input class="input-search"
           placeholder="搜索房间名"
           @on-enter="search"
           v-model="searchInfo"
           @on-click="search"
           icon="ios-search"/>
    <CellGroup class="search-res"
               v-for="(item,index) in searchRes"
               @on-click="clickCell(item.mapCoord.x,item.mapCoord.y,item.FloorNum)"
               :key="index">
      <Cell :title="String(item.name)"
            :label="String(`ID ${item.ID}`)"
            :extra="String(`${item.FloorNum}楼`)"
            @on-click="clickCell"
            v-show="isShowCell"/>
    </CellGroup>
    <div id="main" v-show="!isFocusFloor"></div>
    <div id='content'>
      <div id='map-container'></div>
    </div>
    <RoomDetail :detail-table="detailTable" :is-focus-room="isFocusRoom"/>
    <FloorDetail :floor-detail="floorDetail" :is-focus-floor="isFocusFloor"/>
    <div class="btn-group">
      <Button size="large" @click="to2D">2D</Button>
      <Button size="large" @click="to3D">3D</Button>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import RoomDetail from "@/components/RoomDetail";
import FloorDetail from "@/components/FloorDetail";

export default {
  name: "Workplace",
  components: {FloorDetail, RoomDetail},
  data() {
    return {
      floorInfo: [],
      isFocusRoom: false,
      detailTable: {},
      floorDetail: {},
      isFocusFloor: false,
      searchInfo: "",
      searchRes: [],
      isShowCell: false,
      layer: {},
      chart: {}
    }
  },
  mounted() {
    let esmapID = 'test666'
    let container = document.getElementById('map-container');
    let map = new esmap.ESMap({
      container,
      mapDataSrc: './data',
      mapThemeSrc: './data/theme',
      visibleFloors: "all",
      token: "escope",
      themeID: 2005,
      defaultScaleLevel: 20
    });
    map.openMapById(esmapID);
    map.showCompass = true;
    map.on('loadComplete', (ev) => {
      // 进入动画
      map.scaleLevelTo(11);
      for (let i = 1; i <= 3; i++) {
        esmap.ESMapUtil.search(map, i, {nodeType: esmap.ESNodeType.MODEL}, ev => {
          let length = ev.filter(ev => ev.name !== '' && ev.name !== '玻璃' && !ev.name.includes('墙')).length;
          this.floorInfo.push({value: length, name: `${i}楼`});
          ev.forEach(item => {
            if (item.nodeType === 6) {
            }
          })
        })
      }

    })
    // 导航初始化
    // map.on('loadComplete', (e) => {
    //   this.navi = new esmap.ESNavigation({
    //     map: map,
    //     locationMarkerUrl: 'image/pointer.png',
    //     locationMarkerSize: 150,
    //     speed: 5,
    //     followAngle: true,
    //     followPosition: true,
    //     followGap: 3,
    //     tiltAngle: 30,
    //     audioPlay: true,
    //     mode: 1,
    //     offsetHeight: 1,
    //     // 设置导航线的样式
    //     lineStyle: {
    //       color: '#58a2e4',
    //       //设置线为导航线样式
    //       lineType: esmap.ESLineType.ESARROW,
    //       lineWidth: 6,
    //       offsetHeight: 0.5,
    //       smooth: true,
    //       seeThrough: false,
    //       noAnimate: true
    //     },
    //     scaleAnimate: true,
    //     isMultiFloors: false
    //   });
    // })

    // 聚焦楼层
    map.on('mapClickNode', (e) => {
      if (e.nodeType === 4 && !this.isFocusRoom) {
        console.log(e)
        let fnum = e.FloorNum;
        esmap.ESMapUtil.search(map, fnum, {nodeType: esmap.ESNodeType.MODEL}, ev => {
          map.changeFocusFloor(fnum);
          let rooms = this.floorInfo[fnum - 1].value;
          let walls = 0;
          ev.forEach(item => {
            if (item.name.includes('墙')) {
              walls++;
            }
          })
          this.floorDetail = {
            FloorNum: String(fnum),
            rooms: String(rooms),
            walls: String(walls)
          }
          this.isFocusFloor = true;
        })
      }

    });
    // 退出聚焦楼层
    map.on('mapClickNode', e => {
      if (e.nodeType === 0) {
        this.isFocusRoom = false;
        let floorArr = [];
        let floorLength = this.floorInfo.length;
        for (let i = 1; i <= floorLength; i++) {
          floorArr.push(i);
        }
        map.visibleFloorNums = floorArr;
        map.scaleLevelTo(11);
        map.tiltAngle = 61;
        map.moveTo({
          x: map.center.x,
          y: map.center.y,
          FloorNum: 1
        });
        this.isFocusFloor = false;
        if (this.layer.removeAll !== void 0) {
          this.layer.removeAll();
        }
      }
    })
    // 聚焦房间
    map.on('mapClickNode', e => {
      if (e.nodeType === 5) {
        console.log(e)
        this.isFocusRoom = true;
        let x = e.mapCoord.x;
        let y = e.mapCoord.y;
        let FloorNum = e.FloorNum;
        let options = {
          x,
          y,
          FloorNum
        }
        map.changeFocusFloor(FloorNum);
        map.scaleLevelTo(5);
        map.moveTo(options);
        // 创建表单
        let {name, RoomHigh, ID} = e;
        this.detailTable = {
          x: String(x),
          y: String(y),
          FloorNum: String(FloorNum),
          RoomHigh: String(RoomHigh),
          ID: String(ID),
          name
        }
      }
    })

    map.on('focusFloorNumChanged', e => {
      map.scaleLevelTo(9);
    });

    this.map = map;
    this.esmap = esmap;

    map.on('loadComplete',() => {
      let myChart = echarts.init(document.getElementById('main'));
      // 指定图表的配置项和数据
      let option = {
        backgroundColor: 'rgba(255,255,255,0.3)',
        title: {
          text: '各楼层房间数'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            // roseType: 'angle',
            name: '楼层信息',
            type: 'pie',
            radius: '90%',
            data: this.floorInfo,
          }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
      myChart.on('click', params => {
        console.log(params.name)
        let fnum = params.dataIndex + 1;
        esmap.ESMapUtil.search(map, fnum, {nodeType: esmap.ESNodeType.MODEL}, ev => {
          map.changeFocusFloor(fnum);
          let rooms = this.floorInfo[fnum - 1].value;
          let walls = 0;
          ev.forEach(item => {
            if (item.name.includes('墙')) {
              walls++;
            }
          })
          this.floorDetail = {
            FloorNum: String(fnum),
            rooms: String(rooms),
            walls: String(walls)
          }
          this.isFocusFloor = true;
        })
      })
    })
  },
  methods: {
    to2D() {
      this.map.viewMode = this.esmap.ESViewMode.MODE_2D;
    },
    to3D() {
      this.map.viewMode = this.esmap.ESViewMode.MODE_3D;
    },
    search() {
      this.searchRes.splice(0, this.searchRes.length);
      let options = {
        nodeType: this.esmap.ESNodeType.MODEL,
        name: this.searchInfo
      }
      this.esmap.ESMapUtil.search(this.map, 'all', options, ev => {
        this.searchRes.push(...ev);
      })
      this.isShowCell = true;
    },
    clickCell(x, y, FloorNum) {
      if (this.layer.removeAll !== void 0) {
        this.layer.removeAll();
      }
      let map = this.map;
      let esmap = this.esmap;
      this.isShowCell = false;
      let options = {
        x,
        y,
        FloorNum
      }
      map.changeFocusFloor(FloorNum);
      map.scaleLevelTo(5);
      map.moveTo(options);
      let layer = new esmap.ESLayer(esmap.ESLayerType.IMAGE_MARKER);
      let im = new esmap.ESImageMarker({
        x,
        y,
        url: 'image/location.png',
        size: 128,
        seeThrough: true,
      });
      layer.addMarker(im);
      let floorLayer = map.getFloor(FloorNum)
      floorLayer.addLayer(layer);
      this.layer = layer;
    },
    changeNaviMode(sta) {
      this.isNaviMode = sta;
    },

  }
}
</script>

<style scoped>
.wrapper {
  position: relative;
  width: 100%;
}

#content {
  display: flex;
  justify-content: center;
}

#map-container {
  height: 700px;
  width: 100%;
}

#main {
  position: absolute;
  width: 290px;
  height: 200px;
  top: 15%;
  left: 0;
}

.btn-group {
  position: absolute;
  bottom: 0;
  right: 0;
}

.input-search {
  position: absolute;
  width: 300px;
  top: 5px;
  left: 50%;
  transform: translateX(-150px);
}

.search-res {
  position: absolute;
  width: 298px;
  top: 37px;
  left: 50%;
  transform: translateX(-149px);
  background-color: #fff;
}

.navi-mode-btn {
  position: absolute;
  bottom: 6%;
  right: 0;
}
</style>