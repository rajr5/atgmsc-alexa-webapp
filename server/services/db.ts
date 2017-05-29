import * as AWS from 'aws-sdk';
import * as moment from 'moment';
import * as _ from 'underscore';

export type ATGIsmLimitedResponse = {
  message: string;
  person: string;
  promotions?: ATGIsmPromote[];
}

export type ATGIsm = {
  message: string,
  person: string
  submittedBy: string,
  approved: boolean,
  promotions: ATGIsmPromote[],
  corrections: ATGIsmCorrection[],
  history: ATGIsmHistory[],
  added: string | moment.Moment,
  updated: string | moment.Moment,
}

export type ATGIsmPromote = {
  name: string;
  score: -1 | 0 | 1;
  added: string | moment.Moment,
  updated: string | moment.Moment,
}

export type ATGIsmCorrection = {
  correctionSubmittedBy: string,
  submittedBy: string,
  person: string,
  message: string,
  status: 'Pending' | 'Approved' | 'Denied',
  added: string | moment.Moment,
  updated: string | moment.Moment,
}

export type ATGIsmHistory = {
  submittedBy: string,
  person: string,
  message: string,
  archived: string | moment.Moment,
}

export interface ATGIsmInput {
  person: string;
  message: string;
}

export interface ATGIsmInputSubmission extends ATGIsmInput {
  submittedBy: string,
  approved?: boolean,
}

export type ATGIsmPromoteInput = {
  person: string,
  message: string,
  name: string,
  score: -1 | 0 | 1,
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

/**
 * Crate new ATGism
 * 
 * @export
 * @param {ATGIsmInputSubmission} input 
 * @returns {Promise<any>} 
 */
export function addATGIsm(input: ATGIsmInputSubmission): Promise<any> {
  console.log('starting addATGIsm()');
  return new Promise((resolve, reject) => {
    let params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName: TABLE_NAME,
        Item: {
          person: input.person,
          message: input.message,
          submittedBy: input.submittedBy || 'Anonymous',
          approved: true,
          promotions: [],
          corrections: [],
          history: [],
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

export function promoteATGism(input: ATGIsmPromoteInput): Promise<ATGIsm> {
  // only allow user one promotion - find out if exists, then update/add entrye as needed
  return new Promise((resolve, reject) => {
    getATGIsm(input)
    .then((atgism: ATGIsm) => {
      if(!atgism) {
        reject({message: 'ATGism to update was not found'})
      }
      atgism.promotions = atgism.promotions || []; // ensure that this is populated
      const userPromo: ATGIsmPromote = atgism.promotions.find((promo: ATGIsmPromote) => {
        return promo.name === input.name;
      });
      if(userPromo) {
        // update existing promo
        userPromo.score = input.score;
        userPromo.updated = moment().format();
      } else {
        // add new promo
        atgism.promotions.push({
          name: input.name,
          score: input.score,
          added: moment().format(),
          updated: moment().format(),
        });
      }
      let params: any = {
          Key: {
            person: input.person,
            message: input.message,
          },
          TableName: TABLE_NAME,
          UpdateExpression: "set promotions = :promos",
          ExpressionAttributeValues:{
              ":promos": atgism.promotions,
          },
        };
      docClient.update(params, function(err, data: AWS.DynamoDB.DocumentClient.UpdateItemOutput) {
        console.log('ending promoteATGism()');
        console.log('error', err && true);
        if(err) return reject(err);
        resolve(atgism);
      });
    })
    .catch(err => {
      console.log('error', err);
      reject(err);
    })
  });
}

export function getATGIsm(input: ATGIsmInput): Promise<ATGIsm> {
  // only allow user one promotion - find out if exists, then update/add entrye as needed
  return new Promise((resolve, reject) => {
    let params: any = {
      TableName: TABLE_NAME,
      Key: {
        person: input.person,
        message: input.message,
      }
    };
    docClient.get(params, function(err, data) {
      console.log('ending getATGIsm()');
      console.log('error', err && true);
      if(err) return reject(err);
      resolve(data.Item);
    });
  });
}


/**
 * TODO!!!!
 * This doesn't actually work since keys cannot be updated
 * Need to delete and re-add with updated (and also modify history to show changelog)
 * 
 * @export
 * @param {ATGIsmInputSubmission} input 
 * @param {string} [updatedPerson] 
 * @param {string} [updatedMessage] 
 * @returns {Promise<any>} 
 */
export function updateATGIsm(input: ATGIsmInputSubmission, updatedPerson?: string, updatedMessage?: string): Promise<any> {
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
    let params = getScanAllParams(true, 'person, message, promotions'); // limit fields returned to allow staying under 1MB
    docClient.scan(params, function(err: AWS.AWSError, data: AWS.DynamoDB.DocumentClient.ScanOutput) {
      console.log('ending getRandomATGIsm()');
      console.log('error', err && true);
      if (err) return reject(err);
      const randomIndex = Math.floor(Math.random() * ((data.Count - 1) - 0));
      resolve(data.Items[randomIndex]);
    });
  });
}

