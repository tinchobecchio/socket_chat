import { Router } from "express";

const viewsRouter = Router()

viewsRouter.get('/', (req, res, next) => {

    res.render('home', {
        title: 'Home'
    })
})

export default viewsRouter