require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const app = express();

const userRouter = require('./controllers/user');
const blogRouter = require('./controllers/blog');
const loginRouter = require('./controllers/login');

mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log(chalk.green('successfully connected to remote mongodb server')))
	.catch(err => console.log(chalk.red(err.message)));

app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('/api/users', userRouter);
app.use('/api/blogs', blogRouter);
app.use('/login', loginRouter);

app.listen(process.env.PORT, () => console.log(chalk.bold.green(`listening on ${process.env.PORT}`)));