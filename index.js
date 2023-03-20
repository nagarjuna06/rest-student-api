const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new Pool({
    connectionString: 'postgres://admin:eWVvSRAMe4wkCbNkIBTcuDhBGHIpvwWu@dpg-cgbe7hl269v4icrcvid0-a/testing_g1yp',
    ssl: { rejectUnauthorized: false }
});


app.listen(3000, () => console.log('server is running at http://localhost:3000'))

//get all students details
app.get('/students', async (request, response) => {
    const query = `SELECT * FROM student order by adm_no;`
    const Array = await db.query(query)
    const result = Array.rows
    response.send(result)
})

//get student by id
app.get('/students/:studentId/', async (request, response) => {
    const { studentId } = request.params
    const query = `SELECT * FROM STUDENT WHERE adm_no=${studentId}`;
    const Array = await db.query(query)
    const result = Array.rows
    if (result.length > 0) {
        response.send(result)
    }
    else {
        response.send(`${studentId} not Found!`)
    }
})



//add student
app.post('/students', async (request, response) => {
    const studentDetails = request.body
    const { name, course, deptName, mobileNo } = studentDetails
    const query = `
    INSERT INTO STUDENT(name,course,dept_name,mobile_no)
    VALUES(
        '${name}',
        '${course}',
        '${deptName}',
        '${mobileNo}'
    ) RETURNING adm_no
    ;`;
    const Array = await db.query(query)
    const result = Array.rows[0]
    response.send(`Your Admission number is: ${result.adm_no}`)
})

//update student details
app.put('/students', async (request, response) => {
    const studentDetails = request.body
    const { admNo, name, course, deptName, mobileNo } = studentDetails
    const query = `
    UPDATE STUDENT
    SET
    name='${name}',
    course='${course}',
    dept_name='${deptName}',
    mobile_no='${mobileNo}'
    WHERE
    adm_no=${admNo};`

    await db.query(query)
    response.send(`${admNo} has updated successfully!`);
})

//delete student
app.delete('/students/:studentId', async (request, response) => {
    const { studentId } = request.params
    const query = `DELETE FROM STUDENT WHERE adm_no=${studentId};`;
    await db.query(query)
    response.send(`${studentId} has deleted successfully!`)
})


app.get('/', (request, response) => {
    response.status(200);
    response.send("welcome")
})
