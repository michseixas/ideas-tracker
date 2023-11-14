import { useState } from "react";
import { useUser } from "../lib/context/user";
import { useIdeas } from "../lib/context/ideas";

export function Home() {
  //here is the component Home, with 'user' and 'ideas' that come from context.
  const user = useUser();
  const ideas = useIdeas();

  //creates 2 useStates, one for the title, one for the description. 
  //Both have empty strings as initial state. 
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <>
      {/* Show the submit form to logged in users. */}
      {user.current ? (
        //if true, shows the submit form
        <section>
          <h2>Submit Idea</h2>
          <form>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
            <button
              type="button"
              onClick={() =>
                ideas.add({ userId: user.current.$id, title, description })
              }
            >
              Submit
            </button>
          </form>
        </section>
      ) : (
        // is false, invites to login
        <section>
          <p>Please login to submit an idea.</p>
        </section>
      )}
      <section>
        <h2>Latest Ideas</h2>
        <ul>
          {ideas.current.map((idea) => (
            //the map function produces an output with the following style for each element in the array:
            <li key={idea.$id}>
              <strong>{idea.title}</strong>
              <p>{idea.description}</p>
              {/* Show the remove button to idea owner. */}
              {user.current && user.current.$id === idea.userId && (
                //if the user is loggedin and the idea.userId matches the current user ID (meaning that this idea belongs to this user), 
                //the remove button is shown. 
                <button type="button" onClick={() => ideas.remove(idea.$id)}>
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
