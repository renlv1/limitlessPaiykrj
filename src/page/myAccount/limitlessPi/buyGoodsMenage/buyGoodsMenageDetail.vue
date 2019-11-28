<template>
  <div class="page-limit">
    <div class="location">
      <router-link to="/account/buyGoodsMenage">{{$t('buyGoodsMenage.text1')}}</router-link><span> 》 </span>{{$t('buyGoodsMenage.text2')}}
    </div>
    <div class="content">
      <div class="signle-detail">
        <div class="justify">
          <div class="justify" v-if="infiniteSaleProduct">
            <img :src="imgUrlLogo(infiniteSaleProduct.coverImg)" alt="" width="110" height="100">
            <div class="signle-detail-text">
              <div>{{infiniteSaleProduct.productName}}</div>
              <p>{{$t('buyGoodsMenage.text3')}}：{{goodsData.saleNum - goodsData.finishNum}} / {{goodsData.saleNum}}</p>
              <p>{{$t('buyGoodsMenage.text4')}}：{{goodsData.bidPrice | fourNumber}}π</p>
            </div>
          </div>
          <div class="link" @click="qrPopupShow = true">{{$t('buyGoodsMenage.text5')}}</div>
        </div>
      </div>
      <tab
        :tabMenu="$t('buyGoodsMenage.tabData')"
        :tabIndex="tabIndex"
        @changeTab="changeTab"
      >
        <!-- 1.0 抢购轮次-->
        <div class="limit-table" slot="slot1">
          <div class="btn-wrap">
            <div class="btn" @click="gotoEdit" :class="{'current-btn': checkData.length > 0}">{{$t('buyGoodsMenage.text6')}}</div>
            <div class="btn" @click="$router.push('/account/regulationTemp')">{{$t('buyGoodsMenage.text7')}}</div>
          </div>
          <table>
            <thead>
              <tr>
                <td v-for="(item, index) in $t('buyGoodsMenage.tableData')" :key="index">
                  <div v-if="index === 0">
                    <div class="checkone-check" :class="{'isChecked': checkAllFlag === true, 'no-CheckBox': noCheckBox === true}" @click="checkAllList"></div>
                  </div>
                  <span v-else>{{item}}</span>
                </td>
              </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in infinitePanicRoundList" :key="index">
              <!-- 1活动中 2交易成功,已结束 3交易失败  4待抢购
                  • “抢购中”、”交易成功“的复选框禁用
                  • "待开始"没有“抢购详情”操作
                  • “待开始、交易失败”的抢购规则可编辑，“交易成功、抢购中”的抢购规则不可编辑-->
              <td>
                <!--“交易成功、抢购中”的抢购规则不可编辑-->
                <div class="disabled-check" v-if="item.roundStatus === 1 || item.roundStatus === 2"></div>
                <div class="checkone-check" v-else :class="{'isChecked': item.checkFlag === true}" @click="checkOne2(item)" ></div>
              </td>
              <td>{{item.roundCode}}</td>
              <td>{{item.id}}</td>
              <td>
                <div v-if="item.infinitePaniceSet">{{item.infinitePaniceSet.startPanicPrice}} π</div>
                <div v-else>0.0000 π</div>
              </td>
              <td>{{item.panicPrice | fourNumber}}π</td>
              <td>
                <div :class="{'red-color': item.roundStatus === 3, 'loading-text': item.roundStatus === 1}">{{transactionStatus(item.roundStatus)}}</div>
              </td>
              <td>
                <div v-if="item.infinitePaniceSet">{{item.infinitePaniceSet.panicSetName}}</div>
                <div v-else>-</div>
              </td>
              <td>
                <!--infinitePaniceSet.startDate-->
                <div v-if="item.infinitePaniceSet">{{$changeDate(item.infinitePaniceSet.startDate, '-', 8)}}</div>
                <div v-else>-</div>
              </td>
              <td>
                <div class="btn-w" v-if="item.infinitePaniceSet">
                  <span class="btn-e" @click="$router.push({path: '/account/buyGoodsMenage/buyGoodsRuleInfo', query: {id: item.infinitePaniceSet.id, rundId: item.id}})">{{$t('buyGoodsMenage.text9')}}</span>
                  <div v-if="item.roundStatus === 4" @click="$router.push({path: '/account/regulationTemp/ruleOptions', query: {rundId: item.id, mId: $route.query.id, myId: item.infinitePaniceSet.id}})" class="btn-info btn-e">{{$t('buyGoodsMenage.text10')}}</div>
                  <span class="btn-e" v-if="item.roundStatus !== 4" @click="gotoRecord(item.id)">{{$t('buyGoodsMenage.text8')}}</span>       <!-- • "待开始"没有“抢购详情”操作-->
                </div>
                <div v-else @click="$router.push({path: '/account/regulationTemp/ruleOptions', query: {rundId: item.id, mId: $route.query.id}})" class="red-color btn-info">{{$t('buyGoodsMenage.text10')}}</div>
              </td>
            </tr>
            </tbody>
          </table>
          <v-turn-page :propsPage="totalPage" @orderLogTrunPage="parentTurnPage" ref="turnPage1"></v-turn-page>
        </div>
        <!-- 2 商品详情 -->
        <div class="prod-detial" slot="slot2">
          <div class="intro">
            <div class="flex">
              <p>{{$t('buyGoodsMenage.text11')}}：{{infiniteSaleProduct.productName}}</p>
              <p>{{$t('buyGoodsMenage.text13')}}：{{infiniteSaleProduct.merchantName}}</p>
              <p v-show="goodsData.saleNum">{{$t('buyGoodsMenage.text3')}}：{{goodsData.saleNum - goodsData.finishNum}}</p>
            </div>
            <div class="intro-text">
              <span>{{$t('buyGoodsMenage.text12')}}：</span><span>{{infiniteSaleProduct.productContent}}</span>
            </div>
          </div>
          <div class="detail-wrap">
            <img :src="item" alt="" v-for="(item, index) in contentImg" :key="index">
          </div>
        </div>
      </tab>
    </div>
    <!--邀请链接弹窗-->
    <div class="myInvitePopup" v-show="qrPopupShow">
      <div class="myPopup-box">
        <a class="close" @click="qrPopupShow = false"><img src="../../../../assets/images/home/Shutdown.png" alt=""></a>
        <div class="myPopup-tip">
          <div class="img-box" v-if="infiniteSaleProduct.coverImg">
            <img :src="imgUrlLogo(infiniteSaleProduct.coverImg)" alt="" width="110" height="100">
          </div>
          <p class="qrCode-p">{{infiniteSaleProduct.productName}}</p>
        </div>
        <a class="link" id="userLink5" :href="inviteLink2" target="_blank">{{inviteLink}}</a>
        <button class="secret-btn" ref="addressCopy" @click="closeQrPopup()" data-clipboard-action="copy" data-clipboard-target="#userLink5">{{$t('buyGoodsMenage.text14')}}</button>
        <p class="share-text">{{$t('buyGoodsMenage.text15')}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import tab from '@/components/tab'
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      checkAllFlag: false,
      isChecked: [],
      totalPage: 0,
      noCheckBox: false,
      indeterminate: false,
      qrPopupShow: false,
      inviteLink: '',
      inviteLink2: '',
      indexData: [],
      indexFlag: false,
      checked1: false,
      tabIndex: 0,
      goodsData: '',
      flag: -1,
      infiniteSaleProduct: '',
      contentImg: [],
      infinitePanicRoundList: [],
      id: this.$route.query.id,
      current_page: 1,
      checkData: [],
      copyBtn: null,
      ariaChecked: []
    }
  },
  created () {
    this.getInfo(1)
  },
  mounted () {
    this.copyBtn = new this.Clipboard(this.$refs.addressCopy)
  },
  methods: {
    imgUrlLogo (coverImg) {
      coverImg = coverImg.split(',')[0]
      if (coverImg.indexOf('http') > -1) {
        return coverImg
      } else {
        return 'http://ofydu65mj.bkt.clouddn.com/' + coverImg
      }
    },
    parentTurnPage (page) {
      this.current_page = page
      this.checkData = []
      this.checkAllFlag = false
      this.getInfo(page)
    },
    gotoEdit () {
      if (this.checkData.length > 0) {
        this.$router.push({
          path: '/account/regulationTemp/ruleOptions',
          query: {
            idArr: JSON.stringify(this.checkData),
            mId: this.$route.query.id
          }
        })
      }
    },
    gotoRecord (id) {
      this.$router.push({path: '/account/buyGoodsMenage/buyGoodsMenageRecord', query: {id: this.id, roundId: id}})
    },
    closeQrPopup () {
      this.qrPopupShow = false
      // $('#qrcodeBox').html('')
      let clipboard = this.copyBtn
      clipboard.on('success', () => {
        Dialog({
          title: this.$t('buyGoodsMenage.text16'),
          content: ''
        })
        clipboard.destroy()
        this.copyBtn = new this.Clipboard(this.$refs.addressCopy) // 复制
      })
    },
    // 单选
    checkOne2 (item) {
      item.checkFlag = !item.checkFlag
      let idIndex = this.checkData.indexOf(item.id)
      if (idIndex >= 0) { // 如果已经包含就去除
        this.checkData.splice(idIndex, 1)
      } else { // 如果没有包含就添加
        this.checkData.push(item.id)
      }
      let leng = 0
      this.infinitePanicRoundList.forEach(item => {
        if (item.roundStatus !== 1 && item.roundStatus !== 2) {
          leng++
        }
      })
      if (this.checkData.length === leng) {
        this.checkAllFlag = true
      } else {
        this.checkAllFlag = false
      }
    },
    // 全选
    checkAllList () {
      if (this.noCheckBox === false) {
        this.checkData = []
        this.checkAllFlag = !this.checkAllFlag
        this.infinitePanicRoundList.forEach(item => {
          if (item.roundStatus !== 1 && item.roundStatus !== 2) {
            if (this.checkAllFlag === true) {
              item.checkFlag = true
              this.checkData.push(item.id)
            } else {
              item.checkFlag = false
              this.checkData = []
            }
          }
        })
      }
    },
    changeTab (index) {
      this.tabIndex = index
    },
    getInfo (pageIndex) { // 3.2 代理商抢购产品详情
      this.current_page = pageIndex
      this.$postAxios.post(`${this.$api2}infinite/infiniteRecordDetail`, {
        infiniteRecordId: this.id,
        pageIndex: pageIndex,
        pageSize: 10
      }).then(res => {
        if (res.data.status === 'success') {
          this.goodsData = res.data.data.infiniteRecord
          this.infiniteSaleProduct = res.data.data.infiniteRecord.infiniteSaleProduct
          this.totalPage = res.data.data.totalPage
          if (this.infiniteSaleProduct.contentImg) {
            let imgData = this.infiniteSaleProduct.contentImg.split(',')
            let imgData2 = []
            imgData.forEach(item => {
              if (item.indexOf('http') > -1) {
                imgData2.push(item)
              } else {
                imgData2.push('http://ofydu65mj.bkt.clouddn.com/' + item)
              }
            })
            this.contentImg = imgData2
          } else {
            this.contentImg = ''
          }
          let roundList = res.data.data.infiniteRecord.infinitePanicRoundList
          roundList.forEach(item => {
            item.checkFlag = false
          })
          this.infinitePanicRoundList = roundList
          let notFlag = 0
          this.infinitePanicRoundList.forEach((item) => {
            if (item.roundStatus === 1 || item.roundStatus === 2) {
              notFlag++
            }
          })
          if (notFlag === this.infinitePanicRoundList.length) {
            this.noCheckBox = true
          } else {
            this.noCheckBox = false
          }
          this.inviteLink = window.location.host + '/#/buyGoods?id=' + this.id + '&shareCode=' + this.goodsData.shareCode
          this.inviteLink2 = '/#/buyGoods?id=' + this.id + '&shareCode=' + this.goodsData.shareCode
        }
      }).catch(err => {
        console.log(err)
      })
    },
    transactionStatus (status) { // 1活动中 2交易成功,已结束 3交易失败  4待抢购
      if (status === 1) {
        return this.$t('buyGoodsMenage.text17')
      }
      if (status === 2) {
        return this.$t('buyGoodsMenage.text18')
      }
      if (status === 3) {
        return this.$t('buyGoodsMenage.text19')
      }
      if (status === 4) {
        return this.$t('buyGoodsMenage.text20')
      }
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
  #userLink5{
    display: block;
  }
  .btn-info{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      margin-bottom: 30px;
      width: 500px;
    }
  }
  .btn-w{
    display: flex;
    flex-direction: column;
    justify-content: center;
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
      cursor: auto;
      &:last-child{
        cursor: pointer;
        color: @color;
        border-color: @color;
        margin-left: 30px;
        background: none;
      }
      &.current-btn{
        color: #fff;
        background-color: #4b84ff;
        border-color: #4b84ff;
        cursor: pointer;
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
      .disabled-check{
        width: 14px;
        height: 14px;
        background-color: #edf2fc;
        border: 1px solid #dcdfe6;
        cursor: not-allowed;
      }
    }
    .checkone-check{
      width: 14px;
      height: 14px;
      background-color: #fff;
      border: 1px solid #dcdfe6;
      cursor: pointer;
      position: relative;
      &::before{
        -webkit-box-sizing: content-box;
        box-sizing: content-box;
        content: "";
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(0);
        width: 3px;
        -webkit-transition: -webkit-transform .15s ease-in .05s;
        transition: -webkit-transform .15s ease-in .05s;
        transition: transform .15s ease-in .05s, -webkit-transform .15s ease-in .05s;
        -webkit-transform-origin: center;
        transform-origin: center;
      }
      &.isChecked{
        background-color: #409EFF;
        border-color: #409EFF;
        &::before{
          transform: rotate(45deg) scaleY(1);
        }
      }
      &.no-CheckBox{
        background-color: #edf2fc;
        cursor: not-allowed;
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
