// 输出该楼层所有房间
export function getAllRooms(e, map, esmap) {
  if (e.nodeType === 4) {

    esmap.ESMapUtil.search(map, e.FloorNum, {nodeType: esmap.ESNodeType.MODEL}, ev => {
      return ev.filter(ev => ev.name !== '' && ev.name !== '玻璃' && !ev.name.includes('墙'))
    })
  }
}

// 输出该房间详细信息
export function getRoomDetail(map) {
  map.on('mapClickNode', (e) => {
    return e;
  });
}