import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Cookies from 'universal-cookie';
import jwt_decode from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { login } from '../../../app/userSlice';
import { loginstatus } from '../../../app/statusLoginSlice';

const cookies = new Cookies();
const current = new Date();
const nextYear = new Date();
nextYear.setFullYear(current.getFullYear() + 1);

const ConfirmEmailPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // alert(searchParams.get('accessToken'))
  useEffect(() => {
    dispatch(login({
      accessToken: searchParams.get('accessToken'), refreshToken: searchParams.get('refreshToken')
    }))
    dispatch(loginstatus())
    cookies.set("accessToken", searchParams.get('accessToken'), {
      path: '/',
      expires: nextYear,
    });
    const token = jwt_decode(searchParams.get('accessToken'))
    cookies.set("role", token.role, {
      path: '/',
      expires: nextYear,
    });
    localStorage.setItem('refreshToken', searchParams.get('refreshToken'))
    localStorage.setItem('email', token.email)
    localStorage.setItem('fullname', token.fullName)
    localStorage.setItem('image', token.image)
    localStorage.setItem('id', token._id)
    navigate('/register-face', { state: { id: token._id, image: token.image, fullname: token.fullName, email: token.email, role: token.role, accessToken: searchParams.get('accessToken'), refreshToken: searchParams.get('refreshToken') } });
  }, [])

  return (
    <></>
  )
}

export default ConfirmEmailPage
