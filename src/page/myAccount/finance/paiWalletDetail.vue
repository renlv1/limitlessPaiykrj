<template>
  <div class="paiwalletDetail">
    <div class="bread">
      <router-link to="/account/paiWallet" tag="i">{{$t('finance.text45')}}</router-link>》
      <span>{{$t('finance.text46')}}</span>
    </div>
    <h3>{{$t('finance.text45')}}</h3>
    <div class="orderDetail">
      <h5>{{$t('finance.text48')}}</h5>
      <p><span>{{formatMoney(detail.changeAmount).split('.')[0]}}.</span><b>{{formatMoney(detail.changeAmount).split('.')[1]}}</b> <i>π</i></p>
      <ul>
        <li><span>{{$t('chongzhiTixian.text4')}}</span><span>{{detail.id}}</span></li>
        <li><span>{{$t('chongzhiTixian.text5')}}</span><span>{{$changeDate(detail.createAt)}}</span></li>
        <li><span>{{$t('chongzhiTixian.text34')}}</span><span class="type">{{parseChangeType(detail.changeType)}}</span></li>
        <li v-if="detail.sourceId"><span>{{$t('finance.text47')}}</span><span>{{detail.sourceId}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      id: this.$route.query.id,
      detail: ''
    }
  },
  mounted () {
    this.getPaiPurseDetail()
  },
  methods: {
    // 6.02 帐户余额变化记录详情
    // http://wallet.pigamegroup.com/purse/getPaiPurseDetail
    getPaiPurseDetail () {
      let url = `${this.$api}purse/getPaiPurseDetail?id=${this.id}`
      this.$http.post(url).then(res => {
        if (res.data.status === 'success') {
          this.detail = res.data.data.userPaiPurseRecord
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 解析changeType Integer 变动类型 1:余额转入 2:余额转出 3:派付消费 4:寻宝奖励 5:上级购买 6:卖给下级 7:派付退款 查询所有无需传递该参数
    parseChangeType (type) {
      switch (type) {
        case 1 :
          return this.$t('finance.text38')
        case 2 :
          return this.$t('finance.text39')
        case 3 :
          return this.$t('finance.text40')
        case 4 :
          return this.$t('finance.text41')
        case 5 :
          return this.$t('finance.text42')
        case 6 :
          return this.$t('finance.text43')
        case 7 :
          return this.$t('finance.text44')
        default:
          return '--'
      }
    },
    formatMoney (value, tag = ',') {
      if (!value) {
        return '0.0000'
      } else {
        if (!isNaN(value) && value !== null) {
          if (value < 0) {
            value = Math.abs(value)
            let f = Math.floor(value * 100) * 100 / 10000
            let _value = f.toString()
            let rs = _value.indexOf('.')
            if (rs < 0) {
              rs = _value.length
              _value += '.'
            }
            while (_value.length <= rs + 4) {
              _value += '0'
            }
            let newStr = _value.split('.')
            if (newStr[0].length <= 3) {
              return '-' + newStr[0] + '.' + newStr[1]
            }
            let r = newStr[0].length % 3
            _value = r > 0 ? newStr[0].slice(0, r) + tag + newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag) : newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag)
            _value = _value + '.' + newStr[1]
            return '-' + _value
          } else {
            let f = Math.floor(value * 100) * 100 / 10000
            let _value = f.toString()
            let rs = _value.indexOf('.')
            if (rs < 0) {
              rs = _value.length
              _value += '.'
            }
            while (_value.length <= rs + 4) {
              _value += '0'
            }
            let newStr = _value.split('.')
            if (newStr[0].length <= 3) {
              return newStr[0] + '.' + newStr[1]
            }
            let r = newStr[0].length % 3
            _value = r > 0 ? newStr[0].slice(0, r) + tag + newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag) : newStr[0].slice(r, newStr[0].length).match(/\d{3}/g).join(tag)
            _value = _value + '.' + newStr[1]
            return _value
          }
        }
      }
    }
  }
}
</script>

<style lang="less" type="text/less" scoped>
  .paiwalletDetail{
    background-color: #fafafc;
    width: 100%;
    padding: 40px 60px;
    h3{
      font-size: 34px;
      font-weight: bold;
      color: #1a1a1a;
      margin-bottom: 60px;
    }
    .orderDetail{
      width: 100%;
      height: 600px;
      background-color: #fff;
      padding: 40px 100px;
      h5{
        height: 50px;
        text-align: center;
        font-size: 20px;
        font-weight: bold;
        line-height: 50px;
      }
      p{
        margin: 10px 0 30px;
        text-align: center;
        font-weight: bold;
        span{
          color: #1a1a1a;
          font-size: 30px;
        }
        b{
          color: #1a1a1a;
          font-size: 20px;
          font-weight: bold;
        }
        i{
          color: #ffba14;
          font-size: 20px;
          font-weight: bold;
        }
      }
      ul{
        border: 1px solid #e7e8ec;
        li{
          display: flex;
          height: 50px;
          border-bottom: 1px solid #e7e8ec;
          align-items: center;
          &:nth-last-child(1) {
            border-bottom: none;
          }
          &:nth-child(odd) {
            background-color: #fff;
          }
          &:nth-child(even) {
            background-color: #fcfcfc;
          }
          span{
            flex: 1;
            text-align: left;
            padding-left: 30px;
            &.type{
              color: #12a041;
            }
          }
        }
      }
    }
  }
</style>
