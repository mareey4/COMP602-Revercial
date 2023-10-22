// Imports
import { getDatabase, ref as databaseRef, get, set, onValue, remove } from 'firebase/database';
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { fbConfig } from './firebase';
import User from '../Components/user';
import FriendRequest from '../Components/friendRequest';
import { generateTicketID } from './TicketGenerator';

// Saves the user data to the database
export async function saveUserData(newUser) {
    const db = getDatabase(fbConfig);
    const sanitizedEmail = newUser.email.replaceAll(".",",");
    const referenceEmail = databaseRef(db, 'Users/' + sanitizedEmail);

    set(referenceEmail, {
        Name: newUser.first_name,
        Surname: newUser.surname,
        DOB: newUser.date_of_birth,
        Username: newUser.username,
        Password: newUser.password,
        Login_Status: newUser.loginStatus,
        Profile_Pic: newUser.profilePic,
        Bio: newUser.bio
    });

    await createFriendsList(sanitizedEmail);
    await createInbox(sanitizedEmail);
}

async function createFriendsList(email) {
    const db = getDatabase(fbConfig);
    let sanitizedEmail;

    if(email.includes(".")) {
        sanitizedEmail = email.replaceAll(".", ",");
    } else {
        sanitizedEmail = email;
    }

    const refFriends = databaseRef(db, 'Friends/' + sanitizedEmail);

    set(refFriends, {
        Holder: "Do not remove"
    });
}

async function createInbox(email) {
    const db = getDatabase(fbConfig);
    let sanitizedEmail;

    if(email.includes(".")) {
        sanitizedEmail = email.replaceAll(".", ",");
    } else {
        sanitizedEmail = email;
    }

    const refInbox = databaseRef(db, 'Inbox/' + sanitizedEmail);

    set(refInbox, {
        Holder: "Do not remove"
    });

    const refFriendRequests = databaseRef(db, 'Inbox/' + sanitizedEmail + "/Friend_Requests");

    set(refFriendRequests, {
        Holder: "Do not remove"
    });
}

// Save query data to the database
export async function saveSupportInfo(query) {
    const db = getDatabase(fbConfig);
    const refSupport = databaseRef(db, 'Support/' + query.subject + '/' + query.ticketID);

    set(refSupport, {
        Email: query.email,
        Subject: query.subject,
        Description: query.description,
        Files: query.fileNames
    });
}

// Saves query attachments to storage
export async function saveSupportAttachments(subject, ticketID, file) {
    const storage = getStorage(fbConfig);
    const refSupport = storageRef(storage, 'Support/' + subject + '/' + ticketID + '/' + file.name);

    await uploadBytes(refSupport, file);
}

// Sets the profile picture for the given user email in storage
export async function setProfilePic(email, file) {
    const storage = getStorage(fbConfig);
    const refUser = storageRef(storage, 'Users/' + email + '/' + 'ProfilePic/' + file.name);

    await uploadBytes(refUser, file);
}

// Gets the profile picture for the given user from storage
export async function getProfilePic(email, filename) {
    const storage = getStorage(fbConfig);
    let sanitizedEmail;
    let sanitizedFileName;

    if(email.includes(".")) {
        sanitizedEmail = email.replaceAll(".", ",");
    } else {
        sanitizedEmail = email;
    }

    if(filename.includes(",")) {
        sanitizedFileName = filename.replaceAll(",", ".");
    } else {
        sanitizedFileName = filename;
    }

    let refUser;

    // Checks if user has a uploaded profile picture, otherwise loads the default picture
    if(filename === "Null") {
        refUser = storageRef(storage, 'Defaults/Default-PFP.jpg');
    } else {
        refUser = storageRef(storage, 'Users/' + sanitizedEmail + '/ProfilePic/' + sanitizedFileName);
    }
    
    return new Promise(async (resolve) => {
        try {
            const downloadURL = await getDownloadURL(refUser);
            resolve(downloadURL);
            return;
        } catch {
            console.error("An error occurred whilst retrieving profile picture.");
            resolve(undefined);
            return;
        }
    });
}

// Gets the profile pictures for the filtered users from storage
export async function getFilteredUsersPFP(filtered) {
    const pfpURLS = [];

    return new Promise(async (resolve) => {
        for (const user of filtered) {
            const url = await getProfilePic(user.email, user.profilePic);
            pfpURLS.push(url);
        }

        resolve(pfpURLS);
        return;
    });
}

// Gets the user via a given email address
export async function getUserViaEmail(userEmail) {
    const db = getDatabase(fbConfig);
    const refEmail = databaseRef(db, 'Users');
    const sanitizedEmail = userEmail.replaceAll(".",",");
    
    return new Promise((resolve) => {
        onValue(refEmail, (snapshot) => {
            const dataEmail = snapshot.val();

            for(const email in dataEmail){
                if(email === sanitizedEmail){
                    const userData = dataEmail[email];

                    const user = new User(
                        userData.Name,
                        userData.Surname,
                        userData.Username,
                        userData.DOB,
                        email,
                        userData.Password,
                        userData.Login_Status,
                        userData.Profile_Pic,
                        userData.Bio
                    );

                    resolve(user);
                    return;
                }
            }

            // Returns undefined if no user is found with the given email
            resolve(undefined);
            return;
        });
    });
}

// Gets the user via a given username
export async function getUserViaUsername(username) {
    const db = getDatabase(fbConfig);
    const reference = databaseRef(db, 'Users');

    return new Promise((resolve) => {
        onValue(reference, (snapshot) => {
            const dataUsername = snapshot.val();

            for(const email in dataUsername) {
                const userData = dataUsername[email];

                if(userData.Username === username) {
                    const user = new User(
                        userData.Name,
                        userData.Surname,
                        userData.Username,
                        userData.DOB,
                        email,
                        userData.Password,
                        userData.Login_Status,
                        userData.Profile_Pic,
                        userData.Bio
                    );

                    resolve(user);
                    return;
                }
            }

            // Returns undefined if no user is found with the given username
            resolve(undefined);
            return;
        });
    });
}

// Deletes a user from the database
export async function deleteAccount(user) {
    const db = getDatabase(fbConfig);
    const refUsers = databaseRef(db, 'Users');

    onValue(refUsers, (snapshot) => {
        const users = snapshot.val();

        for(const email in users) {
            if(email === user.email) {
                remove(databaseRef(db, 'Users/' + email));
            }
        }
    });
}

// Logs in the user via the given ID and password
export async function login(id, password) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;
    let user;

    return new Promise(async (resolve) => {
        // Checks if given ID is a username or email
        if(emailRegex.test(id)) {
            user = await getUserViaEmail(id);
    
            if(user !== undefined && user.password === password) {
                // Sets status to true if given password matches saved password
                user.loginStatus = true;
            }
        } else {
            user = await getUserViaUsername(id);
    
            if(user !== undefined && user.password === password) {
                // Sets status to true if given password matches saved password
                user.loginStatus = true;
            }
        }

        resolve(user);
        return;
    });
}

// Sends a friend request to a user's inbox
// Saves a friend request message in the target recipent's inbox in the database
async function sendFriendRequest(recipient, sender) {
    const db = getDatabase(fbConfig);
    let sanitizedRecipient;
    let sanitizedSender;

    if(recipient.email.includes(".")) {
        sanitizedRecipient = recipient.email.replaceAll(".",",");
    } else {
        sanitizedRecipient = recipient.email;
    }
    
    if(sender.email.includes(".")) {
        sanitizedSender = emailSender.email.replaceAll(".",",");
    } else {
        sanitizedSender = sender.email;
    }

    const refFriendRequests = databaseRef(db, 'Inbox/' + sanitizedRecipient + '/Friend_Requests/' + sanitizedSender);
    const currentDate = new Date();
    const currentDateString = currentDate.getDate() + "-" + currentDate.getMonth() + "-" + currentDate.getFullYear();
    const requestMsg = sender.username + " would like to add you as a friend.";
    let addStatus = -1;

    set(refFriendRequests, {
        Message: requestMsg,
        Status: addStatus,
        Date: currentDateString
    });
}

// Gets all friend requests from the users inbox in the database
// Returns a data structure containing all friend requests to the function caller
export async function getFriendRequests(email) {
    const db = getDatabase(fbConfig);
    const sanitizedEmail = email.replaceAll(".",",");
    const refFriendRequests = databaseRef(db, 'Users/' + sanitizedEmail + '/Inbox/Friend_Requests');
    const requestInbox = [];

    return new Promise((resolve) => {
        onValue(refFriendRequests, (snapshot) => {
            const requests = snapshot.val();
            
            for(const emails in requests) {
                const requestData = requests[emails];
                const date = new Date(requestData.Date);

                const request = new FriendRequest(
                    requestData.Message,
                    requestData.Status,
                    date
                );

                requestInbox.push(request);
            }
        });

        resolve(requestInbox);
        return;
    });
}

// Gets all direct messages from the users inbox in the database
// Returns a data structure containing all the direct messages to the function caller
export async function getDM(email) {
    const sanitizedEmail = email.replaceAll(".",",");
    const db = getDatabase(fbConfig);

    let directMsgs = [];

    return new Promise((resolve) => {


        resolve(directMsgs);
        return;
    });
}

// Gets all system messages from the users inbox in the database
// Returns a data structure containing all the system messages to the function caller
export async function getSystemMsg(email) {
    const sanitizedEmail = email.replaceAll(".",",");
    const db = getDatabase(fbConfig);

    let sysMessages = [];

    return new Promise((resolve) => {


        resolve(sysMessages);
        return;
    });
}

// Gets all the messages from the users inbox in the database and orders them by date
// Returns a data structure containing all the messages
export async function getInbox(email) {
    const db = getDatabase(fbConfig);
    const refUsers = databaseRef(db, 'Users');
    
    let messages = [];
    let friendRequests = getFriendRequests(email);
    let directMsgs = getDM(email);
    let sysMessages = getSystemMsg(email);
    let maxSize;
    
}

// Gets all the users from the database as user objects
export async function getAllUsers() {
    const db = getDatabase(fbConfig);
    const refUsers = databaseRef(db, 'Users');
    const users = [];

    return new Promise((resolve) => {
        onValue(refUsers, (snapshot) => {
            const data = snapshot.val();
    
            for(const email in data){
                const userData = data[email];
    
                const user = new User(
                    userData.Name,
                    userData.Surname,
                    userData.Username,
                    userData.DOB,
                    email,
                    userData.Password,
                    userData.Login_Status,
                    userData.Profile_Pic,
                    userData.Bio
                );
    
                users.push(user);
            }
        });
    
        resolve(users);
        return;
    });
}

// Gets the user's friends list from the database
export async function getFriendsList(email) {
    const db = getDatabase(fbConfig);
    let sanitizedEmail = "";

    if (email.includes(".")) {
        sanitizedEmail = email.replaceAll(".", ",");
    } else {
        sanitizedEmail = email;
    }

    const refFriends = databaseRef(db, 'Friends/' + sanitizedEmail);
    const friends = [];

    return new Promise((resolve) => {
        onValue(refFriends, async (snapshot) => {
            const data = snapshot.val();
    
            for (let ids in data) {
                if (ids !== "Holder") {
                    const refUser = databaseRef(db, 'Friends/' + sanitizedEmail + '/' + ids);

                    onValue(refUser, async (snapshot) => {
                        const userData = snapshot.val();
                        const username = userData.Username;
                        const user = await getUserViaUsername(username);

                        friends.push(user);
                    });
                }
            }
        });
        
        resolve(friends);
        return;
    });
}

export async function checkFriends(currentEmail, targetEmail) {
    const friends = await getFriendsList(currentEmail);
    let sanitizedTarget = "";

    if (targetEmail.includes(".")) {
        sanitizedTarget = targetEmail.replaceAll(".", ",");
    } else {
        sanitizedTarget = targetEmail;
    }

    return new Promise((resolve) => {
        for (const user of friends) {
            if (user.email === sanitizedTarget) {
                resolve(true);
                return;
            }
        }

        resolve(false);
        return;
    });
}

// Adds the target user to the current user's friends list
export async function addFriend(currentUser, targetUser) {
    const db = getDatabase(fbConfig);
    let sanitizedCurrentEmail;
    const username = targetUser.username;

    if (currentUser.email.includes(".")) {
        sanitizedCurrentEmail = currentUser.email.replaceAll(".", ",");
    } else {
        sanitizedCurrentEmail = currentUser.email;
    }

    await sendFriendRequest(targetUser, currentUser);
    const randTicket = await generateTicketID("Profile");
    const refFriends = databaseRef(db, 'Friends/' + sanitizedCurrentEmail + "/" + randTicket);

    return new Promise(() => {
        set(refFriends, {
            Username: username
        });

        return;
    });
}

// Removes the target user from the current user's friends list
export async function removeFriend(currentUser, targetUser) {
    const db = getDatabase(fbConfig);
    let sanitizedCurrentEmail;

    if (currentUser.email.includes(".")) {
        sanitizedCurrentEmail = currentUser.email.replaceAll(".", ",");
    } else {
        sanitizedCurrentEmail = currentUser.email;
    }

    const refFriends = databaseRef(db, 'Friends/' + sanitizedCurrentEmail);

    return new Promise(() => {
        onValue(refFriends, async (snapshot) => {
            const data = snapshot.val();
    
            for(const ticket in data) {
                if(ticket !== "Holder") {
                    const ticketData = data[ticket];
                    const username = ticketData.Username;
                    
                    if(targetUser.username === username) {
                        remove(databaseRef(db, 'Friends/' + sanitizedCurrentEmail + "/" + ticket));
                        break;
                    }
                }
            }
        });

        return;
    });
}

// Validates the given name for invalid characters
export async function validateName(name) {
    const nameRegex = /^[a-zA-Z\s-]+$/;
    let valid = false;

    return new Promise((resolve) => {
        if(nameRegex.test(name)) {
            valid = true;
            resolve(valid);
            return;
        } else {
            resolve(valid);
            return;
        }
    });
}

// Validates the Date of Birth for valid values
export async function validateDOB(dob) {
    const dateArray = dob.split("-");
    const givenDOB = new Date(dateArray[0], (dateArray[1] - 1), dateArray[2]);
    const currentDate = new Date();
    let validDOB = false;
    let validYear = false;
    let validMonth = false;
    let validDay = false;

    return new Promise(async (resolve) => {
        if(givenDOB.getFullYear() <= currentDate.getFullYear()) {
            validYear = true;
        }
    
        if(validYear) {
            if(givenDOB.getFullYear() === currentDate.getFullYear()) {
                if(givenDOB.getMonth() >= 0 && givenDOB.getMonth() <= currentDate.getMonth()) {
                    validMonth = true;
                }
            } else {
                if(givenDOB.getMonth() >= 0 && givenDOB.getMonth() <= 11) {
                    validMonth = true;
                }
            }
        }
    
        if(validYear && validMonth) {
            const months30Days = [3, 5, 8, 10];
    
            if(givenDOB.getMonth() === 1) {
                if(!((givenDOB.getFullYear() % 4 === 0) && (givenDOB.getFullYear() % 100 !== 0) || 
                    (givenDOB.getFullYear() % 400 === 0))) {
                    if(givenDOB.getDate() >= 1 && givenDOB.getDate() <= 28) {
                        validDay = true;
                    }
                } else {
                    if(givenDOB.getDate() >= 1 && givenDOB.getDate() <= 29) {
                        validDay = true;
                    }
                }
            } else if(months30Days.includes(givenDOB.getMonth())) {
                if(givenDOB.getDate() >= 1 && givenDOB.getDate() <= 30) {
                    validDay = true;
                }
            } else {
                if(givenDOB.getDate() >= 1 && givenDOB.getDate() <= 31) {
                    validDay = true;
                }
            }
        }
    
        if(validDay && validMonth && validYear) {
            validDOB = await validateAge(givenDOB, currentDate);
        }
    
        resolve(validDOB);
        return;
    });
}

// Validates age based on given values
export async function validateAge(givenDOB, currentDate) {
    let validAge = false;

    return new Promise((resolve) => {
        if((currentDate.getFullYear() - givenDOB.getFullYear()) >= 13) {
            if((currentDate.getFullYear() - givenDOB.getFullYear()) === 13) {
                if(currentDate.getMonth() === givenDOB.getMonth()) {
                    if(currentDate.getDate() <= givenDOB.getDate()) {
                        validAge = true;
                    }
                }
            } else {
                validAge = true;
            }
        }

        resolve(validAge);
        return;
    });
}

// Validates given email for valid format and characters
export async function validateEmail(email) {
    let validEmail = false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

    return new Promise((resolve) => {
        if(emailRegex.test(email)) {
            validEmail = true;
        }

        resolve(validEmail);
        return;
    });
}


// Validates given username for valid format and characters
export async function validateUsername(username) {
    let validUsername = false;
    const usernameRegex = /^[a-zA-Z0-9_]*$/;

    return new Promise((resolve) => {
        if(username.length >= 4 && username.length <= 20) {
            if(usernameRegex.test(username)) {
                validUsername = true;
            }
        }

        resolve(validUsername);
        return;
    });
}

// Validates given password for valid format and characters
export async function validatePassword(password) {
    let validPassword = false;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const digit = /[0-9]/;

    return new Promise((resolve) => {
        if(password.length >= 8) {
            if(uppercase.test(password)) {
                if(lowercase.test(password)) {
                    if(digit.test(password)) {
                        validPassword = true;
                    }
                }
            }
        }

        resolve(validPassword);
        return;
    });
}


export function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
  
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
  
    return `${year}-${month}-${day}`;
}

export function isValidDate(dateString) {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    return selectedDate >= currentDate;
}
  
export function validateAddress(address) {
    const addressRegex = /^[a-zA-Z0-9\s,-]+$/;
    return addressRegex.test(address);
}
  
export async function validateDescription(description) {
    return description.length <= 500;
}

export function isFutureDate(dateString) {
    const selectedDate = new Date(dateString);
    const currentDate = new Date();
    console.log("Selected Date:", selectedDate);
    console.log("Current Date:", currentDate);
    return selectedDate >= currentDate;
}
