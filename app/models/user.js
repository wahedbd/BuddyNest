//User Database
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
    user             : {
        username     :String,
        email        : String,
        password     : String,
        name	     : String,
        address      : String
    }
});

userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.user.password);
};

userSchema.methods.updateUser = function(request, response){
    this.user.username = request.body.username;
    this.user.name = request.body.name;
    this.user.email = request.body.email;
    this.user.address = request.body.address;
    this.user.save();
    response.redirect('/user');
};

module.exports = mongoose.model('User', userSchema);
