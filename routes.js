const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy');
const ItemControllerPolicy = require('./policies/ItemControllerPolicy');
const User = require('./controllers/UserController');
const Item = require('./controllers/ItemController');
const Synergy = require('./controllers/SynergieController');

//JWT middleware
const {
    isAuthenticated
} = require('./config/auth');

module.exports = (app) => {

    //------Get Requests------//
    app.get('/getItems', Item.getItems);
    app.get('/getSynergies', Synergy.getSynergies);
    app.get('/getLastUpdated', Item.getLastUpdated);
    //Protected Get Routes
    //------Get Requests------//

    //------Post Requests------//
    app.post('/register', AuthenticationControllerPolicy.register, User.register);
    app.post('/signIn', User.signIn);
    app.post('/passwordReset', User.passwordReset);
    app.post('/changePassword', User.changePassword);
    //Protected Post Routes
    app.post('/addItem', isAuthenticated, ItemControllerPolicy.addItem, Item.addItem);
    app.post('/updateItem', isAuthenticated, ItemControllerPolicy.updateItem, Item.updateItem);
    app.post('/updateSynergies', isAuthenticated, Synergy.updateSynergies);
    app.post('/updateUserStatus', isAuthenticated, User.updateUserStatus);
    app.post('/deleteItem', isAuthenticated, Item.deleteItem);
    app.post('/getUser', isAuthenticated, User.getUser);
    app.post('/updateUser', isAuthenticated, User.updateUser);
    app.post('/isAuth', isAuthenticated, User.isAuth);
    app.post('/getUsers', isAuthenticated, User.getUsers);
    //------Post Requests------//

};