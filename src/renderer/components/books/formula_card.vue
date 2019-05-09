<template>
  <Card class="formula-card">
    <p slot="title">
        <Icon type="md-clipboard" />
        {{item.name}} <span class="alias" v-if="item.alias && item.alias != ''">（{{item.alias}}）</span>
    </p>
    <p class="main-col image" v-if="item.onlineImg">
      <span style="margin-left: -0.5em;">【图解】</span><br><br>
      <img :src="imageSrc(item)">
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
</template>
<style lang="sass">
.formula-card.ivu-card
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
import path from 'path'
export default {
  data () {
    return {
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
  props: {
    item: Object
  },
  computed: {
    localImages () {
      return this.$store.state.GlobalSearch.localFormulaImages
    }
  },
  methods: {
    imageSrc (item) {
      let fileName = `${item.key}.jpg`
      if (this.localImages) {
        return 'file://' + path.join(__static, 'formula_images', fileName)
        // return 'data:image/jpg;base64' + Buffer.from(fs.readFileSync(path.join(__static, 'formula_images', fileName))).toString('base64')
      }
      if (item.onlineImg) {
        return item.onlineImg
      }
      return null
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
  }
}
</script>
