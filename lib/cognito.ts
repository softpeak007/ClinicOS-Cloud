import { 
  CognitoIdentityProviderClient, 
  SignUpCommand, 
  InitiateAuthCommand, 
  ForgotPasswordCommand, 
  ConfirmForgotPasswordCommand,
  AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";

let cognitoClient: CognitoIdentityProviderClient | null = null;
let cognitoEnabled = false;

export function getCognitoClient(): { client: CognitoIdentityProviderClient | null; enabled: boolean } {
  try {
    const region = process.env.AWS_REGION || "us-east-1";
    const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    const clientId = process.env.AWS_COGNITO_CLIENT_ID;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (
      userPoolId && 
      !userPoolId.includes("us-east-1_abcdef123") && 
      clientId && 
      !clientId.includes("1234567890abcdefghijklmnop") &&
      accessKeyId &&
      !accessKeyId.includes("AKIAIOSFODNN7EXAMPLE")
    ) {
      if (!cognitoClient) {
        cognitoClient = new CognitoIdentityProviderClient({
          region,
          credentials: {
            accessKeyId,
            secretAccessKey: secretAccessKey || "",
          },
        });
      }
      cognitoEnabled = true;
    }
  } catch (error) {
    console.error("⚠️ AWS Cognito client initialization failed, falling back to local simulator:", error);
    cognitoEnabled = false;
  }
  return { client: cognitoClient, enabled: cognitoEnabled };
}

export async function signUpUser(email: string, password: string, name: string, role: string) {
  const { client, enabled } = getCognitoClient();
  const clientId = process.env.AWS_COGNITO_CLIENT_ID || "1234567890abcdefghijklmnop";

  if (enabled && client) {
    try {
      const command = new SignUpCommand({
        ClientId: clientId,
        Username: email,
        Password: password,
        UserAttributes: [
          { Name: "email", Value: email },
          { Name: "name", Value: name },
          { Name: "custom:role", Value: role },
        ],
      });
      const response = await client.send(command);
      return { success: true, userSub: response.UserSub, simulated: false };
    } catch (error: any) {
      console.error("⚠️ Cognito SignUp Error:", error);
      throw error;
    }
  }

  // Simulation mode
  console.log(`[COGNITO SIMULATOR] SignUp initiated for ${email} with name "${name}" and role "${role}"`);
  return { success: true, userSub: `sim-sub-${Date.now()}`, simulated: true };
}

export async function signInUser(email: string, password: string) {
  const { client, enabled } = getCognitoClient();
  const clientId = process.env.AWS_COGNITO_CLIENT_ID || "1234567890abcdefghijklmnop";

  if (enabled && client) {
    try {
      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });
      const response = await client.send(command);
      const authResult = response.AuthenticationResult;
      return {
        success: true,
        idToken: authResult?.IdToken,
        accessToken: authResult?.AccessToken,
        refreshToken: authResult?.RefreshToken,
        simulated: false,
      };
    } catch (error: any) {
      console.error("⚠️ Cognito SignIn Error:", error);
      throw error;
    }
  }

  // Simulation mode
  console.log(`[COGNITO SIMULATOR] SignIn success for ${email}`);
  if (email === "s.jenkins@oakridgefamilycare.com" || email === "admin@clinicos.com" || email.includes("@")) {
    return {
      success: true,
      idToken: "simulated-id-token-jwt-value",
      accessToken: "simulated-access-token-jwt-value",
      refreshToken: "simulated-refresh-token",
      simulated: true,
    };
  }
  throw new Error("Invalid username or password (simulated Cognito response)");
}

export async function forgotPasswordUser(email: string) {
  const { client, enabled } = getCognitoClient();
  const clientId = process.env.AWS_COGNITO_CLIENT_ID || "1234567890abcdefghijklmnop";

  if (enabled && client) {
    try {
      const command = new ForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
      });
      await client.send(command);
      return { success: true, simulated: false };
    } catch (error: any) {
      console.error("⚠️ Cognito ForgotPassword Error:", error);
      throw error;
    }
  }

  // Simulation mode
  console.log(`[COGNITO SIMULATOR] ForgotPassword email triggered for ${email}`);
  return { success: true, simulated: true };
}

export async function confirmForgotPasswordUser(email: string, code: string, password: string) {
  const { client, enabled } = getCognitoClient();
  const clientId = process.env.AWS_COGNITO_CLIENT_ID || "1234567890abcdefghijklmnop";

  if (enabled && client) {
    try {
      const command = new ConfirmForgotPasswordCommand({
        ClientId: clientId,
        Username: email,
        ConfirmationCode: code,
        Password: password,
      });
      await client.send(command);
      return { success: true, simulated: false };
    } catch (error: any) {
      console.error("⚠️ Cognito ConfirmForgotPassword Error:", error);
      throw error;
    }
  }

  // Simulation mode
  console.log(`[COGNITO SIMULATOR] ConfirmForgotPassword verified for ${email} with code ${code}`);
  return { success: true, simulated: true };
}
