import { NextFunction, Request, Response } from "express"
import sequelize from "../../database/connection"
import generateRandomInstituteNumber from "../../services/generateRandomInstituteNumber"
import { IExtendedRequest } from "../../middleware/type"
import User from "../../database/models/user.model"
import categorys from "../../seed"



//  1️⃣ Create Institute
const createInstitute = async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    //  destructure body fields
    const { instituteName, instituteEmail, institutePhoneNumber, instituteAddress } = req.body
    const instituteVatNo = req.body.instituteVatNo || null
    const institutePanNo = req.body.institutePanNo || null

    // 👇 validation: required fields missing bhaye 400 response pathaune
    if (!instituteName || !instituteEmail || !institutePhoneNumber || !instituteAddress) {
        res.status(400).json({
            message: "Please provide instituteName,instituteEmail,institutePhoneNumber,instituteAddress"
        })
        return
    }
    // aayo vane - institute create garnu paryo --> institute_123123,course_123123
    //institute (name)
    // 👇 generate random institute number
    const instituteNumber = generateRandomInstituteNumber()
    // 👇 create institute table dynamically
    await sequelize.query(`CREATE TABLE IF NOT EXISTS institute_${instituteNumber} (
            id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            instituteName VARCHAR(255) NOT NULL,
            instituteEmail VARCHAR (255) NOT NULL UNIQUE,
            institutePhoneNumber VARCHAR(255) NOT NULL UNIQUE,
            instituteAddress VARCHAR(255) NOT NULL,
            institutePanNo VARCHAR(255),
            instituteVatNo VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE
            CURRENT_TIMESTAMP)`)

    // 👇 insert institute data
    await sequelize.query(`INSERT INTO institute_${instituteNumber}(instituteName,instituteEmail,institutePhoneNumber,instituteAddress,institutePanNo,instituteVatNo) VALUES(?,?,?,?,?,?)`, {
        replacements: [instituteName, instituteEmail, institutePhoneNumber, instituteAddress, institutePanNo, instituteVatNo]
    })


    // to create user_institute history table jaha chai users le k k 
    // institute haru create garyo sabai ko number basnu paryo
    //👇 create user_institute table to track which user created which institute
    await sequelize.query(`CREATE TABLE IF NOT EXISTS user_institute(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        userid INT REFERENCES users(id),
        instituteNumber VARCHAR(255) UNIQUE
        )`)

    // 👇 if user logged in, save their current institute info
    if (req.user) {
        await sequelize.query(`INSERT INTO user_institute(userId,instituteNumber) VALUE(?,?)`, {
            replacements: [req.user.id, instituteNumber]
        })


        await User.update({
            currentInstituteNumber: instituteNumber,
            role: "institute"
        }, {
            where: {
                id: req.user.id
            }
        })
    }

    //   
    //req.user.instituteNumber = instituteName;

    //if (req.user){
    // req.user.currentInstituteNumber = instituteNumber
    // 👇 store instituteNumber in request for next middleware
    //req.instituteNumber = instituteNumber.toString() // important: used in teacher, student, course tables 🚩


    if(req.user){
        //@ts-ignore
        req.user.currentInstituteNumber = instituteNumber

    }
    next()

}


// Teacher Table

const createTeacherTable = async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS teacher_${instituteNumber}(
        id INT NOT NULL PRIMARY key AUTO_INCREMENT,
        teacherName VARCHAR(255) NOT NULL,
        teacherEmail VARCHAR(255) NOT NULL UNIQUE,
        teacherPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        teacherExpertise VARCHAR(255),
        joinedDate DATE,
        salary VARCHAR(100),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)
    next()

}

// Student table

const createStudentTable = async (req: IExtendedRequest, res: Response, next: NextFunction) => {
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS student_${instituteNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        studentName VARCHAR(255) NOT NULL,
        studentEmail VARCHAR(255) NOT NULL UNIQUE,
        studentPhoneNumber VARCHAR(255) NOT NULL UNIQUE,
        studentAddress TEXT,
        enrolledDate DATE,
        studentImage VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
    next()
}

const createCourseTable = async (req: IExtendedRequest, res: Response) => {
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS course_${instituteNumber}(
        id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        courseName varchar(255) NOT NULL UNIQUE,
        coursePrice VARCHAR(255) NOT NULL,
        courseDuration  VARCHAR(100) NOT NULL ,
        courseLevel ENUM('beginner','intermediate','advance') NOT NULL ,
        courseThumbnail VARCHAR(200),
        courseDescription TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`)
    // 👇 final response
    res.status(200).json({
        message: "Institute created vayoo!!",
        instituteNumber,
    })
}

const createCategoryTable = async(req:IExtendedRequest,res:Response,next:NextFunction)=>{
    const instituteNumber = req.user?.currentInstituteNumber
    await sequelize.query(`CREATE TABLE IF NOT EXISTS category_${instituteNumber}(
         id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
         categoryName VARCHAR(100) NOT NULL,
         categoryDescription TEXT,
         created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
         updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`)

    categorys.forEach(async function(category){
        await sequelize.query(`INSERT INTO category_${instituteNumber}(categoryName,
            categoryDescription) VALUES(?,?)`,{
                replacements : [category.categoryName,category.categoryDescription]
            })
    })
    next()
}

export { createInstitute, createTeacherTable, createStudentTable, createCourseTable, createCategoryTable }
