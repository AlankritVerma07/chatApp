const users = [];
//addUser,removeUser,getUser,getUserInRoom

const addUser = ({ id, name, room }) => {
  //Clean the data
  username = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  //Validate the data
  if (!username || !room) return { error: "username and room are required" };

  //check For Existing User
  const existingUser = users.find(
    (user) => user.room === room && user.username == username
  );

  //Validate username
  if (existingUser) return { error: "Username is in use!" };

  //Store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUserInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUserInRoom,
};
