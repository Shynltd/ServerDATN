var express = require('express');
var router = express.Router();
let md5 = require('md5');
let jwt = require('jsonwebtoken');

let User = require('../model/User');
let middle = require('../middleware/middle');

router.post('/login', async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let user = await User.findOne({phoneNumber});
    if (!user) {
        res.json({status: false, message: `Tài khoản không tồn tại`});
        return;
    }
    let passWord = md5(req.body.passWord);
    if (passWord != user.passWord) {
        res.json({status: false, message: `Mật khẩu không chính xác`});
        return;
    }
    let token = jwt.sign({id: user._id}, 'duan', {algorithm: 'HS256', expiresIn: 24 * 60 * 60});
    res.json({status: true, token: token, message: `Đăng nhập thành công`});
});

router.get('/register', function (req, res) {
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

router.get('/home', middle.checkLogin, (req, res) => {
    // console.log(req.user.id);
    res.json({message: 'Đã đăng nhập'});
})

module.exports = router;
