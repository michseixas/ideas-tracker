

import { Client, Databases, Account } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("654e94eff28be8903f86"); 

export const account = new Account(client);
export const databases = new Databases(client);
