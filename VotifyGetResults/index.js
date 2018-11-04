
const AWS = require('aws-sdk');


var client = new AWS.DynamoDB();

function putItemPromise(params) {
    return new Promise((resolve,reject) => {
        client.putItem(params, (err,res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

function queryPromise(params) {
    return new Promise((resolve,reject) => {
        client.query(params, (err,res) => {
            if(err) reject(err);
            else resolve(res);
        })
    })
}

async function getResults(event) {

    
    let election = await queryPromise(event.getElection);

    if(election.Items.length == 0) throw new Error("Election not found");

    let ct = election.Items[0].candidates.SS.length; - 1
    let queryRes = await queryPromise(event.query);

    let voteRes = queryRes.Items
    .map(s => {
        console.log(s);
        let ret =  s.sub.L.map( (elem, index) => {
                return {"name":elem.S,"ct":ct - index};
            });
        return ret;
    });
    console.log(JSON.stringify(voteRes));

    var startAcc = election.Items[0].candidates.SS.reduce((acc,elem) => {
        acc[elem] = 0;
        return acc;
    }, {})
    let res = voteRes.reduce((acc,elem) => {
        elem.forEach(vt => acc[vt.name] += vt.ct)
        return acc
    },startAcc)
    return {
        "results":Object.keys(res).map(k => {return{"name":k,"votes":res[k]}}),
        "vote-count":voteRes.length
    }

    
}

exports.handler = (event, context, callback) => {
    // TODO implement
    getResults(event).then( (res) => {
        callback(null, res);
    }).catch(err => {
        callback(err.message);
    });
        
};