<template>
  <div>
   <AppHeader></AppHeader>
    <AppNavbar></AppNavbar>
    <AppMain/>
  </div>
</template>

<script>
import AppHeader from './AppHeader'
import AppNavbar from './AppNavbar'
import AppMain from './AppMain'
export default {
  components:{
    AppHeader,AppNavbar,AppMain
  }
}
</script>

<style scoped>
/* 头部区域 */
.header{
  position: absolute;
  line-height: 50px;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: #2d3a4b;
}
.navbar{
  position: absolute;
  width: 230px;
  background-color: #545c64;
  top: 50px;
  left: 0px;
  bottom: 0px;
  /*  内容多了会有滚动条效果 */
  overflow-y: auto;
}
.main{
  position: absolute;
  top: 50px;
  left: 230px;padding: 10px;
  overflow-y: auto;
  /*background-color: lightpink;*/
  right: 0px;
  bottom: 0px;

}
</style>
