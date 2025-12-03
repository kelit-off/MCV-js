module.exports = function HomeView({ users }) {
    return `
        <div class="max-w-2xl mx-auto">
            <h1 class="text-3xl font-bold mb-4">Liste des utilisateurs</h1>
            <a href="/users/create" class="px-4 py-2 bg-green-500 text-white rounded mb-4 inline-block">Créer un utilisateur</a>
            <div class="space-y-2">
                ${users.map(u => `
                    <div class="p-4 bg-white rounded shadow flex justify-between">
                        <div>
                            <strong>${u.name}</strong> - ${u.email}
                        </div>
                        <div class="space-x-2">
                            <a href="/users/edit/${u.id}" class="text-blue-500">Modifier</a>
                            <a href="/users/delete/${u.id}" class="text-red-500">Supprimer</a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
};
