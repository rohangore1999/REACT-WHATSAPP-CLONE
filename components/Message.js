import styled from "styled-components"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "../firebase"
import moment from "moment"

function Message({ user, message }) {

    const [userLoggedIn] = useAuthState(auth)

    // it is checking if the user is the one who loggedin then it is TypeOfMessage = <Sender> else 
    // TypeOfMessage = <Receiver>

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver

    return (
        <Container>
            <TypeOfMessage>{message.message}
                <Timestamp>
                    {/* we are using moment to convert unix timestamp to readable timestamp */}

                    {/* 
                    moment().format('LT');   // 6:37 PM
                    moment().format('LTS');  // 6:37:33 PM
                */}

                    {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div``

// MessageElement will be commond for both types
const MessageElement = styled.p`
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
`
// Sender is taking all the styles of MessageElement and its own
const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #dcf8c6;
`
// Receiver is taking all the styles of MessageElement and its own
const Receiver = styled(MessageElement)`
    background-color: whitesmoke;
    text-align: left;
    margin-right: auto;
`

// using type as span-tag because we are using it inside MessageElement which is p-tag
const Timestamp = styled.span`
    color: gray;
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right:0;
`