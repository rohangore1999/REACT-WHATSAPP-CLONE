import { Avatar } from "@material-ui/core"
import { useRouter } from "next/router"
import { useAuthState } from "react-firebase-hooks/auth"
import { useCollection } from "react-firebase-hooks/firestore"
import styled from "styled-components"
import { auth, db } from "../firebase"
import getRecipientEmail from "../utils/getRecipientEmail"


function Chat({id, users}) {
    // user router because when we click on any recipient mail from sidebar, the chats should load.
    const router = useRouter();

    // user => contain the user who logged in
    const [user] = useAuthState(auth)
    
    // we will pass the list of users and user who logged in
    const recipientEmail = getRecipientEmail(users, user)
    console.log(recipientEmail)
    console.log(users)

    // here we are going to users db and checking and getting the recipient data (with the help of getRecipientEmail) 
    // Note: in users db we get the recipient data if and only if that recipient has loggedin into our app
    const [recipientSnapshot] = useCollection(db.collection('users').where('email','==', getRecipientEmail(users, user)))

    // it will give you all the recipient details(fields) from users db
    const recipient = recipientSnapshot?.docs[0]?.data();
    console.log("recipient >>>",  recipient)

    // when we click on container it will takes us to chat/<particular id> which we passed from sidebar
    const enterChat = () =>{
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {/* it will check for the recipient's data if it is present then take the photoURL from it */}
            {recipient ? (
                <UserAvatar src={recipient?.photoURL} />
            ):
            // else take first letter from email and show in avatar
            <UserAvatar>{recipientEmail[0]}</UserAvatar>
            }
            
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    /* it will break the word into diff line */
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`

