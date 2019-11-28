<template>
  <div class="sms-container" :class="{active: activeColor}" :style="styles">
    <input
      type="number"
      class="sms-input"
      :style="{borderColor: borderColor, borderRadius: borderRadius}"
      :value="value"
      @input="$emit('input', $event.target.value)"
      @focus="$emit('focus', $event.target.value), activeColor = true"
      @blur="$emit('blur', $event.target.value), activeColor = false"
      :placeholder="placeholder" />
    <button
      :disabled="disabled || loading"
      class="sms-btn"
      :style="btnStyles"
      @click="send">
      <i v-if="loading" class="el-icon-loading"></i>
      <span :class="{active: activeColor}" v-else>{{countText}}</span>
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeColor: false,
      styles: { // 文本框样式
        width: this.width,
        height: this.height,
        borderRadius: this.borderRadius
      },
      btnStyles: { // 按钮样式
        color: this.btnTextColor,
        background: this.btnBgColor,
        width: this.btnWidth
      },
      initText: this.btnText, // 初始文字
      countText: this.btnText, // 倒计时文字
      countTime: this.time, // 倒计时
      timer: null,
      disabled: false,
      loading: false
    }
  },
  props: {
    value: '',
    time: {
      type: Number,
      default: 60
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '44px'
    },
    borderColor: {
      type: String,
      default: '#c8c8cc'
    },
    borderRadius: {
      type: String,
      default: '4px'
    },
    btnTextColor: {
      type: String,
      default: '#4b84ff'
    },
    btnWidth: {
      type: String,
      default: '100px'
    },
    btnBgColor: {
      type: String,
      default: '#fff'
    },
    btnText: {
      type: String,
      default: () => {
        return localStorage.getItem('Qlang') === 'CN' ? '获取验证码' : 'Send'
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return localStorage.getItem('Qlang') === 'CN' ? '请输入邮箱验证码' : 'Enter verification code'
      }
    }
  },
  methods: {
    start () {
      this.disabled = true
      if (this.countTime === 0) {
        this.countText = this.initText
        this.countTime = this.time
        this.disabled = false
      } else {
        this.countTime--
        this.countText = this.countTime
        this.timer = setTimeout(() => this.start(), 1000)
      }
    },
    send () {
      this.$emit('click')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>

<style lang="less">
  .sms-container{
    height: 48px;
    position: relative;
    overflow: hidden;
    &.active{
      box-shadow: 0 0 2px 2px rgba(255, 153, 20, 0.1) !important;
      border: 1px solid rgba(255, 153, 20, .4) !important;
    }
    .sms-input{
      width: 100%;
      padding: 0 115px 0 15px;
      height: 100%;
      border: 1px solid #c8c8cc;
      font-size: 14px;
      color: #999;
    }
    .sms-btn{
      position: absolute;
      height: 100%;
      right: 0;
      top: 0;
      text-align: center;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      line-height: 1;
      &:hover{
        opacity: .9;
      }
      &:disabled{
        background: #aaa !important;
        opacity: 1;
        cursor: default;
      }
      span{
        position: relative;
        display: block;
        font-size: 14px;
        &:after{
          position: absolute;
          display: block;
          content: '';
          width: 1px;
          height: 16px;
          background-color: #e7e8ec;
          // background-color: rgba(255, 153, 20, .4) !important;
          z-index: 10 !important;
          left: 0 !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
        }
        &.active{
          &:after{
            background: rgba(255, 153, 20, .4) !important;
          }
        }
      }
    }
  }
</style>
