<template>
  <div class="teacher-saids" ref="teacher">
    <Button @click="downloadExcel">导出</Button>
    <Card v-for="note in this.notes" :key="note.id">
      <p slot="title">{{note.record.treatmentAt | dayjs}}</p>
      <div>
        <h4 class="words">
          {{note.content}}
        </h4>
        <Row>
          <Col span="8">
            <p v-for="(f,idx) in note.record.customFormulas" :key="idx">
              <Tag color="green">方{{idx + 1}}</Tag>
              {{f.rawData}}
            </p>
          </Col>
          <Col span="8">
            <Tag color="red">主诉</Tag>
            {{note.record.summary}}
          </Col>
          <Col span="8">
            <p>{{note.record.member.name}} {{note.record.member.sex ? '男' : '女'}}</p>
            <p>{{note.record.member.age}} {{note.record.member.birthdayRaw}}</p>
            <p>{{note.record.member.exdata.zodiac}}</p>
            <p v-if="note.record.pulse">
              <Tag color="purple">脉象</Tag>
              {{note.record.pulse}}
            </p>
            <p v-if="note.record.tongue">
              <Tag color="magenta">舌象</Tag>
              {{note.record.tongue}}
            </p>
          </Col>
        </Row>
      </div>
    </Card>
  </div>
</template>
<style lang="sass">
.teacher-saids
  padding: 1rem;
  width: 100%;

  .ivu-card
    margin-bottom: 0.3rem;

    .words
      padding: 1rem;
      font-size: 1.2rem;
    .ivu-col
      padding: 0.8rem
      line-height: 1.5rem;
</style>

<script>
import { Note, NoteKind } from '../../entity/Note'
import { IsNull, Not } from 'typeorm'
import XLSX from 'xlsx'
import { saveAs } from 'file-saver'
// import path from 'path'
// import { remote } from 'electron'

const s2ab = function (s) {
  let buf = new ArrayBuffer(s.length)
  let view = new Uint8Array(buf)
  for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF
  return buf
}

export default {
  data () {
    return {
      next: 1,
      perpage: 2000,
      notes: [],
      contextMenuTarget: null,
      contextMenuVisible: true
    }
  },
  methods: {
    async loadData () {
      let params = {
        skip: (this.next - 1) * this.perpage,
        take: this.perpage,
        relations: ['record', 'record.customFormulas', 'record.member'],
        where: {
          kind: NoteKind.ZHAO,
          recordId: Not(IsNull())
        }
      }
      this.notes = await Note.find(params)
    },
    downloadExcel () {
      let _headers = ['师说', '方剂', '主诉', '病人']
      let headers = _headers
        .map((v, i) => Object.assign({}, { v: v, position: String.fromCharCode(65 + i) + 1 }))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: { v: next.v } }), {})
      // console.log(headers)

      let _data = this.notes.map((v) => {
        return [
          v.content,
          v.record.customFormulas.map((f) => {
            return `方：${f.rawData}`
          }).join(`\n`),
          v.record.summary,
          `${v.record.member.name} \n ${v.record.member.sex ? '男' : '女'} \n ${v.record.member.age} \n ${v.record.member.birthdayRaw}`
        ]
      })
      let data = _data.map((v, i) => {
        return v.map((k, j) => Object.assign({}, { v: k, position: String.fromCharCode(65 + j) + (i + 2) }))
      })
        .reduce((prev, next) => prev.concat(next))
        .reduce((prev, next) => Object.assign({}, prev, { [next.position]: {v: next.v} }), {})
      // console.log(data)
      let output = Object.assign({}, headers, data)
      // 获取所有单元格的位置
      let outputPos = Object.keys(output)
      // console.log(outputPos)
      // 计算出范围
      let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]

      // 构建 workbook 对象
      let wb = {
        SheetNames: ['mySheet'],
        Sheets: {
          'mySheet': Object.assign({}, output, { '!ref': ref })
        }
      }
      // console.log(wb)
      // XLSX.writeFile(wb, 'output.xlsx')

      let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' }

      let wbout = XLSX.write(wb, wopts)

      /* the saveAs call downloads a file on the local machine */
      saveAs(new Blob([s2ab(wbout)], { type: '' }), 'zhao_said.xlsx')
    }
  },
  mounted () {
    this.loadData()
    this.contextMenuTarget = this.$refs.teacher
  }
}
</script>
