import { StatusBar } from 'expo-status-bar';
import { Text, View, FlatList, TouchableOpacity, RefreshControl, Alert, Image, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Redirect, router, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import { NotFound, ProfileCard, FriendsButton, Avatar, FormField, CustomButton } from '../components';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors';
import { getUserImageSource, uploadFile } from '../services/imageService'
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../context/AuthContext';
import { updateUser } from '../services/userService';
import { supabase } from '../lib/supabase';

const EditProfile = () => {
  const { user: currentUser, setUserData } = useAuth();
  const [loading, setLoading] = useState();
  const router = useRouter();

  const [user, setUser] = useState({
    name: '',
    bio: '',
    image: null,
  })

  useEffect(() => {
    if (currentUser) {
      setUser({
        name: currentUser.name || '',
        bio: currentUser.bio || '',
        image: currentUser.image || null,

      });
    }
  }, [currentUser])


  const onSubmit = async () => {
    let userData = { ...user };
    let { name, bio, image } = userData;

    if (!name || !bio) {
      Alert.alert('Profil', 'Uzupełnij wszystkie okna!');
      return;
    }
    setLoading(true);

    if (typeof image == 'object') {
      let imageRes = await uploadFile('profiles', image?.uri);
      if (imageRes.success) userData.image = imageRes.data;
      else userData.image = null;
    }

    const res = await updateUser(currentUser?.id, userData);
    setLoading(false);

    if (res.success) {
      setUserData({ ...currentUser, ...userData });
      router.back();
    }

  }

  const onPickImage = async () => {

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
        alert('Należy przyznać dostęp do galerii zdjęć.');
        return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setUser({ ...user, image: result.assets[0] });
    }

  }

  const handleGoBack = () => {
    router.back();
  };

  let imageSource = user.image && typeof user.image === 'object'
    ? { uri: user.image.uri }
    : getUserImageSource(user?.image);

  return (
    <SafeAreaView className="h-full bg-base-100 mb-6 px-6">
      <View className='items-end w-full'>
        <TouchableOpacity
          onPress={handleGoBack}
          className=" mb-[96px]"
        >
          <Ionicons name='arrow-back' size={24} color={Colors.n400} />
        </TouchableOpacity>
      </View>

      <View className=' w-full rounded-[16px] bg-base items-center py-12'>
        <ImageBackground
          source={imageSource}
          className="w-20 h-20 rounded-full overflow-hidden "
        >
          <TouchableOpacity
            className=' flex-1 justify-center items-center bg-base-900 opacity-60'
            onPress={onPickImage}
          >
            <MaterialCommunityIcons name="account-edit" size={24} color="white" />

          </TouchableOpacity>
        </ImageBackground>

        <FormField
          title="Nazwa"
          value={user.name}
          placeholder={"Zmień swoją nazwę!!"}
          handleChangeText={(e) => setUser({ ...user, name: e })}
          otherStyles="mt-6 px-10"

        />
        <FormField
          title="Opis"
          value={user.bio}
          placeholder={"Opisz siebie!"}
          handleChangeText={(e) => setUser({ ...user, bio: e })}
          otherStyles="mt-4 px-10 h-[80px]"

        />

        <CustomButton
          title="ZAPISZ"
          handlePress={onSubmit}
          containerStyles={"mt-12  w-3/6"}
          isLoading={loading}

        />
      </View>

    </SafeAreaView>
  )
}

export default EditProfile

