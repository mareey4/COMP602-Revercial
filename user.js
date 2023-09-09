class User {
    constructor(first_name, surname, username, date_of_birth, email, password) {
      this.first_name = first_name;
      this.surname = surname;
      this.username = username;
      this.date_of_birth = date_of_birth;
      this.email = email;
      this.password = password;
    }
  }
  
  // Example usage:
  const user = new User(
    "John",
    "Doe",
    "johndoe",
    new Date("1990-01-01"),
    "john@example.com",
    "password123"
  );
  