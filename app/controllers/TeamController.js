const Team = require("../models/Team"); // CommonJS
const MainLayout = require("../layouts/MainLayout"); // CommonJS

const fs = require("fs");
const path = require("path");

class TeamController {
    static index(req, res) {
        const userData = { name: "Alice", email: "alice@example.com" };
        const user = new User(userData);

        const content = UserView({ user });

        const metadata = {
            title: `Profil de ${user.name}`,
            description: `Page profil de ${user.name}`,
            keywords: "profil, utilisateur, example",
        };

        const html = MainLayout({ metadata, content });

        res.send(html); // Envoie le HTML au client
    }

    static async category(req, res) {
        const { category } = req.params;

        // Récupère les équipes correspondant à la catégorie
        let teams = [];
        try {
            teams = await Team.find({ category });
        } catch (err) {
            console.error("Erreur lors de la récupération des équipes :", err);
            teams = [];
        }

        // Passe un objet à la vue, même si aucune équipe n'est trouvée
        const templatePath = path.join(__dirname, "../views/TeamListView.html");
        let content = fs.readFileSync(templatePath, "utf-8");

        // Gestion du placeholder category
        content = content.replace(/{{category}}/g, category);

        // Gestion de la liste des équipes
        if (!teams || teams.length === 0) {
            content = content.replace(
                /{{#ifNoTeams}}([\s\S]*?){{\/ifNoTeams}}/,
                "$1"
            );
            content = content.replace(/{{#teams}}([\s\S]*?){{\/teams}}/, "");
        } else {
            // Supprimer le bloc "aucune équipe"
            content = content.replace(
                /{{#ifNoTeams}}([\s\S]*?){{\/ifNoTeams}}/,
                ""
            );

            // Remplacer chaque équipe
            const teamBlockMatch = content.match(
                /{{#each teams}}([\s\S]*?){{\/each}}/
            );
            if (teamBlockMatch) {
                const teamBlock = teamBlockMatch[1];
                const teamsHtml = teams
                    .map((team) => {
                        return teamBlock
                            .replace(/{{name}}/g, team.name)
                            .replace(/{{car}}/g, team.car || "N/A")
                            .replace(/{{category}}/g, team.category || "N/A")
                            .replace(/{{_id}}/g, team._id);
                    })
                    .join("");
                content = content.replace(teamBlockMatch[0], teamsHtml);
            }
        }
        // Metadata pour la page
        const metadata = {
            title:
                teams.length > 0
                    ? `Catégorie ${category.toUpperCase()}`
                    : `Aucune équipe trouvée pour ${category}`,
            description: `Liste des équipes de la catégorie ${category}`,
            keywords: `teams, category, ${category}`,
        };

        res.send(MainLayout({ metadata, content }));
    }

    static create(req, res) {
        const templatePath = path.join(__dirname, "../views/TeamCreateView.html");
        let content = fs.readFileSync(templatePath, "utf-8");
        const metadata = {};
        return res.send(MainLayout({ metadata, content }));
    }
}

module.exports = TeamController;
