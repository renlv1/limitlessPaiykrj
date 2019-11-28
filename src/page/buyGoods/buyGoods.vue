<template>
  <div class="goodsParticular">
    <div class="goodsParticular-box">
      <div class="goodsParticular-content">
        <div class="goodsParticular-title">
          <h6>{{$t('home.text41')}}</h6>
        </div>
        <div class="goods-box">
          <div class="goods-lt">
            <div class="goods-picture">
              <ul class="big-picture">
                <li>
                  <img :src="imgUrl" alt="" id="goodsImg" v-show="imgShow">
                </li>
              </ul>
            </div>
            <ul class="small-picture">
              <li v-for="(item,index) in coverImg" :key="index" @click="toGoodsPicture(item,index)" :class="{activeImg: isActiveImg === index}">
                <img :src="item" alt="">
              </li>
            </ul>
          </div>
          <div class="goods-rt">
            <p>{{productName}}</p>
            <div class="kucun-box" v-show="shareUserName">
              <div class="kucun"><span>{{$t('home.text42')}}: </span><i>{{shareUserName}}</i></div>
            </div>
            <div class="my-invite" @click="showQrPopup"><span class="btn-invite">{{$t('home.text43')}}</span></div>
          </div>
        </div>
        <div class="goods-content">
          <ul class="order-tab">
            <li :class="{tabActive: orderTab === 1}" @click="toChoose(1)">{{$t('home.text44')}}</li>
            <li :class="{tabActive: orderTab === 2}" @click="toChoose(2)">{{$t('home.text45')}}</li>
            <li :class="{tabActive: orderTab === 3}" @click="toChoose(3)">{{$t('home.text46')}} <span>({{totalCount}})</span></li>
          </ul>
        </div>
        <!--抢购轮次-->
        <table class="commonTableList" v-if="orderTab === 1" >
          <thead>
          <tr>
            <td class="round">{{$t('home.text110')}}</td>
            <td class="round">{{$t('home.text111')}}</td>
            <td class="status">{{$t('home.text48')}}</td>
            <td class="auction">{{$t('home.text49')}}</td>
            <td class="price">{{$t('home.text50')}}</td>
            <td class="time">{{$t('home.text51')}}</td>
            <td class="detail">{{$t('home.text52')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in infinitePanicRoundList" :key="index" class="cursor" @click="toBuyGoodsDetail(item)">
            <td class="round">{{item.roundCode}}</td>
            <td class="round">{{item.id}}</td>
            <td class="status">{{recordStatus(item.roundStatus)}}</td>
            <td class="auction" v-if="item.panicPrice === 0">{{item.infinitePaniceSet.startPanicPrice | fourNumber}} π</td>
            <td class="auction" v-else>{{item.panicPrice | fourNumber}} π</td>
            <td class="price" v-show="item.roundStatus === 1">{{item.hour}}:{{item.minute}}:{{item.second}}</td>
            <td class="price" v-show="item.roundStatus === 2 || item.roundStatus === 3 || item.roundStatus === 4">-</td>
            <td class="time">{{$changeDate(item.infinitePaniceSet.startDate, '-', 8)}}</td>
            <td class="detail">{{$t('home.text53')}}</td>
          </tr>
          </tbody>
          <div class="load-more-box" v-show="noDataPanicRoundList">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="infinitePanicRoundList.length !== 0" :propsPage="roundTotal" @roundTrun="roundTurnPage" ref="turnPage1"></v-turnPage>
          <!--<div class="page" v-show="infinitePanicRoundList2"><span @click="getGoodsTreeList(pageIndex1 - 1)" :class="{'disable': pageIndex1 === 1}">上一页</span><i>{{pageIndex1}}</i><span @click="getGoodsTreeList(pageIndex1 + 1)" ref="nextPage" :class="{'disable': isDisabled}">下一页</span></div>-->
        </table>
        <!--商品详情-->
        <div class="goods-ct" v-if="orderTab === 2">
          <div class="introduce-box">
            <div class="shop-name"><span>{{$t('home.text64')}}:</span><i>{{merchantName}}</i></div>
            <p><span>{{$t('home.text32')}}:</span>{{productContent}}</p>
          </div>
          <div class="line"></div>
          <div class="introduce-pt">
            <ul>
              <li v-for="(item,index) in contentImg" :key="index">
                <img :src="item" alt="">
              </li>
            </ul>
          </div>
        </div>
        <!--我的邀请-->
        <table class="commonTableList" v-if="orderTab === 3" >
          <thead>
          <tr>
            <td class="round">{{$t('home.text54')}}</td>
            <td class="status">{{$t('home.text55')}}</td>
            <td class="auction">{{$t('home.text56')}}</td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in infiniteTreeList" :key="index">
            <td class="round">{{item.id}}</td>
            <td class="status">{{item.childUserName}}</td>
            <td class="auction" v-show="item.createAt">{{$changeDate(item.createAt, '-', 8)}}</td>
          </tr>
          </tbody>
          <div class="load-more-box" v-show="infiniteTreeList.length === 0">
            <div class="loading-img">
              <img src="../../assets/images/home/nodata.png" alt="">
            </div>
            <p class="desc">{{$t('home.text11')}}</p>
          </div>
          <v-turnPage v-show="infiniteTreeList.length !== 0" :propsPage="inviteTotal" @roundTrun="inviteTurnPage" ref="turnPage1"></v-turnPage>
          <!--<div class="page" v-show="infiniteTreeList.length !== 0"><span @click="toPage2('pre')">上一页</span><i>{{pageIndex2}}</i><span @click="toPage2('next')">下一页</span></div>-->
        </table>
      </div>
    </div>
    <!--邀请链接弹窗-->
    <div class="myInvitePopup" v-show="qrPopupShow">
      <div class="myPopup-box">
        <a class="close" @click="closeInvite()"><img src="../../assets/images/home/Shutdown.png" alt=""></a>
        <div class="myPopup-tip">
          <div class="img-box"><img :src="imgUrl" alt=""></div>
          <p class="qrCode-p">{{productName}}</p>
        </div>
        <!--<div id="qrcodeBox"></div>-->
        <a class="link" id="userLink" :href="inviteLink2" target="_blank">{{inviteLink}}</a>
        <button class="secret-btn" ref="addressCopy" @click="closeQrPopup()" data-clipboard-action="copy" data-clipboard-target="#userLink">{{$t('home.text57')}}</button>
        <p class="share-text">{{$t('home.text58')}}</p>
      </div>
    </div>
    <!--<div class="myInvitePopup" v-show="purchaseShow">-->
      <!--<div class="myPopup-box">-->
        <!--<p class="share-text" style="margin-bottom: 20px">加入抢购失败：网络错误</p>-->
        <!--<button class="secret-btn" @click="$router.push('/home')">确定</button>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script type="text/ecmascript-6">
import $ from 'jquery'
// import '../../assets/js/jquery.qrcode.min'
import Dialog from '@/components/dialog/dialog'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      id: Number(this.$route.query.id),
      coverImg: [], // 产品封面图,用,分割
      contentImg: [], // 产品描述图片  用,分割
      productName: '', // 产品名称
      merchantName: '', // 店铺名称
      shareUserName: '', // 用户昵称
      productContent: '', // 产品介绍
      infinitePanicRoundList: [], // 抢购轮次列表
      noDataPanicRoundList: false,
      imgShow: false,
      isActiveImg: 0,
      orderTab: 1,
      isLoadMore: true,
      copyBtn: null,
      qrPopupShow: false, // 二维码弹窗
      imgGoods: '', // 二维码商品图片
      imgUrl: '', // 大的预览图
      hour: '',
      min: '',
      sce: '',
      timer: null,
      pageSize: 20,
      infiniteTreeList: [], // 我的邀请列表
      purchaseShow: false,
      shareCode: '',
      inviteLink: '', // 邀请链接
      inviteLink2: '',
      totalCount: '', // 总条数
      roundTotal: 1, // 抢购轮次页数
      roundPage: '', // 抢购轮次分页
      inviteTotal: 1, // 我的邀请页数
      invitePage: '', // 我的邀请分页
      variable: 'http://ofydu65mj.bkt.clouddn.com/', // 拼接字符串需要的变量
      isDisabled: false,
      falg: true,
      sign: 1
    }
  },
  computed: {
    ...mapGetters([
      'userAccount',
      'userData'
    ])
  },
  created () {
    this.isNoLoginFag()
    if (this.$route.query.shareCode) {
      this.shareCode = this.$route.query.shareCode
      this.makeInfiniteTree()
    } else {
      this.getGoodsTreeList(1)
      this.getMyPanicTreeList(1)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  components: {
    vTurnPage: resolve => require(['@/components/turnPage.vue'], resolve)
  },
  mounted () {
    this.copyBtn = new this.Clipboard(this.$refs.addressCopy)
    // this.$nextTick(() => {
    //   this.isNoLoginFag()
    // })
  },
  methods: {
    isNoLoginFag () {
      this.$http.get(`${this.$api}user/balance`).then((res) => {
        if (res.data.success === true) {
        } else {
          this.shareCode = this.$route.query.shareCode
          this.$router.push({path: '/login', query: {id: this.id, shareCode: this.shareCode}})
        }
      })
    },
    // 4.2 查询用户抢购商品的可参与的轮次列表-抢购详情中
    // 接口URL: http://boss.pigamegroup.com/infinite/panicRoundList
    getGoodsTreeList (page) {
      // console.log(page)
      let url = `${this.$api2}infinite/panicRoundList?infiniteRecordId=${this.id}&pageIndex=${page}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          // if (res.data.data.infiniteRecord.shareUserName) {
          //   this.shareUserName = res.data.data.infiniteRecord.shareUserName
          // }
          this.coverImg = []
          this.contentImg = []
          this.roundTotal = res.data.data.totalPage
          this.merchantName = res.data.data.infiniteRecord.infiniteSaleProduct.merchantName
          this.productContent = res.data.data.infiniteRecord.infiniteSaleProduct.productContent
          if (res.data.data.infiniteRecord.infiniteSaleProduct.coverImg) {
            let coverIMG = res.data.data.infiniteRecord.infiniteSaleProduct.coverImg.split(',')
            if (coverIMG[0].indexOf('http') > -1) {
              this.imgUrl = coverIMG[0]
              // this.isActiveImg = 0
            } else {
              this.imgUrl = this.variable + res.data.data.infiniteRecord.infiniteSaleProduct.coverImg.split(',')[0]
              // this.isActiveImg = 0
            }
            for (let i = 0; i < coverIMG.length; i++) {
              if (coverIMG[i].indexOf('http') > -1) {
                this.coverImg.push(coverIMG[i])
              } else {
                this.coverImg.push(this.variable + coverIMG[i])
              }
            }
          }
          if (res.data.data.infiniteRecord.infiniteSaleProduct.contentImg) {
            let contentIMG = res.data.data.infiniteRecord.infiniteSaleProduct.contentImg.split(',')
            for (let j = 0; j < contentIMG.length; j++) {
              if (contentIMG[j].indexOf('http') > -1) {
                this.contentImg.push(contentIMG[j])
              } else {
                this.contentImg.push(this.variable + contentIMG[j])
              }
            }
          }
          this.productName = res.data.data.infiniteRecord.infiniteSaleProduct.productName
          if (res.data.data.infiniteRecord.shareUserName) {
            this.shareUserName = res.data.data.infiniteRecord.shareUserName
          }
          let list = []
          list = res.data.data.infiniteRecord.infinitePanicRoundList
          if (list.length === 0) {
            this.noDataPanicRoundList = true
          } else {
            this.noDataPanicRoundList = false
          }
          this.timer = setInterval(() => {
            list.forEach((item) => {
              item.bidLastTime-- // 剩余抢购时间（秒数）
              if (item.bidLastTime <= 0) {
                item.hour = '00'
                item.minute = '00'
                item.second = '00'
                // clearInterval(this.timer)
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
            this.infinitePanicRoundList = list
          }, 1000)
          setTimeout(() => {
            if ($('#goodsImg').outerWidth() > $('#goodsImg').outerHeight()) {
              $('#goodsImg').css('width', '100%')
              this.imgShow = true
            } else {
              $('#goodsImg').css('height', '100%')
              this.imgShow = true
            }
          }, 100)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 4.3 查询抢购商品的我的邀请列表-抢购详情中
    // 接口URL: http://boss.pigamegroup.com/infinite/queryMyPanicTreeList
    getMyPanicTreeList (page) {
      let url = `${this.$api2}infinite/queryMyPanicTreeList?infiniteRecordId=${this.id}&pageIndex=${page}&pageSize=${this.pageSize}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.infiniteTreeList = res.data.data.infiniteTreeList.reverse()
          this.inviteTotal = res.data.data.totalPage
          this.totalCount = res.data.data.totalCount
          // if (res.data.data.infiniteRecord.shareCode && !this.$route.query.shareCode) {
          //   this.getInfiniteTree()
          // }
          this.shareCode = res.data.data.infiniteRecord.shareCode
          this.inviteLink = window.location.host + '/#' + this.$route.path + '?id=' + this.id + '&shareCode=' + this.shareCode
          this.inviteLink2 = '/#' + this.$route.path + '?id=' + this.id + '&shareCode=' + this.shareCode
          // console.log(window.location.href + '&shareCode=' + this.shareCode)
          // this.url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
        } else {
          // this.shareCode = this.$route.query.shareCode
          // this.$router.push({path: '/login', query: {id: this.id, shareCode: this.shareCode}})
        }
      })
    },
    // 抢购状态
    recordStatus (status) {
      if (status === 1) {
        return this.$t('home.text59')
      } else if (status === 2) {
        return this.$t('home.text60')
      } else if (status === 3) {
        return this.$t('home.text61')
      } else if (status === 4) {
        return this.$t('home.text62')
      }
    },
    toGoodsPicture (item, index) {
      this.imgUrl = item
      this.isActiveImg = index
    },
    // 切换tab
    toChoose (num) {
      this.orderTab = num
      if (num === 1) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        clearInterval(this.timer)
        this.getGoodsTreeList(1)
      } else if (num === 2) {
      } else if (num === 3) {
        if (this.$refs.turnPage1) {
          this.$refs.turnPage1.resetPage(1)
        }
        this.getMyPanicTreeList(1)
      }
    },
    // toPage1 (type) {
    //   if (type === 'pre') {
    //     if (this.pageIndex1 > 1) {
    //       this.pageIndex1--
    //       this.getGoodsTreeList()
    //     }
    //   } else if (type === 'next') {
    //     this.pageIndex1++
    //     this.getGoodsTreeList()
    //   }
    // },
    // toPage2 (type) {
    //   if (type === 'pre') {
    //     if (this.pageIndex2 > 1) {
    //       this.pageIndex2--
    //       this.getMyPanicTreeList()
    //     }
    //   } else if (type === 'next') {
    //     this.pageIndex2++
    //     if (this.infiniteTreeList.length === 0 && this.pageIndex2 > 1) {
    //       console.log('111')
    //       this.isDisabled = true
    //     } else {
    //       this.getMyPanicTreeList()
    //     }
    //   }
    // },
    toBuyGoodsDetail (item) {
      // this.$router.push({path: '/buyGoodsDetail', query: {id: this.$route.query.id, purchaseId: item.id}})
      this.$router.push({path: '/buyGoodsDetail', query: {purchaseId: item.id}})
    },
    // 关闭按钮二维码
    closeInvite () {
      this.qrPopupShow = false
      // $('#qrcodeBox').html('')
    },
    closeQrPopup () { // 关闭二维码
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
      // 4.7 构建代理商推广树
    makeInfiniteTree () {
      let url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
      this.$http.post(url2).then(res => {
        if (res.data.status === 'success') {
          this.falg = true
          this.shareUserName = res.data.data
          this.getGoodsTreeList(1)
          this.getMyPanicTreeList(1)
          // this.sign = 2
          // if (res.data.resultCode === 'NOT_LOGGEDIN') {
          //   this.$router.push({path: '/login', query: {id: this.id, shareCode: this.shareCode}})
          // }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // getInfiniteTree () {
    //   let url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
    //   this.$http.post(url2).then(res => {
    //     if (res.data.status === 'failed') {
    //       this.falg = false
    //     } else {
    //       this.falg = true
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // },
    showQrPopup () { // 显示二维码
      if (this.falg === true) {
        this.qrPopupShow = true
      }
      // if (this.shareCode) {
      //   this.falg = true
      //   if (this.falg === true && this.sign === 1) {
      //     this.qrPopupShow = true
      //   } else {
      //     this.purchaseShow = true
      //   }
      // } else {
      //   this.falg = false
      //   if (this.falg === true) {
      //     this.qrPopupShow = true
      //   } else {
      //     this.purchaseShow = true
      //   }
      // }
      // let url2 = `${this.$api2}infinite/makeInfiniteTree?recommendCode=${this.shareCode}`
      // this.$http.post(url2).then(res => {
      //   console.log('123')
      //   if (res.data.status === 'failed') {
      //     // console.log(res.data.msg)
      //     this.purchaseShow = true
      //     console.log(res.data.resultCode)
      //     if (res.data.resultCode === 'NOT_LOGGEDIN') {
      //       this.$router.push({path: '/login', query: {id: this.id, shareCode: this.shareCode}})
      //     }
      //   } else {
      //     this.qrPopupShow = true
      //   }
      // }).catch(err => {
      //   console.log(err)
      // })
      // let downloadUrl
      // if (this.url3 !== '') {
      //   // 绘制二维码
      //   downloadUrl = this.$utf16to8(this.url3)
      // }
      // $('#qrcodeBox').qrcode({
      //   render: 'canvas', //     table方式
      //   width: 200, //            宽度
      //   height: 200, //            高度
      //   text: downloadUrl //      任意内容
      // })
    },
    roundTurnPage (page) {
      clearInterval(this.timer)
      this.roundPage = page
      this.getGoodsTreeList(page)
    },
    inviteTurnPage (page) {
      this.invitePage = page
      this.getMyPanicTreeList(page)
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.goodsParticular
  .goodsParticular-box
    .goodsParticular-content
      .goodsParticular-title
        h6
          font-size 24px
          color #1a1a1a
          font-weight bold
      .goods-box
         .goods-rt
           .my-invite
              height 50px
              width 200px
              background-color #ffba14
              border-radius 4px
              display flex
              justify-content center
              align-items center
              cursor pointer
              outline none
              user-select none
              .btn-invite
                color #fff
                font-size 16px
      .goods-ct
        .introduce-box
          .shop-name
            margin-bottom 20px
      .commonTableList
        thead
          tr
            color: #666;
        tbody
          tr
            color: #1a1a1a;
</style>
