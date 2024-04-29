import React, { useState, useEffect, useContext, useRef } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { sendMessageToChannel, editMessageInChannel, getChannelTitleByCid } from '../../services/channel-service';
import { AppContext } from '../../context/AppContext';
import { Button, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


export default function ChannelView({ cid }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [channelTitle, setChannelTitle] = useState('');
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');
    const { userData } = useContext(AppContext);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const db = getDatabase();
        const messagesRef = ref(db, `channels/${cid}/messages`);

        // Listen for changes in the messages node
        return onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = [];
            for (const id in data) {
                loadedMessages.push({ id, ...data[id] });
            }
            setMessages(loadedMessages);
        });
    }, [cid]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (chatRef.current) {
                chatRef.current?.scrollIntoView({ behavior: "instant" })
            }
        }, 0);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [messages]);


    const send = async () => {


        if (message.trim() !== '') {
            await sendMessageToChannel(cid, userData?.username, message, userData?.avatarUrl);
            setMessage('');
        }
    }

    useEffect(() => {
        const fetchChannelTitle = async () => {
            try {
                const channelTitle = await getChannelTitleByCid(cid);
                setChannelTitle(channelTitle);
            } catch (error) {
                console.error('Error fetching channel title:', error);
            }
        };

        fetchChannelTitle();
    }, [cid]);

    const edit = async () => {

        if (editingMessageId !== null) {
            await editMessageInChannel(cid, editingMessageId, editedMessage);
            console.log(editingMessageId);
            setEditingMessageId(null);
            setMessage('') // Clear editing state
        }
    };

    const handleEdit = (cid, msgId, msgText) => {
        editMessageInChannel(cid, msgId, msgText);
        setEditingMessageId(msgId);
        setEditedMessage(msgText);
    };

    const handleDelete = async (msgId) => {
        try {
            const db = getDatabase();
            const messageRef = ref(db, `channels/${cid}/messages/${msgId}`);
            await remove(messageRef);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '20px' }} >
            <h1 style={{ marginBottom: '10px', paddingTop: '25px', textAlign: 'center' }}>{channelTitle}</h1>
            <div style={{ flex: '1', overflowY: 'auto', padding: '10px', position: 'relative' }}>
                <div style={{ overflowY: 'auto', marginBottom: '50px' }}>
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.sender === userData?.username ? 'flex-end' : 'flex-start',
                                marginBottom: '10px',
                            }}
                        >
                            <strong>
                                {typeof msg.sender === 'object'
                                    ? JSON.stringify(msg.sender)
                                    : msg.sender}
                            </strong>
                            {editingMessageId === msg.id ? (
                                <div>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        defaultValue={editedMessage}
                                        onChange={(e) => setEditedMessage(e.target.value)}
                                        style={{
                                            flex: '1',
                                            marginRight: '10px',
                                            backgroundColor: "white",
                                            color: "black",
                                            borderRadius: "5px",
                                            padding: "5px",
                                            border: "1px solid #ddd",
                                            width: "300px",
                                            height: "30px",
                                            fontFamily: "Arial",
                                            fontSize: "15px",
                                        }}
                                    />
                                    <Button onClick={edit} startIcon={<SaveIcon />} />
                                </div>
                            ) : (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: msg.sender === userData?.username ? 'row-reverse' : 'row',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <Avatar src={msg.avatarUrl} style={{ margin: '0 10px', width: '30px', height: '30px' }} />
                                    <div
                                        style={{
                                            backgroundColor: '#e6e6e6',
                                            borderRadius: '10px',
                                            padding: '10px',
                                            color: 'black',
                                            fontSize: '16px',
                                        }}
                                    >
                                        {typeof msg.text === 'object'
                                            ? JSON.stringify(msg.text)
                                            : msg.text}
                                        <br />
                                        {msg.sender === userData?.username && (
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <Button
                                                style={{ padding: '1px', minWidth: 'auto' }}
                                                onClick={() => handleEdit(channelTitle, msg.id, msg.text)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </Button>
                                            <Button
                                                style={{ padding: '1px', minWidth: 'auto' }}
                                                onClick={() => handleDelete(msg.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </Button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#999',
                                    marginTop: '2px',
                                    textAlign: msg.sender === userData?.username ? 'right' : 'left',
                                }}
                            >
                                {new Date(msg.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    <div ref={chatRef} />
                </div>
            </div>
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // Prevent the form from refreshing the page
                    send();
                }}
                style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white' }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ flex: '0.8', maxWidth: '600px', marginRight: '10px', backgroundColor: "white", color: "black", height: '30px', borderRadius: '5px', padding: '5px' }}
                />
                <Button type="submit" startIcon={<SendIcon />} variant="contained" color="primary" style={{ height: '30px' }}>Send</Button>
            </form>
        </div>
    );
};
