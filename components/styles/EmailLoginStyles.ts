import { StyleSheet } from 'react-native';

export const EmailLoginStyles = StyleSheet.create({
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
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'visible',
    maxWidth: '100%',
    maxHeight: 220,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FDE7CE',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    width: '100%',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#3B2D4D',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#FDE7CE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  loginButtonText: {
    color: '#3B2D4D',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    color: '#FDE7CE',
    fontSize: 12,
    marginTop: 12,
  },
  clickHere: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
