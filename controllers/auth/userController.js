import { User } from "../../models";
//import user from "../../models/user";
import CustomErrorHandler from "../../services/CustomErrorHandler";
const userController = {
    async me(req, res, next){
        try{
            const user = await User.findOne({ _id: req.user._id }).select('-password -__v');

            if(!user){
                return next (CustomErrorHandler.notFound());
            }
            res.json(user);

        } catch(err) {
            return next(err);
        
        }
}
};

export default userController;