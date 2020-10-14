'use strict';
const { DynamoDB } = require('aws-sdk');
const AWS = require('aws-sdk');
const DYNAMO = new AWS.DynamoDB.DocumentClient();
const SES = new AWS.SES();

module.exports.handler = async event => {

  let emails;
  try {
    const params = {
      ProjectionExpression: '#e',
      ExpressionAttributeNames: {
        '#e': '_email'
      },
      TableName: process.env.EMAILSUBSCRIPTIONS
    }

    // this won't scan the entire table? depending on table size?
    emails = await DYNAMO.scan(params).promise();

  } catch (error) {
    throw error; 
  }
  console.log(emails);
  emails = emails.Items.map(item => ({
          Destination: {
            ToAddresses: [ 
              item._email 
            ]
          },
          ReplacementTemplateData: JSON.stringify({email: item._email})
        }));

  console.log(emails);

  try {
    const params = {
      Destinations: emails,
      Source: `Mailbot <${process.env.FROMEMAIL}>`,
      Template: process.env.EMAILTEMPLATE,
      DefaultTemplateData: JSON.stringify({email: '<invalid email>'})
    }
    
    await SES.sendBulkTemplatedEmail(params).promise();
  } catch (error) {
    throw error;
  }

};

