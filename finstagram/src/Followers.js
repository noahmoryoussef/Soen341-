import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import firebase from "firebase";
import { db } from "./firebase";
import "./Followers.css";

function Followers({ user, username }) {
  const [following, setFollowing] = useState([]);

  var followTarget 
  if (user !== null) {
	followTarget= db.collection("followers").doc(user.displayName).collection("userFollowing").doc(username);
  }

  const followUser = (event) => {
    event.preventDefault();
    followTarget.set({
	Username: username
	});
	alert("You are now following " + username);
  };

  const unfollowUser = (event) => {
    event.preventDefault();
    followTarget.delete();
	alert("You have stopped following " + username);
  };

  function isFollowing () {
   if (user !== null) {
   	followTarget.get().then((doc) => {
	 if (doc.exists) {
	     return true;
		} 
		
		else {
		   return false;
		}

	 }).catch((error) => {
		console.log("Error getting followed user:", error);
	});
   }
  }

  var buttonText;

  if (user == null || user.displayName == username)
	return (
		<div className="Follow__button">
		</div>
	);

  else if (!isFollowing() && (user.displayName !== username))
	  return (
		<div className="Follow__button">
			<Button onClick={followUser}>Follow User</Button>
		</div>
	  );
  else if (user.displayName !== username)
	 return (
	 	<div className="Follow__button">
			<Button onClick={unfollowUser}>Unfollow User</Button>
		</div>
	 );
  else
	return (
		<div className="Follow__button">
		</div>
	);
}

export default Followers;
