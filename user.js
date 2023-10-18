class User {
  constructor(first_name, surname, username, date_of_birth, email, password, loginStatus, profilePic, bio) {
    this.first_name = first_name;
    this.surname = surname;
    this.username = username;
    this.date_of_birth = date_of_birth;
    this.email = email;
    this.password = password;
    this.loginStatus = loginStatus;
    this.profilePic = profilePic;
    this.bio = bio;
  }
}

export default User;
