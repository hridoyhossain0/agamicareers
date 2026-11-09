import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db('agamicareers-data');

export const auth = betterAuth({
    
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            role: {
                type: ["seeker", "recruiter", "admin" ],
                input: true,
                defaultValue: 'seeker',
            },
        },
    },
    database: mongodbAdapter(db, {
        client,
    }),
});