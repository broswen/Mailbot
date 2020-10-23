'use strict';
const AWS = require('aws-sdk');
const DYNAMO = new AWS.DynamoDB.DocumentClient();
const {v4: uuidv4} = require('uuid');

const qs = require('querystring');

const emailPattern = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

module.exports.handler = async event => {
  let body;
  try {
    body = qs.parse(event.body);
    if(!('email' in body)) throw new Error('must include email')
    if(!emailPattern.test(body.email)) throw new Error('invalid email')
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  try {
    const params = {
      Item: {
        "_id": uuidv4(),
        "_email": body.email,
        "_timestamp": new Date().toISOString()
      },
      TableName: process.env.EMAILSUBSCRIPTIONS
    }
    await DYNAMO.put(params).promise();
    
  } catch (error) {
   return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message })
    } 
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'subscribed',
      }
    )
  };
};
