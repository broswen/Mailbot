'use strict';
const AWS = require('aws-sdk');
const DYNAMO = new AWS.DynamoDB.DocumentClient();

const qs = require('querystring');

module.exports.handler = async event => {
  let id;
  try {
    if(!event.queryStringParameters || !('id' in event.queryStringParameters)) throw new Error('invalid link')
    id = event.queryStringParameters.id;
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message })
    }
  }

  try {
    const params = {
      Key: {
        "_id": id,
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
        message: 'successfully unsubscribed!',
      }
    )
  };
};
