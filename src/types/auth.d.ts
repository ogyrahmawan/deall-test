import { Request } from "express"
import { ObjectId } from "mongodb"

export type LoginPayloadType = {
    username: string,
    password: string,
}

export type LoggedInUser = {
    user_id: ObjectId,
    username: string,
    role_id: ObjectId,
    role_name: string,
}

export interface IGetUserAuthInfoRequest extends Request {
    user: LoggedInUser
}
  