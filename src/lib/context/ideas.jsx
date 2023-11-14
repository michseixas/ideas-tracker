import { createContext, useContext, useEffect, useState } from "react";
import { databases } from "../appwrite";
import { ID, Query } from "appwrite"; // Imports 2 classes from Appwrite, ID will generate unique ID's, Query will retrieve documents from the database.

export const IDEAS_DATABASE_ID = "654eb3786e1981f4aead"; // Replace with your database ID
export const IDEAS_COLLECTION_ID = "ideas-tracker"; // Replace with your collection ID

const IdeasContext = createContext(); // creates a context called IdeasContext, to share data between components

export function useIdeas() {
     // useIdeas is a custom hook that is used to access the data stored in a IdeasContext
  return useContext(IdeasContext);
}

export function IdeasProvider(props) {
    //IdeasProvider is a function component used to provide data to components down the tree

  const [ideas, setIdeas] = useState([]);
  //here the 'ideas' state is created with an empty array as the 'ideas' value. 
  //'setIdeas' is in plural. Meaning that it will be a collection of ideas that will be pushed inside the array


  async function add(idea) {
    //this add function receives an idea as argument

    const response = await databases.createDocument(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      //here an unique ID for the idea is generated.
      ID.unique(),
      //here, the 'idea' is the text received as the argument of the add function
      idea
    );
    setIdeas((ideas) => [response.$id, ...ideas].slice(0, 10));
    //this calls the setIdeas function with the ideas that already exist as argument ('ideas')
    // creates a new array with the new ID on position 0, and then the other IDs that already exists,
    //up to 9 ideas (index 10). The slice method cuts the resulting array that exceed position index 10.
  }

  async function remove(id) {
    await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
    setIdeas((ideas) => ideas.filter((idea) => idea.$id !== id));
    // this function removes the item (idea) from the array based on an unique ID. 
    //to remove the idea from the array, a filter is implemented, in which all the ideas not equal to the 
    //ID that we want to delete are kept.
    await init(); // Refetch ideas to ensure we have 10 items
  }

  async function init() {
    //this function fetches the documents (ideas) existing in the database & collection, 
    //the order in which it's presented is descendant and limited to 10 documents.
    const response = await databases.listDocuments(
      IDEAS_DATABASE_ID,
      IDEAS_COLLECTION_ID,
      [Query.orderDesc("$createdAt"), Query.limit(10)]
    );
    setIdeas(response.documents);
    //puts the query response into the ideas state, thus updating the state
  }

  useEffect(() => {
    //this useEffect calls the init function. The empty dependency array [] means that this function is called only the first time 
    init();
  }, []);

  return (
    //the IdeasContext.Provider wraps a portion of the component tree, 
    //making the 'ideas' state and add & remove functions
    //available to all components that are descendants of this provider
    <IdeasContext.Provider value={{ current: ideas, add, remove }}>
      {props.children}
    </IdeasContext.Provider>
  );
}
