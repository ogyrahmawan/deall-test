import { ObjectId, WithId } from 'mongodb';
import { db } from '../../helper/db';
const collectionName = 'users'
const userCollection = db.collection<UserType>(collectionName);

async function createUserScheme () {
    if (!userCollection) {
        await db.createCollection('user', {
            validator: {
                '$jsonSchema': {
                  'required': [ '_id', 'role_id', 'username', 'password'],
                  'properties': {
                    '_id': { 'bsonType': 'objectId' },
                    'role_id': { 'bsonType': 'objectId' },
                    'username': { 'bsonType': 'string' },
                    'password': { 'bsonType': 'string' },
                  },
                  'additionalProperties': false
                }
              }
        })
        await db.createIndex('user', { username: 1 }, { unique: true } )
    }

}

interface UserType {
    _id?: ObjectId,
    username: string,
    password: string,
    role_id: ObjectId,
    role_name?: string,
}

type UserStorePayload = {
    username: string,
    password: string,
    role_id: ObjectId,
}

type UserBodyRequest = {
    username: string,
    password: string,
    role_id: string,
};

type UserUpdateBodyRequest = {
    username?: string,
    password?: string,
    role_id?: string,
};

type UserUpdatePaylod = {
    username?: string,
    password?: string,
    role_id?: ObjectId,
}

export {
    createUserScheme,
    userCollection,
    collectionName,
    UserType,
    UserStorePayload,
    UserBodyRequest,
    UserUpdateBodyRequest,
    UserUpdatePaylod,
}