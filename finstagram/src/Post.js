import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase"

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
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
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
    setComment("");
  };

  return (
    <div className="Post">
      {/* header w/ avatar and Username*/}
      <div className="Post__header">
        <Avatar
          className="Post__avatar"
          alt="Adam"
          src="/static/images/avatar/1.png"
        />
        <h3>{username}</h3>
      </div>
      {/* image */}
      <img className="Post__image" src={imageUrl} alt="Post Image" />
      {/* username and caption */}
      <h4 className="Post__text">
        <strong>{username}</strong> {caption}
      </h4>
      {/* Comment Section */}
      <div className="Post__commentSection">
        {comments.map((comment) => (
          <p>
            <strong>{comment.username}</strong>
            {comment.text}
          </p>
        ))}
      </div>
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
