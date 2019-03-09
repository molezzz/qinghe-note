<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
    }
    .layout-header-bar{
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item {
      display: flex;
      flex-direction: column;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease, opacity .2s ease .2s;
    }
    
    .ivu-menu-item:nth-child(1) span { transition-delay: 0.1s }
    .ivu-menu-item:nth-child(2) span { transition-delay: 0.2s }
    .ivu-menu-item:nth-child(3) span { transition-delay: 0.3s }
    .ivu-menu-item:nth-child(4) span { transition-delay: 0.4s }
    .ivu-menu-item:nth-child(5) span { transition-delay: 0.5s }

    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0;
        height: 0;
        opacity: 0;
        transition: width .2s ease, opacity .2s ease .2s;
    }
    .collapsed-menu i{
        transform: translate(1px, 10px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 28px;
    }
    .ivu-layout {
        height: 100%;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Sider ref="sidebar" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                <Menu active-name="1-2" theme="dark" width="auto" :class="menuitemClasses">
                    <MenuItem name="1-1" :to = "{ path: '/dashboard' }">
                        <Icon type="ios-navigate"></Icon>
                        <span>面板</span>
                    </MenuItem>
                    <MenuItem name="1-2" :to="{ path: '/record/list' }">
                        <Icon type="ios-bookmarks-outline" />
                        <span>记录</span>
                    </MenuItem>
                    <MenuItem name="1-3" :to="{ path: '/member/list' }">
                        <Icon type="md-contacts" />
                        <span>患者</span>
                    </MenuItem>
                    <MenuItem name="1-4" :to="{ path: '/book/list' }">
                        <Icon type="ios-archive-outline" />
                        <span>资料</span>
                    </MenuItem>
                    <MenuItem name="1-5" :to="{ path: '/setting/list' }">
                        <Icon type="ios-settings"></Icon>
                        <span>设置</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar">
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon>
                </Header>
                <Content :style="{margin: '5px', background: '#fff', minHeight: '260px', height: '100%'}">
                    <transition name="fade-transform" mode="out-in">
                      <router-view/>
                    </transition>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
export default {
  data () {
    return {
      isCollapsed: false,
      currentLink: null
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.sidebar.toggleCollapse()
    }
  }
}
</script>
