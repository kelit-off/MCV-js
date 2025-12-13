document.addEventListener("DOMContentLoaded", function () {
    document
        .querySelectorAll("button[data-type='delete']")
        .forEach((button) => {
            button.addEventListener("click", function (e) {
                fetch(button.dataset.url, {
                    method: "DELETE",
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            console.log("Équipe supprimée !");
                            // Optionnel : retirer le bloc du DOM
                            button.closest(".team-card").remove();
                        } else {
                            console.error("Erreur :", data.error);
                        }
                    })
                    .catch((err) => console.error("Erreur réseau :", err));
            });
        });
});
