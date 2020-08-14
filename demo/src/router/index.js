import Vue from 'vue'
import VueRouter from 'vue-router'
import Navi from "@/views/Navi";
const Workplace = ()=>import("../views/Workplace")

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    component:Workplace
  },
  // {
  //   path: '/navi',
  //   component:Navi
  // }
]



const router = new VueRouter({
  routes
})

export default router