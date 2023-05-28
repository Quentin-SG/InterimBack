import express from "express";
import bodyParser from "body-parser"

import authentificationRoutes from "./routes/authentification.js";
import notificationRoutes from "./routes/notification.js";
import userRoutes from "./routes/user.js";
import offerRoutes from "./routes/offer.js";
import applicationRoutes from "./routes/application.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use( "/aut", authentificationRoutes );
app.use( "/not", notificationRoutes );
app.use( "/user", userRoutes );
app.use( "/offer", offerRoutes );
app.use( "/app", applicationRoutes );

app.listen( PORT, () => {
    console.log("Server started and listening on port " + PORT);
});
