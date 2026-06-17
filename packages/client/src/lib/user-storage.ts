import AsyncStorage from '@react-native-async-storage/async-storage'

const USER_ID_KEY = '@vineo/user-id'
const USER_NAME_KEY = '@vineo/user-name'

export async function getStoredUserId(): Promise<string | null> {
  return AsyncStorage.getItem(USER_ID_KEY)
}

export async function storeUserId(id: string): Promise<void> {
  await AsyncStorage.setItem(USER_ID_KEY, id)
}

export async function getStoredUserName(): Promise<string | null> {
  return AsyncStorage.getItem(USER_NAME_KEY)
}

export async function storeUserName(name: string): Promise<void> {
  await AsyncStorage.setItem(USER_NAME_KEY, name)
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.multiRemove([USER_ID_KEY, USER_NAME_KEY])
}
