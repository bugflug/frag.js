import { el } from './el.js'
import { Collection } from './collection.js'

export const hook = {
    constructor () {},
    build       () {},
    mount       () {},
    mounted     () {},
    unmount     () {},
    unmounted   () {}
}

/**
 * frag class :D
 * 
 * @prop {string} path - path to pull HTML from
 */
export class Frag {
    // overridables
    path  = '/pages/404.html'
    hook  = hook
    frags = []
    
    // internal
    frag     = undefined
    parent   = undefined
    old      = undefined
    range    = undefined
    children = undefined

    /**
     * build before using!
     */
    constructor () {
        this.hook = { ...hook, ...this.hook }
    }

    /**
     * 
     * @param {string|Element}       parent - parent element to target
     * @param {string|Range|Element} target - tag to target
     * @returns
     */
    target (parent, target) {
        this.parent = el.from(parent)

        this.range = el.range(target, parent)
        this.old = this.range.extractContents()

        return this
    }

    /**
     * build the component(s)
     * @returns
     */
    async build () {
        this.frag = document
            .createRange()
            .createContextualFragment(
                await fetch(this.path)
                .then(data => data.text()))
        
        // @children
        if (!!this.frags) this.children = []
        for (let tag in this.frags) {
            // using a collection lets us
            // make sure every instance of
            // the given tag is targeted
            let c = await new Collection(this.frags[tag])
                .target(this.frag, tag)
                .build()
            this.children.push(c)
        }

        // @hook
        // seems like checking for variables existing
        // is necessary in async methods
        if (this.hook.build) this.hook.build(this)
        return this
    }

    /**
     * append our frags to the parent target
     * @returns
     */
    mount () {
        // @hook
        if (this.hook.mount) this.hook.mount(this)

        // @children
        this.children.forEach(c => c.mount())

        // this is it lmao
        this.range.insertNode(this.frag)

        // @style
        if (!!this.parent.classList) this.parent.classList.add('mounted')

        // @hook
        if (this.hook.mounted) this.hook.mounted(this)
        this.frag = undefined
        return this
    }

    /**
     * remove the component from the DOM
     * @returns
     */
    unmount() {
        if (!this.range)  throw new Error('this frag has no range to unmount!')
        if (!this.parent) return false

        // @hook
        if (this.hook.unmount) this.hook.unmount(this)

        // @children
        this.children.forEach(c => c.unmount())

        // @update
        this.frag = this.range.extractContents()
        this.range.insertNode(this.old)

        // @style
        if (!!this.parent.classList) this.parent.classList.remove('mounted')

        // @hook
        if (this.hook.unmounted) this.hook.unmounted(this)
        this.old = undefined
        return this
    }
}

/**
 * @extends Frag
 * @prop {string}  href           - the url path this page should be linked to
 * @prop {string}  [name=]        - name of the page
 * @prop {boolean} [hidden=false] - hidden or not when listing pages?
 */
export class Page extends Frag {
    static href   = '/404'
    static name   = undefined
    static hidden = false
}