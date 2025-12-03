const MainLayout = require("../layouts/MainLayout");
const fs = require("fs");
const path = require("path");

module.exports = class HomeController {
    static index(req, res) {
        const metadata = {
            title: `Sport Automobile`
        };

        // Exécuter HomeView() pour générer le contenu
        const homeHtmlPath = path.join(__dirname, "../views/HomeView.html");
        const content = fs.readFileSync(homeHtmlPath, "utf-8");

        res.send(MainLayout({ metadata, content }));
    }
};
