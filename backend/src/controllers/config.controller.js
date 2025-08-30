import crypto from "crypto";
import { ApiResponse } from "../utils/ApiResponse.js";

const getCloudinarySignature = async(req, res) => {
    const timestamp = Math.round(Date.now() / 1000);
    const toSign = `timestamp=${timestamp}`;
    const signature = crypto
        .createHash('sha1')
        .update(toSign + process.env.CLOUDINARY_API_SECRET)
        .digest('hex');

    return ApiResponse.success(
        {
            timestamp,
            signature,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME
        }
        , "Credentials fetched successfully.").send(res);
}

export {getCloudinarySignature};