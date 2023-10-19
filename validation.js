import { getDatabase, ref, ref as databaseRef, get, set, onValue, remove, child, update } from 'firebase/database';
import { getStorage, uploadBytes, getDownloadURL, ref as storageRef } from 'firebase/storage';
import { fbConfig } from './firebase';
import User from './user';

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
}

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

export async function saveSupportAttachments(subject, ticketID, file) {
    const storage = getStorage(fbConfig);
    const refSupport = storageRef(storage, 'Support/' + subject + '/' + ticketID + '/' + file.name);

    await uploadBytes(refSupport, file);
}

export async function checkExistingTicketID(ticketID) {
    const db = getDatabase(fbConfig);
    const topicOptions = [
        'Account Issues',
        'Privacy and Security',
        'Content Management',
        'Technical Problems',
        'Messaging and Communication',
        'Feedback and Suggestions',
        'Report Technical Glitches',
        'Other'
    ];

    const promises = topicOptions.map(async (topicOptions) => {
        const refSubject = databaseRef(db, 'Support/' + topicOptions);
        const refTicket = child(refSubject, ticketID);
        const snapshot = await get(refTicket);
        return snapshot.exists();
    });

    const result = await Promise.all(promises);
    const validID = result.some((exists) => exists);

    return validID;
}

export async function setProfilePic(user, file) {
    const storage = getStorage(fbConfig);
    let sanitizedEmail;
    if(user.email.includes(".")) {
        sanitizedEmail = user.email.replaceAll(".",",");
    } else {
        sanitizedEmail = user.email;
    }
    const refUser = storageRef(storage, 'Users/' + sanitizedEmail + '/' + 'ProfilePic/' + file.name);

    await uploadBytes(refUser, file);

    let sanitizedPFP;

    if(file.name.includes(".")) {
        sanitizedPFP = file.name.replaceAll(".",",");
    } else {
        sanitizedPFP = file.name;
    }

    user.profilePic = sanitizedPFP;

    await saveUserData(user);
}

export async function getProfilePic(email, filename) {
    const storage = getStorage(fbConfig);
    let refUser;
    let sanitizedEmail;
    let sanitizedPFPName;

    if(email.includes(".")) {
        sanitizedEmail =  email.replaceAll(".",",");
    } else {
        sanitizedEmail = email;
    }

    if(filename.includes(",")) {
        sanitizedPFPName = filename.replaceAll(",",".");
    } else {
        sanitizedPFPName = filename;
    }

    if(filename === "Null") {
        refUser = storageRef(storage, 'Defaults/Default-PFP.jpg');
    } else {
        refUser = storageRef(storage, 'Users/' + sanitizedEmail + '/ProfilePic/' + sanitizedPFPName);
    }
    
    return new Promise((resolve) => {
        try {
            const downloadURL = getDownloadURL(refUser);
            resolve(downloadURL);
            return;
        } catch {
            console.error("An error occurred whilst retrieving profile picture.");
            resolve(undefined);
            return;
        }
    });
}

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

            resolve(undefined);
            return;
        });
    });
}

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

            resolve(undefined);
            return;
        });
    });
}


export async function deleteAccount(user) {
    const db = getDatabase(fbConfig);
    const refUsers = databaseRef(db, 'Users');

    onValue(refUsers, (snapshot) => {
        const users = snapshot.val();

        for(const email in users) {
            if(email === user.email) {
                remove(ref(db, 'Users/' + email));
            }
        }
    });
}

export async function login(id, password) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;
    let user;

    return new Promise(async (resolve) => {
        if(emailRegex.test(id)) {
            user = await getUserViaEmail(id);
    
            if(user !== undefined && user.password === password) {
                user.loginStatus = true;
            }
        } else {
            user = await getUserViaUsername(id);
    
            if(user !== undefined && user.password === password) {
                user.loginStatus = true;
            }
        }

        resolve(user);
        return;
    });
}

export async function getAllUsers() {
    const db = getDatabase(fbConfig);
    const refUsers = ref(db, 'Users');
    const users = [];

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

    return users;
}

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

export async function validatePassword(password) {
    let validPassword = false;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const digit = /[0-9]/;
    const charsAndSpaces = /[^A-Za-z0-9]/;

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
  
  export function validateDescription(description) {
    return description.length <= 100;
  }

  export async function saveUserBio(email, bio) {
    const db = getDatabase(fbConfig);
    const sanitizedEmail = email.replaceAll(".",",");
    const userRef = ref(db, 'Users/' + sanitizedEmail); // Replace 'Users' with your actual user data path
  
    try {
      await update(userRef, {
        Bio: bio
      });
      console.log('Bio saved successfully');
    } catch (error) {
      console.error('Error saving bio:', error);
      throw error; // You can handle or propagate the error as needed
    }
  }
