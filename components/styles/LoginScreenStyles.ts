//LoginScreenStyles.ts
//leave comment above
import { StyleSheet } from 'react-native';

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2D4D',
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
    paddingBottom: 60,
  },
  logo: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FDE7CE',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  imageContainer: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'visible',
    maxWidth: '100%',
    maxHeight: 280,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE7CE',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#3B2D4D',
    marginLeft: 8,
    fontWeight: '500',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  signupText: {
    color: '#FDE7CE',
    fontSize: 12,
    marginTop: 8,
  },
  signupLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  footer: {
    color: '#FDE7CE',
    fontSize: 11,
    marginTop: 60,
    textAlign: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
});
