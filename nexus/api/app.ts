import { ApolloServer } from 'apollo-server'
import {schema} from './schema'
export const server = new ApolloServer({schema})
// const apollo = new ApolloServer({schema})


// const app = express();
// app.use("/graphql", graphqlUploadExpress({ maxFieldSize: 100000000, maxFileSize: 100000000, maxFiles: 1000, }));
// app.use(express.json({ limit: '100mb' }));
// const http = HTTP.createServer(app);
// app.use(express.static(join(__dirname, 'static')));

// app.use("/playauto/*", multer().any());
// app.route("/playauto/set_callback/*/").post((req, res) => setCallbackHandler(req, res));
// app.route("/playauto/add_job_callback*").post((req, res) => addJobCallbackHandler(req, res));
// app.route("/playauto/add_job_order_callback*").post((req, res) => addJobOrderCallbackHandler(req, res));
// app.use("/callback/*", multer().any());
// app.route("/callback/iamport_pay_result*").post((req, res) => iamportCallbackHandler(req, res));
// app.route("/callback/translate*").post((req, res) => translateCallbackHandler(req, res));
// const PORT = process.env.PORT || 3000
// apollo.applyMiddleware({ app })
// // apollo.installSubscriptionHandlers(http)


// http.listen(PORT, () => {
//     console.log(`🚀 GraphQL service ready at http://localhost:${PORT}/graphql`)
// })
// runScheduler();
