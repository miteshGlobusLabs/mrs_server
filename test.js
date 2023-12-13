// routes/loginRoutes.js

const express = require('express');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
 const auth = require('../middleware/auth')

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const employee_id = req.body.employee_id;
        const password = req.body.password;

        const userId = await User.findOne({ employee_id: employee_id });
        const isMatch = await bcrypt.compare(password, userId.password);

        // token generation 

        const token = await userId.generateAuthToken();
        console.log("the token part of login is " + token);

        // save token in cookie 

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 5000),
            httpOnly: true
        });

        

        if (isMatch && userId.role === "user") {
            // Include user data and role in the response for the user role
            const userData = {
                userId: userId.id,
                username: userId.username,
                email: userId.email,
                first_name: userId.first_name,
                last_name: userId.last_name,
                role: userId.role,  // Include the role in the user data
                // Add more user-specific data as needed
            };
            res.status(201).send({
                message: "You are in user panel",
                data: userData
            });
        } else if (isMatch && userId.role === "admin") {
            // Include admin data and role in the response for the admin role
            const adminData = {
                adminId: userId.id,
                adminName: userId.username,
                adminEmail: userId.email,
                role: userId.role,  // Include the role in the admin data
                first_name: userId.first_name,
                last_name: userId.last_name,
            };
            res.status(201).send({
                message: "You are in admin panel",
                data: adminData
            });
        } else {
            res.status(400).send("Error");
        }
        
        
    } catch (error) {
        res.status(400).send("Invalid Email");
    }
})


router.get("/protected-route", auth, (req, res) => {
        // If the middleware passes, the user is authenticated
        // Access user information using req.user
        res.json({ message: "Access granted to protected route", user: req.user });
      });




module.exports = router;




// routes/loginRoutes.js

// const express = require('express');
// const User = require('../models/userModel');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken'); // Add jwt dependency
// const auth = require('../middleware/auth')

// const router = express.Router();

// router.post('/', async (req, res) => {
//     try {
//         const { employee_id, password } = req.body;

//         const user = await User.findOne({ employee_id });

//         if (!user) {
//             return res.status(400).send("Invalid Employee ID");
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if (!isMatch) {
//             return res.status(400).send("Invalid Password");
//         }

//         // Token generation
//         const token = jwt.sign({ userId: user.id, role: user.role }, 'your-secret-key', {
//             expiresIn: '1h' // Token expiration time
//         });

//         // Save token in cookie
//         res.cookie("jwt", token, {
//             expires: new Date(Date.now() + 3600000), // 1 hour in milliseconds
//             httpOnly: true,
//             secure: true, // Set to true if using HTTPS
//         });

//         // Response data
//         const responseData = {
//             id: user.id,
//             username: user.username,
//             email: user.email,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             role: user.role,
//         };

//         if (user.role === "user") {
//             res.status(200).send({
//                 message: "You are in user panel",
//                 data: responseData
//             });
//         } else if (user.role === "admin") {
//             res.status(200).send({
//                 message: "You are in admin panel",
//                 data: responseData
//             });
//         } else {
//             res.status(400).send("Invalid Role");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });


// router.get("/protected-route", auth, (req, res) => {
//     // If the middleware passes, the user is authenticated
//     // Access user information using req.user
//     res.json({ message: "Access granted to protected route", user: req.user });
//   });

// module.exports = router;
