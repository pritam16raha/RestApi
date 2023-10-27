import CustomErrorHandler from "../services/CustomErrorHandler";
import JwtService from "../services/JwtService";

const auth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    console.log(authHeader);
    if(!authHeader){
        return next(CustomErrorHandler.unAuthorised());
    }

    const token = authHeader.split(' ')[1];
    console.log(token);

    //token verify
    try{
        const { _id, role } = await JwtService.verify(token);
        // req.user = {};
        // req.user._id = _id;
        // req.user.role = role;

        const user = {
            _id,
            role
        }
        req.user = user;
        next();

    } catch(err){
        return next(CustomErrorHandler.unAuthorised());
    }
    
}


export default auth;