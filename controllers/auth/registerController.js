import Joi from 'joi';

//import CustomErrorHandler from '../../services/CustomErrorHandler';

import { RefreshToken, User } from '../../models';

import bcrypt from 'bcrypt';

import JwtService from '../../services/JwtService';

import CustomErrorHandler from '../../services/CustomErrorHandler';

import { REFRESH_SECRET } from '../../config';

const registerController = {
    async register(req, res, next){
        //checklist

        // [ ] validate the request
        // [ ] authorised the request
        // [ ] check if the user in the database already
        // [ ] prepare model
        // [ ] store in database
        // [ ] generate jwt token
        // [ ] send response

        //validation
        //for validation you have to write schema first

        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
            repeatPassword: Joi.ref('password')
        });
        
        const { error } = registerSchema.validate(req.body);

        if (error) {
            //i will create separate error handler instead of getting response every time
            //throw error;
            //if the error throws from async function then middleware can not catch this error, to resolve the issue we use next()(the 3rd parameter of register function)
            return next(error);
        }

        //here logic to be written, if the email already registered, the it wont be accepted and will throw an error to user
        try {
            const exist = await User.exists({ email: req.body.email });
            if (exist) {
                return next(CustomErrorHandler.alreadyExist('This email is already taken'));
            }
        } catch(err) {
            return next(err);
        }
        
        const { name, email, password } = req.body;

        //hash password
        const hashPassword = await bcrypt.hash(password, 10);

        //prepare the model
        
        
        const user = new User({
            name,
            email,
            password: hashPassword
        });

        //saving the user now in databse
        let access_token;

        //refresh token variable
        let refresh_token;

        try{
            const result = await user.save();
            //token use
            console.log(result);
            access_token = JwtService.sign({ _id: result._id, role: result.role });

            //generating refresh token also. in refresh token expiry will be always higher than the accessToken, so it needs to be changed
            refresh_token = JwtService.sign({ _id: result._id, role: result.role }, '1y', REFRESH_SECRET);
            
            //validate the refresh token in database, to validate we need a model
            await RefreshToken.create({ token: refresh_token });
        
        } catch(err){
            return next(err);
        }

        res.json({ access_token: access_token, refresh_token: refresh_token });
        //when key and value is same, you can remove the value from json file
    }
}


export default registerController;