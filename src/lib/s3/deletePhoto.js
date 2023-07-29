const { DeleteObjectCommand } = require('@aws-sdk/client-s3');

module.exports = async (fileName, client) => {
	const bucketParams = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: fileName,
	};

	try {
		const response = await client.send(new DeleteObjectCommand(bucketParams));
		return response;
	} catch (e) {
		// console.log(e.message);
		throw new Error('S3 error occurred.');
	}
};
