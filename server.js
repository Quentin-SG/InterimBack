import express from "express";
import bodyParser from "body-parser"

import authentificationRoutes from "./routes/authentification.js";
import notificationRoutes from "./routes/notification.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use( "/aut", authentificationRoutes );
app.use( "/not", notificationRoutes );

app.listen( PORT, () => {
    console.log("Server started and listening on port " + PORT);
});
