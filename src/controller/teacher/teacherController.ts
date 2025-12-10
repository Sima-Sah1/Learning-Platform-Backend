import { Response } from "express";
import { IExtendedRequest } from "../../middleware/type";
import sequelize from "../../database/connection";
import { QueryTypes } from "sequelize";
import generateRandomPassword from "../../services/generateRandomPassword";



const createTeacher =  async(req:IExtendedRequest,res:Response)=>{
    // teacher ko k k data chayenxa tyo accept garna
    const instituteNumber = req.user?.currentInstituteNumber;
    const {teacherName,teacherEmail,teacherPhoneNumber,teacherExpertise,teacherSalary,teacherJoinedDate,courseId} = req.body
    const teacherPhoto = req.file ? req.file.path : "https://images3.alphacoders.com/606/606500.jpg"
    if(!teacherName || !teacherEmail || !teacherPhoneNumber || !teacherExpertise || !teacherSalary || !teacherJoinedDate){
        return res.status(400).json({
            message : "Please provide teacherName,teacherEmail,teacherPhoneNumber,teacherExpertise,teacherSalary,teacherJoinedDate"
        })
    }
    //password generate function
    const data = generateRandomPassword (teacherName)
    const insertedData = await sequelize.query(`INSERT INTO teacher_${instituteNumber}(teacherName,teacherEmail,teacherPhoneNumber,teacherExpertise,teacherSalary,teacherJoinedDate,teacherPhoto,teacherPassword) VALUES(?,?,?,?,?,?,?,?)`,{
        type : QueryTypes.INSERT,
        replacements : [teacherName,teacherEmail,teacherPhoneNumber,teacherExpertise,teacherSalary,teacherJoinedDate,teacherPhoto,data.hashedVersion]
    })
    
    const teacherData : {id:string}[] = await sequelize.query(`SELECT * FROM teacher_${instituteNumber}
        WHERE teacherEmail=?`,{
            type : QueryTypes.SELECT,
            replacements : [teacherEmail]
        })
    

    console.log(teacherData,"teacher data ")
    await sequelize.query(`UPDATE course_${instituteNumber} SET teacherId=? WHERE courseId=?`,{
        type : QueryTypes.UPDATE,
        replacements : [teacherData[0].id,courseId]
    })
    //send mail function goes here


    res.status(200).json({
        message : "teacher created"
    })
}
export {createTeacher}