class CustomErrorHandler extends Error {
    constructor(status, msg){
        super(); //calling super constrauctor
        this.status = status;
        this.message = msg;
    }

    static alreadyExist(message) {
        return new CustomErrorHandler(409, message);
    }

    static wrongCredentials(message = 'Username or Paswword is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorised(message = 'Username or Paswword is wrong!') {
        return new CustomErrorHandler(401, message);
    }

    static notFound(message = "User Doesn't Exist") {
        return new CustomErrorHandler(404, message);
    }

    static serverError(message = "Internal server error") {
        return new CustomErrorHandler(500, message);
    }

}

export default CustomErrorHandler;