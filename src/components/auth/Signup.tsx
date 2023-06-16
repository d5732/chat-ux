import React from 'react'

const Signup = () => {
  return (
    <div className='signup-container'>
        <form className='signup-form'>
            <h2>Register</h2>
            <input type='text' placeholder='First name' />
            <input type='text' placeholder='Last name' />
            <input placeholder='Date of birth' type='calendar' />
            <input type='text' placeholder='Enter your email' />
            <button type='submit'>Register With Email</button>
        </form>
    </div>
  )
}

export default Signup