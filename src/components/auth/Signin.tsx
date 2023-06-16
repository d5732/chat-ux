import React from 'react'

const Signin = () => {
  return (
    <div className='sign-in-container'>
        <form className='sign-in-form'>
            <h2>Sign In</h2>
            <input type='text' placeholder='Enter your email' />
            <button type='submit'>Generate Sign In Link</button>
        </form>
    </div>
  )
}

export default Signin
