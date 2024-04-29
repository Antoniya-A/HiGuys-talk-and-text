import { get, set, ref, equalTo, orderByChild, update, push, query } from "firebase/database";
import { db } from "../config/firebase-config";


export const getChannelByCid = (cid) => {
    return get(ref(db, `channels/${cid}`))
};

export const createChannel = async (channelTitle, channelPrivacy, username, tid) => {
    try {
        const result = await push(ref(db, 'channels'), {}); // Create a new object in the 'channels' collection with empty content and get the result of the operation.
        const cid = result.key; // Get the unique identifier (cid) of the newly created element.
        const participants = [username];

        await set(ref(db, `channels/${cid}`), { channelTitle, channelPrivacy, participants, cid, tid, messages: {} });

        return cid;
    } catch (error) {
        console.error('Error adding channel:', error);
        throw error;
    }
};

export const getUserAndPublicChannels = async (username) => {
    // Fetch all channels
    const allChannels = await getAllChannels();

    // Initialize an empty array to store the user's channels
    let userChannels = [];

    // Initialize an empty array to store the channels the user is not a participant in
    let otherChannels = [];

    // Iterate over all channels
    for (let channel of allChannels) {
        // Check if channel has a cid property and cid starts with "-"
        if (channel.hasOwnProperty('cid')) {
            // Fetch the participants of the current channel
            const snapshot = await getChannelParticipants(channel.cid);
            if (snapshot.exists()) {
                const participants = Object.values(snapshot.val());
                // If the user is a participant in the current channel, add the channel to the user's channels
                if (participants.includes(username)) {
                    userChannels.push(channel);
                } else {
                    // If the user is not a participant in the current channel, add the channel to the other channels
                    otherChannels.push(channel);
                }
            }
        }
    }

    // Filter out the channels that are not private from the other channels
    const publicChannels = otherChannels.filter(channel => channel.channelPrivacy !== "private");

    // Combine the user channels and public channels
    const combinedChannels = [...userChannels, ...publicChannels];

    // Return the combined channels
    return combinedChannels;
}

export const getChannelTitleByCid = async (cid) => {
    try {
        const snapshot = await get(ref(db, `channels/${cid}`));
        if (snapshot.exists()) {
            const channelData = snapshot.val();
            return channelData.channelTitle;
        }
        return null;
    } catch (error) {
        console.error('Error getting channel title:', error);
        throw error;
    }
};


export const sendMessageToChannel = async (channelTitle, username, message, avatarUrl) => {

    // Create a reference to the messages in the channel
    const messagesRef = ref(db, `channels/${channelTitle}/messages`);

    // Use the push method to create a new message
    const newMessageRef = push(messagesRef);

    // Set the message data
    await set(newMessageRef, {
        sender: username,
        text: message,
        avatarUrl: avatarUrl,
        timestamp: Date.now(),
    });
};
export const editMessageInChannel = async (channelTitle, messageId, updatedMessage) => {
    try {
        const messageRef = ref(db, `channels/${channelTitle}/messages/${messageId}`);

        await update(messageRef, {
            text: updatedMessage,
            timestamp: Date.now(),
        });
    } catch (error) {
        console.error('Error editing message:', error);
        throw error;
    }
};


export const getChannelParticipants = async (cid) => {
    if (!cid) {
        console.error('Undefined cid for channel');
        return;
    }
    const channelRef = ref(db, `channels/${cid}/participants`);
    return get(query(channelRef));
};

// export const updateChannel = async (channelTitle, channelId) => {

//     const channelRef = ref(db, `channels/${channelTitle}`)
//     await update(channelRef, channelId)
//   }

export const getAllChannels = async () => {
    const snapshot = await get(ref(db, 'channels'));
    if (snapshot.exists()) {
        return Object.values(snapshot.val());
    }
    return [];
}

export const getChannelsByTid = async (tid) => {
    const snapshot = await get(query(ref(db, 'channels'), orderByChild('tid'), equalTo(tid)))


    if (!snapshot.exists()) {
        return [];
    }

    return Object.values(snapshot.val())
}

// [TODO]: Get channels by team id
