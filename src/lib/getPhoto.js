const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

module.exports = async (fileName, client) => {
	const params = {
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: fileName,
	};

	try {
		const url = await getSignedUrl(client, new GetObjectCommand(params), { expiresIn: 28800 }); // 8 hours
		return url;
	} catch (e) {
		// console.log(e.message);
		throw new Error('S3 error occurred.');
	}
};
