import React from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";

function Post({ username, caption, imageUrl }) {
  return (
    <div className="post">
      {/* header w/ avatar and Username*/}
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Adam"
          src="/static/images/avatar/1.png"
        />
        <h3>{username}</h3>
      </div>
      {/* image */}
      <img className="post__image" src={imageUrl} alt="Post Image"/>
      {/* username and caption */}
      <h4 className="post__text">
        {" "}
        <strong>{username}</strong> {caption}
      </h4>
    </div>
  );
}

export default Post;
