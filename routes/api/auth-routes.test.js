import  mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import dotenv from 'dotenv';

dotenv.config();

// import {User} = require("../../models/user");

// import {DB_HOST_TEST} from  process.env;
const DB_HOST_TEST="mongodb+srv://Andr:vViEen43jESAiZRm@cluster0.e9eyeso.mongodb.net/db-contacts-test?retryWrites=true&w=majority";
const PORT = 3000;

describe("test /api/auth/login route",()=>{
    let server =null;
    beforeAll (async ()=>{
        server = app.listen(PORT);
        await mongoose.connect(DB_HOST_TEST);
    });
    afterAll(()=>{
        server.close()
    });

    test("test login route with correct data",async ()=>{
        const registerData={email:"andr@gmail.com",password:"123456"};
        const res = (await request(app).post("/api/auth/login")).send(registerData);
        console.log(res)
        expect(res.statusCode).toBe(200);
        
    })
})