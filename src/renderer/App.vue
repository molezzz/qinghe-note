<template>
  <div id="app">
    <router-view></router-view>
    <Drawer :title="searchTitle" width="480" placement="left" :closable="false" v-model="showSearchResult">
      <template v-if="searchResult.length > 0">
        <template v-if="searchType === 'formulas'">
          <FormulaCard v-for="item in searchResult" :key="item.id" :item="item"></FormulaCard>
        </template>
        <template v-if="searchType === 'medicines'">
          <MedicineCard v-for="item in searchResult" :key="item.id" :item="item"></MedicineCard>
        </template>
      </template>
      <template v-else>
        无结果
      </template>  
    </Drawer>
  </div>
</template>

<style>
html,body,#app{
  height: 100%;
}
</style>

<script>
  import path from 'path'
  import fs from 'fs'
  import FormulaCard from './components/books/formula_card'
  import MedicineCard from './components/books/medicine_card'
  import { Like } from 'typeorm'
  import { Formula } from './entity/Formula'
  import { Medicine } from './entity/Medicine'

  export default {
    name: 'qinghe',
    data () {
      return {
        searchResult: []
      }
    },
    computed: {
      showSearchResult: {
        get: function () {
          return this.$store.state.GlobalSearch.open
        },
        set: function (val) {
          this.$store.dispatch('searchOpen', val)
        }
      },
      searchTitle: function () {
        let map = {
          formulas: '方剂',
          medicines: '本草'
        }
        return `${map[this.$store.state.GlobalSearch.type]}「${this.$store.state.GlobalSearch.key}」 搜索结果：`
      },
      searchType: function () {
        return this.$store.state.GlobalSearch.type
      }
    },
    components: {
      FormulaCard,
      MedicineCard
    },
    created () {
      // console.log(this.$db)
      // this.$store.dispatch('search', { type: 'f', key: 'a' })
      fs.readdir(path.join(__static, 'formula_images'), (err, data) => {
        if (err) return
        let localImages = {}
        data.forEach((file) => {
          // console.log(file)
          localImages[file] = true
        })
        this.$store.dispatch('setLocalImages', { type: 'formula', data: localImages })
      })

      fs.readdir(path.join(__static, 'medicine_images'), (err, data) => {
        if (err) return
        let localImages = {}
        data.forEach((file) => {
          // console.log(file)
          let key = file.split('_')[0]
          localImages[key] = file
        })
        this.$store.dispatch('setLocalImages', { type: 'medicine', data: localImages })
      })
    },
    methods: {
      search () {
        let params = {}
        let keywords = this.$store.state.GlobalSearch.key
        let type = this.$store.state.GlobalSearch.type
        this.searchResult = []
        params['where'] = [
          { name: Like(`%${keywords}%`) },
          { alias: Like(`%${keywords}%`) }
        ]

        if (type === 'formulas') {
          Formula.find(params).then((data) => {
            this.searchResult = data
          })
        }

        if (type === 'medicines') {
          Medicine.find(params).then((data) => {
            this.searchResult = data
          })
        }
      }
    },
    watch: {
      searchTitle () {
        this.search()
      }
    }
  }
</script>

<style>
  /* CSS */
</style>
