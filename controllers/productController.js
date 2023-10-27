import { Product } from '../models';

//multer is a library, it can be used as middleware, but here we will use it as a function
import multer from 'multer';

//multer actually gives us features to change the file directory, name, etc related to file in directory

import path from 'path';

import CustomErrorHandler from '../services/CustomErrorHandler';

import Joi from 'joi';

import fs from 'fs';

import productSchema from '../validators/productValidator';

//storage will be defined here / for this setup the selected pic will be uploaded automatically in upload folder

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {

        //name is generating randomly using formula
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const handleMultiPartData = multer({ storage, limits: { fileSize: 1000000 * 10 } }).single('image'); //1000000 = 1MB size 



//productController is an object
const productController = {
    //store is a method of productController object
    async store(req, res, next){
        handleMultiPartData(req, res, async (err) => { //3 parameters we have to pass, and inside callback 'err' has been passed
            if(err) {
                return next(CustomErrorHandler.serverError(err.message))
            }
            console.log(req.file);

            //storing the file path into database
            const filePath = req.file.path;

            //request will be validated here
            // const productSchema = Joi.object({
            //     name: Joi.string().required(),
            //     price: Joi.number().required(),
            //     size: Joi.string().required(),

            // });

            const { error } = productSchema.validate(req.body);

            //incase validation is fail, then uploaded image will be deleted from upload folder
            if(error) {
                fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    
                    if(err){
                        return next(CustomErrorHandler.serverError(err.message)); //this will return the error, incase file can to be deleted
                    }
                }); //approot is global variable, to use global variable inside the express, then we have to define it inside the server.js file
                
                return next(error); //this will return the joi error
            }

            //if error not occured, then fetch the data from body
            const { name, price, size } = req.body;

            let document;

            try{
                document = await Product.create({
                    name: name,
                    price: price,
                    size: size,
                    image: filePath  
                });

            } catch(err){
                return next(err);
            }

            res.status(201).json(document); //rootfolder/upload/filename.extension
        });
    },

    //update method is starting from here

    update(req, res, next) {
        handleMultiPartData(req, res, async(err) => {
            if(err) {
                return next (CustomErrorHandler.serverError(err.message))
            }

            let filePath;

            if(req.file){
                filePath = req.file.path;
            }

            //validation
            const { error } = productSchema.validate(req.body);
            if(error) {
                if(req.file){
                    fs.unlink(`${appRoot}/${filePath}`, (err) => {
                    
                        if(err){
                            return next(CustomErrorHandler.serverError(err.message)); //this will return the error, incase file can to be deleted
                        }
                    });
                } //approot is global variable, to use global variable inside the express, then we have to define it inside the server.js file
                
                return next(error); //this will return the joi error
            }

            const { name, price, size } = req.body;
            let document;
            try{
                document = await Product.findOneAndUpdate({ _id: req.params.id },{
                    name: name,
                    price: price,
                    size: size,
                    ...(req.file && { image: filePath })
                }, { new: true });

                console.log(document);

            } catch(err) {
                return next(err);
            }
            res.status(201).json(document);
        });
    },


    //delete product will start from here
    async destroy(req, res, next){
        const document = await Product.findByIdAndRemove({ _id: req.params.id });
        if(!document){
            return next(new Error('Nothing to delete'));
        }
        //along with the file image should be deleted also
        const imagePath = document.image;
        fs.unlink(`${appRoot}/${imagePath}`, (err) => {
            if(err){
                return next(CustomErrorHandler.serverError());
            }
        });
        res.json(document);
    },


    //get all product
    async index(req, res, next){

        let documents;
        try{
            //use mongoose-pagination library incase you have lots of products in database, else you are good to go

            documents = await Product.find().select('-__v').sort({ price: 1}); //-1 means sort in desending order
        } catch(err) {
            return next(CustomErrorHandler.serverError());
        }

        return res.json(documents);

    }

}

export default productController;