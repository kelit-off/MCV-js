
document.addEventListener("DOMContentLoaded", function() {
    const form = document.querySelector("form");
    const message = document.querySelector("#message"); // un div pour afficher les retours

    if (!form) return;

    form.addEventListener("submit", async function(e) {
        e.preventDefault();

        // Génère dynamiquement les données du formulaire
        const data = {};
        new FormData(form).forEach((value, key) => {
            data[key] = value;
        });

        try {
            const res = await fetch(form.action, { // utilise l'URL dynamique du form
                method: form.dataset.method.toUpperCase(),
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
                
            const result = await res.json();
            if (message) {
                if (res.ok) {
                    message.textContent = result.message;
                    form.reset();
                } else {
                    message.textContent = "Erreur : " + result.error;
                }
            }
        } catch (err) {
            message.textContent = "Erreur serveur : " + err.details;
        }
    });
});