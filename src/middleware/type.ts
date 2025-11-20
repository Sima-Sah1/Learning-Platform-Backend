import { Request } from "express";

//👇 Extending Express Request to add custom properties (like user, instituteNumber)
export interface IExtendedRequest extends Request {

    // 👇 user object — yo chai jaba user login bhayeko xa, tyo user ko info store garxa
    user?: {
       id: string; // user ko unique id
    //email: string; // user ko email
    //role: string; // user ko role (admin, institute, student etc.)

    //instituteNumber?: string; 

    //  yo chai user object bhitra huney instituteNumber ho (req.user?.instituteNumber)
    // jaba user sanga already institute number assigned xa, tyo store garni
  
    //currentInstituteNumber?: string | number; 

    //  user le recent ma jastai kun institute ma kam gardai xa tyo number store garni
    // for example: user ko multiple institute huncha bhane current one lai track garni
  currentInstituteNumber: string
  };

  //instituteNumber?: string; 

  //  yo chai req object ma direct rakhera use garni (req.instituteNumber)
  // jaba new institute create gardai chau ra tyo number next function ma pathauna parcha
  
}