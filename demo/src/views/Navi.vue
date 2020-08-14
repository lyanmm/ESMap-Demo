<template>
  <div>
    <div id="map-container"></div>
    <div id="pannel">
      <input id="start" type="button" class="btn btn-default btnclass" value="开始导航"/>
    </div>
    <!--    <Button class="map" @click="startNavi" to="/">地图页面</Button>-->

  </div>
</template>

<script>
export default {
  name: "Navi",
  mounted() {
    let esmapID = 'test666'
    var map;
    // 导航对象
    var navi;
    // 点击计数
    var clickCount = 0;
    var mapCoord = null;
    //判断起点是否是同一处坐标
    var lastCoord = null;
    var curfnum = null;
    var h = 1;
    var ctlOpt = new esmap.ESControlOptions({
      position: esmap.ESControlPositon.RIGHT_TOP,
      imgURL: 'image/wedgets/'
      // allLayer: true
      // size:"normal"
    })
    var container = document.getElementById('map-container');
    window.onload = function () {
      map = new esmap.ESMap({
        container: container, // 渲染dom
        mapDataSrc: "../data", //地图数据位置
        mapThemeSrc: "../data/theme", //主题数据位置
        mapAudioSrc: '../lib',
        token: 'escope',
        focusAlphaMode: false
      });
      map.openMapById(esmapID);
      //地图加载完成回调
      map.on('loadComplete', function () {
        createNavi();
        var floorControl = new esmap.ESScrollFloorsControl(map, ctlOpt);

      });

      //点击地图事件。开始选点开始后，点击地图一次为起点，第二次点击为终点
      map.on('mapClickNode', function (event) {
        console.log(event)
        if (event.nodeType === 4) {
          curfnum = event.floor;
          h = 1;
          mapCoord = event.hitCoord;
        }
        if (event.nodeType === 5) {
          curfnum = event.FloorNum;
          h = event.RoomHigh;
          mapCoord = event.hitCoord;
        }
      })
      //为模型填充div添加点击事件
      container.onclick = function () {
        var fnum = curfnum;
        fnum && mapCoord && show(fnum, mapCoord);
      };

      function show(fnum, coord) {
        if (!navi) return;
        if (coord != null) {
          //第三次点击清除路径，重现设置起点起点
          if (clickCount === 2) {
            navi.clearAll();
            clickCount = 0;
            lastCoord = null;
          }
          //第一次点击添加起点
          if (clickCount === 0) {
            lastCoord = coord;
            navi.setStartPoint({
              x: coord.x,
              y: coord.y,
              fnum: fnum,
              height: h,
              url: 'image/start.png',
              size: 64
            });
          } else if (clickCount === 1) { //添加终点并画路线
            //判断起点和终点是否相同
            if (lastCoord.x === coord.x) {
              alert("起点和终点不能相同!,请重新选点")
              return;
            }
            navi.setEndPoint({
              x: coord.x,
              y: coord.y,
              fnum: fnum,
              height: h,
              url: 'image/end.png',
              size: 64
            });
            // 画导航线
            navi.drawNaviLine();
          }
          clickCount++;
        }
        curfnum = null;
      }
    };

    let btn = document.getElementById('start');
    btn.onclick = () => {
      if (navi.isSimulating) {
        navi.stop();
        navi.reset();
      }
      //下句解决IOS苹果手机不能播放问题，不能删除
      map.ESAudioTool.playSoundByName('startNaving');
      navi.simulate();
    }

    function createNavi() {
      if (!navi) {
        //初始化导航对象
        navi = new esmap.ESNavigation({
          map: map,
          locationMarkerUrl: 'image/pointer.png',
          locationMarkerSize: 150,
          speed: 5,
          followAngle: true,
          followPosition: true,
          followGap: 1,
          tiltAngle: 30,
          audioPlay: true,
          mode: 1,
          offsetHeight: 1,
          // 设置导航线的样式
          lineStyle: {
            color: '#58a2e4',
            //设置线为导航线样式
            lineType: esmap.ESLineType.ESARROW,
            lineWidth: 6,
            offsetHeight: 0.5,
            smooth: true,
            seeThrough: false,
            noAnimate: true
          },
          scaleAnimate: true,
          isMultiFloors: false
        });
      }
    }

    function clearNavi() {
      if (navi) navi.clearAll();
      clickCount = 0;
    }


  }
}
</script>

<style scoped>
#pannel {
  position: absolute;
  left: 2%;
  bottom: 10%;
  z-index: 999;
}

button, input[type="button"] {
  padding: 7px 11px;
  background-color: #ccc;
  border: none;
  cursor: pointer;
  border-radius: 3px;
}

.map {
  position: absolute;
  right: 2%;
  bottom: 10%;
}

#map-container {
  height: 800px;
  width: 100%;
}
</style>