<template>
  <div class="mybill-detail">
    <!--共享者订单--充值 申诉 -->
    <div class="router-navigation">
      <span class="link" @click="$router.push('/account/orderCashValue')" v-if="isBoss === 0">{{$t('chongzhiTixian.text44')}}</span>
      <span class="link" @click="$router.push('/account/sharerOrder')" v-else>{{$t('shareOrder.text1')}}</span>
      <span class="icon">》</span>
      <span class="link" v-if="isBoss === 0" @click="$router.push({path: '/account/orderCashValue/rechargeOrderDetail', query: {id: this.$route.query.id, isChongzhi: 0}})">{{$t('chongzhiTixian.text46')}}</span>
      <span class="link"  v-else @click="$router.push({path: '/account/sharerOrder/shareRechargeOrderDetail', query: {id: this.$route.query.id, isChongzhi: 0}})">{{$t('chongzhiTixian.text46')}}</span>
      <span class="icon">》</span>
      <span class="link">{{$t('chongzhiTixian.text40')}}</span>
    </div>
    <h3 class="title-text">{{$t('chongzhiTixian.text40')}}</h3>
    <div class="shensu-box">
      <h3 class="title-details">{{$t('shareOrder.text16')}}</h3>
      <h3 class="money" v-show="money"><span>{{money[0]}}</span>.<span class="xiaoshu">{{money[1]}}</span><span class="curren-money">{{orderData.currency}}</span></h3>
      <div class="order-box order-box-shensu">
        <ul class="order-uls">
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text4')}}</span>
            <span class="order-text">{{orderData.id}}</span>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text5')}}</span>
            <span class="order-text" v-show="orderData.createAt">{{$changeDate(orderData.createAt)}}</span>
          </li>
          <li class="order-list" @click="showOrderPro">
            <span class="order-text">{{$t('chongzhiTixian.text34')}}</span>
            <div class="order-text status-text">
              <span>{{orderTypes(orderData, orderData.tipMsg)}}</span>
              <div class="icon-sanjiao"></div>
            </div>
          </li>
          <li class="order-list">
            <span class="order-text">{{$t('chongzhiTixian.text35')}}</span>
            <span class="order-text">{{orderData.bossNick}}</span>
          </li>
        </ul>
      </div>
      <div class="shensu-yuan">
        <div class="title-label">{{$t('shareOrder.text2')}}</div>
        <ul class="check-uls">
          <li class="check-list" @click="checkOne(index, item)" v-for="(item, index) in reasonData" :key="index" :class="{'checked': currentIndex === index}">
            <div class="circle">
              <span class="gou1 icon-gou"></span>
              <span class="gou2 icon-gou"></span>
            </div>
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
      <div class="shensu-cont">
        <div class="title-label">{{$t('shareOrder.text3')}}</div>
        <div class="shensu-text-box">
          <textarea :placeholder="$t('shareOrder.text4')" class="textarea" v-model="problemContent" @input="textareaVal"></textarea>
          <div class="warm-num"><span class="text-count">{{descNum}}</span>/<span>500</span></div>
        </div>
        <p class="err-class">{{noneContent}}</p>
      </div>
      <div  class="upload-wrapper">
        <div class="img-lis" v-for="(item, index) in imgDataObj" :key="index" @click="showBig(item)">
          <img :src="item" alt="" @error="errorImg(item, index)">
          <div class="delete" @click.stop.prevent="deleteIndex(index)">
            <span class="icon icon1"></span>
            <span class="icon icon2"></span>
          </div>
        </div>
        <div  class="img-loading-box" v-show="isLoading">
          <img  src="../../../../assets/images/commons/loading.gif" alt="" class="img-loading">
        </div>
        <div  class="img-box" v-show="isMaxLoading">
          <input @change="fileChange()" ref="uploadFile" accept="image/*" placeholder="" type="file" id="upload_file"/>
          <div  class="text"><img class="upload_add" src="../../../../assets/images/commons/upload_add.svg" alt=""></div>
        </div>
      </div>
      <div class="err-class">{{noneImg}}</div>
      <div class="button-w">
        <div class="button" @click="sendShensu">{{$t('shareOrder.text5')}}</div>
      </div>
    </div>
    <!-- 订单进程弹窗-->
    <order-process :step-data="stepData" :last-status="lastStatus" :order-data="orderData" ref="showOrderProcess"></order-process>
    <div class="dialog-wrapper" v-show="showDialog2" @click="showDialog2 = false">
      <div class="dialog-content img-dialog" @click.stop>
        <div class="close-confirm" @click="showDialog2 = false">
          <div class="close-icon">
            <div class="line line1"></div>
            <div class="line line2"></div>
          </div>
        </div>
        <div class="dialog-img-box">
          <img :src="bigImg" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {compress, dataURItoBlob} from '../../../../assets/js/upload'
import Dialog from '@/components/dialog/dialog'
import orderProcess from '@/components/orderProcess.vue'
export default {
  data () {
    return {
      showDialog2: false,
      bigImg: '',
      num: -1,
      stepData: [],
      lastStatus: 0,
      problemContent: '',
      noneContent: '',
      descNum: 0,
      noneImg: '',
      stepListLen: 1,
      showDialog: false,
      orderData: '',
      bossAccount: '',
      money: '',
      result: '',
      imagesArr: [],
      currentIndex: 0,
      problemText: this.$t('shareOrder.text6'),
      reasonData: [this.$t('shareOrder.text6'), this.$t('shareOrder.text7'), this.$t('shareOrder.text8')],
      isLoading: false,
      isMaxLoading: true,
      isBoss: Number(this.$route.query.isBoss),
      imgDataObj: []
    }
  },
  created () {
    this.getChongzhi()
  },
  methods: {
    showBig (item) {
      this.showDialog2 = true
      this.bigImg = item
    },
    // 充值详情
    getChongzhi () {
      this.$postAxios.post(`${this.$api2}deposit/queryOrderDetail`, {
        orderId: this.$route.query.id
      }).then(res => {
        if (res.data.status === 'success') {
          this.orderData = res.data.data
          this.lastStatus = res.data.data.stepList[res.data.data.stepList.length - 1].status
          this.bossAccount = JSON.parse(res.data.data.bossReceiveAccount)
          this.money = this.orderData.amount.toFixed(4).split('.')
          this.stepListLen = this.orderData.stepList.length
          this.stepData = this.stepData.concat(res.data.data.stepList)
          this.stepData.splice(this.stepData.length - 1, 1)
        }
      })
    },
    orderTypes (item, msg) {
      if (item.payState === 1 && item.orderState === 2) {
        return this.$t('orderStatus.text1')
      } else {
        if (msg && msg.indexOf(',') === 0) {
          return msg.splice(0, 1)
        } else {
          return msg
        }
      }
    },
    // 输入文字控制
    textareaVal () {
      this.descNum = this.problemContent.length
      this.noneContent = ''
      if (this.problemContent.length > 500) {
        this.descNum = 500
        this.problemContent = this.problemContent.substring(0, 500)
      }
    },
    checkOne (index, item) {
      this.problemText = item
      this.currentIndex = index
    },
    sendShensu () {
      if (this.problemContent === '') {
        this.noneContent = this.$t('shareOrder.text9')
      }
      if (this.imagesArr.length === 0) {
        this.noneImg = this.$t('shareOrder.text10')
      }
      if (this.problemContent !== '' && this.imagesArr.length > 0) {
        Dialog({
          title: this.$t('shareOrder.text11'),
          content: this.$t('shareOrder.text12'),
          okFn: () => {
            let imglist = this.imagesArr.join(',')
            this.$postAxios.post(`${this.$api2}deposit/createArbitration`, {
              orderId: this.$route.query.id,
              reqImgList: imglist,
              remark: this.problemContent,
              reqType: this.problemText
            }).then(res => {
              if (res.data.status === 'success') {
                this.$router.push({
                  path: '/account/sharerOrder/rechargeAppealDetail',
                  query: {
                    id: this.$route.query.id,
                    isBoss: this.isBoss
                  }
                })
              } else {
                Dialog({
                  title: '',
                  content: res.data.msg
                })
              }
            })
          }
        })
      }
    },
    errorImg (item, index) {
      this.num = -1
      this.isMaxLoading = true
      this.imgDataObj.splice(index, 1)
      this.imagesArr.splice(index, 1)
    },
    async fileChange (e) {
      this.noneImg = ''
      let imgVal = this.$refs.uploadFile
      let imgObj = imgVal.files[0]
      if (imgObj) {
        let isLt2M = imgObj.size / 1024 / 1024 <= 5
        let isType = /(jpg|png|JPG|PNG|jpeg)$/g.test(imgObj.type)
        if (!(isLt2M && isType)) {
          this.noneImg = this.$t('shareOrder.text13')
          imgVal.value = ''
          return
        }
      } else {
        return
      }
      if (this.imgDataObj.length > 4) {
        this.noneImg = this.$t('shareOrder.text14')
        imgVal.value = ''
        return
      }
      this.isLoading = true
      if (this.imgDataObj.length > 3) {
        this.num = 5
        this.isMaxLoading = false
      } else {
        this.num = -1
        this.isMaxLoading = true
      }
      let reader = new FileReader()
      let self = this
      reader.readAsDataURL(imgObj)
      reader.onloadend = function () {
        let result = this.result
        let img = new Image()
        img.src = result
        img.onload = function () {
          let formData = new FormData()
          let data = compress(img)
          self.imgUrl = result
          let blob = dataURItoBlob(data)
          let reader2 = new FileReader()
          reader2.readAsArrayBuffer(blob)
          reader2.onloadend = function () {
            // let f = new File([this.result], imgObj.name)
            formData.append('file', imgObj)
            formData.append('sourceType', '0')
            let config = {
              headers: { 'Content-Type': 'multipart/form-data' }
            }
            self.$http.post(`${self.$api}blobfile/uploadBlobFile`, formData, config).then((res) => {
              let rets = res.data
              self.isLoading = false
              if (rets.success === true && rets.status === 'success') {
                self.noneImg = ''
                let srcData = rets.data[0]
                let src = srcData.fileUrl
                self.imgDataObj.push(src)
                self.imagesArr.push(srcData.fileName)
              } else if (rets.resultCode.indexOf('NOT_LOGGEDIN') > -1) {
                self.noneImg = rets.msg
                self.$router.push('/login')
              } else {
                self.noneImg = rets.msg
              }
              //  可上传重复的图片
              imgVal.value = ''
            }).catch((err) => {
              self.isLoading = false
              console.log(err)
              imgVal.value = ''
              self.noneImg = this.$t('shareOrder.text15')
            })
          }
        }
      }
    },
    showOrderPro () {
      this.$refs.showOrderProcess.show()
    },
    deleteIndex (index) {
      this.num = -1
      this.isMaxLoading = true
      this.imgDataObj.splice(index, 1)
      this.imagesArr.splice(index, 1)
    }
  },
  components: {
    orderProcess
  }
}
</script>
