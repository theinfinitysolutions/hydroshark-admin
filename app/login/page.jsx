'use client';
import React, { useEffect, useState } from 'react';
import { FieldValues, set, useForm } from 'react-hook-form';
import instance from '@/utils/instance';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import OTPInput from 'react-otp-input';
import useStore from '@/utils/store';
import Spinner from '@/components/Spinner';

const textClass = 'text-[#333]';

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const { setUser, user } = useStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      phone: '',
    },
  });

  const onSubmit = (data) => {
    setLoading(true);
    let obj = {
      phone_number: data.phone,
    };
    instance
      .post('/accounts/send-otp/', obj)
      .then((res) => {
        console.log('res', res);
        setShowOtp(true);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
        setError(err.response.data.message);
      });
  };

  const getUser = () => {
    instance
      .get('/accounts/user/')
      .then((res) => {
        if (res.data.user.is_superuser || res.data.user.is_staff) {
          console.log('res', res);
          setUser(res.data.user);
          router.push('/dashboard');
        } else {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
          throw new Error('You are not authorized to access this page');
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser();
    }
  }, []);

  const handleLogin = () => {
    setLoading(true);
    let obj = {
      phone_number: getValues('phone'),
      otp: otp,
    };

    instance
      .post('/accounts/login/', obj)
      .then((res) => {
        if (res.data.user.is_superuser || res.data.user.is_staff) {
          console.log('res', res);
          localStorage.setItem('token', res.data.access_token);

          setUser(res.data.user);
          router.push('/dashboard');
          setLoading(false);
        } else {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = '/login';
          setLoading(false);
          throw new Error('You are not authorized to access this admin');
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log('err', err);
        setError(err.response.data.message);
      });
  };

  return (
    <div className=' flex flex-col items-center justify-center h-screen w-screen bg-white/80'>
      <div className=' h-screen w-screen absolute z-0'>
        <Image src={process.env.NEXT_PUBLIC_API_URL + '/img9.webp'} fill objectFit='cover' />
      </div>

      <div className=' z-20 flex flex-col items-center justify-center w-6/12 h-[60vh] bg-white border-[0.5px] border-[#c7c7c7]/70 rounded-2xl shadow-xl'>
        <div className=' flex flex-row justify-center items-center'>
          <div className=' h-[7.5vh] w-[7.5vh] relative'>
            <Image src={process.env.NEXT_PUBLIC_API_URL + '/hydroshark.png'} fill alt='hydroshark' />
          </div>
          <p className=' text-4xl text-black ml-4 mt-2 font-medium'>HYDROSHARK ADMIN</p>
        </div>
        <h2 className='text-2xl font-bold text-[#333] mt-4'>Login</h2>
        {showOtp ? (
          <div className=' w-full flex flex-col items-center justify-center mt-4'>
            <label htmlFor='phone' className={`${textClass} my-2`}>
              Verify OTP
            </label>
            <OTPInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              inputType={'number'}
              placeholder='123456'
              inputStyle={{
                width: '40px',
                height: '40px',
                borderWidth: '1px',
                marginRight: 8,
                textAlign: 'center',
                color: '#000000',
              }}
              containerStyle={{}}
              renderInput={(props) => (
                <input
                  autoComplete='off'
                  aria-label='Please enter OTP character 1'
                  className='inputStyle rounded-lg'
                  {...props}
                />
              )}
            />

            <button
              className='px-8 p-2 mt-4 bg-[#333] text-white rounded-md'
              onClick={() => {
                handleLogin();
              }}
            >
              {loading ? <Spinner loading={loading} size={24} color={'#fff'} /> : <p>Verify</p>}
            </button>
          </div>
        ) : (
          <form className='flex flex-col items-center w-8/12 my-2' onSubmit={handleSubmit(onSubmit)}>
            <div className='flex flex-col w-full'>
              <label htmlFor='phone' className={textClass}>
                Phone Number
              </label>
              <input
                type='text'
                id='phone'
                placeholder='Phone Number'
                className='w-full p-2 my-1 text-black border-[0.5px] border-[#c7c7c7] rounded-md'
                {...register('phone', {
                  required: 'Email is required',
                  minLength: {
                    value: 10,
                    message: 'Phone number should be of 10 digits',
                  },
                  maxLength: {
                    value: 10,
                    message: 'Phone number should be of 10 digits',
                  },
                })}
              />
              {errors?.email ? (
                <span className='text-red-500 text-xs'>{errors?.email?.message?.toString() || ''}</span>
              ) : (
                <span className=' text-sm'> </span>
              )}
            </div>

            {error && <p className='text-red-500 text-sm mt-2'>{error}</p>}

            <button type='submit' className='w-full p-2 mt-4 bg-[#333] text-white rounded-md'>
              {loading ? <Spinner loading={loading} size={24} color={'#fff'} /> : <p>Login</p>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
