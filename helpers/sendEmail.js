import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const{META_PASS,EMAIL_FROM}=process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_FROM,
        pass: META_PASS,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async(data)=> {
    const email = {...data, from: EMAIL_FROM};
    await transport.sendMail(email);
    return true;
}