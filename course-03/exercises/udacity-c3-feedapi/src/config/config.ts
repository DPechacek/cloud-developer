export const config = {
  'dev': {
    'username': process.env.AWS_DB_USER,
    'password': process.env.AWS_DB_PASSWORD,
    'database': process.env.AWS_DB_DATABASE,
    'host': process.env.AWS_DB_HOST,
    'dialect': process.env.AWS_DB_DIALECT,
    'aws_region': process.env.AWS_S3_REGION,
    'aws_profile': process.env.AWS_S3_CREDENTIAL_PROFILE,
    'aws_media_bucket': process.env.AWS_S3_BUCKET
  },
  'prod': {
    'username': '',
    'password': '',
    'database': 'udagram_prod',
    'host': '',
    'dialect': 'postgres'
  },
  'jwt': {
    'secret': process.env.UDAGRAM_JWT_SECRET
  }

};
