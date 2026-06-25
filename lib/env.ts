/**
 * ClinicOS Cloud Environment Validation Module
 * 
 * This module validates that all required environment variables are present and correctly formatted,
 * logging clear diagnostics to help verify the Cognito client configuration.
 */

export interface EnvConfig {
  databaseUrl: string | undefined;
  awsRegion: string;
  awsCognitoUserPoolId: string | undefined;
  awsCognitoClientId: string | undefined;
  awsCognitoClientSecret: string | undefined;
  awsS3BucketName: string | undefined;
}

export function getValidatedEnv(): EnvConfig {
  return {
    databaseUrl: process.env.DATABASE_URL,
    awsRegion: process.env.AWS_REGION || "us-east-1",
    awsCognitoUserPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    awsCognitoClientId: process.env.AWS_COGNITO_CLIENT_ID,
    awsCognitoClientSecret: process.env.AWS_COGNITO_CLIENT_SECRET,
    awsS3BucketName: process.env.AWS_S3_BUCKET_NAME,
  };
}

export function validateCognitoEnv(): { valid: boolean; errors: string[]; warnings: string[] } {
  const env = getValidatedEnv();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!env.awsCognitoUserPoolId) {
    errors.push("AWS_COGNITO_USER_POOL_ID is missing from environment variables.");
  } else if (env.awsCognitoUserPoolId.includes("us-east-1_xxxxxxxxx")) {
    warnings.push("AWS_COGNITO_USER_POOL_ID is set to placeholder value.");
  }

  if (!env.awsCognitoClientId) {
    errors.push("AWS_COGNITO_CLIENT_ID is missing from environment variables.");
  } else if (env.awsCognitoClientId.includes("xxxxxxxxxxxxxxxxxxxxxxxxxx")) {
    warnings.push("AWS_COGNITO_CLIENT_ID is set to placeholder value.");
  }

  if (!env.awsCognitoClientSecret) {
    warnings.push("AWS_COGNITO_CLIENT_SECRET is missing. (This is expected if your Cognito Client App does not have a secret enabled.)");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// Automatically validate on server-side startup
if (typeof window === "undefined") {
  const { valid, errors, warnings } = validateCognitoEnv();
  console.log("------------------------------------------------------------------");
  console.log("🔒 CLINICOS CLOUD IDENTITY SERVICE DIAGNOSTICS:");
  if (valid) {
    console.log("   ✅ Cognito Identity Config is structurally valid.");
    if (process.env.AWS_COGNITO_CLIENT_SECRET) {
      console.log("   🔑 Cognito Client Secret: ENABLED (HMAC-SHA256 SECRET_HASH computation active)");
    } else {
      console.log("   🔑 Cognito Client Secret: DISABLED (Pure Client ID authentication active)");
    }
  } else {
    console.warn("   ⚠️ CLINICAL SERVICE NOTIFY: Missing configuration dependencies:");
    errors.forEach(err => console.warn(`      - ${err}`));
  }
  if (warnings.length > 0) {
    console.log("   ℹ️ Setup Information:");
    warnings.forEach(warn => console.log(`      - ${warn}`));
  }
  console.log("------------------------------------------------------------------");
}
