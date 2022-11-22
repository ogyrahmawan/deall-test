import { ObjectId } from 'mongodb';
import { errors } from '../../helper';
import { user } from '../entity';
import { UserStorePayload, UserUpdatePaylod } from '../entity/user';

class User {
    static async find () {
        try {
            return user.userCollection.aggregate([
                { $lookup: { from: "role", localField: "role_id", foreignField: "_id", as: "role" } }, 
                { $unwind: "$role"},
                { $project: {  '_id' : 1, 'username': 1, 'role' : "$role"}}
            ]).toArray()
        } catch (error) {
            throw new errors.internalError.FindResourceError('users', error);
        }
    }

    static async findById (id: ObjectId) {
        try {
            return user.userCollection.findOne({_id: id})
        } catch (error) {
            console.log(error, 'iis error')
            throw new errors.internalError.FindResourceError('user by id', error);
        }
    }

    static async findDetail (targetId: ObjectId) {
        try {
            const item = await user.userCollection.aggregate([
                { $lookup: { from: "role", localField: "role_id", foreignField: "_id", as: "role" } }, 
                { $unwind: "$role"},
                { $match: {'_id': targetId }},
                { $limit: 1 },
                { $project: {  '_id' : 1, 'username': 1, 'role' : "$role"}}
            ]).toArray();
            return item;
        } catch (error) {
            throw new errors.internalError.FindResourceError('users', error);
        }
    }

    static async findByUsername (username: string) {
        try {
            return user.userCollection.findOne({
                username
            })
        } catch (error) {
            throw new errors.internalError.FindResourceError('user by username', error);
        }
    }

    static async createData (data: UserStorePayload) {
        try {
            return user.userCollection.insertOne(data);
        } catch (error) {
            throw new errors.internalError.CreateResourceError('user', error);
        }
    }

    static async upsertData (data: UserUpdatePaylod, user_id: ObjectId) {
        try {
            return user.userCollection.updateOne({ _id: user_id}, { $set: data });
        } catch (error: any) {
            throw new errors.internalError.UpdateResourceError('user', error, error);
        }
    }

    static deleteData (targetId: ObjectId) {
        try {
            return user.userCollection.deleteOne({"_id": targetId})
        } catch (error) {
            throw new errors.internalError.DeleteResourceError('user', error);
        }
    }
}

export default User;
