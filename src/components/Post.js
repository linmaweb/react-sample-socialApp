import React from "react";
import { Link } from "react-router-dom";
import { formatPostDate } from "../config";

const Post = ({ post, onClick, noAuthor }) => {
  return (
    <Link
      onClick={onClick}
      to={`/post/${post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img
        className="avatar-tiny"
        src={post.author.avatar}
        alt={post.author.username}
      />
      <strong>{post.title}</strong>
      <span className="text-muted small">
        {!noAuthor && <> by {post.author.username} </>}
        {` on ${formatPostDate(post.createdDate)}`}
      </span>
    </Link>
  );
};

export default Post;
