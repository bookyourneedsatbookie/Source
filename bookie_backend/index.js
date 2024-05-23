const express = require('express');
const sql = require('mssql');
const jwt = require('jsonwebtoken');
const http = require('http')
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// Create an Express application
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const jwtSecretKey = 'TERF2024';

// SQL Server configuration
const config = {

    user: 'bookie',
    password: 'Kumaresh@432000',
    server: 'sqlbookiedatabase.database.windows.net',
    database: 'BookieDB',

    options: {
        encrypt: true, // Change this based on your server configuration
        trustServerCertificate: true, // Change this based on your server configuration
    }
};

// Middleware to parse JSON bodies
var cors = require('cors')
app.use(cors())
app.use(express.json());

app.post('/registerterf', async (req, res) => {

    const { turfName, address1, address2, city, state, pincode, availableSports, rate, mrngSlots, evngSlots, image, userId } = req.body;
    console.log("first", req.body);
    try {
        await sql.connect(config);
        const request = new sql.Request();
        console.log(request)
        // const query = `INSERT INTO terf_details (name, address1,address1,city,state,pincode, available_sports,rate,morning_slot,evening_slot,image,userId) 
        // VALUES (${name},${address1},${address2},${city},${state},${pincode},${availableSports},${rate},${mrngSlots},${evngSlots},'${image}',${'93873'})`;
        const query = `INSERT INTO terf_details (turfName, address1,address2,city,state,pincode, availableSports,rate,mrngSlots,evngSlots,image,userId) 
        VALUES ('${turfName}','${address1}','${address2}','${city}','${state}',${pincode},'${availableSports}',${rate},'${mrngSlots}','${evngSlots}','${image}','${userId}')`;
        console.log(query);
        await request.query(query);
        res.status(201).send('Terf information Uploaded successfully');

    } catch (error) {
        // Send an error response
        console.error('SQL Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        // Do not close the SQL connection here
        // sql.close();
    }

});

// API endpoint to delete user information
app.delete('/deleteterf/:terfId', verifyToken, async (req, res) => {
    try {
        const terfId = req.params.terfId;
        console.log("terf Id ", terfId)

        // Create SQL connection pool
        await sql.connect(config);

        // Execute the query to delete the user
        await sql.query`
            DELETE FROM terf_details
            WHERE terfId = ${terfId}
        `;

        // Close the connection
        await sql.close();

        res.status(200).send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting user');
    }
});

app.post('/updateterf/:terfId', verifyToken, async (req, res) => {
    console.log("Entered update")
    try {
        const terfId = req.params.terfId;
        console.log("............ ", terfId)
        const { turfName, address1, address2, city, state, pincode, availableSports, rate, mrngSlots, evngSlots, image } = req.body;
        console.log("body  ", req.body)

        // Create SQL connection pool
        await sql.connect(config);
        console.log("userid 123", terfId);
        // Execute the query
        await sql.query`
            UPDATE terf_details
            SET name = ${turfName}, 
            address1 = ${address1}, 
            address2 = ${address2}, 
            city = ${city}, 
            state = ${state}, 
            pincode = ${pincode}, 
            available_sports = ${availableSports}, 
            rate = ${rate}, 
            morning_slot = ${mrngSlots}, 
            evening_slot = ${evngSlots},
            image = ${image}
            WHERE terfId = ${terfId}
        `;
        console.log("res  ", sql.query);
        // console.log("userid ", userId);

        // Close the connection
        await sql.close();

        res.status(200).send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating user');
    }
});

app.get('/terf/:terfId', verifyToken, async (req, res) => {
    try {

        // Timer("N")

        const terfId = req.params.terfId;
        console.log("input ", terfId)

        // Create SQL connection pool
        await sql.connect(config);

        // Execute the query to check if the user exists
        const result = await sql.query`
                SELECT *
                FROM terf_details
                WHERE terfId = ${terfId} 
                    `;

        // Close the connection
        await sql.close();

        // Check if any user is found with the provided credentials
        if (result.recordset.length > 0) {
            const terf = result.recordset[0];
            res.status(200).json(terf);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
        await sql.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login');
    }
});





app.post('/loginuser', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Create SQL connection pool
        await sql.connect(config);

        // Execute the query to check if the user exists
        const result = await sql.query`
                                SELECT * FROM users WHERE email = ${email} AND password = ${password} `;
        if (result.recordset.length > 0) {

            let data = {
                time: new Date(),
                userId: result.recordset[0].userId,
                userType: result.recordset[0].userType
            }
            const token = jwt.sign(data, jwtSecretKey);
            res.send(token);
        }
        else {
            res.status(401).json({ message: 'Invalid Email or Password' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login');
    }
});


function verifyToken(req, res, next) {
    console.log("123 ", req)
    const token = req.header('Authorization');
    let splitedToken = token?.split('Bearer ');
    console.log("first*** ", token)
    console.log("123 ", req)
    if (!token) return res.status(401).json({ error: 'Access denied' });
    try {
        const decoded = jwt.verify(splitedToken[1], jwtSecretKey);
        req.userId = decoded.userId;
        req.userType = decoded.userType;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

//validate token
app.get("/validateToken", (req, res) => {

    try {
        const token = req.header('Authorization');

        const verified = jwt.verify(token, jwtSecretKey);
        if (verified) {
            return res.send("Successfully Verified");
        } else {
            // Access Denied
            return res.status(401).send(error);
        }
    } catch (error) {
        // Access Denied
        return res.status(401).send(error);
    }
});


app.post('/registeruser', async (req, res) => {
    console.log("***** ", req.body); // Log the request body to check its structure and values


    const { firstName, lastName, email, mobile, password, dob, gender, userType } = req.body;

    console.log("*  ", req.body);

    try {
        // Connect to SQL Server
        debugger;
        await sql.connect(config);

        // Create a new request object
        // const request = new sql.Request();

        if (firstName !== null && email !== null && mobile !== null && password !== null &&
            firstName !== undefined && email !== undefined && mobile !== undefined && password !== undefined &&
            firstName !== "" && email !== "" && mobile !== "" && password !== ""
        ) {
            console.log("accepted")
            const query = await sql.query`
            INSERT INTO users (firstName, lastName, email, mobile, password, dob, gender, userType)
            VALUES (${firstName}, ${lastName}, ${email}, ${mobile}, ${password}, ${dob},${gender}, ${userType})
        `;
            if (query?.rowsAffected?.[0] > 0) {
                res?.status(201)?.json({
                    message: "user inserted sucessfully"
                })
            }

        } else {
            console.log("not accepted")
            res?.status(401)?.json({
                message: "check the input request"
            })
        }


    } catch (error) {
        // Send an error response
        console.error('SQL Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/registeruser', async (req, res) => {
    console.log("***** ", req.body); // Log the request body to check its structure and values


    const { firstName, lastName, email, mobile, password, dob, gender, userType } = req.body;

    console.log("*  ", req.body);

    try {
        // Connect to SQL Server
        debugger;
        await sql.connect(config);

        // Create a new request object
        // const request = new sql.Request();

        if (firstName !== null && email !== null && mobile !== null && password !== null &&
            firstName !== undefined && email !== undefined && mobile !== undefined && password !== undefined &&
            firstName !== "" && email !== "" && mobile !== "" && password !== ""
        ) {
            console.log("accepted")
            const query = await sql.query`
            INSERT INTO users (firstName, lastName, email, mobile, password, dob, gender, userType)
            VALUES (${firstName}, ${lastName}, ${email}, ${mobile}, ${password}, ${dob},${gender}, ${userType})
        `;
            if (query?.rowsAffected?.[0] > 0) {
                res?.status(201)?.json({
                    message: "user inserted sucessfully"
                })
            }

        } else {
            console.log("not accepted")
            res?.status(401)?.json({
                message: "check the input request"
            })
        }


    } catch (error) {
        // Send an error response
        console.error('SQL Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/registerBank/:userId', verifyToken, async (req, res) => {
    console.log("***** ", req.body); // Log the request body to check its structure and values

    const userId = req.params.userId
    const { bankName, accNumber, accHolder, ifscCode, accType } = req.body;

    console.log("*  ", req.body);

    try {
        await sql.connect(config);

        const query = await sql.query`
            INSERT INTO bank_details (bankName, accNumber, accHolder, ifscCode, accType)
            VALUES (${bankName}, ${accNumber}, ${accHolder}, ${ifscCode}, ${accType}, ${userId})
        `;
        if (query?.rowsAffected?.[0] > 0) {
            res?.status(201)?.json({
                message: "Bank details inserted sucessfully"
            })
        }
    } catch (error) {

        console.error('SQL Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/getUser/:userId', verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        await sql.connect(config);

        const result = await sql.query`
            SELECT *
            FROM users
            WHERE userId = ${userId}
        `;
        if (result.recordset.length > 0) {
            const user_details = result?.recordset[0];

            const result1 = await sql.query`
                SELECT *
                FROM bank_details
                WHERE userId = ${user_details.userId}
            `;
            const bank_details = result1?.recordset[0];

            if (user_details?.userType === "ADMIN" && result1.recordset.length > 0) {
                res.status(200).json({
                    user_details: user_details,
                    bank_details: bank_details
                });
            } else {
                res.status(200).json({
                    user_details: user_details,
                });
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
        await sql.close();
    } catch (err) {
        console.error(err);
        res.status(500).send('Error during login');
    }
});

app.get('/getAllTerfs/:userId', verifyToken, async (req, res) => {
    try {
        await sql.connect(config);

        const userId = req.params.userId
        // Create a new request object
        // const result = await sql.query` SELECT * FROM terf_details WHERE userId = ${userId}`;
        const result = await sql.query` SELECT * FROM users WHERE userId = ${userId}`;
        if (result.recordset.length > 0) {
            const user = result.recordset[0];

            const result1 = await sql.query`
                        SELECT *
                        FROM terf_details
                        WHERE userId = ${user.userId}
                    `;
            const result2 = await sql.query`
                    SELECT * FROM terf_details
                    `
            const result3 = await sql.query`
                    select * from booking_details where terf_ownerId = ${user.userId}
                    `
            const result4 = await sql.query`
                    select * from booking_details where b_userId = ${user.userId}
                    `
            const myBookings = result3?.recordset
            const userBookings = result4?.recordset

            if (user?.userType === "ADMIN") {
                if (result1.recordset.length > 0) {
                    // Timer(user?.userId)
                    const terf_details = result1.recordset
                    res.status(200).json({
                        message: 'Login successful',
                        user: {
                            userId: user.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            dob: user.dob,
                            gender: user.gender,
                            mobile: user.mobile,
                            userType: user.userType,
                        },
                        terf_details: terf_details,
                        myTerfBookingDetails: myBookings
                    });
                } else {
                    res.status(401).json({ message: 'No Turf available' });
                }
            } else {
                if (result2.recordset.length > 0) {
                    const terf_details = result2.recordset
                    res.status(200).json({
                        message: 'Login successful',
                        user: {
                            userId: user.userId,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            dob: user.dob,
                            gender: user.gender,
                            mobile: user.mobile,
                            userType: user.userType
                        },
                        terf_details: terf_details,
                        user_booking: userBookings
                    });
                } else {
                    res.status(401).json({ message: 'No Turf available' });
                }
            }
        }
    }
    catch (error) {
        throw error
    }
});


// Start the server
const port = 3000;
// http.createServer((req, res) => {
//     res.writeHead(200, {'Content-Type': 'text/plain'});
//     res.end('Rest API');
//     console.log(`Server is running on port ${port}`);

// }).listen(port);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});