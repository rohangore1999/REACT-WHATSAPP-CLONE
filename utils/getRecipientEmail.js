/* This function will take all the users from chats docs and the user who loggedin and return the recipient email
*/

// this function is implicit function means:
/* A function is returned values without using the return keyword, it's called an implicit return. The Rules of Implicit Return. You must use an implicit return in a concise body. Example // Single-line. */

const getRecipientEmail = (users, userLoggedIn) => users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0]
// from list of users it will iterate each users and check that user not match with the user who logged in and give that recipient email. As filter always return an ARRARY so we used [0]



export default getRecipientEmail