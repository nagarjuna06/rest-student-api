const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const cors = require('cors');
// const compression = require('compression');
const app = express();
app.use(express.json());
// app.use(compression())
app.use(cors());
const dbPath = path.join(__dirname, "student.db")
let db = null
const port = process.env.PORT || 3000
const initializeDBandServer = async () => {
    try {
        db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        })
        app.listen(port, () => console.log(`Server is running at http://localhost:${port}/`))
    }
    catch (e) {
        console.log(`DB Error : ${e.message}`);
        process.exit(1)
    }
}
initializeDBandServer()

//this is the origin
const isThisOrigin = (request, response, next) => {
    const { origin } = request.headers;
    if (origin === 'http://192.168.43.143:3000') {
        next()
    }
    else {
        response.status(400)
        response.send({ msg: " This Api has Restricted by Admin!" })
    }
}

//get all students details
app.get('/students', async (request, response) => {
    const query = `SELECT * FROM student`
    const Array = await db.all(query)
    response.send(Array)
})

//get student by id
app.get('/students/:studentId/', async (request, response) => {
    const { studentId } = request.params
    const getStudentQuery = `SELECT * FROM STUDENT WHERE adm_no=${studentId}`;
    const Array = await db.get(getStudentQuery)
    response.send(Array)
})



//add student
app.post('/students', async (request, response) => {
    const studentDetails = request.body
    const { name, course, deptName, mobileNo } = studentDetails
    const addStudentQuery = `
    INSERT INTO STUDENT(name,course,dept_name,mobile_no)
    VALUES(
        '${name}',
        '${course}',
        '${deptName}',
        ${mobileNo}
    )
    `;
    const DbResponse = await db.run(addStudentQuery);
    const studentId = DbResponse.lastID;
    response.send({ studentId })
})

//update student details
app.put('/students', async (request, response) => {
    const studentDetails = request.body
    const { admNo, name, course, deptName, mobileNo } = studentDetails
    const updateStudentQuery = `
    UPDATE STUDENT
    SET
    name='${name}',
    course='${course}',
    dept_name='${deptName}',
    mobile_no=${mobileNo}
    WHERE
    adm_no=${admNo}
    `
    await db.run(updateStudentQuery)
    response.send(`${admNo} has updated successfully!`)
})

//delete student
app.delete('/students/:studentId', async (request, response) => {
    const { studentId } = request.params
    const deleteStudentQuery = `DELETE FROM STUDENT WHERE adm_no=${studentId};`;
    await db.run(deleteStudentQuery)
    response.send(`${studentId} deleted successfully!`)
})

app.get('/embed', async (request, response) => {
    const res = await fetch('https://oembed.com/providers.json');
    const result = await res.json()
    response.send(result)
})

app.get('/', async (request, response) => {
    response.status(200);
    response.send("welcome")
})
