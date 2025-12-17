const MainLayout = require("../layouts/MainLayout");
const Car = require("../models/Car");

const fs = require("fs");
const path = require("path");

module.exports = class CarController {
    static async index(req, res) {
        let cars = [];

        try {
            cars = await Car.find();
        } catch (err) {
            console.error("Erreur lors de la récupération des voitures :", err);
            cars = [];
        }

        const templatePath = path.join(__dirname, "../views/CarListView.html");
        let content = fs.readFileSync(templatePath, "utf-8");

        if (!cars || cars.length === 0) {
            content = content.replace(
                /{{#ifNoCars}}([\s\S]*?){{\/ifNoCars}}/,
                "$1"
            );
            content = content.replace(/{{#cars}}([\s\S]*?){{\/cars}}/, "");
        } else {
            content = content.replace(
                /{{#ifNoCars}}([\s\S]*?){{\/ifNoCars}}/,
                ""
            );

            content = content.replace(/{{#cars}}|{{\/cars}}/g, "");

            const carBlockMatch = content.match(
                /{{#each cars}}([\s\S]*?){{\/each}}/
            );

            if (carBlockMatch) {
                const teamBlock = carBlockMatch[1];
                const teamsHtml = cars
                    .map((car) => {
                        return teamBlock
                            .replace(/{{name}}/g, car.name)
                            .replace(/{{brand}}/g, car.manufacturer || "N/A")
                            .replace(/{{category}}/g, car.category || "N/A")
                            .replace(/{{year}}/g, car.year || "N/A")
                            .replace(/{{_id}}/g, car._id);
                    })
                    .join("");
                content = content.replace(carBlockMatch[0], teamsHtml);
            }
        }

        const metadata = {
            title:
                cars.length > 0
                    ? `Voitures GT disponibles (${cars.length})`
                    : `Aucune voiture trouvée`,
            description: `Liste des voiture GT`,
            keywords: `teams, category, cars`,
        };

        res.send(MainLayout({ metadata, content }));
    }

    static create(req, res) {
        const templatePath = path.join(
            __dirname,
            "../views/CarCreateEditView.html"
        );
        let content = fs.readFileSync(templatePath, "utf-8");
        content = content.replace(/\$\{[^}]*\}/g, "");
        content = content.replace(/{{method}}/g, "POST");

        const metadata = {};

        res.send(MainLayout({ metadata, content }));
    }

    static async createPost(req, res) {
        try {
            const {
                name,
                manufacturer,
                model,
                category,
                year,
                image,
                description,
                active,
            } = req.body;

            const error = {};

            if (!name || name.trim() === "") {
                error.name = "Le nom de la voiture est requis.";
            }

            if (Object.keys(error).length > 0) {
                if (req.originalUrl.startsWith("/api/")) {
                    return res.status(400).json({ error });
                }
            }

            const car = new Car({
                name: name.trim(),
                manufacturer: manufacturer ? manufacturer.trim() : "",
                model: model ? model.trim() : "",
                category: category ? category.trim() : "",
                year: year ? parseInt(year) : null,
                image: image ? image.trim() : "",
                description: description ? description.trim() : "",
                active: true,
            });

            await car.save();

            if (req.originalUrl.startsWith("/api/")) {
                return res.json({
                    success: true,
                    message: "Équipe créée avec succès.",
                    car,
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

    static async edit(req, res) {
        try {
            const carId = req.params.id;
            const car = await Car.findById(carId);

            const templatePath = path.join(
                __dirname,
                "../views/CarCreateEditView.html"
            );
            let content = fs.readFileSync(templatePath, "utf-8");
            content = content.replace("{{method}}", `PUT`);
            content = content.replace("${_id}", car._id);
            content = content.replace("${name}", car.name);
            content = content.replace(
                "${manufacturer}",
                car.manufacturer || ""
            );
            content = content.replace(/{{category}}/g, car.category || "");
            content = content.replace("${year}", car.year || "");
            content = content.replace(/{{method}}/g, "PUT");

            content = content.replace(
                "${selected_gt3}",
                car.category === "gt3" ? "selected" : ""
            );
            content = content.replace(
                "${selected_gt4}",
                car.category === "gt4" ? "selected" : ""
            );

            return res.send(
                MainLayout({
                    metadata: { title: `Éditer la voiture ${car.name}` },
                    content,
                })
            );
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erreur interne");
        }
    }

    static async editPut(req, res) {
        try {
            const { _id, name, manufacturer, model, category, year, image, description, active } = req.body;

            const car = await Car.findById(_id);

            car.name = name.trim();
            car.manufacturer = manufacturer ? manufacturer.trim() : "";
            car.model = model ? model.trim() : "";
            car.category = category ? category.trim() : "";
            car.year = year ? parseInt(year) : null;
            car.image = image ? image.trim() : "";
            car.description = description ? description.trim() : "";
            car.active = active === "on" ? true : false;

            await car.save();

            if (req.originalUrl.startsWith("/api/")) {
                return res.json({
                    success: true,
                    message: "Voiture mise à jour avec succès.",
                    car,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).send("Erreur interne");
        }
    }

    static async delete(req, res) {
        try {
            const carId = req.params.id;

            await Car.delete(carId);

            if (req.originalUrl.startsWith("/api/")) {
                return res.json({
                    success: true,
                    message: "Voiture supprimée avec succès.",
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

    static async getList(req, res) {
        try {
            const cars = await Car.find();
            return res.json({ success: true, cars: cars });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success: false,
                error: "Erreur interne du serveur.",
                detail: error.message,
            });
        }
    }
};
