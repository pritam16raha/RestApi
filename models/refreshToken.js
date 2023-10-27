import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    token: { type: String, unique: true },
    //                      unique is required because every new refreshToken will get unique index number, it will be easier to find the refresh token
}, { timestamps: true });

export default mongoose.model('RefreshToken', refreshTokenSchema, 'refreshToken');
//                          ('name of the model in database', variable_name which will carry the refresh token, 'name of the collection/name of the table in database')