<template>
  <Layout style="height:100%">
    <Sider hide-trigger :style="{background: '#fff'}">
        <Menu active-name="1-1" theme="light" width="auto" :open-names="['1']">
            <MenuItem name="1-1" :to="{path: '/book/list'}">
              <Icon type="ios-leaf" />
              本草
            </MenuItem>
            <Submenu name="2">
                <template slot="title">
                    <Icon type="ios-bookmarks" />
                    经典
                </template>
                <MenuItem name="2-1">《内经》</MenuItem>
                <MenuItem name="2-2">《伤寒》</MenuItem>
                <MenuItem name="2-3">《金匮》</MenuItem>
                <MenuItem name="2-4">《难经》</MenuItem>
                <MenuItem name="2-5">《温经》</MenuItem>
                <MenuItem name="2-6">《温病论》</MenuItem>
                <MenuItem name="2-7">《本经》</MenuItem>
            </Submenu>
            <Submenu name="3">
                <template slot="title">
                    <Icon type="ios-color-wand" />
                    针灸
                </template>
                <MenuItem name="3-1">《针灸大成》</MenuItem>
                <MenuItem name="3-2">《甲乙经》</MenuItem>
            </Submenu>
        </Menu>
    </Sider>
    <Content :style="{ padding: '15px', minHeight: '280px', background: '#fff'}">
        <router-view />
    </Content>
  </Layout>
</template>

<style lang="sass" scoped>
.ivu-layout-sider, .ivu-menu-vertical
  height: 100%
</style>


<script>
export default {
  name: 'book'
}
</script>

