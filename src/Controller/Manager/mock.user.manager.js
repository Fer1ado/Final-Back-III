import { userManager } from "./userManager.js"; 
import { fakerUserGenerate, fakerPetGenerator } from "../../utils/fakeUser.utils.js";


export const userAndPetMock = async (uq = 2, pq = 4) => {
    if (uq === NaN){
        return {Status: "failed", message: "necesitas definir valores en los atributos usersQuant: -int- y petsQuant: -int-"}
    }

    try {
        const users = []
        for (let i = 0; i < uq; i++) {
            const user = await fakerUserGenerate()
            const list = await fakerPetGenerator(pq)
            users.push({...user, pets: list})  
        }
        //console.log("🚀 ~ file: mock.user.manager.js:7 ~ createUsersMock ~ users:", users);
        return {status: "success", message:`se crearon ${users.length} usuarios con ${pq} mascotas cada uno`, payload: users}
    } catch (error) {
        throw new Error(error);
    }
}

