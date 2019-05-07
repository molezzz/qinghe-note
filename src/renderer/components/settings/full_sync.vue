<template>
  <Card title="全量同步" :padding="20" shadow>
    <h3>总计: {{users.length}} 人</h3>
    <Progress :percent="loadPercent" status="active" />
    <Tag color="success" v-if="syncOK">成功</Tag>
    <Button v-else type="primary" :loading="loadPercent < 100 || sync" style="margin-top: 1rem" @click="syncToDB">
      <span v-if="loadPercent < 100">获取数据中...</span>
      <span v-if="loadPercent == 100 && sync">保存数据中...</span>
      <span v-else>开始同步</span>
    </Button>
  </Card>
</template>

<script>
import { Member } from '../../entity/Member'
import solarLunar from 'solarLunar'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { Record } from '../../entity/Record'
import { CustomFormula } from '../../entity/CustomFormula'
import { Note, NoteKind } from '../../entity/Note'

const baseUrl = 'https://www.rzit.top'
const cacheKey = 'qinghe-users'
const N2TDict = {
  '0': '零',
  '1': '一',
  '2': '二',
  '3': '三',
  '4': '四',
  '5': '五',
  '6': '六',
  '7': '七',
  '8': '八',
  '9': '九',
  '10': '十',
  '11': '十一',
  '12': '十二',
  '13': '十三',
  '14': '十四',
  '15': '十五',
  '16': '十六',
  '17': '十七',
  '18': '十八',
  '19': '十九',
  '20': '二十',
  '21': '二十一',
  '22': '二十二',
  '23': '二十三',
  '24': '二十四',
  '25': '二十五',
  '26': '二十六',
  '27': '二十七',
  '28': '二十八',
  '29': '二十九',
  '30': '三十',
  '31': '三十一'
}
const T2NDict = {}

Object.entries(N2TDict).forEach((item) => {
  T2NDict[item[1]] = item[0]
})

const lunarDict = {
  '正': '一',
  '腊': '十二',
  '廿': '二十',
  '卅': '三十',
  '冬': '十一',
  '初': '',
  '农': '',
  '历': '',
  '阴': ''
}

dayjs.locale('zh-cn')

const parseDate = function (d) {
  let date = null
  d = d || ''
  if (/(\d+)年([一二三四五六七八九十]+)月([一二三四五六七八九十]+)日?/.test(d)) {
    date = dayjs(`${RegExp.$1}-${T2NDict[RegExp.$2]}-${T2NDict[RegExp.$3]}`)
  } else if (/[阴农初廿腊正冬卅]+/.test(d)) {
    console.log('农历')
    let lunar = d.replace(/[正腊初廿卅农历阴]/g, (num) => {
      return lunarDict[num]
    })
    console.log(lunar)
    if (/(\d+)年([一二三四五六七八九十]+)月([一二三四五六七八九十]+)日?/.test(lunar)) {
      let info = solarLunar.lunar2solar(parseInt(RegExp.$1), parseInt(T2NDict[RegExp.$2]), parseInt(T2NDict[RegExp.$3]))
      date = dayjs(`${info.cYear}-${info.cMonth}-${info.cDay}`)
    }
  }
  if (date) return date.format('YYYY-MM-DD')
  return null
}

export default {
  data () {
    return {
      users: [],
      loadCount: 0,
      sync: false,
      syncOK: false
    }
  },
  computed: {
    loadPercent () {
      return Math.ceil((this.loadCount / this.users.length) * 100)
    }
  },
  methods: {
    async loadUsers () {
      let cache = localStorage.getItem(cacheKey)
      if (cache) {
        this.users = JSON.parse(cache)
        this.loadCount = this.users.length
        console.log(this.users)
        return
      }
      let res = await this.$http.post(`${baseUrl}/grape/patient/getConsiliaNameDir`, { content: {
        pageIdx: '1',
        recordPerPage: 1000
      }})
      this.users = res.data.content
      for (let i = 0; i < this.users.length; i++) {
        let records = await this.getUserRecords(this.users[i].patientInfoId)
        this.users[i].records = records
      }
      console.log(this.users)
      localStorage.setItem(cacheKey, JSON.stringify(this.users))
    },
    async getUserRecords (userId) {
      try {
        let res = await this.$http.post(`${baseUrl}/grape/patient/getConsiliaNameIntro`, { content: { patientInfoId: userId } })
        let arr = res.data.content
        let records = []

        for (let i = 0; i < arr.length; i++) {
          let res = await this.getRecord(arr[i].patientConditionId)
          res.data.content['id'] = arr[i].patientConditionId
          records.push(res.data.content)
        }
        this.loadCount = this.loadCount + 1
        return Promise.resolve(records)
      } catch (err) {
        console.log(err)
      }
    },
    async getRecord (recordId) {
      try {
        let res = await this.$http.post(`${baseUrl}/grape/patient/getConsiliaDetail`, { content: { patientConditionId: recordId } })
        return new Promise((resolve, reject) => {
          if (res.status === 200) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      } catch (err) {
        console.log(err)
      }
    },
    async syncToDB () {
      if (this.sync) return
      this.sync = true
      for (let idx = 0; idx < this.users.length; idx++) {
        let u = this.users[idx]
        let user = await Member.findOne({ where: { onlineId: parseInt(u.patientInfoId) } })
        let record = u.records[0]

        if (!user) {
          user = new Member()
          user.name = u.patientName
          user.onlineId = parseInt(u.patientInfoId)
          user.sex = u.patientSex === '男'
          if (record) {
            user.age = parseInt(record.age) > 0 ? parseInt(record.age) : null
            user.birthday = parseDate(record.birthday)
            user.birthdayRaw = record.birthday
            user.exdata = { zodiac: record.zodiac }
          }
          await user.save()
        }
        for (let i = 0; i < u.records.length; i++) {
          let r = await Record.findOne({ where: { onlineId: parseInt(u.records[i].id) } })

          if (!r) {
            let newRecord = new Record()
            let formula = new CustomFormula()

            newRecord.member = user
            newRecord.onlineId = parseInt(u.records[i].id)
            newRecord.treatmentAt = u.records[i].visitingDate
            newRecord.summary = u.records[i].addCondition
            newRecord.tongue = u.records[i].tongue
            newRecord.pulse = u.records[i].pulse
            newRecord.cause = u.records[i].analysis
            await newRecord.save()
            await newRecord.reload()

            console.log(newRecord)

            if (u.records[i].zhaoSirSay && u.records[i].zhaoSirSay !== '') {
              let note = new Note()
              note.kind = NoteKind.ZHAO
              note.content = u.records[i].zhaoSirSay
              note.record = newRecord

              await note.save()
              console.log(note)
            }

            formula.rawData = u.records[i].prescriptionDetail
            formula.usage = { raw: u.records[i].prescriptionMethod }
            formula.dose = u.records[i].prescriptionDuration
            formula.advice = u.records[i].advice
            formula.record = newRecord

            await formula.save()
            console.log(formula)
          }
        }
        console.log(user)
      }
      this.sync = false
      this.syncOK = true
    }
  },
  created () {
    this.loadUsers()
  }
}
</script>
