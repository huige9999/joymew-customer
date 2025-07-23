<template>
    <!-- <router-view></router-view> -->
    <el-container class="container">
        <el-aside width="200px" class="aside">
            <div class="userInfo">
                <div class="avatarWrap">
                    <div class="shade outer"></div>
                    <div class="shade inner"></div>
                    <img :src="user.avator" class="avatarImg" alt="" />
                </div>
                <span class="name">{{ user.emcee_name }}</span>
            </div>
            <div class="menuWrap">
                <vue-scroll :ops="leftScrollOption">
                    <el-menu :default-active="activeMenuIndex" background-color="#0F3D5F" text-color="#909399"
                        active-text-color="#ffffff">
                        <div v-for="item in menus" :key="item.meta.index" class="menus">
                            <!-- 有子菜单 -->
                            <el-submenu :index="item.meta.index" v-if="item.children">
                                <template slot="title">
                                    <div class="menuItem">
                                        <i :class="item.meta.icon"></i>
                                        <span>{{ item.meta.title }}</span>
                                    </div>
                                </template>
                                <div v-for="subItem in item.children" :key="subItem.meta.index">
                                    <router-link :to="{ name: subItem.name }">
                                        <el-menu-item :index="subItem.meta.index">
                                            <div class="menuItem">{{ subItem.meta.title }}</div>
                                        </el-menu-item>
                                    </router-link>
                                </div>
                            </el-submenu>
                            <!-- 没有子菜单 -->
                            <router-link :to="{ name: item.name }" v-else>
                                <el-menu-item :index="item.meta.index">
                                    <div class="menuItem">
                                        <i :class="item.meta.icon"></i>
                                        <span slot="title">{{ item.meta.title }}</span>
                                    </div>
                                </el-menu-item>
                            </router-link>
                        </div>
                    </el-menu>
                    <div class="loginOut" @click="loginOut"><i class="el-icon-joymew-iconfonticon2"></i>退出</div>
                </vue-scroll>
            </div>
        </el-aside>
        <el-main class="main">
            <!-- <router-view /> -->
            <div class="navbar">
                <el-breadcrumb class="app-breadcrumb" separator="/">
                    <transition-group name="breadcrumb">
                        <el-breadcrumb-item v-for="item in $route.matched" :key="item.path">
                            <span class="no-redirect">{{ item.meta.title }}</span>
                        </el-breadcrumb-item>
                    </transition-group>
                </el-breadcrumb>
            </div>
            <div class="tag-view">
                <el-tabs v-model="activeMenuIndex" type="card" @tab-click="tabClick" @tab-remove="removeTab">
                    <el-tab-pane v-for="item in editableTabs" :closable="item.name !== '1'" :key="item.name"
                        :label="item.title" :name="item.name">
                    </el-tab-pane>
                </el-tabs>
            </div>
            <section class="app-main">
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <router-view :key="key" />
                    </keep-alive>
                </transition>
            </section>

        </el-main>
    </el-container>
</template>

<script>
import partnerRoutes from '@/router/partner/index';
import isThirdRoute from '@/utils/isThirdRoute';
import {
  login,
} from '@/api/partnerSystem/index';
import { setTokenPartner } from '@/utils/request';

export default {
  name: 'partnerIndex',
  data() {
    return {
      editableTabs: [],
      menus: [],
      leftScrollOption: {
        vuescroll: {},
        scrollPanel: {},
        rail: {},
        bar: {
          background: '#c1c1c1',
          opacity: 0.3,
        },
      },
      activeMenuIndex: '1',
      cachedViews: '',
      user: {},
    };
  },
  created() {
    console.log('当前路由', this.$route);
    this.menus = partnerRoutes[1].children.filter((item) => !item.hidden);
    console.log('菜单数组', this.menus);
    this.activeMenuIndex = this.$route.meta.index;

    const token = localStorage.getItem('tokenPartner');
    const phone = localStorage.getItem('phone');
    const password = localStorage.getItem('password');
    login({
      phone,
      password,
    }).then((res) => {
      const target = res.data;
      console.log(target);
      if (target.emcee_name) {
        this.$store.dispatch('partner/changeUserInfo', target);
        localStorage.setItem('tokenPartner', target.token);
        setTokenPartner(token);
      }
    });

    // 初始化标签
    this.addTag();
    // 获取用户数据
    this.user = this.$store.state.partner.user;
  },
  computed: {
    key() {
      return this.$route.path;
    },
    cachedTags() {
      const { caches } = this.$store.state.partner;
      return caches.join(',');
    },
  },
  watch: {
    $route() {
      this.addTag();
      this.turnToCurrentPage();
    },
  },
  methods: {
    loginOut() {
      localStorage.removeItem('tokenPartner');
      window.location.href = `${window.location.origin}/hm-customer/index.html#/partnerSystem/login` || 'https://www.hudongmiao.com/hm-customer/index.html#/partnerSystem/login';
    },
    addTag() {
      const resRoute = isThirdRoute(this.menus, this.$route.name);
      const target = {
        title: this.$route.meta.title,
        path: this.$route.fullPath,
        name: this.$route.meta.index,
        cpnName: this.$route.name,
      };
      if (resRoute && resRoute.parent) {
        target.parent = resRoute.parent;
      }
      this.$store.dispatch('partner/addCachedTag', target).then(() => {
        this.editableTabs = this.$store.state.partner.cachedTags;
      });
    },
    removeTab(e) {
      this.$store.dispatch('partner/removeCachedTag', e).then(() => {
        this.editableTabs = this.$store.state.partner.cachedTags;
        const target = this.editableTabs[this.editableTabs.length - 1];
        if (e === this.activeMenuIndex) {
          this.$router.push(target.path).catch(() => {});
        }
      });
    },
    tabClick(e) {
      const currentIndex = e.index;
      // this.$router.push(this.);
      this.$router.push({
        name: this.editableTabs[currentIndex].cpnName,
      });
    },
    turnToCurrentPage() {
      this.activeMenuIndex = this.$route.meta.index;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
    position: relative;
    width: 100%;
    height: 100%;

    .aside {
        background-color: #0f3d5f;

        .userInfo {
            width: 100%;
            height: 226px;
            padding: 60px 0 32px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;

            .avatarWrap {
                width: 81px;
                height: 81px;
                position: relative;

                .shade {
                    position: absolute;
                    border-radius: 50%;
                    background-color: rgba(255, 255, 255, 0.1);

                    &.inner {
                        width: 88px;
                        height: 88px;
                        left: -3.5px;
                        top: -3.5px;
                    }

                    &.outer {
                        width: 98px;
                        height: 98px;
                        left: -8.5px;
                        top: -8.5px;
                    }
                }

                .avatarImg {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }

            .name {
                font-size: 18px;
                color: #ffffff;
            }
        }

        .menuWrap {
            height: calc(100% - 226px);

            .menuItem {
                width: 100%;
                height: 100%;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .loginOut {
                padding: 18px 0px 20px 23px;
                color: #909399;
                font-size: 14px;
                cursor: pointer;

                i {
                    margin-right: 10px;
                }

                &:hover {
                    background-color: rgb(12, 49, 76);
                }
            }
        }

    }

    .main {
        padding: 0;

        .navbar {
            height: 50px;
            overflow: hidden;
            position: relative;
            background: #fff;
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

            .app-breadcrumb.el-breadcrumb {
                display: inline-block;
                font-size: 14px;
                line-height: 50px;
                margin-left: 8px;

                .no-redirect {
                    color: #97a8be;
                    cursor: text;
                }
            }
        }

        .tag-view {
            // height: 50px;
            overflow: hidden;
            box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

            /deep/.el-tabs__header {
                margin-bottom: 0;
            }
        }

        .app-main {
            width: 100%;
            min-height: calc(100vh - 91px);
            padding: 20px;
            box-sizing: border-box;
            position: relative;
            overflow: hidden;
            background-color: #F7F8FA;
        }
    }
}
</style>
