import {Table,Column,Model,DataType,PrimaryKey} from "sequelize-typescript"  
 
@Table({
    tableName : 'users', // uta gui ma dekiney name vayo(phpmyadmin ma )
    modelName : 'User', // project vitra mathi ko table lai access garne name
    timestamps : true
})

//modelname ja xa tahi name ko class banau na 
class User extends Model{

    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue : DataType.UUIDV4
    })
    declare id : string 

    @Column({
        type : DataType.STRING
    })
    declare username : string

    @Column({
        type : DataType.STRING
    })
    declare password : string

    @Column({
        type : DataType.STRING
    })
    declare  email : string

    @Column({
        type : DataType.ENUM('super-admin','institute','teacher','student'),
        defaultValue : 'student'
    })
    declare role:string

}

export default User
