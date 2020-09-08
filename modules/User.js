const User = ({userType, userId}) => {
    const userProps = { userType, userId };
    return {
        ...userProps,
    }
}
module.exports = {
    User
}