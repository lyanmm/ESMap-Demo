<template>
  <div>
    <!--    <div id="nav">-->
    <!--      <router-link to="/">Workplace</router-link>-->
    <!--      &nbsp;-->
    <!--      <router-link to="/servers">Servers</router-link>-->
    <!--    </div>-->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#nav {
  padding: 30px;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
