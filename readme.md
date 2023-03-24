# Student REST API using ExpressJS

This is a Student REST API built using Node.js and ExpressJS. It provides the following features:

- Add a student
- Delete a student
- Search for a student by admission ID
- Search for a student by name
- Update a student's details using admission number

## Getting started

#### Prerequisites

- Node.js
- NPM

#### Installation

1. Clone the repository
2. Run npm install to install the dependencies
3. Rename .env.example file to .env and set the database URL as per your requirement.

#### Running the server

Run the following command to start the server:

`npm start`

The server will start running on `http://localhost:3000`.

#### API Endpoints

##### Add a student

To add a student, send a POST request to `/students` with the following JSON data:

```
{
    "name": "John Doe",
    "course":"MCA",
    "deptName":"Dept of Computer Science",
    "email": "john.doe@example.com",
    "phoneNumber": "1234567890"
}
```

##### Update a student Details

To add a student, send a PUT request to `/students/:admissionNumber` with the following JSON data:

```
{
    "name": "John Doe",
    "course":"MCA",
    "deptName":"Dept of Computer Science",
    "mobileNo": "1234567890"
}
```

#### Delete a student

To delete a student, send a DELETE request to `/students/:admissionNumber`, where `:admissionNumber` is the admission number of the student to be deleted.

#### Search for a student by name

To search for a student by name, send a GET request to `/students/?name=:name`, where `:name` is the name of the student to be searched.

#### Search for a student by name

To search for a student by name, send a GET request to `/students?name=:name`, where `:name` is the name of the student to be searched.

#### Error handling

In case of any error, the API will return an appropriate HTTP status code along with a JSON response containing an error message.

#### Conclusion

This is a simple Student REST API that can be used to perform CRUD operations on student data. It can be extended further to include additional features as required.

**API LINK:** https://apis-student.onrender.com
