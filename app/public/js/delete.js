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
                            console.log("Succès :", data.message);
                            
                            document.querySelector("#" + button.dataset.id.replace(/^(\d)/, "\\3$1 ")).remove();
                        } else {
                            console.error("Erreur :", data.error);
                        }
                    })
                    .catch((err) => console.error("Erreur réseau :", err));
            });
        });
});
