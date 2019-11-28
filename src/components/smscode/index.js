import smscode from './index.vue'
export default smscode
/*
  获取验证码组件

  使用方式：
  1、引入组件
    import smscode from '@/components/smscode'
  2、在components选项里注册
    components: {
      smscode
    }
  3、在template里调用
    <smscode
      @click="handle"
      v-model="data"
      ref="smscode"
    >
    </smscode>
  4、在点击函数里处理
    methods: {
      handle () {
        this.$refs.smscode.loading = true // 显示loading
        this.$refs.smscode.start() // 开始倒计时
      }
    }

  API配置列表：
    <smscode
      @click="handle"  // 点击处理函数 (必填项)
      v-model="data"   // 绑定数据 (必填项)
      ref="smscode"    // 组件钩子 (必填项)
      placeholder      // 文本框提示文字 默认请发送验证码
      btnText          // 按钮文字 默认发送
      time             // 倒计时时间 默认60s
      width            // 组件宽度 默认100%
      height           // 组件高度 默认48px
      borderColor      // 边框颜色 默认#c8c8cc
      borderRadius     // 边框圆角 默认4px
      btnTextColor     // 按钮文字颜色 默认#fff
      btnBgColor       // 按钮背景颜色 默认#095ad4
      btnBgColor       // 按钮宽度 默认100px
      @focus           // 绑定聚焦事件，参数为input的value
      @blur            // 绑定失焦事件，参数为input的value
    >
    </smscode>
*/
