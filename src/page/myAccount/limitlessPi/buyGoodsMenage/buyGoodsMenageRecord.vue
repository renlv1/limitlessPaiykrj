<template>
  <div class="page-limit">
    <!--商品抢购管理 详情-->
    <div class="location">
      <router-link to="/account/buyGoodsMenage">{{$t('buyGoodsMenage.text1')}}</router-link><span> 》 </span>{{$t('buyGoodsMenage.text2')}}
    </div>
    <div class="content">
      <div class="signle-detail">
        <div class="justify">
          <div class="justify" v-if="infiniteSaleProduct.coverImg">
            <img :src="$imgUrlPro(infiniteSaleProduct.coverImg)" alt="" width="110" height="100">
            <div class="signle-detail-text">
              <div>{{infiniteSaleProduct.productName}}</div>
              <p>{{$t('buyGoodsMenage.text023')}}：{{roundId}}</p>
            </div>
          </div>
        </div>
      </div>
      <tab
        :tabMenu="tabMenu"
        :tabIndex="tabIndex"
        @changeTab="changeTab"
      >
        <!-- 1.0 抢购记录-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('buyGoodsMenage.tableHead0')" :key="index">
                  <span>{{item}}</span>
                </td>
              </tr>
            </thead>
            <v-loading v-show="loadingShow1"></v-loading>
            <tbody>
              <tr v-for="(item, index) in infinitePanicPlayerList" :key="index" class="record-list" :class="{'topstatus': item.playerStatus === 2}">
                <td>{{item.id}}</td>
                <td>{{leadStatus(item.playerStatus)}}</td>
                <td>{{item.playerAmount | fourNumber}} π</td>
                <td>{{item.userName}}</td>
                <td>{{$changeDate(item.createAt, '-', 8)}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 2 奖励发放记录 -->
        <div class="limit-table" slot="slot2">
          <div class="sub-tab">
            <div class="sub-list" @click="subMenuSwitch(1)">
              <div class="sub-tab-hd" :class="{active: subMenuIndex === 1}">{{$t('buyGoodsMenage.text24')}}({{awardHead[0]}}π)</div>
            </div>
            <!--1树形奖励 2最高投注奖励 3队列奖励 4代理商奖励-->
            <div class="sub-list" @click="subMenuSwitch(2)">
              <div class="sub-tab-hd" :class="{active: subMenuIndex === 2}">{{$t('buyGoodsMenage.text25')}}({{awardHead[1]}}π)</div>
            </div>
            <div class="sub-list" @click="subMenuSwitch(3)">
              <div class="sub-tab-hd" :class="{active: subMenuIndex === 3}">{{$t('buyGoodsMenage.text26')}}({{awardHead[2]}}π)</div>
            </div>
            <div class="sub-list" @click="subMenuSwitch(4)">
              <div class="sub-tab-hd" :class="{active: subMenuIndex === 4}">{{$t('buyGoodsMenage.text27')}}({{awardHead[3]}}π)</div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <td v-for="item in $t('buyGoodsMenage.tableHead3')" :key="item" v-if="subMenuIndex === 3">{{item}}</td>
                <td v-for="item in $t('buyGoodsMenage.tableHead1')" :key="item" v-if="subMenuIndex !== 3">{{item}}</td>
              </tr>
            </thead>
            <v-loading v-show="loadingShow2"></v-loading>
            <tbody>
              <tr v-for="(item,index) in awardData" :key="index">
                <td>{{item.id}}</td>
                <td>{{item.rewardAmount | fourNumber}}π</td>   <!--奖励金额-->
                <td><!--奖励用户-->
                  <span v-if="item.userName">{{item.userName}}</span>
                  <span v-else>-</span>
                </td>
                <td v-if="subMenuIndex === 3">{{item.playerIndex}}</td><!--奖励位置-->
                <td><!--抢购用户-->
                  <span v-if="item.playerUserName">{{item.playerUserName}}</span>
                  <span v-else>-</span>
                </td>
                <td>
                  <span v-if="item.playerAmount">{{item.playerAmount | fourNumber}}π</span>
                  <span v-else>-</span>
                </td>
                <td>{{$changeDate(item.updateAt, '-', 8)}}</td>
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
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1" v-show="isPageShow"></v-turn-page>
      <!--<div class="page-w">-->
        <!--<div class="pre-page page cursor" :class="{'disabled': pstart}" @click="gotoPage(current_page - 1)">&lt; 上一页</div>-->
        <!--<div class="current-page page">{{current_page}}</div>-->
        <!--<div class="next-page page cursor" :class="{'disabled': pend}" @click="gotoPage(current_page + 1)">下一页 &gt;</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
import tab from '@/components/tab'
export default {
  data () {
    return {
      isPageShow: true,
      totalPage: 0,
      loadingShow1: true,
      loadingShow2: true,
      noResult: false,
      current_page: 1,
      pend: false,
      awardData: [],
      awardHead: [],
      subMenuIndex: 1,
      infiniteRecordList: [],
      checked1: false,
      checked2: false,
      isChecked: false,
      tabIndex: 0,
      goodsData: '',
      infiniteSaleProduct: '',
      id: this.$route.query.id,
      roundId: this.$route.query.roundId,
      checkData: [],
      infinitePanicPlayerList: [],
      totalData: 0,
      tabMenu: []
    }
  },
  created () {
    this.getRecordList(1)
  },
  methods: {
    parentTurnPage (page) {
      this.current_page = page
      this.getRecordList(page)
    },
    // 翻页
    gotoPage (index) {
      if (this.tabIndex === 0) {
        this.getRecordList(index)
      } else {
        this.getawardList(index, this.subMenuIndex)
      }
    },
    subMenuSwitch (index) {
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.noResult = false
      this.awardData = []
      this.subMenuIndex = index
      this.loadingShow2 = true
      this.getawardList(1, index)
    },
    changeTab (index) {
      this.loadingShow1 = true
      if (this.$refs.turnPage1) {
        this.$refs.turnPage1.resetPage(1)
      }
      this.isPageShow = false
      this.noResult = false
      this.pend = false
      this.tabIndex = index
      this.awardData = []
      this.infinitePanicPlayerList = []
      if (index === 1) {
        this.subMenuIndex = 1
        this.loadingShow2 = true
        this.getawardList(1, 1)
      } else {
        this.getRecordList(1)
      }
    },
    // 4.5 商品轮次抢购记录-抢购详情中 infinite/panicRoundPlayerList
    getRecordList (pageIndex) {
      this.current_page = pageIndex
      this.$postAxios.post(`${this.$api2}infinite/panicRoundPlayerList`, {
        roundId: this.roundId,
        pageIndex: pageIndex,
        pageSize: 20
      }).then(res => {
        this.isPageShow = true
        if (res.data.status === 'success') {
          this.loadingShow1 = false
          this.totalData = res.data.data.totalCount
          this.tabMenu = [`${this.$t('buyGoodsMenage.text21')}(${this.totalData})`, this.$t('buyGoodsMenage.text22')]
          this.infinitePanicPlayerList = res.data.data.infinitePanicPlayerList
          this.totalPage = res.data.data.totalPage
          if (this.infinitePanicPlayerList.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
          if (this.infinitePanicPlayerList.length < 20) {
            this.pend = true
          } else {
            this.pend = false
          }
          this.infiniteSaleProduct = res.data.data.infinitePanicRound.infiniteSaleProduct
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 4.6 商品轮次奖励记录-抢购详情中infinite/panicRoundRewardList
    getawardList (pageIndex, queryType) {
      this.current_page = pageIndex
      this.$postAxios.post(`${this.$api2}infinite/panicRoundRewardList`, {
        queryType: queryType,
        roundId: this.roundId,
        pageIndex: pageIndex,
        pageSize: 20
      }).then(res => {
        this.loadingShow2 = false
        this.isPageShow = true
        if (res.data.status === 'success') {
          this.totalPage = res.data.data.totalPage
          this.awardData = res.data.data.infinitePanicRewardList
          let awardHeadData = res.data.data.rewardCountList
          awardHeadData.forEach((item, index) => {
            if (item.rewardType === 1) { // 1树形奖励 2最高投注奖励 3队列奖励 4代理商奖励
              this.awardHead[0] = item.rewardAmount
            } else if (item.rewardType === 2) {
              this.awardHead[1] = item.rewardAmount
            } else if (item.rewardType === 3) {
              this.awardHead[2] = item.rewardAmount
            } else if (item.rewardType === 4) {
              this.awardHead[3] = item.rewardAmount
            }
          })
          this.awardHead[0] = this.awardHead[0] ? this.awardHead[0].toFixed(4) : 0.0000
          this.awardHead[1] = this.awardHead[1] ? this.awardHead[1].toFixed(4) : 0.0000
          this.awardHead[2] = this.awardHead[2] ? this.awardHead[2].toFixed(4) : 0.0000
          this.awardHead[3] = this.awardHead[3] ? this.awardHead[3].toFixed(4) : 0.0000
          if (this.awardData.length < 20) {
            this.pend = true
          } else {
            this.pend = false
          }
          if (this.awardData.length === 0) {
            this.noResult = true
          } else {
            this.noResult = false
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    leadStatus (status) { // 1竞价中(领先) 2竞价失败(出局）3竞价成功(领先) 4处理中
      if (status === 2) {
        return this.$t('buyGoodsMenage.text28')
      }
      if (status === 1) {
        return this.$t('buyGoodsMenage.text29')
      }
    }
  },
  computed: {
    pstart() {
      return this.current_page === 1
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
  .sub-tab{
    display: flex;
    background: #fff;
    border-bottom: 1px solid #e7e8ec;
    .sub-list{
      width: 300px;
      line-height: 69px;
      font-size: 16px;
      color: @blue;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .sub-tab-hd{
        padding: 0 25px;
        border-bottom: 2px solid transparent;
        display: flex;
        cursor: pointer;
      }
      .sub-tab-hd.active {
        border-bottom: 2px solid #4b84ff;
      }
    }
    margin-bottom: 10px;
  }
  .loading-text{
    color: #ffba14;
  }
  .check-box{
    width: 20px;
    height: 20px;
  }
  .detail-wrap{
    text-align: center;
  }
  .btn-w{
    display: flex;
    flex-direction: column;
    height: 100%;
    .btn-e{
      width: 100%;
      height: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  .btn-wrap{
    display: flex;
    margin: 20px 0;
    .btn{
      padding: 0 30px;
      color: #ffffff;
      font-size: 14px;
      border: 1px solid #999;
      background: #999;
      line-height: 34px;
      border-radius: 4px;
      cursor: pointer;
      &:last-child{
        color: @color;
        border-color: @color;
        margin-left: 30px;
        background: none;
      }
    }
  }
  .limit-table{
    thead{
      td:first-child{
        width: 90px;
      }
    }
    tbody{
      td{
        height: 44px;
      }
      .record-list.topstatus{
        color: #4b84ff;
      }
    }
  }
  .intro{
    background: #fcfcfc;
    padding: 10px 30px 20px;
    line-height: 28px;
    .intro-text{
      color: #999999;
      span{
        color: #1a1a1a;
      }
    }
    .flex{
      display: flex;
      padding: 20px 0;
      p{
        width: 30%;
      }
    }
  }
</style>
