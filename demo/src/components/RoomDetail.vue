<template>
  <Card title="房间信息" class="card-room-detail" shadow v-show="isFocusRoom">
    <CellGroup>
      <Cell title="房间ID" :extra="detailTable.ID"/>
      <Cell title="房间名称" :extra="detailTable.name"/>
      <Cell title="房间高度" :extra="detailTable.RoomHigh"/>
      <Cell title="所在楼层" :extra="detailTable.FloorNum"/>
      <Cell title="X轴坐标" :extra="detailTable.x"/>
      <Cell title="Y轴坐标" :extra="detailTable.y"/>
    </CellGroup>
  </Card>
</template>

<script>
export default {
  name: "RoomDetail",
  props: {
    detailTable: {
      type: Object,
      default: null
    },
    isFocusRoom: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.card-room-detail{
  position: absolute;
  width: 280px;
  top: 20%;
  right: 2%;
}
</style>