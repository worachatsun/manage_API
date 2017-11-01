exports.render = (req, rep) => {
    rep({ name: req.params.name })
}
