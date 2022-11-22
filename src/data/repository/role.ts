import { ObjectId } from 'mongodb';
import { errors } from '../../helper';
import { role } from '../entity';
import { RoleStorePayload } from '../entity/role';

class Role {
    static async findByName (name: string) {
        try {
            return role.roleCollection.findOne({
                name
            })
        } catch (error) {
            throw new errors.internalError.FindResourceError('role by name', error);
        }
    }

    static async findById (id: ObjectId) {
        try {
            return role.roleCollection.findOne({_id: id})
        } catch (error) {
            throw new errors.internalError.FindResourceError('role by id', error);
        }
    }

    static async createData (data: RoleStorePayload) {
        try {
            return role.roleCollection.insertOne(data);
        } catch (error) {
            throw new errors.internalError.CreateResourceError('role', error);
        }
    }
}

export default Role;
