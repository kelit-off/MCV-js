module.exports = function UserView({ user }) {
    return `
        <h1>Bonjour ${user.name}</h1>
        <p>Email: ${user.email}</p>
    `;
};
