const AWS = require('aws-sdk');
require('dotenv').config();

exports.uploadToS3 = (data, filename)=>
{
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.ACCESS_KEY;
    const IAM_USER_SECRET = process.env.SECRET_ACCESS_KEY; 

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey : IAM_USER_SECRET
    })
    var params = 
    {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
    };
    return new Promise((resolve, reject) => 
    {
        s3bucket.upload(params, (err, s3response) => 
        {
            if (err) 
            {
                console.log("err in uploadtos3", err);
                reject(err);
            }
            else 
            {
                //console.log("Uploaded to bucket ", s3response);
                resolve(s3response.Location);
            }
        });
    });
}