'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const adminPassword = await bcrypt.hash('Admin@123', 10);
        const now = new Date();

        await queryInterface.bulkInsert('users', [{
            id: uuidv4(),
            name: 'Administrador',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
            active: true,
            created_at: now,
            updated_at: now
        }], {});

        console.log('Usuário administrador criado com sucesso!');
        console.log('Email: admin@example.com');
        console.log('Senha: Admin@123');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', {
            email: 'admin@example.com'
        }, {});
    }
}; 