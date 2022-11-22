import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import { errors, parser, responses } from './helper';
import userSeed from './seeder/user';
import { createRoleScheme } from './data/entity/role';
import { createUserScheme } from './data/entity/user';
import roleSeed from './seeder/role';
import routes from './routes';

const app = express();

app.use(cors());
app.use(parser.jsonParser);
app.use(parser.urlencodedExtendedParser);

// create scheme
async function createScheme () {
    await createRoleScheme()
    await createUserScheme()
    await createUserScheme()
}

// seeding
async function initialSeed () {
    await roleSeed()
    await userSeed()
}

createScheme()
initialSeed()

app.use('/v1/api/dashboard/', routes);

// Catch 404 and forward to error handler
app.use((_req, _res, next) => {
    next(
        errors.httpError.notFound(
            new errors.internalError.ResourceNotFoundError('URL'),
        ),
    );
});

app.use(
    (
        err: any,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
    ) => {
        const appErrors = [];
        const data = err.errors || err;

        if (Array.isArray(data)) {
            for (let i = 0; i < data.length; i += 1) {
                appErrors.push(data[i].data);
            }
        } else {
            appErrors.push(data.data || data);
        }

        let { originalError } = err;

        if (appErrors[0] instanceof Error) {
            [originalError] = appErrors;
            appErrors.shift();
            const overidedError = new errors.internalError.UnknownError().data;
            appErrors.push(overidedError);
        }
        console.log(appErrors)

        responses.httpResponse.errorHandler(res, err.status || 500, {
            errors: appErrors,
            meta: { 'request-id': res.locals.requestId },
        });
    },
);

export default app;
