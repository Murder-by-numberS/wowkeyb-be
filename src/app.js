import express from 'express'
import { Config } from './config/index.js';

const app = express();
const port = Config.appPort;

//testing
console.log('process.env.NODE_ENV',process.env.APP_ENV);
console.log('trigger build');
console.log('another trigger build');

app.get('/', (req, res) => {
  res.status(200).send(`Welcome to ${Config.appEnv} Wowkeyb!`)
})

app.get('/health', (req,res)=>{
  res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
  let response = {
    message: 'server is up'
  };
  res.status(200).send(response);
})

app.listen(port, () => {
  console.log(`Wowkeyb listening on port ${port}`)
})
