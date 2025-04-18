import jetEnv, { num, str } from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from './constants';


/******************************************************************************
                            Export default
******************************************************************************/

export default jetEnv({
  NodeEnv: isEnumVal(NodeEnvs),
  
  /* App */
  AppName: str,
  Port: num,
  MongodbUri: str,
  
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
  SmtpProvider: str,
  SmtpEmail: str,
  SmtpPass: str

});
