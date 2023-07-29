require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const { S3Client } = require('@aws-sdk/client-s3');

const auth = require('./middleware/auth');

const registerUser = require('./controllers/registerUser');
const loginUser = require('./controllers/loginUser');
const getPosts = require('./controllers/getPosts');
const createPost = require('./controllers/createPost');
const updatePost = require('./controllers/updatePost');
const deletePost = require('./controllers/deletePost');
const deletePhoto = require('./controllers/deletePhoto');

const app = express();
const port = process.env.PORT || 3000;
const s3Config = {
	region: process.env.AWS_S3_BUCKET_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_ACCESS_SECRET,
	},
};
const s3Client = new S3Client(s3Config);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(fileUpload());
app.use(express.json());
app.use(cookieParser());

app.get('/', async (req, res) => {
	res.send('Server is working!');
});

app.get('/logout', (req, res) => res.clearCookie('token').status(200).end());
app.post('/register', (req, res) => registerUser(req, res));
app.post('/login', (req, res) => loginUser(req, res));

app.get('/posts', (req, res) => getPosts(req, res, s3Client));
app.post('/post', auth, (req, res) => createPost(req, res, s3Client));
app.put('/post', auth, (req, res) => updatePost(req, res, s3Client));
app.delete('/post', auth, (req, res) => deletePost(req, res, s3Client));
app.delete('/photos', auth, (req, res) => deletePhoto(req, res, s3Client));

app.listen(port, () => {
	console.log(`server listening on port ${port}`);
});
