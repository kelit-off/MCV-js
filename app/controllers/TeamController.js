const Team = require("../models/Team"); // CommonJS
const MainLayout = require("../layouts/MainLayout"); // CommonJS

const fs = require("fs");
const path = require("path");

class TeamController {
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
        const templatePath = path.join(
            __dirname,
            "../views/TeamCreateView.html"
        );
        let content = fs.readFileSync(templatePath, "utf-8");
        const metadata = {};
        return res.send(MainLayout({ metadata, content }));
    }

    static async createPost(req, res) {
        try {
            const { name, category } = req.body;

            // --- VALIDATION ---
            const errors = {};

            if (!name || name.trim() === "") {
                errors.name = "Le nom est obligatoire.";
            }

            if (!category || category.trim() === "") {
                errors.category = "La catégorie est obligatoire.";
            }

            // Si des erreurs existent → renvoyer la réponse adaptée
            if (Object.keys(errors).length > 0) {
                // Cas API (JSON)
                if (req.originalUrl.startsWith("/api/")) {
                    return res.status(400).json({ success: false, errors });
                }

                // Cas formulaire HTML → renvoi vers la vue
                return res.render("team/create", {
                    metadata: { title: "Créer une équipe" },
                    errors,
                    old: req.body,
                });
            }

            // --- CRÉATION ---
            const team = new Team({
                name: name.trim(),
                category: category.trim(),
            });

            await team.save();

            // --- RÉPONSE API ---
            if (req.originalUrl.startsWith("/api/")) {
                return res.json({
                    success: true,
                    message: "Équipe créée avec succès.",
                    team,
                });
            }

            // --- RÉPONSE FORMULAIRE ---
            return res.redirect("/");
        } catch (error) {
            console.error(error);

            if (req.originalUrl.startsWith("/api/")) {
                return res.status(500).json({
                    success: false,
                    error: "Erreur interne du serveur.",
                    detail: error.message,
                });
            }

            return res.status(500).send("Erreur interne");
        }
    }

    static delete(req, res) {
        const {id} = req.params

        console.log(id)
    }
}

module.exports = TeamController;
