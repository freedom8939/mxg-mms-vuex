<template>
<!--渲染出口-->
  <div class="main">
<!--    公共导航-->
    <APPLink v-show="$route.path !== '/home' " />
    <router-view/>
  </div>

</template>

<script>
import APPLink from "@/components/AppMain/Link";
export default {
  components:{
    APPLink
  }
}
</script>

