const authRouter = require('./authRoute')
const userRouter = require('./userRoute')
const storyReviewRouter = require('./storyReviewRoutes')
const commentRouter = require('./commentRoute')
function route(app) {
app.use("/auth",authRouter)
app.use("/users",userRouter)
app.use("/reviews", storyReviewRouter)
app.use("/comments", commentRouter)
}

module.exports = route;