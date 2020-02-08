module.exports={

    wrapSuccess(response,httpcode,resultSet){        
        response.status(httpcode).send({success: true, data: resultSet});
        console.log(resultSet);
    },

    wrapError(response, httpcode, message){
        response.status(httpcode).send({success: false, error: message});
        console.log(message);
    },
    
    wrapNoContent(response,httpcode,nocontent){
        response.status(httpcode).send({success:false, data: nocontent});
        console.log(nocontent);
    }
}
