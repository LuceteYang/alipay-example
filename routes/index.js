var express = require('express');
var router = express.Router();
var Alipay = require('alipay-node-sdk');
var path = require('path');
var ali = new Alipay({
    appId: process.env.APP_ID,
    notifyUrl: process.env.NOTIFY_URL,
    rsaPrivate: path.resolve('./pem/private.pem'),
    rsaPublic: path.resolve('./pem/public.pem'),
    sandbox: false,
    signType: 'RSA2'
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/wappay/pay', function(req, res, next) {
  res.render('pay');
});

router.post('/wappay/pay', function(req, res, next) {
    var out_trade_no = req.body.WIDout_trade_no;
    var subject = req.body.WIDsubject;
    var total_amount = req.body.WIDtotal_amount;
    var body = req.body.WIDbody;
    var timeout_express = "2m";
    var params = ali.webPay({
        subject: subject,
        body: body,
        outTradeId: out_trade_no,
        timeout: timeout_express,
        amount: total_amount,
        goodsType: '0'
    });
    var url = "https://openapi.alipay.com/gateway.do" + '?'+params;
    res.redirect(url);
});

router.post('/callback/alipay', function(req, res, next) {
	console.log("post ",req.url);
/*
        { gmt_create: '2018-08-30 09:58:42',
        charset: 'utf-8',
        seller_email: 'dev@wenwo.co.kr',
        subject: '手机网站支付测试商品',
        sign: 'YpEgFx+4eC4JFNru9KVSdECNwc4+c3301UNv/BonEDCBYWsxC+Vosz4eVHnOkhCecJwQecmuOX6631MIfXva3jHxZbsv187djIzt2H9T1MtyzoF7Lp3SR004bIZ2vIR1K7orczPDu4b1zG8O0GoHBeaL6uwRyN4MBfVXRrBbI9CauKy/iQVlCnUc5FExNdmZGJcz/kHuEtjFzs/+e5KkQLeWixTbZmuOEHzTyvLz5rvoPzwyi6uhcXK2BF+F944+gEpayVpXFJKR9mfsJ/DljjHM6ctvIBq/YUbbLw3j7LlcAjbU0YrY08yydNQAkbIsYypvhyUYyc4hnihwiJ7rdA==',
        body: '购买测试商品0.01元',
        buyer_id: '2088132800714888',
        invoice_amount: '0.01',
        notify_id: 'c4107f14d47fcb86b687130e1ba4502msl',
        fund_bill_list: '[{"amount":"0.01","fundChannel":"ALIPAYACCOUNT"}]',
        notify_type: 'trade_status_sync',
        trade_status: 'TRADE_SUCCESS',
        receipt_amount: '0.01',
        buyer_pay_amount: '0.01',
        app_id: '2018082761110598',
        sign_type: 'RSA2',
        seller_id: '2088131107145766',
        gmt_payment: '2018-08-30 09:58:43',
        notify_time: '2018-08-30 09:58:43',
        version: '1.0',
        out_trade_no: '2018830105820364',
        total_amount: '0.01',
        trade_no: '2018083021001004880508053268',
        auth_app_id: '2018082761110598',
        buyer_logon_id: '175****1690',
        point_amount: '0.00' }
        */
    res.render('return', {'rescode': "0000", 'resmsg': JSON.stringify(req.body)});
})

router.post('/finish', function(req, res, next) {
    //여기서 statuscode랑 resmsg받아서 처리하면되겠네...
    console.log(req.body);
    res.render('finish',{"info":JSON.stringify(req.body)});
});


module.exports = router;
