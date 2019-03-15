<template>
  <div class="page-formulas" ref="page">
    <div class="topbar">
      <Input search enter-button placeholder="输入方名" v-model="keywords" @on-search="search"/>
    </div>
    <Scroll :on-reach-bottom="nextPage" :height="pageHeight" :distance-to-edge="1" class="item-list">
      <Card v-for="item in items" :key="item.id">
        <p slot="title">
            <Icon type="md-clipboard" />
            {{item.name}} <span class="alias" v-if="item.alias && item.alias != ''">（{{item.alias}}）</span>
        </p>
        <p class="main-col image" v-if="item.onlineImg">
          <span style="margin-left: -0.5em;">【图解】</span><br><br>
          <img :src="item.onlineImg">
        </p>
        <p class="main-col analysis">
          <span style="margin-left: -0.5em;">【组成】</span><br><br>
          <Table :columns="analysisTableCols" :data="tableData(item)"></Table>
        </p>
        <p class="main-col analysis" style="line-height: 2">
          <span style="margin-left: -0.5em;">【用量】</span><br><br>
          {{item.components}}
        </p>
        <p class="attr" v-if="item.category && item.category != ''">
          <Tag color="volcano">分类</Tag>
          {{item.category}}
        </p>
        <p class="attr" v-if="item.source && item.source != ''">
          <Tag color="volcano">出处</Tag>
          {{item.source}}
        </p>
        <p class="attr" v-if="item.effect && item.effect != ''">
          <Tag color="volcano">功用</Tag>
          {{item.effect}}
        </p>
        <p class="attr" v-if="item.taboo && item.taboo != ''">
          <Tag color="volcano">禁忌</Tag>
          {{item.taboo}}
        </p>
        <p class="attr" v-if="item.zhuZhi && item.zhuZhi != ''">
          <Tag color="volcano">主治</Tag>
          {{item.zhuZhi}}
        </p>
        <p class="attr" v-if="item.bingJi && item.bingJi != ''">
          <Tag color="volcano">病机</Tag>
          {{item.bingJi}}
        </p>
        <p class="attr" v-if="item.usage && item.usage!= ''">
          <Tag color="volcano">运用</Tag>
          {{item.usage}}
        </p>
        <p class="attr" v-if="item.fuFang && item.fuFang!= ''">
          <Tag color="volcano">附方</Tag>
          {{item.fuFang}}
        </p>
        <p class="attr" v-if="item.faq && item.faq!= ''">
          <Tag color="volcano">释疑</Tag>
          {{item.faq}}
        </p>
        <p class="attr" v-if="item.fangGe && item.fangGe!= ''">
          <Tag color="volcano">方歌</Tag>
          {{item.fangGe}}
        </p>        
        <Divider dashed />
        <p style="margin-bottom: 1em" v-if="item.notes.length > 0">注解：</p>
        <p class="note" v-for="note in item.notes" :key="note.id">
          <Tag color="geekblue">{{note.key}}</Tag>
          {{note.content}}
        </p>
     </Card>
    </Scroll>
  </div>
</template>

<style lang="sass">
.page-formulas
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
    .main-col
      font-size: 18px;
      margin-bottom: 1.5em;
    .image
      img
        width: 100%;
        margin: auto;
    .attr
      margin-bottom: 0.5rem;
  .item-list
    height: 300px;
    width: 100%;
  .alias
    font-size: 14px;
    color: #999;

  .ivu-table .ivu-table-row
    .cell-red
      background-color: #fff1f0;
      color: #fa541c;
    .cell-orange
      background-color: #fff2e8;
      color: #fa8c16;
    .cell-green
      background-color: #f6ffed;
      color: #52c41a;
    .cell-gold
      background-color: #fffbe6;
      color: #faad14;
</style>


<script>
import { setTimeout } from 'timers'
import { Like } from 'typeorm'
import { Formula } from '../../entity/Formula'
// import Importer from '../../utils/data_importer'

export default {
  name: 'formula',
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
      analysisTableCols: [
        {
          title: '',
          key: 'position',
          width: 60,
          align: 'center'
        },
        {
          title: '名称',
          key: 'name',
          width: 100
        },
        {
          title: '药效',
          key: 'effect'
        },
        {
          title: '备注',
          key: 'remark'
        }
      ]
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
      Formula.find(params).then((r) => {
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
    nextPage () {
      if (this.next === null || this.loading) return
      this.loadData()
    },
    search () {
      this.next = 1
      this.items = []
      this.loading = false
      this.nextPage()
    },
    tableData (item) {
      let data = item.analysisTable
      if (!data) return []
      data.map((row) => {
        switch (row.position) {
          case '君':
            row.cellClassName = {
              position: 'cell-red'
            }
            break
          case '臣':
            row.cellClassName = {
              position: 'cell-orange'
            }
            break
          case '佐':
            row.cellClassName = {
              position: 'cell-green'
            }
            break
          case '使':
            row.cellClassName = {
              position: 'cell-gold'
            }
            break
        }
      })

      return data
    }
  },
  mounted () {
    // Importer.importFormulaFromJson(this.$db)
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
