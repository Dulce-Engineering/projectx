import * as functions from 'firebase-functions/v2';
import firebase from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import RPC_Buddy from 'rpc-buddy';
import Db_Firestore from './lib/Db_Firestore.js';
import User from './lib/User.js';
import Property from './lib/Property.js';
import Admin from './lib/Admin.js';
//import Utils from './tb/Utils.js';
//import config from "./config.mjs";

firebase.initializeApp();
const fb_db = firebase.firestore();
const fb_auth = firebase.auth();
const fb_storage = firebase.storage();

const db = new Db_Firestore(fb_db);

const app = express();
app.use(cors());

const on_auth_fn = (req) => Admin.Has_Auth(req, fb_auth);
const uid = (req) => Admin.UID(req, fb_auth);
//Jobs.is_class = true;
//Trend.is_class = true;
const rpc_buddy = new RPC_Buddy
(
  app, 
  '/rpc-server', 
  '/rpc-client',
  [
    User, Property
  ],
  [
    {name: "Property.Save", inject: [db, uid], on_auth_fn}, 
    {name: "Property.Select", inject: [db, uid], on_auth_fn}, 

    {name: "User.Create", inject: [db, fb_auth]}, 
    {name: "User.Sign_In", inject: [db]}, 
  ],
  RPC_Buddy.Express
);
rpc_buddy.client_cache_control = "max-age=2592000"; // 30 days

const api_options =
{
  region: ["australia-southeast1"],
  timeoutSeconds: 240,
  minInstances: 0,
  concurrency: 80
};
export const api = 
  functions
    .https
    .onRequest(api_options, app);