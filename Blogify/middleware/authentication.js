const validateToken = require("../services/authentication").validateToken;

function checkforauthenticationCookie(){
    return (req,res,next)=>{
        const tokenCookieValue=req.cookies.token;
        if(!tokenCookieValue){
           return next();
        }
        const userPayload=validateToken(tokenCookieValue);
        if(userPayload){
            req.user=userPayload;
            res.locals.user=userPayload;
        }else{
            res.clearCookie("token");
        }
        return next();
    };
}

module.exports={
    checkforauthenticationCookie,
}
