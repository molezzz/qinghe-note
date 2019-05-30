<template>
  <div id="recordEditor">
    <Breadcrumb>
      <BreadcrumbItem to="/record/list">记录列表</BreadcrumbItem>
      <BreadcrumbItem>记录编辑器</BreadcrumbItem>
    </Breadcrumb>
    <Card>
      <Form :model="formData" label-position="top">
        <FormItem class="form-col">
            <span class="inline-label">患者</span>
            <Select
              style="width: 200px;flex:1"
              v-model="formData.member"
              filterable
              remote
              :remote-method="searchMember"
              :loading="memberLoading">
              <Option v-for="(option, index) in memberOptions" :value="option.id" :key="index">{{option.name}} - {{option.sex ? '男' : '女'}} <Icon type="md-alarm" /> {{option.createdAt.toLocaleDateString()}}</Option>
            </Select>
            <Button @click="addMember" icon="md-person-add" type="dashed" style="margin-left: 0.5rem"></Button>
            <span class="inline-label">就诊日期</span>
            <DatePicker v-model="formData.treatmentAt" type="date" placeholder="选择日期" style="flex:1"></DatePicker>
            <Input prefix="ios-list" v-model="formData.sn" type="text" placeholder="序号" style="max-width: 5rem;margin-left: 0.3rem"></Input>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">病情摘要</span>
          <Input v-model="formData.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="摘要"></Input>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">面象</span>
          <Input v-model="formData.face" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="面"></Input>
          <span class="inline-label">舌象</span>
          <Input v-model="formData.tongue" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="舌"></Input>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">脉象</span>
          <Input v-model="formData.pulse" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="脉"></Input>
          <span class="inline-label">病机</span>
          <Input v-model="formData.cause" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="病机"></Input>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">师按</span>
          <Input v-model="formData.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="按语"></Input>
        </FormItem>
        <FormItem class="form-col" v-model="formData.formulas[index]" v-for="(formula,index) in formData.formulas" :key="index">
          <span class="inline-label">方</span>
          <div style="flex:2;min-width: 25rem">
            <Input type="text" placeholder="快捷输入框" style="margin-bottom: 0.3rem" @on-enter="insertToFormula(index, $event)"></Input>
            <Input v-model="formData.formulas[index].rawData" type="textarea" :autosize="{minRows: 6,maxRows:12}" placeholder="方剂详情"></Input>
          </div>
          <div style="margin-left: 1rem; display: flex;flex-direction: column; width: 30rem">
            <Input v-model="formData.formulas[index].usage" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="用法"></Input>
            <Input v-model="formData.formulas[index].dose" type="text" placeholder="剂量" style="margin-top:0.3rem"></Input>
            <Input v-model="formData.formulas[index].advice" type="text" placeholder="医嘱" style="margin-top:0.3rem"></Input>
            <RadioGroup v-model="formData.formulas[index].kind">
              <Radio label="内服" true-value="0"></Radio>
              <Radio label="外敷" true-value="1"></Radio>
              <Radio label="洗浴" true-value="2"></Radio>
            </RadioGroup>
          </div>
          <div style="margin-left: 0.5rem; display: flex;flex-direction: column;">
            <Button type="dashed" icon="md-trash" @click="removeFormula(index)"></Button>
            <Button type="dashed" icon="md-add" style="margin-top: 0.3rem" @click="addBlankFormula"></Button>
          </div>
        </FormItem>
      </Form>
     </Card>
     <member-modal ref="memberModal" v-on:afterSave="memberCreated"></member-modal>
  </div>
</template>

<style lang="sass">
#recordEditor
  padding: 0 1rem;

  .ivu-card
    margin: 1rem auto;
  .form-col .ivu-form-item-content
    display: flex;
    .inline-label
      min-width: 4rem;
      margin: 0 0.5rem 0 1rem;
</style>


<script>
import { Like } from 'typeorm'
import { Member } from '../../entity/Member'
import MemberModal from './member_modal'

export default {
  name: 'record_editor',
  data () {
    return {
      formData: {
        formulas: []
      },
      memberOptions: [],
      memberLoading: false
    }
  },
  components: {
    MemberModal
  },
  methods: {
    searchMember (name) {
      let params = {
        where: { name: Like(`%${name}%`) }
      }
      if (this.memberLoading) return
      this.memberLoading = true

      Member.find(params).then((r) => {
        this.memberOptions = r
        this.memberLoading = false
      })
    },
    addMember () {
      this.$refs.memberModal.show()
    },
    memberCreated (member) {
      console.log(member)
    },
    addBlankFormula () {
      this.formData.formulas.push({
        rawData: '',
        usage: '诸药浸泡 分钟;大火烧开，文火再煎，第一遍 分钟，第二遍 分钟，第三遍 分钟;先煎 分钟;后下 分钟。',
        dose: '剂/周 x 1',
        kind: '内服'
      })
    },
    removeFormula (idx) {
      if (!confirm('确实要删掉此方剂？')) return
      this.formData.formulas.splice(idx, 1)
    },
    insertToFormula (idx, evt) {
      const exMap = {
        '先': '先煎',
        '后': '后下',
        '开': '掰开',
        '去': '去核',
        '粉': '打粉',
        '冲': '冲服',
        '兑': '兑服',
        '嚼': '嚼服'
      }

      let [val, name, ex, dose] = /^([\w\W]+)\s+([先后开去粉冲捣兑包嚼，]*)?\s*(\d+)/.exec(evt.srcElement.value)
      let unit = 'g'
      let strArr = [name]

      if (ex) {
        strArr.push(`(${exMap[ex] ? exMap[ex] : ex})`)
      }
      console.log(val)
      switch (name) {
        case '大枣':
        case '鸡子黄':
          unit = '枚'
          break
        case '生姜':
          unit = '片'
          break
        case '川椒':
          unit = '粒'
          break
        case '海马':
        case '海龙':
          unit = '只'
          break
        case '蜈蚣':
          unit = '条'
      }
      strArr.push(`${dose}${unit}`)
      // console.log(strArr.join(' '))
      this.formData.formulas[idx].rawData = this.formData.formulas[idx].rawData + strArr.join(' ') + ';'
      evt.srcElement.value = ''
    }
  },
  created () {
    this.addBlankFormula()
  }
}
</script>
