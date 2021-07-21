const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({path:'./config.env'});

//db
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@seoblog.hzlj5.mongodb.net/natours?retryWrites=true&w=majority`,{useNewUrlParser:true,useCreateIndex:true,useFindAndModify:false,useUnifiedTopology: true })
.then(() => console.log('DB Connected...'))


const port = process.env.PORT || 3000;
app.listen(port,() =>{
    console.log(`App running on port ${port}...`);
});
