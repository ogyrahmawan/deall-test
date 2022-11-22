import { ObjectId } from 'mongodb';
import { db } from '../../helper/db';
const userTokenCollection = db.collection('user_token');

type UserTokenType = {
    _id: ObjectId,
    refresh_token: string,
    user_id: ObjectId,
    expires_at: string,
};

async function createUserTokenScheme () {
  if (!userTokenCollection) {
    db.createCollection("user_token", {
        validator: {
            "$jsonSchema": {
              "required": [ "_id", "refresh_token", "user_id", "expires_at" ],
              "properties": {
                "_id": { "bsonType": "objectId" },
                "refresh_token": { "bsonType": "string" },
                "user_id": { "bsonType": "objectId" },
                "expires_at": { "bsonType": "string" },
              },
              "additionalProperties": false
            }
          }
    })
  }
}

type UserTokenStorePayload = {
    refresh_token: string,
    user_id: ObjectId,
    expires_at: string,
}

type UserTokenUpdatePayload = {
    refresh_token: string,
    expires_at: string,
}


export {
    UserTokenStorePayload,
    UserTokenType,
    createUserTokenScheme,
    userTokenCollection,
    UserTokenUpdatePayload,
}