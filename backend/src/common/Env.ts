import jetEnv, { bool, num, str } from 'jet-env';


/******************************************************************************
                            Export default
******************************************************************************/

export default jetEnv({
  NodeEnv: str,
  
  /* App */
  AppName: str,
  Port: num,
  MongodbUri: str,
  FrontendOrigin: str,
  
  /* AWS */
  AwsRegion: str,
  AwsBucketName: str,
  AwsAccessKeyId: str,
  AwsSecretAccessKey: str,

  /* Token secrets */
  AccessTokenSecret: str,
  RefreshTokenSecret: str,
  ResetPasswordAccessTokenSecret: str,

  /* SMTP */
  SmtpMock: bool,
  SmtpProvider: str,
  SmtpEmail: str,
  SmtpPass: str,

});
