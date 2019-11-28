<template>
  <div class="page-limit">
    <div class="title">{{$t('goodsManagement.text53')}}</div>
    <div class="content">
      <div class="limit-table" slot="slot1">
        <table>
          <thead>
          <tr>
            <td v-for="(item, index) in $t('goodsManagement.tableHead')" :key="item" :class="{'first-thead': index === 0}">{{item}}</td>
          </tr>
          </thead>
          <v-loading v-show="loadingShow"></v-loading>
          <tbody>
          <tr class="cursor" v-for="(item, index) in goodsData" :key="index" @click="$router.push({path: '/buyGoods', query: {id: item.id}})">
            <td class="img-wrap first-td">
              <div class="img-box">
                <img v-if="item.infiniteSaleProduct.coverImg.split(',')[0].indexOf('http') > -1" :src="item.infiniteSaleProduct.coverImg.split(',')[0]" width="110" height="100" alt="">
                <img v-else :src="'http://ofydu65mj.bkt.clouddn.com/' + item.infiniteSaleProduct.coverImg.split(',')[0]" width="110" height="100" alt="">
                <span class="productName">{{item.infiniteSaleProduct.productName}}</span>
              </div>
            </td>
            <td>{{item.saleNum - item.finishNum}} / {{item.saleNum}}</td>
            <td>{{item.userName}}</td>
            <td class="red-color">{{$t('goodsManagement.text8')}}</td>
          </tr>
          </tbody>
        </table>
      </div>
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
      loadingShow: true,
      current_page: 1,
      tabIndex: 0,
      goodsData: [],
      pageSize: 10,
      noResult: false
    }
  },
  mounted () {
    this.getData(1)
  },
  methods: {
    parentTurnPage (page) { // 页码
      this.current_page = page
      this.getData(page)
    },
    getData (page) {
      this.$postAxios.post(`${this.$api2}infinite/userQueryCanPancicList`, {
        pageIndex: page,
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
