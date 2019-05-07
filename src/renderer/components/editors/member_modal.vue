<template>
  <Modal
      v-model="open"
      title="添加患者"
      :loading="loading"
      class="member-modal"
      @on-ok="save">
      <Form :model="formData" :label-width="80">
        <FormItem label="姓名年龄" class="input-inline">
          <Input v-model="formData.name" placeholder="输入姓名" style="flex:2" />
          <Input v-model="formData.age" placeholder="年龄" />
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="formData.sex">
            <Radio label="true">男</Radio>
            <Radio label="false">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="出生日期">
          <DatePicker type="date" placeholder="选择日期" v-model="formData.birthday"></DatePicker>
        </FormItem>
        <Switch size="large" />
        <FormItem label="生辰属相" class="input-inline">
          <i-switch v-model="formData.exdata.lunar" size="large">
            <span slot="open">农历</span>
            <span slot="close">公历</span>
          </i-switch>
          <Input v-model="formData.exdata.year" placeholder="年" />
          <Input v-model="formData.exdata.month" placeholder="月" />
          <Input v-model="formData.exdata.day" placeholder="日" />
          <Input v-model="formData.exdata.time" placeholder="时辰" />
          <Input v-model="formData.exdata.zodiac" placeholder="属相" />
        </FormItem>
        <FormItem label="哪里人">
          <Input v-model="formData.area" placeholder="输入地区" />
        </FormItem>
      </Form>
  </Modal>
</template>

<style lang="sass">
.member-modal
  .input-inline
    .ivu-form-item-content
      display: flex;

      .ivu-input-wrapper, .ivu-checkbox-wrapper
        margin-left: 0.5rem
        min-width: 30px
        flex: 1
      .ivu-switch
        margin: 0.3rem 0.5rem 0 0

</style>


<script>
import solarLunar from 'solarLunar'
import { Member } from '../../entity/Member'

// @event: afterSave(member)

export default {
  data () {
    return {
      open: false,
      loading: true,
      formData: {
        exdata: {}
      }
    }
  },
  methods: {
    save () {
      Member.create(this.formData).save().then((r) => {
        this.$emit('afterSave', r)
        this.open = false
        this.formData = {
          exdata: {}
        }
      })
    },
    show () {
      this.open = true
    },
    close () {
      this.open = false
    }
  },
  watch: {
    'formData.birthday': function (val) {
      if (!val) return
      let data = solarLunar.solar2lunar(val.getFullYear(), val.getMonth() + 1, val.getDate())
      console.log(data)

      this.formData.exdata.year = val.getFullYear()
      this.formData.exdata.month = val.getMonth() + 1
      this.formData.exdata.day = val.getDate()
      this.formData.exdata.zodiac = data.animal
    }
  }
}
</script>

