module.exports = (sequelize, Sequelize) => {
    return sequelize.define("students", {
        diplomeId: {
            type: Sequelize.STRING
        },
        iv: {
            type: Sequelize.STRING
        }
    });
};
