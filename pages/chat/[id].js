import Head from "next/head"
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components"
import ChatScreen from "../../components/ChatScreen"
import Sidebar from "../../components/Sidebar"
import { auth, db } from "../../firebase"
import getRecipientEmail from "../../utils/getRecipientEmail"

// chat and messages we are getting from server side rending (line: 54)
function Chat({chat, messages}) {

    const [user] = useAuthState(auth)

    return (
        <Container>
            {/* <Head> & <title> from Next.js */}
            <Head>
                <title>Chat with {getRecipientEmail(chat.users, user)}</title>
            </Head>

            <Sidebar />

            <ChatContainer>
                 <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>

        </Container>
    )
}

export default Chat

// everything inside this function will load on server side
// context is the url param ( chat/NW1PYmLgpIXFXi7btz9D )
export async function getServerSideProps(context) {
    const ref = db.collection("chats").doc(context.query.id) //it will point to 'chats' db --> and id which we get from url (context.query.id)

    //Prep for messages
    // to get the messages from message db in ascending format
    const messagesRes = await ref.collection('messages').orderBy('timestamp','asc').get()

    const messages = messagesRes.docs.map(doc => ({
        id: doc.id,
        // spread operator to pass everything (spread everything)
        ...doc.data()
    })).map(messages => ({
        ...messages,
        // when you pass timestamp from backend to frontend without firebase; then the timestamp data type will be change
        timestamp: messages.timestamp.toDate().getTime() //getTime() is the unix datatime conversion(numbers only)
    }))


    // prep the chats response
    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    }

    console.log('chat >>> ',chat)
    console.log('messages >>> ',messages)


    // In the server side, it send props to react when react loads; so in props we are sending to react messages and chat
    return {
        props: {
            // while send anything to browser it needs to be simple json, so we converting messages to simple json format and for chat no need to convert already it is in simple json
            messages: JSON.stringify(messages),
            chat: chat
        }
    }
}

const Container = styled.div`
    display: flex;
`

const ChatContainer = styled.div`
    flex:1;
    overflow: scroll;
    height: 100vh;
    /* to hide the scroll bar */
    ::-webkit-scrollbar {
        display: none;
    }

    --ms-overflow-style:none
    scrollbar-width:none;
`

