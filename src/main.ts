import 'dotenv/config';
import morgan from 'morgan'; // HTTP request logger.
import helmet from "helmet"; // Helps secure your apps by setting various HTTP headers.
import express, {Express, Request, Response} from 'express';
import {Viewer} from "./core/sharedKernel/Viewer.js";
import { createHandler } from 'graphql-http/lib/use/express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadSchemaSync } from '@graphql-tools/load';
import { loadFiles } from '@graphql-tools/load-files';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import path from 'path';
import url from 'url';
import cors from 'cors'; // Import the cors middleware


// **************************************
//          Environment Setup
// **************************************
// const isTest = !!process.env.TEST_DATABASE;
// const isProduction = !!process.env.DATABASE_URI;
// const port = isTest ? process.env.SERVER_TEST_PORT : process.env.API_SERVER_PORT;

// **************************************
//         Express App Setup
// **************************************
const app: Express = express();

app.use(helmet({
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));

// **************************************
//       Express middlewares
// **************************************
const loggingMiddleware = (req: any, res: any, next: any) => {
    console.log('ip:', req.ip);
    next();
}
app.use(loggingMiddleware);

app.use(cors({
    origin: 'http://localhost:56995',
}));


const createViewerMiddleware = async (req: any, res: any, next: any) => {
    const myViewer = new Viewer(req.headers, process.env.SECRET as string);
    await myViewer.prepareViewer().then(() => {
        res.locals.myViewer = myViewer;
    });
    next();
}
app.use(createViewerMiddleware);

// **************************************
//       GraphQl: Schema / Resolvers
// **************************************
const resolverFiles = await loadFiles("dist/presentation/graphQL/resolvers/*.js", {
    ignoreIndex: true,
    requireMethod: async (path: string) => {
      return await import(url.pathToFileURL(path).toString());
    },
});
const resolvers = mergeResolvers(resolverFiles);
const executableSchema = makeExecutableSchema({
    typeDefs: loadSchemaSync('src/presentation/graphQL/schema/*.graphql', {
        loaders: [new GraphQLFileLoader()],
    }),
    resolvers: resolvers,
});

// **************************************
//          GraphQl: Endpoint
// **************************************
const graphqlContext = {
    ip: function (args: any, request: any) {
        return request.ip;
    }
};


app.use('/graphql', createHandler({
    schema: executableSchema, 
    context: async (req, args) => { 
        // console.log("req.context.res.locals.myViewer:\n", req.context.res.locals.myViewer);
        // console.log("args:\n", args);
        return req.context.res.locals.myViewer; 
    },
}
),);
// app.use('/graphql', graphqlHTTP((req: Request, res: Response) => ({
//         schema: executableSchema,
//         context: res.locals.myViewer, //new Viewer(req.headers, process.env.SECRET as string).prepareViewer().then(() => console.log("Prepared Viewer...")),        // { req , secret: process.env.SECRET },
//         graphiql: true,
//     })),
// );
app.listen(process.env.API_SERVER_PORT,
    () => console.log(`Running a GraphQL API server at http://127.0.0.1:${process.env.API_SERVER_PORT}/graphql`)
);
