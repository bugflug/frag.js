export const el = {
    check: (el) => (el instanceof Element || el instanceof DocumentFragment || el instanceof Document),

    /**
     * returns an element if it is a string or Element.
     * throws an error if it is not
     * @param {string|Element|any}                el                - string, Element, or any
     * @param {Document|DocumentFragment|Element} [parent=Document] - base node to use
     * @returns {Element}
     */
    from (el, parent) {
        if (this.check(el)) return el
        if (!parent) parent = document
        if (typeof el === 'string') return parent.querySelector(el)
        console.log(el)
        throw new Error('not a string nor an element!')
    },

    /**
     * modifies an element with the given callback.
     * applies the 'unmodified' (if not present) class and the 'modified' class.
     * @param {string|Element|any}                el                - string, Element, or any
     * @param {function}                          callback          - callback to run
     * @param {Document|DocumentFragment|Element} [parent=Document] - base node to use
     * @returns {Promise<Element>}
     */
    async modify (el, callback, parent) {
        el = this.from(el, parent)

        let classList = el.classList

        // unmodified
        if (!(classList.contains('unmodified'))) classList.add('unmodified')
        classList.remove('unmodified')
        // ...modifying...
        await callback(el)
        // modified!
        classList.add('modified')
        return el
    },

    /**
     * return a range from the given string, element, or range from its parent
     * @param {string|Element|Range} el                - string, Element, or Range
     * @param {string|Element}       [parent=Document] - base node to query from
     * @returns 
     */
    range (el, parent) {
        if (el instanceof Range) return el

        parent = this.from(parent)
        el     = this.from(el, parent)

        let r = document.createRange()
        r.selectNode(el)

        return r
    }
}