// Constructor for a Query object
class Query {
    constructor(ticketID, email, subject, description, fileNames) {
        this.ticketID = ticketID;
        this.email = email;
        this.subject = subject;
        this.description = description;
        this.fileNames = fileNames;
    }
}

export default Query;