
const AWS = require('aws-sdk');
var nanoid = require('nanoid');


var client = new AWS.DynamoDB();

function putItemPromise(params) {
    return new Promise((resolve,reject) => {
        client.putItem(params, (err,res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

function getItemPromise(params) {
    return new Promise((resolve,reject) => {
        client.query(params, (err,res) => {
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
    let sub_id = nanoid();
    let time = Date.now();
    
    newItem.Item.create_time.N = time.toString();
    getItemPromise(event.getItem)
    .then (res => {
        if(res.Items.length > 0) {
            let sub = res.Items[0]
            let currSub = newItem.Item.candidates.SS;
            if(newItem.Item.user_id.S === "sub_auth_") {
                if(sub.secure.BOOL) throw new Error("Cant submit open vote for secure election");
                newItem.Item.user_id.S = `sub_anon_${sub_id}`;
            };
            console.log(sub.candidates.SS);
            console.log(currSub);
            if (sub.candidates.SS.length === currSub.length 
                && sub.candidates.SS.every(value=> currSub.includes(value))
            ) return putItemPromise(newItem);
            throw new Error("401: Candidate mismatch");
        } else {
            throw new Error("Election not found");
        }
        
    })
    .then( (res) => {
        callback(null, res);
    }).catch(err => {
        callback(err.message);
    });
        
};