
import { useClerk, useSignIn, useSignUp } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { Button, View, StyleSheet } from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";

export default function SignIn() {
  const { isLoaded, signIn, setSession } = useSignIn();
  const { signUp } = useSignUp();
  const { signOut } = useClerk();

  // useEffect(() => {
  //   try {
  //     signOut();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }, []);

  if (!isLoaded) return null;

  const handleSignInWithDiscordPress = async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: "/oauth-native-callback",
      });

      await signIn.create({
        strategy: "oauth_apple",
        redirectUrl,
      });

      const {
        firstFactorVerification: { externalVerificationRedirectURL },
      } = signIn;

      if (!externalVerificationRedirectURL)
        throw "Something went wrong during the OAuth flow. Try again.";

        const request = new AuthSession.AuthRequest({
          clientId: "com.steflw.freefall",
          redirectUri: redirectUrl,
          // prompt: AuthSession.Prompt.SelectAccount
        })
        

        const authResult = await request.promptAsync({
          authorizationEndpoint: externalVerificationRedirectURL.toString()
        })

      // const authResult = await AuthSession.startAsync({
      //   authUrl: externalVerificationRedirectURL.toString(),
      //   returnUrl: redirectUrl,
      // });
      console.log({ authResult });
      if (authResult.type !== "success") {
        throw "Something went wrong during the OAuth flow. Try again.";
      }

      // Get the rotatingTokenNonce from the redirect URL parameters
      const { rotating_token_nonce: rotatingTokenNonce } = authResult.params;

      await signIn.reload({ rotatingTokenNonce });

      const { createdSessionId } = signIn;

      if (createdSessionId) {
        // If we have a createdSessionId, then auth was successful
        await setSession(createdSessionId);
      } else {
        // If we have no createdSessionId, then this is a first time sign-in, so
        // we should process this as a signUp instead
        // Throw if we're not in the right state for creating a new user
        if (
          !signUp ||
          signIn.firstFactorVerification.status !== "transferable"
        ) {
          throw "Something went wrong during the Sign up OAuth flow. Please ensure that all sign up requirements are met.";
        }

        console.log(
          "Didn't have an account transferring, following through with new account sign up"
        );

        // Create user
        await signUp.create({ transfer: true });
        await signUp.reload({
          rotatingTokenNonce: authResult.params.rotating_token_nonce,
        });
        await setSession(signUp.createdSessionId);
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      console.log("error signing in", err);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <AppleAuthentication.AppleAuthenticationButton
        // buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={styles.button}
        onPress={handleSignInWithDiscordPress}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 200,
    height: 44,
  },
});
