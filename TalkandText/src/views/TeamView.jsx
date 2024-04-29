import { useState, useEffect, useContext, useRef } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function TeamView({ cid }) {

  const [channels, setChannels] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const channelRef = ref(db, `channels/${cid}/channelTitle`);

        // Listen for changes in the messages node
        return onValue(channelRef, (snapshot) => {
            const data = snapshot.val();
            const loadedChannels = [];
            for (const id in data) {
                loadedChannels.push({ id, ...data[id] });
            }
            setChannels(loadedChannels);
        });
    }, [cid]);
    
    return (
        <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', paddingTop: '50px' }} >
            <div>
            {channels.map((channel) => (
                    <div
                        key={channel.channelTitle}
                    >
                    </div>
                ))}
              </div>            
            
        </div>
    );
};