// import { publishQueue } from "../discoverService.js";
// import { createUser } from "../userModel.js"

// export const resolvers = {
//     Query:{

//     },
//     Mutation:{
//         createUser: async (_:any,args: any) => {
//             const { name, email, phone, address, password, role } = args;
//             const result = await createUser({id:0,name, email, phone, role,  password})

//             await publishQueue("address-queue", { address, id: result.id });

//             return {...result, address : address}
//         }
//     }
// }