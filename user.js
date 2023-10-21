class User {
  // Constructor method to initialize user properties
  constructor(first_name, surname, username, date_of_birth, email, password, loginStatus, profilePic) {
    this.first_name = first_name;
    this.surname = surname;
    this.username = username;
    this.date_of_birth = date_of_birth;
    this.email = email;
    this.password = password;
    this.loginStatus = loginStatus;
    
    // Check if a profile picture is provided
    if(profilePic !== undefined || profilePic !== null) {
      this.profilePic = profilePic;
    } else {
      this.profilePic = undefined;
    }
  }
}

export default User;
  