let jwt = require('jsonwebtoken');
let User = require('../model/User');
module.exports.checkLogin = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization, 'duan', function(err, decoded) {
           if (err) {
               res.json({status: false, message: err})
               return;
           } else if (decoded){
               req.user = decoded;
               next();
           }
        });
    } else {
        res.json({message: 'Bạn chưa đăng nhập'});
    }
}
module.exports.checkAuth = async (req, res, next) => {
    if (req.cookies.id) {
       let user = await User.findOne({_id:req.cookies.id});
       if (user){
           res.locals.img = user.avatar;
           next();
       }
    } else {
        res.redirect('/login');
    }
}
