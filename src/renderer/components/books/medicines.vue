<template>
  <div>本草</div>  
</template>

<script>
import fs from 'fs'
import path from 'path'
import { Medicine } from '../../entity/Medicine'
import { Note } from '../../entity/Note'

export default {
  name: 'medicine',
  methods: {
    importFromJson () {
      let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../../tools/shennong.json'), 'utf8'))
      let attrMap = {
        '本经原文': 'benJing',
        '产地': 'origin',
        '主治': 'effect',
        '用量': 'dose',
        '禁忌': 'taboo',
        '炮制': 'paoZhi',
        '性味': 'xingWei'
      }
      Object.entries(data).forEach((item) => {
        // console.log(item)
        let record = new Medicine()
        let notes = []
        record.name = item[0]
        Object.entries(item[1]).forEach((d) => {
          let key = d[0]
          let note = new Note()

          if (d[1] === '' || !d[1]) return
          if (attrMap[key]) {
            record[attrMap[key]] = d[1]
          } else {
            note.key = key
            note.content = d[1]
            note.kind = 1
            notes.push(note)
          }
        })
        record.notes = notes
        this.$db.manager.save([record]).then((r) => {
          console.log(r)
        })
        // console.log({record, notes})
      })
    }
  },
  created () {
    // this.importFromJson()
  }
}
</script>
