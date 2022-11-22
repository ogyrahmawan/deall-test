import { ObjectId } from 'mongodb';
import { db } from '../../helper/db';
const roleCollection = db.collection<RoleType>('role');

type RoleType = {
    _id?: ObjectId,
    name: string,
}

async function createRoleScheme () {
  if (!roleCollection) {
    db.createCollection("role", {
        validator: {
            "$jsonSchema": {
              "required": [ "_id", "name" ],
              "properties": {
                "_id": { "bsonType": "objectId" },
                "name": { "bsonType": "string" }
              },
              "additionalProperties": false
            }
          }
    })
  }
}

type RoleStorePayload = {
    name: string,
}


export {
    RoleType,
    createRoleScheme,
    RoleStorePayload,
    roleCollection,
}