require('dotenv').config();
const Port = process.env.PORT;
const Confidential = process.env.MONGO_URI;
module.exports = {
    Port,
    Confidential
};
