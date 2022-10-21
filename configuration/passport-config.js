const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialize = (passport) => {
  const authenticateUser = async (username, password, done) => {
    const user = await User.findOne({username: username})

    if (user == null) {
      
      return done(null, false, { message: 'Toto uživatelské jméno neexistuje!' })
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Špatně zadané heslo' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'username', passwordField: 'password'}, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, User.findOne({id: id}))
  })
}

module.exports = initialize