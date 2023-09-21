class User {
  constructor(first_name, surname, username, date_of_birth, email, password, loginStatus, profilePic) {
    this.first_name = first_name;
    this.surname = surname;
    this.username = username;
    this.date_of_birth = date_of_birth;
    this.email = email;
    this.password = password;
    this.loginStatus = loginStatus;
    if(profilePic !== undefined || profilePic !== null) {
      this.profilePic = profilePic;
    } else {
      this.profilePic = undefined;
    }
  }
}

export default User;
  
