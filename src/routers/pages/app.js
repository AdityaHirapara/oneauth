const router = require('express').Router()
const cel = require('connect-ensure-login')

const models = require('../../db/models').models

router.get('/',
    cel.ensureLoggedIn('/login'),
    function (req, res, next) {
        models.AuthToken.findAll({
            where: {userId: req.user.id}
        }).then(function (tokens) {
            let apps = [];
            tokens.forEach( (token) => {
                models.Client.findOne({
                    where: {id: token.clientId}
                }).then(function (client) {
                    apps.push(client)
                })
            })
            return res.render('app/all', {apps: apps})
        }).catch(function (err) {
            res.send("No apps authorised")
        })
    }
)

module.exports = router