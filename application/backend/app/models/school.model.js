module.exports = (sequelize, Sequelize) => {
    return sequelize.define("schools", {
        name: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        logo: {
            type: Sequelize.STRING
        },
        publicKey: {
            type: Sequelize.TEXT
        }
    });
};
