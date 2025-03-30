const crypto = require('crypto');
const { allModels } = require("../models");
const emailService = require("../services/emailService");

const seedAdmin = async () => {
    const username = 'enzo';
    const fullName = 'enzo gg'
    const email = 'enzii.grg00@gmail.com'
    const password = crypto.randombytes(8).toString('hex'); // generate a random password
    // const phoneNumber = '9876543210';

    try {
        const saltRounds = 10;
        const passwordhash = await bcrypt.hash(password, saltRounds);

        // create admin user
        const userId = await allModels.userModel.createUser(username, fullName, email, passwordhash, phonenUmber);

        // Assign admin role
        const role = await allModels.roleModel.getRoleByName('owner');
        await allModels.userModel.assignUserRole(userId, role.role_id);

        // send the random password via email
        await emailService.sendMail(email, 
            'Your Admin Accout for United Arena Futsal Booking System',
            'Your admin account has been created', 
            `Your temporary password is: ${password}`
        );

        console.log('Admin user seeded successfully. Temporary password sent to email.');
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

seedAdmin();