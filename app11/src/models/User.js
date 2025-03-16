const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
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
                isEmail: {
                    msg: 'Digite um email válido'
                },
                notEmpty: {
                    msg: 'O email é obrigatório'
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'A senha é obrigatória'
                },
                len: {
                    args: [6, 100],
                    msg: 'A senha deve ter no mínimo 6 caracteres'
                }
            }
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        tableName: 'users',
        timestamps: true,
        underscored: true,
        hooks: {
            // Hash da senha antes de salvar
            beforeSave: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 10);
                }
            }
        }
    });

    // Método para verificar senha
    User.prototype.checkPassword = function (password) {
        return bcrypt.compare(password, this.password);
    };

    // Método para excluir senha e outros dados sensíveis
    User.prototype.toJSON = function () {
        const values = { ...this.get() };
        delete values.password;
        return values;
    };

    // Associações
    User.associate = (models) => {
        // Exemplo: User.hasMany(models.Post, { foreignKey: 'user_id', as: 'posts' });
    };

    return User;
}; 