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
app.get('/students', (request, response) => {
    const query = `SELECT * FROM student order by adm_no;`
    db.query(query, (err, res) => {
        if (err) {
            response.send('error!')
        }
        else {
            response.send(res.rows)
        }
    })
})

//get student by id
0
app.get('/students/:studentId/', (request, response) => {
    const { studentId } = request.params
    const getStudentQuery = `SELECT * FROM STUDENT WHERE adm_no=${studentId}`;
    db.query(getStudentQuery, (err, res) => {
        if (err) {
            response.send('error!')
        }
        else {
            if (res.rows.length > 0) {
                response.send(res.rows)
            }
            else {
                response.send(`${studentId} not found!`)
            }
        }
    })
})



//add student
app.post('/students', (request, response) => {
    const studentDetails = request.body
    const { name, course, deptName, mobileNo } = studentDetails
    const addStudentQuery = `
    INSERT INTO STUDENT(name,course,dept_name,mobile_no)
    VALUES(
        '${name}',
        '${course}',
        '${deptName}',
        '${mobileNo}'
    ) RETURNING adm_no
    ;`;
    db.query(addStudentQuery, (err, res) => {
        if (err) {
            response.send('error!')
        }
        else {
            response.send(`Your Admission number is ${res.rows[0].adm_no} !`)
        }
    })
})

//update student details
app.put('/students', (request, response) => {
    const studentDetails = request.body
    const { admNo, name, course, deptName, mobileNo } = studentDetails
    const updateStudentQuery = `
    UPDATE STUDENT
    SET
    name='${name}',
    course='${course}',
    dept_name='${deptName}',
    mobile_no='${mobileNo}'
    WHERE
    adm_no=${admNo}
    `
    db.query(updateStudentQuery, (err, res) => {
        if (err) {
            response.send('error!')
        }
        else {
            response.send(`${admNo} has updated successfully!`)
        }
    })
})

//delete student
app.delete('/students/:studentId', (request, response) => {
    const { studentId } = request.params
    const deleteStudentQuery = `DELETE FROM STUDENT WHERE adm_no=${studentId};`;
    db.query(deleteStudentQuery, (err, res) => {
        if (err) {
            response.send('error!')
        }
        else {
            response.send(`${studentId} deleted successfully!`)
        }
    })
})


app.get('/', (request, response) => {
    response.status(200);
    response.send("welcome")
})
