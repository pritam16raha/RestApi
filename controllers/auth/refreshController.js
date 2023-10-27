import Joi from "joi";

import { RefreshToken, User } from "../../models";
import CustomErrorHandler from "../../services/CustomErrorHandler";
import JwtService from "../../services/JwtService";
import { REFRESH_SECRET } from "../../config";

const refreshController = {
    async refresh(req, res ,next){
        //validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required()
        });

        const { error } = refreshSchema.validate(req.body);

        if(error) {
            return next(error);
        }

        //checking in database, is the refresh token is present in database or not, if not present thats mean user has logout from its session
        let refreshToken;
        try{
            refreshToken = await RefreshToken.findOne({ token: req.body.refresh_token });

            if(!refreshToken){
                return next(CustomErrorHandler.unAuthorised('Invalid Refresh Token'));
            }
            //if refresh token is present in database then we will varify the token with exsisting token in database
            let userId;
            
            try {
                const { _id } = await JwtService.verify(refreshToken.token, REFRESH_SECRET);
                userId = _id;
            } catch(err){
                return next(CustomErrorHandler.unAuthorised('Invalid Refresh Token'));
            }

            //checking the user is same or not
            const user = await User.findOne({ _id: userId });
            if(!user){
                //when the user is not present
                return next(CustomErrorHandler.unAuthorised('User is not present in DATABASE'));
            }

            //generating refresh token and access token, both
            const access_token = JwtService.sign({ _id: user._id, role: user.role });

            //now we will send the refresh token also
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);
            await RefreshToken.create({ token: refresh_token });
            res.json({ access_token, refresh_token });

        } catch(err){
            return next(new Error(err.message));
            //return next(new Error("something went wrong"))
        }



    }
};

export default refreshController;