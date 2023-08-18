const express = require('express');
const cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser'); 
const dotEnv = require('dotenv');
dotEnv.config();
const app = express();
const db = require('./config/mongoose');
const { PORT, MONGODB_URL, SESSION_SECRET_KEY } = process.env;
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

const MongoStore = require('connect-mongo')(session);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('./assets'));

app.use(cookieParser());

app.use(expressLayouts);

// set up view engine
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
  name:'Employee review system',
  secret: "abcd",
  saveUninitialized: false,
  resave: false,
  cookie:{
      maxAge: (1000*60*100)
  },
  store: new MongoStore({
      mongooseConnection: db,
      autoRemove: 'disabled',
  },
  function(err){console.log(err || 'connet-mongo setup done')}
  )
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'));

app.listen( 8000, (err) => {
  if (err) {
    console.log(`Error in running the server: ${err}`);
  }
  console.log(`Server is running on port: ${8000}`);
});
