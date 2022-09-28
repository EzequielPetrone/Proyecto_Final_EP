const routingError = (req, res) => res.status(404).json({ errCode: 0, errDescription: `Fail Request ${req.method} a la ruta: ${req.originalUrl} (No implementada)` })

export { routingError }