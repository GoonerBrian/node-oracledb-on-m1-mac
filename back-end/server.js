const express = require('express');
const oracledb = require('oracledb');
const dotenv = require('dotenv');
const app = express();
const PORT = 5000;
dotenv.config();
var cors = require('cors');
app.use(cors());
app.use(express.json());

app.listen(PORT, ()=>{console.log(`listen to port ${PORT}`);})

database_initialized = false

//Connection Management
async function init_database() {
	try {
		await oracledb.createPool({
			user: process.env.USER_NAME,
            password: process.env.DB_PASSWORD,
            connectionString: process.env.CONNECTION_STRING
		});
		console.log("Successfully created connection pool");
		database_initialized = true
	}
	catch (err) {
		console.log("Encountered an error creating a connection pool, retrying");
		await init_database();
	}
}

app.get('/', (req,res) => {
    res.send('Hello world!');
});

app.get('/get-customers', (req,res) => {
    async function fetchDataCustomers(){
        try {
            const connection = await oracledb.getConnection();

            oracledb.outFormat = oracledb.OUT_FORMAT_ARRAY;

            const query = process.env.QUERY_STR;

            const result = await connection.execute(query);
            console.log("Completed request");
            
            try {
                await connection.close();
            }
            catch (err) {
                console.log("Encountered an error closing a connection in the connection pool.");
            }
            
            return result;
        } catch (error) {
            return error;
        }
    }

    fetchDataCustomers().then(dbRes => {
        res.send(dbRes);
    })
    .catch(err => {
        res.send(err);
    })
})

init_database();