import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-twitter';
import 'dotenv/config.js';

const port = process.env.PORT || 3333;
const app = express();

app.use(express.json());

app.use(session({ secret: 'whatever', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new Strategy(
    {
      consumerKey: process.env.TWITTER_APIKEY,
      consumerSecret: process.env.TWITTER_APIKEY_SECRET,
      callbackURL: 'http://localhost:3333/twitter/return',
    },
    function (token, tokenSecret, profile, callback) {
      return callback(null, profile);
    }
  )
);

passport.serializeUser(function (user, callback) {
  callback(null, user);
});

passport.deserializeUser(function (obj, callback) {
  callback(null, obj);
});

app.get('/login', passport.authenticate('twitter'));

app.get(
  '/twitter/return',
  passport.authenticate('twitter', {
    failureRedirect: '/error',
  }),
  function (req, res) {
    res.json({ message: 'logado com sucesso' });
  }
);

app.get('/error', (req, res) => {
  res.json({ message: 'erro no login' });
});

app.listen(port, () => {
  console.log(`🚀 servidor rodadando na porta ${port}`);
});
