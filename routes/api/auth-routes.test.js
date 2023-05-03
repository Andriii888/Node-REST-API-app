import  mongoose from "mongoose";
import request from "supertest";

import app from "../../app";
import dotenv from 'dotenv';

dotenv.config();

// import {User} = require("../../models/user");

// import {DB_HOST_TEST} from  process.env;
const DB_HOST_TEST="mongodb+srv://Andr:vViEen43jESAiZRm@cluster0.e9eyeso.mongodb.net/db-contacts-test?retryWrites=true&w=majority";
const PORT = 3000;

describe("test /api/auth/register route",()=>{
    let server =null;
    beforeAll (async ()=>{
        server = app.listen(PORT);
        await mongoose.connect(DB_HOST_TEST);
    });
    afterAll(()=>{
        server.close()
    });

    test("test register route with correct data",async ()=>{
        const registerData={name:"Andr",email:"andr@gmail.com",password:"123456"};
        const res = (await request(app).post("/api/auth/register")).send(registerData);
        expect(res.statusCode).toBe(201);
        expect(req.body.name).toBe(registerData.name);
        expect(req.body.email).toBe(registerData.email);
    })
})