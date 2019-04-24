<template>
<div class="record-list">
  <div class="list-nav">
    <Input search placeholder="患者姓名.." style="width: 160px;margin-right:5px;"/>
    <DatePicker type="date" placeholder="选择就诊日期" style="width: 160px;margin-right:5px;"></DatePicker>
    <Button type="primary" icon="md-add" @click="addItem">新增</Button>
  </div>
  <Table stripe border :columns="columns" :data="items"></Table>
  <Page :total="100" show-elevator />
</div>
</template>

<style lang="sass">
.record-list
  padding: 10px;

  .ivu-page
    margin-top: 10px;
  .list-nav
    margin-bottom: 10px;
    display: flex;
    justify-content: flex-end;
</style>

<script>
export default {
  name: 'records',
  data () {
    return {
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 72,
          align: 'center'
        },
        {
          title: '就诊日期',
          key: 'treatmentAt'
        },
        {
          title: 'SN',
          key: 'sn',
          width: 64,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '性别',
          key: 'sex',
          width: 64,
          align: 'center'
        },
        {
          title: '操作',
          align: 'center'
        }
      ],
      items: []
    }
  },
  methods: {
    addItem () {
      this.$router.push({ path: '/record/new' })
    }
  }
}
</script>

