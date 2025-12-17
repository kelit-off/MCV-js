const Team = require("../models/Team"); // CommonJS
const MainLayout = require("../layouts/MainLayout"); // CommonJS

const fs = require("fs");
const path = require("path");
const Car = require("../models/Car");

class TeamController {
    static async category(req, res) {
        const { category } = req.params;

        // Récupère les équipes correspondant à la catégorie
        let teams = [];
        try {
            teams = await Team.find({ category });
            const cars = await Car.find();

            for (let team of teams) {
                if (team.car) {
                    const car = cars.find(
                        (c) => c._id.toString() === team.car.toString()
                    );
                    // console.log(car)
                    team.car = car ? car.name : "N/A";
                    console.log(team.car);
                } else {
                    team.car = "N/A";
                }
            }
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

        content = content.replace("${_id}", "");
        content = content.replace("${name}", "");
        content = content.replace("${category}", "");
        content = content.replace("${carSelected}", "");

        const metadata = {};
        return res.send(MainLayout({ metadata, content }));
    }

    static async createPost(req, res) {
        try {
            const { name, category, car } = req.body;

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
                car: car ? car.trim() : null,
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

    static async delete(req, res) {
        try {
            const teamId = req.params.id;

            await Team.delete(teamId);

            if (req.originalUrl.startsWith("/api/")) {
                return res.json({
                    success: true,
                    message: "Équipe supprimée avec succès.",
                });
            }
        } catch (error) {
            console.error(error);

            if (req.originalUrl.startsWith("/api/")) {
                return res.status(500).json({
                    success: false,
                    error: "Erreur interne du serveur.",
                    detail: error.message,
                });
            }
        }
    }

    static async edit(req, res) {
        try {
            const teamId = req.params.id;
            const team = await Team.findById(teamId);

            if (!team) {
                return res.status(404).send("Équipe non trouvée");
            }

            const templatePath = path.join(
                __dirname,
                "../views/TeamCreateEditView.html"
            );
            let content = fs.readFileSync(templatePath, "utf-8");

            content = content.replace("${_id}", team._id);
            content = content.replace("${name}", team.name);
            content = content.replace("${category}", team.category);
            content = content.replace("${carSelected}", team.car || "");

            // Gestion de la sélection de la catégorie
            const selected_gt3 = team.category === "gt3" ? "selected" : "";
            const selected_gt4 = team.category === "gt4" ? "selected" : "";

            content = content.replace("${selected_gt3}", selected_gt3);
            content = content.replace("${selected_gt4}", selected_gt4);

            return res.send(
                MainLayout({
                    metadata: { title: "Modifier l'équipe" },
                    content: content,
                })
            );
        } catch (error) {
            console.error(error);

            return res.status(500).send("Erreur interne du serveur.");
        }
    }
}

module.exports = TeamController;
