<template>
  <div class="page" ref="page">
    <div class="topbar">
      <Input search enter-button placeholder="输入药名" v-model="keywords" @on-search="search"/>
    </div>
    <Scroll :on-reach-bottom="nextPage" :height="pageHeight" :distance-to-edge="1" class="item-list">
      <MedicineCard v-for="item in items" :key="item.id" :item="item">
      </MedicineCard>
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
.item-list
  height: 300px;
  width: 100%;
</style>


<script>
import { Medicine } from '../../entity/Medicine'
import { setTimeout } from 'timers'
import { Like } from 'typeorm'
import MedicineCard from './medicine_card'
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
  components: {
    MedicineCard
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
