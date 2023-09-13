import { getDatabase, ref, set, onValue, remove } from 'firebase/database'
import { fbConfig } from './firebase';
import User from './user'

export async function saveUserData(newUser) {
    const db = getDatabase(fbConfig);
    const sanitizedEmail = newUser.email.replaceAll(".",",");
    const referenceEmail = ref(db, 'Users/' + sanitizedEmail);

    set(referenceEmail, {
        Name: newUser.first_name,
        Surname: newUser.surname,
        DOB: newUser.date_of_birth,
        Username: newUser.username,
        Password: newUser.password
    });
}

export async function getUserViaEmail(userEmail) {
    const db = getDatabase(fbConfig);
    const refEmail = ref(db, 'Users');
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
                        userData.Password
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
    const reference = ref(db, 'Users');

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
                        userData.Password
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
    const refUsers = ref(db, 'Users');

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
    let validLogin = false;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

    if(emailRegex.test(id)) {
        const user = await getUserViaEmail(id);

        if(user !== undefined && user.password === password) {
            validLogin = true;
        }
    } else {
        const user = await getUserViaUsername(id);

        if(user !== undefined && user.password === password) {
            validLogin = true;
        }
    }

    return validLogin;
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
                userData.Password
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
                        if(!(charsAndSpaces.test(password))) {
                            validPassword = true;
                        }
                    }
                }
            }
        }

        resolve(validPassword);
        return;
    });
}