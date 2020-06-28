/* eslint-disable camelcase */
import React, { useCallback, useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import { Platform, Alert } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
} from './styles';

import { useAuth } from '../../hooks/auth';

import api from '../../services/api';

interface IRouteParams {
  providerId: string;
}

export interface IProvider {
  id: string;
  name: string;
  avatar_url: string;
}

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();

  const routeParams = route.params as IRouteParams;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [providers, setProviders] = useState<IProvider[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  );

  useEffect(() => {
    api.get('/providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const navigateBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, []);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(oldValue => !oldValue);
    // setSelectedProvider(true);
  }, []);

  const handleChangeDate = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') setShowDatePicker(false);

    if (date) setSelectedDate(date);
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatar_url }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={provider => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => {
                handleSelectProvider(provider.id);
              }}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar
                selected={provider.id === selectedProvider}
                source={{ uri: provider.avatar_url }}
              />
              <ProviderName selected={provider.id === selectedProvider}>
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>

      <Calendar>
        <Title>Escolha a data</Title>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerButtonText>
            Selecionar outra data
          </OpenDatePickerButtonText>
        </OpenDatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            textColor="#f4efe8"
            mode="date"
            display="calendar"
            value={selectedDate}
            onChange={handleChangeDate}
          />
        )}
      </Calendar>
    </Container>
  );
};

export default CreateAppointment;
