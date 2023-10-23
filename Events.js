class Events {
  constructor(date, description, location, ticketID, eventType = "", username ="") {
    this.date = date;
    this.description = description;
    this.location = location;
    this.ticketID = ticketID;
    this.eventType = eventType;
    this.username = username;
    this.joinedUsers = [];
  }
}

export default Events;
