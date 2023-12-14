const express = require('express');
const cors = require('cors');
const { MongoClient, GridFSBucket } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Port, Confidential } = require('./config');
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const client = new MongoClient(Confidential);
client.connect();
const db = client.db('mukiIO');
const bucket = new GridFSBucket(db);
const UserDetails = db.collection('UserDetails');
const ImageUpload = db.collection('UserImage');
const MusicLibrary = db.collection('MusicLibrary');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/getUserDetails', async (req, res) => {
    const FName = req.body.FirstName;
    const LName = req.body.LastName;
    const emailId = req.body.Email;
    const phoneNumber = req.body.Phone;
    const UserName = req.body.UserName;
    const password = req.body.PassWord;
    const Body = {
        FirstName: FName,
        LastName: LName,
        Email: emailId,
        Phone: phoneNumber,
        UserName: UserName,
        PassWord: password
    }
    const dataU = await UserDetails.findOne({ UserName: Body.UserName });
    const dataE = await UserDetails.findOne({ emailId: Body.Email });
    const dataP = await UserDetails.findOne({ Phone: Body.Phone });
    console.log('dataU:', dataU);
    console.log('dataE:', dataE);
    console.log('dataP:', dataP);
    if (dataU) {
        res.json({ flagU: 0 });
    } else if (dataE) {
        res.json({ flagE: 0 });
    } else if (dataP) {
        res.json({ flagP: 0 });
    } else {
        const result = await UserDetails.insertOne(Body);
        res.json({ userId: result.insertedId });
    }
});
app.post('/getuser',async (req,res)=>{
    const user = req.body.USERNAME;
    const pass = req.body.PASSWORD;
    const Search = {
        UserName:user,
        PassWord:pass
    }
    const result = await UserDetails.findOne(Search);
    console.log(result);
    res.json({User:result});
});

app.post('/getUserImage', upload.single('image'), async (req, res) => {
    try {
        const user = req.body.user_Id;
        const newImage = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            userId: user
        };
        const result = await ImageUpload.insertOne(newImage);

        res.json({ success: true, message: 'Image uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
app.post('/musicupload',upload.single('audio'), async (req, res) => {
    const user = req.body.user_Id;
    const newAudio = {
        data:req.file.buffer,
        contentType:req.file.mimetype,
        filename:req.file.originalname,
        userId: user
    }
    const result = await MusicLibrary.insertOne(newAudio);
    res.json({id:result.insertedId});
});
app.post('/getmusic', async (req, res) => {
    const filename = req.body.FileName;
    const query = { filename: { $regex: filename,$options:'i'} };

    try {
        const result = await MusicLibrary.find(query).toArray();

        if (result.length > 0) {
            res.json({ musicFiles: result });
        } else {
            res.json({ flag: false });
        }
    } catch (error) {
        console.error('Error fetching music files:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/getuserpicture',async (req,res)=>{
    const userId = req.body.userId;
    const result = await ImageUpload.findOne({userId:userId});
    if(result){
        res.json({UserImage:result});
    }else{
        res.json({ flag: false });
    }
})
app.post('/getallmusic',async (req,res)=>{
    const result = await MusicLibrary.find({}).toArray();
    res.json({musicFiles:result});
});
app.listen(Port, async () => {
    console.log(`server is running on the port ${Port}`);
});