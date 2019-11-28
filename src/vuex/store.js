//   公共请求数据
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'
// const api = 'https://newwallet.wallet202018.com/'
// const api2 = 'https://newboss.wallet202018.com/'
const api = 'http://wallet.pigamegroup.com/'
const api2 = 'http://boss.pigamegroup.com/'

Vue.use(Vuex)

const balance = {
  state: {
    userInfo: [],
    isMerchant: '',
    userData: '',
    account: '',
    user: '',
    address: '',
    loginFlag: false,
    isboss: '',
    piBalance: '',
    purseQuota: { // 可转入转出额度
    },
    coinList: []
  },
  getters: {
    userInfo: state => state.userInfo, // 用户信息balanceData.user
    loginFlag: state => state.loginFlag,
    userData: state => state.userData,
    isboss: state => state.userData.isboss,
    account: state => state.account,
    address: state => state.address,
    piBalance: state => state.piBalance,
    purseQuota: state => state.purseQuota,
    isMerchant: state => state.isMerchant,
    coinList: state => state.coinList
  },
  actions: {
    // 获取用户信息
    getUserBalance ({commit}) {
      let url = `${api}user/balance`
      axios.get(url).then((res) => {
        commit('GET_USER_INFO', res.data)
        commit('GET_LOGIN_FLAG', res.data)
        // console.log(balance.state.piBalance)
      }).catch(() => {
        // console.log('111')
        router.replace('/login')
      })
    },
    // 退出登录
    logoutAction ({state}) {
      // console.log(this.userInfo, this.loginFlag)
      axios.get(`${api}user/logout`).then((res) => {
        if (res.data.success) {
          state.userInfo = [] // 清空header用户信息
          state.loginFlag = false // 登陆状态为false
          // console.log('555')
          router.replace('/login')
        } else if (res.data.resultCode === 'NOT_LOGGEDIN') {
          state.loginFlag = false // 登陆状态为false
          // console.log('222')
          router.replace('/login')
        }
      }).catch(() => {
        state.loginFlag = false // 登陆状态为false
        // console.log('333')
        router.replace('/login')
      })
    },
    // 可转入转出额度
    getPurseQuota ({commit}) {
      axios.post(`${api}purse/getPurseQuota`).then(res => {
        if (res.data.status === 'success') {
          commit('GET_PURSE_QUOTA', res.data)
        }
      })
    },
    // 查询币种列表
    queryCoinList ({commit}) {
      axios.post(`${api2}account/queryCoinList?sourceType=1`).then(res => {
        if (res.data.status === 'success') {
          commit('QUERY_COIN_LIST', res.data)
        }
      })
    }
  },
  mutations: {
    GET_USER_INFO (state, data) {
      if (data.success === true) {
        this.loginFlag = true
        state.account = data.data.account
        state.userData = data.data.user
        state.isboss = data.data.user.isboss
        state.address = data.data.user.address
        state.isMerchant = data.data
        state.userInfo = data
        state.piBalance = data.data.account.piBalance
      } else {
      }
    },
    GET_LOGIN_FLAG (state, data) {
      if (data.resultCode === 'NOT_LOGGEDIN') {
        state.loginFlag = false
        // console.log('444')
        this.$router.replace('/login')
      }
      if (data.success) {
        state.user = data
        state.loginFlag = true
      }
    },
    GET_PURSE_QUOTA (state, data) {
      state.purseQuota = data.data
    },
    QUERY_COIN_LIST (state, data) {
      state.coinList = data.data
    }
  }
}
export default new Vuex.Store({
  modules: {
    balance,
    userData: '',
    account: '',
    address: '',
    piBalance: ''
  }
})
