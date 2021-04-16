import React, { useState, useEffect } from "react";
//import "./Like.css";
import { db } from "./firebase";
import Tooltip from "@material-ui/core//Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteTwoToneIcon from "@material-ui/icons/FavoriteTwoTone";
import firebase from "firebase";

function Like({ postId, user }) {
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
  }, []);

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
    <div className="Like">
      {user?.displayName ? (
        <Tooltip title={likeCount + " Like(s)"} arrow placement="right">
          {likes ? (
            <IconButton
              className="Like__unlikeButton"
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
              className="Like__likeButton"
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
  );
}

export default Like;
