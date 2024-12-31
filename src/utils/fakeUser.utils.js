import {fakerES as faker} from "@faker-js/faker"
import  {isValidPassword, createHash, generateToken } from "./utils.js"

export const fakerUserGenerate = async () => {
    try {
        const user = {
            first_name: faker.person.firstName(),
            last_name: faker.person.lastName(),
            age: Math.floor(Math.random() * 10) + 30, 
            password: "coder123",
            role: "user"
        }
        const userMail ={...user, email: faker.internet.email({firstName: user.first_name, lastName:user.last_name})}

        return userMail

    } catch (error) {
        throw new Error(error);
    }
}



export const fakerPetGenerator = async (qty) => {
    try {
        let petlist = []
        for(let i = 0; i < qty; i++) {
            const pet = {
                name: faker.animal.petName(),
                type: faker.animal.type(),
                breed: faker.animal.cat(),
                age: Math.floor(Math.random() * 10) + 1,
            }
            petlist.push(pet)
        }
        return petlist
} catch (error) {
    throw new Error(error);
}
}


fakerPetGenerator()