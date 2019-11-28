<template>
  <div class="home">
    <div class="home-box">
      <div class="home-content">
        <div class="content-title">
          <h3>{{$t('home.text1')}}</h3>
          <div class="my-bidding" @click="$router.push('/account/myAuction')">{{$t('home.text2')}}</div>
        </div>
        <div class="order-content">
          <ul class="order-tab">
            <li :class="{tabActive: orderTab === 1}" @click="toChoose(1)">{{$t('home.text3')}}</li>
            <li :class="{tabActive: orderTab === 2}" @click="toChoose(2)">{{$t('home.text4')}}</li>
          </ul>
          <div class="search-goods">
            <div class="input-item">
              <input type="text" class="input-goods" :placeholder="$t('home.text5')" v-model.trim="goodsName"/>
            </div>
            <div class="search" @click="searchGoods()">
              <div class="icon-fangdajing"></div>
            </div>
          </div>
        </div>
        <div class="warn-box" v-if="this.isboss === 2" @click="$router.push({path: '/sharerAudit', query: {shaddress: userData.address}})" v-show="isSharer">
            <span>{{$t('home.text6')}}</span><i>{{$t('home.text7')}} > ></i>
        </div>
        <div class="warn-box" v-if="this.isboss === 8" @click="$router.push('/becomeSharer')" v-show="isSharer">
          <span>{{$t('home.text6')}}</span><i>{{$t('home.text8')}} > ></i>
        </div>
        <v-loading v-show="loadingShow"></v-loading>
        <!--竞拍中列表-->
        <div class="order-list" v-if="orderTab === 1">
          <ul class="goods-item">
            <li v-for="(item,index) in bidList" :key="index" @click="toDetail(item)">
              <div class="img-box" v-if="item.coverImg.split(',')[0].indexOf('http') > -1"><img :src="item.coverImg.split(',')[0]" class="goodsImg"/></div>
              <div class="img-box" v-else><img :src="variable + item.coverImg.split(',')[0]" class="goodsImg"/></div>
              <div class="goods-dc">
                <p>{{item.productName}}</p>
                <div class="kucun"><span>{{$t('home.text12')}}：</span><i>{{item.saleNum}}</i></div>
                <div class="line"></div>
                <div class="price-box">
                  <span>{{$t('home.text9')}}：</span><i>{{item.nowBidPrice| fourNumber}} π</i>
                </div>
                <div class="time-box">
                  <span>{{$t('home.text10')}}： </span>
                  <div class="time">
                    <span class="hour">{{item.hour}}</span>
                    <span class="colon">：</span>
                    <span class="min">{{item.minute}}</span>
                    <span class="colon">：</span>
                    <span class="seconds">{{item.second}}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="load-more-box" v-show="noResultBidList">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="bidList.length !== 0" :propsPage="bidTotal" @bidTrun="bidTurnPage" ref="turnPage1"></v-turnPage>
        </div>
        <!--待开始列表-->
        <div class="order-list" v-if="orderTab === 2">
          <ul class="goods-item">
            <li v-for="(item,index) in startList" :key="index" @click="toDetail(item)">
              <div class="img-box" v-if="item.coverImg.split(',')[0].indexOf('http') > -1">
                <img :src="item.coverImg.split(',')[0]" class="goodsImg"/>
              </div>
              <div class="img-box" v-else>
                <img :src="variable + item.coverImg.split(',')[0]" class="goodsImg"/>
              </div>
              <div class="goods-dc">
                <p>{{item.productName}}</p>
                <div class="kucun"><span>{{$t('home.text12')}}: </span><i>{{item.saleNum}}</i></div>
                <div class="line"></div>
                <div class="price-box">
                  <span>{{$t('home.text13')}}: </span><i>{{item.nowBidPrice | fourNumber}} π</i>
                </div>
                <div class="time-box">
                  <span>{{$t('home.text14')}}: </span>
                  <div class="time">
                    <span class="year">{{$changeDate(item.startSaleDate, '-', 8)}}</span>
                    <!--<span class="colon">-</span>-->
                    <!--<span class="year">月</span>-->
                    <!--<span class="colon">-</span>-->
                    <!--<span class="year">{{item.day}}</span>-->
                    <!--<span class="hour">{{item.hour}}</span>-->
                    <!--<span class="colon">：</span>-->
                    <!--<span class="min">{{item.min}}</span>-->
                    <!--<span class="colon">：</span>-->
                    <!--<span class="seconds">{{item.sce}}</span>-->
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div class="load-more-box" v-show="noStartList">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="startList.length !== 0" :propsPage="startTotal" @bidTrun="startTurnPage" ref="turnPage1"></v-turnPage>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      orderTab: 1,
      loadingShow: true,
      noResultBidList: false,
      noStartList: false,
      isLoadMore: true,
      bidList: [], // 竞拍中列表
      startList: [], // 待开始列表
      bidLastTime: '', // 剩余时间
      goodsName: '', // 搜索商品名称
      hour: '',
      min: '',
      sce: '',
      year: '',
      month: '',
      day: '',
      bidTotal: 1, // 竞拍中页数
      bidPage: '', // 竞拍中分页
      startTotal: 1, // 待开始页数
      startPage: '', // 待开始分页
      variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
      timer: null,
      timeArr: [],
      isSharer: false,
      queryType: 1, // 1竞拍中 2待开始
      pageSize: 20,
      payState: '',
      paystatus: '',
      payStateFlag: false,
      homeAddress: ''
    }
  },
  computed: {
    ...mapGetters([
      'isboss',
      'userData'
    ])
  },
  created () {
    this.getBidList(1)
    this.isNoLoginFag()
    // this.getSharer()
  },
  // 挂载完成后，判断浏览器是否支持popstate
  mounted () {
    this.$nextTick(() => {
      if (window.history && window.history.pushState) {
        history.pushState(null, null, document.URL)
        window.addEventListener('popstate', this.goBack, false)
      }
    })
  },
  // 页面销毁时，取消监听。否则其他vue路由页面也会被监听
  destroyed() {
    window.removeEventListener('popstate', this.goBack, false)
  },
  // beforeDestroy () {
  //   clearInterval(this.timer)
  // },
  components: {
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve),
    vLoading: resolve => require(['@/components/loading.vue'], resolve)
  },
  methods: {
    /* toShareRecharge () {
      if (this.userData.isboss !== 1) {
        let url = `${this.$api2}pigame/queryByAddress?address=${this.homeAddress}`
        this.$http.post(url).then((res) => {
          if (res.data.status === 'success') {
            this.payState = res.data.data.payState
            this.paystatus = res.data.data.status // "status":0,// 状态 0--待审核 1--审核通过  2--暂停服务  3--审核被拒绝  4--被封禁(终止服务)
            this.payStateFlag = res.data.data.payState !== 2
          } else {
             this.resultCodeFlag = res.data.resultCode === 'NOT_FOUND'
          }
        })
      }
    }, */
    isNoLoginFag () {
      this.$http.get(`${this.$api}user/balance`).then((res) => {
        if (res.data.success === true) {
          this.homeAddress = res.data.data.user.address
          // this.toShareRecharge()
          if (res.data.data.user.isboss !== 1) {
            this.isSharer = true
          } else {
            this.isSharer = false
          }
        }
      })
    },
    goBack () {
      if (window.history.length > 1) {
        this.$router.go(1)
      }
    },
    /*eslint-disable*/
    // 1.6 代理商查询产品列表-竞价首页
    getBidList (page) { // 竞拍中列表
      let url = {}
      url.queryType = this.queryType
      url.pageSize = this.pageSize
      url.pageIndex = page
      url.productName = this.goodsName
      // if (this.goodsName) {
      //    url = `${this.$api2}infinite/userQueryProductList?queryType=1&pageSize=${this.pageSize}&pageIndex=${page}&productName=${this.goodsName}`
      // }else {
      //    url = `${this.$api2}infinite/userQueryProductList?queryType=1&pageSize=${this.pageSize}&pageIndex=${page}&productName=${this.goodsName}`
      // }
      this.$postAxios.post(`${this.$api2}infinite/userQueryProductList`, url).then(res => {
        if (res.data.status === 'success') {
          this.loadingShow = false
          // this.bidList = res.data.data.infiniteSaleProductList
          let list = res.data.data.infiniteSaleProductList
          this.bidTotal = res.data.data.totalPage
          if (list.length === 0) {
            this.noResultBidList = true
          } else {
            this.noResultBidList = false
          }
          if (res.data.data.infiniteSaleProductList.length > 0) {
            this.timer = setInterval(() => {
              list.forEach((item) => {
                item.bidLastTime-- // 剩余出价时间（秒数)
                if (item.bidLastTime <= 0) {
                  item.hour = '00'
                  item.minute = '00'
                  item.second = '00'
                  clearInterval(this.timer)
                } else {
                  item.hour = parseInt(Number(item.bidLastTime) / 60 / 60 % 24)
                  if (Number(item.hour) === 0) {
                    item.hour = '00'
                  } else if (Number(item.hour) < 10) {
                    item.hour = '0' + item.hour
                  } else {
                    item.hour = item.hour
                  }
                  item.minute = parseInt(Number(item.bidLastTime) / 60 % 60)
                  if (Number(item.minute) === 0) {
                    item.minute = '00'
                  } else if (Number(item.minute) < 10) {
                    item.minute = '0' + item.minute
                  } else {
                    item.minute = item.minute
                  }
                  item.second = parseInt(Number(item.bidLastTime) % 60)
                  if (Number(item.second) === 0) {
                    item.second = '00'
                  } else if (Number(item.second) < 10) {
                    item.second = '0' + item.second
                  } else {
                    item.second = item.second
                  }
                  // console.log(`${item.hour},${item.min},${item.sce}`)
                }
              })
              this.bidList = list
              $(function(){
                $.each($('.goodsImg'),function(i,item){
                  if($(this).outerWidth()>$(this).outerHeight()){
                    $(this).css('width','100%');
                  }else{
                    $(this).css('height','100%');
                  }
                });
              });
            }, 1000)
          } else {
            this.loadingShow = false
            this.bidList =  []
            clearInterval(this.timer)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    getStartList (page) { // 待开始列表
      let url = {}
      url.queryType = this.queryType
      url.pageSize = this.pageSize
      url.pageIndex = page
      url.productName = this.goodsName
      // if (this.goodsName) {
      //   url = `${this.$api2}infinite/userQueryProductList?queryType=2&pageSize=${this.pageSize}&pageIndex=${page}&productName=${this.goodsName}`
      // }else {
      //   url = `${this.$api2}infinite/userQueryProductList?queryType=2&pageSize=${this.pageSize}&pageIndex=${page}&productName=${this.goodsName}`
      // }
      this.$postAxios.post(`${this.$api2}infinite/userQueryProductList`, url).then(res => {
        if (res.data.status === 'success') {
          // console.log(res.data)
          this.loadingShow = false
          this.startList = res.data.data.infiniteSaleProductList
          $(function(){
            $.each($('.goodsImg'),function(i,item){
              if($(this).outerWidth()>$(this).outerHeight()){
                $(this).css('width','100%');
              }else{
                $(this).css('height','100%');
              }
            });
          });
          if (this.startList.length === 0) {
            this.noStartList = true
          } else {
            this.noStartList = false
          }
          this.startTotal = res.data.data.totalPage
        }
      })
    },
    searchGoods () {
      this.loadingShow = true
      if (this.orderTab === 1) {
        clearInterval(this.timer)
        this.bidList =  []
        this.getBidList(1)
      } else {
        this.startList = []
        this.getStartList(1)
      }
    },
    toChoose (num) {
      this.goodsName = ''
      this.queryType = num
      this.orderTab = num
      this.loadingShow = true
      this.noResultBidList = false
      this.noStartList = false
      if (num === 1) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        clearInterval(this.timer)
        this.bidList =  []
        this.getBidList(1)
      } else if (num === 2) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.startList = []
        this.getStartList(1)
      }
    },
    toDetail (item) {
      this.$router.push({
        path: '/goodsParticular',
        query: {
          id: item.id
        }
      })
    },
    bidTurnPage (page) {
      clearInterval(this.timer)
      this.bidPage = page
      this.getBidList(page)
    },
    startTurnPage (page) {
      this.startPage = page
      this.getStartList(page)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.home
  .home-box
    background-color #fafafc
    width 100%
    height 100%
    .home-content
      width 100%
      padding 0 8%
      background-color #fafafc
      padding-top 80px
      .content-title
        display flex
        justify-content space-between
        h3
          font-size 34px
          font-weight bold
          color #1a1a1a
        .my-bidding
          width 160px
          height 50px
          background-color #fcfcfc
          border-radius 4px
          border 1px solid #ffba14
          color #ffba14
          text-align center
          line-height 50px
          cursor pointer
          user-select none
          font-size 20px
      .order-content
        display flex
        justify-content space-between
        width 100%
        border-bottom 1px solid #ffba14
        .order-tab
          margin-top 40px
          display flex
          height 50px
          li
            width 260px
            height 100%
            text-align center
            line-height 50px
            font-size 20px
            color #1a1a1a
            cursor pointer
            user-select none
            &.tabActive
              background-color #ffba14
              color #fff
              border-radius 4px
              border 1px solid #ffba14
              border-bottom-left-radius 0
              border-bottom-right-radius 0
        .search-goods
          margin-top 32px
          display flex
          align-items center
          .input-item
            flex 1
            .input-goods
              height 44px
              width 410px
              padding 0 40px
              font-size 16px
              color #999
              box-sizing border-box
              display block
              border-radius 4px 0 0 4px
              border: 1px solid #999
              border-right none
        .search
          border-radius 0 4px 4px 0
          cursor pointer
          width 54px
          height 44px
          display: flex
          align-items center
          justify-content center
          background-color #ffba14
          .icon-fangdajing
            width: 24px
            height: 24px
            background: url("../../assets/images/home/search.png") no-repeat center
      .warn-box
        width 100%
        height 44px
        background-color #fff
        margin-top 20px
        display flex
        justify-content center
        align-items center
        border 1px solid #eee
        cursor pointer
        user-select none
        box-shadow 0 0px 0px rgba(0, 0, 0, .3)
        span
          font-size 16px
          color #1a1a1a
          padding-right 10px
        i
          font-size 16px
          color #ffba14
      .order-list
        padding-top 30px
        .goods-item
          width 100%
          display flex
          flex-wrap wrap
          li
            width 383px
            height 410px
            border 1px solid #f0f1f4
            margin-right 20px
            margin-bottom 30px
            cursor pointer
            user-select none
            &:nth-child(4n)
              margin-right 0
            .img-box
              width 100%
              height 230px
              display flex
              justify-content center
              align-items center
              background-color #fdfdfe
              img
                display block
                width: auto;
                height: auto;
                max-width: 100%;
                max-height: 100%;
            .goods-dc
              background-color #fdfdfe
              padding 10px 24px 0
              height 180px
              p
                line-height 1.5
                font-size 16px
                color #1a1a1a
              .kucun
                font-size 16px
                color #1a1a1a
                margin-top 16px
                margin-bottom 10px
              .line
                width 100%
                height 1px
                background-color #e7e8ec
              .price-box
                display flex
                justify-content space-between
                margin-top 10px
                margin-bottom 10px
                span
                  font-size 14px
                  color #1a1a1a
                i
                  font-size 16px
                  color #ffba14
              .time-box
                display flex
                justify-content space-between
                span
                  font-size 14px
                  color #1a1a1a
                .time
                  span
                    font-size 16px
                    color #ffba14
                    &.colon
                      width 8px
                      display inline-block
        //正在加载中样式
        .load-more-box
          padding-bottom: 30px
          .desc
            font-size: 20px
            color #999
            text-align: center
            margin-top 20px
          .loading-img
            width: 50px
            height: 50px
            margin: 30px auto 0
            img
              width: 100%
              height: 100%
</style>
