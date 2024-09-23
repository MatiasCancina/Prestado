import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import BottomTabNavigator from './BottomTabNavigator'
import AuthStackNavigator from './AuthStackNavigator'

const Navigator = () => {
    const { user } = useAuthContext()

    return user ? <BottomTabNavigator /> : <AuthStackNavigator />
}

export default Navigator