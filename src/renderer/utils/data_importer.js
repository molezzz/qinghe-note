
import fs from 'fs'
import path from 'path'
import { Medicine } from '../entity/Medicine'
import { Note } from '../entity/Note'
import { Formula } from '../entity/Formula'
import {sify} from 'chinese-conv'
import { Like } from 'typeorm'

const attrMap = {
  '类别': 'category',
  '英文': 'nameEn',
  '产地': 'origin',
  '性味': 'xingWei',
  '功效': 'effect'
}

const jsonToMedicine = function (record, item) {
  record.key = item.key
  record.onlineImg = item.img
  if (!record.name) {
    record.name = item.name
  }
  Object.keys(item.attrs).forEach((key) => {
    if (attrMap[key] && item.attrs[key]) {
      if (!record[attrMap[key]] || record[attrMap[key]] === '') {
        record[attrMap[key]] = item.attrs[key]
      }
    }
  })

  return record
}

const data = {
  mergeMedicine (db) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../tools/medicine.json'), 'utf8'))
    let exists = []
    let nonExists = []
    let count = []

    data.forEach((item) => {
      Medicine.find({
        'where': [
          { name: Like(`%${item.name}%`) },
          { alias: Like(`%${item.name}%`) }
        ]
      }).then((r) => {
        count.push(1)
        // console.log(r)
        if (r && r.length > 0) {
          let record = jsonToMedicine(r[0], item)
          exists.push(record)
          // console.log(record)
        } else {
          if (item.name) {
            let record = jsonToMedicine(new Medicine(), item)
            nonExists.push(record)
            // console.log(record)
          } else {
            console.log(item)
          }
        }
        if (count.length === data.length) {
          console.log(nonExists)
          console.log(exists)
          db.manager.save(nonExists).then((r) => {
            console.log(r)
          })
          db.manager.save(exists).then((r) => {
            console.log(r)
          })
        }
      })
    })
  },
  importFormulaFromJson (db) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../tools/fangji.json'), 'utf8'))

    let attrMap = {
      '中文': 'name',
      '英文': 'nameEn',
      '分类': 'category',
      '出处': 'source',
      '组成': 'components',
      '用法': 'jianFa',
      '主治': 'zhuZhi',
      '病机': 'bingJi',
      '運用': 'usage',
      '方歌': 'fangGe',
      '附方': 'fuFang',
      '释疑': 'faq',
      '功用': 'effect'
    }

    let records = []
    data.forEach((item) => {
      let detail = item['details']
      let record = new Formula()

      Object.entries(detail).forEach((arr) => {
        if (attrMap[arr[0]]) {
          record[attrMap[arr[0]]] = arr[1]
        }
      })
      record.analysisTable = item['formula_table']
      record.key = item['key']
      record.onlineImg = item['img']
      record.link = item['link']
      record.alias = record.name
      record.name = sify(record.name)
      // console.log(record)
      records.push(record)
    })
    db.manager.save(records).then((r) => {
      console.log(r)
    })
  },
  importMedicineFromJson (db) {
    let data = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../tools/shennong.json'), 'utf8'))
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
      db.manager.save([record]).then((r) => {
        console.log(r)
      })
      // console.log({record, notes})
    })
  }
}

export default data
