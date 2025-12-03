function MainLayout({ metadata = {}, content = '' }) {
    // Générer dynamiquement le head
    const head = Object.entries(metadata)
        .map(([key, value]) => {
            if (key === 'title') return `<title>${value}</title>`;
            return `<meta name="${key}" content="${value}">`;
        })
        .join('\n');

    return `
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${head}
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </head>
            <body>
                ${content}
            </body>
        </html>
    `;
}

module.exports = MainLayout;
