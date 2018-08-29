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

router.get('/callback/alipay', function(req, res, next) {
    console.log("get ",req.url);
    res.send();
})

router.post('/callback/alipay', function(req, res, next) {
	console.log("post ",req.url);
    res.send();
})

module.exports = router;
