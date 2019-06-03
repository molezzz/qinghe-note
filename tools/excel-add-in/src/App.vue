<template>
<div id="app">
  <div id="content">
    <div id="content-header">
        <h1>清河学派医案录入工具</h1>
    </div>
    <div id="content-main">
      <Form :model="formData" label-position="top" ref="form">
        <FormItem class="form-col">
          <span class="inline-label">姓名</span>
          <Input v-model="formData.name" placeholder="输入姓名"/>
          <span class="inline-label">性别</span>
          <RadioGroup v-model="formData.sex" style="min-width: 8rem">
              <Radio label="男">男</Radio>
              <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">生日</span>
          <Input v-model="formData.birthday" placeholder="格式：1984-01-01"/>
          <span class="inline-label" style="min-width: 2rem;">年龄</span>
          <Input v-model="formData.age" placeholder="" style="width: 6rem;"/>
          <span class="inline-label" style="min-width: 2rem;">属相</span>
          <Input v-model="formData.zodiac" placeholder="" style="width: 6rem;"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">介绍人</span>
          <Input v-model="formData.introducer" placeholder="输入人名"/>
          <span class="inline-label" style="min-width: 4rem;">就诊时间</span>
          <Input v-model="formData.date" placeholder="格式: 2019-01-01"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">主诉</span>
          <Input v-model="formData.summary" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="病情摘要..." />
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">脉象</span>
          <Input v-model="formData.pulse" placeholder="输入脉象"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">舌象</span>
          <Input v-model="formData.tongue" placeholder="输入舌象"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">方</span>
          <div style="flex:2">
            <Input type="text" placeholder="快捷输入，例：熟地黄 先30 / sd x30 3 (表示：熟地黄 (先煎) 30g) " style="margin-bottom: 0.3rem" @on-enter="insertToFormula($event)" @on-keyup="showChoices"/>
            <div v-if="bcChoices.length > 0">
              <span v-for="(c,idx) in bcChoices" :key="idx">
                <Tag color="default" style="margin-left: 0.5rem">{{idx + 1}}</Tag> {{c}}
              </span>
            </div>
            <Input v-model="formData.formula" type="textarea" :autosize="{minRows: 6,maxRows:12}" placeholder="方剂详情" />
          </div>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">服法</span>
          <Input v-model="formData.usage" type="textarea" :autosize="{minRows: 3,maxRows:6}" placeholder="煎服方法" />
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">剂量</span>
          <Input v-model="formData.dose" placeholder="输入剂量"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">医嘱</span>
          <Input v-model="formData.advice" placeholder="输入医嘱"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">按语</span>
          <Input v-model="formData.note" type="textarea" placeholder="输入按语"/>
        </FormItem>
        <FormItem class="form-col">
          <span class="inline-label">师语</span>
          <Input v-model="formData.zhao" type="textarea" placeholder="输入老师语录"/>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handleSubmit()">录入，新建一条</Button>
            <Button @click="handleReset()" style="margin-left: 8px">清空</Button>
        </FormItem>
      </Form>
    </div>
  </div>
</div>
</template>

<script>
import bencao from './bencao.json'
const Excel = window.Excel
const labels = [
  'name', 'sex', 'age', 'birthday', 'zodiac', 'introducer',
  'date', 'summary', 'pulse', 'tongue', 'formula', 'usage',
  'dose', 'advice', 'note', 'zhao'
]
const bcMap = {}
for (let [k, v] of Object.entries(bencao)) {
  if (bcMap[v]) {
    bcMap[v].push(k)
  } else {
    bcMap[v] = [k]
  }
}

const exMap = {
  '先': '先煎',
  '后': '后下',
  '开': '掰开',
  '去': '去核',
  '粉': '打粉',
  '冲': '冲服',
  '兑': '兑服',
  '嚼': '嚼服',
  '烊': '烊化'
}
const qExMap = {
  'X': '先煎',
  'H': '后下',
  'K': '掰开',
  'Q': '去核',
  'F': '打粉',
  'C': '冲服',
  'D': '兑服',
  'DA': '捣',
  'J': '嚼服',
  'Y': '烊化',
  'B': '包'
}
const qOpMap = {
  'C': '炒',
  'S': '生',
  'J': '焦',
  'CU': '醋',
  'D': '煅',
  'Z': '炙',
  'Y': '盐',
  'M': '蜜'
}

const qPrefixReg = /^(c|s|j|cu|d|z|y|m)([^u]+)/i
// console.log(bcMap)
export default {
  name: 'App',
  data () {
    return {
      formData: {
        formula: ''
      },
      // 本草候选
      bcChoices: []
    }
  },
  methods: {
    onSetColor () {
      window.Excel.run(async (context) => {
        const range = context.workbook.getSelectedRange()
        range.format.fill.color = 'green'
        await context.sync()
      })
    },
    showChoices (evt) {
      let value = evt.srcElement.value
      let [input, key] = /^([a-z]+)?\s*/i.exec(value)
      let choices = []
      console.log(input, key)
      if (key) {
        key = key.toUpperCase()
        if (bcMap[key]) {
          choices = choices.concat(bcMap[key])
        }
        // 继续查找去掉前缀后是否有匹配
        let match = qPrefixReg.exec(key)
        let prefix = match ? (match[1] || '').toUpperCase() : ''
        let name = match ? (match[2] || '').toUpperCase() : ''
        if (bcMap[name]) {
          bcMap[name].forEach((item) => {
            choices.push(`${qOpMap[prefix] || ''}${item}`)
          })
        }
        this.bcChoices = choices
      }
    },
    insertToFormula (evt) {
      const qReg = /^([a-zA-Z]+)\s+([a-zA-Z]*)\s*([0-9.]+)?(\s*\d+)?/i
      const hanReg = /^([\w\W]+)\s+([先后开去粉冲捣兑包嚼，]*)?\s*([0-9.]+)/
      let val, name, ex, dose, choice
      console.log(qReg.test(evt.srcElement.value))
      if (qReg.test(evt.srcElement.value)) {
        // 使用音序快捷输入
        [val, name, ex, dose, choice] = qReg.exec(evt.srcElement.value)
        // 用于重名时选取备选词
        choice = parseInt(choice) || 1
        // console.log('++++', choice, this.bcChoices)
        if (this.bcChoices.length > 0) {
          name = this.bcChoices[choice - 1]
        }
        ex = qExMap[ex.toUpperCase()] || ex
      } else if (hanReg.test(evt.srcElement.value)) {
        [val, name, ex, dose] = hanReg.exec(evt.srcElement.value)
      } else {
        return
      }
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
        case '粳米':
          unit = '把'
          break
        case '蜈蚣':
          unit = '条'
      }
      strArr.push(`${dose}${unit}`)
      // console.log(strArr.join(' '))
      this.formData.formula = (this.formData.formula || '') + strArr.join(' ') + '；'
      console.log(this.formData.formula)
      evt.srcElement.value = ''
      this.bcChoices = []
    },
    async handleSubmit () {
      console.log(this.formData)
      await Excel.run(async (context) => {
        const sheet = context.workbook.worksheets.getActiveWorksheet()
        const usedRange = sheet.getUsedRange().getLastRow()
        // const activeCell = context.workbook.getActiveCell()
        // activeCell.load('rowIndex')
        usedRange.load('rowIndex')
        await context.sync()
        console.log(sheet)
        console.log(usedRange.rowIndex)
        let cellRowIndex = usedRange.rowIndex + 1
        labels.forEach((v, k) => {
          let cell = sheet.getCell(cellRowIndex, k)
          cell.format.wrapText = true
          cell.values = [[this.formData[v] || '']]
          cell.numberFormat = [['yyyy-mm-d']]
        })
        this.$Message.success('录入成功')
        this.handleReset()
      })
    },
    handleReset () {
      // this.$refs['form'].resetFields()
      this.formData = {
        date: this.formData.date,
        formula: '',
        usage: '先煎 分钟;后下 分钟。诸药浸泡 分钟;大火烧开，文火再煎，第一遍 分钟，第二遍 分钟，第三遍 分钟;',
        dose: '剂/周 x 1'
      }
    }
  },
  created () {
    this.handleReset()
  }
}
</script>
<style lang="sass">
#content-header
  background: #2a8dd4;
  color: #fff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  line-height: 60px;
  overflow: hidden;

  h1
    font-size: 1.5rem;
    padding: 0 0.5rem;

#content-main
  background: #fff;
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
  padding: 15px;

.form-col .ivu-form-item-content
  display: flex;
  .inline-label
    min-width: 2.5rem;
    margin: 0 0.5rem 0 1rem;
</style>
