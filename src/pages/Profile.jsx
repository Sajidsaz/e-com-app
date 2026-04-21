import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Profile = () => {

    const { token, backendUrl, navigate } = useContext(ShopContext)
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // If not logged in, bounce to login
        if (!token) {
            navigate('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get(backendUrl + '/api/user/me', {
                    headers: { token }
                })

                if (response.data.success) {
                    setProfile(response.data.user)
                } else {
                    toast.error(response.data.message)
                }
            } catch (error) {
                console.log(error)
                toast.error(error?.response?.data?.message || error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [token])

    // Loading state
    if (loading) {
        return (
            <div className='border-t pt-14'>
                <p className='text-gray-500'>Loading...</p>
            </div>
        )
    }

    // Failed to load
    if (!profile) {
        return (
            <div className='border-t pt-14'>
                <p className='text-gray-500'>Could not load profile.</p>
            </div>
        )
    }

    // Format the member-since date, handling missing createdAt for legacy users
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-6'>
                <Title text1={'MY'} text2={'PROFILE'} />
            </div>

            <div className='max-w-lg flex flex-col gap-5 text-gray-700'>

                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                    <p className='text-sm text-gray-500 sm:w-32'>Name</p>
                    <p className='text-base'>{profile.name}</p>
                </div>

                <hr className='border-gray-100' />

                <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                    <p className='text-sm text-gray-500 sm:w-32'>Email</p>
                    <p className='text-base'>{profile.email}</p>
                </div>

                {memberSince && (
                    <>
                        <hr className='border-gray-100' />
                        <div className='flex flex-col sm:flex-row sm:items-center sm:gap-4'>
                            <p className='text-sm text-gray-500 sm:w-32'>Member since</p>
                            <p className='text-base'>{memberSince}</p>
                        </div>
                    </>
                )}

                <hr className='border-gray-100' />

                <div className='flex gap-3 mt-4'>
                    <button
                        onClick={() => navigate('/orders')}
                        className='px-6 py-2 bg-black text-white text-sm hover:bg-gray-800'
                    >
                        View My Orders
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Profile