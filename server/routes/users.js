var express = require('express');
var router = express.Router();
let md5 = require('md5');
let jwt = require('jsonwebtoken');
let cron = require('cron');
/* GET users listing. */
let User = require('../model/User');
let Book = require('../model/Book');
let middle = require('../middleware/middle');

let cronJob = async function (id, hour, min) {
    let minDel = parseInt(min) + 1;
    let book = await Book.findOne({idUser: id});
    if (book && book.status == 'A') {
        let job = new cron.CronJob(`* ${minDel} ${hour} * * *`, async () => {
            await Book.findOneAndDelete({_id:book._id});
            job.stop();
        }, () => {
            console.log(`Đã hủy đơn ${book._id}`);
        }, true, 'Asia/Ho_Chi_Minh');
    }
}

router.get('/', function (req, res, next) {
    res.redirect('/login');
});

router.get('/login', function (req, res, next) {
    res.clearCookie('id');
    res.render('login', {err: false, layout: 'default'});
});

router.post('/login', async (req, res) => {
    let phoneNumber = req.body.phoneNumber;
    let user = await User.findOne({phoneNumber});
    if (!user) {
        res.render('login', {err: true, message: `Tài khoản không tồn tại`, layout: 'default'});
        return;
    }
    let passWord = md5(req.body.passWord);
    if (passWord != user.passWord) {
        res.render('login', {err: true, message: `Mật khẩu không chính xác`, layout: 'default'});
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

router.get('/home', middle.checkAuth, (req, res) => {
    // console.log(req.user.id);

    res.render('home', {layout: 'index'});
});
router.get('/lun', middle.checkAuth, (req, res) => {
    // console.log(req.user.id);
    let timeNow = new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'});
    // timeNow.setHours(19,20)
    res.render('404', {layout: 'index'});
});

router.post('/order',  async (req, res) => {
    let idUser = req.body.id;
    let book = await Book.findOne({idUser});
    if (book) {
        res.json({message:'Bạn đang spam đặt lịch'});
        return;
    }
    let timeBook = req.body.timeBook;
    let add = new Book({idUser, timeBook});
    add.save().then((resolve, reject) => {
        if (resolve) {
            cronJob(idUser, timeBook.split(':')[0], timeBook.split(':')[1]);
            res.json({status: true, message: `Đặt lịch thành công`});
        } else if (reject) {
            res.json({status: false, message: `Đặt lịch thất bại`});
        }
    })

});

module.exports = router;
