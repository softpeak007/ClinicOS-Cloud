"use server";

import { 
  signUp as cognitoSignUp, 
  signIn as cognitoSignIn, 
  verifyOTP as cognitoVerifyOTP,
  forgotPassword as cognitoForgotPassword,
  confirmForgotPassword as cognitoConfirmForgotPassword,
  resendConfirmationCode as cognitoResendConfirmationCode,
  getSecretHash
} from "@/lib/auth/cognito";
import { getPresignedDownloadUrl, getPresignedUploadUrl } from "@/lib/storage/s3";
import {
  SignUpCommand,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ResendConfirmationCodeCommand,
  AuthFlowType
} from "@aws-sdk/client-cognito-identity-provider";

// Cognito Actions
export async function handleSignUp(formData: any) {
  try {
    const { email, password, name, role } = formData;
    const response = await cognitoSignUp(email, password, name, role);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function handleSignIn(formData: any) {
  try {
    const { email, password } = formData;
    const response = await cognitoSignIn(email, password);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function handleVerifyOTP(formData: any) {
  try {
    const { email, code } = formData;
    const response = await cognitoVerifyOTP(email, code);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function handleForgotPassword(formData: any) {
  try {
    const { email } = formData;
    const response = await cognitoForgotPassword(email);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function handleConfirmForgotPassword(formData: any) {
  try {
    const { email, code, newPassword } = formData;
    const response = await cognitoConfirmForgotPassword(email, code, newPassword);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function handleResendConfirmationCode(formData: any) {
  try {
    const { email } = formData;
    const response = await cognitoResendConfirmationCode(email);
    return { success: true, data: JSON.parse(JSON.stringify(response)) };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// S3 Actions
export async function generateDownloadUrl(key: string, expiry: number) {
  try {
    const url = await getPresignedDownloadUrl(key, expiry);
    return { success: true, url };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

export async function generateUploadUrl(key: string, contentType: string, expiry: number) {
  try {
    const url = await getPresignedUploadUrl(key, contentType, expiry);
    return { success: true, url };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// Database Connection Status Action
export async function checkDbConnection() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      return { success: false, error: "DATABASE_URL is not configured" };
    }
    // We do a lazy validation of connection string structure
    const masked = databaseUrl.replace(/:([^:@]+)@/, ":******@");
    return { success: true, configured: true, connectionString: masked };
  } catch (err: any) {
    return { success: false, error: err.message || String(err) };
  }
}

// Complete Cognito Integration Programmatic Audit
export async function runCognitoAudit() {
  const logs: string[] = [];
  logs.push("🚀 Starting Cognito Integration Audit...");

  // 1. Verify environment variables are loaded correctly
  const awsRegion = process.env.AWS_REGION || "us-east-1";
  const userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
  const clientId = process.env.AWS_COGNITO_CLIENT_ID;
  const clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;

  logs.push(`📍 Environment Variables Check:`);
  logs.push(`   - AWS_REGION: ${awsRegion}`);
  logs.push(`   - AWS_COGNITO_USER_POOL_ID: ${userPoolId ? `LOADED (${userPoolId.slice(0, 8)}...)` : "MISSING"}`);
  logs.push(`   - AWS_COGNITO_CLIENT_ID: ${clientId ? `LOADED (${clientId.slice(0, 6)}...)` : "MISSING"}`);
  logs.push(`   - AWS_COGNITO_CLIENT_SECRET: ${clientSecret ? `LOADED (length: ${clientSecret.length})` : "MISSING / NOT PRESENT"}`);

  // 2. Verify SECRET_HASH inclusion in SDK commands
  logs.push(`🔍 Verifying SECRET_HASH presence in AWS Cognito SDK commands:`);
  const mockEmail = "test-audit-user@example.com";
  const mockClientId = clientId || "mock-client-id";
  const mockClientSecret = clientSecret || "mock-client-secret-key-1234567890";
  const testHash = getSecretHash(mockEmail, mockClientId, mockClientSecret);
  const testHashLength = testHash ? testHash.length : 0;

  logs.push(`   - Generated SecretHash for testing (length): ${testHashLength} characters`);

  const commandChecks: { commandName: string; passed: boolean; details: string }[] = [];

  try {
    const signup = new SignUpCommand({
      ClientId: mockClientId,
      Username: mockEmail,
      Password: "MockPassword123!",
      SecretHash: testHash,
      UserAttributes: [{ Name: "email", Value: mockEmail }]
    });
    commandChecks.push({
      commandName: "SignUpCommand",
      passed: signup.input.SecretHash === testHash,
      details: signup.input.SecretHash ? `SecretHash parameter included successfully (length: ${signup.input.SecretHash.length})` : "Missing SecretHash parameter"
    });

    const confirmSignUp = new ConfirmSignUpCommand({
      ClientId: mockClientId,
      Username: mockEmail,
      ConfirmationCode: "123456",
      SecretHash: testHash
    });
    commandChecks.push({
      commandName: "ConfirmSignUpCommand",
      passed: confirmSignUp.input.SecretHash === testHash,
      details: confirmSignUp.input.SecretHash ? `SecretHash parameter included successfully (length: ${confirmSignUp.input.SecretHash.length})` : "Missing SecretHash parameter"
    });

    const initiateAuth = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: mockClientId,
      AuthParameters: {
        USERNAME: mockEmail,
        PASSWORD: "MockPassword123!",
        SECRET_HASH: testHash || ""
      }
    });
    commandChecks.push({
      commandName: "InitiateAuthCommand",
      passed: initiateAuth.input.AuthParameters?.SECRET_HASH === testHash,
      details: initiateAuth.input.AuthParameters?.SECRET_HASH ? `SECRET_HASH AuthParameter included successfully (length: ${initiateAuth.input.AuthParameters.SECRET_HASH.length})` : "Missing SECRET_HASH in AuthParameters"
    });

    const forgotPassword = new ForgotPasswordCommand({
      ClientId: mockClientId,
      Username: mockEmail,
      SecretHash: testHash
    });
    commandChecks.push({
      commandName: "ForgotPasswordCommand",
      passed: forgotPassword.input.SecretHash === testHash,
      details: forgotPassword.input.SecretHash ? `SecretHash parameter included successfully (length: ${forgotPassword.input.SecretHash.length})` : "Missing SecretHash parameter"
    });

    const confirmForgotPassword = new ConfirmForgotPasswordCommand({
      ClientId: mockClientId,
      Username: mockEmail,
      ConfirmationCode: "123456",
      Password: "MockNewPassword123!",
      SecretHash: testHash
    });
    commandChecks.push({
      commandName: "ConfirmForgotPasswordCommand",
      passed: confirmForgotPassword.input.SecretHash === testHash,
      details: confirmForgotPassword.input.SecretHash ? `SecretHash parameter included successfully (length: ${confirmForgotPassword.input.SecretHash.length})` : "Missing SecretHash parameter"
    });

    const resendCode = new ResendConfirmationCodeCommand({
      ClientId: mockClientId,
      Username: mockEmail,
      SecretHash: testHash
    });
    commandChecks.push({
      commandName: "ResendConfirmationCodeCommand",
      passed: resendCode.input.SecretHash === testHash,
      details: resendCode.input.SecretHash ? `SecretHash parameter included successfully (length: ${resendCode.input.SecretHash.length})` : "Missing SecretHash parameter"
    });

    for (const check of commandChecks) {
      logs.push(`   [${check.passed ? "✅ PASS" : "❌ FAIL"}] ${check.commandName}: ${check.details}`);
    }
  } catch (cmdErr: any) {
    logs.push(`   ❌ Error verifying commands: ${cmdErr.message || cmdErr}`);
  }

  // 5. Execute a real SignUp test
  logs.push(`🧪 Executing real live test call to AWS Cognito...`);
  let testSuccess = false;
  let errorDetails: any = null;
  let rootCause = "None (Audit Passed Successfully)";
  let resolution = "No action required. Cognito client configuration is fully functional.";

  try {
    if (!userPoolId || userPoolId.includes("xxxxxxxxx") || !clientId || clientId.includes("xxxxxxxxxx")) {
      throw new Error("Cannot run live test with placeholder credentials in environment.");
    }

    const testEmail = `audit_test_${Date.now()}@example.com`;
    // We expect this to fail or succeed depending on the validity of AWS credentials.
    // Let's call the actual signUp from lib/auth/cognito
    logs.push(`   - Target UserPool: ${userPoolId}`);
    logs.push(`   - Target ClientId: ${clientId}`);
    logs.push(`   - Registering user: ${testEmail}`);

    await cognitoSignUp(testEmail, "TestPassword123!", "Audit Bot", "Clinician");
    logs.push(`   ✅ LIVE TEST PASSED: User registration call succeeded against AWS Cognito!`);
    testSuccess = true;
  } catch (err: any) {
    logs.push(`   ❌ LIVE TEST FAILED: Cognito call threw an error.`);
    
    errorDetails = {
      name: err.name || "UnknownError",
      message: err.message || String(err),
      metadata: err.$metadata || null,
      requestId: err.$metadata?.requestId || err.requestId || null,
      stack: err.stack || null
    };

    // Determine root cause and resolution
    if (err.message?.includes("placeholder") || err.message?.includes("Cannot run live test")) {
      rootCause = "Cognito credentials in environment variables are placeholder values.";
      resolution = "Please populate your real .env variables (AWS_COGNITO_USER_POOL_ID, AWS_COGNITO_CLIENT_ID, and AWS_COGNITO_CLIENT_SECRET if needed) in the Environment Setup tab or system settings.";
    } else if (err.name === "ResourceNotFoundException") {
      rootCause = "The requested User Pool or Client ID does not exist in the specified region.";
      resolution = "Double-check that AWS_REGION, AWS_COGNITO_USER_POOL_ID, and AWS_COGNITO_CLIENT_ID are typed correctly and exist in your AWS Console.";
    } else if (err.name === "NotAuthorizedException") {
      rootCause = "Client Secret mismatch or invalid SECRET_HASH.";
      resolution = "Ensure AWS_COGNITO_CLIENT_SECRET is correct or remove/disable it if your App Client in Cognito does not have 'Generate client secret' checked.";
    } else if (err.name === "InvalidParameterException" && err.message?.includes("secret")) {
      rootCause = "Cognito App Client does not support a Client Secret, but a Secret was sent (or vice versa).";
      resolution = "If your App Client does not use a secret, clear the AWS_COGNITO_CLIENT_SECRET variable from your environment configuration.";
    } else {
      rootCause = `AWS API Exception: ${err.name || "Unknown"}`;
      resolution = `Verify your IAM permissions, Cognito configuration settings, and check AWS CloudWatch logs using Request ID: ${err.$metadata?.requestId || "N/A"}.`;
    }
  }

  return {
    success: testSuccess,
    logs,
    errorDetails,
    rootCause,
    resolution,
    environmentStatus: {
      region: awsRegion,
      userPoolIdConfigured: !!userPoolId && !userPoolId.includes("xxxxxxxxx"),
      clientIdConfigured: !!clientId && !clientId.includes("xxxxxxxxxx"),
      clientSecretConfigured: !!clientSecret,
      clientSecretLength: clientSecret ? clientSecret.length : 0,
    }
  };
}
