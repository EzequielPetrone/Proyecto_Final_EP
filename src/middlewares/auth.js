const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({ errCode: -1, errDescription: `AUTH REQUIRED` })
    }
}

export { isAuth }