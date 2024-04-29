import { useState, useEffect, useContext, useRef } from 'react';
import { sendMessageToChannel, editMessageInChannel } from '../services/channel-service';
import { getDatabase, ref, onValue, update, remove } from 'firebase/database';
import { AppContext } from '../context/AppContext';
import SendIcon from '@mui/icons-material/Send';
import { getUserByHandle } from '../services/user-service';
import { Button, Box, Avatar, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';


export default function ChatView({ channelTitle }) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedMessage, setEditedMessage] = useState('');
    const { userData } = useContext(AppContext);
    const chatRef = useRef(null);
    const inputRef = useRef(null);
    const [otherUserData, setOtherUserData] = useState(null);

    useEffect(() => {
        const db = getDatabase();
        const messagesRef = ref(db, `channels/${channelTitle}/messages`);

        return onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const loadedMessages = [];
            for (const id in data) {
                loadedMessages.push({ id, ...data[id] });
            }
            setMessages(loadedMessages);
        });
    }, [channelTitle]);

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


    useEffect(() => {
        const fetchOtherUserData = async () => {
            if (!otherUserData) {
                const usernames = channelTitle.split('+'); // Replace '-' with the character or string that separates the usernames
                const otherUsername = usernames.find(username => username !== userData?.username);
                const snapshot = await getUserByHandle(otherUsername);
                setOtherUserData(snapshot);

            }
        };

        fetchOtherUserData();
    }, [channelTitle]);

    const handleEdit = (channelTitle, msgId, msgText) => {
        editMessageInChannel(channelTitle, msgId, msgText);
        setEditingMessageId(msgId);
        setEditedMessage(msgText);
    };

    const send = async () => {
        if (message.trim() !== '') {
            await sendMessageToChannel(channelTitle, userData?.username, message, userData?.avatarUrl);
            setMessage('');
        }
    }

    const edit = async () => {

        if (editingMessageId !== null) {
            await editMessageInChannel(channelTitle, editingMessageId, editedMessage);
            setEditingMessageId(null);
            setMessage('') // Clear editing state
        }
    };

    const handleDelete = async (msgId) => {
        try {
            const db = getDatabase();
            const messageRef = ref(db, `channels/${channelTitle}/messages/${msgId}`);
            await remove(messageRef);
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }


    return (
        <Box display="flex" height="90vh">
            <Box width="75%" display="flex" flexDirection="column" paddingTop="20px" paddingLeft= "40px">
                <h1 style={{ marginBottom: '10px', paddingTop: '15px', textAlign: 'center' }}>
                    {userData?.firstName + " " + userData?.lastName + ", " + otherUserData?.firstName + " " + otherUserData?.lastName}
                </h1>
                <div style={{ overflowY: 'auto', marginBottom: '50px', flex: '1', padding: '10px', position: 'relative' }}>

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
                                    <Avatar src={msg.avatarUrl} style={{ margin: '2px', width: '30px', height: '30px' }} />
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
                                                    style={{ padding: '1px', minWidth: '1px' }}
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
                <form
                    onSubmit={(e) => {
                        e.preventDefault(); // Prevent the form from refreshing the page
                        send();
                    }}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', paddingLeft: '50px', borderTop: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'left', background: 'white' }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        style={{ flex: '1', maxWidth: '800px', marginRight: '10px', backgroundColor: "white", color: "black", height: '30px', borderRadius: '5px', padding: '5px' }}
                    />
                    <Button type="submit" startIcon={<SendIcon />} variant="contained" color="primary">Send</Button>
                </form>
            </Box>
            <Drawer anchor='right' variant="permanent" sx={{ width: '25%' }}>
                <div
                    role="presentation"
                    style={{ paddingTop: '50px' }} // Add this line
                >
                    <List>
                        <Box display="flex" justifyContent="center" alignItems="center" paddingTop="25px">
                            <Avatar
                                src={otherUserData?.avatarUrl}
                                sx={{ width: 120, height: 120 }} // Increase avatar size here
                            />
                        </Box>
                        <ListItem>
                            <ListItem>
                                <Typography variant="h6" component="div" style={{ fontWeight: 'bold' }}>
                                    {otherUserData?.firstName + " " + otherUserData?.lastName}
                                </Typography>
                            </ListItem>
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary={otherUserData?.username} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><EmailIcon /></ListItemIcon>
                            <ListItemText primary={otherUserData?.email} />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon><PhoneIcon /></ListItemIcon>
                            <ListItemText primary={otherUserData?.phoneNumber} />
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        </Box>
    );
};