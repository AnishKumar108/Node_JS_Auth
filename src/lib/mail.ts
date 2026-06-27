import  nodemailer from "nodemailer";

export async function sendEmail(to:string,subject:string,html:string){
    if(!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_USER || !process.env.SMTP_PASS){
        console.log("email envs are not present");
        return 
    }
    
    const host = process.env.SMTP_HOST
    const port = Number(process.env.SMTP_PORT || "587")
    const user = process.env.SMTP_USER
    const password = process.env.SMTP_PASS
    const from = process.env.EMAIL_FROM

    const transporter = nodemailer.createTransport({
          host,
          port,
          secure:false,
          auth:{
            user,
            pass:password
          }
    });

    transporter.sendMail({from,to,subject,html})
}