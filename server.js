import express from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// nhan du lieu
app.use(express.json());

const books = [
    {
        id: 1,
        name: 'So Do',
        author: {
            id: 1,
            name: 'Vu Trong Phung',
        },
        year: 1951
    },
    {
        id: 2,
        name: 'Lao Hac',
        author: {
            id: 2,
            name: 'Nam Cao',
        },
        year: 1964
    },
    {
        id: 3,
        name: 'Truyen Kieu',
        author: {
            id: 3,
            name: 'Nguyen Du',
        },
        year: 1804
    }
]

function authenToken(req, res, next){
    const authHeader = req.headers['authorization'];

    const token = authHeader.split(' ')[1];
    if(!token){
        res.sendStatus(401);
    }

    jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        //console.log(err, data);
        if(err) res.sendStatus(403);
        next();
    })
}

// tra ve du lieu
app.get('/books', authenToken, (req, res) => {
    res.json({
        status: 'success',
        data: books
    });
});

app.post('/login', (req, res) => {
    const data = req.body;
    const accessToken = jsonwebtoken.sign(data, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
    res.json({ token: accessToken });
});

app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`);
});