'use strict';
const AWS = require('aws-sdk');
const DYNAMO = new AWS.DynamoDB.DocumentClient();

const qs = require('querystring');

module.exports.handler = async event => {
  let body;
  try {
    body = qs.parse(event.body);
    if(!('email' in body)) throw new Error('must include email')
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  try {
    const params = {
      Key: {
        "_email": body.email,
      },
      TableName: process.env.EMAILSUBSCRIPTIONS
    }
    await DYNAMO.delete(params).promise();
    
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
        message: 'unsubscribed',
      }
    )
  };
};
