import * as AWS from 'aws-sdk';
import * as moment from 'moment';

export type ATGIsmLimitedResponse = {
  message: string,
  person: string
}

export type ATGIsm = {
  message: string,
  person: string
  submittedBy: string,
  approved: boolean,
  added: string | moment.Moment,
  updated: string | moment.Moment,
}

export type ATGIsmInput = {
  person: string
  message: string,
  submittedBy?: string,
  approved?: boolean,
}

let config: any = {
  endpoint: process.env.endpoint || 'http://localhost:8000',
  region: "us-east-1",
};

if(process.env.AWS_ACCESS_KEY) {
  config.credentials = config.credentials || {};
  config.credentials.accessKeyId = process.env.AWS_ACCESS_KEY;
}
if(process.env.AWS_SECRET_ACCESS_KEY) {
  config.credentials = config.credentials || {};
  config.credentials.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
}

// Endpoint was not allowed in types

AWS.config.update(config);

const docClient = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME: string = "atgism";

export function addATGIsm(input: ATGIsmInput): Promise<any> {
  console.log('starting addATGIsm()');
  return new Promise((resolve, reject) => {
    let params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
          person: input.person,
          message: input.message,
          submittedBy: input.submittedBy || 'Anonymous',
          approved: true,
          added: moment().format(),
          updated: moment().format()
        }
      };

      docClient.put(params, function(err, data: AWS.DynamoDB.DocumentClient.PutItemOutput) {
        console.log('ending addATGIsm()');
        console.log('error', err && true);
        if(err) return reject(err);
        resolve(data);
      });
  });
}

export function updateATGIsm(input: ATGIsmInput, updatedPerson?: string, updatedMessage?: string): Promise<any> {
  console.log('starting updateATGIsm()');
  return new Promise((resolve, reject) => {
    let params: any = {
        Key: {
          person: input.person,
          message: input.message,
        },
        TableName: TABLE_NAME,
        AttributeUpdates: {
          updated: {
            Action: 'SET',
            Value: moment().format()
          },
          approved: {
            Action: 'SET',
            Value: input.approved
          },
        }
      };
      // Not sure if these can even be updated, might need to delete and re-add?
      if(updatedPerson) {
        params.AttributeUpdates.person = updatedPerson;
      }
      if(updatedMessage) {
        params.AttributeUpdates.message = updatedMessage;
      }
      docClient.update(params, function(err, data: AWS.DynamoDB.DocumentClient.UpdateItemOutput) {
        console.log('ending updateATGIsm()');
        console.log('error', err && true);
        if(err) return reject(err);
        resolve();
      });
  });
}

function getScanAllParams(approved: boolean = true, fields?: string): AWS.DynamoDB.DocumentClient.ScanInput {
  let params: AWS.DynamoDB.DocumentClient.ScanInput = { TableName: TABLE_NAME };
  if(fields) { // only need if we want to limit returned columns
    params.FilterExpression = fields;
  }
  if(approved) {
    params.FilterExpression = 'approved = :t';
    params.ExpressionAttributeValues = { ':t': approved };
  }
  return params;
}

export function getAllATGIsm(): Promise<ATGIsm[]> {
  console.log('starting getAllATGIsm()');
  return new Promise((resolve, reject) => {
      docClient.scan(getScanAllParams(true), function(err: AWS.AWSError, data: AWS.DynamoDB.DocumentClient.ScanOutput) {
        console.log('ending getAllATGIsm()');
        console.log('error', err && true);
        if (err) return reject(err);
        resolve(data.Items);
      });
  });
}

export function getRandomATGIsm(): Promise<ATGIsmLimitedResponse> {
  console.log('starting getRandomATGIsm()');
  return new Promise((resolve, reject) => {
    let params = getScanAllParams(true, 'person, message'); // limit fields returned to allow staying under 1MB
    docClient.scan(params, function(err: AWS.AWSError, data: AWS.DynamoDB.DocumentClient.ScanOutput) {
      console.log('ending getRandomATGIsm()');
      console.log('error', err && true);
      if (err) return reject(err);
      const randomIndex = Math.floor(Math.random() * ((data.Count - 1) - 0));
      resolve(data.Items[randomIndex]);
    });
  });
}

