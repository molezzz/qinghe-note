<template>
  <Card class="medicine-card">
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
</template>
<style lang="sass">
.medicine-card.ivu-card
  margin-top: 1em;

  .ivu-card-head p
    font-size: 16px;
  .benjing
    font-size: 18px;
    margin-bottom: 1.5em;

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
import path from 'path'
export default {
  data () {
    return {}
  },
  props: {
    item: Object
  },
  computed: {
    localImages () {
      return this.$store.state.GlobalSearch.localMedicineImages
    }
  },
  methods: {
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
    }
  }
}
</script>
