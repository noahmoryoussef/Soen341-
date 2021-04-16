import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";
import Followers from "./Followers.js";
import Like from "./Like.js";
import "./Followers.css";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);

  const postRef = db.collection("posts").doc(postId);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = postRef
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    postRef.collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };

  return (
    <div className="Post">
      {/* header w/ avatar and Username*/}
      <div className="Post__header">
        <Avatar
          className="Post__avatar"
          alt=""
          src="/static/images/avatar/1.png"
        />
        <p>
          <strong>{username}</strong>
          {/* Get timestamp of each post*/}
          <span className="Post__timestamp"> Some Time Ago</span>
        </p>
      </div>
      {/* image */}
      <img className="Post__image" src={imageUrl} alt="Post Image" />
      {/* username and caption */}
      <h4 className="Post__text">
        <strong>{username}</strong> {caption}
      </h4>
      {/* Like Button */}
      <Like postId={postId} user={user} />

      {/* Comment Section */}
      <div className="Post__commentSection">
        {comments.map((comment) => (
          <p>
            {/* Get timestamp of each comment*/}
            <strong>{comment.username}</strong> {comment.text} <br />{" "}
            <span className="Post__timestamp"> Some Time Ago</span>
          </p>
        ))}
      </div>
      {/* Following Button */}
      <Followers
        //Current User
        user={user}
        //Username of Poster
        username={username}
      />
      {/* Comment Box */}
      <form className="Post__commentBox">
        <input
          className="Post__input"
          type="text"
          placeholder="Add a Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          className="Post__button"
          type="submit"
          disabled={!comment}
          onClick={postComment}
        >
          Post
        </button>
      </form>
    </div>
  );
}

export default Post;
