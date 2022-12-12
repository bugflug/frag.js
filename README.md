# `frag.js`

```
fragment *noun*
/ˈfraɡmənt/

a small part broken or seperated off something.
```

---

## What is this?

This is my (bugflug's, a.k.a. cob's) personal javascript web library/framework. I don't like the bloat and complexity from many options available now. This is my attempt at a simple and clean library for a client-side framework.

FragJS is built on Document Fragments and Ranges. The main pieces are the `Frag`, `Page`, and `Router` classes. A `Frag` is a handler to make fetching, mounting, and unmounting document fragments very easy. A `Page` is a Frag with some extra bits to work nice with the `Router`, which is a handler you can mount for routing shenanigans.