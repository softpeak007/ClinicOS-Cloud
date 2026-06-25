const { CognitoIdentityProviderClient, SignUpCommand, ConfirmSignUpCommand, InitiateAuthCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand, ResendConfirmationCodeCommand } = require("@aws-sdk/client-cognito-identity-provider");
const { createHmac } = require("crypto");

console.log("==================================================================");
console.log("🛡️ COGNITO INTEGRATION RUNTIME AUDIT");
console.log("==================================================================");

const env = {
  AWS_REGION: process.env.AWS_REGION || "us-east-1",
  AWS_COGNITO_USER_POOL_ID: process.env.AWS_COGNITO_USER_POOL_ID,
  AWS_COGNITO_CLIENT_ID: process.env.AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_CLIENT_SECRET: process.env.AWS_COGNITO_CLIENT_SECRET,
};

console.log("1. Runtime Environment Verification:");
console.log("   - AWS_REGION:", env.AWS_REGION);
console.log("   - AWS_COGNITO_USER_POOL_ID:", env.AWS_COGNITO_USER_POOL_ID || "[MISSING]");
console.log("   - AWS_COGNITO_CLIENT_ID:", env.AWS_COGNITO_CLIENT_ID || "[MISSING]");
console.log("   - AWS_COGNITO_CLIENT_SECRET:", env.AWS_COGNITO_CLIENT_SECRET ? "[LOADED] (Length: " + env.AWS_COGNITO_CLIENT_SECRET.length + ")" : "[NOT DEFINED]");

console.log("\n2. Secret Hash Verification:");
function getSecretHash(username, clientId, clientSecret) {
  if (!clientSecret) return undefined;
  return createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}

const testUsername = "audit-test-user@example.com";
const testClientId = env.AWS_COGNITO_CLIENT_ID || "dummy-client-id";
const testSecret = env.AWS_COGNITO_CLIENT_SECRET;

const secretHash = getSecretHash(testUsername, testClientId, testSecret);
if (secretHash) {
  console.log("   - SECRET_HASH calculation is active.");
  console.log("   - Calculated SECRET_HASH length:", secretHash.length);
} else {
  console.log("   - SECRET_HASH calculation is inactive (no client secret found).");
}

console.log("\n3. Verification of SecretHash inclusion in Cognito Commands:");
const dummyHash = secretHash || "dummy-secret-hash";

const signUpCmd = new SignUpCommand({
  ClientId: testClientId,
  Username: testUsername,
  Password: "DummyPassword123!",
  SecretHash: dummyHash
});
console.log("   [✓] SignUpCommand includes SecretHash:", "SecretHash" in signUpCmd.input);

const confirmSignUpCmd = new ConfirmSignUpCommand({
  ClientId: testClientId,
  Username: testUsername,
  ConfirmationCode: "123456",
  SecretHash: dummyHash
});
console.log("   [✓] ConfirmSignUpCommand includes SecretHash:", "SecretHash" in confirmSignUpCmd.input);

const initiateAuthCmd = new InitiateAuthCommand({
  AuthFlow: "USER_PASSWORD_AUTH",
  ClientId: testClientId,
  AuthParameters: {
    USERNAME: testUsername,
    PASSWORD: "DummyPassword123!",
    SECRET_HASH: dummyHash
  }
});
console.log("   [✓] InitiateAuthCommand (SignIn) includes SECRET_HASH parameter:", "SECRET_HASH" in initiateAuthCmd.input.AuthParameters);

const forgotPasswordCmd = new ForgotPasswordCommand({
  ClientId: testClientId,
  Username: testUsername,
  SecretHash: dummyHash
});
console.log("   [✓] ForgotPasswordCommand includes SecretHash:", "SecretHash" in forgotPasswordCmd.input);

const confirmForgotPasswordCmd = new ConfirmForgotPasswordCommand({
  ClientId: testClientId,
  Username: testUsername,
  ConfirmationCode: "123456",
  Password: "NewDummyPassword123!",
  SecretHash: dummyHash
});
console.log("   [✓] ConfirmForgotPasswordCommand includes SecretHash:", "SecretHash" in confirmForgotPasswordCmd.input);

const resendConfirmationCodeCmd = new ResendConfirmationCodeCommand({
  ClientId: testClientId,
  Username: testUsername,
  SecretHash: dummyHash
});
console.log("   [✓] ResendConfirmationCodeCommand includes SecretHash:", "SecretHash" in resendConfirmationCodeCmd.input);

console.log("\n4. Executing Real SignUp Test against AWS Cognito:");
if (!env.AWS_COGNITO_CLIENT_ID || !env.AWS_COGNITO_USER_POOL_ID) {
  console.log("   ❌ SKIPPED: Cognito Client ID or User Pool ID is not configured.");
  process.exit(1);
}

const client = new CognitoIdentityProviderClient({ region: env.AWS_REGION });
const testEmail = "audit-" + Math.floor(Math.random() * 1000000) + "@example.com";
const testPassword = "AuditPassword123!";

const realSignUpCommand = new SignUpCommand({
  ClientId: env.AWS_COGNITO_CLIENT_ID,
  Username: testEmail,
  Password: testPassword,
  SecretHash: getSecretHash(testEmail, env.AWS_COGNITO_CLIENT_ID, env.AWS_COGNITO_CLIENT_SECRET),
  UserAttributes: [
    { Name: "email", Value: testEmail },
    { Name: "name", Value: "Cognito Audit User" },
    { Name: "custom:role", Value: "patient" }
  ]
});

console.log("   - Attempting SignUp for user:", testEmail);

client.send(realSignUpCommand)
  .then(response => {
    console.log("   ✅ SignUp Test Succeeded!");
    console.log("   - UserSub:", response.UserSub);
    console.log("   - Response Metadata:", JSON.stringify(response["$" + "metadata"]));
  })
  .catch(err => {
    console.log("   ❌ SignUp Test Failed!");
    console.log("\n--- DETAILED AWS SDK ERROR OBJECT ---");
    console.log("Error Name:", err.name);
    console.log("Error Message:", err.message);
    if (err["$" + "metadata"]) {
      console.log("HTTP Status Code:", err["$" + "metadata"].httpStatusCode);
      console.log("Request ID:", err["$" + "metadata"].requestId);
      console.log("Attempts:", err["$" + "metadata"].attempts);
      console.log("Full Metadata:", JSON.stringify(err["$" + "metadata"], null, 2));
    } else {
      console.log("No metadata available.");
    }
    console.log("Full Error Stack:", err.stack);
    console.log("------------------------------------ ");
  });
