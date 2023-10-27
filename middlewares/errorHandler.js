import { DEBUG_MODE } from "../config";

import { ValidationError } from "joi";
import CustomErrorHandler from "../services/CustomErrorHandler";


const errorHandler = (err, req, res, next) => { //error always send two mejor component 1. status code, 2. data/message
    let statusCode = 500;
    let data = {
        message: 'Internal server error',
        ...(DEBUG_MODE === 'true' && { originalError: err.message })
         //for production we will not show error meassages to user, then we will make DEBUG_MODE = false in .env file.
    }

    if(err instanceof ValidationError){ //validationError is class of Joi Library
        statusCode = 422;

        data = {
            message: err.message //it will show the error message to user not the actual error
        }

    }
    if (err instanceof CustomErrorHandler){
        statusCode = err.status;
        data = {
            message: err.message
        }
    }
    return res.status(statusCode).json(data);
}

export default errorHandler; //returning the response to the client/frontend