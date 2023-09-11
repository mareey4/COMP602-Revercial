import { getDatabase, ref, set, onValue, remove } from 'firebase/database'
import { fbConfig } from './firebase';
import User from './user'

export function saveUserData(newUser) {
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

export function getUserViaEmail(userEmail) {
    const db = getDatabase(fbConfig);
    const refEmail = ref(db, 'Users');
    const sanitizedEmail = userEmail.replaceAll(".",",");
    let user;

    onValue(refEmail, (snapshot) => {
        const dataEmail = snapshot.val();

        for(const email in dataEmail){
            if(email === sanitizedEmail){
                const userData = dataEmail[email];

                user = new User(
                    userData.Name,
                    userData.Surname,
                    userData.Username,
                    userData.DOB,
                    email,
                    userData.Password
                );

                break;
            }
        }
    });

    return user;
}

export function getUserViaUsername(username) {
    const db = getDatabase(fbConfig);
    const reference = ref(db, 'Users');
    let user;

    onValue(reference, (snapshot) => {
        const dataUsername = snapshot.val();

        for(const email in dataUsername) {
            const userData = dataUsername[email];

            if(userData.Username === username) {
                user = new User(
                    userData.Name,
                    userData.Surname,
                    userData.Username,
                    userData.DOB,
                    email,
                    userData.Password
                );

                break;
            }
        }
    });

    return user;
}

export function deleteAccount(user) {
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

export function login(id, password) {
    let user;
    let validLogin = false;

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z.-]{2,}$/;

    if(emailRegex.test(id)) {
        user = getUserViaEmail(id);
    } else {
        user = getUserViaUsername(id);
    }

    // console.log(user);

    if(user !== undefined) {
        if(user.password === password) {
            validLogin = true;
        }
    }

    return validLogin;
}

export function getAllUsers() {
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

export function validateName(name) {
    const exp = /^[a-zA-Z-]$/;

    if(exp.test(name)) {
        return true;
    } else {
        return false;
    }
}

export function validateDOB(dob) {
    const dateArray = dob.split("-");
    const givenDOB = new Date(dateArray[0], (dateArray[1] - 1), dateArray[2]);
    const currentDate = new Date();
    let valid = false;
    console.log(currentDate);
    console.log(givenDOB);

    if(givenDOB.getFullYear <= currentDate.getFullYear) {
        console.log("Year checked");
        if(givenDOB.getMonth >= 0 && givenDOB <= 11) {
            console.log("Month checked");
            const months30Days = [3, 5, 8, 10];
            
            if(givenDOB.getMonth === 1) {
                if(!((year % 4 === 0) && (year % 100 !== 0) || (year % 400 === 0))) {
                    if(givenDOB.getDate >= 1 && givenDOB.getDate <= 28) {
                        console.log("Day checked");
                        valid = validateAge(givenDOB, currentDate);
                    } else {

                    }
                }
            } else if(months30Days.includes(givenDOB.getMonth)) {
                if(givenDOB.getDate >= 1 && givenDOB.getDate <= 30) {

                }
            } else {

            }
        }
    }

    return valid;
}

export function validateAge(givenDOB, currentDate) {
    if((currentDate.getFullYear - givenDOB.getFullYear) > 13) {
        return true;
    } else if ((currentDate.getFullYear - givenDOB.getFullYear) === 13) {
        if(currentDate.getMonth > givenDOB.getMonth) {
            return false;
        } else if(currentDate.getMonth === givenDOB.getMonth) {
            if(currentDate.getDate > givenDOB.getDate) {
                return false;
            } else if(currentDate.getDate === givenDOB.getDate) {
                return true;
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}
