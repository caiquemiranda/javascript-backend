const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

/**
 * Modelo de usuário
 */
class User extends Model {
    static init(sequelize) {
        super.init({
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'O nome é obrigatório'
                    },
                    len: {
                        args: [3, 100],
                        msg: 'O nome deve ter entre 3 e 100 caracteres'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: {
                    msg: 'Este email já está em uso'
                },
                validate: {
                    notEmpty: {
                        msg: 'O email é obrigatório'
                    },
                    isEmail: {
                        msg: 'Email inválido'
                    }
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: {
                        msg: 'A senha é obrigatória'
                    }
                }
            },
            role: {
                type: DataTypes.ENUM('admin', 'user'),
                allowNull: false,
                defaultValue: 'user',
                validate: {
                    isIn: {
                        args: [['admin', 'user']],
                        msg: 'Role inválida'
                    }
                }
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            last_login: {
                type: DataTypes.DATE
            }
        }, {
            sequelize,
            tableName: 'users',
            underscored: true
        });

        // Hook para criptografar a senha antes de salvar
        this.addHook('beforeSave', async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        });

        return this;
    }

    /**
     * Verifica se a senha fornecida está correta
     * @param {string} password - Senha a ser verificada
     * @returns {Promise<boolean>}
     */
    checkPassword(password) {
        return bcrypt.compare(password, this.password);
    }

    /**
     * Remove a senha do objeto ao converter para JSON
     */
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
}

module.exports = User; 