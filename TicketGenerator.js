import { fbConfig } from './firebase';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database'

// Function to generate a random ticket ID
export async function generateTicketID() {
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
                usedID = await checkExistingTicketID(ticketID);

                if(usedID) {
                    ticketID = '';
                }
            }

            resolve(ticketID); // Resolve the promise with the generated ticket ID
            return;
        });
    }

// Function to check if a ticket ID exists in Firebase database
    export async function checkExistingTicketID(ticketID) {
        const db = getDatabase(fbConfig);
            
          // Define a list of topic options
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

         // Create an array of promises to check ticket ID existence for each topic
        const promises = topicOptions.map(async (topicOptions) => {
            const refSubject = databaseRef(db, 'Support/' + topicOptions);
            const refTicket = child(refSubject, ticketID);
            const snapshot = await get(refTicket);
            return snapshot.exists();
        });

        // Wait for all promises to resolve and check if at least one topic contains the ticket ID
        const result = await Promise.all(promises);
        const validID = result.some((exists) => exists);
    
        return validID;
    }
