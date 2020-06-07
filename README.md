# vue-listbox

This is a rewrite attempt of the Listbox component originally created as an [experiment by Adam Wathan](https://github.com/tailwindui/vue/blob/c056086a9fedddef5cd671681e2b8f8ea48094e3/src/Listbox.js).
It was inspired by [recent rewrite in Ember by Gavin Joyce](https://gist.github.com/GavinJoyce/5e495a171fd99931095b856e08ae31f0).

The approach taken here takes advantage of Vue SFC, and doesn't use context feature, by leveraging custom `contextual-component` that allows us to rely strictly on props and events, without having to operate on the context itself. This approach is well known in Ember ecosystem, where the `yield` feature allows passing components with pre-programmed attributes and event handlers.

This approach has several advantages like:
- we have to import only one component, the rest of the components will come from the slot
- we don't need to use context
- we don't need to pass bunch of props to all sub components in place we want to render our component
- sub components rely strictly on props and events, so unit testing is much simpler

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
