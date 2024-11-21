const db = require('../config/db');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');

//function for registering doctors
exports.registerAdmin = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({message: 'please correct validation errors', error: errors.array()})
    }

    try{
        const {username, password, role} = req.body;
        const [admin] = await db.execute('SELECT * FROM admins WHERE username = ?', [username]);
        if (admin.length > 0){
            return res.status(400).json({message: 'admin with the username already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.execute('INSERT INTO admins (username, role, password) VALUES(?,?,?)', [username, role, hashedPassword]);
        return res.status(201).json({message: 'admin registered successfully'});
    } catch(error){
        res.status(500).json({message: 'An error occured', error: error.message})
    }

}


exports.loginAdmin = async (req, res) => {
    try{
        const {username, password} =req.body;
        try{
            const [admin] = await db.execute('SELECT username FROM admins WHERE username = ?', [username]);
            if (admin.length === 0){
                return res.status(400).json({message: 'admin with the username does not exist'});
            }
            const isMatch = await bcrypt.compare(password, admin[0].password);

            if (!isMatch){
                return res.status(400).json({message: 'invalid username/password combination'});
            }

            req.session.username = admin[0].username
            req.session.role = admin[0].role
            //req.session.password = admin[0].password
            

            return res.status(200).json({message: 'Login successful'});
        } catch (error){
            console.error(error);
            return res.status(500).json({message: 'An error occured when trying to login', error: error.message});
        }
    } catch (error){
        console.error(error);
        return res.status(500).json({message: 'An error occurred', error: error.message})
    }
    
}