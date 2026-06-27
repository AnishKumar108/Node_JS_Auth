import bcrypt from "bcryptjs";  

export async function hashPassword(password:string){
    const salt = await bcrypt.genSalt(10);
    const response = await bcrypt.hash(password,salt);

    return response

}

export async function comparePassword(password:string,hashPassword:string){
    return await bcrypt.compare(password,hashPassword)
}