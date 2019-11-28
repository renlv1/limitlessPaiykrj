<template>
  <div class="page-limit">
    <!--我的抢购、抢购记录-->
    <div class="location">
      <router-link to="/account/myPurchase">{{$t('goodsManagement.text55')}}</router-link><span> 》 </span>{{$t('goodsManagement.text87')}}
    </div>
    <h3 class="title">{{$t('goodsManagement.text87')}}</h3>
    <div class="content">
      <div class="signle-detail">
        <div class="justify">
          <div class="justify">
            <div class="signle-detail-text">
              <div class="text1">{{$t('goodsManagement.text95')}}</div>
              <div class="text2">
                <div class="record"><span>{{$t('buyGoodsMenage.text44')}}：</span><span class="nums">{{awardHead[1] | fourNumber}}</span> <span class="money">π</span></div>
                <div class="record"><span>{{$t('buyGoodsMenage.text50')}}：</span><span class="nums">{{awardHead[2] | fourNumber}}</span> <span class="money">π</span></div>
                <div class="record"><span>{{$t('buyGoodsMenage.text47')}}：</span><span class="nums">{{awardHead[0] | fourNumber}}</span> <span class="money">π</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <tab
        :tabMenu="$t('goodsManagement.tabData2')"
        :tabIndex="tabIndex"
        @changeTab="changeTab"
      >
        <!-- 1.0 树形奖励-->
        <div class="limit-table" slot="slot1">
          <table>
            <thead>
            <tr>
              <td v-for="item in $t('goodsManagement.tableHead4')" :key="item">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in awardData" :key="index">
              <td class="tree-tr">{{item.id}}</td>
              <td>{{item.rewardAmount | fourNumber}}π</td>
              <td><span>{{item.userName}}</span></td>
              <td>{{$changeDate(item.updateAt, '-', 8)}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 2 队列奖励 -->
        <div class="limit-table" slot="slot2">
          <table>
            <thead>
            <tr>
              <td v-for="item in $t('goodsManagement.tableHead5')" :key="item">{{item}}</td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in awardData" :key="index">
              <td>{{item.id}}</td>
              <td>{{item.rewardAmount | fourNumber}}π</td>
              <td>{{item.playerIndex}}</td>
              <td>
                <span>{{item.playerUserName}}</span>
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
      <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
      <!--<div class="page-w">-->
        <!--<div class="pre-page page cursor" :class="{'disabled': pstart}" @click="getawardList(current_page - 1, subMenuIndex)">&lt; 上一页</div>-->
        <!--<div class="current-page page">{{current_page}}</div>-->
        <!--<div class="next-page page cursor" :class="{'disabled': pend}" @click="getawardList(current_page + 1, subMenuIndex)">下一页 &gt;</div>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  import tab from '@/components/tab'
  export default {
    data () {
      return {
        totalPage: 0,
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
        queryType: 1,
        id: this.$route.query.id,
        roundId: this.$route.query.roundId,
        checkData: []
      }
    },
    created () {
      this.getawardList(1, 1)
    },
    methods: {
      parentTurnPage (page) { // 页码
        this.getawardList(page, this.queryType)
      },
      subMenuSwitch (index) {
        this.awardData = []
        this.subMenuIndex = index
      },
      changeTab (index) {
        this.awardData = []
        this.totalPage = 0
        this.noResult = false
        this.tabIndex = index
        if (index === 1) {
          this.queryType = 3
          this.getawardList(1, 3)
        } else {
          this.queryType = 1
          this.getawardList(1, 1)
        }
      },
      // 5.1 查询用户自己的奖励列表-我的抢购中 http://boss.pigamegroup.com/infinite/queryMyUserRewardList
      getawardList (pageIndex, queryType) {
        this.current_page = pageIndex
        this.$postAxios.post(`${this.$api2}infinite/queryMyUserRewardList`, {
          rewardType: queryType,
          roundId: this.roundId,
          pageIndex: pageIndex,
          pageSize: 20
        }).then(res => {
          if (res.data.status === 'success') {
            this.awardData = res.data.data.infinitePanicRewardList
            let rewardCountList = res.data.data.rewardCountList
            this.totalPage = res.data.data.totalPage
            if (this.awardData.length === 0) {
              this.noResult = true
            } else {
              this.noResult = false
            }
            rewardCountList.forEach((item, index) => {
              if (item.rewardType === 1) { // 1树形奖励 2最高投注奖励 3队列奖励 4代理商奖励
                this.awardHead[0] = item.rewardAmount
              } else if (item.rewardType === 2) {
                this.awardHead[1] = item.rewardAmount
              } else if (item.rewardType === 3) {
                this.awardHead[2] = item.rewardAmount
              }
            })
            this.awardHead[0] = this.awardHead[0] ? this.awardHead[0] : 0
            this.awardHead[1] = this.awardHead[1] ? this.awardHead[1] : 0
            this.awardHead[2] = this.awardHead[2] ? this.awardHead[2] : 0
            if (this.awardData.length < 20) {
              this.pend = true
            } else {
              this.pend = false
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      leadStatus (status) { // 1竞价中(领先) 2竞价失败(出局）3竞价成功(领先) 4处理中
        if (status === 1 || status === 3) {
          return this.$t('goodsManagement.text93')
        }
        if (status === 2) {
          return this.$t('goodsManagement.text94')
        }
        if (status === 4) {
          return this.$t('goodsManagement.text96')
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
      vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
    }
  }
</script>

<style lang="less" scoped>
  @import '~@/assets/css/limitlessPi';
  .f-bor{
    font-size: 40px;
  }
  .page-limit{
    .title{
      padding-bottom: 20px;
    }
  }
  .signle-detail-text{
    flex: 1;
    width: auto;
    .text1{
      font-size: 20px;
      color: #1a1a1a;
    }
    .text2{
      margin-top: 30px;
      font-size: 16px;
      display: flex;
      .record{
        margin-right: 80px;
        display: flex;
        align-items: center;
        span{
          word-break:keep-all;
          white-space:nowrap;
        }
      }
      .nums{
        font-size: 20px;
        color: #1a1a1a;
        font-weight: bold;
        margin-right: 5px;
      }
      .money{
        font-weight: bold;
        font-size: 16px;
        color: #ffba14;
      }
    }
  }
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
        height: 70px;
        line-height: 26px;
      }
      .tree-tr{
        width: 90px;
      }
      .record-list:nth-child(1){
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
