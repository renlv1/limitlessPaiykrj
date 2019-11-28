<template>
    <div class="googleoOrcode">
      <div class="title">
        <h2>{{$t('bossGoogle.text1')}} > {{$t('bossGoogle.text7')}}</h2>
      </div>
      <form class="formTable" action="">
        <div class="content">
          <div class="oRcode-box">
            <div class="oRcode-bg" id="qrcode-three"></div>
            <div class="oRcode">
              <div class="con-box">
                <div class="tit">{{$t('bossGoogle.text8')}}</div>
                <div class="code-box">
                  <span class="code" id="copyAddress_input2">{{$route.query.secret}}</span>
                  <span class="copy" @click="copyAddress()" ref="addressCopy1" data-clipboard-action="copy" data-clipboard-target="#copyAddress_input2">{{$t('bossGoogle.text9')}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="google-tit">{{$t('bossGoogle.text1')}}</div>
          <input type="number" class="googleCode" v-model.trim="googleCode" @focus="googleCodeError = ''" autocomplete="off" :placeholder="$t('bossGoogle.text10')">
          <div class="btn" @click="submitGoogleCode()">
            {{$t('signIn.text10')}}
            <div class="hint">{{googleCodeError}}</div>
          </div>
        </div>
      </form>
    </div>
</template>

<script>
import $ from 'jquery'
import '@/assets/js/jquery.qrcode.min'
import Dialog from '@/components/dialog/dialog'
export default {
  data () {
    return {
      copyBtn: null,
      googleCode: '',
      googleCodeError: ''
    }
  },
  mounted () {
    setTimeout(() => {
      $('#qrcode-three').empty()
      let downloadUrl = this.$utf16to8(this.$route.query.qrcode)
      $('#qrcode-three').qrcode({
        render: 'canvas', //     table方式
        width: 150, //            宽度
        height: 150, //            高度
        text: downloadUrl //      任意内容
      })
      this.copyBtn = new this.Clipboard(this.$refs.addressCopy1)
    }, 20)
  },
  created () {},
  components: {},
  methods: {
    // 复制
    copyAddress () {
      let clipboard = this.copyBtn
      clipboard.on('success', () => {
        Dialog({
          content: this.$t('bossGoogle.text11') // 内容文字
        })
        clipboard.destroy()
        this.copyBtn = new this.Clipboard(this.$refs.addressCopy1) // 复制
      })
    },
    submitGoogleCode () {
      if (this.googleCode === '') {
        this.googleCodeError = this.$t('bossGoogle.text10')
      } else {
        this.$http.post(`${this.$api}security/google_band?code=${this.googleCode}`).then((res) => {
          if (res.data.success === true) {
            Dialog({
              content: this.$t('bossGoogle.text12'),
              okFn: () => {
                this.$router.push('/account/unbindGoole')
              }
            })
          } else {
            this.googleCodeError = res.data.msg
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .googleoOrcode{
    padding: 60px 60px 0 60px;
    .title{
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      h2{
        font-weight: bold;
      }
      .goto-google-btn{
        width: 200px;
        height: 100%;
        line-height: 50px;
        text-align: center;
        background-color: #ffba14;
        color: #fff;
        cursor: pointer;
        border-radius: 6px;
        font-size: 18px;
        box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
        &:hover{
          color: #1a1a1a;
          opacity: .9;
        }
      }
    }
    .formTable{
      width: 100%;
      border: 1px solid #e7e8ec;
      border-radius: 4px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      .content{
        width: auto;
        margin: auto;
        .oRcode-box{
          width: 100%;
          height: 150px;
          margin: 50px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          .oRcode-bg{
            width: 150px;
            height: 100%;
            background-color: yellow;
          }
          .oRcode{
            height: 100%;
            margin-left: 20px;
            display: flex;
            align-items: center;
            .con-box{
              font-size: 16px;
              color: #1a1a1a;
              .tit{
                padding-bottom: 20px;
              }
              .code-box{
                .code{
                  font-weight: bold;
                }
                .copy{
                  display: inline-block;
                  width: 60px;
                  height: 24px;
                  text-align: center;
                  line-height: 24px;
                  color: #ffba14;
                  border: 1px solid #ffba14;
                  border-radius: 24px;
                  cursor: pointer;
                  font-size: 14px;
                  margin-left: 20px;
                  &:hover{
                    background-color: #ffba14;
                    color: #fff;
                  }
                }
              }
            }
          }
        }
        .google-tit{
          font-size: 16px;
          color: #1a1a1a;
          padding-bottom: 10px;
        }
        .googleCode{
          width: 100%;
          height: 44px;
          line-height: 44px;
          border: 1px solid #e7e8ec;
          border-radius: 4px;
          padding-left: 15px;
          font-size: 16px;
          &::-webkit-input-placeholder{
            color: #999;
          }
          &:-moz-placeholder{
            color: #999;
          }
          &::-moz-placeholder{
            color: #999;
          }
          &:-ms-input-placeholder{
            color: #999;
          }
        }
        .btn{
          width: 100%;
          height: 40px;
          line-height: 40px;
          margin: 30px auto 100px;
          text-align: center;
          color: #fff;
          font-size: 16px;
          background-color: #ffba14;
          box-shadow: 0 2px 2px rgba(255, 153, 20, 0.4);
          border-radius: 4px;
          position: relative;
          cursor: pointer;
          &:hover{
            opacity: .9;
          }
          .hint{
            position: absolute;
            left: 0;
            top: -34px;
            font-size: 14px;
            color: #e93a3a;
          }
        }
      }
    }
  }
</style>
