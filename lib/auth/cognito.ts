import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  InitiateAuthCommand,
  ConfirmSignUpCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  AuthFlowType,
  SignUpCommandOutput,
  InitiateAuthCommandOutput,
  ConfirmSignUpCommandOutput,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommandOutput,
  ResendConfirmationCodeCommandOutput
} from "@aws-sdk/client-cognito-identity-provider";
import { createHmac } from "crypto";
import { getValidatedEnv } from "../env";

let cognitoClient: CognitoIdentityProviderClient | null = null;

/**
 * Lazy-initializes and retrieves AWS Cognito Config and Client.
 * Prevents build-time crashes if environment variables are not immediately present.
 */
function getCognitoConfig() {
  const env = getValidatedEnv();

  if (!env.awsCognitoUserPoolId || !env.awsCognitoClientId) {
    throw new Error(
      "AWS_COGNITO_USER_POOL_ID and AWS_COGNITO_CLIENT_ID environment variables are required. Please configure them in your settings."
    );
  }

  if (!cognitoClient) {
    cognitoClient = new CognitoIdentityProviderClient({ region: env.awsRegion });
  }

  return {
    cognitoClient,
    clientId: env.awsCognitoClientId,
    userPoolId: env.awsCognitoUserPoolId,
    clientSecret: env.awsCognitoClientSecret,
  };
}

/**
 * Computes AWS Cognito SECRET_HASH using HMAC-SHA256.
 * Formula: Base64(HMAC-SHA256(username + clientId, clientSecret))
 */
export function getSecretHash(username: string, clientId: string, clientSecret?: string): string | undefined {
  if (!clientSecret) return undefined;
  return createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

/**
 * Sign Up User with Cognito
 */
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: string
): Promise<SignUpCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new SignUpCommand({
    ClientId: clientId,
    Username: email,
    Password: password,
    SecretHash: secretHash,
    UserAttributes: [
      { Name: "email", Value: email },
      { Name: "name", Value: name },
      { Name: "custom:role", Value: role },
    ],
  });

  return await cognitoClient.send(command);
}

/**
 * Sign In / Authenticate User
 */
export async function signIn(
  email: string,
  password: string
): Promise<InitiateAuthCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const authParameters: Record<string, string> = {
    USERNAME: email,
    PASSWORD: password,
  };

  if (secretHash) {
    authParameters.SECRET_HASH = secretHash;
  }

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    ClientId: clientId,
    AuthParameters: authParameters,
  });

  return await cognitoClient.send(command);
}

/**
 * Verify OTP / Confirm Sign Up
 */
export async function verifyOTP(
  email: string,
  code: string
): Promise<ConfirmSignUpCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new ConfirmSignUpCommand({
    ClientId: clientId,
    Username: email,
    ConfirmationCode: code,
    SecretHash: secretHash,
  });

  return await cognitoClient.send(command);
}

/**
 * Initiate Forgot Password Request
 */
export async function forgotPassword(
  email: string
): Promise<ForgotPasswordCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new ForgotPasswordCommand({
    ClientId: clientId,
    Username: email,
    SecretHash: secretHash,
  });

  return await cognitoClient.send(command);
}

/**
 * Confirm Forgot Password with new password and code
 */
export async function confirmForgotPassword(
  email: string,
  code: string,
  newPassword: string
): Promise<ConfirmForgotPasswordCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new ConfirmForgotPasswordCommand({
    ClientId: clientId,
    Username: email,
    ConfirmationCode: code,
    Password: newPassword,
    SecretHash: secretHash,
  });

  return await cognitoClient.send(command);
}

/**
 * Resend OTP Confirmation Code
 */
export async function resendConfirmationCode(
  email: string
): Promise<ResendConfirmationCodeCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new ResendConfirmationCodeCommand({
    ClientId: clientId,
    Username: email,
    SecretHash: secretHash,
  });

  return await cognitoClient.send(command);
}

/**
 * Refresh Auth Tokens
 */
export async function refreshToken(
  username: string,
  token: string
): Promise<InitiateAuthCommandOutput> {
  const { cognitoClient, clientId, clientSecret } = getCognitoConfig();
  const secretHash = getSecretHash(username, clientId, clientSecret);

  const authParameters: Record<string, string> = {
    REFRESH_TOKEN: token,
  };

  if (secretHash) {
    authParameters.SECRET_HASH = secretHash;
  }

  const command = new InitiateAuthCommand({
    AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
    ClientId: clientId,
    AuthParameters: authParameters,
  });

  return await cognitoClient.send(command);
}
