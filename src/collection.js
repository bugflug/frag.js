import { el } from './el.js'

export class Collection {
    type  = undefined
    frags = undefined

    /**
     * creates a frag collection
     * @param {Frag} frag
     * @returns
     */
    constructor (frag) { this.type = frag }

    /**
     * create a new frag for each target node in the parent node
     * @param {string|Element} parent - parent node to search from
     * @param {string|Element} target - string or element to select
     * @returns
     */
    target (parent, target) {
        parent = el.from(parent)
        this.frags = []

        let node = parent.querySelector(target)
        while (node !== null) {
            let f = new (this.type)()
                .target(parent, node)
            this.frags.push(f)

            node = parent.querySelector(target)
        }

        return this
    }

    /**
     * build all of the frags in the collection
     * @returns
     */
    async build () {
        for (let f in this.frags) { 
            await this.frags[f].build() 
        }
        return this
    }

    /**
     * mount all of the frags in the collection
     * @returns
     */
    mount () {
        this.frags.forEach(f => f.mount())
        return this
    }

    /**
     * unmount all of the frags in the collection
     * @returns
     */
    unmount () {
        this.frags.forEach(f => f.unmount())
        return this
    }
}