const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = new Pool({
    connectionString: 'postgres://admin:eWVvSRAMe4wkCbNkIBTcuDhBGHIpvwWu@dpg-cgbe7hl269v4icrcvid0-a.oregon-postgres.render.com/testing_g1yp',
    ssl: { rejectUnauthorized: false }
});


app.listen(3000, () => console.log('server is running at http://localhost:3000'))


//get student by id
app.get('/students/:studentId', async (request, response) => {
    const { studentId } = request.params
    const query = `SELECT * FROM STUDENT WHERE adm_no=${studentId};`;
    const Array = await db.query(query)
    const result = Array.rows
    if (result.length > 0) {
        response.send(result)
    }
    else {
        response.send(`${studentId} not Found!`)
    }
})


app.get('/students/', async (request, response) => {
    const { name = '' } = request.query
    const query = `SELECT * FROM STUDENT WHERE name like '%${name}%' order by adm_no;`;
    const Array = await db.query(query)
    const result = Array.rows
    if (result.length > 0) {
        response.send(result)
    }
    else {
        response.send(`${name} not Found!`)
    }
})



//add student
app.post('/students', async (request, response) => {
    const studentDetails = request.body
    const { name, course, deptName, mobileNo } = studentDetails
    if (name === undefined) {
        response.send({ msg: 'name is missing!' })
    }
    else if (course === undefined) {
        response.send({ msg: 'course is missing!' });
    }
    else if (deptName === undefined) {
        response.send({ msg: 'dept name is missing!' })
    }
    else if (mobileNo === undefined) {
        response.send({ msg: 'mobile number is missing!' })
    }
    else {
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
        const result = Array.rows[0];
        const getInsertedData = `SELECT * FROM STUDENT WHERE adm_no=${result.adm_no};`
        const data = await db.query(getInsertedData);
        response.status(201)
        response.send(data.rows[0])
    }
})

//update student details
app.put('/students/:studentId', async (request, response) => {
    const studentDetails = request.body
    const { studentId } = request.params
    const getData = `SELECT name,course,dept_name,mobile_no from student where adm_no=${studentId}; `
    const queryData = await db.query(getData);
    const details = queryData.rows[0];
    if (details.length === 0) {
        response.send({ msg: `${studentId} not found!` })
    }
    else {
        const { name = details.name,
            course = details.course,
            deptName = details.dept_name,
            mobileNo = details.mobile_no } = studentDetails
        const query = `
        UPDATE STUDENT
        SET
        name='${name}',
        course='${course}',
        dept_name='${deptName}',
        mobile_no='${mobileNo}'
        WHERE
        adm_no=${studentId};`

        await db.query(query)
        const getInsertedData = `SELECT * FROM STUDENT WHERE adm_no=${studentId};`
        const data = await db.query(getInsertedData);
        response.send(data.rows[0])
    }
})

//delete student
app.delete('/students/:studentId', async (request, response) => {
    const { studentId } = request.params
    const query = `DELETE FROM STUDENT WHERE adm_no=${studentId};`;
    await db.query(query)
    response.status(204)
    response.send({ msg: `${studentId} has deleted successfully!` })
})


app.get('/', (request, response) => {
    response.status(200);
    response.send("welcome")
})
