import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../hooks/apiClient'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'

function AuthCallback() {
  const [status, setStatus] = useState('Processing login...')
  const navigate = useNavigate()
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const hasProcessed = useRef(false);
// const {user,error} = useAuth()
  // useEffect(() => {
  //   if (hasProcessed.current) return;
  //   hasProcessed.current = true;

  //   // Supabase automatically handles the callback when detectSessionInUrl is true
  //   // We just need to wait and redirect

  //   try {
  //     const handleCallback = async () => {
  //       const { data: { session }, error } = await supabase.auth.getSession()
       
  //       if (error) {
  //         setStatus('Login failed: ' + error.message)
  //         navigate('/login')
  //         return
  //       }

  //       if (session) {

  //         // console.log(session)
  //         apiClient.post(`/api/v1/auth/set-token`, {
  //           accessToken: session.access_token,
  //           refreshToken: session.refresh_token,
  //         }, {
  //           withCredentials: true
  //         }).then((res) => {
  //           console.log(res.data.data)
            
  //         }).catch((err: any) => {
  //           toast.error('Session configuration failed');
  //           console.error("Error setting token", err.message)
  //           return
  //         })

         



  //       } else {
  //         setStatus('No session found')
  //       }
  //     }

  //     handleCallback()
  //   } catch (error: any) {
  //     toast.error('Authentication process failed. Try again.');
  //     if (error.response?.status === 500) {
  //       navigate('/')
  //     }
  //   }

  // }, [])
// Inside your login callback component (which has access to useAuth)
const { fetchProfile,login,loading } = useAuth();

useEffect(() => {
  if (hasProcessed.current) return;
  hasProcessed.current = true;

  const handleCallback = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      setStatus('Login failed: ' + error.message);
      navigate('/login');
      return;
    }

    if (session) {
      try {
        // console.log("sending token request to backend")
       await login(session.access_token,session.refresh_token)
       navigate('/')
      } catch (err: any) {
        toast.error('Session configuration failed');
        console.error(err);
        setStatus('Login failed. Please try again.');
        navigate('/login');
      }
    } else {
      setStatus('No session found');
      navigate('/login');
    }
  };

  handleCallback().catch(err => {
    console.error(err);
    toast.error('Authentication process failed. Try again.');
    navigate('/login');
  });
}, [fetchProfile, navigate]);
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>{status}</h2>
    </div>
  )
}

export default AuthCallback