import React, {useState, useEffect} from 'react';
import './App.css';
import logo__header from'./img/logo__header.png';
import Post from './Post';
import {db} from './firebase'

function App() {
  const [posts, setPosts] = useState([]);

    useEffect(()=>{
      db.collection('posts').onSnapshot(snapshot => {
        setPosts(snapshot.docs.map(doc =>({
          id: doc.id,
          post: doc.data()
        })));
      })
    }, []);
  return (
    <div className="App">
      <div className="App__header">
        <img className="App__headerImage" src={logo__header} alt="Header Logo"></img>
        </div>
    {
      posts.map(({id, post}) =>(
        <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
      ))
    }
    </div>
  );
}

export default App;
