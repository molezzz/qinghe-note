<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
html,body,#app{
  height: 100%;
}
</style>

<script>
  export default {
    name: 'qinghe',
    created () {
      console.log(this.$db)
      // const member = new Member(0, '张三', true, 35, new Date(1984, 6, 28))
      // this.$db.manager.save([member]).then((r) => {
      //   console.log(r)
      // })

      // const record = new Record()
      // record.treatmentAt = new Date()
      // this.$db.manager.save([record]).then((r) => {
      //   console.log(r)
      // })
    }
  }
</script>

<style>
  /* CSS */
</style>
