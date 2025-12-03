const User = require('../models/Team');
const UserView = require('../views/UserView'); // CommonJS
const MainLayout = require('../layouts/MainLayout'); // CommonJS

class TeamController {
    static index(req, res) {
        const userData = { name: 'Alice', email: 'alice@example.com' };
        const user = new User(userData);

        const content = UserView({ user });

        const metadata = {
            title: `Profil de ${user.name}`,
            description: `Page profil de ${user.name}`,
            keywords: 'profil, utilisateur, example'
        };

        const html = MainLayout({ metadata, content });

        res.send(html); // Envoie le HTML au client
    }
}

module.exports = TeamController;
