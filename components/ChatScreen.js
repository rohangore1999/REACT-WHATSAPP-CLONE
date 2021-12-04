import { Avatar, IconButton } from "@material-ui/core"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import { auth, db } from "../firebase"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import AttachFileIcon from "@material-ui/icons/AttachFile"
import { useRouter } from "next/router"
import Message from "./Message"
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon"
import MicIcon from "@material-ui/icons/Mic"
import { useCollection } from "react-firebase-hooks/firestore"
import { useRef, useState } from "react"
import firebase from "firebase"
import getRecipientEmail from "../utils/getRecipientEmail"
import TimeAgo from 'timeago-react'

function ChatScreen({ chat, messages }) {
    const [user] = useAuthState(auth)
    const router = useRouter();

    const [input, setinput] = useState("")

    // it will give us the snapshot of : under chats db --> from our URL gets the id in that go for messages of that particular id and sort it as ascending order

    // as id is name of documents also
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp', 'asc'))

    /* Logic here is to load client side data it take some time; so before loading of client data we are rendering data which is stored in server */
    const showMessages = () => {
        // it is client side rendering
        if (messagesSnapshot) {
            return messagesSnapshot.docs.map((message) => (
                <Message
                    key={message.id}
                    user={message.data().user}
                    message={
                        // in message want to send obj as a props
                        {
                            ...message.data(),
                            timestamp: message.data().timestamp?.toDate().getTime()
                        }
                    }
                />
            ))

        }
        // Below is server side rendering send the data which is present in server as json
        /*
        chat >>> {
                id: '3NbrFQZGvK5OCuZKNQC3',
                users: [ 'gorerohan15@gmail.com', 'gorerohan@gmail.com' ]
            }
        messages >>>  [
        {
            id: 'HvBHsZkf5G3YDtp2yMnT',
            photoURL: 'https://lh3.googleusercontent.com/a-/AOh14GjK3MXMvgcq-2aeWzBCj6F_JyupLrUw5AcJihHcoA=s96-c',
            user: 'gorerohan15@gmail.com',
            message: 'Hi Rohan',
            timestamp: 1638617917582
        }
        ]
        */
        else {
            return JSON.parse(messages).map(message => (
                <Message key={message.id} user={message.user} message={message} />
            ))
        }
    }

    // user.uid(the one who logged in) is match with under users --> each docs
    console.log("user", user.uid)
    const sendMessage = (e) => {
        e.preventDefault()

        // update lastseen field from users db
        // set user so that if it is not present then add and merge:true use if field already present and update instead of overwrite
        db.collection('users').doc(user.uid).set(
            {
                lastSeen: firebase.firestore.FieldValue.serverTimestamp()
            },
            {
                merge: true
            }
        )

        // update the chats db based on router.query.id to add message in particular field
        db.collection('chats').doc(router.query.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user.email,
            photoURL: user.photoURL
        });

        setinput("");

        // after sending message it will pointing to bottom of the message using useRef()
        scrollToBottom()

    }


    // to get recipient data; if they have logged in then only we can get.
    // based on recipient email we are searching their account in users db

    // in recipient data we are getting all the field which are present in users db 
    const [recipientSnapshot] = useCollection(db.collection('users').where("email", "==", getRecipientEmail(chat.users, user)))

    const recipient = recipientSnapshot?.docs?.[0]?.data()
    /* EXAMPLE:-

    recipient data >>>  
        {email: 'gorerait16e@student.mes.ac.in', lastSeen: t, photoURL: 'https://lh3.googleusercontent.com/a/AATXAJzfakuYbfduGC5xQn5xBcnugeA8BcZ9CgPXhBN0=s96-c'}

        email: "gorerait16e@student.mes.ac.in"
        lastSeen: t {seconds: 1638467923, nanoseconds: 168000000}
        photoURL: "https://lh3.googleusercontent.com/a/AATXAJzfakuYbfduGC5xQn5xBcnugeA8BcZ9CgPXhBN0=s96-c"

        [[Prototype]]: Object
    */
    console.log("recipient data >>> ", recipient)

    // it will pointing to the endOfMessagesRef bottom
    const endOfMessagesRef = useRef(null)

    const scrollToBottom = () => {
        endOfMessagesRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }

    return (
        <Container>
            <Header>
                {recipient ? (
                    <Avatar src={recipient.photoURL} />) :
                    <Avatar>{getRecipientEmail(chat.users, user)[0]}</Avatar>

                }

                <HeaderInformation>
                    <h3>{getRecipientEmail(chat.users, user)}</h3>

                    {recipientSnapshot ? (
                        <p>Last active: {' '} {recipient?.lastSeen?.toDate() ? (
                            /*
                                TIME AGO...
                                Automatically refreshes itself.
                                
                                See Demo
                                    Examples:
                                    just now
                                    45s
                                    5m
                                    15 minutes ago
                                    3 hours ago
                                    in 2 months
                                    in 5 years
                            */
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "Unavailable"}</p>
                    ) : (
                        <p>Loading last active...</p>
                    )}
                </HeaderInformation>

                <HeaderIcons>

                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>

                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </HeaderIcons>
            </Header>

            <MessageContainer>

                {showMessages()}


                {/* end of message */}
                <EndOfMessage ref={endOfMessagesRef} />

            </MessageContainer>

            {/* InputContainer is a form >> so that when we hit enter the message should get submit */}
            <InputContainer>
                <InsertEmoticonIcon />

                <Input placeholder="Type a message" value={input} onChange={e => (setinput(e.target.value))} />

                {/* as InputContainer is a form so we are making btn type submit(so that aftr hitting enter btn will click).
                making button property as hidden and disable when there is no input
                */}
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send message</button>
                <MicIcon />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div``

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index:100;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
    top: 0;
`

const HeaderInformation = styled.div`
    flex:1;
    margin-left: 15px;

    >h3{
        margin-bottom:3px;
    }

    >p{
        font-size: 14px;
        color: gray;
        margin-top: 0%;
    }
`

const HeaderIcons = styled.div``

const MessageContainer = styled.div`
    padding: 30px;
    background-color: #e5ded8;
    min-height: 90vh;
`

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: sticky;
    bottom: 0;
    background-color: white;
    z-index: 100;
`

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
    margin-right: 15px;
`