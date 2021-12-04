import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components"
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator"
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore"
import Chat from "./Chat";


function Sidebar() {
    const [user] = useAuthState(auth)
    // it will give the reference of :
    // from the chats collection -> it will give all the user email from array where the user(who loggedin) his emails are store
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email)
    console.log("userChatRef >>> ", userChatRef)


    // to map the ref and get the realtime data we used useCollection
    const [chatsSnapshot] = useCollection(userChatRef)
    console.log("chatsSnapshot >>> ", chatsSnapshot)


    const createChat = () => {
        const input = prompt("Please enter the email address to chat with user");

        if (!input) {
            return null;
        }

        // it will check the email which user gave as an input and push to database

        /* 
        if Conditions:-
            1) EmailValidator.validate(input) -> default validator of react use to validate email
            2) user.email !== input -> before add input data in db it will check if the user who logged in his email should not match with input email
            3) It is checking if the given input email is not in the database
        */
        console.log("input >>> ", input)
        console.log("chatAlreadyExists(input)", chatAlreadyExists(input))

        if (EmailValidator.validate(input) && input !== user.email && !chatAlreadyExists(input)) {
            console.log("EmailValidator.validate(input) >>>", EmailValidator.validate(input))
            console.log("input !== user.email >>> ", input !== user.email)
            console.log("chatAlreadyExists(input)", !chatAlreadyExists(input))
            // to push into firebase
            // we need to add the chat into the DB 'chats' collection

            /* 
                Structure:

                chats | documents(represent as a chat) | users array [user, input(recipient)]

            */
            db.collection('chats').add({
                users: [user.email, input]
            })
        }


    }

    // this function will say if the input[email] which user entered is already exit or not
    // it will take the email of recipient
    const chatAlreadyExists = (recipientEmail) =>

        // from the realtime chat snapshot/data find the recipient email
        // chatsSnapshot contain all the chats[Documents]

        // so it will go through all the documents user the chats section and for each document we have users array[] in that for each user it will check if it is matching with the input[recipient] and return boolean value

        // !! means it will make the boolean return
        !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0);




    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => { auth.signOut() }} />

                <IconsContainer>

                    {/* using IconButton we make Icon as clickable */}
                    <IconButton>
                        <ChatIcon />
                    </IconButton>

                    {/* using IconButton we make Icon as clickable */}
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>

                </IconsContainer>
            </Header>

            {/* search components */}
            <Search>
                <SearchIcon />
                <SearchInput placeholder="Search here..." />
            </Search>

            <SidebarButton onClick={createChat}>
                Start a new chat
            </SidebarButton>

            {/* List of Chats */}

            {/* here we are loading recipients email which we had chat 
            and passing to chat components with id and users data
            */}

            {chatsSnapshot?.docs.map(chat => (
                <Chat key={chat.id} id={chat.id} users={chat.data().users} />
            ))}
        </Container>
    )
}

export default Sidebar

const Container = styled.div`
    flex: 0.45;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar{
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Header = styled.div`
    display: flex;
    position: sticky; /* want top as sticky while scrolling */
    top:0;
    background-color: white;
    z-index:100;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover{
        opacity: 0.8;
    }
`

const IconsContainer = styled.div``


const Search = styled.div`
    align-items: center;
    display: flex;
    padding: 20px;
    border-radius: 2px;
`

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex:1

`

const SidebarButton = styled(Button)`
    width: 100%;

    /* with the help of &&&{ } it will increase priority */
    &&&{
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`
