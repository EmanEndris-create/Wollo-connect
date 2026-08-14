require('dotenv').config();
const PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();
const createTable = require('./src/config/createTable');
const authRouter = require('./src/routes/auth.routes');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);

app.get('/', (req, res)=>{
  res.send('server started!');
});

//Start The Server
async function startServer(){
  try{
    await createTable();
    app.listen(PORT, ()=>{
      console.log(`Server is running on ${PORT}`);
    });
  }catch(error){
    console.log('Failed to start the server:', error);
  }
}

startServer();