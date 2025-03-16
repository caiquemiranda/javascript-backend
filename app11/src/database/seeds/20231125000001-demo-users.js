'use strict';
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const adminPassword = await bcrypt.hash('admin123', 10);
        const userPassword = await bcrypt.hash('user123', 10);

        return queryInterface.bulkInsert('users', [
            {
                id: uuidv4(),
                name: 'Administrador',
                email: 'admin@example.com',
                password: adminPassword,
                role: 'admin',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                id: uuidv4(),
                name: 'Usuário Teste',
                email: 'user@example.com',
                password: userPassword,
                role: 'user',
                active: true,
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('users', null, {});
    }
}; 