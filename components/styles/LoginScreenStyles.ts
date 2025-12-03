//LoginScreenStyles.ts
//leave comment above
import { StyleSheet } from 'react-native';

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3B2D4D',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    fontSize: 36,
    fontWeight: '600',
    color: '#FDE7CE',
    marginBottom: 20,
    fontFamily: 'sans-serif-medium',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 40,
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
