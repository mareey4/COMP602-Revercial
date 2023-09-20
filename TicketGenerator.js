import { fbConfig } from './firebase';
import { getDatabase, ref, set, onValue, remove } from 'firebase/database'


export async function generateTicketID() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = 8;
        let ticketID = '';

        return new Promise((resolve) => {
            for(let i = 0; i < length; i++) {
                const randIndex = Math.floor(Math.random() * characters.length);
                ticketID += characters.charAt(randIndex);
            }

            resolve(ticketID);
            return;
        });
    }

    export async function checkExistingTicketID(ticketID) {
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
    
        const promises = topicOptions.map(async (topicOptions) => {
            const refSubject = databaseRef(db, 'Support/' + topicOptions);
            const refTicket = child(refSubject, ticketID);
            const snapshot = await get(refTicket);
            return snapshot.exists();
        });
    
        const result = await Promise.all(promises);
        const validID = result.some((exists) => exists);
    
        return validID;
    }