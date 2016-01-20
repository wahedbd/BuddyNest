var User = require('../app/models/user');
async = require("async");
var path = require('path'),
    fs = require('fs');
module.exports = function(app, passport, server) {
    app.get('/', function(request, response) {
        response.render('index.html');
    });
    app.get('/user', auth, function(request, response) {
        response.render('user.html', {
            user : request.user
        });
    });
    //app.get('/image.png', function (req, res) {
    //    res.sendfile(path.resolve('./uploads/image_'+req.user._id));
    //});
    app.get('/edit', auth, function(request, response) {
        response.render('edit.html', {
            user : request.user
        });
    });
    app.get('/logout', function(request, response) {
        request.logout();
        response.redirect('/');
    });
    app.get('/login', function(request, response) {
        response.render('login.html', { message: request.flash('error') });
    });
    app.post('/login', passport.authenticate('login', {
        successRedirect : '/user',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/edit', function(request, response) {
        response.render('edit.html', { message: request.flash('updateerror') });
    });
    app.post('/edit',  function (req, res){
        /*var tempPath = req.files.file.path,
            targetPath = path.resolve('./uploads/'+req.files.file.originalFilename);
        if (path.extname(req.files.file.name).toLowerCase() === '.png', '.jpg') {
            fs.rename(tempPath, './uploads/image_'+req.user._id, function(err) {
                if (err) throw err;
                console.log("Upload completed!");
            });
        }*/
        User.findOne({ 'user.email' :  req.body.email }, function(err, user) {
            if (err){ return done(err);}
            if (user)
                user.updateUser(req, res)

        });
    });

    var io = require('socket.io').listen(server);

    var usernames = {};

    io.sockets.on('connection', function (socket) {

        socket.on('adduser', function(username){
            socket.username = username;
            usernames[username] = username;
            io.sockets.emit('updateusers', usernames);
        });

        socket.on('disconnect', function(){
            delete usernames[socket.username];
            io.sockets.emit('updateusers', usernames);
            socket.broadcast.emit('updatechat', 'SERVER', socket.username + 'has disconnected');
        });
    });

};
function auth(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}