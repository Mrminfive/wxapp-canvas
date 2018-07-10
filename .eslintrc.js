module.exports = {
    extends: 'mlint',

    rules: {
        "no-magic-numbers": 0
    },
    
    globals: {
        wx: false,
        App: true,
        Page: true,
        Behavior: true,
        Component: true,
        requirePlugin: true
    }
};