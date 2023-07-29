const { PutObjectCommand } = require('@aws-sdk/client-s3');

module.exports = async (fileData, client) => {
	const { name: photoName, data } = fileData;
	const bucketParams = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: photoName,
		Body: data,
	};

	try {
		const response = await client.send(new PutObjectCommand(bucketParams));
		return response;
	} catch (e) {
		// console.log(e.message);
		throw new Error('S3 error occurred.');
	}
};
