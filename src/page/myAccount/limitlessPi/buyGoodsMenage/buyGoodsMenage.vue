<template>
  <div class="page-limit">
    <div class="title">{{$t('buyGoodsMenage.text1')}}</div>
    <div class="content">
      <tab
        :tabIndex="tabIndex"
        :tabMenu="$t('buyGoodsMenage.tabMenu')"
        @changeTab="changeTab"
      >
        <!-- 1 待抢购-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('buyGoodsMenage.tableHead')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <v-loading v-show="loadingShow"></v-loading>
            <tbody>
            <tr v-for="(item, index) in goodsData" :key="index" class="cursor" @click="$router.push({path: '/account/buyGoodsMenage/buyGoodsMenageDetail', query: {id: item.id}})">
              <td class="img-wrap first-td">
                <div>
                  <img :src="imgUrlLogo(item.infiniteSaleProduct.coverImg)" alt="" width="100" height="100">
                  <!--<img v-if="item.infiniteSaleProduct.coverImg.split(',')[0].indexOf('http') > -1" :src="item.infiniteSaleProduct.coverImg.split(',')[0]" width="100" height="100" alt="">-->
                  <!--<img v-else :src="'http://ofydu65mj.bkt.clouddn.com/' + item.infiniteSaleProduct.coverImg.split(',')[0]" width="100" height="100" alt="">-->
                  <span>{{item.infiniteSaleProduct.productName}}</span>
                </div>
              </td>
              <td>{{item.saleNum - item.finishNum}} / {{item.saleNum}}</td>
              <td>
                <p>{{item.bidPrice | fourNumber}}π</p>
              </td>
              <td>{{item.infiniteSaleProduct.merchantName}}</td>
              <td class="red-color">{{$t('buyGoodsMenage.text2')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 2已完结 -->
        <div class="limit-table" slot="slot2">
          <table>
            <thead>
            <tr>
              <td v-for="(item, index) in $t('buyGoodsMenage.tableHead')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in goodsData" :key="index" class="cursor" @click="$router.push({path: '/account/buyGoodsMenage/buyGoodsMenageDetail', query: {id: item.id}})">
              <td class="img-wrap first-td">
                <div>
                  <img :src="imgUrlLogo(item.infiniteSaleProduct.coverImg)" alt="" width="100" height="100">
                  <!--<img v-if="item.infiniteSaleProduct.coverImg.indexOf('http') > -1" :src="item.infiniteSaleProduct.coverImg" width="100" height="100" alt="">-->
                  <!--<img v-else :src="'http://ofydu65mj.bkt.clouddn.com/' + item.infiniteSaleProduct.coverImg" width="100" height="100" alt="">-->
                  <span>{{item.infiniteSaleProduct.productName}}</span>
                </div>
              </td>
              <td>{{item.saleNum - item.finishNum}} / {{item.saleNum}}</td>
              <td>
                <p>{{item.bidPrice | fourNumber}}π</p>
              </td>
              <td>{{item.infiniteSaleProduct.merchantName}}</td>
              <td class="red-color">{{$t('buyGoodsMenage.text2')}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </tab>
      <div class="no-result" v-show="noResult">
        <div class="load-more-box">
          <div class="loading-img">
            <img src="../../../../assets/images/home/nodata.png" alt="">
          </div>
          <p class="desc">{{$t('home.text11')}}!</p>
        </div>
      </div>
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
    </div>
  </div>
</template>

<script>
import tab from '@/components/tab'
export default {
  data () {
    return {
      totalPage: 0,
      goodsData: [],
      noResult: false,
      loadingShow: true,
      pageSize: 10,
      tabIndex: 0
    }
  },
  created () {
    this.getData(1, 1)
  },
  methods: {
    parentTurnPage (page) {
      this.getData(this.tabIndex + 1, page)
    },
    imgUrlLogo (coverImg) {
      coverImg = coverImg.split(',')[0]
      if (coverImg.indexOf('http') > -1) {
        return coverImg
      } else {
        return 'http://ofydu65mj.bkt.clouddn.com/' + coverImg
      }
    },
    changeTab (index) {
      this.totalPage = 0
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.tabIndex = index
      this.noResult = false
      this.goodsData = []
      this.getData(index + 1, 1)
    },
    getData (queryType, pageIndex) {
      this.$postAxios.post(`${this.$api2}infinite/queryinfiniteRecordList`, {
        queryType: queryType,
        pageIndex: pageIndex,
        pageSize: this.pageSize
      }).then(res => {
        this.loadingShow = false
        if (res.data.status === 'success') {
          this.goodsData = res.data.data.infiniteRecordList
          this.totalPage = res.data.data.totalPage
          if (this.goodsData.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  components: {
    tab,
    vLoading: resolve => require(['@/components/loading.vue'], resolve),
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
</style>
