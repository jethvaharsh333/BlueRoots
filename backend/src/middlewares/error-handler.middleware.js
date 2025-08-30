import { ApiError, InternalServerException } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const errorHandler = (error, req, res, next) => {
  console.log("-------------------------------------------------------");
  console.log(`Error on ${req.method} ${req.originalUrl}`);
  console.log(`MESSAGE: ${error.message}\nERROR DATA: ${error.data}`);
  if (error.errors && error.errors.length > 0) {
    console.error(`DETAILS:`, error.errors);
  }
  let apiError;

  if (error instanceof ApiError) {
    // already normalized
    apiError = error;
  } else {
    // wrap any random error into ApiError
    apiError = new InternalServerException(
      process.env.NODE_ENV === "development"
        ? error.message   // show real message in dev
        : "Unexpected error occurred" // hide in prod
    );
  }
  
  return res.json(apiError.toResponse(res));
    // return apiError.toResponse(res);

};

export { errorHandler };
