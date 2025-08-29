import { Verification } from "../models/verification.model.js";
import {generateSecureRandomCode} from "../utils/generate-secure-random-code.js";

export const generateVerificationToken = async(email, session) => {
    const code = generateSecureRandomCode();
    
    const existedToken = await Verification.findOne({email});

    if(existedToken){
        await Verification.deleteOne({_id: existedToken._id}, { session } );
    }

    const expires = new Date(new Date().getTime() + 2*60*1000); // 1sec=1000ms

    const verificationToken = new Verification({
        email,
        token: code,
        expires
    });
    await verificationToken.save({ session });

    return verificationToken;
}