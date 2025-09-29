const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, "Xv9k3!nT@6qZ#pW8$rL2^sY1*bE7&dG0", { expiresIn: '24h' });
}

module.exports = generateToken;