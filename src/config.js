// local database url
export const databaseUrl = "http://localhost:8080";

export const formatPostDate = (postDate) => {
  const date = new Date(postDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;
  return dateFormatted;
};

export const profileAvatar = "https://gravatar.com/avatar/placeholder?s=128";
