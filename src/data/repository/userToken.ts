import { ObjectId } from 'mongodb';
import { errors } from '../../helper';
import { userToken } from '../entity';
import { UserTokenStorePayload, UserTokenUpdatePayload } from '../entity/user_token';

class UserTokenRepository {
    static async findByRefreshToken (refresh_token: string) {
        return userToken.userTokenCollection.findOne({
            refresh_token
        })
    }

    static async findByUserId (user_id: ObjectId) {
        return userToken.userTokenCollection.findOne({
            user_id
        })
    }

    static async upsertData (data: UserTokenStorePayload) {
        try {
            return userToken.userTokenCollection.updateOne({ user_id: data.user_id}, { $set: data }, { upsert: true });
        } catch (error: any) {
            throw new errors.internalError.UpdateResourceError('update token', error, error);
        }
    }
}

export default UserTokenRepository;
