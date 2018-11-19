
const AWS = require('aws-sdk');

const generate = require('nanoid/generate')

var client = new AWS.DynamoDB();

function putItemPromise(params) {
    return new Promise((resolve,reject) => {
        client.putItem(params, (err,res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

exports.handler = (event, context, callback) => {
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!')
    };
    let newItem = event.putItem;
    let id = generate('1234567890abcdefghijklmnopqrstuvwxyz', 10);
    let time = Date.now();
    newItem.Item.poll_id.S = id;
    newItem.Item.create_time.N = time.toString();
    putItemPromise(event.putItem).then( (res) => {
        let ret = {
            name:newItem.Item.poll_name.S,
            id:id,
            active:true,
            time:time
        }
        callback(null, ret);
    });
        
};