
import { stat } from "fs";
import { Station } from "./station.js";
import { useUserStore } from "./user.js";





const baseUrl = "https://i.sdu.edu.cn/XSZX/NXXT/api";
const user = useUserStore();


export async function getStationView(id: number): Promise<Station> {
  const station: Station = {
    name: '',
    id: 0,
    parentId: 0,
    description: '',
    img: '',
    stationId: 0,
    isDepartment: 0,
    children: []
  };

  // 获取基础信息
  const res2 = await fetch(baseUrl + "/station/view?id=" + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${user.getToken}`
      }
    }

  );
  const data2 = await res2.json();
  
  // 获取子节点信息
  const res = await fetch(baseUrl + "/station/unfold?id=" + id,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${user.getToken}`
      }
    }
  );
 
  const childrenData = await res.json();


   console.log(data2)

   console.log(childrenData)

  // 填充基础信息
  station.name = data2.data.name;
  station.id = data2.data.id;
  station.parentId = data2.data.pId;
  station.description = data2.data.description;
  station.img = data2.data.img;
  station.stationId = data2.data.stationId;
  station.isDepartment = data2.data.isDepartment;

  try {
    // 处理子节点
  if(station.isDepartment!==1){
    if (childrenData.data && childrenData.data.length > 0) {
    // 递归获取每个子节点的完整信息
    for (const childData of childrenData.data) {
      
        const childStation = await getStationView(childData.id);
      station.children.push(childStation);
    }
    
  }else{
    station.children=[]
  }
  }else{
    station.children=[]
  }
  }
  catch (error) {
    console.error('获取子节点信息失败:', error);
  }


  console.log(station)

  return station;
}
