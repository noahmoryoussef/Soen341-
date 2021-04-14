import React, { useState, useEffect } from "react";
import "./Post.css";
import { db } from "./firebase";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core//Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import firebase from "firebase";
import Followers from "./Followers.js";
import "./Followers.css";

function Post({ postId, user, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState([]);
  const [hover, setHover] = useState(false);
  const [likes, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const postRef = db.collection("posts").doc(postId);
  const likeRef = postRef.collection("likes");

  const likeRes = !user?.displayName
    ? "Does Not Exist"
    : likeRef.where("username", "==", user.displayName).get();

  const like = (event) => {
    likeRef.add({
      username: user.displayName,
    });
    postRef.update({ likeCount: firebase.firestore.FieldValue.increment(1) });
    setLike(true);
  };

  const unlike = (event) => {
    likeRes.then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    postRef.update({ likeCount: firebase.firestore.FieldValue.increment(-1) });
    setLike(false);
  };

  useEffect(() => {
    if (likeRes !== "Does Not Exist") {
      likeRes.then((snapshot) => {
        if (snapshot.docs.length == 1 || likes) {
          setLike(true);
        } else {
          setLike(false);
        }
      });
    }
    updateLikeCount();
  },[]);

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

  const updateLikeCount = () => {
    postRef.get().then((snapshot) => {
      if (snapshot.exists) {
        postRef.onSnapshot((doc) => {
          if (doc.data()["likeCount"] > 0) {
            setLikeCount(doc.data()["likeCount"]);
          } else {
            setLikeCount(0);
          }
        });
      } else {
        setLikeCount(0);
      }
    });
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
      <div className="Post__like">
        {user?.displayName ? (
          <Tooltip title={likeCount + " Like(s)"} arrow placement="right">
            {likes ? (
              <IconButton
                className="Post__unlikeButton"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={unlike}
              >
                {hover ? (
                  <FavoriteTwoToneIcon
                    style={{ color: "lightblue" }}
                  ></FavoriteTwoToneIcon>
                ) : (
                  <FavoriteIcon style={{ color: "Crimson" }}></FavoriteIcon>
                )}
              </IconButton>
            ) : (
              <IconButton
                className="Post__likeButton"
                onMouseOver={() => setHover(true)}
                onMouseOut={() => setHover(false)}
                onClick={like}
              >
                {hover ? (
                  <FavoriteTwoToneIcon
                    style={{ color: "pink" }}
                  ></FavoriteTwoToneIcon>
                ) : (
                  <FavoriteBorderIcon
                    style={{ color: "Black" }}
                  ></FavoriteBorderIcon>
                )}
              </IconButton>
            )}
          </Tooltip>
        ) : (
          <Tooltip title={likeCount + " Like(s)"} arrow placement="right">
            <FavoriteTwoToneIcon
              style={{ color: "lightgrey" }}
            ></FavoriteTwoToneIcon>
          </Tooltip>
        )}
      </div>

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
