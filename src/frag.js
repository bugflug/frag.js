import { el } from '/src/util.js'

export const hook = {
    build     () {},
    mount     () {},
    mounted   () {},
    unmount   () {},
    unmounted () {}
}

/**
 * frag class :D
 * 
 * @prop {string} path - path to pull HTML from
 */
export class Frag {
    path  = '/pages/404.html'
    hook  = hook
    frags = []
    
    // @private
    #frag   = undefined
    #parent = undefined
    #range  = undefined

    /**
     * build before using!
     */
    constructor () {
    }

    /**
     * build the component
     * @returns
     */
    async build () {
        this.hook = { ...hook, ...this.hook }

        // create our document fragment
        // document fragments are very fast!
        this.#frag = document
            .createRange()
            .createContextualFragment(
                await fetch(this.path)
                .then(data => data.text()))
        
        // @frags
        for (let i in this.frags) { await this.frags[i].build() }

        // @hook
        // seems like checking for variables existing
        // is necessary in async methods
        if (this.hook.build) this.hook.build(this.#frag)
        return this
    }

    /**
     * append a frag to a parent
     * @param {string|Element} parent - string identifier or document element
     * @returns
     */
    mount(parent) {
        // @hook
        if (this.hook.mount) this.hook.mount(parent, this.#frag)

        // @update
        this.#parent = el.from(parent)
        this.#range = document.createRange()

        // @frags
        this.frags.forEach(f => f.mount(this.#frag))

        // get the length now before it gets cleared when appended
        let dif = this.#frag.childNodes.length

        // appending a document frag clears it by move
        this.#parent.appendChild(this.#frag)
        this.#range.setStartBefore(
            this.#parent.childNodes[this.#parent.childNodes.length - dif], 0)
        this.#range.setEndAfter(
            this.#parent.childNodes[this.#parent.childNodes.length - 1], 0)

        // @style
        if (!!this.#parent.classList) this.#parent.classList.add('mounted')
        // @hook
        if (this.hook.mounted) this.hook.mounted(this.#parent)
        return this
    }

    /**
     * remove the component from the DOM
     * @returns
     */
    unmount() {
        if (!this.#range)  throw new Error('this frag has no range to unmount!')
        if (!this.#parent) return false

        // @hook
        if (this.hook.unmount) this.hook.unmount(this.#parent)

        // @frags
        this.frags.forEach(f => f.unmount())

        // @update
        this.#frag = this.#range.extractContents()
        this.#range.detach() ; this.#range = undefined

        // @style
        if (!!this.#parent.classList) this.#parent.classList.remove('mounted')

        this.#parent = undefined

        // @hook
        if (this.hook.unmounted) this.hook.unmounted(this.#frag)
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