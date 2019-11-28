import Vue from 'vue'
import Router from 'vue-router'
import home from '@/page/home/home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 代理商竞拍
    {
      path: '/home', // 首页
      name: 'home',
      component: home
    },
    // 登录
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/page/login/login'], resolve)
    },
    // 未绑定邮箱账号,登录绑定邮箱
    {
      path: '/loginBindEmail',
      name: 'loginBindEmail',
      component: resolve => require(['@/page/login/loginBindEmail'], resolve)
    },
    {
      path: '/signIn', // 注册
      name: 'signIn',
      component: resolve => require(['@/page/login/signIn'], resolve)
    },
    {
      path: '/forgetThePassword', // 忘记密码
      name: 'forgetThePassword',
      component: resolve => require(['@/page/login/forgetThePassword'], resolve)
    },
    {
      path: '/googlePwd', // 谷歌找回密码
      name: 'googlePwd',
      component: resolve => require(['@/page/login/forgetPwdpages/googlePwd'], resolve)
    },
    {
      path: '/emailPwd', // 邮箱找回密码
      name: 'emailPwd',
      component: resolve => require(['@/page/login/forgetPwdpages/emailPwd'], resolve)
    },
    {
      path: '/goodsParticular', // 商品详情
      name: 'goodsParticular',
      component: resolve => require(['@/page/home/goodsParticular'], resolve)
    },
    // 商品抢购
    {
      path: '/buyGoods', // 商品抢购
      name: 'buyGoods',
      component: resolve => require(['@/page/buyGoods/buyGoods'], resolve)
    },
    {
      path: '/buyGoodsDetail', // 商品抢购-查看详情
      name: 'buyGoodsDetail',
      component: resolve => require(['@/page/buyGoods/buyGoodsDetail'], resolve)
    },
    {
      path: '/goodsDetail', // 抢购商品-商品详情
      name: 'goodsDetail',
      component: resolve => require(['@/page/buyGoods/goodsDetail'], resolve)
    },
    // 成为共享者
    {
      path: '/applySharer', // 现在申请
      name: 'applySharer',
      component: resolve => require(['@/page/becomeSharer/applySharer'], resolve)
    },
    {
      path: '/becomeSharer', // 成为共享者
      name: 'becomeSharer',
      component: resolve => require(['@/page/becomeSharer/becomeSharer'], resolve)
    },
    {
      path: '/sharerAudit', // 共享者审核
      name: 'sharerAudit',
      component: resolve => require(['@/page/becomeSharer/sharerAudit'], resolve)
    },
    // 共享充值/提现
    {
      path: '/accountInfo', // 账户信息
      name: 'accountInfo',
      component: resolve => require(['@/page/sharePay/accountInfo'], resolve)
    },
    {
      path: '/accountMoney', // 币种账户
      name: 'accountMoney',
      component: resolve => require(['@/page/sharePay/accountMoney'], resolve)
    },
    {
      path: '/setSharePay', // 共享充提设置
      name: 'setSharePay',
      component: resolve => require(['@/page/sharePay/setSharePay'], resolve)
    },
    // 数字交易平台
    {
      path: '/tradingPlatform', // 数字交易平台
      name: 'tradingPlatform',
      component: resolve => require(['@/page/tradingPlatform/tradingPlatform'], resolve)
    },
    // 我的账户
    {
      path: '/account', // 我的账户
      name: 'account',
      redirect: {name: 'myAccount'},
      component: resolve => require(['@/page/myAccount/myAccountNav'], resolve),
      children: [
        // 1. 账户预览
        {
          path: 'myAccount', // 我的账户
          name: 'myAccount',
          component: resolve => require(['@/page/myAccount/accountManage/myAccount'], resolve)
        },
        {
          path: 'addAccount', // 添加新账户
          name: 'addAccount',
          component: resolve => require(['@/page/myAccount/accountManage/addAccount'], resolve)
        },
        {
          path: 'gatheringManage', // 收款管理
          name: 'gatheringManage',
          component: resolve => require(['@/page/myAccount/accountManage/gatheringManage'], resolve)
        },
        // 谷歌验证, 支付未开谷歌验证去开启谷歌
        {
          path: 'googleAuthenticator',
          name: 'googleAuthenticator',
          component: resolve => require(['@/page/myAccount/accountManage/googleAuthenticator'], resolve)
        },
        // 解绑谷歌
        {
          path: 'unbindGoole',
          name: 'unbindGoole',
          component: resolve => require(['@/page/myAccount/accountManage/unbindGoole'], resolve)
        },
        {
          path: 'googleAuthenticator/googleQrCode',
          name: 'googleQrCode',
          component: resolve => require(['@/page/myAccount/accountManage/googleQrCode'], resolve)
        },
        {
          path: 'gatheringManageDetail', // 收款管理详情
          name: 'gatheringManageDetail',
          component: resolve => require(['@/page/myAccount/accountManage/gatheringManageDetail'], resolve)
        },
        // 2. 无限竞派
        {
          path: 'goodsManagement', // 竞拍商品管理
          name: 'goodsManagement',
          component: resolve => require(['@/page/myAccount/limitlessPi/goodsManagement/goodsManagement'], resolve)
        },
        {
          path: 'goodsManagement/goodsDetails', // 竞拍商品管理 -- 竞拍编辑
          name: 'goodsDetails',
          component: resolve => require(['@/page/myAccount/limitlessPi/goodsManagement/goodsDetails'], resolve)
        },
        {
          path: 'goodsManagement/goodsInfo', // 竞拍商品管理 -- 竞拍详情
          name: 'goodsInfo',
          component: resolve => require(['@/page/myAccount/limitlessPi/goodsManagement/goodsInfo'], resolve)
        },
        {
          path: 'goodsManagement/goodsAdd', // 竞拍商品管理 -- 添加竞拍
          name: 'goodsAdd',
          component: resolve => require(['@/page/myAccount/limitlessPi/goodsManagement/goodsAdd'], resolve)
        },
        {
          path: 'myAuction', // 我的竞拍
          name: 'myAuction',
          component: resolve => require(['@/page/myAccount/limitlessPi/myAuction/myAuction'], resolve)
        },
        {
          path: 'buyGoodsMenage', // 商品抢购管理
          name: 'buyGoodsMenage',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/buyGoodsMenage'], resolve)
        },
        {
          path: 'buyGoodsMenage/buyGoodsMenageDetail', // 商品抢购管理详情
          name: 'buyGoodsMenageDetail',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/buyGoodsMenageDetail'], resolve)
        },
        {
          path: 'regulationTemp/ruleOptions', // 商品抢购--抢购规则
          name: 'ruleOptions',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/ruleOptions'], resolve)
        },
        {
          path: 'buyGoodsMenage/buyGoodsMenageRecord', // 商品抢购管理详情 -- 抢购记录
          name: 'buyGoodsMenageRecord',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/buyGoodsMenageRecord'], resolve)
        },
        {
          path: 'buyGoodsMenage/buyGoodsRuleInfo', // 商品抢购管理详情 -- 抢购规则详情不可编辑
          name: 'buyGoodsRuleInfo',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/buyGoodsRuleInfo'], resolve)
        },
        {
          path: 'regulationTemp', // 商品抢购规则模板
          name: 'regulationTemp',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/regulationTemp'], resolve)
        },
        {
          path: 'regulationTemp/regulationTempDetails', // 商品抢购规则模板 -- 抢购规则设置、详情
          name: 'regulationTempDetails',
          component: resolve => require(['@/page/myAccount/limitlessPi/buyGoodsMenage/regulationTempDetails'], resolve)
        },
        {
          path: 'myPurchase', // 我的抢购
          name: 'myPurchase',
          component: resolve => require(['@/page/myAccount/limitlessPi/myPurchase/myPurchase'], resolve)
        },
        {
          path: 'myPurchase/applyShipments', // 申请发货
          name: 'applyShipments',
          component: resolve => require(['@/page/myAccount/limitlessPi/myPurchase/applyShipments'], resolve)
        },
        {
          path: 'myPurchase/orderDetail', // 我的抢购_订单详情
          name: 'orderDetail',
          component: resolve => require(['@/page/myAccount/limitlessPi/myPurchase/orderDetail'], resolve)
        },
        {
          path: 'myPurchase/myRewardsRecord', // 我的抢购_奖励记录
          name: 'myRewardsRecord',
          component: resolve => require(['@/page/myAccount/limitlessPi/myPurchase/myRewardsRecord'], resolve)
        },
        {
          path: 'joinedSnap', // 可参与的抢购
          name: 'joinedSnap',
          component: resolve => require(['@/page/myAccount/limitlessPi/joinedSnap/joinedSnap'], resolve)
        },
        // 4.订单记录
        {
          path: 'myBill', // 订单记录--我的账单
          name: 'myBill',
          component: resolve => require(['@/page/myAccount/orderRecord/myBill'], resolve)
        },
        {
          path: 'myBill/billDetail', // 订单记录--我的账单--详情
          name: 'billDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/billDetail'], resolve)
        },
        {
          path: 'orderCashValue', // 订单记录--充值提现
          name: 'orderCashValue',
          component: resolve => require(['@/page/myAccount/orderRecord/orderCashValue'], resolve)
        },
        {
          path: 'orderCashValue/rechargeOrderDetail', // 订单记录--充值--详情
          name: 'orderRechargeOrderDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/rechargeOrderDetail'], resolve)
        },
        {
          path: 'orderCashValue/tiXianOrderDetail', // 订单记录--提现--详情
          name: 'tiXianOrderDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/tiXianOrderDetail'], resolve)
        },
        {
          path: 'orderCashValue/switchShare', // 订单记录--充值提现--选择共享者
          name: 'switchShare',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/switchShare'], resolve)
        },
        {
          path: 'digicashOrder', // 订单记录--数字货币交易
          name: 'digicashOrder',
          component: resolve => require(['@/page/myAccount/orderRecord/digicashOrder'], resolve)
        },
        {
          path: 'digicashOrder/digicashOrderDetail', // 订单记录--数字货币交易--详情
          name: 'digicashOrderDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/digicashOrderDetail'], resolve)
        },
        {
          path: 'sharerOrder', // 订单记录--共享者订单
          name: 'sharerOrder',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/sharerOrder'], resolve)
        },
        {
          path: 'sharerOrder/withdraw', // 订单记录--共享者订单--提现 详情
          name: 'sharerOrderWithdraw',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/withdraw'], resolve)
        },
        {
          path: 'sharerOrder/shareRechargeOrderDetail', // 订单记录--共享者订单--充值 详情
          name: 'shareRechargeOrderDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/shareRechargeOrderDetail'], resolve)
        },
        {
          path: 'sharerOrder/rechargeAppeal', // 订单记录--共享者订单--充值 申诉
          name: 'orderRechargeAppeal',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/rechargeAppeal'], resolve)
        },
        {
          path: 'sharerOrder/withdrawAppeal', // 订单记录--共享者订单--提现  申诉
          name: 'withdrawAppeal',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/withdrawAppeal'], resolve)
        },
        {
          path: 'sharerOrder/withdrawAppealDetail', // 订单记录--共享者订单--提现  申诉详情
          name: 'withdrawAppealDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/withdrawAppealDetail'], resolve)
        },
        {
          path: 'sharerOrder/rechargeAppealDetail', // 订单记录--共享者订单--充值  申诉详情
          name: 'rechargeAppealDetail',
          component: resolve => require(['@/page/myAccount/orderRecord/sharerOrder/rechargeAppealDetail'], resolve)
        },
        //  3.金融
        {
          path: 'cashValue', // 充值提现
          name: 'cashValue',
          component: resolve => require(['@/page/myAccount/finance/cashValue'], resolve)
        },
        {
          path: 'paiWallet', // 派钱包
          name: 'paiWallet',
          component: resolve => require(['@/page/myAccount/finance/paiWallet'], resolve)
        },
        {
          path: 'paiWalletDetail', // π钱包详情
          name: 'paiWalletDetail',
          component: resolve => require(['@/page/myAccount/finance/paiWalletDetail'], resolve)
        },
        {
          path: 'transferAccounts', // 转账
          name: 'transferAccounts',
          component: resolve => require(['@/page/myAccount/finance/transferAccounts'], resolve)
        },
        {
          path: 'recharge', // 充值
          name: 'recharge',
          component: resolve => require(['@/page/myAccount/finance/recharge/recharge'], resolve)
        },
        {
          path: 'rechargeOrderDetail', // 充值订单详情
          name: 'rechargeOrderDetail',
          component: resolve => require(['@/page/myAccount/finance/recharge/rechargeOrderDetail'], resolve)
        },
        {
          path: 'rechargeSelectSharer', // 充值选择共享者
          name: 'rechargeSelectSharer',
          component: resolve => require(['@/page/myAccount/finance/recharge/rechargeSelectSharer'], resolve)
        },
        {
          path: 'withdraw', // 提现
          name: 'withdraw',
          component: resolve => require(['@/page/myAccount/finance/withdraw/withdraw'], resolve)
        },
        {
          path: 'withdrawOrderDetail', // 提现订单详情
          name: 'withdrawOrderDetail',
          component: resolve => require(['@/page/myAccount/finance/withdraw/withdrawOrderDetail'], resolve)
        },
        {
          path: 'withdrawSelectSharer', // 提现选择共享者
          name: 'withdrawSelectSharer',
          component: resolve => require(['@/page/myAccount/finance/withdraw/withdrawSelectSharer'], resolve)
        }
      ]
    }
  ]
})
