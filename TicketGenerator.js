import { fbConfig } from './firebase';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database'

// Function to generate a random ticket ID
export async function generateTicketID(pageType) {
        // Define characters and length for the ticket ID
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let ticketID = '';
        let usedID = true;

        // Generate a random ticket ID
        return new Promise(async (resolve) => {
            // Continuously loop until a unique ticket ID is generated
            while(usedID) {
                for(let i = 0; i < length; i++) {
                    const randIndex = Math.floor(Math.random() * characters.length);
                    ticketID += characters.charAt(randIndex);
                }

                // Checks if generated ticket ID has already been used
                usedID = await checkExistingTicketID(ticketID.pageType);

                if(usedID) {
                    ticketID = '';
                }
            }

            resolve(ticketID); // Resolve the promise with the generated ticket ID
            return;
        });
    }

// Function to check if a ticket ID exists in Firebase database
export async function checkExistingTicketID(ticketID, pageType) {
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

    const eventChoices = [
        "Gala",
        "Meeting",
        "Networking",
        "Non-Profit Event",
        "Open House",
        "Party",
        "Professional Event",
        "Reunion",
        "Sporting Event",
        "Trip",
        "Wedding",
        "Workshop",
        "Other",
    ];

    let validID;

    if(pageType === "Support") {
        const promises = topicOptions.map(async (topicOptions) => {
            const refSubject = databaseRef(db, 'Support/' + topicOptions);
            const refTicket = child(refSubject, ticketID);
            const snapshot = await get(refTicket);
            return snapshot.exists();
        });
        
        const result = await Promise.all(promises);
        validID = result.some((exists) => exists);
    } else if(pageType == "Events") {
        const promises = eventChoices.map(async (eventChoices) => {
            const refEvents = databaseRef(db, 'Events/' + eventChoices);
            const refTicket = child(refEvents, ticketID);
            const snapshot = await get(refTicket);
            return snapshot.exists();
        });
        
        const result = await Promise.all(promises);
        validID = result.some((exists) => exists);
    }
    
    return validID;
}
