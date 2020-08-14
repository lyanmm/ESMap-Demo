<template>
  <Card title="楼层信息" class="card-floor-detail" shadow v-show="isFocusFloor">
    <CellGroup>
      <Cell title="当前楼层" :extra="floorDetail.FloorNum"/>
      <Cell title="楼层房间数" :extra="floorDetail.rooms"/>
      <Cell title="墙面数" :extra="floorDetail.walls"/>
    </CellGroup>
  </Card>
</template>

<script>
export default {
  name: "FloorDetail",
  props:{
    floorDetail: {
      type:Object,
      default:null
    },
    isFocusFloor:{
      type:Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.card-floor-detail{
  position: absolute;
  width: 280px;
  top: 35%;
  left: 3%;
}
</style>