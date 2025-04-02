const { secret, host } = require('../config/config')
const commonCtrl = require('./common');
const User = require('../models/users');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

/* Created By : Nikunj Kapadiya
 * Create date : 02/04/2025
 * Description : Create new user
*/

exports.signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email already exists
    let query = { email };
    let select = ['id'];
    const existingUser = await commonCtrl.getSingleData(User, query, select);
    if (existingUser) {
        return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const verificationToken = crypto.randomBytes(20).toString('hex');
        let newUserData = {
            first_name: firstName,
            last_name: lastName,
            email,
            verificationToken,
            password: hashedPassword,
        };

        let result = await commonCtrl.createData(User, newUserData);

        await sendEmail(result.email, verificationToken);

        res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
}

/* Created By : Nikunj Kapadiya
 * Create date : 02/04/2025
 * Description : Login user
*/
exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    let query = { email };
    let select = ['id', 'password', 'is_verified'];
    const user = await commonCtrl.getSingleData(User, query, select);

    if (!user || !user.is_verified) {
        return res.status(401).json({ message: 'Invalid credentials or email not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '1h' });

    res.status(200).json({ "success": true, message: 'Login successful', token });
}

/* Created By : Nikunj Kapadiya
 * Create date : 02/04/2025
 * Description : Verify user email
*/
exports.verifyEmail = async (req, res) => {
    const { token } = req.query;

    // Check if the token exists
    let query = { verificationToken: token };
    console.log(query);
    let select = ['id', 'is_verified'];
    const user = await commonCtrl.getSingleData(User, query, select);
    if (user.length === 0) {
        return res.status(400).json({ message: 'Invalid or expired verification token.' });
    }
    if (user.is_verified) {
        return res.status(200).json({ message: 'Your email is already verified.' });
    }

    let updateQuery = { id: user.id }
    let dataToUpdate = { is_verified: true }

    let result = await commonCtrl.updateData(User, dataToUpdate, updateQuery);
    if(result) {
        res.status(200).json({ message: 'Your email has been successfully verified!' });
    } else {
        return res.status(500).json({ message: 'Error during verification' });
    }
}

/* Created By : Nikunj Kapadiya
 * Create date : 02/04/2025
 * Description : Send Email
*/
const sendEmail = async (toEmail, verificationToken ) => {
    try {
        transObj = {
            host: "", // Add your host name
            port: 587,
        };
        let auth = {
            user: "", // Add your user name
            pass: "" // Add your password
        };
        let tls = { rejectUnauthorized: false }
            transObj = { ...transObj, auth, tls }
        
        let transporter = nodemailer.createTransport(transObj)

        transporter.verify(async function (error, success) {
            if (error) {
                res.status(200).send({ status: false, error_org: error, message: "Error while sending email, Check your SMTP configuration and try again." })
            } else {
                const verificationLink = `http://localhost:3000/api/user/verify-email?token=${verificationToken}`;
                let content = {
                    from:'info@demomailtrap.com',
                    to: "kapadiyanc@gmail.com",
                    cc: "",
                    bcc: "",
                    subject: "Email Verification",
                    html: `<p>Please click the link below to verify your email address:</p><p><a href="${verificationLink}">Verify Email</a></p>`,
                }
                
                let send = await transporter.sendMail(content, function(error, info){
                    if (error) {
                        res.status(200).send({ status: false, error_org: error, message: "Error while sending email." })
                    } else {
                        res.status(200).send({ status: true, success_org_response: info.response, message: "Mail sent successfully" });
                    }
                });
            }
        });
    } catch (err) {
         res.status(401).send({ status: 401, message: err.message });
    }
}