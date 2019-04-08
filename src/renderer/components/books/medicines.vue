<template>
  <div class="page" ref="page">
    <div class="topbar">
      <Input search enter-button placeholder="输入药名" v-model="keywords" @on-search="search"/>
    </div>
    <Scroll :on-reach-bottom="nextPage" :height="pageHeight" :distance-to-edge="1" class="item-list">
      <Card v-for="item in items" :key="item.id">
        <p slot="title">
            <Icon type="ios-leaf"></Icon>
            {{item.name}} <span class="alias" v-if="item.alias && item.alias != ''">（{{item.alias}}）</span>
        </p>
        <div class="benjing-image">
          <p class="benjing">
            <span style="margin-left: -0.5em;">【本经原文】</span><br><br> {{item.benJing}}
          </p>
          <Poptip placement="bottom-end" width="672" v-if="item.onlineImg">
            <img :src="imageSrc(item)">
            <div slot="content">
              <img :src="imageSrc(item)">
            </div>
          </Poptip>
        </div>
        <p class="attr" v-if="item.xingWei && item.xingWei != ''">
          <Tag color="volcano">性味</Tag>
          {{item.xingWei}}
        </p>
        <p class="attr" v-if="item.origin && item.origin != ''">
          <Tag color="volcano">产地</Tag>
          {{item.origin}}
        </p>
        <p class="attr" v-if="item.effect && item.effect != ''">
          <Tag color="volcano">功效</Tag>
          {{item.effect}}
        </p>
        <p class="attr" v-if="item.taboo && item.taboo != ''">
          <Tag color="volcano">禁忌</Tag>
          {{item.taboo}}
        </p>
        <p class="attr" v-if="item.paoZhi && item.paoZhi != ''">
          <Tag color="volcano">炮制</Tag>
          {{item.paoZhi}}
        </p>
        <p class="attr" v-if="item.dose && item.dose != ''">
          <Tag color="volcano">用量</Tag>
          {{item.dose}}
        </p>        
        <Divider dashed />
        <p style="margin-bottom: 1em">注解：</p>
        <p class="note" v-for="note in item.notes" :key="note.id">
          <Tag color="geekblue">{{note.key}}</Tag>
          {{note.content}}
        </p>
     </Card>
    </Scroll>
  </div>
</template>

<style lang="sass" scoped>
.page
  display: flex;
  margin: 5px;
  width: 100%;
  flex-direction: column;

.topbar
  margin: 10px 0;
.ivu-card
  margin-top: 1em;

  .ivu-card-head p
    font-size: 16px;
  .benjing
    font-size: 18px;
    margin-bottom: 1.5em;
.item-list
  height: 300px;
  width: 100%;
.alias
  font-size: 14px;
  color: #999;
.benjing-image
  display: flex;
  align-items: flex-start;
  .benjing
    flex-grow: 1;
  .ivu-poptip
    min-width: 35%;
    max-width: 35%;
    margin-left: 1rem;

    .ivu-poptip-rel img 
      width: 100%;

</style>


<script>
import { Medicine } from '../../entity/Medicine'
import { setTimeout } from 'timers'
import { Like } from 'typeorm'
import path from 'path'
import fs from 'fs'
// import Importer from '../../utils/data_importer'

export default {
  name: 'medicine',
  data () {
    return {
      items: [],
      next: 1,
      perpage: 5,
      pageHeight: 0,
      loading: false,
      searchBarHeight: 64,
      keywords: null,
      searchTimeId: null,
      localImages: {}
    }
  },
  methods: {
    loadData () {
      let params = {
        skip: (this.next - 1) * this.perpage,
        take: this.perpage
      }
      if (this.keywords) {
        params['where'] = [
          { name: Like(`%${this.keywords}%`) },
          { alias: Like(`%${this.keywords}%`) }
        ]
      }
      // console.log(params)
      if (this.loading) return
      this.loading = true
      Medicine.find(params).then((r) => {
        if (r.length < 1) {
          this.next = null
          return
        }
        setTimeout(() => {
          this.items = Array.concat(this.items, r)
          this.next++
          this.loading = false
        }, 800)
      })
    },
    imageSrc (item) {
      let fileName = this.localImages[item.key]
      console.log(fileName)
      if (fileName) {
        return 'file://' + path.join(__static, 'medicine_images', fileName)
        // return 'data:image/jpg;base64' + Buffer.from(fs.readFileSync(path.join(__static, 'formula_images', fileName))).toString('base64')
      }
      if (item.onlineImg) {
        return item.onlineImg
      }
      return null
    },
    nextPage () {
      if (this.next === null || this.loading) return
      this.loadData()
    },
    search () {
      this.next = 1
      this.items = []
      this.loading = false
      this.nextPage()
    }
  },
  mounted () {
    // Importer.importMedicineFromJson(this.$db)
    // Importer.mergeMedicine(this.$db)
    fs.readdirSync(path.join(__static, 'medicine_images')).forEach((file) => {
      // console.log(file)
      let key = file.split('_')[0]
      this.localImages[key] = file
    })
    window.onresize = () => {
      this.pageHeight = this.$refs['page'].offsetHeight - this.searchBarHeight
    }
    this.$nextTick(() => {
      this.pageHeight = this.$refs['page'].offsetHeight - this.searchBarHeight
      this.loadData()
    })
  }
}
</script>
