import React, {useCallback, useState} from 'react';
import {
  TextInput,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Typography,
  Avatar,
  Button,
  Wrapper,
  CountryPicker,
  Loader,
} from 'components';
import {colors} from 'theme';
import {strings} from 'locales/i18n';
import {push, reset, screenNames} from 'navigation';
import {
  checkAllRequiredFieldsWithKey,
  validatePhone,
  checkRequiredField,
} from 'utils/FormValidation';
import Style from './style';
import {registerUser} from './apis';
const Signup = () => {
  const [userImage, setUserImage] = useState();
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState({
    code: '+49',
    flag: require('../../utils/Flags/images/de.png'),
  });
  const [userForm, setUserForm] = useState({
    name: '',
    phone: '',
  });
  const [userErrors, setUserErrors] = useState({
    name: '',
    phone: '',
  });
  const handleInput = (name, value) => {
    setUserForm({...userForm, [name]: value});
  };
  const removeError = name => {
    setUserErrors({...userErrors, [name]: ''});
  };
  const handleCountry = useCallback((code, flag) => {
    setCountryCode({
      code: `+${code}`,
      flag,
    });
  }, []);
  const onAvatarChange = useCallback(image => {
    setUserImage(image);
  }, []);
  const redirectLogin = useCallback(() => {
    reset(screenNames.Login, {});
  }, []);
  const checkAllRequiredField = useCallback(() => {
    const errors = checkAllRequiredFieldsWithKey(
      {name: '', phone: ''},
      userForm,
    );
    setUserErrors({...userErrors, ...errors});
    return Object.values(errors).some(value => value.length > 0);
  }, [userForm, userErrors]);
  const checkError = useCallback(
    ({name, value}) => {
      const errors = {};
      switch (name) {
        case 'phone':
          Object.assign(errors, validatePhone(name, value));
          break;
        default:
          Object.assign(errors, checkRequiredField(name, value));
          break;
      }
      setUserErrors({...userErrors, ...errors});
    },
    [userErrors],
  );
  const handleSubmit = useCallback(() => {
    if (!checkAllRequiredField()) {
      setLoading(true);
      const form = new FormData();
      form.append('name', userForm.name);
      form.append('phone', userForm.phone);
      form.append('countryCode', countryCode.code.replace('+', ''));
      if (userImage) {
        form.append('profile', userImage);
      }
      registerUser(form)
        .then(async ({data}) => {
          return push(screenNames.Otp, {
            phone: `${countryCode.code}${userForm.phone}`,
            authorizationKey: data.authorizationKey,
          });
        })
        .catch(({error_message}) => {
          Alert.alert(
            strings('alert.warning'),
            error_message ?? strings('alert.somethingWentWrong'),
          );
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [checkAllRequiredField, userForm, countryCode, userImage]);
  return (
    <Wrapper>
      <ScrollView showsVerticalScrollIndicator={false} style={Style.container}>
        <Typography
          style={Style.heading}
          text={strings('signup.registeredWith')}
        />
        <View style={Style.userRow}>
          <Avatar
            onChange={onAvatarChange}
            source={require('../../../assets/images/avatarPlaceholder.png')}
          />
        </View>
        <View style={Style.formView}>
          <View style={Style.field}>
            <Typography style={Style.label} text={strings('signup.name')} />
            <TextInput
              placeholderTextColor={colors.placeholderColor}
              style={[Style.inputText1, userErrors.name && Style.inputError]}
              onChangeText={value => handleInput('name', value)}
              value={userForm.name}
              placeholder={strings('signup.name')}
              onFocus={() => removeError('name')}
              onBlur={() => checkError({name: 'name', value: userForm.name})}
            />
            <View>
              {userErrors.name ? (
                <Text style={Style.errorText}>{userErrors.name}</Text>
              ) : null}
            </View>
          </View>

          <View style={Style.field}>
            <Typography
              style={Style.label}
              text={strings('signup.phoneNumber')}
            />
            <View style={[Style.input, userErrors.phone && Style.inputError]}>
              <View style={Style.countryPicker}>
                <View style={Style.selectedCode}>
                  <CountryPicker onCountrySelect={handleCountry}>
                    {countryCode.code}
                  </CountryPicker>
                </View>
              </View>
              <TextInput
                placeholderTextColor={colors.placeholderColor}
                keyboardType="numeric"
                maxLength={15}
                style={Style.inputText}
                onChangeText={value => handleInput('phone', value)}
                placeholder={strings('signup.phoneNumber')}
                value={userForm.phone}
                onFocus={() => removeError('phone')}
                onBlur={() =>
                  checkError({name: 'phone', value: userForm.phone})
                }
              />
            </View>
            <View>
              {userErrors.phone ? (
                <Text style={Style.errorText}>{userErrors.phone}</Text>
              ) : null}
            </View>
          </View>
          <Button
            titleStyle={Style.buttonText}
            title={strings('signup.submit')}
            buttonContainerStyle={Style.button}
            onPress={handleSubmit}
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={redirectLogin}
          style={Style.newUser}>
          <Typography
            style={Style.newUserText}
            text={strings('signup.alreadyUser')}
          />
          <Typography
            style={Style.createAccount}
            text={strings('signup.login')}
            onPress={redirectLogin}
          />
        </TouchableOpacity>
        {loading && <Loader loading={loading} />}
      </ScrollView>
    </Wrapper>
  );
};

export default Signup;
