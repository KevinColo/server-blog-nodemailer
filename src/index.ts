import "reflect-metadata";
import {createConnection} from "typeorm";
import {Request, Response} from "express";
import * as express from "express";
import * as bodyParser from "body-parser";
import {AppRoutes} from "./routes";
import * as cors from "cors";
import { Post } from "./entity/Post";

//options for cors midddleware
const options:cors.CorsOptions = {
    allowedHeaders: ["Origin", "access-control-allow-origin", "Content-Type", "Accept"],
    credentials: true,
    methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
    origin: "http://localhost:8080",
    preflightContinue: false
};
// create connection with database
// note that it's not active database connection
// TypeORM creates connection pools and uses them for your requests
createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());
    app.use(cors(options));

    // register all application routes
    AppRoutes.forEach(route => {
        app[route.method](route.path, (request: Request, response: Response, next: Function) => {
            route.action(request, response)
                .then(() => next)
                .catch(err => next(err));
        });
    });

    // run app
    app.listen(3005);

    console.log("Express application is up and running on port 3005");

}).catch(error => console.log("TypeORM connection error: ", error));
