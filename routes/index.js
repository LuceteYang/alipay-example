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
router.get('/wappay/refund', function(req, res, next) {
  res.render('refund');
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
        goodsType: '0',
        return_url:process.env.NOTIFY_URL
    });
    var url = "https://openapi.alipay.com/gateway.do" + '?'+params;
    res.redirect(url);
});
router.post('/wappay/refund', function(req, res, next) {
    var out_trade_no = req.body.WIDout_trade_no;
    var trade_no = req.body.WIDtrade_no;
    var refund_amount = req.body.WIDrefund_amount;
    var refund_reason = req.body.WIDrefund_reason;
    var out_request_no = req.body.WIDout_request_no;
    ali.refund({
        outTradeId:out_trade_no,
        tradeId:trade_no,
        refundAmount:refund_amount,
        refundReason:refund_reason,
        outRequestId:out_request_no
    }).then(function(value) {
        console.log('동신 성공 ',value.response.statusCode===200);
        console.log('환불 성공 ',JSON.parse(value.response.body).alipay_trade_refund_response.code==="10000");
        res.send(value);
    });
});

router.get('/callback/alipay', function(req, res, next) {
    res.render('return');
})

router.post('/notify/alipay', function(req, res, next) {
    //결제 등록처리
    console.log(req.url,req.body);
    res.send();
})

router.post('/finish', function(req, res, next) {
    //여기서 statuscode랑 resmsg받아서 처리하면되겠네...
    console.log(req.body);
    res.render('finish',{"info":JSON.stringify(req.body)});
});


module.exports = router;
