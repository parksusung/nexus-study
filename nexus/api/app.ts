import { ApolloServer } from 'apollo-server-express'
import {schema} from './schema'
import { createContext } from './graphql/utils/helpers';
import express from 'express'
import {graphqlUploadExpress } from 'graphql-upload';
import { permissions } from './graphql/utils/rules'
import { applyMiddleware } from 'graphql-middleware'
import { isDev } from './graphql/utils/constants'
import { join } from "path";
import * as HTTP from 'http'
import { iamportCallbackHandler } from './callback/payment'
// import { addJobCallbackHandler, jsonToXmlUploader } from './callback'
import multer from 'multer'
// import { translateCallbackHandler } from './callback/translate'
import { config } from 'dotenv'
import bodyParser from 'body-parser';
config()

// export const server = new ApolloServer({schema,
// context : createContext})
// // const apollo = new ApolloServer({schema})


const server = new ApolloServer({
    // schema: applyMiddleware(schema, permissions),
    schema : applyMiddleware(schema),
    context: createContext,
    // playground: isDev() === true ? (process.env.CUSTOM_ENDPOINT ? {
    //     endpoint: process.env.CUSTOM_ENDPOINT,
    //     subscriptionEndpoint: process.env.CUSTOM_ENDPOINT
    // } : true) : false,
    uploads: false,//ApolloServer 2버전에서 내장된 upload랑 별도 패키지로 설치한 graphql-upload 미들웨어랑 꼬이는 느낌이었어요 그래서 false 처리
    tracing: isDev(),
    debug: isDev(),
})


const app = express();
app.use("/graphql", graphqlUploadExpress({ maxFieldSize: 100000000, maxFileSize: 100000000, maxFiles: 1000, }));//이미지업로드시 보낼때 필요 
app.use(express.json({ limit: '100mb' }));
export const http = HTTP.createServer(app);
app.use(express.static(join(__dirname, 'static')));

app.use("/playauto/*", multer().any());
// app.route("/playauto/add_job_callback*").post((req, res) => addJobCallbackHandler(req, res));
app.use("/callback/*", multer().any());
app.route("/callback/iamport_pay_result*").post((req, res) => iamportCallbackHandler(req, res));
// app.route("/callback/translate*").post((req, res) => translateCallbackHandler(req, res));
// const PORT = process.env.PORT || 3000
server.applyMiddleware({ app })
server.installSubscriptionHandlers(http)


// http.listen(PORT, () => {
//     console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`)
// })
// runScheduler();

// import { GraphQLUpload } from "graphql-upload";

// export const Upload = decorateType(GraphQLUpload, {
//     sourceType: "Promise<FileUpload>",
//     asNexusMethod: "upload",
// });
const PORT = 4000
http.listen(PORT, () => {
    console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`)
})

