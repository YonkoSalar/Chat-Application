const users = [];

const addUser = ({id, name, room}) => {
    // Make username into one string with no spaces
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    //checks if anyone has the name
    const existingUser = users.find((user) => user.room === room  && user.name === name);

    if(existingUser){
        return { error: 'Username is taken'};
    }

    //Adds a new user to the room
    const user = {id, name, room}

    users.push(user);

    return {user};
}


const removeUser = (id) =>{
    //Find the id of the user
    const index = users.findIndex((user) => user.id === id);

    if(index !== -1){
        return users.splice(index, 1)[0];
    }
}


const getUser = (id) => users.find((users) => users.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room); 

module.exports = { addUser, removeUser, getUser, getUsersInRoom};