export default (err, req, res, next) => {
	console.error(err && err.stack);
	res.status(500).send(err.stack);
}