class Events {
  constructor(date, description, location, ticketID, eventType = "", username ="", joinedUsers = []) {
    this.date = date;
    this.description = description;
    this.location = location;
    this.ticketID = ticketID;
    this.eventType = eventType;
    this.username = username;
    this.joinedUsers = joinedUsers;
  }
}

export default Events;
