//import { routes } from '/src/routes.js'
import { el } from '/src/util.js'

// props to mitch dev
// https://www.youtube.com/watch?v=ZleShIpv5zQ

/** global router object */
export let router = undefined

/**
 * router :D
 * should only really use one of these per site tbh
 */
export class Router {
    container
    routes = {}
    page   = { unmount: () => {} }

    /**
     * initialize a router
     * @param {Page[]} routes        - routes the router should use
     * @param {string} routes[].href - url to be linked to a given page
     * @param {string} routes[].path - url for the page HTML
     */
    constructor (routes) {
        if (!!router) throw new Error('a router already exists for this document!')

        this.update       = this.update.bind(this) // async methods need manual binding
        window.route      = this.route
        window.router     = router = this
        window.onpopstate = this.update

        routes.forEach(r => this.routes[r.href] = r)
    }

    /**
     * mount the router to the specified target
     * @param {string|Element} [target='<main>'] - target to mount the router to
     */
    async mount (target) {
        this.container = (!!target) ? el.from(target) : el.from('main')
        this.update(window.location.pathname)
    }

    /**
     * update the router view with the given url
     * @param {string} url 
     */
    async update (url) {
        url = url || window.location.pathname
        if (url === '') url = '/' // just in case lmao
        
        // clear the view
        this.page.unmount()
        this.container.innerHTML = ''

        // mount our new view
        new (this.routes[url] || this.routes['/404'])()
            .build()
            .then(f => f.mount(this.container))
            .then(f => this.page = f)
    }

    /**
     * handle routing events.
     * example: `<a href="/test" onclick="router.route()">`
     * @param event 
     */
    route (event) {
        event = event || window.EventSource

        // prevent the window from routing
        event.preventDefault()

        // only update the url if its new
        if (window.location.pathname !== (event.target.pathname || '/')) {
            // cosmetically make it our location
            window.history.pushState({}, '', event.target.href || '/')
            // update our page
            this.update()
        }
    }
}