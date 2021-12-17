

function route(app){
    //routes
    require("./auth.routes")(app);
    require("./user.routes")(app);
    require("./news.routes")(app);
    require("./perspective.routes")(app);
    require("./author.routes")(app);
    require("./topic.routes")(app);
    require("./searchNew.routes")(app);

}
module.exports = route;