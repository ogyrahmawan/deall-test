import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

export const validateEmail = (email: string) => {
    const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

export const isNumber = (number: any) => {
    const re = /^[0-9]+([,.][0-9]+)?$/g;
    return re.test(number);
};

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String;

export const isInteger = (number: unknown) => Number.isInteger(Number(number));


export const convertDateTime = (isoDate?: string, headers?: any, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (isoDate && isoDate !== '0000-00-00 00:00:00') {
        return moment(isoDate)
            .utcOffset(parseInt(headers?.device_utc_offset || 420, 10))
            .format(format)
            .toString();
    }

    return undefined;
};

export const convertTimestampToDate = (isoDate?: string) => (isoDate ? moment(isoDate).format('YYYY-MM-DD') : isoDate);

export const isDefined = (obj: unknown) => (typeof obj !== 'undefined');

export const isEmptyString = (str: string) => {
    const emptyString = '';
    return (str === emptyString);
};

export const expiredTime = (expiryTime: number) => {
    const now = moment();
    const expire = moment(now).add(expiryTime, 'minutes').format('YYYY-MM-DD HH:mm:ss');
    return expire;
};

export const controllerWrapper = (fn: any) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        return await fn(req, res, next);
    } catch (err) {
        return next(err);
    }
};

export const validatePassword = (string: string) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(string);
};