<template>
    <div class="sharerAudit">
      <div class="registered-sharer-box">
        <div class="title">{{$t('sharer.text1')}}</div>
        <!--审核个人信息...-->
        <div class="tabBtn" v-if="informationShow">
          <div class="btn appForbtn appForbtnShenHe"></div>
          <div class="btn information"></div>
          <div class="btn result"></div>
        </div>
        <!--审核通过,成为共享者-->
        <div class="tabBtn" v-else-if="isSharerShow">
          <div class="btn appForbtn appForbtnShenHe"></div>
          <div class="btn appForbtn appForbtnShenHe"></div>
          <div class="btn appForbtn appForbtnShenHeLast"></div>
        </div>
        <!--审核失败-->
        <div class="tabBtn" v-else-if="noSharerShow">
          <div class="btn appForbtn appForbtnShenHe"></div>
          <div class="btn appForbtn appForbtnShenHe"></div>
          <div class="btn appForbtn appNoForbtnShenHeLast"></div>
        </div>
        <!-- table-->
        <div class="tab-title">
          <div class="tit">{{$t('sharer.text2')}}</div>
          <div class="tit">{{$t('sharer.text3')}}</div>
          <div class="tit">{{$t('sharer.text4')}}</div>
        </div>
        <div class="" v-loading.lock="fullscreenLoading" :element-loading-text="$t('sharer.text37')"></div>
        <div class="review-progress" v-show="informationShow">
          <div class="imgBg"></div>
          <div class="textmsg">正在审核个人信息 ...</div>
        </div>
        <div class="review-progress" v-show="isSharerShow">
          <div class="isSharerShowImgBg"></div>
          <div class="textmsg">审核成功! 恭喜你成为共享者.</div>
          <router-link to="/setSharePay" v-if="status === 1" tag="div" class="btn">确认</router-link>
        </div>
        <div class="review-progress" v-show="noSharerShow">
          <div class="nOSharerShowImgBg"></div>
          <div class="notextmsg">{{$t('sharer.text38')}}: {{causeOfFailure}}</div>
          <div class="error-btn" :class="{active: btnActive}" @click="resubmit()">{{$t('sharer.text39')}}</div>
        </div>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        informationShow: false, // 审核个人信息中
        isSharerShow: false, // 审核通过
        noSharerShow: false, // 审核失败
        causeOfFailure: '', // 审核失败提示
        status: '',
        btnActive: false,
        shAddress: this.$route.query.shaddress,
        fullscreenLoading: true // 默认加载
      }
    },
    created () {
      this.$store.dispatch('getUserBalance')
    },
    mounted() {
      this.$nextTick(() => {
        this.$http.post(`${this.$api2}pigame/queryByAddress?address=${this.shAddress}`).then((res) => {
          if (res.data.status === 'success') {
            this.fullscreenLoading = false
            this.status = res.data.data.status
            // "status":0,// 状态 0--待审核 1--审核通过  2--暂停服务  3--审核被拒绝  4--被封禁(终止服务)
            setTimeout(() => {
              if (res.data.data.status === 0) {
                this.fullscreenLoading = false
                this.informationShow = true
              } else if (res.data.data.status === 1) {
                this.fullscreenLoading = false
                this.isSharerShow = true
              } else {
                this.fullscreenLoading = false
                this.noSharerShow = true
                if (res.data.data.status === 2) {
                  this.causeOfFailure = this.$t('sharer.text40')
                } else if (res.data.data.status === 3) {
                  this.causeOfFailure = this.$t('sharer.text41')
                } else if (res.data.data.status === 4) {
                  this.causeOfFailure = this.$t('sharer.text42')
                }
              }
            }, 400)
          }
        })
      })
    },
    methods: {
      resubmit () {
        this.btnActive = !this.btnActive
        this.$router.push({path: '/applySharer', query: {auditFailure: this.status}})
      }
    }
  }
</script>

<style lang="less" scoped>
  .sharerAudit{
    width: 100%;
    height: 100%;
    background-color: #FAFAFC;
    .registered-sharer-box{
      width: 1550px;
      height: auto;
      margin: auto;
      @media screen and(max-width: 1590px) {
        width: 100%;
        padding: 0 20px;
      }
      .title{
        font-size: 34px;
        font-weight: bold;
        color: #1a1a1a;
        padding: 60px 0;
      }
      .tabBtn{
        width: 552px;
        margin: auto;
        height: 2px;
        background-color: #c4c6cc;
        display: flex;
        justify-content: space-between;
        .btn{
          width: 20px;
          height: 20px;
          background-color: #FAFAFC;
          border: 2px solid #c4c6cc;
          border-radius: 100%;
          margin-top: -10px;
        }
        .appForbtn{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/ongoing.png") no-repeat;
          background-size: 100%;
          margin-left: -3px;
          position: relative;
        }
        .appForbtnShenHe{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/complete.png") no-repeat;
          background-size: 100%;
          margin-left: -2px;
          &:after{
            content: '';
            display: inline-block;
            width: 247px;
            height: 2px;
            position: absolute;
            left: 145px;
            top: 43%;
            transform: translate(-50%);
            background-color: #4B84FF;
          }
        }
        .appForbtnShenHeLast{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/complete.png") no-repeat;
          background-size: 100%;
          margin-right: -2px;
        }
        .appNoForbtnShenHeLast{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/failure.png") no-repeat;
          background-size: 100%;
          margin-right: -2px;
        }
        .information{
          width: 24px;
          height: 24px;
          border: none;
          background: url("../../assets/images/applySharers/ongoing.png") no-repeat;
          background-size: 100%;
          margin-left: -3px;
        }
      }
      .tab-title{
        width: 634px;
        margin: auto;
        padding: 20px 0 70px;
        display: flex;
        font-size: 18px;
        color: #666;
        justify-content: space-between;
        .tit{
          width: 33%;
          &:nth-child(2){
            text-align: center;
          }
          &:nth-child(3){
            text-align: right;
            padding-right: 20px;
          }
        }
      }
      .review-progress{
        width: 552px;
        margin: auto;
        .imgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/Waiting.png") no-repeat;
          margin: 0 auto;
        }
        .isSharerShowImgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/big_complete.png") no-repeat;
          margin: 0 auto;
        }
        .nOSharerShowImgBg{
          width: 120px;
          height: 108px;
          background: url("../../assets/images/applySharers/big_failure.png") no-repeat;
          margin: 0 auto;
        }
        .textmsg{
          width: 552px;
          margin: auto;
          font-size: 16px;
          color: #1a1a1a;
          text-align: center;
          padding-top: 20px;
        }
        .btn{
          width: 200px;
          height: 50px;
          margin: 30px auto 0;
          line-height: 50px;
          font-size: 20px;
          color: #fff;
          text-align: center;
          background-color: #FFBA14;
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          cursor: pointer;
          &:hover{
            opacity: .9;
          }
        }
        .notextmsg{
          color: #e93a3a;
          text-align: center;
          padding: 20px 0 60px;
        }
        .error-btn{
          width: 200px;
          height: 50px;
          line-height: 50px;
          color: #fff;
          font-size: 20px;
          background-color: #ffba14;
          border-radius: 4px;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          margin: auto;
          text-align: center;
          cursor: pointer;
          &.active{
            opacity: .9;
          }
        }
      }
    }
  }
</style>
