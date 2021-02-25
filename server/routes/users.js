var express = require('express');
var router = express.Router();

/* GET users listing. */
let md5 = require('md5');
let jwt = require('jsonwebtoken');

let User = require('../model/User');
let middle = require('../middleware/middle');

router.get('/', function (req, res, next) {
  res.redirect('/login');
});

router.get('/login', function (req, res, next) {
  res.clearCookie('id');
  res.render('login', {err :false,layout:'default'});
});

router.post('/login', async (req, res) => {
  let phoneNumber = req.body.phoneNumber;
  let user = await User.findOne({phoneNumber});
  if (!user) {
    res.render('login',{err:true,message: `Tài khoản không tồn tại`});
    return;
  }
  let passWord = md5(req.body.passWord);
  if (passWord != user.passWord) {
    res.render('login',{err:true,message: `Mật khẩu không chính xác`});
    return;
  }
  res.cookie("id", user._id);
  res.redirect('/home');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

router.post('/register', async (req, res) => {
  let phoneNumber = req.body.phoneNumber;
  let user = await User.findOne({phoneNumber});
  if (user) {
    res.json({status: false, message: `Số điện thoại đã đăng kí`});
    return;
  }
  let passWord = md5(req.body.passWord);
  let fullName = req.body.fullName;
  let address = req.body.address;
  let add = new User({phoneNumber, passWord, fullName, address});
  add.save().then((resolve, reject) => {
    if (resolve) {
      res.json({status: true, message: `Đăng kí thành công`});
    } else if (reject) {
      res.json({status: false, message: `Đăng kí thất bại`});
    }
  })

});

router.get('/home',middle.checkAuth, (req, res) => {
  // console.log(req.user.id);
  res.render('home', {layout:'index'});
})
router.get('/lun',middle.checkAuth, (req, res) => {
  // console.log(req.user.id);
  res.render('404', {layout:'index'});
})

module.exports = router;
